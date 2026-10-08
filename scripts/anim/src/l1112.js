/* Foundations for Lectures 11–12: triode sensing, the CMFB loop as feedback, the pinned-CM equation, replica CMFB. */
'use strict';
const L11 = 'Lec 11–12 · Foundations';

/* telescopic with a triode-sensing tail; names per page/question */
function triodeTele(S, n) {
  const g = S.g(); const r = S.into(g);
  rail(S, 380, 1000, 150);
  const L = 560, R = 840;
  const row = (y, a, b, p, gate) => {
    const A = fet(S, L, y, { p, name: a, right: true, gl: 26, nameSide: 'l' });
    const B = fet(S, R, y, { p, name: b, gl: 26, nameSide: 'r' });
    wire(S, [[A.gate[0], y], [B.gate[0], y]]); txt(S, 700, y - 9, gate, { size: 18, color: C.muted, anchor: 'middle' });
  };
  row(205, n.top[0], n.top[1], true, 'V_b4'); wire(S, [[L, 150], [L, 155]]); wire(S, [[R, 150], [R, 155]]);
  wire(S, [[L, 255], [L, 265]]); wire(S, [[R, 255], [R, 265]]);
  row(315, n.pc[0], n.pc[1], true, 'V_b3');
  wire(S, [[L, 365], [L, 400]]); wire(S, [[R, 365], [R, 400]]); dot(S, L, 382); dot(S, R, 382);
  txt(S, L - 14, 376, 'V_out1', { size: 19, color: C.volt, weight: 700, anchor: 'end' }); txt(S, R + 14, 376, 'V_out2', { size: 19, color: C.volt, weight: 700 });
  row(450, n.nc[0], n.nc[1], false, 'V_b2');
  wire(S, [[L, 500], [L, 510]]); wire(S, [[R, 500], [R, 510]]);
  row(560, n.inp[0], n.inp[1], false, 'V_b1');
  wire(S, [[L, 610], [L, 650], [R, 650], [R, 610]]); dot(S, 700, 650); txt(S, 700, 640, 'P', { size: 20, color: C.bad, weight: 750, anchor: 'middle' });
  const ta = nmos(S, 620, 720, { name: n.tri[0], gl: 30, nameSide: 'r' }); const tb = nmos(S, 780, 720, { name: n.tri[1], right: true, gl: 30, nameSide: 'l' });
  wire(S, [[620, 670], [620, 650]]); wire(S, [[780, 670], [780, 650]]); gnd(S, 620, 770); gnd(S, 780, 770);
  wire(S, [[ta.gate[0], 720], [470, 720], [470, 382], [L, 382]], { color: C.volt });
  wire(S, [[tb.gate[0], 720], [930, 720], [930, 382], [R, 382]], { color: C.volt });
  r();
  return g;
}

scene(L11, 'A transistor in deep triode is a resistor', 60, (S) => {
  header(S, 'LEC 11 · YOUR PAGE, RIGHT', 'Small V_DS: the triode equation becomes Ohm’s law');
  const ln = [
    ['I_D = \\tfrac12\\mu_nC_{ox}\\tfrac{W}{L}\\left[2(V_{GS}-V_{th})V_{DS} - V_{DS}^2\\right]', 0.4, 'The triode equation (your page). Now make $V_{DS}$ tiny — tens of millivolts.'],
    ['I_D \\approx \\mu_nC_{ox}\\tfrac{W}{L}(V_{GS}-V_{th})\\,V_{DS}', 7, 'Then $V_{DS}^2$ is negligible next to $2(V_{GS}-V_{th})V_{DS}$: drop it. The current is <b>proportional to $V_{DS}$</b>.'],
    ['R_{on} = \\frac{V_{DS}}{I_D} = \\frac{1}{\\mu_nC_{ox}\\tfrac{W}{L}(V_{GS}-V_{th})}', 13, 'A current proportional to the voltage is a <b>resistor</b>: $R_{on} = 1/(\\mu_nC_{ox}\\tfrac WL(V_{GS}-V_{th}))$.'],
  ];
  ln.forEach(([tex, t, say], i) => { eqAt(S, tex, 450, 220 + i * 110, t, { size: 30, w: 820, color: i === 2 ? '#ffd38a' : C.text }); S.say(t, say); });
  // ID-VDS curves
  const x0 = 960, y0 = 620;
  const ax = axes(S, x0, y0, 560, 440, { x: 'V_DS', y: 'I_D' }); S.fade(ax, 2, 0.6);
  const mk = (k, col, t) => { const vs = 120 * k; const c = curve(S, (x) => { const v = x - x0; return y0 - (v < vs ? (2 * vs * v - v * v) / vs * 0.9 * k / 2 * 1.6 : vs * 0.9 * k / 2 * 1.6 + (v - vs) * 0.03); }, x0, x0 + 540, { color: col }); S.draw(c, t, 1.4); return c; };
  mk(1, C.n, 3); mk(1.4, C.p, 3.6); mk(1.8, C.amb, 4.2);
  [[1, C.n], [1.4, C.p], [1.8, C.amb]].forEach(([k, col]) => { const ln = S.el('line', { x1: x0, y1: y0, x2: x0 + 70, y2: y0 - 1.44 * k * 70, stroke: col, 'stroke-width': 2, 'stroke-dasharray': '5 4' }); S.fade(ln, 23, 0.6); });
  label(S, x0 + 470, 360, 'bigger V_GS', 4.2, { size: 18, color: C.amb });
  S.say(19, 'On the $I_D$–$V_{DS}$ curves (your sketch): near the origin each curve is a <b>straight line</b> through zero. Its slope is $1/R_{on}$.');
  S.cam(22, 3, x0 + 90, y0 - 90, 2.6);
  S.cam(32, 2.5, 800, 450, 1);
  S.say(22, 'Zoom in: every curve is a line. A bigger $V_{GS}$ gives a steeper line — a smaller resistance. <b>The gate controls the resistance.</b>');
  whyBox(S, 120, 610, 760, 200, '**Saturation:** a voltage-controlled **current source** (VCCS), $I_D = \\tfrac12\\mu_nC_{ox}\\tfrac WL(V_{GS}-V_{th})^2$. **Deep triode:** a voltage-controlled **resistor**. CMFB uses the second one to sense the output CM.', 35);
  S.say(35, 'Your page’s one-liner: in saturation a MOSFET is a voltage-controlled <b>current source</b>; in deep triode it is a voltage-controlled <b>resistor</b>. Lectures 11–12 use the resistor.');
});

