/* Lecture 7: two-stage op amps; gain boosting, the idea and the two attempts. */
'use strict';
const L7 = 'Lec 7 · Two stages & boosting';

/* the simple two-stage op amp of your Lec 7 page (circuit 1). Returns node coordinates. */
function twoStage1(S, o = {}) {
  const g = S.g();
  const r = S.into(g);
  rail(S, 300, 1310, 170);
  // stage 1: loads M3, M4 (PMOS, Vb1), pair M1, M2, tail M9
  const m3 = pmos(S, 660, 230, { name: 'M3', right: true, gl: 26 });
  const m4 = pmos(S, 940, 230, { name: 'M4', gl: 26 });
  wire(S, [[m3.gate[0], 230], [m4.gate[0], 230]]);
  txt(S, 800, 222, 'V_b1', { size: 19, color: C.muted, anchor: 'middle' });
  wire(S, [[660, 170], [660, 180]]); wire(S, [[940, 170], [940, 180]]);
  const m1 = nmos(S, 660, 420, { name: 'M1', gate: 'V_in1' });
  const m2 = nmos(S, 940, 420, { name: 'M2', gate: 'V_in2', right: true });
  wire(S, [[660, 280], [660, 370]]); wire(S, [[940, 280], [940, 370]]);
  wire(S, [[660, 470], [660, 500], [940, 500], [940, 470]]);
  const m9 = nmos(S, 800, 560, { name: 'M9', gate: 'V_b2' });
  wire(S, [[800, 500], [800, 510]]); gnd(S, 800, 610);
  dot(S, 660, 330); dot(S, 940, 330); dot(S, 800, 500);
  txt(S, 676, 324, 'X', { size: 22, color: C.bad, weight: 750 }); txt(S, 924, 324, 'Y', { size: 22, color: C.bad, weight: 750, anchor: 'end' });
  // stage 2: PMOS CS M5, M6 with NMOS sources M7, M8
  const m5 = pmos(S, 400, 230, { name: 'M5', right: true, gl: 26, nameSide: 'l' });
  const m6 = pmos(S, 1200, 230, { name: 'M6', gl: 26, nameSide: 'r' });
  wire(S, [[400, 170], [400, 180]]); wire(S, [[1200, 170], [1200, 180]]);
  wire(S, [[m5.gate[0], 230], [520, 230], [520, 330], [660, 330]]);
  wire(S, [[m6.gate[0], 230], [1080, 230], [1080, 330], [940, 330]]);
  const m7 = nmos(S, 400, 480, { name: 'M7', gate: 'V_b' });
  const m8 = nmos(S, 1200, 480, { name: 'M8', gate: 'V_b', right: true });
  wire(S, [[400, 280], [400, 430]]); wire(S, [[1200, 280], [1200, 430]]);
  gnd(S, 400, 530); gnd(S, 1200, 530);
  dot(S, 400, 360); dot(S, 1200, 360);
  wire(S, [[400, 360], [320, 360]]); wire(S, [[1200, 360], [1280, 360]]);
  txt(S, 312, 352, 'V_out1', { size: 21, color: C.volt, weight: 700, anchor: 'end' });
  txt(S, 1288, 352, 'V_out2', { size: 21, color: C.volt, weight: 700 });
  r();
  return { g, X: [660, 330], Y: [940, 330], out1: [400, 360], out2: [1200, 360] };
}

scene(L7, 'Lectures 7–12: the plan', 14, (S) => {
  titleCard(S, 'LECTURES 7 – 12', 'More gain, without losing swing', 'two stages · gain boosting · boosters · common-mode feedback', ['Lec 7 two stages', 'Lec 8 boosting', 'Lec 9 boosters', 'Lec 10 CMFB', 'Lec 11–12 sensing']);
  S.say(0.3, 'Lectures 7 to 12 answer one question: <b>how do we get a big gain and a big output swing at the same time?</b>');
  S.say(7, 'Every scene says <span class="why">why</span> we do something before <b>how</b>. Orange “your turn” stops wait for your answer.');
});

scene(L7, 'Where Lec 6 left you: gain or swing', 46, (S) => {
  header(S, 'LEC 7 · THE PROBLEM', 'A telescopic gives gain, but eats the swing');
  // column on the left
  const col = S.g();
  const r = S.into(col);
  rail(S, 250, 470, 180);
  const xs = 360;
  pmos(S, xs, 240, { name: 'M8', gate: 'V_b4' }); pmos(S, xs, 340, { name: 'M6', gate: 'V_b3' });
  nmos(S, xs, 460, { name: 'M4', gate: 'V_b2' }); nmos(S, xs, 560, { name: 'M2', gate: 'V_in' });
  isrc(S, xs, 680, { label: 'tail' });
  wire(S, [[xs, 180], [xs, 190]]); wire(S, [[xs, 290], [xs, 290]]); wire(S, [[xs, 390], [xs, 410]]); wire(S, [[xs, 510], [xs, 510]]); wire(S, [[xs, 610], [xs, 638]]);
  gnd(S, xs, 722);
  dot(S, xs, 400); wire(S, [[xs, 400], [470, 400]]); txt(S, 480, 407, 'V_out', { size: 22, color: C.volt, weight: 700 });
  r();
  S.draw(col, 0.4, 2.2);
  S.say(0.3, 'Lec 3–6 built one-stage op amps. The telescopic cascode has a huge gain, about $(g_mr_O)^2/2$ ≈ 1250 with $g_mr_O = 50$.');
  // tower beside it: blocks slide as Vout moves
  const sc = 300, yb = 760, x0 = 700;
  const tw = S.g();
  const blocks = [['tail', 0.2], ['M2', 0.2], ['M4', 0.2], ['M6', 0.2], ['M8', 0.2]];
  txt(S, x0 + 46, 150, 'its column as a tower (V_DD = 1.8 V)', { size: 21, color: C.muted, anchor: 'middle' }, tw);
  const rects = {};
  // fixed blocks: tail, M2 at bottom; M8 at top; M4 and M6 stretch with V_out
  const mk = (name, st) => { const rr = S.el('rect', { x: x0, width: 92, rx: 4, fill: TST[st][0], stroke: TST[st][1], 'stroke-width': 2 }, tw); const t = txt(S, x0 + 46, 0, name, { size: 20, color: TST[st][1], weight: 750, anchor: 'middle' }, tw); rects[name] = { rr, t }; };
  ['tail', 'M2', 'M4', 'M6', 'M8'].forEach((n) => mk(n, 'min'));
  const vo = txt(S, x0 + 120, 0, 'V_out', { size: 21, color: C.volt, weight: 700 }, tw);
  const vline = S.el('line', { x1: x0 - 10, x2: x0 + 110, stroke: C.volt, 'stroke-width': 3, 'stroke-dasharray': '6 5' }, tw);
  S.fade(tw, 4, 0.8);
  // V_out(t): rest 1.0 V, then sweep to top (1.4) and bottom (0.6)
  const vAt = (t) => { if (t < 12) return 1.0; if (t < 17) return lerp(1.0, 1.4, E.inout(clamp((t - 12) / 4, 0, 1))); if (t < 24) return lerp(1.4, 0.6, E.inout(clamp((t - 18) / 5, 0, 1))); return lerp(0.6, 1.0, E.inout(clamp((t - 26) / 3, 0, 1))); };
  S.anim(0, 1e4, 'tw', (_p, t) => {
    const v = vAt(t);
    const lay = [['tail', 0, 0.2], ['M2', 0.2, 0.4], ['M4', 0.4, v], ['M6', v, 1.6], ['M8', 1.6, 1.8]];
    lay.forEach(([n, a, b]) => {
      const y1 = yb - b * sc, y2 = yb - a * sc;
      rects[n].rr.setAttribute('y', y1); rects[n].rr.setAttribute('height', y2 - y1);
      rects[n].t.setAttribute('y', (y1 + y2) / 2 + 7);
      const sq = b - a <= 0.2001 && (n === 'M4' || n === 'M6');
      rects[n].rr.setAttribute('fill', sq ? TST.sq[0] : (b - a > 0.21 ? TST.ok[0] : TST.min[0]));
      rects[n].rr.setAttribute('stroke', sq ? TST.sq[1] : (b - a > 0.21 ? TST.ok[1] : TST.min[1]));
      rects[n].t.setAttribute('fill', sq ? TST.sq[1] : (b - a > 0.21 ? TST.ok[1] : TST.min[1]));
    });
    vline.setAttribute('y1', yb - v * sc); vline.setAttribute('y2', yb - v * sc);
    vo.setAttribute('y', yb - v * sc + 7); vo.textContent = ''; richText(vo, `V_out = ${v.toFixed(2)} V`, 21);
  }, E.lin);
  S.say(4.2, 'Read the tower: <b>one block per transistor, its height = the voltage across it</b>. Every block needs at least its $V_{ov}$ (0.2 V).');
  S.say(12, 'Push $V_{out}$ up: the block above it (M6) shrinks until it is squeezed to 0.2 V. That is the ceiling, 1.4 V.');
  S.say(18, 'Pull $V_{out}$ down: now M4 is squeezed, at 0.6 V. Five blocks of 0.2 V leave only <b>0.8 V</b> of the 1.8 V for the output.');
  const q = whyBox(S, 1000, 300, 540, 280, '**The trade-off.** Stacking devices multiplies the gain by $g_mr_O$ each time, but **every stacked device takes a $V_{ov}$ block away from the swing**. One stage cannot be best at both.', 26);
  S.say(26.5, '<span class="why">So the question of Lecture 7:</span> can we keep the big gain and still let the output swing nearly rail to rail?');
  const a = whyBox(S, 1000, 610, 540, 150, '**Razavi’s answer:** split the jobs between **two stages**.', 36);
  S.say(36.5, 'Answer: give the two jobs to two different stages. One makes the gain, the other makes the swing.');
});

