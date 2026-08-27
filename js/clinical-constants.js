/**
 * Standard Clinical Dental Constants & Codebook Definitions
 * FDI Notation, Anatomical Mappings & Clinical Scoring Criteria
 */

const CLINICAL_CONSTANTS = {
  // 32 Permanent Teeth in FDI Two-Digit Notation (Upper: 18->28, Lower: 48->38)
  UPPER_TEETH: [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28],
  LOWER_TEETH: [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38],
  ALL_TEETH: [
    18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28,
    48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38
  ],

  // Examination Sequence (Upper Right -> Upper Left -> Lower Right -> Lower Left)
  EXAM_SEQUENCE: [
    18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28,
    48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38
  ],

  QUADRANTS: {
    Q1: { name: 'Upper Right (18–11)', teeth: [18, 17, 16, 15, 14, 13, 12, 11] },
    Q2: { name: 'Upper Left (21–28)', teeth: [21, 22, 23, 24, 25, 26, 27, 28] },
    Q4: { name: 'Lower Right (48–41)', teeth: [48, 47, 46, 45, 44, 43, 42, 41] },
    Q3: { name: 'Lower Left (31–38)', teeth: [31, 32, 33, 34, 35, 36, 37, 38] }
  },

  // Crown Status Codes
  CROWN_CODES: [
    { code: '0', label: 'Sound crown', desc: 'No evidence of treated or untreated clinical caries.', color: '#4A7C59', bg: '#EFEBE1', isDMF: null },
    { code: '1', label: 'Decayed crown', desc: 'Cavitation on pit/fissure or smooth surface, undermined enamel, or soft floor/wall.', color: '#B24A34', bg: '#F7E7E2', isDMF: 'D' },
    { code: '2', label: 'Filled, with decay', desc: 'Tooth has permanent restoration and one or more areas with active decay.', color: '#D97A3F', bg: '#FDEBD0', isDMF: 'D' },
    { code: '3', label: 'Filled, no decay', desc: 'Tooth has permanent restoration with no evidence of caries.', color: '#3E6FA3', bg: '#EBF5FB', isDMF: 'F' },
    { code: '4', label: 'Missing — caries', desc: 'Tooth extracted due to caries pathology.', color: '#2B2E33', bg: '#EAECEE', isDMF: 'M' },
    { code: '5', label: 'Missing — other reason', desc: 'Congenitally absent, ortho extraction, trauma, or periodontal extraction.', color: '#A8A296', bg: '#F2F4F4', isDMF: null },
    { code: '6', label: 'Fissure sealant', desc: 'Fissure sealant placed on pits/fissures with no active caries.', color: '#3E9C93', bg: '#E8F8F5', isDMF: null },
    { code: '7', label: 'Bridge abutment / crown / veneer', desc: 'Fixed dental prosthesis abutment, crown, bridge, veneer, or implant.', color: '#7C5CBF', bg: '#F4ECF7', isDMF: null },
    { code: '8', label: 'Unerupted', desc: 'Tooth space with no clinical eruption (excluding missing).', color: '#8A8474', bg: '#DAD4C4', isDMF: null },
    { code: 'T', label: 'Trauma (fracture)', desc: 'Surface fracture caused by trauma with no caries evidence.', color: '#9C7A22', bg: '#FEF9E7', isDMF: null },
    { code: '9', label: 'Not recorded', desc: 'Tooth excluded or examination impossible (e.g. banded tooth).', color: '#B7B2A4', bg: '#FFFFFF', isDMF: null }
  ],

  // Root Status Codes
  ROOT_CODES: [
    { code: '0', label: 'Sound root', desc: 'Exposed root with no evidence of decay or restoration.', color: '#4A7C59' },
    { code: '1', label: 'Decayed root', desc: 'Cavitated lesion with soft or leathery base on exposed root.', color: '#B24A34' },
    { code: '2', label: 'Filled root, with decay', desc: 'Restoration present with secondary root caries.', color: '#D97A3F' },
    { code: '3', label: 'Filled root, no decay', desc: 'Permanent restoration on root without active caries.', color: '#3E6FA3' },
    { code: '7', label: 'Bridge abutment / crown', desc: 'Fixed prosthesis involving root or post/core.', color: '#7C5CBF' },
    { code: '8', label: 'Unexposed root', desc: 'Root not exposed to oral cavity (normal gingival margin).', color: '#DAD4C4' },
    { code: '9', label: 'Not recorded', desc: 'Root excluded or unrecordable.', color: '#B7B2A4' }
  ],

  // 6 Sextants for CPI and LOA (Strictly matching the form)
  SEXTANTS: [
    { id: 0, key: 'S1', name: 'Sextant 1', teeth: '17–14', arch: 'Upper Right (17–14)' },
    { id: 1, key: 'S2', name: 'Sextant 2', teeth: '13–23', arch: 'Upper Anterior (13–23)' },
    { id: 2, key: 'S3', name: 'Sextant 3', teeth: '24–27', arch: 'Upper Left (24–27)' },
    { id: 3, key: 'S4', name: 'Sextant 4', teeth: '37–34', arch: 'Lower Left (37–34)' },
    { id: 4, key: 'S5', name: 'Sextant 5', teeth: '33–43', arch: 'Lower Anterior (33–43)' },
    { id: 5, key: 'S6', name: 'Sextant 6', teeth: '44–47', arch: 'Lower Right (44–47)' }
  ],

  // CPI Select Options
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

  // LOA Select Options
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

  // Fluorosis Select Options
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

  // TDI Select Options
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

  // OML Site Options
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

  // OML Condition Options
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

  // Prosthetic Options
  PROS_OPTS: [
    ['', 'Select...'],
    ['0', '0 — None'],
    ['1', '1 — Bridge'],
    ['2', '2 — Multiple bridge'],
    ['3', '3 — Partial denture'],
    ['4', '4 — Full denture'],
    ['9', '9 — Not recorded']
  ],

  // Overall Treatment Need Options
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

  // Help Topics
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
  },

  LOCATIONS: [
    { code: '1', label: 'Urban' },
    { code: '2', label: 'Peri-urban' },
    { code: '3', label: 'Rural' }
  ],

  SEX_TYPES: [
    { code: '1', label: 'Male' },
    { code: '2', label: 'Female' }
  ]
};

// Aliases
const WHO_CONSTANTS = CLINICAL_CONSTANTS;

if (typeof window !== 'undefined') {
  window.CLINICAL_CONSTANTS = CLINICAL_CONSTANTS;
  window.WHO_CONSTANTS = CLINICAL_CONSTANTS;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CLINICAL_CONSTANTS;
}
