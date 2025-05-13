const { describe, test, expect, beforeEach } = require('@jest/globals');
const storageService = require('../../src/services/storageService').default;
const endpoints = require('../../src/config/endpoints').default;

// Mock endpoints module
jest.mock('../../src/config/endpoints', () => ({
  __esModule: true, // This is important for ES modules
  default: {
    detectEnvironment: jest.fn(),
  },
}));

// Mock chrome APIs
// ... existing chrome mock ...

// Mock chrome.storage.local
global.chrome = {
  storage: {
    local: {
      get: jest.fn(),
      set: jest.fn().mockResolvedValue(undefined), // Mock set to resolve immediately
    },
    sync: {
      get: jest.fn(),
      set: jest.fn().mockResolvedValue(undefined),
    }
  },
  tabs: {
    query: jest.fn(),
  },
  scripting: {
    executeScript: jest.fn(),
  },
  runtime: { // Added for completeness, in case any other part of chrome API is touched
    lastError: undefined,
    onMessage: {addListener: jest.fn(), removeListener: jest.fn()},
    sendMessage: jest.fn()
  }
};

describe('storageService', () => {
  beforeEach(() => {
    // Reset mocks before each test
    chrome.storage.local.get.mockReset();
    chrome.storage.local.set.mockReset();
    chrome.storage.sync.get.mockReset();
    chrome.storage.sync.set.mockReset();
    chrome.tabs.query.mockReset();
    chrome.scripting.executeScript.mockReset();
    endpoints.detectEnvironment.mockReset();

    // Default mock implementations
    chrome.storage.local.set.mockResolvedValue(undefined);
    chrome.storage.sync.set.mockResolvedValue(undefined);
    // Mock default environment for endpoints
    endpoints.detectEnvironment.mockResolvedValue({
      FRONTEND: {
        jobtrip_URL: 'http://localhost:3000',
        TOKEN_KEY: 'userToken'
      }
    });
  });

  describe('loadLastLocation', () => {
    test('should return lastLocation if it exists', async () => {
      const mockLocation = 'New York, NY, USA';
      chrome.storage.local.get.mockImplementation((keys, callback) => {
        callback({ lastLocation: mockLocation, lastCountry: 'USA' });
      });
      const location = await storageService.loadLastLocation();
      expect(location).toBe(mockLocation);
      expect(chrome.storage.local.get).toHaveBeenCalledWith(['lastLocation', 'lastCountry'], expect.any(Function));
    });

    test('should return null if lastLocation does not exist', async () => {
      chrome.storage.local.get.mockImplementation((keys, callback) => {
        callback({});
      });
      const location = await storageService.loadLastLocation();
      expect(location).toBeNull();
      expect(chrome.storage.local.get).toHaveBeenCalledWith(['lastLocation', 'lastCountry'], expect.any(Function));
    });
  });

  describe('saveLastLocation', () => {
    test('should save the location and extract country', async () => {
      const location = 'London, England, UK';
      await storageService.saveLastLocation(location);
      expect(chrome.storage.local.set).toHaveBeenCalledWith({
        lastLocation: location,
        lastCountry: 'UK',
      });
    });

    test('should save the location and handle locations without comma-separated country', async () => {
      const location = 'Paris'; // No comma, country part is the location itself
      await storageService.saveLastLocation(location);
      expect(chrome.storage.local.set).toHaveBeenCalledWith({
        lastLocation: location,
        lastCountry: 'Paris', // If no comma, it takes the whole string
      });
    });
  });

  describe('loadLastCountry', () => {
    test('should return lastCountry if it exists', async () => {
      const mockCountry = 'USA';
      chrome.storage.local.get.mockImplementation((keys, callback) => {
        callback({ lastCountry: mockCountry });
      });
      const country = await storageService.loadLastCountry();
      expect(country).toBe(mockCountry);
      expect(chrome.storage.local.get).toHaveBeenCalledWith(['lastCountry'], expect.any(Function));
    });

    test('should return null if lastCountry does not exist', async () => {
      chrome.storage.local.get.mockImplementation((keys, callback) => {
        callback({});
      });
      const country = await storageService.loadLastCountry();
      expect(country).toBeNull();
      expect(chrome.storage.local.get).toHaveBeenCalledWith(['lastCountry'], expect.any(Function));
    });
  });

  describe('saveLastCountry', () => {
    test('should save the country directly', async () => {
      const country = 'UK';
      await storageService.saveLastCountry(country);
      expect(chrome.storage.local.set).toHaveBeenCalledWith({
        lastCountry: country,
      });
    });
  });

  describe('loadWebsiteSettings', () => {
    test('should return websiteSettings if they exist', async () => {
      const mockSettings = { 'example.com': true };
      chrome.storage.sync.get.mockImplementation((key, callback) => {
        // The actual implementation returns a promise, but our mock directly calls back for simplicity
        // or can be adjusted if storageService expects a Promise for get.
        // For now, assuming it awaits a promise that resolves with the object.
        // Let's adjust the mock if storage.sync.get is directly awaited upon like a promise.
        // Based on the source code: const settings = await chrome.storage.sync.get('websiteSettings')
        // It implies chrome.storage.sync.get returns a Promise.
        return Promise.resolve({ websiteSettings: mockSettings });
      });
      const settings = await storageService.loadWebsiteSettings();
      expect(settings).toEqual(mockSettings);
      expect(chrome.storage.sync.get).toHaveBeenCalledWith('websiteSettings');
    });

    test('should return an empty object if websiteSettings do not exist', async () => {
      chrome.storage.sync.get.mockResolvedValue({}); // Mock get to resolve with an empty object
      const settings = await storageService.loadWebsiteSettings();
      expect(settings).toEqual({});
      expect(chrome.storage.sync.get).toHaveBeenCalledWith('websiteSettings');
    });
  });

  describe('saveWebsiteSettings', () => {
    test('should save the website settings', async () => {
      const newSettings = { 'another.com': false };
      await storageService.saveWebsiteSettings(newSettings);
      expect(chrome.storage.sync.set).toHaveBeenCalledWith({ websiteSettings: newSettings });
    });
  });

  describe('updateScrapingState', () => {
    test('should save the scraping state to local storage', async () => {
      const isActive = true;
      await storageService.updateScrapingState(isActive);
      expect(chrome.storage.local.set).toHaveBeenCalledWith({ isScrapingActive: isActive });
    });

    test('should save false scraping state to local storage', async () => {
      const isActive = false;
      await storageService.updateScrapingState(isActive);
      expect(chrome.storage.local.set).toHaveBeenCalledWith({ isScrapingActive: isActive });
    });
  });

  describe('getUserToken', () => {
    test('should return token if tab URL matches and token exists in localStorage', async () => {
      const mockToken = 'test-token';
      endpoints.detectEnvironment.mockResolvedValue({
        FRONTEND: { jobtrip_URL: 'example.com', TOKEN_KEY: 'myTokenKey' },
      });
      chrome.tabs.query.mockImplementation((queryInfo, callback) => {
        callback([{ id: 1, url: 'http://example.com/page' }]);
      });
      chrome.scripting.executeScript.mockImplementation((details, callback) => {
        // Simulate the execution of the script that gets item from localStorage
        // The actual function is (tokenKey) => localStorage.getItem(tokenKey)
        // We mock its result based on args
        if (details.args[0] === 'myTokenKey') {
          callback([{ result: mockToken }]);
        }
      });

      const token = await storageService.getUserToken();
      expect(token).toBe(mockToken);
      expect(endpoints.detectEnvironment).toHaveBeenCalled();
      expect(chrome.tabs.query).toHaveBeenCalledWith({ active: true, currentWindow: true }, expect.any(Function));
      expect(chrome.scripting.executeScript).toHaveBeenCalledWith(
        {
          target: { tabId: 1 },
          function: expect.any(Function),
          args: ['myTokenKey'],
        },
        expect.any(Function)
      );
    });

    test('should return null if tab URL does not match', async () => {
      endpoints.detectEnvironment.mockResolvedValue({
        FRONTEND: { jobtrip_URL: 'another.com', TOKEN_KEY: 'myTokenKey' },
      });
      chrome.tabs.query.mockImplementation((queryInfo, callback) => {
        callback([{ id: 1, url: 'http://example.com/page' }]);
      });

      const token = await storageService.getUserToken();
      expect(token).toBeNull();
      expect(chrome.scripting.executeScript).not.toHaveBeenCalled();
    });

    test('should return null if no active tab', async () => {
      chrome.tabs.query.mockImplementation((queryInfo, callback) => {
        callback([]); // No tabs returned
      });

      const token = await storageService.getUserToken();
      expect(token).toBeNull();
      expect(chrome.scripting.executeScript).not.toHaveBeenCalled();
    });

    test('should return null if token does not exist in localStorage', async () => {
      endpoints.detectEnvironment.mockResolvedValue({
        FRONTEND: { jobtrip_URL: 'example.com', TOKEN_KEY: 'myTokenKey' },
      });
      chrome.tabs.query.mockImplementation((queryInfo, callback) => {
        callback([{ id: 1, url: 'http://example.com/page' }]);
      });
      chrome.scripting.executeScript.mockImplementation((details, callback) => {
        callback([{ result: null }]); // localStorage.getItem returns null
      });

      const token = await storageService.getUserToken();
      expect(token).toBeNull();
    });

     test('should return null if executeScript yields no results', async () => {
      endpoints.detectEnvironment.mockResolvedValue({
        FRONTEND: { jobtrip_URL: 'example.com', TOKEN_KEY: 'myTokenKey' },
      });
      chrome.tabs.query.mockImplementation((queryInfo, callback) => {
        callback([{ id: 1, url: 'http://example.com/page' }]);
      });
      chrome.scripting.executeScript.mockImplementation((details, callback) => {
        callback(null); // executeScript error or no result array
      });

      const token = await storageService.getUserToken();
      expect(token).toBeNull();
    });

    test('should return null if executeScript results array is empty', async () => {
      endpoints.detectEnvironment.mockResolvedValue({
        FRONTEND: { jobtrip_URL: 'example.com', TOKEN_KEY: 'myTokenKey' },
      });
      chrome.tabs.query.mockImplementation((queryInfo, callback) => {
        callback([{ id: 1, url: 'http://example.com/page' }]);
      });
      chrome.scripting.executeScript.mockImplementation((details, callback) => {
        callback([]); // Empty results array
      });

      const token = await storageService.getUserToken();
      expect(token).toBeNull();
    });

    test('should return null if executeScript result object is undefined', async () => {
      endpoints.detectEnvironment.mockResolvedValue({
        FRONTEND: { jobtrip_URL: 'example.com', TOKEN_KEY: 'myTokenKey' },
      });
      chrome.tabs.query.mockImplementation((queryInfo, callback) => {
        callback([{ id: 1, url: 'http://example.com/page' }]);
      });
      chrome.scripting.executeScript.mockImplementation((details, callback) => {
        callback([undefined]); // Result object is undefined
      });

      const token = await storageService.getUserToken();
      expect(token).toBeNull();
    });
  });
}); 