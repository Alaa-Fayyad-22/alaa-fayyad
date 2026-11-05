# PROJECT_REPORT — `my-portfolio-v2` (package name `my-portfolio`)

> Handoff report for an assistant that **cannot see the codebase**. Everything here was read from the
> repo on 2026-11-05 (branch `main`, HEAD `8fccaec`). Anything not directly verified is tagged **(unverified)**.
> Secrets are never reproduced: values are written as `[REDACTED]`.
> This file **replaces** an older, stale `PROJECT_REPORT.md` (committed 2026-08-28 in `a155a3c`).

---

## 1. OVERVIEW

**What it is.** The personal portfolio website of **Alaa Fayyad** (full-stack developer + UI/UX designer, Beirut, Lebanon). Live at `https://alaafayyad.vercel.app` (fallback value in `src/lib/site.ts:9`; README.md also states it).

**Audience.** Prospective clients and employers. Visitors read the portfolio, download a CV (`public/Alaa_Fayyad_CV.pdf`), and send either a "message" or a "quote request" that is emailed to the owner.

**Two complete designs live in one app:**

| Route | Design | Files |
|---|---|---|
| `/` | **"IDE workspace"** — a VS Code–like shell (titlebar, file-tree sidebar, tabs, minimap, statusbar). Each portfolio section is a "file" you open in a tab. Fixed Catppuccin-Mocha dark palette; does NOT follow light/dark theme. | `src/pages/index.tsx`, `src/components/workspace/**` |
| `/classic` | **Original terminal-style single scrolling page** — boot overlay → interactive terminal hero → 5 numbered sections → footer. Teal single-accent design with light/dark theme toggle. | `src/pages/classic.tsx`, `src/components/*.tsx`, `src/components/site/**`, `src/components/deck/**` |

Both are **bilingual (English + Arabic, real RTL)** and read content from the same data (`src/data/portfolio.ts`, `src/messages/{en,ar}.json`).

**Extras:** two email forms (contact / quote, via Resend, protected by Vercel BotID), a hidden collaborative 4-stage riddle game (`/decode`, Supabase-backed, opened by typing `:wq` in the classic terminal), an interactive terminal with commands, anonymous Vercel Analytics custom events, SEO (OG/Twitter/JSON-LD/sitemap/robots/manifest), strict security headers + CSP.

**No** CMS, no user accounts, no admin UI, no ORM/migrations in this repo. Content is edited in TS/JSON files and redeployed.

### Current state

| Area | State (verified) |
|---|---|
| `npx jest` | **PASS** — 3 suites, 35 tests (run 2026-11-05) |
| `npx tsc --noEmit` | **PASS** (no output) |
| `npm run lint` | **PASS** (no output) |
| `next build` | not run in this session **(unverified)** |
| **Uncommitted change** | `next.config.js` — the `/` → `/classic` redirect is **commented out in the working tree**. At HEAD the redirect is **active**, so *committed* production serves `/classic` at `/` and the workspace design is unreachable on `/`. See §14/§15. |
| `/fix` bug-fix mini-game | Component + data exist and are mounted, but the terminal command that opens it is **commented out** (`src/lib/terminal.ts:174-175`) → unreachable. |
| `Navbar.tsx` | Dead code — imported only by a test. |
| Project image `/3adasa_cover.png` | **Missing file** (public/ has `3adasa.png`). Broken image in classic Projects + JSON-LD. |

---

## 2. TECH STACK

### Language / runtime
- TypeScript `5.9.3` installed (`^5` declared), `strict: false`, `strictNullChecks: true` (`tsconfig.json`). Some plain JS config files.
- Node: dev machine `v22.22.3`; CI uses Node `22` (`.github/workflows/ci.yml`). **No `engines` field** in package.json.

### Dependencies (declared → installed, from `npm ls`)
| Package | Declared | Installed | Used for |
|---|---|---|---|
| `next` | ^16.2.12 | **16.3.3** | Framework, **Pages Router** (NOT App Router) |
| `react` / `react-dom` | ^18 | 18.3.1 | UI |
| `@supabase/supabase-js` | ^2.110.9 | 2.112.4 | `/api/decode` only |
| `resend` | ^6.9.3 | 6.24.0 | Email in `/api/contact`, `/api/quote` |
| `botid` | ^1.5.11 | 1.5.11 | Vercel BotID bot protection |
| `@vercel/analytics` | ^1.6.1 | 1.6.1 | Page analytics + custom events |
| `@vercel/speed-insights` | ^2.0.0 | 2.0.0 | Web vitals |
| `gsap` | ^3.15.0 | 3.15.0 | ScrollTrigger (classic only) |
| `lenis` | ^1.3.24 | 1.3.26 | Smooth scroll (classic only) |
| `lucide-react` | ^0.344.0 | — | Icons |
| `react-icons` | ^5.0.0 | — | `FaGithub`, `FaWhatsapp` in `Contact.tsx` |
| `postcss` | ^8.5.19 | — | Listed as a *dependency* (also in `overrides`); no postcss config file exists — likely unnecessary **(unverified)** |

Dev: `eslint ^10.4.1` (10.9.1), `eslint-config-next ^16.2.12`, `@eslint/js ^10.0.1`, `@eslint/eslintrc ^3.3.5`, `jest ^29.7.0`, `jest-environment-jsdom ^29.7.0`, `ts-jest ^29.4.11`, `@testing-library/{react ^16.3.2, jest-dom ^6.9.1, user-event ^14.6.1}`, `@types/{jest ^30, node ^20, react ^18, react-dom ^18}`, `next ^16.2.12` is in **devDependencies** (not dependencies) — works because Vercel installs with `--include=dev` (`vercel.json`).
`overrides`: `postcss ^8.5.19`, `sharp ^0.35.3`, `brace-expansion ^5.0.8`, `js-yaml ^4.3.0`.