scene(L11, 'Triode sensing: the outputs drive the tail resistors', 72, (S) => {
  header(S, 'LEC 11 · YOUR PAGE, TOP', 'M10, M11 in deep triode: only V_out1 + V_out2 matters');
  const g = triodeTele(S, { top: ['M8', 'M9'], pc: ['M6', 'M7'], nc: ['M4', 'M5'], inp: ['M2', 'M3'], tri: ['M10', 'M11'] });
  g.setAttribute('transform', 'translate(-300 30)');
  S.draw(g, 0.3, 2.6);
  S.say(0.3, 'Your page’s circuit: a telescopic op amp whose tail is two transistors M10, M11 in <b>deep triode</b>, with their gates driven by the two <b>outputs</b>.');
  S.say(7, 'They sit between node P and ground with only a tiny $V_{DS}$ (= $V_P$), so each is a resistor set by its gate — that is, by an output voltage.');
  const ln = [
    ['R_{tot,P} = R_{on10}\\parallel R_{on11}', 12],
    ['\\frac{1}{R_{tot,P}} = \\mu_nC_{ox}\\tfrac WL\\left[(V_{out1}-V_{th}) + (V_{out2}-V_{th})\\right]', 16],
    ['R_{tot,P} = \\frac{1}{\\mu_nC_{ox}(W/L)(V_{out1}+V_{out2}-2V_{th})}', 21],
  ];
  ln.forEach(([tex, t], i) => eqAt(S, tex, 1160, 220 + i * 100, t, { size: 28, w: 800, color: i === 2 ? '#ffd38a' : C.text }));
  S.say(12, 'In parallel, conductances add: $1/R_{tot} = 1/R_{on10} + 1/R_{on11}$…');
  S.say(16, '…each conductance is $\\mu_nC_{ox}\\tfrac WL(V_{GS}-V_{th})$ with $V_{GS}$ = an output…');
  S.say(21, '…so only the <b>sum</b> $V_{out1}+V_{out2}$ appears — twice the output CM.');
  // DM vs CM bars
  const bx = 1060, by = 840;
  const bar = (x, col) => S.el('rect', { x, y: by, width: 50, height: 0, rx: 6, fill: col });
  const b1 = bar(bx, C.n), b2 = bar(bx + 70, C.p), bt = bar(bx + 180, C.amb);
  txt(S, bx + 25, by + 26, 'G10', { size: 18, color: C.n, anchor: 'middle' }); txt(S, bx + 95, by + 26, 'G11', { size: 18, color: C.p, anchor: 'middle' }); txt(S, bx + 205, by + 26, 'total', { size: 18, color: C.amb, anchor: 'middle' });
  const set = (b, h) => { b.setAttribute('y', by - h); b.setAttribute('height', h); };
  S.anim(26, 1e4, 'bars', (_p, t) => {
    let d = 0, c = 0;
    if (t > 28 && t < 38) d = 40 * Math.sin((t - 28) * 1.6);
    if (t > 40) c = 50 * Math.sin(Math.min(1, (t - 40) / 3) * Math.PI / 2);
    set(b1, 60 + 0.6 * d + 0.6 * c); set(b2, 60 - 0.6 * d + 0.6 * c); set(bt, 120 + 1.2 * c);
  }, E.lin);
  S.say(28, 'Watch the conductances. A <b>differential</b> signal raises one output and lowers the other: G10 grows, G11 shrinks by the same amount — the total does not move. The sensor ignores the signal.');
  S.say(40, 'A <b>common-mode</b> rise raises both: the total conductance grows, $R_{tot}$ falls, the tail pulls harder, and the outputs are pulled back down. Feedback, built right into the tail.');
  whyBox(S, 980, 490, 580, 100, '**Triode sensor:** sees the CM, blind to the DM — exactly what a CM sensor must do.', 50);
});

