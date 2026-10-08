/* Lecture 13: step response, the closed-loop time constant, small vs large step, slewing. */
'use strict';
const L13 = 'Lec 13 · Settling & slewing';

/* the page's model: amplifier A with R_out, divider R1/R2, load C_L */
function ampModel(S) {
  const g = S.g(); const r = S.into(g);
  wire(S, [[200, 382], [300, 382]]); txt(S, 192, 389, 'V_in', { size: 21, color: C.muted, anchor: 'end' });
  amp(S, 300, 410, { w: 130, h: 130, label: 'A' });
  resh(S, 430, 560, 410, { label: 'R_out', lcol: C.n });
  wire(S, [[560, 410], [820, 410]]); dot(S, 640, 410); dot(S, 760, 410); txt(S, 828, 417, 'V_out', { size: 22, color: C.volt, weight: 700 });
  res(S, 640, 410, 520, { label: 'R_1' }); dot(S, 640, 540); res(S, 640, 540, 650, { label: 'R_2' }); gnd(S, 640, 650);
  wire(S, [[640, 520], [640, 540]]);
  cap(S, 760, 410, { label: 'C_L' });
  wire(S, [[640, 540], [260, 540], [260, 442], [300, 442]]);
  S.el('rect', { x: 280, y: 320, width: 300, height: 180, rx: 12, fill: 'none', stroke: C.dim, 'stroke-width': 1.6, 'stroke-dasharray': '6 6' });
  txt(S, 430, 312, 'the op amp', { size: 17, color: C.muted, anchor: 'middle' });
  r(); return g;
}
/* 5-T OTA in the page's non-inverting loop */
function otaLoop(S, o = {}) {
  const g = S.g(); const r = S.into(g);
  rail(S, 260, 720, 170);
  const m3 = pmos(S, 340, 230, { name: 'M3', right: true, gl: 26, nameSide: 'l' }); const m4 = pmos(S, 560, 230, { name: 'M4', gl: 26 });
  wire(S, [[340, 170], [340, 180]]); wire(S, [[560, 170], [560, 180]]);
  wire(S, [[m3.gate[0], 230], [m4.gate[0], 230]]); wire(S, [[340, 280], [340, 380]]); dot(S, 340, 300); wire(S, [[340, 300], [400, 300], [400, 230]]); dot(S, 400, 230);
  wire(S, [[560, 280], [560, 380]]); dot(S, 560, 320); wire(S, [[560, 320], [800, 320]]); txt(S, 808, 327, 'V_out', { size: 22, color: C.volt, weight: 700 });
  nmos(S, 340, 430, { name: 'M1', gate: 'V_in' }); const m2 = nmos(S, 560, 430, { name: 'M2', right: true, gl: 40 });
  wire(S, [[340, 480], [340, 500], [560, 500], [560, 480]]); isrc(S, 450, 545, { label: 'I_SS', len: 45 }); gnd(S, 450, 590);
  dot(S, 680, 320); res(S, 680, 320, 430, { label: 'R_1' }); dot(S, 680, 450); res(S, 680, 450, 560, { label: 'R_2' }); gnd(S, 680, 560); wire(S, [[680, 430], [680, 450]]);
  wire(S, [[m2.gate[0], 430], [640, 430], [640, 450], [680, 450]]); txt(S, 650, 474, 'X', { size: 19, color: C.bad, weight: 750 });
  dot(S, 760, 320); cap(S, 760, 320, { label: 'C_L' });
  r(); return g;
}

scene(L13, 'Your page: the RC step response by Laplace', 70, (S) => {
  header(S, 'LEC 13 · YOUR PAGE, TOP', 'Step in, exponential out — the derivation on your page');
  S.say(0.3, 'Lecture 13 opens with the RC circuit you just met, solved the way your page does it: with the Laplace transform. You only need two table entries.');
  const tb = html(S, 60, 130, 560, 250, `<table class="tbl"><tr><th>in time</th><th>in s</th></tr><tr><td>a step of size $V_0$</td><td>${rt('$V_0/s$')}</td></tr><tr><td>${rt('$e^{-at}$')}</td><td>${rt('$1/(s + a)$')}</td></tr><tr><td>a capacitor</td><td>${rt('impedance $1/(sC)$')}</td></tr></table>`.replace(/\$([^$]+)\$/g, (m) => rt(m)));
  tb.style.opacity = 0; S.slideIn(tb, 2, 0.8);
  S.say(2, 'Laplace turns calculus into algebra: a step of size $V_0$ becomes $V_0/s$; $e^{-at}$ becomes $1/(s+a)$; a capacitor behaves like a resistance $1/(sC)$.');
  const lines = [
    ['\\frac{V_{out}}{V_{in}}(s) = \\frac{1/sC}{1/sC + R} = \\frac{1}{1 + s\\tau}', 9, 'The circuit is a divider: $C$ (as $1/sC$) under $R$. Simplify: $1/(1 + sRC) = 1/(1 + s\\tau)$.'],
    ['V_{out}(s) = \\frac{1}{1+s\\tau}\\cdot\\frac{V_0}{s} = V_0\\left(\\frac{1}{s} - \\frac{\\tau}{1+s\\tau}\\right)', 16, 'Multiply by the step $V_0/s$ and split into two simple fractions (partial fractions: $A = 1$, $B = -\\tau$ on your page).'],
    ['= V_0\\left(\\frac1s - \\frac{1}{s + 1/\\tau}\\right)\\;\\Rightarrow\\; V_{out}(t) = V_0\\left(1 - e^{-t/\\tau}\\right)', 24, 'Each piece is in the table: $1/s$ is the step, $1/(s+1/\\tau)$ is $e^{-t/\\tau}$. The exponential appears.'],
    ['\\frac{dV_{out}}{dt} = \\frac{V_0}{\\tau}e^{-t/\\tau}', 32, 'Differentiate: the slope starts at $V_0/\\tau$ and dies away. Your page calls this a <b>linear amplifier</b> response.'],
  ];
  lines.forEach(([tex, t, say], i) => { eqAt(S, tex, 1100, 190 + i * 115, t, { size: i === 2 ? 25 : 28, w: 860, color: i === 3 ? '#ffd38a' : C.text }); S.say(t, say); });
  const x0 = 120, y0 = 800;
  const ax = axes(S, x0, y0, 520, 330, { x: 't', y: 'V_out' }); S.fade(ax, 36, 0.6);
  [[1, C.volt], [0.66, C.ok], [0.33, C.cur]].forEach(([k, col], i) => tracePlot(S, (t) => k * (1 - Math.exp(-t)), (t) => x0 + t * 85, (v) => y0 - v * 290, 37 + i * 1.5, 42 + i * 1.5, col, 6));
  S.say(37, '<span class="why">“Linear” means:</span> double the step and the whole curve doubles — same shape, same τ, and a starting slope twice as steep. Your page sketches three such curves. Keep that last fact: it is what breaks when the op amp <b>slews</b>.');
});

