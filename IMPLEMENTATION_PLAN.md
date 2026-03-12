# IMPLEMENTATION PLAN

## Sistem Pengurusan Aduan Awam — Majlis Bandaraya Alor Setar (MBAS)

---

## 1. Project Architecture

Static multi-page HTML prototype built with Vite + TypeScript + TailwindCSS. No backend — all data is hardcoded placeholder. Deployable to GitHub Pages. UI language is **Bahasa Melayu**.

The system models a 3-tier complaint workflow:

1. **Admin Aduan (Unit Aduan, Bahagian Korporat)** — receives and distributes complaints
2. **Penyelia Aduan Bahagian** — department supervisor, assigns to technical officers
3. **Teknikal Aduan Bahagian** — executes resolution actions

### User Roles

| Role | Directory | Description |
|------|-----------|-------------|
| Pengguna Awam (Public) | `pages/awam/` | Submit complaints, track status, give feedback |
| Admin Aduan | `pages/admin/` | Receive, classify, assign complaints to departments |
| Penyelia Bahagian | `pages/penyelia/` | Department supervisor, manage department complaints |
| Teknikal Bahagian | `pages/teknikal/` | Technical officer, resolve complaints |
| Pentadbir Sistem | `pages/pentadbir/` | System admin, user management, settings, reports |

---

## 2. Directory Structure

```
mbas-aduan-demo/
├── src/
│   ├── assets/
│   │   └── logo/
│   ├── partials/
│   │   ├── sidebar-admin.html
│   │   ├── sidebar-penyelia.html
│   │   ├── sidebar-teknikal.html
│   │   ├── sidebar-pentadbir.html
│   │   └── sidebar-awam.html
│   ├── styles/
│   │   └── main.css
│   ├── layout.ts
│   └── main.ts
├── pages/
│   ├── index.html                          (Login / Landing)
│   ├── daftar.html                         (Registration)
│   ├── awam/
│   │   ├── dashboard.html                  (Public user dashboard)
│   │   ├── aduan-baharu.html               (Submit new complaint)
│   │   ├── senarai-aduan.html              (My complaints list)
│   │   ├── aduan-detail.html               (Complaint detail + status)
│   │   └── maklum-balas.html               (Feedback & rating)
│   ├── admin/
│   │   ├── dashboard.html                  (Admin dashboard + stats)
│   │   ├── senarai-aduan.html              (All complaints list)
│   │   ├── aduan-detail.html               (Complaint detail + assign)
│   │   └── notifikasi.html                 (Notifications)
│   ├── penyelia/
│   │   ├── dashboard.html                  (Department supervisor dashboard)
│   │   ├── senarai-aduan.html              (Department complaints)
│   │   └── aduan-detail.html               (Assign to technical officer)
│   ├── teknikal/
│   │   ├── dashboard.html                  (Technical officer dashboard)
│   │   ├── senarai-aduan.html              (Assigned complaints)
│   │   └── aduan-detail.html               (Resolution + before/after photos)
│   └── pentadbir/
│       ├── dashboard.html                  (System admin dashboard)
│       ├── pengguna.html                   (User management)
│       ├── tetapan.html                    (System settings)
│       ├── laporan.html                    (Reports + export)
│       ├── peta-aduan.html                 (Complaint distribution map)
│       └── log-audit.html                  (Audit trail)
├── public/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── eslint.config.js
├── .htmlhintrc
├── .prettierrc
├── .gitignore
├── SPECIFICATION.md
├── README.md
├── CLAUDE.md
└── IMPLEMENTATION_PLAN.md
```

---

## 3. Vite Setup

- Vite 6.x with `root` set to project root
- Multi-page build: glob all `pages/**/*.html` as rollup inputs
- `base` set to `'/'` for local dev, configurable to `'/<repo-name>/'` for GitHub Pages
- Dev server configured so `pages/index.html` loads at `http://localhost:5173/`

---

## 4. TailwindCSS Configuration

- TailwindCSS v4 (latest) with PostCSS + Autoprefixer
- `darkMode: 'class'`
- Content paths: `pages/**/*.html`, `src/**/*.{ts,js}`
- Custom colors matching **pbt.kedah.gov.my/majlis-bandaraya-alor-setar**:
  - Primary: Dark Navy `#2f4858` — header, sidebar background
  - Secondary: Dark Charcoal `#222222` — navigation, menus
  - Accent: Vivid Cyan Blue `#0693e3` — links, active states, buttons
  - Text Primary: `#6f6f6f` — body text (light mode)
  - Text Secondary: `#8e8e8e` — muted/secondary text
  - Backgrounds: `#f1f1f1` (light mode surfaces) / `#111117` (dark mode base)
  - Buttons: `#32373c` with white text, hover `#333333`
  - Danger/Error: `#cf2e2e`
  - White text on dark backgrounds for contrast

---

## 5. ESLint Setup

- `typescript-eslint` with recommended config
- `eslint-config-prettier` to avoid conflicts
- Warn on `no-explicit-any` and `no-unused-vars`

