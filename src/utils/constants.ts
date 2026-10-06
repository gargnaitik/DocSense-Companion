// ============================================================
// DocSense Companion — Constants & Defaults
// ============================================================

import type { ExtensionSettings } from '../types';

/** Production backend URL */
export const DEFAULT_BACKEND_URL = 'https://docsense-ai-g6s4.onrender.com';

/** Production frontend URL */
export const DEFAULT_FRONTEND_URL = 'https://docsense-ai-mu.vercel.app';

/** Default Dashboard URL */
export const DEFAULT_DASHBOARD_URL = 'https://docsense-ai-mu.vercel.app';

// ====== Storage Keys ======

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'docsense_auth_token',
  USER: 'docsense_user',
  SETTINGS: 'docsense_settings',
  RECENT_SAVES: 'docsense_recent_saves',
} as const;

// ====== Default Settings ======

export const DEFAULT_SETTINGS: ExtensionSettings = {
  backendUrl: DEFAULT_BACKEND_URL,
  dashboardUrl: DEFAULT_DASHBOARD_URL,
  floatingButton: false,
  defaultCollectionId: null,
};

// ====== Message Types (chrome.runtime messaging) ======

export const MESSAGE_TYPES = {
  EXTRACT_CONTENT: 'EXTRACT_CONTENT',
  GET_SELECTION: 'GET_SELECTION',
  GET_METADATA: 'GET_METADATA',
  SAVE_PAGE: 'SAVE_PAGE',
  SAVE_SELECTION: 'SAVE_SELECTION',
  SHOW_NOTIFICATION: 'SHOW_NOTIFICATION',
  TOGGLE_FLOATING_BUTTON: 'TOGGLE_FLOATING_BUTTON',
  CHECK_AUTH: 'CHECK_AUTH',
  GET_PAGE_INFO: 'GET_PAGE_INFO',
} as const;

// ====== API Endpoints ======

export const API_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  ME: '/api/auth/me',
  CAPTURE: '/api/documents/capture',
  CAPTURE_SELECTION: '/api/documents/capture/selection',
  DOCUMENTS: '/api/documents',
  DOCUMENT_STATS: '/api/documents/stats',
  COLLECTIONS: '/api/collections',
  SEARCH: '/api/search',
} as const;

// ====== DOM Noise Selectors (removed during content extraction) ======

export const NOISE_SELECTORS = [
  // Scripts & styles
  'script', 'style', 'noscript', 'iframe', 'svg',
  // Semantic noise
  'nav', 'header', 'footer', 'aside',
  // ARIA roles
  '[role="navigation"]', '[role="banner"]', '[role="complementary"]', '[role="contentinfo"]',
  // Ads
  '.ad', '.ads', '.advertisement', '.advert', '.sponsor', '.sponsored',
  '[data-ad]', '[data-advertisement]', '[id*="google_ads"]', '[class*="adsbygoogle"]',
  // Cookie / consent
  '.cookie', '.consent', '.cookie-banner', '.cookie-notice', '#cookie-banner', '#cookie-consent',
  '.gdpr', '.privacy-banner', '.cc-window',
  // Popups / modals
  '.popup', '.modal', '.overlay', '.lightbox',
  // Newsletter / signup
  '.newsletter', '.signup', '.subscribe', '.cta-banner',
  // Social
  '.social-share', '.share-buttons', '.sharing', '.social-links',
  // Comments
  '.comments', '.comment-section', '#comments', '#disqus_thread', '.respond',
  // Sidebar / related
  '.sidebar', '#sidebar', '.related-posts', '.recommended', '.suggestions',
  // Widgets
  '.widget', '.widgets', '.toc', '.table-of-contents',
  // Promotions
  '.promo', '.promotion', '.upsell',
] as const;

// ====== Content Container Selectors (priority order) ======

export const CONTENT_SELECTORS = [
  'article',
  '[role="main"]',
  'main',
  '.post-content',
  '.article-content',
  '.article-body',
  '.entry-content',
  '.content-body',
  '.markdown-body',
  '.prose',
  '.post-body',
  '.story-body',
  '#content',
  '.content',
] as const;

// ====== Limits ======

export const MAX_RECENT_SAVES = 20;
export const SEARCH_DEBOUNCE_MS = 400;
export const MAX_CONTENT_LENGTH = 500_000; // 500KB text limit
