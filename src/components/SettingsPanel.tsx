import { useState, useEffect } from 'react';
import { storage } from '../services/storage';
import { MESSAGE_TYPES } from '../utils/constants';
import type { ExtensionSettings } from '../types';

interface Props {
  onLogout: () => void;
}

export default function SettingsPanel({ onLogout }: Props) {
  const [settings, setSettings] = useState<ExtensionSettings | null>(null);
  
  useEffect(() => {
    storage.getSettings().then(setSettings);
  }, []);

  const handleToggleFloating = async () => {
    if (!settings) return;
    const newVal = !settings.floatingButton;
    await storage.updateSettings({ floatingButton: newVal });
    setSettings({ ...settings, floatingButton: newVal });
    
    // Notify content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { 
          type: MESSAGE_TYPES.TOGGLE_FLOATING_BUTTON,
          enabled: newVal
        });
      }
    });
  };

  if (!settings) return null;

  return (
    <div className="space-y-4 animate-slide-up pb-6">
      <h2 className="text-sm font-semibold tracking-wide text-slate-300 uppercase mb-4 px-1">Preferences</h2>
      
      <div className="glass-card divide-y divide-white/5">
        
        <div className="p-4 flex items-center justify-between">
          <div>
            <div className="font-medium text-sm text-slate-200">Floating Save Button</div>
            <div className="text-xs text-slate-400 mt-0.5 max-w-[220px]">Show a quick save button on all webpages</div>
          </div>
          <button 
            onClick={handleToggleFloating}
            className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${settings.floatingButton ? 'bg-primary' : 'bg-slate-300'}`}
          >
            <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-[#ffffff] rounded-full transition-transform duration-200 shadow-sm ${settings.floatingButton ? 'translate-x-5' : ''}`} />
          </button>
        </div>
        
        <div className="p-4 flex flex-col items-start">
          <div className="font-medium text-sm text-slate-200 mb-2">Keyboard Shortcuts</div>
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span>Save current page:</span>
            <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white border border-white/20 font-mono text-[10px]">Ctrl+Shift+S</kbd>
          </div>
        </div>
      </div>
      
      <div className="mt-8 pt-4">
        <button 
          onClick={onLogout}
          className="w-full glass py-2.5 rounded-lg text-error text-sm font-medium hover:bg-error/10 hover:border-error/20 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>
      
      <div className="text-center text-[10px] text-slate-500 mt-4">
        DocSense Companion v1.0.0
      </div>
    </div>
  );
}
