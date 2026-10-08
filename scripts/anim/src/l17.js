/* Lesson D, Lecture 17: frequency compensation, dominant pole, Miller effect, pole splitting, the two-stage op amp, RHP zero, slewing. */
'use strict';
const L17 = 'Lec 17 · Frequency compensation';

scene(L17, 'The problem: 100 dB and three poles', 62, (S) => {
  header(S, 'LEC 17 · YOUR PAGE, TOP', 'Fine at high closed-loop gain, unstable as a buffer');
  pagePeek(S, 'n17a', 1060, 120, 470, 688, 0.3, 8);
  const A0 = 1e5, poles = [1e3, 1e6, 1e7];
  const B = bodePair(S, { x: 120, w: 820, y: 140, hm: 330, hp: 250, d0: 1, d1: 8, db0: 110, db1: -30, ph1: -270, mtitle: '20 log|A|' });
  B.g.style.opacity = 0; S.fade(B.g, 7, 0.6);
  const mc = S.el('polyline', { points: bodePts(B, (f) => dB(LG.mag(f, A0, poles)), B.fyM), fill: 'none', stroke: C.volt, 'stroke-width': 3.6 });
  const pc = S.el('polyline', { points: bodePts(B, (f) => LG.ph(f, poles), B.fyP), fill: 'none', stroke: C.amb, 'stroke-width': 3.4 });
  [mc, pc].forEach((e) => { e.style.opacity = 0; S.fade(e, 8, 0.6); });
  [[1e3, 'f_p1'], [1e6, 'f_p2'], [1e7, 'f_p3']].forEach(([f, s]) => { const e = txt(S, B.fxp(f) + 6, B.fyM(-18), s, { size: 17, color: C.muted }); e.style.opacity = 0; S.fade(e, 9, 0.5); });
  const bl = S.el('line', { x1: B.x0, x2: B.x0 + B.w, stroke: C.bad, 'stroke-width': 3 }), bt = txt(S, B.x0 + 10, 0, '', { size: 18, color: C.bad, weight: 700 });
  const gd = S.el('circle', { r: 9 }), dl = S.el('line', { 'stroke-width': 2, 'stroke-dasharray': '6 5' }), pmb = S.el('line', { 'stroke-width': 7 });
  const rd = [txt(S, 980, 840, '', { size: 22, mono: true, weight: 800 })];
  [bl, bt, gd, dl, pmb, ...rd].forEach((e) => { e.style.opacity = 0; S.fade(e, 10, 0.6); });
  const gAt = (t) => (t < 20 ? 80 : t < 34 ? lerp(80, 0, E.inout((t - 20) / 14)) : 0);
  S.anim(0, 1e4, 'bl', (_p, t) => {
    const g = gAt(t), beta = 10 ** (-g / 20), y = B.fyM(g);
    bl.setAttribute('y1', y); bl.setAttribute('y2', y); bt.setAttribute('y', y - 10); bt.textContent = ''; richText(bt, `20 log(1/β) = ${fx(g, 3)} dB`, 18);
    const gx = LG.gx(beta * A0, poles), x = B.fxp(gx), ph = LG.ph(gx, poles), ok = ph > -180, col = ok ? C.ok : C.bad;
    gd.setAttribute('cx', x); gd.setAttribute('cy', y); gd.setAttribute('fill', col);
    dl.setAttribute('x1', x); dl.setAttribute('x2', x); dl.setAttribute('y1', y); dl.setAttribute('y2', B.fyP(ph)); dl.setAttribute('stroke', col);
    pmb.setAttribute('x1', x); pmb.setAttribute('x2', x); pmb.setAttribute('y1', B.fyP(Math.max(ph, -270))); pmb.setAttribute('y2', B.fyP(-180)); pmb.setAttribute('stroke', col);
    rd[0].textContent = `PM = ${fx(180 + ph, 3)}°${ok ? '' : '  → oscillates'}`; rd[0].setAttribute('fill', col);
  }, E.lin);
  S.say(0.3, 'Lecture 17 opens with this plot on your page: an op amp with 100 dB of gain and three poles, and a red horizontal line at $20\\log(1/\\beta)$.');
  S.say(8, 'Remember the shortcut from Lecture 16: where the gain curve meets the line is the crossover, and the gap between them is the loop gain.');
  S.say(12, 'With the line high up, a big closed-loop gain, they meet before the second pole. The phase there is only about −90°: lots of margin.');
  S.say(20, 'Now lower the line, asking for less closed-loop gain. The meeting point slides right, past the second pole, past the third… and the phase there goes beyond −180°.');
  whyBox(S, 980, 380, 560, 260, '**The job of compensation:** make the loop gain fall to 1 **before** the phase gets dangerous, for every closed-loop gain you will use, down to 1 (the buffer). Two ways: lower the first pole (this lecture’s start), or Miller-split the poles (its end).', 36);
  S.say(36, 'So the amplifier works at high gain but oscillates as a buffer. Compensation means: make the loop gain fall to 1 before the phase gets dangerous, for every gain down to 1.');
});

scene(L17, 'Dominant-pole compensation: lift your foot early', 64, (S) => {
  header(S, 'LEC 17 · YOUR PAGE, THE GREEN DASHED LINE', 'Slide the first pole down until |βA| = 1 at the second pole');
  const A0 = 1e5, beta = 1, poles0 = [1e3, 1e6, 1e7];
  const B = bodePair(S, { x: 120, w: 820, y: 140, hm: 330, hp: 250, d0: 0, d1: 8, db0: 110, db1: -30, ph1: -270, mtitle: '20 log|βA| (β = 1)' });
  B.g.style.opacity = 0; S.fade(B.g, 0.3, 0.6);
  const old = S.el('polyline', { points: bodePts(B, (f) => dB(LG.mag(f, A0, poles0)), B.fyM), fill: 'none', stroke: C.dim, 'stroke-width': 2.4, 'stroke-dasharray': '7 6' });
  const mc = liveLine(S, C.volt, 3.8), pc = liveLine(S, C.amb, 3.4);
  const fpm = S.el('line', { stroke: C.ok, 'stroke-width': 2.4, 'stroke-dasharray': '6 5' }), fpt = txt(S, 0, 0, '', { size: 18, color: C.ok, weight: 800, anchor: 'middle' });
  const gd = S.el('circle', { r: 9, fill: C.ok }), pmb = S.el('line', { 'stroke-width': 7 });
  const rd = [txt(S, 990, 230, '', { size: 22, color: C.ok, mono: true, weight: 700 }), txt(S, 990, 268, '', { size: 21, color: C.text, mono: true }), txt(S, 990, 306, '', { size: 26, mono: true, weight: 800 })];
  [old, mc, pc, fpm, fpt, gd, pmb, ...rd].forEach((e) => { e.style.opacity = 0; S.fade(e, 1, 0.6); });
  const fdTarget = 1e6 / (beta * A0); // GX at the second pole → PM ≈ 45°
  const fAt = (t) => (t < 14 ? 1e3 : t < 30 ? 10 ** lerp(3, Math.log10(fdTarget), E.inout((t - 14) / 16)) : fdTarget);
  S.anim(0, 1e4, 'dom', (_p, t) => {
    const fp1 = fAt(t), poles = [fp1, 1e6, 1e7];
    mc.setAttribute('points', bodePts(B, (f) => dB(LG.mag(f, A0, poles)), B.fyM)); pc.setAttribute('points', bodePts(B, (f) => LG.ph(f, poles), B.fyP));
    fpm.setAttribute('x1', B.fxp(fp1)); fpm.setAttribute('x2', B.fxp(fp1)); fpm.setAttribute('y1', B.fyM(100) + 10); fpm.setAttribute('y2', B.yP + B.hp);
    fpt.setAttribute('x', B.fxp(fp1)); fpt.setAttribute('y', B.yP + B.hp + 52); fpt.textContent = ''; richText(fpt, `fp1 = ${fmtHz(fp1)}`, 18);
    const gx = LG.gx(A0, poles), ph = LG.ph(gx, poles), ok = ph > -180;
    gd.setAttribute('cx', B.fxp(gx)); gd.setAttribute('cy', B.fyM(0));
    pmb.setAttribute('x1', B.fxp(gx)); pmb.setAttribute('x2', B.fxp(gx)); pmb.setAttribute('y1', B.fyP(Math.max(ph, -270))); pmb.setAttribute('y2', B.fyP(-180)); pmb.setAttribute('stroke', ok ? C.ok : C.bad);
    rd[0].textContent = `first pole ${fmtHz(fp1)}`; rd[1].textContent = `crossover ${fmtHz(gx)}`; rd[2].textContent = `PM = ${fx(180 + ph, 3)}°`; rd[2].setAttribute('fill', ok ? C.ok : C.bad);
  }, E.lin);
  S.say(0.3, 'The first fix, the green dashed line on your page: <b>dominant-pole compensation</b>. Leave the fast poles alone and slide the first pole down, by adding capacitance at its node.');
  S.say(6, 'Think of driving towards that cliff: instead of trying to move the cliff, you take your foot off the accelerator early. The gain starts falling sooner, so it reaches 0 dB sooner, at a frequency where the other poles have barely started to bite.');
  S.say(14, 'Watch the first pole slide down. The whole sloping part of the curve slides left with it, the crossover moves left, and the margin grows.');
  eqAt(S, "f_{p1}' = \\frac{f_{GX}}{\\beta A_0}", 1200, 470, 30, { size: 40, w: 600, color: '#ffd38a' });
  S.say(30, 'Where to stop? Put the crossover on the second pole: that leaves 45°. From $\\beta A_0$ the gain falls 20 dB per decade down to 1 at $f_{GX}$, so the new first pole is $f_{GX}/(\\beta A_0)$: here 1 MHz over $10^5$, just 10 Hz.');
  whyBox(S, 990, 580, 560, 230, '**Razavi’s drawing trick:** start at the second pole on the 0 dB line and draw a −20 dB/decade line back up until it meets the flat gain. That meeting point is the new first pole. **The price:** the bandwidth, which has collapsed to 10 Hz.', 42);
  S.say(42, 'Razavi’s shortcut on the plot: from the second pole on the 0 dB line, draw a −20 dB per decade line back up to the flat gain. The price is obvious: the open-loop bandwidth is now only 10 Hz. The Miller capacitor does it far more cheaply.');
});

