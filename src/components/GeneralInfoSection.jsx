import React from 'react';
import { useDental } from '../context/DentalContext';
import { CLINICAL_CONSTANTS } from '../utils/clinicalConstants';

export default function GeneralInfoSection() {
  const { currentRecord, updateField, calculatedAge, playClick } = useDental();

  const phoneVal = currentRecord.phoneNumber || '';
  const isPhoneInvalid = phoneVal.length > 0 && phoneVal.length < 10;

  const handlePhoneChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
    updateField('phoneNumber', raw);
  };

  const handleEthnicChange = (e) => {
    const val = e.target.value;
    updateField('ethnicGroup', val);
    if (val !== 'Other') {
      updateField('ethnicGroupOther', '');
    }
  };

  const handleOccupationChange = (e) => {
    const val = e.target.value;
    updateField('occupation', val);
    if (val !== '3') {
      updateField('occupationOther', '');
    }
  };

  const isEthnicOtherVisible = currentRecord.ethnicGroup === 'Other';
  const isEthnicOtherInvalid = isEthnicOtherVisible && (!currentRecord.ethnicGroupOther || !currentRecord.ethnicGroupOther.trim());

  const isOccupationOtherVisible = currentRecord.occupation === '3';
  const isOccupationOtherInvalid = isOccupationOtherVisible && (!currentRecord.occupationOther || !currentRecord.occupationOther.trim());

  return (
    <section className="card" id="sec-general">
      <h2><span className="sec-num">01</span> General Information</h2>
      <div className="card-sub">Demographics and examination details</div>

      <div className="grid2">
        <div className="field">
          <label className="field-label" htmlFor="f_patientName">
            Patient Name <span className="req">*</span>
          </label>
          <input
            type="text"
            id="f_patientName"
            value={currentRecord.patientName || ''}
            onChange={e => updateField('patientName', e.target.value)}
            placeholder="e.g. John Doe"
            autoComplete="off"
          />
        </div>

        <div className="field">
          <label className="field-label" htmlFor="f_participantId">
            Patient ID <span className="req">*</span>
          </label>
          <input
            type="text"
            id="f_participantId"
            value={currentRecord.participantId || ''}
            onChange={e => updateField('participantId', e.target.value)}
            placeholder="e.g. KA-DVG-001"
            autoComplete="off"
          />
        </div>
      </div>

      <div className="grid3">
        <div className="field">
          <label className="field-label" htmlFor="f_examDate">
            Examination Date <span className="req">*</span>
          </label>
          <input
            type="date"
            id="f_examDate"
            value={currentRecord.examDate || ''}
            onChange={e => updateField('examDate', e.target.value)}
          />
        </div>

        <div className="field">
          <label className="field-label" htmlFor="f_examinerId">Examiner ID</label>
          <input
            type="text"
            id="f_examinerId"
            value={currentRecord.examinerId || ''}
            onChange={e => updateField('examinerId', e.target.value)}
            placeholder="e.g. EX1"
          />
        </div>

        <div className="field">
          <label className="field-label" htmlFor="f_village">Village / Area</label>
          <input
            type="text"
            id="f_village"
            value={currentRecord.village || ''}
            onChange={e => updateField('village', e.target.value)}
            placeholder="e.g. Area 4 / North Village"
          />
        </div>
      </div>

      <div className="grid2">
        <div className="field">
          <label className="field-label" htmlFor="f_phoneNumber">Phone Number</label>
          <input
            type="tel"
            id="f_phoneNumber"
            value={phoneVal}
            onChange={handlePhoneChange}
            placeholder="e.g. 9876543210"
            className={isPhoneInvalid ? 'input-error' : ''}
          />
          {isPhoneInvalid && (
            <span className="field-inline-error">Phone number must be exactly 10 digits ({phoneVal.length}/10)</span>
          )}
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
            value={currentRecord.dob || ''}
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
            value={currentRecord.education !== undefined ? currentRecord.education : ''}
            onChange={e => updateField('education', e.target.value)}
            placeholder="e.g. 12"
          />
        </div>
      </div>

      <div className="grid2">
        <div className="field-group">
          <div className="field">
            <label className="field-label" htmlFor="f_ethnicGroup">Ethnic Group</label>
            <select
              id="f_ethnicGroup"
              value={currentRecord.ethnicGroup || ''}
              onChange={handleEthnicChange}
            >
              {CLINICAL_CONSTANTS.ETHNIC_OPTS.map(([val, lbl]) => (
                <option key={val} value={val}>{lbl}</option>
              ))}
            </select>
          </div>

          {isEthnicOtherVisible && (
            <div className="field specify-field animate-fade-in" style={{ marginTop: '10px' }}>
              <label className="field-label" htmlFor="f_ethnicGroupOther">
                Please specify <span className="req">*</span>
              </label>
              <input
                type="text"
                id="f_ethnicGroupOther"
                value={currentRecord.ethnicGroupOther || ''}
                onChange={e => updateField('ethnicGroupOther', e.target.value)}
                placeholder="Enter ethnic group"
                className={isEthnicOtherInvalid ? 'input-error' : ''}
              />
              {isEthnicOtherInvalid && (
                <span className="field-inline-error">Please specify ethnic group</span>
              )}
            </div>
          )}
        </div>

        <div className="field-group">
          <div className="field">
            <label className="field-label" htmlFor="f_occupation">Occupation</label>
            <select
              id="f_occupation"
              value={currentRecord.occupation || ''}
              onChange={handleOccupationChange}
            >
              {CLINICAL_CONSTANTS.OCCUPATION_OPTS.map(([val, lbl]) => (
                <option key={val} value={val}>{lbl}</option>
              ))}
            </select>
          </div>

          {isOccupationOtherVisible && (
            <div className="field specify-field animate-fade-in" style={{ marginTop: '10px' }}>
              <label className="field-label" htmlFor="f_occupationOther">
                Please specify <span className="req">*</span>
              </label>
              <input
                type="text"
                id="f_occupationOther"
                value={currentRecord.occupationOther || ''}
                onChange={e => updateField('occupationOther', e.target.value)}
                placeholder="Enter occupation"
                className={isOccupationOtherInvalid ? 'input-error' : ''}
              />
              {isOccupationOtherInvalid && (
                <span className="field-inline-error">Please specify occupation</span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="field" style={{ marginTop: '14px' }}>
        <label className="field-label" htmlFor="f_habits">Habits</label>
        <textarea
          id="f_habits"
          rows="2"
          value={currentRecord.habits || ''}
          onChange={e => updateField('habits', e.target.value)}
          placeholder="e.g., smoking, drinking, tobacco chewing"
        />
      </div>
    </section>
  );
}