scene(L13, 'The op amp in a loop: τ = R_out C_L / (1 + βA)', 84, (S) => {
  header(S, 'LEC 13 · YOUR PAGE, MIDDLE', 'Feedback divides the output time constant by (1 + βA)');
  const g = ampModel(S); g.setAttribute('transform', 'translate(-140 0)');
  S.draw(g, 0.3, 2);
  S.say(0.3, 'Your page’s model of a real op amp: an ideal gain $A$ followed by its output resistance $R_{out}$, driving the load $C_L$ and the feedback divider $R_1$, $R_2$.');
  S.say(6, 'The feedback factor is the divider ratio, $\\beta = R_2/(R_1+R_2)$, exactly as in Lecture 1.');
  const lines = [
    ['\\frac{\\left(V_{in} - \\beta V_{out}\\right)A - V_{out}}{R_{out}} = \\frac{V_{out}}{R_1+R_2} + V_{out}\\,sC_L', 10, 'KCL at the output (your page): the current through $R_{out}$ — the amplifier’s voltage minus $V_{out}$, over $R_{out}$ — feeds the divider and the capacitor.'],
    ['R_1 + R_2 \\gg R_{out}:\\quad AV_{in} = V_{out}\\left[1 + \\beta A + sC_LR_{out}\\right]', 18, 'The divider is megohms, $R_{out}$ is kilohms, so drop the divider’s current. Collect $V_{out}$.'],
    ['\\frac{V_{out}}{V_{in}} = \\frac{A}{1+\\beta A}\\cdot\\frac{1}{1 + \\frac{sC_LR_{out}}{1+\\beta A}}', 25, 'Factor out $(1 + \\beta A)$: a DC gain $A/(1+\\beta A)$ times a one-pole factor.'],
    ['\\tau = \\frac{R_{out}C_L}{1+\\beta A},\\qquad V_{out}(t) = V_0\\frac{A}{1+\\beta A}\\left(1 - e^{-t/\\tau}\\right)', 32, 'Read off the time constant: the open-loop $R_{out}C_L$, <b>divided by $(1 + \\beta A)$</b>. Feedback makes the output $(1+\\beta A)$ times faster.'],
  ];
  lines.forEach(([tex, t, say], i) => { eqAt(S, tex, 1130, 180 + i * 105, t, { size: i === 3 ? 26 : 26, w: 820, color: i === 3 ? '#ffd38a' : C.text }); S.say(t, say); });
  whyBox(S, 60, 680, 760, 160, 'Same answer as the foundations chapter: with $A = g_mR_{out}$, $\\frac{R_{out}C_L}{\\beta A} = \\frac{C_L}{\\beta g_m} = \\frac{1}{\\beta\\omega_u}$. Use whichever form the question’s data fits.', 42);
  S.say(42, 'Check it against the foundations: with $A = g_mR_{out}$ this is $C_L/(\\beta g_m) = 1/(\\beta\\omega_u)$. Two forms, one fact — Tutorial 6 uses the $R_{out}C_L/(1+\\beta A)$ form.');
  whyBox(S, 880, 640, 680, 190, '**Closed-loop gain** $A_{CL} = \\frac{A}{1+\\beta A} \\approx \\frac1\\beta$, **final value** $V_0A_{CL}$, **starting slope** $\\frac{V_0A_{CL}}{\\tau}$ — proportional to the step size.', 52);
  S.say(52, 'Three numbers every step question needs: the closed-loop gain, the final value $V_0A_{CL}$, and the starting slope $V_0A_{CL}/\\tau$. Note that the slope grows with the step.');
});

scene(L13, '5-T OTA, small step: why it is linear', 66, (S) => {
  header(S, 'LEC 13 · SMALL STEP', 'A small ΔV steers a little current; the output responds in proportion');
  const g = otaLoop(S); g.setAttribute('transform', 'translate(-120 40)');
  S.fade(g, 0.2, 0.8);
  S.say(0.2, 'Now the real circuit on your page: a 5-T OTA in the same non-inverting loop. $V_{in}$ is on M1’s gate; the divider brings $V_{out}$ back to M2’s gate (node X).');
  S.say(6, 'At rest both sides carry $I_{SS}/2$. Apply a <b>small</b> step $\\Delta V$ between the gates.');
  const lab = (x, y, s2, t, col) => label(S, x, y, s2, t, { size: 19, color: col || C.cur, weight: 700 });
  lab(20, 700, 'M1: I_SS/2 + g_mΔV/2', 10); lab(400, 700, 'M2: I_SS/2 − g_mΔV/2', 10);
  lab(20, 345, 'M3: +g_mΔV/2', 14); lab(470, 250, 'M4 copies: +g_mΔV/2', 14);
  S.flow([[220, 340], [220, 580]], 10, null, { speed: 80, w: 4.5 }); S.flow([[440, 340], [440, 580]], 10, null, { speed: 50, w: 2.4 });
  S.say(10, 'M1 takes $g_m\\Delta V/2$ more; M2 takes $g_m\\Delta V/2$ less (the tail keeps the total fixed).');
  S.say(14, 'The diode M3 and mirror M4 copy M1’s extra current to the output side. At the output: M4 pushes $g_m\\Delta V/2$ more in, M2 pulls $g_m\\Delta V/2$ less out.');
  eqAt(S, 'i_{out} = g_m\\,\\Delta V\\quad\\Rightarrow\\quad V_{out}(s) = g_m\\Delta V\\cdot\\frac{1}{sC_L}', 1140, 300, 20, { size: 30, w: 780 });
  S.say(20, 'Net: $g_m\\Delta V$ flows into the output node (your page writes $V_{out}(s) = g_m\\Delta V/(sC_L)$ for the capacitor alone).');
  whyBox(S, 820, 400, 740, 220, '**Linear:** the output current is **proportional** to ΔV. Bigger step → bigger current → steeper start. As $V_{out}$ rises, the feedback raises X, ΔV shrinks, the current shrinks — the exponential settle of the last scene, with $\\tau = 1/(\\beta\\omega_u)$.', 26);
  S.say(26, 'That proportionality is what “linear” means here. And as the output rises, X rises with it, ΔV shrinks, the current shrinks: the exponential approach with $\\tau = 1/(\\beta\\omega_u)$.');
  S.say(40, 'But $g_m\\Delta V$ cannot grow forever: the pair can never deliver more than its tail current $I_{SS}$. Next scene: what happens when the step is large.');
});

