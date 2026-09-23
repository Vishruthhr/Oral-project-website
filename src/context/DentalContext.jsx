import React, { createContext, useContext, useState, useEffect } from 'react';
import { CLINICAL_CONSTANTS } from '../utils/clinicalConstants';
import { storage } from '../utils/storage';
import { calcDMFT, calcAge, getWorstCPI } from '../utils/exportUtils';
import { AUTH_CONFIG } from '../config/authConfig';

const DentalContext = createContext();

export function DentalProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem('dental_auth_session') === 'true'
  );
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

  function login(username, password) {
    if (!username.trim() || !password.trim()) {
      return { success: false, error: 'Please enter both username and password.' };
    }
    if (username === AUTH_CONFIG.username && password === AUTH_CONFIG.password) {
      sessionStorage.setItem('dental_auth_session', 'true');
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, error: 'Invalid username or password.' };
  }

  function logout() {
    sessionStorage.removeItem('dental_auth_session');
    setIsAuthenticated(false);
    showToastMsg('Logged out successfully.', 'info');
  }

  function getBlankPerio() {
    const perio = {};
    CLINICAL_CONSTANTS.ALL_TEETH.forEach(t => {
      const isUpper = CLINICAL_CONSTANTS.UPPER_TEETH.includes(t);
      const sites = isUpper ? CLINICAL_CONSTANTS.PERIO_SITES_UPPER : CLINICAL_CONSTANTS.PERIO_SITES_LOWER;
      const bop = {};
      const plaque = {};
      const gm = {};
      const pd = {};
      sites.forEach(s => {
        bop[s] = false;
        plaque[s] = false;
        gm[s] = 0;
        pd[s] = 2; // Standard clinical baseline 2mm
      });
      perio[t] = {
        present: true,
        implant: false,
        mobility: 0,
        furcation: { b: 0, dp: 0, mp: 0, l: 0 },
        bop,
        plaque,
        gm,
        pd,
        note: ''
      };
    });
    return perio;
  }

  function getBlankRecord() {
    const teeth = {};
    CLINICAL_CONSTANTS.ALL_TEETH.forEach(t => {
      teeth[t] = { crown: '', root: '' };
    });
    return {
      id: null,
      patientName: '',
      participantId: '',
      examDate: new Date().toISOString().slice(0, 10),
      examinerId: '',
      village: '',
      phoneNumber: '',
      sex: '',
      dob: '',
      education: '',
      ethnicGroup: '',
      ethnicGroupOther: '',
      occupation: '',
      occupationOther: '',
      habits: '',
      teeth,
      perio: getBlankPerio(),
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
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    showToastMsg(`Theme: ${next === 'dark' ? 'Dark Theme' : 'Light Theme'}`, 'info');
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
    if (!currentRecord.patientName || !currentRecord.patientName.trim()) {
      showToastMsg('Patient Name is required.', 'error');
      setActiveSection('sec-general');
      return false;
    }
    if (!currentRecord.participantId || !currentRecord.participantId.trim()) {
      showToastMsg('Patient ID is required.', 'error');
      setActiveSection('sec-general');
      return false;
    }
    if (!currentRecord.examDate) {
      showToastMsg('Examination date is required.', 'error');
      setActiveSection('sec-general');
      return false;
    }
    if (currentRecord.phoneNumber && currentRecord.phoneNumber.trim().length > 0 && currentRecord.phoneNumber.length !== 10) {
      showToastMsg('Phone Number must be exactly 10 digits.', 'error');
      setActiveSection('sec-general');
      return false;
    }
    if (!currentRecord.sex) {
      showToastMsg('Sex is required.', 'error');
      setActiveSection('sec-general');
      return false;
    }
    if (currentRecord.ethnicGroup === 'Other' && (!currentRecord.ethnicGroupOther || !currentRecord.ethnicGroupOther.trim())) {
      showToastMsg('Please specify your Ethnic Group.', 'error');
      setActiveSection('sec-general');
      return false;
    }
    if (currentRecord.occupation === '3' && (!currentRecord.occupationOther || !currentRecord.occupationOther.trim())) {
      showToastMsg('Please specify your Occupation.', 'error');
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
      const cloned = JSON.parse(JSON.stringify(record));
      // Normalize Ethnic Group Other
      if (!cloned.ethnicGroupOther && cloned.ethnicGroup && cloned.ethnicGroup.startsWith('Other: ')) {
        cloned.ethnicGroupOther = cloned.ethnicGroup.slice(7);
        cloned.ethnicGroup = 'Other';
      }
      // Normalize Occupation Other
      if (!cloned.occupationOther && cloned.occupation && cloned.occupation.startsWith('Other: ')) {
        cloned.occupationOther = cloned.occupation.slice(7);
        cloned.occupation = '3';
      }
      setCurrentRecord(cloned);
      setEditingRecordId(record.id);
      setActiveSection('sec-general');
      showToastMsg(`Loaded record "${record.participantId}" for editing.`, 'info');
    }
  }

  // Perio statistics calculation
  function calcPerioStats(record) {
    const perio = record.perio || {};
    let totalSites = 0;
    let bopSites = 0;
    let plaqueSites = 0;
    let sumPD = 0;
    let countPD = 0;
    let sumCAL = 0;
    let countCAL = 0;
    let pockets4mm = 0;
    let pockets6mm = 0;
    let furcationsCount = 0;
    let implantsCount = 0;
    let teethPresent = 0;
    let teethMissing = 0;

    CLINICAL_CONSTANTS.ALL_TEETH.forEach(t => {
      const tooth = perio[t];
      if (!tooth) return;
      if (tooth.present) {
        teethPresent++;
        if (tooth.implant) implantsCount++;
        if (tooth.furcation) {
          Object.values(tooth.furcation).forEach(g => {
            if (g > 0) furcationsCount++;
          });
        }
        const isUpper = CLINICAL_CONSTANTS.UPPER_TEETH.includes(t);
        const sites = isUpper ? CLINICAL_CONSTANTS.PERIO_SITES_UPPER : CLINICAL_CONSTANTS.PERIO_SITES_LOWER;
        sites.forEach(s => {
          totalSites++;
          if (tooth.bop && tooth.bop[s]) bopSites++;
          if (tooth.plaque && tooth.plaque[s]) plaqueSites++;
          const pdVal = tooth.pd && tooth.pd[s] !== undefined && tooth.pd[s] !== '' ? Number(tooth.pd[s]) : 0;
          const gmVal = tooth.gm && tooth.gm[s] !== undefined && tooth.gm[s] !== '' ? Number(tooth.gm[s]) : 0;
          if (pdVal > 0) {
            sumPD += pdVal;
            countPD++;
            if (pdVal >= 4 && pdVal < 6) pockets4mm++;
            else if (pdVal >= 6) pockets6mm++;
            const calVal = pdVal + gmVal;
            sumCAL += calVal;
            countCAL++;
          }
        });
      } else {
        teethMissing++;
      }
    });

    const bopPercent = totalSites > 0 ? Math.round((bopSites / totalSites) * 100) : 0;
    const plaquePercent = totalSites > 0 ? Math.round((plaqueSites / totalSites) * 100) : 0;
    const meanPD = countPD > 0 ? (sumPD / countPD).toFixed(1) : '0.0';
    const meanCAL = countCAL > 0 ? (sumCAL / countCAL).toFixed(1) : '0.0';
    const pockets4mmPercent = countPD > 0 ? Math.round((pockets4mm / countPD) * 100) : 0;
    const pockets6mmPercent = countPD > 0 ? Math.round((pockets6mm / countPD) * 100) : 0;

    return {
      totalSites,
      bopSites,
      bopPercent,
      plaqueSites,
      plaquePercent,
      meanPD,
      meanCAL,
      pockets4mm,
      pockets4mmPercent,
      pockets6mm,
      pockets6mmPercent,
      furcationsCount,
      implantsCount,
      teethPresent,
      teethMissing
    };
  }

  function updatePerioSite(toothNum, field, siteKey, val) {
    playClick();
    setCurrentRecord(prev => {
      const updatedPerio = { ...prev.perio };
      const currentTooth = updatedPerio[toothNum] || {
        present: true,
        implant: false,
        mobility: 0,
        furcation: { b: 0, dp: 0, mp: 0, l: 0 },
        bop: {},
        plaque: {},
        gm: {},
        pd: {},
        note: ''
      };
      const updatedField = { ...currentTooth[field], [siteKey]: val };
      updatedPerio[toothNum] = { ...currentTooth, [field]: updatedField };
      const updated = { ...prev, perio: updatedPerio };
      storage.saveDraft(updated);
      return updated;
    });
  }

  function updatePerioTooth(toothNum, key, val) {
    playClick();
    setCurrentRecord(prev => {
      const updatedPerio = { ...prev.perio };
      const currentTooth = updatedPerio[toothNum] || {};
      updatedPerio[toothNum] = { ...currentTooth, [key]: val };
      const updated = { ...prev, perio: updatedPerio };
      storage.saveDraft(updated);
      return updated;
    });
  }

  function togglePerioPresent(toothNum) {
    playClick();
    setCurrentRecord(prev => {
      const updatedPerio = { ...prev.perio };
      const currentTooth = updatedPerio[toothNum] || { present: true };
      const nextPresent = !currentTooth.present;
      updatedPerio[toothNum] = { ...currentTooth, present: nextPresent };
      const updated = { ...prev, perio: updatedPerio };
      storage.saveDraft(updated);
      showToastMsg(`Tooth #${toothNum}: ${nextPresent ? 'Present' : 'Missing'}`, 'info');
      return updated;
    });
  }

  function togglePerioImplant(toothNum) {
    playClick();
    setCurrentRecord(prev => {
      const updatedPerio = { ...prev.perio };
      const currentTooth = updatedPerio[toothNum] || { implant: false };
      const nextImplant = !currentTooth.implant;
      updatedPerio[toothNum] = { ...currentTooth, implant: nextImplant };
      const updated = { ...prev, perio: updatedPerio };
      storage.saveDraft(updated);
      showToastMsg(`Tooth #${toothNum}: ${nextImplant ? 'Marked as Implant' : 'Natural Tooth'}`, 'info');
      return updated;
    });
  }

  function setPerioFurcation(toothNum, furcSite, grade) {
    playClick();
    setCurrentRecord(prev => {
      const updatedPerio = { ...prev.perio };
      const currentTooth = updatedPerio[toothNum] || { furcation: {} };
      const updatedFurc = { ...currentTooth.furcation, [furcSite]: grade };
      updatedPerio[toothNum] = { ...currentTooth, furcation: updatedFurc };
      const updated = { ...prev, perio: updatedPerio };
      storage.saveDraft(updated);
      return updated;
    });
  }

  function fillPerioHealthy() {
    playClick(900);
    setCurrentRecord(prev => {
      const updatedPerio = {};
      CLINICAL_CONSTANTS.ALL_TEETH.forEach(t => {
        const isUpper = CLINICAL_CONSTANTS.UPPER_TEETH.includes(t);
        const sites = isUpper ? CLINICAL_CONSTANTS.PERIO_SITES_UPPER : CLINICAL_CONSTANTS.PERIO_SITES_LOWER;
        const bop = {};
        const plaque = {};
        const gm = {};
        const pd = {};
        sites.forEach(s => {
          bop[s] = false;
          plaque[s] = false;
          gm[s] = 0;
          pd[s] = 2;
        });
        updatedPerio[t] = {
          present: true,
          implant: false,
          mobility: 0,
          furcation: { b: 0, dp: 0, mp: 0, l: 0 },
          bop,
          plaque,
          gm,
          pd,
          note: ''
        };
      });
      const updated = { ...prev, perio: updatedPerio };
      storage.saveDraft(updated);
      showToastMsg('Filled all teeth with healthy baseline (PD 2mm, GM 0mm, BOP 0%).', 'info');
      return updated;
    });
  }

  function clearPerio() {
    if (window.confirm('Clear all periodontal probing measurements for this subject?')) {
      setCurrentRecord(prev => {
        const updated = { ...prev, perio: getBlankPerio() };
        storage.saveDraft(updated);
        showToastMsg('Periodontal chart cleared.', 'info');
        return updated;
      });
    }
  }

  function setAllPerioPresent(isPresent) {
    playClick();
    setCurrentRecord(prev => {
      const updatedPerio = { ...prev.perio };
      CLINICAL_CONSTANTS.ALL_TEETH.forEach(t => {
        if (!updatedPerio[t]) updatedPerio[t] = {};
        updatedPerio[t] = { ...updatedPerio[t], present: isPresent };
      });
      const updated = { ...prev, perio: updatedPerio };
      storage.saveDraft(updated);
      showToastMsg(isPresent ? 'Marked all 32 teeth as Present.' : 'Marked all teeth as Missing.', 'info');
      return updated;
    });
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
  const livePerioStats = calcPerioStats(currentRecord);
  const calculatedAge = calcAge(currentRecord.dob, currentRecord.examDate);

  const mins = String(Math.floor(elapsedSecs / 60)).padStart(2, '0');
  const secs = String(elapsedSecs % 60).padStart(2, '0');
  const timerDisplay = `⏱️ ${mins}:${secs}`;

  const value = {
    isAuthenticated,
    login,
    logout,
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
    livePerioStats,
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
    updatePerioSite,
    updatePerioTooth,
    togglePerioPresent,
    togglePerioImplant,
    setPerioFurcation,
    fillPerioHealthy,
    clearPerio,
    setAllPerioPresent,
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