scene(L11, 'Sensing with differential pairs (and why it is nonlinear)', 52, (S) => {
  header(S, 'LEC 11 · YOUR PAGE, BOTTOM', 'Pairs compare each output with V_REF: works only for small swings');
  const g = S.g(); const r = S.into(g);
  rail(S, 300, 1160, 160);
  pmos(S, 730, 215, { name: 'M5', gate: 'V_b', gl: 26 }); wire(S, [[730, 160], [730, 165]]);
  wire(S, [[730, 265], [730, 290], [620, 290], [620, 310]]); wire(S, [[730, 290], [840, 290], [840, 310]]);
  txt(S, 860, 214, 'current source of the amplifier', { size: 17, color: C.muted });
  const m3 = pmos(S, 620, 360, { name: 'M3', right: true, gl: 26, nameSide: 'l' }); const m4 = pmos(S, 840, 360, { name: 'M4', gl: 26 });
  wire(S, [[m3.gate[0], 360], [m4.gate[0], 360]]); txt(S, 730, 351, 'V_REF', { size: 18, color: C.amb, anchor: 'middle', weight: 700 });
  const m1 = nmos(S, 440, 330, { name: 'M1', gate: 'V_out1' }); wire(S, [[440, 160], [440, 280]]);
  wire(S, [[440, 380], [440, 440], [620, 440], [620, 410]]); isrc(S, 440, 490, { label: 'I_1', left: true }); gnd(S, 440, 532);
  const m2 = nmos(S, 1020, 330, { name: 'M2', gate: 'V_out2', right: true }); wire(S, [[1020, 160], [1020, 280]]);
  wire(S, [[1020, 380], [1020, 440], [840, 440], [840, 410]]); isrc(S, 1020, 490, { label: 'I_1' }); gnd(S, 1020, 532);
  r();
  S.draw(g, 0.3, 2.2);
  S.say(0.3, 'Another sensor on your page: followers M1, M2 copy the outputs, and PMOS devices M3, M4 (gates at $V_{REF}$) compare them, sharing the current source M5.');
  eqAt(S, 'I_D \\propto (V_{REF}-V_{out1})^2 + (V_{REF}-V_{out2})^2', 800, 620, 8, { size: 32, w: 900 });
  S.say(8, 'Each device’s current follows the <b>square law</b> of its own difference from $V_{REF}$ — so the sensed current is a sum of <b>squares</b> (your page’s last line).');
  whyBox(S, 360, 700, 880, 140, '**The flaw:** $(a)^2 + (b)^2$ is not a function of $a + b$ alone. For large swings the differential signal leaks into the “CM” reading. **Use it only for small output swings.**', 15);
  S.say(15, 'And a sum of squares does not depend only on the sum of the outputs: for big swings the differential signal leaks into the reading. Good for small swings only.');
  S.say(26, 'Compare the triode sensor, whose reading depends exactly on $V_{out1}+V_{out2}$ (as long as the devices stay in deep triode).');
});

scene(L11, 'CMFB is just a feedback loop (and where it acts)', 58, (S) => {
  header(S, 'LEC 11–12 · FEEDBACK VIEW', 'Same rules as Lec 1: error ≈ 1/(βA)');
  eqAt(S, '\\frac{A}{1+\\beta A}, \\qquad \\varepsilon \\approx \\frac{1}{\\beta A}', 800, 200, 0.4, { size: 46 });
  S.say(0.4, 'Your page writes Lecture 1’s two lines again: the closed-loop result $A/(1+\\beta A)$ and the error $\\approx 1/(\\beta A)$ (circled).');
  S.say(6, 'The CMFB loop is an ordinary negative-feedback loop. How close the output CM gets to $V_{REF}$ depends on its <b>loop gain</b>, just like the gain error of Lecture 1.');
  const tb = html(S, 160, 300, 1280, 330, `<table class="tbl"><tr><th>your circuit</th><th>sensing</th><th>where the correction acts</th></tr>
    <tr><td>folded cascode + error amp</td><td>R₁, R₂ at the outputs</td><td>the input pair’s tail M11 (Lec 11) — or the bottom sources M3, M4 (Lec 12)</td></tr>
    <tr><td>telescopic</td><td>triode M11, M12 at the bottom</td><td>built in: the sensing devices <b>are</b> the tail</td></tr></table>`);
  tb.style.opacity = 0; S.slideIn(tb, 12, 0.8);
  S.say(12, 'Your two circuits: an error amplifier comparing the resistor-sensed CM with $V_{REF}$ and driving a current source; or triode devices that sense and correct in one go.');
  S.say(22, 'Lecture 12 adds that the error amplifier can drive <b>any</b> current source in the output path — the input tail, or the bottom sources. Wherever it acts, it moves a current until $V_{out,CM} = V_{REF}$.');
  whyBox(S, 300, 680, 1000, 130, 'Tutorial 5 Q2 and the 2024 mid-sem Q1 ask for this **loop gain**: break the loop, push a CM change round it, multiply every gain on the way.', 32);
  S.say(32, 'Exam link: the loop gain you computed in Lecture 10’s past papers is exactly this $\\beta A$ of the CM loop.');
});