scene(L17, 'The Miller effect: a capacitor across a gain', 74, (S) => {
  header(S, 'LEC 17 · YOUR PAGE, MIDDLE', 'Both ends move, in opposite directions: Cc looks (1 + A2) times bigger');
  pagePeek(S, 'n17b', 1010, 120, 540, 549, 0.3);
  const A2 = 4;
  const g = S.g(); const r = S.into(g);
  wire(S, [[120, 420], [300, 420]]); dot(S, 300, 420); txt(S, 296, 458, 'node 1', { size: 19, color: C.p, weight: 700, anchor: 'middle' });
  wire(S, [[300, 420], [380, 420]]); amp(S, 380, 420, { label: '−A₂', pm: false, w: 170, h: 150 }); wire(S, [[550, 420], [660, 420]]); dot(S, 660, 420);
  txt(S, 664, 458, 'node 2', { size: 19, color: C.n, weight: 700, anchor: 'middle' });
  wire(S, [[300, 420], [300, 250], [465, 250]]); wire(S, [[495, 250], [660, 250], [660, 420]]);
  S.el('line', { x1: 465, y1: 222, x2: 465, y2: 278, stroke: C.amb, 'stroke-width': 4.4 }); S.el('line', { x1: 495, y1: 222, x2: 495, y2: 278, stroke: C.amb, 'stroke-width': 4.4 });
  txt(S, 480, 208, 'C_c', { size: 24, color: C.amb, weight: 800, anchor: 'middle' });
  r();
  S.draw(g, 8, 1.6);
  // meters: the two node voltages side by side
  const base = 600, U = 120, m1x = 210, m2x = 330;
  const mg = S.g();
  S.el('line', { x1: 150, x2: 400, y1: base, y2: base, stroke: C.muted, 'stroke-width': 1.6 }, mg);
  const b1 = S.el('rect', { x: m1x - 24, width: 48, rx: 5, fill: C.p, 'fill-opacity': 0.75 }, mg), b2 = S.el('rect', { x: m2x - 24, width: 48, rx: 5, fill: C.n, 'fill-opacity': 0.75 }, mg);
  const span = dynArrow(S, C.amb, 3, mg), span2 = dynArrow(S, C.amb, 3, mg);
  const stx = txt(S, 470, 0, '', { size: 21, color: C.amb, weight: 800 }, mg);
  const v1t = txt(S, m1x, 0, '', { size: 17, color: C.p, anchor: 'middle', weight: 700 }, mg), v2t = txt(S, m2x, 0, '', { size: 17, color: C.n, anchor: 'middle', weight: 700 }, mg);
  mg.style.opacity = 0; S.fade(mg, 12, 0.6);
  S.anim(0, 1e4, 'mil', (_p, t) => {
    const v = 0.9 * Math.sin(Math.max(0, t - 12) * 0.9) ** 2;
    const y1 = base - v * U, y2 = base + A2 * v * U * 0.5;
    b1.setAttribute('y', y1); b1.setAttribute('height', base - y1); b2.setAttribute('y', base); b2.setAttribute('height', y2 - base);
    span.set(440, (y1 + y2) / 2, 440, y1, 12); span2.set(440, (y1 + y2) / 2, 440, y2, 12);
    stx.setAttribute('y', (y1 + y2) / 2 + 7); stx.textContent = `(1 + A₂)v = ${fx((1 + A2) * v, 2)}`;
    v1t.setAttribute('y', y1 - 10); v1t.textContent = `node 1: +v = ${fx(v, 2)}`; v2t.setAttribute('y', y2 + 24); v2t.textContent = `node 2: −A₂v = −${fx(A2 * v, 2)}`;
  }, E.lin);
  // equivalent
  const eqv = S.g(); const re = S.into(eqv);
  txt(S, 1070, 720, 'Seen from each side:', { size: 21, color: C.text, weight: 700 });
  cap(S, 1110, 760); txt(S, 1140, 800, 'C_c(1 + A₂) at node 1', { size: 20, color: C.p, weight: 800 });
  cap(S, 1420, 760); txt(S, 1450, 800, 'C_c(1 + 1/A₂)', { size: 20, color: C.n, weight: 800 });
  re(); eqv.style.opacity = 0; S.fade(eqv, 48, 0.7);
  S.say(0.3, 'The cheap way to make a very low pole is on your page: put a capacitor $C_c$ across an inverting amplifier with gain $-A_2$. This is the <b>Miller effect</b>.');
  S.say(8, 'A capacitor’s current depends on the voltage <b>across</b> it, the difference between its two ends. Here both ends move.');
  S.say(12, 'Raise node 1 by $v$. The amplifier drives node 2 the opposite way, down by $A_2v$. The voltage across $C_c$ changes by $v + A_2v = (1 + A_2)v$.');
  S.say(24, 'Picture a rope tied between two people. If one steps up 1 metre while the other steps down 4, the rope stretches 5 metres, not 1. The capacitor has to swallow $(1 + A_2)$ times the charge a grounded one would.');
  S.say(38, 'So node 1, which only moved by $v$, feels a capacitor $(1 + A_2)$ times bigger. A small $C_c$ looks enormous from the input side.');
  S.say(48, 'Seen from node 1: $C_c(1 + A_2)$. Seen from node 2, which moves a lot, the extra is small: $C_c(1 + 1/A_2)$, about $C_c$. Exactly the two labels on your page.');
  S.say(60, 'One picofarad across a gain of 100 behaves like 101 picofarads at the input. That is how a tiny on-chip capacitor makes a very low dominant pole.');
});

scene(L17, 'Before and after: P1′ ≈ 1/(R1A2Cc), and pole splitting', 66, (S) => {
  header(S, 'LEC 17 · YOUR PAGE, AFTER COMPENSATION', 'Cc pushes P1 down and P2 up: the poles split apart');
  const R1 = 500e3, C1 = 0.1e-12, R2 = 50e3, C2 = 2e-12, Gm2 = 2e-3, A2 = Gm2 * R2;
  const polesOf = (cc) => {
    const a = R1 * R2 * (C1 * C2 + C2 * cc + C1 * cc), b = R1 * (C1 + (1 + A2) * cc) + R2 * (C2 + cc);
    const D = Math.sqrt(Math.max(0, b * b - 4 * a)); const s1 = (b - D) / (2 * a), s2 = (b + D) / (2 * a);
    return [s1 / (2 * Math.PI), s2 / (2 * Math.PI)];
  };
  const x0 = 140, w = 1300, y = 360, d0 = 3, d1 = 10, fxp = (f) => x0 + ((Math.log10(f) - d0) / (d1 - d0)) * w;
  const ax = S.g();
  S.el('line', { x1: x0, x2: x0 + w, y1: y, y2: y, stroke: C.muted, 'stroke-width': 2 }, ax);
  for (let d = d0; d <= d1; d++) { S.el('line', { x1: fxp(10 ** d), x2: fxp(10 ** d), y1: y - 8, y2: y + 8, stroke: C.muted, 'stroke-width': 1.6 }, ax); txt(S, fxp(10 ** d), y + 34, fmtHz(10 ** d), { size: 17, color: C.muted, anchor: 'middle' }, ax); }
  txt(S, x0, y - 74, 'pole frequencies (log axis)', { size: 19, color: C.muted }, ax);
  ax.style.opacity = 0; S.fade(ax, 0.3, 0.6);
  const mk = (col, lab) => { const g = S.g(); S.el('line', { x1: -12, y1: -12, x2: 12, y2: 12, stroke: col, 'stroke-width': 5 }, g); S.el('line', { x1: -12, y1: 12, x2: 12, y2: -12, stroke: col, 'stroke-width': 5 }, g); const t = txt(S, 0, -26, lab, { size: 19, color: col, weight: 800, anchor: 'middle' }, g); return Object.assign(g, { t }); };
  const P1 = mk(C.p, 'P1'), P2 = mk(C.n, 'P2');
  const rd = [txt(S, 140, 470, '', { size: 23, color: C.amb, mono: true, weight: 800 }), txt(S, 140, 510, '', { size: 21, color: C.p, mono: true }), txt(S, 140, 548, '', { size: 21, color: C.n, mono: true })];
  [P1, P2, ...rd].forEach((e) => { e.style.opacity = 0; S.fade(e, 2, 0.5); });
  const ccAt = (t) => (t < 14 ? 0 : t < 30 ? 10 ** lerp(-16, -12, E.inout((t - 14) / 16)) : 1e-12);
  S.anim(0, 1e4, 'split', (_p, t) => {
    const cc = ccAt(t); const [f1, f2] = polesOf(cc);
    P1.setAttribute('transform', `translate(${fxp(f1)} ${y})`); P2.setAttribute('transform', `translate(${fxp(f2)} ${y})`);
    rd[0].textContent = `Cc = ${cc < 1e-15 ? '0' : fx(cc * 1e12, 3) + ' pF'}`;
    rd[1].textContent = `P1 = ${fmtHz(f1)}`; rd[2].textContent = `P2 = ${fmtHz(f2)}`;
  }, E.lin);
  eqAt(S, 'P_1 = \\frac{1}{R_1C_1},\\quad P_2 = \\frac{1}{R_2C_2}\\quad(\\text{without})', 1150, 490, 4, { size: 26, w: 760 });
  eqAt(S, "P_1' = \\frac{1}{R_1[C_1 + (1 + A_2)C_c]} \\approx \\frac{1}{R_1A_2C_c}", 1150, 590, 18, { size: 28, w: 760, color: C.p });
  eqAt(S, "P_2' \\approx \\frac{G_{m2}}{C_2}\\;\\;(= G_{m2}/C_L)", 1150, 690, 30, { size: 28, w: 760, color: C.n });
  S.say(0.3, 'Now the two-stage amplifier on your page: stage 1 drives node 1 ($R_1$, $C_1$), stage 2 drives the output ($R_2$, $C_2$). Without $C_c$ each node gives a pole, and here they sit close together, around a megahertz: a recipe for ringing.');
  S.say(14, 'Add $C_c$ and grow it. Node 1 now carries $C_1 + (1 + A_2)C_c$: the first pole dives down, your page’s $P_1\' ≈ 1/(R_1A_2C_c)$.');
  S.say(30, 'And the second pole goes <b>up</b>. At high frequency $C_c$ acts like a wire from M6’s gate to its drain, so the output stage becomes a diode with resistance about $1/G_{m2}$, and the output pole jumps to about $G_{m2}/C_2$.');
  whyBox(S, 140, 640, 640, 200, '**Pole splitting:** one small capacitor moves the first pole down by about $A_2$ and the second up by a large factor. Far-apart poles are exactly what a 60° margin needs.', 42);
  S.say(42, 'That is <b>pole splitting</b>: one small capacitor pushes the poles far apart, P1 down to a few kilohertz and P2 up past a hundred megahertz. Far-apart poles are exactly what a good phase margin needs.');
});

