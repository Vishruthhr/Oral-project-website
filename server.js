const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const config = require('./config/config');
const store = require('./utils/store');

const app = express();

app.use(cors({ origin: config.CORS_ORIGINS }));
app.use(express.json());

app.get('/', (req, res) => res.json({ success: true, message: 'Oral Health backend is running' }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/general-info', require('./routes/generalInfo'));

// Unknown route
app.use((req, res) => res.status(404).json({ success: false, error: `Route not found: ${req.method} ${req.originalUrl}` }));

// Bad JSON body etc.
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, error: 'Invalid JSON in request body' });
  }
  console.error(err);
  res.status(500).json({ success: false, error: 'Server error' });
});

// Create the demo admin user on first run (same credentials as the frontend)
function seedAdmin() {
  const db = store.load();
  if (!db.users.some((u) => u.username === config.DEFAULT_ADMIN.username)) {
    db.users.push({
      id: store.newId('USR'),
      username: config.DEFAULT_ADMIN.username,
      passwordHash: bcrypt.hashSync(config.DEFAULT_ADMIN.password, 10),
      createdAt: new Date().toISOString()
    });
    store.save(db);
    console.log('Default admin created -> admin / password123');
  }
}
seedAdmin();

app.listen(config.PORT, () => console.log(`Server running at http://localhost:${config.PORT}`));
