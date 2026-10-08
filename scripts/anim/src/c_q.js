/* Lesson C: every question tied to Lecture 6, solved by the student first. */
'use strict';
const CQ = 'Lec 6 · Questions';
const RAZ = { tail: 'I_SS', in: ['M1', 'M2'], top: ['M9', 'M10'], pc: ['M7', 'M8'], nc: ['M3', 'M4'], bot: ['M5', 'M6'] };
const FT = tfm(0.82, -60, 140);
const foldFig = (S2) => { const g = foldP(S2, RAZ); g.setAttribute('transform', 'translate(-60 140) scale(0.82)'); };

/* PMOS-input telescopic (2024 mid-sem Q3) */
function teleP(S, o = {}) {
  const g = S.g(); const r = S.into(g);
  rail(S, 300, 860, 150);
  const L = 470, R = 690;
  isrc(S, 580, 195, { label: 'I_SS', len: 45 }); dot(S, 580, 245); wire(S, [[L, 245], [R, 245]]); wire(S, [[L, 245], [L, 250]]); wire(S, [[R, 245], [R, 250]]);
  pmos(S, L, 300, { name: 'M1', gate: 'V_in1' });
  if (o.buffer) { const m2 = pmos(S, R, 300, { name: 'M2', right: true, nameSide: 'l', gl: 30 }); wire(S, [[m2.gate[0], 300], [790, 300], [790, 470]], { color: C.volt }); dot(S, 790, 470); }
  else pmos(S, R, 300, { name: 'M2', gate: 'V_in2', right: true, nameSide: 'l' });
  wire(S, [[L, 350], [L, 350]]);
  const m3 = pmos(S, L, 400, { name: 'M3', right: true, gl: 26, nameSide: 'l' }); const m4 = pmos(S, R, 400, { name: 'M4', gl: 26 });
  wire(S, [[m3.gate[0], 400], [m4.gate[0], 400]]); txt(S, 580, 391, 'V_b', { size: 17, color: C.muted, anchor: 'middle' });
  wire(S, [[L, 450], [L, 480]]); wire(S, [[R, 450], [R, 480]]); dot(S, L, 465); dot(S, R, 465);
  wire(S, [[R, 465], [830, 465]]); txt(S, 838, 472, 'V_out', { size: 20, color: C.volt, weight: 700 });
  const m5 = nmos(S, L, 530, { name: 'M5', right: true, gl: 26, nameSide: 'l' }); const m6 = nmos(S, R, 530, { name: 'M6', gl: 26 });
  wire(S, [[m5.gate[0], 530], [m6.gate[0], 530]]); wire(S, [[L, 465], [510, 465], [510, 530]], { color: C.amb }); dot(S, 510, 530);
  wire(S, [[L, 580], [L, 590]]); wire(S, [[R, 580], [R, 590]]); dot(S, L, 585);
  const m7 = nmos(S, L, 640, { name: 'M7', right: true, gl: 26, nameSide: 'l' }); const m8 = nmos(S, R, 640, { name: 'M8', gl: 26 });
  wire(S, [[m7.gate[0], 640], [m8.gate[0], 640]]); wire(S, [[L, 585], [545, 585], [545, 640]], { color: C.amb }); dot(S, 545, 640);
  gnd(S, L, 690); gnd(S, R, 690);
  r(); return g;
}

