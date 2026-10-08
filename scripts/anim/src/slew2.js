/* Slew rate, part 2 (after the Lec 14 slewing scenes): which current fills which capacitor, for every op amp, then a harder ladder. */
'use strict';

scene(L14, 'Slew rate for every op amp: which current, which capacitor', 66, (S) => {
  header(S, 'SLEW RATE · THE WHOLE PICTURE', 'Always: the most current available ÷ the capacitor it has to fill');
  const cards = [
    ['5-T OTA', 'I_{SS}\\;\\to\\;C_L', 'SR = \\frac{I_{SS}}{C_L}', 'one side off: the tail empties into C_L', C.n, 6],
    ['Telescopic (fully diff.)', '\\tfrac{I_{SS}}{2}\\;\\to\\;\\text{each } C_L', '\\text{each } \\frac{I_{SS}}{2C_L},\\;\\text{diff. } \\frac{I_{SS}}{C_L}', 'top sources keep pushing I_SS/2', C.p, 16],
    ['Folded cascode', '\\min(I_P, I_{SS})', 'SR = \\frac{\\min(I_P,\\,I_{SS})}{C_L}', 'need I_P ≥ I_SS or I_P limits', C.amb, 28],
    ['Two-stage (Miller)', 'I_5\\to C_c,\\;\\; I_7 - I_5\\to C_L', 'SR = \\min\\left(\\frac{I_5}{C_c},\\frac{I_7 - I_5}{C_L}\\right)', 'Lec 17: the tail fills C_c', C.ok, 40],
  ];
  cards.forEach(([name, flow, f, note, col, t0], i) => {
    const x = 70 + (i % 2) * 740, y = 140 + Math.floor(i / 2) * 330;
    const g = S.g();
    S.el('rect', { x, y, width: 700, height: 300, rx: 18, fill: 'rgba(255,255,255,0.025)', stroke: col, 'stroke-width': 2.4 }, g);
    txt(S, x + 24, y + 44, name, { size: 26, color: col, weight: 800 }, g);
    eq(S, flow, x + 350, y + 105, { size: 26, w: 660, color: '#cbd5e1' }, g);
    eq(S, f, x + 350, y + 185, { size: 32, w: 660, color: '#ffd38a' }, g);
    txt(S, x + 350, y + 262, note, { size: 19, color: C.muted, anchor: 'middle' }, g);
    g.style.opacity = 0; S.pop(g, t0, 0.7);
  });
  S.say(0.3, 'You have now seen slewing in four op amps. They all follow one sentence: the slew rate is the most current the circuit can deliver, divided by the capacitor that current has to fill.');
  S.say(6, 'Five-transistor OTA: one side of the pair turns off and the whole tail current goes into $C_L$.');
  S.say(16, 'Fully differential telescopic: each output gets $I_{SS}/2$, because the top current sources keep pushing their half. The two outputs move in opposite directions, so the difference moves at $I_{SS}/C_L$.');
  S.say(28, 'Folded cascode: the folding current $I_P$ must be at least $I_{SS}$, otherwise a branch runs dry and $I_P$ becomes the limit.');
  S.say(40, 'Two-stage Miller op amp, from Lecture 17: the tail current fills the compensation capacitor $C_c$, unless the output stage, $I_7 - I_5$, runs out filling $C_L$ first. The smaller one wins.');
  S.say(54, 'Questions only change which current and which capacitor. Find those two and you are done.');
});

