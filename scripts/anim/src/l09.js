/* Lecture 9: boosters as amplifiers, differential boosting, the fully boosted telescopic, and why CMFB. */
'use strict';
const L9 = 'Lec 9 · Boosters & why CMFB';

/* a fully differential booster drawn as a box: inputs at the bottom corners, outputs at the top corners */
function dbox(S, x, y, w, h, lab, col = C.amb) {
  const g = S.g();
  S.el('rect', { x, y, width: w, height: h, rx: 12, fill: 'rgba(251,191,36,0.07)', stroke: col, 'stroke-width': 2.6 }, g);
  txt(S, x + w / 2, y + h / 2 + 8, lab, { size: 22, color: col, weight: 750, anchor: 'middle' }, g);
  return g;
}

/* the cascode pair of your Lec 9 page; mode 'two' (a booster per side) or 'one' (one differential booster) */
function pairBoost(S, mode) {
  const g = S.g(); const r = S.into(g);
  const L = 200, R = 480;
  const inward = mode === 'one';
  nmos(S, L, 260, { name: 'M3', right: inward, nameSide: inward ? 'l' : 'r' });
  nmos(S, R, 260, { name: 'M4', right: !inward, nameSide: inward ? 'r' : 'l' });
  wire(S, [[L, 210], [L, 175]]); wire(S, [[R, 210], [R, 175]]);
  txt(S, L, 166, 'V_out1', { size: 18, color: C.volt, anchor: 'middle' }); txt(S, R, 166, 'V_out2', { size: 18, color: C.volt, anchor: 'middle' });
  wire(S, [[L, 310], [L, 350]]); wire(S, [[R, 310], [R, 350]]); dot(S, L, 330); dot(S, R, 330);
  nmos(S, L, 400, { name: 'M1', gate: 'V_in1' }); nmos(S, R, 400, { name: 'M2', gate: 'V_in2', right: true });
  wire(S, [[L, 450], [L, 470], [R, 470], [R, 450]]);
  isrc(S, 340, 515, { label: 'I_SS', len: 45 }); gnd(S, 340, 560);
  if (mode === 'two') {
    amp(S, 30, 260, { label: 'A₁', w: 80, h: 76 }); wire(S, [[110, 260], [136, 260]]);
    wire(S, [[L, 330], [16, 330], [16, 279], [30, 279]]);
    amp(S, 650, 260, { label: 'A₂', w: 80, h: 76, left: true }); wire(S, [[570, 260], [544, 260]]);
    wire(S, [[R, 330], [664, 330], [664, 279], [650, 279]]);
  } else {
    dbox(S, 290, 222, 100, 120, 'A');
    wire(S, [[264, 260], [290, 260]]); wire(S, [[390, 260], [416, 260]]);
    wire(S, [[L, 330], [290, 330]]); wire(S, [[R, 330], [390, 330]]);
  }
  r();
  return g;
}

scene(L9, 'The booster is just another amplifier', 50, (S) => {
  header(S, 'LEC 9 · YOUR PAGE, TOP', 'A_aux = G_m,aux × R_out,aux — read it like any amplifier');
  const g = foldedBoost(S);
  S.fade(g, 0.2, 0.8);
  S.say(0.2, 'Lecture 9 opens with Lecture 8’s folded booster. Your page circles it in red and writes $A_{aux} = V_{out}/V_{in}$: treat it as an ordinary amplifier.');
  S.halo(170, 210, 410, 400, C.red, 4, null, 'A_aux = V_out / V_in');
  const ln = [
    ['A_v = G_mR_{out},\\quad G_m = g_{m1}', 8, 'The main amplifier, as always: $G_m = g_{m1}$ (the current divider of Lec 8)…'],
    ['R_{out} = (1 + A_{aux})\\,g_{m2}r_{O2}r_{O1}', 13, '…and the boosted output resistance.'],
    ['A_{aux} = G_{m,aux}R_{out,aux} = g_{m3}\\cdot g_{m4}r_{O4}r_{O3}', 18, 'The booster’s own gain, read the same way: its input device M3 gives $g_{m3}$; looking into M4’s drain you see a cascode, $g_{m4}r_{O4}r_{O3}$.'],
    ['A_v = g_{m1}\\left[1 + g_{m3}g_{m4}r_{O4}r_{O3}\\right]g_{m2}r_{O2}r_{O1}', 25, 'Substitute: your page’s final line. Roughly $(g_mr_O)^4$ — a cascode’s gain times a cascode’s gain.'],
  ];
  ln.forEach(([tex, t, say], i) => { eqAt(S, tex, 1170, 220 + i * 100, t, { size: i === 3 ? 28 : 32, w: 780, color: i === 3 ? '#ffd38a' : C.text }); S.say(t, say); });
  whyBox(S, 820, 660, 740, 150, '**Method for any boosted circuit:** find the main $G_m$, find the booster’s gain as $G_{m,aux}R_{out,aux}$, and multiply the cascode by $(1 + A_{aux})$.', 33);
  S.say(33, '<span class="why">Exam method:</span> main $G_m$, then the booster’s $G_{m,aux}R_{out,aux}$, then multiply the cascode’s resistance by $(1 + A_{aux})$.');
});

scene(L9, 'Boosting a differential pair: one booster for both sides', 58, (S) => {
  header(S, 'LEC 9 · DIFFERENTIAL BOOSTING', 'Two boosters (A₁ = A₂) ⇔ one differential booster');
  const a = pairBoost(S, 'two'); a.setAttribute('transform', 'translate(60 140)'); S.draw(a, 0.3, 2);
  S.say(0.3, 'A real op amp is differential. Each cascode (M3, M4) needs its own booster, and they must match: $A_1 = A_2$.');
  const eqs = txt(S, 800, 520, '⇔', { size: 60, color: C.amb, anchor: 'middle', weight: 800 }); eqs.style.opacity = 0; S.fade(eqs, 12, 0.5);
  const b = pairBoost(S, 'one'); b.setAttribute('transform', 'translate(860 140)'); S.draw(b, 12.5, 2);
  S.say(12.5, 'Your page draws an equivalent: <b>one</b> differential amplifier sitting between the two cascodes, watching both sources and driving both gates.');
  S.flow([[260, 470], [260, 430]], 20, 34, { color: C.volt, speed: 40 });
  label(S, 160, 760, 'X up, Y down', 20, { size: 20, color: C.volt, weight: 700, out: 34 });
  S.say(20, '<span class="why">Why one amplifier is enough:</span> for a differential signal, X and Y move in <b>opposite</b> directions — exactly what a differential amplifier is built to sense.');
  S.say(28, 'It sees X − Y and drives the two gates in opposite directions: both cascodes boosted, one amplifier.');
  whyBox(S, 860, 780, 680, 90, 'Same boost, half the hardware — but its own headroom cost (next).', 36);
  S.say(36, 'Half the hardware for the same boost. But that booster has inputs, and inputs have levels — which costs headroom. Next scene.');
});

