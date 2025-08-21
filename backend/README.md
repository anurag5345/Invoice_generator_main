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
//





MySQL schema & example queries
------------------------------
Below are practical CREATE TABLE statements and common queries you can include in the README for reference or to run manually in your MySQL server. Adapt names/types to match Sequelize models if you change them.

Create tables
```sql
CREATE TABLE users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE invoices (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  invoice_number VARCHAR(64) NOT NULL UNIQUE,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255),
  issue_date DATE NOT NULL,
  due_date DATE,
  status ENUM('draft','sent','paid','cancelled') DEFAULT 'draft',
  paid TINYINT(1) DEFAULT 0,
  subtotal DECIMAL(12,2) DEFAULT 0.00,
  tax_total DECIMAL(12,2) DEFAULT 0.00,
  total_with_gst DECIMAL(12,2) DEFAULT 0.00,
  currency VARCHAR(8) DEFAULT 'INR',
  notes TEXT,
  created_by BIGINT UNSIGNED,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_invoices_user FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE line_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  invoice_id BIGINT UNSIGNED NOT NULL,
  description TEXT,
  quantity DECIMAL(12,2) DEFAULT 1,
  unit_price DECIMAL(12,2) DEFAULT 0.00,
  tax_rate DECIMAL(5,2) DEFAULT 0.00,
  line_total DECIMAL(12,2) DEFAULT 0.00,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_lineitems_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_invoices_issue_date ON invoices(issue_date);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_customer ON invoices(customer_name(100));
```

Schema (table form)
-------------------
Below is the same schema represented in markdown table form for quick reference.

### users
| Column | Type | Null | Default | Description |
|---|---|---:|---|---|
| id | BIGINT UNSIGNED AUTO_INCREMENT | NO |  | Primary key |
| email | VARCHAR(255) | NO |  | Unique user email |
| password_hash | VARCHAR(255) | NO |  | Hashed password |
| name | VARCHAR(255) | YES | NULL | Display name |
| role | VARCHAR(50) | NO | 'user' | User role |
| created_at | DATETIME | NO | CURRENT_TIMESTAMP | Record created timestamp |
| updated_at | DATETIME | NO | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Record updated timestamp |

### invoices
| Column | Type | Null | Default | Description |
|---|---|---:|---|---|
| id | BIGINT UNSIGNED AUTO_INCREMENT | NO |  | Primary key |
| invoice_number | VARCHAR(64) | NO |  | Unique invoice identifier |
| customer_name | VARCHAR(255) | NO |  | Customer display name |
| customer_email | VARCHAR(255) | YES | NULL | Customer email |
| issue_date | DATE | NO |  | Invoice issue date |
| due_date | DATE | YES | NULL | Invoice due date |
| status | ENUM('draft','sent','paid','cancelled') | NO | 'draft' | Invoice status |
| paid | TINYINT(1) | NO | 0 | Paid flag (0/1) |
| subtotal | DECIMAL(12,2) | NO | 0.00 | Pre-tax total |
| tax_total | DECIMAL(12,2) | NO | 0.00 | Total tax amount |
| total_with_gst | DECIMAL(12,2) | NO | 0.00 | Grand total including tax |
| currency | VARCHAR(8) | NO | 'INR' | Currency code |
| notes | TEXT | YES | NULL | Optional notes |
| created_by | BIGINT UNSIGNED | YES | NULL | FK -> users.id (creator) |
| created_at | DATETIME | NO | CURRENT_TIMESTAMP | Record created timestamp |
| updated_at | DATETIME | NO | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Record updated timestamp |

### line_items
| Column | Type | Null | Default | Description |
|---|---|---:|---|---|
| id | BIGINT UNSIGNED AUTO_INCREMENT | NO |  | Primary key |
| invoice_id | BIGINT UNSIGNED | NO |  | FK -> invoices.id |
| description | TEXT | YES | NULL | Item description |
| quantity | DECIMAL(12,2) | NO | 1 | Quantity |
| unit_price | DECIMAL(12,2) | NO | 0.00 | Unit price |
| tax_rate | DECIMAL(5,2) | NO | 0.00 | Tax rate (%) |
| line_total | DECIMAL(12,2) | NO | 0.00 | Line total (quantity * unit_price + tax) |
| created_at | DATETIME | NO | CURRENT_TIMESTAMP | Record created timestamp |


Insert invoice + line items (transaction)
```sql
START TRANSACTION;

INSERT INTO invoices
  (invoice_number, customer_name, customer_email, issue_date, due_date, status, paid, subtotal, tax_total, total_with_gst, currency, notes, created_by)
VALUES
  ('INV-2025-0001','Acme Corp','billing@acme.com','2025-08-20','2025-09-20','sent',0,1000.00,180.00,1180.00,'INR','Notes', 1);

SET @invoice_id = LAST_INSERT_ID();

INSERT INTO line_items (invoice_id, description, quantity, unit_price, tax_rate, line_total)
VALUES
  (@invoice_id, 'Design work', 1, 1000.00, 18.00, 1180.00);

COMMIT;
```

Home page queries
```sql
-- total invoices
SELECT COUNT(*) AS total_invoices FROM invoices;

-- total due: sum of total_with_gst for unpaid invoices
SELECT COALESCE(SUM(total_with_gst),0.00) AS total_due
FROM invoices
WHERE (status IS NULL OR status != 'paid') AND (paid = 0 OR paid IS NULL);

-- distinct customer count
SELECT COUNT(DISTINCT customer_name) AS customer_count FROM invoices;

-- 2 most recent invoices
SELECT id, invoice_number, customer_name, total_with_gst, issue_date, status, paid
FROM invoices
ORDER BY issue_date DESC, id DESC
LIMIT 2;
```

Format amount to 2 decimals in SQL
```sql
SELECT FORMAT(total_with_gst,2) AS amount_formatted FROM invoices WHERE id = 123;
```

Safe one-way status update (unpaid -> paid only)
```sql
UPDATE invoices
SET paid = 1,
    status = 'paid',
    updated_at = NOW()
WHERE id = ? AND (paid = 0 OR paid IS NULL OR status != 'paid');
```

Trigger to prevent paid -> unpaid changes (DB-level enforcement)
```sql
DELIMITER $$
CREATE TRIGGER trg_invoices_prevent_unpay
BEFORE UPDATE ON invoices
FOR EACH ROW
BEGIN
  IF OLD.paid = 1 AND NEW.paid = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot revert paid invoice to unpaid';
  END IF;
  IF OLD.status = 'paid' AND NEW.status <> 'paid' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot change status of a paid invoice';
  END IF;
END$$
DELIMITER ;
```

Notes
- Use DECIMAL for money fields (not FLOAT).
- Enforce rules in both application and DB (frontend guard + backend service + DB trigger) to prevent paid->unpaid.
- Use transactions when creating/updating invoice + line items.