scene(CQ, 'Problem Set 1 P8: folded-cascode CM ranges', 58, (S) => {
  pyqFrame(S, {
    tag: 'LEC 6 · QUESTION 1 OF 9', title: 'Input and output ranges of a folded cascode', src: 'Problem Set 1 P8 (Lec 6)',
    q: 'The P6 folded cascode ($V_{DD} = 3$ V, every swing-critical $V_{ov} = 0.5$ V, $|V_{thp}| = 0.8$ V, input $|V_{GS1}| = 1.1$ V), with the tail needing 0.4 V. (a) Input CM range. (b) Output range, and a CM level that works for both.', qh: 230,
    tests: 'your page’s first circuit with numbers: floor $X - |V_{thp}|$, ceiling $V_{DD}$ − tail − $|V_{GS1}|$; then the output range by checks.',
    fig: foldFig,
    steps: [
      { t: 7, title: '(a) Floor: M1’s drain is X = $V_{ov5}$ = 0.5 V; a PMOS gate may sit $|V_{thp}|$ below its drain', tex: stepTex('bank-ps1p8', 0), hl: [FT([200, 280, 440, 270, C.p])], try: { q: 'X = 0.5 V, |V<sub>thp</sub>| = 0.8 V. Lowest input CM?', answer: -0.3, unit: 'V', tol: 0.01, abs: 0.005, hint: 'X − |Vthp|.' }, say: 'Floor: $0.5 - 0.8 = -0.3$ V — below ground.' },
      { t: 15, title: 'Ceiling: tail check (0.4 V) below $V_{DD}$, then the link $|V_{GS1}|$', tex: stepTex('bank-ps1p8', 1), hl: [FT([220, 150, 160, 130, C.p])], try: { q: 'V<sub>DD</sub> = 3 V, tail 0.4 V, |V<sub>GS1</sub>| = 1.1 V. Highest input CM?', answer: 1.5, unit: 'V', tol: 0.01, hint: '3 − 0.4 − 1.1.' }, say: 'Ceiling: $3 - 0.4 - 1.1 = 1.5$ V.' },
      { t: 23, title: '(b) Output: two NMOS overdrives up from ground, two PMOS down from $V_{DD}$', tex: stepTex('bank-ps1p8', 2), hl: [FT([560, 150, 330, 520, C.volt])], try: { q: 'Four overdrives of 0.5 V, V<sub>DD</sub> = 3 V. Output range [min, max] — type the lowest output.', answer: 1, unit: 'V', tol: 0.01, hint: 'Vov5 + Vov3.' }, say: 'Lowest output: $V_{ov5} + V_{ov3} = 1$ V.' },
      { t: 31, title: 'Ceiling, and one CM level for both', tex: stepTex('bank-ps1p8', 3), say: 'Highest: $3 - 0.5 - 0.5 = 2$ V. A CM of 1.5 V lies inside both the input range [−0.3, 1.5] and the output range [1, 2]: input CM = output CM is possible (the telescopic of Ex 9.6 could not do this).' },
      { t: 39, ans: true, title: '**Answers:** input CM ∈ [−0.3, 1.5] V · output ∈ [1, 2] V · e.g. $V_{CM} = 1.5$ V works for both', say: 'This is why folded cascodes suit buffers and capacitive feedback: the same DC level can sit at the input and the output.' },
    ],
  });
}, { q: 'Problem Set 1 P8' });

scene(CQ, 'Tutorial 2 Q3: design a folded cascode (2.4 V, 6 mW)', 66, (S) => {
  pyqFrame(S, {
    paper: 't2q3', tag: 'LEC 6 · QUESTION 2 OF 9', title: 'Power and swing decide everything', src: 'Tutorial 2 Q3 · Razavi 9.3',
    q: 'PMOS-input folded cascode, $V_{DD} = 3$ V, all $L = 0.5$ µm. Max differential swing 2.4 V, 6 mW. Find the currents, the overdrives, the gain, and whether the input CM can reach 0 V.', giv: 'Set A: $\\mu_nC_{ox} = 134.28\\,\\mu$, $\\mu_pC_{ox} = 38.36\\,\\mu$, $\\lambda_n = 0.1$, $\\lambda_p = 0.2$, $V_{thn} = 0.7$, $|V_{thp}| = 0.8$ V', qh: 250,
    tests: 'the Ex 9.7-style design order on a folded cascode, the two looks for gain, and your page’s CM floor $V_{ov5} - |V_{thp}|$.',
    fig: foldFig,
    steps: [
      { t: 7, title: 'Power: 6 mW/3 V = 2 mA; half to the pair, half to the two cascode branches', tex: stepTex('bank-t2q3', 0), try: { q: '2 mA total, half to the input pair. I<sub>SS</sub> (mA)?', answer: 1e-3, unit: 'A (type 1m)', tol: 0.01, hint: 'Half of 2 mA.' }, say: '$I_{SS} = 1$ mA (0.5 mA per input device), and each cascode branch gets 0.5 mA, so each bottom source carries 1 mA.' },
      { t: 15, title: 'Swing: 1.2 V per output; the four column overdrives share the other 1.8 V', tex: stepTex('bank-t2q3', 1), hl: [FT([560, 150, 330, 520, C.volt])], try: { q: 'V<sub>DD</sub> = 3 V, each output swings 1.2 V, four equal overdrives share the rest. V<sub>ov</sub>?', answer: 0.45, unit: 'V', tol: 0.01, hint: '(3 − 1.2)/4.' }, say: 'Four blocks in each output column (tail is not in it — folding!): $V_{ov} = (3 - 1.2)/4 = 0.45$ V.' },
      { t: 23, title: 'Gain: $g_{m1}(R_{up}\\parallel R_{down})$ with $R_{down} = g_{m3}r_{O3}(r_{O1}\\parallel r_{O5})$', tex: stepTex('bank-t2q3', 2), hl: [FT([560, 260, 330, 200, C.n])], say: 'Two looks: PMOS cascode up, NMOS cascode with two $r_O$ at the fold node down. About 247.' },
      { t: 31, title: 'CM floor: M1’s fence against X = $V_{ov5}$', tex: stepTex('bank-t2q3', 3), hl: [FT([200, 280, 440, 270, C.p])], try: { q: 'X = V<sub>ov5</sub> = 0.45 V, |V<sub>thp</sub>| = 0.8 V. Lowest input CM?', answer: -0.35, unit: 'V', tol: 0.02, hint: 'X − |Vthp|.' }, say: '$0.45 - 0.8 = -0.35$ V < 0: yes, the input CM can go to 0 V (and below).' },
      { t: 39, ans: true, title: '**Answers:** $I_{SS} = 1$ mA, branches 0.5 mA · $V_{ov} = 0.45$ V · $A_v ≈ 247$ · CM floor −0.35 V, so 0 V is fine', say: 'Exactly your page’s point: the PMOS-input folded cascode accepts inputs at ground.' },
    ],
  });
}, { q: 'Tutorial 2 Q3' });

