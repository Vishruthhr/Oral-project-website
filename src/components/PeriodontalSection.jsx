import React from 'react';
import { useDental } from '../context/DentalContext';
import { CLINICAL_CONSTANTS } from '../utils/clinicalConstants';

export default function PeriodontalSection() {
  const { currentRecord, updateField, setHelpDrawerOpen, playClick } = useDental();

  function handleCPIChange(index, val) {
    playClick();
    const updated = [...currentRecord.cpi];
    updated[index] = val;
    updateField('cpi', updated);
  }

  function handleLOAChange(index, val) {
    playClick();
    const updated = [...currentRecord.loa];
    updated[index] = val;
    updateField('loa', updated);
  }

  return (
    <section className="card" id="sec-perio">
      <h2>
        <span className="sec-num">03</span> Periodontal Status
        <button
          type="button"
          className="help-ico"
          onClick={() => setHelpDrawerOpen(true)}
          title="View CPI & LOA Codes"
        >
          i
        </button>
      </h2>
      <div className="card-sub">Community Periodontal Index (CPI) and Loss of Attachment (LOA), per sextant</div>

      <div className="sextant-grid" id="sextantGrid">
        {CLINICAL_CONSTANTS.SEXTANTS.map((sx, i) => (
          <div key={sx.id} className="sextant-card" data-sextant={i}>
            <div className="sx-title">
              <span className="sx-badge">{sx.name}</span>
              <span className="sx-teeth">{sx.teeth}</span>
            </div>

            <div className="sx-field">
              <label className="sx-label">CPI (Bleeding / Calculus / Pockets)</label>
              <select
                className="input-select sx-select"
                value={currentRecord.cpi[i] || ''}
                onChange={e => handleCPIChange(i, e.target.value)}
              >
                {CLINICAL_CONSTANTS.CPI_OPTS.map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>

            <div className="sx-field">
              <label className="sx-label">LOA (Loss of Attachment)</label>
              <select
                className="input-select sx-select"
                value={currentRecord.loa[i] || ''}
                onChange={e => handleLOAChange(i, e.target.value)}
              >
                {CLINICAL_CONSTANTS.LOA_OPTS.map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
