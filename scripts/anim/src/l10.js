/* Lecture 10: CM and DM, the CMFB loop, resistive and source-follower sensing. */
'use strict';
const L10 = 'Lec 10 · CMFB: structure & sensing';

scene(L10, 'Common mode and differential mode', 62, (S) => {
  header(S, 'LEC 10 · YOUR PAGE, TOP', 'Any two signals = a shared part (CM) + a difference (DM)');
  eqAt(S, 'V_{in1} = \\underbrace{\\frac{V_{in1}+V_{in2}}{2}}_{\\text{CM}} + \\underbrace{\\frac{V_{in1}-V_{in2}}{2}}_{\\text{DM}/2}', 520, 215, 0.4, { size: 32, w: 900, h: 170 });
  eqAt(S, 'V_{in2} = \\frac{V_{in1}+V_{in2}}{2} + \\frac{V_{in2}-V_{in1}}{2}', 520, 345, 3, { size: 32, w: 900 });
  S.say(0.4, 'Your page starts with an identity that is always true: each input is the <b>average</b> of the two (the common mode) plus half the <b>difference</b>.');
  S.say(3, 'The CM part is the same in both. The DM part has equal size and <b>opposite</b> sign. Nothing else is needed to describe two signals.');
  // waveform: two inputs, then decomposition
  const x0 = 980, x1 = 1520, yc = 330;
  const ax = S.g(); S.el('rect', { x: x0 - 20, y: 150, width: x1 - x0 + 40, height: 360, rx: 14, fill: '#0f1520', stroke: '#1f2938' }, ax);
  txt(S, x0, 182, 'V_in1 and V_in2', { size: 19, color: C.muted }, ax);
  S.fade(ax, 6, 0.6);
  const cm = S.el('line', { x1: x0, y1: yc, x2: x1, y2: yc, stroke: C.amb, 'stroke-width': 2.4, 'stroke-dasharray': '8 6' });
  S.fade(cm, 10, 0.6);
  label(S, x1 - 4, yc - 12, 'V_CM (the average)', 10, { size: 19, color: C.amb, anchor: 'end', weight: 700 });
  const s1 = sine(S, x0, x1, yc, 90, { color: C.n, cycles: 2 }); S.draw(s1, 6.5, 1.5);
  const s2 = sine(S, x0, x1, yc, -90, { color: C.p, cycles: 2 }); S.draw(s2, 7, 1.5);
  S.say(6.5, 'Picture it: two sine waves moving in opposite directions around a shared level. That shared level is $V_{CM}$; the swinging part is the differential signal.');
  const cmov = S.g();
  S.anim(16, 8, 'cmshift', (p) => { const dy = -60 * Math.sin(Math.PI * p); [cm, s1, s2].forEach((e) => e.setAttribute('transform', `translate(0 ${dy})`)); }, E.inout);
  S.say(16, 'Change only the CM and <b>both</b> waves slide up together; the difference does not change. Change only the DM and they move further apart; the average stays put.');
  whyBox(S, 120, 420, 760, 190, '**Why this split matters for a fully differential op amp:** the **DM** part is the signal we amplify — it moves the outputs in **opposite** directions. The **CM** part moves both outputs **together**, and nothing in the amplifier itself controls it.', 26);
  S.say(26, '<span class="why">Why we care:</span> at the outputs, the differential part is our signal. The common part — the outputs’ shared DC level — is not controlled by anything yet.');
  const tb = html(S, 120, 640, 760, 200, `<table class="tbl"><tr><th></th><th>moves the outputs</th><th>who controls it?</th></tr>
    <tr><td>DM ($v_d$)</td><td>opposite ways (the signal)</td><td class="same">the gain $A_d$</td></tr>
    <tr><td>CM</td><td>together</td><td class="chg">nobody yet → CMFB</td></tr></table>`.replace(/\$([^$]+)\$/g, (m) => rt(m)));
  tb.style.opacity = 0; S.slideIn(tb, 34, 0.7);
  S.say(34, 'Lecture 9 showed what goes wrong: with current-source loads the output CM is set by a tiny current mismatch times a huge resistance. Lecture 10 builds the loop that fixes it.');
});

/* general CMFB structure of the page */
function cmfbGeneral(S) {
  const g = S.g(); const r = S.into(g);
  rail(S, 240, 760, 170);
  isrc(S, 360, 240, { label: 'I_1', left: true }); isrc(S, 600, 240, { label: 'I_1' });
  wire(S, [[360, 170], [360, 198]]); wire(S, [[600, 170], [600, 198]]);
  wire(S, [[360, 282], [360, 380]]); wire(S, [[600, 282], [600, 380]]); dot(S, 360, 320); dot(S, 600, 320);
  txt(S, 348, 314, 'V_out1', { size: 19, color: C.volt, weight: 700, anchor: 'end' }); txt(S, 612, 300, 'V_out2', { size: 19, color: C.volt, weight: 700 });
  nmos(S, 360, 430, { name: 'M1', gate: 'V_in1' }); nmos(S, 600, 430, { name: 'M2', gate: 'V_in2', right: true });
  wire(S, [[360, 480], [360, 500], [600, 500], [600, 480]]);
  isrc(S, 480, 550, { label: 'I_SS', len: 50 }); gnd(S, 480, 600);
  // sensing box and amplifier
  S.el('rect', { x: 860, y: 240, width: 220, height: 120, rx: 12, fill: 'rgba(96,165,250,0.07)', stroke: C.volt, 'stroke-width': 2.4 });
  txt(S, 970, 290, 'CM sensing', { size: 21, color: C.volt, weight: 700, anchor: 'middle' }); txt(S, 970, 318, 'circuit', { size: 21, color: C.volt, weight: 700, anchor: 'middle' });
  wire(S, [[360, 320], [360, 210], [820, 210], [820, 270], [860, 270]]); wire(S, [[600, 320], [790, 320], [790, 330], [860, 330]]);
  wire(S, [[970, 360], [970, 450], [940, 450]]); txt(S, 982, 420, 'V_out,CM', { size: 19, color: C.amb, weight: 700 });
  const A = amp(S, 940, 470, { left: true, w: 120, h: 110, label: 'A_CMFB', lsize: 18 });
  wire(S, [[960, 498], [1040, 498]]); txt(S, 1048, 505, 'V_REF', { size: 20, color: C.muted });
  wire(S, [[820, 470], [700, 470], [700, 550], [501, 550]]);
  r();
  return g;
}