scene(L13, '5-T OTA, large step: slewing', 86, (S) => {
  header(S, 'LEC 13 · LARGE STEP', 'All of I_SS goes into C_L: the output ramps at I_SS / C_L');
  const g = otaLoop(S); g.setAttribute('transform', 'translate(-120 40)');
  S.fade(g, 0.2, 0.8);
  S.say(0.2, 'Same circuit, now a <b>large</b> step. Watch the current in M2 as ΔV grows.');
  // transfer curve
  const x0 = 960, y0 = 440, W2 = 560, H2 = 280;
  const ax = axes(S, x0, y0, W2, H2, { x: 'ΔV', y: 'output current' }); S.fade(ax, 3, 0.6);
  const vov = 0.2;
  const iout = (dv) => { const lim = Math.SQRT2 * vov; if (dv >= lim) return 1; return (dv / (2 * vov * vov)) * Math.sqrt(4 * vov * vov - dv * dv) / 1; };
  const Xd = (dv) => x0 + dv * 1000, Yd = (i) => y0 - i * 240;
  const cv = S.el('polyline', { points: ptsOf(120, 0, 0.5, (dv) => [Xd(dv), Yd(Math.min(1, iout(dv)))]), fill: 'none', stroke: C.cur, 'stroke-width': 3.4 });
  S.draw(cv, 4, 2.5);
  const lin = S.el('line', { x1: Xd(0), y1: Yd(0), x2: Xd(0.24), y2: Yd(0.24 / 0.2), stroke: C.dim, 'stroke-width': 2, 'stroke-dasharray': '6 5' }); S.fade(lin, 6, 0.5);
  const isl = S.el('line', { x1: x0, y1: Yd(1), x2: x0 + W2, y2: Yd(1), stroke: C.amb, 'stroke-width': 1.6, 'stroke-dasharray': '6 6' }); S.fade(isl, 8, 0.5);
  label(S, x0 + W2 - 4, Yd(1) - 10, 'I_SS (all of it)', 8, { size: 18, color: C.amb, anchor: 'end', weight: 700 });
  const vl = S.el('line', { x1: Xd(0.283), y1: y0, x2: Xd(0.283), y2: Yd(1), stroke: C.bad, 'stroke-width': 1.8, 'stroke-dasharray': '4 4' }); S.fade(vl, 12, 0.5);
  label(S, Xd(0.283), y0 + 30, '√2 V_ov: M2 off', 12, { size: 18, color: C.bad, anchor: 'middle', weight: 700 });
  S.say(4, 'For small ΔV the output current grows in proportion (dashed line, $g_m\\Delta V$). But it bends over…');
  S.say(8, '…because it can never exceed $I_{SS}$: once ΔV reaches $\\sqrt2V_{ov}$, M2 is fully <b>off</b> and M1 carries the whole tail current.');
  const off = S.g(); S.el('line', { x1: 410, y1: 440, x2: 470, y2: 500, stroke: C.bad, 'stroke-width': 5 }, off); S.el('line', { x1: 470, y1: 440, x2: 410, y2: 500, stroke: C.bad, 'stroke-width': 5 }, off);
  off.style.opacity = 0; S.fade(off, 16, 0.4);
  label(S, 470, 400, 'M2 off', 16, { size: 21, color: C.bad, weight: 800 });
  S.flow([[220, 340], [220, 580]], 16, null, { speed: 90, w: 6 });
  label(S, 80, 240, 'M3 carries I_SS', 18, { size: 19, color: C.cur, weight: 700 }); label(S, 470, 250, 'M4 copies I_SS → C_L', 18, { size: 19, color: C.cur, weight: 700 });
  S.say(16, 'Now the circuit is current-limited: M1 carries $I_{SS}$, M3 and M4 copy it, and a <b>fixed</b> current $I_{SS}$ flows into $C_L$ — no matter how large the step is.');
  eqAt(S, 'i = C_L\\frac{dV}{dt}\\;\\Rightarrow\\; \\left.\\frac{dV_{out}}{dt}\\right|_{max} = \\frac{I_{SS}}{C_L} = SR', 1240, 540, 24, { size: 30, w: 640, color: '#ffd38a' });
  S.say(24, 'A fixed current into a capacitor — the very first scene of the foundations: a <b>straight ramp</b> at $I_{SS}/C_L$. That maximum slope is the <b>slew rate</b>. Your page: $dv/dt|_{max} = I_{SS}/C_L = 5$ V/µs.');
  // ramp vs exponential
  const px = 960, py = 860;
  const ax2 = axes(S, px, py, 560, 230, { x: 't', y: 'V_out' }); S.fade(ax2, 32, 0.6);
  const ideal = S.el('polyline', { points: ptsOf(120, 0, 6, (t) => [px + t * 90, py - 200 * (1 - Math.exp(-t * 2.2))]), fill: 'none', stroke: C.dim, 'stroke-width': 2.4, 'stroke-dasharray': '6 5' });
  S.draw(ideal, 32, 1.4);
  const rp = S.el('polyline', { points: ptsOf(160, 0, 6, (t) => [px + t * 90, py - 200 * Math.min(1, t < 0.75 ? t * 0.95 : 1 - (1 - 0.7125) * Math.exp(-(t - 0.75) * 2.2))]), fill: 'none', stroke: C.volt, 'stroke-width': 3.4 });
  S.draw(rp, 35, 2);
  label(S, px + 130, py - 120, 'slewing: straight ramp', 35, { size: 18, color: C.volt, weight: 700 });
  label(S, px + 330, py - 210, 'ideal linear (dashed)', 33, { size: 17, color: C.muted });
  S.say(32, 'Compare: the linear response would start much steeper (dashed). The real output can only ramp at the slew rate, then — once the error is small enough for the pair to come out of full steering — it finishes with the normal exponential.');
  whyBox(S, 60, 700, 820, 140, '**Slewing = the op amp has run out of current.** It is a **large-signal** effect: the output becomes a ramp at $SR = I_{max}/C_L$, independent of the step size. For the 5-T OTA $I_{max} = I_{SS}$, in both directions (the mirror copies).', 44);
  S.say(44, '<span class="why">Remember why:</span> slewing happens because the input pair has handed over all the current it has. More step cannot make more current, so the slope is capped at $I_{SS}/C_L$ — up and down for the 5-T OTA.');
});

