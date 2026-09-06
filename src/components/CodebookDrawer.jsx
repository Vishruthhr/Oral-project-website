import React from 'react';
import { useDental } from '../context/DentalContext';
import { CLINICAL_CONSTANTS } from '../utils/clinicalConstants';

export default function CodebookDrawer() {
  const { helpDrawerOpen, setHelpDrawerOpen } = useDental();

  if (!helpDrawerOpen) return null;

  const sections = [
    { title: 'Crown Status', rows: CLINICAL_CONSTANTS.CROWN_CODES.map(o => [o.code, o.label]) },
    { title: 'Root Status', rows: CLINICAL_CONSTANTS.ROOT_CODES.map(o => [o.code, o.label]) },
    { title: 'CPI (per sextant)', rows: CLINICAL_CONSTANTS.CPI_OPTS.slice(1) },
    { title: 'Loss of Attachment (per sextant)', rows: CLINICAL_CONSTANTS.LOA_OPTS.slice(1) },
    { title: "Dental Fluorosis — Dean's Index", rows: CLINICAL_CONSTANTS.FLUOROSIS_OPTS.slice(1) },
    { title: 'Traumatic Dental Injury', rows: CLINICAL_CONSTANTS.TDI_OPTS.slice(1) },
    { title: 'Oral Mucosal Lesion — Site', rows: CLINICAL_CONSTANTS.OML_SITE_OPTS.slice(1) },
    { title: 'Oral Mucosal Lesion — Condition', rows: CLINICAL_CONSTANTS.OML_COND_OPTS.slice(1) },
    { title: 'Prosthetic Status', rows: CLINICAL_CONSTANTS.PROS_OPTS.slice(1) },
    { title: 'Overall Treatment Need', rows: CLINICAL_CONSTANTS.TREAT_OPTS.slice(1) }
  ];

  return (
    <>
      <div className="drawer-backdrop open" onClick={() => setHelpDrawerOpen(false)} />

      <div className="drawer open" role="dialog" aria-modal="true">
        <div className="drawer-head">
          <h2>Clinical Reference &amp; Codebook</h2>
          <button
            type="button"
            className="drawer-close"
            onClick={() => setHelpDrawerOpen(false)}
          >
            ✕
          </button>
        </div>

        <div className="drawer-body">
          <p style={{ fontSize: '12.5px', color: 'var(--muted)', marginTop: 0 }}>
            Reference clinical coding scheme for standardized oral health assessments. Every dropdown and tooth-status button is restricted to these criteria.
          </p>

          {sections.map(sec => (
            <div key={sec.title} className="cb-section">
              <h3>{sec.title}</h3>
              {sec.rows.map(([code, meaning]) => (
                <div key={code} className="cb-row">
                  <div className="cb-code">{code}</div>
                  <div className="cb-meaning">{meaning}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
