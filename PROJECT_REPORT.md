# Project Report — `my-portfolio-v2`

> Read-only investigation. Nothing in the codebase was modified to produce this document.
> Prepared as an onboarding brief for a human or AI assistant about to make changes.

---

## 1. Overview

This is the personal portfolio website of **Alaa Fayyad**, a full-stack developer and UI/UX
designer based in Beirut, Lebanon. It is a single-page marketing/portfolio site with a
deliberately "developer" aesthetic: an animated boot sequence, an interactive shell-style
terminal hero, and section-numbered content panels ("01 | About", "02 | Skills", …).

The page presents five content sections — About, Skills, Projects, Experience, Contact — plus
a hero. Content is fully **bilingual (English + Arabic) with real right-to-left support**, and
the site has a **dark/light theme** toggle. Two contact forms ("Send a message" and "Request a
quote") send email to the owner. There is also a hidden **collaborative puzzle** (`/decode`, a
4-stage riddle chain backed by a shared database) and a built-but-currently-unreachable
**bug-fix mini-game** (`/fix`), both launched from the terminal.

The audience is prospective clients and employers. There is no CMS, no user accounts, and no
analytics dashboard — the owner edits data directly in a TypeScript file and redeploys.

---

## 2. Tech stack

| Area | Choice |
|---|---|
| Language | TypeScript 5 (`strict: false`, but `strictNullChecks: true`), plus some plain JS config files |
| Framework | **Next.js `^16.2.12`** using the **Pages Router** (`src/pages/**`), React `^18` / ReactDOM `^18` |
| Dev bundler | Turbopack (Next 16 default; `.next/dev/**` contains Turbopack chunks). `dev` script is a bare `next dev`. |
| Styling | **No CSS framework.** One large inline `<style>` block in `src/pages/_document.tsx` holds all global CSS + design tokens; `_app.tsx` adds a `styled-jsx` block for font variables; components use inline `style={{…}}` objects. The `tags`/skills copy mentions "Tailwind CSS" but that refers to *other* projects — Tailwind is **not** a dependency here. |
| Animation | `gsap` `^3.15` (+ ScrollTrigger), `lenis` `^1.3` (smooth/momentum scroll) |
| Icons | `lucide-react` `^0.344`, `react-icons` `^5` |
| Email | `resend` `^6.9` (transactional email from the two forms) |
| Bot protection | `botid` `^1.5` (Vercel BotID) on the two form POSTs |
| Database client | `@supabase/supabase-js` `^2.110` — used **only** by the `/decode` puzzle API |
| Platform SDKs | `@vercel/analytics` `^1.6`, `@vercel/speed-insights` `^2.0` |
| Package manager | **npm** (`package-lock.json` present; CI uses `npm ci`). No yarn/pnpm lockfile. |
| Runtime | Node **22** in CI (`.github/workflows/ci.yml`); local dev observed on Node v22.22.3. `BootOverlay` cosmetically prints "node v22.0.0". |
| Tests | `jest` `^29.7` + `ts-jest` `^29.4` + `@testing-library/react` `^16` + `jest-environment-jsdom` |
| Lint | `eslint` `^10.4` with `eslint-config-next` `^16`; **two** configs present (see §11) |
| Deploy target | **Vercel** (project `alaa-fayyad`, `.vercel/repo.json`); live at `https://alaafayyad.vercel.app` |

`package.json` pins security overrides for transitive deps: `postcss ^8.5.19`, `sharp ^0.35.3`,
`brace-expansion ^5.0.8`, `js-yaml ^4.3.0`. `postcss` is also a direct dependency but there is
no `postcss.config.*` — it appears vestigial.

---

## 3. Architecture

It is a **single Next.js app**, not a monorepo and not a split front/back deployment. The
"backend" is a handful of Next.js **Pages Router API routes** running as Vercel serverless
functions (Node.js runtime). There is no custom server, no microservices, no message queue.

**Rendering model**

- `src/pages/index.tsx` is effectively the entire website — one route, all five sections
  stacked, no client-side routing between "pages". It renders mostly on the client after
  hydration (fonts, theme, i18n, animations, and the terminal are all client concerns).
- `robots.txt` and `sitemap.xml` are implemented as **SSR routes** (`getServerSideProps`
  writes the response directly) so the site origin comes from one constant.