scene(L13, 'Full steering: why √2·V_ov', 50, (S) => {
  header(S, 'LEC 13 · WHEN IS THE PAIR FULLY STEERED?', 'ΔV_in,min = √2 V_ov (V_ov at balance)');
  const lines = [
    ['\\text{balance: } \\frac{I_{SS}}{2} = \\tfrac12k\\,V_{ov}^2', 0.4, 'At balance each device carries $I_{SS}/2$ with overdrive $V_{ov}$ (k = µC_{ox}W/L).'],
    ['\\text{M1 alone carries } I_{SS}:\\; I_{SS} = \\tfrac12k\\,V_{ov1}^2 \\;\\Rightarrow\\; V_{ov1} = \\sqrt2\\,V_{ov}', 8, 'Fully steered, M1 alone carries $I_{SS}$ — twice the current, so √2 times the overdrive.'],
    ['\\text{M2 just off: } V_{GS2} = V_{th}', 16, 'M2 is just off: its gate is exactly one $V_{th}$ above the shared source.'],
    ['\\Delta V = V_{GS1} - V_{GS2} = (V_{th} + \\sqrt2V_{ov}) - V_{th} = \\sqrt2\\,V_{ov}', 22, 'Subtract: the thresholds cancel. The pair is fully steered once the gate difference reaches $\\sqrt2 V_{ov}$.'],
  ];
  lines.forEach(([tex, t, say], i) => { eqAt(S, tex, 800, 200 + i * 110, t, { size: 32, w: 1300, color: i === 3 ? '#ffd38a' : C.text }); S.say(t, say); });
  whyBox(S, 260, 650, 1080, 160, '**Used in:** Tutorial 6 Q2(b) ($V_{ov} = \\sqrt{2(100\\,\\mu)/4\\,\\text{m}} = 0.224$ V → 0.316 V) and Tutorial 6 Q3(d) ($\\sqrt2\\times0.15 = 0.212$ V). Below this step the pair still has both devices on: the response is (nearly) linear.', 30);
  S.say(30, 'Both slew-rate tutorials ask for this number. Smaller than $\\sqrt2V_{ov}$: both devices conduct and the response is roughly linear. Larger: full slewing.');
});

scene(L13, 'When does it slew, and for how long?', 80, (S) => {
  header(S, 'LEC 13 · THE TIMING', 'Ramp at SR until the exponential can take over');
  const x0 = 100, y0 = 780, U = 118, V = 480;
  const ax = axes(S, x0, y0, 720, 560, { x: 't', y: 'V_out' }); S.fade(ax, 0.3, 0.6);
  const Vf = 1, tau = 0.6, SR = 0.9;
  const tsl = (Vf - SR * tau) / SR;
  const real = (t) => (t < tsl ? SR * t : Vf - SR * tau * Math.exp(-(t - tsl) / tau));
  const X = (t) => x0 + t * U, Y = (v) => y0 - v * V;
  S.el('line', { x1: x0, y1: Y(Vf), x2: x0 + 700, y2: Y(Vf), stroke: C.amb, 'stroke-width': 1.6, 'stroke-dasharray': '6 6' });
  label(S, x0 + 700, Y(Vf) - 10, 'final value V_0A_CL', 1, { size: 18, color: C.amb, anchor: 'end', weight: 700 });
  const lin = S.el('polyline', { points: ptsOf(120, 0, 5.5, (t) => [X(t), Y(Vf * (1 - Math.exp(-t / tau)))]), fill: 'none', stroke: C.dim, 'stroke-width': 2.4, 'stroke-dasharray': '6 5' });
  S.draw(lin, 2, 1.6);
  const tg = S.el('line', { x1: X(0), y1: Y(0), x2: X(tau), y2: Y(Vf), stroke: C.muted, 'stroke-width': 1.6 }); S.fade(tg, 4, 0.5);
  label(S, X(tau) + 14, Y(Vf) + 48, '← linear start: V_0A_CL/τ', 4, { size: 17, color: C.muted });
  S.say(2, 'Dashed: what a perfectly linear op amp would do. It starts with slope $V_0A_{CL}/\\tau$ — and that grows with the step size.');
  const sl = S.el('line', { x1: X(0), y1: Y(0), x2: X(1.0), y2: Y(1.0 * SR), stroke: C.cur, 'stroke-width': 2, 'stroke-dasharray': '3 5' }); S.fade(sl, 9, 0.5);
  label(S, X(1.0) + 12, Y(SR) + 40, 'max slope = SR', 9, { size: 17, color: C.cur, weight: 700 });
  S.say(9, 'The op amp can never go steeper than SR. So the test is a comparison:');
  eqAt(S, '\\text{slews if }\\; \\frac{V_0A_{CL}}{\\tau} > SR \\;\\iff\\; V_0 > V_{0,crit} = \\frac{SR\\,\\tau}{A_{CL}}', 1260, 210, 13, { size: 26, w: 640 });
  S.say(13, 'It slews if the linear starting slope $V_0A_{CL}/\\tau$ would exceed SR — that is, if the step is bigger than $V_{0,crit} = SR\\,\\tau/A_{CL}$ (Tutorial 6 Q1(c)).');
  tracePlot(S, real, X, Y, 20, 30, C.volt, 5.5);
  const tl = S.el('line', { x1: X(tsl), y1: y0, x2: X(tsl), y2: Y(real(tsl)), stroke: C.bad, 'stroke-width': 1.8, 'stroke-dasharray': '4 4' }); S.fade(tl, 26, 0.5);
  label(S, X(tsl), y0 + 30, 't_slew', 26, { size: 19, color: C.bad, anchor: 'middle', weight: 700 });
  S.say(20, 'The real output (blue): a straight ramp at SR… then it bends into the normal exponential.');
  S.say(26, 'When does it switch? When the exponential’s own slope has fallen to SR. An exponential with gap $G$ to go has slope $G/\\tau$, so the switch happens when the remaining gap is $SR\\cdot\\tau$.');
  eqAt(S, 't_{slew} = \\frac{V_0A_{CL} - SR\\,\\tau}{SR}', 1260, 330, 34, { size: 30, w: 640, color: '#ffd38a' });
  S.say(34, 'Ramp at SR from 0 up to $V_0A_{CL} - SR\\tau$: that takes $t_{slew} = (V_0A_{CL} - SR\\tau)/SR$ (Tutorial 6 Q1(d)).');
  eqAt(S, 't_{total} = t_{slew} + \\tau\\ln\\frac{\\text{gap left}}{\\varepsilon\\,V_{final}}', 1260, 430, 40, { size: 28, w: 640, color: '#ffd38a' });
  S.say(40, 'Then settle linearly: the remaining gap decays as $e^{-t/\\tau}$, so add $\\tau\\ln(\\text{gap}/(\\varepsilon V_{final}))$ to reach within ε. That is Tutorial 6 Q2(d).');
  whyBox(S, 1040, 520, 520, 260, '**Exam recipe for any step:** ① $A_{CL}$ and τ (closed loop). ② $SR = I_{max}/C_L$. ③ Compare $V_0A_{CL}/\\tau$ with SR. ④ If it slews: $t_{slew}$, then the exponential for the rest.', 48);
  S.say(48, 'The recipe for every step-response question: closed-loop gain and τ; slew rate; compare; if it slews, ramp time then exponential. Six questions use it next.');
});