scene(L11, 'The triode equation pins the output CM', 60, (S) => {
  header(S, 'LEC 12 · YOUR PAGE, TOP', 'V_b1 − V_GS3 = 2I_D R_tot,P  →  solve for V_out1 + V_out2');
  const g = triodeTele(S, { top: ['M9', 'M10'], pc: ['M7', 'M8'], nc: ['M5', 'M6'], inp: ['M3', 'M4'], tri: ['M11', 'M12'] });
  g.setAttribute('transform', 'translate(-300 30)');
  S.fade(g, 0.2, 0.8);
  S.say(0.2, 'Lecture 12’s version (devices renamed: input pair M3, M4 with gates at $V_{b1}$, triode pair M11, M12).');
  S.ring(400, 680, 18, C.bad, 5, 16);
  S.say(5, '<b>Link:</b> node P is M3’s source, one $V_{GS3}$ below its gate: $V_P = V_{b1} - V_{GS3}$. The bias fixes P.');
  S.say(10, '<b>Ohm’s law:</b> the whole tail current $2I_D$ flows through $R_{tot,P}$, so $V_P = 2I_DR_{tot,P}$.');
  const ln = [
    ['V_{b1} - V_{GS3} = 2I_D\\,R_{tot,P}', 5],
    ['= \\frac{2I_D}{\\mu_nC_{ox}(W/L)_{11,12}(V_{out1}+V_{out2}-2V_{th})}', 14],
    ['V_{out1}+V_{out2} = \\frac{2I_D}{\\mu_nC_{ox}(W/L)_{11,12}}\\cdot\\frac{1}{V_{b1}-V_{GS3}} + 2V_{th}', 20],
  ];
  ln.forEach(([tex, t], i) => eqAt(S, tex, 1170, 230 + i * 110, t, { size: i === 2 ? 25 : 28, w: 820, color: i === 2 ? '#ffd38a' : C.text }));
  S.say(14, 'Put in the triode $R_{tot,P}$ from Lecture 11…');
  S.say(20, '…and solve for $V_{out1}+V_{out2}$: the output CM is now <b>fixed by sizes and biases</b>. Questions use it both ways: size W/L for a wanted CM, or find the CM from the sizes.');
  whyBox(S, 860, 600, 700, 200, '**Exam use (Tutorial 5 Q1 = 2025 mid-sem Q4, Quiz 2):** given $V_P$, $I_D$ and the wanted $V_{out,CM}$, find $(W/L)$ of the triode pair; then walk links for the biases.', 30);
  S.say(30, 'This is exactly Tutorial 5 Q1 — asked again as the 2025 mid-sem Q4 — and Quiz 2. Solved below.');
});

/* replica CMFB, simplified from the page */
function replicaFig(S) {
  const g = S.g(); const r = S.into(g);
  rail(S, 160, 1040, 150);
  // replica branch
  isrc(S, 260, 230, { label: 'I_1', left: true }); wire(S, [[260, 150], [260, 188]]);
  const m14 = nmos(S, 260, 340, { name: 'M14', right: true, gl: 40, nameSide: 'l' });
  wire(S, [[260, 272], [260, 290]]); dot(S, 260, 280); wire(S, [[260, 280], [330, 280], [330, 340]]); dot(S, 330, 340);
  nmos(S, 260, 480, { name: 'M15', gate: 'V_REF', gcol: C.amb }); wire(S, [[260, 390], [260, 430]]); gnd(S, 260, 530);
  // main: pair + tail M11 + triode M12 ∥ M13
  nmos(S, 640, 260, { name: 'M1', gate: 'V_in1' }); nmos(S, 900, 260, { name: 'M2', gate: 'V_in2', right: true });
  wire(S, [[640, 210], [640, 180]]); wire(S, [[900, 210], [900, 180]]); txt(S, 770, 186, 'to the folded cascode', { size: 17, color: C.muted, anchor: 'middle' });
  wire(S, [[640, 310], [640, 330], [900, 330], [900, 310]]); dot(S, 770, 330);
  const m11 = nmos(S, 770, 380, { name: 'M11', gl: 60 }); wire(S, [[770, 330], [770, 330]]);
  wire(S, [[330, 340], [330, 380], [m11.gate[0], 380]]);
  wire(S, [[770, 430], [770, 450], [700, 450], [700, 470]]); wire(S, [[770, 450], [840, 450], [840, 470]]); dot(S, 770, 450);
  nmos(S, 700, 520, { name: 'M12', gate: 'V_out1', gl: 26, gcol: C.volt }); nmos(S, 840, 520, { name: 'M13', gate: 'V_out2', gl: 26, right: true, gcol: C.volt, nameSide: 'l' });
  gnd(S, 700, 570); gnd(S, 840, 570);
  r();
  return g;
}

