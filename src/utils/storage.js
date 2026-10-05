import {
  deleteAllClinicalRecords,
  deleteClinicalRecord,
  getClinicalRecords,
  saveClinicalRecord,
  toClinicalRecordPayload,
} from './supabase';

/** Clinical records live in Supabase; drafts and preferences stay on this device. */

class StorageManager {
  constructor() {
    this.draftKey = 'oral_draft_current';
    this.settingsKey = 'oral_settings';
  }

  async saveRecord(record) {
    const payload = toClinicalRecordPayload({ ...record });
    const saved = await saveClinicalRecord(payload);
    return { ...record, id: saved.id, updatedAt: new Date().toISOString() };
  }

  async getAllRecords() {
    return getClinicalRecords();
  }

  async deleteRecord(id) {
    return deleteClinicalRecord(id);
  }

  async clearAllRecords() {
    return deleteAllClinicalRecords();
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
