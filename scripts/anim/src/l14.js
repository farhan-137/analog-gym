/* Lecture 14: slewing in the telescopic and folded cascode; the concept of stability; Barkhausen; complex numbers; two poles. */
'use strict';
const L14 = 'Lec 14 · Slewing & stability';

function teleFD(S) {
  const g = S.g(); const r = S.into(g);
  rail(S, 300, 860, 160);
  const L = 470, R = 690;
  const row = (y, a, b, p, gate) => { const A = fet(S, L, y, { p, name: a, right: true, gl: 26, nameSide: 'l' }); const B = fet(S, R, y, { p, name: b, gl: 26, nameSide: 'r' }); wire(S, [[A.gate[0], y], [B.gate[0], y]]); txt(S, 580, y - 9, gate, { size: 17, color: C.muted, anchor: 'middle' }); };
  row(215, 'M7', 'M8', true, 'V_b3'); wire(S, [[L, 160], [L, 165]]); wire(S, [[R, 160], [R, 165]]);
  row(315, 'M5', 'M6', true, 'V_b2');
  wire(S, [[L, 365], [L, 405]]); wire(S, [[R, 365], [R, 405]]); dot(S, L, 385); dot(S, R, 385);
  wire(S, [[L, 385], [350, 385]]); wire(S, [[R, 385], [810, 385]]); cap(S, 350, 385, { label: 'C_L' }); cap(S, 810, 385, { label: 'C_L' });
  txt(S, L - 12, 378, 'V_out1', { size: 18, color: C.volt, weight: 700, anchor: 'end' }); txt(S, R + 12, 378, 'V_out2', { size: 18, color: C.volt, weight: 700 });
  row(455, 'M3', 'M4', false, 'V_b1');
  wire(S, [[L, 505], [L, 515]]); wire(S, [[R, 505], [R, 515]]);
  nmos(S, L, 565, { name: 'M1', gate: 'V_in1' }); nmos(S, R, 565, { name: 'M2', gate: 'V_in2', right: true });
  wire(S, [[L, 615], [L, 640], [R, 640], [R, 615]]); isrc(S, 580, 685, { label: 'I_SS', len: 45 }); gnd(S, 580, 730);
  r(); return g;
}
/* fully differential folded cascode of the Lec 14 page */
function foldFD(S) {
  const g = S.g(); const r = S.into(g);
  rail(S, 160, 900, 150);
  const L = 560, R = 780;
  const row = (y, a, b, p, gate) => { const A = fet(S, L, y, { p, name: a, right: true, gl: 26, nameSide: 'l' }); const B = fet(S, R, y, { p, name: b, gl: 26, nameSide: 'r' }); wire(S, [[A.gate[0], y], [B.gate[0], y]]); txt(S, 670, y - 9, gate, { size: 17, color: C.muted, anchor: 'middle' }); };
  row(205, 'M9', 'M10', true, 'V_b4'); wire(S, [[L, 150], [L, 155]]); wire(S, [[R, 150], [R, 155]]);
  wire(S, [[L, 255], [L, 280]]); wire(S, [[R, 255], [R, 280]]); dot(S, L, 268); dot(S, R, 268);
  row(330, 'M7', 'M8', true, 'V_b3');
  wire(S, [[L, 380], [L, 420]]); wire(S, [[R, 380], [R, 420]]); dot(S, L, 400); dot(S, R, 400);
  wire(S, [[L, 400], [460, 400]]); wire(S, [[R, 400], [880, 400]]); cap(S, 460, 400, { label: 'C_L' }); cap(S, 880, 400, { label: 'C_L' });
  txt(S, L + 12, 418, 'V_out1', { size: 17, color: C.volt, weight: 700 }); txt(S, R - 12, 418, 'V_out2', { size: 17, color: C.volt, weight: 700, anchor: 'end' });
  row(470, 'M5', 'M6', false, 'V_b2'); wire(S, [[L, 520], [L, 530]]); wire(S, [[R, 520], [R, 530]]);
  row(580, 'M3', 'M4', false, 'V_b1'); gnd(S, L, 630); gnd(S, R, 630);
  nmos(S, 230, 420, { name: 'M1', gate: 'V_in1' }); nmos(S, 370, 420, { name: 'M2', gate: 'V_in2', right: true, nameSide: 'l' });
  wire(S, [[230, 370], [230, 268], [L, 268]]); wire(S, [[370, 370], [370, 240], [700, 240], [700, 268], [R, 268]]);
  wire(S, [[230, 470], [230, 490], [370, 490], [370, 470]]); isrc(S, 300, 530, { label: 'I_SS', len: 40 }); gnd(S, 300, 570);
  r(); return g;
}
function offX(S, x, y, t0) { const g = S.g(); S.el('line', { x1: x - 26, y1: y - 26, x2: x + 26, y2: y + 26, stroke: C.bad, 'stroke-width': 5 }, g); S.el('line', { x1: x + 26, y1: y - 26, x2: x - 26, y2: y + 26, stroke: C.bad, 'stroke-width': 5 }, g); g.style.opacity = 0; S.fade(g, t0, 0.4); return g; }