scene(L11, 'Replica CMFB: a twin that sets the CM to V_REF', 66, (S) => {
  header(S, 'LEC 12 · REPLICA', 'M14 copies M11, M15 copies M12 + M13: balanced only at V_out,CM = V_REF');
  const g = replicaFig(S); g.setAttribute('transform', 'translate(0 60)');
  S.draw(g, 0.3, 2.4);
  S.say(0.3, 'Instead of solving the square law, build a <b>twin</b>. On the right, the real tail: M11 above the triode sensors M12, M13 (gates on the outputs). On the left, a replica branch fed by $I_1$.');
  S.say(8, 'M14 is M11’s twin (same size, same gate, same current $I_1$). M15 is the twin of M12 and M13 <b>together</b>, but its gate sits at $V_{REF}$ instead of the outputs.');
  const ln = [
    ['I_{D11} = I_{D14} = I_1', 14],
    ['(W/L)_{14} = (W/L)_{11}', 18],
    ['(W/L)_{15} = (W/L)_{12} + (W/L)_{13}', 22],
  ];
  ln.forEach(([tex, t], i) => eqAt(S, tex, 1270, 250 + i * 80, t, { size: 30, w: 560 }));
  S.say(14, 'Your page’s three lines. Same gate voltage and same current only if the two bottom “resistors” match: M15’s conductance must equal M12’s + M13’s.');
  S.say(22, 'With $(W/L)_{15} = (W/L)_{12}+(W/L)_{13}$ that happens exactly when the outputs average to $V_{REF}$. The CM is set by $V_{REF}$ directly — no square-law algebra.');
  whyBox(S, 1000, 520, 560, 150, '**Copy error:** $V_{DS11} \\ne V_{DS14}$, so the currents differ a little ($r_O$). Fix: add M17, M18 — copies of M1, M2 — above M14.', 32);
  eqAt(S, '(W/L)_{17} = (W/L)_1,\\quad (W/L)_{18} = (W/L)_2', 1180, 730, 36, { size: 26, w: 760, color: '#ffd38a' });
  S.say(32, 'Last refinement on your page: M14’s drain does not sit where M11’s does, so $V_{DS}$ differs and the copy is slightly off. Put copies of M1, M2 (M17, M18) on top of M14 — now the replica matches exactly.');
});

scene(L11, 'Lectures 11–12 in one card', 26, (S) => {
  header(S, 'LEC 11–12 · REMEMBER', 'The foundations');
  remember(S, [
    'Deep triode = resistor: $R_{on} = 1/(\\mu_nC_{ox}\\tfrac WL(V_{GS}-V_{th}))$. Saturation = current source.',
    'Triode pair at the tail: $R_{tot} = 1/(\\mu_nC_{ox}\\tfrac WL(V_{out1}+V_{out2}-2V_{th}))$ — sees CM, blind to DM.',
    'Pair sensing: $I \\propto (V_{REF}-V_{out1})^2 + (V_{REF}-V_{out2})^2$ — nonlinear, small swings only.',
    'CMFB is a feedback loop: error $\\approx 1/(\\beta A)$; it can act on the tail or the bottom sources.',
    'Pinned CM: $V_{b1} - V_{GS3} = 2I_DR_{tot,P}$ ⇒ $V_{out1}+V_{out2} = \\frac{2I_D}{\\mu_nC_{ox}(W/L)}\\frac{1}{V_{b1}-V_{GS3}} + 2V_{th}$.',
    'Replica: $(W/L)_{14} = (W/L)_{11}$, $(W/L)_{15} = (W/L)_{12}+(W/L)_{13}$; copy fix $(W/L)_{17,18} = (W/L)_{1,2}$.',
  ], 0.4, 'Lectures 11–12 · remember');
  S.say(0.4, 'And the questions: Tutorial 5 Q1 (the 2025 mid-sem Q4), Quiz 2, and Problem Set 2 P5.');
});

