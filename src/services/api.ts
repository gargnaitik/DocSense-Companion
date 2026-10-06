import type { AuthResponse, User, CaptureRequest, SelectionCaptureRequest, DocumentItem, DocumentsResponse, DocumentStats, Collection, SearchResponse } from '../types';
import { API_ENDPOINTS, DEFAULT_BACKEND_URL } from '../utils/constants';

class DocSenseAPI {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = DEFAULT_BACKEND_URL) {
    this.baseUrl = baseUrl;
  }

  setBaseUrl(url: string) { this.baseUrl = url; }
  setToken(token: string) { this.token = token; }
  clearToken() { this.token = null; }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }

  // Auth
  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getMe(): Promise<User> {
    return this.request<User>(API_ENDPOINTS.ME);
  }

  // Capture
  async captureWebpage(data: CaptureRequest): Promise<DocumentItem> {
    return this.request<DocumentItem>(API_ENDPOINTS.CAPTURE, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async captureSelection(data: SelectionCaptureRequest): Promise<DocumentItem> {
    return this.request<DocumentItem>(API_ENDPOINTS.CAPTURE_SELECTION, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Documents
  async getDocuments(): Promise<DocumentsResponse> {
    return this.request<DocumentsResponse>(API_ENDPOINTS.DOCUMENTS);
  }

  async getDocumentStats(): Promise<DocumentStats> {
    return this.request<DocumentStats>(API_ENDPOINTS.DOCUMENT_STATS);
  }

  // Collections
  async getCollections(): Promise<Collection[]> {
    return this.request<Collection[]>(API_ENDPOINTS.COLLECTIONS);
  }

  async createCollection(name: string): Promise<Collection> {
    return this.request<Collection>(API_ENDPOINTS.COLLECTIONS, {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  async deleteCollection(id: string): Promise<void> {
    await this.request<void>(`${API_ENDPOINTS.COLLECTIONS}/${id}`, { method: 'DELETE' });
  }

  // Search
  async search(query: string, limit: number = 5): Promise<SearchResponse> {
    return this.request<SearchResponse>(API_ENDPOINTS.SEARCH, {
      method: 'POST',
      body: JSON.stringify({ query, limit }),
    });
  }
}

export const api = new DocSenseAPI();
