import { useState } from 'react';
import { useSearch } from '../hooks/useSearch';
import { DEFAULT_DASHBOARD_URL } from '../utils/constants';

export default function QuickSearch() {
  const [query, setQuery] = useState('');
  const { results, isSearching } = useSearch(query);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.open(`${DEFAULT_DASHBOARD_URL}/search?q=${encodeURIComponent(query)}`, '_blank');
    }
  };

  return (
    <div className="h-full flex flex-col animate-slide-up">
      <form onSubmit={handleSubmit} className="mb-4 relative">
        <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          className="input-field h-10 w-full bg-black/5"
          style={{ paddingLeft: '36px' }}
          placeholder="Semantic search across your knowledge base..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
          </div>
        )}
      </form>

      <div className="flex-1 overflow-y-auto pb-4 pr-1">
        {!query ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-70">
            <svg className="w-12 h-12 mb-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <p className="text-sm font-medium">AI Semantic Search</p>
            <p className="text-xs text-center mt-1 px-4">Find information based on meaning, not just exact keywords.</p>
          </div>
        ) : isSearching && !results ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass-card p-3 animate-pulse">
                <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-white/5 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : results?.results.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">
            No results found for "{query}"
          </div>
        ) : results?.results ? (
          <div className="space-y-3">
            <div className="text-xs text-slate-400 mb-2 px-1 flex justify-between">
              <span>Top semantic matches</span>
              {results.results.length >= 5 && (
                <button type="submit" onClick={handleSubmit} className="text-primary hover:underline">
                  View all
                </button>
              )}
            </div>
            {results.results.map((result) => (
              <a 
                key={result.document.id}
                href={`${DEFAULT_DASHBOARD_URL}/document/${result.document.id}`}
                target="_blank"
                rel="noreferrer"
                className="block glass-card p-3 hover:bg-white/5 transition-colors group relative overflow-hidden"
              >
                {/* Score indicator bar */}
                <div 
                  className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-accent opacity-50"
                  style={{ opacity: Math.max(0.2, result.score) }}
                />
                <h4 className="font-medium text-sm text-slate-200 mb-1 group-hover:text-primary transition-colors line-clamp-1 pl-1">
                  {result.document.title}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2 pl-1 mb-2">
                  ...{result.content.substring(0, 150)}...
                </p>
                <div className="flex justify-between items-center text-[10px] text-slate-500 pl-1">
                  <span>Score: {(result.score * 100).toFixed(0)}%</span>
                  <span className="capitalize">{result.document.source_type}</span>
                </div>
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
