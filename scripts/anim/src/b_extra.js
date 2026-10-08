/* Lesson B: Problem Set 1 P10 (settling + swing capstone) from the guide, placed with the Lec 13 questions. */
'use strict';
scene(L13, 'Problem Set 1 P10: design for settling and swing', 60, (S) => {
  pyqFrame(S, {
    tag: 'LEC 13 · CAPSTONE', title: 'Topology, g_m from settling, overdrives from swing', src: 'Problem Set 1 P10',
    q: 'Set B ($V_{DD}$ = 1.8 V). Fully differential op amp: gain ≥ 500, differential swing ≥ 1.2 Vpp, $C_L$ = 2 pF, settle to 0.1 % in 20 ns in unity-gain feedback, input CM = output CM. (a) Topology. (b) Required $g_{m1,2}$. (c) Overdrive of the swing-critical devices. (d) Power.', qh: 250,
    tests: 'the closed-loop τ = 1/(βω_u) and 6.91τ for 0.1 %, the buffer window that rules out a telescopic, and headroom shared by four overdrives.',
    fig: eqFig([['\\beta = 1:\;\\tau = \\frac{1}{\\omega_u} = \\frac{C_L}{g_m}', 280, 30], ['6.91\\,\\tau \\le 20\\,\\mathrm{ns}', 390, 30, '#ffd38a'], ['4V_{ov} = 1.8 - 0.6', 500, 30]]),
    steps: [
      { t: 6, title: '(a) Input CM = output CM in unity feedback: a telescopic is stuck in its V_th − V_ov window', tex: stepTex('bank-ps1p10', 0), try: { q: '(a) Which topology?', choices: ['Folded cascode', 'Telescopic cascode'], answer: 0, hint: 'Lec 6: the folded buffer has no ceiling from the input device.' }, say: 'Folded cascode.' },
      { t: 13, title: '(b) Settling sets g_m', tex: stepTex('bank-ps1p10', 1), try: { q: '(b) g_m ≥ (6.91/20 ns)·2 pF, in S (type 0.69m)?', answer: ans('bank-ps1p10', 'gm'), unit: 'S', tol: 0.02, hint: '0.1 % needs ln(1000) = 6.91 time constants.' }, say: '0.69 mS.' },
      { t: 22, title: '(c) Each output swings 0.6 V; four overdrives share the rest', tex: stepTex('bank-ps1p10', 2), try: { q: '(c) Overdrive of each swing-critical device (V)?', answer: ans('bank-ps1p10', 'vov'), unit: 'V', tol: 0.01, hint: '(1.8 − 0.6)/4.' }, say: '0.3 V each.' },
      { t: 30, title: '(d) Currents and power', tex: stepTex('bank-ps1p10', 3), try: { q: '(d) Power in W (type 0.72m)?', answer: ans('bank-ps1p10', 'power'), unit: 'W', tol: 0.02, hint: '1.8 × (200µ + 2×100µ).' }, say: '0.72 mW, with a gain around 2300, comfortably above 500.' },
      { t: 38, ans: true, title: '**Answers:** folded cascode · 0.69 mS · 0.3 V · 0.72 mW', say: 'Every spec turned into one number: settling into $g_m$, swing into overdrives, overdrives and currents into power.' },
    ],
  });
}, { q: 'Problem Set 1 P10' });
moveScenesBefore(['Problem Set 1 P10: design for settling and swing'], 'Lab 9: specs for a two-stage buffer');