scene(L13, 'Lecture 13 in one card', 28, (S) => {
  header(S, 'LEC 13 · REMEMBER', 'Everything from Lecture 13');
  remember(S, [
    'Laplace: step = $V_0/s$, $1/(s+a) \\leftrightarrow e^{-at}$. RC: $V_0(1 - e^{-t/\\tau})$, slope $\\frac{V_0}{\\tau}e^{-t/\\tau}$.',
    'Op amp with $R_{out}$, $C_L$ in a loop: gain $\\frac{A}{1+\\beta A}$, $\\tau = \\frac{R_{out}C_L}{1+\\beta A} = \\frac{1}{\\beta\\omega_u}$.',
    'Small step: output current $g_m\\Delta V$ — **linear**, start slope ∝ step.',
    'Large step: pair fully steered at $\\sqrt2V_{ov}$; all $I_{SS}$ into $C_L$; **SR = $I_{SS}/C_L$**.',
    'Slews if $V_0A_{CL}/\\tau > SR$. $t_{slew} = (V_0A_{CL} - SR\\tau)/SR$, then $\\tau\\ln(\\text{gap}/\\varepsilon V_f)$.',
  ], 0.4, 'Lecture 13 · remember');
  S.say(0.4, 'Now every Lecture 13 question: Razavi Ex 9.2, Problem Set 1 P2, Tutorial 6 Q1 and Q2, Quiz 1 2024 Q2 and Lab 9.');
});

/* ── Lecture 13 questions ── */
scene(L13, 'Razavi Ex 9.2: how fast must the op amp be?', 46, (S) => {
  pyqFrame(S, {
    tag: 'LEC 13 · QUESTION 1 OF 6', title: 'Settle within 1 % in 5 ns', src: 'Razavi Example 9.2',
    q: 'A one-pole op amp is used with a closed-loop gain of 10. The output must settle within 1 % in 5 ns after a small step. Minimum $\\omega_u$ (and $f_u$)?', qh: 200,
    tests: 'settling time $\\tau\\ln(1/\\varepsilon)$ with the closed-loop $\\tau = 1/(\\beta\\omega_u)$.',
    fig: (S2) => { const g = ampModel(S2); g.setAttribute('transform', 'translate(-120 40)'); },
    steps: [
      { t: 6, title: '1 % needs ln(100) = 4.6 time constants', tex: stepTex('bank-ex92', 0), try: { q: 'Within 1 % in 5 ns. Largest allowed τ (ns)?', answer: 5e-9 / Math.log(100), unit: 's (type 1.086n)', tol: 0.02, hint: 'τ = t / ln(100).' }, say: '$e^{-t/\\tau} = 0.01 \\Rightarrow t = 4.6\\tau$, so $\\tau \\le 5\\,\\text{ns}/4.6 = 1.09$ ns.' },
      { t: 14, title: 'Gain 10 ⇒ β = 0.1; τ = 1/(βω_u)', tex: stepTex('bank-ex92', 1), try: { q: 'τ = 1.086 ns and β = 0.1. Minimum ω<sub>u</sub> (Grad/s)?', answer: ans('bank-ex92', 'wu'), unit: 'rad/s (type 9.21G)', tol: 0.02, hint: 'ωu = 1/(βτ).' }, say: '$\\omega_u \\ge 1/(\\beta\\tau) = 9.21$ Grad/s.' },
      { t: 21, title: 'In Hz', tex: stepTex('bank-ex92', 2), say: 'Divide by $2\\pi$: $f_u \\ge 1.47$ GHz.' },
      { t: 27, ans: true, title: '**Answers:** $\\omega_u \\ge 9.21$ Grad/s, $f_u \\ge 1.47$ GHz', say: 'Two lines: ε → number of τ; τ → $\\omega_u$ through β.' },
    ],
  });
}, { q: 'Razavi Ex 9.2' });

scene(L13, 'Problem Set 1 P2: gain error and settling', 54, (S) => {
  pyqFrame(S, {
    tag: 'LEC 13 · QUESTION 2 OF 6', title: 'The P1 op amp in a gain-of-5 loop', src: 'Problem Set 1 P2',
    q: 'The 5-T OTA of P1 ($A = 84.3$, $g_{m1} = 1.26$ mS) in a non-inverting amplifier of gain 5. (a) Static gain error. (b) $A$ needed for 0.5 % error. (c) With $C_L = 2$ pF, the time to settle within 0.1 %.', qh: 230,
    tests: 'Lec 1’s error $1/(1+\\beta A)$, then τ = $1/(\\beta\\omega_u)$ with $\\omega_u = g_m/C_L$, then 6.9τ.',
    fig: (S2) => { const g = otaLoop(S2); g.setAttribute('transform', 'translate(-120 60)'); },
    steps: [
      { t: 6, title: '(a) β = 1/5; ε = 1/(1 + βA)', tex: stepTex('bank-ps1p2', 0), try: { q: 'β = 0.2, A = 84.3. ε = 1/(1 + βA) = ?', answer: ans('bank-ps1p2', 'eps'), unit: '', tol: 0.02, hint: '1/(1 + 16.86).' }, say: '$\\varepsilon = 1/(1 + 0.2\\times84.3) = 5.6$ %.' },
      { t: 13, title: '(b) A ≥ A_closed/ε', tex: stepTex('bank-ps1p2', 1), say: 'For 0.5 %: $A \\ge 5/0.005 = 1000$.' },
      { t: 19, title: '(c) τ = 1/(βω_u), ω_u = g_m1/C_L', tex: stepTex('bank-ps1p2', 2), try: { q: 'g<sub>m1</sub> = 1.26 mS, C<sub>L</sub> = 2 pF, β = 0.2. τ (ns)?', answer: 7.91e-9, unit: 's (type 7.91n)', tol: 0.02, hint: 'ωu = gm/CL = 632 Mrad/s; τ = 1/(βωu).' }, say: '$\\omega_u = 1.26\\,\\text{mS}/2\\,\\text{pF} = 632$ Mrad/s; $\\tau = 1/(0.2\\times632\\text{M}) = 7.91$ ns.' },
      { t: 27, title: '0.1 % needs ln(1000) = 6.91 τ', tex: stepTex('bank-ps1p2', 3), try: { q: 'τ = 7.91 ns. Time to settle within 0.1 % (ns)?', answer: 54.6e-9, unit: 's (type 54.6n)', tol: 0.02, hint: '6.91τ.' }, say: '$6.91\\tau = 54.6$ ns.' },
      { t: 34, ans: true, title: '**Answers:** ε = 5.6 % · $A \\ge 1000$ · $t \\approx 54.6$ ns', say: 'Gain error and settling time come from the same loop gain — first Lec 1, then Lec 13.' },
    ],
  });
}, { q: 'Problem Set 1 P2' });

