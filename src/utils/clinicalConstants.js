export const TOOTH_COLOR_CONFIG = {
  crown: {
    '0': { label: 'Sound crown', color: '#FFFDF7', bg: '#F8FAFC', stroke: '#334155', desc: 'No active caries or treatment.' },
    '1': { label: 'Decayed crown', color: '#78350F', bg: '#FEF2F2', stroke: '#451A03', desc: 'Active caries pathology on crown.' },
    '2': { label: 'Filled, with decay', color: '#D97706', bg: '#FFFBEB', stroke: '#92400E', desc: 'Restoration present with active secondary caries.' },
    '3': { label: 'Filled, no decay', color: '#0284C7', bg: '#F0F9FF', stroke: '#0369A1', desc: 'Permanent restoration in sound condition.' },
    '4': { label: 'Missing — caries', color: '#475569', bg: '#F1F5F9', stroke: '#1E293B', desc: 'Extracted due to caries.' },
    '5': { label: 'Missing — other', color: '#64748B', bg: '#F1F5F9', stroke: '#334155', desc: 'Extracted for trauma/ortho/other.' },
    '6': { label: 'Fissure sealant', color: '#0EA5E9', bg: '#F0F9FF', stroke: '#0284C7', desc: 'Pit/fissure sealant placed.' },
    '7': { label: 'Crown / Cap / Bridge', color: '#EAB308', bg: '#FEFCE8', stroke: '#CA8A04', desc: 'Fixed full crown or bridge abutment.' },
    '8': { label: 'Unerupted', color: '#94A3B8', bg: '#F8FAFC', stroke: '#64748B', desc: 'Tooth space unerupted.' },
    'T': { label: 'Trauma (fracture)', color: '#DC2626', bg: '#FEF2F2', stroke: '#991B1B', desc: 'Crown fracture or trauma.' },
    '9': { label: 'Not recorded', color: '#CBD5E1', bg: '#FFFFFF', stroke: '#94A3B8', desc: 'Excluded or not recorded.' }
  },
  root: {
    '0': { label: 'Sound root', color: '#F5EBE0', bg: '#FAFAF9', stroke: '#44403C', desc: 'Exposed or sound root surface.' },
    '1': { label: 'Decayed root', color: '#78350F', bg: '#FEF2F2', stroke: '#451A03', desc: 'Root surface caries lesion.' },
    '2': { label: 'Filled root, with decay', color: '#D97706', bg: '#FFFBEB', stroke: '#92400E', desc: 'Root restoration with active decay.' },
    '3': { label: 'Filled root, no decay', color: '#2563EB', bg: '#EFF6FF', stroke: '#1D4ED8', desc: 'Sound root restoration.' },
    '7': { label: 'Post & Core / RCT / Bridge', color: '#9333EA', bg: '#F3E8FF', stroke: '#7E22CE', desc: 'Root canal treatment or post/core.' },
    '8': { label: 'Unexposed root', color: '#94A3B8', bg: '#F8FAFC', stroke: '#64748B', desc: 'Root unexposed to oral cavity.' },
    '9': { label: 'Not recorded', color: '#CBD5E1', bg: '#FFFFFF', stroke: '#94A3B8', desc: 'Root excluded or not recorded.' }
  }
};