scene(L7, 'What a “stage” is', 40, (S) => {
  header(S, 'LEC 7 · BUILDING BLOCK', 'One stage = an input device + one high-resistance node');
  const g = S.g();
  const r = S.into(g);
  rail(S, 420, 760, 200);
  isrc(S, 600, 280, { label: 'load' });
  wire(S, [[600, 200], [600, 238]]);
  const m = nmos(S, 600, 470, { name: 'M1', gate: 'v_in', gl: 60 });
  wire(S, [[600, 322], [600, 420]]);
  gnd(S, 600, 520);
  dot(S, 600, 370); wire(S, [[600, 370], [730, 370]]); txt(S, 740, 378, 'v_out', { size: 24, color: C.volt, weight: 700 });
  r();
  S.draw(g, 0.3, 1.8);
  S.say(0.3, 'Strip any amplifier down to its core. An <b>input transistor</b> turns the input voltage into a current…');
  const f = S.flow([[600, 330], [600, 520]], 4, null, { speed: 70 });
  const ar = arrow(S, 660, 430, 660, 520, { color: C.cur }); S.fade(ar, 4.5, 0.5);
  label(S, 672, 486, 'g_m v_in', 4.5, { size: 24, color: C.cur, weight: 700 });
  S.say(4.5, '…a small-signal current $g_mv_{in}$. Then that current has to go somewhere: into the <b>output node</b>.');
  // R_out picture
  const rp = S.g();
  const r2 = S.into(rp);
  wire(S, [[1000, 300], [1000, 330]]);
  S.el('polygon', { points: '1000,340 1016,360 1000,380 984,360', fill: 'none', stroke: C.cur, 'stroke-width': 2.8 });
  arrow(S, 1000, 348, 1000, 374, { color: C.cur, w: 2.4, head: 9 });
  wire(S, [[1000, 390], [1000, 440]]);
  wire(S, [[1000, 300], [1180, 300]]);
  res(S, 1180, 300, 440, { label: 'R_out', lcol: C.n });
  wire(S, [[1000, 440], [1180, 440]]); gnd(S, 1090, 440);
  dot(S, 1180, 300); txt(S, 1196, 296, 'v_out', { size: 24, color: C.volt, weight: 700 });
  txt(S, 1030, 366, 'G_m v_in', { size: 22, color: C.cur, weight: 700 });
  r2();
  S.fade(rp, 10, 0.9);
  S.say(10, 'Seen from the output, every amplifier is this: a current $G_mv_{in}$ pushed into the resistance $R_{out}$ at the output node.');
  eqAt(S, 'A_v = \\frac{v_{out}}{v_{in}} = G_m\\,R_{out}', 1090, 560, 15, { size: 46 });
  S.say(15, 'So the gain is always <b>$G_m$ times $R_{out}$</b>. Keep this line: it explains everything in Lectures 7–9.');
  whyBox(S, 860, 640, 640, 170, '**A stage** = one input device + one high-resistance node. Gain = $G_m \\times R_{out}$ of that node. Every high-resistance node also makes **one pole**.', 22);
  S.say(22.5, 'A “stage” is exactly that: one input device and one high-resistance node. Each such node also carries a capacitance, so it makes one pole (it slows the amplifier down).');
  S.say(31, 'The 5-T OTA, the telescopic and the folded cascode were all <b>one</b> stage. Now we chain two of them.');
});

scene(L7, 'The two-stage op amp (circuit 1)', 66, (S) => {
  header(S, 'LEC 7 · YOUR PAGE, CIRCUIT 1', 'Stage 1 for gain, stage 2 for swing');
  const c = twoStage1(S);
  S.draw(c.g, 0.4, 3);
  S.say(0.4, 'Your first circuit. In the middle: a differential pair M1, M2 with PMOS current-source loads M3, M4 and tail M9 — the familiar one-stage amplifier.');
  S.halo(560, 150, 480, 500, C.red, 5, null, 'A₁ · stage 1');
  S.say(5, 'That middle part is <b>stage 1</b> (your red loop). Its outputs are nodes X and Y.');
  eqAt(S, 'A_1 = g_{m1,2}\\,(r_{O1,2}\\parallel r_{O3,4})', 800, 712, 9, { size: 36 });
  S.say(9, 'Its gain: the pair’s $g_m$ times the resistance at X, which is $r_{O1}$ looking down in parallel with $r_{O3}$ looking up.');
  S.halo(270, 150, 250, 450, C.green, 16, null, 'A₂');
  S.halo(1080, 150, 250, 450, C.green, 16, null, 'A₂');
  S.say(16, 'Now the new part (green loops). X drives the gate of <b>M5</b>, a PMOS common-source device with an NMOS current source M7 below it. Same on the right with M6, M8.');
  S.say(23, 'That is <b>stage 2</b>: one transistor and one current source between the rails. Its output is $V_{out1}$ (and $V_{out2}$).');
  eqAt(S, 'A_2 = g_{m5,6}\\,(r_{O5,6}\\parallel r_{O7,8})', 800, 770, 27, { size: 36 });
  S.say(27, 'Stage 2’s gain is read the same way: $g_{m5}$ times $r_{O5}$ in parallel with $r_{O7}$. Only about $g_mr_O/2$ — modest.');
  eqAt(S, 'A = A_1 \\times A_2', 800, 835, 33, { size: 40, color: '#ffd38a' });
  S.say(33, 'Two stages in a chain: stage 1 amplifies by $A_1$, then stage 2 amplifies that again by $A_2$. <b>Gains multiply</b>: $A = A_1A_2$.');
  S.flow([[660, 380], [660, 330], [520, 330], [520, 230], [470, 230]], 40, null, { color: C.volt, speed: 50 });
  S.flow([[400, 280], [400, 360], [320, 360]], 41, null, { color: C.volt, speed: 50 });
  S.say(40, 'Follow a signal: a tiny $v_{in}$ becomes $A_1v_{in}$ at X, which is M5’s gate, and stage 2 multiplies it again at $V_{out1}$.');
  const sw = html(S, 1340, 600, 236, 230, `<div class="whybox" style="font-size:18px">${rt('With $g_mr_O = 50$:<br>$A_1 ≈ 25$, $A_2 ≈ 25$<br>**$A ≈ 625$**, and the output column has only two devices.')}</div>`);
  sw.style.opacity = 0; S.slideIn(sw, 48, 0.7);
  S.say(48, 'With $g_mr_O = 50$ each stage gives about 25, so the whole op amp gives about 625 — and the output still sits in a two-device column.');
  S.say(57, '<span class="why">Why this matters:</span> the gain came from multiplying stages, not from stacking devices in the output column.');
});