/* ── Lectures 11–12 past papers ── */
scene(L11, 'Tutorial 5 Q1 = 2025 mid-sem Q4: size the triode CMFB', 80, (S) => {
  const T = tfm(1, -300, 30);
  pyqFrame(S, {
    paper: 't5q1', tag: 'LEC 11–12 · PAST PAPER 1 OF 3', title: 'Triode sensing with numbers', src: 'Tutorial 5 Q1 = Mid-sem 2025-26 Q4',
    q: 'Each branch carries 0.5 mA. (a) W/L of M7, M8 for an output CM of 1.5 V with $V_P$ = 100 mV. (b) All devices that size: $V_{b1}$? (c) Maximum differential swing.',
    giv: '$V_{DD} = 3$ V, $\\mu_nC_{ox} = 135\\,\\mu$, $\\mu_pC_{ox} = 40\\,\\mu$A/V², $V_{thn} = 0.7$, $|V_{thp}| = 0.8$ V', qh: 240,
    tests: 'the **triode equation** with $V_{GS}$ = the output CM and $V_{DS}$ = $V_P$, a **link** for $V_{b1}$, and the **output range by checks**.',
    fig: (S2) => { const g = triodeTele(S2, { top: ['M11', 'M12'], pc: ['M9', 'M10'], nc: ['M3', 'M4'], inp: ['M5', 'M6'], tri: ['M7', 'M8'] }); g.setAttribute('transform', 'translate(-300 30)'); },
    steps: [
      { t: 8, title: '**(a)** M7, M8: tiny $V_{DS} = V_P = 0.1$ V (triode), $V_{GS}$ = the output CM = 1.5 V, 0.5 mA each. Use the full triode equation (as the key does)', tex: stepTex('bank-t5q1', 0), hl: [T([600, 660, 200, 120, C.amb])],
        try: { q: '0.5 mA = ½·135µ·(W/L)·[2(1.5 − 0.7)(0.1) − 0.1²]. (W/L)<sub>7,8</sub> = ?', answer: ans('bank-t5q1', 'wl'), unit: '', tol: 0.07, hint: 'The bracket is 0.16 − 0.01 = 0.15.', why: 'The deep-triode shortcut (drop V_DS²) gives 46.3 — also accepted.' },
        say: 'Triode equation with $V_{GS} = 1.5$ V and $V_{DS} = 0.1$ V: $(W/L)_{7,8} = 49.4$. (Dropping $V_{DS}^2$ gives 46.3 — both marked right.)' },
      { t: 17, title: '**(b)** All devices this size: M5 (0.5 mA) needs $V_{ov5}$; $V_{b1}$ is one $V_{GS5}$ above P (a link)', tex: stepTex('bank-t5q1', 1), hl: [T([480, 520, 440, 80, C.volt])],
        try: { q: 'V<sub>ov5</sub> = √(2·0.5m/(135µ·49.38)) = 0.387 V. V<sub>b1</sub> = V<sub>P</sub> + V<sub>th</sub> + V<sub>ov5</sub> = ?', answer: ans('bank-t5q1', 'vb1'), unit: 'V', tol: 0.01, hint: '0.1 + 0.7 + 0.387.' },
        say: 'M5’s source is P, so its gate sits one $V_{GS5}$ above: $V_{b1} = 0.1 + 0.7 + 0.387 = 1.187$ V.' },
      { t: 26, title: '**(c)** Lowest output: P + two NMOS overdrives; highest: $V_{DD}$ − two PMOS overdrives; ×2 for differential', tex: stepTex('bank-t5q1', 2), hl: [T([480, 150, 440, 470, C.volt])],
        try: { q: 'Each output runs from 0.875 V to 1.58 V. Maximum differential swing (p-p)?', answer: ans('bank-t5q1', 'swing'), unit: 'V', tol: 0.01, hint: '2 × (1.58 − 0.875).' },
        say: 'Output range by checks: [0.875, 1.58] V per side; doubled for the differential output, 1.40 V.' },
      { t: 35, ans: true, title: `**Answers:** $(W/L)_{7,8} = ${fx(ans('bank-t5q1', 'wl'), 4)}$ (46.3 with the shortcut) · $V_{b1} = ${fx(ans('bank-t5q1', 'vb1'), 4)}$ V · swing $${fx(ans('bank-t5q1', 'swing'), 3)}$ V`, say: 'Key values: 49.38, 1.187 V, 1.412 V. The method: triode equation for the sensors, a link for the bias, checks for the swing.' },
    ],
  });
}, { q: 'Tutorial 5 Q1 / Mid-sem 2025 Q4' });