scene(L14, 'Telescopic (fully differential) slewing', 70, (S) => {
  header(S, 'LEC 14 · YOUR PAGE, TOP', 'Each output slews at I_SS/2C_L; their difference at I_SS/C_L');
  const g = teleFD(S); g.setAttribute('transform', 'translate(-200 30)');
  S.draw(g, 0.3, 2);
  S.say(0.3, 'Lecture 14 asks the slew question for the op amps of Lectures 3–6. First the fully differential telescopic, with a $C_L$ on each output. At rest every branch carries $I_{SS}/2$; the top sources M7, M8 are fixed at $I_{SS}/2$.');
  offX(S, 490, 595, 8);
  S.say(8, 'Apply a large step: M2 turns <b>off</b> (red ✕) and M1 takes the whole $I_{SS}$.');
  S.flow([[270, 190], [270, 670]], 12, null, { speed: 90, w: 6 });
  label(S, 20, 540, 'M3, M1 pull I_SS out', 12, { size: 19, color: C.cur, weight: 700 });
  label(S, 20, 170, 'M7 pushes I_SS/2 in', 12, { size: 19, color: C.p, weight: 700 });
  S.say(12, '<b>Left output:</b> M7 still pushes only $I_{SS}/2$ in, but M3/M1 now pull $I_{SS}$ out. The difference, $I_{SS}/2$, must come out of $C_L$: $V_{out1}$ falls.');
  S.flow([[490, 190], [490, 415]], 20, null, { speed: 60, w: 4 });
  label(S, 560, 170, 'M8 pushes I_SS/2 in', 20, { size: 19, color: C.p, weight: 700 }); label(S, 560, 540, 'nothing pulls (M2 off)', 20, { size: 19, color: C.bad, weight: 700 });
  S.say(20, '<b>Right output:</b> M8 pushes $I_{SS}/2$ in and nothing pulls out (M2 is off): all of $I_{SS}/2$ charges $C_L$: $V_{out2}$ rises.');
  const lines = [
    ['\\frac{dV_{out1}}{dt} = -\\frac{I_{SS}}{2C_L},\\qquad \\frac{dV_{out2}}{dt} = +\\frac{I_{SS}}{2C_L}', 28],
    ['\\left|\\frac{d(V_{out1}-V_{out2})}{dt}\\right| = \\frac{I_{SS}}{C_L}', 34],
  ];
  lines.forEach(([tex, t], i) => eqAt(S, tex, 1140, 220 + i * 100, t, { size: 30, w: 820, color: i ? '#ffd38a' : C.text }));
  S.say(28, 'Each output: $i = C\\,dv/dt$ with $I_{SS}/2$, so each slews at $I_{SS}/(2C_L)$, in opposite directions.');
  S.say(34, 'The differential output (the signal) moves twice as fast: $I_{SS}/C_L$ — the same as the 5-T OTA.');
  const x0 = 820, y0 = 760;
  const ax = axes(S, x0, y0, 680, 300, { x: 't', y: 'V' }); S.fade(ax, 40, 0.6);
  tracePlot(S, (t) => 0.5 + 0.12 * t, (t) => x0 + t * 150, (v) => y0 - v * 250, 41, 46, C.ok, 4);
  tracePlot(S, (t) => 0.5 - 0.12 * t, (t) => x0 + t * 150, (v) => y0 - v * 250, 41, 46, C.bad, 4);
  tracePlot(S, (t) => 0.24 * t, (t) => x0 + t * 150, (v) => y0 - v * 250, 41, 46, C.amb, 4);
  label(S, x0 + 610, y0 - 270, 'V_out2', 46, { size: 18, color: C.ok, weight: 700 }); label(S, x0 + 610, y0 - 20, 'V_out1', 46, { size: 18, color: C.bad, weight: 700 }); label(S, x0 + 520, y0 - 175, 'difference (2× faster)', 46, { size: 18, color: C.amb, weight: 700, anchor: 'end' });
  S.say(46, 'Problem Set 2 P1 asks exactly this with numbers — coming up.');
});

scene(L14, 'Folded-cascode slewing: I_P decides', 80, (S) => {
  header(S, 'LEC 14 · YOUR PAGE, MIDDLE', 'A folding branch cannot carry negative current');
  const g = foldFD(S); g.setAttribute('transform', 'translate(-120 40)');
  S.draw(g, 0.3, 2.2);
  S.say(0.3, 'The fully differential folded cascode. The top sources M9, M10 each supply $I_P$; the input pair M1, M2 pulls current out of the fold nodes; the bottom sources M3, M4 are fixed.');
  const tb = html(S, 40, 690, 840, 175, `<table class="tbl" style="font-size:17px"><tr><th>branch</th><th>at rest</th><th>slewing (M2 off)</th></tr>
    <tr><td>top M9, M10</td><td>${rt('$I_P$ each')}</td><td>${rt('$I_P$ each')}</td></tr>
    <tr><td>input M1 / M2</td><td>${rt('$I_{SS}/2$ each')}</td><td>${rt('$I_{SS}$ / 0')}</td></tr>
    <tr><td>left / right cascode</td><td>${rt('$I_P - I_{SS}/2$')}</td><td class="chg">${rt('$I_P - I_{SS}$ / $I_P$')}</td></tr></table>`);
  tb.style.opacity = 0; S.slideIn(tb, 7, 0.7);
  S.say(7, 'At rest: each fold node gets $I_P$ from the top and gives $I_{SS}/2$ to the input device, so each cascode branch — and each bottom source — carries $I_P - I_{SS}/2$.');
  offX(S, 250, 460, 16);
  S.flow([[110, 410], [110, 228], [440, 228]], 16, null, { speed: 90, w: 5 });
  S.say(16, 'Large step: M2 off, M1 takes all of $I_{SS}$.');
  S.say(20, 'Left: M1 now takes $I_{SS}$ from the fold node, leaving $I_P - I_{SS}$ for the cascode branch. The bottom source still pulls $I_P - I_{SS}/2$. Net into $C_L$: $(I_P - I_{SS}) - (I_P - I_{SS}/2) = -I_{SS}/2$.');
  S.say(28, 'Right: M2 takes nothing, so the branch carries all of $I_P$; the bottom pulls $I_P - I_{SS}/2$: net $+I_{SS}/2$. Same as the telescopic: $I_{SS}/(2C_L)$ each side…');
  whyBox(S, 900, 140, 660, 230, '**…unless $I_P < I_{SS}$.** Then “$I_P - I_{SS}$” would be negative — impossible. The left branch simply **turns off** (0), and the left output is discharged only by the bottom source: $I_P - I_{SS}/2$. The slew rate is now limited by $I_P$.', 36);
  S.say(36, '<span class="why">The catch (your page in green):</span> if $I_P < I_{SS}$, “$I_P - I_{SS}$” is negative, which a transistor cannot carry. That branch turns off, and the slewing current is set by $I_P$ instead of $I_{SS}$.');
  eqAt(S, 'I_P \\ge I_{SS}\\;\\Rightarrow\\; SR = \\frac{I_{SS}}{C_L}\\;\\text{(differential)}', 1230, 440, 46, { size: 30, w: 680, color: '#ffd38a' });
  S.say(46, 'Design rule (also Lec 5’s tip): make the folding current at least $I_{SS}$, and the folded cascode slews like a telescopic.');
  whyBox(S, 900, 520, 660, 250, '**Single-ended version (Tutorial 6 Q3):** output current = (right branch) − (mirror copy of left branch) = $(I_P - I_{D2}) - (I_P - I_{D1})$, each branch clipped at 0. With $I_P = 200 < I_{SS} = 300\\,\\mu$A, one branch turns off at each extreme, so **both** SR± are $I_P/C_L$.', 54);
  S.say(54, 'Tutorial 6 Q3 is the single-ended version with a mirror at the bottom. Same rule: a branch that would go negative turns off, and $I_P$ sets the slew rate both ways.');
});