scene(L7, 'Why stage 2 can swing (and why gain comes first)', 52, (S) => {
  header(S, 'LEC 7 · WHY IT WORKS', 'Count the blocks in each output column');
  const sc = 300, yb = 760;
  txt(S, 380, 160, 'telescopic output column', { size: 22, color: C.muted, anchor: 'middle' });
  const a = tower(S, 334, yb, [{ v: 0.2, name: 'tail' }, { v: 0.2, name: 'M2' }, { v: 0.2, name: 'M4' }, { v: 0.8, name: 'room', st: 'room', note: '0.8 V' }, { v: 0.2, name: 'M6' }, { v: 0.2, name: 'M8' }], sc, { nodes: ['0', '', '', '0.6', '1.4', '', '1.8'] });
  S.fade(a, 0.3, 0.8);
  txt(S, 760, 160, 'stage 2: a CS stage', { size: 22, color: C.muted, anchor: 'middle' });
  const b = tower(S, 714, yb, [{ v: 0.2, name: 'M7' }, { v: 1.4, name: 'room', st: 'room', note: '1.4 V' }, { v: 0.2, name: 'M5' }], sc, { nodes: ['0', '0.2', '1.6', '1.8'] });
  S.fade(b, 5, 0.8);
  S.say(0.3, 'Same 1.8 V supply, same 0.2 V per block. The telescopic output column holds <b>five</b> blocks: only 0.8 V is left for the output.');
  S.say(5, 'Stage 2 is a common-source stage: <b>two</b> blocks, one device to each rail. Its output can swing 1.4 V, from 0.2 V to 1.6 V.');
  S.say(11, '<span class="why">That is the whole trick:</span> the output that has to swing far sits in a short column, so it gets almost the full supply.');
  // block diagram from the page
  const bd = S.g();
  const r = S.into(bd);
  wire(S, [[960, 330], [1040, 330]]); txt(S, 950, 338, 'V_in', { size: 22, color: C.muted, anchor: 'end' });
  S.el('rect', { x: 1040, y: 280, width: 210, height: 100, rx: 12, fill: 'rgba(248,113,113,0.08)', stroke: C.red, 'stroke-width': 2.4 });
  txt(S, 1145, 322, 'High-gain', { size: 22, color: C.red, weight: 700, anchor: 'middle' }); txt(S, 1145, 352, 'amplifier', { size: 22, color: C.red, weight: 700, anchor: 'middle' });
  wire(S, [[1250, 330], [1310, 330]]);
  S.el('rect', { x: 1310, y: 280, width: 210, height: 100, rx: 12, fill: 'rgba(74,222,128,0.08)', stroke: C.green, 'stroke-width': 2.4 });
  txt(S, 1415, 322, 'High-swing', { size: 22, color: C.green, weight: 700, anchor: 'middle' }); txt(S, 1415, 352, 'amplifier', { size: 22, color: C.green, weight: 700, anchor: 'middle' });
  wire(S, [[1520, 330], [1570, 330]]); txt(S, 1560, 310, 'V_out', { size: 22, color: C.volt, weight: 700, anchor: 'end' });
  r();
  S.fade(bd, 17, 0.8);
  S.say(17, 'Your page draws it as two blocks: a <b>high-gain amplifier</b> followed by a <b>high-swing amplifier</b>.');
  // signal sizes
  const s1 = sine(S, 1060, 1230, 470, 6, { color: C.volt, cycles: 2 }); S.draw(s1, 24, 1.2);
  const s2 = sine(S, 1330, 1500, 470, 60, { color: C.volt, cycles: 2 }); S.draw(s2, 26, 1.2);
  label(S, 1145, 560, 'stage-1 output: a few mV', 24, { size: 19, color: C.red, anchor: 'middle' });
  label(S, 1415, 560, 'final output: about 1 V', 26, { size: 19, color: C.green, anchor: 'middle' });
  S.say(24, '<span class="why">Why this order?</span> The big signal only exists at the final output. Stage 1’s output moves by just $V_{out}/A_2$ — a few millivolts…');
  S.say(31, '…so stage 1 can afford a tall, cramped stack of cascodes (lots of gain, little room). Stage 2 gets the short column because it must make the big swing.');
  whyBox(S, 960, 610, 600, 190, '**Rule:** put the gain where the signal is small, and the swing where the signal is big. Swap the stages and the cramped stage would have to make the big swing.', 38);
  S.say(38, 'Swap them, and the cramped stage would have to make the big swing — exactly what we were trying to avoid.');
});

/* circuit 2: telescopic first stage + PMOS CS second stage */
function twoStage2(S, o = {}) {
  const g = S.g(); const r = S.into(g);
  rail(S, 300, 1310, 160);
  const L = 660, R = 940;
  const m7 = pmos(S, L, 220, { name: 'M7', right: true, gl: 26 }); const m8 = pmos(S, R, 220, { name: 'M8', gl: 26 });
  wire(S, [[m7.gate[0], 220], [m8.gate[0], 220]]); txt(S, 800, 212, 'V_b3', { size: 18, color: C.muted, anchor: 'middle' });
  const m5 = pmos(S, L, 320, { name: 'M5', right: true, gl: 26 }); const m6 = pmos(S, R, 320, { name: 'M6', gl: 26 });
  wire(S, [[m5.gate[0], 320], [m6.gate[0], 320]]); txt(S, 800, 312, 'V_b2', { size: 18, color: C.muted, anchor: 'middle' });
  const m3 = nmos(S, L, 460, { name: 'M3', right: true, gl: 26 }); const m4 = nmos(S, R, 460, { name: 'M4', gl: 26 });
  wire(S, [[m3.gate[0], 460], [m4.gate[0], 460]]); txt(S, 800, 452, 'V_b1', { size: 18, color: C.muted, anchor: 'middle' });
  const m1 = nmos(S, L, 570, { name: 'M1', gate: 'V_in1' }); const m2 = nmos(S, R, 570, { name: 'M2', gate: 'V_in2', right: true });
  [[L, 160, 170], [R, 160, 170], [L, 370, 410], [R, 370, 410], [L, 510, 520], [R, 510, 520]].forEach(([x, a, b]) => wire(S, [[x, a], [x, b]]));
  wire(S, [[L, 620], [L, 650], [R, 650], [R, 620]]);
  isrc(S, 800, 700, { label: 'I_SS', len: 50 }); wire(S, [[800, 650], [800, 650]]); gnd(S, 800, 750);
  dot(S, L, 390); dot(S, R, 390);
  txt(S, L - 14, 384, 'X', { size: 22, color: C.bad, weight: 750, anchor: 'end' }); txt(S, R + 14, 384, 'Y', { size: 22, color: C.bad, weight: 750 });
  // stage 2
  const m9 = pmos(S, 400, 390, { name: 'M9', right: true, gl: 40, nameSide: 'l' });
  const m10 = pmos(S, 1200, 390, { name: 'M10', gl: 40, nameSide: 'r' });
  wire(S, [[400, 160], [400, 340]]); wire(S, [[1200, 160], [1200, 340]]);
  wire(S, [[m9.gate[0], 390], [L, 390]]); wire(S, [[m10.gate[0], 390], [R, 390]]);
  if (o.single) {
    const a = nmos(S, 400, 640, { name: 'M11', right: true, gl: 30, nameSide: 'l' }); const b = nmos(S, 1200, 640, { name: 'M12', gl: 30 });
    wire(S, [[400, 440], [400, 590]]); wire(S, [[1200, 440], [1200, 590]]);
    wire(S, [[400, 560], [470, 560], [470, 640]]); dot(S, 400, 560); dot(S, 470, 640);
    wire(S, [[a.gate[0], 640], [470, 640], [470, 800], [1130, 800], [1130, 640], [b.gate[0], 640]]);
    gnd(S, 400, 690); gnd(S, 1200, 690);
    dot(S, 1200, 510); wire(S, [[1200, 510], [1280, 510]]); txt(S, 1288, 517, 'V_out', { size: 22, color: C.volt, weight: 700 });
  } else {
    const m11 = nmos(S, 400, 620, { name: 'M11', gate: 'V_b4' }); const m12 = nmos(S, 1200, 620, { name: 'M12', gate: 'V_b4', right: true });
    wire(S, [[400, 440], [400, 570]]); wire(S, [[1200, 440], [1200, 570]]); gnd(S, 400, 670); gnd(S, 1200, 670);
    dot(S, 400, 510); dot(S, 1200, 510);
    wire(S, [[400, 510], [320, 510]]); wire(S, [[1200, 510], [1280, 510]]);
    txt(S, 312, 502, 'V_out1', { size: 21, color: C.volt, weight: 700, anchor: 'end' }); txt(S, 1288, 502, 'V_out2', { size: 21, color: C.volt, weight: 700 });
  }
  r();
  return { g };
}

