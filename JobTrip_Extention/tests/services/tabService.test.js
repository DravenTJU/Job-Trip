const { describe, test, expect, beforeEach } = require('@jest/globals');
const tabService = require('../../src/services/tabService').default;
const endpoints = require('../../src/config/endpoints').default;

// Mock endpoints module
jest.mock('../../src/config/endpoints', () => ({
  __esModule: true, // This is important for ES modules
  default: {
    detectEnvironment: jest.fn(),
  },
}));

// Mock chrome APIs
global.chrome = {
  tabs: {
    query: jest.fn(),
    create: jest.fn(),
    onUpdated: {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    },
  },
  runtime: {
    sendMessage: jest.fn(),
    getManifest: jest.fn().mockReturnValue({ manifest_version: 3 }), // Mock getManifest
    onMessage: { // Added for completeness though not directly used by tabService
        addListener: jest.fn(),
        removeListener: jest.fn()
    }
  },
  windows: {
    getCurrent: jest.fn(),
    update: jest.fn(),
  },
  // storage and scripting might not be directly needed by tabService but good to have for consistency
  storage: {
    local: { get: jest.fn(), set: jest.fn().mockResolvedValue(undefined) },
    sync: { get: jest.fn(), set: jest.fn().mockResolvedValue(undefined) },
  },
  scripting: {
    executeScript: jest.fn(),
  },
};