scene(L10, 'The CMFB loop: sense, compare, correct', 66, (S) => {
  header(S, 'LEC 10 · GENERAL STRUCTURE', 'Three blocks: a CM sensor, a CMFB amplifier, a current to correct');
  const g = cmfbGeneral(S);
  S.draw(g, 0.3, 2.6);
  S.say(0.3, 'Your page’s general structure. The pair M1, M2 with current-source loads $I_1$ — the amplifier whose output CM floats.');
  S.say(6, '<b>Block 1, the CM sensing circuit:</b> takes $V_{out1}$ and $V_{out2}$ and produces their average, $V_{out,CM}$, ignoring the differential signal.');
  S.say(12, '<b>Block 2, the CMFB amplifier:</b> compares $V_{out,CM}$ with a reference $V_{REF}$ — the level we want.');
  S.say(18, '<b>Block 3, the correction:</b> its output adjusts one current source — here the tail $I_{SS}$.');
  // loop walk-through
  const steps = [
    [24, 'V_out,CM too high ↑', 1260, 400, C.bad],
    [28, 'amp output ↑', 620, 620, C.amb],
    [32, 'I_SS ↑ (pulls harder)', 330, 600, C.cur],
    [36, 'both outputs pulled ↓', 210, 380, C.volt],
  ];
  steps.forEach(([t, s, x, y, col]) => { const c = chip(S, x, y, s, { color: col, size: 19 }); c.style.opacity = 0; S.pop(c, t); S.out(c, 46, 0.5); });
  S.flow([[970, 360], [970, 450], [940, 450]], 24, 46, { color: C.bad, speed: 50 });
  S.flow([[820, 470], [700, 470], [700, 550], [501, 550]], 28, 46, { color: C.amb, speed: 50 });
  S.flow([[480, 500], [480, 600]], 32, 46, { color: C.cur, speed: 80, w: 5 });
  S.say(24, 'Follow the loop. Suppose the outputs drift <b>up</b>: $V_{out,CM}$ exceeds $V_{REF}$…');
  S.say(28, '…the CMFB amplifier’s output rises…');
  S.say(32, '…the tail pulls more current…');
  S.say(36, '…and both outputs are pulled back <b>down</b>. Negative feedback: it settles where $V_{out,CM} = V_{REF}$.');
  whyBox(S, 1000, 600, 560, 220, '**Why it does not touch the signal:** a differential signal raises one output and lowers the other, so the **average does not change** — the sensor sees nothing, and the loop stays quiet. Only the common level is corrected.', 42);
  S.say(42, '<span class="why">Key point:</span> the differential signal leaves the average unchanged, so the CMFB loop never fights the signal. It only fixes the shared level.');
});

/* resistive sensing */
function resSense(S) {
  const g = S.g(); const r = S.into(g);
  rail(S, 300, 760, 170);
  const m3 = pmos(S, 400, 230, { name: 'M3', right: true, gl: 30, nameSide: 'l' }); const m4 = pmos(S, 640, 230, { name: 'M4', gl: 30 });
  wire(S, [[m3.gate[0], 230], [m4.gate[0], 230]]); txt(S, 520, 220, 'V_b', { size: 18, color: C.muted, anchor: 'middle' });
  wire(S, [[400, 170], [400, 180]]); wire(S, [[640, 170], [640, 180]]);
  wire(S, [[400, 280], [400, 380]]); wire(S, [[640, 280], [640, 380]]); dot(S, 400, 320); dot(S, 640, 320);
  resh(S, 400, 520, 320, { label: 'R_1' }); resh(S, 520, 640, 320, { label: 'R_2' }); dot(S, 520, 320);
  wire(S, [[520, 320], [520, 360]]); txt(S, 520, 384, 'V_out,CM', { size: 19, color: C.amb, weight: 700, anchor: 'middle' });
  txt(S, 388, 314, 'V_out1', { size: 19, color: C.volt, weight: 700, anchor: 'end' }); txt(S, 652, 300, 'V_out2', { size: 19, color: C.volt, weight: 700 });
  nmos(S, 400, 430, { name: 'M1', gate: 'V_in1' }); nmos(S, 640, 430, { name: 'M2', gate: 'V_in2', right: true });
  wire(S, [[400, 480], [400, 500], [640, 500], [640, 480]]); isrc(S, 520, 545, { label: 'I_SS', len: 45 }); gnd(S, 520, 590);
  r();
  return g;
}

scene(L10, 'Sensing with two resistors (and its cost)', 64, (S) => {
  header(S, 'LEC 10 · SENSING CIRCUIT 1', 'Two equal resistors average the outputs');
  const g = resSense(S);
  S.draw(g, 0.3, 2.2);
  S.say(0.3, 'The simplest CM sensor: two resistors $R_1 = R_2$ in series between the outputs. Their midpoint is the CM.');
  const ln = [
    ['V_{out}\\big|_{V_{out1}} = V_{out1}\\,\\frac{R_2}{R_1+R_2}', 6, 'Why the midpoint is the average — superposition (your page). Keep only $V_{out1}$ (set $V_{out2}$ to 0): a divider gives $V_{out1}R_2/(R_1+R_2)$.'],
    ['V_{out}\\big|_{V_{out2}} = V_{out2}\\,\\frac{R_1}{R_1+R_2}', 12, 'Keep only $V_{out2}$: $V_{out2}R_1/(R_1+R_2)$.'],
    ['V_{out,CM} = V_{out1}\\frac{R_2}{R_1+R_2} + V_{out2}\\frac{R_1}{R_1+R_2} = \\frac{V_{out1}+V_{out2}}{2}', 17, 'Add them; with $R_1 = R_2$ every factor is ½: exactly the average.'],
  ];
  ln.forEach(([tex, t, say], i) => { eqAt(S, tex, 1180, 220 + i * 95, t, { size: i === 2 ? 25 : 30, w: 780, color: i === 2 ? '#ffd38a' : C.text }); S.say(t, say); });
  // the cost
  S.ring(460, 320, 22, C.bad, 26, 44);
  eqAt(S, '\\text{without: } A_v = g_{m1}(r_{O1}\\parallel r_{O3})', 1180, 560, 26, { size: 28, w: 760, color: C.muted });
  eqAt(S, '\\text{with: } A_v = g_{m1}(r_{O1}\\parallel r_{O3}\\parallel R_1)', 1180, 630, 30, { size: 30, w: 760, color: '#ff8f86' });
  S.say(26, '<span class="why">The cost:</span> for the differential signal the midpoint is AC ground, so each output now has $R_1$ hanging on it — in parallel with $r_{O1}\\parallel r_{O3}$.');
  S.say(32, 'Unless $R_1$ is far bigger than $r_O$ (megohms), the gain drops. That is why Tutorial 5 Q3 uses R = 10 MΩ — and still loses a little.');
  whyBox(S, 820, 700, 740, 120, '**Fix:** isolate the outputs from the resistors with source followers (next scene).', 40);
  S.say(40, 'The fix on your page: put a source follower between each output and its resistor, so the resistors never touch the high-resistance outputs.');
});

