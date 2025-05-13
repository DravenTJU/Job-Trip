const { describe, test, expect, beforeEach, afterEach } = require('@jest/globals');
const { setupTestEnvironment, teardownTestEnvironment } = require('./setup.js');

// Mock dependencies
const mockInitializeSidePanel = jest.fn();
jest.mock('../src/services/sidePanelService.js', () => ({
    initialize: mockInitializeSidePanel,
}));

const mockGetBaseUrl = jest.fn();
jest.mock('../src/config/config.js', () => ({
    getBaseUrl: mockGetBaseUrl,
}));

// Mock Chrome APIs more specifically for background script needs
const mockOnInstalledAddListener = jest.fn((callback) => callback()); // Immediately invoke listener
const mockOnClickedAddListener = jest.fn();
const mockOnMessageAddListener = jest.fn();
const mockTabsCreate = jest.fn().mockResolvedValue({ id: 1 });
const mockTabsQuery = jest.fn();
const mockTabsSendMessage = jest.fn();
const mockSidePanelSetPanelBehavior = jest.fn().mockResolvedValue(); // Chainable needs resolve
const mockSidePanelOpen = jest.fn();
const mockFetch = jest.fn();

global.fetch = mockFetch; // Mock global fetch

global.chrome = {
    runtime: {
        onInstalled: { addListener: mockOnInstalledAddListener },
        onMessage: { addListener: mockOnMessageAddListener },
        sendMessage: jest.fn(), // Mock if background needs to send messages
        getURL: (path) => path,
        lastError: null, // Ensure lastError is available
    },
    action: {
        onClicked: { addListener: mockOnClickedAddListener },
        setIcon: jest.fn(), // Mock if used
    },
    tabs: {
        create: mockTabsCreate,
        query: mockTabsQuery,
        sendMessage: mockTabsSendMessage,
        onUpdated: { addListener: jest.fn() }, // Mock if needed
        onRemoved: { addListener: jest.fn() }, // Mock if needed
    },
    sidePanel: {
        setPanelBehavior: mockSidePanelSetPanelBehavior,
        open: mockSidePanelOpen,
        setOptions: jest.fn(), // Mock if used by sidePanelService
    },
    storage: {
        local: {
            get: jest.fn().mockResolvedValue({}),
            set: jest.fn().mockResolvedValue(),
            remove: jest.fn().mockResolvedValue(),
            clear: jest.fn().mockResolvedValue(),
        },
        session: {
            get: jest.fn().mockResolvedValue({}),
            set: jest.fn().mockResolvedValue(),
            remove: jest.fn().mockResolvedValue(),
            clear: jest.fn().mockResolvedValue(),
        },
        sync: {
            get: jest.fn().mockResolvedValue({}),
            set: jest.fn().mockResolvedValue(),
            remove: jest.fn().mockResolvedValue(),
            clear: jest.fn().mockResolvedValue(),
        }
    },
    windows: {
        create: jest.fn(),
        update: jest.fn(),
        getAll: jest.fn(),
        getCurrent: jest.fn(),
    },
    scripting: {
        executeScript: jest.fn(),
    }
};

// Import the background script AFTER mocks are set up
// This ensures it uses the mocked APIs when it runs.
// require('../background.js'); // Moved to beforeEach

