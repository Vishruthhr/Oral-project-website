/**
 * Clinical Odontogram & Anatomical Tooth Chart Controller
 * Precision Medical-Grade Tooth SVG Models (Crown & Roots), Arch Parabolic Flow, and Interactive Keypad
 */

class OdontogramController {
  constructor(app) {
    this.app = app;
    this.activeTooth = null;
    this.autoAdvance = true;
    this.showRoots = true;
    this.keypadMode = 'crown';
    this.hudEl = null;
    this.init();
  }

  init() {
    this.bindDOM();
    this.renderArch();
    this.initHoverHUD();
  }

  bindDOM() {
    this.upperContainer = document.getElementById('upperArch');
    this.lowerContainer = document.getElementById('lowerArch');
    this.modal = document.getElementById('toothModal');
    this.modalBackdrop = document.getElementById('toothModalBackdrop');
    this.activeToothTitle = document.getElementById('activeToothTitle');
    this.activeToothSub = document.getElementById('activeToothSub');
    this.crownKeypad = document.getElementById('crownKeypad');
    this.rootKeypad = document.getElementById('rootKeypad');
    this.keypadModeToggle = document.getElementById('keypadModeToggle');
    this.autoAdvanceCheckbox = document.getElementById('autoAdvanceToggle');
    this.hudEl = document.getElementById('toothHoverHUD');

    if (this.autoAdvanceCheckbox) {
      const savedPref = window.storageManager ? window.storageManager.getSettings().autoAdvance : true;
      this.autoAdvance = savedPref !== false;
      this.autoAdvanceCheckbox.checked = this.autoAdvance;
      this.autoAdvanceCheckbox.addEventListener('change', (e) => {
        this.autoAdvance = e.target.checked;
        if (window.storageManager) window.storageManager.saveSetting('autoAdvance', this.autoAdvance);
      });
    }

    const btnMarkAllSound = document.getElementById('btnMarkAllSound');
    if (btnMarkAllSound) {
      btnMarkAllSound.addEventListener('click', () => this.markUnrecordedAsSound());
    }

    const btnClearArch = document.getElementById('btnClearArch');
    if (btnClearArch) {
      btnClearArch.addEventListener('click', () => this.clearArchWithConfirm());
    }

    const btnToggleRoots = document.getElementById('btnToggleRoots');
    if (btnToggleRoots) {
      btnToggleRoots.addEventListener('click', () => {
        this.showRoots = !this.showRoots;
        btnToggleRoots.classList.toggle('active', this.showRoots);
        this.renderArch();
      });
    }

    const btnPrevTooth = document.getElementById('btnPrevTooth');
    if (btnPrevTooth) {
      btnPrevTooth.addEventListener('click', () => this.navigateTooth(-1));
    }
    const btnNextTooth = document.getElementById('btnNextTooth');
    if (btnNextTooth) {
      btnNextTooth.addEventListener('click', () => this.navigateTooth(1));
    }
    const btnCloseModal = document.getElementById('btnCloseToothModal');
    if (btnCloseModal) {
      btnCloseModal.addEventListener('click', () => this.closeModal());
    }
    if (this.modalBackdrop) {
      this.modalBackdrop.addEventListener('click', () => this.closeModal());
    }

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      if (!this.activeTooth || !this.modal || !this.modal.classList.contains('open')) return;
      const key = e.key.toUpperCase();
      if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'T'].includes(key)) {
        this.handleKeypadInput(this.keypadMode, key);
      } else if (e.key === 'ArrowRight' || e.key === 'Tab') {
        e.preventDefault();
        this.navigateTooth(1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.navigateTooth(-1);
      } else if (e.key === 'Escape') {
        this.closeModal();
      }
    });

    this.renderKeypads();
    this.renderLegend();
  }

  renderLegend() {
    const legendEl = document.getElementById('toothLegend');
    if (!legendEl) return;
    legendEl.innerHTML = CLINICAL_CONSTANTS.CROWN_CODES.map(o => `
      <span class="legend-item"><i class="legend-dot code-${o.code}"></i><b>${o.code}</b> ${o.label}</span>
    `).join('');
  }

  initHoverHUD() {
    if (!this.hudEl) {
      this.hudEl = document.getElementById('toothHoverHUD') || document.createElement('div');
      this.hudEl.id = 'toothHoverHUD';
      this.hudEl.className = 'tooth-hover-hud';
      if (!this.hudEl.parentElement) document.body.appendChild(this.hudEl);
    }
  }

  showHUD(e, toothNum) {
    if (!this.hudEl) return;
    const info = this.getToothInfo(toothNum);
    const toothState = this.app.getCurrentRecord().teeth[toothNum] || { crown: '', root: '' };

    const crownMeta = CLINICAL_CONSTANTS.CROWN_CODES.find(c => c.code === toothState.crown);
    const rootMeta = CLINICAL_CONSTANTS.ROOT_CODES.find(r => r.code === toothState.root);

    const crownText = crownMeta ? `${toothState.crown} — ${crownMeta.label}` : 'Not recorded (tap to score)';
    const rootText = rootMeta ? `${toothState.root} — ${rootMeta.label}` : 'Unexposed / Not recorded';

    this.hudEl.innerHTML = `
      <div class="hud-header">
        <span class="hud-tooth-num">Tooth #${toothNum}</span>
        <span class="hud-quad-tag">${info.quadrant}</span>
      </div>
      <div class="hud-tooth-name">${info.name}</div>
      <div class="hud-status-row">
        <span class="hud-status-label">Crown:</span>
        <span class="hud-status-val" style="color: ${crownMeta ? crownMeta.color : 'var(--text-muted)'};">${crownText}</span>
      </div>
      <div class="hud-status-row" style="margin-top: 3px;">
        <span class="hud-status-label">Root:</span>
        <span class="hud-status-val" style="color: ${rootMeta ? rootMeta.color : 'var(--text-muted)'};">${rootText}</span>
      </div>
    `;

    this.positionHUD(e);
    this.hudEl.classList.add('show');
  }

  positionHUD(e) {
    if (!this.hudEl) return;
    const x = e.clientX;
    const y = e.clientY;
    const hudWidth = 240;
    const hudHeight = 90;

    let left = x + 16;
    let top = y - hudHeight - 12;

    if (left + hudWidth > window.innerWidth) {
      left = x - hudWidth - 16;
    }
    if (top < 10) {
      top = y + 20;
    }

    this.hudEl.style.left = `${Math.max(10, left)}px`;
    this.hudEl.style.top = `${Math.max(10, top)}px`;
  }

  hideHUD() {
    if (this.hudEl) {
      this.hudEl.classList.remove('show');
    }
  }

  // Render Upper and Lower Arch (Anatomical FDI Parabolic Curvature)
  renderArch() {
    if (!this.upperContainer || !this.lowerContainer) return;

    // Upper Arch: 18 -> 28
    const upperTeeth = CLINICAL_CONSTANTS.UPPER_TEETH;
    this.upperContainer.innerHTML = upperTeeth.map((t, i) => this.generateRealisticToothHTML(t, i, upperTeeth.length, true)).join('');

    // Lower Arch: 48 -> 38
    const lowerTeeth = CLINICAL_CONSTANTS.LOWER_TEETH;
    this.lowerContainer.innerHTML = lowerTeeth.map((t, i) => this.generateRealisticToothHTML(t, i, lowerTeeth.length, false)).join('');

    // Bind event listeners
    document.querySelectorAll('.tooth-card').forEach(el => {
      const toothNum = parseInt(el.dataset.tooth, 10);
      el.addEventListener('click', () => {
        this.hideHUD();
        this.openModalForTooth(toothNum);
      });

      el.addEventListener('mouseenter', (e) => {
        this.showHUD(e, toothNum);
      });
      el.addEventListener('mousemove', (e) => {
        this.positionHUD(e);
      });
      el.addEventListener('mouseleave', () => {
        this.hideHUD();
      });
    });

    this.updateStats();
  }

  // Generate Realistic Anatomical Tooth HTML with Parabolic Offset & Anatomical SVG
  generateRealisticToothHTML(toothNum, index, total, isUpper) {
    const currentRecord = this.app.getCurrentRecord();
    const status = currentRecord.teeth[toothNum] || { crown: '', root: '' };

    const crownCode = (status.crown !== undefined && status.crown !== '') ? status.crown : '';
    const rootCode = (status.root !== undefined && status.root !== '') ? status.root : '';

    const mid = (total - 1) / 2;
    // Parabolic arch offset calculation for natural curvature
    const offset = Math.round(Math.pow(Math.abs(index - mid) / mid, 1.6) * (isUpper ? 12 : -12));

    const isRecorded = crownCode !== '';
    const crownClass = isRecorded ? `code-${crownCode}` : 'code-0';
    const isCurrentActive = this.activeTooth === toothNum ? 'active-selection' : '';

    const toothType = this.getToothMorphologyType(toothNum);
    const svgIcon = this.getAnatomicalSVG(toothType, isUpper, crownCode);

    const rootColor = this.getComputedRootColor(rootCode);

    return `
      <div class="tooth-card tooth ${crownClass} ${isCurrentActive} ${isRecorded ? 'has-data' : ''} type-${toothType}" 
           data-tooth="${toothNum}" 
           style="transform: translateY(${offset}px);"
           role="button" 
           tabindex="0" 
           aria-label="Tooth ${toothNum}, Crown: ${crownCode || 'Sound (0)'}">
        
        <span class="tooth-num">${toothNum}</span>
        
        <div class="tooth-svg-wrap">
          ${svgIcon}
        </div>

        <div class="crown-code-badge">
          ${crownCode || '0'}
        </div>

        <span class="root-dot" style="background-color: ${rootColor};" title="Root: ${rootCode || '0'}"></span>
      </div>
    `;
  }

  getToothMorphologyType(num) {
    const digit = num % 10;
    if (digit === 1 || digit === 2) return 'incisor';
    if (digit === 3) return 'canine';
    if (digit === 4 || digit === 5) return 'premolar';
    return 'molar'; // 6, 7, 8
  }

  // Realistic Anatomical Tooth SVG with True Anatomical Features
  getAnatomicalSVG(type, isUpper, crownCode) {
    let svgBody = '';

    if (type === 'molar') {
      if (isUpper) {
        // Maxillary Molar: 3 anatomical roots pointing UP, wide 4-cusp crown pointing DOWN
        svgBody = `
          <!-- Maxillary Molar Roots (Mesiobuccal, Distobuccal, Palatal) -->
          <path d="M5,18 C4,10 5,3 8,2 C10,2 11,8 13,18 M15,18 C16,10 17,2 19,2 C21,2 22,10 23,18 M25,18 C27,8 28,3 30,3 C32,3 33,10 32,18" class="anat-root" />
          <!-- Anatomical Crown with 4 Cusps & Oblique Ridge -->
          <path d="M4,18 C3,26 6,34 18.5,34 C31,34 34,26 33,18 C33,16 4,16 4,18 Z" class="anat-crown" />
          <path d="M9,22 C14,27 23,27 28,22 M18.5,20 L18.5,32 M11,27 L26,27" class="anat-groove" />
        `;
      } else {
        // Mandibular Molar: 2 robust curved roots pointing DOWN, wide occlusal crown pointing UP
        svgBody = `
          <!-- Mandibular Molar Crown -->
          <path d="M4,16 C3,8 6,2 18.5,2 C31,2 34,8 33,16 C33,18 4,18 4,16 Z" class="anat-crown" />
          <path d="M9,12 C14,7 23,7 28,12 M18.5,4 L18.5,15 M11,8 L26,8" class="anat-groove" />
          <!-- 2 Divergent Curved Roots (Mesial & Distal) -->
          <path d="M7,16 C6,24 7,33 11,35 C14,35 15,26 16,16 M21,16 C22,26 23,35 26,35 C30,33 31,24 30,16" class="anat-root" />
        `;
      }
    } else if (type === 'premolar') {
      if (isUpper) {
        // Maxillary Premolar: Dual roots pointing UP, bicuspid crown pointing DOWN
        svgBody = `
          <path d="M9,18 C8,10 9,3 12,2 C14,2 15,10 17,18 M20,18 C22,10 23,3 25,2 C28,3 29,10 28,18" class="anat-root" />
          <path d="M6,18 C5,25 9,33 18.5,33 C28,33 32,25 31,18 Z" class="anat-crown" />
          <path d="M12,25 C16,28 21,28 25,25 M18.5,20 L18.5,30" class="anat-groove" />
        `;
      } else {
        // Mandibular Premolar: Tapered single root pointing DOWN, bicuspid crown pointing UP
        svgBody = `
          <path d="M6,16 C5,9 9,2 18.5,2 C28,2 32,9 31,16 Z" class="anat-crown" />
          <path d="M12,9 C16,6 21,6 25,9 M18.5,4 L18.5,14" class="anat-groove" />
          <path d="M10,16 C10,24 13,34 18.5,35 C24,34 27,24 27,16 Z" class="anat-root" />
        `;
      }
    } else if (type === 'canine') {
      if (isUpper) {
        // Maxillary Canine: Stout long root pointing UP, pointed spear cusp pointing DOWN
        svgBody = `
          <path d="M11,18 C10,10 13,3 18.5,2 C24,3 27,10 26,18 Z" class="anat-root" />
          <path d="M7,18 C6,24 11,30 18.5,34 C26,30 31,24 30,18 Z" class="anat-crown" />
          <path d="M18.5,20 L18.5,32" class="anat-groove" />
        `;
      } else {
        // Mandibular Canine: Stout root pointing DOWN, pointed crown pointing UP
        svgBody = `
          <path d="M7,16 C6,10 11,4 18.5,2 C26,4 31,10 30,16 Z" class="anat-crown" />
          <path d="M18.5,14 L18.5,3" class="anat-groove" />
          <path d="M11,16 C10,24 13,32 18.5,35 C24,32 27,24 26,16 Z" class="anat-root" />
        `;
      }
    } else {
      // Incisor (Central & Lateral)
      if (isUpper) {
        // Maxillary Incisor: Broad chisel crown pointing DOWN, single tapering root pointing UP
        svgBody = `
          <path d="M12,18 C11,10 14,4 18.5,2 C23,4 26,10 25,18 Z" class="anat-root" />
          <path d="M7,18 C7,26 8,33 9,33.5 C12,33.5 25,33.5 28,33.5 C29,33 30,26 30,18 Z" class="anat-crown" />
          <path d="M11,31 L26,31 M14,24 L14,31 M23,24 L23,31" class="anat-groove" />
        `;
      } else {
        // Mandibular Incisor: Slender chisel crown pointing UP, slender root pointing DOWN
        svgBody = `
          <path d="M8,16 C8,8 9,2.5 10,2 C13,2 24,2 27,2 C28,2.5 29,8 29,16 Z" class="anat-crown" />
          <path d="M11,4 L26,4 M14,4 L14,11 M23,4 L23,11" class="anat-groove" />
          <path d="M12,16 C11,24 14,31 18.5,35 C23,31 26,24 25,16 Z" class="anat-root" />
        `;
      }
    }

    return `
      <svg viewBox="0 0 37 37" width="28" height="30" class="tooth-anat-svg" aria-hidden="true">
        <g>
          ${svgBody}
        </g>
      </svg>
    `;
  }

  getComputedRootColor(code) {
    const map = {
      '0': '#4A7C59',
      '1': '#B24A34',
      '2': '#D97A3F',
      '3': '#3E6FA3',
      '7': '#7C5CBF',
      '8': '#DAD4C4',
      '9': '#FFFFFF'
    };
    return map[code] || 'transparent';
  }

  renderKeypads() {
    if (this.crownKeypad) {
      this.crownKeypad.innerHTML = CLINICAL_CONSTANTS.CROWN_CODES.map(c => `
        <button type="button" class="chip code-chip code-${c.code}" data-type="crown" data-code="${c.code}">
          <span class="key-code">${c.code}</span>
          <span class="key-label">${c.label}</span>
          ${c.isDMF ? `<span class="dmf-tag tag-${c.isDMF}">${c.isDMF}</span>` : ''}
        </button>
      `).join('');

      this.crownKeypad.querySelectorAll('.chip').forEach(btn => {
        btn.addEventListener('click', () => {
          this.handleKeypadInput('crown', btn.dataset.code);
        });
      });
    }

    if (this.rootKeypad) {
      this.rootKeypad.innerHTML = CLINICAL_CONSTANTS.ROOT_CODES.map(r => `
        <button type="button" class="chip root-chip code-${r.code}" data-type="root" data-code="${r.code}">
          <span class="key-code">${r.code}</span>
          <span class="key-label">${r.label}</span>
        </button>
      `).join('');

      this.rootKeypad.querySelectorAll('.chip').forEach(btn => {
        btn.addEventListener('click', () => {
          this.handleKeypadInput('root', btn.dataset.code);
        });
      });
    }

    if (this.keypadModeToggle) {
      this.keypadModeToggle.querySelectorAll('.mode-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          this.setKeypadMode(tab.dataset.mode);
        });
      });
    }
  }

  setKeypadMode(mode) {
    this.keypadMode = mode;
    this.app.playClinicalClick();
    if (this.keypadModeToggle) {
      this.keypadModeToggle.querySelectorAll('.mode-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.mode === mode);
      });
    }
    if (this.crownKeypad && this.rootKeypad) {
      this.crownKeypad.style.display = mode === 'crown' ? 'flex' : 'none';
      this.rootKeypad.style.display = mode === 'root' ? 'flex' : 'none';
    }
    this.highlightActiveCodes();
  }

  openModalForTooth(toothNum) {
    this.activeTooth = toothNum;
    this.app.triggerHaptic(20);
    this.app.playClinicalClick();

    const toothInfo = this.getToothInfo(toothNum);
    const seqIndex = CLINICAL_CONSTANTS.EXAM_SEQUENCE.indexOf(toothNum) + 1;

    if (this.activeToothTitle) {
      this.activeToothTitle.innerHTML = `Tooth <b>#${toothNum}</b> · <span class="arch-tag">${toothInfo.quadrant}</span>`;
    }
    if (this.activeToothSub) {
      this.activeToothSub.textContent = `${toothInfo.name} — FDI notation: select crown & root status (Step ${seqIndex}/32)`;
    }

    this.highlightActiveCodes();

    if (this.modal && this.modalBackdrop) {
      this.modal.classList.add('open');
      this.modalBackdrop.classList.add('open');
      document.body.classList.add('modal-open');
    }

    this.renderArch();
  }

  closeModal() {
    if (this.modal && this.modalBackdrop) {
      this.modal.classList.remove('open');
      this.modalBackdrop.classList.remove('open');
      document.body.classList.remove('modal-open');
    }
    this.activeTooth = null;
    this.renderArch();
  }

  highlightActiveCodes() {
    if (!this.activeTooth) return;
    const current = this.app.getCurrentRecord().teeth[this.activeTooth] || { crown: '', root: '' };

    if (this.crownKeypad) {
      this.crownKeypad.querySelectorAll('.chip').forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.code === current.crown);
      });
    }

    if (this.rootKeypad) {
      this.rootKeypad.querySelectorAll('.chip').forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.code === current.root);
      });
    }
  }

  handleKeypadInput(type, code) {
    if (!this.activeTooth) return;
    this.app.triggerHaptic(25);
    this.app.playClinicalClick(code === '0' ? 600 : 800);

    const record = this.app.getCurrentRecord();
    if (!record.teeth[this.activeTooth]) {
      record.teeth[this.activeTooth] = { crown: '', root: '' };
    }

    record.teeth[this.activeTooth][type] = code;

    this.app.onFormChanged();
    this.highlightActiveCodes();
    this.renderArch();

    if (this.autoAdvance && type === 'crown') {
      setTimeout(() => {
        this.navigateTooth(1);
      }, 140);
    }
  }

  navigateTooth(step) {
    if (!this.activeTooth) return;
    const seq = CLINICAL_CONSTANTS.EXAM_SEQUENCE;
    const currentIndex = seq.indexOf(this.activeTooth);
    if (currentIndex === -1) return;

    let nextIndex = currentIndex + step;
    if (nextIndex >= seq.length) {
      this.closeModal();
      this.app.showToast('Dentition chart completed for all 32 teeth!', 'success');
      return;
    }
    if (nextIndex < 0) {
      nextIndex = 0;
    }

    const nextTooth = seq[nextIndex];
    this.openModalForTooth(nextTooth);
  }

  markUnrecordedAsSound() {
    const record = this.app.getCurrentRecord();
    let count = 0;
    CLINICAL_CONSTANTS.ALL_TEETH.forEach(t => {
      if (!record.teeth[t]) record.teeth[t] = { crown: '', root: '' };
      if (!record.teeth[t].crown) {
        record.teeth[t].crown = '0';
        count++;
      }
    });

    this.app.playClinicalClick(900);
    this.app.onFormChanged();
    this.renderArch();
    this.app.showToast(`Marked ${count} unrecorded teeth as Sound (0).`, 'info');
  }

  clearArchWithConfirm() {
    if (confirm('Clear all entered dentition data for this subject?')) {
      const record = this.app.getCurrentRecord();
      CLINICAL_CONSTANTS.ALL_TEETH.forEach(t => {
        record.teeth[t] = { crown: '', root: '' };
      });
      this.app.onFormChanged();
      this.renderArch();
      this.app.showToast('Dentition chart cleared.', 'info');
    }
  }

  updateStats() {
    const current = this.app.getCurrentRecord();
    const stats = this.calcDMFT(current);

    const dEl = document.getElementById('dentD');
    const mEl = document.getElementById('dentM');
    const fEl = document.getElementById('dentF');
    const dmftEl = document.getElementById('dentDMFT');
    const soundEl = document.getElementById('dentSound');
    const recordedEl = document.getElementById('dentRecorded');

    if (dEl) dEl.textContent = stats.D;
    if (mEl) mEl.textContent = stats.M;
    if (fEl) fEl.textContent = stats.F;
    if (dmftEl) dmftEl.textContent = stats.DMFT;
    if (soundEl) soundEl.textContent = stats.sound;
    if (recordedEl) recordedEl.textContent = `${stats.recorded}/32`;

    this.app.updateGlobalSummary(stats);
  }

  calcDMFT(record) {
    let D = 0, M = 0, F = 0, sound = 0, recorded = 0;
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

  getToothInfo(num) {
    const quad = Math.floor(num / 10);
    const toothInQuad = num % 10;
    const quadNames = {
      1: 'Upper Right (Maxillary)',
      2: 'Upper Left (Maxillary)',
      3: 'Lower Left (Mandibular)',
      4: 'Lower Right (Mandibular)'
    };
    const toothNames = {
      1: 'Central Incisor',
      2: 'Lateral Incisor',
      3: 'Canine (Cuspid)',
      4: 'First Premolar',
      5: 'Second Premolar',
      6: 'First Molar (6-year)',
      7: 'Second Molar (12-year)',
      8: 'Third Molar (Wisdom)'
    };
    return {
      quadrant: quadNames[quad] || 'Quadrant ' + quad,
      name: toothNames[toothInQuad] || 'Tooth',
      location: `Quadrant ${quad} · Position ${toothInQuad}`
    };
  }
}

if (typeof window !== 'undefined') {
  window.OdontogramController = OdontogramController;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = OdontogramController;
}