scene(L13, 'Tutorial 6 Q1: linear settling versus slewing', 90, (S) => {
  pyqFrame(S, {
    paper: 't6q1', tag: 'LEC 13 · QUESTION 3 OF 6', title: 'One op amp, a small step and a big one', src: 'Tutorial 6 Q1',
    q: '$R_1 = 4$ MΩ, $R_2 = 1$ MΩ, $C_L = 8$ pF, $A = 80$ dB, $R_{out} = 50$ kΩ, $I_{max} = 160\\,\\mu$A. (a) $A_{CL}$, τ, $V_{out}$ 1 ns after a 50 mV step. (b) Initial slope. (c) SR and the step above which it slews. (d) For a 1 V step, how long it slews.', qh: 270,
    tests: 'the whole Lec 13 recipe: closed-loop gain and τ, the exponential, the starting slope, SR, the critical step and the slewing time.',
    fig: (S2) => { const g = ampModel(S2); g.setAttribute('transform', 'translate(-120 40)'); },
    steps: [
      { t: 7, title: 'β = R₂/(R₁+R₂) = 0.2; $A_{CL} = A/(1+\\beta A)$ with $A = 10^4$ (80 dB)', tex: stepTex('bank-t6q1', 0), try: { q: 'A = 10⁴, β = 0.2. A<sub>CL</sub> = ?', answer: ans('bank-t6q1', 'acl'), unit: '', tol: 0.005, hint: '10⁴/(1 + 2000).' }, say: '80 dB is $10^4$. $A_{CL} = 10^4/2001 = 4.9975$.' },
      { t: 15, title: 'τ = $R_{out}C_L/(1+\\beta A)$', tex: stepTex('bank-t6q1', 1), try: { q: 'R<sub>out</sub> = 50 kΩ, C<sub>L</sub> = 8 pF, 1 + βA = 2001. τ (ps)?', answer: 2e-10, unit: 's (type 200p)', tol: 0.02, hint: '400 ns / 2001.' }, say: 'Open loop $R_{out}C_L = 400$ ns; divided by 2001: τ = 200 ps.' },
      { t: 23, title: 'Linear step response at 1 ns', tex: stepTex('bank-t6q1', 2), try: { q: 'Final value 0.05 × 4.9975 V, τ = 0.2 ns. V<sub>out</sub> at 1 ns?', answer: ans('bank-t6q1', 'v1'), unit: 'V', tol: 0.01, hint: '0.2499 × (1 − e^(−5)).' }, say: '1 ns is 5τ, so it is within 0.7 %: 0.248 V.' },
      { t: 31, title: '(b) Initial slope = final value / τ', tex: stepTex('bank-t6q1', 3), try: { q: 'Final value 0.2499 V, τ = 200 ps. Initial slope (V/µs)?', answer: ans('bank-t6q1', 'slope'), unit: 'V/s (type 1250M)', tol: 0.02, hint: '0.2499/200p.' }, say: 'Starting slope $V_0A_{CL}/\\tau = 1250$ V/µs.' },
      { t: 39, title: '(c) SR = $I_{max}/C_L$', tex: stepTex('bank-t6q1', 4), try: { q: 'I<sub>max</sub> = 160 µA, C<sub>L</sub> = 8 pF. SR (V/µs)?', answer: ans('bank-t6q1', 'sr'), unit: 'V/s (type 20M)', tol: 0.02, hint: 'µA/pF = V/µs.' }, say: '160 µA / 8 pF = 20 V/µs. So the 50 mV step, needing 1250 V/µs, actually slews!' },
      { t: 47, title: 'Slews when $V_0A_{CL}/\\tau > SR$', tex: stepTex('bank-t6q1', 5), try: { q: 'V<sub>0,crit</sub> = SR·τ/A<sub>CL</sub> with SR = 20 V/µs, τ = 200 ps, A<sub>CL</sub> = 5. (mV)?', answer: ans('bank-t6q1', 'v0c'), unit: 'V (type 0.8m)', tol: 0.02, hint: '20e6 × 200e-12 / 5.' }, say: '$V_{0,crit} = 20\\,\\text{V/µs}\\times200\\,\\text{ps}/5 = 0.8$ mV — anything bigger slews.' },
      { t: 56, title: '(d) Ramp at SR until the gap left is SR·τ', tex: stepTex('bank-t6q1', 6), try: { q: '1 V step → final 4.9975 V. SR·τ = 4 mV. t<sub>slew</sub> (ns)?', answer: ans('bank-t6q1', 'ts'), unit: 's (type 250n)', tol: 0.02, hint: '(4.9975 − 0.004)/20 V/µs.' }, say: '$(4.9975 - 0.004)/20\\,\\text{V/µs} ≈ 250$ ns of pure ramp.' },
      { t: 64, ans: true, title: `**Answers:** $A_{CL} = 4.9975$ · τ = 200 ps · $V_{out}(1\\,\\text{ns}) = 0.248$ V · 1250 V/µs · SR = 20 V/µs · $V_{0,crit} = 0.8$ mV · $t_{slew} = 250$ ns`, say: 'Moral: with a fast loop, even tiny steps hit the slew limit — speed is then set by current, not by τ.' },
    ],
  });
}, { q: 'Tutorial 6 Q1' });

