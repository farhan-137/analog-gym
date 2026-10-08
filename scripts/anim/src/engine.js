/* Analog Lab engine: a seekable timeline of scenes drawn in one 1600×900 SVG.
   Every scene's build(S) registers elements and timed animations; update(t) is a pure function of time,
   so scrubbing, jumping and replay always give the same frame. */
'use strict';
const NS = 'http://www.w3.org/2000/svg';
const W = 1600, H = 900;
const SCENES = [];
const CHAPTERS = [];
let uid = 0;

const C = {
  bg: '#0a0e15', wire: '#c3ccd8', dim: '#4a5568', faint: '#2a3444', text: '#e9eef5', muted: '#93a1b3',
  n: '#a78bfa', p: '#2dd4bf', cur: '#fb923c', volt: '#60a5fa', ok: '#34d399', bad: '#f87171', amb: '#fbbf24',
  red: '#f87171', green: '#4ade80', pink: '#f472b6',
};

/* ── easing ── */
const E = {
  lin: (p) => p,
  out: (p) => 1 - Math.pow(1 - p, 3),
  inout: (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2),
  back: (p) => { const c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); },
};
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const lerp = (a, b, p) => a + (b - a) * p;

function el(tag, attrs = {}, parent) {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) if (attrs[k] !== undefined && attrs[k] !== null) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}

/* "V_out" → V with subscript out; "g_m1,2" etc. Also ^2 superscripts. */
function richText(t, str, size) {
  const re = /([A-Za-zα-ωΔμ])_\{([^}]*)\}|([A-Za-zα-ωΔμ])_([A-Za-z0-9]+(?:,[A-Za-z0-9]+)*)|\^([0-9]+)/g;
  let last = 0, m;
  const add = (s, sub, sup) => {
    if (!s) return;
    const ts = el('tspan', {}, t);
    if (sub) { ts.setAttribute('baseline-shift', 'sub'); ts.setAttribute('font-size', Math.round(size * 0.72)); }
    if (sup) { ts.setAttribute('baseline-shift', 'super'); ts.setAttribute('font-size', Math.round(size * 0.68)); }
    ts.textContent = s;
  };
  while ((m = re.exec(str))) {
    add(str.slice(last, m.index));
    if (m[1]) { add(m[1]); add(m[2], true); } else if (m[3]) { add(m[3]); add(m[4], true); } else add(m[5], false, true);
    last = re.lastIndex;
  }
  add(str.slice(last));
}

function scene(ch, title, dur, build, opt = {}) {
  let chap = CHAPTERS.find((c) => c.name === ch);
  if (!chap) { chap = { name: ch, scenes: [] }; CHAPTERS.push(chap); }
  const s = { ch, title, dur, build, ...opt, index: SCENES.length };
  SCENES.push(s);
  chap.scenes.push(s);
  return s;
}