/* the differential CS booster of the page (M5, M6, I_SS1) */
function diffCsBoost(S) {
  const g = S.g(); const r = S.into(g);
  rail(S, 180, 960, 140);
  const L = 420, R = 700;
  const m3 = nmos(S, L, 330, { name: 'M3' }); const m4 = nmos(S, R, 330, { name: 'M4', right: true });
  wire(S, [[L, 280], [L, 250]]); wire(S, [[R, 280], [R, 250]]);
  txt(S, L, 240, 'V_out1', { size: 19, color: C.volt, anchor: 'middle', weight: 700 }); txt(S, R, 240, 'V_out2', { size: 19, color: C.volt, anchor: 'middle', weight: 700 });
  wire(S, [[L, 380], [L, 440]]); wire(S, [[R, 380], [R, 440]]); dot(S, L, 410); dot(S, R, 410);
  txt(S, L + 12, 404, 'X', { size: 20, color: C.bad, weight: 750 }); txt(S, R - 12, 404, 'Y', { size: 20, color: C.bad, weight: 750, anchor: 'end' });
  nmos(S, L, 490, { name: 'M1', gate: 'V_in1', right: true, nameSide: 'l' }); nmos(S, R, 490, { name: 'M2', gate: 'V_in2', nameSide: 'r' });
  wire(S, [[L, 540], [L, 558], [R, 558], [R, 540]]);
  isrc(S, 560, 600, { label: 'I_SS', len: 42 }); gnd(S, 560, 642);
  // booster
  isrc(S, 250, 190, { label: 'I_1', left: true }); wire(S, [[250, 140], [250, 148]]);
  wire(S, [[250, 232], [250, 360]]); dot(S, 250, 330); wire(S, [[250, 330], [m3.gate[0], 330]]);
  const m5 = nmos(S, 250, 410, { name: 'M5', right: true, nameSide: 'l', gl: 40 });
  wire(S, [[m5.gate[0], 410], [L, 410]]);
  isrc(S, 870, 190, { label: 'I_2' }); wire(S, [[870, 140], [870, 148]]);
  wire(S, [[870, 232], [870, 360]]); dot(S, 870, 330); wire(S, [[870, 330], [m4.gate[0], 330]]);
  const m6 = nmos(S, 870, 410, { name: 'M6', nameSide: 'r', gl: 40 });
  wire(S, [[m6.gate[0], 410], [R, 410]]);
  wire(S, [[250, 460], [250, 700], [870, 700], [870, 460]]);
  isrc(S, 560, 742, { label: 'I_SS1', len: 42 }); gnd(S, 560, 784);
  r();
  return g;
}

scene(L9, 'Differential booster with M5, M6: the headroom bill', 64, (S) => {
  header(S, 'LEC 9 · YOUR PAGE, RED CIRCLE', 'A differential CS booster: V_out,min = V_ISS1 + V_GS5 + V_ov3');
  const g = diffCsBoost(S);
  S.draw(g, 0.3, 2.4);
  S.say(0.3, 'The simplest differential booster: a pair M5, M6 with its own tail $I_{SS1}$ and loads $I_1$, $I_2$. M5’s gate watches X, its drain drives M3’s gate (same on the right).');
  S.say(8, 'Sign check: X rises → M5 conducts more → M3’s gate is pulled down → M3 fights back. Correct.');
  // the walk up from ground
  const sc = 230, yb = 820, x0 = 1150;
  const tw = tower(S, x0, yb, [{ v: 0.2, name: 'I_SS1', st: 'min', note: 'check: V_ISS1' }, { v: 0.7, name: 'M5', st: 'diode', note: 'link: V_GS5 to X' }, { v: 0.2, name: 'M3', st: 'sq', note: 'check: V_ov3' }], sc, { w: 100, nodes: ['0', '0.2', 'X 0.9', 'V_out,min 1.1'] });
  tw.style.opacity = 0; S.fade(tw, 14, 0.8);
  S.say(14, '<span class="why">The cost.</span> Walk up from ground to the lowest output: the booster’s tail needs its $V_{ISS1}$ (a check)…');
  S.say(20, '…then up a <b>link</b>: M5’s gate is X, a whole $V_{GS5}$ above M5’s source. So X sits at $V_{ISS1} + V_{GS5}$…');
  S.say(26, '…then the cascode M3 needs its own $V_{ov3}$ above X.');
  eqAt(S, 'V_{out,min} = V_{ISS1} + V_{GS5} + V_{ov3}', 1240, 280, 30, { size: 34, w: 640, color: '#ffb36b' });
  S.say(30, 'Your page’s line: $V_{out,min} = V_{ISS1} + V_{GS5} + V_{ov3}$ — with our numbers 1.1 V, against 0.4 V for a plain cascode.');
  whyBox(S, 960, 340, 560, 150, '**Every booster input is a level question:** walk up from ground — a $V_{ov}$ per channel (check), a $V_{GS}$ per gate (link).', 38);
  S.say(38, 'The general rule: whenever a booster’s gate sits on a cascode source, that source must hold the booster’s whole input stack up. The fix is a booster whose input works at low levels — next.');
});

/* the folded-cascode auxiliary of the page (M5, M7, M9, M11, M13) */
function foldedAuxFull(S) {
  const g = S.g(); const r = S.into(g);
  rail(S, 380, 980, 160);
  const xa = 500;
  pmos(S, xa, 210, { name: 'M13', gate: 'V_b4' }); wire(S, [[xa, 160], [xa, 160]]);
  pmos(S, xa, 310, { name: 'M11', gate: 'V_b3' });
  wire(S, [[xa, 360], [xa, 390]]); dot(S, xa, 370);
  nmos(S, xa, 440, { name: 'M7', gate: 'V_b1' });
  wire(S, [[xa, 490], [xa, 530]]); dot(S, xa, 510); txt(S, xa - 12, 516, 'F', { size: 20, color: C.bad, weight: 750, anchor: 'end' });
  nmos(S, xa, 580, { name: 'M9', gate: 'V_b2' }); gnd(S, xa, 630);
  // input M5 with its local tail
  isrc(S, 700, 440, { label: 'I_T', len: 34 }); wire(S, [[680, 406], [720, 406]], { w: 3 }); txt(S, 700, 396, 'V_DD', { size: 15, color: C.muted, anchor: 'middle' });
  const m5 = pmos(S, 700, 524, { name: 'M5', right: true, gl: 40, nameSide: 'l' });
  wire(S, [[700, 474], [700, 474]]);
  wire(S, [[700, 574], [700, 610], [580, 610], [580, 510], [xa, 510]]);
  // main cascode
  const xm = 920;
  const m3 = nmos(S, xm, 370, { name: 'M3', gl: 50 });
  wire(S, [[xm, 320], [xm, 220]]); arrow(S, xm + 40, 230, xm + 40, 280, { color: C.n, w: 2.4, head: 10 }); txt(S, xm + 50, 248, 'R_out', { size: 20, color: C.n, weight: 700 });
  wire(S, [[xa, 370], [800, 370], [800, 370], [m3.gate[0], 370]]);
  wire(S, [[xm, 420], [xm, 480]]); dot(S, xm, 450); txt(S, xm + 12, 456, 'X', { size: 20, color: C.bad, weight: 750 });
  wire(S, [[m5.gate[0], 524], [800, 524], [800, 450], [xm, 450]]);
  nmos(S, xm, 530, { name: 'M1', gate: 'V_in', right: true, nameSide: 'l' }); gnd(S, xm, 580);
  r();
  return g;
}

