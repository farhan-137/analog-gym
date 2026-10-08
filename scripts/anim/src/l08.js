/* Lecture 8: gain boosting in depth, and three ways to build the booster. */
'use strict';
const L8 = 'Lec 8 · Gain boosting in depth';

/* M with R_S and an amplifier that senses the source; optional test source at the drain */
function boostCell(S, o = {}) {
  const g = S.g(); const r = S.into(g);
  const x = o.x || 900, y = o.y || 400;
  if (o.vin) { wire(S, [[x - 360, y - 22], [x - 320, y - 22]]); txt(S, x - 368, y - 15, 'V_in', { size: 20, color: C.muted, anchor: 'end' }); }
  else { gnd(S, x - 340, y - 10); wire(S, [[x - 340, y - 10], [x - 340, y - 22], [x - 320, y - 22]]); }
  amp(S, x - 320, y, { label: 'A₁', w: 110, h: 100 });
  wire(S, [[x - 210, y], [x - 66, y]]);
  nmos(S, x, y, { name: o.name || 'M2', gl: 46 });
  wire(S, [[x, y - 50], [x, y - 140]]);
  wire(S, [[x, y + 50], [x, y + 90]]); dot(S, x, y + 75);
  wire(S, [[x, y + 75], [x - 340, y + 75], [x - 340, y + 25], [x - 320, y + 25]]);
  res(S, x, y + 90, y + 190, { label: 'R_S' }); gnd(S, x, y + 190);
  r();
  return { g, x, y };
}

scene(L8, 'G_m redone: the amplifier senses the source', 70, (S) => {
  header(S, 'LEC 8 · YOUR PAGE, TOP', 'Why the amplifier cannot raise G_m');
  const c = boostCell(S, { vin: true, x: 620, y: 360 });
  S.draw(c.g, 0.3, 2);
  const io = label(S, 650, 250, 'I_out', 2, { size: 21, color: C.cur, weight: 700 });
  S.say(0.3, 'Lecture 8 starts by redoing the $G_m$ attempt properly. Now the amplifier’s inputs are $V_{in}$ and the <b>source</b> of the transistor.');
  S.say(5, 'Read the two voltages your page labels: the gate gets $(V_{in} - I_{out}R_S)A_1$, and the source sits at $I_{out}R_S$.');
  const ln = [
    ['\\left[(V_{in} - I_{out}R_S)A_1 - I_{out}R_S\\right]g_m = I_o', 9, 'The current source inside the transistor is $g_m$ times $V_{GS}$ = gate minus source.'],
    ['I_{out} = I_o\\,\\frac{r_O}{r_O + R_S}', 15, 'Some current leaks back through $r_O$: the divider leaves $I_o\\,r_O/(r_O+R_S)$.'],
    ['\\frac{I_{out}}{V_{in}} = \\frac{A_1g_mr_O}{R_S + r_O + (1+A_1)R_Sg_mr_O}', 21, 'Collect the $I_{out}$ terms and divide: your page’s result.'],
    ['\\approx \\frac{A_1g_m}{R_S + (1+A_1)g_mr_OR_S} \\approx \\frac{A_1}{(1+A_1)R_S} \\approx \\frac{1}{R_S}', 28, 'For a real device the $(1+A_1)g_mr_OR_S$ term dominates. Look what happens to $A_1$…'],
  ];
  ln.forEach(([tex, t, say], i) => { eqAt(S, tex, 1180, 230 + i * 92, t, { size: i === 3 ? 30 : 32, w: 760, color: i === 3 ? '#ffd38a' : C.text }); S.say(t, say); });
  whyBox(S, 820, 640, 740, 170, '**$A_1$ cancels top and bottom.** With the amplifier sensing the source, the transistor + amplifier is a feedback loop whose $G_m$ is set by the resistor: $\\approx 1/R_S$, whatever $A_1$ is.', 34);
  S.say(34, '<span class="why">$A_1$ cancels.</span> The amplifier and transistor form a feedback loop around $R_S$, and the loop’s transconductance is just $1/R_S$ — set by the resistor, not by $A_1$.');
  eqAt(S, '\\text{plain degenerated device: }\\;\\frac{g_mr_O}{R_S + r_O + g_mR_Sr_O} \\approx \\frac{1}{R_S}', 430, 760, 44, { size: 26, w: 760, color: C.muted });
  S.say(44, 'Your page compares it with a plain degenerated device (right side): also about $1/R_S$. No gain in $G_m$ either way.');
  S.say(53, '<span class="why">Conclusion:</span> the booster amplifier’s real job is the output resistance. From now on, gain boosting means <b>multiplying $R_{out}$</b>.');
});