scene(L17, 'Your page’s two-stage op amp (M1–M7)', 64, (S) => {
  header(S, 'LEC 17 · YOUR PAGE, THE CIRCUIT', 'Two high-resistance nodes: P (stage 1) and Q (the output)');
  pagePeek(S, 'n17c', 1000, 110, 560, 538, 0.3);
  const f = twoStageFig(S, { x: 20, y: 30, sc: 1.05 });
  S.draw(f.g, 7, 2.4);
  S.say(0.3, 'Here is that two-stage amplifier as a real circuit, the one on your page. Stage 1 is the five-transistor OTA from Lecture 2: input pair M1, M2, mirror load M3, M4, tail M5.');
  S.halo(150, 160, 480, 470, C.p, 10, 30, 'STAGE 1: 5-T OTA');
  S.say(10, 'Its output node P sees two big resistances in parallel, $r_{O2}$ and $r_{O4}$, and a small capacitance $C_1$.');
  S.halo(600, 160, 280, 470, C.n, 18, 30, 'STAGE 2: CS');
  S.say(18, 'Stage 2 is a common-source PMOS M6 with the current source M7 as its load. Its output Q, the op amp’s output, sees $r_{O6}\\parallel r_{O7}$ and the load $C_L$.');
  S.flow([[441, 366], [588, 366], [588, 293], [625, 293]], 22, 40, { color: C.cur, speed: 60 });
  S.flow([[692, 345], [692, 429], [790, 429]], 22, 40, { color: C.cur, speed: 60 });
  eqAt(S, 'P_1 = \\frac{1}{(r_{O2}\\parallel r_{O4})\\,C_1}', 1240, 700, 26, { size: 30, w: 600, color: C.p });
  eqAt(S, 'P_2 = \\frac{1}{(r_{O6}\\parallel r_{O7})\\,C_2}', 1240, 790, 30, { size: 30, w: 600, color: C.n });
  S.say(26, 'Two high-resistance nodes, two low poles: your page writes them in red, $P_1 = 1/((r_{O2}\\parallel r_{O4})C_1)$ and $P_2 = 1/((r_{O6}\\parallel r_{O7})C_2)$.');
  S.say(36, '$C_c$ goes from P to Q, across the inverting second stage: exactly the Miller picture. M6 is the $-A_2$ with $A_2 = g_{m6}(r_{O6}\\parallel r_{O7})$.');
  S.say(48, 'So for this circuit: $R_1 = r_{O2}\\parallel r_{O4}$, $R_2 = r_{O6}\\parallel r_{O7}$, $G_{m1} = g_{m1}$, $G_{m2} = g_{m6}$. Every two-stage question uses this dictionary.');
});

scene(L17, 'GBW = Gm1/Cc, and choosing Cc for the margin', 72, (S) => {
  header(S, 'LEC 17 · DESIGNING Cc', 'ωu = Gm1/Cc, ωp2 = Gm2/CL: choose Cc so they are far enough apart');
  const Gm1 = 0.5e-3, Gm2 = 5e-3, CL = 2e-12, A0 = 1e4;
  const B = bodePair(S, { x: 120, w: 760, y: 140, hm: 300, hp: 240, d0: 3, d1: 10, db0: 90, db1: -30, ph1: -180 });
  B.g.style.opacity = 0; S.fade(B.g, 0.3, 0.6);
  const mc = liveLine(S, C.volt, 3.8), pc = liveLine(S, C.amb, 3.4);
  const um = S.el('line', { stroke: C.ok, 'stroke-width': 2.2, 'stroke-dasharray': '6 5' }), p2m = S.el('line', { x1: B.fxp(Gm2 / (2 * Math.PI * CL)), x2: B.fxp(Gm2 / (2 * Math.PI * CL)), y1: B.y0, y2: B.yP + B.hp, stroke: C.n, 'stroke-width': 2.2, 'stroke-dasharray': '6 5' });
  const p2l = txt(S, B.fxp(Gm2 / (2 * Math.PI * CL)) + 8, B.y0 + 22, 'G_m2/C_L', { size: 17, color: C.n, weight: 700 });
  const pmb = S.el('line', { stroke: C.ok, 'stroke-width': 7 });
  const rd = [txt(S, 940, 200, '', { size: 23, color: C.amb, mono: true, weight: 800 }), txt(S, 940, 238, '', { size: 21, color: C.ok, mono: true }), txt(S, 940, 274, '', { size: 21, color: C.n, mono: true }), txt(S, 940, 316, '', { size: 27, mono: true, weight: 800 })];
  [mc, pc, um, p2m, p2l, pmb, ...rd].forEach((e) => { e.style.opacity = 0; S.fade(e, 1, 0.5); });
  const ccT = (Gm1 * CL * Math.tan(60 / DEG)) / Gm2;
  const ccAt = (t) => (t < 26 ? 0.1e-12 : t < 40 ? 10 ** lerp(-13, Math.log10(ccT), E.inout((t - 26) / 14)) : ccT);
  S.anim(0, 1e4, 'cc', (_p, t) => {
    const cc = ccAt(t), fu = Gm1 / (2 * Math.PI * cc), p2 = Gm2 / (2 * Math.PI * CL), poles = [fu / A0, p2];
    mc.setAttribute('points', bodePts(B, (f) => dB(LG.mag(f, A0, poles)), B.fyM)); pc.setAttribute('points', bodePts(B, (f) => LG.ph(f, poles), B.fyP));
    const gx = LG.gx(A0, poles), ph = LG.ph(gx, poles);
    um.setAttribute('x1', B.fxp(fu)); um.setAttribute('x2', B.fxp(fu)); um.setAttribute('y1', B.y0); um.setAttribute('y2', B.yP + B.hp);
    pmb.setAttribute('x1', B.fxp(gx)); pmb.setAttribute('x2', B.fxp(gx)); pmb.setAttribute('y1', B.fyP(ph)); pmb.setAttribute('y2', B.fyP(-180));
    rd[0].textContent = `Cc = ${fx(cc * 1e12, 3)} pF`; rd[1].textContent = `GBW = Gm1/(2πC_c) = ${fmtHz(fu)}`; rd[2].textContent = `P2 = Gm2/(2πC_L) = ${fmtHz(p2)}`;
    rd[3].textContent = `PM = ${fx(180 + ph, 3)}°`; rd[3].setAttribute('fill', 180 + ph >= 59 ? C.ok : C.amb);
  }, E.lin);
  eqAt(S, '\\text{above } P_1\':\\;\\; |A| = \\frac{G_{m1}}{\\omega C_c} \\;\\Rightarrow\\; \\omega_u = \\frac{G_{m1}}{C_c}', 1230, 430, 4, { size: 26, w: 680 });
  eqAt(S, 'PM = 90^\\circ - \\tan^{-1}\\frac{\\omega_u}{\\omega_{p2}} \\;\\Rightarrow\\; C_c = \\frac{G_{m1}C_L\\tan PM}{G_{m2}}', 1230, 530, 18, { size: 24, w: 700, color: '#ffd38a' });
  eqAt(S, '45^\\circ:\\; C_c = \\tfrac{G_{m1}}{G_{m2}}C_L \\qquad 60^\\circ:\\; C_c = 1.73\\,\\tfrac{G_{m1}}{G_{m2}}C_L', 1230, 620, 34, { size: 24, w: 700 });
  S.say(0.3, 'Now design it. Above the dominant pole, stage 1’s current $G_{m1}v_{in}$ simply charges $C_c$, so the gain is $G_{m1}/(\\omega C_c)$ and it reaches 1 at $\\omega_u = G_{m1}/C_c$. The GBW depends only on stage 1 and $C_c$.');
  S.say(12, 'The second pole sits at about $G_{m2}/C_L$. With β = 1 the first pole gives its full −90°, so the margin is 90° minus the second pole’s angle at $\\omega_u$.');
  S.say(18, 'Solve for $C_c$: $C_c = G_{m1}C_L\\tan PM/G_{m2}$. Too small a $C_c$, as now, puts $\\omega_u$ right next to the second pole: a poor margin.');
  S.say(26, 'Grow $C_c$: the GBW slides left, away from P2, which stays put, and the margin climbs… until $C_c$ = 0.35 pF gives exactly 60°.');
  S.say(42, 'Two versions to memorise: 45° needs $C_c = (G_{m1}/G_{m2})C_L$, and 60° needs 1.73 times that. A bigger $G_{m2}$ (a stronger output stage) lets you use a smaller $C_c$ and keep more bandwidth.');
  whyBox(S, 940, 690, 620, 160, '**Allen’s rule** used in the papers: RHP zero at 10× GBW (so $g_{m6} = 10g_{m1}$) and 60° → $C_c \\ge 0.22\\,C_L$.', 54);
  S.say(54, 'The papers often use Allen’s version: put the right-half-plane zero (next scene) at 10 times the GBW, which means $g_{m6} = 10g_{m1}$, and then 60° needs $C_c \\ge 0.22\\,C_L$.');
});