scene(L9, 'A whole folded cascode as the booster', 62, (S) => {
  header(S, 'LEC 9 · YOUR PAGE, MIDDLE', 'Folded-cascode booster: look up, look down, multiply');
  const g = foldedAuxFull(S); g.setAttribute('transform', 'translate(-300 40)');
  S.draw(g, 0.3, 2.4);
  S.halo(140, 160, 480, 520, C.red, 3, null, 'booster (red loop on your page)');
  S.say(0.3, 'The best booster we know is a full <b>folded cascode</b>. Your page: PMOS input M5 (gate on X), NMOS cascode M7, bottom source M9, PMOS cascode load M11 on M13.');
  S.say(9, 'Its output (node between M11 and M7) drives the main cascode M3’s gate. Read its gain exactly like Lec 5–6.');
  const up = arrow(S, 160, 400, 160, 300, { color: C.p }); S.fade(up, 14, 0.4);
  const cu = chip(S, 1150, 250, 'look up:  R_up,aux = g_m11 r_O11 r_O13', { color: C.p, size: 21 }); cu.style.opacity = 0; S.pop(cu, 14);
  const dn = arrow(S, 160, 420, 160, 540, { color: C.n }); S.fade(dn, 18, 0.4);
  const cd = chip(S, 1150, 320, 'look down:  R_down,aux = g_m7 r_O7 (r_O9 ∥ r_O5)', { color: C.n, size: 21 }); cd.style.opacity = 0; S.pop(cd, 18);
  S.say(14, 'Looking <b>up</b> from its output: the PMOS cascode, $g_{m11}r_{O11}r_{O13}$.');
  S.say(18, 'Looking <b>down</b>: the NMOS cascode M7, with <b>two</b> resistances on its source (the fold node F): $r_{O9}\\parallel r_{O5}$ — the folded-cascode signature.');
  const ln = [
    ['A_{aux} = G_{m,aux}R_{out,aux} = g_{m5}\\left[R_{up,aux}\\parallel R_{down,aux}\\right]', 24],
    ['= g_{m5}\\left[g_{m11}r_{O11}r_{O13}\\parallel g_{m7}r_{O7}(r_{O9}\\parallel r_{O5})\\right]', 29],
    ['R_{out} = (1 + A_{aux})\\,g_{m3}r_{O3}r_{O1}', 34],
  ];
  ln.forEach(([tex, t], i) => eqAt(S, tex, 1160, 650 + i * 72, t, { size: 26, w: 860, color: i === 2 ? '#ffd38a' : C.text }));
  S.say(24, 'So $A_{aux} = g_{m5}[R_{up,aux}\\parallel R_{down,aux}]$ — your page’s two lines.');
  S.say(34, 'And the main cascode’s $R_{out} = (1 + A_{aux})g_{m3}r_{O3}r_{O1}$. This is exactly the circuit of the 2024 mid-sem Q4 (solved below).');
  S.say(44, '<span class="why">Why a PMOS input here?</span> M5’s gate sits on X, which is low (one $V_{ov}$ above ground). A PMOS input works there — Lec 6’s rule. Next scene uses that rule twice.');
});

/* telescopic with both cascodes boosted (A1 on the NMOS cascodes, A2 on the PMOS cascodes) */
function teleBoosted(S) {
  const g = S.g(); const r = S.into(g);
  rail(S, 420, 980, 150);
  const L = 560, R = 840;
  const m7 = pmos(S, L, 205, { name: 'M7', right: true, gl: 24, nameSide: 'l' }); const m8 = pmos(S, R, 205, { name: 'M8', gl: 24, nameSide: 'r' });
  wire(S, [[m7.gate[0], 205], [m8.gate[0], 205]]); txt(S, 700, 196, 'V_b', { size: 18, color: C.muted, anchor: 'middle' });
  wire(S, [[L, 150], [L, 155]]); wire(S, [[R, 150], [R, 155]]);
  wire(S, [[L, 255], [L, 280]]); wire(S, [[R, 255], [R, 280]]); dot(S, L, 268); dot(S, R, 268);
  pmos(S, L, 330, { name: 'M5', right: true, gl: 26, nameSide: 'l' }); pmos(S, R, 330, { name: 'M6', gl: 26, nameSide: 'r' });
  dbox(S, 640, 250, 120, 100, 'A₂', C.p);
  wire(S, [[L, 268], [640, 268]]); wire(S, [[R, 268], [760, 268]]); wire(S, [[616, 330], [640, 330]]); wire(S, [[760, 330], [784, 330]]);
  wire(S, [[L, 380], [L, 440]]); wire(S, [[R, 380], [R, 440]]); dot(S, L, 410); dot(S, R, 410);
  txt(S, L - 14, 416, 'V_out1', { size: 19, color: C.volt, weight: 700, anchor: 'end' }); txt(S, R + 14, 416, 'V_out2', { size: 19, color: C.volt, weight: 700 });
  nmos(S, L, 490, { name: 'M3', right: true, gl: 26, nameSide: 'l' }); nmos(S, R, 490, { name: 'M4', gl: 26, nameSide: 'r' });
  dbox(S, 640, 470, 120, 100, 'A₁', C.n);
  wire(S, [[616, 490], [640, 490]]); wire(S, [[760, 490], [784, 490]]);
  wire(S, [[L, 540], [L, 570]]); wire(S, [[R, 540], [R, 570]]); dot(S, L, 555); dot(S, R, 555);
  wire(S, [[L, 555], [640, 555]]); wire(S, [[R, 555], [760, 555]]);
  nmos(S, L, 620, { name: 'M1', gate: 'V_in1' }); nmos(S, R, 620, { name: 'M2', gate: 'V_in2', right: true });
  wire(S, [[L, 670], [L, 690], [R, 690], [R, 670]]);
  isrc(S, 700, 730, { label: 'I_SS', len: 40 }); gnd(S, 700, 770);
  r();
  return g;
}

