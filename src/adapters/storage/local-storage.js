/**
 * @file local-storage.js
 * @description LocalStorage Adapter for persisting Unit 19.2 exam results, active sessions,
 * and user preferences using isolated storage keys (u19_2_*).
 * Conforms to Physics Learning Standard (v1.13.0).
 */

import { APP_CONFIG } from '../../shared/config.js';

export class LocalStorageAdapter {
  static saveExamResult(result) {
    try {
      const key = APP_CONFIG.storageKeys.examResult;
      const serialized = JSON.stringify({
        ...result,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem(key, serialized);
      return true;
    } catch (err) {
      console.warn('[LocalStorageAdapter] Failed to save exam result:', err);
      return false;
    }
  }

  static loadExamResult() {
    try {
      const key = APP_CONFIG.storageKeys.examResult;
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (err) {
      console.warn('[LocalStorageAdapter] Failed to load exam result:', err);
      return null;
    }
  }

  static clearExamResult() {
    try {
      localStorage.removeItem(APP_CONFIG.storageKeys.examResult);
      return true;
    } catch (err) {
      console.warn('[LocalStorageAdapter] Failed to clear exam result:', err);
      return false;
    }
  }

  static saveExamSession(sessionData) {
    try {
      const key = APP_CONFIG.storageKeys.examSession;
      localStorage.setItem(key, JSON.stringify(sessionData));
      return true;
    } catch (err) {
      console.warn('[LocalStorageAdapter] Failed to save exam session:', err);
      return false;
    }
  }

  static loadExamSession() {
    try {
      const key = APP_CONFIG.storageKeys.examSession;
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (err) {
      console.warn('[LocalStorageAdapter] Failed to load exam session:', err);
      return null;
    }
  }

  static clearExamSession() {
    try {
      localStorage.removeItem(APP_CONFIG.storageKeys.examSession);
      return true;
    } catch (err) {
      console.warn('[LocalStorageAdapter] Failed to clear exam session:', err);
      return false;
    }
  }

  static saveUserPreferences(prefs) {
    try {
      localStorage.setItem(APP_CONFIG.storageKeys.userPreferences, JSON.stringify(prefs));
      return true;
    } catch (err) {
      console.warn('[LocalStorageAdapter] Failed to save user preferences:', err);
      return false;
    }
  }

  static loadUserPreferences() {
    try {
      const item = localStorage.getItem(APP_CONFIG.storageKeys.userPreferences);
      return item ? JSON.parse(item) : null;
    } catch (err) {
      console.warn('[LocalStorageAdapter] Failed to load user preferences:', err);
      return null;
    }
  }
}