`eslint.config.mjs` imports `@next/eslint-plugin-next` and `typescript-eslint`, which are **not declared** in package.json (resolved transitively via `eslint-config-next`) — fragile.

**Not used:** Tailwind (only mentioned as skill text), any CSS framework, state library, ORM, test e2e.

### External services
| Service | Role | Env |
|---|---|---|
| Vercel | Hosting, Analytics, Speed Insights, BotID | `VERCEL_OIDC_TOKEN` appears in `.env.local` (CLI-managed) |
| Resend | Sends contact/quote emails (from `onboarding@resend.dev`, to `alaafayyadp1@gmail.com`) | `RESEND_API_KEY` |
| Supabase (Postgres) | Backs `/decode` riddle game (shared with a separate "Happidoo" project per `.env.local` comment) | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` |
| Google Fonts (build-time only) | `next/font/google` self-hosts Inter, JetBrains Mono, Cairo | — |
| DNS MX lookup | `dns.resolveMx` to validate sender email domains (Node `dns`) | — |

---

## 3. HOW TO RUN IT

```bash
npm install            # Vercel uses: npm install --include=dev  (vercel.json). CI uses: npm ci
npm run dev            # next dev (Turbopack default in Next 16) -> http://localhost:3000
npm run build          # next build
npm run start          # next start (after build)
npm run lint           # eslint . --ext .ts,.tsx,.js,.jsx
npm test               # jest   (== npx jest; config: jest.config.js)
npx tsc --noEmit       # type check (CI step)
npm audit --audit-level=high   # CI step; can fail the pipeline
```

**Deploy.** Two paths exist **(possible duplication, unverified which is active)**:
1. Vercel Git integration (project `alaa-fayyad`, id/org in `.vercel/repo.json`).
2. CI job in `.github/workflows/ci.yml` runs `npx vercel --token=${{ secrets.VERCEL_TOKEN }} --prod --yes` on push to `main` (needs secrets `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`).

### Environment variables
Local file: `.env.local` (git-ignored via `.env.local` and `.env*` in `.gitignore`). Names found:

| Variable | Purpose | Example format | Required for |
|---|---|---|---|
| `RESEND_API_KEY` | Resend API key | `re_xxx` → **[REDACTED]** | `/api/contact`, `/api/quote` |
| `SUPABASE_URL` | Supabase project URL | `https://<ref>.supabase.co` → **[REDACTED]** | `/api/decode` |
| `SUPABASE_SERVICE_ROLE_KEY` | Service-role key, **server only** | JWT → **[REDACTED]** | `/api/decode` |
| `PUZZLE_ANSWERS` | Comma-separated answers, one per stage (4) | `a,b,c,d` → **[REDACTED]** | `/api/decode` |
| `VERCEL_OIDC_TOKEN` | Written by Vercel CLI (`vercel env pull`) | → **[REDACTED]** | Vercel tooling |
| `NEXT_PUBLIC_SITE_URL` | Optional override of public origin (previews) | `https://my-preview.vercel.app` | `src/lib/site.ts` (default `https://alaafayyad.vercel.app`) |
| `BOTID_DEV_BYPASS` | Optional dev-only: `HUMAN` (default) / `BAD-BOT` / `GOOD-BOT` | `BAD-BOT` | `src/lib/botid.ts` |

Without `RESEND_API_KEY` the forms 500; without Supabase vars `/api/decode` 500s (`getSupabase()` throws). The rest of the site works.

### Setup / seed / migrations
- **No migrations or seed files in this repo.** The Supabase schema (tables `puzzle_theories`, `puzzle_state` (row `id=1` must exist), `puzzle_stage_solves`) was "shared in chat" per the `.env.local` comment — **not in the repo**. Only the TS shape exists in `src/lib/supabase.ts:6-25`.

---

## 4. FOLDER & FILE STRUCTURE

(Excluding `node_modules`, `.git`, `.next`.)