scene(L9, 'Boost both cascodes: which input type for each booster?', 66, (S) => {
  header(S, 'LEC 9 · YOUR PAGE, BOTTOM', 'A₁ uses PMOS inputs, A₂ uses NMOS inputs — because of levels');
  const g = teleBoosted(S); g.setAttribute('transform', 'translate(-300 40)');
  S.draw(g, 0.3, 2.6);
  S.say(0.3, 'Your page’s telescopic with <b>both</b> cascode pairs boosted: $A_1$ watches the NMOS cascodes M3, M4; $A_2$ watches the PMOS cascodes M5, M6.');
  // levels
  const sc = 150, yb = 470;
  const lv = S.g();
  S.el('line', { x1: 1000, y1: yb, x2: 1000, y2: yb - 1.8 * sc, stroke: C.dim, 'stroke-width': 2 }, lv);
  [[0, '0 V', C.muted], [0.4, 'M3, M4 sources ≈ 0.4 V (low)', C.n], [1.5, 'M5, M6 sources ≈ 1.5 V (high)', C.p], [1.8, 'V_DD', C.muted]].forEach(([v, t, col]) => {
    S.el('line', { x1: 990, y1: yb - v * sc, x2: 1010, y2: yb - v * sc, stroke: col, 'stroke-width': 3 }, lv);
    txt(S, 1022, yb - v * sc + 7, t, { size: 19, color: col, weight: 600 }, lv);
  });
  lv.style.opacity = 0; S.fade(lv, 9, 0.8);
  S.say(9, 'A booster’s inputs sit on the sources it watches. Where are they? M3, M4’s sources are only a couple of overdrives above ground. M5, M6’s sources are near $V_{DD}$.');
  whyBox(S, 1000, 520, 560, 150, '**A₁ (low inputs):** a folded-cascode diff amp with **PMOS inputs** — a folded PMOS pair works with its input near (even below) ground.', 18);
  S.say(18, 'So $A_1$ must accept inputs near ground: a folded-cascode amplifier with <b>PMOS</b> input devices (Lec 6: its CM floor passes ground).');
  whyBox(S, 1000, 690, 560, 130, '**A₂ (high inputs):** **NMOS inputs** — a folded NMOS pair’s CM ceiling passes $V_{DD}$.', 26);
  S.say(26, 'And $A_2$ must accept inputs near $V_{DD}$: <b>NMOS</b> input devices (their CM ceiling passes $V_{DD}$). Your page writes both labels in red.');
  S.say(36, '<span class="why">That is Lec 6 paying off:</span> the folding rule “PMOS input reaches ground, NMOS input reaches $V_{DD}$” decides how to build each booster.');
  S.say(46, 'Your page ends with the same idea applied to a folded-cascode main amplifier (input pair M1, M2 folded into the boosted cascodes). Same reasoning, same choice of booster inputs.');
});

/* why CMFB: RD loads vs current-source loads, and the I_P / I_N model */
scene(L9, 'Why a fully differential op amp needs CMFB', 74, (S) => {
  header(S, 'LEC 9 · COMMON-MODE FEEDBACK', 'Two current sources in series do not set a voltage');
  const a = S.g(); const r1 = S.into(a);
  rail(S, 90, 410, 170);
  res(S, 160, 170, 260, { label: 'R_D' }); res(S, 340, 170, 260, { label: 'R_D', left: true });
  nmos(S, 160, 320, { name: 'M1', gate: 'V_in1' }); nmos(S, 340, 320, { name: 'M2', gate: 'V_in2', right: true });
  wire(S, [[160, 260], [160, 270]]); wire(S, [[340, 260], [340, 270]]);
  wire(S, [[160, 370], [160, 390], [340, 390], [340, 370]]); isrc(S, 250, 430, { label: 'I_SS', len: 40 }); gnd(S, 250, 470);
  r1();
  S.draw(a, 0.3, 1.6);
  eqAt(S, 'V_{out,CM} = V_{DD} - R_D\\tfrac{I_{SS}}{2}', 250, 560, 3, { size: 28, w: 460 });
  S.say(0.3, 'With <b>resistor</b> loads the output DC level is automatic: each $R_D$ drops $R_DI_{SS}/2$, so $V_{out,CM} = V_{DD} - R_DI_{SS}/2$. Nothing to worry about.');
  const b = S.g(); const r2 = S.into(b);
  rail(S, 590, 910, 170);
  pmos(S, 660, 230, { name: 'M3', right: true, gl: 30, nameSide: 'l' }); pmos(S, 840, 230, { name: 'M4', gl: 30 });
  wire(S, [[720, 230], [780, 230]]); txt(S, 750, 220, 'V_b', { size: 18, color: C.muted, anchor: 'middle' });
  wire(S, [[660, 170], [660, 180]]); wire(S, [[840, 170], [840, 180]]);
  nmos(S, 660, 330, { name: 'M1', gate: 'V_in1' }); nmos(S, 840, 330, { name: 'M2', gate: 'V_in2', right: true });
  wire(S, [[660, 380], [660, 400], [840, 400], [840, 380]]); isrc(S, 750, 440, { label: 'I_SS', len: 40 }); gnd(S, 750, 480);
  r2();
  S.draw(b, 8, 1.6);
  const qm = label(S, 750, 560, 'V_out,CM = ?', 10, { size: 30, color: C.bad, weight: 800, anchor: 'middle' });
  S.say(8, 'Replace the resistors by PMOS current sources (for gain). Now each output sits between a PMOS source pushing $I_P$ down and the pair + tail pulling $I_N$ out.');
  // the model
  const c = S.g(); const r3 = S.into(c);
  rail(S, 1100, 1460, 170);
  isrc(S, 1180, 250, { label: 'I_P', left: true }); res(S, 1330, 170, 330, { label: 'R_P' });
  wire(S, [[1180, 170], [1180, 208]]); wire(S, [[1180, 292], [1180, 360], [1330, 360], [1330, 330]]);
  dot(S, 1255, 360); wire(S, [[1255, 360], [1255, 360]]);
  isrc(S, 1180, 450, { label: 'I_N', left: true }); res(S, 1330, 390, 540, { label: 'R_N' });
  wire(S, [[1180, 360], [1180, 408]]); wire(S, [[1330, 360], [1330, 390]]);
  gnd(S, 1180, 492); gnd(S, 1330, 540);
  wire(S, [[1330, 360], [1420, 360]]); txt(S, 1428, 367, 'V_out', { size: 22, color: C.volt, weight: 700 });
  r3();
  S.draw(c, 15, 1.8);
  S.say(15, 'Model one output node: a current source $I_P$ from the top with its output resistance $R_P$, and $I_N$ to the bottom with $R_N$ (your page’s little picture).');
  eqAt(S, 'I_P = I_N + I_X\\;\\Rightarrow\\; I_X = I_P - I_N', 1280, 600, 22, { size: 28, w: 560 });
  S.say(22, 'If the two currents are not exactly equal, the difference $I_X = I_P - I_N$ has only one place to go: into $R_P\\parallel R_N$.');
  eqAt(S, '\\Delta V_{out,CM} = (I_P - I_N)(R_P\\parallel R_N)', 1280, 670, 28, { size: 30, w: 600, color: '#ffb36b' });
  // the drift animation
  const vbar = S.el('rect', { x: 1490, y: 360, width: 18, height: 0, rx: 6, fill: C.bad });
  S.anim(34, 6, 'drift', (p) => { vbar.setAttribute('y', 360 - 180 * p); vbar.setAttribute('height', 180 * p); }, E.inout);
  label(S, 1540, 210, 'rail!', 39, { size: 20, color: C.bad, weight: 800, anchor: 'middle' });
  S.say(28, 'And $R_P\\parallel R_N$ is huge — hundreds of kΩ (more with cascodes). A mismatch of just 1 µA × 500 kΩ = 0.5 V…');
  S.say(34, '…a few µA more and the output runs into a rail. Process mismatch makes this certain: the output common-mode level is <b>undefined</b>.');
  whyBox(S, 120, 640, 880, 180, '**The fix (Lec 10–12): common-mode feedback.** Sense the output CM, compare it with a reference $V_{REF}$, and adjust one of the current sources until they match exactly. The differential signal is untouched.', 42);
  S.say(42, '<span class="why">So:</span> a high-gain fully differential amplifier always needs a loop that <b>senses</b> the output CM, <b>compares</b> it with $V_{REF}$ and <b>corrects</b> a current source. That loop is CMFB — Lectures 10–12.');
});