export const CLINICAL_CONSTANTS = {
  UPPER_TEETH: [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28],
  LOWER_TEETH: [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38],
  ALL_TEETH: [
    18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28,
    48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38
  ],

  EXAM_SEQUENCE: [
    18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28,
    48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38
  ],

  PERIO_SITES_UPPER: ['db', 'b', 'mb', 'dp', 'p', 'mp'],
  PERIO_SITES_LOWER: ['db', 'b', 'mb', 'dl', 'l', 'ml'],
  PERIO_SITES_LABELS: {
    db: 'Disto-buccal',
    b: 'Mid-buccal',
    mb: 'Mesio-buccal',
    dp: 'Disto-palatal',
    p: 'Mid-palatal',
    mp: 'Mesio-palatal',
    dl: 'Disto-lingual',
    l: 'Mid-lingual',
    ml: 'Mesio-lingual'
  },

  CROWN_CODES: [
    { code: '0', label: TOOTH_COLOR_CONFIG.crown['0'].label, desc: TOOTH_COLOR_CONFIG.crown['0'].desc, color: TOOTH_COLOR_CONFIG.crown['0'].color, bg: TOOTH_COLOR_CONFIG.crown['0'].bg, isDMF: null },
    { code: '1', label: TOOTH_COLOR_CONFIG.crown['1'].label, desc: TOOTH_COLOR_CONFIG.crown['1'].desc, color: TOOTH_COLOR_CONFIG.crown['1'].color, bg: TOOTH_COLOR_CONFIG.crown['1'].bg, isDMF: 'D' },
    { code: '2', label: TOOTH_COLOR_CONFIG.crown['2'].label, desc: TOOTH_COLOR_CONFIG.crown['2'].desc, color: TOOTH_COLOR_CONFIG.crown['2'].color, bg: TOOTH_COLOR_CONFIG.crown['2'].bg, isDMF: 'D' },
    { code: '3', label: TOOTH_COLOR_CONFIG.crown['3'].label, desc: TOOTH_COLOR_CONFIG.crown['3'].desc, color: TOOTH_COLOR_CONFIG.crown['3'].color, bg: TOOTH_COLOR_CONFIG.crown['3'].bg, isDMF: 'F' },
    { code: '4', label: TOOTH_COLOR_CONFIG.crown['4'].label, desc: TOOTH_COLOR_CONFIG.crown['4'].desc, color: TOOTH_COLOR_CONFIG.crown['4'].color, bg: TOOTH_COLOR_CONFIG.crown['4'].bg, isDMF: 'M' },
    { code: '5', label: TOOTH_COLOR_CONFIG.crown['5'].label, desc: TOOTH_COLOR_CONFIG.crown['5'].desc, color: TOOTH_COLOR_CONFIG.crown['5'].color, bg: TOOTH_COLOR_CONFIG.crown['5'].bg, isDMF: null },
    { code: '6', label: TOOTH_COLOR_CONFIG.crown['6'].label, desc: TOOTH_COLOR_CONFIG.crown['6'].desc, color: TOOTH_COLOR_CONFIG.crown['6'].color, bg: TOOTH_COLOR_CONFIG.crown['6'].bg, isDMF: null },
    { code: '7', label: TOOTH_COLOR_CONFIG.crown['7'].label, desc: TOOTH_COLOR_CONFIG.crown['7'].desc, color: TOOTH_COLOR_CONFIG.crown['7'].color, bg: TOOTH_COLOR_CONFIG.crown['7'].bg, isDMF: null },
    { code: '8', label: TOOTH_COLOR_CONFIG.crown['8'].label, desc: TOOTH_COLOR_CONFIG.crown['8'].desc, color: TOOTH_COLOR_CONFIG.crown['8'].color, bg: TOOTH_COLOR_CONFIG.crown['8'].bg, isDMF: null },
    { code: 'T', label: TOOTH_COLOR_CONFIG.crown['T'].label, desc: TOOTH_COLOR_CONFIG.crown['T'].desc, color: TOOTH_COLOR_CONFIG.crown['T'].color, bg: TOOTH_COLOR_CONFIG.crown['T'].bg, isDMF: null },
    { code: '9', label: TOOTH_COLOR_CONFIG.crown['9'].label, desc: TOOTH_COLOR_CONFIG.crown['9'].desc, color: TOOTH_COLOR_CONFIG.crown['9'].color, bg: TOOTH_COLOR_CONFIG.crown['9'].bg, isDMF: null }
  ],

  ROOT_CODES: [
    { code: '0', label: TOOTH_COLOR_CONFIG.root['0'].label, desc: TOOTH_COLOR_CONFIG.root['0'].desc, color: TOOTH_COLOR_CONFIG.root['0'].color },
    { code: '1', label: TOOTH_COLOR_CONFIG.root['1'].label, desc: TOOTH_COLOR_CONFIG.root['1'].desc, color: TOOTH_COLOR_CONFIG.root['1'].color },
    { code: '2', label: TOOTH_COLOR_CONFIG.root['2'].label, desc: TOOTH_COLOR_CONFIG.root['2'].desc, color: TOOTH_COLOR_CONFIG.root['2'].color },
    { code: '3', label: TOOTH_COLOR_CONFIG.root['3'].label, desc: TOOTH_COLOR_CONFIG.root['3'].desc, color: TOOTH_COLOR_CONFIG.root['3'].color },
    { code: '7', label: TOOTH_COLOR_CONFIG.root['7'].label, desc: TOOTH_COLOR_CONFIG.root['7'].desc, color: TOOTH_COLOR_CONFIG.root['7'].color },
    { code: '8', label: TOOTH_COLOR_CONFIG.root['8'].label, desc: TOOTH_COLOR_CONFIG.root['8'].desc, color: TOOTH_COLOR_CONFIG.root['8'].color },
    { code: '9', label: TOOTH_COLOR_CONFIG.root['9'].label, desc: TOOTH_COLOR_CONFIG.root['9'].desc, color: TOOTH_COLOR_CONFIG.root['9'].color }
  ],

  ETHNIC_OPTS: [
    ['', 'Select...'],
    ['Asian', 'Asian'],
    ['Black/African', 'Black/African'],
    ['White/Caucasian', 'White/Caucasian'],
    ['Hispanic/Latino', 'Hispanic/Latino'],
    ['Mixed', 'Mixed'],
    ['Other', 'Other']
  ],

  OCCUPATION_OPTS: [
    ['', 'Select...'],
    ['0', '0 – Unskilled / Manual worker'],
    ['1', '1 – Skilled worker'],
    ['2', '2 – Educated / Professional'],
    ['3', '3 – Other']
  ],

  SEXTANTS: [
    { id: 0, name: 'Sextant 1', teeth: '17–14', arch: 'Upper Right (17–14)' },
    { id: 1, name: 'Sextant 2', teeth: '13–23', arch: 'Upper Anterior (13–23)' },
    { id: 2, name: 'Sextant 3', teeth: '24–27', arch: 'Upper Left (24–27)' },
    { id: 3, name: 'Sextant 4', teeth: '37–34', arch: 'Lower Left (37–34)' },
    { id: 4, name: 'Sextant 5', teeth: '33–43', arch: 'Lower Anterior (33–43)' },
    { id: 5, name: 'Sextant 6', teeth: '44–47', arch: 'Lower Right (44–47)' }
  ],

  CPI_OPTS: [
    ['', 'Select...'],
    ['0', '0 — Healthy'],
    ['1', '1 — Bleeding on probing'],
    ['2', '2 — Calculus present'],
    ['3', '3 — Pocket 4–5mm'],
    ['4', '4 — Pocket 6mm+'],
    ['9', '9 — Excluded sextant'],
    ['X', 'X — Not recorded']
  ],

  LOA_OPTS: [
    ['', 'Select...'],
    ['0', '0 — 0–3mm'],
    ['1', '1 — 4–5mm'],
    ['2', '2 — 6–8mm'],
    ['3', '3 — 9–11mm'],
    ['4', '4 — 12mm+'],
    ['9', '9 — Excluded'],
    ['X', 'X — Not recorded']
  ],

  FLUOROSIS_OPTS: [
    ['', 'Select...'],
    ['0', '0 — Normal'],
    ['1', '1 — Questionable'],
    ['2', '2 — Very mild'],
    ['3', '3 — Mild'],
    ['4', '4 — Moderate'],
    ['5', '5 — Severe'],
    ['9', '9 — Excluded']
  ],

  TDI_OPTS: [
    ['', 'Select...'],
    ['0', '0 — No sign'],
    ['1', '1 — Treated case'],
    ['2', '2 — Enamel fracture'],
    ['3', '3 — Enamel + dentine fracture'],
    ['4', '4 — Pulp involvement'],
    ['5', '5 — Missing, due to trauma'],
    ['6', '6 — Other damage'],
    ['9', '9 — Not recorded']
  ],

  OML_SITE_OPTS: [
    ['', 'Select...'],
    ['0', 'Vermilion border'],
    ['1', 'Labial mucosa / sulci'],
    ['2', 'Buccal mucosa / commissures'],
    ['3', 'Floor of mouth'],
    ['4', 'Tongue'],
    ['5', 'Hard palate'],
    ['6', 'Soft palate'],
    ['7', 'Alveolar ridge / gingiva'],
    ['8', 'Other site']
  ],

  OML_COND_OPTS: [
    ['', 'Select...'],
    ['0', 'No abnormal condition'],
    ['1', 'Malignant tumour'],
    ['2', 'Leukoplakia'],
    ['3', 'Lichen planus'],
    ['4', 'Ulceration'],
    ['5', 'ANUG'],
    ['6', 'Candidiasis'],
    ['7', 'Abscess'],
    ['8', 'Other']
  ],

  PROS_OPTS: [
    ['', 'Select...'],
    ['0', '0 — None'],
    ['1', '1 — Bridge'],
    ['2', '2 — Multiple bridge'],
    ['3', '3 — Partial denture'],
    ['4', '4 — Full denture'],
    ['9', '9 — Not recorded']
  ],

  TREAT_OPTS: [
    ['', 'Select...'],
    ['0', '0 — None needed'],
    ['1', '1 — Preventive'],
    ['2', '2 — One-surface filling'],
    ['3', '3 — Two+ surface filling'],
    ['4', '4 — Crown'],
    ['5', '5 — Veneer'],
    ['6', '6 — Pulp care'],
    ['7', '7 — Extraction'],
    ['8', '8 — Other'],
    ['9', '9 — Urgent referral']
  ],

  HELP_TOPICS: {
    crown: {
      title: 'Crown / Root Status',
      rows: [
        ['0', 'Sound crown'], ['1', 'Decayed crown'], ['2', 'Filled, with decay'],
        ['3', 'Filled, no decay'], ['4', 'Missing — caries'], ['5', 'Missing — other reason'],
        ['6', 'Fissure sealant'], ['7', 'Bridge abutment / crown / veneer'],
        ['8', 'Unerupted'], ['T', 'Trauma (fracture)'], ['9', 'Not recorded'],
        ['—', 'Root codes: 0,1,2,3 as above; 7 Bridge/crown; 8 Unexposed; 9 Not recorded']
      ]
    },
    cpi: {
      title: 'CPI / LOA (per sextant)',
      rows: [
        ['0', '0 — Healthy'], ['1', '1 — Bleeding on probing'], ['2', '2 — Calculus present'],
        ['3', '3 — Pocket 4–5mm'], ['4', '4 — Pocket 6mm+'], ['9', '9 — Excluded sextant'], ['X', 'X — Not recorded']
      ]
    },
    fluorosis: {
      title: "Dental Fluorosis — Dean's Index",
      rows: [
        ['0', '0 — Normal'], ['1', '1 — Questionable'], ['2', '2 — Very mild'],
        ['3', '3 — Mild'], ['4', '4 — Moderate'], ['5', '5 — Severe'], ['9', '9 — Excluded']
      ]
    },
    tdi: {
      title: 'Traumatic Dental Injury',
      rows: [
        ['0', '0 — No sign'], ['1', '1 — Treated case'], ['2', '2 — Enamel fracture'],
        ['3', '3 — Enamel + dentine fracture'], ['4', '4 — Pulp involvement'],
        ['5', '5 — Missing, due to trauma'], ['6', '6 — Other damage'], ['9', '9 — Not recorded']
      ]
    },
    omlsite: {
      title: 'Oral Mucosal Lesion — Site',
      rows: [
        ['0', 'Vermilion border'], ['1', 'Labial mucosa / sulci'], ['2', 'Buccal mucosa / commissures'],
        ['3', 'Floor of mouth'], ['4', 'Tongue'], ['5', 'Hard palate'], ['6', 'Soft palate'],
        ['7', 'Alveolar ridge / gingiva'], ['8', 'Other site']
      ]
    },
    omlcond: {
      title: 'Oral Mucosal Lesion — Condition',
      rows: [
        ['0', 'No abnormal condition'], ['1', 'Malignant tumour'], ['2', 'Leukoplakia'],
        ['3', 'Lichen planus'], ['4', 'Ulceration'], ['5', 'ANUG'], ['6', 'Candidiasis'],
        ['7', 'Abscess'], ['8', 'Other']
      ]
    },
    pros: {
      title: 'Prosthetic Status',
      rows: [
        ['0', '0 — None'], ['1', '1 — Bridge'], ['2', '2 — Multiple bridge'],
        ['3', '3 — Partial denture'], ['4', '4 — Full denture'], ['9', '9 — Not recorded']
      ]
    },
    treat: {
      title: 'Overall Treatment Need',
      rows: [
        ['0', '0 — None needed'], ['1', '1 — Preventive'], ['2', '2 — One-surface filling'],
        ['3', '3 — Two+ surface filling'], ['4', '4 — Crown'], ['5', '5 — Veneer'],
        ['6', '6 — Pulp care'], ['7', '7 — Extraction'], ['8', '8 — Other'], ['9', '9 — Urgent referral']
      ]
    }
  }
};
