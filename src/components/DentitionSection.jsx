import React from 'react';
import { useDental } from '../context/DentalContext';
import { CLINICAL_CONSTANTS } from '../utils/clinicalConstants';

export default function DentitionSection() {
  const {
    currentRecord,
    showRoots,
    setShowRoots,
    autoAdvance,
    setAutoAdvance,
    fillAllSound,
    clearArch,
    activeTooth,
    setActiveTooth,
    liveDMFT,
    playClick,
    setHelpDrawerOpen
  } = useDental();

  function getToothMorphologyType(num) {
    const digit = num % 10;
    if (digit === 1 || digit === 2) return 'incisor';
    if (digit === 3) return 'canine';
    if (digit === 4 || digit === 5) return 'premolar';
    return 'molar';
  }

  function getComputedRootColor(code) {
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

  function renderAnatomicalSVG(type, isUpper) {
    if (type === 'molar') {
      if (isUpper) {
        return (
          <svg viewBox="0 0 38 38" width="30" height="32" className="tooth-anat-svg" aria-hidden="true">
            <g>
              <path d="M6,17 C5,10 6,3 9,2 C11,2 12,8 14,17 M15,17 C17,10 18,2 20,2 C22,2 23,10 24,17 M25,17 C27,8 28,3 31,3 C33,3 34,10 33,17" className="anat-root" />
              <path d="M4,17 C3,25 6,34 19,34 C32,34 35,25 34,17 C34,15 4,15 4,17 Z" className="anat-crown" />
              <path d="M9,22 C14,27 24,27 29,22 M19,19 L19,32 M12,27 L26,27" className="anat-groove" />
              <circle cx="19" cy="25" r="1.2" className="anat-pit" />
            </g>
          </svg>
        );
      } else {
        return (
          <svg viewBox="0 0 38 38" width="30" height="32" className="tooth-anat-svg" aria-hidden="true">
            <g>
              <path d="M4,17 C3,9 6,2 19,2 C32,2 35,9 34,17 C34,19 4,19 4,17 Z" className="anat-crown" />
              <path d="M9,12 C14,7 24,7 29,12 M19,4 L19,17 M12,9 L26,9" className="anat-groove" />
              <circle cx="19" cy="11" r="1.2" className="anat-pit" />
              <path d="M7,17 C6,25 7,34 11,36 C15,36 16,27 17,17 M21,17 C22,27 23,36 27,36 C31,34 32,25 31,17" className="anat-root" />
            </g>
          </svg>
        );
      }
    } else if (type === 'premolar') {
      if (isUpper) {
        return (
          <svg viewBox="0 0 38 38" width="30" height="32" className="tooth-anat-svg" aria-hidden="true">
            <g>
              <path d="M10,17 C9,10 10,3 13,2 C15,2 16,10 18,17 M20,17 C22,10 23,3 25,2 C28,3 29,10 28,17" className="anat-root" />
              <path d="M6,17 C5,25 9,34 19,34 C29,34 33,25 32,17 Z" className="anat-crown" />
              <path d="M12,25 C16,28 22,28 26,25 M19,19 L19,31" className="anat-groove" />
            </g>
          </svg>
        );
      } else {
        return (
          <svg viewBox="0 0 38 38" width="30" height="32" className="tooth-anat-svg" aria-hidden="true">
            <g>
              <path d="M6,17 C5,9 9,2 19,2 C29,2 33,9 32,17 Z" className="anat-crown" />
              <path d="M12,9 C16,6 22,6 26,9 M19,5 L19,17" className="anat-groove" />
              <path d="M11,17 C11,25 14,35 19,36 C24,35 27,25 27,17 Z" className="anat-root" />
            </g>
          </svg>
        );
      }
    } else if (type === 'canine') {
      if (isUpper) {
        return (
          <svg viewBox="0 0 38 38" width="30" height="32" className="tooth-anat-svg" aria-hidden="true">
            <g>
              <path d="M12,17 C11,9 13,3 19,2 C25,3 27,9 26,17 Z" className="anat-root" />
              <path d="M7,17 C6,24 11,30 19,35 C27,30 32,24 31,17 Z" className="anat-crown" />
              <path d="M19,19 L19,33" className="anat-groove" />
            </g>
          </svg>
        );
      } else {
        return (
          <svg viewBox="0 0 38 38" width="30" height="32" className="tooth-anat-svg" aria-hidden="true">
            <g>
              <path d="M7,17 C6,10 11,4 19,2 C27,4 32,10 31,17 Z" className="anat-crown" />
              <path d="M19,15 L19,3" className="anat-groove" />
              <path d="M12,17 C11,25 13,33 19,36 C25,33 27,25 26,17 Z" className="anat-root" />
            </g>
          </svg>
        );
      }
    } else {
      if (isUpper) {
        return (
          <svg viewBox="0 0 38 38" width="30" height="32" className="tooth-anat-svg" aria-hidden="true">
            <g>
              <path d="M13,17 C12,9 14,3 19,2 C24,3 26,9 25,17 Z" className="anat-root" />
              <path d="M7,17 C7,25 8,34 9.5,34.5 C13,34.5 25,34.5 28.5,34.5 C30,34 31,25 31,17 Z" className="anat-crown" />
              <path d="M11,32 L27,32 M14,26 L14,32 M24,26 L24,32" className="anat-groove" />
            </g>
          </svg>
        );
      } else {
        return (
          <svg viewBox="0 0 38 38" width="30" height="32" className="tooth-anat-svg" aria-hidden="true">
            <g>
              <path d="M8,17 C8,9 9,2.5 10.5,2 C14,2 24,2 27.5,2 C29,2.5 30,9 30,17 Z" className="anat-crown" />
              <path d="M11,4 L27,4 M14,4 L14,10 M24,4 L24,10" className="anat-groove" />
              <path d="M13,17 C12,25 14,33 19,36 C24,33 26,25 25,17 Z" className="anat-root" />
            </g>
          </svg>
        );
      }
    }
  }

  function renderToothCard(toothNum, index, total, isUpper) {
    const status = currentRecord.teeth[toothNum] || { crown: '', root: '' };
    const crownCode = status.crown !== undefined && status.crown !== '' ? status.crown : '';
    const rootCode = status.root !== undefined && status.root !== '' ? status.root : '';

    const mid = (total - 1) / 2;
    const offset = Math.round(Math.pow(Math.abs(index - mid) / mid, 1.6) * (isUpper ? 10 : -10));

    const isRecorded = crownCode !== '';
    const crownClass = isRecorded ? `code-${crownCode}` : 'code-0';
    const isCurrentActive = activeTooth === toothNum ? 'active-selection' : '';
    const toothType = getToothMorphologyType(toothNum);
    const rootColor = getComputedRootColor(rootCode);

    return (
      <div
        key={toothNum}
        className={`tooth-card tooth ${crownClass} ${isCurrentActive} ${isRecorded ? 'has-data' : ''} type-${toothType}`}
        style={{ transform: `translateY(${offset}px)` }}
        onClick={() => {
          playClick();
          setActiveTooth(toothNum);
        }}
        role="button"
        tabIndex={0}
      >
        <span className="tooth-num">{toothNum}</span>
        <div className="tooth-svg-wrap">
          {renderAnatomicalSVG(toothType, isUpper)}
        </div>
        <div className="crown-code-badge">
          {crownCode || '0'}
        </div>
        <span
          className="root-dot"
          style={{ backgroundColor: rootColor }}
          title={`Root: ${rootCode || '0'}`}
        />
      </div>
    );
  }

  const upperTeeth = CLINICAL_CONSTANTS.UPPER_TEETH;
  const lowerTeeth = CLINICAL_CONSTANTS.LOWER_TEETH;

  let recordedCount = 0;
  let soundCount = 0;
  CLINICAL_CONSTANTS.ALL_TEETH.forEach(t => {
    const st = currentRecord.teeth[t];
    if (st && st.crown !== undefined && st.crown !== '') {
      recordedCount++;
      if (st.crown === '0') soundCount++;
    }
  });

  return (
    <section className="card" id="sec-dentition">
      <h2>
        <span className="sec-num">02</span> Dentition Status
        <button
          type="button"
          className="help-ico"
          onClick={() => setHelpDrawerOpen(true)}
          title="View Dentition Codes"
        >
          i
        </button>
      </h2>
      <div className="card-sub">Tap a tooth to record crown &amp; root status — FDI two-digit notation, 32 permanent teeth</div>

      <div className="arch-toolbar">
        <label className="toggle-switch-label">
          <input
            type="checkbox"
            checked={autoAdvance}
            onChange={e => setAutoAdvance(e.target.checked)}
          />
          <span>Auto-advance next tooth in sequence (18 → 38)</span>
        </label>

        <div className="arch-toolbar-actions">
          <button
            type="button"
            className={`btn-tool ${showRoots ? 'active' : ''}`}
            onClick={() => setShowRoots(!showRoots)}
          >
            🦷 Roots
          </button>
          <button
            type="button"
            className="btn-tool"
            onClick={fillAllSound}
          >
            ✓ Fill Sound (0)
          </button>
          <button
            type="button"
            className="btn-tool"
            onClick={clearArch}
          >
            ↺ Clear Arch
          </button>
        </div>
      </div>

      <div className="arch-wrap">
        <div className="arch-label">Upper Arch — 18 → 28 (Maxillary)</div>
        <div className="arch-row" id="upperArch">
          {upperTeeth.map((t, i) => renderToothCard(t, i, upperTeeth.length, true))}
        </div>

        <div className="arch-label" style={{ marginTop: '26px' }}>Lower Arch — 48 → 38 (Mandibular)</div>
        <div className="arch-row" id="lowerArch">
          {lowerTeeth.map((t, i) => renderToothCard(t, i, lowerTeeth.length, false))}
        </div>
      </div>

      <div className="dentition-stats-strip">
        <div className="dent-stat"><div className="num">{liveDMFT.D}</div><div className="lbl">Decayed (D)</div></div>
        <div className="dent-stat"><div className="num">{liveDMFT.M}</div><div className="lbl">Missing (M)</div></div>
        <div className="dent-stat"><div className="num">{liveDMFT.F}</div><div className="lbl">Filled (F)</div></div>
        <div className="dent-stat"><div className="num" style={{ color: 'var(--teal)' }}>{liveDMFT.DMFT}</div><div className="lbl">DMFT Index</div></div>
        <div className="dent-stat"><div className="num" style={{ color: 'var(--navy-2)' }}>{soundCount}</div><div className="lbl">Sound (0)</div></div>
        <div className="dent-stat"><div className="num">{recordedCount}/32</div><div className="lbl">Recorded</div></div>
      </div>

      <div className="tooth-legend">
        {CLINICAL_CONSTANTS.CROWN_CODES.map(o => (
          <span key={o.code} className="legend-item">
            <i className={`legend-dot code-${o.code}`} />
            <b>{o.code}</b> {o.label}
          </span>
        ))}
      </div>
    </section>
  );
}
