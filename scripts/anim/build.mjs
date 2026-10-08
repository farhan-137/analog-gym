// Builds the Lec 7–12 animated lesson into one offline HTML file. Run: node scripts/anim/build.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');
const src = (f) => readFileSync(join(here, 'src', f), 'utf8');
const kdir = join(root, 'node_modules', 'katex', 'dist');
let kcss = readFileSync(join(kdir, 'katex.min.css'), 'utf8').replace(/src:url\(fonts\/([^)]+\.woff2)\) format\("woff2"\)(,url\([^)]+\) format\("[a-z]+"\))*/g, (_m, f) =>
  `src:url(data:font/woff2;base64,${readFileSync(join(kdir, 'fonts', f)).toString('base64')}) format("woff2")`);
const problems = readFileSync(join(here, 'problems.json'), 'utf8');
import { readdirSync, existsSync } from 'node:fs';
const papers = Object.fromEntries(readdirSync(join(here, 'papers')).filter((f) => f.endsWith('.webp')).map((f) => [f.replace('.webp', ''), 'data:image/webp;base64,' + readFileSync(join(here, 'papers', f)).toString('base64')]));
const LESSONS = {
  a: { out: 'index.html', title: 'Analog Lab: Lec 7–12', h1: 'Analog Lab · Lectures 7–12', sub: 'Two-stage op amps, gain boosting, boosters, CMFB · your notes, animated, with past papers solved on screen',
    files: ['engine.js', 'voice.js', 'lib.js', 'data.js', 'l07.js', 'l08.js', 'l09.js', 'l10.js', 'l1112.js', 'outro.js', 'app.js'] },
  b: { out: 'lec11-14.html', title: 'Analog Lab: Lec 11–14', h1: 'Analog Lab · Lectures 11–14', sub: 'CMFB, then frequency and poles from zero, settling, slewing and stability · every related question, solved by you first',
    files: ['engine.js', 'voice.js', 'lib.js', 'data.js', 'b_intro.js', 'l10.js', 'l1112.js', 'freq.js', 'l13.js', 'l14.js', 'b_outro.js', 'app.js'] },
  c: { out: 'lec06.html', title: 'Analog Lab: Lec 6', h1: 'Analog Lab · Lecture 6', sub: 'Folded cascodes from the ground up: CM ranges, rail-to-rail, the folded buffer, the low-voltage cascode load · every related question, solved by you first',
    files: ['engine.js', 'voice.js', 'lib.js', 'data.js', 'c_intro.js', 'c_found.js', 'c_lec6.js', 'c_q.js', 'c_recall.js', 'app.js'] },
};
const L = LESSONS[process.argv[2] || 'a'];
const FILES = L.files;
const key = process.argv[2] || 'a';
// recorded narration (scripts/anim/audio/<lesson>.json manifest + mp3 per line), rendered by tts.py
let audio = {};
const man = join(here, 'audio', key + '.json');
if (existsSync(man)) for (const { k } of JSON.parse(readFileSync(man, 'utf8'))) { const f = join(here, 'audio', key, k + '.mp3'); if (existsSync(f)) audio[k] = 'data:audio/mpeg;base64,' + readFileSync(f).toString('base64'); }
const app = `const AUDIO = ${JSON.stringify(audio)};\nconst PROBLEMS = ${problems};\nconst PAPERS = ${JSON.stringify(papers)};\n` + FILES.map((f) => `/* ── ${f} ── */\n` + src(f)).join('\n');
const out = src('shell.html')
  .replace('/*KATEXCSS*/', () => kcss)
  .replace('/*STYLE*/', () => src('style.css'))
  .replace(/\/\*TITLE\*\//g, L.title).replace('/*H1*/', L.h1).replace('/*SUB*/', L.sub)
  .replace('/*KATEXJS*/', () => readFileSync(join(kdir, 'katex.min.js'), 'utf8'))
  .replace('/*APPJS*/', () => app.replace(/<\/script/g, '<\\/script'));
mkdirSync(join(root, 'anim-dist'), { recursive: true });
writeFileSync(join(root, 'anim-dist', L.out), out);
console.log('built', (out.length / 1e6).toFixed(2), 'MB,', Object.keys(audio).length, 'recorded lines');
