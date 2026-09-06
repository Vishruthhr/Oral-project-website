import React from 'react';
import { useDental } from '../context/DentalContext';
import { CLINICAL_CONSTANTS } from '../utils/clinicalConstants';

export default function OtherFindingsSection() {
  const { currentRecord, updateField, saveRecord, resetForm, setHelpDrawerOpen, playClick } = useDental();

  return (
    <section className="card" id="sec-other">
      <h2>
        <span className="sec-num">04</span> Other Findings
      </h2>
      <div className="card-sub">Fluorosis, trauma, oral mucosa, prosthetic status, treatment need</div>

      <div className="grid2">
        <div className="field">
          <label className="field-label">
            Dental Fluorosis
            <button
              type="button"
              className="help-ico"
              onClick={() => setHelpDrawerOpen(true)}
            >
              i
            </button>
          </label>
          <select
            id="f_fluorosis"
            value={currentRecord.fluorosis}
            onChange={e => updateField('fluorosis', e.target.value)}
          >
            {CLINICAL_CONSTANTS.FLUOROSIS_OPTS.map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="field-label">
            Traumatic Dental Injury
            <button
              type="button"
              className="help-ico"
              onClick={() => setHelpDrawerOpen(true)}
            >
              i
            </button>
          </label>
          <select
            id="f_tdi"
            value={currentRecord.tdi}
            onChange={e => updateField('tdi', e.target.value)}
          >
            {CLINICAL_CONSTANTS.TDI_OPTS.map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="field">
        <label className="field-label">Oral Mucosal Lesion Present?</label>
        <div className="chip-row" id="chips_oml">
          <button
            type="button"
            className={`chip ${currentRecord.omlPresent === 'Y' ? 'selected' : ''}`}
            onClick={() => {
              playClick();
              updateField('omlPresent', 'Y');
            }}
          >
            Yes
          </button>
          <button
            type="button"
            className={`chip ${currentRecord.omlPresent !== 'Y' ? 'selected' : ''}`}
            onClick={() => {
              playClick();
              updateField('omlPresent', 'N');
            }}
          >
            No
          </button>
        </div>
      </div>

      {currentRecord.omlPresent === 'Y' && (
        <div className="grid2" id="omlDetails" style={{ display: 'grid' }}>
          <div className="field">
            <label className="field-label">
              OML Site
              <button
                type="button"
                className="help-ico"
                onClick={() => setHelpDrawerOpen(true)}
              >
                i
              </button>
            </label>
            <select
              id="f_omlSite"
              value={currentRecord.omlSite}
              onChange={e => updateField('omlSite', e.target.value)}
            >
              {CLINICAL_CONSTANTS.OML_SITE_OPTS.map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label className="field-label">
              OML Condition
              <button
                type="button"
                className="help-ico"
                onClick={() => setHelpDrawerOpen(true)}
              >
                i
              </button>
            </label>
            <select
              id="f_omlCondition"
              value={currentRecord.omlCondition}
              onChange={e => updateField('omlCondition', e.target.value)}
            >
              {CLINICAL_CONSTANTS.OML_COND_OPTS.map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="grid2">
        <div className="field">
          <label className="field-label">
            Prosthesis — Upper
            <button
              type="button"
              className="help-ico"
              onClick={() => setHelpDrawerOpen(true)}
            >
              i
            </button>
          </label>
          <select
            id="f_prosUpper"
            value={currentRecord.prosUpper}
            onChange={e => updateField('prosUpper', e.target.value)}
          >
            {CLINICAL_CONSTANTS.PROS_OPTS.map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="field-label">Prosthesis — Lower</label>
          <select
            id="f_prosLower"
            value={currentRecord.prosLower}
            onChange={e => updateField('prosLower', e.target.value)}
          >
            {CLINICAL_CONSTANTS.PROS_OPTS.map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="field">
        <label className="field-label">
          Overall Treatment Need
          <button
            type="button"
            className="help-ico"
            onClick={() => setHelpDrawerOpen(true)}
          >
            i
          </button>
        </label>
        <select
          id="f_treatment"
          value={currentRecord.treatment}
          onChange={e => updateField('treatment', e.target.value)}
        >
          {CLINICAL_CONSTANTS.TREAT_OPTS.map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label className="field-label">Notes</label>
        <textarea
          id="f_notes"
          rows="3"
          value={currentRecord.notes}
          onChange={e => updateField('notes', e.target.value)}
          placeholder="Optional remarks..."
        />
      </div>

      <div className="action-row">
        <button type="button" className="btn ghost" onClick={resetForm}>
          Clear Form
        </button>
        <button type="button" className="btn primary" onClick={saveRecord}>
          💾 Validate &amp; Save Record
        </button>
      </div>
    </section>
  );
}