scene(L14, 'Slew-rate ladder 2: telescopic, folded, two-stage', 70, (S) => {
  pyqFrame(S, {
    tag: 'SLEW RATE · PRACTICE LADDER 2 (HARDER)', title: 'Same idea, different circuits', src: 'Slew-rate ladder (Lec 14, 17)',
    q: '(a) Fully differential telescopic, $I_{SS}$ = 400 µA, $C_L$ = 1 pF on each output. (b) Folded cascode, $I_{SS}$ = 200 µA, $I_P$ = 150 µA, $C_L$ = 2 pF. (c) Two-stage: $I_5$ = 20 µA, $C_c$ = 1 pF, $I_7$ = 100 µA, $C_L$ = 5 pF.', qh: 220,
    fig: eqFig([['\\text{telescopic: each } \\frac{I_{SS}}{2C_L},\\;\\text{diff. } \\frac{I_{SS}}{C_L}', 270, 26], ['\\text{folded: } \\frac{\\min(I_P, I_{SS})}{C_L}', 380, 28], ['\\text{two-stage: } \\min\\left(\\frac{I_5}{C_c}, \\frac{I_7 - I_5}{C_L}\\right)', 490, 26, '#ffd38a']]),
    per: 3,
    steps: [
      { t: 4, title: '(a) Each output', tex: '\\frac{200\\,\\mu\\mathrm{A}}{1\\,\\mathrm{pF}} = 200\\,\\mathrm{V/\\mu s}', try: { q: '(a) Slew rate of EACH output (V/µs)?', answer: 200, unit: 'V/µs', tol: 0.01, hint: 'Each side gets I_SS/2.', secs: 45 }, say: 'Each output gets half the tail: 200 over 1, 200 volts per microsecond.' },
      { t: 11, title: '(a) The differential output', tex: '\\frac{I_{SS}}{C_L} = 400\\,\\mathrm{V/\\mu s}', try: { q: '(a) Differential output (V/µs)?', answer: 400, unit: 'V/µs', tol: 0.01, hint: 'They move in opposite directions.', secs: 30 }, say: 'Opposite slopes add: 400.' },
      { t: 17, title: '(b) Folded with I_P < I_SS', tex: '\\frac{\\min(150, 200)\\,\\mu\\mathrm{A}}{2\\,\\mathrm{pF}} = 75\\,\\mathrm{V/\\mu s}', try: { q: '(b) I_P = 150 µA < I_SS. SR (V/µs)?', answer: 75, unit: 'V/µs', tol: 0.01, hint: 'The branch can only give I_P.', secs: 60 }, say: 'The folding current is the limit: 150 over 2, 75.' },
      { t: 24, title: '(b) What I_P fixes it, and the new SR?', tex: 'I_P \\ge I_{SS} = 200\\,\\mu\\mathrm{A}\\;\\Rightarrow\\; SR = 100\\,\\mathrm{V/\\mu s}', try: { q: '(b) With I_P raised to I_SS, SR (V/µs)?', answer: 100, unit: 'V/µs', tol: 0.01, hint: '200 µA / 2 pF.', secs: 45 }, say: 'Raise $I_P$ to 200 microamps and it is 100.' },
      { t: 31, title: '(c) Two-stage: the C_c limit', tex: '\\frac{I_5}{C_c} = \\frac{20}{1} = 20\\,\\mathrm{V/\\mu s}', try: { q: '(c) I₅/C_c (V/µs)?', answer: 20, unit: 'V/µs', tol: 0.01, hint: '20 µA into 1 pF.', secs: 30 }, say: 'The tail into $C_c$: 20.' },
      { t: 37, title: '(c) The C_L limit, and which one wins', tex: '\\frac{I_7 - I_5}{C_L} = \\frac{80}{5} = 16\\,\\mathrm{V/\\mu s}\\;\\Rightarrow\\; SR = 16\\,\\mathrm{V/\\mu s}', try: { q: '(c) The slew rate of the op amp (V/µs)?', answer: 16, unit: 'V/µs', tol: 0.01, hint: 'Work out (I₇ − I₅)/C_L, then take the smaller.', secs: 75 }, say: 'The output stage has only 80 microamps left for 5 picofarads: 16. The smaller wins, so the op amp slews at 16, set by the output stage this time.' },
      { t: 45, ans: true, title: '**Ladder 2:** 200 and 400 V/µs · 75 → 100 V/µs · 16 V/µs (output stage limits)', say: 'Now the real questions: Problem Set 2 P1 and Tutorial 6 Q3 next, and the two-stage mid-sem questions in the Lecture 15 to 17 lesson.' },
    ],
  });
}, { q: 'Slew-rate ladder 2' });

moveScenesBefore(['Slew rate for every op amp: which current, which capacitor', 'Slew-rate ladder 2: telescopic, folded, two-stage'], 'Problem Set 2 P1: telescopic slew rate');