scene(L11, 'Quiz 2 Parts A, B, C: triode sensing on a telescopic', 72, (S) => {
  const T = tfm(1, -300, 30);
  pyqFrame(S, {
    tag: 'LEC 11–12 · PAST PAPER 2 OF 3', title: 'Quiz 2: V_P and the size of the triode pair', src: 'Quiz 2 2024-25 · Part A (reconstructed from your key)',
    q: '$V_{DD} = 1.8$ V. PMOS $M_{3,4}$: W/L = 50 at 50 µA ($\\mu_pC_{ox} = 100\\,\\mu$, $|V_{thp}| = 0.5$ V). NMOS: W/L = 50 at 40 µA ($\\mu_nC_{ox} = 200\\,\\mu$, $V_{thn} = 0.4$ V), $V_{b1} = 0.6$ V, output CM = 0.5·$V_{DD}$. Find $V_P$, $(W/L)_{11,12}$, $V_{out,min}$.',
    qh: 250, tests: 'a **link** down from $V_{b1}$ to P, then the **triode-pair equation** solved for W/L, then **checks** for the lowest output.',
    fig: (S2) => { const g = triodeTele(S2, { top: ['M3', 'M4'], pc: ['M7', 'M8'], nc: ['M5', 'M6'], inp: ['M9', 'M10'], tri: ['M11', 'M12'] }); g.setAttribute('transform', 'translate(-300 30)'); },
    steps: [
      { t: 6, title: 'P sits one $V_{GS10}$ below $V_{b1}$ (a link; 40 µA, W/L = 50)', tex: stepTex('bank-quiz2a', 1), hl: [T([480, 520, 440, 150, C.volt])],
        try: { q: 'V<sub>ov</sub> = √(2·40µ/(200µ·50)) = 0.0894 V, V<sub>thn</sub> = 0.4 V, V<sub>b1</sub> = 0.6 V. V<sub>P</sub> = ?', answer: ans('bank-quiz2a', 'vp'), unit: 'V', tol: 0.02, hint: 'VP = Vb1 − (Vth + Vov).' },
        say: 'Link down from the gate bias: $V_P = 0.6 - (0.4 + 0.089) = 0.111$ V.' },
      { t: 15, title: 'Triode pair: $V_P = 2I_D/(\\mu_nC_{ox}(W/L)(V_{out1}+V_{out2}-2V_{th}))$; solve for W/L', tex: stepTex('bank-quiz2a', 2), hl: [T([600, 660, 200, 120, C.amb])],
        try: { q: 'V<sub>P</sub> = 0.1106 V, 2I<sub>D</sub> = 80 µA, µnCox = 200µ, V<sub>out1</sub>+V<sub>out2</sub> = 1.8 V, V<sub>th</sub> = 0.4 V. (W/L)<sub>11,12</sub> = ?', answer: ans('bank-quiz2a', 'wl'), unit: '', tol: 0.03, hint: 'W/L = 2ID / (µnCox · VP · (1.8 − 0.8)).' },
        say: 'Rearrange the Lecture 12 equation: $(W/L)_{11,12} = 2I_D/(\\mu_nC_{ox}V_P(1.8 - 0.8)) ≈ 3.62$.' },
      { t: 24, title: 'Lowest output: P + two NMOS overdrives (checks)', tex: stepTex('bank-quiz2a', 3), hl: [T([480, 380, 440, 260, C.volt])],
        try: { q: 'V<sub>P</sub> = 0.1106 V and each NMOS overdrive is 0.0894 V. V<sub>out,min</sub> = ?', answer: ans('bank-quiz2a', 'vmin'), unit: 'V', tol: 0.02, hint: 'VP + 2·Vov.' },
        say: 'Two checks above P: $0.111 + 2(0.089) = 0.289$ V.' },
      { t: 32, title: '**Part B:** $\\mu_nC_{ox} = 150\\,\\mu$, W/L = 40 at 50 µA, $V_{b1} = 0.6$ V, output CM = 0.6·$V_{DD}$ = 1.08 V. Same three moves', tex: stepTex('bank-quiz2b', 1) + ',\\quad ' + stepTex('bank-quiz2b', 2).split('=').slice(-1)[0].trim().replace(/^/, '(W/L)_{11,12} = '),
        try: { q: 'Part B: V<sub>P</sub> = 0.0709 V, 2I<sub>D</sub> = 100 µA, µnCox = 150µ, V<sub>out1</sub>+V<sub>out2</sub> = 2.16 V, V<sub>th</sub> = 0.4 V. (W/L)<sub>11,12</sub> = ?', answer: ans('bank-quiz2b', 'wl'), unit: '', tol: 0.03, hint: '2ID / (µnCox · VP · (2.16 − 0.8)).' },
        say: 'Part B, new numbers: link down from $V_{b1}$ gives $V_P = 0.071$ V; the triode equation gives $(W/L)_{11,12} = 6.91$.' },
      { t: 41, title: '**Part C:** $\\mu_nC_{ox} = 120\\,\\mu$, $V_{thn} = 0.3$ V, W/L = 60 at 60 µA, $V_{b1} = 0.55$ V, output CM = 0.4·$V_{DD}$ = 0.72 V', tex: stepTex('bank-quiz2c', 1),
        try: { q: 'Part C: V<sub>P</sub> = 0.1209 V, 2I<sub>D</sub> = 120 µA, µnCox = 120µ, V<sub>out1</sub>+V<sub>out2</sub> = 1.44 V, V<sub>th</sub> = 0.3 V. (W/L)<sub>11,12</sub> = ?', answer: ans('bank-quiz2c', 'wl'), unit: '', tol: 0.03, hint: '2ID / (µnCox · VP · (1.44 − 0.6)).' },
        say: 'Part C: $V_P = 0.121$ V and $(W/L)_{11,12} = 9.85$.' },
      { t: 50, ans: true, title: `**Answers:** A: $V_P = ${fx(ans('bank-quiz2a', 'vp'), 3)}$ V, W/L = ${fx(ans('bank-quiz2a', 'wl'), 4)}, $V_{out,min} = ${fx(ans('bank-quiz2a', 'vmin'), 3)}$ V · B: ${fx(ans('bank-quiz2b', 'vp'), 3)} V, ${fx(ans('bank-quiz2b', 'wl'), 4)} · C: ${fx(ans('bank-quiz2c', 'vp'), 3)} V, ${fx(ans('bank-quiz2c', 'wl'), 4)}`, say: 'Three versions, one method: link to P, triode equation for W/L, checks for the swing.' },
    ],
  });
}, { q: 'Quiz 2 (A, B, C)' });