- The API routes are request/response handlers with no shared framework layer beyond small
  helper modules in `src/lib/`.

**Data flow**

1. **Static content** (projects, experience, skills, all UI copy) lives in
   `src/data/portfolio.ts` and `src/messages/{en,ar}.json`, imported at build time. Editing
   the portfolio = editing these files.
2. **Contact / Quote**: browser form → `POST /api/contact` or `/api/quote` → same-origin
   check → BotID check → in-memory rate-limit → field sanitisation → email-format +
   disposable-domain + **DNS MX** validation → `resend.emails.send(...)` to the owner's
   Gmail. **Nothing is persisted** — there is no database write on this path.
3. **/decode puzzle**: terminal command `:wq` → `DecodePuzzle` modal → `GET/POST /api/decode`
   → **Supabase** (`puzzle_state`, `puzzle_theories` tables). Guesses are graded server-side
   against `PUZZLE_ANSWERS` (env var, never sent to the client). This is the only stateful
   feature.

**Cross-cutting concerns**

- **Theme**: a no-flash inline script in `_document.tsx` sets `<html data-theme>` from
  `localStorage`/OS preference before first paint; `useTheme()` syncs React state afterwards.
- **i18n**: a hand-rolled `useTranslation()` hook (module-level `globalLocale` + a `Set` of
  listeners; **not** React Context, **not** `next-intl`/`next-i18next`). Locale persists in
  `localStorage('lang')`. `index.tsx` flips `document.documentElement.dir`/`lang` on change.
- **Smooth scroll**: `SmoothScroll.tsx` boots Lenis + GSAP on mount and publishes the Lenis
  instance on `window.__lenis`; nav links and terminal navigation call `lib/scroll.ts`
  (`smoothScrollTo`) which prefers that instance.
- **Security headers / CSP**: centralised in `next.config.js` via `withBotId(...)`.

Recognisable pattern: **data-driven single-page app on Next.js Pages Router**, with a thin
serverless API and a clear split between "content data files" and "presentational components".

---

## 4. Directory structure

