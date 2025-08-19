# Rxjs

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

Frontend — Invoice Generator (Angular)
======================================

Overview
--------
This is the Angular frontend for the Invoice Generator application. It uses Angular Material for UI components and custom SCSS. The UI supports creating, listing, viewing, and downloading invoices.

Quick facts
- Framework: Angular
- UI: Angular Material
- Location: `frontend/`

Prerequisites
-------------
- Node.js 18+ and npm

Install
-------
```powershell
cd frontend
npm install
```

Development
-----------
Run the dev server:

```powershell
npm start
# (or) ng serve
```

Build (production)
------------------
```powershell
npm run build
```

Important files
---------------
- `src/app/components` — UI components (create/list/view/invoice, auth pages)
- `src/styles.scss` — global styles and responsive helpers
- `src/app/services` — HTTP services communicating with backend (auth, invoice)

Responsive helpers
------------------
- Wrap wide tables with `<div class="table-responsive">` and add `table-items--wide` class on the table to allow horizontal scrolling on mobile.
- Forms use `.row` and `.field` classes which stack on small screens automatically.

Assets
------
- Background and static assets live under `src/app/assets/`.
- If `ng build` reports missing assets, verify the file path in `src/styles.scss` (project uses `bg1.jpg`).

Running against backend
------------------------
Set the API base URL in the services (check `src/environments/environment.ts`) or proxy during development using Angular CLI proxy config.

Testing
-------
Run unit tests:

```powershell
npm test
```

Accessibility & UX
------------------
- Status badges and interactive elements were converted to semantic buttons for keyboard/mobile support.
- Date picker for due date enforces today or future dates on the create invoice form.

Contributing
------------
- Respect the existing SCSS conventions and responsive helpers.
- Add unit tests for core components where relevant.

Need help?
----------
If something doesn't render correctly on mobile, share a screenshot or the devtools layout and I'll help fix the CSS.