```
.
├── .claude/settings.local.json     # Claude Code local permissions (globally git-ignored, not in repo)
├── .env.local                      # secrets (git-ignored) — names in §3
├── .eslintrc.json                  # legacy ESLint config (ignored by flat config / ESLint 10) 
├── .github/workflows/ci.yml        # CI: tsc, lint, test, audit, build, deploy to Vercel
├── .gitignore                      # node_modules, .next, .env*, .vercel, *.zip, .DS_Store
├── .qodo/{agents,workflows}/       # empty dirs from Qodo tool
├── .vercel/repo.json               # Vercel project link (git-ignored)
├── AGENTS.md / CLAUDE.md           # "This is NOT the Next.js you know" — read node_modules/next/dist/docs/ first
├── README.md                       # create-next-app boilerplate + live URL + CI badge (stale: mentions pages/index.tsx, /api/hello)
├── PROJECT_REPORT.md               # this file
├── conceptdidereference.html       # static HTML reference mock of the workspace design (imports Google Fonts; not part of app)
├── eslint.config.mjs               # active flat ESLint config
├── jest.config.js / jest.setup.js  # Jest + ts-jest + jsdom; matchMedia shim
├── __mocks__/{fileMock,analyticsMock}.js
├── __tests__/{Legal,Navbar,workspace}.test.tsx
├── next.config.js                  # headers/CSP, withBotId, (commented-out) redirect   ← MODIFIED, uncommitted
├── next-env.d.ts, tsconfig.json
├── tsconfig.tsbuildinfo            # build cache (276 KB) — TRACKED in git by mistake (not in .gitignore)
├── vercel.json                     # {"installCommand":"npm install --include=dev"}
├── package.json / package-lock.json
├── public/
│   ├── Alaa_Fayyad_CV.pdf          # CV (linked from About + terminal `resume`)
│   ├── favicon.png / favicon.ico / icon-512.png / manifest.json
│   ├── portfolio_screen.png        # OG/Twitter image (1360×642) + project image
│   ├── happidoo.png, fattoura_cover.svg, 3adasa.png   # project images (see bug: data points to /3adasa_cover.png)
│   └── logo.png, logo_2.png, happidoo_screen.png, file/globe/next/vercel/window.svg  # UNREFERENCED in src
└── src/
    ├── data/portfolio.ts           # projects[], experiences[], skillCategories[] (bilingual content)
    ├── messages/{en,ar}.json       # UI strings; 76 keys each, identical key sets (verified)
    ├── hooks/useTranslation.ts     # global-store locale hook
    ├── hooks/useTheme.ts           # light/dark hook (classic only)
    ├── instrumentation-client.ts   # initBotId({protect:[contact,quote POST]})
    ├── lib/
    │   ├── site.ts                 # SITE_URL, titles, OG image, author constants
    │   ├── jsonLd.ts               # schema.org @graph (Person, WebSite, CreativeWork[])
    │   ├── security.ts             # escapeHtml, field, headerField, sanitizeDisplayName, isSameOrigin, safeIp, rateLimit
    │   ├── botid.ts                # botIdOptions (dev bypass)
    │   ├── supabase.ts             # server-only service-role client + Database type
    │   ├── track.ts                # logEvent/logEventOnce → @vercel/analytics
    │   ├── terminal.ts             # pure command engine for hero terminal
    │   ├── scroll.ts               # smoothScrollTo (Lenis or rAF fallback)
    │   └── fixBugs.ts              # 6 broken-HTML challenges for /fix
    ├── pages/
    │   ├── _app.tsx                # next/font (Inter, JetBrains Mono, Cairo) + font CSS vars
    │   ├── _document.tsx           # 809 lines: no-flash theme script + ALL global CSS (design tokens, classic styles)
    │   ├── index.tsx               # "/" → <WorkspaceShell/> + SEO head
    │   ├── classic.tsx             # "/classic" → full classic page
    │   ├── robots.txt.ts, sitemap.xml.ts   # SSR-generated
    │   └── api/{contact,quote,decode}.ts
    └── components/
        ├── workspace/              # "/" design
        │   ├── WorkspaceShell.tsx  # root: reducer, keyboard nav, layout
        │   ├── state.ts            # pure reducer (open/activate/close/reorder/step)
        │   ├── files.ts            # WS_FILES registry (5 "files")
        │   ├── meta.ts             # derived stats + pseudoHash
        │   ├── {TitleBar,Sidebar,TabBar,FilePane,Minimap,StatusBar,Code}.tsx, cx.ts
        │   ├── workspace.module.css# 642 lines, scoped CSS module, Catppuccin palette
        │   └── files/{About,Skills,Projects,Experience,Contact}File.tsx
        ├── site/                   # classic-only: SiteNav, BootOverlay, TerminalHero, DecodePuzzle, FixChallenge, Modal, Legal
        ├── deck/{ScreenFrame,SectionEyebrow}.tsx   # classic section wrapper + "01 |" label
        ├── About/Skills/Projects/Experience/Contact/Footer.tsx   # classic sections (accept `bare` prop)
        ├── SmoothScroll.tsx        # Lenis + GSAP ticker (classic)
        └── Navbar.tsx              # DEAD (only imported by __tests__/Navbar.test.tsx)
```

---

## 5. ARCHITECTURE

Single Next.js (Pages Router) app on Vercel. No separate backend/worker. Three API routes run as Node serverless functions.

```mermaid
flowchart LR
  subgraph Browser
    I["/ index.tsx → WorkspaceShell"]
    C["/classic → BootOverlay/TerminalHero/Sections"]
    B[BotID client script<br/>instrumentation-client.ts]
  end
  subgraph "Next.js on Vercel"
    D[_document.tsx global CSS + theme script]
    A1[/api/contact/]
    A2[/api/quote/]
    A3[/api/decode/]
    R[robots.txt, sitemap.xml SSR]
  end
  I -->|fetch POST| A1 & A2
  C -->|fetch POST| A1 & A2
  C -->|":wq" → DecodePuzzle| A3
  B -. proof-of-human headers .-> A1 & A2
  A1 & A2 -->|resend.emails.send| Resend[(Resend)]
  A1 & A2 -->|dns.resolveMx| DNS[(DNS)]
  A3 -->|service-role| SB[(Supabase)]
  I & C -->|track()| VA[(Vercel Analytics)]
```

### Key flows

**1. Page load `/`.** `_document.tsx` injects the no-flash theme script + global `<style>` → `_app.tsx` wraps in font-variable div → `index.tsx` renders `<Head>` SEO + `<WorkspaceShell/>` + `<Analytics/>` + `<SpeedInsights/>`. `WorkspaceShell` uses `useReducer(workspaceReducer, WS_FILE_IDS, initWorkspace)` (all 5 tabs open, first active), sets `document.body.style.overflow='hidden'`, renders `FilePane`s for open tabs (active = visible, previous = `leaving` for 340 ms slide).

**2. Locale.** `useTranslation()` keeps a module-level `globalLocale` + a `Set` of listeners; reads `localStorage['lang']` on mount; `toggleLocale()` flips + notifies all. `isRTL` drives `dir`. Pages set `<html dir/lang>` in `useEffect`.

**3. Contact/quote submit.** `ContactFile.tsx` (workspace) or `Contact.tsx` (classic) → `fetch('/api/contact'|'/api/quote', POST JSON)` → handler: method check → `isSameOrigin` → `checkBotId` → rate limit (5/60 s per IP, in-memory) → `field()/headerField()` trim+cap → email format + disposable-domain list + `dns.resolveMx` → `resend.emails.send` with HTML-escaped body → `{success:true}`. Client shows success/error for 4 s then resets.

**4. Terminal (classic).** `TerminalHero` auto-types an intro, then a real `<input>`; `runCommand(raw, ctx)` (pure, `lib/terminal.ts`) returns lines + optional action (`open` link / `scroll` / `overlay`). `:wq` → overlay `decode` → `DecodePuzzle` modal.