scene(L11, 'Problem Set 2 P5: sizing the replica', 58, (S) => {
  const T = tfm(1, 0, 60);
  pyqFrame(S, {
    tag: 'LEC 11–12 · PAST PAPER 3 OF 3', title: 'Replica sizes, and what a wrong size does', src: 'Problem Set 2 P5 (Lec 12)',
    q: '$(W/L)_{11} = 40$, sensing devices $(W/L)_{12} = (W/L)_{13} = 12$, $V_{REF} = 1.5$ V, $V_{th} = 0.7$ V. (a) $(W/L)_{14}$, $(W/L)_{15}$ so that $V_{out,CM} = V_{REF}$. (b) With $(W/L)_{15} = 30$, where does the CM settle?',
    qh: 230, tests: 'the **replica rules**, and the balance condition as **matched conductances** — $\\tfrac WL(V_{GS}-V_{th})$ on both sides.',
    fig: (S2) => { const g = replicaFig(S2); g.setAttribute('transform', 'translate(40 120) scale(0.82)'); },
    steps: [
      { t: 6, title: '**(a)** M14 is M11’s twin', tex: stepTex('bank-ps2-p5', 0), hl: [T([190, 290, 160, 100, C.n]), T([700, 330, 160, 100, C.n])],
        try: { q: '(W/L)<sub>11</sub> = 40. (W/L)<sub>14</sub> = ?', answer: 40, unit: '', tol: 0.01, hint: 'Twin = same size.' },
        say: 'Same current, same gate: $(W/L)_{14} = (W/L)_{11} = 40$.' },
      { t: 13, title: 'M15 replaces M12 ∥ M13: widths add', tex: stepTex('bank-ps2-p5', 1), hl: [T([190, 430, 160, 120, C.amb])],
        try: { q: '(W/L)<sub>12</sub> = (W/L)<sub>13</sub> = 12. (W/L)<sub>15</sub> = ?', answer: 24, unit: '', tol: 0.01, hint: 'Parallel devices with the same V_GS add their W/L.' },
        say: 'Two parallel devices act like one with the summed width: $(W/L)_{15} = 24$.' },
      { t: 21, title: '**(b)** Balance = equal conductance: $30(V_{REF} - V_{th}) = 24(V_{out,CM} - V_{th})$', tex: stepTex('bank-ps2-p5', 2),
        try: { q: '30 × (1.5 − 0.7) = 24 × (V<sub>out,CM</sub> − 0.7). V<sub>out,CM</sub> = ?', answer: ans('bank-ps2-p5', 'v'), unit: 'V', tol: 0.01, hint: '0.7 + (30/24)·0.8.' },
        say: 'An oversized M15 conducts more at $V_{REF}$, so the loop pushes the outputs up until M12 + M13 match it: 1.7 V instead of 1.5 V.' },
      { t: 29, ans: true, title: '**Answers:** $(W/L)_{14} = 40$ · $(W/L)_{15} = 24$ · with 30: $V_{out,CM} = 1.7$ V', say: 'Replica questions are always “match the twin”: copy the device above, sum the devices below, and balance the conductances.' },
    ],
  });
}, { q: 'Problem Set 2 P5' });