describe('Background Script Logic', () => {
    let messageListenerCallback;
    let onClickedListenerCallback;
    let installedListenerCallback; // To capture onInstalled listener

    beforeEach(() => {
        // Clear mocks before each test
        jest.clearAllMocks();
        jest.resetModules(); // Reset modules to ensure fresh require

        // Re-apply mocks for Chrome API parts that background.js uses directly
        // This is important because jest.resetModules() also clears our global.chrome mocks if not careful
        // Or, better, ensure global.chrome is robustly defined once outside and not reset by resetModules if it is truly global.
        // For simplicity here, we redefine parts of it or ensure mocks are correctly set up before require.

        // Mock listener registration functions to capture callbacks
        global.chrome.runtime.onInstalled.addListener = jest.fn(cb => { installedListenerCallback = cb; });
        global.chrome.action.onClicked.addListener = jest.fn(cb => { onClickedListenerCallback = cb; });
        global.chrome.runtime.onMessage.addListener = jest.fn(cb => { messageListenerCallback = cb; });
        global.chrome.sidePanel.setPanelBehavior = mockSidePanelSetPanelBehavior.mockResolvedValue(); // Ensure chainable is reset

        // Reset specific mock implementations or return values for services/fetch for this test run
        mockInitializeSidePanel.mockClear(); // ensure this is clean before test
        mockGetBaseUrl.mockResolvedValue('http://mockurl.com');
        mockFetch.mockResolvedValue({ ok: true, text: () => Promise.resolve('<html></html>') });
        mockTabsQuery.mockImplementation((queryInfo, callback) => {
            callback([{ id: 123, url: 'http://example.com' }]);
        });
        mockTabsSendMessage.mockImplementation((tabId, message, callback) => {
             if (callback) callback({ success: true });
        });

        // Now require background.js so it registers its listeners using our fresh mocks
        require('../background.js');

        // Immediately call the captured installed listener as it's async in background.js
        // and its original mock was (cb) => cb() which might be too simplistic for async callbacks.
        if (installedListenerCallback) {
            // Simulating the async nature of the onInstalled listener if necessary
            // For now, direct call is fine as the mock for sidePanelService.initialize is sync.
            installedListenerCallback(); 
        }
    });

    test('onInstalled listener should initialize side panel service', async () => {
        // await new Promise(process.nextTick); // Allow async onInstalled to complete if it was truly async
        expect(mockInitializeSidePanel).toHaveBeenCalledTimes(1);
    });

    test('action.onClicked listener should open side panel', () => {
        const mockTab = { id: 456 };
        // Simulate the click event by invoking the captured listener
        if(onClickedListenerCallback) {
            onClickedListenerCallback(mockTab);
            expect(mockSidePanelOpen).toHaveBeenCalledWith({ tabId: mockTab.id });
        } else {
            throw new Error('onClicked listener not captured');
        }
    });

    describe('onMessage Listener', () => {
        
        // Helper function to simulate message sending
        const simulateMessage = (request, sender = { id: 'test-sender' }) => {
            const sendResponse = jest.fn();
            // Invoke the listener
            if (!messageListenerCallback) throw new Error('messageListenerCallback not found');
            const asyncResponse = messageListenerCallback(request, sender, sendResponse);
            // Return necessary info for async checks
            return { sendResponse, asyncResponse }; 
        };

        test('should handle getBaseUrl request successfully', async () => {
            mockGetBaseUrl.mockResolvedValue('http://test.com/api/');
            const { sendResponse, asyncResponse } = simulateMessage({ action: 'getBaseUrl' });
            
            expect(asyncResponse).toBe(true); // Expecting async response
            await Promise.resolve(); // Allow promise to resolve

            expect(mockGetBaseUrl).toHaveBeenCalled();
            expect(sendResponse).toHaveBeenCalledWith('http://test.com/api'); // Should remove trailing slash
        });
        
        test('should handle getBaseUrl request with error and return default', async () => {
            mockGetBaseUrl.mockRejectedValue(new Error('Config error'));
            const { sendResponse, asyncResponse } = simulateMessage({ action: 'getBaseUrl' });

            expect(asyncResponse).toBe(true); // Expecting async response
            await new Promise(process.nextTick); // More robust wait for promise rejection and catch block
            
            expect(mockGetBaseUrl).toHaveBeenCalled();
            expect(sendResponse).toHaveBeenCalledWith('https://jobtrip.me'); // Default URL
        });

        test('should handle openJobSites for Australia', () => {
            const location = 'Sydney, NSW, Australia';
            const { sendResponse } = simulateMessage({ action: 'openJobSites', location: location });

            expect(mockTabsCreate).toHaveBeenCalledWith({ 
                url: expect.stringContaining('linkedin.com'), 
                active: true 
            });
            expect(mockTabsCreate).toHaveBeenCalledWith({ 
                url: expect.stringContaining('seek.com.au'), 
                active: true 
            });
            expect(mockTabsCreate).toHaveBeenCalledWith({ 
                url: expect.stringContaining('au.indeed.com'), 
                active: true 
            });
            expect(mockTabsCreate).toHaveBeenCalledTimes(3);
            expect(sendResponse).toHaveBeenCalledWith({ success: true });
        });
        
        test('should handle openJobSites for New Zealand', () => {
            const location = 'Auckland, New Zealand';
            simulateMessage({ action: 'openJobSites', location: location });
            expect(mockTabsCreate).toHaveBeenCalledWith({ url: expect.stringContaining('seek.co.nz'), active: true });
            expect(mockTabsCreate).toHaveBeenCalledWith({ url: expect.stringContaining('nz.indeed.com'), active: true });
             expect(mockTabsCreate).toHaveBeenCalledTimes(3); // LinkedIn + Seek NZ + Indeed NZ
        });
        
        test('should handle openJobSites for USA', () => {
            const location = 'New York, NY, United States';
            simulateMessage({ action: 'openJobSites', location: location });
             expect(mockTabsCreate).toHaveBeenCalledWith({ url: expect.stringContaining('www.indeed.com'), active: true });
             expect(mockTabsCreate).not.toHaveBeenCalledWith({ url: expect.stringContaining('seek.'), active: true });
             expect(mockTabsCreate).toHaveBeenCalledTimes(2); // LinkedIn + Indeed US (generic)
        });

        test('should handle startScraping by sending message to active tab', async () => {
            const { sendResponse, asyncResponse } = simulateMessage({ action: 'startScraping' });
            
            expect(mockTabsQuery).toHaveBeenCalledWith({ active: true, currentWindow: true }, expect.any(Function));
            await Promise.resolve(); // Allow query callback to execute
            expect(mockTabsSendMessage).toHaveBeenCalledWith(123, { action: 'scrapeJobs' }, expect.any(Function));
            
            expect(asyncResponse).toBe(true);
            // Simulate response from content script if needed for sendResponse check
            // await Promise.resolve(); // Wait for sendMessage callback
            // expect(sendResponse).toHaveBeenCalledWith({ success: true }); // Depends on mockTabsSendMessage implementation
        });

         test('should handle scrapeJobDetail by sending message to active tab', async () => {
            const { sendResponse, asyncResponse } = simulateMessage({ action: 'scrapeJobDetail' });
            
            expect(mockTabsQuery).toHaveBeenCalledWith({ active: true, currentWindow: true }, expect.any(Function));
            await Promise.resolve(); 
            expect(mockTabsSendMessage).toHaveBeenCalledWith(123, { action: 'scrapeJobDetail' }, expect.any(Function));
            expect(asyncResponse).toBe(true);
        });

        test('should handle fetchJobDetail successfully', async () => {
            const testUrl = 'http://detail.com/job/1';
            const mockHtml = '<body>Mock Job Detail</body>';
            mockFetch.mockResolvedValueOnce({ ok: true, text: () => Promise.resolve(mockHtml) });
            const { sendResponse, asyncResponse } = simulateMessage({ action: 'fetchJobDetail', url: testUrl });

            expect(asyncResponse).toBe(true);
            expect(mockFetch).toHaveBeenCalledWith(testUrl);
            await new Promise(process.nextTick); // Ensure fetch promise resolves
            
            expect(sendResponse).toHaveBeenCalledWith({ html: mockHtml });
        });
        
        test('should handle fetchJobDetail with fetch error', async () => {
            const testUrl = 'http://detail.com/job/2';
            const errorMsg = 'Network Error';
            mockFetch.mockRejectedValueOnce(new Error(errorMsg));
            const { sendResponse, asyncResponse } = simulateMessage({ action: 'fetchJobDetail', url: testUrl });

            expect(asyncResponse).toBe(true);
            expect(mockFetch).toHaveBeenCalledWith(testUrl);
            await new Promise(process.nextTick); // Ensure fetch promise rejects
            
            expect(sendResponse).toHaveBeenCalledWith({ error: errorMsg });
        });
    });
}); 