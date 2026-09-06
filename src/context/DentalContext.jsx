import React, { createContext, useContext, useState, useEffect } from 'react';
import { CLINICAL_CONSTANTS } from '../utils/clinicalConstants';
import { storage } from '../utils/storage';
import { calcDMFT, calcAge, getWorstCPI } from '../utils/exportUtils';

const DentalContext = createContext();

export function DentalProvider({ children }) {
  const [currentRecord, setCurrentRecord] = useState(getBlankRecord());
  const [editingRecordId, setEditingRecordId] = useState(null);
  const [records, setRecords] = useState([]);
  const [activeSection, setActiveSection] = useState('sec-general');
  const [theme, setTheme] = useState(() => storage.getSettings().theme || 'light');
  const [audioEnabled, setAudioEnabled] = useState(() => storage.getSettings().audioFeedback !== false);
  const [autoAdvance, setAutoAdvance] = useState(() => storage.getSettings().autoAdvance !== false);
  const [showRoots, setShowRoots] = useState(true);
  const [activeTooth, setActiveTooth] = useState(null);
  const [keypadMode, setKeypadMode] = useState('crown');
  const [helpDrawerOpen, setHelpDrawerOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const [elapsedSecs, setElapsedSecs] = useState(0);

  function getBlankRecord() {
    const teeth = {};
    CLINICAL_CONSTANTS.ALL_TEETH.forEach(t => {
      teeth[t] = { crown: '', root: '' };
    });
    return {
      id: null,
      participantId: '',
      examDate: new Date().toISOString().slice(0, 10),
      examinerId: '',
      village: '',
      location: '',
      sex: '',
      dob: '',
      education: '',
      ethnicGroup: '',
      occupation: '',
      teeth,
      cpi: ['', '', '', '', '', ''],
      loa: ['', '', '', '', '', ''],
      fluorosis: '',
      tdi: '',
      omlPresent: 'N',
      omlSite: '',
      omlCondition: '',
      prosUpper: '',
      prosLower: '',
      treatment: '',
      notes: ''
    };
  }

  // Load records and apply theme on start
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    storage.saveSetting('theme', theme);
  }, [theme]);

  useEffect(() => {
    async function loadInitial() {
      const all = await storage.getAllRecords();
      setRecords(all);
      const draft = storage.loadDraft();
      if (draft && draft.participantId) {
        if (window.confirm(`Restore unsaved draft for participant "${draft.participantId}"?`)) {
          setCurrentRecord(draft);
        } else {
          storage.clearDraft();
        }
      }
    }
    loadInitial();
  }, []);

  // Chairside Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSecs(s => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Web Audio click generator
  function playClick(freq = 750, duration = 0.035) {
    if (!audioEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  }

  function showToastMsg(message, type = 'info') {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'info' });
    }, 2800);
  }

  function toggleTheme() {
    const themes = ['light', 'dark', 'contrast'];
    const nextIdx = (themes.indexOf(theme) + 1) % themes.length;
    const next = themes[nextIdx];
    setTheme(next);
    showToastMsg(`Theme: ${next.toUpperCase()}`, 'info');
  }

  function updateField(key, val) {
    setCurrentRecord(prev => {
      const updated = { ...prev, [key]: val };
      storage.saveDraft(updated);
      return updated;
    });
  }

  function updateToothStatus(toothNum, type, code) {
    playClick(code === '0' ? 600 : 800);
    setCurrentRecord(prev => {
      const currentTooth = prev.teeth[toothNum] || { crown: '', root: '' };
      const updatedTeeth = {
        ...prev.teeth,
        [toothNum]: { ...currentTooth, [type]: code }
      };
      const updated = { ...prev, teeth: updatedTeeth };
      storage.saveDraft(updated);
      return updated;
    });

    if (autoAdvance && type === 'crown') {
      setTimeout(() => {
        navigateTooth(1, toothNum);
      }, 140);
    }
  }

  function navigateTooth(step, fromTooth = activeTooth) {
    if (!fromTooth) return;
    const seq = CLINICAL_CONSTANTS.EXAM_SEQUENCE;
    const idx = seq.indexOf(fromTooth);
    if (idx === -1) return;
    const nextIdx = idx + step;
    if (nextIdx >= seq.length) {
      setActiveTooth(null);
      showToastMsg('Dentition chart completed for all 32 teeth!', 'success');
      return;
    }
    if (nextIdx >= 0) {
      setActiveTooth(seq[nextIdx]);
    }
  }

  function fillAllSound() {
    playClick(900);
    setCurrentRecord(prev => {
      const updatedTeeth = { ...prev.teeth };
      let count = 0;
      CLINICAL_CONSTANTS.ALL_TEETH.forEach(t => {
        if (!updatedTeeth[t]) updatedTeeth[t] = { crown: '', root: '' };
        if (!updatedTeeth[t].crown) {
          updatedTeeth[t].crown = '0';
          count++;
        }
      });
      const updated = { ...prev, teeth: updatedTeeth };
      storage.saveDraft(updated);
      showToastMsg(`Marked ${count} unrecorded teeth as Sound (0).`, 'info');
      return updated;
    });
  }

  function clearArch() {
    if (window.confirm('Clear all dentition status for this participant?')) {
      setCurrentRecord(prev => {
        const clearedTeeth = {};
        CLINICAL_CONSTANTS.ALL_TEETH.forEach(t => {
          clearedTeeth[t] = { crown: '', root: '' };
        });
        const updated = { ...prev, teeth: clearedTeeth };
        storage.saveDraft(updated);
        showToastMsg('Dentition chart cleared.', 'info');
        return updated;
      });
    }
  }

  async function saveRecord() {
    if (!currentRecord.participantId || !currentRecord.participantId.trim()) {
      showToastMsg('Participant ID is required.', 'error');
      setActiveSection('sec-general');
      return false;
    }
    if (!currentRecord.examDate) {
      showToastMsg('Examination date is required.', 'error');
      setActiveSection('sec-general');
      return false;
    }
    if (!currentRecord.location) {
      showToastMsg('Location type is required.', 'error');
      setActiveSection('sec-general');
      return false;
    }
    if (!currentRecord.sex) {
      showToastMsg('Sex is required.', 'error');
      setActiveSection('sec-general');
      return false;
    }

    try {
      const saved = await storage.saveRecord(currentRecord);
      storage.clearDraft();
      const all = await storage.getAllRecords();
      setRecords(all);
      setCurrentRecord(getBlankRecord());
      setEditingRecordId(null);
      setElapsedSecs(0);
      showToastMsg('Record saved ✓ — form cleared for next subject.', 'success');
      setActiveSection('sec-records');
      return true;
    } catch (e) {
      showToastMsg('Failed to save record: ' + e.message, 'error');
      return false;
    }
  }

  function resetForm() {
    if (window.confirm('Clear all entered data for this subject?')) {
      storage.clearDraft();
      setCurrentRecord(getBlankRecord());
      setEditingRecordId(null);
      setElapsedSecs(0);
      showToastMsg('Form cleared.', 'info');
      setActiveSection('sec-general');
    }
  }

  function loadRecordForEdit(record) {
    if (window.confirm(`Load record "${record.participantId}" for editing?`)) {
      setCurrentRecord(JSON.parse(JSON.stringify(record)));
      setEditingRecordId(record.id);
      setActiveSection('sec-general');
      showToastMsg(`Loaded record "${record.participantId}" for editing.`, 'info');
    }
  }

  async function deleteRecord(id, participantId) {
    if (window.confirm(`Delete record for "${participantId}"?`)) {
      await storage.deleteRecord(id);
      const all = await storage.getAllRecords();
      setRecords(all);
      showToastMsg('Record deleted.', 'info');
    }
  }

  const liveDMFT = calcDMFT(currentRecord);
  const liveWorstCPI = getWorstCPI(currentRecord);
  const calculatedAge = calcAge(currentRecord.dob, currentRecord.examDate);

  const mins = String(Math.floor(elapsedSecs / 60)).padStart(2, '0');
  const secs = String(elapsedSecs % 60).padStart(2, '0');
  const timerDisplay = `⏱️ ${mins}:${secs}`;

  const value = {
    currentRecord,
    records,
    activeSection,
    theme,
    audioEnabled,
    autoAdvance,
    showRoots,
    activeTooth,
    keypadMode,
    helpDrawerOpen,
    toast,
    liveDMFT,
    liveWorstCPI,
    calculatedAge,
    timerDisplay,
    setActiveSection,
    setAudioEnabled,
    setAutoAdvance,
    setShowRoots,
    setActiveTooth,
    setKeypadMode,
    setHelpDrawerOpen,
    toggleTheme,
    playClick,
    showToastMsg,
    updateField,
    updateToothStatus,
    navigateTooth,
    fillAllSound,
    clearArch,
    saveRecord,
    resetForm,
    loadRecordForEdit,
    deleteRecord,
    setRecords
  };

  return <DentalContext.Provider value={value}>{children}</DentalContext.Provider>;
}

export function useDental() {
  return useContext(DentalContext);
}