scene(CQ, 'Problem Set 1 P6: a full folded-cascode design', 74, (S) => {
  pyqFrame(S, {
    tag: 'LEC 6 · QUESTION 3 OF 9', title: 'Currents, overdrives, sizes, gain, ω_u', src: 'Problem Set 1 P6',
    q: 'PMOS-input folded cascode, Set A, $V_{DD} = 3$ V, $L = 0.5$ µm, $C_L = 2$ pF. Differential swing 2.0 V, 4.5 mW. (a) $I_{SS}$, I. (b) Overdrives and W/L of M3–M10. (c) With $|V_{ov1,2}| = 0.3$ V, $(W/L)_{1,2}$. (d) Gain. (e) $\\omega_u$.', qh: 250,
    tests: 'the folded-cascode bookkeeping: bottom sources carry $I_{SS}/2 + I$; four blocks share the headroom; square law for sizes; $\\omega_u = g_m/C_L$.',
    fig: foldFig,
    steps: [
      { t: 6, title: '(a) 1.5 mA total; half to the pair; bottom sources carry $I_{SS}/2 + I$', tex: stepTex('bank-ps1p6', 0), try: { q: '4.5 mW at 3 V, half to the pair. I<sub>SS</sub> (mA)?', answer: 0.75e-3, unit: 'A (type 0.75m)', tol: 0.01, hint: '1.5 mA / 2.' }, say: '$I_{SS} = 0.75$ mA, branch current $I = 0.375$ mA, bottom sources $0.375 + 0.375 = 0.75$ mA.' },
      { t: 14, title: '(b) 1 V per output; four overdrives share 2 V', tex: stepTex('bank-ps1p6', 1), try: { q: 'Each output swings 1 V from V<sub>DD</sub> = 3 V; four equal overdrives. V<sub>ov</sub>?', answer: 0.5, unit: 'V', tol: 0.01, hint: '(3 − 1)/4.' }, say: '$V_{ov} = 0.5$ V for M3–M10.' },
      { t: 22, title: 'Square law per device: NMOS cascodes carry I', tex: stepTex('bank-ps1p6', 2), try: { q: 'NMOS at 0.375 mA, V<sub>ov</sub> = 0.5 V, µnCox = 134.28 µA/V². (W/L)<sub>3,4</sub>?', answer: ans('bank-ps1p6', 'wl3'), unit: '', tol: 0.02, hint: '2ID/(µnCox·Vov²).' }, say: '$(W/L)_{3,4} = 22.3$; the bottom NMOS (twice the current) 44.7; the PMOS (I, lower mobility) 78.2.' },
      { t: 30, title: '(c) Input pair at 0.375 mA, $|V_{ov}| = 0.3$ V', tex: stepTex('bank-ps1p6', 5), say: '$(W/L)_{1,2} = 2(0.375\\,\\text{m})/(38.36\\,\\mu\\times0.09) = 217$.' },
      { t: 37, title: '(d) Gain by two looks', tex: stepTex('bank-ps1p6', 6), try: { q: 'g<sub>m1</sub> = 2.5 mS, R<sub>up</sub> ∥ R<sub>down</sub> ≈ 133 kΩ. A<sub>v</sub>?', answer: ans('bank-ps1p6', 'av'), unit: 'V/V', tol: 0.03, hint: 'gm1 × (Rup ∥ Rdown).' }, say: '$A_v ≈ 333$ (with $G_m = g_{m1}$; P7 corrects this).' },
      { t: 45, title: '(e) $\\omega_u = g_{m1}/C_L$', tex: stepTex('bank-ps1p6', 7), try: { q: 'g<sub>m1</sub> = 2(0.375m)/0.3, C<sub>L</sub> = 2 pF. ω<sub>u</sub> (Grad/s)?', answer: ans('bank-ps1p6', 'wu'), unit: 'rad/s (type 1.25G)', tol: 0.02, hint: '2.5 mS / 2 pF.' }, say: '$\\omega_u = 2.5\\,\\text{mS}/2\\,\\text{pF} = 1.25$ Grad/s.' },
      { t: 53, ans: true, title: `**Answers:** $I_{SS} = 0.75$ mA, I = 0.375 mA · $V_{ov} = 0.5$ V · W/L: 22.3, 44.7, 78.2, 217 · $A_v ≈ 333$ · $\\omega_u$ = 1.25 Grad/s`, say: 'Same order every time: power → currents, swing → overdrives, square law → sizes, then gain and speed.' },
    ],
  });
}, { q: 'Problem Set 1 P6' });

