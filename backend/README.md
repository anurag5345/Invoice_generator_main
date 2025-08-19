<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

Backend — Invoice Generator (NestJS)
===================================

Overview
--------
This is the backend API for the Invoice Generator app. It's built with NestJS, Sequelize (MySQL), and provides authentication, invoice CRUD, and PDF generation endpoints.

Quick facts
- Framework: NestJS
- ORM: Sequelize (mysql2)
- Language: TypeScript
- Location: `backend/`

Prerequisites
-------------
- Node.js 18+ and npm
- MySQL server (or compatible)

Environment
-----------
Create a `.env` in `backend/` (not committed to source). Minimal required variables:

```bash
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=yourpassword
DATABASE_NAME=invoice_db
JWT_SECRET=your_jwt_secret
PORT=3000
```

Install
-------
```powershell
cd backend
npm install
```

Development
-----------
Run the app in watch mode:

```powershell
npm run start:dev
```

Build & Run (production)
-------------------------
```powershell
npm run build
npm run start:prod
```

Type-check / compile
---------------------
If you need to run TypeScript compiler directly:

```powershell
npx tsc -p tsconfig.build.json --pretty
```

Scripts
-------
- `npm run start:dev` — start in watch mode
- `npm run start` — start (Nest default)
- `npm run build` — compile TypeScript to `dist/`
- `npm run lint` — run ESLint autofix
- `npm test` — run unit tests (Jest)

Database & Migrations
---------------------
This project uses Sequelize models. If you change the model shape in TypeScript, keep the DB in sync:

- For quick local development you may enable sync in the Sequelize config (not recommended for prod).
- Prefer to create migrations to `ALTER TABLE` when changing column types (e.g., increasing DECIMAL precision).

Example ALTER for `cgst, sgst, igst` (MySQL):

```sql
ALTER TABLE invoices
  MODIFY COLUMN cgst DECIMAL(12,2) NOT NULL DEFAULT 0,
  MODIFY COLUMN sgst DECIMAL(12,2) NOT NULL DEFAULT 0,
  MODIFY COLUMN igst DECIMAL(12,2) NOT NULL DEFAULT 0;
```

API Overview
------------
Base URL (dev): http://localhost:3000

Examples:
- POST /auth/register — register a user
- POST /auth/login — login
- GET /invoices — list invoices
- POST /invoices — create invoice
- GET /invoices/:id — view invoice

Interceptors & Error Handling
-----------------------------
The app uses global interceptors in `src/common/interceptors` to normalize responses and errors into a consistent `StandardResponse` shape. If you add or change error handling, update these interceptors.

Validation
----------
- DTOs under `src/**/dto` use `class-validator` for request validation.
- Keep validation rules consistent between DTOs and frontend form validation.

Testing
-------
Run unit tests with Jest:

```powershell
npm test
```

Troubleshooting
---------------
- `Out of range value for column 'cgst'` — increase DECIMAL precision in model and DB (see migration SQL above).
- If build fails, run the TypeScript compiler to get clearer error messages: `npx tsc -p tsconfig.build.json`.
- If an old exception filter exists, the app uses interceptors for unified responses — remove filters to avoid duplication.

Contributing
------------
- Follow existing lint/format rules (Prettier + ESLint).
- Add unit tests for new services or controllers.

Contact
-------
If you need help running the backend, paste console output/errors and I'll assist.