scene(L17, 'The full transfer function and the RHP zero', 74, (S) => {
  header(S, 'LEC 17 · YOUR PAGE, BOTTOM', '(1 − sCc/Gm2): a zero in the right half plane');
  eqAt(S, '\\frac{V_{out}}{V_{in}}(s) = \\frac{G_{m1}G_{m2}R_1R_2\\left(1 - s\\frac{C_c}{G_{m2}}\\right)}{1 + s[\\{C_1 + (1 + G_{m2}R_2)C_c\\}R_1 + R_2(C_2 + C_c)] + s^2R_1R_2(C_1C_2 + C_2C_c + C_1C_c)}', 800, 190, 0.4, { size: 22, w: 1400, h: 90 });
  eqAt(S, 'D = \\left(1 + \\frac{s}{\\omega_{p1}}\\right)\\left(1 + \\frac{s}{\\omega_{p2}}\\right) \\approx 1 + \\frac{s}{\\omega_{p1}} + \\frac{s^2}{\\omega_{p1}\\omega_{p2}}', 800, 290, 6, { size: 24, w: 1200 });
  S.say(0.4, 'Your page ends with the full transfer function of the compensated two-stage op amp. Do not panic: the denominator is just the two poles in disguise.');
  S.say(6, 'Match it with $(1 + s/\\omega_{p1})(1 + s/\\omega_{p2})$, with the poles far apart. The $s$ term gives $\\omega_{p1} ≈ 1/(R_1G_{m2}R_2C_c)$, the Miller pole. Dividing the $s^2$ term by it gives $\\omega_{p2} ≈ G_{m2}/C_2$ when $C_c$ is large. Pole splitting, in algebra.');
  // two currents into Q
  const g = S.g(); const r = S.into(g);
  dot(S, 200, 520); txt(S, 190, 512, 'P', { size: 22, color: C.bad, weight: 800, anchor: 'end' });
  wire(S, [[200, 520], [300, 520]]); pmos(S, 360, 520, { name: 'M6', gl: 30 }); rail(S, 330, 400, 455, 'V_DD'); wire(S, [[360, 455], [360, 470]]);
  wire(S, [[200, 520], [200, 400], [330, 400]]);
  S.el('line', { x1: 330, y1: 380, x2: 330, y2: 420, stroke: C.amb, 'stroke-width': 4 }); S.el('line', { x1: 344, y1: 380, x2: 344, y2: 420, stroke: C.amb, 'stroke-width': 4 });
  txt(S, 337, 370, 'C_c', { size: 19, color: C.amb, weight: 800, anchor: 'middle' });
  wire(S, [[344, 400], [520, 400], [520, 640]]); wire(S, [[360, 570], [360, 640], [520, 640]]); dot(S, 520, 640); txt(S, 534, 648, 'Q', { size: 22, color: C.bad, weight: 800 });
  r(); g.style.opacity = 0; S.fade(g, 16, 0.6);
  const bars = S.g();
  const bx = 620, by1 = 470, by2 = 570, U = 200;
  txt(S, bx, by1 - 24, 'current from M6:  G_m2·v  (pulls Q down)', { size: 19, color: C.n }, bars);
  txt(S, bx, by2 - 24, 'current through C_c:  ωC_c·v  (pushes Q up)', { size: 19, color: C.amb }, bars);
  const r1 = S.el('rect', { x: bx, y: by1, height: 26, rx: 5, fill: C.n }, bars), r2 = S.el('rect', { x: bx, y: by2, height: 26, rx: 5, fill: C.amb }, bars);
  const net = txt(S, bx, 660, '', { size: 23, weight: 800, mono: true }, bars);
  bars.style.opacity = 0; S.fade(bars, 16, 0.6);
  const fAt = (t) => (t < 18 ? 0.1 : t < 32 ? 10 ** lerp(-1, 0, E.inout((t - 18) / 14)) : t < 40 ? 1 : 10 ** lerp(0, 0.6, clamp((t - 40) / 6, 0, 1)));
  S.anim(0, 1e4, 'zero', (_p, t) => {
    const x = fAt(t); r1.setAttribute('width', U); r2.setAttribute('width', Math.min(U * 2.3, U * x));
    const nz = Math.abs(1 - x) < 0.03;
    net.textContent = nz ? 'equal and opposite → no output: a ZERO at ω = G_m2/C_c' : `frequency = ${fx(x, 2)} × Gm2/Cc`;
    net.setAttribute('fill', nz ? C.bad : C.text);
  }, E.lin);
  S.say(16, 'The new thing is in the numerator: $(1 - sC_c/G_{m2})$. Where does it come from? Node P drives the output Q along <b>two</b> paths.');
  S.say(22, 'The main path: M6 turns $v$ into a current $G_{m2}v$ pulling Q down. The sneak path: $C_c$ passes a current $\\omega C_cv$ straight across, pushing Q up, the opposite sign.');
  S.say(30, 'As frequency rises the sneak current grows. At $\\omega = G_{m2}/C_c$ the two are equal and opposite and nothing reaches the output: a zero. Because of the minus sign it sits in the <b>right</b> half plane.');
  whyBox(S, 1100, 380, 450, 300, '**Why it hurts twice:** a right-half-plane zero makes the gain fall **slower** (like a normal zero) but adds phase **lag** (like a pole): $-\\tan^{-1}(\\omega/\\omega_z)$. It eats phase margin.', 42);
  S.say(42, 'A right-half-plane zero is double trouble: it slows the fall of the gain, like a zero, but it adds phase lag, like a pole. In a PM calculation it is one more angle to subtract.');
  eqAt(S, 'PM = 90^\\circ - \\tan^{-1}\\frac{\\omega_u}{\\omega_{p2}} - \\tan^{-1}\\frac{\\omega_u}{\\omega_z}', 1320, 740, 52, { size: 24, w: 560, color: '#ffd38a' });
  eqAt(S, '\\omega_z = \\frac{1}{C_c(1/G_{m2} - R_z)}:\\;\\; R_z = \\frac{1}{G_{m2}} \\Rightarrow \\omega_z \\to \\infty', 560, 800, 60, { size: 24, w: 900, color: C.ok });
  S.say(52, 'So the full margin of a two-stage op amp: 90°, minus the second pole’s angle, minus the zero’s angle, all at $\\omega_u$.');
  S.say(60, 'The fix: a resistor $R_z$ in series with $C_c$ weakens the sneak path. The zero moves to $1/(C_c(1/G_{m2} - R_z))$, and with $R_z = 1/G_{m2}$ it disappears to infinity.');
});

scene(L17, 'Slew rate of the two-stage op amp', 52, (S) => {
  header(S, 'LEC 17 → EXAMS · SLEWING', 'The tail current charges Cc: SR = I5/Cc (unless M7 runs out first)');
  const f = twoStageFig(S, { x: 0, y: 40, sc: 0.95 });
  f.g.style.opacity = 0; S.fade(f.g, 0.3, 0.7);
  S.flow([[304, 543], [304, 496], [209, 496], [209, 420]], 6, 40, { color: C.cur, speed: 70, w: 4 });
  const X0 = 960, Y0 = 640, W = 560, H = 360;
  const ax = axes(S, X0, Y0, W, H, { x: 'time', y: 'V_out' }); ax.style.opacity = 0; S.fade(ax, 8, 0.5);
  tracePlot(S, (tt) => Math.min(tt, 3) * 0.33, (tt) => X0 + tt * 120, (v) => Y0 - v * 300, 10, 18, C.cur, 4.5);
  const sl = txt(S, X0 + 30, Y0 - 250, 'slope = I₅ / C_c', { size: 22, color: C.cur, weight: 800 }); sl.style.opacity = 0; S.fade(sl, 16, 0.5);
  S.say(0.3, 'Slewing in the two-stage op amp, needed by both mid-sem questions. Give the input a big step: the pair steers completely and all of the tail current $I_5$ flows one way.');
  S.say(8, 'Node P barely moves, because the output stage around $C_c$ holds it, so that whole current goes into $C_c$. The output then ramps at $I_5/C_c$.');
  eqAt(S, 'SR = \\min\\left(\\frac{I_5}{C_c},\\;\\frac{I_7 - I_5}{C_L}\\right)', 1240, 200, 20, { size: 34, w: 600, color: '#ffd38a' });
  S.say(20, 'But the output stage must also charge $C_L$ at that rate, and on a falling edge M7 can only sink its bias current, of which $I_5$ is already going into $C_c$. So $(I_7 - I_5)/C_L$ is a second limit; the smaller one wins.');
  whyBox(S, 940, 690, 620, 150, '**Design use (2025 mid-sem):** the slew rate fixes the tail current: $I_5 = SR \\times C_c$.', 34);
  S.say(34, 'In design questions read it backwards: once $C_c$ is chosen, the slew-rate spec fixes the tail current, $I_5 = SR \\times C_c$.');
});