**5. /decode.** Modal GET `/api/decode` → current stage + latest 300 theories for that stage. POST `{guess}` → rate limit 1 per 25 s per IP per stage → `judge()` (whole-word regex vs `PUZZLE_ANSWERS[stage-1]`, then `CLOSE_KEYWORDS`) → insert into `puzzle_theories` → if correct, advance `puzzle_state.current_stage` and stamp `stage_solved_at`. State is **global** (all visitors share one puzzle).

**6. Analytics.** `lib/track.ts` → `track(name,{sessionId,...})`; per-tab random UUID in `sessionStorage['sid']`; honours Do-Not-Track; failures swallowed.

### Patterns / conventions
- Pure logic split from UI (`state.ts`, `terminal.ts`, `security.ts`, `meta.ts`).
- Data-driven: all copy lives in `portfolio.ts` + `messages/*.json`; workspace stats are *derived* (`meta.ts`).
- Classic sections take `bare` prop (render content only; `ScreenFrame` supplies header/anchor id).
- Hand-rolled i18n (no library). Hand-rolled theming via CSS custom properties on `[data-theme]`.

---

## 6. FEATURES

### 6.1 Workspace homepage (`/`)
- **User sees:** IDE chrome; 5 tabs (`about.tsx`, `skills.json`, `index.tsx` (projects), `experience.log`, `contact.ts`); click sidebar/minimap to open; × or middle-click closes; drag tabs to reorder (native HTML5 DnD); ←/→ arrow keys step tabs (ignored while typing in form fields); EN/عربي toggle in statusbar; links to `/classic`.
- **Files:** `WorkspaceShell.tsx`, `state.ts`, `files.ts`, `TabBar.tsx`, `Sidebar.tsx`, `Minimap.tsx`, `StatusBar.tsx`, `TitleBar.tsx`, `FilePane.tsx`, `Code.tsx`, `workspace.module.css`, `files/*File.tsx`.
- **Internals:** Reducer with `openTabs`, `activeId`, `mru`; closing the active tab activates most-recently-used open tab. Minimap bars use `Math.random()` inside `useMemo`.
- **Limitations:** No theme toggle on `/` (always dark Catppuccin). No Legal/Privacy/Terms links on `/` (Legal is only in classic `Footer`) — yet the site collects analytics + form data. Skill proficiency `level` is never displayed anywhere. No terminal/decode on `/`. Mobile: grid collapses at ≤900px (`workspace.module.css:101`).

### 6.2 Classic page (`/classic`)
- Flow: `BootOverlay` (~2.15 s fixed timer) → `SmoothScroll` (Lenis+GSAP) + `SiteNav` (scroll-spy, theme + lang toggles, hamburger drawer) → `TerminalHero` → `ScreenFrame` sections (About, Skills, Projects carousel, Experience timeline, Contact) → `Footer` (+`Legal` modals, scroll-to-top).
- `About.tsx` stat values are **hardcoded** (`3+ years`, `10+ technologies`, `2 disciplines` at `About.tsx:71-73`) whereas the workspace derives them.
- `Footer.tsx` scroll-to-top uses its own rAF easing, ignoring Lenis.

### 6.3 Interactive terminal (`lib/terminal.ts`, `site/TerminalHero.tsx`)
Commands: `help, whoami, about, skills|ls skills, projects|ls projects, experience, contact, email, github, linkedin, whatsapp, resume|cv, clear|cls, ls, sudo…, echo …, date, hi|hello|hey, joke, :wq`. History via ↑/↓ (max 50). Unknown → `command not found`. Hidden: `:wq` (not in `help`). `/fix` is commented out. Each command is logged to analytics (lower-cased, ≤80 chars). Contact info duplicated as constants in `terminal.ts:26-31`.

### 6.4 Contact & Quote forms
- Two modes (message / quote) in both designs; same payload shapes: message `{name,email,subject,message}`, quote `{name,email,projectType,budget,timeline,details}`.
- Server validation described in §5 flow 3 and §8. Duplicate code: `validateEmail` is copy-pasted in `contact.ts` and `quote.ts`.
- Workspace form uses free-text inputs for project type/budget/timeline; classic uses option lists (e.g. budgets `Under $200 … $1,000+`).
- Limitation: `to:` address hard-coded; sender is Resend's sandbox `onboarding@resend.dev` (Resend restricts this sender to the account owner's address — works only because `to` is the owner).

### 6.5 /decode puzzle
Described in §5/§8. Client: `DecodePuzzle.tsx` (riddle text for all 4 stages is in client source; answers are server-only). Optimistic theory insertion with rollback; client cooldown 25 s; typing `exit` closes. Limitations: not BotID-protected; in-memory rate limit per instance; stage advance is a read-modify-write without a transaction (two simultaneous correct guesses could both advance — benign); riddle text is public in the bundle.

### 6.6 /fix challenge (disabled)
`FixChallenge.tsx` + `lib/fixBugs.ts` (6 bugs). Edits HTML in a textarea, previews in `<iframe sandbox="allow-scripts" srcDoc>`, tests via `postMessage` (checks `e.source === iframe.contentWindow`). Unreachable: command commented out.

### 6.7 Theme (classic)
`useTheme` + inline `NO_FLASH_SCRIPT` in `_document.tsx` set `<html data-theme>` from `localStorage['theme']` or OS preference.

### 6.8 Legal modals (classic footer)
`Legal.tsx` → two `Modal`s (Privacy, Terms) whose text lives in `messages/*.json` `legal.*`; `LAST_UPDATED = '2026-07-14'` (`Legal.tsx:9`, deliberately fixed). `Modal.tsx`: portal, focus trap, ESC, scroll lock (stops Lenis), `data-lenis-prevent` on scroll region. Tested.