scene(L10, 'Sensing through source followers', 62, (S) => {
  header(S, 'LEC 10 · SENSING CIRCUIT 2', 'Followers isolate the outputs; the sensed level drops by one V_GS');
  const g = S.g(); const r = S.into(g);
  rail(S, 120, 1300, 160);
  // main amp
  const m3 = pmos(S, 560, 220, { name: 'M3', right: true, gl: 26, nameSide: 'l' }); const m4 = pmos(S, 800, 220, { name: 'M4', gl: 26 });
  wire(S, [[m3.gate[0], 220], [m4.gate[0], 220]]); txt(S, 680, 210, 'V_b', { size: 18, color: C.muted, anchor: 'middle' });
  wire(S, [[560, 160], [560, 170]]); wire(S, [[800, 160], [800, 170]]);
  wire(S, [[560, 270], [560, 380]]); wire(S, [[800, 270], [800, 380]]); dot(S, 560, 310); dot(S, 800, 310);
  txt(S, 572, 304, '0.9', { size: 18, color: C.volt, weight: 700 }); txt(S, 788, 304, '0.9', { size: 18, color: C.volt, weight: 700, anchor: 'end' });
  nmos(S, 560, 430, { name: 'M1', gate: 'V_in1' }); nmos(S, 800, 430, { name: 'M2', gate: 'V_in2', right: true });
  wire(S, [[560, 480], [560, 500], [800, 500], [800, 480]]); isrc(S, 680, 545, { label: 'I_SS', len: 45 }); gnd(S, 680, 590);
  // followers
  const m5 = nmos(S, 320, 310, { name: 'M5', right: true, gl: 40, nameSide: 'l' }); wire(S, [[320, 160], [320, 260]]);
  wire(S, [[m5.gate[0], 310], [560, 310]]);
  wire(S, [[320, 360], [320, 420]]); dot(S, 320, 390); txt(S, 308, 386, '0.5', { size: 18, color: C.amb, weight: 700, anchor: 'end' });
  isrc(S, 320, 470, { label: 'I_1', left: true }); gnd(S, 320, 512);
  const m6 = nmos(S, 1040, 310, { name: 'M6', gl: 40 }); wire(S, [[1040, 160], [1040, 260]]);
  wire(S, [[m6.gate[0], 310], [800, 310]]);
  wire(S, [[1040, 360], [1040, 420]]); dot(S, 1040, 390); txt(S, 1052, 386, '0.5', { size: 18, color: C.amb, weight: 700 });
  isrc(S, 1040, 470, { label: 'I_2' }); gnd(S, 1040, 512);
  wire(S, [[320, 390], [320, 640], [560, 640]]); resh(S, 560, 680, 640, { label: 'R_1' }); resh(S, 680, 800, 640, { label: 'R_2' }); wire(S, [[800, 640], [1040, 640], [1040, 390]]);
  dot(S, 680, 640); wire(S, [[680, 640], [680, 690]]); txt(S, 680, 714, 'V_sense', { size: 19, color: C.amb, weight: 700, anchor: 'middle' });
  r();
  S.draw(g, 0.3, 2.6);
  S.say(0.3, 'Your page’s second sensor: each output drives the gate of a <b>source follower</b> (M5, M6, biased by $I_1$, $I_2$). The resistors hang on the followers’ sources instead.');
  S.say(8, '<span class="why">Why it works:</span> a gate draws no current, so the outputs see nothing extra — their high resistance (and the gain) is untouched.');
  S.ring(320, 390, 18, C.amb, 14, 30); S.ring(1040, 390, 18, C.amb, 14, 30);
  S.say(14, 'The price: a follower’s source sits one <b>link</b> below its gate. Your page’s numbers: outputs at 0.9 V, follower sources at 0.5 V.');
  eqAt(S, 'V_{sense} = \\frac{V_{out1}+V_{out2}}{2} - V_{GS5,6}', 1200, 600, 20, { size: 32, w: 700, color: '#ffd38a' });
  S.say(20, 'So the sensed value is the average shifted down by $V_{GS5,6}$ — choose $V_{REF}$ (or the amplifier’s other input) to match.');
  whyBox(S, 1120, 660, 440, 170, 'Each follower output = **DC level** ($V_{out,CM} - V_{GS}$) **+ AC signal** ($\\pm v_{out}$). The resistors average away the AC; the DC remains.', 28);
  S.say(28, 'Your page also marks each follower output as “DC + AC”: the CM level plus the signal. Averaging cancels the signal and keeps the level.');
  S.say(40, 'One more cost to remember (Lec 10 handout): the outputs are now follower gates, so they cannot go below about $V_{GS} + V_{ov}$ — the followers eat some swing.');
});