```
my-portfolio-v2/
├─ .github/workflows/ci.yml     CI: typecheck → lint → test → npm audit → build → Vercel deploy
├─ .vercel/repo.json            Vercel project link (project "alaa-fayyad")
├─ __mocks__/fileMock.js        Jest stub for CSS imports
├─ __tests__/                   Jest test files (2)
│   ├─ Navbar.test.tsx          Tests the LEGACY Navbar + Footer (see §10/§11)
│   └─ Legal.test.tsx           Thorough a11y + Lenis-wheel tests for the legal modals
├─ public/                      Static assets: CV pdf, logos, favicons, project screenshots,
│                               manifest.json, fattoura_cover.svg, plus create-next-app SVGs
├─ src/
│   ├─ pages/
│   │   ├─ _app.tsx             Font loading (next/font: Inter, JetBrains Mono, Cairo) + font CSS vars
│   │   ├─ _document.tsx        No-flash theme script + the ENTIRE global stylesheet (~830 lines)
│   │   ├─ index.tsx            The whole site: <Head> SEO, BootOverlay, SiteNav, TerminalHero,
│   │   │                       5× ScreenFrame(section), Footer, Analytics, SpeedInsights
│   │   ├─ robots.txt.ts        SSR text route
│   │   ├─ sitemap.xml.ts       SSR XML route (single-URL sitemap with hreflang alternates)
│   │   └─ api/
│   │       ├─ contact.ts       "Send a message" form → Resend email
│   │       ├─ quote.ts         "Request a quote" form → Resend email
│   │       └─ decode.ts        /decode puzzle: GET state+theories, POST a guess (Supabase)
│   ├─ components/
│   │   ├─ site/                Current site chrome + interactive bits
│   │   │   ├─ SiteNav.tsx      Fixed top nav, scroll-spy, traveling underline/arrow, mobile drawer
│   │   │   ├─ BootOverlay.tsx  ~2.1s non-skippable fake boot screen
│   │   │   ├─ TerminalHero.tsx Interactive terminal hero (auto-typed intro + real command input)
│   │   │   ├─ DecodePuzzle.tsx /decode modal UI (fetches /api/decode)
│   │   │   ├─ FixChallenge.tsx /fix bug-fix mini-game modal (built; UI entry point disabled)
│   │   │   ├─ Modal.tsx        Reusable accessible dialog (focus trap, scroll lock incl. Lenis)
│   │   │   └─ Legal.tsx        Privacy / Terms modals, content from messages JSON
│   │   ├─ deck/
│   │   │   ├─ ScreenFrame.tsx  Section wrapper: "NN | Title" header + reveal animation
│   │   │   └─ SectionEyebrow.tsx  The big "01" index number + vertical rule
│   │   ├─ About.tsx / Skills.tsx / Projects.tsx / Experience.tsx / Contact.tsx / Footer.tsx
│   │   ├─ SmoothScroll.tsx     Lenis + GSAP bootstrap; exposes window.__lenis
│   │   └─ Navbar.tsx           LEGACY nav — not rendered anywhere; only referenced by a test
│   ├─ data/portfolio.ts        Projects, experiences, skillCategories (bilingual fields)
│   ├─ messages/{en,ar}.json    All UI copy + full legal text; keys are parallel (159 lines each)
│   ├─ hooks/
│   │   ├─ useTranslation.ts    Custom global-locale hook (no Context)
│   │   └─ useTheme.ts          Reads/writes <html data-theme> + localStorage
│   ├─ lib/
│   │   ├─ site.ts              SITE_URL / titles / OG image / author constants (single source)
│   │   ├─ jsonLd.ts            Builds schema.org @graph from portfolio.ts + site.ts
│   │   ├─ terminal.ts          Pure command engine for the hero terminal (+ easter eggs)
│   │   ├─ fixBugs.ts           Pool of 6 self-contained broken HTML snippets for /fix
│   │   ├─ scroll.ts            smoothScrollTo() — Lenis-aware programmatic scroll
│   │   ├─ security.ts          escapeHtml, field caps, header sanitisation, isSameOrigin,
│   │   │                       safeIp, in-memory rateLimit
│   │   ├─ supabase.ts          Lazy service-role Supabase client + hand-written DB types
│   │   └─ botid.ts             Shared BotID options (dev bypass switch)
│   └─ instrumentation-client.ts  Registers BotID protection for the two form paths
├─ eslint.config.mjs           Flat ESLint config (active)
├─ .eslintrc.json              Legacy ESLint config (also present — redundant)
├─ jest.config.js              ts-jest + jsdom; special handling for lenis ESM
├─ next.config.js              CSP + security headers, withBotId wrapper, image formats
├─ next-env.d.ts               Next-generated (currently shows an uncommitted whitespace/path diff)
├─ tsconfig.json               Path alias "@/*" → ./src/*
├─ vercel.json                 Only overrides installCommand ("npm install --include=dev")
└─ README.md                   Still the default create-next-app boilerplate (stale — see §11)
```

Not tracked but present on disk: `.next/` (dev build cache), `.vercel/`, `.env.local`
(all in `.gitignore`).

---

## 5. Entry points

- **`src/pages/_app.tsx`** — Next.js custom App. Loads the three web fonts via `next/font/google`
  (self-hosted at build time) and exposes them as CSS variables. Wraps every page.
- **`src/pages/_document.tsx`** — Next.js custom Document. Injects the pre-paint theme script
  and the entire global stylesheet. This is where all site-wide CSS lives.
- **`src/pages/index.tsx`** — the site. Composes every visible section. This is the file to
  start from for almost any content or layout change.
- **`src/pages/api/contact.ts`, `quote.ts`, `decode.ts`** — serverless function entry points.
- **`src/pages/robots.txt.ts`, `sitemap.xml.ts`** — SSR utility routes.
- **`src/instrumentation-client.ts`** — Next.js client instrumentation hook; runs once on the
  client to register BotID for `/api/contact` and `/api/quote`.
- **CLI**: `npm run dev` → `next dev`; `npm run build` → `next build`; `npm start` → `next start`.

---

## 6. Key modules / components

1. **`src/pages/index.tsx`** — top-level composition + all `<Head>` SEO (canonical, Open Graph,
   Twitter, JSON-LD). Owns the `booted` state that gates the `BootOverlay` and the terminal's
   start. Renders each section inside a `ScreenFrame` with a `bare` child. Depends on almost
   everything below.

