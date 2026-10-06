import { useState, useRef, useEffect } from 'react';
import { useCollections } from '../hooks/useCollections';

interface Props {
  selectedId: string;
  onChange: (id: string) => void;
}

export default function CollectionSelector({ selectedId, onChange }: Props) {
  const { collections, isLoading, createCollection } = useCollections(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newColName, setNewColName] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColName.trim()) return;
    try {
      const col = await createCollection(newColName);
      onChange(col.id);
      setNewColName('');
      setIsCreating(false);
      setIsOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const selectedCol = collections.find(c => c.id === selectedId);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="input-field w-full flex items-center justify-between text-left h-[38px]"
      >
        <span className={selectedCol ? "text-slate-200" : "text-slate-400"}>
          {selectedCol ? selectedCol.name : 'Default (No Collection)'}
        </span>
        <svg className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 glass rounded-lg overflow-hidden z-20 shadow-xl border border-white/10 animate-scale-in origin-top">
          <div className="max-h-48 overflow-y-auto p-1">
            <button
              className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${selectedId === '' ? 'bg-primary/20 text-white' : 'text-slate-300 hover:bg-white/5'}`}
              onClick={() => { onChange(''); setIsOpen(false); }}
            >
              Default (No Collection)
            </button>
            
            {isLoading && collections.length === 0 ? (
              <div className="px-3 py-2 text-sm text-slate-500 text-center">Loading...</div>
            ) : (
              collections.map(col => (
                <button
                  key={col.id}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center justify-between group ${selectedId === col.id ? 'bg-primary/20 text-white' : 'text-slate-300 hover:bg-white/5'}`}
                  onClick={() => { onChange(col.id); setIsOpen(false); }}
                >
                  <span className="truncate pr-2">{col.name}</span>
                  <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {col.document_count}
                  </span>
                </button>
              ))
            )}
          </div>
          
          <div className="border-t border-white/10 p-2 bg-black/20">
            {isCreating ? (
              <form onSubmit={handleCreate} className="flex gap-2">
                <input
                  type="text"
                  autoFocus
                  className="input-field text-sm h-8"
                  placeholder="Collection name"
                  value={newColName}
                  onChange={e => setNewColName(e.target.value)}
                />
                <button type="submit" className="btn-primary px-3 h-8 text-xs py-0">Add</button>
              </form>
            ) : (
              <button
                className="w-full text-left px-2 py-1.5 text-sm text-primary hover:text-indigo-400 transition-colors flex items-center gap-1.5"
                onClick={() => setIsCreating(true)}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Collection
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
