import React from 'react';
import { useDental } from '../context/DentalContext';
import { CLINICAL_CONSTANTS, TOOTH_COLOR_CONFIG } from '../utils/clinicalConstants';
import AnatomicalToothSvg, { getToothMorphology } from './AnatomicalToothSvg';

export default function ToothKeypadModal() {
  const {
    activeTooth,
    setActiveTooth,
    activePart,
    setActivePart,
    currentRecord,
    updateToothStatus,
    undoLastChange,
    resetToothStatus,
    navigateTooth,
    playClick
  } = useDental();

  if (!activeTooth) return null;

  const currentToothState = currentRecord.teeth[activeTooth] || { crown: '', root: '' };
  const crownCode = currentToothState.crown !== undefined ? currentToothState.crown : '';
  const rootCode = currentToothState.root !== undefined ? currentToothState.root : '';
  const seqIndex = CLINICAL_CONSTANTS.EXAM_SEQUENCE.indexOf(activeTooth) + 1;
  const { type, isUpper } = getToothMorphology(activeTooth);

  function getToothInfo(num) {
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
      quadrant: quadNames[quad] || `Quadrant ${quad}`,
      name: toothNames[toothInQuad] || 'Tooth'
    };
  }

  const info = getToothInfo(activeTooth);

  // Toggle handlers: clicking an already selected code toggles it off back to default ('')
  const handleCrownClick = (code) => {
    setActivePart('crown');
    const nextCode = crownCode === code ? '' : code;
    updateToothStatus(activeTooth, 'crown', nextCode);
  };

  const handleRootClick = (code) => {
    setActivePart('root');
    const nextCode = rootCode === code ? '' : code;
    updateToothStatus(activeTooth, 'root', nextCode);
  };

  const activeCrownInfo = crownCode && crownCode !== '0' ? TOOTH_COLOR_CONFIG.crown[crownCode] : null;
  const activeRootInfo = rootCode && rootCode !== '0' ? TOOTH_COLOR_CONFIG.root[rootCode] : null;

  return (
    <>
      <div className="modal-backdrop open" onClick={() => setActiveTooth(null)} />

      <div className="tooth-keypad-modal open anatomical-detail-modal" role="dialog" aria-modal="true">
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <h3 className="modal-tooth-title">
              Tooth <b>#{activeTooth}</b> · <span className="modal-quad-subtitle">{info.quadrant}</span>
            </h3>
            <div className="modal-step-info">
              {info.name} — Exam Sequence Step {seqIndex}/32
            </div>
          </div>

          <div className="modal-header-actions">
            <button
              type="button"
              className="btn ghost btn-sm"
              onClick={undoLastChange}
              title="Undo last change"
            >
              ↩ Undo
            </button>
            <button
              type="button"
              className="btn ghost btn-sm"
              onClick={() => resetToothStatus(activeTooth)}
              title="Reset all status for this tooth"
            >
              ↺ Reset Tooth
            </button>
            <button
              type="button"
              className="btn ghost btn-sm"
              onClick={() => navigateTooth(-1)}
              title="Previous tooth"
            >
              ◀ Prev
            </button>
            <button
              type="button"
              className="btn ghost btn-sm"
              onClick={() => navigateTooth(1)}
              title="Next tooth"
            >
              Next ▶
            </button>
            <button
              type="button"
              className="btn ghost btn-sm modal-close-btn"
              onClick={() => setActiveTooth(null)}
              title="Close modal"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-detail-grid">
          {/* Left Panel: Zoomed Anatomical SVG */}
          <div className="detail-drawing-panel">
            <div className="drawing-instructions">
              Click <b>Crown</b> or <b>Root</b> directly on drawing to select layer:
            </div>

            <div className="large-svg-container">
              <AnatomicalToothSvg
                toothNum={activeTooth}
                crownCode={crownCode}
                rootCode={rootCode}
                activePart={activePart}
                onPartClick={(part) => {
                  playClick();
                  setActivePart(part);
                }}
                mode="detail"
              />
            </div>

            <div className="part-selector-pills">
              <button
                type="button"
                className={`part-pill ${activePart === 'crown' ? 'active-crown' : ''}`}
                onClick={() => {
                  playClick();
                  setActivePart('crown');
                }}
              >
                👑 Crown Layer {crownCode ? `(${crownCode})` : ''}
              </button>
              <button
                type="button"
                className={`part-pill ${activePart === 'root' ? 'active-root' : ''}`}
                onClick={() => {
                  playClick();
                  setActivePart('root');
                }}
              >
                🦷 Root Layer {rootCode ? `(${rootCode})` : ''}
              </button>
            </div>

            {/* Active Selections Badges Chips */}
            {(activeCrownInfo || activeRootInfo) && (
              <div className="active-part-chips-bar">
                {activeCrownInfo && (
                  <span className="part-chip-tag" style={{ borderLeft: `4px solid ${activeCrownInfo.color}` }}>
                    👑 <b>Crown:</b> {activeCrownInfo.label} ({crownCode})
                  </span>
                )}
                {activeRootInfo && (
                  <span className="part-chip-tag" style={{ borderLeft: `4px solid ${activeRootInfo.color}` }}>
                    🦷 <b>Root:</b> {activeRootInfo.label} ({rootCode})
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Right Panel: Dual Crown & Root Option Groups */}
          <div className="detail-options-panel">
            {/* CROWN OPTIONS GROUP */}
            <div className={`option-group-card ${activePart === 'crown' ? 'highlighted-group' : ''}`}>
              <div className="group-header">
                <span className="group-icon">👑</span>
                <h4>Crown Status Options</h4>
                <span className="group-sub-hint">Click option to fill crown</span>
              </div>
              <div className="chip-container">
                {CLINICAL_CONSTANTS.CROWN_CODES.map(c => {
                  const isSelected = crownCode === c.code;
                  return (
                    <button
                      type="button"
                      key={c.code}
                      className={`chip code-chip code-${c.code} ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleCrownClick(c.code)}
                      title={c.desc}
                      style={isSelected ? { borderColor: c.color, boxShadow: `0 0 0 2px ${c.color}40` } : {}}
                    >
                      <span className="color-swatch-dot" style={{ backgroundColor: c.color }} />
                      <span className="key-code">{c.code}</span>
                      <span className="key-label">{c.label}</span>
                      {c.isDMF && <span className={`dmf-tag tag-${c.isDMF}`}>{c.isDMF}</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ROOT OPTIONS GROUP */}
            <div className={`option-group-card ${activePart === 'root' ? 'highlighted-group' : ''}`}>
              <div className="group-header">
                <span className="group-icon">🦷</span>
                <h4>Root Status Options</h4>
                <span className="group-sub-hint">Click option to fill root</span>
              </div>
              <div className="chip-container">
                {CLINICAL_CONSTANTS.ROOT_CODES.map(r => {
                  const isSelected = rootCode === r.code;
                  return (
                    <button
                      type="button"
                      key={r.code}
                      className={`chip root-chip code-${r.code} ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleRootClick(r.code)}
                      title={r.desc}
                      style={isSelected ? { borderColor: r.color, boxShadow: `0 0 0 2px ${r.color}40` } : {}}
                    >
                      <span className="color-swatch-dot" style={{ backgroundColor: r.color }} />
                      <span className="key-code">{r.code}</span>
                      <span className="key-label">{r.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <span className="footer-tip">
            💡 Clicking a Crown option colors the crown. Clicking a Root option colors the root. Both can be active together.
          </span>
          <button
            type="button"
            className="btn primary btn-sm"
            onClick={() => setActiveTooth(null)}
          >
            Done
          </button>
        </div>
      </div>
    </>
  );
}