scene(L7, 'Telescopic first stage + CS second stage (circuit 2)', 70, (S) => {
  header(S, 'LEC 7 · YOUR PAGE, CIRCUIT 2', 'Make stage 1 a telescopic: even more gain');
  const c = twoStage2(S);
  S.draw(c.g, 0.3, 3);
  S.say(0.3, 'Your second circuit. The middle is now a full <b>telescopic cascode</b> (M1–M8): input pair, NMOS cascodes M3, M4, PMOS cascodes M5, M6 and PMOS sources M7, M8.');
  S.halo(540, 140, 520, 640, C.red, 6, null, 'stage 1 (gain)');
  S.halo(290, 300, 220, 420, C.green, 9, null, 'stage 2');
  S.halo(1090, 300, 220, 420, C.green, 9, null, 'stage 2');
  S.say(6, 'Stage 1’s outputs X and Y drive the gates of <b>M9, M10</b>: PMOS common-source devices loaded by NMOS current sources M11, M12. That is stage 2.');
  // look up / look down at X
  const up = arrow(S, 588, 360, 588, 190, { color: C.p }); S.fade(up, 14, 0.5); S.out(up, 30, 0.5);
  const dn = arrow(S, 588, 396, 588, 560, { color: C.n }); S.fade(dn, 17, 0.5); S.out(dn, 30, 0.5);
  const cu = chip(S, 470, 752, '↑ look up from X: g_m5 r_O5 r_O7', { color: C.p, size: 19 }); cu.style.opacity = 0; S.pop(cu, 14); S.out(cu, 30, 0.5);
  const cd = chip(S, 1130, 752, '↓ look down from X: g_m3 r_O3 r_O1', { color: C.n, size: 19 }); cd.style.opacity = 0; S.pop(cd, 17); S.out(cd, 30, 0.5);
  S.say(14, 'Gain of stage 1, the usual two looks from X: looking <b>up</b> you see the PMOS cascode, $g_{m5}r_{O5}r_{O7}$…');
  S.say(17, '…looking <b>down</b> you see the NMOS cascode, $g_{m3}r_{O3}r_{O1}$. The input current $g_{m1}v_{in}$ meets the two in parallel.');
  eqAt(S, 'A_1 = g_{m1}\\left[g_{m5}r_{O5}r_{O7}\\parallel g_{m3}r_{O3}r_{O1}\\right]', 800, 812, 21, { size: 32 });
  eqAt(S, 'A_2 = g_{m9}(r_{O9}\\parallel r_{O11})', 800, 860, 26, { size: 32 });
  S.say(26, 'Stage 2 is read the same way: $A_2 = g_{m9}(r_{O9}\\parallel r_{O11})$. With $g_mr_O = 50$: $A_1 ≈ 1250$, $A_2 ≈ 25$, so $A ≈ 31\\,000$.');
  // the link that sets X
  const lk = S.g();
  wire(S, [[400, 175], [470, 175], [470, 375]], { color: C.volt, w: 2.6, dash: '7 6' }, lk);
  arrow(S, 470, 360, 470, 386, { color: C.volt, w: 2.6, head: 10 }, lk);
  S.fade(lk, 33, 0.6); S.out(lk, 58, 0.5);
  const lb = chip(S, 300, 120, 'X = V_DD − |V_GS9|  (a link)', { color: C.volt, size: 20 }); lb.style.opacity = 0; S.pop(lb, 34); S.out(lb, 58, 0.5);
  S.ring(660, 390, 18, C.volt, 33, 58);
  S.say(33, '<span class="why">A detail the tutorials ask (Tutorial 3 Q2, Q3):</span> what DC voltage sits at X? X is <b>M9’s gate</b>, and M9’s source is $V_{DD}$.');
  S.say(40, 'M9 carries a fixed current, so its $|V_{GS9}|$ is fixed. That is a <b>link</b>: $X = V_{DD} - |V_{GS9}|$. Stage 2 decides where stage 1’s output sits.');
  S.say(48, 'Then check stage 1 still fits at that level: the devices between X and the rails must each keep their $V_{ov}$ block.');
  S.say(56, 'Next: what does chaining two high-resistance nodes cost us?');
});

scene(L7, 'The price: two poles', 42, (S) => {
  header(S, 'LEC 7 · YOUR BODE SKETCH', 'Every high-resistance node adds a pole');
  const x0 = 260, y0 = 640;
  const ax = axes(S, x0, y0, 900, 470, { x: 'log ω', y: '|A| (dB)' }); S.fade(ax, 0.3, 0.6);
  const zero = S.el('line', { x1: x0, y1: 520, x2: x0 + 880, y2: 520, stroke: C.dim, 'stroke-width': 1.6, 'stroke-dasharray': '5 6' });
  label(S, x0 + 890, 526, '0 dB (gain 1)', 0.8, { size: 18, color: C.muted, anchor: 'end' });
  const one = curve(S, (x) => (x < 520 ? 300 : 300 + (x - 520) * 0.62), x0, x0 + 840, { color: C.volt });
  S.draw(one, 3, 1.6);
  label(S, 300, 336, 'one stage: one pole, −20 dB/dec', 3, { size: 20, color: C.volt });
  const two = curve(S, (x) => (x < 520 ? 230 : x < 720 ? 230 + (x - 520) * 0.62 : 230 + 200 * 0.62 + (x - 720) * 1.24), x0, x0 + 840, { color: C.green });
  S.draw(two, 9, 1.8);
  label(S, 300, 214, 'two stages: higher DC gain, then −40 dB/dec', 9, { size: 20, color: C.green });
  S.say(0.3, 'Your page sketches two Bode plots. Gain in dB against frequency.');
  S.say(3, 'One stage: one high-resistance node, so <b>one pole</b>. Past it the gain falls at 20 dB per decade, and the phase lag stops at 90°.');
  S.say(9, 'Two stages: X and $V_{out}$ are both high-resistance nodes, each with its capacitance. The DC gain is higher, but there are <b>two poles</b>: −20, then −40 dB/decade.');
  const ph = whyBox(S, 1180, 200, 380, 300, '**Each pole adds up to 90° of phase lag.** Two poles can approach **180°** — and an amplifier with 180° lag inside a feedback loop can oscillate.', 17);
  S.say(17, '<span class="why">Why it matters:</span> each pole adds up to 90° of lag. With two, the lag heads to 180° before the gain drops to 1 — inside a feedback loop that rings or oscillates.');
  whyBox(S, 1180, 530, 380, 200, 'Fix (Lec 16–17): **compensation** — a capacitor across stage 2 that splits the poles apart.', 27);
  S.say(27, 'So two-stage op amps always need <b>compensation</b> (Lec 17). For now remember: more gain and more swing, paid for with a second pole.');
});

scene(L7, 'One output: the mirror trick (circuit 3)', 50, (S) => {
  header(S, 'LEC 7 · YOUR PAGE, CIRCUIT 3', 'Single-ended output: M11 becomes a diode, M12 copies it');
  const c = twoStage2(S, { single: true });
  S.draw(c.g, 0.2, 2.5);
  S.say(0.2, 'Same op amp, but now we want <b>one</b> output instead of two.');
  S.ring(400, 560, 16, C.amb, 4.5, 12); S.ring(1200, 640, 16, C.amb, 4.5, 12);
  S.say(4.5, 'M11 becomes a <b>diode</b> (gate tied to drain) and M12 shares its gate: a current mirror, exactly as in the 5-T OTA.');
  // currents
  S.flow([[400, 440], [400, 690]], 12, null, { speed: 70 });
  label(S, 380, 470, '+i', 12, { size: 24, color: C.cur, weight: 800, anchor: 'end' });
  S.flow([[1200, 510], [1200, 690]], 16, null, { speed: 70 });
  label(S, 1250, 600, 'M12 copies: +i out', 16, { size: 21, color: C.cur, weight: 700 });
  label(S, 1250, 440, 'M10 pushes i less in', 21, { size: 21, color: C.cur, weight: 700 });
  S.say(12, 'Follow a signal. The left CS device M9 carries $+i$ more; that current goes into the diode M11…');
  S.say(16, '…and M12 copies it, pulling $+i$ more <b>out</b> of the output. Meanwhile M10, driven the opposite way, pushes $i$ <b>less</b> in.');
  S.say(21, 'Both changes move $V_{out}$ the same way: the two halves <b>add</b>. One output, full differential gain — nothing wasted.');
  whyBox(S, 900, 815, 660, 80, 'Same idea as the 5-T OTA: the **diode turns a current into a gate voltage**, the mirror **copies it** to the other side.', 27);
  S.say(27, 'Remember the mirror’s job in one line: the diode turns a current into a gate voltage, the mirror copies it to the other side, and the halves add.');
});