/* ── the scene context ── */
function makeCtx(root, sc) {
  const anims = [];
  const caps = [];
  const stops = [];
  const world = el('g', { class: 'world' }, root);
  const hud = el('g', { class: 'hud' }, root);
  let layer = world;
  const S = {
    sc, world, hud, anims, caps, stops, C, W, H,
    get layer() { return layer; },
    into(g) { const prev = layer; layer = g; return () => { layer = prev; }; },
    el(tag, attrs, parent) { const e = el(tag, attrs, parent || layer); e.id = e.id || 'e' + uid++; return e; },
    g(attrs = {}, parent) { return S.el('g', attrs, parent); },
    /* ── timing ── */
    anim(t0, d, key, fn, ease = E.out) { anims.push({ t0, d: Math.max(d, 0.001), key, fn, ease }); },
    say(t, html) { caps.push({ t, html }); },
    stop(t, spec) { stops.push({ t, ...spec }); },
    hideAt0(e) { e.style.opacity = 0; },
    fade(e, t0, d = 0.6, to = 1, from = 0) { S.anim(t0, d, e.id + ':o', (p) => { e.style.opacity = lerp(from, to, p); }); return e; },
    out(e, t0, d = 0.5) { return S.fade(e, t0, d, 0, 1); },
    dim(e, t0, d = 0.5, to = 0.25) { S.anim(t0, d, e.id + ':o', (p) => { e.style.opacity = lerp(1, to, p); }); return e; },
    undim(e, t0, d = 0.5, from = 0.25) { S.anim(t0, d, e.id + ':o', (p) => { e.style.opacity = lerp(from, 1, p); }); return e; },
    pop(e, t0, d = 0.7) {
      const b = bbox(e); const cx = b.x + b.width / 2, cy = b.y + b.height / 2;
      S.anim(t0, d, e.id + ':o', (p) => { e.style.opacity = clamp(p * 1.6, 0, 1); });
      S.anim(t0, d, e.id + ':tf', (p) => { const s = lerp(0.86, 1, p); e.setAttribute('transform', `translate(${cx} ${cy}) scale(${s}) translate(${-cx} ${-cy})`); }, E.back);
      return e;
    },
    move(e, t0, d, dx0, dy0, dx1, dy1, ease = E.inout) {
      S.anim(t0, d, e.id + ':tf', (p) => e.setAttribute('transform', `translate(${lerp(dx0, dx1, p)} ${lerp(dy0, dy1, p)})`), ease);
      return e;
    },
    slideIn(e, t0, d = 0.7, dx = 0, dy = 24) {
      S.anim(t0, d, e.id + ':o', (p) => { e.style.opacity = p; });
      S.anim(t0, d, e.id + ':tf', (p) => e.setAttribute('transform', `translate(${lerp(dx, 0, p)} ${lerp(dy, 0, p)})`));
      return e;
    },
    /* write a path on, like a pen */
    draw(e, t0, d = 1) {
      const paths = e.tagName === 'g' ? [...e.querySelectorAll('path,polyline,line,circle,rect,polygon')] : [e];
      paths.forEach((pth, i) => {
        let L = 0;
        try { L = pth.getTotalLength ? pth.getTotalLength() : 0; } catch (_) { L = 0; }
        if (!L) { S.fade(pth, t0, d); return; }
        pth.id = pth.id || 'e' + uid++;
        S.anim(t0, d, pth.id + ':dash', (p) => {
          pth.style.strokeDasharray = `${L} ${L}`;
          pth.style.strokeDashoffset = L * (1 - p);
          if (p >= 1) { pth.style.strokeDasharray = ''; pth.style.strokeDashoffset = ''; }
        }, E.inout);
      });
      if (e.tagName === 'g') {
        e.querySelectorAll('text, foreignObject').forEach((tx) => { tx.id = tx.id || 'e' + uid++; S.fade(tx, t0 + d * 0.6, d * 0.5); });
      }
      return e;
    },
    /* moving current: a dashed overlay that streams along a wire */
    flow(pts, t0, t1, opt = {}) {
      const d = 'M' + pts.map((p) => p.join(' ')).join(' L');
      const g = S.g({ class: 'flow' });
      const glow = S.el('path', { d, fill: 'none', stroke: opt.color || C.cur, 'stroke-width': (opt.w || 3) + 5, 'stroke-linecap': 'round', opacity: 0.18, 'stroke-dasharray': '3 22' }, g);
      const core = S.el('path', { d, fill: 'none', stroke: opt.color || C.cur, 'stroke-width': opt.w || 3, 'stroke-linecap': 'round', 'stroke-dasharray': '3 22' }, g);
      g.style.opacity = 0;
      const speed = opt.speed || 60;
      S.anim(t0, 0.5, g.id + ':o', (p) => { g.style.opacity = p; });
      if (t1) S.anim(t1, 0.5, g.id + ':o', (p) => { g.style.opacity = 1 - p; });
      S.anim(t0, 1e4, g.id + ':dash', (_p, t) => { const off = -((t - t0) * speed) % 25; core.style.strokeDashoffset = off; glow.style.strokeDashoffset = off; }, E.lin);
      return g;
    },
    /* soft halo box behind a group of devices */
    halo(x, y, w, h, color, t0, t1, label) {
      const g = S.g();
      S.el('rect', { x, y, width: w, height: h, rx: 18, fill: color, 'fill-opacity': 0.08, stroke: color, 'stroke-opacity': 0.75, 'stroke-width': 2 }, g);
      if (label) txt(S, x + 14, y - 10, label, { size: 20, color, weight: 700 }, g);
      g.style.opacity = 0;
      S.fade(g, t0, 0.6);
      if (t1) S.anim(t1, 0.6, g.id + ':o', (p) => { g.style.opacity = 1 - p; });
      return g;
    },
    ring(x, y, r, color, t0, t1) {
      const c = S.el('circle', { cx: x, cy: y, r, fill: 'none', stroke: color, 'stroke-width': 3 });
      c.style.opacity = 0;
      S.anim(t0, 0.6, c.id + ':o', (p) => { c.style.opacity = p; });
      S.anim(t0, 1e4, c.id + ':r', (_p, t) => { c.setAttribute('r', r + 4 * Math.sin((t - t0) * 4)); }, E.lin);
      if (t1) S.anim(t1, 0.5, c.id + ':o', (p) => { c.style.opacity = 1 - p; });
      return c;
    },
    /* count a number up/down */
    count(textEl, t0, d, a, b, fmt) {
      S.anim(t0, d, textEl.id + ':txt', (p) => { textEl.textContent = fmt(lerp(a, b, p)); }, E.inout);
    },
    cam(t0, d, x, y, s) {
      S.anim(t0, d, 'cam', (p, _t, st) => {
        const a = st.camFrom || { x: W / 2, y: H / 2, s: 1 };
        const cx = lerp(a.x, x, p), cy = lerp(a.y, y, p), cs = lerp(a.s, s, p);
        world.setAttribute('transform', `translate(${W / 2} ${H / 2}) scale(${cs}) translate(${-cx} ${-cy})`);
        st.cam = { x: cx, y: cy, s: cs };
      }, E.inout);
    },
  };
  return S;
}