scene(L10, 'Lecture 10 in one card', 26, (S) => {
  header(S, 'LEC 10 · REMEMBER', 'Everything from Lecture 10');
  remember(S, [
    'Two signals = CM $\\frac{V_1+V_2}{2}$ + DM $V_1 - V_2$. DM moves the outputs oppositely (signal), CM together (no one controls it).',
    '$I_X = I_P - I_N$ flows into $R_P\\parallel R_N$: the output CM drifts to a rail without CMFB.',
    'CMFB = **sense** $V_{out,CM}$ → **compare** with $V_{REF}$ → **correct** a current source. Signal untouched.',
    'Resistive sensing: $V_{out,CM} = \\frac{V_{out1}+V_{out2}}{2}$ (superposition), but $A_v = g_{m1}(r_{O1}\\parallel r_{O3}\\parallel R_1)$.',
    'Follower sensing: no loading, $V_{sense} = V_{out,CM} - V_{GS}$, costs some swing.',
  ], 0.4, 'Lecture 10 · remember');
  S.say(0.4, 'Now every Lecture 10 question: Quiz 2 2024 Q2, the 2024 mid-sem Q1 (Tutorial 5 Q3) in two parts, and Tutorial 5 Q2.');
});

/* ── Lecture 10 past papers ── */
/* Quiz 2 2024 Q2, as printed */
function q24bq2Fig(S) {
  const g = S.g(); const r = S.into(g);
  rail(S, 90, 820, 160);
  const m6 = pmos(S, 170, 220, { name: 'M6', right: true, gl: 40, nameSide: 'l' }); wire(S, [[170, 160], [170, 170]]);
  wire(S, [[170, 270], [170, 330]]); dot(S, 170, 290); wire(S, [[170, 290], [240, 290], [240, 220]]); dot(S, 240, 220);
  isrc(S, 170, 372, { label: '50 µA', left: true, len: 42 }); gnd(S, 170, 414);
  const L = 400, R = 660;
  pmos(S, L, 220, { name: 'M3', gl: 30 }); pmos(S, R, 220, { name: 'M4', gl: 30, right: true });
  wire(S, [[240, 220], [336, 220]]); wire(S, [[L, 160], [L, 170]]); wire(S, [[R, 160], [R, 170]]);
  wire(S, [[240, 196], [500, 196], [500, 186], [760, 186], [760, 220], [724, 220]]);
  wire(S, [[L, 270], [L, 380]]); wire(S, [[R, 270], [R, 380]]); dot(S, L, 310); dot(S, R, 310);
  resh(S, L, 530, 310, { label: 'R' }); resh(S, 530, R, 310, { label: 'R' }); dot(S, 530, 310);
  txt(S, 530, 356, 'V_o,CM', { size: 18, color: C.amb, weight: 700, anchor: 'middle' }); wire(S, [[530, 310], [530, 334]]);
  nmos(S, L, 430, { name: 'M1', gate: 'V_in1' }); nmos(S, R, 430, { name: 'M2', gate: 'V_in2', right: true });
  wire(S, [[L, 480], [L, 510], [R, 510], [R, 480]]); dot(S, 530, 510);
  const m5 = nmos(S, 530, 580, { name: 'M5', gl: 30, right: true, nameSide: 'l' }); wire(S, [[530, 510], [530, 530]]); gnd(S, 530, 630);
  amp(S, 760, 580, { left: true, w: 110, h: 100 });
  wire(S, [[m5.gate[0], 580], [650, 580]]);
  wire(S, [[760, 555], [800, 555]]); txt(S, 808, 561, 'V_o,CM', { size: 18, color: C.amb });
  wire(S, [[760, 605], [800, 605]]); txt(S, 808, 611, 'V_REF', { size: 18, color: C.muted });
  r();
  return g;
}

