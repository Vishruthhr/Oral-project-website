import {
  deleteAllClinicalRecords,
  deleteClinicalRecord,
  getClinicalRecords,
  saveClinicalRecord,
  toClinicalRecordPayload,
  isSupabaseConfigured,
} from './supabase';

/**
 * StorageManager: Offline-First Hybrid Storage Engine
 * - Cloud Storage: Supabase PostgreSQL (when online)
 * - Offline Storage: localStorage / IndexedDB (when offline or in remote field camp)
 * - Automatic background syncing when online connectivity returns
 */

class StorageManager {
  constructor() {
    this.draftKey = 'oral_draft_current';
    this.settingsKey = 'oral_settings';
    this.offlineRecordsKey = 'oral_offline_records';
    this.cachedCloudRecordsKey = 'oral_cached_records';
    this.examinersKey = 'oral_examiners_registry';
  }

  // Get raw offline records stored locally
  getOfflineRecords() {
    try {
      const raw = localStorage.getItem(this.offlineRecordsKey);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn('Failed to parse offline records from localStorage', e);
      return [];
    }
  }

  // Set raw offline records stored locally
  setOfflineRecords(records) {
    try {
      localStorage.setItem(this.offlineRecordsKey, JSON.stringify(records));
    } catch (e) {
      console.error('Failed to save offline records to localStorage', e);
    }
  }

  // Get raw cached cloud records
  getCachedCloudRecords() {
    try {
      const raw = localStorage.getItem(this.cachedCloudRecordsKey);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  setCachedCloudRecords(records) {
    try {
      localStorage.setItem(this.cachedCloudRecordsKey, JSON.stringify(records));
    } catch (e) {}
  }


  // Get all examiners from local registry
  getExaminers() {
    try {
      const raw = localStorage.getItem(this.examinersKey);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  // Save or update examiner profile locally
  saveExaminerProfile(examiner) {
    if (!examiner || !examiner.examinerId) return;
    try {
      const examiners = this.getExaminers().filter(e => e.examinerId !== examiner.examinerId);
      const updated = [examiner, ...examiners];
      localStorage.setItem(this.examinersKey, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save examiner to localStorage', e);
    }
  }

  // Retrieve an examiner by their examinerId
  getExaminerById(examinerId) {
    if (!examinerId) return null;
    const all = this.getExaminers();
    return all.find(e => String(e.examinerId).trim().toLowerCase() === String(examinerId).trim().toLowerCase()) || null;
  }

  getPendingCount() {
    return this.getOfflineRecords().length;
  }

  async saveRecord(record) {
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

    // 1. If online and Supabase is configured, try saving to Cloud
    if (isOnline && isSupabaseConfigured) {
      try {
        const payload = toClinicalRecordPayload({ ...record });
        const saved = await saveClinicalRecord(payload);
        const savedFull = {
          ...record,
          id: saved.id,
          _isOffline: false,
          _synced: true,
          updatedAt: new Date().toISOString()
        };

        // Update local cache
        const cached = this.getCachedCloudRecords().filter(r => r.id !== saved.id);
        this.setCachedCloudRecords([savedFull, ...cached]);

        return savedFull;
      } catch (cloudErr) {
        console.warn('Cloud save failed, falling back to local offline storage:', cloudErr);
      }
    }

    // 2. Offline Fallback: Save to local offline storage
    const offlineId = record.id && !String(record.id).startsWith('offline_')
      ? record.id
      : `offline_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const offlineRecord = {
      ...record,
      id: offlineId,
      _isOffline: true,
      _synced: false,
      updatedAt: new Date().toISOString(),
      createdAt: record.createdAt || new Date().toISOString()
    };

    const currentOffline = this.getOfflineRecords();
    const existingIndex = currentOffline.findIndex(
      r => r.id === offlineId || (record.participantId && r.participantId === record.participantId && !r._synced)
    );

    if (existingIndex >= 0) {
      currentOffline[existingIndex] = offlineRecord;
    } else {
      currentOffline.unshift(offlineRecord);
    }

    this.setOfflineRecords(currentOffline);

    // Also update cached list so UI reflects the change immediately
    const cached = this.getCachedCloudRecords().filter(r => r.id !== offlineId);
    this.setCachedCloudRecords([offlineRecord, ...cached]);

    return offlineRecord;
  }

  async getAllRecords() {
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    let cloudRecords = [];
    let cloudSuccess = false;

    if (isOnline && isSupabaseConfigured) {
      try {
        cloudRecords = await getClinicalRecords();
        this.setCachedCloudRecords(cloudRecords);
        cloudSuccess = true;
      } catch (err) {
        console.warn('Could not fetch cloud records, loading cached records instead:', err);
      }
    }

    if (!cloudSuccess) {
      cloudRecords = this.getCachedCloudRecords();
    }

    // Always merge pending offline records on top
    const offlineRecords = this.getOfflineRecords();
    const offlineIds = new Set(offlineRecords.map(r => r.id));
    const offlineParticipantIds = new Set(offlineRecords.map(r => r.participantId).filter(Boolean));

    // Filter out cloud duplicates if an offline draft/edit exists
    const filteredCloud = cloudRecords.filter(
      r => !offlineIds.has(r.id) && !offlineParticipantIds.has(r.participantId)
    );

    return [...offlineRecords, ...filteredCloud];
  }

  async syncPendingRecords() {
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    if (!isOnline || !isSupabaseConfigured) {
      return { success: false, syncedCount: 0, error: 'Offline or Supabase not configured' };
    }

    const pending = this.getOfflineRecords();
    if (pending.length === 0) {
      return { success: true, syncedCount: 0 };
    }

    let syncedCount = 0;
    const remaining = [];

    for (const record of pending) {
      try {
        const payload = toClinicalRecordPayload({ ...record });
        const cleanPayload = { ...payload };
        if (cleanPayload.id && String(cleanPayload.id).startsWith('offline_')) {
          delete cleanPayload.id;
        }

        const saved = await saveClinicalRecord(cleanPayload);
        syncedCount++;

        // Add to cached cloud list with the new cloud ID
        const cloudRecord = { ...record, id: saved.id, _isOffline: false, _synced: true };
        const cached = this.getCachedCloudRecords().filter(r => r.id !== record.id && r.id !== saved.id);
        this.setCachedCloudRecords([cloudRecord, ...cached]);
      } catch (err) {
        console.error('Failed to sync record:', record.participantId, err);
        remaining.push(record);
      }
    }

    this.setOfflineRecords(remaining);
    return { success: true, syncedCount, remainingCount: remaining.length };
  }

  async deleteRecord(id) {
    // 1. Delete from offline storage if it exists
    const offline = this.getOfflineRecords().filter(r => r.id !== id);
    this.setOfflineRecords(offline);

    // 2. Delete from cached cloud list
    const cached = this.getCachedCloudRecords().filter(r => r.id !== id);
    this.setCachedCloudRecords(cached);

    // 3. If online and not a purely local offline ID, delete from Supabase
    if (!String(id).startsWith('offline_') && isSupabaseConfigured && (typeof navigator === 'undefined' || navigator.onLine)) {
      try {
        await deleteClinicalRecord(id);
      } catch (e) {
        console.warn('Could not delete from cloud:', e);
      }
    }
  }

  async clearAllRecords() {
    this.setOfflineRecords([]);
    this.setCachedCloudRecords([]);
    if (isSupabaseConfigured && (typeof navigator === 'undefined' || navigator.onLine)) {
      try {
        await deleteAllClinicalRecords();
      } catch (e) {
        console.warn('Could not clear cloud records:', e);
      }
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
