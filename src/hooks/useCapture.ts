import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { storage } from '../services/storage';
import { MESSAGE_TYPES } from '../utils/constants';
import type { PageInfo } from '../types';

export function useCapture() {
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (tab.id && !tab.url?.startsWith('chrome://')) {
        chrome.tabs.sendMessage(tab.id, { type: MESSAGE_TYPES.GET_PAGE_INFO }, (response) => {
          if (chrome.runtime.lastError) {
            // Script not injected
            setPageInfo({ title: tab.title || '', url: tab.url || '', hasSelection: false });
          } else if (response) {
            setPageInfo(response);
          }
        });
      }
    });
  }, []);

  const savePage = async (collectionId?: string) => {
    setIsCapturing(true);
    setError(null);
    setSuccess(false);
    try {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      const tab = tabs[0];
      if (!tab?.id) throw new Error('No active tab');

      const data = await chrome.tabs.sendMessage(tab.id, { type: MESSAGE_TYPES.EXTRACT_CONTENT });
      if (data.error) throw new Error(data.error);

      await api.captureWebpage({
        title: data.title,
        url: data.url,
        content: data.content,
        metadata: data.metadata,
        collection_id: collectionId
      });

      await storage.addRecentSave({
        id: crypto.randomUUID(),
        title: data.title,
        url: data.url,
        timestamp: new Date().toISOString()
      });

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Capture failed');
    } finally {
      setIsCapturing(false);
    }
  };

  const saveSelection = async (collectionId?: string) => {
    setIsCapturing(true);
    setError(null);
    setSuccess(false);
    try {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      const tab = tabs[0];
      if (!tab?.id) throw new Error('No active tab');

      const data = await chrome.tabs.sendMessage(tab.id, { type: MESSAGE_TYPES.GET_SELECTION });
      if (!data?.text) throw new Error('No text selected');

      await api.captureSelection({
        title: data.title,
        url: data.url,
        selected_text: data.text,
        collection_id: collectionId
      });

      await storage.addRecentSave({
        id: crypto.randomUUID(),
        title: data.title,
        url: data.url,
        timestamp: new Date().toISOString()
      });

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Capture failed');
    } finally {
      setIsCapturing(false);
    }
  };

  return { pageInfo, isCapturing, error, success, savePage, saveSelection };
}