/* feedback loop block diagram */
function loopDiagram(S) {
  const g = S.g(); const r = S.into(g);
  wire(S, [[200, 300], [300, 300]]); txt(S, 190, 307, 'x_s', { size: 24, color: C.text, anchor: 'end' });
  S.el('circle', { cx: 330, cy: 300, r: 30, fill: C.bg, stroke: C.wire, 'stroke-width': 2.6 });
  txt(S, 330, 309, 'Σ', { size: 26, color: C.text, anchor: 'middle' }); txt(S, 296, 280, '+', { size: 20, color: C.ok }); txt(S, 340, 352, '−', { size: 26, color: C.bad, weight: 800 });
  wire(S, [[360, 300], [470, 300]]); txt(S, 410, 288, 'x_i', { size: 20, color: C.muted, anchor: 'middle' });
  amp(S, 470, 300, { w: 140, h: 120, label: 'A(s)', pm: false });
  wire(S, [[610, 300], [820, 300]]); dot(S, 740, 300); txt(S, 830, 307, 'x_o', { size: 24, color: C.volt, weight: 700 });
  wire(S, [[740, 300], [740, 460], [620, 460]]);
  S.el('rect', { x: 500, y: 420, width: 120, height: 80, rx: 10, fill: 'rgba(45,212,191,0.08)', stroke: C.p, 'stroke-width': 2.6 });
  txt(S, 560, 469, 'β', { size: 28, color: C.p, weight: 800, anchor: 'middle' });
  wire(S, [[500, 460], [330, 460], [330, 330]]); txt(S, 318, 420, 'x_f', { size: 20, color: C.muted, anchor: 'end' });
  r(); return g;
}

scene(L14, 'The concept of stability: the loop gain βA(s)', 66, (S) => {
  header(S, 'LEC 14 · CONCEPT OF STABILITY', 'Every feedback amplifier is this loop');
  const g = loopDiagram(S); g.setAttribute('transform', 'translate(-80 40)');
  S.draw(g, 0.3, 2);
  S.say(0.3, 'Your page’s block diagram: the input $x_s$ minus the fed-back $x_f$ gives the error $x_i$; the amplifier $A$ makes $x_o$; the network β returns $x_f = \\beta x_o$.');
  eqAt(S, '\\frac{x_o}{x_s}(s) = \\frac{A(s)}{1 + \\beta A(s)}', 1180, 220, 7, { size: 40, w: 700 });
  S.say(7, 'Solve the loop (Lecture 1 again, but now with frequency): $x_o/x_s = A(s)/(1 + \\beta A(s))$.');
  eqAt(S, '\\text{loop gain} = \\beta A(s)', 1180, 330, 13, { size: 36, w: 700, color: '#ffd38a' });
  S.say(13, 'The product $\\beta A(s)$ is the <b>loop gain</b>: what a signal is multiplied by on one trip round the loop. β is a resistor ratio — independent of frequency — so all the frequency behaviour sits in $A(s)$.');
  eqAt(S, 'A(s) = \\frac{A_M}{\\left(1+\\frac{s}{\\omega_{p1}}\\right)\\left(1+\\frac{s}{\\omega_{p2}}\\right)}', 1180, 460, 20, { size: 32, w: 700 });
  S.say(20, 'A real op amp has more than one pole. Your page writes a two-pole $A(s)$: each high-resistance node (Lec 7!) contributes one factor $(1 + s/\\omega_p)$.');
  // signal travelling round the loop
  const pulse = S.el('circle', { r: 11, fill: C.cur, filter: 'url(#glow)' }); pulse.style.opacity = 0;
  const path = [[250, 340], [400, 340], [530, 340], [660, 340], [660, 500], [420, 500], [250, 500], [250, 370]];
  S.anim(28, 1e4, 'loop', (_p, t) => {
    const u = ((Math.max(0, t - 28)) / 4) % 1, n = path.length - 1, k = Math.floor(u * n), f = u * n - k;
    const [a, b] = [path[k], path[k + 1]];
    pulse.setAttribute('cx', lerp(a[0], b[0], f)); pulse.setAttribute('cy', lerp(a[1], b[1], f)); pulse.style.opacity = t > 28 ? 1 : 0;
  }, E.lin);
  S.say(28, 'Follow a signal round and round. Normally the fed-back signal <b>opposes</b> the input (the minus sign), so errors shrink: negative feedback.');
  whyBox(S, 820, 580, 740, 210, '**The danger:** each pole delays the signal (up to −90° each). At some frequency the trip round the loop may delay it by **180°** — turning the “opposing” signal into an **aiding** one. Then the loop can sustain itself: **oscillation**.', 38);
  S.say(38, '<span class="why">Why stability is a question at all:</span> the poles delay the signal. If the delay round the loop reaches 180°, the minus sign’s opposition becomes help — and the amplifier may oscillate.');
});