scene(L8, 'Looking in from the top and from the bottom', 64, (S) => {
  header(S, 'LEC 8 · TWO LOOK-IN RESULTS', 'Boosting multiplies “up” and divides “down” by (1 + A₁)');
  eqAt(S, 'R_{out} = R_S + r_O + (1 + A_1)\\,g_mR_Sr_O', 800, 170, 0.3, { size: 40 });
  S.say(0.3, 'From Lecture 7, looking <b>down</b> into the boosted drain: $R_{out} = R_S + r_O + (1+A_1)g_mR_Sr_O$.');
  // left: plain source look-in; right: boosted
  const a = S.g(); const r1 = S.into(a);
  res(S, 400, 250, 330, { label: 'R_D' }); rail(S, 360, 440, 250, '');
  nmos(S, 400, 380, { name: 'M1', gate: 'V_in' });
  wire(S, [[400, 430], [400, 500]]);
  arrow(S, 440, 520, 440, 450, { color: C.p, w: 2.6 }); txt(S, 452, 500, 'look up into the source', { size: 19, color: C.p });
  r1();
  S.draw(a, 6, 1.4);
  eqAt(S, 'R_{in} = \\frac{R_D + r_O}{1 + g_mr_O} \\approx \\frac{1}{g_m}', 420, 600, 8, { size: 34, w: 600 });
  S.say(6, 'Now look <b>up</b>, into a source (your page, right): a plain device with $R_D$ on its drain shows $(R_D + r_O)/(1 + g_mr_O)$ — about $1/g_m$, small. “Down divides.”');
  const b = S.g(); const r2 = S.into(b);
  res(S, 1150, 250, 330, { label: 'R_D' }); rail(S, 1110, 1190, 250, '');
  amp(S, 900, 380, { label: 'A₁', w: 96, h: 90 });
  wire(S, [[996, 380], [1104, 380]]);
  nmos(S, 1150, 380, { name: 'M1' });
  wire(S, [[1150, 430], [1150, 500]]); dot(S, 1150, 460);
  wire(S, [[1150, 460], [880, 460], [880, 402], [900, 402]]);
  wire(S, [[870, 358], [900, 358]]); txt(S, 862, 364, 'V_in', { size: 19, color: C.muted, anchor: 'end' });
  arrow(S, 1190, 520, 1190, 450, { color: C.p, w: 2.6 }); txt(S, 1202, 500, 'boosted', { size: 19, color: C.p });
  r2();
  S.draw(b, 16, 1.6);
  eqAt(S, 'R_{in} = \\frac{R_D + r_O}{1 + (1 + A_1)g_mr_O}', 1130, 600, 19, { size: 34, w: 640, color: '#ffd38a' });
  S.say(16, 'Boost it: the amplifier again moves the gate against any change of the source, so the device fights $(1+A_1)$ times harder…');
  S.say(22, '…and the source looks $(1+A_1)$ times <b>stiffer</b>: $(R_D + r_O)/(1 + (1+A_1)g_mr_O)$.');
  whyBox(S, 250, 690, 1100, 130, '**One rule, both directions:** boosting multiplies the resistance looking **down into a drain** by $(1+A_1)$, and divides the resistance looking **up into a source** by $(1+A_1)$.', 30);
  S.say(30, 'One rule for both directions: “up multiplies, down divides” — and boosting puts an extra $(1+A_1)$ into both.');
  S.say(42, 'Why we need the second one: in a boosted cascode, the input device’s current has to choose between going up into that stiff source or down into $r_{O1}$. Next scene.');
});

scene(L8, 'Boosted cascode: G_m ≈ g_m1 by current divider', 56, (S) => {
  header(S, 'LEC 8 · WHERE DOES M1’S CURRENT GO?', 'The current divider: G_m stays g_m1');
  const g = S.g(); const r = S.into(g);
  rail(S, 380, 640, 150);
  isrc(S, 520, 210, { label: 'I_1' }); wire(S, [[520, 150], [520, 168]]);
  dot(S, 520, 280); wire(S, [[520, 252], [520, 330]]); wire(S, [[520, 280], [620, 280]]); txt(S, 630, 287, 'V_out', { size: 21, color: C.volt, weight: 700 });
  amp(S, 260, 380, { label: 'A₁', w: 96, h: 90 });
  wire(S, [[356, 380], [474, 380]]);
  nmos(S, 520, 380, { name: 'M2' });
  wire(S, [[520, 430], [520, 490]]); dot(S, 520, 460);
  wire(S, [[520, 460], [240, 460], [240, 402], [260, 402]]); gnd(S, 230, 358); wire(S, [[230, 358], [260, 358]]);
  nmos(S, 520, 540, { name: 'M1', gate: 'V_in' }); gnd(S, 520, 590);
  r();
  S.draw(g, 0.3, 2);
  S.say(0.3, 'Your page’s boosted cascode: input M1 at the bottom, boosted cascode M2 above it, load $I_1$ on top.');
  // divider picture
  const d = S.g(); const r2 = S.into(d);
  wire(S, [[980, 250], [980, 300]]);
  S.el('polygon', { points: '980,310 996,330 980,350 964,330', fill: 'none', stroke: C.cur, 'stroke-width': 2.6 });
  arrow(S, 980, 318, 980, 344, { color: C.cur, w: 2.4, head: 9 }); txt(S, 940, 336, 'g_m1 v_in', { size: 21, color: C.cur, weight: 700, anchor: 'end' });
  wire(S, [[980, 360], [980, 420]]);
  wire(S, [[980, 250], [1180, 250]]); wire(S, [[980, 250], [1380, 250]]);
  res(S, 1180, 250, 400, { label: '1/((1+A₁)g_m2)', lcol: C.p });
  res(S, 1380, 250, 400, { label: 'r_O1', lcol: C.n });
  wire(S, [[980, 420], [1380, 420]]); wire(S, [[1180, 400], [1180, 420]]); wire(S, [[1380, 400], [1380, 420]]); gnd(S, 1180, 420);
  r2();
  S.fade(d, 8, 0.8);
  S.say(8, 'Small-signal picture at X: M1 pushes $g_{m1}v_{in}$ into the node, which has two exits — <b>up</b> into M2’s boosted source, or <b>down</b> through $r_{O1}$.');
  S.flow([[1180, 250], [1180, 420]], 14, null, { speed: 90, w: 6 });
  S.flow([[1380, 250], [1380, 420]], 14, null, { speed: 20, w: 1.4 });
  label(S, 1180, 470, '≈ 20 Ω', 14, { size: 22, color: C.p, weight: 700, anchor: 'middle' });
  label(S, 1380, 470, '≈ 50 kΩ', 14, { size: 22, color: C.n, weight: 700, anchor: 'middle' });
  S.say(14, 'With $1/g_{m2} = 1$ kΩ and $A_1 = 50$ the “up” path is about 20 Ω; $r_{O1}$ is tens of kΩ. Current takes the easy path: almost all of it goes up.');
  eqAt(S, 'I_{R_2} = I\\,\\frac{R_1}{R_1+R_2}', 1180, 560, 21, { size: 30, w: 600, color: C.muted });
  eqAt(S, 'I_{out} = g_{m1}V_{in}\\frac{r_{O1}}{r_{O1} + \\frac{1}{(1+A_1)g_{m2}}} \\approx g_{m1}V_{in}', 1050, 650, 25, { size: 32, w: 900 });
  eqAt(S, 'G_m = \\frac{I_{out}}{V_{in}} \\approx g_{m1}', 1050, 740, 31, { size: 38, color: '#ffd38a' });
  S.say(21, 'The little box on your page is the current divider: the current into $R_2$ is $I\\,R_1/(R_1+R_2)$ — the <b>other</b> resistance on top.');
  S.say(25, 'Here: $I_{out} = g_{m1}V_{in}\\,r_{O1}/(r_{O1} + 1/((1+A_1)g_{m2})) ≈ g_{m1}V_{in}$.');
  S.say(31, 'So <b>$G_m ≈ g_{m1}$</b>: boosting costs nothing at the input side. All the benefit is in $R_{out}$.');
});