scene(CQ, 'Problem Set 1 P7: how much of M1’s current reaches the output?', 46, (S) => {
  pyqFrame(S, {
    tag: 'LEC 6 · QUESTION 4 OF 9', title: 'The current divider at the fold node', src: 'Problem Set 1 P7',
    q: 'In P6 you assumed $G_m = g_{m1}$. At the fold node the signal current splits between M3’s source ($\\frac{1}{g_{m3}}\\parallel r_{O3}$) and $r_{O1}\\parallel r_{O5}$. What fraction reaches the output, and what is the corrected gain?', qh: 230,
    tests: 'the current divider of the foundations — the reason $G_m ≈ g_{m1}$ — with real numbers.',
    fig: foldFig,
    steps: [
      { t: 6, title: 'Current divider at X: the easy path is up into M3’s source', tex: stepTex('bank-ps1p7', 0), hl: [FT([560, 400, 330, 180, C.amb])], try: { q: 'Fraction = (r<sub>O1</sub> ∥ r<sub>O5</sub>) / [(1/g<sub>m3</sub> ∥ r<sub>O3</sub>) + (r<sub>O1</sub> ∥ r<sub>O5</sub>)]. With the P6 numbers it is?', answer: ans('bank-ps1p7', 'frac'), unit: '', tol: 0.02, hint: 'The divider favours the small resistance.' }, say: 'About 91 % of M1’s signal current goes up through M3; 9 % is lost into $r_{O1}\\parallel r_{O5}$.' },
      { t: 15, title: 'Scale the gain', tex: stepTex('bank-ps1p7', 1), try: { q: 'Ideal gain 333, fraction 0.911. Corrected gain?', answer: ans('bank-ps1p7', 'av'), unit: 'V/V', tol: 0.02, hint: '333 × 0.911.' }, say: '$333 \\times 0.911 ≈ 304$.' },
      { t: 22, ans: true, title: '**Answers:** 91 % reaches the output · $A_v ≈ 304$', say: '“$G_m ≈ g_{m1}$” is a good approximation, not exact — the fold node loses a few percent.' },
    ],
  });
}, { q: 'Problem Set 1 P7' });