function bbox(e) {
  try { const b = e.getBBox(); if (b.width || b.height) return b; } catch (_) { /* not rendered yet */ }
  return { x: 0, y: 0, width: 0, height: 0 };
}

/* ── player ── */
const Player = (() => {
  let svg, subs, cur = -1, S = null, anims = [], groups = [], t = 0, playing = false, last = 0, speed = 1;
  let offsets = [], total = 0, stopsDone = new Set(), voice = false, lastCap = '', drills = true, hb = { style: {} };
  const listeners = [];
  function init(svgEl, subsEl) {
    svg = svgEl; subs = subsEl; hb = document.querySelector('.holdbar i') || hb;
    let acc = 0;
    offsets = SCENES.map((s) => { const o = acc; acc += s.dur; return o; });
    total = acc;
  }
  function sceneAt(gt) { let i = 0; while (i < SCENES.length - 1 && gt >= offsets[i + 1]) i++; return i; }
  function enter(i) {
    while (svg.lastChild && svg.lastChild.tagName !== 'defs') svg.removeChild(svg.lastChild);
    cur = i;
    S = makeCtx(svg, SCENES[i]);
    SCENES[i].build(S);
    // group animations by key so a later animation of the same property only applies once it has started
    const byKey = new Map();
    S.anims.forEach((a, k) => { a.k = k; if (!byKey.has(a.key)) byKey.set(a.key, []); byKey.get(a.key).push(a); });
    groups = [...byKey.values()].map((g) => g.sort((a, b) => a.t0 - b.t0 || a.k - b.k));
    S.caps.sort((a, b) => a.t - b.t);
  }
  function render(lt) {
    const st = {};
    for (const g of groups) {
      for (let j = 0; j < g.length; j++) {
        const a = g[j];
        if (j > 0 && lt < a.t0) break;
        if (a.key === 'cam' && j > 0) st.camFrom = st.cam;
        const p = a.ease(clamp((lt - a.t0) / a.d, 0, 1));
        a.fn(p, lt, st);
      }
    }
    let html = '';
    for (const c of S.caps) if (c.t <= lt + 1e-6) html = c.html;
    if (html !== lastCap) {
      lastCap = html; subs.innerHTML = html ? `<span>${rt(html)}</span>` : ''; capShownAt = lt;
      if (voice && playing && html) speak(html); else { spokenFor = ''; }
    }
  }
  function seek(gt, fromUser) {
    gt = clamp(gt, 0, total - 1e-3);
    const i = sceneAt(gt);
    if (i !== cur) enter(i);
    t = gt;
    if (fromUser) { [...stopsDone].forEach((k) => { const [si, st] = k.split('@').map(Number); if (offsets[si] + st > gt + 0.01) stopsDone.delete(k); }); lastCap = '\u0000'; Voice.cancel(); holdUntil = 0; heldKey = ''; }
    render(gt - offsets[i]);
    listeners.forEach((f) => f(gt));
  }
  let freeze = false, spokenFor = '', interrupted = false, holdUntil = 0, holdFrom = 0, heldKey = '', capShownAt = 0;
  function speak(html) {
    spokenFor = html; interrupted = false;
    Voice.speak(html, { speed: Math.sqrt(speed), gap: 240 + 180 * Pace.level() }).then((ok) => { if (!ok && spokenFor === html) interrupted = true; });
  }
  function nextCapTime() {
    const lt = t - offsets[cur];
    const n = S.caps.find((c) => c.t > lt + 1e-6);
    return n ? offsets[cur] + n.t : offsets[cur] + SCENES[cur].dur;
  }
  function tick(now) {
    const dt = Math.min(0.1, (now - last) / 1000); last = now;
    hb.style.width = '0%';
    if (freeze && !Voice.talking()) freeze = false;
    if (playing && freeze) { /* repeating the line: wait for the voice */ } else if (playing && now < holdUntil) {
      // study pause after a line: the picture rests so you can read it again
      hb.style.width = (100 * (holdUntil - now)) / Math.max(1, holdUntil - holdFrom) + '%';
    } else if (playing) {
      let nt = t + dt * speed;
      const nb = nextCapTime(), key = cur + '@' + nb.toFixed(3);
      if (nt >= nb - 0.02) {
        if (Voice.talking()) nt = Math.min(nt, Math.max(t, nb - 0.02)); // hold the picture while the voice reads the line
        else if (heldKey !== key && lastCap) {
          heldKey = key;
          const ms = Pace.hold(lastCap, nb - offsets[cur] - capShownAt, voice && spokenFor === lastCap);
          if (ms > 30) { holdFrom = now; holdUntil = now + ms; nt = Math.max(t, nb - 0.02); }
        }
      }
      // interactive stops
      const lt0 = t - offsets[cur], lt1 = nt - offsets[cur];
      const stop = S.stops.find((s) => s.t > lt0 - 1e-6 && s.t <= lt1 && !stopsDone.has(cur + '@' + s.t));
      if (stop) { nt = offsets[cur] + stop.t; stopsDone.add(cur + '@' + stop.t); playing = false; Voice.cancel(); Try.open(stop); listeners.forEach((f) => f(nt)); }
      // say-it-back drill at the end of a scene
      const sc = SCENES[cur], dEnd = sc.dur - 0.01;
      if (!stop && sc.recall && drills && lt1 >= dEnd && lt0 < dEnd + 1e-6 && !stopsDone.has(cur + '@' + dEnd)) {
        nt = offsets[cur] + dEnd; stopsDone.add(cur + '@' + dEnd); playing = false; listeners.forEach((f) => f(nt));
        Drill.open(sc, voice, () => { Player.play(); });
      }
      if (nt >= total - 1e-3) { nt = total - 1e-3; playing = false; }
      if (nt !== t) seek(nt);
    }
    requestAnimationFrame(tick);
  }
  return {
    init, seek, total: () => total, time: () => t, offsets: () => offsets, cur: () => cur,
    play() {
      if (Try.isOpen() || Drill.isOpen()) return;
      playing = true; last = performance.now();
      if (voice && lastCap && lastCap !== '\u0000' && (interrupted || spokenFor !== lastCap)) speak(lastCap);
      listeners.forEach((f) => f(t));
    },
    pause() { if (Voice.talking()) interrupted = true; playing = false; Voice.cancel(); holdUntil = 0; listeners.forEach((f) => f(t)); },
    /* read the current line again (even with the voice off) and wait for it */
    repeat() { if (!lastCap || lastCap === '\u0000') return; heldKey = ''; holdUntil = 0; freeze = true; speak(lastCap); if (!playing) { playing = true; last = performance.now(); listeners.forEach((f) => f(t)); } },
    setDrills(v) { drills = v; }, drills: () => drills,
    toggle() { playing ? this.pause() : this.play(); },
    playing: () => playing,
    setSpeed(v) { speed = v; },
    setVoice(v) { voice = v; if (!v) Voice.cancel(); else if (lastCap && playing) speak(lastCap); },
    voice: () => voice,
    on(f) { listeners.push(f); },
    start() { last = performance.now(); requestAnimationFrame(tick); },
    caps: () => S.caps,
  };
})();