### 6.9 SEO
`jsonLd.ts` @graph; OG/Twitter tags in both pages; `robots.txt` (Disallow `/api/`), `sitemap.xml` (`/`, `/classic`, hreflang alternates, `lastmod`=today); `manifest.json`; canonical per page.

---

## 7. DATA MODEL

### Supabase (external; schema NOT in repo — reconstructed from code)
`src/lib/supabase.ts:6-25`:
```ts
puzzle_theories: { id:number; created_at:string; content:string; stage:number; is_correct:boolean; visitor_key:string|null }
puzzle_state:    { id:number; current_stage:number; stage_solved_at:Record<string,string>; updated_at:string }
```
- `puzzle_state` must contain row `id = 1` (`decode.ts:45`). `current_stage > 4` ⇒ completed.
- `puzzle_theories` is insert-only from the API: `{content, stage, is_correct}`; `visitor_key` is never written by code. Guesses are stored **verbatim, unmoderated, and shown publicly** to all visitors.
- `.env.local` comment also mentions `puzzle_stage_solves` — **not referenced by any code**.
- Indexes/constraints/RLS: unknown **(unverified)**. Service-role key bypasses RLS.

### Static content types (implicit, `src/data/portfolio.ts`)
```ts
projects[]  { id:number; title; titleAr; description; descriptionAr; image; imageAlt; imageAltAr;
              tags:string[]; category:'web'; live:string; github:string; featured:boolean; color:string }   // 4 items (ids 3,4,1,2)
experiences[] { role; roleAr; company; companyAr; period; periodAr; description; descriptionAr; tech:string[]; type:'full-time' }  // 3 items
skillCategories[] { key:'frontend'|'backend'|'design'|'databases'|'devops'; skills:{name:string; level:number}[] }
```
`color` (Tailwind-style gradient string) is unused by the single-accent UI. `type` only has `'full-time'` values though `Experience.tsx` maps a `'freelance'` label too.

### Other types
- `WorkspaceState/Action` (`workspace/state.ts`), `WsFile` (`workspace/files.ts`), `Command/Action/TermContext` (`lib/terminal.ts`), `FixBug` (`lib/fixBugs.ts`), `EventProps` (`lib/track.ts`).
- Translation shape = `typeof en` (`useTranslation.ts:6`); `ar.json` must keep identical keys (not type-enforced — `messages[locale]` is typed as `Messages` so TS *would* flag a missing key only if JSON import types differ).

---

## 8. API

All are Pages-Router handlers in `src/pages/api/`. No auth. Common guards from `src/lib/security.ts`.

| Method | Path | Handler |
|---|---|---|
| POST | `/api/contact` | `src/pages/api/contact.ts` |
| POST | `/api/quote` | `src/pages/api/quote.ts` |
| GET, POST | `/api/decode` | `src/pages/api/decode.ts` |
| GET | `/robots.txt` | `src/pages/robots.txt.ts` (getServerSideProps) |
| GET | `/sitemap.xml` | `src/pages/sitemap.xml.ts` (getServerSideProps) |

### POST `/api/contact`
Body: `{name≤100, email≤254, subject≤150 (CR/LF stripped), message≤5000}` — all required.
Order: 405 non-POST → 403 `isSameOrigin` fails → 403 `{error:'Access denied'}` if `checkBotId(botIdOptions).isBot` → 429 if >5 req/60 s per IP → 400 `All fields are required` → 400 email errors (`Invalid email format` / `Please use a real email address` (17-domain blocklist) / `Email domain does not exist` / `Email domain could not be verified`) → Resend send → `200 {success:true}` or `500 {error:'Failed to send email'}`.
```ts
await resend.emails.send({ from: `${sanitizeDisplayName(name)} <onboarding@resend.dev>`,
  to: 'alaafayyadp1@gmail.com', replyTo: email, subject: `[Portfolio] ${subject}`, html: /* escapeHtml everywhere */ });
```

### POST `/api/quote`
Body: `{name, email, details}` required; `projectType≤100, budget≤100, timeline≤100` optional. Same guards; `400 {error:'Required fields missing'}`; subject `[Quote Request] <projectType|New Project> — <name>`.

### GET `/api/decode`
Rate limit 20/10 s per IP. Returns `{currentStage, completed, completedAt, totalTheoryCount, theories:[{id,created_at,content,stage}]}` (≤300 newest of current stage; empty list when completed). 500 on Supabase error.

### POST `/api/decode`
Body `{guess≤500}`. Same-origin check; no BotID. Rate limit **1 per 25 s per IP per stage** → 429. Response: `{verdict:'incorrect'|'close', theory}` or `{verdict:'correct', theory, stage, nextStage|null, completed, theoryCountAtSolve, totalTheoryCount}`. If already complete → `200 {verdict:'correct', completed:true}`. 405 otherwise with `Allow: GET, POST`.

### External calls
Resend (`resend.emails.send`), Supabase (REST via supabase-js), DNS MX (`dns.resolveMx`), BotID verification (`checkBotId`), Vercel Analytics beacon (client).

---

## 9. FRONTEND

### Routes
`/` workspace; `/classic` classic; `/robots.txt`; `/sitemap.xml`. (No 404/500 custom pages.)

### Hierarchy
```
/  index.tsx
 └ WorkspaceShell
    ├ TitleBar
    ├ Sidebar (files[], link → /classic)
    ├ TabBar (drag/drop) ; FilePane[] → files/{About,Skills,Projects,Experience,Contact}File
    ├ Minimap
    └ StatusBar (lang toggle, link → /classic)

/classic  classic.tsx
 ├ BootOverlay → SmoothScroll → SiteNav
 ├ TerminalHero ─ DecodePuzzle(Modal) , FixChallenge(Modal)
 ├ ScreenFrame(1..5) → SectionEyebrow + About|Skills|Projects|Experience|Contact (bare)
 └ Footer → Legal → Modal×2
```

### State management
No library. `useReducer` (workspace tabs), module-level pub/sub for locale (`useTranslation`), `useState` elsewhere; `localStorage`: `lang`, `theme`; `sessionStorage`: `sid`, `sid:once`, `fix-last-bugs`.

