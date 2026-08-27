/**
 * Clinical Oral Health Assessment - Application Controller
 * Complete Form Event Engine, Periodontal Sextant Form Renderer, Calculations & Storage Sync
 */

class ClinicalOralApp {
  constructor() {
    this.currentRecord = this.getBlankRecord();
    this.editingRecordId = null;
    this.records = [];
    this.filteredRecords = [];
    this.activeSection = 'sec-general';
    this.searchQuery = '';
    
    this.examStartTime = Date.now();
    this.examTimerInterval = null;
    this.audioContext = null;

    this.settings = window.storageManager ? window.storageManager.getSettings() : {
      autoAdvance: true,
      haptics: true,
      audioFeedback: true,
      theme: 'light'
    };

    this.odontogram = null;
    this.exporter = null;
  }

  getBlankRecord() {
    const teeth = {};
    CLINICAL_CONSTANTS.ALL_TEETH.forEach(t => {
      teeth[t] = { crown: '', root: '' };
    });

    return {
      id: null,
      participantId: '',
      examDate: new Date().toISOString().slice(0, 10),
      examinerId: this.settings ? (this.settings.defaultExaminer || '') : '',
      village: this.settings ? (this.settings.defaultVillage || '') : '',
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
      notes: '',
      createdAt: null,
      updatedAt: null
    };
  }

  async init() {
    // Default to Light Theme
    this.applyTheme(this.settings.theme || 'light');
    this.initAudioContext();
    this.startExamTimer();

    this.exporter = new ExportManager(this);
    this.odontogram = new OdontogramController(this);

    this.bindDOM();
    this.bindNavigation();
    this.bindGeneralFields();
    this.renderSextants();
    this.initSelects();
    this.bindOtherFindings();
    this.bindRecordsTab();
    this.bindModalsAndHelp();

    // Check for draft
    const draft = window.storageManager ? window.storageManager.loadDraft() : null;
    if (draft && draft.participantId) {
      if (confirm(`A previous unsaved draft for participant "${draft.participantId}" was found. Restore it?`)) {
        this.currentRecord = draft;
        this.showToast('Restored unsaved draft.', 'info');
      } else {
        if (window.storageManager) window.storageManager.clearDraft();
      }
    }

    this.syncFormFromState();
    await this.refreshRecordsList();
    this.updateGlobalSummary();
  }

  getCurrentRecord() {
    return this.currentRecord;
  }