scene(L9, 'Lecture 9 in one card', 28, (S) => {
  header(S, 'LEC 9 · REMEMBER', 'Everything from Lecture 9');
  remember(S, [
    'The booster is an amplifier: $A_{aux} = G_{m,aux}R_{out,aux}$. Folded booster: $A_v = g_{m1}[1 + g_{m3}g_{m4}r_{O4}r_{O3}]g_{m2}r_{O2}r_{O1}$.',
    'Differential pair: $A_1 = A_2$, or **one differential booster** (X and Y move oppositely).',
    'Differential CS booster headroom: $V_{out,min} = V_{ISS1} + V_{GS5} + V_{ov3}$ (check, link, check).',
    'Folded-cascode booster: $A_{aux} = g_{m5}[g_{m11}r_{O11}r_{O13}\\parallel g_{m7}r_{O7}(r_{O9}\\parallel r_{O5})]$, $R_{out} = (1+A_{aux})g_{m3}r_{O3}r_{O1}$.',
    'NMOS cascodes (low sources) → booster with **PMOS inputs**; PMOS cascodes (high) → **NMOS inputs**.',
    'Current-source loads leave the output CM undefined: $\\Delta V_{out,CM} = (I_P - I_N)(R_P\\parallel R_N)$ → need **CMFB**.',
  ], 0.4, 'Lecture 9 · remember');
  S.say(0.4, 'Now every Lecture 9 question: Tutorial 4 Q3 and the 2024 mid-sem Q4, solved part by part — you first.');
});

/* ── Lecture 9 past papers ── */
/* Tutorial 4 Q3, as printed: bias string M8–R1–R2–M7, folded booster M3 (on R3), M4, M5, M9; main M6, M2, M1 */
function t4q3Fig(S) {
  const g = S.g(); const r = S.into(g);
  rail(S, 70, 880, 150);
  const xb = 140, x3 = 330, xa = 520, xm = 760;
  // bias string
  pmos(S, xb, 210, { name: 'M8', right: true, gl: 24, nameSide: 'l' }); wire(S, [[xb, 150], [xb, 160]]);
  wire(S, [[xb, 260], [xb, 275]]); dot(S, xb, 268); wire(S, [[xb, 268], [194, 268], [194, 210]]); dot(S, 194, 210);
  res(S, xb, 275, 355, { label: 'R_1', left: true }); dot(S, xb, 355); res(S, xb, 355, 435, { label: 'R_2', left: true });
  nmos(S, xb, 485, { name: 'M7', right: true, gl: 24, nameSide: 'l' }); wire(S, [[xb, 435], [xb, 435]]); dot(S, xb, 448); wire(S, [[xb, 448], [194, 448], [194, 485]]); gnd(S, xb, 535);
  wire(S, [[194, 210], [456, 210]]); // Vbp to M5
  wire(S, [[xb, 355], [440, 355], [440, 360]]); // Vb4 to M4 gate
  wire(S, [[194, 485], [470, 485]]); // Vbn to M9 gate
  // M3 on R3
  res(S, x3, 150, 230, { label: 'R_3' });
  const m3 = pmos(S, x3, 280, { name: 'M3', right: true, gl: 30, nameSide: 'l' });
  wire(S, [[x3, 330], [x3, 420], [xa, 420]]);
  // folded booster
  pmos(S, xa, 210, { name: 'M5', gl: 30 }); wire(S, [[xa, 150], [xa, 160]]);
  wire(S, [[xa, 260], [xa, 310]]); dot(S, xa, 285);
  nmos(S, xa, 360, { name: 'M4', gl: 60 });
  wire(S, [[xa, 410], [xa, 435]]); dot(S, xa, 420); txt(S, xa + 12, 436, 'F', { size: 18, color: C.bad, weight: 750 });
  nmos(S, xa, 485, { name: 'M9', gl: 30 }); gnd(S, xa, 535);
  // main
  pmos(S, xm, 210, { name: 'M6', gl: 30 }); wire(S, [[xm, 150], [xm, 160]]);
  wire(S, [[430, 210], [430, 172], [650, 172], [650, 210], [xm - 64, 210]]); dot(S, 430, 210); // Vbp on to M6 (crosses M5’s supply lead)
  wire(S, [[xm, 260], [xm, 310]]); dot(S, xm, 280); wire(S, [[xm, 280], [850, 280]]); txt(S, 858, 287, 'V_out', { size: 19, color: C.volt, weight: 700 });
  const m2 = nmos(S, xm, 360, { name: 'M2', gl: 40 });
  wire(S, [[xa, 285], [640, 285], [640, 360], [m2.gate[0], 360]]);
  wire(S, [[xm, 410], [xm, 435]]); dot(S, xm, 420); txt(S, xm + 12, 436, 'V_P', { size: 18, color: C.bad, weight: 750 });
  wire(S, [[m3.gate[0], 280], [400, 280], [400, 250], [690, 250], [690, 420], [xm, 420]]);
  nmos(S, xm, 485, { name: 'M1', gate: 'V_in', right: true, nameSide: 'l' }); gnd(S, xm, 535);
  r();
  return g;
}