scene(L17, 'Lecture 17 in one card', 30, (S) => {
  header(S, 'LEC 17 · REMEMBER', 'Everything from Lecture 17');
  remember(S, [
    'Line at $20\\log(1/\\beta)$; lower line (less gain) → later crossing → less PM. The buffer is the hardest case.',
    'Dominant pole: $f_{p1}\' = f_{GX}/(\\beta A_0)$, crossover on $f_{p2}$ → 45°. Costs bandwidth.',
    'Miller: $C_c$ across $-A_2$ looks like $C_c(1+A_2)$ at the input, $C_c(1 + 1/A_2)$ at the output.',
    '$P_1\' = 1/(R_1[C_1 + (1+A_2)C_c]) ≈ 1/(R_1A_2C_c)$, $P_2\' ≈ G_{m2}/C_L$: pole splitting. Two-stage: $R_1 = r_{O2}\\parallel r_{O4}$, $R_2 = r_{O6}\\parallel r_{O7}$.',
    '$\\omega_u = G_{m1}/C_c$; $PM = 90° - \\tan^{-1}(\\omega_u/\\omega_{p2}) - \\tan^{-1}(\\omega_u/\\omega_z)$; $C_c = G_{m1}C_L\\tan PM/G_{m2}$; Allen: $C_c \\ge 0.22C_L$.',
    'RHP zero $\\omega_z = G_{m2}/C_c$ (lags like a pole); $R_z = 1/G_{m2}$ removes it. $SR = \\min(I_5/C_c,\\,(I_7 - I_5)/C_L)$.',
  ], 0.4, 'Lecture 17 · remember');
  S.say(0.4, 'Read it once. Now every compensation question, including the two biggest mid-sem questions.');
});

/* ── questions ── */
scene(L17, 'Past tutorial Ex 5–6: dominant pole for gains down to 20 dB', 52, (S) => {
  pyqFrame(S, {
    tag: 'LEC 17 · QUESTION 1 OF 9', title: 'Two ways to compensate one amplifier', src: 'Past tutorial 2024-25 T2 Ex 5–6',
    q: 'First pole 1 MHz, DC gain 100 dB, second pole 10 MHz. (Ex 5) Where must a <b>new</b> dominant pole go to be stable for closed-loop gains down to 20 dB? (Ex 6) Instead, lower the first pole (second pole unchanged): to what frequency, and by what factor must that node’s capacitance grow?', qh: 250,
    tests: 'the dominant-pole rule $f_D = f_{GX}/(\\beta A_0)$ in its two versions.',
    fig: eqFig([['20\\,\\mathrm{dB} \\Rightarrow \\beta = 0.1,\\;\\; \\beta A_0 = 10^4', 290, 30], ['f_D = \\frac{f_{GX}}{\\beta A_0}', 410, 38, '#ffd38a'], ['\\text{Ex 5: } f_{GX} = 1\\,\\mathrm{MHz};\\;\\; \\text{Ex 6: } f_{GX} = 10\\,\\mathrm{MHz}', 530, 26]]),
    steps: [
      { t: 6, title: 'Ex 5: a new pole; the crossover must land on the old first pole (1 MHz)', tex: stepTex('pyq-t24-ex56', 0), try: { q: 'βA₀ = 10⁴, f_GX = 1 MHz. New dominant pole f_D (Hz)?', answer: ans('pyq-t24-ex56', 'fd'), unit: 'Hz', tol: 0.01, hint: 'Four decades of −20 dB/dec below 1 MHz.' }, say: '1 MHz over $10^4$: 100 Hz.' },
      { t: 15, title: 'Ex 6: move the first pole itself; now the crossover can sit on the 10 MHz pole', tex: stepTex('pyq-t24-ex56', 1), try: { q: 'f_GX = 10 MHz. New first pole (Hz)?', answer: ans('pyq-t24-ex56', 'fp1'), unit: 'Hz', tol: 0.01, hint: '10 MHz / 10⁴.' }, say: '1 kHz: ten times more bandwidth than Ex 5, because the old first pole is gone.' },
      { t: 23, title: 'The pole is 1/(RC): C grows by the same factor', tex: stepTex('pyq-t24-ex56', 2), try: { q: 'Pole moves from 1 MHz to 1 kHz. Capacitance factor?', answer: ans('pyq-t24-ex56', 'cf'), unit: '×', tol: 0.01, hint: 'Same R.' }, say: '1000 times the capacitance. That is why we use Miller: a capacitor 1000 times bigger is impossible on chip.' },
      { t: 31, ans: true, title: '**Answers:** Ex 5: 100 Hz · Ex 6: 1 kHz, C × 1000', say: 'Lowering an existing pole beats adding a new one.' },
    ],
  });
}, { q: 'Past tutorial Ex 5–6' });

scene(L17, 'Problem Set 2 P3: compensate your page’s amplifier', 56, (S) => {
  pyqFrame(S, {
    tag: 'LEC 17 · QUESTION 2 OF 9', title: '100 dB, poles at 1 kHz, 1 MHz, 10 MHz, gain 10', src: 'Problem Set 2 P3',
    q: 'Your Lec 17 amplifier: $A_0$ = 100 dB, poles at 1 kHz, 1 MHz and 10 MHz, closed-loop gain 10 (β = 0.1). (a) PM as built. (b) Keeping the 1 MHz and 10 MHz poles, where must the first pole go for PM = 45°? (c) By what factor must its capacitor grow?', qh: 240,
    tests: 'the PM recipe with three poles, then dominant-pole compensation with two remaining poles.',
    fig: eqFig([['\\beta A_0 = 10^4', 270, 32], ['\\tan^{-1}\\frac{f}{1\\,\\mathrm{M}} + \\tan^{-1}\\frac{f}{10\\,\\mathrm{M}} = 45^\\circ', 390, 28], ["f'_{p1} = \\frac{f_{GX}}{\\beta A_0}", 510, 34, '#ffd38a']]),
    steps: [
      { t: 6, title: '(a) Find the crossover numerically, then the phase', tex: stepTex('bank-ps2-p3', 0), try: { q: '(a) PM as built (degrees)?', answer: ans('bank-ps2-p3', 'pm0'), unit: '°', tol: 0.1, abs: 0.3, hint: 'f_GX ≈ 3 MHz: angles atan(3000) + atan(3) + atan(0.3).' }, say: 'The crossover is at 3 MHz, where the three poles have used 178.4°: PM = 1.6°. It would ring for ages.' },
      { t: 16, title: '(b) The two high poles may use only 90° − 45° = 45°', tex: stepTex('bank-ps2-p3', 1), say: 'The new first pole will give 90°, so the other two may use 45° between them: that happens at 844 kHz.' },
      { t: 23, title: '−20 dB/dec from βA0 = 10⁴ down to 1 at 844 kHz', tex: stepTex('bank-ps2-p3', 2), try: { q: '(b) f_GX = 844 kHz, βA₀ = 10⁴. New first pole (Hz)?', answer: ans('bank-ps2-p3', 'fd'), unit: 'Hz', tol: 0.03, hint: '844k / 10⁴.' }, say: '84.4 Hz.' },
      { t: 31, title: '(c) The capacitor factor', tex: stepTex('bank-ps2-p3', 3), try: { q: '(c) 1 kHz → 84.4 Hz: capacitor factor?', answer: ans('bank-ps2-p3', 'k'), unit: '×', tol: 0.03, hint: '1000/84.4.' }, say: '11.8 times.' },
      { t: 38, ans: true, title: '**Answers:** (a) 1.6° · (b) 84.4 Hz · (c) 11.8×', say: 'Notice we never needed a 45° shortcut here: two poles share the 45°, so solve the angle equation.' },
    ],
  });
}, { q: 'Problem Set 2 P3' });

scene(L17, '2024 Quiz 2 Q1: GBW, PM and Cc from Bode data', 52, (S) => {
  pyqFrame(S, {
    tag: 'LEC 17 · QUESTION 3 OF 9', title: 'Read a Miller op amp’s numbers', src: 'Quiz 2 2024-25 Q1 · 6 marks', paper: 'q24bq1',
    q: 'Miller-compensated two-stage: DC gain 80 dB, poles at 15.9 kHz and 740 MHz, a zero at 3.18 GHz, $C_L$ = 5 pF. Find the GBW, the PM and $C_c$.', qh: 190,
    tests: 'GBW = $A_0f_{p1}$, the PM with a second pole and an RHP zero, and $\\omega_{p2} = g_{m2}/C_L$, $\\omega_z = g_{m2}/C_c$.',
    fig: eqFig([['GBW = A_0\\,f_{p1}', 270, 32], ['PM = 90^\\circ - \\tan^{-1}\\tfrac{GBW}{f_{p2}} - \\tan^{-1}\\tfrac{GBW}{f_z}', 390, 28], ['g_{m2} = 2\\pi f_{p2}C_L,\\;\\; C_c = \\frac{g_{m2}}{2\\pi f_z}', 510, 28, '#ffd38a']]),
    steps: [
      { t: 6, title: 'GBW = 10⁴ × 15.9 kHz', tex: stepTex('pyq-q24b-q1', 0), try: { q: 'GBW (Hz)?', answer: ans('pyq-q24b-q1', 'gbw'), unit: 'Hz', tol: 0.01, hint: '80 dB = 10⁴.' }, say: '159 MHz.' },
      { t: 13, title: 'PM: the second pole and the RHP zero both subtract', tex: stepTex('pyq-q24b-q1', 1), try: { q: 'PM = 90° − atan(159/740) − atan(159/3180)?', answer: ans('pyq-q24b-q1', 'pm'), unit: '°', tol: 0.01, hint: '12.1° + 2.9°.' }, say: '12.1° and 2.9°: PM = 75°.' },
      { t: 21, title: 'gm2 from the second pole, then Cc from the zero', tex: stepTex('pyq-q24b-q1', 2), try: { q: 'g_m2 = 2π(740M)(5p) = 23.2 mS. C_c = g_m2/(2π·3.18 GHz) in F (type e.g. 1.2p)?', answer: 1.161e-12, unit: 'F', tol: 0.02, hint: '23.25 mS / 19.98 G.' }, say: '$g_{m2}$ = 23.2 mS, so $C_c$ = 1.16 pF.' },
      { t: 30, ans: true, title: '**Answers:** GBW = 159 MHz · PM = 75° · $C_c$ = 1.16 pF', say: 'Every number in a Miller op amp is tied to $g_{m1}$, $g_{m2}$, $C_c$ and $C_L$.' },
    ],
  });
}, { q: 'Quiz 2 2024 Q1' });