scene(L8, 'Putting it together: (g_m r_O)³', 52, (S) => {
  header(S, 'LEC 8 · THE GAIN', 'Cascode (g_m r_O)², boosted cascode (g_m r_O)³');
  const rows = [
    ['R_{out} = r_{O1} + r_{O2} + (1+A_1)g_{m2}r_{O1}r_{O2}', 0.4, C.text, 'Lec 7’s formula with $R_S = r_{O1}$ (the input device sits under the source).'],
    ['\\approx (1+A_1)\\,g_{m2}r_{O1}r_{O2}', 6, C.text, 'The last term is thousands of times bigger than $r_{O1} + r_{O2}$: keep only it.'],
    ['\\text{Gain} = G_mR_{out} \\approx g_{m1}(1+A_1)\\,g_{m2}r_{O1}r_{O2}', 12, C.text, 'Multiply by $G_m ≈ g_{m1}$ from the last scene.'],
    ['A_1 = g_{m3}r_{O3} \\;\\Rightarrow\\; \\text{Gain} \\approx (g_mr_O)^3', 19, '#ffd38a', 'If the booster is one CS transistor M3, $A_1 = g_{m3}r_{O3}$. With all $g_m$ and $r_O$ equal: three factors of $g_mr_O$.'],
  ];
  rows.forEach(([tex, t, col, say], i) => { eqAt(S, tex, 800, 200 + i * 95, t, { size: 38, color: col }); S.say(t, say); });
  const tb = html(S, 220, 590, 1160, 250, `<table class="tbl"><tr><th></th><th>plain cascode</th><th>boosted cascode</th></tr>
    <tr><td>${rt('$G_m$')}</td><td>${rt('$≈ g_{m1}$')}</td><td class="same">${rt('$≈ g_{m1}$ (same)')}</td></tr>
    <tr><td>${rt('$R_{out}$')}</td><td>${rt('$g_{m2}r_{O2}r_{O1}$')}</td><td class="chg">${rt('$(1+A_1)g_{m2}r_{O2}r_{O1}$')}</td></tr>
    <tr><td>gain</td><td>${rt('$(g_mr_O)^2$ ≈ 2500')}</td><td class="chg">${rt('$(g_mr_O)^3$ ≈ 125 000')}</td></tr>
    <tr><td>output column</td><td>M2 on M1</td><td class="same">M2 on M1 — nothing stacked</td></tr></table>`);
  tb.style.opacity = 0; S.slideIn(tb, 27, 0.8);
  S.say(27, 'The comparison to remember: same $G_m$, same two devices in the output column, but $R_{out}$ and the gain grow by a whole factor of $g_mr_O$ — about 2500 → 125 000.');
  S.say(40, 'Now: how do you actually build $A_1$? Your page shows three circuits. Watch what each one costs.');
});

/* implementation 1, labelled as on the Lec 8 page: I1 on the output, I2 for M3 */
scene(L8, 'Implementation 1: a CS booster (the circled M3)', 74, (S) => {
  header(S, 'LEC 8 · IMPLEMENTATION 1', 'The simplest booster: one CS transistor M3');
  const c = regCascode(S, { iout: 'I_1', iaux: 'I_2' });
  c.g.setAttribute('transform', 'translate(40 40)');
  S.draw(c.g, 0.3, 2.2);
  S.halo(270, 280, 200, 380, C.red, 3, null, 'booster (circled on your page)');
  S.say(0.3, 'Implementation 1. The booster is just <b>M3</b>: its gate sits on X (M2’s source), its drain drives M2’s gate, and $I_2$ is its load. A common-source amplifier.');
  // signal intuition
  const up = arrow(S, 640, 560, 640, 500, { color: C.volt }); S.fade(up, 8, 0.4); S.out(up, 22, 0.4);
  label(S, 652, 530, 'X rises', 8, { size: 20, color: C.volt, weight: 700, out: 22 });
  const g3 = arrow(S, 300, 330, 300, 400, { color: C.amb }); S.fade(g3, 11, 0.4); S.out(g3, 22, 0.4);
  label(S, 150, 370, 'M2’s gate falls', 11, { size: 20, color: C.amb, weight: 700, out: 22 });
  S.say(8, 'Check the sign: if X rises, M3 conducts more and pulls its drain — M2’s gate — <b>down</b>. Exactly the “opposite way” the booster must push.');
  eqAt(S, 'A_1 = g_{m3}r_{O3}', 1180, 230, 15, { size: 38 });
  eqAt(S, 'A_v = g_{m1}(1 + g_{m3}r_{O3})\\,g_{m2}r_{O2}r_{O1}', 1180, 310, 18, { size: 32, w: 760 });
  S.say(15, 'Its gain is $g_{m3}r_{O3}$, so the whole gain is $g_{m1}(1 + g_{m3}r_{O3})g_{m2}r_{O2}r_{O1}$ — your page’s line.');
  // the cost: towers
  const sc = 250, yb = 800;
  const t1 = tower(S, 960, yb, [{ v: 0.2, name: 'M1', st: 'min' }, { v: 0.2, name: 'M2', st: 'sq' }], sc, { nodes: ['0', 'X 0.2', '0.4'], w: 88 });
  label(S, 1004, 660, 'plain cascode', 26, { size: 19, color: C.muted, anchor: 'middle' });
  S.fade(t1, 26, 0.6);
  const t2 = tower(S, 1260, yb, [{ v: 0.7, name: 'M1', st: 'ok', note: 'X = V_GS3' }, { v: 0.2, name: 'M2', st: 'sq' }], sc, { nodes: ['0', 'X 0.7', '0.9'], w: 88 });
  label(S, 1304, 540, 'with the CS booster', 31, { size: 19, color: C.muted, anchor: 'middle' });
  S.fade(t2, 31, 0.6);
  S.say(26, '<span class="why">The cost (green note on your page):</span> in a plain cascode, X only needs M1’s check: $V_{ov1}$, 0.2 V.');
  S.say(31, 'But now X is <b>M3’s gate</b>, and M3’s source is ground. That is a link: X must sit a whole $V_{GS3}$ (0.7 V) up — “minimum voltage $= V_{GS3}$ and not $V_{ov1}$”.');
  eqAt(S, 'V_{out,min} = V_{GS3} + V_{ov2}', 1180, 430, 38, { size: 36, color: '#ffb36b' });
  S.say(38, 'M2’s check then puts the output at least $V_{ov2}$ above X: $V_{out,min} = V_{GS3} + V_{ov2}$ = 0.9 V instead of 0.4 V. <b>Disadvantage: one $V_{th}$ of swing lost.</b>');
  S.say(50, 'Also notice (Tutorial 4 Q1(a)): M2’s gate is two links above ground, $V_{G2} = V_{GS3} + V_{GS2}$.');
  S.say(60, 'Can a PMOS booster avoid the $V_{GS3}$ penalty? That is implementation 2.');
});

