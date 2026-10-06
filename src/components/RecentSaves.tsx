import { useState, useEffect } from 'react';
import { storage } from '../services/storage';
import { DEFAULT_DASHBOARD_URL } from '../utils/constants';
import type { RecentSave } from '../types';

export default function RecentSaves() {
  const [saves, setSaves] = useState<RecentSave[]>([]);

  useEffect(() => {
    // Initial load
    storage.getRecentSaves().then(setSaves);
    
    // Listen for changes from background
    const handleStorageChange = (changes: any) => {
      if (changes.docsense_recent_saves) {
        setSaves(changes.docsense_recent_saves.newValue || []);
      }
    };
    chrome.storage.onChanged.addListener(handleStorageChange);
    return () => chrome.storage.onChanged.removeListener(handleStorageChange);
  }, []);

  const timeAgo = (dateStr: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex items-center justify-between mb-2 px-1">
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Recent Captures</h3>
        <a 
          href={DEFAULT_DASHBOARD_URL} 
          target="_blank" 
          rel="noreferrer"
          className="text-xs text-primary hover:text-indigo-400 transition-colors"
        >
          View All
        </a>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 pb-4">
        {saves.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 text-sm italic">
            <svg className="w-8 h-8 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            No saves yet.
          </div>
        ) : (
          saves.map(save => (
            <div key={save.id} className="glass rounded-lg p-2.5 flex flex-col gap-1 hover:bg-white/5 transition-colors group">
              <a 
                href={`${DEFAULT_DASHBOARD_URL}/document/${save.id}`} 
                target="_blank" 
                rel="noreferrer"
                className="font-medium text-sm text-slate-200 line-clamp-1 group-hover:text-primary transition-colors"
              >
                {save.title}
              </a>
              <div className="flex justify-between items-center text-[10px] text-slate-400">
                <span className="truncate max-w-[80%]">{new URL(save.url).hostname}</span>
                <span>{timeAgo(save.timestamp)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