---

## 6. HTML Linting Setup

- HTMLHint with `.htmlhintrc`
- Rules: lowercase tags/attrs, double quotes, doctype-first, tag-pair, id-unique, title-require
- `spec-char-escape: false` for flexibility

---

## 7. Light Mode and Dark Mode Strategy

- Tailwind `class` strategy on `<html>` element
- Toggle button in header (sun/moon icon)
- Preference persisted to `localStorage`
- On load, restore saved preference or default to light mode
- All pages must look correct in both modes

---

## 8. Layout System

### Sidebar (per role)

- Fixed left sidebar, 64px width collapsed / 256px expanded
- Logo slot at top (MBAS logo placeholder)
- Navigation grouped by section with Lucide icons
- Active page highlighted
- Collapsible to icon-only on tablet, hamburger overlay on mobile

### Header

- Top bar with:
  - Hamburger toggle (mobile)
  - Page title + breadcrumbs
  - Notification bell with badge count
  - Dark mode toggle
  - User avatar + dropdown (name, role, logout)

### Content Area

- Scrollable main area
- Max-width container with padding
- Cards, tables, forms, stat widgets

---

## 9. Reusable UI Components Strategy

Since this is vanilla HTML, components are implemented as:

1. **HTML partials** loaded via `fetch()` in `layout.ts` — sidebar, header
2. **Tailwind component classes** — consistent card, button, badge, table styles
3. **Shared CSS utility classes** in `main.css` using `@apply`

Key UI patterns:
- **Stat cards** — icon + number + label (for dashboards)
- **Data tables** — striped rows, sortable headers, pagination placeholder
- **Status badges** — color-coded (Baharu=blue, Dalam Tindakan=amber, Selesai=green, Ditolak=red)
- **Form elements** — input, select, textarea, file upload with consistent styling
- **Timeline/workflow** — vertical stepper for complaint progress

---

## 10. Page Organization

### `pages/` — Public & Auth

| Page | Modul | Purpose |
|------|-------|---------|
| `index.html` | 1.1 | Login page (email/phone + password) |
| `daftar.html` | 1.1 | Registration with OTP, PDPA consent |

### `pages/awam/` — Pengguna Awam (Public User)

| Page | Modul | Purpose |
|------|-------|---------|
| `dashboard.html` | — | Overview: my complaints summary |
| `aduan-baharu.html` | 1.2 | Submit new complaint form |
| `senarai-aduan.html` | 1.3 | My complaints list with status |
| `aduan-detail.html` | 1.3 | View complaint detail + timeline |
| `maklum-balas.html` | 1.7 | Rate & review resolved complaint |

### `pages/admin/` — Admin Aduan (Unit Aduan, Bahagian Korporat)

| Page | Modul | Purpose |
|------|-------|---------|
| `dashboard.html` | 1.6 | Stats, charts, KPI overview |
| `senarai-aduan.html` | 1.3, 1.4.1.1 | All incoming complaints, classify & assign to department |
| `aduan-detail.html` | 1.4 | Complaint detail, assign to Penyelia Bahagian |
| `notifikasi.html` | 1.5 | Notification center |

### `pages/penyelia/` — Penyelia Aduan Bahagian

| Page | Modul | Purpose |
|------|-------|---------|
| `dashboard.html` | — | Department complaint overview |
| `senarai-aduan.html` | 1.4.1.2 | Department complaints, assign to technical |
| `aduan-detail.html` | 1.4 | View & assign to Teknikal officer |

### `pages/teknikal/` — Teknikal Aduan Bahagian

| Page | Modul | Purpose |
|------|-------|---------|
| `dashboard.html` | — | Assigned tasks overview |
| `senarai-aduan.html` | 1.4.1.3 | Assigned complaints list |
| `aduan-detail.html` | 1.4 | Resolution form, before/after photos, action report |

### `pages/pentadbir/` — Pentadbir Sistem

| Page | Modul | Purpose |
|------|-------|---------|
| `dashboard.html` | 1.6 | System-wide analytics dashboard |
| `pengguna.html` | 1.8.1 | User management (CRUD, roles) |
| `tetapan.html` | 1.8.2 | System settings (categories, locations, notifications) |
| `laporan.html` | 1.6 | Reports with export (Excel/PDF), KPI |
| `peta-aduan.html` | 1.6.5 | Complaint distribution map placeholder |
| `log-audit.html` | 1.8.3 | Audit trail and system logs |

---

## 11. Asset Management

- Logo: placeholder SVG in `src/assets/logo/` (MBAS crest placeholder)
- Icons: Lucide via CDN (`unpkg.com/lucide@latest`)
- Styles: `src/styles/main.css` with Tailwind directives + custom component classes
- No images needed — use colored placeholder divs for before/after photos

---

## 12. GitHub Pages Deployment Strategy

- Install `gh-pages` as dev dependency
- `npm run deploy` = `npm run build && gh-pages -d dist`
- Set `base` in `vite.config.ts` to `'/<repo-name>/'` before deploying
- GitHub repo Settings > Pages > source branch = `gh-pages`

