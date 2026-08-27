/**
 * Clinical Oral Health Assessment - Export & Reporting Engine
 * CSV, JSON, and Formatted Print Reports
 */

class ExportManager {
  constructor(app) {
    this.app = app;
  }

  escapeCSV(val) {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  }

  exportCSV(records) {
    if (!records || records.length === 0) {
      this.app.showToast('No saved records to export.', 'warning');
      return;
    }

    const headers = [
      'Record_ID',
      'Participant_ID',
      'Exam_Date',
      'Examiner_ID',
      'Village_Area',
      'Location_Code',
      'Location_Label',
      'Sex_Code',
      'Sex_Label',
      'Date_of_Birth',
      'Age_Years',
      'Years_Education',
      'Ethnic_Group',
      'Occupation'
    ];

    // Add 32 Teeth Crown & Root columns in standard sequence
    CLINICAL_CONSTANTS.ALL_TEETH.forEach(t => headers.push(`T${t}_Crown`));
    CLINICAL_CONSTANTS.ALL_TEETH.forEach(t => headers.push(`T${t}_Root`));

    // Summary DMFT columns
    headers.push('Decayed_D', 'Missing_M', 'Filled_F', 'DMFT_Total', 'Sound_Teeth');

    // 6 Periodontal Sextants CPI & LOA
    for (let i = 1; i <= 6; i++) headers.push(`CPI_Sextant_${i}`);
    for (let i = 1; i <= 6; i++) headers.push(`LOA_Sextant_${i}`);
    headers.push('Worst_CPI');

    // Other findings
    headers.push(
      'Fluorosis_Dean',
      'TDI_Trauma',
      'OML_Present',
      'OML_Site',
      'OML_Condition',
      'Prosthesis_Upper',
      'Prosthesis_Lower',
      'Treatment_Need',
      'Clinical_Notes',
      'Created_At',
      'Updated_At'
    );

    const rows = [headers.map(h => this.escapeCSV(h)).join(',')];

    records.forEach(r => {
      const stats = this.app.calcDMFT(r);
      const age = this.app.calcAge(r.dob, r.examDate);
      const locLabel = (CLINICAL_CONSTANTS.LOCATIONS.find(l => l.code === r.location) || {}).label || '';
      const sexLabel = (CLINICAL_CONSTANTS.SEX_TYPES.find(s => s.code === r.sex) || {}).label || '';

      const row = [
        r.id || '',
        r.participantId || '',
        r.examDate || '',
        r.examinerId || '',
        r.village || '',
        r.location || '',
        locLabel,
        r.sex || '',
        sexLabel,
        r.dob || '',
        age !== null ? age : '',
        r.education !== undefined && r.education !== null ? r.education : '',
        r.ethnicGroup || '',
        r.occupation || ''
      ];

      // Tooth Crowns
      CLINICAL_CONSTANTS.ALL_TEETH.forEach(t => {
        const tooth = r.teeth && r.teeth[t] ? r.teeth[t] : {};
        row.push(tooth.crown !== undefined ? tooth.crown : '');
      });

      // Tooth Roots
      CLINICAL_CONSTANTS.ALL_TEETH.forEach(t => {
        const tooth = r.teeth && r.teeth[t] ? r.teeth[t] : {};
        row.push(tooth.root !== undefined ? tooth.root : '');
      });

      // DMFT
      row.push(stats.D, stats.M, stats.F, stats.DMFT, stats.sound);

      // Periodontal CPI
      for (let i = 0; i < 6; i++) {
        row.push(r.cpi && r.cpi[i] !== undefined ? r.cpi[i] : '');
      }

      // Periodontal LOA
      for (let i = 0; i < 6; i++) {
        row.push(r.loa && r.loa[i] !== undefined ? r.loa[i] : '');
      }

      row.push(this.app.getWorstCPI(r));

      // Other findings
      row.push(
        r.fluorosis || '',
        r.tdi || '',
        r.omlPresent || 'N',
        r.omlPresent === 'Y' ? (r.omlSite || '') : '',
        r.omlPresent === 'Y' ? (r.omlCondition || '') : '',
        r.prosUpper || '',
        r.prosLower || '',
        r.treatment || '',
        r.notes || '',
        r.createdAt || '',
        r.updatedAt || ''
      );

      rows.push(row.map(val => this.escapeCSV(val)).join(','));
    });

    const csvContent = rows.join('\r\n');
    const timestamp = new Date().toISOString().slice(0, 10);
    this.downloadFile(csvContent, `Oral_Health_Survey_Records_${timestamp}.csv`, 'text/csv;charset=utf-8;');
    this.app.showToast(`Exported ${records.length} records to CSV successfully!`, 'success');
  }

