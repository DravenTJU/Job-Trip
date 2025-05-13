import sidePanelService from '../../src/services/sidePanelService.js';

// Mock Chrome APIs
const mockSidePanelOpen = jest.fn().mockResolvedValue(undefined);
const mockOnMessageAddListener = jest.fn();

global.chrome = {
    runtime: {
        onMessage: {
            addListener: mockOnMessageAddListener,
            removeListener: jest.fn(), // Just in case
        },
        sendMessage: jest.fn(),
        id: 'test-extension-id',
    },
    sidePanel: {
        open: mockSidePanelOpen,
        setOptions: jest.fn(),
        getOptions: jest.fn(),
        setPanelBehavior: jest.fn(),
    },
    // Add other chrome API mocks if needed by the service or its imports
};

describe('SidePanelService', () => {
    let onMessageCallback = null;

    beforeEach(() => {
        // Reset mocks and captured callbacks before each test
        jest.clearAllMocks();
        
        // Capture the callback passed to onMessage.addListener
        // The service adds its listener when it's imported/constructed, or when initialize is called.
        // If sidePanelService is a singleton and adds listener on construction (which it is), 
        // we might need to reset modules or re-import for a clean slate or ensure initialize is called.
        
        // For this service, initialize() sets up the listener.
        // We will call initialize() in tests where the listener is relevant.
        onMessageCallback = null; // Reset explicitly
        mockOnMessageAddListener.mockImplementation(callback => {
            onMessageCallback = callback;
        });
    });

    describe('initialize', () => {
        test('should set up message listeners', () => {
            sidePanelService.initialize();
            expect(mockOnMessageAddListener).toHaveBeenCalledTimes(1);
            expect(onMessageCallback).toBeInstanceOf(Function);
        });

        test('message listener should handle "sidePanelLoaded" action', () => {
            sidePanelService.initialize(); // Ensure listener is set up
            expect(onMessageCallback).not.toBeNull();

            const mockSendResponse = jest.fn();
            const message = { action: 'sidePanelLoaded' };
            const sender = { id: 'test-sender' };

            // Simulate message being received
            const returnValue = onMessageCallback(message, sender, mockSendResponse);

            expect(mockSendResponse).toHaveBeenCalledWith({ success: true });
            // Based on typical Chrome extension message handling, it might return true for async sendResponse
            // If it doesn't, this test might need adjustment or the return value might be undefined.
            // For now, we won't assert returnValue unless there's a specific need/behavior in the service.
        });

        test('message listener should ignore other actions', () => {
            sidePanelService.initialize();
            expect(onMessageCallback).not.toBeNull();

            const mockSendResponse = jest.fn();
            const message = { action: 'otherAction' };
            const sender = { id: 'test-sender' };

            onMessageCallback(message, sender, mockSendResponse);

            expect(mockSendResponse).not.toHaveBeenCalled();
        });
    });

    describe('openSidePanel', () => {
        test('should call chrome.sidePanel.open with tabId if provided', () => {
            const tabId = 123;
            sidePanelService.openSidePanel(tabId);
            expect(mockSidePanelOpen).toHaveBeenCalledWith({ tabId });
        });

        test('should not call chrome.sidePanel.open if tabId is not provided', () => {
            // Spy on console.error
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            
            sidePanelService.openSidePanel(null); // or undefined
            expect(mockSidePanelOpen).not.toHaveBeenCalled();
            expect(consoleErrorSpy).toHaveBeenCalledWith('Cannot open side panel: No tab ID provided');
            
            consoleErrorSpy.mockRestore(); // Clean up spy
        });

        test('should log error if chrome.sidePanel.open rejects', async () => {
            const tabId = 456;
            const errorMessage = 'Failed to open panel';
            mockSidePanelOpen.mockRejectedValueOnce(new Error(errorMessage));
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            sidePanelService.openSidePanel(tabId);
            
            // Allow promise to reject
            await new Promise(process.nextTick);

            expect(mockSidePanelOpen).toHaveBeenCalledWith({ tabId });
            expect(consoleErrorSpy).toHaveBeenCalledWith('Error opening side panel:', expect.any(Error));
            expect(consoleErrorSpy.mock.calls[0][1].message).toBe(errorMessage); // Check the error message

            consoleErrorSpy.mockRestore();
        });
    });
}); 