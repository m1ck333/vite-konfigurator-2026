# Vite Konfigurator 2026 (Frontend)

Vite + React + TypeScript rebuild of the Algreen door configurator frontend, migrated off
Create React App (`react-scripts`, unmaintained). Backend is the Hono/Cloudflare Worker in
`../hono-konfigurator-be` (the old React CRA app and Laravel BE have been removed).

The logic (Redux slices, hooks, API layer, types, utils, i18n) was carried over from the original
CRA app onto a modern Vite toolchain. UI is being improved incrementally.

## Commands

```bash
npm install
npm run dev        # dev server on http://localhost:3822 (does NOT auto-open a browser)
npm run build      # tsc + vite build → ./build
npm run preview    # serve the production build
npm run lint
npm run format
```

Backend must be running (`php artisan serve --port=8080`) — the app talks to `REACT_APP_API_URL`.

## Migration notes (CRA → Vite)

- **Env vars:** the existing code uses `process.env.REACT_APP_*`. Rather than rewrite every usage,
  `vite.config.ts` loads env with an empty prefix and `define`s `process.env.REACT_APP_API_URL` /
  `REACT_APP_NODE_ENV` at build time. `.env` keeps the same `REACT_APP_*` names. (Can migrate to
  `import.meta.env.VITE_*` later if desired.)
- **`index.html`** moved to project root (Vite convention) with `<script type="module" src="/src/index.tsx">`.
- **PostCSS/Tailwind configs** are `.cjs` because `package.json` has `"type": "module"`.
- **Port 3822 / no auto-open** are set in `vite.config.ts` (`server.port`, `server.open: false`).
- Dropped CRA-only deps (`react-scripts`, `web-vitals`, testing-library, `@types/jest`) and the old
  `*.png` / `*.module.css` type decls (covered by `vite/client` via `src/vite-env.d.ts`).

## Status

- [x] Vite scaffold, logic ported, `tsc` clean, production build passes.
- [ ] Verify in browser against local backend (visual/behavior parity).
- [ ] UI improvement pass.