  exportJSON(records) {
    if (!records || records.length === 0) {
      this.app.showToast('No saved records to export.', 'warning');
      return;
    }

    const payload = {
      meta: {
        format: 'Clinical Oral Health Assessment Standard Format',
        exportedAt: new Date().toISOString(),
        recordCount: records.length,
        version: '2.0-clinical'
      },
      records
    };

    const jsonContent = JSON.stringify(payload, null, 2);
    const timestamp = new Date().toISOString().slice(0, 10);
    this.downloadFile(jsonContent, `Oral_Health_Database_Backup_${timestamp}.json`, 'application/json');
    this.app.showToast(`Exported ${records.length} records to JSON backup!`, 'success');
  }

  importJSON(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        let recordsToImport = [];

        if (Array.isArray(parsed)) {
          recordsToImport = parsed;
        } else if (parsed && Array.isArray(parsed.records)) {
          recordsToImport = parsed.records;
        } else {
          throw new Error('Invalid JSON file format for Oral Health records.');
        }

        if (recordsToImport.length === 0) {
          this.app.showToast('No valid records found in file.', 'warning');
          return;
        }

        let importedCount = 0;
        for (const rec of recordsToImport) {
          await window.storageManager.saveRecord(rec);
          importedCount++;
        }

        this.app.showToast(`Successfully imported ${importedCount} records!`, 'success');
        this.app.refreshRecordsList();
      } catch (err) {
        console.error('Import failed:', err);
        alert('Failed to import JSON file: ' + err.message);
      }
    };
    reader.readAsText(file);
  }

  printRecord(record) {
    if (!record) return;

    const stats = this.app.calcDMFT(record);
    const age = this.app.calcAge(record.dob, record.examDate);
    const loc = (CLINICAL_CONSTANTS.LOCATIONS.find(l => l.code === record.location) || {}).label || '—';
    const sex = (CLINICAL_CONSTANTS.SEX_TYPES.find(s => s.code === record.sex) || {}).label || '—';
    const flu = (CLINICAL_CONSTANTS.FLUOROSIS_CODES.find(f => f.code === record.fluorosis) || {}).label || '—';
    const tdi = (CLINICAL_CONSTANTS.TDI_CODES.find(t => t.code === record.tdi) || {}).label || '—';
    const prosU = (CLINICAL_CONSTANTS.PROSTHETIC_CODES.find(p => p.code === record.prosUpper) || {}).label || '—';
    const prosL = (CLINICAL_CONSTANTS.PROSTHETIC_CODES.find(p => p.code === record.prosLower) || {}).label || '—';
    const treat = (CLINICAL_CONSTANTS.TREATMENT_CODES.find(t => t.code === record.treatment) || {}).label || '—';
    const worstCPI = this.app.getWorstCPI(record);

    let omlSiteLabel = '—', omlCondLabel = '—';
    if (record.omlPresent === 'Y') {
      omlSiteLabel = (CLINICAL_CONSTANTS.OML_SITES.find(s => s.code === record.omlSite) || {}).label || '—';
      omlCondLabel = (CLINICAL_CONSTANTS.OML_CONDITIONS.find(c => c.code === record.omlCondition) || {}).label || '—';
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Pop-up blocked! Please allow pop-ups for this site to print reports.');
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Oral Health Clinical Report - ${record.participantId || 'Patient'}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; font-size: 13px; color: #1e293b; margin: 24px; line-height: 1.4; }
          .header { border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: flex-start; }
          .header h1 { margin: 0; font-size: 19px; color: #0f172a; }
          .header .sub { font-size: 11px; color: #64748b; margin-top: 4px; }
          .badge { background: #e2e8f0; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; }
          .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 16px; background: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0; }
          .grid-item .lbl { font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: 700; }
          .grid-item .val { font-size: 13px; font-weight: 600; color: #0f172a; margin-top: 2px; }
          h2 { font-size: 14px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin: 16px 0 8px; color: #0f172a; }
          .table-teeth { width: 100%; border-collapse: collapse; text-align: center; font-size: 11px; margin-bottom: 14px; }
          .table-teeth th, .table-teeth td { border: 1px solid #cbd5e1; padding: 5px 2px; }
          .table-teeth th { background: #f1f5f9; font-weight: 700; }
          .dmft-bar { display: flex; gap: 16px; background: #0f172a; color: #fff; padding: 10px 16px; border-radius: 6px; margin: 12px 0 18px; }
          .dmft-bar div { text-align: center; flex: 1; }
          .dmft-bar .val { font-size: 18px; font-weight: 700; }
          .dmft-bar .lbl { font-size: 9px; text-transform: uppercase; color: #94a3b8; }
          .sextant-table { width: 100%; border-collapse: collapse; margin-bottom: 14px; font-size: 11px; }
          .sextant-table th, .sextant-table td { border: 1px solid #cbd5e1; padding: 6px; text-align: center; }
          .sextant-table th { background: #f1f5f9; }
          .notes-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px; border-radius: 6px; font-size: 12px; min-height: 40px; }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 16px; display: flex; gap: 10px;">
          <button onclick="window.print()" style="padding: 8px 18px; font-weight: bold; background: #0284c7; color: #fff; border: none; border-radius: 6px; cursor: pointer;">🖨️ Print / Save PDF</button>
          <button onclick="window.close()" style="padding: 8px 18px; background: #e2e8f0; border: none; border-radius: 6px; cursor: pointer;">Close</button>
        </div>

        <div class="header">
          <div>
            <h1>Oral Health Clinical Assessment Report</h1>
            <div class="sub">Standard Clinical Methods Assessment Document</div>
          </div>
          <div>
            <span class="badge">Participant ID: ${record.participantId || 'N/A'}</span>
          </div>
        </div>

        <div class="grid">
          <div class="grid-item"><div class="lbl">Exam Date</div><div class="val">${record.examDate || '—'}</div></div>
          <div class="grid-item"><div class="lbl">Examiner ID</div><div class="val">${record.examinerId || '—'}</div></div>
          <div class="grid-item"><div class="lbl">Village / Area</div><div class="val">${record.village || '—'}</div></div>
          <div class="grid-item"><div class="lbl">Location Type</div><div class="val">${loc}</div></div>
          <div class="grid-item"><div class="lbl">Sex</div><div class="val">${sex}</div></div>
          <div class="grid-item"><div class="lbl">Date of Birth</div><div class="val">${record.dob || '—'}</div></div>
          <div class="grid-item"><div class="lbl">Age</div><div class="val">${age !== null ? age + ' yrs' : '—'}</div></div>
          <div class="grid-item"><div class="lbl">Years Education</div><div class="val">${record.education !== undefined ? record.education : '—'}</div></div>
          <div class="grid-item"><div class="lbl">Ethnic Group</div><div class="val">${record.ethnicGroup || '—'}</div></div>
          <div class="grid-item"><div class="lbl">Occupation</div><div class="val">${record.occupation || '—'}</div></div>
        </div>

        <h2>Dentition Status (FDI Two-Digit Notation)</h2>
        <table class="table-teeth">
          <thead>
            <tr>
              <th colspan="16">Maxillary (Upper) Arch</th>
            </tr>
            <tr>
              ${CLINICAL_CONSTANTS.UPPER_TEETH.map(t => `<th>${t}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            <tr>
              ${CLINICAL_CONSTANTS.UPPER_TEETH.map(t => {
                const c = record.teeth && record.teeth[t] ? record.teeth[t].crown : '';
                return `<td><b>${c !== undefined && c !== '' ? c : '—'}</b></td>`;
              }).join('')}
            </tr>
            <tr style="background:#f8fafc; font-size:10px; color:#64748b;">
              ${CLINICAL_CONSTANTS.UPPER_TEETH.map(t => {
                const r = record.teeth && record.teeth[t] ? record.teeth[t].root : '';
                return `<td>R:${r !== undefined && r !== '' ? r : '—'}</td>`;
              }).join('')}
            </tr>
          </tbody>
        </table>

        <table class="table-teeth">
          <thead>
            <tr>
              <th colspan="16">Mandibular (Lower) Arch</th>
            </tr>
            <tr>
              ${CLINICAL_CONSTANTS.LOWER_TEETH.map(t => `<th>${t}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            <tr>
              ${CLINICAL_CONSTANTS.LOWER_TEETH.map(t => {
                const c = record.teeth && record.teeth[t] ? record.teeth[t].crown : '';
                return `<td><b>${c !== undefined && c !== '' ? c : '—'}</b></td>`;
              }).join('')}
            </tr>
            <tr style="background:#f8fafc; font-size:10px; color:#64748b;">
              ${CLINICAL_CONSTANTS.LOWER_TEETH.map(t => {
                const r = record.teeth && record.teeth[t] ? record.teeth[t].root : '';
                return `<td>R:${r !== undefined && r !== '' ? r : '—'}</td>`;
              }).join('')}
            </tr>
          </tbody>
        </table>

        <div class="dmft-bar">
          <div><div class="val">${stats.D}</div><div class="lbl">Decayed (D)</div></div>
          <div><div class="val">${stats.M}</div><div class="lbl">Missing (M)</div></div>
          <div><div class="val">${stats.F}</div><div class="lbl">Filled (F)</div></div>
          <div><div class="val">${stats.DMFT}</div><div class="lbl">Total DMFT Index</div></div>
          <div><div class="val">${stats.sound}</div><div class="lbl">Sound Teeth (0)</div></div>
        </div>

        <h2>Periodontal Status (CPI & LOA per Sextant)</h2>
        <table class="sextant-table">
          <thead>
            <tr>
              <th>Index</th>
              <th>Sextant 1 (17–14)</th>
              <th>Sextant 2 (13–23)</th>
              <th>Sextant 3 (24–27)</th>
              <th>Sextant 4 (47–44)</th>
              <th>Sextant 5 (43–33)</th>
              <th>Sextant 6 (34–37)</th>
              <th>Worst Score</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><b>CPI</b></td>
              ${(record.cpi || []).map(v => `<td><b>${v || '—'}</b></td>`).join('')}
              <td><b>${worstCPI}</b></td>
            </tr>
            <tr>
              <td><b>LOA</b></td>
              ${(record.loa || []).map(v => `<td><b>${v || '—'}</b></td>`).join('')}
              <td>—</td>
            </tr>
          </tbody>
        </table>

        <h2>Other Oral Findings & Clinical Observations</h2>
        <div class="grid" style="grid-template-columns: repeat(3, 1fr);">
          <div class="grid-item"><div class="lbl">Dental Fluorosis (Dean's)</div><div class="val">${flu}</div></div>
          <div class="grid-item"><div class="lbl">Traumatic Dental Injury</div><div class="val">${tdi}</div></div>
          <div class="grid-item"><div class="lbl">Oral Mucosal Lesion (OML)</div><div class="val">${record.omlPresent === 'Y' ? 'YES — ' + omlCondLabel + ' (' + omlSiteLabel + ')' : 'No lesion present'}</div></div>
          <div class="grid-item"><div class="lbl">Prosthesis (Upper)</div><div class="val">${prosU}</div></div>
          <div class="grid-item"><div class="lbl">Prosthesis (Lower)</div><div class="val">${prosL}</div></div>
          <div class="grid-item"><div class="lbl">Treatment Need</div><div class="val">${treat}</div></div>
        </div>

        <h2>Clinical Remarks & Notes</h2>
        <div class="notes-box">${record.notes ? record.notes.replace(/\n/g, '<br>') : 'No additional clinical remarks.'}</div>

        <div style="margin-top: 30px; display: flex; justify-content: space-between; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 10px;">
          <div>Standard Dental Clinical Assessment Sheet</div>
          <div>Examiner Signature: _______________________</div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  }

  downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }
}

if (typeof window !== 'undefined') {
  window.ExportManager = ExportManager;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ExportManager;
}