---

## 13. Documentation Plan

### README.md

- Project overview (Malay + English)
- Tech stack
- Installation, dev, build, lint, format, deploy commands
- Page structure explanation
- How to add new pages

### CLAUDE.md

- Project purpose, tech stack, key commands
- Directory conventions
- Layout system, dark mode, responsive approach
- How to add a new page step-by-step

---

## 14. Git Workflow and Commit Convention

```
feat: {description}
fix: {description}
```

Examples:
- `feat: add login and registration pages`
- `feat: add admin dashboard with stats`
- `fix: correct sidebar active state`

---

## 15. Prettier / Code Formatting Setup

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

- `npm run format` to auto-format
- `npm run format:check` for CI checks

---

## 16. Responsive Design Strategy

- **Mobile-first** approach using Tailwind responsive prefixes
- **Mobile (< 768px)**: sidebar hidden, hamburger menu, single-column layout, scrollable tables
- **Tablet (768px–1024px)**: sidebar collapsed to icons, 2-column grids
- **Desktop (> 1024px)**: full sidebar with labels, multi-column grids
- Tables use `overflow-x-auto` wrapper on small screens
- Form layouts stack vertically on mobile, side-by-side on desktop

---

## 17. Recommended Workflow for Creating New Prototype Pages

1. Create HTML file in appropriate `pages/<role>/` directory
2. Copy layout skeleton from existing page (same role)
3. Update sidebar navigation partial to include new link
4. Add placeholder content with Tailwind classes
5. Test in both light/dark modes
6. Test responsive behavior (mobile, tablet, desktop)
7. Run `npm run lint` and `npm run format`
8. Commit: `feat: add <role> <page-name> prototype`

---

## 18. Initial Prototype Page List

Total: **21 pages**

| # | File | Description |
|---|------|-------------|
| 1 | `pages/index.html` | Login (email/phone + kata laluan) |
| 2 | `pages/daftar.html` | Pendaftaran + OTP + PDPA |
| 3 | `pages/awam/dashboard.html` | Paparan utama pengguna awam |
| 4 | `pages/awam/aduan-baharu.html` | Borang aduan baharu + GPS + muat naik |
| 5 | `pages/awam/senarai-aduan.html` | Senarai aduan saya |
| 6 | `pages/awam/aduan-detail.html` | Butiran aduan + timeline status |
| 7 | `pages/awam/maklum-balas.html` | Penilaian bintang + komen |
| 8 | `pages/admin/dashboard.html` | Dashboard statistik + carta |
| 9 | `pages/admin/senarai-aduan.html` | Senarai semua aduan masuk |
| 10 | `pages/admin/aduan-detail.html` | Butiran + tugasan ke bahagian |
| 11 | `pages/admin/notifikasi.html` | Pusat notifikasi |
| 12 | `pages/penyelia/dashboard.html` | Dashboard penyelia bahagian |
| 13 | `pages/penyelia/senarai-aduan.html` | Aduan bahagian |
| 14 | `pages/penyelia/aduan-detail.html` | Tugasan ke pegawai teknikal |
| 15 | `pages/teknikal/dashboard.html` | Dashboard pegawai teknikal |
| 16 | `pages/teknikal/senarai-aduan.html` | Aduan yang ditugaskan |
| 17 | `pages/teknikal/aduan-detail.html` | Penyelesaian + foto sebelum/selepas |
| 18 | `pages/pentadbir/dashboard.html` | Dashboard analitik sistem |
| 19 | `pages/pentadbir/pengguna.html` | Pengurusan pengguna & peranan |
| 20 | `pages/pentadbir/tetapan.html` | Tetapan sistem |
| 21 | `pages/pentadbir/laporan.html` | Laporan + eksport Excel/PDF |
| 22 | `pages/pentadbir/peta-aduan.html` | Peta taburan aduan |
| 23 | `pages/pentadbir/log-audit.html` | Log audit & jejak perubahan |

---

## Complaint Status Flow

```
Baharu → Diterima → Dalam Tindakan → Selesai
                  → Ditolak
```

Status badge colors:
- **Baharu** — `bg-blue-100 text-blue-800`
- **Diterima** — `bg-indigo-100 text-indigo-800`
- **Dalam Tindakan** — `bg-amber-100 text-amber-800`
- **Selesai** — `bg-green-100 text-green-800`
- **Ditolak** — `bg-red-100 text-red-800`

---

## Placeholder Data Theme

All placeholder data will use realistic Malay content:
- Names: Ahmad bin Ibrahim, Siti Aminah binti Hassan, etc.
- Locations: Jalan Sultan Badlishah, Taman Aman, Pekan Rabu, etc.
- Complaint categories: Jalan Rosak, Sampah, Longkang Tersumbat, Lampu Jalan, Vandalisme, etc.
- Departments: Jabatan Kejuruteraan, Jabatan Kesihatan, Jabatan Perancangan, etc.
