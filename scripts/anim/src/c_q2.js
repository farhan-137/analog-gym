/* Lesson C: two more questions from the guide’s bank (Tutorial 2 Q2, 2023 mid-sem Q3), placed before the playbook. */
'use strict';
scene(CQ, 'Tutorial 2 Q2: the diode-stack telescopic, every part', 70, (S) => {
  pyqFrame(S, {
    tag: 'LEC 6 · BACKGROUND QUESTION', title: 'Minimum width, swing and gain', src: 'Tutorial 2 Q2 · Razavi 9.2', paper: 't2q2',
    q: 'Set A: $\\mu_pC_{ox}$ = 38.36 µA/V², $V_{thn}$ = 0.7 V, $|V_{thp}|$ = 0.8 V, $V_{DD}$ = 3 V. Single-ended telescopic with a diode-stack mirror: $(W/L)_{1-4}$ = 100/0.5, $I_{SS}$ = 1 mA, $V_b$ = 1.4 V, M5–M8 identical (L = 0.5 µm). (a) Minimum PMOS width for M3 to stay saturated. (b) Output swing. (c) Gain.', qh: 260,
    tests: 'the diode tax: two PMOS diodes take two whole $|V_{GS}|$, then the NMOS fence on M3; the buffer fence on M2 for the ceiling.',
    fig: (S2) => { const g = teleSE(S2, { load: 'diode', buffer: true }); g.setAttribute('transform', 'translate(-200 30) scale(0.95)'); },
    steps: [
      { t: 6, title: '(a) Two diodes from $V_{DD}$ put M3’s drain at $V_{DD} - 2|V_{GS,p}|$; fence: $\\ge V_b - V_{thn}$', tex: stepTex('bank-t2q2', 0), say: '$3 - 2|V_{GS,p}| \\ge 1.4 - 0.7$, so each PMOS may use at most 1.15 V: an overdrive of at most 0.35 V.' },
      { t: 14, title: 'Smallest W that carries 0.5 mA at $|V_{ov}|$ = 0.35 V', tex: stepTex('bank-t2q2', 1), try: { q: '(a) W/L = 2(0.5m)/(38.36µ·0.35²); L = 0.5 µm. W in µm?', answer: ans('bank-t2q2', 'w'), unit: 'µm', tol: 0.02, hint: 'W/L = 212.8.' }, say: '$W/L$ = 212.8, so W = 106 µm.' },
      { t: 23, title: '(b) Floor: M4’s fence, $V_b - V_{th4}$', tex: stepTex('bank-t2q2', 2), try: { q: '(b) Lowest output = V_b − V_th4 (V)?', answer: ans('bank-t2q2', 'vmin'), unit: 'V', tol: 0.01, hint: '1.4 − 0.7.' }, say: '0.7 V.' },
      { t: 30, title: 'Ceiling: the stack would allow 1.5 V, but M2’s gate is on the output', tex: stepTex('bank-t2q2', 3), try: { q: '(b) Highest output (V)?', answer: ans('bank-t2q2', 'vmax'), unit: 'V', tol: 0.02, hint: 'M2 leaves saturation above V_b − V_GS4 + V_th2.' }, say: 'The buffer fence on M2 wins: 1.21 V. The window is only half a volt.' },
      { t: 39, title: '(c) Gain: $g_{m1}(R_{up}\\parallel R_{down})$', tex: stepTex('bank-t2q2', 4), try: { q: '(c) Open-loop gain?', answer: ans('bank-t2q2', 'av'), unit: '', tol: 0.03, hint: 'Both looks are ≈ g_m r_O².' }, say: 'About 1300.' },
      { t: 47, ans: true, title: '**Answers:** W ≈ 106 µm · output 0.7 to 1.21 V · gain ≈ 1300', say: 'Exactly the diode tax and the buffer window from the background scenes, now with numbers.' },
    ],
  });
}, { q: 'Tutorial 2 Q2' });