const QZ = { tail: 'M11', in: ['M1', 'M2'], top: ['M5', 'M6'], pc: ['M3', 'M4'], nc: ['M7', 'M8'], bot: ['M9', 'M10'], fold: ['X', 'Y'] };
scene(CQ, 'Quiz 1 2023 Q2: NMOS-input folded cascode, all parts', 92, (S) => {
  const T = tfm(0.82, -60, 140);
  pyqFrame(S, {
    paper: 'q23q2', tag: 'LEC 6 · QUESTION 5 OF 9', title: 'CM range, bias limits, swing and gain', src: 'Quiz 1 2023-24 Q2',
    q: '$|V_{ov}| = 0.15$ V, $r_O = 50$ kΩ, $g_m = 1$ mS, $|V_{th}| = 0.3$ V for all, $V_{DD} = 3$ V. $V_{b2}$ at its maximum, $V_{b1}$ at its minimum. Find $V_{in,CM}$ min and max, max differential swing, $V_{b1,min}$, $V_{b2,max}$, gain. Then with $V_{b2} - 0.1$ V and $V_{b1} + 0.1$ V: $V_{in,CM,max}$ and swing.', qh: 270,
    tests: 'your page’s NMOS-input folded cascode: tail check + link for the floor, fold node + $V_{th}$ for the ceiling, links for the bias limits, fences for the swing, two looks for the gain.',
    fig: (S2) => { const g = foldN(S2, QZ); g.setAttribute('transform', 'translate(-60 140) scale(0.82)'); },
    steps: [
      { t: 7, title: 'Input floor: M11 needs $V_{ov}$, then a link $V_{GS1}$', tex: stepTex('pyq-q23-q2', 0), hl: [T([180, 370, 180, 260, C.n])], try: { q: 'V<sub>ov</sub> = 0.15 V, V<sub>GS</sub> = 0.45 V. V<sub>in,CM,min</sub>?', answer: 0.6, unit: 'V', tol: 0.01, hint: 'Tail check + link.' }, say: '$0.15 + 0.45 = 0.6$ V.' },
      { t: 15, title: '$V_{b2,max}$: M5 needs $|V_{ov}|$, so the fold node ≤ 2.85 V; fold = $V_{b2} + |V_{GS3}|$ (link)', tex: stepTex('pyq-q23-q2', 1), hl: [T([520, 150, 380, 250, C.p])], try: { q: 'Fold node at most 3 − 0.15 V; it sits |V<sub>GS3</sub>| = 0.45 V above V<sub>b2</sub>. V<sub>b2,max</sub>?', answer: 2.4, unit: 'V', tol: 0.01, hint: '2.85 − 0.45.' }, say: 'Top source check: fold ≤ 2.85 V. The fold node is M3’s source, one link above its gate: $V_{b2} \\le 2.4$ V.' },
      { t: 24, title: '$V_{b1,min}$: M9 needs $V_{ov}$ under M7’s source; M7’s gate is one link higher', tex: stepTex('pyq-q23-q2', 2), hl: [T([520, 520, 380, 200, C.n])], try: { q: 'M9 needs 0.15 V; V<sub>GS7</sub> = 0.45 V. V<sub>b1,min</sub>?', answer: 0.6, unit: 'V', tol: 0.01, hint: 'Check + link.' }, say: '$0.15 + 0.45 = 0.6$ V.' },
      { t: 32, title: 'Input ceiling: M1’s drain is the fold node (2.85 V); its gate may sit $V_{th}$ above it', tex: stepTex('pyq-q23-q2', 3), hl: [T([180, 230, 470, 230, C.n])], try: { q: 'Fold node 2.85 V, V<sub>th</sub> = 0.3 V. V<sub>in,CM,max</sub> (before capping at V<sub>DD</sub>)?', answer: 3.15, unit: 'V', tol: 0.01, hint: 'Drain + Vth.' }, say: '$2.85 + 0.3 = 3.15$ V — above $V_{DD}$, exactly your page’s point (in practice capped at 3 V).' },
      { t: 41, title: 'Swing: floor = M7’s fence $V_{b1} - V_{th}$, ceiling = M3’s fence $V_{b2} + |V_{th}|$; ×2', tex: stepTex('pyq-q23-q2', 4), hl: [T([520, 290, 380, 230, C.volt])], try: { q: 'Each output from 0.6 − 0.3 to 2.4 + 0.3 V. Differential swing?', answer: 4.8, unit: 'V', tol: 0.01, hint: '2 × (2.7 − 0.3).' }, say: 'Each output runs 0.3–2.7 V; differential $2 \\times 2.4 = 4.8$ V.' },
      { t: 50, title: 'Gain: $R_{up} = g_mr_O(r_O\\parallel r_O)$ (fold node), $R_{down} = g_mr_Or_O$', tex: stepTex('pyq-q23-q2', 5), try: { q: 'g<sub>m</sub> = 1 mS, r<sub>O</sub> = 50 k: R<sub>up</sub> = 1.25 MΩ, R<sub>down</sub> = 2.5 MΩ. A<sub>v</sub>?', answer: ans('pyq-q23-q2', 'av'), unit: 'V/V', tol: 0.02, hint: '1 mS × (1.25 M ∥ 2.5 M).' }, say: '$1\\,\\text{mS} \\times 833\\,\\text{k} ≈ 833$.' },
      { t: 59, title: 'Part 2: $V_{b2}$ 0.1 V lower lowers the fold node (and the ceilings); $V_{b1}$ 0.1 V higher raises the floor', tex: stepTex('pyq-q23-q2', 6), try: { q: 'V<sub>b2</sub> = 2.3 V, V<sub>b1</sub> = 0.7 V. New differential swing?', answer: 4.4, unit: 'V', tol: 0.01, hint: 'Each output from 0.4 to 2.6 V.' }, say: 'Fold node 2.75 V → CM max 3.05 V; outputs 0.4–2.6 V → swing 4.4 V.' },
      { t: 67, ans: true, title: '**Answers:** CM ∈ [0.6, 3.15 (→3)] V · $V_{b2,max}$ = 2.4 V · $V_{b1,min}$ = 0.6 V · swing 4.8 V · $A_v ≈ 833$ · part 2: 3.05 V, 4.4 V', say: 'Every number came from a check, a link, or a fence. Biases at their limits buy the most swing.' },
    ],
  });
}, { q: 'Quiz 1 2023 Q2' });

scene(CQ, 'Razavi Ex 9.5: the telescopic buffer window', 44, (S) => {
  const T = tfm(0.82, -60, 140);
  pyqFrame(S, {
    tag: 'LEC 6 · QUESTION 6 OF 9', title: 'How small is the telescopic window?', src: 'Buffer window (tutoring chat, Razavi Ex 9.5)',
    q: 'A telescopic op amp is used as a unity-gain buffer. $V_{th} = 0.4$ V, $V_{ov4} = 0.15$ V, $V_{b1} = 1.2$ V. Lowest and highest output, and the window width?', qh: 200,
    tests: 'the background scene: M4’s fence gives the floor, M2’s fence (gate = output) the ceiling.',
    fig: (S2) => { const g = teleSE(S2, { load: 'diode', buffer: true, xname: '', qname: 'Q' }); g.setAttribute('transform', 'translate(-60 140) scale(0.82)'); },
    steps: [
      { t: 6, title: 'Floor: M4’s fence', tex: stepTex('bank-chat-window', 0), hl: [T([400, 400, 360, 100, C.n])], try: { q: 'V<sub>b1</sub> = 1.2 V, V<sub>th</sub> = 0.4 V. Lowest output?', answer: 0.8, unit: 'V', tol: 0.01, hint: 'Vb1 − Vth4.' }, say: '$1.2 - 0.4 = 0.8$ V.' },
      { t: 13, title: 'Ceiling: M2’s fence; its gate is the output, its drain Q = $V_{b1} - V_{GS4}$', tex: stepTex('bank-chat-window', 1), hl: [T([400, 500, 360, 110, C.bad])], try: { q: 'Q = 1.2 − 0.55 V, V<sub>th</sub> = 0.4 V. Highest output?', answer: 1.05, unit: 'V', tol: 0.01, hint: 'Q + Vth2.' }, say: '$1.2 - 0.55 + 0.4 = 1.05$ V.' },
      { t: 20, title: 'Width = $V_{th} - V_{ov4}$', tex: stepTex('bank-chat-window', 2), say: 'Only 0.25 V for the output.' },
      { t: 25, ans: true, title: '**Answers:** 0.8 V to 1.05 V · width 0.25 V', say: 'Compare the folded buffer on your page: no ceiling from M2 at all.' },
    ],
  });
}, { q: 'Razavi Ex 9.5' });

