import { useState } from 'react';
import { useCapture } from '../hooks/useCapture';
import CollectionSelector from './CollectionSelector';
import RecentSaves from './RecentSaves';

export default function SavePanel() {
  const { pageInfo, isCapturing, error, success, savePage, saveSelection } = useCapture();
  const [collectionId, setCollectionId] = useState<string>('');

  return (
    <div className="space-y-4 animate-slide-up h-full flex flex-col">
      <div className="glass-card p-4">
        <div className="flex items-start gap-3 mb-4">
          {pageInfo?.favicon ? (
            <img src={pageInfo.favicon} alt="" className="w-8 h-8 rounded mt-1 bg-white/10" onError={(e) => e.currentTarget.style.display = 'none'} />
          ) : (
            <div className="w-8 h-8 rounded mt-1 bg-white/10 flex flex-shrink-0 items-center justify-center">
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
          )}
          <div className="overflow-hidden flex-1">
            <h2 className="font-medium text-sm text-slate-100 truncate mb-1" title={pageInfo?.title}>
              {pageInfo ? pageInfo.title : <span className="shimmer text-transparent bg-clip-text">Loading page info...</span>}
            </h2>
            <p className="text-xs text-slate-400 truncate" title={pageInfo?.url}>
              {pageInfo ? pageInfo.url : <span className="shimmer text-transparent bg-clip-text">Loading url...</span>}
            </p>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">Save to Collection</label>
          <CollectionSelector selectedId={collectionId} onChange={setCollectionId} />
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-lg bg-error/10 border border-error/20 text-error text-xs flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-2.5 rounded-lg bg-success/10 border border-success/20 text-success text-xs flex items-center gap-2 animate-fade-in">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Saved successfully!</span>
          </div>
        )}

        <div className="flex gap-2">
          <button 
            className="btn-primary flex-1 py-2.5 text-sm"
            onClick={() => savePage(collectionId || undefined)}
            disabled={isCapturing || !pageInfo}
          >
            {isCapturing ? (
               <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Save Page
              </>
            )}
          </button>
          
          <button 
            className="btn-secondary flex-1 py-2.5 text-sm"
            onClick={() => saveSelection(collectionId || undefined)}
            disabled={isCapturing || !pageInfo?.hasSelection}
            title={!pageInfo?.hasSelection ? "Select text on the page first" : ""}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
            Save Selection
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col min-h-[150px]">
        <RecentSaves />
      </div>
    </div>
  );
}