/* ── your-turn overlay ── */
/* exam time budget for a stop: the question's marks × the paper's minutes per mark, shared by its parts */
const Budget = (() => {
  const parts = {};
  const base = (src) => (src || '').replace(/\s*·.*$/, '').trim();
  const KNOWN = [[/Mid-sem 2024-25 Q1/, 20], [/Mid-sem 2024-25 Q2/, 15], [/Mid-sem 2024-25 Q3/, 10], [/Mid-sem 2024-25 Q4/, 7], [/Mid-sem 2024-25 Q5/, 8],
    [/Quiz 1 2024-25 Q1/, 9], [/Quiz 1 2024-25 Q2/, 6], [/Quiz 2 2024-25 Q1/, 6], [/Quiz 2 2024-25/, 9], [/Quiz 1 2023-24/, 7.5]];
  function info(src) {
    const s = src || '';
    const m = s.match(/(\d+(?:\.\d+)?) marks/) || null;
    const quiz = /quiz/i.test(s);
    let marks = m ? +m[1] : (KNOWN.find(([re]) => re.test(s)) || [])[1];
    let kind = 'exam';
    if (!marks) { if (/^Lab/.test(s)) { marks = 4; kind = 'lab'; } else if (/Exam-style|tutoring chat|^$/.test(s)) { marks = 2; kind = 'check'; } else { marks = 10; kind = 'practice'; } }
    return { marks, rate: quiz ? 120 : 90, quiz, kind };
  }
  return {
    count(src) { const b = base(src); parts[b] = (parts[b] || 0) + 1; },
    reset() { Object.keys(parts).forEach((k) => delete parts[k]); },
    for(st) {
      if (st.secs) return { secs: st.secs, note: '' };
      const I = info(st.src), n = parts[base(st.src)] || 1;
      const secs = Math.max(45, Math.round((I.marks * I.rate) / n / 15) * 15);
      const paper = I.quiz ? 'quiz: 30 min for 15 marks' : 'mid-sem: 90 min for 60 marks';
      const what = I.kind === 'exam' ? `${I.marks}-mark question` : I.kind === 'practice' ? 'treated as a 10-mark exam question' : I.kind === 'lab' ? 'treated as a 4-mark part' : 'quick check';
      return { secs, note: `${what}${n > 1 ? `, ${n} parts` : ''} · ${paper}` };
    },
  };
})();