### Styling
- **Global CSS is inline** in `src/pages/_document.tsx` (single `<style dangerouslySetInnerHTML>`; tokens `--bg --text --text-muted --border --accent …`, `:root,[data-theme="dark"]` / `[data-theme="light"]`; classes `.snav*`, `.term-*`, `.boot2*`, `.screen-*`, `.modal-*`, `.legal-*`, `.proj-*`, `.decode-*`, `.fix-*`). There is no `globals.css`.
- **Workspace** uses the CSS Module `workspace.module.css` with its own palette scoped on `.app` (not the global tokens). Uses `cx()` helper.
- Classic section components use heavy **inline `style={{}}`** objects plus global classes `.glass`, `.reveal/.revealed`, `.btn-primary`, `.btn-outline`.
- Fonts: `next/font/google` Inter (`--font-body`), JetBrains Mono (`--font-mono`), Cairo (`--font-arabic`). Never reference font names directly; use the CSS vars.
- Global `* { user-select: none }` in `_document.tsx:35-38` — affects the whole site including form fields (Safari may block typing in inputs with `-webkit-user-select:none` **(unverified)**).

### Forms / validation
Native `required`/`type="email"`; server does the real validation. Status machine `idle|sending|success|error`.

### Navigation
Workspace: tab state only (no URL changes/hash). Classic: `smoothScrollTo(id)` (Lenis) + IntersectionObserver scroll-spy.

---

## 10. AUTH & SECURITY

- **No auth, sessions, roles, or protected routes.** All endpoints are public.
- **Security headers** (`next.config.js`) on every path except BotID's prefix `149e9513-01fa-4fb0-aad4-566afd725d1b`: CSP (`default-src 'self'`; `script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com`; `style-src 'self' 'unsafe-inline'`; `connect-src 'self' https://va.vercel-scripts.com https://vitals.vercel-insights.com`; `img-src 'self' data:`; `frame-ancestors 'none'`; `object-src 'none'`; `upgrade-insecure-requests`…), `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, HSTS 2y + preload, `Permissions-Policy` (camera/mic/geo off), `poweredByHeader:false`.
- **Bot protection:** BotID on `/api/contact` & `/api/quote` only (client registered in `src/instrumentation-client.ts`, server `checkBotId`). Dev bypass is ignored in production.
- **Input handling:** all email HTML is built with `escapeHtml`; subject/display-name stripped of CR/LF/`<>"`.
- **Concerns noticed:**
  1. Rate limiter is per-instance in-memory (`security.ts:87`) — easily bypassed on serverless. Documented in the code comment.
  2. `/api/decode` has no BotID, and its content is public: anyone can post arbitrary text that other visitors see (stored XSS is avoided because React escapes, but moderation/abuse is possible). 
  3. `isSameOrigin` allows requests with neither Origin nor Referer (curl).
  4. `safeIp` trusts the first `x-forwarded-for` entry; on Vercel that header is platform-set, elsewhere spoofable **(unverified for hosting)**.
  5. Owner email, WhatsApp number (`+961 3 748 496` via `wa.me/9613748496`), appear hardcoded in source in several places (public by design).
  6. CSP requires `'unsafe-inline'` scripts/styles (acknowledged in comment).
  7. `.env.local` contains `VERCEL_OIDC_TOKEN` and service-role key; ensure never committed (git-ignored — verified).
  8. `FixChallenge` iframe uses `sandbox="allow-scripts"` (no `allow-same-origin`) — safe; messages validated by `e.source`.
  9. CI runs `npm audit --audit-level=high` and fails on findings.

---

## 11. CONFIGURATION

| File | Controls |
|---|---|
| `package.json` | scripts, deps, `overrides` (see §2) |
| `next.config.js` | `reactStrictMode:true`, `poweredByHeader:false`, `images.formats avif/webp`, `headers()` (CSP etc.), wrapped by `withBotId()`. **Redirect `/`→`/classic` is commented out (uncommitted).** |
| `tsconfig.json` | target ES2017, `strict:false`, `strictNullChecks:true`, `moduleResolution:bundler`, `jsx:react-jsx`, path alias `@/*` → `./src/*` (alias not used in code — all relative imports) |
| `eslint.config.mjs` | flat config: js recommended + typescript-eslint recommended + Next plugin rules; turns **off** `no-unused-vars`, `no-explicit-any`, `no-empty`; ignores `.next`, `node_modules` |
| `.eslintrc.json` | legacy `next/core-web-vitals`, `next/typescript` — redundant/ignored under flat config |
| `jest.config.js` | jsdom; ts-jest for ts/tsx and `.mjs` (for lenis ESM); `transformIgnorePatterns` allows `lenis`; mapper: css → `__mocks__/fileMock.js`, `lenis` → `dist/lenis.mjs`, `@vercel/analytics` → `__mocks__/analyticsMock.js` |
| `jest.setup.js` | `matchMedia` shim |
| `vercel.json` | `installCommand: npm install --include=dev` |
| `.github/workflows/ci.yml` | on push/PR to `main`: checkout → Node 22 + npm cache → `.next/cache` cache → `npm ci` → `npx tsc --noEmit` → `npm run lint` → `npm run test` → `npm audit --audit-level=high` → `npm run build` → **deploy (push to main only)** `npx vercel --prod --yes` |
| `public/manifest.json` | PWA manifest (`display: standalone`, bg/theme `#101418`; note `index.tsx` sets `theme-color #1E1E2E`) |
| `.gitignore` | `node_modules/ .next/ .env .env.local .DS_Store *.zip .vercel .env*` |

No Prettier, no Husky/lint-staged, no Dockerfile (CI Docker step was removed in `1beaae8`), no Tailwind/PostCSS config.

---

## 12. TESTS

Run: `npm test` (35 tests, all passing as of 2026-11-05, ~24 s).

