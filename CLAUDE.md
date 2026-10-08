# Analog Gym — working notes for Claude

Offline tutor app for EEE/INSTR F313 (Razavi op amps), built for one student. Vite + React 19 + TypeScript, no backend.
The full original spec is `docs/build-spec.md`. Code comments citing "CLAUDE.md §N" mean that file's §N. Read only the
section you need, never the whole file.

## Token rules (follow strictly)
- **Don't explore.** Use the map below, then `Grep` for the exact symbol. Read files with `offset`/`limit`; most
  content files are 30–55 KB.
- **Don't read these unless the task is about them:**
  - `source/` (PDFs and images; for a lecture PDF read only the pages you need);
  - `study-package/` (a duplicate of source/);
  - `content/inventory.md` (38 KB; grep it for a flag or problem id);
  - `package-lock.json`, `dist*/`, `test-results/`.
- **Run the narrowest check:** `npx vitest run src/physics` or `npx vitest run src/content`, not the whole suite.
  Run Playwright only when the UI changed, and only the relevant spec: `npx playwright test e2e/smoke.spec.ts -g "<name>"`.
  It needs `npx vite build` first; on this Mac run it with `PW_CHROME="/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"`.
- **Keep answers short.** No recaps; report what changed and what was checked.

## Map
| To change… | Edit | Then check |
|---|---|---|
| A formula / any number | `src/physics/*.ts` (pure, tested; the only place maths lives) | `npx vitest run src/physics` |
| A lesson | `src/content/lessons/{foundations,single,diff,handout,late,stability}.ts`; unit order and refs in `src/content/curriculum.ts`; side figures in `src/content/ideaFigures.ts` | `npx vitest run src/content` |
| Glossary / cards | `src/content/glossary.ts`, cards inside each lesson | `npx vitest run src/content` |
| Fixed-bank question | `src/practice/bank*.ts` (find the id with `Grep "bank-t1q1"` etc.; Tutorial 1 + exam in `bankM3.ts`, worked examples `bank.ts`, labs `bankLabs.ts`, chat `bankChat.ts`); group names `bankGroups.ts`; figure-only additions `bankFigures.ts` | `npx vitest run src/content src/physics` |
| Generated problems | `src/practice/generators/*.ts` (each solves twice: direct + step trace) | `npx vitest run src/practice` |
| Circuit figure | `src/circuits/figures*.tsx`, register in `registry.tsx` and `src/app/Gallery.tsx` | `npx playwright test e2e/diagrams.spec.ts` |
| Labs | `src/labs/*.tsx` | smoke spec |
| Pages / routing / progress | `src/app/` (App.tsx routes, store.ts progress, progress.ts) · topic pages `src/learn/TopicView.tsx` | smoke spec |
| Past papers (mid-sems, quizzes, 2024-25 Tut 2) | solvers `src/physics/pyq.ts` (+ `pyq.test.ts` vs the keys), questions `src/practice/bankPyq.ts`; printed crops/keys `src/assets/papers/*.webp` | `npx vitest run src/physics src/content` |
| Concept box, printed crop, fx-991CW keys for older bank items | `src/practice/bankExtras.ts` | `npx vitest run src/content` |
| Lecture explanations (woven doubts + figures) | Flowing text per step: Lec 01–06 `src/content/walkWoven.ts`, Lec 07–17 + settling `walkWoven2.ts` (`[[fig:key]]` markers; no separate doubts boxes); captions `src/content/doubts.ts` (`STRIP_CAPS`, `LESSON_FIGS`); figures `src/assets/doubts/s-*.svg` from `python3 scripts/doubtstrips.py` (calls `doubtstrips6.py`, `doubtstrips2.py`, `towers.py`). Revision sheet Lec 1–8: `node scripts/revision/build.mjs` → `pdf/` | `npx vitest run src/content` |
| Animated lesson Lec 7–12 (video player, past papers with your-turn stops) | `scripts/anim/src/*.js` (engine, lib, data = past-paper frame, l07–l1112, outro); numbers from `scripts/anim/problems.json` (dump of the bank); printed crops `scripts/anim/papers/` | `node scripts/anim/build.mjs a` → `anim-dist/index.html` (Lec 7–12), `build.mjs b` → `anim-dist/lec11-14.html`, `build.mjs c` → `anim-dist/lec06.html` (Lec 6 + foundations: c_intro, c_found, c_lec6, c_q) (Lec 10–14 + frequency/poles from zero: b_intro, freq, l13, l14, b_outro); check `node scripts/anim/shots.mjs <dir> list <file>` and `trytest*.mjs` |
| Lesson voice, pacing, say-it-back drills | `scripts/anim/src/voice.js` (speech text, Voice/Pace/Drill), player hooks in `engine.js`; drill lines per scene in `c_recall.js` (core formulas only). Recorded narration: `node build.mjs c && node tts-dump.mjs c && python3 tts.py c && node build.mjs c` (Kokoro `af_heart`, model in `scripts/anim/.kokoro/`, mp3s in `scripts/anim/audio/mp3/`; only changed lines re-render) | listen to a changed line; flow test plays real audio |
| Your notes pages | `src/content/notes.ts` (Lec 01–08), `notes2.ts` (Lec 09–17, handouts); scans `src/assets/notes/*.webp`; view `src/notes/NotesView.tsx` | `npx vitest run src/content` |
| Last-minute packs / Sprint | `src/content/sprint.ts`, `src/sprint/*`; PDF: Brave `--print-to-pdf` of `#/sprint/print` → `pdf/` | `npx vitest run src/content` |
| Calculator recipes | `src/calc/CalcView.tsx` | smoke spec |
| Styles | `src/styles/tokens.css`, `src/styles/app.css` | screenshot one page |

Commands: `npm run dev` · `npm test` · `npm run typecheck` · `npx vite build --mode single` (→ `dist-single/index.html`, the deliverable).

## Rules that always apply
- Notation exactly as in the student's notes:
  - VGS, Vth, Vov, ID, µnCox, W/L, λ, gm, rO;
  - Av, Ad, ACM, A, β, ε, ωu, τ, CL, Rout, Rup, Rdown;
  - ISS, VISS, VCM, vd, SR.
  The full list is in build-spec §6.
- Every number shown comes from `src/physics` and has a test. Never hard-code an answer.
- Lessons use the 8-step template:
  1. why;
  2. picture;
  3. predict;
  4. idea;
  5. rule;
  6. worked example;
  7. your turn;
  8. lock-in.
  Each step is ≤ 120 words and has a visual. One method everywhere: the master method, STEP A–D (build-spec §5.3).
- Paraphrase Razavi; never copy text or figures. Cite as "Razavi 2nd ed. §x.y".
- Where sources disagree, add a flag to `content/inventory.md` §1 and tell the student. Don't silently pick one.
- Figures: no overlapping labels. In question mode, figures hide numbers that aren't given (`QuestionFigure`).
- Write TeX in TS strings with escaped backslashes (`'\\frac'`). The content lint catches mistakes.
- Focus is **analog only** (U0–U12, L1–L14). The digital half (L15–L38) is frozen unless asked.
- Repo is private (it contains the textbook). Never commit model names. Keep `study-package/` out of edits.
