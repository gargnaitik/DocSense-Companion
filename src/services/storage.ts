import type { ExtensionSettings, RecentSave } from '../types';
import { DEFAULT_SETTINGS, STORAGE_KEYS, MAX_RECENT_SAVES } from '../utils/constants';

export const storage = {
  async get<T>(key: string): Promise<T | null> {
    return new Promise((resolve) => {
      chrome.storage.local.get(key, (result) => {
        resolve(result[key] !== undefined ? result[key] as T : null);
      });
    });
  },

  async set(key: string, value: any): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [key]: value }, () => resolve());
    });
  },

  async remove(key: string): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.remove(key, () => resolve());
    });
  },

  async getSettings(): Promise<ExtensionSettings> {
    const settings = await this.get<ExtensionSettings>(STORAGE_KEYS.SETTINGS);
    return { ...DEFAULT_SETTINGS, ...settings };
  },

  async updateSettings(partial: Partial<ExtensionSettings>): Promise<void> {
    const current = await this.getSettings();
    await this.set(STORAGE_KEYS.SETTINGS, { ...current, ...partial });
  },

  async getRecentSaves(): Promise<RecentSave[]> {
    const saves = await this.get<RecentSave[]>(STORAGE_KEYS.RECENT_SAVES);
    return saves || [];
  },

  async addRecentSave(save: RecentSave): Promise<void> {
    const saves = await this.getRecentSaves();
    const newSaves = [save, ...saves].slice(0, MAX_RECENT_SAVES);
    await this.set(STORAGE_KEYS.RECENT_SAVES, newSaves);
  }
};