2. **`src/pages/_document.tsx`** — the de-facto stylesheet. Defines the `--bg/--primary/--text/…`
   design tokens for both themes, plus every component class (`.term-*`, `.snav__*`, `.modal-*`,
   `.decode-*`, `.fix-*`, `.screen-*`, `.boot2__*`). Any visual change that isn't an inline
   style is made here. No other component depends on it by import — only by class name.

3. **`src/components/site/TerminalHero.tsx`** — the interactive hero. Auto-types a short intro,
   then exposes a real focusable input. Delegates command parsing to `lib/terminal.ts`, runs
   the returned side-effect (`open` link / `scroll` to section via `lib/scroll.ts` / `overlay`
   to open `DecodePuzzle` or `FixChallenge`). Has command history (Arrow Up/Down), a11y live
   region, and careful timeout cleanup. Depends on `useTranslation`, `lib/terminal`, `lib/scroll`,
   `DecodePuzzle`, `FixChallenge`.

4. **`src/lib/terminal.ts`** — pure, framework-free command engine. `runCommand(raw, ctx)` →
   `{ lines, action? } | { clear: true }`. Handles `help`, section navigation, `email`/`github`/
   `linkedin`/`whatsapp`/`resume`, `cls`, and easter eggs (`sudo`, `echo`, `date`, `joke`,
   `:wq` → open `/decode`). The `/fix` trigger is **commented out** here, so `FixChallenge` is
   currently unreachable from the UI.

5. **`src/components/site/SiteNav.tsx`** — fixed top navigation. Scroll-spy via
   `IntersectionObserver`, a shared "traveling" underline+arrow indicator measured off the
   active link (with `ResizeObserver`/`document.fonts.ready` re-measurement), scrolled-state
   background, and a fully animated mobile hamburger drawer with theme + language toggles.
   Depends on `useTranslation`, `useTheme`, `lib/scroll`.

6. **`src/components/site/Modal.tsx`** — reusable accessible dialog used by `Legal`,
   `DecodePuzzle`, and `FixChallenge`. `role="dialog"` + `aria-modal`, Tab/Shift+Tab focus
   trap, Escape / overlay-click / X to close, focus restore to trigger, and background scroll
   lock that explicitly stops Lenis. Rendered via `createPortal` to `document.body`. Contains
   detailed comments about a Lenis `data-lenis-prevent` interaction — the `Legal.test.tsx`
   suite is a regression guard for exactly that.

7. **`src/pages/api/contact.ts` & `quote.ts`** — near-identical form handlers. Order of checks:
   method → `isSameOrigin` → `checkBotId` → rate-limit (per client IP, in-memory) → coerce/cap
   fields → email format + disposable-domain blocklist + DNS `resolveMx` → `resend.emails.send`.
   Email HTML escapes every interpolated value. Recipient is hard-coded
   (`alaafayyadp1@gmail.com`); `from` is `onboarding@resend.dev` with the sender's name as the
   display name; `replyTo` is the submitter.

8. **`src/pages/api/decode.ts` + `src/components/site/DecodePuzzle.tsx` + `src/lib/supabase.ts`**
   — the collaborative puzzle. Server tracks `current_stage` in `puzzle_state` and appends
   every guess to `puzzle_theories`. `judge()` compares a guess to the stage's answer
   (whole-word regex) and to a per-stage "close" keyword list. Correct guess advances the
   shared stage for **all** visitors. The client does optimistic insertion with rollback, a
   25s cooldown, and a "reveal the ending" completion state. Every Supabase call's `error` is
   checked explicitly (the client is configured not to throw).

9. **`src/data/portfolio.ts`** — the content model: `projects[]` (id, `title`/`titleAr`,
   `description`/`descriptionAr`, `image`, `tags`, `live`, `github`, `featured`, `color`),
   `experiences[]`, `skillCategories[]`. Consumed by `Projects.tsx`, `Experience.tsx`,
   `Skills.tsx`, and `lib/jsonLd.ts`. Editing this + the message JSON is the intended way to
   update the site.

10. **`src/hooks/useTranslation.ts`** — the i18n mechanism. A module-global `globalLocale` and
    a `Set<() => void>` of subscribers; every `useTranslation()` consumer re-renders on
    `toggleLocale()`. `t` is the whole `messages[locale]` object. `isRTL = locale === 'ar'`.

---

## 7. Data layer

- **Primary datastore: none for most of the site.** Portfolio content is static TypeScript/JSON
  compiled into the bundle. The contact and quote forms **do not write anywhere** — submissions
  become email and are then gone (the privacy copy states this explicitly).
