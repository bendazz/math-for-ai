/* ============================================================
   Section: The Threshold Dial  (Evaluation unit — section 3)
   Registered under id "threshold-dial" (see manifest.js).
   Closes the precision/recall thread AND the logit->sigmoid journey:
   the sigmoid gave each email a spam PROBABILITY; the THRESHOLD turns
   that probability into a yes/no decision (flag if p >= threshold).

   The threshold is the DIAL behind last section's "eagerness":
     low threshold  -> flags lots -> high recall, low precision (eager)
     high threshold -> flags rarely -> high precision, low recall (cautious)
   0.5 is just a default, not sacred — you tune it to which error hurts.

   F1 SCORE = harmonic mean of precision & recall = 2PR/(P+R). Punishes
   imbalance: near 0 if EITHER is near 0 (can't game by maxing one).
   The F1-maximizing threshold balances the two.

   Interactive (onMount, Math.random once): population of emails each
   with a sigmoid spam-probability; threshold slider; canvas chart of
   precision/recall/F1 vs threshold with a moving marker + F1 peak;
   live numbers. No inline problems (convention). No forward lead-in.
   No currency $.
   ============================================================ */

(function () {
  const T = window.Toolkit;

  const html = `
    <div class="eyebrow">Evaluation · 3</div>
    <h1>The Threshold Dial</h1>

    <p>Back in the sigmoid section, the spam filter didn't really shout "spam!" or "fine!" — it produced a
    <strong>probability</strong>, a number between $0$ and $1$ for how spammy each email looks. So where do
    the yes/no decisions in the confusion matrix actually come from? You have to draw a line: pick a
    <strong>threshold</strong>, and flag the email as spam whenever its probability clears it.</p>

    $$\\text{flag as spam} \\quad\\text{whenever}\\quad p \\ge \\text{threshold}.$$

    <p>People often assume the threshold is $0.5$, but there's nothing sacred about it — it's a
    <strong>choice</strong>. And it turns out to be the exact dial behind last section's "cautious-to-eager"
    slider.</p>

    <h2>Turning the dial</h2>

    <p>Watch what the threshold does:</p>
    <ul>
      <li>A <strong>low threshold</strong> (say $0.2$) flags almost anything with a whiff of spam. You
      catch nearly all the spam — <strong>recall climbs</strong> — but you also trash good email, so
      <strong>precision drops</strong>. This is the "eager" end.</li>
      <li>A <strong>high threshold</strong> (say $0.8$) flags only when the filter is very sure. Almost
      everything you flag is truly spam — <strong>precision climbs</strong> — but subtler spam slips
      through, so <strong>recall drops</strong>. The "cautious" end.</li>
    </ul>

    <p>So moving the threshold slides you along the precision–recall tradeoff. Drag it below. The chart
    shows precision, recall, and a third curve (F1, defined in a moment) at <em>every</em> threshold, with
    a line marking where you are; the numbers update as you go.</p>

    ${T.widget(
      "Sweep the decision threshold",
      `<canvas id="th-chart" style="touch-action:none"></canvas>
       <div class="slider-row" style="grid-template-columns:auto 1fr 3.5em;align-items:center;gap:12px;margin-top:10px">
         <span class="slabel" style="white-space:nowrap">threshold</span>
         <input type="range" id="th-slider" min="2" max="98" step="1" value="50" />
         <span class="sval" id="th-val">0.50</span>
       </div>
       <div id="th-read" style="margin-top:8px"></div>`
    )}

    <h2>F1: one number for "good at both"</h2>

    <p>Sometimes you do want a single score — but accuracy was a poor one. A better single number for a
    classifier is the <strong>F1 score</strong>, which combines precision and recall by taking their
    <strong>harmonic mean</strong>:</p>

    $$\\text{F1} = \\frac{2 \\cdot \\text{precision} \\cdot \\text{recall}}{\\text{precision} + \\text{recall}}.$$

    <p>Why that funny formula instead of a plain average? Because the harmonic mean is <strong>dragged
    toward the smaller of the two</strong> — it punishes imbalance. Suppose a filter has perfect precision
    $1.0$ but recall $0.0$ (it flags a single obvious spam and ignores the rest). A plain average says
    $\\tfrac{1.0 + 0.0}{2} = 0.5$ — sounds half-decent. But F1 says
    $\\tfrac{2 \\cdot 1.0 \\cdot 0.0}{1.0 + 0.0} = 0$ — correctly calling it useless. You can't game F1 by
    maxing one number and starving the other; it's only high when <strong>both</strong> precision and
    recall are high.</p>

    <p>That's why F1 is the humped middle curve on the chart: it sags at both ends (where one of precision
    or recall has collapsed) and peaks somewhere in between. The little marked point is the threshold that
    gives the <strong>best F1</strong> — the most balanced setting.</p>

    ${T.callout(
      `<p>But "balanced" isn't always what you want — and this is where it all comes together. F1 treats
       precision and recall as equally important. If a <em>miss</em> is far worse than a <em>false alarm</em>
       — a medical screen, say — you'd deliberately turn the threshold <strong>down</strong>, accepting
       worse precision (and lower F1) to push recall up. If a <em>false alarm</em> is worse — flagging a
       good email — you'd turn it <strong>up</strong>. The threshold is the knob; precision, recall, and F1
       are how you read the consequences. Choosing where to set it <em>is</em> the act of deciding what your
       app is for.</p>`,
      { type: "ai", label: "Setting the dial is a judgment call" }
    )}

    <h2>What you learned</h2>
    <ul>
      <li>A classifier outputs a <strong>probability</strong>; a <strong>threshold</strong> turns it into a
      yes/no decision (flag if $p \\ge \\text{threshold}$). The threshold is a choice, not a fixed $0.5$.</li>
      <li>Lowering the threshold raises <strong>recall</strong> and lowers <strong>precision</strong>;
      raising it does the reverse. The dial slides you along the tradeoff.</li>
      <li><strong>F1</strong> $= 2PR/(P+R)$, the harmonic mean, is a single score that's only high when
      precision <em>and</em> recall are both high — but you still set the threshold by which mistake costs
      you more.</li>
    </ul>
  `;

  function onMount(root) {
    const canvas = root.querySelector("#th-chart");
    const slider = root.querySelector("#th-slider");
    const valEl = root.querySelector("#th-val");
    const readEl = root.querySelector("#th-read");
    if (!canvas) return;

    // population, generated once: spam probs skew high, ham probs skew low
    const NS = 70, NH = 130;
    const spam = [], ham = [];
    for (let i = 0; i < NS; i++) spam.push(Math.pow(Math.random(), 0.55));
    for (let i = 0; i < NH; i++) ham.push(Math.pow(Math.random(), 1.9));

    function countsAt(t) {
      let tp = 0, fn = 0, fp = 0, tn = 0;
      spam.forEach((p) => (p >= t ? tp++ : fn++));
      ham.forEach((p) => (p >= t ? fp++ : tn++));
      return { tp, fn, fp, tn };
    }
    function metrics(t) {
      const c = countsAt(t);
      const prec = (c.tp + c.fp) === 0 ? 1 : c.tp / (c.tp + c.fp);
      const rec = c.tp / (c.tp + c.fn);
      const f1 = (prec + rec) === 0 ? 0 : 2 * prec * rec / (prec + rec);
      return { c, prec, rec, f1 };
    }

    // precompute curves + F1 peak
    const STEPS = 100;
    const curve = [];
    for (let k = 0; k <= STEPS; k++) {
      const t = k / STEPS;
      const m = metrics(t);
      curve.push({ t, prec: m.prec, rec: m.rec, f1: m.f1 });
    }
    let peak = 0;
    curve.forEach((pt, i) => { if (pt.f1 > curve[peak].f1) peak = i; });

    function draw() {
      const { ctx, w, h } = T.fitCanvas(canvas, 280);
      ctx.clearRect(0, 0, w, h);
      const mL = 40, mR = 14, mT = 14, mB = 34;
      const pw = w - mL - mR, ph = h - mT - mB;
      const X = (t) => mL + t * pw, Y = (v) => mT + (1 - v) * ph;

      // gridlines + y labels
      ctx.font = "10px -apple-system, sans-serif"; ctx.fillStyle = "#8a93a6";
      [0, 0.25, 0.5, 0.75, 1].forEach((v) => {
        ctx.strokeStyle = "#eef0f5"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(mL, Y(v)); ctx.lineTo(mL + pw, Y(v)); ctx.stroke();
        ctx.textAlign = "right"; ctx.textBaseline = "middle"; ctx.fillText(v.toFixed(2), mL - 5, Y(v));
      });
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      [0, 0.25, 0.5, 0.75, 1].forEach((t) => ctx.fillText(t.toFixed(2), X(t), mT + ph + 6));
      ctx.fillText("threshold", mL + pw / 2, mT + ph + 19);

      function line(key, color) {
        ctx.strokeStyle = color; ctx.lineWidth = 2.2; ctx.beginPath();
        curve.forEach((pt, i) => { const x = X(pt.t), y = Y(pt[key]); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
        ctx.stroke();
      }
      line("prec", "#4f46e5");
      line("rec", "#0d9488");
      line("f1", "#b45309");

      // F1 peak marker
      ctx.fillStyle = "#b45309";
      ctx.beginPath(); ctx.arc(X(curve[peak].t), Y(curve[peak].f1), 4, 0, Math.PI * 2); ctx.fill();

      // current threshold line
      const t = parseInt(slider.value, 10) / 100;
      ctx.strokeStyle = "#1f2430"; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.moveTo(X(t), mT); ctx.lineTo(X(t), mT + ph); ctx.stroke();
      ctx.setLineDash([]);

      // legend
      ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.font = "11px -apple-system, sans-serif";
      const leg = [["precision", "#4f46e5"], ["recall", "#0d9488"], ["F1", "#b45309"]];
      let lx = mL + 6;
      leg.forEach(([lab, col]) => {
        ctx.fillStyle = col; ctx.fillRect(lx, mT + 4, 12, 3);
        ctx.fillStyle = "#515a6e"; ctx.fillText(lab, lx + 16, mT + 6);
        lx += ctx.measureText(lab).width + 38;
      });
    }

    function update() {
      const t = parseInt(slider.value, 10) / 100;
      valEl.textContent = t.toFixed(2);
      const m = metrics(t);
      readEl.innerHTML =
        `<div style="font-size:1.0em;color:#0f172a">at threshold ${t.toFixed(2)}: ` +
        `<b style="color:#4f46e5">precision ${Math.round(m.prec * 100)}%</b> · ` +
        `<b style="color:#0d9488">recall ${Math.round(m.rec * 100)}%</b> · ` +
        `<b style="color:#b45309">F1 ${m.f1.toFixed(2)}</b></div>` +
        `<div class="tr-meta" style="margin-top:3px">caught ${m.c.tp} of ${m.c.tp + m.c.fn} spam; trashed ${m.c.fp} good email${m.c.fp === 1 ? "" : "s"}</div>`;
      draw();
    }

    slider.addEventListener("input", update);
    window.addEventListener("resize", draw);
    update();
  }

  window.SectionContent = window.SectionContent || {};
  window.SectionContent["threshold-dial"] = {
    title: "The Threshold Dial",
    html,
    onMount,
  };
})();
