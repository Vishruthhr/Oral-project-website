/**
 * IndexedDB + LocalStorage Persistence Manager (React Engine)
 */

class StorageManager {
  constructor() {
    this.dbName = 'OralHealth_Clinical_DB';
    this.storeName = 'assessments';
    this.draftKey = 'oral_draft_current';
    this.settingsKey = 'oral_settings';
    this.db = null;
    this.isReady = this.initDB();
  }

  initDB() {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !('indexedDB' in window)) {
        resolve(false);
        return;
      }

      const request = indexedDB.open(this.dbName, 1);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('participantId', 'participantId', { unique: false });
          store.createIndex('examDate', 'examDate', { unique: false });
          store.createIndex('createdAt', 'createdAt', { unique: false });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(true);
      };

      request.onerror = () => {
        resolve(false);
      };
    });
  }

  async saveRecord(record) {
    await this.isReady;
    if (!record.id) {
      record.id = 'REC_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    }
    record.updatedAt = new Date().toISOString();
    if (!record.createdAt) {
      record.createdAt = record.updatedAt;
    }

    if (this.db) {
      return new Promise((resolve, reject) => {
        const tx = this.db.transaction([this.storeName], 'readwrite');
        const store = tx.objectStore(this.storeName);
        const req = store.put(record);
        req.onsuccess = () => resolve(record);
        req.onerror = (e) => reject(e.target.error);
      });
    } else {
      const records = this.getAllRecordsFromLS();
      const existingIdx = records.findIndex(r => r.id === record.id);
      if (existingIdx >= 0) {
        records[existingIdx] = record;
      } else {
        records.unshift(record);
      }
      localStorage.setItem('oral_records_fallback', JSON.stringify(records));
      return record;
    }
  }

  async getAllRecords() {
    await this.isReady;
    if (this.db) {
      return new Promise((resolve, reject) => {
        const tx = this.db.transaction([this.storeName], 'readonly');
        const store = tx.objectStore(this.storeName);
        const req = store.getAll();
        req.onsuccess = () => {
          const res = req.result || [];
          res.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
          resolve(res);
        };
        req.onerror = (e) => reject(e.target.error);
      });
    } else {
      return this.getAllRecordsFromLS();
    }
  }

  getAllRecordsFromLS() {
    try {
      const data = localStorage.getItem('oral_records_fallback');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  async deleteRecord(id) {
    await this.isReady;
    if (this.db) {
      return new Promise((resolve, reject) => {
        const tx = this.db.transaction([this.storeName], 'readwrite');
        const store = tx.objectStore(this.storeName);
        const req = store.delete(id);
        req.onsuccess = () => resolve(true);
        req.onerror = (e) => reject(e.target.error);
      });
    } else {
      let records = this.getAllRecordsFromLS();
      records = records.filter(r => r.id !== id);
      localStorage.setItem('oral_records_fallback', JSON.stringify(records));
      return true;
    }
  }

  async clearAllRecords() {
    await this.isReady;
    if (this.db) {
      return new Promise((resolve, reject) => {
        const tx = this.db.transaction([this.storeName], 'readwrite');
        const store = tx.objectStore(this.storeName);
        const req = store.clear();
        req.onsuccess = () => resolve(true);
        req.onerror = (e) => reject(e.target.error);
      });
    } else {
      localStorage.removeItem('oral_records_fallback');
      return true;
    }
  }

  saveDraft(data) {
    try {
      localStorage.setItem(this.draftKey, JSON.stringify({ data, timestamp: Date.now() }));
    } catch (e) {}
  }

  loadDraft() {
    try {
      const raw = localStorage.getItem(this.draftKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed.data || null;
    } catch (e) {
      return null;
    }
  }

  clearDraft() {
    try {
      localStorage.removeItem(this.draftKey);
    } catch (e) {}
  }

  saveSetting(key, val) {
    try {
      const settings = this.getSettings();
      settings[key] = val;
      localStorage.setItem(this.settingsKey, JSON.stringify(settings));
    } catch (e) {}
  }

  getSettings() {
    try {
      const raw = localStorage.getItem(this.settingsKey);
      return raw ? JSON.parse(raw) : { autoAdvance: true, haptics: true, audioFeedback: true, theme: 'light' };
    } catch (e) {
      return { autoAdvance: true, haptics: true, audioFeedback: true, theme: 'light' };
    }
  }
}

export const storage = new StorageManager();