- **Supabase (PostgreSQL)** is used **only** by `/api/decode`:
  - `puzzle_state` — single row (`id = 1`): `current_stage`, `stage_solved_at` (JSON map of
    stage → ISO timestamp), `updated_at`.
  - `puzzle_theories` — append-only log: `id`, `created_at`, `content` (the raw guess),
    `stage`, `is_correct`, `visitor_key` (nullable, currently never set by the API).
  - Access is server-only with the **service-role key** via a lazily-created client in
    `src/lib/supabase.ts`. That file also holds a **hand-written** `Database` type — there is
    no generated types file.
- **No ORM.** Direct `@supabase/supabase-js` query builder calls.
- **No migrations in the repo.** The two tables (and the seed `puzzle_state` row) must be
  created directly in Supabase; the schema exists only implicitly in `supabase.ts` and
  `decode.ts`. Row-Level Security posture is not visible from the code (the service-role key
  bypasses RLS regardless).
- **Browser storage**: `localStorage` keys `lang` and `theme` only. No cookies.

---

## 8. External integrations

| Service | Purpose | Env vars |
|---|---|---|
| **Vercel** | Hosting, CI deploy, Analytics, Speed Insights, BotID | `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` (CI secrets); `VERCEL_OIDC_TOKEN` (local, auto) |
| **Resend** | Transactional email for both contact forms | `RESEND_API_KEY` |
| **Supabase** | Postgres backing the `/decode` puzzle | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` |
| **Vercel BotID** | Invisible bot check on form POSTs | none in prod; `BOTID_DEV_BYPASS` = `HUMAN`/`BAD-BOT`/`GOOD-BOT` for local testing only |
| **DNS (Node `dns.resolveMx`)** | Validates that a submitted email domain can receive mail | none |
| **Google Fonts** | Inter / JetBrains Mono / Cairo — **downloaded at build time** by `next/font`, self-hosted; no runtime request to Google | none |

Application env vars used in code:

- `RESEND_API_KEY` — `api/contact.ts`, `api/quote.ts` (required for email to work).
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — `lib/supabase.ts` (throws if missing when
  `/decode` is hit).
- `PUZZLE_ANSWERS` — comma-separated, one answer keyword per stage; read by `api/decode.ts`.
  Never sent to the client.
- `NEXT_PUBLIC_SITE_URL` — optional override of the public origin in `lib/site.ts` (defaults to
  `https://alaafayyad.vercel.app`); flows into canonical/OG/JSON-LD/robots/sitemap.
- `BOTID_DEV_BYPASS` — dev-only; ignored in production.

`.env.local` on disk contains: `RESEND_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`,
`PUZZLE_ANSWERS`, `VERCEL_OIDC_TOKEN`. There is **no `.env.example`** committed.

Outbound hosts allowed by the CSP in `next.config.js`: `va.vercel-scripts.com` (Analytics
script), `vitals.vercel-insights.com` (Speed Insights beacon). Everything else is `'self'`;
`img-src` also allows `data:`.

---

## 9. Build, run, and test

All commands are npm scripts from `package.json` (the README is stale and should not be relied
on):

```bash
# Install (CI uses `npm ci`; vercel.json forces dev deps on the platform)
npm install

# Local dev server → http://localhost:3000
npm run dev

# Production build / serve
npm run build
npm start

# Lint (flat config in eslint.config.mjs)
npm run lint          # eslint . --ext .ts,.tsx,.js,.jsx

# Tests (jest + ts-jest + jsdom)
npm test              # runs jest

# Type check (used by CI; no dedicated script)
npx tsc --noEmit
```

To exercise the forms and puzzle locally you need `.env.local` populated with the §8 vars.
BotID behaviour in dev is controlled by `BOTID_DEV_BYPASS` (e.g.
`BOTID_DEV_BYPASS=BAD-BOT npm run dev` to make the handlers return 403).

**CI pipeline** (`.github/workflows/ci.yml`, on push/PR to `main`): checkout → Node 22 →
restore `.next/cache` → `npm ci` → `npx tsc --noEmit` → `npm run lint` → `npm run test` →
`npm audit --audit-level=high` → `npm run build` → **on push to `main` only**, deploy to Vercel
production via `npx vercel --prod --yes`.

---