| File | Covers |
|---|---|
| `__tests__/workspace.test.tsx` | `workspaceReducer` (init, activate, close/MRU, open, step, reorder, `moveInOrder`), `WorkspaceShell` integration (tabs, close via ×, reopen via sidebar, arrow keys, minimap click), RTL render |
| `__tests__/Legal.test.tsx` | `Legal` modals: dialog semantics, focus management, ESC, Tab trap, scroll lock, Lenis wheel behaviour, privacy/terms copy |
| `__tests__/Navbar.test.tsx` | `Navbar` (dead component!) renders logo/links/hire button/lang toggle; `Footer` renders `arrowUp` button only |

**Not tested:** all API routes (`contact`, `quote`, `decode`), `security.ts` helpers, `terminal.ts` engine, `TerminalHero`, `DecodePuzzle`, `FixChallenge`, classic sections, `SiteNav`, `useTranslation`/`useTheme`, `jsonLd`, `sitemap/robots`, i18n key parity, any E2E. Coverage not measured (no coverage config).

---

## 13. CODE CONVENTIONS

- File naming: PascalCase components; camelCase hooks/libs; workspace "files" end with `File.tsx`; CSS Module class names camelCase and accessed as `styles.x`.
- Components are default exports; props typed inline; `'use client'` is **not** used (Pages Router).
- Relative imports (no `@/` alias in practice).
- Comments are long and explain *why* (accessibility, Lenis quirks, security). Match that density when adding code.
- i18n: add the key to **both** `en.json` and `ar.json`; data entries need `…Ar` siblings; components choose via `isRTL ? x.ar : x`.
- Errors: API routes return `{error: string}` JSON with proper status; server errors logged with `console.error('[tag] …')`; client shows generic message. Supabase calls always check `error` explicitly.
- Client analytics: only via `logEvent/logEventOnce`; never include PII.
- Accessibility: roles/aria on tabs, dialogs, logs; `prefers-reduced-motion` honored.
- Styling: new global styles go in the `_document.tsx` string; workspace styles in the CSS module. Use design-token variables, not raw hex (classic). Single-accent rule: no new hues in classic.
- Lint is lenient (`any`, unused vars off); `strict` TS is off.

---

## 14. GIT CONTEXT

- Branch: `main` (tracking `origin/main`). Other remote branches: `origin/ci/remove-docker-build`, `origin/seo/cwv-favicon-manifest-speedinsights`.
- Git user: AlaaFayyad.
- **Uncommitted:** `M next.config.js` — comments out the `redirects()` that sent `/` → `/classic` (302).
- Last 20 commits:
```
8fccaec 2026-09-23 mod
4a90ed9 2026-09-01 mod
e7c78c4 2026-08-28 mod:
a155a3c 2026-08-28 mods
1019b3b 2026-07-29 mod
f642a12 2026-07-29 mod
8119ecf 2026-07-15 mod
bb75f81 2026-07-15 perf(seo): shrink favicons, add web manifest + Speed Insights
1beaae8 2026-07-15 ci: drop dead Docker build step from build-and-check
7b420d4 2026-07-14 mods
4b46e2d 2026-07-02 mod
8c20910 2026-06-30 mod
fc3b6ed 2026-06-30 mods
35d7630 2026-06-30 mods
d218e37 2026-06-29 mods to v2
03ccd86 2026-06-29 updatwd portfolio
a725c97 2026-06-12 fix
3277177 2026-06-12 add project
f4ec940 2026-06-08 add projects
fe0208e 2026-06-08 fix
```
(Commit messages are mostly uninformative.)
- **TODO/FIXME/HACK/XXX:** none found in source. Related markers: `// BUG:` comments inside `src/lib/fixBugs.ts` are intentional challenge content, not real bugs. Large blocks of commented-out code: `src/lib/terminal.ts` (jokes, `pwd`, `/fix`, lines ~162-228), `src/components/About.tsx:74,89-94`, `Contact.tsx:154`, `next.config.js:42-50`.

---

## 15. PROBLEMS & RISKS