scene(L14, 'Barkhausen: when the loop sustains itself', 74, (S) => {
  header(S, 'LEC 14 · BARKHAUSEN’S CRITERIA', '|βA(jω₁)| = 1 and ∠βA(jω₁) = −180°  →  oscillation at ω₁');
  // stage strip: wave in, through A (amplified, delayed), through beta, back inverted by minus
  const y = 300;
  const box = (x, s2, col) => { S.el('rect', { x, y: y - 50, width: 160, height: 100, rx: 12, fill: 'rgba(255,255,255,0.03)', stroke: col, 'stroke-width': 2.4 }); txt(S, x + 80, y + 8, s2, { size: 20, color: col, weight: 700, anchor: 'middle' }); };
  box(120, 'start: x_i', C.text); box(520, 'after βA', C.p); box(920, 'after the −', C.bad); box(1320, 'compare', C.amb);
  [300, 700, 1100].forEach((x) => arrow(S, x, y, x + 200, y, { color: C.muted, w: 2.4 }));
  const w1 = sine(S, 130, 270, y + 140, 40, { color: C.volt, cycles: 1.5 }); S.draw(w1, 2, 1);
  const w2 = sine(S, 530, 670, y + 140, 40, { color: C.p, cycles: 1.5, phase: Math.PI }); S.draw(w2, 7, 1);
  const w3 = sine(S, 930, 1070, y + 140, 40, { color: C.bad, cycles: 1.5 }); S.draw(w3, 13, 1);
  const w4a = sine(S, 1330, 1470, y + 140, 40, { color: C.volt, cycles: 1.5 }); const w4b = sine(S, 1330, 1470, y + 140, 40, { color: C.bad, cycles: 1.5 }); w4b.setAttribute('stroke-dasharray', '6 6');
  S.draw(w4a, 19, 1); S.draw(w4b, 19.5, 1);
  S.say(0.3, 'Take one particular frequency $\\omega_1$ and follow a sine wave once round the loop.');
  S.say(7, 'Suppose at $\\omega_1$ the loop gain has size exactly 1 and delays the wave by 180°: it comes back the same size, <b>upside down</b>.');
  S.say(13, 'The minus sign at the summer flips it again: now it is identical to what we started with.');
  S.say(19, 'It matches the starting wave exactly — so it can keep going round with <b>no input at all</b>. The amplifier produces a sine wave on its own: it oscillates.');
  eqAt(S, '|\\beta A(j\\omega_1)| = 1,\\qquad \\angle\\beta A(j\\omega_1) = -180^\\circ', 800, 600, 26, { size: 36, w: 1200, color: '#ffd38a' });
  eqAt(S, '\\beta A(j\\omega_1) = -1 \\;\\Rightarrow\\; A_f(j\\omega_1) = \\frac{A}{1 + \\beta A} = \\frac{A}{0} = \\infty', 800, 690, 32, { size: 32, w: 1200 });
  S.say(26, 'These two conditions are <b>Barkhausen’s criteria</b> (boxed on your page): size 1 and phase −180° at the same frequency.');
  S.say(32, 'Together they say $\\beta A(j\\omega_1) = -1$, so $1 + \\beta A = 0$ and the closed-loop gain $A_f$ is infinite: an output with zero input.');
  whyBox(S, 220, 760, 1160, 90, 'Size **> 1** with −180° grows into a big oscillation; size **< 1** dies out. Stability = making sure |βA| has fallen below 1 **before** the phase reaches −180°.', 40);
  S.say(40, 'If the size were bigger than 1 it would grow each trip; smaller than 1, it fades. So a stable amplifier is one whose loop gain drops below 1 before its phase reaches −180°. Lectures 15–16 measure that margin.');
});

scene(L14, 'The complex numbers you need', 68, (S) => {
  header(S, 'LEC 14 · YOUR PAGE, BOTTOM RIGHT', 'Size and angle of a complex number — and of each pole');
  eqAt(S, 'a + jb = Me^{j\\theta} = M(\\cos\\theta + j\\sin\\theta)', 470, 180, 0.4, { size: 32, w: 860 });
  eqAt(S, 'M = \\sqrt{a^2 + b^2},\\qquad \\theta = \\tan^{-1}\\frac{b}{a}', 470, 260, 4, { size: 32, w: 860 });
  S.say(0.4, 'Your page’s toolkit. A complex number $a + jb$ is an arrow: $a$ along the real axis, $b$ up the imaginary axis. Its <b>size</b> M is the arrow’s length, its <b>angle</b> θ the direction.');
  const ox = 1050, oy = 560;
  S.el('line', { x1: 960, y1: oy, x2: 1530, y2: oy, stroke: C.muted, 'stroke-width': 1.6 }); S.el('line', { x1: ox, y1: 820, x2: ox, y2: 160, stroke: C.muted, 'stroke-width': 1.6 });
  txt(S, 1520, oy + 26, 'real', { size: 17, color: C.muted, anchor: 'end' }); txt(S, ox + 8, 176, 'j (imag)', { size: 17, color: C.muted });
  const vec = S.el('line', { x1: ox, y1: oy, stroke: C.amb, 'stroke-width': 4, 'stroke-linecap': 'round' });
  const hz = S.el('line', { stroke: C.n, 'stroke-width': 2, 'stroke-dasharray': '5 5' }); const vt = S.el('line', { stroke: C.n, 'stroke-width': 2, 'stroke-dasharray': '5 5' });
  const rdA = txt(S, 1110, 640, '', { size: 20, color: C.text, mono: true, weight: 700 }); const rdB = txt(S, 1110, 676, '', { size: 20, color: C.amb, mono: true });
  const U = 200;
  const kOf = (t) => (t < 14 ? 0.0001 : t < 30 ? 10 ** (-1 + 2 * E.inout((t - 14) / 16)) : t < 34 ? 10 : 10);
  S.anim(0, 1e4, 'vec', (_p, t) => {
    const k = kOf(t); const a = 1, b = k; const M = Math.hypot(a, b); const sc = Math.min(U, 360 / M);
    vec.setAttribute('x2', ox + a * sc); vec.setAttribute('y2', oy - b * sc);
    hz.setAttribute('x1', ox); hz.setAttribute('y1', oy); hz.setAttribute('x2', ox + a * sc); hz.setAttribute('y2', oy);
    vt.setAttribute('x1', ox + a * sc); vt.setAttribute('y1', oy); vt.setAttribute('x2', ox + a * sc); vt.setAttribute('y2', oy - b * sc);
    rdA.textContent = `1 + jω/ωp, ω/ωp = ${fx(k, 3)}`; rdB.textContent = `size ${fx(M, 3)}, angle ${fx(Math.atan(k) * 180 / Math.PI, 3)}°`;
  }, E.lin);
  S.say(8, 'Apply it to one pole factor $1 + j\\omega/\\omega_p$: the real part is 1, the imaginary part is $\\omega/\\omega_p$.');
  S.say(14, 'Sweep the frequency up: the arrow tips over towards vertical. At $\\omega = \\omega_p$ it is at 45° with size $\\sqrt2$; far above, it is nearly 90° and long.');
  eqAt(S, '\\frac{1}{1 + j\\frac{\\omega}{\\omega_p}}:\\;\\; \\text{size } \\frac{1}{\\sqrt{1 + (\\omega/\\omega_p)^2}},\\;\\; \\text{angle } -\\tan^{-1}\\frac{\\omega}{\\omega_p}', 470, 400, 30, { size: 26, w: 860, color: '#ffd38a' });
  S.say(30, 'Dividing by that arrow gives the pole’s effect: size $1/\\sqrt{1 + (\\omega/\\omega_p)^2}$ and angle $-\\tan^{-1}(\\omega/\\omega_p)$ — the Bode plot’s two curves, now explained.');
  eqAt(S, '\\beta A(j\\omega):\\;\\; |\\,\\cdot\\,| = \\frac{\\beta A_M}{\\sqrt{1+(\\omega/\\omega_{p1})^2}\\sqrt{1+(\\omega/\\omega_{p2})^2}},\\;\\; \\angle = -\\tan^{-1}\\frac{\\omega}{\\omega_{p1}} - \\tan^{-1}\\frac{\\omega}{\\omega_{p2}}', 470, 520, 38, { size: 22, w: 900 });
  S.say(38, 'For two poles: the <b>sizes multiply</b> and the <b>angles add</b>. That is all you need to evaluate $|\\beta A|$ and $\\angle\\beta A$ at any frequency.');
  whyBox(S, 60, 620, 820, 200, '**Key consequence:** each pole adds at most −90°. Two poles approach −180° only as ω → ∞, where |βA| → 0 — so a two-pole loop never quite meets Barkhausen. It can still **ring** badly when the poles get close (next scene). Three poles can reach −180° with |βA| > 1.', 46);
  S.say(46, 'One consequence worth an exam line: with two poles the phase only reaches −180° at infinite frequency, where the loop gain has vanished. Two poles alone cannot oscillate — but they can ring, as the next scene shows.');
});