scene(L9, 'Tutorial 4 Q3: folded booster, every part', 96, (S) => {
  const T = tfm(1, 0, 150);
  pyqFrame(S, {
    paper: 't4q3', tag: 'LEC 9 · PAST PAPER 1 OF 3', title: 'Folded-cascode booster, designed from a power budget', src: 'Tutorial 4 Q3',
    q: '$V_{DD} = 3$ V, 3 mW. $M_{1,2} = 200$ at 500 µA. $(W/L)_5 = (W/L)_8 = 0.4(W/L)_6$, $(W/L)_3 = 0.5(W/L)_6$, $(W/L)_{4,9} = (W/L)_1$. (a) $(W/L)_6$ for a 2.5 V swing. (b) $R_3$ with $V_P = V_{ov1}$. (c) $V_{DS9} = 1.15V_{ov9}$: is M4 saturated? (d) $(W/L)_7$, $R_1$, $R_2$. (e) Gain.',
    giv: '$\\mu_nC_{ox} = 200\\,\\mu$, $\\mu_pC_{ox} = 100\\,\\mu$A/V², $\\lambda_n = 0.1$, $\\lambda_p = 0.2$, $V_{thn} = 0.7$, $|V_{thp}| = 0.8$ V', qh: 300,
    tests: 'a full design of Lec 8’s implementation 3: **currents from power** (equal $|V_{GS}|$ → currents ∝ W/L), **swing → sizes**, **links to walk a bias string**, a **saturation check**, and the **load trap**.',
    fig: (S2) => { const g = t4q3Fig(S2); g.setAttribute('transform', 'translate(0 150)'); },
    steps: [
      { t: 8, title: '**Currents first:** 3 mW / 3 V = 1 mA. M5, M8 share M6’s $|V_{GS}|$, so their currents scale with W/L (0.4 × 500 µA); M3 gets the rest; M9 sinks M4’s + M3’s', tex: stepTex('bank-t4q3', 0), hl: [T([60, 150, 820, 120, C.cur])],
        try: { q: 'Total current 1 mA. M6 takes 500 µA, M5 and M8 take 0.4 × 500 µA each. How much is left for M3 (µA)?', answer: 100e-6, unit: 'A (type 100u)', tol: 0.02, hint: '1 mA − 0.5 − 0.2 − 0.2.' },
        say: 'Always start with currents. Same gate voltage (all tied to $V_{bp}$) means currents scale with W/L: M5, M8 carry 200 µA; M3 gets 100 µA; M9 carries 300 µA.' },
      { t: 17, title: '**(a)** $V_{out}$ runs from $2V_{ov1}$ (M1, M2 identical) to $V_{DD} - |V_{ov6}|$; solve for $|V_{ov6}|$, then W/L', tex: stepTex('bank-t4q3', 1), hl: [T([690, 150, 160, 290, C.p])],
        try: { q: 'V<sub>ov1</sub> = 0.1581 V. Swing 2.5 V from 2V<sub>ov1</sub> up to 3 − |V<sub>ov6</sub>|. What is (W/L)<sub>6</sub> (500 µA, µpCox = 100 µA/V²)?', answer: ans('bank-t4q3', 'wl6'), unit: '', tol: 0.02, hint: '|Vov6| = 3 − 2.5 − 2(0.1581); W/L = 2ID/(µpCox·Vov²).' },
        say: 'Floor: two NMOS overdrives (M1, M2). Ceiling: $V_{DD} - |V_{ov6}|$. With 2.5 V between them, $|V_{ov6}| = 0.184$ V and $(W/L)_6 = 296$.' },
      { t: 26, title: '**(b)** M3’s gate is $V_P = V_{ov1}$; its source sits $|V_{GS3}|$ higher (a link); $R_3$ drops the rest at 100 µA', tex: stepTex('bank-t4q3', 2), hl: [T([260, 150, 140, 180, C.amb])],
        try: { q: 'V<sub>S3</sub> = 0.1581 + 0.8 + 0.1162 = 1.074 V; M3 carries 100 µA. What is R<sub>3</sub> (kΩ)?', answer: ans('bank-t4q3', 'r3'), unit: 'Ω (type 19.3k)', tol: 0.02, hint: 'R3 = (3 − VS3)/100 µA.' },
        say: 'Walk the levels: M3’s gate is $V_P$; its source is one $|V_{GS3}|$ above; $R_3 = (3 - 1.074)/100\\,\\mu$A ≈ 19.3 kΩ.' },
      { t: 35, title: '**(c)** F = $1.15V_{ov9}$; M4’s gate = F + $V_{GS4}$; M4’s drain = M2’s gate = $V_P + V_{GS2}$. NMOS fence', tex: stepTex('bank-t4q3', 3), hl: [T([450, 300, 140, 160, C.n])],
        try: { q: 'M4’s drain sits at 1.016 V; its gate − V<sub>th</sub> is 0.241 V. Is M4 saturated?', choices: ['Yes — drain ≥ gate − Vth', 'No — triode'], answer: 0, hint: 'NMOS saturated while drain ≥ gate − Vth.' },
        say: 'Check: M4’s drain (M2’s gate) is at 1.016 V, far above its gate minus $V_{th}$ (0.241 V). Saturated.' },
      { t: 43, title: '**(d)** M7 mirrors M9 (same gate): sizes scale with current', tex: stepTex('bank-t4q3', 4), hl: [T([80, 430, 140, 110, C.n])],
        try: { q: 'M9: W/L = 200 at 300 µA. M7 has the same V<sub>GS</sub> and carries 200 µA. (W/L)<sub>7</sub>?', answer: ans('bank-t4q3', 'wl7'), unit: '', tol: 0.02, hint: '200 × 200/300.' },
        say: 'Same $V_{GS}$, so W/L ∝ current: $(W/L)_7 = 200\\times200/300 = 133$.' },
      { t: 51, title: 'Walk the bias string: $R_2$ from $V_{GS7}$ up to $V_{G4}$, $R_1$ from $V_{G4}$ up to M8’s drain', tex: stepTex('bank-t4q3', 5), hl: [T([80, 260, 120, 190, C.amb])],
        try: { q: 'R<sub>2</sub> carries 200 µA between V<sub>GS7</sub> = 0.8225 V and V<sub>G4</sub> = 0.9408 V. R<sub>2</sub> (Ω)?', answer: ans('bank-t4q3', 'r2'), unit: 'Ω', tol: 0.02, hint: 'R = ΔV / I.' },
        say: 'Bias string: each resistor is (voltage across it)/200 µA. $R_2 ≈ 592$ Ω, $R_1 ≈ 5.38$ kΩ.' },
      { t: 59, title: '**(e)** Booster gain: M3 degenerated by $R_3$, into $r_{O5}\\parallel$(M4 cascoded over $r_{O9}$)', tex: stepTex('bank-t4q3', 7), hl: [T([260, 150, 400, 400, C.amb])],
        say: 'The booster’s input device has $R_3$ in its source, so its $G_m$ is only $g_{m3}/(1 + g_{m3}R_3)$ — a weak booster here, $A_{aux} ≈ 1.26$.' },
      { t: 67, title: 'Boosted $R_{down}$ is MΩ, but M6 is a plain PMOS source: **the load trap**', tex: stepTex('bank-t4q3', 8), hl: [T([690, 150, 160, 120, C.bad])],
        try: { q: 'g<sub>m1</sub> = 6.325 mS, R<sub>boost</sub> = 5.75 MΩ, r<sub>O6</sub> = 10 kΩ. |A<sub>v</sub>|?', answer: ans('bank-t4q3', 'av'), unit: 'V/V', tol: 0.03, hint: 'gm1 × (5.75 M ∥ 10 k).' },
        say: 'And the load trap again: M6’s 10 kΩ in parallel with 5.75 MΩ — gain ≈ 63.' },
      { t: 75, ans: true, title: `**Answers:** $(W/L)_6 = ${fx(ans('bank-t4q3', 'wl6'), 4)}$ · $R_3 = ${fx(ans('bank-t4q3', 'r3') / 1e3, 3)}$ kΩ · M4 saturated · $(W/L)_7 = ${fx(ans('bank-t4q3', 'wl7'), 4)}$ · $R_1 = ${fx(ans('bank-t4q3', 'r1') / 1e3, 3)}$ kΩ · $R_2 = ${fx(ans('bank-t4q3', 'r2'), 3)}$ Ω · $|A_v| ≈ ${fx(ans('bank-t4q3', 'av'), 3)}$`, say: 'Design questions always go: currents, then overdrives from the swing, then sizes, then walk every bias node with links, then check saturation, then gain.' },
    ],
  });
}, { q: 'Tutorial 4 Q3' });

