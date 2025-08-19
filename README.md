Invoice Generator
=================

A small invoice management application with a NestJS backend and an Angular frontend.

Summary
-------
- Backend: NestJS + Sequelize (MySQL) — provides authentication, invoice CRUD, and PDF generation.
- Frontend: Angular (Material + custom UI) — create, list, view, and download invoices.

Quick links
-----------
- Backend: `backend/`
- Frontend: `frontend/`

Getting started (development)
-----------------------------
Prerequisites
- Node.js (v18+ recommended)
- npm
- MySQL (or a compatible database)

1) Backend

- Install dependencies

  cd backend
  npm install

- Configure environment

  Create a `.env` file in `backend/` with at least:

  DATABASE_HOST=localhost
  DATABASE_PORT=3306
  DATABASE_USER=root
  DATABASE_PASSWORD=yourpassword
  DATABASE_NAME=invoice_db
  JWT_SECRET=your_jwt_secret

- Run in development

  npm run start:dev

- Build for production

  npm run build
  npm run start:prod

2) Frontend

- Install dependencies

  cd frontend
  npm install

- Run development server

  npm start

- Build for production

  npm run build

Database / Migrations
---------------------
This project currently uses Sequelize models. If you have existing data, create an ALTER TABLE migration when updating model types (for example, changing `cgst` precision). If you are starting fresh, Sequelize will create tables based on models when run with appropriate sync settings.

Key files to inspect
- backend/src/common/interceptors — Global interceptors for consistent API responses and error handling.
- backend/src/invoices — Invoice models, controller, service.
- frontend/src/app/components — Main UI components (create, list, view, auth pages).
- frontend/src/styles.scss — Global styles including responsive helpers `.table-responsive` and `.table-items--wide`.

API
---
Base URL (development): http://localhost:3000

Common endpoints (examples)
- POST /auth/register
- POST /auth/login
- GET /invoices
- POST /invoices
- GET /invoices/:id

Notes & Tips
------------
- Phone numbers are stored as strings in models (recommended). If you see a numeric type used, consider converting to string to preserve formatting and leading zeros.
- Tax columns (`cgst`, `sgst`, `igst`) are best stored as `DECIMAL(12,2)` if you store monetary amounts rather than percentage rates.
- Frontend responsive helpers:
  - Wrap wide tables in `<div class="table-responsive">` and add `table-items--wide` to the table element.
  - Forms use `.row` and `.field` helpers to auto-stack on small screens.

Contributing
------------
- Follow existing code formatting rules (Prettier / ESLint) in the backend.
- Add minimal unit tests for services and controllers in the backend.

Troubleshooting
---------------
- If `ng build` reports missing assets, verify the path in `frontend/src/styles.scss` (the repo uses `app/assets/bg1.jpg`).
- If TypeScript compilation fails in the backend, run `npx tsc -p tsconfig.build.json` inside `backend` to get clearer errors.

Contact
-------
If you need help running the project locally, paste the exact error output and I'll help debug.