scene(L8, 'Implementation 2: a PMOS booster (and why it fails)', 66, (S) => {
  header(S, 'LEC 8 · IMPLEMENTATION 2', 'PMOS booster: the fence that kills it');
  const g = S.g(); const r = S.into(g);
  rail(S, 160, 760, 170);
  isrc(S, 560, 230, { label: 'I_1' }); wire(S, [[560, 170], [560, 188]]);
  dot(S, 560, 300); wire(S, [[560, 272], [560, 330]]); wire(S, [[560, 300], [680, 300]]); txt(S, 690, 307, 'V_out', { size: 22, color: C.volt, weight: 700 });
  const m2 = nmos(S, 560, 380, { name: 'M2', gl: 60 });
  dot(S, 560, 460); wire(S, [[560, 430], [560, 490]]); txt(S, 574, 470, 'P', { size: 22, color: C.bad, weight: 750 });
  nmos(S, 560, 540, { name: 'M1', gate: 'V_in' }); gnd(S, 560, 590);
  const m3 = pmos(S, 330, 330, { name: 'M3', right: true, gl: 40, nameSide: 'l' });
  wire(S, [[330, 170], [330, 280]]);
  wire(S, [[m3.gate[0], 330], [470, 330], [470, 460], [560, 460]]);
  wire(S, [[330, 380], [330, 440]]); dot(S, 330, 380); wire(S, [[330, 380], [m2.gate[0], 380]]);
  txt(S, 316, 404, 'G', { size: 22, color: C.amb, weight: 750, anchor: 'end' });
  isrc(S, 330, 480, { label: 'I_2', left: true }); gnd(S, 330, 522);
  r();
  S.draw(g, 0.3, 2);
  S.say(0.3, 'Implementation 2: make the booster a <b>PMOS</b> CS stage. M3’s source is at $V_{DD}$, its gate on P (M2’s source), its drain G drives M2’s gate, $I_2$ below.');
  S.say(7, 'Now check if M3 can stay saturated. Use the PMOS fence: its drain may be at most $|V_{th3}|$ above its gate.');
  const ln = [
    ['V_{D3} \\le V_{G3} + |V_{th3}| \\;\\Rightarrow\\; V_G \\le V_P + |V_{th3}|', 11, 'M3’s drain is G, its gate is P: $V_G \\le V_P + |V_{th3}|$.'],
    ['V_G = V_P + V_{GS2}\\quad(\\text{a link: M2’s gate above its source})', 18, 'But G is M2’s gate and P is M2’s source — a link: $V_G = V_P + V_{GS2}$.'],
    ['V_P + V_{GS2} \\le V_P + |V_{th3}|', 24, 'Substitute.'],
    ['V_{GS2} \\le |V_{th3}|', 28, 'Cancel $V_P$: M2’s $V_{GS}$ must stay below one threshold.'],
  ];
  ln.forEach(([tex, t, say], i) => { eqAt(S, tex, 1180, 230 + i * 86, t, { size: i === 3 ? 42 : 28, w: 780, color: i === 3 ? '#ff8f86' : C.text }); S.say(t, say); });
  // cross-section sketch
  const cs = S.g(); const r2 = S.into(cs);
  S.el('rect', { x: 860, y: 640, width: 520, height: 170, rx: 8, fill: '#151c28', stroke: '#2f3b4f', 'stroke-width': 2 });
  S.el('path', { d: 'M930 640 v40 a30 30 0 0 0 60 0 v-40', fill: '#1f2a3a', stroke: C.n, 'stroke-width': 2 });
  S.el('path', { d: 'M1250 640 v40 a30 30 0 0 0 60 0 v-40', fill: '#1f2a3a', stroke: C.n, 'stroke-width': 2 });
  S.el('rect', { x: 990, y: 600, width: 260, height: 20, rx: 4, fill: '#333f52', stroke: C.amb, 'stroke-width': 2 });
  wire(S, [[1120, 560], [1120, 600]]); txt(S, 1132, 576, 'G', { size: 20, color: C.amb, weight: 700 });
  S.el('line', { x1: 990, y1: 646, x2: 1250, y2: 646, stroke: C.cur, 'stroke-width': 2, 'stroke-dasharray': '4 8' });
  txt(S, 1120, 700, 'M2: channel barely formed', { size: 20, color: C.cur, anchor: 'middle', weight: 700 });
  r2();
  S.fade(cs, 34, 0.8);
  S.say(34, 'Your page’s little cross-section shows what that means: with $V_{GS2}$ near threshold, M2’s channel is <b>barely formed</b>. M2 would need a huge width to carry its current.');
  S.say(44, '<span class="why">So implementation 2 fails</span> — not because of the gain, but because of a fence. Implementation 3 keeps the PMOS input and fixes the level problem by folding.');
});

