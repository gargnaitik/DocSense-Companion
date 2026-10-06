import React from 'react';

type Tab = 'save' | 'search' | 'settings';

interface Props {
  activeTab: Tab;
  onChange: (tab: Tab) => void;
}

export default function TabBar({ activeTab, onChange }: Props) {
  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'save',
      label: 'Capture',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      )
    },
    {
      id: 'search',
      label: 'Search',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className="glass border-t border-white/5 flex items-center justify-around p-2 z-10">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex flex-col items-center justify-center w-16 h-12 rounded-lg transition-all duration-200 ${
              isActive 
                ? 'text-primary bg-primary/10' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <div className={`mb-1 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
              {tab.icon}
            </div>
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