scene(L17, '2023 mid-sem Q5: K at PM = 50°, and Cc versus CL', 52, (S) => {
  pyqFrame(S, {
    tag: 'LEC 17 · QUESTION 4 OF 9', title: 'A peak from a margin, then Allen’s relation', src: 'Mid-sem 2023-24 Q5 · 5 marks', paper: 'm23q5',
    q: '(a) If PM = 50°, $|V_{out}/V_{in}(j\\omega_{GX})| = K/\\beta$. Find K. (b) In a Miller-compensated OTA, for PM = 45° with the RHP zero at 10 × GBW, what relation is needed between $C_L$ and $C_c$?', qh: 230,
    tests: 'Lecture 16’s peak formula, and the PM equation of a Miller op amp with its zero.',
    fig: eqFig([['K = \\frac{1}{2\\sin(PM/2)}', 270, 34], ['45^\\circ = 90^\\circ - \\tan^{-1}\\tfrac{\\omega_u}{\\omega_{p2}} - \\tan^{-1}(0.1)', 390, 26], ['\\omega_z = 10\\omega_u \\Rightarrow g_{m2} = 10g_{m1}', 500, 28, '#ffd38a']]),
    steps: [
      { t: 6, title: '(a) K = 1/(2 sin 25°)', tex: stepTex('pyq-m23-q5', 0), try: { q: '(a) K for PM = 50°?', answer: ans('pyq-m23-q5', 'k'), unit: '', tol: 0.01, hint: 'sin 25° = 0.423.' }, say: '1.18: an 18 % peak.' },
      { t: 14, title: '(b) The zero at 10·GBW takes tan⁻¹(0.1) = 5.71°', tex: stepTex('pyq-m23-q5', 1), say: 'The zero takes 5.7°, so the second pole may take only 39.3° at the GBW.' },
      { t: 21, title: 'ωp2 = ωu/tan 39.29°, with gm2 = 10gm1', tex: stepTex('pyq-m23-q5', 2), try: { q: 'g_m2/C_L = g_m1/(C_c·tan 39.29°), g_m2 = 10 g_m1. C_c/C_L ≥ ?', answer: ans('pyq-m23-q5', 'ratio'), unit: '', tol: 0.02, hint: 'C_c/C_L = 1/(10·tan 39.29°).' }, say: '$C_c \\ge 0.122\\,C_L$. For 60° the same steps give Allen’s 0.22.' },
      { t: 30, ans: true, title: '**Answers:** (a) K = 1.18 · (b) $C_c \\ge 0.122\\,C_L$', say: 'Small question, two big ideas: peaking from PM, and the zero’s share of the margin.' },
    ],
  });
}, { q: 'Mid-sem 2023 Q5' });

scene(L17, 'Razavi Ex 10.6: a first estimate of Cc', 42, (S) => {
  pyqFrame(S, {
    tag: 'LEC 17 · QUESTION 5 OF 9', title: 'Cc for 45° in unity feedback', src: 'Razavi Example 10.6',
    q: 'Miller two-stage: $g_{m1}$ = 1 mS, $g_{m9}$ = 5 mS (second stage), $C_L$ = 2 pF. Estimate $C_c$ for 45° in unity feedback: (a) ignoring the second pole’s effect on the size, (b) including it.', qh: 210,
    tests: 'GBW = $g_{m1}/C_c$ placed on $\\omega_{p2} = g_{m9}/C_L$.',
    fig: eqFig([['\\frac{g_{m1}}{C_c} = \\frac{g_{m9}}{C_L}\\;\\;(45^\\circ)', 320, 34], ['\\text{(b): } |\\beta A| \\text{ is already } 1/\\sqrt2 \\text{ at } \\omega_{p2}', 460, 26]]),
    steps: [
      { t: 6, title: '(a) Crossover on the second pole', tex: stepTex('bank-ex10-6', 1), try: { q: '(a) C_c = (g_m1/g_m9)·C_L in F (type 0.4p)?', answer: ans('bank-ex10-6', 'a'), unit: 'F', tol: 0.02, hint: '(1/5) × 2 pF.' }, say: '0.4 pF.' },
      { t: 14, title: '(b) The second pole already cuts the size by √2', tex: stepTex('bank-ex10-6', 2), try: { q: '(b) C_c = g_m1·C_L/(√2·g_m9) in F?', answer: ans('bank-ex10-6', 'b'), unit: 'F', tol: 0.02, hint: '0.4 pF / 1.414.' }, say: '0.28 pF: a slightly smaller capacitor is enough.' },
      { t: 22, ans: true, title: '**Answers:** (a) 0.4 pF · (b) 0.28 pF', say: 'A first estimate: real designs take 60° and a little extra.' },
    ],
  });
}, { q: 'Razavi Ex 10.6' });

const M24 = 'pyq-m24-q2';
scene(L17, '2024 mid-sem Q2, part 1: SR, GBW, gain, bandwidth', 66, (S) => {
  pyqFrame(S, {
    tag: 'LEC 17 · QUESTION 6 OF 9 (PART 1)', title: 'Analyse a Miller two-stage op amp (15 marks)', src: 'Mid-sem 2024-25 Q2 · 15 marks', paper: 'm24q2',
    q: '$I_1$ = 10 µA, $(W/L)_6$ = 10, $(W/L)_5$ = 20, $(W/L)_{1,2}$ = 10, $(W/L)_{3,4}$ = 10, $(W/L)_7$ = 80, $C_c$ = 0.22 pF, $C_L$ = 1 pF. SR, GBW, DC gain, bandwidth, second pole, RHP zero, PM. $V_{DD}$ = 1.8 V, $\\mu_nC_{ox}$ = 100, $\\mu_pC_{ox}$ = 50 µA/V², $\\lambda_p$ = 0.2, $\\lambda_n$ = 0.1 V⁻¹.', qh: 280,
    tests: 'every Lecture 17 formula on one circuit: mirror ratios for currents, $SR = I_5/C_c$, $GBW = g_{m1}/2\\pi C_c$, $A_1A_2$, $f_{p2} = g_{m7}/2\\pi C_L$, $f_z = g_{m7}/2\\pi C_c$, and the PM.',
    fig: paperFig('m24q2f', [['SR = \\frac{I_5}{C_c},\\;\\; GBW = \\frac{g_{m1}}{2\\pi C_c}', 600, 28], ['A_0 = g_{m1}(r_{O2}\\parallel r_{O4})\\cdot g_{m7}(r_{O6}\\parallel r_{O7}),\\;\\; f_{-3dB} = \\frac{GBW}{A_0}', 700, 24, '#ffd38a']], 400),
    steps: [
      { t: 6, title: 'Currents by mirror ratios, then SR', tex: stepTex(M24, 0), try: { q: 'I₅ = 20 µA, C_c = 0.22 pF. SR in V/s (type 90.9M)?', answer: ans(M24, 'sr'), unit: 'V/s', tol: 0.01, hint: '20µ / 0.22p.' }, say: 'M5 is twice M6, so $I_5$ = 20 µA and each input device carries 10 µA. SR = 90.9 V/µs.' },
      { t: 15, title: 'GBW from gm1', tex: stepTex(M24, 1), try: { q: 'g_m1 = √(2·50µ·10·10µ) = 0.1 mS. GBW (Hz)?', answer: ans(M24, 'gbw'), unit: 'Hz', tol: 0.01, hint: '0.1 mS / (2π·0.22 pF).' }, say: '72.3 MHz.' },
      { t: 24, title: 'I7 and gm7 (VGS7 = VGS4: currents scale with W/L)', tex: stepTex(M24, 2), say: '$V_{GS7} = V_{GS4}$, so $I_7$ scales with W/L: 80/10 × 10 µA = 80 µA, and $g_{m7}$ = 1.13 mS.' },
      { t: 31, title: 'DC gain = A1 × A2', tex: 'A_0 = \\underbrace{0.1\\,\\mathrm{mS}(500\\,\\mathrm{k}\\parallel 1\\,\\mathrm{M})}_{33.3}\\times\\underbrace{1.13\\,\\mathrm{mS}(125\\,\\mathrm{k}\\parallel 62.5\\,\\mathrm{k})}_{47.1} = 1571', try: { q: 'A₁ = 33.3, A₂ = 1.13 mS × 41.7 kΩ. A₀?', answer: ans(M24, 'a0'), unit: '', tol: 0.02, hint: 'A₂ = 47.1.' }, say: '$A_1$ = 33.3, $A_2$ = 47.1: $A_0$ = 1571, about 64 dB.' },
      { t: 41, title: 'Bandwidth = GBW / A0', tex: stepTex(M24, 4), try: { q: 'Bandwidth (Hz)?', answer: ans(M24, 'bw'), unit: 'Hz', tol: 0.02, hint: '72.3 MHz / 1571.' }, say: '46 kHz: the dominant pole.' },
      { t: 49, ans: true, title: '**So far:** SR 90.9 V/µs · GBW 72.3 MHz · $A_0$ = 1571 · BW 46 kHz', say: 'Part 2: the second pole, the zero and the margin.' },
    ],
  });
}, { q: 'Mid-sem 2024 Q2 (1)' });

