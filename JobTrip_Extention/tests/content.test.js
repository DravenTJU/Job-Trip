const { describe, test, expect, beforeEach } = require('@jest/globals');
const { TextEncoder, TextDecoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock chrome APIs
global.chrome = {
  runtime: {
    onMessage: {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    },
    sendMessage: jest.fn(), // Mocked but not deeply tested in this simplified version
  },
  storage: {
    local: {
      get: jest.fn(), // Mocked but not deeply tested in this simplified version
      set: jest.fn().mockResolvedValue(undefined),
    },
  },
};

// JSDOM setup
const { JSDOM } = require('jsdom');

describe('Content Script: Basic Initialization and Runtime Message Listener', () => {
  let dom;
  let mockDocument;
  let mockWindow;
  // let capturedWindowMessageListener; // Removed for simplification
  let capturedRuntimeMessageListener; 

  beforeEach(() => {
    jest.clearAllMocks();

    dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', { url: 'http://example.com' });
    mockDocument = dom.window.document;
    mockWindow = dom.window;

    // Simplified: No longer mocking window.postMessage or window.addEventListener for this very basic test
    // mockWindow.postMessage = jest.fn();
    // mockWindow.addEventListener = jest.fn((type, listener) => { ... });
    global.document = mockDocument;
    global.window = mockWindow;

    // Mock for chrome.runtime.onMessage listener capture
    chrome.runtime.onMessage.addListener.mockImplementation(listener => {
      capturedRuntimeMessageListener = listener;
    });

    // Default mock for chrome.storage.local.get to prevent errors during content.js load
    chrome.storage.local.get.mockImplementation((keys, callback) => {
      const result = { isScrapingActive: false }; 
      if (typeof callback === 'function') {
        callback(result);
      }
      return Promise.resolve(result);
    });
    // chrome.storage.local.set is mocked at the top level.

    jest.resetModules();
    require('../content.js'); // Load content script
  });

  test('should add a listener for chrome.runtime.onMessage', () => {
    expect(chrome.runtime.onMessage.addListener).toHaveBeenCalledTimes(1);
    expect(capturedRuntimeMessageListener).toBeInstanceOf(Function);
  });

  // Simplified tests for overlay actions, focusing only on sendResponse and storage calls
  describe('Simplified Overlay Actions via runtime.onMessage', () => {
    test('showScrapeOverlay action should call storage.set and sendResponse', () => {
      const request = { action: 'showScrapeOverlay' };
      const sendResponse = jest.fn();
      
      // Ensure capturedRuntimeMessageListener is defined before calling it
      if (capturedRuntimeMessageListener) {
        const result = capturedRuntimeMessageListener(request, {}, sendResponse);
        expect(chrome.storage.local.set).toHaveBeenCalledWith({ isScrapingActive: true });
        expect(sendResponse).toHaveBeenCalledWith({ success: true });
        expect(result).toBe(true); // Listener should return true for async response
      } else {
        throw new Error('chrome.runtime.onMessage listener was not captured.');
      }
    });

    test('removeScrapeOverlay action should call storage.set and sendResponse', () => {
      const request = { action: 'removeScrapeOverlay' };
      const sendResponse = jest.fn();

      if (capturedRuntimeMessageListener) {
        const result = capturedRuntimeMessageListener(request, {}, sendResponse);
        expect(chrome.storage.local.set).toHaveBeenCalledWith({ isScrapingActive: false });
        expect(sendResponse).toHaveBeenCalledWith({ success: true });
        expect(result).toBe(true);
      } else {
        throw new Error('chrome.runtime.onMessage listener was not captured.');
      }
    });
  });

}); 