describe('tabService', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks(); // Clears all mock usage data and mock implementations

    // Default mock implementations for dependencies
    endpoints.detectEnvironment.mockResolvedValue({
      FRONTEND: {
        jobtrip_URL: 'http://jobtrip.com'
      }
    });
    chrome.runtime.getManifest.mockReturnValue({ manifest_version: 3 });
    chrome.runtime.sendMessage.mockResolvedValue('http://jobtrip.com'); // For getBaseUrl
    chrome.tabs.create.mockResolvedValue({ id: 99, url: 'http://jobtrip.com/login' });
    chrome.windows.getCurrent.mockImplementation(callback => callback({ id: 101 }));
    chrome.windows.update.mockResolvedValue({});

    // Mock for chrome.tabs.onUpdated.addListener to immediately call the listener
    // This needs careful setup for different scenarios in ensurejobtripWebsite
    // For now, a simple mock that can be overridden in specific tests.
    chrome.tabs.onUpdated.addListener.mockImplementation((listener) => {
      // Store listener to be called manually or simulate call
      // This basic mock might need to be more sophisticated for complex scenarios
    });
    chrome.tabs.onUpdated.removeListener.mockImplementation(() => {}); 
  });

  describe('findjobtripTab', () => {
    test('should return the tab if a jobtrip tab exists', async () => {
      const mockTabs = [
        { id: 1, url: 'http://otherexample.com' },
        { id: 2, url: 'http://jobtrip.com/home' },
        { id: 3, url: 'http://anothertab.com' },
      ];
      chrome.tabs.query.mockResolvedValue(mockTabs);
      const tab = await tabService.findjobtripTab();
      expect(tab).toEqual(mockTabs[1]);
      expect(endpoints.detectEnvironment).toHaveBeenCalled();
      expect(chrome.tabs.query).toHaveBeenCalledWith({});
    });

    test('should return undefined if no jobtrip tab exists', async () => {
      const mockTabs = [
        { id: 1, url: 'http://otherexample.com' },
        { id: 3, url: 'http://anothertab.com' },
      ];
      chrome.tabs.query.mockResolvedValue(mockTabs);
      const tab = await tabService.findjobtripTab();
      expect(tab).toBeUndefined();
    });

    test('should return undefined if tabs have no URL property', async () => {
      const mockTabs = [
        { id: 1 }, // Tab without URL
        { id: 2, url: 'http://jobtrip.com/home' }
      ];
      chrome.tabs.query.mockResolvedValue(mockTabs);
      // Simulate detectEnvironment for this specific case if not covered by beforeEach default
      endpoints.detectEnvironment.mockResolvedValue({ FRONTEND: { jobtrip_URL: 'jobtrip.com' } });
      const tab = await tabService.findjobtripTab();
      expect(tab).toEqual(mockTabs[1]); // Should still find the one with the URL
    });

    test('should handle empty tabs array from chrome.tabs.query', async () => {
      chrome.tabs.query.mockResolvedValue([]);
      const tab = await tabService.findjobtripTab();
      expect(tab).toBeUndefined();
    });
  });

  describe('ensurejobtripWebsite', () => {
    test('should return existing tab if found', async () => {
      const existingJobtripTab = { id: 2, url: 'http://jobtrip.com/home' };
      endpoints.detectEnvironment.mockResolvedValue({ FRONTEND: { jobtrip_URL: 'jobtrip.com' } });
      chrome.tabs.query.mockResolvedValue([existingJobtripTab, {id: 1, url: 'http://other.com'}]);
      
      const tab = await tabService.ensurejobtripWebsite();
      expect(tab).toEqual(existingJobtripTab);
      expect(chrome.tabs.create).not.toHaveBeenCalled();
    });

    test('should create, load, and return new tab if no existing tab is found', async () => {
      jest.useFakeTimers();
      chrome.tabs.query.mockResolvedValue([]); 
      const newTabId = 99;
      const newTabUrl = 'http://jobtrip.com/login';
      // chrome.runtime.sendMessage is mocked in beforeEach
      // chrome.tabs.create is mocked in beforeEach and returns { id: 99, ... } by default
      // We can rely on beforeEach mocks or re-specify if needed for clarity for this test.
      // For instance, if newTabId needs to be different from default mock for some reason.
      // Here, newTabId = 99 matches the beforeEach mock, so it's fine.

      let onUpdatedListener;
      const listenerSetupPromise = new Promise(resolve => {
        chrome.tabs.onUpdated.addListener.mockImplementation((listener) => {
          onUpdatedListener = listener;
          resolve(); 
        });
      });
      // chrome.windows.getCurrent and chrome.windows.update are mocked in beforeEach.

      const promise = tabService.ensurejobtripWebsite(true);
      await listenerSetupPromise; // Wait for addListener to be called from within ensurejobtripWebsite

      expect(onUpdatedListener).toBeDefined(); // This should now pass
      onUpdatedListener(newTabId, { status: 'complete' }); // Simulate tab loading completion
      
      // The tabService code has an inner setTimeout(..., 1000) before resolving the main promise
      // when a new tab is created and loaded.
      jest.advanceTimersByTime(1000); // Advance this inner timer

      const tab = await promise; // Now await the main promise from ensurejobtripWebsite

      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({ action: 'getBaseUrl' });
      expect(chrome.tabs.create).toHaveBeenCalledWith({ url: newTabUrl, active: true });
      expect(tab.id).toBe(newTabId);
      expect(chrome.tabs.onUpdated.removeListener).toHaveBeenCalledWith(onUpdatedListener);
      expect(chrome.windows.getCurrent).toHaveBeenCalled();
      expect(chrome.windows.update).toHaveBeenCalledWith(101, { focused: true }); // 101 is from beforeEach mock
      
      jest.useRealTimers();
    });

    test('should create new tab and not focus popup if shouldFocusPopup is false', async () => {
      jest.useFakeTimers();
      chrome.tabs.query.mockResolvedValue([]); 
      const newTabId = 100;
      // Override the default create mock if we need a different ID, like 100 here.
      chrome.tabs.create.mockResolvedValue({ id: newTabId, url: 'http://jobtrip.com/login' });

      let onUpdatedListener;
      const listenerSetupPromise = new Promise(resolve => {
        chrome.tabs.onUpdated.addListener.mockImplementation((listener) => {
          onUpdatedListener = listener;
          resolve();
        });
      });

      const promise = tabService.ensurejobtripWebsite(false); // shouldFocusPopup = false

      await listenerSetupPromise; 
      expect(onUpdatedListener).toBeDefined();
      onUpdatedListener(newTabId, { status: 'complete' });
      
      // The 1000ms setTimeout for resolving the promise is still present in the original code,
      // even if shouldFocusPopup is false. The check for shouldFocusPopup happens *inside* that timeout.
      jest.advanceTimersByTime(1000);

      const tab = await promise;

      expect(tab.id).toBe(newTabId);
      expect(chrome.tabs.create).toHaveBeenCalledWith({ url: 'http://jobtrip.com/login', active: true});
      expect(chrome.tabs.onUpdated.removeListener).toHaveBeenCalledWith(onUpdatedListener);
      expect(chrome.windows.getCurrent).not.toHaveBeenCalled();
      expect(chrome.windows.update).not.toHaveBeenCalled();
      
      jest.useRealTimers();
    });

    test('should throw error if getBaseUrl returns undefined', async () => {
      chrome.tabs.query.mockResolvedValue([]);
      chrome.runtime.sendMessage.mockResolvedValue(undefined); 

      await expect(tabService.ensurejobtripWebsite()).rejects.toThrow('Failed to get jobtrip URL - base URL is undefined');
      expect(chrome.tabs.create).not.toHaveBeenCalled();
    });
    
    test('should handle timeout when waiting for tab to load', async () => {
      jest.useFakeTimers();
      chrome.tabs.query.mockResolvedValue([]);
      // chrome.runtime.sendMessage.mockResolvedValue('http://jobtrip.com'); // From beforeEach
      const newTabId = 101;
      chrome.tabs.create.mockResolvedValue({ id: newTabId, url: 'http://jobtrip.com/login' });

      let onUpdatedListenerFunction;
      const listenerSetupPromise = new Promise(resolve => {
        chrome.tabs.onUpdated.addListener.mockImplementation((listenerCallback) => {
          onUpdatedListenerFunction = listenerCallback; 
          resolve(); 
        });
      });

      const promise = tabService.ensurejobtripWebsite();
      await listenerSetupPromise; // Ensure listener is captured
      
      // At this point, onUpdatedListenerFunction is the actual listener function from tabService.
      // We do *not* call it with { status: 'complete' } because we are testing the timeout scenario.

      // Advance timers past the 10-second timeout in ensurejobtripWebsite
      jest.advanceTimersByTime(10000);

      await expect(promise).rejects.toThrow('Timeout waiting for tab to load');
      // The listener passed to removeListener should be the same one passed to addListener.
      expect(chrome.tabs.onUpdated.removeListener).toHaveBeenCalledWith(onUpdatedListenerFunction);
      
      jest.useRealTimers();
    });

  });
}); 