scene(L17, '2024 mid-sem Q2, part 2: second pole, zero, PM', 50, (S) => {
  pyqFrame(S, {
    tag: 'LEC 17 · QUESTION 6 OF 9 (PART 2)', title: 'Second pole, RHP zero and phase margin', src: 'Mid-sem 2024-25 Q2 · 15 marks',
    q: 'Same op amp: $g_{m7}$ = 1.13 mS, $C_c$ = 0.22 pF, $C_L$ = 1 pF, GBW = 72.3 MHz. Find the second pole, the RHP zero and the phase margin (β = 1).', qh: 180,
    tests: '$f_{p2} = g_{m7}/2\\pi C_L$, $f_z = g_{m7}/2\\pi C_c$ and the three-angle PM.',
    fig: paperFig('m24q2f', [['f_{p2} = \\frac{g_{m7}}{2\\pi C_L},\\quad f_z = \\frac{g_{m7}}{2\\pi C_c}', 600, 28], ['PM = 90^\\circ - \\tan^{-1}\\tfrac{GBW}{f_{p2}} - \\tan^{-1}\\tfrac{GBW}{f_z}', 700, 26, '#ffd38a']], 400),
    steps: [
      { t: 6, title: 'Second pole', tex: 'f_{p2} = \\frac{1.13\\,\\mathrm{mS}}{2\\pi(1\\,\\mathrm{pF})} = 180\\,\\mathrm{MHz}', try: { q: 'f_p2 (Hz)?', answer: ans(M24, 'fp2'), unit: 'Hz', tol: 0.02, hint: '1.131 mS / 6.283 pF.' }, say: '180 MHz.' },
      { t: 13, title: 'RHP zero', tex: stepTex(M24, 6), try: { q: 'f_z (Hz)?', answer: ans(M24, 'fz'), unit: 'Hz', tol: 0.02, hint: 'Same g_m7, but C_c = 0.22 pF.' }, say: '818 MHz.' },
      { t: 20, title: 'Phase margin at the GBW', tex: stepTex(M24, 7), try: { q: 'PM = 90° − atan(72.3/180) − atan(72.3/818)?', answer: ans(M24, 'pm'), unit: '°', tol: 0.01, hint: '21.9° + 5.05°.' }, say: '21.9° from the pole, 5.1° from the zero: PM = 63.1°.' },
      { t: 28, ans: true, title: '**Answers:** $f_{p2}$ = 180 MHz · $f_z$ = 818 MHz · PM = 63.1°', say: 'Fifteen marks, one dictionary: $G_{m1} = g_{m1}$, $G_{m2} = g_{m7}$, $C_c$, $C_L$.' },
    ],
  });
}, { q: 'Mid-sem 2024 Q2 (2)' });

scene(L17, 'Problem Set 2 P4: add a second stage and compensate', 60, (S) => {
  pyqFrame(S, {
    tag: 'LEC 17 · QUESTION 7 OF 9', title: 'Your exam OTA + a CS stage', src: 'Problem Set 2 P4',
    q: 'OTA: $G_{m1}$ = 0.8 mS, $R_1$ = 111 kΩ, $I_{SS}$ = 120 µA. CS stage: $G_{m2}$ = 4 mS, $R_2$ = 20 kΩ, $I_7$ = 500 µA, $C_L$ = 4 pF. With $R_z = 1/G_{m2}$: (a) $C_c$ for 60° (β = 1); (b) GBW; (c) $P_1\'$; (d) $R_z$; (e) slew rate.', qh: 240,
    tests: 'the design chain: $C_c$ from the margin, GBW, the Miller pole, $R_z$, and the two slew limits.',
    fig: eqFig([['C_c = \\frac{G_{m1}C_L\\tan 60^\\circ}{G_{m2}}', 260, 30], ["P_1' = \\frac{1}{2\\pi R_1A_2C_c},\\;\\; A_2 = G_{m2}R_2", 380, 28], ['SR = \\min\\left(\\tfrac{I_{SS}}{C_c},\\tfrac{I_7 - I_{SS}}{C_L}\\right)', 500, 28, '#ffd38a']]),
    steps: [
      { t: 6, title: '(a) Cc for 60°', tex: stepTex('bank-ps2-p4', 0), try: { q: '(a) C_c in F (type 1.39p)?', answer: 1.3856e-12, unit: 'F', tol: 0.02, hint: '0.8m × 4p × 1.732 / 4m.' }, say: '1.39 pF.' },
      { t: 14, title: '(b) GBW', tex: stepTex('bank-ps2-p4', 1), try: { q: '(b) GBW (Hz)?', answer: ans('bank-ps2-p4', 'fu'), unit: 'Hz', tol: 0.02, hint: '0.8 mS/(2π·1.39 pF).' }, say: '91.9 MHz.' },
      { t: 22, title: '(c) The Miller pole', tex: stepTex('bank-ps2-p4', 2), try: { q: '(c) A₂ = 80. P₁′ (Hz)?', answer: ans('bank-ps2-p4', 'p1'), unit: 'Hz', tol: 0.02, hint: '1/(2π·111k·80·1.39p).' }, say: '12.9 kHz.' },
      { t: 30, title: '(d) Rz', tex: stepTex('bank-ps2-p4', 3), try: { q: '(d) R_z (Ω)?', answer: ans('bank-ps2-p4', 'rz'), unit: 'Ω', tol: 0.01, hint: '1/4 mS.' }, say: '250 Ω.' },
      { t: 37, title: '(e) Slew rate: the smaller limit', tex: stepTex('bank-ps2-p4', 4), try: { q: '(e) SR in V/s?', answer: ans('bank-ps2-p4', 'sr'), unit: 'V/s', tol: 0.02, hint: 'min(120µ/1.39p, 380µ/4p).' }, say: '86.6 V/µs from $C_c$; the output stage could do 95, so $C_c$ limits.' },
      { t: 45, ans: true, title: '**Answers:** 1.39 pF · 91.9 MHz · 12.9 kHz · 250 Ω · 86.6 V/µs', say: 'The order to remember: margin → $C_c$ → GBW → Miller pole → $R_z$ → slew.' },
    ],
  });
}, { q: 'Problem Set 2 P4' });

const M25 = 'pyq-m25-q2';
scene(L17, '2025 mid-sem Q2, part 1: Cc, I5, (W/L)1 and (W/L)3', 62, (S) => {
  pyqFrame(S, {
    tag: 'LEC 17 · QUESTION 8 OF 9 (PART 1)', title: 'Design a Miller two-stage op amp (14 marks)', src: 'Mid-sem 2025-26 Q2 · 14 marks', paper: 'm25q2',
    q: 'DC gain 60 dB, GBW 50 MHz, PM ≥ 60°, SR 50 V/µs, ICMR(+) 1.6 V, ICMR(−) 0.9 V, $C_L$ = 5 pF; minimum $C_c$ for 60°. $\\mu_nC_{ox}$ = 300, $\\mu_pC_{ox}$ = 60 µA/V², $V_{th1}$ = 0.47–0.59 V, $|V_{th3}|_{max}$ = 0.51 V, $V_{DD}$ = 1.8 V.', qh: 250,
    tests: 'Allen’s design order: $C_c$ from the margin, $I_5$ from SR, $(W/L)_1$ from GBW, $(W/L)_3$ from ICMR(+), $(W/L)_5$ from ICMR(−), then the output stage.',
    fig: paperFig('m25q2f', [['C_c = 0.22\\,C_L,\\quad I_5 = SR\\cdot C_c', 580, 26], ['g_{m1} = 2\\pi\\,GBW\\,C_c,\\;\\; (W/L)_1 = \\frac{g_{m1}^2}{2\\mu_nC_{ox}I_{D1}}', 670, 24], ['(W/L)_3 = \\frac{2I_{D1}}{\\mu_pC_{ox}(V_{DD} - V_{in,max} - |V_{th3}|_{max} + V_{th1,min})^2}', 770, 20, '#ffd38a']], 400),
    steps: [
      { t: 6, title: '① Cc for 60° (zero at 10·GB)', tex: stepTex(M25, 0), try: { q: '① C_c = 0.22 × 5 pF, in F?', answer: ans(M25, 'cc'), unit: 'F', tol: 0.01, hint: 'Allen’s rule.' }, say: '1.1 pF.' },
      { t: 13, title: '② Slew rate sets the tail', tex: stepTex(M25, 1), try: { q: '② I₅ = SR × C_c in A (type 55u)?', answer: ans(M25, 'i'), unit: 'A', tol: 0.01, hint: '50 V/µs × 1.1 pF.' }, say: '55 µA.' },
      { t: 20, title: '③ GBW sets gm1, the square law sets (W/L)1', tex: stepTex(M25, 2), try: { q: '③ (W/L)₁,₂?', answer: ans(M25, 'wl1'), unit: '', tol: 0.02, hint: 'g_m1 = 2π·50M·1.1p = 0.346 mS; I_D1 = 27.5 µA.' }, say: '$g_{m1}$ = 0.346 mS and $(W/L)_{1,2}$ = 7.24.' },
      { t: 30, title: '④ ICMR(+): M1 at its edge against M3’s diode', tex: stepTex(M25, 3), try: { q: '④ (W/L)₃,₄?', answer: ans(M25, 'wl3'), unit: '', tol: 0.02, hint: 'Overdrive left for M3: 1.8 − 1.6 − 0.51 + 0.47 = 0.16 V.' }, say: 'Only 0.16 V of overdrive left for M3: $(W/L)_{3,4}$ = 35.8.' },
      { t: 40, ans: true, title: '**So far:** $C_c$ = 1.1 pF · $I_5$ = 55 µA · $(W/L)_1$ = 7.24 · $(W/L)_3$ = 35.8', say: 'Part 2: the tail and the output stage.' },
    ],
  });
}, { q: 'Mid-sem 2025 Q2 (1)' });

