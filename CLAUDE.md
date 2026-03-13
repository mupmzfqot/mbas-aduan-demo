# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sistem Pengurusan Aduan Awam — a static HTML prototype for Majlis Bandaraya Alor Setar (MBAS) public complaint management system. All UI text is in **Bahasa Melayu**. No backend — all data is hardcoded placeholder. Deployed to GitHub Pages at `e-aduan.borang.my`.

## Commands

```bash
npm run dev          # Start Vite dev server
npm run build        # TypeScript check + Vite build
npm run preview      # Preview production build
npm run lint         # ESLint (src/) + HTMLHint (pages/)
npm run lint:js      # ESLint only
npm run lint:html    # HTMLHint only
npm run format       # Prettier auto-format
npm run format:check # Prettier check (CI)
npm run deploy       # Build + deploy to gh-pages branch
```

**Before every commit:** run `npm run lint && npm run format:check` to catch issues.

## Architecture

### Vite Multi-Page Setup

This is NOT a typical single-page app. Vite is configured as a **multi-page static site** with two custom plugins in `vite.config.ts`:

- **`pagesRewrite()`** — Dev server middleware that rewrites URLs so `/admin/dashboard.html` serves from `pages/admin/dashboard.html`. This lets the root URL `/` serve the login page without changing Vite's `root`.
- **`flattenPagesOutput()`** — Post-build hook that moves `dist/pages/*` to `dist/*` so GitHub Pages URLs don't include `/pages/`.

All HTML entry points live under `pages/` and are glob'd as Rollup inputs. The Vite `root` is `.` (project root), NOT `pages/`.

### TailwindCSS v4 (Not v3)

This project uses **TailwindCSS v4** which has a different configuration model:

- No `tailwind.config.ts` or `postcss.config.js` — config is in `src/styles/main.css`
- Uses `@import 'tailwindcss'` instead of `@tailwind` directives
- Uses `@theme {}` for custom colors (not `extend.colors` in a config file)
- Uses `@utility` for custom component classes (not `@layer components` with `@apply`)
- Uses `@custom-variant` for dark mode (not `darkMode: 'class'` in config)
- Uses `@source` to specify content paths
- Requires `@tailwindcss/vite` plugin (not `tailwindcss` PostCSS plugin)

Custom MBAS colors are defined as `--color-mbas-*` CSS variables in `@theme`.

### Path Conventions

All HTML files use **absolute paths** for assets and scripts:
```html
<link rel="stylesheet" href="/src/styles/main.css" />
<script type="module" src="/src/main.ts"></script>
<img src="/src/assets/logo/logo.png" />
```

Never use relative paths (`../src/...`) — they break with the URL rewriting setup.

### GitHub Pages / Custom Domain

`base` in `vite.config.ts` is always `'/'` because the site uses a custom domain (`e-aduan.borang.my`). Do not change this to `'/<repo-name>/'`.

### User Roles

The system has 5 roles, each with its own page directory under `pages/`:

| Role | Path prefix | Description |
|------|-------------|-------------|
| Pengguna Awam | `pages/awam/` | Public users — submit/track complaints |
| Admin Aduan | `pages/admin/` | Receive, classify, assign complaints |
| Penyelia Bahagian | `pages/penyelia/` | Department supervisor — assign to technical |
| Teknikal Bahagian | `pages/teknikal/` | Technical officer — resolve complaints |
| Pentadbir Sistem | `pages/pentadbir/` | System admin — users, settings, reports |

### Complaint Status Flow

```
Baharu → Diterima → Dalam Tindakan → Selesai
                   → Ditolak
```

### Icons

Lucide icons via `lucide` npm package (NOT CDN). Icons are initialized in `src/main.ts` via `createIcons({ icons })` on DOMContentLoaded. Do NOT add CDN script tags. After dynamically modifying DOM with `data-lucide` attributes, call `createIcons({ icons })` again from the imported package.

## Adding a New Page

1. Create HTML file in `pages/<role>/`
2. Use absolute paths for CSS (`/src/styles/main.css`), JS (`/src/main.ts`), and assets
3. Icons render automatically via `src/main.ts` — no CDN or manual `createIcons()` needed unless dynamically adding icons after page load
4. Test both light and dark modes
5. Test responsive layout (mobile, tablet, desktop)
6. Run `npm run lint && npm run format`
