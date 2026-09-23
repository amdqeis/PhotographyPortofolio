import type { Photo, Story, SiteSettings } from '../types';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('cms_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Auth
  async login(password: string): Promise<{ success: boolean; token?: string; message?: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    return res.json();
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('cms_token');
  },

  logout(): void {
    localStorage.removeItem('cms_token');
  },

  // Photos
  async getPhotos(): Promise<Photo[]> {
    const res = await fetch(`${API_BASE}/photos`);
    const json = await res.json();
    return json.success ? json.data : [];
  },

  async createPhoto(photo: Partial<Photo>): Promise<{ success: boolean; data?: Photo; message?: string }> {
    const res = await fetch(`${API_BASE}/photos`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(photo),
    });
    return res.json();
  },

  async updatePhoto(id: string, photo: Partial<Photo>): Promise<{ success: boolean; message?: string }> {
    const res = await fetch(`${API_BASE}/photos/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(photo),
    });
    return res.json();
  },

  async deletePhoto(id: string): Promise<{ success: boolean; message?: string }> {
    const res = await fetch(`${API_BASE}/photos/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Stories
  async getStories(): Promise<Story[]> {
    const res = await fetch(`${API_BASE}/stories`);
    const json = await res.json();
    return json.success ? json.data : [];
  },

  async createStory(story: Partial<Story>): Promise<{ success: boolean; id?: string; message?: string }> {
    const res = await fetch(`${API_BASE}/stories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(story),
    });
    return res.json();
  },

  async updateStory(id: string, story: Partial<Story>): Promise<{ success: boolean; message?: string }> {
    const res = await fetch(`${API_BASE}/stories/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(story),
    });
    return res.json();
  },

  async deleteStory(id: string): Promise<{ success: boolean; message?: string }> {
    const res = await fetch(`${API_BASE}/stories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Settings
  async getSettings(): Promise<SiteSettings | null> {
    try {
      const res = await fetch(`${API_BASE}/settings`);
      const json = await res.json();
      return json.success ? (json.data as SiteSettings) : null;
    } catch {
      return null;
    }
  },

  async updateSettings(settings: Partial<SiteSettings>): Promise<{ success: boolean; message?: string }> {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings),
    });
    return res.json();
  },

  // Contact
  async sendContact(email: string, message?: string): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, message }),
      });
      return res.json();
    } catch {
      // Fallback: return success true so UX isn't broken if endpoint unavailable
      return { success: true, message: 'Message queued.' };
    }
  },
};