scene(L8, 'Implementation 3: the folded booster', 60, (S) => {
  header(S, 'LEC 8 · IMPLEMENTATION 3', 'Fold the PMOS booster into an NMOS cascode');
  const g = foldedBoost(S);
  S.draw(g, 0.3, 2.4);
  S.say(0.3, 'Implementation 3 (bottom of your page): the PMOS booster M3 is <b>folded</b> into an NMOS cascode M4, with current sources $I_3$ (top) and $I_2$ (bottom).');
  S.halo(170, 210, 410, 400, C.amb, 5, null, 'booster = a small folded cascode');
  S.say(5, 'M3 senses M2’s source with its gate. Its drain current is folded into M4’s source; M4 carries the signal up to its drain, which drives M2’s gate.');
  eqAt(S, 'A_1 = G_{m,aux}R_{out,aux} = g_{m3}\\,g_{m4}r_{O4}r_{O3}', 1180, 250, 12, { size: 32, w: 760 });
  S.say(12, 'The booster is itself a cascode amplifier: $G_m = g_{m3}$, and looking into M4’s drain you see a cascode, $g_{m4}r_{O4}r_{O3}$. So $A_1 = g_{m3}g_{m4}r_{O4}r_{O3}$ — about 2500 instead of 50.');
  eqAt(S, 'A_v = g_{m1}(1 + A_1)\\,g_{m2}r_{O1}r_{O2}', 1180, 340, 18, { size: 32, w: 760 });
  whyBox(S, 830, 420, 720, 200, '**Why the level problem is gone:** M3 is a PMOS whose gate sits on X. A PMOS gate can sit **low** — even near ground (Lec 6: a folded PMOS input reaches below ground). So X can stay at $V_{ov1}$: **no $V_{GS}$ lost**.', 24);
  S.say(24, '<span class="why">Why it fixes implementation 1:</span> a PMOS input is happy with its gate near ground (Lec 6), so X can stay just $V_{ov1}$ up. No $V_{GS3}$ penalty.');
  whyBox(S, 830, 650, 720, 150, '**Implementation 3 = best of both:** no swing lost, and a bigger boost ($(g_mr_O)^2$-sized $A_1$).', 36);
  S.say(36, 'Best of both: no swing lost, and a booster gain of $(g_mr_O)^2$ instead of $g_mr_O$. This is the version Tutorial 4 Q3 and the 2024 mid-sem Q4 use.');
});

scene(L8, 'Lecture 8 in one card', 30, (S) => {
  header(S, 'LEC 8 · REMEMBER', 'Everything from Lecture 8');
  remember(S, [
    'Amp sensing the source: $G_m ≈ A_1g_m/(R_S + (1+A_1)g_mr_OR_S) ≈ 1/R_S$: **$A_1$ cancels**, so boost $R_{out}$, not $G_m$.',
    'Down into a boosted drain: $R_S + r_O + (1+A_1)g_mR_Sr_O$. Up into a boosted source: $(R_D + r_O)/(1 + (1+A_1)g_mr_O)$.',
    'Boosted cascode: $G_m ≈ g_{m1}$ (current divider), $R_{out} ≈ (1+A_1)g_{m2}r_{O2}r_{O1}$, gain $≈ (g_mr_O)^3$.',
    '**Impl 1 (CS M3):** $A_1 = g_{m3}r_{O3}$, but X = $V_{GS3}$ (a link): $V_{out,min} = V_{GS3} + V_{ov2}$. $V_{G2} = V_{GS3} + V_{GS2}$.',
    '**Impl 2 (PMOS):** fence + link give $V_{GS2} \\le |V_{th3}|$: M2 barely on. Fails.',
    '**Impl 3 (folded):** $A_1 = g_{m3}g_{m4}r_{O4}r_{O3}$, no swing lost.',
  ], 0.4, 'Lecture 8 · remember');
  S.say(0.4, 'Read it once. Then: the 2025 mid-sem question on this exact circuit, and Tutorial 4.');
});

/* implementation 3 (folded booster), as drawn at the bottom of the Lec 8 page */
function foldedBoost(S) {
  const g = S.g(); const r = S.into(g);
  rail(S, 140, 760, 170);
  isrc(S, 600, 230, { label: 'I_1' }); wire(S, [[600, 170], [600, 188]]);
  dot(S, 600, 300); wire(S, [[600, 272], [600, 330]]); wire(S, [[600, 300], [700, 300]]); txt(S, 708, 307, 'V_out', { size: 22, color: C.volt, weight: 700 });
  const m2 = nmos(S, 600, 380, { name: 'M2', gl: 110 });
  dot(S, 600, 460); wire(S, [[600, 430], [600, 490]]); txt(S, 614, 474, 'X', { size: 22, color: C.bad, weight: 750 });
  nmos(S, 600, 540, { name: 'M1', gate: 'V_in' }); gnd(S, 600, 590);
  isrc(S, 300, 230, { label: 'I_3', left: true }); wire(S, [[300, 170], [300, 188]]);
  wire(S, [[300, 272], [300, 330]]); dot(S, 300, 300); wire(S, [[300, 300], [500, 300], [500, 380], [m2.gate[0], 380]]);
  nmos(S, 300, 380, { name: 'M4', gate: 'V_b' });
  dot(S, 300, 460); wire(S, [[300, 430], [300, 490]]);
  isrc(S, 300, 540, { label: 'I_2', left: true }); gnd(S, 300, 582);
  const m3 = pmos(S, 420, 520, { name: 'M3', right: true, gl: 30, nameSide: 'l' });
  wire(S, [[420, 470], [420, 446]]); wire(S, [[400, 446], [440, 446]], { w: 3 }); txt(S, 420, 436, 'V_DD', { size: 16, color: C.muted, anchor: 'middle' });
  wire(S, [[420, 570], [420, 600], [360, 600], [360, 460], [300, 460]]);
  wire(S, [[m3.gate[0], 520], [540, 520], [540, 460], [600, 460]]);
  r();
  return g;
}