scene(L10, 'Quiz 2 2024 Q2: VREF, optimum input CM, CM gain for ±1%', 84, (S) => {
  const T = tfm(1, 0, 110);
  pyqFrame(S, {
    paper: 'q24bq2', tag: 'LEC 10 · PAST PAPER 1 OF 4', title: 'Resistive-sensing CMFB: where should everything sit?', src: 'Quiz 2 2024-25 Q2 · 9 marks',
    q: '$A_d = 50$ without the sensing R’s and feedback amp. $2V_{ov1} = V_{ov5}$, $3V_{ov1} = |V_{ov3}|$. Find $V_{REF}$ for a symmetric output swing, the optimum $V_{in,CM}$, and the CM gain allowed if $V_{o,CM}$ may vary by ±1%.',
    giv: '$\\lambda_n = \\lambda_p = 0.2$ V⁻¹, $V_{thn} = 0.4$, $|V_{thp}| = 0.5$ V, $V_{DD} = 1.8$ V', qh: 250,
    tests: 'turning a **gain into an overdrive** ($A_d = 1/(\\lambda V_{ov})$), the **output range from checks** (its middle is $V_{REF}$), the **input-CM range from a check + a fence**, and what “±1%” means for the CM gain.',
    fig: (S2) => { const g = q24bq2Fig(S2); g.setAttribute('transform', 'translate(0 110)'); },
    steps: [
      { t: 8, title: '**Overdrives from the gain.** Equal λ: $A_d = g_{m1}(r_{O1}\\parallel r_{O3}) = \\frac{2I_D}{V_{ov1}}\\cdot\\frac{1}{2\\lambda I_D} = \\frac{1}{\\lambda V_{ov1}}$', tex: stepTex('pyq-q24b-q2', 0), hl: [T([330, 380, 400, 110, C.n])],
        try: { q: 'A<sub>d</sub> = 1/(λV<sub>ov1</sub>) = 50 with λ = 0.2 V⁻¹. What is V<sub>ov1</sub>?', answer: 0.1, unit: 'V', tol: 0.01, hint: 'Vov1 = 1/(λ·Ad).' },
        say: 'The trick: with equal λ, $r_{O1}\\parallel r_{O3} = 1/(2\\lambda I_D)$ and $g_m = 2I_D/V_{ov}$, so the current cancels: $A_d = 1/(\\lambda V_{ov1})$, giving $V_{ov1} = 0.1$ V, $V_{ov5} = 0.2$ V, $|V_{ov3}| = 0.3$ V.' },
      { t: 17, title: '**Output range by checks:** floor = tail + M1 ($V_{ov5} + V_{ov1}$), ceiling = $V_{DD} - |V_{ov3}|$; symmetric swing ⇒ $V_{REF}$ = the middle', tex: stepTex('pyq-q24b-q2', 1), hl: [T([330, 160, 400, 380, C.volt])],
        try: { q: 'Output range [0.3 V, 1.5 V]. For a symmetric swing, V<sub>REF</sub> = ?', answer: 0.9, unit: 'V', tol: 0.01, hint: 'The middle of the range.' },
        say: 'Lowest output: the tail’s and M1’s overdrives, 0.3 V. Highest: $1.8 - 0.3 = 1.5$ V. CMFB holds the CM at $V_{REF}$, so put it in the middle: 0.9 V.' },
      { t: 26, title: '**Input-CM range:** floor = $V_{ov5} + V_{GS1}$ (check + link); ceiling = M1’s fence against its drain at $V_{o,CM}$', tex: stepTex('pyq-q24b-q2', 2), hl: [T([330, 380, 400, 260, C.amb])],
        try: { q: 'Input CM runs from 0.2 + 0.5 V up to 0.9 + 0.4 V. Optimum (middle) V<sub>in,CM</sub>?', answer: 1.0, unit: 'V', tol: 0.01, hint: '(0.7 + 1.3)/2.' },
        say: 'Floor: tail check plus the link up to M1’s gate, $0.2 + 0.5 = 0.7$ V. Ceiling: M1’s drain sits at $V_{o,CM} = 0.9$ V and its gate may be $V_{th}$ above: 1.3 V. The middle, 1.0 V, is the optimum.' },
      { t: 35, title: '**±1%:** $V_{o,CM}$ may move by 2 × 1% × 0.9 V while the input CM sweeps its whole 0.6 V range', tex: stepTex('pyq-q24b-q2', 3),
        try: { q: 'Allowed output-CM change 2 × 0.01 × 0.9 V over an input-CM change of 0.6 V. |A<sub>CM</sub>| = ?', answer: 0.03, unit: 'V/V', tol: 0.02, hint: 'Output change ÷ input change.' },
        say: 'CM gain = output-CM change ÷ input-CM change: $(2\\times0.01\\times0.9)/0.6 = 0.03$. The CMFB loop must make the CM gain at least this small.' },
      { t: 43, ans: true, title: `**Answers:** $V_{REF} = 0.9$ V · $V_{in,CM,opt} = 1.0$ V · $|A_{CM}| \\le 0.03$`, say: 'Pattern for CMFB level questions: overdrives first, output range by checks (middle = $V_{REF}$), input range by check + link and fence (middle = optimum), then CM gain = allowed change ÷ input range.' },
    ],
  });
}, { q: 'Quiz 2 2024 Q2' });

/* 2024 mid-sem Q1 = Tutorial 5 Q3, as printed */
function t5q3Fig(S, sc = 1) {
  const g = S.g(); const r = S.into(g);
  rail(S, 60, 880, 150);
  const m6 = pmos(S, 110, 205, { name: 'M6', right: true, gl: 30, nameSide: 'l' }); wire(S, [[110, 150], [110, 155]]);
  wire(S, [[110, 255], [110, 300]]); dot(S, 110, 275); wire(S, [[110, 275], [170, 275], [170, 205]]); dot(S, 170, 205);
  isrc(S, 110, 340, { label: 'I_1', left: true, len: 40 }); gnd(S, 110, 380);
  const L = 270, R = 450;
  pmos(S, L, 205, { name: 'M3', gl: 30 }); pmos(S, R, 205, { name: 'M4', gl: 30, right: true });
  wire(S, [[170, 205], [206, 205]]); wire(S, [[L, 150], [L, 155]]); wire(S, [[R, 150], [R, 155]]);
  wire(S, [[170, 178], [540, 178], [540, 205], [514, 205]]);
  wire(S, [[L, 255], [L, 350]]); wire(S, [[R, 255], [R, 350]]); dot(S, L, 290); dot(S, R, 290);
  resh(S, L, 360, 290, { label: 'R' }); resh(S, 360, R, 290, { label: 'R' }); dot(S, 360, 290);
  wire(S, [[360, 290], [360, 310]]); txt(S, 360, 332, 'V_O,CM', { size: 16, color: C.amb, weight: 700, anchor: 'middle' });
  nmos(S, L, 400, { name: 'M1', gate: 'V_in1' }); nmos(S, R, 400, { name: 'M2', gate: 'V_in2', right: true });
  wire(S, [[L, 450], [L, 470], [R, 470], [R, 450]]); dot(S, 360, 470);
  const m5 = nmos(S, 360, 540, { name: 'M5', right: true, gl: 40, nameSide: 'l' }); wire(S, [[360, 470], [360, 490]]); gnd(S, 360, 590);
  // error amplifier
  const m12 = pmos(S, 620, 205, { name: 'M12', right: true, gl: 30, nameSide: 'l' }); wire(S, [[620, 150], [620, 155]]);
  wire(S, [[620, 255], [620, 300]]); dot(S, 620, 275); wire(S, [[620, 275], [680, 275], [680, 205]]); dot(S, 680, 205);
  isrc(S, 620, 340, { label: 'I_2', left: true, len: 40 }); gnd(S, 620, 380);
  pmos(S, 780, 205, { name: 'M11', gl: 30 }); wire(S, [[680, 205], [716, 205]]); wire(S, [[780, 150], [780, 155]]);
  wire(S, [[780, 255], [780, 280]]); dot(S, 780, 280); wire(S, [[720, 280], [840, 280], [840, 300]]); wire(S, [[720, 280], [720, 300]]);
  pmos(S, 720, 350, { name: 'M7', gate: 'V_REF', gl: 24 }); pmos(S, 840, 350, { name: 'M8', gate: 'V_O,CM', gl: 24, right: true });
  wire(S, [[720, 400], [720, 490]]); wire(S, [[840, 400], [840, 490]]);
  const m9 = nmos(S, 720, 540, { name: 'M9', right: true, gl: 24, nameSide: 'l' }); dot(S, 720, 470); wire(S, [[720, 470], [764, 470], [764, 540]]);
  nmos(S, 840, 540, { name: 'M10', gl: 24, right: true }); dot(S, 840, 470); wire(S, [[840, 470], [884, 470], [884, 540]]);
  gnd(S, 720, 590); gnd(S, 840, 590);
  wire(S, [[m5.gate[0], 540], [440, 540], [440, 620], [700, 620], [700, 470], [720, 470]]);
  r();
  return g;
}

