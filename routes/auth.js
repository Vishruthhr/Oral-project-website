const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/config');
const requireAuth = require('../middleware/auth');
const store = require('../utils/store');

const router = express.Router();

const signToken = (user) =>
  jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

// POST /api/auth/register  { "username": "...", "password": "..." }
router.post('/register', (req, res) => {
  const username = String(req.body.username || '').trim();
  const password = String(req.body.password || '');

  if (!username) return res.status(400).json({ success: false, error: 'Username is required' });
  if (password.length < 6) return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });

  const db = store.load();
  if (db.users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
    return res.status(409).json({ success: false, error: 'Username already exists' });
  }

  const user = {
    id: store.newId('USR'),
    username,
    passwordHash: bcrypt.hashSync(password, 10),
    createdAt: new Date().toISOString()
  };
  db.users.push(user);
  store.save(db);

  res.status(201).json({ success: true, message: 'User registered', user: { id: user.id, username: user.username } });
});

// POST /api/auth/login  { "username": "admin", "password": "password123" }
router.post('/login', (req, res) => {
  const username = String(req.body.username || '').trim();
  const password = String(req.body.password || '');

  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'Please enter both username and password.' });
  }

  const db = store.load();
  const user = db.users.find((u) => u.username.toLowerCase() === username.toLowerCase());
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ success: false, error: 'Invalid username or password.' });
  }

  res.json({
    success: true,
    message: 'Login successful',
    token: signToken(user),
    user: { id: user.id, username: user.username }
  });
});

// GET /api/auth/me   (needs token) - quick way to test that the token works
router.get('/me', requireAuth, (req, res) => {
  res.json({ success: true, user: req.user });
});

// POST /api/auth/forgot-password  { "usernameOrEmail": "..." }
// Frontend has a mock reset screen; this matches its behaviour (no real email is sent).
router.post('/forgot-password', (req, res) => {
  if (!String(req.body.usernameOrEmail || '').trim()) {
    return res.status(400).json({ success: false, error: 'Please enter your username or email address.' });
  }
  res.json({ success: true, message: 'If this account exists, a reset link has been sent.' });
});

module.exports = router;
