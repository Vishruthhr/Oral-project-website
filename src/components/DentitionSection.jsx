import React from 'react';
import { useDental } from '../context/DentalContext';
import { CLINICAL_CONSTANTS } from '../utils/clinicalConstants';
import AnatomicalToothSvg from './AnatomicalToothSvg';

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

  function renderToothCard(toothNum, index, total, isUpper) {
    const status = currentRecord.teeth[toothNum] || { crown: '', root: '' };
    const crownCode = status.crown !== undefined && status.crown !== '' ? status.crown : '';
    const rootCode = status.root !== undefined && status.root !== '' ? status.root : '';

    const mid = (total - 1) / 2;
    const offset = Math.round(Math.pow(Math.abs(index - mid) / mid, 1.6) * (isUpper ? 8 : -8));

    const isRecorded = crownCode !== '' || rootCode !== '';
    const isCurrentActive = activeTooth === toothNum ? 'active-selection' : '';

    // Status badge indicator
    let badgeLabel = crownCode || '0';
    let badgeClass = 'sound';
    if (crownCode === '1' || crownCode === '2' || rootCode === '1' || rootCode === '2') {
      badgeClass = 'decay';
    } else if (crownCode === '3' || rootCode === '3') {
      badgeClass = 'filled';
    } else if (crownCode === '7' || rootCode === '7') {
      badgeClass = 'crown';
    } else if (crownCode === '4' || crownCode === '5') {
      badgeClass = 'missing';
    }

    return (
      <div
        key={toothNum}
        className={`tooth-card tooth ${isCurrentActive} ${isRecorded ? 'has-data' : ''}`}
        style={{ transform: `translateY(${offset}px)` }}
        onClick={() => {
          playClick();
          setActiveTooth(toothNum);
        }}
        role="button"
        tabIndex={0}
        title={`Tooth #${toothNum} | Crown: ${crownCode || 'Sound (0)'} | Root: ${rootCode || 'Sound (0)'}`}
      >
        <div className="tooth-num-badge top-num">{toothNum}</div>
        
        <div className="tooth-svg-wrap">
          <AnatomicalToothSvg
            toothNum={toothNum}
            crownCode={crownCode}
            rootCode={rootCode}
            mode="chart"
          />
        </div>

        <div className={`crown-code-badge badge-${badgeClass}`}>
          {badgeLabel}
        </div>
      </div>
    );
  }

  const upperTeeth = CLINICAL_CONSTANTS.UPPER_TEETH;
  const lowerTeeth = CLINICAL_CONSTANTS.LOWER_TEETH;

  let recordedCount = 0;
  let soundCount = 0;
  CLINICAL_CONSTANTS.ALL_TEETH.forEach(t => {
    const st = currentRecord.teeth[t];
    if (st && (st.crown !== undefined && st.crown !== '')) {
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
      <div className="card-sub">
        Tap any tooth for rapid scoring — anatomical FDI 32-tooth notation chart with real-time crown &amp; root rendering
      </div>

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
        <div className="arch-label">Upper Arch — Maxillary (18 → 28)</div>
        <div className="arch-row" id="upperArch">
          {upperTeeth.map((t, i) => renderToothCard(t, i, upperTeeth.length, true))}
        </div>

        <div className="arch-label" style={{ marginTop: '24px' }}>Lower Arch — Mandibular (48 → 38)</div>
        <div className="arch-row" id="lowerArch">
          {lowerTeeth.map((t, i) => renderToothCard(t, i, lowerTeeth.length, false))}
        </div>
      </div>

      <div className="dentition-stats-strip">
        <div className="dent-stat"><div className="num">{liveDMFT.D}</div><div className="lbl">Decayed (D)</div></div>
        <div className="dent-stat"><div className="num">{liveDMFT.M}</div><div className="lbl">Missing (M)</div></div>
        <div className="dent-stat"><div className="num">{liveDMFT.F}</div><div className="lbl">Filled (F)</div></div>
        <div className="dent-stat"><div className="num" style={{ color: 'var(--navy)' }}>{liveDMFT.DMFT}</div><div className="lbl">DMFT Index</div></div>
        <div className="dent-stat"><div className="num" style={{ color: 'var(--navy-2)' }}>{soundCount}</div><div className="lbl">Sound (0)</div></div>
        <div className="dent-stat"><div className="num">{recordedCount}/32</div><div className="lbl">Recorded</div></div>
      </div>

      <div className="tooth-legend">
        {CLINICAL_CONSTANTS.CROWN_CODES.map(o => (
          <span key={o.code} className="legend-item" title={o.desc}>
            <i className="legend-dot" style={{ backgroundColor: o.color }} />
            <b>{o.code}</b> {o.label}
          </span>
        ))}
      </div>
    </section>
  );
}
