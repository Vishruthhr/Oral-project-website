const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');

// Protects routes: requires header  Authorization: Bearer <token>
module.exports = function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ success: false, error: 'Missing token. Login first and send: Authorization: Bearer <token>' });
  }
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token. Please login again.' });
  }
};