scene(L14, 'Two poles under feedback: from slow to ringing', 84, (S) => {
  header(S, 'LEC 14 → 15 · WHERE DO THE CLOSED-LOOP POLES GO?', 'More feedback pulls the two poles together, then apart into ringing');
  eqAt(S, '1 + \\beta A(s) = 0 \\;\\Rightarrow\\; \\left(1+\\tfrac{s}{\\omega_{p1}}\\right)\\left(1+\\tfrac{s}{\\omega_{p2}}\\right) + \\beta A_0 = 0', 470, 170, 0.4, { size: 26, w: 900 });
  eqAt(S, 's^2 + (\\omega_{p1}+\\omega_{p2})\\,s + (1+\\beta A_0)\\,\\omega_{p1}\\omega_{p2} = 0', 470, 250, 6, { size: 28, w: 900, color: '#ffd38a' });
  S.say(0.4, 'The closed-loop poles are where $1 + \\beta A(s) = 0$. Put in the two-pole $A(s)$ and multiply out…');
  S.say(6, '…a quadratic in $s$. Its two roots are the closed-loop poles. Watch them as $\\beta A_0$ grows.');
  const ox = 1300, oy = 500, U = 48;
  S.el('line', { x1: 920, y1: oy, x2: 1540, y2: oy, stroke: C.muted, 'stroke-width': 1.6 }); S.el('line', { x1: ox, y1: 760, x2: ox, y2: 180, stroke: C.muted, 'stroke-width': 1.6 });
  txt(S, 1532, oy + 26, 'σ', { size: 18, color: C.muted, anchor: 'end' }); txt(S, ox + 8, 196, 'jω', { size: 18, color: C.muted });
  const p1 = 1, p2 = 4;
  const mkX = () => { const g = S.g(); S.el('line', { x1: -11, y1: -11, x2: 11, y2: 11, stroke: C.amb, 'stroke-width': 4 }, g); S.el('line', { x1: -11, y1: 11, x2: 11, y2: -11, stroke: C.amb, 'stroke-width': 4 }, g); return g; };
  const xa = mkX(), xb = mkX();
  [[-p1, 'open-loop ω_p1'], [-p2, 'ω_p2']].forEach(([v, s2]) => { const c = S.el('circle', { cx: ox + v * U, cy: oy, r: 6, fill: 'none', stroke: C.muted, 'stroke-width': 2 }); txt(S, ox + v * U, oy + 34, s2, { size: 15, color: C.muted, anchor: 'middle' }); });
  const rd = txt(S, 930, 230, '', { size: 21, color: C.text, mono: true, weight: 700 }); const rdq = txt(S, 930, 262, '', { size: 20, color: C.amb, mono: true });
  const x0 = 120, y0 = 820;
  const ax = axes(S, x0, y0, 700, 300, { x: 't', y: 'closed-loop step' }); S.fade(ax, 12, 0.5);
  const sr = liveLine(S, C.volt);
  const bOf = (t) => (t < 12 ? 0 : t < 42 ? 4 * E.inout((t - 12) / 30) : 4);
  S.anim(0, 1e4, 'rl', (_p, t) => {
    const b = bOf(t), B1 = p1 + p2, Cc = (1 + b) * p1 * p2, D = B1 * B1 - 4 * Cc, re = -B1 / 2;
    if (D >= 0) { const r1 = re + Math.sqrt(D) / 2, r2 = re - Math.sqrt(D) / 2; xa.setAttribute('transform', `translate(${ox + r1 * U} ${oy})`); xb.setAttribute('transform', `translate(${ox + r2 * U} ${oy})`); }
    else { const im = Math.sqrt(-D) / 2; xa.setAttribute('transform', `translate(${ox + re * U} ${oy - im * U})`); xb.setAttribute('transform', `translate(${ox + re * U} ${oy + im * U})`); }
    const w0 = Math.sqrt(Cc), Q = w0 / B1, z = 1 / (2 * Q);
    rd.textContent = `βA0 = ${fx(b, 3)}`; rdq.textContent = `Q = ${fx(Q, 3)}  ${D > 0.05 ? '(two real poles)' : D > -0.05 ? '(coincident)' : '(complex: rings)'}`;
    const step = (u) => {
      if (D > 1e-9) { const r1 = re + Math.sqrt(D) / 2, r2 = re - Math.sqrt(D) / 2; return 1 + (r2 * Math.exp(r1 * u) - r1 * Math.exp(r2 * u)) / (r1 - r2); }
      if (D > -1e-9) return 1 - (1 - re * u) * Math.exp(re * u);
      const wd = Math.sqrt(-D) / 2; return 1 - Math.exp(re * u) * (Math.cos(wd * u) - (re / wd) * Math.sin(wd * u));
    };
    sr.setAttribute('points', ptsOf(200, 0, 3.2, (u) => [x0 + u * 210, y0 - 180 * Math.max(-0.2, Math.min(1.6, step(u)))]));
  }, E.lin);
  S.say(12, 'Small $\\beta A_0$: two real poles, near the open-loop ones. More feedback slides them <b>towards each other</b>…');
  S.say(22, '…they meet (coincident poles, Q = 0.5) — the fastest response that does not overshoot…');
  S.say(30, '…then they split <b>up and down</b> into a complex pair. A complex pair means the step response <b>rings</b> (overshoots and wobbles) — more feedback, more ringing.');
  eqAt(S, 'Q = \\frac{\\sqrt{(1+\\beta A_0)\\,\\omega_{p1}\\omega_{p2}}}{\\omega_{p1}+\\omega_{p2}}\\qquad Q = 0.5:\\text{ coincident},\\;\\; Q = \\tfrac{1}{\\sqrt2}:\\text{ maximally flat}', 470, 380, 42, { size: 24, w: 900, color: '#ffd38a' });
  S.say(42, 'One number tracks it all: compare the quadratic with $s^2 + (\\omega_0/Q)s + \\omega_0^2$ to get Q. Q = 0.5 means coincident poles; Q = 0.707 means the “maximally flat” response (no peaking in frequency, a small 4 % overshoot).');
  S.say(54, 'The past-tutorial question coming up asks exactly: which β makes the poles coincide, and which makes it maximally flat. Lectures 15–16 continue with phase margin.');
});