scene(L17, '2025 mid-sem Q2, part 2: (W/L)5, (W/L)7, (W/L)8', 54, (S) => {
  pyqFrame(S, {
    tag: 'LEC 17 · QUESTION 8 OF 9 (PART 2)', title: 'The tail and the output stage', src: 'Mid-sem 2025-26 Q2 · 14 marks',
    q: 'Continue: ICMR(−) = 0.9 V sets $(W/L)_5$ (= $(W/L)_6$); the RHP zero at 10·GB sets $g_{m7} = 10g_{m1}$; a perfect mirror means $|V_{ov7}| = |V_{ov3}|$; M8 mirrors M5 and carries $I_7$.', qh: 210,
    tests: 'the floor check for the tail, the zero rule for the output device, and a mirror ratio for its current source.',
    fig: paperFig('m25q2f', [['V_{ov5} = V_{in,min} - V_{GS1} - \\ldots', 580, 24], ['g_{m7} = 10\\,g_{m1},\\;\\; (W/L)_7 = \\frac{g_{m7}}{\\mu_pC_{ox}|V_{ov3}|}', 670, 24], ['(W/L)_8 = (W/L)_5\\,\\frac{I_7}{I_5}', 770, 26, '#ffd38a']], 400),
    steps: [
      { t: 6, title: '⑤ ICMR(−): what is left for the tail', tex: stepTex(M25, 4), try: { q: '⑤ V_ov5 = 0.151 V, I₅ = 55 µA. (W/L)₅ = 2I₅/(µnCox·V_ov5²)?', answer: ans(M25, 'wl5'), unit: '', tol: 0.02, hint: '110µ/(300µ × 0.0228).' }, say: '$(W/L)_{5,6}$ = 16.1.' },
      { t: 15, title: '⑥ Zero at 10·GB → gm7 = 10gm1; same overdrive as M3', tex: stepTex(M25, 5), try: { q: '⑥ g_m7 = 3.46 mS, |V_ov| = 0.16 V. (W/L)₇?', answer: ans(M25, 'wl7'), unit: '', tol: 0.02, hint: 'g_m = µpCox(W/L)V_ov.' }, say: '$(W/L)_7$ = 360: a wide output device.' },
      { t: 24, title: '⑦ M8 carries I7', tex: stepTex(M25, 6), try: { q: '⑦ I₇ = 276 µA. (W/L)₈ = 16.11 × 276/55?', answer: ans(M25, 'wl8'), unit: '', tol: 0.02, hint: 'Mirror ratio.' }, say: '$I_7$ = 276 µA and $(W/L)_8$ = 81.' },
      { t: 33, ans: true, title: '**All answers:** $C_c$ 1.1 pF · $I_5$ 55 µA · (W/L)₁ 7.24 · (W/L)₃ 35.8 · (W/L)₅ 16.1 · (W/L)₇ 360 · (W/L)₈ 81', say: 'Seven steps in a fixed order. Write the order down first in the exam, then fill in numbers.' },
    ],
  });
}, { q: 'Mid-sem 2025 Q2 (2)' });

/* compre 2023-24 Q8, computed here from the printed data (checks: key 115.6 µA, 1581, 16.04 MHz, 46.26 V/µs, 7.514 mW, 50.91°) */
const CQ8 = (() => {
  const kn = 110e-6, kp = 50e-6, ln = 0.04, lp = 0.05, vt = 0.7, vsup = 5;
  const x = (vsup - 2 * vt) / (Math.sqrt(2 / kn) + Math.sqrt(2 / kp)), i8 = x * x;
  const i5 = 2 * i8, i7 = 10 * i8, id1 = i5 / 2;
  const gm1 = Math.sqrt(2 * kn * 10 * id1), r1 = 1 / (1 / (1 / (ln * id1)) + 1 / (1 / (lp * id1)));
  const gm6 = Math.sqrt(2 * kp * 100 * i7), r2 = 1 / (ln * i7 + lp * i7);
  const a0 = gm1 * r1 * gm6 * r2, cc = 5e-12, cl = 20e-12;
  const gbw = gm1 / (2 * Math.PI * cc), sr = i5 / cc, pw = vsup * (i8 + i5 + i7);
  const fp2 = gm6 / (2 * Math.PI * cl), fz = gm6 / (2 * Math.PI * cc);
  const pm = 90 - Math.atan(gbw / fp2) * DEG - Math.atan(gbw / fz) * DEG;
  return { i8, i5, i7, gm1, a0, gbw, sr, pw, fp2, fz, pm, gm6 };
})();
scene(L17, 'Compre 2023-24 Q8: a full two-stage analysis', 64, (S) => {
  pyqFrame(S, {
    tag: 'LEC 17 · QUESTION 9 OF 9 (COMPRE STYLE)', title: 'Currents, gain, GBP, SR, power, PM', src: 'Compre 2023-24 Q8 · 10 marks', paper: 'c24q8',
    q: 'Two-stage op amp, ±2.5 V, $C_c$ = 5 pF, $C_L$ = 20 pF, sizes in the figure. $V_{Tn} = |V_{Tp}|$ = 0.7 V, $\\mu_nC_{ox}$ = 110, $\\mu_pC_{ox}$ = 50 µA/V², $\\lambda_n$ = 0.04, $\\lambda_p$ = 0.05 V⁻¹. Find $I_8$, $I_5$, $I_7$, the DC gain, GBP, SR, power and PM.', qh: 250,
    tests: 'the same Miller dictionary on a ±2.5 V circuit: a diode stack sets $I_8$, mirrors give the rest.',
    fig: paperFig('c24q8f', [['5\\,\\mathrm{V} = \\sqrt{\\tfrac{2I_8}{\\mu_nC_{ox}}} + 0.7 + \\sqrt{\\tfrac{2I_8}{\\mu_pC_{ox}}} + 0.7,\\;\\; I_5 = 2I_8,\\; I_7 = 10I_8', 590, 22], ['A_0 = g_{m1}(r_{O2}\\parallel r_{O4})\\cdot g_{m6}(r_{O6}\\parallel r_{O7})', 680, 24], ['PM = 90^\\circ - \\tan^{-1}\\tfrac{GBP}{f_{p2}} - \\tan^{-1}\\tfrac{GBP}{f_z}', 770, 24, '#ffd38a']], 400),
    steps: [
      { t: 6, title: 'M9 and M8 are diodes stacked across 5 V', tex: `I_8 = ${fx(CQ8.i8 * 1e6, 4)}\\,\\mu\\mathrm{A},\\; I_5 = ${fx(CQ8.i5 * 1e6, 4)}\\,\\mu\\mathrm{A},\\; I_7 = ${fx(CQ8.i7 * 1e3, 4)}\\,\\mathrm{mA}`, try: { q: 'Solve 3.6 V = √I₈(√(2/110µ) + √(2/50µ)). I₈ in A (type 115u)?', answer: CQ8.i8, unit: 'A', tol: 0.01, hint: 'The square roots are 134.8 and 200: √I₈ = 3.6/334.8.' }, say: 'The overdrives share 3.6 V: $I_8$ = 115.6 µA. M5 is twice M8 and M7 ten times: 231 µA and 1.156 mA.' },
      { t: 16, title: 'DC gain', tex: `A_0 = ${fx(CQ8.gm1 * 1e3, 3)}\\,\\mathrm{mS}\\times 96.1\\,\\mathrm{k}\\times ${fx(CQ8.gm6 * 1e3, 3)}\\,\\mathrm{mS}\\times 9.61\\,\\mathrm{k} = ${fx(CQ8.a0, 4)}`, try: { q: 'A₀ (V/V)?', answer: CQ8.a0, unit: '', tol: 0.02, hint: 'A₁ = 48.5, A₂ = 32.7.' }, say: '$A_1$ = 48.5 and $A_2$ = 32.7: about 1580 (the key: 1581).' },
      { t: 26, title: 'GBP and slew rate', tex: `GBP = \\frac{g_{m1}}{2\\pi C_c} = ${fx(CQ8.gbw / 1e6, 4)}\\,\\mathrm{MHz},\\;\\; SR = \\frac{I_5}{C_c} = ${fx(CQ8.sr / 1e6, 4)}\\,\\mathrm{V/\\mu s}`, try: { q: 'GBP (Hz)?', answer: CQ8.gbw, unit: 'Hz', tol: 0.01, hint: '0.504 mS/(2π·5 pF).' }, say: '16.05 MHz and 46.2 V/µs.' },
      { t: 35, title: 'Power and phase margin', tex: `P = 5\\,\\mathrm{V}\\times(I_8 + I_5 + I_7) = ${fx(CQ8.pw * 1e3, 4)}\\,\\mathrm{mW},\\;\\; PM = ${fx(CQ8.pm, 4)}^\\circ`, try: { q: 'PM = 90° − atan(GBP/f_p2) − atan(GBP/f_z), f_p2 = 27.1 MHz, f_z = 108 MHz?', answer: CQ8.pm, unit: '°', tol: 0.01, hint: '30.7° + 8.4°.' }, say: '7.51 mW, and a margin of 50.9°: matches the key exactly.' },
      { t: 44, ans: true, title: `**Answers:** 115.6 µA, 231 µA, 1.156 mA · $A_0$ ≈ 1580 · 16.05 MHz · 46.2 V/µs · 7.51 mW · 50.9°`, say: 'Note the printed “open loop unity gain bandwidth 1 MHz” is never used: the answer key computes the GBP from the circuit.' },
    ],
  });
}, { q: 'Compre 2023-24 Q8' });