/* ── Lecture 8 past papers ── */
scene(L8, '2025 mid-sem Q1: CS-boosted cascode, full solve', 92, (S) => {
  const T = tfm(1, 0, 90);
  pyqFrame(S, {
    paper: 'm25q1', tag: 'LEC 8 · PAST PAPER 1 OF 3', title: 'The regulated cascode, as asked in the 2025 mid-sem', src: 'Mid-sem 2025-26 Q1 · 13 marks',
    q: '$I_1 = 100\\,\\mu$A (M3’s load, feeds P), $I_2 = 0.5$ mA (output), $(W/L)_{1,2,3} = 200$; $I_1, I_2$ are PMOS with $W/L = 100$. (a) DC voltages at X and P. (b) Maximum swing. (c) Gain.',
    giv: '$V_{DD} = 3$ V, $\\mu_nC_{ox} = 135\\,\\mu$, $\\mu_pC_{ox} = 40\\,\\mu$A/V², $V_{thn} = 0.7$, $|V_{thp}| = 0.8$ V, $\\lambda_n = 0.1$, $\\lambda_p = 0.2$ V⁻¹',
    qh: 290, tests: 'implementation 1 of Lec 8: **links up from ground** for the biases, the **booster’s swing penalty**, and the **load trap** in the gain.',
    fig: (S2) => { const c = regCascode(S2, { iout: 'I_2 (PMOS)', iaux: 'I_1 (PMOS)' }); c.g.setAttribute('transform', 'translate(0 90)'); },
    steps: [
      { t: 7, title: '**(a) Walk up from ground.** M3’s source is ground and it carries $I_1$: X sits one $V_{GS3}$ up (a link)', tex: stepTex('pyq-m25-q1', 0), hl: [T([250, 470, 170, 140, C.volt])],
        try: { q: 'M3: W/L = 200, µnCox = 135 µA/V², V<sub>thn</sub> = 0.7 V, 100 µA, source on ground. What is V<sub>X</sub>?', answer: ans('pyq-m25-q1', 'vx'), unit: 'V', tol: 0.01, hint: 'VX = Vth + √(2·I1/(µnCox·W/L)).', why: 'X is M3’s gate and M3’s source is ground: a link.' },
        say: 'M3 carries 100 µA with its source on ground, so its gate X sits one $V_{GS3}$ up: 0.786 V.' },
      { t: 16, title: 'P is M2’s gate: one $V_{GS2}$ above X (M2 carries 0.5 mA)', tex: stepTex('pyq-m25-q1', 1), hl: [T([470, 330, 190, 100, C.volt])],
        try: { q: 'M2 carries 0.5 mA (W/L = 200, µnCox = 135 µA/V², Vth = 0.7 V) with its source at X = 0.786 V. What is V<sub>P</sub>?', answer: ans('pyq-m25-q1', 'vp'), unit: 'V', tol: 0.01, hint: 'VP = VX + Vth + √(2·0.5m/(135µ·200)).' },
        say: 'P sits one more link up: $V_P = V_X + V_{GS2} = 1.679$ V. Two links stacked.' },
      { t: 25, title: '**(b)** Ceiling: the PMOS source $I_2$ needs its $|V_{ov}|$ below $V_{DD}$', tex: stepTex('pyq-m25-q1', 2), hl: [T([470, 170, 190, 110, C.p])],
        try: { q: 'The PMOS source for I<sub>2</sub>: 0.5 mA, W/L = 100, µpCox = 40 µA/V², V<sub>DD</sub> = 3 V. What is V<sub>out,max</sub>?', answer: 2.5, unit: 'V', tol: 0.01, hint: '|Vov| = √(2·0.5m/(40µ·100)).' },
        say: 'Ceiling: the PMOS current source on top needs its overdrive, 0.5 V: $V_{out,max} = 2.5$ V.' },
      { t: 33, title: 'Floor: X sits at $V_{GS3}$ (the Lec 8 penalty), and M2 needs its own $V_{ov}$ above it', tex: stepTex('pyq-m25-q1', 3), hl: [T([470, 330, 190, 160, C.bad])],
        try: { q: 'X = 0.786 V and V<sub>ov2</sub> = 0.192 V. What is the swing V<sub>out,max</sub> − V<sub>out,min</sub>?', answer: ans('pyq-m25-q1', 'swing'), unit: 'V', tol: 0.01, hint: 'Vout,min = X + Vov2; ceiling 2.5 V.' },
        say: 'Floor: X is at $V_{GS3}$ (the implementation-1 penalty) plus $V_{ov2}$: 0.979 V. Swing = 2.5 − 0.979 = 1.52 V.' },
      { t: 42, title: '**(c)** Booster gain: M3’s load is a real PMOS source, so $A_1 = g_{m3}(r_{O3}\\parallel r_{O,I1})$', tex: stepTex('pyq-m25-q1', 4), hl: [T([250, 170, 170, 450, C.amb])],
        try: { q: 'g<sub>m3</sub> = 2.32 mS, r<sub>O3</sub> = 100 kΩ, r<sub>O</sub> of the PMOS load I<sub>1</sub> = 50 kΩ. What is A<sub>1</sub>?', answer: 77.5, unit: 'V/V', tol: 0.02, hint: 'A1 = gm3 · (rO3 ∥ rO,I1).' },
        say: 'Careful: M3’s load $I_1$ is a real PMOS, so $A_1 = g_{m3}(r_{O3}\\parallel r_{O,I1}) = 77.5$, and $R_{down} = A_1g_{m2}r_{O2}r_{O1} ≈ 161$ MΩ.' },
      { t: 51, title: '**The load trap:** looking up you see only the PMOS $r_O$ = 10 kΩ', tex: stepTex('pyq-m25-q1', 5), hl: [T([470, 170, 190, 110, C.bad])],
        try: { q: 'g<sub>m1</sub> = 5.2 mS. The output sees 10 kΩ (PMOS) ∥ 161 MΩ. What is |A<sub>v</sub>|?', answer: 51.96, unit: 'V/V', tol: 0.03, hint: '10 k ∥ 161 M ≈ 10 kΩ.' },
        say: 'Looking up, the PMOS source shows 10 kΩ. In parallel with 161 MΩ the 10 kΩ wins: $A_v ≈ -52$. The boost is wasted by the load.' },
      { t: 60, ans: true, title: `**Answers:** $V_X = ${fx(ans('pyq-m25-q1', 'vx'), 3)}$ V, $V_P = ${fx(ans('pyq-m25-q1', 'vp'), 4)}$ V, swing $${fx(ans('pyq-m25-q1', 'swing'), 3)}$ V, $A_v = ${fx(ans('pyq-m25-q1', 'av'), 4)}$`, say: 'Write-up order for 13 marks: biases by links from ground, ceiling from the PMOS overdrive, floor = X + $V_{ov2}$, then $A_1$, $R_{down}$, and the gain with the load in parallel.' },
    ],
  });
}, { q: 'Mid-sem 2025 Q1' });