scene(L14, 'Lecture 14 in one card', 28, (S) => {
  header(S, 'LEC 14 · REMEMBER', 'Everything from Lecture 14');
  remember(S, [
    'Telescopic (fully diff.): each output $I_{SS}/2C_L$, differential $I_{SS}/C_L$.',
    'Folded cascode: a branch carries $I_P - I_{SS}$ when slewing; if $I_P < I_{SS}$ it turns off and $I_P$ limits SR. Need $I_P \\ge I_{SS}$.',
    'Loop gain $\\beta A(s)$; $A_f = A/(1+\\beta A)$; β is frequency-independent.',
    'Barkhausen: $|\\beta A(j\\omega_1)| = 1$ **and** $\\angle = -180°$ → $A_f = \\infty$ → oscillation.',
    '$a + jb$: size $\\sqrt{a^2+b^2}$, angle $\\tan^{-1}(b/a)$. Pole factors: sizes multiply, angles add (each ≤ 90°).',
    'Two poles + feedback: $s^2 + (\\omega_{p1}+\\omega_{p2})s + (1+\\beta A_0)\\omega_{p1}\\omega_{p2}$; Q = 0.5 coincident, 0.707 flat.',
  ], 0.4, 'Lecture 14 · remember');
  S.say(0.4, 'Now the Lecture 14 questions: Problem Set 2 P1, Tutorial 6 Q3, the past tutorial on two poles, and a stability check built from your page.');
});

/* ── Lecture 14 questions ── */
scene(L14, 'Problem Set 2 P1: telescopic slew rate', 44, (S) => {
  pyqFrame(S, {
    tag: 'LEC 14 · QUESTION 1 OF 4', title: 'Fully differential telescopic, M2 off', src: 'Problem Set 2 P1 (Lec 14)',
    q: '$I_{SS} = 1$ mA; the PMOS sources each carry $I_{SS}/2 = 0.5$ mA; each output drives $C_L = 2$ pF. A large step turns M2 off. Slope of each output and of the differential output?', qh: 210,
    tests: 'KCL at each output while slewing: what is pushed in minus what is pulled out, into $C_L$.',
    fig: (S2) => { const g = teleFD(S2); g.setAttribute('transform', 'translate(-200 60)'); },
    steps: [
      { t: 6, title: 'Left: M7 pushes 0.5 mA in, M1 pulls 1 mA out: −0.5 mA into $C_L$', tex: stepTex('bank-ps2-p1', 0), try: { q: 'Net −0.5 mA into 2 pF. |dV<sub>out1</sub>/dt| (V/µs)?', answer: ans('bank-ps2-p1', 'se'), unit: 'V/s (type 250M)', tol: 0.02, hint: '0.5 mA / 2 pF.' }, say: 'Left output: in 0.5 mA, out 1 mA. Net 0.5 mA out of 2 pF: falls at 250 V/µs.' },
      { t: 14, title: 'Right: M8 pushes 0.5 mA in, nothing pulls: +0.5 mA', tex: '\\frac{dV_{out2}}{dt} = +\\frac{I_{SS}}{2C_L} = +250\\,\\mathrm{V/\\mu s}', say: 'Right output: rises at the same 250 V/µs.' },
      { t: 20, title: 'The difference moves twice as fast', tex: stepTex('bank-ps2-p1', 2), try: { q: 'Differential slew rate (V/µs)?', answer: ans('bank-ps2-p1', 'diff'), unit: 'V/s (type 500M)', tol: 0.02, hint: 'Opposite slopes add.' }, say: 'Opposite slopes add: 500 V/µs = $I_{SS}/C_L$.' },
      { t: 27, ans: true, title: '**Answers:** each output ±250 V/µs · differential 500 V/µs', say: 'Same answer as $I_{SS}/C_L$ — fully differential circuits don’t lose slew rate.' },
    ],
  });
}, { q: 'Problem Set 2 P1' });