**Likely bugs / broken**
1. **Redirect state**: committed HEAD redirects `/`→`/classic`; working tree removes it. Committing this changes production landing page. Sitemap lists both URLs and canonical on `/` points to itself.
2. **Missing image**: `src/data/portfolio.ts:24` → `/3adasa_cover.png` doesn't exist (`public/3adasa.png` does). Also feeds `jsonLd.ts` image.
3. **Dead `/fix`**: component, 6-bug data, CSS, mount in `TerminalHero` all shipped but unreachable.
4. **Dead `Navbar.tsx`** + its test (tests a component not used on any page; test asserts `'ALAA FAYYAD'`/"Let's connect"). Real nav is `site/SiteNav.tsx`, which is untested.
5. Workspace `/` lacks Privacy/Terms links although the Privacy text exists (classic footer only).
6. `README.md` is create-next-app boilerplate with wrong paths (`pages/index.tsx`, `/api/hello` don't exist).

**Duplication / dead code**
- `validateEmail` + IP-extraction duplicated in `contact.ts`/`quote.ts` (and IP code in `decode.ts`); email HTML templates nearly identical.
- Two parallel implementations of every section (classic components vs `workspace/files/*File.tsx`), incl. two contact forms.
- `smoothScroll` re-implemented in `Navbar.tsx`, `Footer.tsx`, `lib/scroll.ts`.
- Unused assets: `public/logo.png`, `logo_2.png` (~1.7 MB), `happidoo_screen.png`, `file/globe/next/vercel/window.svg`.
- `tsconfig.tsbuildinfo` tracked in git; `conceptdidereference.html` tracked; two ESLint configs; `@/*` alias unused; project `color` field unused; skill `level` unused.
- `postcss` as a runtime dependency; `next` in devDependencies.

**Performance / fragility**
- `_document.tsx` is an 809-line string of global CSS — hard to maintain; cannot be code-split.
- Large unoptimized PNGs in `public/` (e.g. `happidoo.png` 608 KB, `portfolio_screen.png` 232 KB, `3adasa.png` 317 KB); classic uses `next/image` for projects, workspace shows none.
- Workspace `Minimap` random bars → SSR/CSR hydration mismatch risk (`Math.random()` in `useMemo`, rendered under `aria-hidden`) **(unverified at runtime)**.
- Locale hook initial state is `'en'` then switches after mount → flash of English for Arabic users; `<html dir>` set in effect.
- Module-level locale state is not SSR-safe by design (client-only reads) but works since reads happen in effects.
- `rateLimit` Map grows unbounded (no eviction) within an instance.
- Hardcoded About stats in classic can drift from data.
- `about` stat `years shipping` computed from `new Date()` at module load.
- Flat `user-select:none` hurts copying text / maybe form inputs.
- CI deploys and Vercel Git integration may double-deploy **(unverified)**; `npm audit` gate can block deploys on upstream advisories.

**Outdated / pinned**: Using React 18 with Next 16; ESLint 10; `@types/node ^20` vs Node 22. Not audited for CVEs in this session.

---

## 16. MODIFICATION GUIDE

| Change | Touch |
|---|---|
| Edit bio/hero/labels/legal text | `src/messages/en.json` **and** `ar.json` (keep keys identical); hero name/role keys `hero.*` |
| Add/edit project | `src/data/portfolio.ts` `projects[]` (+ `titleAr`, `descriptionAr`, `imageAlt(Ar)`); put image in `public/`. Auto-propagates to classic Projects, workspace ProjectsFile, JSON-LD, project count stat |
| Add/edit job | `portfolio.ts` `experiences[]` (period must contain a 4-digit year — `meta.ts` derives `yearsShipping` from it) |
| Add skill | `skillCategories[]`; new category also needs labels in `messages/*.json` `skills.*` and in `SkillsFile.tsx`/`Skills.tsx` `labels` maps |
| Change colours (classic) | `_document.tsx` tokens `:root` + `[data-theme="light"]` (+ `theme-color` meta in pages, `manifest.json`) |
| Change colours (workspace) | `.app { --… }` at top of `workspace.module.css` |
| Add a workspace "file"/tab | create `workspace/files/XFile.tsx`, add entry to `WS_FILES` in `files.ts` (id/name/icon/language), add any strings to both JSON files; tests assume 5 files |
| Add terminal command | `lib/terminal.ts` `runCommand` (+ `NAV_COMMANDS`/`INFO_COMMANDS` for `help`) |
| Re-enable `/fix` | uncomment `lib/terminal.ts:174-175` |
| Make `/` the homepage in prod | commit the `next.config.js` change (or delete the commented block) |
| Make `/classic` the homepage again | restore the `redirects()` in `next.config.js` |
| Change recipient / sender | `contact.ts` & `quote.ts` (`to`, `from`); set up a verified Resend domain first |
| Change site URL / SEO | `lib/site.ts` (+ `NEXT_PUBLIC_SITE_URL`), `jsonLd.ts`, `index.tsx`/`classic.tsx` heads, `sitemap.xml.ts` |
| Add analytics event | `lib/track.ts` `logEvent` (no PII) |
| Add API route | `src/pages/api/x.ts`; reuse `security.ts` guards; add path to `initBotId` `protect` list in `instrumentation-client.ts` if it needs BotID |
| Tighten CSP for a new third party | `next.config.js` `csp` array |

**Couplings**
- `en.json` ⇄ `ar.json` key parity (no automated check).
- `portfolio.ts` ⇄ `jsonLd.ts`, `meta.ts`, classic + workspace sections.
- `instrumentation-client.ts` protect list ⇄ API routes that call `checkBotId`.
- CSP ⇄ any new script/img/connect origin (will silently break otherwise).
- `BOTID_PATH_PREFIX` constant in `next.config.js` is a fixed value tied to the botid package — do not change.
- `PUZZLE_ANSWERS` order ⇄ `STAGE_COUNT=4` in `decode.ts` and `DecodePuzzle.tsx` ⇄ `STAGE_RIDDLES`/`CLOSE_KEYWORDS`.
- Jest mappers ⇄ ESM-only packages (`lenis`, `@vercel/analytics`); new ESM-only deps need mocks.
- CSS Module class `.app[dir='rtl']` rules ⇄ `dir` attr set by `WorkspaceShell`.

**Dangerous to edit**
- `_document.tsx` (single string; a stray backtick or `${` breaks every page).
- `useTranslation.ts` (global store shared by every component).
- `next.config.js` headers/BotID wrapper (breaking BotID or CSP silently degrades protection).
- `.github/workflows/ci.yml` deploy step (ships straight to production).
- Anything involving `SUPABASE_SERVICE_ROLE_KEY` — never import `lib/supabase.ts` from client code.

---

## 17. OPEN QUESTIONS (for the owner)

1. Should `/` ship as the workspace design? (Uncommitted `next.config.js` change.) Is `/classic` meant to stay long-term?
2. Is the Vercel Git integration also enabled, or does only the GitHub Actions job deploy?
3. Is `/fix` meant to be revived or deleted? Same for `Navbar.tsx` and its test.
4. Where is the Supabase schema (tables, RLS, indexes, `puzzle_stage_solves`)? Should it be added to the repo as SQL?
5. Is the `3adasa_cover.png` image supposed to exist (rename of `3adasa.png`)?
6. Do you want Privacy/Terms links on the workspace homepage?
7. Intended Resend sender domain (currently sandbox `onboarding@resend.dev`)?
8. Should `.claude`, `.qodo`, `tsconfig.tsbuildinfo`, `conceptdidereference.html` be handled/ignored in git?
9. Is Arabic copy reviewed by a native speaker? (not verifiable from code)
10. `next build` was not run here — is the production build currently green?