scene(L13, 'Tutorial 6 Q2: a 5-T OTA slews, then settles', 94, (S) => {
  pyqFrame(S, {
    paper: 't6q2', tag: 'LEC 13 · QUESTION 4 OF 6', title: 'Slew, then settle: the full timeline', src: 'Tutorial 6 Q2',
    q: '$I_{SS} = 200\\,\\mu$A, $C_L = 5$ pF, $R_1 = 3$ MΩ, $R_2 = 1$ MΩ, $\\mu_nC_{ox}(W/L)_{1,2} = 4$ mA/V², $|V_A| = 20$ V. (a) SR±. (b) Step that turns M2 off. (c) Slewing time for a 1.2 V step. (d) $R_{out}$, $\\tau_{cl}$, total time to 1 %.', qh: 250,
    tests: 'SR of the 5-T OTA, full steering at $\\sqrt2V_{ov}$, when slewing ends, then linear settling.',
    fig: (S2) => { const g = otaLoop(S2); g.setAttribute('transform', 'translate(-120 60)'); },
    steps: [
      { t: 7, title: '(a) Either way, all of $I_{SS}$ charges or discharges $C_L$ (through the mirror)', tex: stepTex('bank-t6q2', 0), try: { q: 'I<sub>SS</sub> = 200 µA, C<sub>L</sub> = 5 pF. SR (V/µs)?', answer: ans('bank-t6q2', 'sr'), unit: 'V/s (type 40M)', tol: 0.02, hint: 'ISS/CL.' }, say: 'SR+ = SR− = $I_{SS}/C_L$ = 40 V/µs.' },
      { t: 15, title: '(b) Full steering at $\\sqrt2V_{ov}$', tex: stepTex('bank-t6q2', 1), try: { q: 'Balance: 100 µA each, k = 4 mA/V². ΔV<sub>in,min</sub> = √2·V<sub>ov</sub> = ?', answer: ans('bank-t6q2', 'dv'), unit: 'V', tol: 0.01, hint: 'Vov = √(2·100µ/4m) = 0.224 V.' }, say: '$V_{ov} = \\sqrt{2(100\\,\\mu)/4\\,\\text{m}} = 0.224$ V, so 0.316 V.' },
      { t: 23, title: '(c) Slewing ends when X (= βV_out) is within ΔV_in,min of the input', tex: stepTex('bank-t6q2', 2), try: { q: 'β = 0.25, V₀ = 1.2 V, ΔV<sub>min</sub> = 0.316 V, SR = 40 V/µs. t<sub>slew</sub> (ns)?', answer: ans('bank-t6q2', 'ts'), unit: 's (type 88.4n)', tol: 0.03, hint: 'Vout = (1.2 − 0.316)/0.25, then ÷ SR.' }, say: 'The pair stays fully steered until $V_{in} - X = 0.316$ V: $V_{out} = (1.2 - 0.316)/0.25 = 3.54$ V, reached after $3.54/40\\,\\text{V/µs} = 88$ ns.' },
      { t: 32, title: '(d) $R_{out} = r_{O2}\\parallel r_{O4} = (V_A/I_D)/2$', tex: stepTex('bank-t6q2', 3), try: { q: 'V<sub>A</sub> = 20 V, I<sub>D</sub> = 100 µA. R<sub>out</sub> (kΩ)?', answer: ans('bank-t6q2', 'rout'), unit: 'Ω (type 100k)', tol: 0.01, hint: 'rO = VA/ID = 200 k each.' }, say: 'Each $r_O = 200$ kΩ; in parallel 100 kΩ.' },
      { t: 40, title: '$\\tau_{cl} = R_{out}C_L/(1 + \\beta A_0)$, $A_0 = g_mR_{out}$', tex: stepTex('bank-t6q2', 4), try: { q: 'g<sub>m</sub> = 0.894 mS, R<sub>out</sub> = 100 k, C<sub>L</sub> = 5 pF, β = 0.25. τ<sub>cl</sub> (ns)?', answer: ans('bank-t6q2', 'tau'), unit: 's (type 21.4n)', tol: 0.03, hint: 'A₀ = 89.4; 500 ns/(1 + 22.4).' }, say: '$A_0 = 89.4$, $1 + \\beta A_0 = 23.4$; $\\tau = 500\\,\\text{ns}/23.4 = 21.4$ ns.' },
      { t: 49, title: 'Linear settling of what is left, to 1 % of the final value', tex: stepTex('bank-t6q2', 5), try: { q: 'Final ≈ 4.59 V, at t<sub>slew</sub> V<sub>out</sub> = 3.54 V, τ = 21.4 ns, 1 %. Total time (ns)?', answer: ans('bank-t6q2', 'total'), unit: 's (type 156n)', tol: 0.03, hint: '88.4 + 21.4·ln(1.05/0.0459).' }, say: 'Gap 1.05 V must shrink to 1 % of 4.59 V: $21.4\\,\\text{ns}\\times\\ln(1.05/0.0459) = 67$ ns. Total ≈ 156 ns.' },
      { t: 58, ans: true, title: `**Answers:** SR = 40 V/µs · ΔV = 0.316 V · $t_{slew}$ = 88 ns · $R_{out}$ = 100 kΩ · $\\tau_{cl}$ = 21.4 ns · total ≈ 156 ns`, say: 'Two phases, two formulas: current-limited ramp, then exponential. Slewing usually dominates for big steps.' },
    ],
  });
}, { q: 'Tutorial 6 Q2' });

