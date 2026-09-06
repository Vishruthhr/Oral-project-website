/**
 * Export and Reporting Engine for CSV / JSON / PDF Assessment Reports
 */
import { CLINICAL_CONSTANTS } from './clinicalConstants';

function escapeCSV(val) {
  if (val === undefined || val === null) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

function downloadFile(content, filename, mimeType) {
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

export function calcAge(dob, examDate) {
  if (!dob) return null;
  const d1 = new Date(dob);
  const d2 = examDate ? new Date(examDate) : new Date();
  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;

  let age = d2.getFullYear() - d1.getFullYear();
  const m = d2.getMonth() - d1.getMonth();
  if (m < 0 || (m === 0 && d2.getDate() < d1.getDate())) age--;
  return age >= 0 ? age : null;
}

export function calcDMFT(record) {
  let D = 0, M = 0, F = 0, sound = 0, recorded = 0;
  if (!record || !record.teeth) return { D: 0, M: 0, F: 0, DMFT: 0, sound: 0, recorded: 0 };

  CLINICAL_CONSTANTS.ALL_TEETH.forEach(t => {
    const tooth = record.teeth[t];
    if (tooth && tooth.crown !== undefined && tooth.crown !== '') {
      recorded++;
      const c = tooth.crown;
      if (c === '1' || c === '2') D++;
      else if (c === '4') M++;
      else if (c === '3') F++;
      else if (c === '0') sound++;
    }
  });

  return { D, M, F, DMFT: D + M + F, sound, recorded };
}

export function getWorstCPI(record) {
  if (!record || !record.cpi) return '—';
  const hierarchy = ['4', '3', '2', '1', '0'];
  for (const code of hierarchy) {
    if (record.cpi.includes(code)) return code;
  }
  return '—';
}

export function exportRecordsToCSV(records) {
  if (!records || records.length === 0) return false;

  const headers = [
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

  CLINICAL_CONSTANTS.ALL_TEETH.forEach(t => headers.push(`T${t}_Crown`));
  CLINICAL_CONSTANTS.ALL_TEETH.forEach(t => headers.push(`T${t}_Root`));

  headers.push('D', 'M', 'F', 'DMFT_Total', 'Sound_Teeth');

  for (let i = 1; i <= 6; i++) headers.push(`CPI_Sextant_${i}`);
  for (let i = 1; i <= 6; i++) headers.push(`LOA_Sextant_${i}`);
  headers.push('Worst_CPI');

  headers.push(
    'Fluorosis_Dean',
    'TDI_Trauma',
    'OML_Present',
    'OML_Site',
    'OML_Condition',
    'Prosthesis_Upper',
    'Prosthesis_Lower',
    'Treatment_Need',
    'Clinical_Notes'
  );

  const rows = [headers.map(h => escapeCSV(h)).join(',')];

  records.forEach(r => {
    const stats = calcDMFT(r);
    const age = calcAge(r.dob, r.examDate);
    const locLabel = { '1': 'Urban', '2': 'Peri-urban', '3': 'Rural' }[r.location] || '';
    const sexLabel = { '1': 'Male', '2': 'Female' }[r.sex] || '';

    const row = [
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
      r.education !== undefined ? r.education : '',
      r.ethnicGroup || '',
      r.occupation || ''
    ];

    CLINICAL_CONSTANTS.ALL_TEETH.forEach(t => {
      row.push(r.teeth && r.teeth[t] ? (r.teeth[t].crown || '') : '');
    });

    CLINICAL_CONSTANTS.ALL_TEETH.forEach(t => {
      row.push(r.teeth && r.teeth[t] ? (r.teeth[t].root || '') : '');
    });

    row.push(stats.D, stats.M, stats.F, stats.DMFT, stats.sound);

    for (let i = 0; i < 6; i++) {
      row.push(r.cpi && r.cpi[i] !== undefined ? r.cpi[i] : '');
    }
    for (let i = 0; i < 6; i++) {
      row.push(r.loa && r.loa[i] !== undefined ? r.loa[i] : '');
    }

    row.push(getWorstCPI(r));

    row.push(
      r.fluorosis || '',
      r.tdi || '',
      r.omlPresent || 'N',
      r.omlPresent === 'Y' ? (r.omlSite || '') : '',
      r.omlPresent === 'Y' ? (r.omlCondition || '') : '',
      r.prosUpper || '',
      r.prosLower || '',
      r.treatment || '',
      r.notes || ''
    );

    rows.push(row.map(v => escapeCSV(v)).join(','));
  });

  const timestamp = new Date().toISOString().slice(0, 10);
  downloadFile(rows.join('\r\n'), `Oral_Health_Clinical_Records_${timestamp}.csv`, 'text/csv;charset=utf-8;');
  return true;
}

export function exportRecordsToJSON(records) {
  if (!records || records.length === 0) return false;
  const timestamp = new Date().toISOString().slice(0, 10);
  const payload = {
    meta: {
      title: 'Oral Health Clinical Assessment Database Backup',
      exportedAt: new Date().toISOString(),
      recordCount: records.length
    },
    records
  };
  downloadFile(JSON.stringify(payload, null, 2), `Oral_Health_Backup_${timestamp}.json`, 'application/json');
  return true;
}
