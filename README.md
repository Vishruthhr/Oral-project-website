# Oral Health Backend (Login + General Info)

## Run
1. Install Node.js 18+ (check: `node -v`)
2. Open this folder in VS Code, open terminal
3. `npm install`
4. `npm run dev`  -> http://localhost:5000

Demo login: admin / password123

## Endpoints
- POST   /api/auth/login
- POST   /api/auth/register
- GET    /api/auth/me                (token)
- POST   /api/general-info           (token)
- GET    /api/general-info           (token)
- GET    /api/general-info/:id       (token)
- PUT    /api/general-info/:id       (token)
- DELETE /api/general-info/:id       (token)

Token: Thunder Client -> Auth tab -> Bearer -> paste token from login.
Saved data is written to data/db.json.