/* 2024 mid-sem Q4, as printed: booster M6/M5 (PMOS), M4 (Vb2), M3 (Vb1), PMOS input M7 from VDD; main M2 over M1 */
function m24q4Fig(S) {
  const g = S.g(); const r = S.into(g);
  rail(S, 160, 760, 150);
  const xa = 300, xm = 640;
  pmos(S, xa, 205, { name: 'M6', gate: 'V_b4' }); wire(S, [[xa, 150], [xa, 155]]);
  pmos(S, xa, 305, { name: 'M5', gate: 'V_b3' });
  wire(S, [[xa, 355], [xa, 390]]); dot(S, xa, 370); txt(S, xa - 12, 366, 'G', { size: 19, color: C.amb, weight: 750, anchor: 'end' });
  nmos(S, xa, 440, { name: 'M4', gate: 'V_b2' });
  wire(S, [[xa, 490], [xa, 530]]); dot(S, xa, 510); txt(S, xa - 12, 516, 'F', { size: 19, color: C.bad, weight: 750, anchor: 'end' });
  nmos(S, xa, 580, { name: 'M3', gate: 'V_b1' }); gnd(S, xa, 630);
  const m7 = pmos(S, 460, 460, { name: 'M7', right: true, gl: 30, nameSide: 'l' });
  wire(S, [[460, 410], [460, 396]]); wire(S, [[440, 396], [480, 396]], { w: 3 }); txt(S, 460, 386, 'V_DD', { size: 15, color: C.muted, anchor: 'middle' });
  wire(S, [[460, 510], [460, 530], [380, 530], [380, 510], [xa, 510]]);
  const m2 = nmos(S, xm, 370, { name: 'M2', gl: 50 });
  wire(S, [[xa, 370], [m2.gate[0], 370]]);
  wire(S, [[xm, 320], [xm, 230]]); arrow(S, xm + 40, 240, xm + 40, 290, { color: C.n, w: 2.4, head: 10 }); txt(S, xm + 50, 258, 'R_out', { size: 20, color: C.n, weight: 700 });
  wire(S, [[xm, 420], [xm, 480]]); dot(S, xm, 460); txt(S, xm + 12, 466, 'X', { size: 19, color: C.bad, weight: 750 });
  wire(S, [[m7.gate[0], 460], [xm, 460]]);
  nmos(S, xm, 530, { name: 'M1', gate: 'V_in', right: true, nameSide: 'l' }); gnd(S, xm, 580);
  r();
  return g;
}