scene(L10, '2024 mid-sem Q1 (Tutorial 5 Q3), part 1: no CMFB', 80, (S) => {
  const T = tfm(1, 0, 100);
  pyqFrame(S, {
    paper: 'm24q1', tag: 'LEC 10 · PAST PAPER 2 OF 4', title: 'The main amplifier on its own: A_d, A_CM, CMRR', src: 'Mid-sem 2024-25 Q1 = Tutorial 5 Q3 · 20 marks',
    q: '$I_1 = 50\\,\\mu$A, $I_2 = 200\\,\\mu$A, $W/L = 50$ for all, $R = 10$ MΩ. Without CMFB: differential gain, CM gain, optimum $V_{O,CM}$, CMRR.',
    giv: '$V_{DD} = 1.8$ V, $\\mu_nC_{ox} = 100\\,\\mu$, $\\mu_pC_{ox} = 50\\,\\mu$A/V², $\\lambda_p = 0.2$, $\\lambda_n = 0.1$ V⁻¹, $V_{thn} = 0.4$, $|V_{thp}| = 0.5$ V', qh: 240,
    tests: 'mirror currents, the **DM half circuit** (the R midpoint is AC ground), the **CM half circuit** (tail counts as $2r_{O5}$), the output range’s middle, and CMRR = $A_d/|A_{CM}|$.',
    fig: (S2) => { const g = t5q3Fig(S2); g.setAttribute('transform', 'translate(0 100)'); },
    steps: [
      { t: 8, title: '**Currents from the mirrors:** M3, M4 copy $I_1$ (50 µA each), so the tail M5 carries 100 µA; M11 copies $I_2$', tex: stepTex('bank-t5q3', 0), hl: [T([60, 150, 500, 440, C.cur])],
        try: { q: 'M1 carries 50 µA, W/L = 50, µnCox = 100 µA/V². What is g<sub>m1</sub> (mS)?', answer: 7.0711e-4, unit: 'S (type 0.707m)', tol: 0.02, hint: 'gm = √(2·µnCox·W/L·ID).' },
        say: 'Mirrors first: M3, M4 copy 50 µA, so M5 carries 100 µA. $g_{m1} = 0.707$ mS, $r_{O1} = 200$ kΩ, $r_{O3} = r_{O5} = 100$ kΩ.' },
      { t: 17, title: '**$A_d$:** in DM the R midpoint is AC ground, so each output sees $r_{O1}\\parallel r_{O3}\\parallel R$', tex: stepTex('bank-t5q3', 1), hl: [T([250, 270, 220, 60, C.volt])],
        try: { q: 'g<sub>m1</sub> = 0.707 mS, r<sub>O1</sub> = 200 k, r<sub>O3</sub> = 100 k, R = 10 MΩ. A<sub>d</sub> = ?', answer: ans('bank-t5q3', 'ad'), unit: 'V/V', tol: 0.02, hint: '200k ∥ 100k ∥ 10M.' },
        say: 'Lec 10’s cost of resistive sensing shows up here: $A_d = g_{m1}(r_{O1}\\parallel r_{O3}\\parallel R) = 46.8$.' },
      { t: 26, title: '**$A_{CM}$:** in CM no current flows in the R’s; the CM half circuit has $2r_{O5}$ in its source', tex: stepTex('bank-t5q3', 2), hl: [T([300, 490, 140, 110, C.n])],
        try: { q: 'CM half circuit: |A<sub>CM</sub>| = r<sub>O3</sub>/(1/g<sub>m1</sub> + 2r<sub>O5</sub>) with r<sub>O3</sub> = r<sub>O5</sub> = 100 k. = ?', answer: ans('bank-t5q3', 'acm'), unit: 'V/V', tol: 0.02, hint: '100k / (1.414k + 200k).' },
        say: 'In CM both outputs move together, so the R’s carry nothing. Each half sees the tail as $2r_{O5}$: $|A_{CM}| = r_{O3}/(1/g_{m1} + 2r_{O5}) ≈ 0.5$.' },
      { t: 35, title: '**Optimum $V_{O,CM}$:** the middle of the output range [$V_{ov5} + V_{ov1}$, $V_{DD} - |V_{ov3}|$]', tex: stepTex('bank-t5q3', 3), hl: [T([250, 150, 220, 330, C.volt])],
        try: { q: 'Output range [0.3414 V, 1.6 V]. Middle = ?', answer: ans('bank-t5q3', 'vocm'), unit: 'V', tol: 0.01, hint: 'Average the two limits.' },
        say: 'Output floor: tail + M1 overdrives, 0.341 V. Ceiling: $1.8 - |V_{ov3}| = 1.6$ V. Middle: 0.971 V.' },
      { t: 43, title: '**CMRR** without CMFB', tex: stepTex('bank-t5q3', 4),
        try: { q: 'CMRR = A<sub>d</sub>/|A<sub>CM</sub>| = 46.83/0.4965 = ?', answer: ans('bank-t5q3', 'cmrr'), unit: '', tol: 0.02, hint: 'Just divide.' },
        say: 'CMRR = 46.8/0.497 ≈ 94 (39.5 dB). Poor — part 2 adds the CMFB loop.' },
      { t: 51, ans: true, title: `**Part 1 answers:** $A_d = ${fx(ans('bank-t5q3', 'ad'), 4)}$ · $|A_{CM}| = ${fx(ans('bank-t5q3', 'acm'), 4)}$ · $V_{O,CM} = ${fx(ans('bank-t5q3', 'vocm'), 4)}$ V · CMRR $= ${fx(ans('bank-t5q3', 'cmrr'), 3)}$`, say: 'These match the 2024 key. Two half circuits, two different answers: in DM the R midpoint is ground, in CM the R’s are open.' },
    ],
  });
}, { q: 'Mid-sem 2024 Q1 (part 1)' });