scene(CQ, 'Problem Set 1 P5: diode-stack mirror and its buffer window', 58, (S) => {
  const T = tfm(0.82, -60, 140);
  pyqFrame(S, {
    tag: 'LEC 6 · QUESTION 7 OF 9', title: 'The diode tax, then the buffer', src: 'Problem Set 1 P5',
    q: 'Single-ended telescopic with a diode cascode mirror, Set A ($V_{DD} = 3$ V), $(W/L)_{1-8} = 200$, $I_{SS} = 1$ mA, $V_{b1} = 1.6$ V. (a) $V_X$ (M1’s drain). (b) Output range. (c) Why is $V_{out,max}$ not $V_{DD} - |V_{ov8}| - |V_{ov6}|$? (d) With M2’s gate on $V_{out}$, the range.', qh: 240,
    tests: 'a link for X, M4’s fence for the floor, the diode tax for the ceiling, and the buffer window.',
    fig: (S2) => { const g = teleSE(S2, { load: 'diode', xname: '', qname: 'X' }); g.setAttribute('transform', 'translate(-60 140) scale(0.82)'); },
    steps: [
      { t: 6, title: '(a) X is M3’s source: one $V_{GS3}$ below $V_{b1}$ (a link)', tex: stepTex('bank-ps1p5', 0), hl: [T([400, 420, 120, 110, C.volt])], try: { q: 'V<sub>b1</sub> = 1.6 V, V<sub>GS3</sub> = 0.893 V. V<sub>X</sub>?', answer: ans('bank-ps1p5', 'vx'), unit: 'V', tol: 0.01, hint: 'Vb1 − VGS3.' }, say: '$1.6 - 0.893 = 0.707$ V.' },
      { t: 14, title: '(b) Floor: M4’s fence', tex: stepTex('bank-ps1p5', 1), hl: [T([620, 400, 140, 100, C.n])], say: '$V_{out} \\ge 1.6 - 0.7 = 0.9$ V.' },
      { t: 21, title: 'Ceiling: the diode stack pins M6’s gate one $|V_{thp}|$ too low', tex: stepTex('bank-ps1p5', 2), hl: [T([400, 150, 360, 260, C.amb])], try: { q: '|V<sub>ov</sub>| of the PMOS = 0.361 V each, |V<sub>thp</sub>| = 0.8 V. V<sub>out,max</sub> = 3 − 0.8 − 2(0.361)?', answer: ans('bank-ps1p5', 'max'), unit: 'V', tol: 0.01, hint: 'The diode tax subtracts |Vthp|.' }, say: '(c) $3 - 0.8 - 0.361 - 0.361 = 1.478$ V: one $|V_{thp}|$ lower than ideal cascode loads would allow — the diode tax.' },
      { t: 30, title: '(d) Buffer: M2’s fence caps it at $V_{b1} - V_{GS4} + V_{th}$', tex: stepTex('bank-ps1p5', 3), try: { q: 'V<sub>b1</sub> = 1.6, V<sub>GS4</sub> = 0.893, V<sub>th</sub> = 0.7 V. Highest buffer output?', answer: ans('bank-ps1p5', 'bufMax'), unit: 'V', tol: 0.01, hint: 'Vb1 − VGS4 + Vth.' }, say: '1.407 V; the window is 0.9–1.407 V.' },
      { t: 38, ans: true, title: '**Answers:** $V_X$ = 0.707 V · output 0.9–1.478 V · diode tax $|V_{thp}|$ · buffer 0.9–1.407 V. (Check: with these sizes M3 is just in triode — the trap of Tutorial 2 Q2.)', say: 'One honesty note: with W/L = 200 the diode stack puts M3’s drain below X, so M3 is actually in triode; the key assumes saturation.' },
    ],
  });
}, { q: 'Problem Set 1 P5' });

