import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

function emptyToNull(value) {
  return value === '' || value === undefined ? null : value;
}

function numberOrNull(value) {
  if (value === '' || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizePerioMeasurements(perio) {
  return Object.fromEntries(Object.entries(perio || {}).map(([toothNum, tooth]) => {
    const normalizeMap = (values) => Object.fromEntries(Object.entries(values || {}).map(([site, value]) => [
      site,
      numberOrNull(value),
    ]));
    return [toothNum, {
      ...tooth,
      mobility: numberOrNull(tooth.mobility) ?? 0,
      furcation: Object.fromEntries(Object.entries(tooth.furcation || {}).map(([surface, value]) => [
        surface,
        numberOrNull(value) ?? 0,
      ])),
      gm: normalizeMap(tooth.gm),
      pd: normalizeMap(tooth.pd),
    }];
  }));
}

function mapDatabaseRecord(row) {
  const teeth = {};
  for (const tooth of row.teeth_status || []) {
    teeth[tooth.tooth_num] = { crown: tooth.crown_code || '', root: tooth.root_code || '' };
  }

  const perio = {};
  for (const tooth of row.perio_tooth || []) {
    const sites = tooth.perio_site || [];
    const siteValues = (field, defaultValue) => Object.fromEntries(
      sites.map(site => [site.site, site[field] ?? defaultValue])
    );
    perio[tooth.tooth_num] = {
      present: tooth.present,
      implant: tooth.implant,
      mobility: tooth.mobility,
      furcation: { b: tooth.furcation_b, dp: tooth.furcation_dp, mp: tooth.furcation_mp, l: tooth.furcation_l },
      bop: siteValues('bop', false),
      plaque: siteValues('plaque', false),
      gm: siteValues('gm', 0),
      pd: siteValues('pd', 2),
      note: tooth.note || '',
    };
  }

  const sextants = row.perio_sextant || [];
  const ordered = Array.from({ length: 6 }, (_, sextant) => sextants.find(item => item.sextant === sextant));

  return {
    id: row.id,
    participantId: row.participant_id,
    patientName: row.patient_name,
    examDate: row.exam_date,
    examinerId: row.examiner_code || '',
    village: row.village || '',
    phoneNumber: row.phone_number || '',
    sex: row.sex === 'male' ? '1' : '2',
    dob: row.dob || '',
    education: row.education == null ? '' : String(row.education),
    ethnicGroup: row.ethnic_group || '',
    ethnicGroupOther: row.ethnic_group_other || '',
    occupation: row.occupation || '',
    occupationOther: row.occupation_other || '',
    habits: row.habits || '',
    teeth,
    perio,
    cpi: ordered.map(item => item?.cpi || ''),
    loa: ordered.map(item => item?.loa || ''),
    fluorosis: row.fluorosis || '',
    tdi: row.tdi || '',
    omlPresent: row.oml_present ? 'Y' : 'N',
    omlSite: row.oml_site || '',
    omlCondition: row.oml_condition || '',
    prosUpper: row.pros_upper || '',
    prosLower: row.pros_lower || '',
    treatment: row.treatment || '',
    notes: row.notes || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getClinicalRecords() {
  if (!supabase) throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  const { data, error } = await supabase
    .from('patient_records')
    .select('*, teeth_status(*), perio_tooth(*, perio_site(*)), perio_sextant(*)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(mapDatabaseRecord);
}

export async function saveClinicalRecord(record) {
  if (!supabase) throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  const { data, error } = await supabase.rpc('save_clinical_record', { p_record: record });
  if (error) throw error;
  return { ...record, id: data };
}

export async function deleteClinicalRecord(id) {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { error } = await supabase.from('patient_records').delete().eq('id', id);
  if (error) throw error;
}

export async function deleteAllClinicalRecords() {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { error } = await supabase.from('patient_records').delete().not('id', 'is', null);
  if (error) throw error;
}

export function toClinicalRecordPayload(record) {
  return {
    ...record,
    perio: normalizePerioMeasurements(record.perio),
    sex: record.sex === '1' ? 'male' : record.sex === '2' ? 'female' : null,
    education: numberOrNull(record.education),
    phoneNumber: emptyToNull(record.phoneNumber),
  };
}