scene(L7, 'Gain boosting: which factor can grow?', 56, (S) => {
  header(S, 'LEC 7 · GAIN BOOSTING', 'A_v = G_m × R_out: G_m is stuck, R_out is not');
  eqAt(S, 'A_v = G_m \\times R_{out}', 800, 190, 0.3, { size: 58 });
  const g1 = chip(S, 690, 280, 'very hard to improve', { color: C.bad, size: 20 }); g1.style.opacity = 0; S.pop(g1, 3);
  const g2 = chip(S, 960, 280, 'needs to be improved', { color: C.ok, size: 20 }); g2.style.opacity = 0; S.pop(g2, 7);
  S.say(0.3, 'A new idea to get gain. Start from the one line you know: $A_v = G_m\\times R_{out}$.');
  S.say(3, '$G_m$ is the input device’s $g_m = 2I_D/V_{ov}$. More of it needs more current (power) or a smaller overdrive: your page says <b>“very hard to improve”</b>.');
  S.say(7, '$R_{out}$ is different — your page says <b>“needs to be improved”</b>. We already know one way: stack cascodes.');
  // the stack from the page
  const st = S.g(); const r = S.into(st);
  const x = 520;
  nmos(S, x, 700, { name: 'M1', gate: 'V_in' }); nmos(S, x, 590, { name: 'M2', gate: 'V_b' }); nmos(S, x, 480, { name: 'M3', gate: 'V_b2' });
  wire(S, [[x, 640], [x, 650]]); wire(S, [[x, 530], [x, 540]]); wire(S, [[x, 380], [x, 430]]); gnd(S, x, 750);
  dot(S, x, 400); wire(S, [[x, 400], [620, 400]]); txt(S, 630, 407, 'V_out', { size: 21, color: C.volt, weight: 700 });
  r();
  S.fade(st, 11, 0.8);
  const steps = [['r_{O1}', 760, 14], ['g_{m2}r_{O2}\\,r_{O1}', 645, 18], ['g_{m3}r_{O3}\\,g_{m2}r_{O2}\\,r_{O1}', 535, 22]];
  steps.forEach(([tex, y, t]) => { const a = arrow(S, 700, y - 50, 700, y - 4, { color: C.n, w: 2.6 }); S.fade(a, t, 0.4); eqAt(S, tex, 720, y - 28, t, { size: 30, anchor: 'start', w: 600 }); });
  S.say(11, 'Your page’s stack: looking into M1’s drain you see $r_{O1}$…');
  S.say(14, '…put M2 on top and it multiplies that by $g_{m2}r_{O2}$ (“up multiplies”)…');
  S.say(18, '…add M3 and it multiplies again: $g_{m3}r_{O3}\\,g_{m2}r_{O2}\\,r_{O1}$. Each cascode gives another factor of about 50.');
  // tower cost
  const tw = tower(S, 1260, 760, [{ v: 0.2, name: 'M1' }, { v: 0.2, name: 'M2' }, { v: 0.2, name: 'M3', st: 'sq' }, { v: 1.2, name: 'room', st: 'room' }], 300, { w: 86 });
  S.fade(tw, 26, 0.8);
  label(S, 1240, 640, 'each cascode =', 26, { size: 19, color: C.bad, anchor: 'end' }); label(S, 1240, 664, 'one more block', 26, { size: 19, color: C.bad, anchor: 'end' });
  S.say(26, 'But each stacked cascode adds another $V_{ov}$ block to the output column — the swing problem again.');
  whyBox(S, 560, 790, 640, 90, '**Gain boosting:** get that ×50 multiplication **without stacking** another device.', 33);
  S.say(33, '<span class="why">So Razavi asks:</span> can we get that multiplication of $R_{out}$ <b>without</b> stacking another device? That is <b>gain boosting</b>.');
  S.say(42, 'Your page tries two ways. The first fails — and seeing why it fails makes the second one obvious.');
});

/* a device with R_S under its source, optionally with an amplifier */
scene(L7, 'Attempt 1: an amplifier in front of the gate', 70, (S) => {
  header(S, 'LEC 7 · ATTEMPT 1', 'Boost G_m by amplifying the input first?');
  // left: simple version
  const a = S.g(); const r = S.into(a);
  wire(S, [[150, 330], [190, 330]]); txt(S, 140, 338, 'V_in', { size: 21, color: C.muted, anchor: 'end' });
  const A = amp(S, 190, 330, { label: 'A₁', pm: false, w: 86, h: 80 });
  wire(S, [[276, 330], [316, 330]]);
  nmos(S, 360, 330, { name: 'M1', gl: 24 });
  wire(S, [[360, 280], [360, 230], [440, 230]]); txt(S, 448, 236, 'I_out', { size: 20, color: C.cur, weight: 700 });
  gnd(S, 360, 380);
  r();
  S.draw(a, 0.3, 1.4);
  eqAt(S, 'I_{out} = g_m A_1 V_{in}\\;\\Rightarrow\\; \\frac{I_{out}}{V_{in}} = A_1g_m', 320, 480, 2.5, { size: 30, w: 560 });
  S.say(0.3, 'The obvious idea: put an amplifier $A_1$ in front of the gate. The transistor now sees $A_1V_{in}$…');
  S.say(2.5, '…so $I_{out}/V_{in} = A_1g_m$. It looks as if $G_m$ went up by $A_1$!');
  // right: with RS and rO2
  const b = S.g(); const r2 = S.into(b);
  wire(S, [[700, 330], [740, 330]]); txt(S, 690, 338, 'V_in', { size: 21, color: C.muted, anchor: 'end' });
  amp(S, 740, 330, { label: 'A₁', pm: false, w: 86, h: 80 });
  wire(S, [[826, 330], [866, 330]]);
  nmos(S, 910, 330, { name: 'M2', gl: 24 });
  wire(S, [[910, 280], [910, 230], [990, 230]]); txt(S, 998, 236, 'I_out', { size: 20, color: C.cur, weight: 700 });
  res(S, 980, 280, 380, { label: 'r_O2', lcol: C.n }); wire(S, [[910, 270], [980, 270], [980, 280]]); wire(S, [[980, 380], [980, 392], [910, 392]]);
  res(S, 910, 392, 490, { label: 'R_S' }); gnd(S, 910, 490);
  r();
  S.draw(b, 7, 1.6);
  S.say(7, 'Now be honest about the transistor: it has its own $r_{O2}$, and below its source sits a resistance $R_S$ (in a cascode that is the input device’s $r_O$).');
  const lines = [
    ['I_o = (A_1V_{in} - I_{out}R_S)\\,g_{m2}', 12, 'The gate sees $A_1V_{in}$, but the source has risen by $I_{out}R_S$. The current source inside M2 gives $g_{m2}$ times $V_{GS}$.'],
    ['I_{out} = I_o\\,\\frac{r_{O2}}{r_{O2}+R_S}', 19, 'Part of that current leaks back through $r_{O2}$: a current divider leaves $I_o\\,r_{O2}/(r_{O2}+R_S)$ at the output.'],
    ['I_{out}\\left[1 + \\frac{g_{m2}r_{O2}R_S}{r_{O2}+R_S}\\right] = A_1V_{in}\\,g_{m2}\\frac{r_{O2}}{r_{O2}+R_S}', 26, 'Put the first line into the second and collect every $I_{out}$ on the left.'],
    ['\\frac{I_{out}}{V_{in}} = \\frac{A_1\\,g_{m2}r_{O2}}{r_{O2}+R_S+g_{m2}r_{O2}R_S}', 33, 'Solve. This is your page’s last line.'],
  ];
  lines.forEach(([tex, t, say], i) => { eqAt(S, tex, 1100, 560 + i * 72, t, { size: i === 2 ? 25 : 30, w: 980 }); S.say(t, say); });
  const fac = whyBox(S, 50, 560, 520, 290, '**Factor it:** $A_1 \\times \\frac{g_{m2}r_{O2}}{r_{O2}+R_S+g_{m2}r_{O2}R_S}$. The second factor is just the **ordinary degenerated transistor**, ≈ $1/R_S$. The transistor is **not** better; $A_1$ is simply another amplifier in front of it.', 40);
  S.say(40, '<span class="why">Read it carefully:</span> it is $A_1$ times the plain degenerated transistor, about $1/R_S$. The transistor did not get any better.');
  S.say(48, '$A_1$ is just an extra amplifier in front — a separate stage. And $R_{out}$ at the output is unchanged. Your page’s verdict: <b>“No improvement.”</b>');
  const ni = chip(S, 1340, 860, 'No improvement', { color: C.bad, size: 24 }); ni.style.opacity = 0; S.pop(ni, 48);
  S.say(57, 'Lesson: boosting the <b>input side</b> is the wrong place. The amplifier must fight the <b>output</b> resistance instead.');
});