scene(CQ, '2024 mid-sem Q3: PMOS-input telescopic, then as a buffer', 66, (S) => {
  const T = tfm(0.82, -60, 140);
  pyqFrame(S, {
    paper: 'm24q3', tag: 'LEC 6 · QUESTION 8 OF 9', title: 'Gain, swing, and the buffer floor', src: 'Mid-sem 2024-25 Q3 · 10 marks',
    q: '$I_{SS} = 50\\,\\mu$A, $V_{ov1-4} = 0.2$ V, $V_{ov5-8} = 0.1$ V, tail needs 0.15 V, $V_b = 0.7$ V. Gain, $V_{out,max}$, $V_{out,min}$. With $V_{out}$ shorted to $V_{in2}$: $V_{out,max}$ and $V_{out,min}$.', giv: '$V_{DD} = 1.8$ V, $\\lambda_p = 0.2$, $\\lambda_n = 0.1$ V⁻¹, $V_{thn} = 0.4$, $|V_{thp}| = 0.5$ V', qh: 250,
    tests: 'the PMOS-flipped telescopic: two looks for gain, PMOS fence for the ceiling, the diode stack for the floor, and the buffer fence that now gives a floor.',
    fig: (S2) => { const g = teleP(S2); g.setAttribute('transform', 'translate(-60 140) scale(0.82)'); },
    steps: [
      { t: 7, title: 'Roles and small-signal values (25 µA per side)', tex: stepTex('pyq-m24-q3', 0), say: 'M2 is the input, M4 the PMOS cascode, M6 the NMOS cascode, M8 the source. $g_{m2} = 0.25$ mS, $r_{OP} = 200$ kΩ, $r_{ON} = 400$ kΩ.' },
      { t: 14, title: 'Gain: up multiplies on both sides', tex: stepTex('pyq-m24-q3', 1), try: { q: 'g<sub>m2</sub> = 0.25 mS, R<sub>up</sub> = 10 MΩ, R<sub>down</sub> = 80 MΩ. A<sub>v</sub>?', answer: ans('pyq-m24-q3', 'av'), unit: 'V/V', tol: 0.02, hint: '0.25 mS × (10 M ∥ 80 M).' }, say: '$0.25\\,\\text{mS}\\times8.9\\,\\text{M} ≈ 2222$.' },
      { t: 22, title: 'Ceiling: M4 (PMOS, gate $V_b$) saturated while $V_D \\le V_G + |V_{thp}|$', tex: stepTex('pyq-m24-q3', 2), hl: [T([400, 340, 360, 120, C.p])], try: { q: 'V<sub>b</sub> = 0.7 V, |V<sub>thp</sub>| = 0.5 V. V<sub>out,max</sub>?', answer: 1.2, unit: 'V', tol: 0.01, hint: 'Vb + |Vthp|.' }, say: '$0.7 + 0.5 = 1.2$ V.' },
      { t: 30, title: 'Floor: M6’s gate = $V_{GS7} + V_{GS5}$ (diode stack); NMOS fence $V_{out} \\ge V_{G6} - V_{th}$', tex: stepTex('pyq-m24-q3', 3), hl: [T([400, 470, 360, 230, C.amb])], try: { q: 'V<sub>G6</sub> = (0.4 + 0.1) + (0.4 + 0.1) V, V<sub>th</sub> = 0.4 V. V<sub>out,min</sub>?', answer: 0.6, unit: 'V', tol: 0.01, hint: 'VG6 − Vth.' }, say: '$1.0 - 0.4 = 0.6$ V — the diode tax again, this time at the bottom.' },
      { t: 38, title: 'Buffer: M2’s gate is $V_{out}$; its drain (M4’s source) = $V_b + |V_{GS4}|$ = 1.4 V. PMOS fence', tex: stepTex('pyq-m24-q3', 4), hl: [T([620, 240, 160, 120, C.bad])], try: { q: 'M2 (PMOS): drain 1.4 V ≤ gate V<sub>out</sub> + 0.5. Lowest buffer output?', answer: 0.9, unit: 'V', tol: 0.01, hint: 'Vout ≥ 1.4 − 0.5.' }, say: '$1.4 \\le V_{out} + 0.5 \\Rightarrow V_{out} \\ge 0.9$ V: for a PMOS input, M2’s fence becomes a <b>floor</b>.' },
      { t: 46, title: 'Buffer ceiling is still M4’s fence', tex: stepTex('pyq-m24-q3', 5), say: 'Still 1.2 V. Buffer window 0.9–1.2 V.' },
      { t: 52, ans: true, title: '**Answers:** $A_v ≈ 2222$ · $V_{out}$ ∈ [0.6, 1.2] V · buffer ∈ [0.9, 1.2] V', say: 'Flip NMOS↔PMOS and every fence flips: the PMOS telescopic’s buffer window is limited from below by M2.' },
    ],
  });
}, { q: 'Mid-sem 2024 Q3' });

