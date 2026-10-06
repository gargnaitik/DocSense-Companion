import { MESSAGE_TYPES } from '../utils/constants';
import { extractMetadata, extractPageTitle } from '../utils/metadata';
import { extractPageContent } from './extractor';
import { injectFloatingButton, removeFloatingButton } from './floating';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case MESSAGE_TYPES.EXTRACT_CONTENT:
      try {
        const content = extractPageContent();
        const metadata = extractMetadata();
        const title = extractPageTitle();
        sendResponse({
          title,
          content,
          metadata,
          url: window.location.href
        });
      } catch (error) {
        console.error('DocSense extraction error:', error);
        sendResponse({ error: String(error) });
      }
      return true; // Keep channel open

    case MESSAGE_TYPES.GET_SELECTION:
      const text = window.getSelection()?.toString() || '';
      sendResponse({
        text,
        title: extractPageTitle(),
        url: window.location.href
      });
      return false;

    case MESSAGE_TYPES.GET_METADATA:
      sendResponse(extractMetadata());
      return false;

    case MESSAGE_TYPES.GET_PAGE_INFO:
      sendResponse({
        title: extractPageTitle(),
        url: window.location.href,
        favicon: extractMetadata().favicon,
        hasSelection: !!window.getSelection()?.toString().trim()
      });
      return false;

    case MESSAGE_TYPES.TOGGLE_FLOATING_BUTTON:
      if (request.enabled) {
        injectFloatingButton();
      } else {
        removeFloatingButton();
      }
      sendResponse({ success: true });
      return false;
  }
});

// Init floating button based on settings
chrome.storage.local.get('docsense_settings', (data) => {
  const settings = data.docsense_settings || {};
  if (settings.floatingButton) {
    injectFloatingButton();
  }
});