scene(L7, 'Attempt 2: the amplifier watches the source', 88, (S) => {
  header(S, 'LEC 7 · ATTEMPT 2 (THE ONE THAT WORKS)', 'Boost R_out: the amplifier holds the source still');
  // plain degenerated device first
  const p0 = S.g(); const r0 = S.into(p0);
  nmos(S, 260, 330, { name: 'M2', gate: 'V_b' });
  wire(S, [[260, 280], [260, 230]]); res(S, 260, 380, 480, { label: 'R_S' }); gnd(S, 260, 480);
  arrow(S, 300, 250, 300, 290, { color: C.n, w: 2.4, head: 10 }); txt(S, 310, 262, 'R_out', { size: 20, color: C.n, weight: 700 });
  r0();
  S.draw(p0, 0.3, 1.2);
  eqAt(S, 'R_{out} = R_S + r_O + g_mR_Sr_O', 280, 560, 2, { size: 30, w: 500 });
  S.say(0.3, 'First recall a plain device with $R_S$ under its source (your page): looking into its drain you see $R_S + r_O + g_mR_Sr_O$ — the cascode formula.');
  // boosted circuit with test source
  const c = S.g(); const r1 = S.into(c);
  const x = 980;
  gnd(S, 620, 420); wire(S, [[620, 420], [620, 380], [660, 380]]); txt(S, 610, 372, 'V_b (AC 0)', { size: 18, color: C.muted, anchor: 'end' });
  const A = amp(S, 660, 400, { label: 'A₁', w: 110, h: 110 });
  wire(S, [[770, 400], [900, 400]]); txt(S, 800, 388, 'gate', { size: 18, color: C.muted });
  const m = nmos(S, x, 400, { name: 'M2', gl: 46 });
  wire(S, [[x, 350], [x, 250], [1120, 250], [1120, 300]]);
  S.el('circle', { cx: 1120, cy: 330, r: 26, fill: C.bg, stroke: C.amb, 'stroke-width': 2.6 });
  txt(S, 1120, 324, '+', { size: 22, color: C.amb, anchor: 'middle', weight: 800 }); txt(S, 1120, 350, '−', { size: 22, color: C.amb, anchor: 'middle', weight: 800 });
  txt(S, 1156, 338, 'V_X', { size: 22, color: C.amb, weight: 700 });
  wire(S, [[1120, 356], [1120, 600]]); gnd(S, 1120, 600);
  wire(S, [[x, 450], [x, 500]]); dot(S, x, 480);
  wire(S, [[x, 480], [620, 480], [620, 428], [660, 428]]);
  res(S, x, 500, 600, { label: 'R_S' }); gnd(S, x, 600);
  txt(S, x + 16, 474, 'source', { size: 18, color: C.muted });
  r1();
  S.draw(c, 9, 2.2);
  S.say(9, 'Now the working idea: an amplifier $A_1$ <b>watches the source</b> (its − input) and drives the <b>gate</b>. To find $R_{out}$, kill the input and push a test voltage $V_X$ into the drain.');
  // test current
  S.flow([[1120, 304], [1120, 250], [x, 250], [x, 600]], 16, null, { speed: 60 });
  label(S, 1050, 240, 'I_X', 16, { size: 22, color: C.cur, weight: 800 });
  S.say(16, 'A current $I_X$ flows in. Everything is about how hard M2 fights it.');
  // gauges
  const gx = 1260, gy = 420;
  const gauge = (i, name, col) => {
    const xx = gx + i * 100;
    S.el('rect', { x: xx, y: gy - 150, width: 50, height: 300, rx: 10, fill: '#121926', stroke: '#2a3546' });
    S.el('line', { x1: xx - 6, y1: gy, x2: xx + 56, y2: gy, stroke: C.dim, 'stroke-width': 2 });
    txt(S, xx + 25, gy + 186, name, { size: 19, color: col, anchor: 'middle', weight: 700 });
    const bar = S.el('rect', { x: xx + 8, y: gy, width: 34, height: 0, rx: 6, fill: col });
    return bar;
  };
  const gS = gauge(0, 'source', C.volt), gG = gauge(1, 'gate', C.amb), gV = gauge(2, 'V_GS', C.cur);
  const setBar = (b, v) => { b.setAttribute('y', v >= 0 ? gy - v : gy); b.setAttribute('height', Math.abs(v)); };
  S.anim(22, 3, 'gs', (p) => setBar(gS, 30 * p)); S.anim(26, 3, 'gg', (p) => setBar(gG, -120 * p)); S.anim(30, 3, 'gv', (p) => setBar(gV, -150 * p));
  label(S, gx + 25, gy - 175, '+I_{X}R_{S}', 22, { size: 19, color: C.volt, anchor: 'middle', weight: 700 });
  label(S, gx + 125, gy + 214, '−A_{1}I_{X}R_{S}', 26, { size: 19, color: C.amb, anchor: 'middle', weight: 700 });
  label(S, gx + 225, gy + 246, '−(1+A_{1})I_{X}R_{S}', 30, { size: 18, color: C.cur, anchor: 'middle', weight: 700 });
  S.say(22, '$I_X$ through $R_S$ lifts the <b>source</b> by $I_XR_S$. A plain device’s $V_{GS}$ would shrink by just that much.');
  S.say(26, 'But the amplifier sees the source rise and drives the <b>gate down</b> by $A_1I_XR_S$ (your page: “$-A_1I_XR_S$”).');
  S.say(30, 'So $V_{GS}$ shrinks by $(1 + A_1)I_XR_S$: M2 fights back $(1 + A_1)$ times harder. The drain looks $(1 + A_1)$ times stiffer.');
  const lines = [
    ['I_o = g_{m2}[-A_1I_XR_S - I_XR_S] = -g_{m2}R_SI_X(1 + A_1)', 38],
    ['I_X = I_o + \\frac{V_X - I_XR_S}{r_{O2}}', 44],
    ['\\frac{V_X}{I_X} = R_S + r_{O2} + g_{m2}(1 + A_1)R_Sr_{O2}', 50],
  ];
  lines.forEach(([tex, t], i) => eqAt(S, tex, 760, 680 + i * 66, t, { size: 30, w: 1100, color: i === 2 ? '#ffd38a' : C.text }));
  S.say(38, 'The algebra on your page: the current source inside M2 is $g_{m2}$ times $V_{GS}$, which is $-(1+A_1)I_XR_S$.');
  S.say(44, 'KCL at the drain: $I_X$ is that current plus what flows through $r_{O2}$, which sees $V_X - I_XR_S$.');
  S.say(50, 'Solve for $V_X/I_X$: <b>$R_{out} = R_S + r_{O2} + g_{m2}(1+A_1)R_Sr_{O2}$</b> — the cascode result with its big term multiplied by $(1 + A_1)$.');
  whyBox(S, 40, 620, 330, 210, 'With $g_mr_O = 50$ and $A_1 = 50$: **51× more $R_{out}$**, with **no extra device** in the output column.', 58);
  S.say(58, 'With $g_mr_O = 50$ and $A_1 = 50$ that is 51 times more output resistance — and nothing new was stacked in the output column. That is gain boosting.');
  S.say(68, '<span class="why">Remember the picture:</span> the amplifier holds the source still by moving the gate the opposite way.');
});

