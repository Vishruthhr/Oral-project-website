import React from 'react';
import { useDental } from '../context/DentalContext';
import { CLINICAL_CONSTANTS } from '../utils/clinicalConstants';

export default function ToothKeypadModal() {
  const {
    activeTooth,
    setActiveTooth,
    keypadMode,
    setKeypadMode,
    currentRecord,
    updateToothStatus,
    navigateTooth,
    playClick
  } = useDental();

  if (!activeTooth) return null;

  const currentToothState = currentRecord.teeth[activeTooth] || { crown: '', root: '' };
  const seqIndex = CLINICAL_CONSTANTS.EXAM_SEQUENCE.indexOf(activeTooth) + 1;

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

  return (
    <>
      <div className="modal-backdrop open" onClick={() => setActiveTooth(null)} />

      <div className="tooth-keypad-modal open" role="dialog" aria-modal="true">
        <div className="modal-header">
          <div>
            <h3 style={{ margin: '0 0 2px', fontFamily: 'var(--serif)', fontSize: '18px', color: 'var(--navy-2)' }}>
              Tooth <b>#{activeTooth}</b> · <span style={{ fontSize: '13px', color: 'var(--teal)' }}>{info.quadrant}</span>
            </h3>
            <div style={{ fontSize: '11.5px', color: 'var(--muted)' }}>
              {info.name} — Step {seqIndex}/32
            </div>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              type="button"
              className="btn ghost btn-sm"
              onClick={() => navigateTooth(-1)}
            >
              ◀ Prev
            </button>
            <button
              type="button"
              className="btn ghost btn-sm"
              onClick={() => navigateTooth(1)}
            >
              Next ▶
            </button>
            <button
              type="button"
              className="btn ghost btn-sm"
              onClick={() => setActiveTooth(null)}
            >
              ✕
            </button>
          </div>
        </div>

        <div className="modal-mode-tabs">
          <button
            type="button"
            className={`mode-tab ${keypadMode === 'crown' ? 'active' : ''}`}
            onClick={() => {
              playClick();
              setKeypadMode('crown');
            }}
          >
            Crown Status
          </button>
          <button
            type="button"
            className={`mode-tab ${keypadMode === 'root' ? 'active' : ''}`}
            onClick={() => {
              playClick();
              setKeypadMode('root');
            }}
          >
            Root Status
          </button>
        </div>

        <div className="modal-keypad-body">
          {keypadMode === 'crown' ? (
            <div className="chip-container">
              {CLINICAL_CONSTANTS.CROWN_CODES.map(c => (
                <button
                  type="button"
                  key={c.code}
                  className={`chip code-chip code-${c.code} ${currentToothState.crown === c.code ? 'selected' : ''}`}
                  onClick={() => updateToothStatus(activeTooth, 'crown', c.code)}
                >
                  <span className="key-code">{c.code}</span>
                  <span className="key-label">{c.label}</span>
                  {c.isDMF && <span className={`dmf-tag tag-${c.isDMF}`}>{c.isDMF}</span>}
                </button>
              ))}
            </div>
          ) : (
            <div className="chip-container">
              {CLINICAL_CONSTANTS.ROOT_CODES.map(r => (
                <button
                  type="button"
                  key={r.code}
                  className={`chip root-chip code-${r.code} ${currentToothState.root === r.code ? 'selected' : ''}`}
                  onClick={() => updateToothStatus(activeTooth, 'root', r.code)}
                >
                  <span className="key-code">{r.code}</span>
                  <span className="key-label">{r.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
            Tap a code to assign. Auto-advances in Crown mode.
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
