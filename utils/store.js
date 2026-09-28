// Simple JSON-file storage (placeholder for the database teammates' work).
// Only THIS file needs to change when the real database is connected.
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '..', 'data', 'db.json');

function load() {
  try {
    if (!fs.existsSync(DB_FILE)) return { users: [], generalInfo: [] };
    const parsed = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    return { users: parsed.users || [], generalInfo: parsed.generalInfo || [] };
  } catch (err) {
    console.error('Could not read db.json, starting empty:', err.message);
    return { users: [], generalInfo: [] };
  }
}

function save(db) {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
}

function newId(prefix) {
  return prefix + '_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
}

module.exports = { load, save, newId };