## 10. Current state

- **Type check**: `npx tsc --noEmit` passes cleanly (verified in this investigation).
- **Test suite**: `npm test` — **2 suites, 16 tests, all passing** (~145s; ts-jest cold start
  is slow). Two files only —
  - `__tests__/Legal.test.tsx` — substantial: dialog semantics, focus move/restore, Escape,
    Tab trap, background scroll lock, content assertions, and three tests that spin up a **real
    Lenis instance** to guard the modal wheel-scroll behaviour. Good coverage of `Modal` +
    `Legal`.
  - `__tests__/Navbar.test.tsx` — tests `src/components/Navbar.tsx` and `Footer.tsx`. **`Navbar`
    is dead code** (the site renders `site/SiteNav.tsx` instead), so this file asserts against a
    component no visitor sees. `Footer` is live and its one assertion (`aria-label="arrowUp"`
    button) is valid.
  - No tests for the API routes, the terminal engine (`lib/terminal.ts`), `lib/security.ts`,
    the puzzle, i18n, or the section components. Overall coverage is low and skewed to one area.
- **CI/CD**: present and complete (see §9). Auto-deploys `main` to Vercel production.
- **Branches**: `main` plus two stale remotes — `origin/seo/cwv-favicon-manifest-speedinsights`
  and `origin/ci/remove-docker-build`. Each contains a single commit whose change is already in
  `main` (same commit messages, pre-squash hashes). Both can be deleted.
- **Uncommitted working-tree changes** (in-progress polish, not a feature):
  - `src/components/Contact.tsx` — form input font-size `0.9rem` → `1rem` (iOS Safari
    focus-zoom fix) + explanatory comment.
  - `src/pages/_document.tsx` — same 16px-minimum fix for `.term-input`, `.decode-input`,
    `.fix-code`; bump `.snav__icon`/`.snav__burger` hit areas `36px` → `44px` (WCAG touch
    target).
  - `next-env.d.ts`, `tsconfig.tsbuildinfo` — Next/TS generated churn.
- **Recent history**: many commits are just `mod` / `mods` / `fix` — low signal. Recent
  themed commits: Next.js 16 + ESLint 10 upgrade, security-vuln resolution, dropping a Docker
  build step from CI, and an SEO/Core-Web-Vitals pass (favicons, web manifest, Speed Insights).
- **Explicitly incomplete / dormant features**:
  - `/fix` bug-fix game: `FixChallenge.tsx` and `lib/fixBugs.ts` (6 challenges) are fully
    built and still wired into `TerminalHero`, but the `/fix` command is commented out in
    `lib/terminal.ts`, so there is no way to open it.
  - Large blocks of commented-out code: ~half the `joke` list, `pwd` command, Instagram
    social link (`Contact.tsx`), `projects` link + a second `smoothScroll` impl in the dead
    `Navbar.tsx`.
- **TODO/FIXME markers**: none literally (`TODO`/`FIXME` strings not used); intent is instead
  captured in prose comments (many "BUG:" strings exist but are *intentional* — they mark the
  planted bugs in `lib/fixBugs.ts`).

---

## 11. Notable issues / tech debt

- **All CSS in one inline string.** `_document.tsx` is ~830 lines, most of it a single CSS
  blob with no tooling (no autoprefixer pipeline, no linting, no co-location). Editing styles
  means scrolling one giant template literal and matching class names by hand. High friction,
  easy to introduce dead rules.
- **Two competing lint configs.** Both `.eslintrc.json` (legacy `extends: next/*`) and
  `eslint.config.mjs` (flat) exist. ESLint 10 uses the flat config and ignores the legacy one;
  the flat config also turns off `no-unused-vars`, `no-explicit-any`, and `no-empty`, so lint
  is quite permissive. `.eslintrc.json` should be deleted to avoid confusion.
- **Dead component still under test.** `src/components/Navbar.tsx` is not imported by any
  rendered code; `SiteNav.tsx` replaced it. Keeping `Navbar.test.tsx` green gives a false sense
  of nav coverage and will silently rot. Either delete both, or point the test at `SiteNav`.
