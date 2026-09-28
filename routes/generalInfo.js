const express = require('express');
const requireAuth = require('../middleware/auth');
const store = require('../utils/store');
const { validateGeneralInfo, pickGeneralInfo, calcAge } = require('../utils/validators');

const router = express.Router();
router.use(requireAuth); // every route below needs a valid token

const withAge = (r) => ({ ...r, age: calcAge(r.dob, r.examDate) });

// CREATE  ->  POST /api/general-info
router.post('/', (req, res) => {
  const errors = validateGeneralInfo(req.body);
  if (errors.length) return res.status(400).json({ success: false, errors });

  const data = pickGeneralInfo(req.body);
  const db = store.load();

  if (db.generalInfo.some((r) => r.participantId.toLowerCase() === data.participantId.toLowerCase())) {
    return res.status(409).json({ success: false, error: `Patient ID "${data.participantId}" already exists` });
  }

  const now = new Date().toISOString();
  const record = { id: store.newId('REC'), ...data, createdBy: req.user.username, createdAt: now, updatedAt: now };
  db.generalInfo.unshift(record);
  store.save(db);

  res.status(201).json({ success: true, message: 'General info saved', record: withAge(record) });
});

// READ ALL  ->  GET /api/general-info      (optional: ?search=name or id)
router.get('/', (req, res) => {
  const db = store.load();
  const q = String(req.query.search || '').trim().toLowerCase();
  let list = db.generalInfo;
  if (q) {
    list = list.filter((r) => r.patientName.toLowerCase().includes(q) || r.participantId.toLowerCase().includes(q));
  }
  res.json({ success: true, count: list.length, records: list.map(withAge) });
});

// READ ONE  ->  GET /api/general-info/:id
router.get('/:id', (req, res) => {
  const record = store.load().generalInfo.find((r) => r.id === req.params.id);
  if (!record) return res.status(404).json({ success: false, error: 'Record not found' });
  res.json({ success: true, record: withAge(record) });
});

// UPDATE  ->  PUT /api/general-info/:id
router.put('/:id', (req, res) => {
  const db = store.load();
  const idx = db.generalInfo.findIndex((r) => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, error: 'Record not found' });

  const errors = validateGeneralInfo(req.body);
  if (errors.length) return res.status(400).json({ success: false, errors });

  const data = pickGeneralInfo(req.body);
  const clash = db.generalInfo.some(
    (r, i) => i !== idx && r.participantId.toLowerCase() === data.participantId.toLowerCase()
  );
  if (clash) return res.status(409).json({ success: false, error: `Patient ID "${data.participantId}" already exists` });

  db.generalInfo[idx] = { ...db.generalInfo[idx], ...data, updatedAt: new Date().toISOString() };
  store.save(db);
  res.json({ success: true, message: 'General info updated', record: withAge(db.generalInfo[idx]) });
});

// DELETE  ->  DELETE /api/general-info/:id
router.delete('/:id', (req, res) => {
  const db = store.load();
  const before = db.generalInfo.length;
  db.generalInfo = db.generalInfo.filter((r) => r.id !== req.params.id);
  if (db.generalInfo.length === before) return res.status(404).json({ success: false, error: 'Record not found' });
  store.save(db);
  res.json({ success: true, message: 'Record deleted' });
});

module.exports = router;
