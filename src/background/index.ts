import { MESSAGE_TYPES, DEFAULT_DASHBOARD_URL } from '../utils/constants';
import { api } from '../services/api';
import { auth } from '../services/auth';
import { storage } from '../services/storage';

// Initialize context menus
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'save-selection',
    title: 'Save Selection to DocSense',
    contexts: ['selection']
  });
  
  chrome.contextMenus.create({
    id: 'save-page',
    title: 'Save Page to DocSense',
    contexts: ['page']
  });
  
  chrome.contextMenus.create({
    id: 'open-dashboard',
    title: 'Open DocSense Dashboard',
    contexts: ['page']
  });
});

// Initialize auth on startup
chrome.runtime.onStartup.addListener(() => {
  auth.initialize();
});

// Ensure content script is injected
async function ensureContentScript(tabId: number): Promise<boolean> {
  try {
    await chrome.tabs.sendMessage(tabId, { type: MESSAGE_TYPES.GET_PAGE_INFO });
    return true;
  } catch (e) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId },
        files: ['content.js']
      });
      // Give it a moment to initialize
      await new Promise(r => setTimeout(r, 100));
      return true;
    } catch (injErr) {
      console.error('Failed to inject content script:', injErr);
      return false;
    }
  }
}

function showNotification(title: string, message: string) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon-48.png',
    title,
    message
  });
}

async function handleSavePage(tabId: number) {
  try {
    if (!await auth.isAuthenticated()) {
      showNotification('DocSense Authentication Required', 'Please log in via the extension popup to save pages.');
      return;
    }

    const injected = await ensureContentScript(tabId);
    if (!injected) throw new Error('Could not communicate with the page.');

    const data = await chrome.tabs.sendMessage(tabId, { type: MESSAGE_TYPES.EXTRACT_CONTENT });
    if (data.error) throw new Error(data.error);

    const settings = await storage.getSettings();
    
    await api.captureWebpage({
      title: data.title,
      url: data.url,
      content: data.content,
      metadata: data.metadata,
      collection_id: settings.defaultCollectionId || undefined
    });

    await storage.addRecentSave({
      id: crypto.randomUUID(),
      title: data.title,
      url: data.url,
      timestamp: new Date().toISOString()
    });

    showNotification('Saved to DocSense', `Successfully captured: ${data.title}`);
    
    chrome.action.setBadgeText({ text: '✓', tabId });
    chrome.action.setBadgeBackgroundColor({ color: '#10b981', tabId });
    setTimeout(() => { chrome.action.setBadgeText({ text: '', tabId }); }, 3000);

  } catch (error: any) {
    console.error('Save page failed:', error);
    showNotification('Save Failed', error.message || 'An unknown error occurred.');
  }
}

async function handleSaveSelection(tabId: number) {
  try {
    if (!await auth.isAuthenticated()) {
      showNotification('DocSense Authentication Required', 'Please log in via the extension popup to save pages.');
      return;
    }

    const injected = await ensureContentScript(tabId);
    if (!injected) throw new Error('Could not communicate with the page.');

    const data = await chrome.tabs.sendMessage(tabId, { type: MESSAGE_TYPES.GET_SELECTION });
    if (!data.text) throw new Error('No text selected.');

    const settings = await storage.getSettings();
    
    await api.captureSelection({
      title: data.title,
      url: data.url,
      selected_text: data.text,
      collection_id: settings.defaultCollectionId || undefined
    });

    await storage.addRecentSave({
      id: crypto.randomUUID(),
      title: data.title,
      url: data.url,
      timestamp: new Date().toISOString()
    });

    showNotification('Saved to DocSense', `Successfully captured selection from: ${data.title}`);

  } catch (error: any) {
    console.error('Save selection failed:', error);
    showNotification('Save Failed', error.message || 'An unknown error occurred.');
  }
}

// Handle context menus
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!tab?.id) return;
  
  if (info.menuItemId === 'save-page') {
    handleSavePage(tab.id);
  } else if (info.menuItemId === 'save-selection') {
    handleSaveSelection(tab.id);
  } else if (info.menuItemId === 'open-dashboard') {
    storage.getSettings().then(settings => {
      chrome.tabs.create({ url: DEFAULT_DASHBOARD_URL });
    });
  }
});

// Handle commands (keyboard shortcuts)
chrome.commands.onCommand.addListener((command, tab) => {
  if (command === 'save-page' && tab?.id) {
    handleSavePage(tab.id);
  }
});

// Handle messages from popup/content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === MESSAGE_TYPES.SAVE_PAGE && sender.tab?.id) {
    handleSavePage(sender.tab.id).then(() => sendResponse({ success: true }));
    return true; // Keep channel open
  }
  
  if (request.type === MESSAGE_TYPES.CHECK_AUTH) {
    auth.isAuthenticated().then(isAuth => sendResponse({ isAuthenticated: isAuth }));
    return true;
  }
});

// Init auth right away
auth.initialize();