/* Tutorial 6 Q3's single-ended folded cascode */
function t6q3Fig(S) {
  const g = S.g(); const r = S.into(g);
  rail(S, 200, 900, 150);
  const L = 560, R = 760;
  const row = (y, a, b, p) => { const A = fet(S, L, y, { p, name: a, right: true, gl: 26, nameSide: 'l' }); const B = fet(S, R, y, { p, name: b, gl: 26, nameSide: 'r' }); wire(S, [[A.gate[0], y], [B.gate[0], y]]); return [A, B]; };
  row(205, 'M9', 'M10', true); wire(S, [[L, 150], [L, 155]]); wire(S, [[R, 150], [R, 155]]);
  txt(S, L - 12, 244, 'I_P', { size: 17, color: C.p, anchor: 'end', weight: 700 }); txt(S, R + 12, 244, 'I_P', { size: 17, color: C.p, weight: 700 });
  wire(S, [[L, 255], [L, 280]]); wire(S, [[R, 255], [R, 280]]); dot(S, L, 268); dot(S, R, 268);
  row(330, 'M3', 'M4', true);
  wire(S, [[L, 380], [L, 420]]); wire(S, [[R, 380], [R, 420]]); dot(S, R, 400);
  wire(S, [[R, 400], [880, 400]]); cap(S, 860, 400, { label: 'C_L' }); txt(S, 888, 394, 'V_out', { size: 18, color: C.volt, weight: 700 });
  const [m5] = row(470, 'M5', 'M6', false); dot(S, L, 400); wire(S, [[L, 400], [470, 400], [470, 470]]); dot(S, 470, 470);
  wire(S, [[L, 520], [L, 530]]); wire(S, [[R, 520], [R, 530]]);
  row(580, 'M7', 'M8', false); wire(S, [[470, 470], [470, 580]]); dot(S, 470, 580); gnd(S, L, 630); gnd(S, R, 630);
  nmos(S, 260, 420, { name: 'M1', gate: 'V_in' }); nmos(S, 380, 420, { name: 'M2', right: true, nameSide: 'l', gl: 20 });
  wire(S, [[260, 370], [260, 268], [L, 268]]); wire(S, [[380, 370], [380, 240], [700, 240], [700, 268], [R, 268]]);
  wire(S, [[260, 470], [260, 490], [380, 490], [380, 470]]); isrc(S, 320, 530, { label: 'I_SS', len: 40 }); gnd(S, 320, 570);
  r(); return g;
}
scene(L14, 'Tutorial 6 Q3: folded-cascode slew rate', 66, (S) => {
  pyqFrame(S, {
    paper: 't6q3', tag: 'LEC 14 · QUESTION 2 OF 4', title: 'When I_P < I_SS, I_P sets the slew rate', src: 'Tutorial 6 Q3',
    q: 'NMOS-input folded cascode, cascode-mirror bottom: $C_L = 4$ pF, $I_{SS} = 300\\,\\mu$A, each folding source $I_P = 200\\,\\mu$A, $V_{ov1,2} = 150$ mV. (a) SR+. (b) SR− and what limits it. (c) Condition on $I_P$ for symmetric SR = $I_{SS}/C_L$. (d) Step for full slewing.', qh: 270,
    tests: 'branch currents $I_P - I_D$ clipped at zero, the mirror copying the left branch, and $\\sqrt2V_{ov}$.',
    fig: (S2) => { const g = t6q3Fig(S2); g.setAttribute('transform', 'translate(-140 80)'); },
    steps: [
      { t: 8, title: 'Output current = (right branch $I_P - I_{D2}$) − (mirror copy of left branch $I_P - I_{D1}$); a branch can’t go below 0', tex: stepTex('bank-t6q3', 0), say: 'Bookkeeping: the right branch delivers $I_P - I_{D2}$ to the output; the mirror sinks a copy of the left branch, $I_P - I_{D1}$. Neither can go negative.' },
      { t: 16, title: '(a) $I_{D2} → 0$: right branch delivers $I_P$; left branch $I_P - I_{SS} < 0$ → off, mirror sinks 0', tex: stepTex('bank-t6q3', 1), try: { q: 'Right branch I<sub>P</sub> = 200 µA, mirror sinks nothing, C<sub>L</sub> = 4 pF. SR+ (V/µs)?', answer: ans('bank-t6q3', 'srp'), unit: 'V/s (type 50M)', tol: 0.02, hint: '200 µA / 4 pF.' }, say: 'Positive slewing: 200 µA into 4 pF = 50 V/µs.' },
      { t: 25, title: '(b) $I_{D2} → I_{SS}$: right branch off, mirror sinks $I_P$', tex: stepTex('bank-t6q3', 2), try: { q: 'Right branch off; the mirror sinks a copy of the left branch, I<sub>P</sub> = 200 µA. SR− (V/µs)?', answer: ans('bank-t6q3', 'srm'), unit: 'V/s (type 50M)', tol: 0.02, hint: 'Same current, other direction.' }, say: 'Negative slewing: also 200 µA / 4 pF = 50 V/µs. Limited by $I_P$, not $I_{SS}$.' },
      { t: 33, title: '(c) No branch may turn off', tex: stepTex('bank-t6q3', 3), try: { q: 'Minimum I<sub>P</sub> for SR = I<sub>SS</sub>/C<sub>L</sub> both ways (µA)?', answer: ans('bank-t6q3', 'ipmin'), unit: 'A (type 300u)', tol: 0.01, hint: 'IP − ISS ≥ 0.' }, say: '$I_P \\ge I_{SS} = 300\\,\\mu$A; then SR = 75 V/µs both ways.' },
      { t: 41, title: '(d) Full steering at $\\sqrt2V_{ov}$', tex: stepTex('bank-t6q3', 4), try: { q: 'V<sub>ov</sub> at balance = 0.15 V. ΔV<sub>in,min</sub> = ?', answer: ans('bank-t6q3', 'dv'), unit: 'V', tol: 0.01, hint: '√2 × 0.15.' }, say: '$\\sqrt2\\times0.15 = 0.212$ V.' },
      { t: 48, ans: true, title: '**Answers:** SR+ = SR− = 50 V/µs (limited by $I_P$) · need $I_P \\ge I_{SS}$ = 300 µA · ΔV = 0.212 V', say: 'Folded cascodes: always compare $I_P$ with $I_{SS}$ first.' },
    ],
  });
}, { q: 'Tutorial 6 Q3' });