scene(L13, 'Quiz 1 2024 Q2: size the OTA from a slew rate', 60, (S) => {
  pyqFrame(S, {
    paper: 'q24aq2', tag: 'LEC 13 · QUESTION 5 OF 6', title: 'Slew rate sets the tail current', src: 'Quiz 1 2024-25 Q2 · 6 marks',
    q: 'Same 5-T OTA as Q1 ($(W/L)_5 = 15/1$ tail, mirror reference M6 = 7.5/1 carrying $I_1$; $\\lambda = 0.1$ for both types at these lengths). With $C_L = 2$ pF the slew rate is 10 V/µs. Find $I_1$, the bandwidth, the GBW and the power.', qh: 260,
    tests: 'SR = $I_{SS}/C_L$ backwards, mirror ratios, bandwidth $1/(2\\pi R_{out}C_L)$ vs GBW $g_m/(2\\pi C_L)$.',
    fig: (S2) => { const g = otaLoop(S2); g.setAttribute('transform', 'translate(-120 60)'); },
    steps: [
      { t: 7, title: '$I_{SS} = SR\\cdot C_L$; the tail mirrors $I_1$ with ratio 15/7.5', tex: stepTex('pyq-q24a-q2', 0), try: { q: 'SR = 10 V/µs, C<sub>L</sub> = 2 pF. I<sub>SS</sub> = ? Then I<sub>1</sub> = I<sub>SS</sub>·7.5/15 (µA)?', answer: ans('pyq-q24a-q2', 'i1'), unit: 'A (type 10u)', tol: 0.02, hint: 'ISS = 20 µA.' }, say: '$I_{SS} = 10\\,\\text{V/µs}\\times2\\,\\text{pF} = 20\\,\\mu$A; the tail is twice M6, so $I_1 = 10\\,\\mu$A.' },
      { t: 16, title: 'Bandwidth = the output pole, $R_{out} = r_{O2}\\parallel r_{O4}$ at 10 µA', tex: stepTex('pyq-q24a-q2', 1), try: { q: 'r<sub>O</sub> = 1/(0.1·10µ) = 1 MΩ each, C<sub>L</sub> = 2 pF. f<sub>−3dB</sub> (kHz)?', answer: ans('pyq-q24a-q2', 'bw'), unit: 'Hz (type 159k)', tol: 0.02, hint: '1/(2π·500k·2p).' }, say: '$R_{out} = 1\\,\\text{M}\\parallel1\\,\\text{M} = 500$ kΩ; $f_{-3dB} = 159$ kHz.' },
      { t: 25, title: 'GBW = $g_{m1}/(2\\pi C_L)$', tex: stepTex('pyq-q24a-q2', 2), try: { q: 'g<sub>m1</sub> = √(2·100µ·15·10µ) = 0.173 mS, C<sub>L</sub> = 2 pF. GBW (MHz)?', answer: ans('pyq-q24a-q2', 'gbw'), unit: 'Hz (type 13.8M)', tol: 0.02, hint: 'gm/(2πCL).' }, say: 'GBW = 0.173 mS/(2π·2 pF) = 13.8 MHz — about 87 times the bandwidth, i.e. the DC gain.' },
      { t: 33, title: 'Power = $V_{DD}(I_1 + I_{SS})$', tex: stepTex('pyq-q24a-q2', 3), say: '1.8 V × 30 µA = 54 µW.' },
      { t: 39, ans: true, title: '**Answers:** $I_1 = 10\\,\\mu$A · BW = 159 kHz · GBW = 13.8 MHz · P = 54 µW', say: 'Keep bandwidth (uses $R_{out}$) and GBW (uses only $g_m$) apart — this quiz asks both.' },
    ],
  });
}, { q: 'Quiz 1 2024 Q2' });

scene(L13, 'Lab 9: specs for a two-stage buffer', 56, (S) => {
  pyqFrame(S, {
    tag: 'LEC 13 · QUESTION 6 OF 6', title: 'Gain error, rise time and slew rate as numbers', src: 'Lab 9 (hand calculations)',
    q: 'A two-stage Miller OTA as a unity-gain buffer: gain error ≤ 0.05 %, 10–90 % rise time ≤ 70 ns, SR = 5 V/µs, $C_L = 5$ pF, $C_c = 0.5C_L$. Minimum DC gain (ratio, dB), τ, the required $f_u$ and the first-stage current.', qh: 240,
    tests: 'Lec 1 error, rise time 2.2τ, τ = $1/\\omega_u$ for a buffer, and SR = $I/C$ for the capacitor the slewing current charges.',
    fig: (S2) => { const g = S2.g(); const r = S2.into(g); amp(S2, 380, 420, { w: 150, h: 150, label: 'A' }); wire(S2, [[260, 382], [380, 382]]); txt(S2, 250, 389, 'V_in', { size: 21, color: C.muted, anchor: 'end' }); wire(S2, [[530, 420], [700, 420]]); dot(S2, 620, 420); wire(S2, [[620, 420], [620, 560], [340, 560], [340, 458], [380, 458]]); txt(S2, 708, 427, 'V_out', { size: 22, color: C.volt, weight: 700 }); dot(S2, 680, 420); cap(S2, 680, 420, { label: 'C_L' }); txt(S2, 480, 610, 'buffer: β = 1', { size: 21, color: C.amb, anchor: 'middle', weight: 700 }); r(); },
    steps: [
      { t: 6, title: 'Buffer error ≈ 1/A', tex: stepTex('bank-lab9', 0), try: { q: 'Error ≤ 0.05 % for a buffer. Minimum A?', answer: 2000, unit: '', tol: 0.01, hint: 'A ≥ 1/0.0005.' }, say: '$A \\ge 1/0.0005 = 2000$, i.e. 66 dB.' },
      { t: 13, title: 'Rise time = 2.2τ', tex: stepTex('bank-lab9', 2), try: { q: 'Rise time ≤ 70 ns. τ (ns)?', answer: 70e-9 / 2.2, unit: 's (type 31.8n)', tol: 0.02, hint: 'τ = tr/2.2.' }, say: 'τ = 70/2.2 = 31.8 ns.' },
      { t: 20, title: 'Buffer: β = 1, so τ = 1/ω_u', tex: stepTex('bank-lab9', 3), try: { q: 'τ = 31.8 ns, β = 1. f<sub>u</sub> = 1/(2πτ) (MHz)?', answer: ans('bank-lab9', 'fu'), unit: 'Hz (type 5M)', tol: 0.02, hint: '1/(2π·31.8n).' }, say: '$f_u = 1/(2\\pi\\tau) = 5$ MHz.' },
      { t: 27, title: 'Slewing current charges $C_c$ (Miller op amp, Lec 17): SR = $I_{B1}/C_c$', tex: stepTex('bank-lab9', 4), try: { q: 'SR = 5 V/µs, C<sub>c</sub> = 2.5 pF. I<sub>B1</sub> (µA)?', answer: ans('bank-lab9', 'ib1'), unit: 'A (type 12.5u)', tol: 0.02, hint: 'I = SR × C.' }, say: 'Same $i = C\\,dv/dt$, but in a Miller op amp the first-stage current slews $C_c$: $I_{B1} = 5\\,\\text{V/µs}\\times2.5\\,\\text{pF} = 12.5\\,\\mu$A.' },
      { t: 34, ans: true, title: '**Answers:** A ≥ 2000 (66 dB) · τ = 31.8 ns · $f_u$ = 5 MHz · $I_{B1}$ = 12.5 µA', say: 'Each spec maps to one formula you now know.' },
    ],
  });
}, { q: 'Lab 9' });
