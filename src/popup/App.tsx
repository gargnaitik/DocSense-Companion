import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import LoginForm from '../components/LoginForm';
import SavePanel from '../components/SavePanel';
import QuickSearch from '../components/QuickSearch';
import SettingsPanel from '../components/SettingsPanel';
import TabBar from '../components/TabBar';

type Tab = 'save' | 'search' | 'settings';

import extensionLogo from '../assets/extension_logo.svg';

export default function App() {
  const { user, isLoading, login, logout, error } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('save');

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
          <p className="text-slate-400">Loading DocSense...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm onLogin={login} error={error} />;
  }

  return (
    <div className="flex flex-col h-screen animate-fade-in">
      {/* Header */}
      <header className="glass px-4 py-3 flex items-center justify-between z-10 border-b border-black/5">
        <div className="flex items-center gap-2">
          <img src={extensionLogo} alt="DocSense Companion" className="h-8 w-auto object-contain" />
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-slate-300 truncate max-w-[100px]">{user.name}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
        <div className="absolute inset-0 p-4 transition-all duration-300">
          {activeTab === 'save' && <SavePanel />}
          {activeTab === 'search' && <QuickSearch />}
          {activeTab === 'settings' && <SettingsPanel onLogout={logout} />}
        </div>
      </main>

      {/* Footer Navigation */}
      <TabBar activeTab={activeTab} onChange={setActiveTab} />
    </div>
  );
}
