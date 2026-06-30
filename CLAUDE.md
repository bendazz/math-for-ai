# Course-building playbook (read me first)

This file captures *how* this interactive course was built so the same approach
can continue in a **new course folder**. Copy this file (and the code skeleton
listed at the bottom) into the next course's folder; Claude Code auto-loads
`CLAUDE.md`, so the new session starts already knowing the conventions below.

## What we're building
An **interactive online textbook** delivered as a **static web app** — plain
HTML/CSS/JS, **no build step**, viewable via a static server (VS Code Live
Server) and deployable free to **GitHub Pages** (`index.html` at repo root).

## Audience & pedagogy
- Students **fresh out of high school, no calculus**. Mixed motivation (some
  fulfilling a gen-ed requirement, some future AI majors).
- Teach **genuine math**, but always **grounded in building/understanding AI**.
- The instructor demos **Langflow** (a no-code AI builder) so students see ideas
  run; **students do not code**.
- Favor **lots of visualizations** (interactive canvas/SVG widgets) and **lots
  of practice problems**. Pure-math problems are welcome alongside applied ones.

## Working style
- Build **freely and organically** — NO fixed syllabus committed up front, NO
  mandatory per-section template. Each ~50-min class ≈ one section.
- **No coverage pressure.** Optimize for **depth** and following the interesting
  thread; the instructor stops when there's enough and unreached topics move to
  another course. Never rush breadth.
- Decide the next section *with* the instructor; discuss feasibility before
  building labs.

## Tech architecture (no build step)
- `index.html` loads, in order: KaTeX (CDN), `styles.css`, `toolkit.js`,
  `sections/manifest.js`, each `sections/<id>.js`, then `app.js`.
- `sections/manifest.js` = `window.SECTIONS` array — the ONLY place section
  order/grouping is set. Group sections in the sidebar via a shared `group`.
- Each `sections/<id>.js` registers
  `window.SectionContent["<id>"] = { title, html, onMount(root) }`.
  `html` is a string; `onMount` wires interactivity (canvas, sliders, uploads).
- `toolkit.js` = `window.Toolkit`: `callout(html,{type,label})`,
  `problem(q,sol)` + `resetProblems()` (click-to-reveal, revealed via delegation
  in app.js), `widget(title,inner)`, `fitCanvas(canvas,cssHeight)` (HiDPI),
  `probabilityScale()`.
- `app.js` = shell: builds the sidebar from SECTIONS, hash routing (`#id`),
  renders the active section's html, typesets math (KaTeX auto-render), runs
  `onMount`, prev/next pager, mobile sidebar.
- **Add a section** = (1) create `sections/<id>.js`, (2) add a `<script>` tag in
  `index.html`, (3) add a line to `manifest.js`.

## Section conventions
- **No forward lead-ins.** Don't end a section teasing "next we'll…"; the course
  is decided organically, so teasers go stale. End concept sections with a
  "What you learned" recap. (Unscheduled "later" / present-tense motivation is OK.)
- **Concept sections carry no inline problems.** End at "What you learned"; put
  practice in dedicated `*-practice` sections (pure HTML, no onMount, a row of
  `T.problem` click-to-reveal). Labs may include predict-then-reveal problems.
- **Reuse, don't duplicate, hard-won facts** — verify external tool details
  (Langflow components, API model names, library specifics) via web search
  **before** writing a lab; tools change fast.

## Gotchas learned the hard way
- **KaTeX `$`**: app.js pairs `$...$` only within one text node. A lone currency
  `$` isolated in its own cell/sentence renders fine, but a currency `$` sharing
  a text node with real `$...$` math breaks. In problem-heavy sections, **write
  money in words** ("five dollars"), and avoid literal `$` in any data strings.
- **Inequalities in math/HTML**: write `&lt;` / `&gt;` (KaTeX renders them) or use
  words, so a raw `<` is never mis-parsed as an HTML tag. Raw `<` in JS code is
  fine (it's not rendered).
- **Use literal Unicode chars** (→ × · ‖ √ ² …) directly in JS strings, NOT
  `\uXXXX` escapes inside template literals (the escape prints literally there).
- `Math.random()` / `Date` are fine in a section's `onMount` (real browser JS).
- **Data for widgets**: `fetch` a JSON file from `sections/` (works under Live
  Server and Pages via relative paths), or inline it. **Prefer REAL data over
  faked** — e.g. real embeddings generated once by a small script and committed —
  so the page can't accidentally teach something false.

## Verify each section (no Node/browser available locally)
After writing a section, sanity-check the file with a quick script:
- backticks balanced (even count),
- `{}` `()` `[]` net zero (after stripping comments),
- inline-math `$` paired (even, after removing `${…}` interpolations and `$$…$$`),
- display `$$` tokens even,
- no raw `<` in the rendered HTML (only in JS).
Keep a **running progress log in memory** (one entry per section).

## Deployment (GitHub Pages)
- Public repo, Pages = **Build from branch → `main` / `(root)`**. Relative paths
  make it work at the project subpath. First build can take ~5 min; later pushes
  publish in a minute or two. Update cycle: `git add -A && git commit && git push`.
- `.gitignore`: the Python `.venv/` (huge), `__pycache__/`, `.DS_Store`, local
  tool config. Commit any data files the site fetches at runtime.

## To start the next course
1. Copy into the new folder: `index.html` (trim the section `<script>` tags to
   just the shell + your first section), `app.js`, `toolkit.js`, `styles.css`,
   `sections/manifest.js` (emptied to your first section), and this `CLAUDE.md`.
2. Open the new folder, run `claude`, and say what the course is about. This
   playbook auto-loads; we pick up the same way of working.
3. (Optional) Ask Claude to also read the Math-for-AI project's memory notes for
   any extra detail.
