import React, { useState } from 'react';
import { useDental } from '../context/DentalContext';
import { calcDMFT, calcAge, exportRecordsToExcel, readExcelFile } from '../utils/exportUtils';
import { CLINICAL_CONSTANTS } from '../utils/clinicalConstants';
import { storage } from '../utils/storage';

export default function SavedRecordsSection() {
  const { records, loadRecordForEdit, deleteRecord, setRecords, showToastMsg } = useDental();
  const [search, setSearch] = useState('');
  const [examinerFilter, setExaminerFilter] = useState('');

  // Unique examiner IDs for autocompletion
  const uniqueExaminerIds = Array.from(
    new Set(records.map(r => (r.examinerId || '').trim()).filter(Boolean))
  ).sort();

  const filtered = records.filter(r => {
    if (examinerFilter.trim()) {
      const exQ = examinerFilter.toLowerCase().trim();
      const exId = (r.examinerId || '').toLowerCase().trim();
      if (!exId.includes(exQ)) return false;
    }
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      (r.patientName || '').toLowerCase().includes(q) ||
      (r.participantId || '').toLowerCase().includes(q) ||
      (r.examinerId || '').toLowerCase().includes(q) ||
      (r.village || '').toLowerCase().includes(q) ||
      (r.examDate || '').toLowerCase().includes(q)
    );
  });

  // Calculate aggregates for current view
  let totalDMFT = 0;
  let totalAge = 0;
  let ageCount = 0;
  let cariesFreeCount = 0;

  filtered.forEach(r => {
    const stats = calcDMFT(r);
    totalDMFT += stats.DMFT;
    if (stats.DMFT === 0) cariesFreeCount++;
    const age = calcAge(r.dob, r.examDate);
    if (age !== null) {
      totalAge += age;
      ageCount++;
    }
  });

  const meanDMFT = filtered.length > 0 ? (totalDMFT / filtered.length).toFixed(1) : '0.0';
  const meanAge = ageCount > 0 ? (totalAge / ageCount).toFixed(1) + ' yrs' : '—';
  const cariesFreePct = filtered.length > 0 ? Math.round((cariesFreeCount / filtered.length) * 100) + '%' : '0%';

  function handleExportExcel() {
    const recordsToExport = filtered;
    const exTag = examinerFilter.trim();
    const ok = exportRecordsToExcel(recordsToExport, exTag);
    if (ok) {
      const msg = exTag
        ? `Exported ${recordsToExport.length} record(s) for Examiner "${exTag}" to Excel!`
        : `Exported ${recordsToExport.length} record(s) to Excel!`;
      showToastMsg(msg, 'success');
    } else {
      showToastMsg('No records to export.', 'warning');
    }
  }

  async function handleImportExcel(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    try {
      const rows = await readExcelFile(file);
      if (!rows || rows.length === 0) {
        showToastMsg('No data rows found in Excel file.', 'warning');
        return;
      }

      let count = 0;
      for (const r of rows) {
        const participantId = r.Patient_ID || r.participantId || r['Participant ID'] || r['Patient ID'];
        if (!participantId && !r.Patient_Name && !r.patientName) continue;

        const teeth = {};
        CLINICAL_CONSTANTS.ALL_TEETH.forEach(t => {
          teeth[t] = {
            crown: String(r[`T${t}_Crown`] !== undefined ? r[`T${t}_Crown`] : (r.teeth?.[t]?.crown || '')),
            root: String(r[`T${t}_Root`] !== undefined ? r[`T${t}_Root`] : (r.teeth?.[t]?.root || ''))
          };
        });

        const cpi = [];
        const loa = [];
        for (let i = 1; i <= 6; i++) {
          cpi.push(String(r[`CPI_Sextant_${i}`] !== undefined ? r[`CPI_Sextant_${i}`] : ''));
          loa.push(String(r[`LOA_Sextant_${i}`] !== undefined ? r[`LOA_Sextant_${i}`] : ''));
        }

        const rec = {
          id: r.id || `rec_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
          patientName: r.Patient_Name || r.patientName || '',
          participantId: String(participantId || ''),
          examDate: r.Exam_Date || r.examDate || new Date().toISOString().slice(0, 10),
          examinerId: String(r.Examiner_ID || r.examinerId || ''),
          village: r.Village_Area || r.village || '',
          phoneNumber: String(r.Phone_Number || r.phoneNumber || ''),
          sex: String(r.Sex_Code !== undefined ? r.Sex_Code : (r.sex || '')),
          dob: r.Date_of_Birth || r.dob || '',
          education: r.Years_Education !== undefined ? r.Years_Education : (r.education || ''),
          ethnicGroup: r.Ethnic_Group || r.ethnicGroup || '',
          ethnicGroupOther: r.ethnicGroupOther || '',
          occupation: String(r.Occupation_Code !== undefined ? r.Occupation_Code : (r.occupation || '')),
          occupationOther: r.occupationOther || '',
          habits: r.Habits || r.habits || '',
          teeth,
          perio: r.perio || undefined,
          cpi,
          loa,
          fluorosis: String(r.Fluorosis_Dean !== undefined ? r.Fluorosis_Dean : (r.fluorosis || '')),
          tdi: String(r.TDI_Trauma !== undefined ? r.TDI_Trauma : (r.tdi || '')),
          omlPresent: r.OML_Present || r.omlPresent || 'N',
          omlSite: String(r.OML_Site !== undefined ? r.OML_Site : (r.omlSite || '')),
          omlCondition: String(r.OML_Condition !== undefined ? r.OML_Condition : (r.omlCondition || '')),
          omlOtherDetails: r.OML_Other_Details || r.omlOtherDetails || '',
          prosUpper: String(r.Prosthesis_Upper !== undefined ? r.Prosthesis_Upper : (r.prosUpper || '')),
          prosLower: String(r.Prosthesis_Lower !== undefined ? r.Prosthesis_Lower : (r.prosLower || '')),
          treatment: String(r.Treatment_Need !== undefined ? r.Treatment_Need : (r.treatment || '')),
          notes: r.Clinical_Notes || r.notes || ''
        };

        await storage.saveRecord(rec);
        count++;
      }

      const all = await storage.getAllRecords();
      setRecords(all);
      showToastMsg(`Successfully imported ${count} record(s) from Excel!`, 'success');
    } catch (err) {
      showToastMsg('Failed to read Excel file. Please select a valid Excel (.xlsx, .xls, .csv) file.', 'error');
    }
    e.target.value = '';
  }

  return (
    <section className="card" id="sec-records">
      <h2><span className="sec-num">05</span> Saved Records</h2>
      <div className="card-sub">Session records — filter by Examiner ID and export to Excel</div>

      <div className="records-stats-bar">
        <div className="rec-stat-card">
          <div className="stat-val">{filtered.length}</div>
          <div className="stat-lbl">{examinerFilter ? 'Examiner Records' : 'Total Examined'}</div>
        </div>
        <div className="rec-stat-card">
          <div className="stat-val">{meanDMFT}</div>
          <div className="stat-lbl">Mean DMFT</div>
        </div>
        <div className="rec-stat-card">
          <div className="stat-val">{meanAge}</div>
          <div className="stat-lbl">Mean Age</div>
        </div>
        <div className="rec-stat-card">
          <div className="stat-val">{cariesFreePct}</div>
          <div className="stat-lbl">Caries Free (DMFT=0)</div>
        </div>
      </div>

      <div className="action-row" style={{ justifyContent: 'space-between', marginBottom: '14px', alignItems: 'center' }}>
        <div id="recCount" style={{ fontSize: '13px', color: 'var(--muted)' }}>
          {filtered.length} record{filtered.length === 1 ? '' : 's'} displayed
          {examinerFilter.trim() ? ` (filtered by Examiner "${examinerFilter.trim()}")` : ''}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <label className="btn ghost" style={{ cursor: 'pointer', margin: 0, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            📥 Import Excel
            <input type="file" accept=".xlsx, .xls, .csv" onChange={handleImportExcel} style={{ display: 'none' }} />
          </label>
          <button type="button" className="btn teal" onClick={handleExportExcel} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            📊 Export Excel {examinerFilter.trim() ? `(${examinerFilter.trim()})` : ''}
          </button>
        </div>
      </div>

      <div className="grid2" style={{ marginBottom: '14px' }}>
        <div className="search-input-wrap">
          <label className="field-label" style={{ marginBottom: '4px', fontSize: '12px' }}>
            Search Records
          </label>
          <input
            type="text"
            placeholder="🔍 Search by Patient Name, ID, Village..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="search-input-wrap">
          <label className="field-label" style={{ marginBottom: '4px', fontSize: '12px' }}>
            Filter by Examiner ID
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              list="examiner-id-list"
              placeholder="👤 Enter Examiner ID (e.g., EX-01)..."
              value={examinerFilter}
              onChange={e => setExaminerFilter(e.target.value)}
            />
            <datalist id="examiner-id-list">
              {uniqueExaminerIds.map(id => (
                <option key={id} value={id} />
              ))}
            </datalist>
            {examinerFilter && (
              <button
                type="button"
                className="btn ghost"
                style={{ padding: '4px 10px', fontSize: '12px', whiteSpace: 'nowrap' }}
                onClick={() => setExaminerFilter('')}
                title="Clear Examiner Filter"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>
      </div>

      <div id="recordsTableWrap">
        {filtered.length === 0 ? (
          <div className="empty-note">
            {records.length === 0
              ? 'No records saved yet in this session. Fill the form above and click "Validate & Save Record".'
              : 'No matching records found for current filters.'}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="records data-table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Patient ID</th>
                  <th>Examiner ID</th>
                  <th>Exam Date</th>
                  <th>Age</th>
                  <th>DMFT</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => {
                  const stats = calcDMFT(r);
                  const age = calcAge(r.dob, r.examDate);

                  return (
                    <tr key={r.id}>
                      <td><b>{r.patientName || '—'}</b></td>
                      <td>{r.participantId || '—'}</td>
                      <td><span className="badge" style={{ background: 'var(--card-sub-bg)', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>{r.examinerId || '—'}</span></td>
                      <td>{r.examDate || '—'}</td>
                      <td>{age !== null ? age : '—'}</td>
                      <td>
                        <span className={`dmft-pill ${stats.DMFT > 0 ? 'has-decay' : 'sound'}`}>
                          {stats.DMFT}
                        </span>
                      </td>
                      <td className="row-actions">
                        <button
                          type="button"
                          className="icon-link btn-edit"
                          onClick={() => loadRecordForEdit(r)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          type="button"
                          className="icon-link btn-delete"
                          onClick={() => deleteRecord(r.id, r.participantId)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