scene(L9, '2024 mid-sem Q4: R_out of a folded-boosted cascode', 72, (S) => {
  const T = tfm(1, 0, 110);
  pyqFrame(S, {
    paper: 'm24q4', tag: 'LEC 9 · PAST PAPER 2 OF 3', title: 'How big is R_out with a folded-cascode booster?', src: 'Mid-sem 2024-25 Q4 · 7 marks',
    q: 'All NMOS $V_{ov} = 0.1$ V, all PMOS $|V_{ov}| = 0.2$ V, $I_{D2} = I_{D4} = I_{D7} = 10\\,\\mu$A. Find $R_{out}$ and the minimum and maximum $V_{b2}$.',
    giv: '$V_{DD} = 1.8$ V, $\\lambda_p = 0.2$, $\\lambda_n = 0.1$ V⁻¹, $V_{th0,n} = 0.4$, $|V_{th0,p}| = 0.5$ V', qh: 230,
    tests: 'the Lec 9 folded-cascode booster: **currents by KCL at the fold node**, **booster gain = $g_{m}$ × (look up ∥ look down)**, the **(1 + A)** multiplication, and one **fence** for $V_{b2}$.',
    fig: (S2) => { const g = m24q4Fig(S2); g.setAttribute('transform', 'translate(0 110)'); },
    steps: [
      { t: 8, title: '**Currents by KCL at F:** M3 carries M4’s and M7’s 10 µA each = 20 µA. Then $g_m = 2I_D/V_{ov}$, $r_O = 1/(\\lambda I_D)$', tex: stepTex('pyq-m24-q4', 0), hl: [T([230, 470, 280, 160, C.cur])],
        try: { q: 'M7 is PMOS at 10 µA with |V<sub>ov</sub>| = 0.2 V. What is g<sub>m7</sub> (mS)?', answer: 1e-4, unit: 'S (type 0.1m)', tol: 0.02, hint: 'gm = 2ID/|Vov|.' },
        say: 'KCL at the fold node F: M4 and M7 each bring 10 µA, so M3 sinks 20 µA. Then every $g_m = 2I_D/V_{ov}$ and $r_O = 1/(\\lambda I_D)$.' },
      { t: 17, title: '**Booster gain:** $g_{m7}\\,(R_{up,aux}\\parallel R_{down,aux})$: PMOS cascode M5 on M6 up; NMOS cascode M4 on $r_{O3}\\parallel r_{O7}$ down', tex: stepTex('pyq-m24-q4', 1), hl: [T([230, 150, 300, 480, C.amb])],
        try: { q: 'R<sub>up,aux</sub> = 25 MΩ, R<sub>down,aux</sub> = 50 MΩ, g<sub>m7</sub> = 0.1 mS. What is A<sub>aux</sub>?', answer: ans('pyq-m24-q4', 'aux'), unit: '', tol: 0.02, hint: '0.1m × (25M ∥ 50M).' },
        say: 'Look up from G: the PMOS cascode, 25 MΩ. Look down: M4 cascoded over $r_{O3}\\parallel r_{O7}$ (two r_O on the fold node), 50 MΩ. $A_{aux} = 0.1\\,\\text{mS}\\times16.7\\,\\text{M} ≈ 1667$.' },
      { t: 26, title: '**$R_{out}$:** the main cascode multiplied by $(1 + A_{aux})$', tex: stepTex('pyq-m24-q4', 2), hl: [T([570, 230, 160, 380, C.n])],
        try: { q: 'A<sub>aux</sub> = 1667, g<sub>m2</sub> = 0.2 mS, r<sub>O2</sub> = r<sub>O1</sub> = 1 MΩ. R<sub>out</sub> ≈ (1 + A)g<sub>m2</sub>r<sub>O2</sub>r<sub>O1</sub> in GΩ?', answer: ans('pyq-m24-q4', 'rout'), unit: 'Ω (type 333G)', tol: 0.03, hint: '1668 × 0.2m × 1M × 1M.' },
        say: '$R_{out} ≈ A_{aux}g_{m2}r_{O2}r_{O1} = 1667\\times0.2\\,\\text{mS}\\times1\\,\\text{M}\\times1\\,\\text{M} ≈ 333$ GΩ.' },
      { t: 35, title: '**$V_{b2,min}$:** M3 must stay saturated under M4’s source: $V_{b2} - V_{GS4} \\ge V_{ov3}$', tex: stepTex('pyq-m24-q4', 3), hl: [T([230, 400, 140, 230, C.bad])],
        try: { q: 'V<sub>GS4</sub> = 0.4 + 0.1 V and V<sub>ov3</sub> = 0.1 V. What is the smallest V<sub>b2</sub>?', answer: ans('pyq-m24-q4', 'vb2min'), unit: 'V', tol: 0.01, hint: 'F = Vb2 − VGS4 (a link) must be ≥ Vov3 (a check).' },
        say: 'F is one link below $V_{b2}$; M3 needs F ≥ $V_{ov3}$. So $V_{b2,min} = 0.1 + 0.5 = 0.6$ V.' },
      { t: 43, title: '**$V_{b2,max}$:** M4 must stay saturated. Its drain G is M2’s gate, one link above X: $G = V_X + V_{GS2}$, with X at its lowest, $V_{ov1}$', tex: 'V_{b2} - V_{th4} \\le V_{ov1} + V_{GS2} \\Rightarrow V_{b2,max} = 0.1 + 0.5 + 0.4 = 1.0\\,\\mathrm{V}', hl: [T([230, 330, 140, 160, C.n]), T([570, 320, 160, 160, C.n])],
        try: { q: 'G = V<sub>X</sub> + V<sub>GS2</sub> with V<sub>X</sub> = V<sub>ov1</sub> = 0.1 V and V<sub>GS2</sub> = 0.5 V. NMOS fence on M4 (V<sub>th</sub> = 0.4 V): largest V<sub>b2</sub>?', answer: 1.0, unit: 'V', tol: 0.01, hint: 'M4 saturated: drain G ≥ gate Vb2 − Vth4.' },
        say: 'Raise $V_{b2}$ and M4’s gate climbs towards its drain G. G is M2’s gate: X + $V_{GS2}$ = 0.6 V at the lowest X. M4 stays saturated while $V_{b2} \\le G + V_{th4} = 1.0$ V — the key’s value. (M7’s fence gives 1.1 V, so M4 binds.)' },
      { t: 51, ans: true, title: `**Answers:** $A_{aux} ≈ 1667$ · $R_{out} ≈ 333$ GΩ · $V_{b2,min} = 0.6$ V · $V_{b2,max} = 1$ V (key)`, say: 'Pattern: KCL for currents, $g_m$ and $r_O$ for every device, booster gain by two looks, multiply the cascode by $(1 + A_{aux})$, then fences for the bias limits.' },
    ],
  });
}, { q: 'Mid-sem 2024 Q4' });

scene(L9, 'Exam-style check: the booster’s headroom and input type', 42, (S) => {
  const T = tfm(0.8, 40, 220);
  pyqFrame(S, {
    tag: 'LEC 9 · EXAM-STYLE CHECK (FROM YOUR PAGE)', title: 'Two quick questions an examiner would ask on Lec 9', src: 'Exam-style · built from your Lec 9 page',
    q: 'The differential CS booster (M5, M6, tail $I_{SS1}$) on a cascode pair. $V_{ISS1} = 0.2$ V, $V_{GS5} = 0.7$ V, $V_{ov3} = 0.2$ V. (a) Lowest output. (b) For the NMOS cascodes of a telescopic, which booster input type?',
    qh: 230, tests: 'the two Lec 9 ideas the tutorials lean on: **booster headroom by walking up from ground**, and **input type from the level of the node it watches**.',
    fig: (S2) => { const g = diffCsBoost(S2); g.setAttribute('transform', 'translate(40 220) scale(0.8)'); },
    steps: [
      { t: 8, title: '**(a)** Walk up: tail check, then the link to M5’s gate (= X), then M3’s check', tex: 'V_{out,min} = V_{ISS1} + V_{GS5} + V_{ov3} = 0.2 + 0.7 + 0.2', hl: [T([180, 300, 820, 520, C.amb])],
        try: { q: 'V<sub>ISS1</sub> = 0.2 V, V<sub>GS5</sub> = 0.7 V, V<sub>ov3</sub> = 0.2 V. Lowest V<sub>out</sub>?', answer: 1.1, unit: 'V', tol: 0.01, hint: 'Check + link + check.' },
        say: 'Tail 0.2 (check) + $V_{GS5}$ 0.7 (link: X is M5’s gate) + $V_{ov3}$ 0.2 (check) = 1.1 V.' },
      { t: 16, title: '**(b)** The NMOS cascode sources sit low (≈ 0.2–0.4 V): use a booster whose input works near ground', tex: '\\text{folded-cascode booster with PMOS inputs}',
        try: { q: 'The booster for the NMOS cascodes (sources ≈ 0.3 V) should use…', choices: ['A folded-cascode amplifier with PMOS input devices', 'A folded-cascode amplifier with NMOS input devices'], answer: 0, hint: 'Which input pair’s CM range reaches ground? (Lec 6)', why: 'A folded PMOS pair’s CM floor is Vov − |Vthp|, below ground.' },
        say: 'Low sources need a PMOS input (its CM floor passes ground); the PMOS cascodes’ high sources need NMOS inputs.' },
      { t: 24, ans: true, title: '**Answers:** (a) 1.1 V (vs 0.4 V unboosted) · (b) PMOS-input folded cascode', say: 'Both answers come from the same habit: before using any amplifier, ask where its inputs and outputs must sit.' },
    ],
  });
}, { q: 'Exam-style (Lec 9)' });