scene(L10, '2024 mid-sem Q1 (Tutorial 5 Q3), part 2: with CMFB', 84, (S) => {
  const T = tfm(1, 0, 100);
  pyqFrame(S, {
    paper: 'm24q1', intro: 5, tag: 'LEC 10 · PAST PAPER 3 OF 4', title: 'Close the CM loop: loop gain, new A_CM, new CMRR', src: 'Mid-sem 2024-25 Q1 = Tutorial 5 Q3 · part 2',
    q: 'With the CMFB circuit (M7–M12): the CM gain allowed for ±1% on $V_{O,CM}$, the CM loop gain, the CM gain achieved, and the CMRR with CMFB.',
    qh: 200, tests: 'the **CMFB loop gain** traced around the loop (sense → error amp → tail → back), and **feedback dividing the CM gain by (1 + T)** while $A_d$ stays.',
    fig: (S2) => { const g = t5q3Fig(S2); g.setAttribute('transform', 'translate(0 100)'); },
    steps: [
      { t: 6, title: '**±1% target:** the output CM may move 2 × 1% × $V_{O,CM}$ while the input CM sweeps its whole range', tex: stepTex('bank-t5q3', 5),
        try: { q: '2 × 0.01 × 0.971 V over an input-CM range of 1.37 − 0.741 V. Required |A<sub>CM</sub>| = ?', answer: ans('bank-t5q3', 'target'), unit: 'V/V', tol: 0.03, hint: 'Same method as Quiz 2 Q2.' },
        say: 'Same method as the quiz: allowed output-CM change ÷ input-CM range = 0.031.' },
      { t: 15, title: '**Loop gain:** $\\Delta V_{O,CM}$ → M8 (half the pair’s $g_m$) → diode M9 → M5 ($g_{m5}$) → half per side into $r_{O3}\\parallel R_{dn}$ → back', tex: stepTex('bank-t5q3', 6), hl: [T([560, 150, 340, 450, C.amb]), T([300, 490, 140, 110, C.n])],
        say: 'Trace the loop once round: the output CM change enters M8, the pair passes half its $g_m$ into diode M9 (≈ 971 Ω), M9 drives M5, and M5’s current change splits into the two outputs. Product ≈ 17.' },
      { t: 25, title: '**Feedback divides the CM gain by (1 + T)**; $A_d$ is untouched', tex: stepTex('bank-t5q3', 7),
        try: { q: '|A<sub>CM</sub>| without CMFB = 0.4965, loop gain T = 17.1. With CMFB |A<sub>CM</sub>| = ?', answer: ans('bank-t5q3', 'acmfb'), unit: 'V/V', tol: 0.03, hint: 'Divide by (1 + T).' },
        say: 'Feedback divides the CM gain by $(1 + T)$: $0.497/18.1 = 0.027$. The DM gain is unchanged.' },
      { t: 33, title: '**CMRR with CMFB**', tex: stepTex('bank-t5q3', 8),
        try: { q: 'A<sub>d</sub> = 46.83, |A<sub>CM</sub>| = 0.02743. CMRR = ?', answer: ans('bank-t5q3', 'cmrrfb'), unit: '', tol: 0.03, hint: 'Ad / |ACM|.' },
        say: 'CMRR jumps to about 1700 (64.6 dB). And 0.027 is below the 0.031 allowed, so the ±1% spec is met.' },
      { t: 41, title: '**Note on the key:** it uses $g_{m10} = 0.316$ mS, but $\\sqrt{2\\cdot100\\mu\\cdot50\\cdot100\\mu} = 1$ mS. With 0.316 mS: T = 55.7, $A_{CM} = 0.0088$, CMRR 5373', tex: '',
        say: 'Your key’s loop gain (55.7) comes from a slip in one $g_m$. If the marker insists on the key, quote 55.7 and say why your 17 differs.' },
      { t: 49, ans: true, title: `**Part 2 answers:** $|A_{CM}|_{req} = ${fx(ans('bank-t5q3', 'target'), 3)}$ · $T ≈ ${fx(ans('bank-t5q3', 'loop'), 3)}$ · $|A_{CM}|_{fb} = ${fx(ans('bank-t5q3', 'acmfb'), 3)}$ · CMRR ≈ ${fx(ans('bank-t5q3', 'cmrrfb'), 4)}`, say: 'Write-up: loop gain = product of every gain around the CM loop; closed-loop CM gain = open-loop CM gain ÷ (1 + T); CMRR = $A_d$ ÷ that.' },
    ],
  });
}, { q: 'Mid-sem 2024 Q1 (part 2)' });

