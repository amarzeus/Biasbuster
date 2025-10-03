import { BiasAnalysisResult } from '../types';

class CacheService {
  private storageKey = 'biasbuster_cache';

  private cache: Record<string, BiasAnalysisResult> = {};

  constructor() {
    this.loadCache();
  }

  private loadCache(): void {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        this.cache = JSON.parse(stored);
      } catch (e) {
        console.error('Failed to load cache:', e);
        this.cache = {};
      }
    }
  }

  private saveCache(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.cache));
    } catch (e) {
      console.error('Failed to save cache:', e);
    }
  }

  get(key: string): BiasAnalysisResult | null {
    return this.cache[key] || null;
  }

  set(key: string, result: BiasAnalysisResult): void {
    this.cache[key] = result;
    this.saveCache();
  }

  clear(): void {
    this.cache = {};
    localStorage.removeItem(this.storageKey);
  }
}

export const cacheService = new CacheService();