- **Stale README.** Still the `create-next-app` template — references `pages/api/hello.ts`
  (doesn't exist), the Geist font (the site uses Inter/JetBrains Mono/Cairo), and gives no
  project-specific setup, env, or architecture notes.
- **Rate limiting is in-memory per serverless instance** (`lib/security.ts` says so in a
  comment). On Vercel this is best-effort only — a determined flood across warm instances is
  not blocked. BotID + same-origin are the real guards; a shared store (Upstash/Redis) or the
  Vercel WAF would be needed for a hard limit.
- **Puzzle schema is undocumented and unversioned.** No migration files; the two Supabase
  tables + seed row exist only in prose/types. Standing up a fresh environment requires
  reverse-engineering `decode.ts` and `supabase.ts`. RLS expectations are not expressed
  anywhere in the repo.
- **`tsconfig` is loose** — `strict: false` (only `strictNullChecks` on), `allowJs`,
  `no-explicit-any` disabled in lint. New code won't get full type safety by default.
- **Duplicated form logic.** `api/contact.ts` and `api/quote.ts` share ~70% identical code
  (the `validateEmail` function, IP extraction, rate-limit block, email-HTML shell) copy-pasted
  rather than factored into `lib/`.
- **Three hand-rolled smooth-scroll implementations** exist: `lib/scroll.ts` (the good one,
  Lenis-aware), plus separate eased-rAF copies inside `Navbar.tsx` (dead) and `Footer.tsx`
  (live, for the "back to top" button). The Footer one should call `lib/scroll.ts`.
- **Stale build artifacts hint at a removed feature.** `.next/` (untracked) still contains
  chunks named `src/components/os/Starfield.tsx`, `src/components/r3f/Experience3D.tsx`, and
  bundles for `three` / `@react-three/fiber`. None of that is in `src/` or `package.json`
  anymore — there was evidently a 3D/WebGL version of the hero that has been fully removed.
  Harmless, but `.next/` should be cleared before trusting any local build inspection.
- **i18n has no typing safety across locales.** `en.json` and `ar.json` are kept parallel by
  hand (both 159 quoted lines). A missing key in `ar.json` would surface as `undefined` at
  runtime, not a build error.
- **`vercel.json` forces `npm install --include=dev`** — implies a past problem with Vercel
  pruning dev deps needed at build time; worth knowing before touching the dependency split.
- **`postcss` is a direct dependency with an override but no config file** — likely removable.
- **Single monolithic page, client-heavy.** Everything hydrates and runs on the client
  (i18n, theme, animation, terminal). Fine for a portfolio, but there is no error boundary and
  no custom `404`/`500`, so a client throw in `index.tsx` blanks the whole site.

---

## 12. Open questions

1. **Supabase schema / setup**: Is there a migration or SQL snippet anywhere outside the repo
   for `puzzle_state` and `puzzle_theories` (and the seed `puzzle_state` row with `id = 1`)?
   What RLS policies are expected on those tables given the API uses the service-role key?
2. **`PUZZLE_ANSWERS`**: How many stages/answers are configured in production, and is the
   `visitor_key` column intended to be populated later (it's in the schema/type but the API
   never writes it)?
3. **`/fix` game**: Is it deliberately disabled, or is un-commenting the `/fix` case in
   `lib/terminal.ts` the only step left to ship it? Anything blocking it?
4. **Dead `Navbar.tsx` + its test**: safe to delete both, or is `Navbar` kept intentionally as
   a fallback/reference?
5. **Stale remote branches** (`seo/cwv-favicon-manifest-speedinsights`, `ci/remove-docker-build`):
   confirm they're fully merged and can be pruned.
6. **Removed 3D hero**: was the `three` / `@react-three/fiber` version abandoned for
   performance, or parked for later? Affects whether to design new hero work around a
   potential return.
7. **Resend sending domain**: forms send `from: onboarding@resend.dev` (Resend's shared
   sandbox sender). Is a verified custom domain planned, and does deliverability to the
   owner's Gmail currently rely on that sandbox address?
8. **Analytics**: `@vercel/analytics` and `@vercel/speed-insights` are both mounted — is the
   Vercel project on a plan where Speed Insights actually collects, or is that component a
   no-op right now?
9. **Lint strictness**: is the permissive flat config (no-unused-vars / no-explicit-any /
   no-empty all off) a deliberate choice, or drift from the ESLint 10 migration that should be
   tightened?
10. **Intended editing workflow**: is `src/data/portfolio.ts` + `src/messages/*.json` the only
    place content should change, or is a CMS/headless source planned?
```