scene(CQ, '2023 mid-sem Q3: design a high-swing telescopic', 80, (S) => {
  pyqFrame(S, {
    tag: 'LEC 6 · PAST PAPER', title: 'Sizes, bias limits and gain from the specs', src: 'Mid-sem 2023-24 Q3 · 14 marks', paper: 'm23q3',
    q: 'PMOS all about one size, NMOS all one size. SR = 5 V/µs into 10 pF; $V_{out,max}$ = 1.28 V, $V_{out,min}$ = 0.3 V, $V_{DD}$ = 2 V; $\\mu_nC_{ox}$ = 100, $\\mu_pC_{ox}$ = 50 µA/V², $V_{thn}$ = 0.3, $|V_{thp}|$ = 0.4 V, $\\lambda_n$ = 0.1, $\\lambda_p$ = 0.2 V⁻¹. Sizes, $V_{b1,min}$, $V_{b2,max}$, $V_{b3}$, gain.', qh: 260,
    tests: 'the design order: slew rate → current; floor → NMOS overdrive; ceiling → PMOS overdrive (the tail’s √2·V_ov at full steering); bias limits by checks and links; two-look gain.',
    fig: paperFig('m23q3f', [['I_{SS} = SR\\cdot C_L,\\;\\; 0.3\\,\\mathrm{V} = 2V_{ov,N},\\;\\; 0.72 = (2 + \\sqrt2)|V_{ov,P}|', 690, 22], ['A_v = g_{m2}(g_{m4}r_{OP}^2 \\parallel g_{m6}r_{ON}^2)', 780, 24, '#ffd38a']], 500),
    steps: [
      { t: 6, title: 'Slew rate sets the current', tex: stepTex('pyq-m23-q3', 0), say: '$I_{SS}$ = 5 V/µs × 10 pF = 50 µA: 25 µA per side.' },
      { t: 12, title: 'Floor: two NMOS overdrives', tex: stepTex('pyq-m23-q3', 1), try: { q: 'V_ov,N = 0.15 V, 25 µA. (W/L) of the NMOS?', answer: ans('pyq-m23-q3', 'wlN'), unit: '', tol: 0.02, hint: '2I/(µnCox·V_ov²).' }, say: '22.2.' },
      { t: 21, title: 'Ceiling: three PMOS overdrives, the tail’s at √2 times', tex: stepTex('pyq-m23-q3', 2), try: { q: '|V_ov,P| = 0.72/(2 + √2) = 0.211 V. (W/L) of the PMOS?', answer: ans('pyq-m23-q3', 'wlP'), unit: '', tol: 0.02, hint: '2(25µ)/(50µ·0.211²).' }, say: '22.5: both types end up the same size.' },
      { t: 31, title: '$V_{b1,min}$: M7 at its edge under cascode M5', tex: stepTex('pyq-m23-q3', 3), try: { q: 'V_b1,min (V)?', answer: ans('pyq-m23-q3', 'vb1'), unit: 'V', tol: 0.01, hint: 'A check, then a link: 0.15 + (0.3 + 0.15).' }, say: '0.6 V.' },
      { t: 39, title: '$V_{b2,max}$: M2 at its edge', tex: stepTex('pyq-m23-q3', 4), try: { q: 'V_b2,max (V)?', answer: ans('pyq-m23-q3', 'vb2'), unit: 'V', tol: 0.02, hint: 'Walk down from V_DD: tail, M2’s check, then the link to the gate.' }, say: '0.88 V.' },
      { t: 47, title: '$V_{b3}$ for the tail', tex: stepTex('pyq-m23-q3', 5), try: { q: 'V_b3 (V)?', answer: ans('pyq-m23-q3', 'vb3'), unit: 'V', tol: 0.02, hint: '2 − |V_GS9| with I = 50 µA.' }, say: '1.3 V.' },
      { t: 54, title: 'Gain by two looks', tex: stepTex('pyq-m23-q3', 6), try: { q: 'Open-loop gain?', answer: ans('pyq-m23-q3', 'av'), unit: '', tol: 0.03, hint: 'g_m2 = 0.237 mS; both looks are g_m r_O².' }, say: 'About 1900.' },
      { t: 62, ans: true, title: '**Answers:** (W/L)_P ≈ 22.5, (W/L)_N ≈ 22.2 · V_b1,min 0.6 V · V_b2,max 0.88 V · V_b3 1.3 V · gain ≈ 1909', say: 'Specs to sizes in a fixed order: current, floor, ceiling, biases, gain.' },
    ],
  });
}, { q: 'Mid-sem 2023 Q3' });
moveScenesBefore(['Tutorial 2 Q2: the diode-stack telescopic, every part', '2023 mid-sem Q3: design a high-swing telescopic'], 'How to attack any Lec 6 question');