scene(L7, 'Lecture 7 in one card', 30, (S) => {
  header(S, 'LEC 7 · REMEMBER', 'Everything from Lecture 7');
  remember(S, [
    'Two stages split the jobs: **stage 1 gain**, **stage 2 swing** (CS, two blocks per column). $A = A_1A_2$.',
    'Simple: $A_1 = g_{m1,2}(r_{O1,2}\\parallel r_{O3,4})$, $A_2 = g_{m5,6}(r_{O5,6}\\parallel r_{O7,8})$. Telescopic stage 1: $A_1 = g_{m1}[g_{m5}r_{O5}r_{O7}\\parallel g_{m3}r_{O3}r_{O1}]$, $A_2 = g_{m9}(r_{O9}\\parallel r_{O11})$.',
    'Level between the stages is a **link**: $X = V_{DD} - |V_{GS9}|$.',
    'Price: **two poles** → needs compensation. Single output: diode M11 + mirror M12, the halves add.',
    '$A_v = G_m\\times R_{out}$: $G_m$ is hard to raise; raise $R_{out}$ without stacking.',
    'Amp in front of the gate: **no improvement** ($A_1$ × the plain degenerated device).',
    'Amp watching the source: $R_{out} = R_S + r_O + (1 + A_1)g_mR_Sr_O$.',
  ], 0.4, 'Lecture 7 · remember');
  S.say(0.4, 'Pause here and read the card once. Then three past-paper questions, solved the way you would write them in the exam.');
});

/* ── Lecture 7 past papers ── */

scene(L7, 'Tutorial 3 Q2: two-stage, level at X, gain, swing', 78, (S) => {
  const T = tfm(0.76, -130, 188);
  pyqFrame(S, {
    paper: 't3q2', tag: 'LEC 7 · PAST PAPER 1 OF 3', title: 'Two-stage op amp: what sits at X?', src: 'Tutorial 3 Q2 · Razavi 9.6',
    q: 'Your circuit 1 with $(W/L)_{1-8} = 200$, $I_{SS} = 1$ mA, $I_{D5} = I_{D6} = 1$ mA. (a) CM level at X, Y and the input-CM ceiling. (b) Gain and maximum output swing.',
    giv: '$V_{DD} = 3$ V, $\\mu_nC_{ox} = 134.28\\,\\mu$, $\\mu_pC_{ox} = 38.36\\,\\mu$A/V², $V_{thn} = 0.7$, $|V_{thp}| = 0.8$ V, $\\lambda_n = 0.1$, $\\lambda_p = 0.2$',
    qh: 270, tests: 'the **link** that pins the level between two stages, the **fence** for the input-CM ceiling, and **gain = product of stage gains**.',
    fig: (S2) => { const c = twoStage1(S2); c.g.setAttribute('transform', 'translate(-130 188) scale(0.76)'); },
    steps: [
      { t: 7, title: '**(a) Start at stage 2.** X is **M5’s gate**, M5’s source is $V_{DD}$, M5 carries 1 mA: $|V_{GS5}|$ is fixed — a **link**', tex: stepTex('bank-t3q2', 0), hl: [T([330, 170, 150, 130, C.volt])],
        try: { q: 'M5: PMOS, W/L = 200, µpCox = 38.36 µA/V², |Vthp| = 0.8 V, 1 mA, source at VDD = 3 V. What is V<sub>X</sub>?', answer: ans('bank-t3q2', 'vxy'), unit: 'V', tol: 0.01, hint: '|VGS5| = |Vth| + √(2·ID/(µpCox·W/L)); X sits that far below VDD.', why: 'X is M5’s gate: a link from VDD.' },
        say: 'Start where the level is forced. X is M5’s gate and M5 must carry 1 mA, so $|V_{GS5}| = 0.8 + 0.511 = 1.311$ V and $V_X = 1.689$ V.' },
      { t: 15, title: 'Input-CM ceiling: M1’s drain is X; its gate may sit $V_{th}$ above it (NMOS fence)', tex: stepTex('bank-t3q2', 1), hl: [T([590, 360, 150, 120, C.n])],
        try: { q: 'M1’s drain sits at V<sub>X</sub> = 1.689 V and V<sub>thn</sub> = 0.7 V. What is the highest input CM?', answer: ans('bank-t3q2', 'cmMax'), unit: 'V', tol: 0.01, hint: 'NMOS fence: drain ≥ gate − Vth, so gate ≤ drain + Vth.' },
        say: 'Ceiling: an NMOS gate may sit one $V_{th}$ above its drain. $1.689 + 0.7 = 2.389$ V.' },
      { t: 23, title: '**(b)** Gains multiply: $A_1 = g_{m1}(r_{O1}\\parallel r_{O3})$, $A_2 = g_{m5}(r_{O5}\\parallel r_{O7})$', tex: stepTex('bank-t3q2', 2), hl: [T([560, 150, 480, 500, C.red]), T([270, 150, 250, 450, C.green])],
        try: { q: 'Stage 1: each side carries 0.5 mA, g<sub>m1</sub> = √(2·134.28µ·200·0.5m), r<sub>O1</sub> = 1/(0.1·0.5m), r<sub>O3</sub> = 1/(0.2·0.5m). What is A<sub>1</sub>?', answer: 34.53, unit: 'V/V', tol: 0.03, hint: 'gm1 ≈ 5.18 mS; rO1 ∥ rO3 = 20 k ∥ 10 k = 6.67 kΩ.', why: 'Then A2 ≈ 13.1 the same way, and A = A1·A2.' },
        say: '$g_{m1} = 5.18$ mS into $20\\,\\text{k}\\parallel10\\,\\text{k}$ gives $A_1 = 34.5$; M5 at 1 mA gives $A_2 = 13.1$. Multiply: 451.' },
      { t: 31, title: 'Swing: CS stage, one overdrive at each rail; ×2 for differential', tex: stepTex('bank-t3q2', 3), hl: [T([330, 170, 150, 400, C.green])],
        try: { q: '|V<sub>ov5</sub>| = 0.511 V and V<sub>ov7</sub> = 0.273 V, V<sub>DD</sub> = 3 V. What is the maximum differential swing (p-p)?', answer: ans('bank-t3q2', 'swing'), unit: 'V', tol: 0.01, hint: 'One output runs from Vov7 to VDD − |Vov5|; differential doubles it.' },
        say: 'Each output runs from $V_{ov7}$ to $V_{DD} - |V_{ov5}|$; the differential output doubles it: 4.43 V p-p.' },
      { t: 38, ans: true, title: `**Answers:** $V_X = ${fx(ans('bank-t3q2', 'vxy'), 4)}$ V · $V_{in,CM,max} = ${fx(ans('bank-t3q2', 'cmMax'), 4)}$ V · $A = ${fx(ans('bank-t3q2', 'av'), 3)}$ · swing $${fx(ans('bank-t3q2', 'swing'), 3)}$ V`, say: 'Exam pattern: <b>link first</b> (fixes X), <b>fence second</b> (CM ceiling), then <b>gain = product</b>, then <b>swing = rails minus one $V_{ov}$ each</b>.' },
    ],
  });
}, { q: 'Tutorial 3 Q2' });