/* Tutorial 5 Q2 figure: NMOS-input folded cascode, R1/R2 sensing, error amp driving M3, M4 */
function t5q2Fig(S) {
  const g = S.g(); const r = S.into(g);
  rail(S, 100, 860, 150);
  const L = 470, R = 690;
  pmos(S, L, 205, { right: true, gl: 26 }); pmos(S, R, 205, { gl: 26 }); wire(S, [[L + 56, 205], [R - 56, 205]]);
  wire(S, [[L, 150], [L, 155]]); wire(S, [[R, 150], [R, 155]]);
  wire(S, [[L, 255], [L, 280]]); wire(S, [[R, 255], [R, 280]]); dot(S, L, 268); dot(S, R, 268);
  pmos(S, L, 330, { right: true, gl: 26 }); pmos(S, R, 330, { gl: 26 }); wire(S, [[L + 56, 330], [R - 56, 330]]);
  wire(S, [[L, 380], [L, 460]]); wire(S, [[R, 380], [R, 460]]); dot(S, L, 410); dot(S, R, 410);
  resh(S, L, 580, 410, { label: 'R_1' }); resh(S, 580, R, 410, { label: 'R_2' }); dot(S, 580, 410);
  txt(S, L - 12, 404, 'V_out1', { size: 18, color: C.volt, weight: 700, anchor: 'end' }); txt(S, R + 12, 404, 'V_out2', { size: 18, color: C.volt, weight: 700 });
  nmos(S, L, 510, { right: true, gl: 26 }); nmos(S, R, 510, { gl: 26 }); wire(S, [[L + 56, 510], [R - 56, 510]]);
  wire(S, [[L, 560], [L, 590]]); wire(S, [[R, 560], [R, 590]]);
  const m3 = nmos(S, L, 640, { name: 'M3', right: true, gl: 26, nameSide: 'l' }); const m4 = nmos(S, R, 640, { name: 'M4', gl: 26 });
  wire(S, [[L + 56, 640], [R - 56, 640]]); txt(S, 580, 632, 'V_E', { size: 18, color: C.amb, weight: 700, anchor: 'middle' });
  gnd(S, L, 690); gnd(S, R, 690);
  // input pair at left
  nmos(S, 180, 480, { name: 'M1', gate: 'V_in1' }); nmos(S, 320, 480, { name: 'M2', right: true, gate: 'V_in2' });
  wire(S, [[180, 430], [180, 268], [L, 268]]); wire(S, [[320, 430], [320, 240], [R + 0, 240], [R, 268]]);
  wire(S, [[180, 530], [180, 550], [320, 550], [320, 530]]); isrc(S, 250, 590, { label: 'I_SS', len: 40 }); gnd(S, 250, 630);
  // error amp
  amp(S, 860, 600, { left: true, w: 110, h: 100 });
  wire(S, [[580, 410], [580, 440], [900, 440], [900, 575], [860, 575]]); txt(S, 908, 520, 'V_out,CM', { size: 18, color: C.amb, weight: 700 });
  wire(S, [[860, 625], [900, 625]]); txt(S, 908, 631, 'V_REF', { size: 18, color: C.muted });
  wire(S, [[750, 600], [750, 640], [R + 0, 640]]);
  r();
  return g;
}

scene(L10, 'Tutorial 5 Q2: which pair for the CMFB amplifier, and its loop gain', 66, (S) => {
  const T = tfm(1, 0, 90);
  pyqFrame(S, {
    paper: 't5q2', tag: 'LEC 10 · PAST PAPER 4 OF 4', title: 'Design the CMFB amplifier: PMOS or NMOS pair? Loop gain?', src: 'Tutorial 5 Q2 · Razavi 9.12',
    q: 'The amplifier sensing $V_{out,CM}$ is a differential pair with an active mirror load and drives M3, M4 through $V_E$. (a) PMOS or NMOS input pair? (b) The CMFB loop gain.',
    qh: 200, tests: 'Lec 9’s habit of **matching an amplifier to the levels around it**, and the **CM loop gain** read as sense → amplify → current → resistance.',
    fig: (S2) => { const g = t5q2Fig(S2); g.setAttribute('transform', 'translate(30 140) scale(0.88)'); },
    steps: [
      { t: 8, title: '**(a)** $V_E$ drives the gates of M3, M4 (NMOS, sources on ground): it must sit near $V_{GS3}$ — **low**. A 5-T OTA’s output sits one diode below its mirror’s rail', tex: stepTex('bank-t5q2', 0), hl: [T([400, 590, 360, 110, C.amb])],
        try: { q: 'V<sub>E</sub> must sit low (≈ V<sub>GS3</sub>). A 5-T OTA’s output sits near its mirror’s diode level. Which input pair puts its output low?', choices: ['PMOS input pair (with an NMOS mirror at the bottom)', 'NMOS input pair (with a PMOS mirror at the top)'], answer: 0, hint: 'The mirror sits on the opposite side of the input pair; its diode level is where the output rests.', why: 'NMOS mirror ⇒ output rests near VGS,n — exactly what M3, M4 need.' },
        say: 'Levels decide it. $V_E$ must sit near $V_{GS3}$, close to ground. A PMOS input pair has its NMOS mirror at the bottom, so its output rests near $V_{GS,n}$ — the right level. An NMOS pair’s output would rest near $V_{DD} - |V_{GS,p}|$.' },
      { t: 18, title: '**(b)** Go round the loop: $V_{out,CM}$ → sensing (gain 1) → $A_{EA}$ → $V_E$ → M3, M4 ($g_{m3}$) → current into each output', tex: stepTex('bank-t5q2', 1), hl: [T([560, 400, 360, 260, C.amb])],
        say: 'Break the loop and follow a CM change: the sensor passes it with gain 1, the error amp multiplies by $A_{EA}$, M3, M4 turn it into $g_{m3}A_{EA}$ times that current…' },
      { t: 27, title: 'In CM, R₁ and R₂ carry no current (both ends move together), so each output sees $R_{up}\\parallel R_{down}$', tex: stepTex('bank-t5q2', 2), hl: [T([440, 190, 280, 390, C.volt])],
        try: { q: 'Which is the CMFB loop gain?', choices: ['A<sub>EA</sub> · g<sub>m3</sub> · (R<sub>up</sub> ∥ R<sub>down</sub>)', 'A<sub>EA</sub> · g<sub>m3</sub> · (R<sub>1</sub> + R<sub>2</sub>)', 'A<sub>EA</sub> · (R<sub>up</sub> ∥ R<sub>down</sub>)', 'g<sub>m3</sub> · (R<sub>up</sub> ∥ R<sub>down</sub>)'], answer: 0, hint: 'In CM the R’s carry no current; what resistance does each output see?' },
        say: '…and that current lands on each output, which (for a CM change) sees only the cascodes: $R_{up}\\parallel R_{down}$. Loop gain $T = A_{EA}g_{m3}(R_{up}\\parallel R_{down})$.' },
      { t: 36, ans: true, title: '**Answers:** (a) PMOS input pair · (b) $T_{CM} = A_{EA}\\,g_{m3}\\,(R_{up}\\parallel R_{down})$', say: 'Check the sign too: $V_{out,CM}$ up → $V_E$ up → M3, M4 pull harder → outputs down. Negative feedback, as required.' },
    ],
  });
}, { q: 'Tutorial 5 Q2' });
