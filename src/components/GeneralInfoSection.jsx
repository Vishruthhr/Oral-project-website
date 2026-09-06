import React from 'react';
import { useDental } from '../context/DentalContext';

export default function GeneralInfoSection() {
  const { currentRecord, updateField, calculatedAge, playClick } = useDental();

  return (
    <section className="card" id="sec-general">
      <h2><span className="sec-num">01</span> General Information</h2>
      <div className="card-sub">Demographics and examination details</div>

      <div className="grid2">
        <div className="field">
          <label className="field-label" htmlFor="f_participantId">Participant ID <span className="req">*</span></label>
          <input
            type="text"
            id="f_participantId"
            value={currentRecord.participantId}
            onChange={e => updateField('participantId', e.target.value)}
            placeholder="e.g. KA-DVG-001"
            autoComplete="off"
          />
        </div>

        <div className="field">
          <label className="field-label" htmlFor="f_examDate">Examination Date <span className="req">*</span></label>
          <input
            type="date"
            id="f_examDate"
            value={currentRecord.examDate}
            onChange={e => updateField('examDate', e.target.value)}
          />
        </div>
      </div>

      <div className="grid2">
        <div className="field">
          <label className="field-label" htmlFor="f_examinerId">Examiner ID</label>
          <input
            type="text"
            id="f_examinerId"
            value={currentRecord.examinerId}
            onChange={e => updateField('examinerId', e.target.value)}
            placeholder="e.g. EX1"
          />
        </div>

        <div className="field">
          <label className="field-label" htmlFor="f_village">Village / Area</label>
          <input
            type="text"
            id="f_village"
            value={currentRecord.village}
            onChange={e => updateField('village', e.target.value)}
            placeholder="e.g. Area 4 / North Village"
          />
        </div>
      </div>

      <div className="grid2">
        <div className="field">
          <label className="field-label">Location <span className="req">*</span></label>
          <div className="chip-row">
            {[
              { val: '1', label: 'Urban' },
              { val: '2', label: 'Peri-urban' },
              { val: '3', label: 'Rural' }
            ].map(loc => (
              <button
                type="button"
                key={loc.val}
                className={`chip ${currentRecord.location === loc.val ? 'selected' : ''}`}
                onClick={() => {
                  playClick();
                  updateField('location', loc.val);
                }}
              >
                {loc.label}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label className="field-label">Sex <span className="req">*</span></label>
          <div className="chip-row">
            {[
              { val: '1', label: 'Male' },
              { val: '2', label: 'Female' }
            ].map(s => (
              <button
                type="button"
                key={s.val}
                className={`chip ${currentRecord.sex === s.val ? 'selected' : ''}`}
                onClick={() => {
                  playClick();
                  updateField('sex', s.val);
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid3">
        <div className="field">
          <label className="field-label" htmlFor="f_dob">Date of Birth</label>
          <input
            type="date"
            id="f_dob"
            value={currentRecord.dob}
            onChange={e => updateField('dob', e.target.value)}
          />
        </div>

        <div className="field">
          <label className="field-label">Age (auto-calculated)</label>
          <div className="readonly-pill">
            {calculatedAge !== null ? `${calculatedAge} years` : '— years'}
          </div>
        </div>

        <div className="field">
          <label className="field-label" htmlFor="f_education">Years of Education</label>
          <input
            type="number"
            id="f_education"
            min="0"
            max="30"
            value={currentRecord.education}
            onChange={e => updateField('education', e.target.value)}
            placeholder="e.g. 12"
          />
        </div>
      </div>

      <div className="grid2">
        <div className="field">
          <label className="field-label" htmlFor="f_ethnicGroup">Ethnic Group</label>
          <input
            type="text"
            id="f_ethnicGroup"
            value={currentRecord.ethnicGroup}
            onChange={e => updateField('ethnicGroup', e.target.value)}
            placeholder="e.g. Group A"
          />
        </div>

        <div className="field">
          <label className="field-label" htmlFor="f_occupation">Occupation</label>
          <input
            type="text"
            id="f_occupation"
            value={currentRecord.occupation}
            onChange={e => updateField('occupation', e.target.value)}
            placeholder="e.g. Farmer, Homemaker, Teacher"
          />
        </div>
      </div>
    </section>
  );
}
