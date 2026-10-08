/* One more lab from the guide: Lab 3 (CS versus cascode: gain, bandwidth, GBW), placed with the other frequency labs. */
'use strict';
scene(LF, 'Lab 3: CS versus cascode, gain against bandwidth', 54, (S) => {
  pyqFrame(S, {
    tag: 'FREQUENCY · LAB QUESTION', title: 'More gain, same GBW', src: 'Lab 3 (hand calculations)',
    q: '$I_D$ = 20 µA, $V^*$ = 200 mV, $C_L$ = 1 pF, ideal loads, $V_A$ = 5 V ($r_O = V_A/I_D$). Find $g_m$, the CS gain, the cascode gain, the CS bandwidth and the GBW of both.', qh: 190,
    tests: 'gain = $g_mr_O$, a pole $1/(2\\pi r_OC_L)$, and GBW = $g_m/(2\\pi C_L)$: the cascode multiplies gain and divides bandwidth by the same factor.',
    fig: eqFig([['g_m = \\frac{2I_D}{V^*},\\quad r_O = \\frac{V_A}{I_D}', 280, 30], ['f_{-3dB} = \\frac{1}{2\\pi R_{out}C_L},\\quad GBW = \\frac{g_m}{2\\pi C_L}', 420, 28, '#ffd38a']]),
    steps: [
      { t: 6, title: 'g_m from V*', tex: stepTex('bank-lab3', 0), try: { q: 'g_m (S, type 0.2m)?', answer: ans('bank-lab3', 'gm'), unit: 'S', tol: 0.01, hint: '2(20µ)/0.2.' }, say: '0.2 mS.' },
      { t: 12, title: 'CS gain', tex: stepTex('bank-lab3', 1), try: { q: 'CS gain g_m r_O?', answer: ans('bank-lab3', 'acs'), unit: '', tol: 0.01, hint: 'r_O = 5/20µ = 250 k.' }, say: '50.' },
      { t: 18, title: 'Cascode gain', tex: stepTex('bank-lab3', 2), say: 'About the square: 2500.' },
      { t: 23, title: 'CS bandwidth', tex: stepTex('bank-lab3', 3), try: { q: 'CS −3 dB frequency (Hz)?', answer: ans('bank-lab3', 'fcs'), unit: 'Hz', tol: 0.02, hint: '1/(2π·250k·1p).' }, say: '637 kHz.' },
      { t: 30, title: 'GBW: the same for both', tex: stepTex('bank-lab3', 4), try: { q: 'GBW (Hz)?', answer: ans('bank-lab3', 'fu'), unit: 'Hz', tol: 0.02, hint: 'g_m/(2πC_L).' }, say: '31.8 MHz for both: the cascode has 50 times the gain and a fiftieth of the bandwidth.' },
      { t: 37, ans: true, title: '**Answers:** 0.2 mS · 50 · 2500 · 637 kHz · GBW 31.8 MHz (both)', say: 'Gain-bandwidth is fixed by $g_m$ and $C_L$; the output resistance only trades one for the other.' },
    ],
  });
}, { q: 'Lab 3' });
moveScenesBefore(['Lab 3: CS versus cascode, gain against bandwidth'], 'Lab 7: specs into numbers (g_m, dB)');
