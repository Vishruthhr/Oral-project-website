// Central configuration. Change values here (or via environment variables).
module.exports = {
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret-before-deployment',
  JWT_EXPIRES_IN: '8h',
  // Frontend (Vite) runs on port 3000 in the frontend project
  CORS_ORIGINS: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  // Same demo login the frontend already uses, so both sides match
  DEFAULT_ADMIN: { username: 'admin', password: 'password123' }
};
