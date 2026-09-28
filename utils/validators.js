// Validation rules copied from the frontend so both sides agree.
const SEX = ['1', '2'];                                   // 1 = Male, 2 = Female
const ETHNIC = ['Asian', 'Black/African', 'White/Caucasian', 'Hispanic/Latino', 'Mixed', 'Other'];
const OCCUPATION = ['0', '1', '2', '3'];                  // 3 = Other

const isBlank = (v) => v === undefined || v === null || String(v).trim() === '';
const isValidDate = (v) => /^\d{4}-\d{2}-\d{2}/.test(String(v)) && !isNaN(new Date(v).getTime());

function validateGeneralInfo(b) {
  const errors = [];

  if (isBlank(b.patientName)) errors.push('patientName is required');
  if (isBlank(b.participantId)) errors.push('participantId (Patient ID) is required');

  if (isBlank(b.examDate)) errors.push('examDate is required');
  else if (!isValidDate(b.examDate)) errors.push('examDate must be a valid date (YYYY-MM-DD)');

  if (isBlank(b.sex)) errors.push('sex is required ("1" = Male, "2" = Female)');
  else if (!SEX.includes(String(b.sex))) errors.push('sex must be "1" or "2"');

  if (!isBlank(b.phoneNumber) && !/^\d{10}$/.test(String(b.phoneNumber))) {
    errors.push('phoneNumber must be exactly 10 digits');
  }

  if (!isBlank(b.dob)) {
    if (!isValidDate(b.dob)) errors.push('dob must be a valid date (YYYY-MM-DD)');
    else if (new Date(b.dob) > new Date()) errors.push('dob cannot be in the future');
  }

  if (!isBlank(b.education)) {
    const n = Number(b.education);
    if (isNaN(n) || n < 0 || n > 30) errors.push('education must be a number between 0 and 30');
  }

  if (!isBlank(b.ethnicGroup)) {
    if (!ETHNIC.includes(b.ethnicGroup)) errors.push('ethnicGroup must be one of: ' + ETHNIC.join(', '));
    if (b.ethnicGroup === 'Other' && isBlank(b.ethnicGroupOther)) {
      errors.push('ethnicGroupOther is required when ethnicGroup is "Other"');
    }
  }

  if (!isBlank(b.occupation)) {
    if (!OCCUPATION.includes(String(b.occupation))) errors.push('occupation must be one of: 0, 1, 2, 3');
    if (String(b.occupation) === '3' && isBlank(b.occupationOther)) {
      errors.push('occupationOther is required when occupation is "3"');
    }
  }

  return errors;
}

// Keep only the fields the frontend's General Information section uses.
function pickGeneralInfo(b) {
  const s = (v) => (isBlank(v) ? '' : String(v).trim());
  return {
    patientName: s(b.patientName),
    participantId: s(b.participantId),
    examDate: s(b.examDate),
    examinerId: s(b.examinerId),
    village: s(b.village),
    phoneNumber: s(b.phoneNumber),
    sex: s(b.sex),
    dob: s(b.dob),
    education: isBlank(b.education) ? '' : Number(b.education),
    ethnicGroup: s(b.ethnicGroup),
    ethnicGroupOther: b.ethnicGroup === 'Other' ? s(b.ethnicGroupOther) : '',
    occupation: s(b.occupation),
    occupationOther: String(b.occupation) === '3' ? s(b.occupationOther) : '',
    habits: s(b.habits)
  };
}

// Same logic as calcAge() in the frontend's exportUtils.js
function calcAge(dob, examDate) {
  if (!dob) return null;
  const d1 = new Date(dob);
  const d2 = examDate ? new Date(examDate) : new Date();
  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;
  let age = d2.getFullYear() - d1.getFullYear();
  const m = d2.getMonth() - d1.getMonth();
  if (m < 0 || (m === 0 && d2.getDate() < d1.getDate())) age--;
  return age >= 0 ? age : null;
}

module.exports = { validateGeneralInfo, pickGeneralInfo, calcAge, isBlank };
