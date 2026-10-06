// ============================================================
// DocSense Companion — Type Definitions
// ============================================================

// ====== Auth ======

export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// ====== Documents ======

export type DocumentStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface DocumentItem {
  id: string;
  title: string;
  original_filename: string;
  size: number;
  status: DocumentStatus;
  chunk_count: number;
  created_at: string;
  source_type: string;
  source_url: string | null;
  summary: string | null;
  key_topics: string[] | null;
  keywords: string[] | null;
  estimated_reading_time: number | null;
}

export interface DocumentsResponse {
  documents: DocumentItem[];
  total: number;
}

export interface DocumentStats {
  document_count: number;
  total_size: number;
  total_chunks: number;
  conversation_count: number;
}

// ====== Capture ======

export interface CaptureRequest {
  title: string;
  url: string;
  content: string;
  collection_id?: string;
  metadata?: PageMetadata;
}

export interface SelectionCaptureRequest {
  title: string;
  url: string;
  selected_text: string;
  collection_id?: string;
}

// ====== Collections ======

export interface Collection {
  id: string;
  name: string;
  created_at: string;
  document_count?: number;
}

// ====== Search ======

export interface SearchResult {
  document_title: string;
  page_number: number | null;
  chunk_number: number;
  content: string;
  similarity_score: number;
  match_type: string;
}

export interface SearchResponse {
  results: SearchResult[];
  query: string;
}

// ====== Page Metadata ======

export interface PageMetadata {
  author?: string;
  publish_date?: string;
  description?: string;
  favicon?: string;
  language?: string;
  reading_time?: number;
  tags?: string[];
}

// ====== Extension Settings ======

export interface ExtensionSettings {
  backendUrl: string;
  dashboardUrl: string;
  floatingButton: boolean;
  defaultCollectionId: string | null;
}

// ====== Recent Saves ======

export interface RecentSave {
  id: string;
  title: string;
  url: string;
  timestamp: string;
}

// ====== Page Info (from content script) ======

export interface PageInfo {
  title: string;
  url: string;
  favicon?: string;
  hasSelection: boolean;
}

// ====== Content Extraction ======

export interface ExtractedContent {
  title: string;
  content: string;
  metadata: PageMetadata;
  url: string;
}

export interface SelectionData {
  text: string;
  title: string;
  url: string;
}