scene(L7, 'Tutorial 3 Q3: telescopic + CS, sizes from a 200 mV swing', 74, (S) => {
  const T = tfm(0.72, -110, 150);
  pyqFrame(S, {
    paper: 't3q3', tag: 'LEC 7 · PAST PAPER 2 OF 3', title: 'Telescopic first stage: X level, sizes, gain', src: 'Tutorial 3 Q3 · Razavi 9.8',
    q: 'Your circuit 2: $I_{SS} = 1$ mA, $I_{D9-12} = 0.5$ mA, $(W/L)_{9-12} = 200$. (a) CM level at X, Y. (b) Tail needs 400 mV: smallest M1–M8 for a 200 mV p-p swing at X, Y. (c) Overall gain.',
    giv: 'Same process as Q2 (Set A, $V_{DD} = 3$ V).', qh: 250,
    tests: 'the same **link** for X, then a **headroom budget** around X turned into sizes with the square law, then **A₁ × A₂**.',
    fig: (S2) => { const c = twoStage2(S2); c.g.setAttribute('transform', 'translate(-110 150) scale(0.72)'); },
    steps: [
      { t: 7, title: '**(a)** Same link: X is **M9’s gate**, M9 carries 0.5 mA', tex: stepTex('bank-t3q3', 0), hl: [T([330, 330, 150, 130, C.volt])],
        try: { q: 'M9: PMOS, W/L = 200, µpCox = 38.36 µA/V², |Vthp| = 0.8 V, 0.5 mA, VDD = 3 V. What is V<sub>X</sub>?', answer: ans('bank-t3q3', 'vxy'), unit: 'V', tol: 0.01, hint: 'Same as Q2 but at 0.5 mA.' },
        say: 'Same first move: $X = V_{DD} - |V_{GS9}| = 1.839$ V.' },
      { t: 15, title: '**(b)** X swings ±0.1 V. Below it: tail (0.4) + M3 + M1; above it: M5 + M7. Share equally', tex: stepTex('bank-t3q3', 1), hl: [T([560, 400, 200, 380, C.n]), T([560, 160, 200, 200, C.p])],
        try: { q: 'Lowest X = 1.839 − 0.1 V. The tail takes 0.4 V; M1 and M3 share the rest equally. What is V<sub>ov,N</sub>?', answer: 0.6694949, unit: 'V', tol: 0.01, hint: '(1.739 − 0.4) / 2.' },
        say: 'The 200 mV swing means X moves ±0.1 V. Under its lowest point: the tail and two NMOS; above its highest point: two PMOS. Split each share equally.' },
      { t: 23, title: 'Largest overdrive ⇒ smallest device (square law at 0.5 mA)', tex: stepTex('bank-t3q3', 2),
        try: { q: 'NMOS at 0.5 mA, µnCox = 134.28 µA/V², V<sub>ov</sub> = 0.669 V. What is (W/L)<sub>1–4</sub>?', answer: ans('bank-t3q3', 'wlN'), unit: '', tol: 0.02, hint: 'W/L = 2ID / (µnCox · Vov²).' },
        say: 'The smallest devices are the ones with the largest allowed overdrive: $W/L = 2I_D/(\\mu C_{ox}V_{ov}^2)$.' },
      { t: 31, title: '**(c)** Telescopic $A_1$ × CS $A_2$', tex: stepTex('bank-t3q3', 4), hl: [T([540, 140, 520, 640, C.red]), T([290, 300, 220, 420, C.green])],
        say: '$A_1 = g_{m1}(R_{up}\\parallel R_{down}) ≈ 214$, $A_2 = g_{m9}(r_{O9}\\parallel r_{O11}) ≈ 18.5$, so $A ≈ 3950$.' },
      { t: 38, ans: true, title: `**Answers:** $V_X = ${fx(ans('bank-t3q3', 'vxy'), 4)}$ V · $(W/L)_{1-4} = ${fx(ans('bank-t3q3', 'wlN'), 3)}$ · $(W/L)_{5-8} = ${fx(ans('bank-t3q3', 'wlP'), 3)}$ · $A ≈ ${fx(ans('bank-t3q3', 'av'), 3)}$`, say: 'The question doesn’t say how to split the headroom; equal sharing is the natural exam assumption. State it in one line.' },
    ],
  });
}, { q: 'Tutorial 3 Q3' });

/* regulated cascode with a CS booster (implementation 1); labels as Tutorial 4 Q1 */
function regCascode(S, o = {}) {
  const g = S.g(); const r = S.into(g);
  rail(S, 160, 760, 170);
  const xo = 560;
  isrc(S, xo, 230, { label: o.iout || 'I_2' }); wire(S, [[xo, 170], [xo, 188]]);
  dot(S, xo, 300); wire(S, [[xo, 272], [xo, 330]]); wire(S, [[xo, 300], [680, 300]]); txt(S, 690, 307, 'V_out', { size: 22, color: C.volt, weight: 700 });
  const m2 = nmos(S, xo, 380, { name: 'M2', gl: 60 });
  dot(S, xo, 460); wire(S, [[xo, 430], [xo, 490]]);
  txt(S, xo + 14, 470, 'X', { size: 22, color: C.bad, weight: 750 });
  nmos(S, xo, 540, { name: 'M1', gate: 'V_in', right: true, nameSide: 'l' }); gnd(S, xo, 590);
  // booster M3 with its load
  const xa = 330;
  isrc(S, xa, 260, { label: o.iaux || 'I_1', left: true }); wire(S, [[xa, 170], [xa, 218]]);
  wire(S, [[xa, 302], [xa, 490]]); dot(S, xa, 380);
  wire(S, [[xa, 380], [m2.gate[0], 380]]);
  const m3 = nmos(S, xa, 540, { name: 'M3', right: true, gl: 40, nameSide: 'l' });
  wire(S, [[m3.gate[0], 540], [470, 540], [470, 460], [xo, 460]]);
  gnd(S, xa, 590);
  r();
  return { g };
}

scene(L7, 'Tutorial 4 Q1(b): the boosted R_out with numbers', 66, (S) => {
  const T = tfm(1, 0, 90);
  pyqFrame(S, {
    paper: 't4q1', tag: 'LEC 7 · PAST PAPER 3 OF 3', title: 'Regulated cascode: how big does R_out get?', src: 'Tutorial 4 Q1 (b), (c)',
    q: 'M3 (gate on X, loaded by $I_1 = 100\\,\\mu$A) drives M2’s gate; $I_2 = 0.5$ mA. $(W/L)_{1-3} = 200$. (b) Gain with ideal sources. (c) With a PMOS source for $I_2$ ($r_O = 10$ kΩ), the gain.',
    giv: '$\\mu_nC_{ox} = 172.35\\,\\mu$A/V², $V_{thn} = 0.7$ V, $\\lambda_n = 0.1$ V⁻¹', qh: 250,
    tests: 'the Lec 7 boosted-$R_{out}$ formula with real numbers, and the **load trap**.',
    fig: (S2) => { const c = regCascode(S2); c.g.setAttribute('transform', 'translate(0 90)'); },
    steps: [
      { t: 7, title: 'The booster is M3, a CS stage with an ideal load: $A_1 = g_{m3}r_{O3}$', tex: 'A_1 = g_{m3}r_{O3},\\quad g_{m3} = \\sqrt{2\\mu_nC_{ox}\\tfrac{W}{L}I_1},\; r_{O3} = \\tfrac{1}{\\lambda I_1}', hl: [T([250, 320, 170, 300, C.amb])],
        try: { q: 'g<sub>m3</sub> = √(2·172.35µ·200·100µ), r<sub>O3</sub> = 1/(0.1·100µ). What is A<sub>1</sub> = g<sub>m3</sub>r<sub>O3</sub>?', answer: 262.6, unit: '', tol: 0.02, hint: 'gm3 ≈ 2.63 mS, rO3 = 100 kΩ.' },
        say: 'Spot the booster: M3 watches X and drives M2’s gate. It is a CS stage with an ideal load: $A_1 = g_{m3}r_{O3} ≈ 263$.' },
      { t: 15, title: 'Plug into the Lec 7 result with $R_S = r_{O1}$', tex: stepTex('bank-t4q1', 2), hl: [T([470, 320, 190, 300, C.n])],
        try: { q: 'M1, M2 at 0.5 mA: g<sub>m2</sub> ≈ 5.87 mS, r<sub>O</sub> = 20 kΩ, A<sub>1</sub> = 263. R<sub>out</sub> ≈ (1 + A<sub>1</sub>)g<sub>m2</sub>r<sub>O2</sub>r<sub>O1</sub> in MΩ?', answer: 619e6, unit: 'Ω (you can type 619M)', tol: 0.03, hint: '264 × 5.87m × 20k × 20k.' },
        say: '$R_{out} = r_{O1} + r_{O2} + (1 + A_1)g_{m2}r_{O2}r_{O1}$ ≈ 619 MΩ.' },
      { t: 23, title: '**(b)** Gain = $g_{m1}R_{out}$ (ideal $I_2$)', tex: stepTex('bank-t4q1', 3), say: 'Ideal load: the gain is $g_{m1}R_{out}$ — about 3.6 million.' },
      { t: 30, title: '**(c) The load trap:** a real PMOS source ($r_O = 10$ kΩ) sits in parallel with 619 MΩ', tex: stepTex('bank-t4q1', 6), hl: [T([470, 180, 190, 110, C.bad])],
        try: { q: 'The output sees 619 MΩ ∥ 10 kΩ and g<sub>m1</sub> ≈ 5.87 mS. What is |A<sub>v</sub>|?', answer: ans('bank-t4q1', 'avP'), unit: 'V/V', tol: 0.03, hint: 'The parallel combination is essentially 10 kΩ.' },
        say: 'With a real PMOS current source, its 10 kΩ sits in parallel with 619 MΩ — the small one wins. Gain collapses to about 59.' },
      { t: 38, ans: true, title: `**Answers:** $A_1 ≈ 263$, $R_{out} ≈ 619$ MΩ, $|A_v| ≈ 3.63\\times10^6$ (ideal) and $≈ ${fx(ans('bank-t4q1', 'avP'), 3)}$ with the PMOS load`, say: 'Exam tip: whenever you boost one side, look at the other side’s resistance before you multiply.' },
    ],
  });
}, { q: 'Tutorial 4 Q1' });