const Try = (() => {
  let box, open = false, tick = null;
  const mmss = (s) => `${s < 0 ? '+' : ''}${Math.floor(Math.abs(s) / 60)}:${String(Math.floor(Math.abs(s) % 60)).padStart(2, '0')}`;
  function fmt(v) { const a = Math.abs(v); if (a !== 0 && (a >= 1e5 || a < 1e-3)) return v.toExponential(3); return (+v.toPrecision(4)).toString(); }
  function parseNum(s) {
    s = s.trim().replace(/,/g, '').replace(/µ/g, 'u').replace(/−/g, '-');
    const m = s.match(/^(-?[\d.]+(?:e-?\d+)?)\s*([pnumkMG])?/i);
    if (!m) return NaN;
    const mult = { p: 1e-12, n: 1e-9, u: 1e-6, m: 1e-3, k: 1e3, M: 1e6, G: 1e9 }[m[2]] || 1;
    return parseFloat(m[1]) * mult;
  }
  function openStop(st) {
    open = true;
    box = document.querySelector('.try');
    const tries = { n: 0 };
    const b = box.querySelector('.box');
    const B = Budget.for(st), t0 = performance.now();
    b.innerHTML = `<div class="tag">Your turn${st.src ? ' · ' + st.src : ''}</div>
      <div class="timer"><div class="ring"><svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="19" class="bg"/><circle cx="22" cy="22" r="19" class="fg"/></svg><span></span></div>
      <div class="tl"><b>Exam budget ${mmss(B.secs)}</b><br><small>${B.note}</small></div></div><div class="p">${st.q}</div>`;
    const ring = b.querySelector('.timer'), fg = b.querySelector('.timer .fg'), rs = b.querySelector('.timer .ring span');
    const C0 = 2 * Math.PI * 19; fg.style.strokeDasharray = C0;
    const used = () => (performance.now() - t0) / 1000;
    clearInterval(tick);
    const upd = () => {
      const left = B.secs - used();
      rs.textContent = mmss(Math.ceil(left));
      fg.style.strokeDashoffset = C0 * (1 - Math.max(0, left) / B.secs);
      ring.classList.toggle('warn', left <= B.secs * 0.25 && left > 0); ring.classList.toggle('over', left <= 0);
      if (left <= 0) ring.querySelector('.tl small').textContent = 'Over budget: in the exam, write what you have and move on.';
    };
    upd(); tick = setInterval(upd, 250);
    const fb = document.createElement('div'); fb.className = 'fb';
    const took = () => { clearInterval(tick); const u = used(); return ` <span class="took">⏱ ${mmss(Math.round(u))} of ${mmss(B.secs)}${u > B.secs ? ' (too slow for the exam: redo it tomorrow)' : ''}</span>`; };
    const finish = (msg) => { fb.className = 'fb ok'; fb.innerHTML = msg + took(); cont.style.display = ''; };
    const cont = document.createElement('button'); cont.className = 'go'; cont.textContent = 'Continue ▶'; cont.style.display = 'none';
    cont.onclick = () => { close(); Player.play(); };
    if (st.choices) {
      const ch = document.createElement('div'); ch.className = 'choices';
      st.choices.forEach((c, i) => {
        const bt = document.createElement('button'); bt.innerHTML = c;
        bt.onclick = () => {
          if (i === st.answer) finish('✓ Right. ' + (st.why || ''));
          else { tries.n++; fb.className = 'fb bad'; fb.innerHTML = '✗ Not this one. ' + (st.hint || ''); }
        };
        ch.appendChild(bt);
      });
      b.appendChild(ch);
    } else {
      const row = document.createElement('div'); row.className = 'row';
      row.innerHTML = `<input type="text" inputmode="decimal" placeholder="your answer" aria-label="your answer"> <span class="u">${st.unit || ''}</span>`;
      const chk = document.createElement('button'); chk.className = 'go'; chk.textContent = 'Check';
      const hint = document.createElement('button'); hint.textContent = 'Hint';
      const show = document.createElement('button'); show.textContent = 'Show me';
      row.append(chk, hint, show);
      b.appendChild(row);
      const inp = row.querySelector('input');
      const check = () => {
        const v = parseNum(inp.value);
        if (Number.isNaN(v)) { fb.className = 'fb bad'; fb.textContent = 'Type a number (you can use m, µ/u, k, M).'; return; }
        const tol = st.tol ?? 0.03;
        const ok = Math.abs(v - st.answer) <= tol * Math.abs(st.answer) + (st.abs || 0);
        if (ok) finish(`✓ Correct: ${fmt(st.answer)} ${st.unit || ''}. ${st.why || ''}`);
        else { tries.n++; fb.className = 'fb bad'; fb.innerHTML = `✗ Not quite (you wrote ${fmt(v)}). ${tries.n === 1 ? (st.hint || '') : 'Try once more, or press “Show me”.'}`; }
      };
      chk.onclick = check;
      inp.onkeydown = (e) => { e.stopPropagation(); if (e.key === 'Enter') check(); };
      hint.onclick = () => { fb.className = 'fb hint'; fb.innerHTML = '💡 ' + (st.hint || ''); };
      show.onclick = () => finish(`Answer: ${fmt(st.answer)} ${st.unit || ''}. ${st.why || ''}`);
      setTimeout(() => inp.focus(), 50);
    }
    b.appendChild(fb);
    const r2 = document.createElement('div'); r2.className = 'row'; r2.style.marginTop = '8px';
    const skip = document.createElement('button'); skip.textContent = 'Skip';
    skip.onclick = () => { close(); Player.play(); };
    r2.append(cont, skip);
    b.appendChild(r2);
    box.classList.add('on');
  }
  function close() { open = false; clearInterval(tick); document.querySelector('.try').classList.remove('on'); }
  return { open: openStop, close, isOpen: () => open };
})();