/* Tutorial 4 Q2's circuit (as in the app): M5 PMOS load, M2, M1; booster PMOS M3 (source VS, gate P) loaded by M4 */
function pmosBoostFig(S) {
  const g = S.g(); const r = S.into(g);
  rail(S, 440, 760, 170);
  const xo = 620;
  pmos(S, xo, 230, { name: 'M5', gate: 'V_bp', right: true, nameSide: 'l' }); wire(S, [[xo, 170], [xo, 180]]);
  dot(S, xo, 310); wire(S, [[xo, 280], [xo, 330]]); wire(S, [[xo, 310], [720, 310]]); txt(S, 728, 317, 'V_out', { size: 22, color: C.volt, weight: 700 });
  const m2 = nmos(S, xo, 380, { name: 'M2', gl: 120 });
  dot(S, xo, 460); wire(S, [[xo, 430], [xo, 490]]); txt(S, xo + 14, 474, 'P', { size: 22, color: C.bad, weight: 750 });
  nmos(S, xo, 540, { name: 'M1', gate: 'V_in' }); gnd(S, xo, 590);
  const xa = 330;
  txt(S, xa, 200, 'V_S', { size: 21, color: C.amb, weight: 700, anchor: 'middle' }); dot(S, xa, 214); wire(S, [[xa, 214], [xa, 250]]);
  const m3 = pmos(S, xa, 300, { name: 'M3', right: true, gl: 40, nameSide: 'l' });
  wire(S, [[m3.gate[0], 300], [520, 300], [520, 460], [xo, 460]]);
  wire(S, [[xa, 350], [xa, 440]]); dot(S, xa, 380); wire(S, [[xa, 380], [m2.gate[0], 380]]);
  nmos(S, xa, 490, { name: 'M4', gate: 'V_bn' }); gnd(S, xa, 540);
  r();
  return g;
}

scene(L8, 'Tutorial 4 Q2: the PMOS booster with numbers', 80, (S) => {
  const T = tfm(1, 0, 110);
  pyqFrame(S, {
    paper: 't4q2', tag: 'LEC 8 · PAST PAPER 2 OF 3', title: 'Is the PMOS booster’s M3 saturated?', src: 'Tutorial 4 Q2',
    q: 'M5 (PMOS load, gate $V_{bp}$) carries 0.1 mA. (a) $V_{bp}$. (b) With $V_P = V_{ov1}$, is M3 saturated? (c) With $V_{ov4} = 0.1$ V, the required $V_S$. (d) λ for a plain-cascode gain ≈ 2550. (e) Gain with $\\lambda_p = 1.3\\lambda_n$.',
    giv: '$V_{DD} = 1.8$ V, $\\mu_nC_{ox} = 150\\,\\mu$, $\\mu_pC_{ox} = 100\\,\\mu$A/V², $(W/L)_n = 150$, $(W/L)_p = 100$, $V_{thn} = 0.7$, $|V_{thp}| = 0.85$ V',
    qh: 290, tests: 'implementation 2 of Lec 8: the **PMOS fence on M3** that forces $V_{GS2} \\le |V_{th3}|$, plus links for the biases and the load trap.',
    fig: (S2) => { const g = pmosBoostFig(S2); g.setAttribute('transform', 'translate(0 110)'); },
    steps: [
      { t: 7, title: '**(a)** M5’s source is $V_{DD}$; its gate sits one $|V_{GS5}|$ below (a link)', tex: stepTex('bank-t4q2', 0), hl: [T([540, 170, 220, 120, C.p])],
        try: { q: 'M5: PMOS, W/L = 100, µpCox = 100 µA/V², |Vthp| = 0.85 V, 0.1 mA, V<sub>DD</sub> = 1.8 V. What is V<sub>bp</sub>?', answer: ans('bank-t4q2', 'vbp'), unit: 'V', tol: 0.01, hint: 'Vbp = VDD − (0.85 + √(2·0.1m/(100µ·100))).' },
        say: '(a) A link from the top: $V_{bp} = V_{DD} - |V_{GS5}| = 0.809$ V.' },
      { t: 16, title: '**(b)** The Lec 8 fence: M3’s drain is M2’s gate, $V_P + V_{GS2}$; it must stay below $V_P + |V_{thp}|$', tex: stepTex('bank-t4q2', 1), hl: [T([250, 240, 170, 170, C.amb])],
        try: { q: 'V<sub>D3</sub> = V<sub>P</sub> + V<sub>GS2</sub> = 0.889 V and V<sub>G3</sub> + |V<sub>thp</sub>| = 0.944 V. Is M3 saturated?', choices: ['Yes — 0.889 ≤ 0.944, so the PMOS fence holds (just)', 'No — it is in triode'], answer: 0, hint: 'PMOS saturated while drain ≤ gate + |Vth|.', why: 'Only because VGS2 is barely above threshold.' },
        say: '(b) The implementation-2 fence: 0.889 ≤ 0.944, so M3 is just saturated — only because $V_{GS2}$ is barely above threshold.' },
      { t: 25, title: '**(c)** M4 at $V_{ov4} = 0.1$ V sets the current; $V_S$ is one $|V_{GS3}|$ above P', tex: stepTex('bank-t4q2', 2), hl: [T([250, 180, 170, 360, C.volt])],
        try: { q: 'M4 (NMOS, W/L = 150, µnCox = 150 µA/V²) at V<sub>ov</sub> = 0.1 V. What current does it set (µA)?', answer: 112.5e-6, unit: 'A (type 112.5u)', tol: 0.02, hint: 'I = ½·150µ·150·0.1².' },
        say: '(c) M4 at 0.1 V sets 113 µA; M3’s source $V_S$ sits one $|V_{GS3}|$ above its gate P: 1.094 V.' },
      { t: 34, title: '**(d)** Plain cascode, ideal load: gain ≈ $(g_mr_O)^2$', tex: stepTex('bank-t4q2', 3),
        try: { q: 'Gain ≈ (g<sub>m</sub>r<sub>O</sub>)² = 2550, g<sub>m</sub> = √(2·150µ·150·0.1m), I<sub>D</sub> = 0.1 mA. What λ<sub>n</sub> gives that?', answer: ans('bank-t4q2', 'lam'), unit: 'V⁻¹', tol: 0.025, hint: 'gm·rO = √2550 = 50.5 and rO = 1/(λ·ID).' },
        say: '(d) Without the booster the gain is about $(g_mr_O)^2 = 2550$, so $g_mr_O = 50.5$ and $\\lambda_n = 0.42$ V⁻¹.' },
      { t: 42, title: '**(e)** Boosted $R_{out}$ is huge, but M5’s $r_O$ loads the output', tex: stepTex('bank-t4q2', 4), hl: [T([540, 170, 220, 120, C.bad])],
        say: '(e) The load trap again: M5 is a plain PMOS source, so the gain is about 39, although the boosted cascode alone would give 37 841.' },
      { t: 50, ans: true, title: `**Answers:** $V_{bp} = ${fx(ans('bank-t4q2', 'vbp'), 3)}$ V · M3 saturated (just) · $V_S = ${fx(ans('bank-t4q2', 'vs'), 4)}$ V · $\\lambda_n ≈ 0.42$ V⁻¹ · gain ≈ 39`, say: 'Lesson of (b): a PMOS booster only works if $V_{GS2}$ is squeezed below $|V_{th3}|$ — exactly why your page calls it a bad idea.' },
    ],
  });
}, { q: 'Tutorial 4 Q2' });