  /* ====================== AUDIO & HAPTIC FEEDBACK ====================== */
  initAudioContext() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioContext = new AudioCtx();
      }
    } catch (e) {}
  }

  playClinicalClick(freq = 750, duration = 0.035) {
    if (!this.settings.audioFeedback) return;
    if (!this.audioContext) this.initAudioContext();
    if (!this.audioContext) return;

    try {
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);
      gain.gain.setValueAtTime(0.12, this.audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioContext.destination);

      osc.start();
      osc.stop(this.audioContext.currentTime + duration);
    } catch (e) {}
  }

  isHapticsEnabled() {
    return this.settings.haptics !== false;
  }

  triggerHaptic(duration = 15) {
    if (navigator.vibrate && this.isHapticsEnabled()) {
      try { navigator.vibrate(duration); } catch (e) {}
    }
  }

  /* ====================== EXAM TIMER ====================== */
  startExamTimer() {
    this.examStartTime = Date.now();
    if (this.examTimerInterval) clearInterval(this.examTimerInterval);
    this.examTimerInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this.examStartTime) / 1000);
      const mins = String(Math.floor(elapsed / 60)).padStart(2, '0');
      const secs = String(elapsed % 60).padStart(2, '0');
      const timerEl = document.getElementById('examTimerBadge');
      if (timerEl) {
        timerEl.textContent = `⏱️ ${mins}:${secs}`;
      }
    }, 1000);
  }

  resetExamTimer() {
    this.examStartTime = Date.now();
  }

  /* ====================== THEME ENGINE ====================== */
  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const themeBtn = document.getElementById('btnThemeToggle');
    if (themeBtn) {
      const icons = { light: '☀️ Light Clinic', dark: '🌙 Dark Pro', contrast: '👁️ High Contrast' };
      themeBtn.innerHTML = icons[theme] || '🎨 Theme';
    }
  }

  cycleTheme() {
    const themes = ['light', 'dark', 'contrast'];
    const current = this.settings.theme || 'light';
    const nextIdx = (themes.indexOf(current) + 1) % themes.length;
    const nextTheme = themes[nextIdx];
    this.settings.theme = nextTheme;
    if (window.storageManager) window.storageManager.saveSetting('theme', nextTheme);
    this.applyTheme(nextTheme);
    this.showToast(`Theme switched to ${nextTheme.toUpperCase()}`, 'info');
  }

  /* ====================== NAVIGATION ====================== */
  bindNavigation() {
    const allNavItems = document.querySelectorAll('[data-nav-target], .tab-item');
    allNavItems.forEach(item => {
      item.addEventListener('click', () => {
        const targetSection = item.dataset.navTarget || item.dataset.section;
        this.navigateToSection(targetSection);
      });
    });

    const btnTheme = document.getElementById('btnThemeToggle');
    if (btnTheme) {
      btnTheme.addEventListener('click', () => this.cycleTheme());
    }

    const btnAudio = document.getElementById('btnAudioToggle');
    if (btnAudio) {
      btnAudio.addEventListener('click', () => {
        this.settings.audioFeedback = !this.settings.audioFeedback;
        if (window.storageManager) window.storageManager.saveSetting('audioFeedback', this.settings.audioFeedback);
        btnAudio.classList.toggle('active', this.settings.audioFeedback);
        this.showToast(`Audio Clicks ${this.settings.audioFeedback ? 'Enabled 🔊' : 'Muted 🔇'}`, 'info');
        if (this.settings.audioFeedback) this.playClinicalClick(880);
      });
    }

    // ScrollSpy
    const sectionIds = ['sec-general', 'sec-dentition', 'sec-perio', 'sec-periodontal', 'sec-other', 'sec-records'];
    window.addEventListener('scroll', () => {
      let activeId = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 150) activeId = id;
      }
      this.highlightNavButtons(activeId);
    }, { passive: true });
  }

  navigateToSection(sectionId) {
    if (!sectionId) return;
    this.triggerHaptic(10);
    this.playClinicalClick();
    this.activeSection = sectionId;
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    this.highlightNavButtons(sectionId);
  }

  highlightNavButtons(sectionId) {
    document.querySelectorAll('[data-nav-target], .tab-item').forEach(b => {
      const target = b.dataset.navTarget || b.dataset.section;
      b.classList.toggle('active', target === sectionId || (sectionId === 'sec-periodontal' && target === 'sec-perio'));
    });
  }

  /* ====================== GENERAL DEMOGRAPHICS ====================== */
  bindGeneralFields() {
    const textInputs = [
      'f_participantId', 'f_examDate', 'f_examinerId', 'f_village',
      'f_dob', 'f_education', 'f_ethnicGroup', 'f_occupation', 'f_notes'
    ];

    textInputs.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('input', (e) => {
        const prop = id.replace('f_', '');
        this.currentRecord[prop] = e.target.value;
        if (prop === 'participantId') {
          this.updatePatientBanner(e.target.value);
        }
        if (prop === 'dob' || prop === 'examDate') {
          this.updateAgeDisplay();
        }
        this.clearFieldError(id);
        this.onFormChanged();
      });
    });

    // Location Chips
    document.querySelectorAll('#chips_location .chip, #chips_location .segmented-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.triggerHaptic();
        this.playClinicalClick();
        document.querySelectorAll('#chips_location .chip, #chips_location .segmented-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.currentRecord.location = btn.dataset.val;
        this.clearFieldError('chips_location');
        this.onFormChanged();
      });
    });

    // Sex Chips
    document.querySelectorAll('#chips_sex .chip, #chips_sex .segmented-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.triggerHaptic();
        this.playClinicalClick();
        document.querySelectorAll('#chips_sex .chip, #chips_sex .segmented-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.currentRecord.sex = btn.dataset.val;
        this.clearFieldError('chips_sex');
        this.onFormChanged();
      });
    });
  }

  updatePatientBanner(id) {
    const bannerIdEl = document.getElementById('activePatientBadge');
    if (bannerIdEl) {
      bannerIdEl.innerHTML = id ? `Patient: <b>${id}</b>` : 'Patient: <i>Unassigned</i>';
    }
  }

  updateAgeDisplay() {
    const age = this.calcAge(this.currentRecord.dob, this.currentRecord.examDate);
    const pill = document.getElementById('agePill') || document.getElementById('ageDisplayPill');
    if (pill) {
      pill.textContent = age !== null ? `${age} years` : '— years';
    }
  }

  /* ====================== SECTION 3: PERIODONTAL SEXTANTS ====================== */
  renderSextants() {
    const grid = document.getElementById('sextantGrid') || document.getElementById('sextantsGrid');
    if (!grid) return;

    const sextants = CLINICAL_CONSTANTS.SEXTANTS;
    grid.innerHTML = sextants.map((sx, i) => `
      <div class="sextant-card" data-sextant="${i}">
        <div class="sx-title">
          <span class="sx-badge">${sx.name}</span>
          <span class="sx-teeth">${sx.teeth}</span>
        </div>
        
        <div class="sx-field">
          <label class="sx-label">CPI (Bleeding / Pockets)</label>
          <select data-cpi="${i}" class="input-select sx-select">
            ${this.buildSelectOptions(CLINICAL_CONSTANTS.CPI_OPTS, this.currentRecord.cpi[i])}
          </select>
        </div>

        <div class="sx-field">
          <label class="sx-label">LOA (Loss of Attachment)</label>
          <select data-loa="${i}" class="input-select sx-select">
            ${this.buildSelectOptions(CLINICAL_CONSTANTS.LOA_OPTS, this.currentRecord.loa[i])}
          </select>
        </div>
      </div>
    `).join('');

    // Attach listeners
    grid.querySelectorAll('[data-cpi]').forEach(s => {
      s.addEventListener('change', (e) => {
        this.currentRecord.cpi[+s.dataset.cpi] = e.target.value;
        this.updateGlobalSummary();
        this.onFormChanged();
      });
    });

    grid.querySelectorAll('[data-loa]').forEach(s => {
      s.addEventListener('change', (e) => {
        this.currentRecord.loa[+s.dataset.loa] = e.target.value;
        this.onFormChanged();
      });
    });
  }

  buildSelectOptions(list, selected) {
    return list.map(([v, l]) => `<option value="${v}" ${String(v) === String(selected) ? 'selected' : ''}>${l}</option>`).join('');
  }

  fillSelect(id, list, val) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = this.buildSelectOptions(list, val);
  }

  initSelects() {
    this.fillSelect('f_fluorosis', CLINICAL_CONSTANTS.FLUOROSIS_OPTS, this.currentRecord.fluorosis);
    this.fillSelect('f_tdi', CLINICAL_CONSTANTS.TDI_OPTS, this.currentRecord.tdi);
    this.fillSelect('f_omlSite', CLINICAL_CONSTANTS.OML_SITE_OPTS, this.currentRecord.omlSite);
    this.fillSelect('f_omlCondition', CLINICAL_CONSTANTS.OML_COND_OPTS, this.currentRecord.omlCondition);
    this.fillSelect('f_prosUpper', CLINICAL_CONSTANTS.PROS_OPTS, this.currentRecord.prosUpper);
    this.fillSelect('f_prosLower', CLINICAL_CONSTANTS.PROS_OPTS, this.currentRecord.prosLower);
    this.fillSelect('f_treatment', CLINICAL_CONSTANTS.TREAT_OPTS, this.currentRecord.treatment);
  }

  /* ====================== OTHER FINDINGS ====================== */
  bindOtherFindings() {
    ['f_fluorosis', 'f_tdi', 'f_omlSite', 'f_omlCondition', 'f_prosUpper', 'f_prosLower', 'f_treatment'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('change', (e) => {
        const map = {
          f_fluorosis: 'fluorosis',
          f_tdi: 'tdi',
          f_omlSite: 'omlSite',
          f_omlCondition: 'omlCondition',
          f_prosUpper: 'prosUpper',
          f_prosLower: 'prosLower',
          f_treatment: 'treatment'
        };
        this.currentRecord[map[id]] = e.target.value;
        this.onFormChanged();
      });
    });

    // OML Yes / No toggle
    document.querySelectorAll('#chips_oml .chip, #chips_oml .segmented-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.triggerHaptic();
        this.playClinicalClick();
        document.querySelectorAll('#chips_oml .chip, #chips_oml .segmented-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.currentRecord.omlPresent = btn.dataset.val;
        const details = document.getElementById('omlDetails') || document.getElementById('omlDetailsGroup');
        if (details) {
          details.style.display = btn.dataset.val === 'Y' ? 'grid' : 'none';
        }
        this.onFormChanged();
      });
    });

    // Save & Reset action buttons
    const btnSave = document.getElementById('btnSave') || document.getElementById('btnSaveRecord');
    const btnSaveStrip = document.getElementById('btnSaveStrip') || document.getElementById('btnSaveSticky');
    const btnReset = document.getElementById('btnReset') || document.getElementById('btnClearForm');

    if (btnSave) btnSave.addEventListener('click', () => this.handleSaveRecord());
    if (btnSaveStrip) btnSaveStrip.addEventListener('click', () => this.handleSaveRecord());
    if (btnReset) btnReset.addEventListener('click', () => this.confirmResetForm());
  }

  /* ====================== FORM SYNC & STATE ====================== */
  syncFormFromState() {
    const r = this.currentRecord;

    const setVal = (id, v) => { const el = document.getElementById(id); if (el) el.value = v || ''; };
    setVal('f_participantId', r.participantId);
    setVal('f_examDate', r.examDate);
    setVal('f_examinerId', r.examinerId);
    setVal('f_village', r.village);
    setVal('f_dob', r.dob);
    setVal('f_education', r.education);
    setVal('f_ethnicGroup', r.ethnicGroup);
    setVal('f_occupation', r.occupation);
    setVal('f_notes', r.notes);

    this.updatePatientBanner(r.participantId);
    this.updateAgeDisplay();

    document.querySelectorAll('#chips_location .chip, #chips_location .segmented-btn').forEach(b => {
      b.classList.toggle('selected', b.dataset.val === r.location);
    });

    document.querySelectorAll('#chips_sex .chip, #chips_sex .segmented-btn').forEach(b => {
      b.classList.toggle('selected', b.dataset.val === r.sex);
    });

    document.querySelectorAll('#chips_oml .chip, #chips_oml .segmented-btn').forEach(b => {
      b.classList.toggle('selected', b.dataset.val === (r.omlPresent || 'N'));
    });
    const omlDetails = document.getElementById('omlDetails') || document.getElementById('omlDetailsGroup');
    if (omlDetails) {
      omlDetails.style.display = r.omlPresent === 'Y' ? 'grid' : 'none';
    }

    this.initSelects();

    if (this.odontogram) {
      this.odontogram.renderArch();
    }
    this.renderSextants();
    this.updateGlobalSummary();
  }

  onFormChanged() {
    if (window.storageManager) {
      window.storageManager.saveDraft(this.currentRecord);
    }
  }

  /* ====================== VALIDATION & SAVE ====================== */
  validateForm() {
    let isValid = true;
    const r = this.currentRecord;

    const checks = [
      ['f_participantId', r.participantId && r.participantId.trim() !== '', 'Participant ID is required.'],
      ['f_examDate', r.examDate && r.examDate.trim() !== '', 'Examination date is required.'],
      ['chips_location', r.location !== '', 'Select a location.'],
      ['chips_sex', r.sex !== '', 'Select sex.']
    ];

    checks.forEach(([id, valid, msg]) => {
      const errEl = document.getElementById('err_' + id.replace('f_', '').replace('chips_', ''));
      const fieldEl = document.getElementById(id);
      if (!valid) {
        isValid = false;
        if (errEl) { errEl.textContent = msg; errEl.classList.add('show'); }
        if (fieldEl) fieldEl.classList.add('invalid');
      } else {
        if (errEl) errEl.classList.remove('show');
        if (fieldEl) fieldEl.classList.remove('invalid');
      }
    });

    if (!isValid) {
      this.navigateToSection('sec-general');
      this.showToast('Please complete the required fields (marked *) in General Information.', 'error');
    }

    return isValid;
  }

  clearFieldError(inputId) {
    const input = document.getElementById(inputId);
    const errId = 'err_' + inputId.replace('f_', '').replace('chips_', '');
    const err = document.getElementById(errId);
    if (input) input.classList.remove('invalid');
    if (err) err.classList.remove('show');
  }

  async handleSaveRecord() {
    if (!this.validateForm()) return;

    try {
      const recordToSave = JSON.parse(JSON.stringify(this.currentRecord));
      await window.storageManager.saveRecord(recordToSave);
      if (window.storageManager) window.storageManager.clearDraft();

      const action = this.editingRecordId ? 'updated' : 'saved';
      this.showToast(`Record saved ✓ — form cleared for next subject.`, 'success');
      this.playClinicalClick(1000);

      this.editingRecordId = null;
      this.currentRecord = this.getBlankRecord();
      this.resetExamTimer();
      this.syncFormFromState();
      await this.refreshRecordsList();

      this.navigateToSection('sec-records');
    } catch (err) {
      console.error('Save failed:', err);
      this.showToast('Failed to save record: ' + err.message, 'error');
    }
  }

  confirmResetForm() {
    if (confirm('Clear all entered data for this subject?')) {
      if (window.storageManager) window.storageManager.clearDraft();
      this.editingRecordId = null;
      this.currentRecord = this.getBlankRecord();
      this.resetExamTimer();
      this.syncFormFromState();
      this.showToast('Form cleared for new examination.', 'info');
      this.navigateToSection('sec-general');
    }
  }

  /* ====================== RECORDS TAB ====================== */
  bindRecordsTab() {
    const searchInput = document.getElementById('searchRecordsInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.filterAndRenderRecords();
      });
    }

    const btnExportCSV = document.getElementById('btnExportCSV');
    if (btnExportCSV) {
      btnExportCSV.addEventListener('click', () => {
        this.exporter.exportCSV(this.records);
      });
    }

    const btnExportJSON = document.getElementById('btnExportJSON');
    if (btnExportJSON) {
      btnExportJSON.addEventListener('click', () => {
        this.exporter.exportJSON(this.records);
      });
    }

    const btnImportJSON = document.getElementById('btnImportJSON');
    const fileImportInput = document.getElementById('fileImportInput');
    if (btnImportJSON && fileImportInput) {
      btnImportJSON.addEventListener('click', () => fileImportInput.click());
      fileImportInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          this.exporter.importJSON(e.target.files[0]);
          e.target.value = '';
        }
      });
    }

    const btnClearAllRecords = document.getElementById('btnClearAllRecords');
    if (btnClearAllRecords) {
      btnClearAllRecords.addEventListener('click', async () => {
        if (this.records.length === 0) return;
        if (confirm(`Permanently delete ALL ${this.records.length} saved records? This cannot be undone.`)) {
          await window.storageManager.clearAllRecords();
          await this.refreshRecordsList();
          this.showToast('All records deleted.', 'info');
        }
      });
    }
  }

  async refreshRecordsList() {
    this.records = await window.storageManager.getAllRecords();
    this.filterAndRenderRecords();
    this.updateStatsCards();
  }

  filterAndRenderRecords() {
    if (!this.searchQuery) {
      this.filteredRecords = [...this.records];
    } else {
      this.filteredRecords = this.records.filter(r => {
        const id = (r.participantId || '').toLowerCase();
        const examiner = (r.examinerId || '').toLowerCase();
        const village = (r.village || '').toLowerCase();
        const date = (r.examDate || '').toLowerCase();
        return id.includes(this.searchQuery) ||
               examiner.includes(this.searchQuery) ||
               village.includes(this.searchQuery) ||
               date.includes(this.searchQuery);
      });
    }

    this.renderRecordsTable();
  }

  updateStatsCards() {
    const countEl = document.getElementById('statTotalRecords');
    const meanDmftEl = document.getElementById('statMeanDMFT');
    const meanAgeEl = document.getElementById('statMeanAge');
    const cariesFreeEl = document.getElementById('statCariesFree');

    if (countEl) countEl.textContent = this.records.length;

    if (this.records.length === 0) {
      if (meanDmftEl) meanDmftEl.textContent = '0.0';
      if (meanAgeEl) meanAgeEl.textContent = '—';
      if (cariesFreeEl) cariesFreeEl.textContent = '0%';
      return;
    }

    let totalDMFT = 0;
    let totalAge = 0;
    let ageCount = 0;
    let cariesFreeCount = 0;

    this.records.forEach(r => {
      const stats = this.calcDMFT(r);
      totalDMFT += stats.DMFT;
      if (stats.DMFT === 0) cariesFreeCount++;

      const age = this.calcAge(r.dob, r.examDate);
      if (age !== null) {
        totalAge += age;
        ageCount++;
      }
    });

    if (meanDmftEl) meanDmftEl.textContent = (totalDMFT / this.records.length).toFixed(1);
    if (meanAgeEl) meanAgeEl.textContent = ageCount > 0 ? (totalAge / ageCount).toFixed(1) + ' yrs' : '—';
    if (cariesFreeEl) cariesFreeEl.textContent = Math.round((cariesFreeCount / this.records.length) * 100) + '%';
  }

  renderRecordsTable() {
    const wrap = document.getElementById('recordsTableWrap') || document.getElementById('recordsTableContainer');
    const countBadge = document.getElementById('recCount') || document.getElementById('recordsCountBadge');
    
    if (countBadge) {
      countBadge.textContent = `${this.records.length} record${this.records.length === 1 ? '' : 's'} saved this session`;
    }

    if (!wrap) return;

    if (this.filteredRecords.length === 0) {
      wrap.innerHTML = `<div class="empty-note">No records saved yet in this session. Fill the form above and click "Validate &amp; Save Record".</div>`;
      return;
    }

    const rows = this.filteredRecords.map(r => {
      const stats = this.calcDMFT(r);
      const age = this.calcAge(r.dob, r.examDate);
      const locLabel = { '1': 'Urban', '2': 'Peri-urban', '3': 'Rural' }[r.location] || '—';

      return `
        <tr class="record-row" data-id="${r.id}">
          <td class="col-id"><b>${r.participantId || '—'}</b></td>
          <td class="col-date">${r.examDate || '—'}</td>
          <td class="col-age">${age !== null ? age : '—'}</td>
          <td class="col-loc">${locLabel}</td>
          <td class="col-dmft">
            <span class="dmft-pill ${stats.DMFT > 0 ? 'has-decay' : 'sound'}">${stats.DMFT}</span>
          </td>
          <td class="row-actions">
            <button type="button" class="icon-link btn-view" data-action="print" data-id="${r.id}" title="Print / PDF View">🖨️ Print</button>
            <button type="button" class="icon-link btn-edit" data-action="edit" data-id="${r.id}" title="Edit Record">✏️ Edit</button>
            <button type="button" class="icon-link btn-delete" data-action="delete" data-id="${r.id}" title="Delete Record">Delete</button>
          </td>
        </tr>
      `;
    }).join('');

    wrap.innerHTML = `
      <div class="table-responsive">
        <table class="records data-table">
          <thead>
            <tr>
              <th>Participant ID</th>
              <th>Exam Date</th>
              <th>Age</th>
              <th>Location</th>
              <th>DMFT</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;

    wrap.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const action = btn.dataset.action;
        const id = btn.dataset.id;
        const record = this.records.find(r => String(r.id) === String(id));
        if (!record) return;

        if (action === 'print') {
          this.exporter.printRecord(record);
        } else if (action === 'edit') {
          if (confirm(`Load record "${record.participantId}" into the form for editing?`)) {
            this.currentRecord = JSON.parse(JSON.stringify(record));
            this.editingRecordId = record.id;
            this.syncFormFromState();
            this.navigateToSection('sec-general');
            this.showToast(`Loaded record "${record.participantId}" for editing.`, 'info');
          }
        } else if (action === 'delete') {
          if (confirm(`Delete record for "${record.participantId}"?`)) {
            await window.storageManager.deleteRecord(id);
            await this.refreshRecordsList();
            this.showToast('Record deleted.', 'info');
          }
        }
      });
    });
  }

  /* ====================== MODALS & CODEBOOK ====================== */
  bindModalsAndHelp() {
    const btnHelp = document.getElementById('btnHelp') || document.getElementById('btnOpenHelp');
    const helpDrawer = document.getElementById('helpDrawer');
    const helpBackdrop = document.getElementById('drawerBackdrop') || document.getElementById('helpDrawerBackdrop');
    const btnCloseHelp = document.getElementById('drawerClose') || document.getElementById('btnCloseHelp');

    const openHelp = () => {
      if (helpDrawer && helpBackdrop) {
        helpDrawer.classList.add('open');
        helpBackdrop.classList.add('open');
        document.body.classList.add('modal-open');
        this.renderDrawer();
      }
    };

    const closeHelp = () => {
      if (helpDrawer && helpBackdrop) {
        helpDrawer.classList.remove('open');
        helpBackdrop.classList.remove('open');
        document.body.classList.remove('modal-open');
      }
    };

    if (btnHelp) btnHelp.addEventListener('click', () => openHelp());
    if (btnCloseHelp) btnCloseHelp.addEventListener('click', closeHelp);
    if (helpBackdrop) helpBackdrop.addEventListener('click', closeHelp);

    // Inline Help Popovers
    const pop = document.getElementById('popover');
    const popContent = document.getElementById('popoverContent');

    document.querySelectorAll('.help-ico, .mini-help-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const helpKey = btn.dataset.help;
        const topic = CLINICAL_CONSTANTS.HELP_TOPICS[helpKey];
        if (!topic || !pop || !popContent) return;

        popContent.innerHTML = `
          <div style="font-weight:700; margin-bottom:8px;">${topic.title}</div>
          ${topic.rows.map(([c, l]) => `<div class="pc"><b style="font-family:var(--mono); color:var(--teal-l, #38BDF8); width:24px; flex-shrink:0;">${c}</b><span>${l}</span></div>`).join('')}
        `;

        const rect = btn.getBoundingClientRect();
        pop.style.top = (rect.bottom + window.scrollY + 8) + 'px';
        pop.style.left = Math.min(rect.left, window.innerWidth - 280) + 'px';
        pop.classList.add('show');
      });
    });

    document.addEventListener('click', () => {
      if (pop) pop.classList.remove('show');
    });
  }

  renderDrawer() {
    const body = document.getElementById('drawerBody') || document.getElementById('codebookContent');
    if (!body) return;

    const sections = [
      ['Crown Status', CLINICAL_CONSTANTS.CROWN_CODES.map(o => [o.code, o.label])],
      ['Root Status', CLINICAL_CONSTANTS.ROOT_CODES.map(o => [o.code, o.label])],
      ['CPI (per sextant)', CLINICAL_CONSTANTS.CPI_OPTS.slice(1)],
      ['Loss of Attachment (per sextant)', CLINICAL_CONSTANTS.LOA_OPTS.slice(1)],
      ["Dental Fluorosis — Dean's Index", CLINICAL_CONSTANTS.FLUOROSIS_OPTS.slice(1)],
      ['Traumatic Dental Injury', CLINICAL_CONSTANTS.TDI_OPTS.slice(1)],
      ['Oral Mucosal Lesion — Site', CLINICAL_CONSTANTS.OML_SITE_OPTS.slice(1)],
      ['Oral Mucosal Lesion — Condition', CLINICAL_CONSTANTS.OML_COND_OPTS.slice(1)],
      ['Prosthetic Status', CLINICAL_CONSTANTS.PROS_OPTS.slice(1)],
      ['Overall Treatment Need', CLINICAL_CONSTANTS.TREAT_OPTS.slice(1)]
    ];

    body.innerHTML = `
      <p style="font-size:12.5px; color:var(--muted); margin-top:0;">
        Reference clinical coding scheme for standardized oral health assessments. Every dropdown and tooth-status button is restricted to these standardized criteria.
      </p>
      ${sections.map(([title, rows]) => `
        <div class="cb-section">
          <h3>${title}</h3>
          ${rows.map(([c, l]) => `
            <div class="cb-row">
              <div class="cb-code">${c}</div>
              <div class="cb-meaning">${l}</div>
            </div>
          `).join('')}
        </div>
      `).join('')}
    `;
  }

  /* ====================== CALCULATIONS & SUMMARY ====================== */
  calcAge(dob, examDate) {
    if (!dob) return null;
    const d1 = new Date(dob);
    const d2 = examDate ? new Date(examDate) : new Date();
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;

    let age = d2.getFullYear() - d1.getFullYear();
    const m = d2.getMonth() - d1.getMonth();
    if (m < 0 || (m === 0 && d2.getDate() < d1.getDate())) age--;
    return age >= 0 ? age : null;
  }

  calcDMFT(record) {
    let D = 0, M = 0, F = 0, sound = 0, recorded = 0;
    if (!record || !record.teeth) return { D: 0, M: 0, F: 0, DMFT: 0, sound: 0, recorded: 0 };

    CLINICAL_CONSTANTS.ALL_TEETH.forEach(t => {
      const tooth = record.teeth[t];
      if (tooth && tooth.crown !== undefined && tooth.crown !== '') {
        recorded++;
        const c = tooth.crown;
        if (c === '1' || c === '2') D++;
        else if (c === '4') M++;
        else if (c === '3') F++;
        else if (c === '0') sound++;
      }
    });

    return { D, M, F, DMFT: D + M + F, sound, recorded };
  }

  getWorstCPI(record) {
    if (!record || !record.cpi) return '—';
    const hierarchy = ['4', '3', '2', '1', '0'];
    for (const code of hierarchy) {
      if (record.cpi.includes(code)) return code;
    }
    return '—';
  }

  updateGlobalSummary(stats = null) {
    if (!stats) stats = this.calcDMFT(this.currentRecord);
    const worstCPI = this.getWorstCPI(this.currentRecord);

    const setT = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    setT('sumD', stats.D);
    setT('sumM', stats.M);
    setT('sumF', stats.F);
    setT('sumDMFT', stats.DMFT);
    setT('sumCPI', worstCPI);

    setT('railD', stats.D);
    setT('railM', stats.M);
    setT('railF', stats.F);
    setT('railDMFT', stats.DMFT);

    const age = this.calcAge(this.currentRecord.dob, this.currentRecord.examDate);
    const agePill = document.getElementById('agePill') || document.getElementById('ageDisplayPill');
    if (agePill) agePill.textContent = age !== null ? `${age} years` : '— years';
  }

  /* ====================== TOAST NOTIFICATIONS ====================== */
  showToast(message, type = 'info') {
    const toast = document.getElementById('toast') || document.getElementById('toastNotification');
    if (!toast) return;

    toast.className = `toast show ${type}`;
    toast.textContent = message;

    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new ClinicalOralApp();
  window.app.init();
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ClinicalOralApp;
}