scene(CQ, 'Tutorial 3 Q1: your page’s last circuit with numbers', 74, (S) => {
  const T = tfm(0.82, -60, 140);
  pyqFrame(S, {
    paper: 't3q1', tag: 'LEC 6 · QUESTION 9 OF 9', title: 'The low-voltage cascode load, every part', src: 'Tutorial 3 Q1 · Razavi 9.4',
    q: '$(W/L)_{1-8} = 200$, $I_{SS} = 1$ mA, $V_{b1} = 1.7$ V, Set A ($V_{DD} = 3$ V). (a) Maximum input CM. (b) $V_X$. (c) Output range if M2’s gate is tied to the output. (d) Allowed range of $V_{b2}$.', qh: 230,
    tests: 'a fence for the CM ceiling, a link for X, the telescopic buffer window, and the two fences that bound $V_{b2}$ — your page’s last circuit.',
    fig: (S2) => { const g = teleSE(S2, { load: 'lvc', xname: 'X', qname: '' }); g.setAttribute('transform', 'translate(-60 140) scale(0.82)'); },
    steps: [
      { t: 7, title: '(a) M1’s drain = $V_{b1} - V_{GS3}$; its gate may rise to that + $V_{th}$', tex: stepTex('bank-t3q1', 0), try: { q: 'V<sub>b1</sub> = 1.7 V, V<sub>GS3</sub> = 0.893 V, V<sub>th</sub> = 0.7 V. Max input CM?', answer: ans('bank-t3q1', 'cmMax'), unit: 'V', tol: 0.01, hint: 'Vb1 − VGS3 + Vth.' }, say: '$1.7 - 0.893 + 0.7 = 1.507$ V.' },
      { t: 15, title: '(b) M7’s gate is X and its source is $V_{DD}$: a link', tex: stepTex('bank-t3q1', 1), hl: [T([400, 150, 360, 270, C.amb])], try: { q: '|V<sub>GS7</sub>| = 0.8 + 0.361 V at 0.5 mA. V<sub>X</sub>?', answer: ans('bank-t3q1', 'vx'), unit: 'V', tol: 0.01, hint: '3 − |VGS7|.' }, say: '$X = 3 - 1.161 = 1.839$ V.' },
      { t: 23, title: '(c) Buffer window: M4’s fence below, M2’s fence above', tex: stepTex('bank-t3q1', 2), try: { q: 'Lowest buffer output V<sub>b1</sub> − V<sub>th</sub> = ?', answer: 1, unit: 'V', tol: 0.01, hint: '1.7 − 0.7.' }, say: 'Window 1.0–1.507 V (width $V_{th} - V_{ov4}$).' },
      { t: 31, title: '(d) M5 saturated: $V_X \\le V_{b2} + |V_{thp}|$', tex: stepTex('bank-t3q1', 4), hl: [T([400, 270, 120, 130, C.p])], try: { q: 'X = 1.839 V, |V<sub>thp</sub>| = 0.8 V. Smallest V<sub>b2</sub>?', answer: ans('bank-t3q1', 'vb2min'), unit: 'V', tol: 0.01, hint: 'X − |Vthp|.' }, say: '$V_{b2} \\ge 1.039$ V — your page’s first line.' },
      { t: 40, title: 'M7 saturated: its drain ($V_{b2} + |V_{GS5}|$) ≤ $V_X + |V_{thp}|$ (M7’s gate is X)', tex: stepTex('bank-t3q1', 5), hl: [T([400, 150, 120, 140, C.p])], try: { q: 'V<sub>X</sub> + 0.8 − |V<sub>GS5</sub>| with |V<sub>GS5</sub>| = 1.161 V. Largest V<sub>b2</sub>?', answer: ans('bank-t3q1', 'vb2max'), unit: 'V', tol: 0.01, hint: '1.839 + 0.8 − 1.161.' }, say: '$V_{b2} \\le 1.478$ V. (Same as your page’s $P \\le V_{DD} - |V_{ov7}|$, written with M7’s gate at X.)' },
      { t: 49, ans: true, title: '**Answers:** CM max 1.507 V · $V_X$ = 1.839 V · buffer 1.0–1.507 V · $V_{b2}$ ∈ [1.039, 1.478] V', say: 'Your page’s last circuit in exam form: one link for X, two fences for the bias window.' },
    ],
  });
}, { q: 'Tutorial 3 Q1' });

scene('Exam playbook', 'How to attack any Lec 6 question', 36, (S) => {
  header(S, 'EXAM PLAYBOOK', 'Lecture 6 in four moves');
  remember(S, [
    '**Currents:** power ÷ $V_{DD}$; pair gets half; bottom sources carry $I_{SS}/2 + I$; folding current ≥ $I_{SS}$.',
    '**Levels:** walk from a rail — check ($V_{ov}$) per channel, link ($V_{GS}$) to a gate. PMOS-input floor $X - |V_{thp}|$; NMOS-input ceiling fold + $V_{th}$.',
    '**Buffers and biases:** write each device’s fence with $V_{out}$ in it; floors take the max, ceilings the min. Bias limits = a source at its edge + a link.',
    '**Gain:** $g_{m1}(R_{up}\\parallel R_{down})$, the fold node carries two $r_O$; $G_m ≈ g_{m1}$ (≈ 91 %).',
  ], 0.4, 'The playbook');
  S.say(0.4, 'Four moves solve every Lecture 6 question: currents, levels by checks and links, fences for buffers and biases, and gain by two looks.');
});