scene(L8, 'Tutorial 4 Q1 (a), (c): biases and swing', 70, (S) => {
  const T = tfm(1, 0, 90);
  pyqFrame(S, {
    paper: 't4q1', tag: 'LEC 8 · PAST PAPER 3 OF 3', title: 'Biases and swing of implementation 1', src: 'Tutorial 4 Q1 (a), (c)',
    q: 'Same circuit, $\\mu_nC_{ox} = 172.35\\,\\mu$A/V², $I_1 = 100\\,\\mu$A (M3), $I_2 = 0.5$ mA (output), $(W/L)_{1-3} = 200$, $V_{thn} = 0.7$ V. (a) Gates of M3 and M2. (c) Output swing with a PMOS source ($W/L = 100$, $\\mu_pC_{ox} = 51.7\\,\\mu$).',
    qh: 250, tests: 'the same **two stacked links** (X, then M2’s gate) and the **floor/ceiling** of implementation 1 — part (b) was solved in Lec 7.',
    fig: (S2) => { const c = regCascode(S2, { iout: 'I_2', iaux: 'I_1' }); c.g.setAttribute('transform', 'translate(0 90)'); },
    steps: [
      { t: 7, title: 'Gate of M3 = X = one $V_{GS3}$ above ground', tex: stepTex('bank-t4q1', 0), hl: [T([250, 470, 170, 140, C.volt])],
        try: { q: 'M3: 100 µA, W/L = 200, µnCox = 172.35 µA/V², V<sub>thn</sub> = 0.7 V. What is V<sub>X</sub>?', answer: ans('bank-t4q1', 'vx'), unit: 'V', tol: 0.01, hint: 'Vth + √(2·100µ/(172.35µ·200)).' },
        say: 'Gate of M3 = X = $V_{GS3}$ = 0.776 V.' },
      { t: 15, title: 'Gate of M2 = X + $V_{GS2}$ (M2 at 0.5 mA)', tex: stepTex('bank-t4q1', 1), hl: [T([470, 330, 190, 100, C.volt])],
        try: { q: 'M2 at 0.5 mA, same process, source at X = 0.776 V. What is V<sub>G2</sub>?', answer: ans('bank-t4q1', 'vg2'), unit: 'V', tol: 0.01, hint: 'VX + 0.7 + √(2·0.5m/(172.35µ·200)).' },
        say: 'Gate of M2 = X + $V_{GS2}$ = 1.646 V.' },
      { t: 23, title: '**(c)** Floor: M2’s fence, $V_{out} \\ge V_{G2} - V_{th}$', tex: stepTex('bank-t4q1', 4), hl: [T([470, 330, 190, 160, C.bad])],
        try: { q: 'V<sub>G2</sub> = 1.646 V and V<sub>thn</sub> = 0.7 V. What is the lowest V<sub>out</sub>?', answer: ans('bank-t4q1', 'vmin'), unit: 'V', tol: 0.01, hint: 'NMOS fence: drain ≥ gate − Vth.' },
        say: 'Floor from M2’s fence: $V_{out} \\ge V_{G2} - V_{th} = 0.946$ V — the same as $V_{GS3} + V_{ov2}$.' },
      { t: 31, title: 'Ceiling: the PMOS source keeps its $|V_{ov}|$', tex: stepTex('bank-t4q1', 5), hl: [T([470, 170, 190, 110, C.p])],
        try: { q: 'PMOS source: 0.5 mA, W/L = 100, µpCox = 51.7 µA/V², V<sub>DD</sub> = 3 V. What is V<sub>out,max</sub>?', answer: ans('bank-t4q1', 'vmax'), unit: 'V', tol: 0.01, hint: '3 − √(2·0.5m/(51.7µ·100)).' },
        say: 'Ceiling: $3 - |V_{ov}| = 2.56$ V. Swing ≈ 1.61 V.' },
      { t: 39, ans: true, title: `**Answers:** $V_{G3} = ${fx(ans('bank-t4q1', 'vx'), 4)}$ V · $V_{G2} = ${fx(ans('bank-t4q1', 'vg2'), 4)}$ V · $V_{out} \\in [${fx(ans('bank-t4q1', 'vmin'), 3)},\\,${fx(ans('bank-t4q1', 'vmax'), 3)}]$ V`, say: 'Two equivalent ways to write the floor: X + $V_{ov2}$, or M2’s gate minus $V_{th}$. Use whichever is quicker with the given numbers.' },
    ],
  });
}, { q: 'Tutorial 4 Q1' });