scene(L14, 'Past tutorial: two poles closing in', 60, (S) => {
  pyqFrame(S, {
    tag: 'LEC 14 · QUESTION 3 OF 4', title: 'Coincident poles and maximally flat', src: 'Past tutorial 2024-25 T2 Ex 2',
    q: 'Gain 100, poles at $10^4$ and $10^6$ rad/s, feedback factor β. For what β do the closed-loop poles coincide? (Q then?) For what β is it maximally flat, and what is the closed-loop gain?', qh: 220,
    tests: 'the closed-loop quadratic and its Q from the last theory scene.',
    fig: (S2) => { const g = S2.g(); const r = S2.into(g); eq(S2, 's^2 + (\\omega_{p1}+\\omega_{p2})s + (1+\\beta A_0)\\omega_{p1}\\omega_{p2} = 0', 470, 320, { size: 26, w: 860 }); eq(S2, 'Q^2 = \\frac{(1+\\beta A_0)\\,\\omega_{p1}\\omega_{p2}}{(\\omega_{p1}+\\omega_{p2})^2}', 470, 470, { size: 34, w: 860 }); eq(S2, '\\omega_{p1}\\omega_{p2} = 10^{10},\\;\\; \\omega_{p1}+\\omega_{p2} = 1.01\\times10^6', 470, 610, { size: 26, w: 860, color: C.muted }); r(); },
    steps: [
      { t: 6, title: 'Coincident: Q = 0.5, i.e. $(1+\\beta A_0)\\omega_{p1}\\omega_{p2} = (\\omega_{p1}+\\omega_{p2})^2/4$', tex: stepTex('pyq-t24-ex2', 0), try: { q: '(1 + 100β)·10¹⁰ = (1.01·10⁶)²/4. β = ?', answer: ans('pyq-t24-ex2', 'b1'), unit: '', tol: 0.02, hint: '(1.01e6)²/(4e10) = 25.5.' }, say: '$(1.01\\times10^6)^2/(4\\times10^{10}) = 25.5 = 1 + 100\\beta$, so β = 0.245.' },
      { t: 15, title: 'Maximally flat: Q = $1/\\sqrt2$, i.e. $Q^2 = 0.5$', tex: stepTex('pyq-t24-ex2', 1), try: { q: '(1 + 100β)·10¹⁰ = (1.01·10⁶)²/2. β = ?', answer: ans('pyq-t24-ex2', 'b2'), unit: '', tol: 0.02, hint: '1 + 100β = 51.0.' }, say: '$1 + 100\\beta = 51.0$, so β ≈ 0.50.' },
      { t: 23, title: 'Closed-loop gain $A_0/(1+\\beta A_0)$', tex: stepTex('pyq-t24-ex2', 2), try: { q: 'A₀ = 100, β = 0.50005. Closed-loop gain?', answer: ans('pyq-t24-ex2', 'g'), unit: '', tol: 0.02, hint: '100/51.' }, say: '$100/51 = 1.96$.' },
      { t: 30, ans: true, title: '**Answers:** coincident at β = 0.245 (Q = 0.5) · maximally flat at β ≈ 0.50 · gain ≈ 1.96', say: 'More feedback (bigger β) pushes Q up: from coincident to flat to ringing.' },
    ],
  });
}, { q: 'Past tutorial Ex 2' });

scene(L14, 'Exam-style check: loop phase and Barkhausen', 46, (S) => {
  pyqFrame(S, {
    tag: 'LEC 14 · QUESTION 4 OF 4 (EXAM-STYLE, FROM YOUR PAGE)', title: 'Evaluate βA(jω) with two poles', src: 'Exam-style · built from your Lec 14 page',
    q: '$\\beta A(s) = \\frac{\\beta A_M}{(1+s/\\omega_{p1})(1+s/\\omega_{p2})}$ with $\\omega_{p1} = 1$ Mrad/s, $\\omega_{p2} = 10$ Mrad/s. (a) Phase of βA at ω = 10 Mrad/s. (b) Can this loop satisfy Barkhausen?', qh: 220,
    tests: 'adding the pole angles, and why two poles alone never reach −180° with $|\\beta A| = 1$.',
    fig: (S2) => { const g = S2.g(); const r = S2.into(g); eq(S2, '\\angle\\beta A = -\\tan^{-1}\\frac{\\omega}{\\omega_{p1}} - \\tan^{-1}\\frac{\\omega}{\\omega_{p2}}', 470, 380, { size: 32, w: 860 }); r(); },
    steps: [
      { t: 6, title: '(a) Angles add: $-\\tan^{-1}(10) - \\tan^{-1}(1)$', tex: '-84.3^\\circ - 45^\\circ = -129.3^\\circ', try: { q: 'Phase of βA at ω = 10 Mrad/s (degrees, negative)?', answer: -129.3, unit: '°', tol: 0.01, hint: '−atan(10) − atan(1) in degrees.' }, say: 'First pole: $\\tan^{-1}(10) = 84.3°$; second: $\\tan^{-1}(1) = 45°$. Total −129.3°.' },
      { t: 14, title: '(b) Each pole gives < 90°: −180° only as ω → ∞, where |βA| → 0', tex: '\\text{two poles: never } \\beta A = -1', try: { q: 'Can a loop gain with exactly two poles meet Barkhausen?', choices: ['No — −180° is reached only at ω → ∞, where |βA| has fallen to 0', 'Yes — whenever βA_M > 1'], answer: 0, hint: 'Each pole contributes strictly less than 90°.' }, say: 'No: the phase only approaches −180° as the frequency goes to infinity, and there the size is zero. Two poles can ring, but need a third pole (or delay) to oscillate.' },
      { t: 22, ans: true, title: '**Answers:** (a) −129.3° · (b) no (but it can ring with little phase margin — Lec 15–16)', say: 'This “angles add” evaluation is exactly what phase-margin questions use next.' },
    ],
  });
}, { q: 'Exam-style (Lec 14)' });
