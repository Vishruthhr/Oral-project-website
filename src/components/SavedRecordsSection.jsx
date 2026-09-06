import React, { useState } from 'react';
import { useDental } from '../context/DentalContext';
import { calcDMFT, calcAge, exportRecordsToCSV, exportRecordsToJSON } from '../utils/exportUtils';
import { storage } from '../utils/storage';

export default function SavedRecordsSection() {
  const { records, loadRecordForEdit, deleteRecord, setRecords, showToastMsg } = useDental();
  const [search, setSearch] = useState('');

  const filtered = records.filter(r => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      (r.participantId || '').toLowerCase().includes(q) ||
      (r.examinerId || '').toLowerCase().includes(q) ||
      (r.village || '').toLowerCase().includes(q) ||
      (r.examDate || '').toLowerCase().includes(q)
    );
  });

  // Calculate aggregates
  let totalDMFT = 0;
  let totalAge = 0;
  let ageCount = 0;
  let cariesFreeCount = 0;

  records.forEach(r => {
    const stats = calcDMFT(r);
    totalDMFT += stats.DMFT;
    if (stats.DMFT === 0) cariesFreeCount++;
    const age = calcAge(r.dob, r.examDate);
    if (age !== null) {
      totalAge += age;
      ageCount++;
    }
  });

  const meanDMFT = records.length > 0 ? (totalDMFT / records.length).toFixed(1) : '0.0';
  const meanAge = ageCount > 0 ? (totalAge / ageCount).toFixed(1) + ' yrs' : '—';
  const cariesFreePct = records.length > 0 ? Math.round((cariesFreeCount / records.length) * 100) + '%' : '0%';

  function handleExportCSV() {
    const ok = exportRecordsToCSV(records);
    if (ok) showToastMsg(`Exported ${records.length} records to CSV!`, 'success');
    else showToastMsg('No records to export.', 'warning');
  }

  function handleExportJSON() {
    const ok = exportRecordsToJSON(records);
    if (ok) showToastMsg(`Exported ${records.length} records to JSON!`, 'success');
    else showToastMsg('No records to export.', 'warning');
  }

  function handleImportJSON(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const parsed = JSON.parse(evt.target.result);
        const toImport = Array.isArray(parsed) ? parsed : (parsed.records || []);
        if (toImport.length === 0) {
          showToastMsg('No valid records found in JSON.', 'warning');
          return;
        }
        for (const rec of toImport) {
          await storage.saveRecord(rec);
        }
        const all = await storage.getAllRecords();
        setRecords(all);
        showToastMsg(`Imported ${toImport.length} records successfully!`, 'success');
      } catch (err) {
        showToastMsg('Failed to parse JSON file.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  async function handleDeleteAll() {
    if (records.length === 0) return;
    if (window.confirm(`Permanently delete ALL ${records.length} saved records?`)) {
      await storage.clearAllRecords();
      setRecords([]);
      showToastMsg('All records cleared.', 'info');
    }
  }

  return (
    <section className="card" id="sec-records">
      <h2><span className="sec-num">05</span> Saved Records</h2>
      <div className="card-sub">Session records — export to keep them</div>

      <div className="records-stats-bar">
        <div className="rec-stat-card">
          <div className="stat-val">{records.length}</div>
          <div className="stat-lbl">Total Examined</div>
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
          {records.length} record{records.length === 1 ? '' : 's'} saved this session
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <label className="btn ghost" style={{ cursor: 'pointer', margin: 0 }}>
            📥 Import JSON
            <input type="file" accept=".json" onChange={handleImportJSON} style={{ display: 'none' }} />
          </label>
          <button type="button" className="btn ghost" onClick={handleExportJSON}>
            Export JSON
          </button>
          <button type="button" className="btn teal" onClick={handleExportCSV}>
            Export CSV
          </button>
          {records.length > 0 && (
            <button
              type="button"
              className="btn coral"
              style={{ padding: '8px 14px', fontSize: '12px' }}
              onClick={handleDeleteAll}
              title="Delete all records"
            >
              Delete All
            </button>
          )}
        </div>
      </div>

      <div className="search-input-wrap" style={{ marginBottom: '14px' }}>
        <input
          type="text"
          placeholder="🔍 Search records by ID, Examiner, Village..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div id="recordsTableWrap">
        {filtered.length === 0 ? (
          <div className="empty-note">
            {records.length === 0
              ? 'No records saved yet in this session. Fill the form above and click "Validate & Save Record".'
              : 'No matching records found for search query.'}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="records data-table">
              <thead>
                <tr>
                  <th>Participant ID</th>
                  <th>Exam Date</th>
                  <th>Age</th>
                  <th>Location</th>
                  <th>DMFT</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => {
                  const stats = calcDMFT(r);
                  const age = calcAge(r.dob, r.examDate);
                  const locLabel = { '1': 'Urban', '2': 'Peri-urban', '3': 'Rural' }[r.location] || '—';

                  return (
                    <tr key={r.id}>
                      <td><b>{r.participantId || '—'}</b></td>
                      <td>{r.examDate || '—'}</td>
                      <td>{age !== null ? age : '—'}</td>
                      <td>{locLabel}</td>
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
