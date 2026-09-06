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

    // Keyboard navigation (Numpad / Arrow keys)
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
        <span class="hud-status-val" style="color: ${crownMeta ? crownMeta.color : 'var(--muted)'};">${crownText}</span>
      </div>
      <div class="hud-status-row" style="margin-top: 3px;">
        <span class="hud-status-label">Root:</span>
        <span class="hud-status-val" style="color: ${rootMeta ? rootMeta.color : 'var(--muted)'};">${rootText}</span>
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
    const offset = Math.round(Math.pow(Math.abs(index - mid) / mid, 1.6) * (isUpper ? 10 : -10));

    const isRecorded = crownCode !== '';
    const crownClass = isRecorded ? `code-${crownCode}` : 'code-0';
    const isCurrentActive = this.activeTooth === toothNum ? 'active-selection' : '';

    const toothType = this.getToothMorphologyType(toothNum);
    const svgIcon = this.getAnatomicalSVG(toothType, isUpper, toothNum);

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

  // Precision Anatomical Tooth SVG with True Anatomical Features
  getAnatomicalSVG(type, isUpper, toothNum) {
    let svgBody = '';

    if (type === 'molar') {
      if (isUpper) {
        // Maxillary Molar: 3 anatomical roots pointing UP, wide 4-cusp crown pointing DOWN
        svgBody = `
          <!-- Maxillary Molar Roots (Mesiobuccal, Distobuccal, Palatal) -->
          <path d="M6,17 C5,10 6,3 9,2 C11,2 12,8 14,17 M15,17 C17,10 18,2 20,2 C22,2 23,10 24,17 M25,17 C27,8 28,3 31,3 C33,3 34,10 33,17" class="anat-root" />
          <!-- Anatomical Rhomboid Crown with 4 Cusps & Oblique Ridge -->
          <path d="M4,17 C3,25 6,34 19,34 C32,34 35,25 34,17 C34,15 4,15 4,17 Z" class="anat-crown" />
          <path d="M9,22 C14,27 24,27 29,22 M19,19 L19,32 M12,27 L26,27" class="anat-groove" />
          <circle cx="19" cy="25" r="1.2" class="anat-pit" />
        `;
      } else {
        // Mandibular Molar: 2 robust curved roots pointing DOWN, wide 5-cusp occlusal crown pointing UP
        svgBody = `
          <!-- Mandibular Molar Crown with 5 Cusps -->
          <path d="M4,17 C3,9 6,2 19,2 C32,2 35,9 34,17 C34,19 4,19 4,17 Z" class="anat-crown" />
          <path d="M9,12 C14,7 24,7 29,12 M19,4 L19,17 M12,9 L26,9" class="anat-groove" />
          <circle cx="19" cy="11" r="1.2" class="anat-pit" />
          <!-- 2 Divergent Curved Roots (Mesial & Distal) -->
          <path d="M7,17 C6,25 7,34 11,36 C15,36 16,27 17,17 M21,17 C22,27 23,36 27,36 C31,34 32,25 31,17" class="anat-root" />
        `;
      }
    } else if (type === 'premolar') {
      if (isUpper) {
        // Maxillary Premolar: Dual tapered roots pointing UP, bicuspid crown pointing DOWN
        svgBody = `
          <path d="M10,17 C9,10 10,3 13,2 C15,2 16,10 18,17 M20,17 C22,10 23,3 25,2 C28,3 29,10 28,17" class="anat-root" />
          <path d="M6,17 C5,25 9,34 19,34 C29,34 33,25 32,17 Z" class="anat-crown" />
          <path d="M12,25 C16,28 22,28 26,25 M19,19 L19,31" class="anat-groove" />
        `;
      } else {
        // Mandibular Premolar: Tapered single root pointing DOWN, bicuspid crown pointing UP
        svgBody = `
          <path d="M6,17 C5,9 9,2 19,2 C29,2 33,9 32,17 Z" class="anat-crown" />
          <path d="M12,9 C16,6 22,6 26,9 M19,5 L19,17" class="anat-groove" />
          <path d="M11,17 C11,25 14,35 19,36 C24,35 27,25 27,17 Z" class="anat-root" />
        `;
      }
    } else if (type === 'canine') {
      if (isUpper) {
        // Maxillary Canine: Stout long root pointing UP, pointed spear cusp pointing DOWN
        svgBody = `
          <path d="M12,17 C11,9 13,3 19,2 C25,3 27,9 26,17 Z" class="anat-root" />
          <path d="M7,17 C6,24 11,30 19,35 C27,30 32,24 31,17 Z" class="anat-crown" />
          <path d="M19,19 L19,33" class="anat-groove" />
        `;
      } else {
        // Mandibular Canine: Stout root pointing DOWN, pointed crown pointing UP
        svgBody = `
          <path d="M7,17 C6,10 11,4 19,2 C27,4 32,10 31,17 Z" class="anat-crown" />
          <path d="M19,15 L19,3" class="anat-groove" />
          <path d="M12,17 C11,25 13,33 19,36 C25,33 27,25 26,17 Z" class="anat-root" />
        `;
      }
    } else {
      // Incisor (Central & Lateral)
      if (isUpper) {
        // Maxillary Incisor: Broad spade chisel crown pointing DOWN, single tapering root pointing UP
        svgBody = `
          <path d="M13,17 C12,9 14,3 19,2 C24,3 26,9 25,17 Z" class="anat-root" />
          <path d="M7,17 C7,25 8,34 9.5,34.5 C13,34.5 25,34.5 28.5,34.5 C30,34 31,25 31,17 Z" class="anat-crown" />
          <path d="M11,32 L27,32 M14,26 L14,32 M24,26 L24,32" class="anat-groove" />
        `;
      } else {
        // Mandibular Incisor: Slender chisel crown pointing UP, slender root pointing DOWN
        svgBody = `
          <path d="M8,17 C8,9 9,2.5 10.5,2 C14,2 24,2 27.5,2 C29,2.5 30,9 30,17 Z" class="anat-crown" />
          <path d="M11,4 L27,4 M14,4 L14,10 M24,4 L24,10" class="anat-groove" />
          <path d="M13,17 C12,25 14,33 19,36 C24,33 26,25 25,17 Z" class="anat-root" />
        `;
      }
    }

    return `
      <svg viewBox="0 0 38 38" width="30" height="32" class="tooth-anat-svg" aria-hidden="true">
        <g>
          ${svgBody}
        </g>
      </svg>
    `;
  }

  getComputedRootColor(code) {
    const map = {
      '0': '#0284C7',
      '1': '#EF4444',
      '2': '#F59E0B',
      '3': '#0EA5E9',
      '7': '#8B5CF6',
      '8': '#94A3B8',
      '9': '#CBD5E1'
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
