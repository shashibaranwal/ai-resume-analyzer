# AI Resume Analyzer

**Live App:** [https://aicvlizer.vercel.app/upload](https://aicvlizer.vercel.app/upload)

Upload a resume, paste the job you're targeting, and get a scored ATS review back — an overall
score, an ATS compatibility rating, and specific, explained tips across tone, content, structure,
and skills.

Everything runs in the browser against [Puter.js](https://docs.puter.com/), so there is **no backend
to deploy and no API keys to manage**. Auth, file storage, the key-value store, and the LLM call are
all provided by the user's own Puter account.

---

## How it works

```
/upload                                        /resume/:id
   │                                                ▲
   ├─ 1. Upload the PDF to Puter FS                 │
   ├─ 2. Extract the text with pdf.js               │
   ├─ 3. Render page 1 to a PNG (preview)           │
   ├─ 4. Save a record to Puter KV as resume:<uuid> │
   ├─ 5. Ask the LLM for JSON feedback ─────────────┤
   └─ 6. Merge the feedback into the record ────────┘
```

The record stored in Puter KV under `resume:<uuid>` looks like this:

```ts
{
  id: string
  resumePath: string      // path in Puter FS to the original PDF
  imagePath: string       // path in Puter FS to the PNG preview
  companyName: string
  jobTitle: string
  jobDescription: string
  feedback: Feedback | null   // null until the LLM responds
}
```

`Feedback` is defined in [`types/index.d.ts`](types/index.d.ts). The prompt that produces it — and
the exact JSON shape the model is asked for — lives in
[`constants/index.ts`](constants/index.ts) as `prepareInstructions` and `AIResponseFormat`.

### Routes

| Route         | File                     | Purpose                                              |
| ------------- | ------------------------ | ---------------------------------------------------- |
| `/`           | `app/routes/home.tsx`    | Lists past analyses                                  |
| `/auth`       | `app/routes/auth.tsx`    | Puter sign-in, honours a `?next=` redirect            |
| `/upload`     | `app/routes/upload.tsx`  | The form and the whole analysis pipeline              |
| `/resume/:id` | `app/routes/resume.tsx`  | The review page: score summary, ATS card, detail accordion |

## Tech stack

- **[React Router v7](https://reactrouter.com/)** (framework mode, SSR enabled) + **React 19**
- **[Tailwind CSS v4](https://tailwindcss.com/)** via the Vite plugin — shared component classes are
  declared in [`app/app.css`](app/app.css), not scattered across files
- **[Puter.js](https://docs.puter.com/)** for auth, file storage, KV, and AI, wrapped in a
  [zustand](https://zustand.docs.pmnd.rs/) store at [`app/lib/puter.ts`](app/lib/puter.ts)
- **[pdf.js](https://mozilla.github.io/pdf.js/)** (`pdfjs-dist`) for text extraction and PNG rendering
- **TypeScript**, **Vite**

---

## Getting started

### Prerequisites

- **Node.js 20 or newer** (developed on 22.13)
- **npm** (a `package-lock.json` is committed — please don't swap in another lockfile)
- A **[Puter](https://puter.com/)** account to sign in with while testing. It's free, and no API key
  or `.env` file is needed.

### Install and run

```bash
git clone https://github.com/shashibaranwal/ai-resume-analyzer.git
cd ai-resume-analyzer
npm install
npm run dev
```

The app comes up on <http://localhost:5173> (Vite picks the next free port if that one is taken).
On first load you'll be redirected to `/auth` to sign in with Puter, then land on the home page.

To try a full run, go to **Upload Resume**, fill in the job details, drop in a PDF, and submit. The
status line reports each step; when the analysis finishes you're redirected to `/resume/:id`.

### Scripts

| Command             | What it does                                                       |
| ------------------- | ------------------------------------------------------------------ |
| `npm run dev`       | Dev server with HMR                                                |
| `npm run build`     | Production build into `build/`                                      |
| `npm start`         | Serve the production build with `react-router-serve`                |
| `npm run typecheck` | Regenerate route types, then run `tsc --noEmit`                     |

---

## Project layout

```
app/
├── components/          # Presentational pieces
│   ├── Accordion.tsx        # Context-based collapsible sections
│   ├── ATS.tsx              # ATS score card
│   ├── Details.tsx          # Per-category tips, in an accordion
│   ├── FileUploader.tsx     # react-dropzone wrapper
│   ├── Navbar.tsx
│   ├── ResumeCard.tsx       # Home page card, links to /resume/:id
│   ├── ScoreBadge.tsx       # "Strong" / "Good Start" / "Needs Work"
│   ├── ScoreCircle.tsx      # Ring gauge (used on cards)
│   ├── ScoreGauge.tsx       # Half-doughnut gauge (used on the review page)
│   └── Summary.tsx          # Overall score + per-category rows
├── lib/
│   ├── pdf.ts               # PDF → text
│   ├── pdf2img.ts           # PDF page 1 → PNG File
│   ├── puter.ts             # zustand store wrapping window.puter
│   └── utils.ts             # cn, formatSize, generateUUID, parseFeedback
├── routes/              # One file per route, registered in app/routes.ts
├── app.css              # Tailwind theme + shared component classes
└── root.tsx             # Layout, loads the Puter script, calls store init()
constants/               # Dummy resume data + the AI prompt
types/                   # Ambient types: Feedback, Resume, Puter shapes
```

---

## Contributing

Contributions are welcome. Bug fixes, UI polish, and prompt improvements are all useful.

### Workflow

1. Fork the repo and create a branch off `main`:
   ```bash
   git checkout -b fix/score-gauge-alignment
   ```
2. Make your change.
3. Run `npm run typecheck` and `npm run build`. Both must pass — there is no test suite yet, so
   these plus a manual run are the safety net.
4. Manually exercise whatever you touched. If it's anywhere near the analysis pipeline, do one full
   upload → review round trip; a lot of this code only executes in the browser after a real Puter
   sign-in.
5. Open a pull request describing what changed and how you verified it. Screenshots or a short clip
   are appreciated for anything visual.

### Conventions worth knowing

**pdf.js must never be imported at module scope.** SSR is enabled, so any module a route imports is
evaluated in Node — and `pdfjs-dist` touches browser globals like `DOMMatrix` at import time, which
crashes the server with a 500. Both [`app/lib/pdf.ts`](app/lib/pdf.ts) and
[`app/lib/pdf2img.ts`](app/lib/pdf2img.ts) therefore load it lazily inside an async function and
cache the promise. Keep it that way, and apply the same care to any other browser-only library.

**Guard auth redirects on `isLoading`.** The Puter store starts as
`{ isLoading: true, isAuthenticated: false }` and resolves the real auth state asynchronously. A
redirect that only checks `isAuthenticated` will fire on the first render and bounce signed-in users
to `/auth`. Always check `!isLoading && !auth.isAuthenticated`.

**Reach Puter only through the store.** Use `usePuterStore()` rather than `window.puter` directly —
the store handles the "script hasn't loaded yet" case and surfaces errors consistently.

**Style with the shared classes.** Component classes like `.feedback-section`, `.resume-nav`, and
`.score-badge` are declared in [`app/app.css`](app/app.css). Extend that file instead of duplicating
long utility strings, and use the `cn()` helper from `app/lib/utils.ts` when composing conditional
classes.

**Don't trust the model's JSON.** The prompt asks for bare JSON, but models add fences and prose
anyway. Parse LLM output through `parseFeedback()` in `app/lib/utils.ts`, which strips that wrapping
and throws a clear error instead of blowing up mid-render.

### Good first issues

- The home page still renders the hardcoded `resumes` array from `constants/index.ts`, so its cards
  link to ids that don't exist in KV. Switch it to `kv.list('resume:*', true)` to show real analyses.
- There's no way to delete a saved analysis.
- `/upload` has no auth guard of its own, unlike `/` and `/resume/:id`.
- Only page 1 of a PDF is rendered for the preview; multi-page resumes lose the rest.
- The job title input in `app/routes/upload.tsx` reuses the company name's `id` and placeholder.

---

## Deployment

`npm run build` produces a standard React Router SSR build:

```
build/
├── client/    # Static assets
└── server/    # Server-side code
```

`npm start` serves it with `react-router-serve` on port 3000, which is production-ready as-is. Any
host that runs a Node process works — Fly.io, Railway, Render, a plain VPS. Because all the
storage and AI calls happen client-side through the user's Puter account, there are no server-side
secrets to configure.

There is no `Dockerfile` in the repo at the moment; a `.dockerignore` is present if you want to add
one.
