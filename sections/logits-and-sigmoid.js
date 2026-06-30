/* ============================================================
   Section: Logits, Odds, and Probabilities (the sigmoid)
   Registered under id "logits-and-sigmoid" (see manifest.js).
   Part 1 of the instructor's logit -> odds -> probability arc,
   for a SINGLE yes/no event. Softmax (many outcomes) and
   temperature come in later sections.

   Pedagogy (instructor's framing): one belief about a yes/no
   event, expressed on three frames of reference that all say the
   same thing —
     - logit (log-odds): the whole number line, even chance at 0
     - odds: the positive ray (0..inf), even chance at 1
     - probability: the unit interval (0..1), even chance at 0.5
   Bridges are exactly this unit's two functions:
     odds = e^(logit)          (exponential: always positive)
     p    = odds/(1+odds)
     => p = 1/(1 + e^(-logit)) = the sigmoid.
   Explicit callback to the exponential property b^(x+1)=b·b^x:
   adding to the logit MULTIPLIES the odds.

   Interactive (onMount): a logit slider drives the sigmoid curve
   (moving point + guide lines) and live logit/odds/probability
   readouts; preset buttons jump to leaning-no / even / leaning-yes.
   Dynamic readouts use plain text (KaTeX typesets once, pre-mount).
   Money/currency avoided; only math $...$ is used.
   ============================================================ */

(function () {
  const T = window.Toolkit;

  // ---- inline number-line diagram (static SVG) ----------------
  // A horizontal number line with an optional highlighted span,
  // tick labels, colored "even chance" point(s), arrowheads, and
  // end labels — used to picture each frame of reference.
  let _nlSeq = 0;
  function numLine(opts) {
    _nlSeq += 1;
    const mid = "nlar" + _nlSeq;
    const W = 560, H = 96, cy = 46, padX = 50;
    const { xMin, xMax } = opts;
    const xs = (v) => padX + ((v - xMin) / (xMax - xMin)) * (W - 2 * padX);
    const hl = opts.highlight;
    let p = `<defs><marker id="${mid}" viewBox="0 0 10 10" refX="8" refY="5" ` +
            `markerWidth="7" markerHeight="7" orient="auto-start-reverse">` +
            `<path d="M0,0 L10,5 L0,10 z" fill="#9aa3b2"/></marker></defs>`;

    // highlight band
    if (hl) {
      const a = xs(Math.max(hl.from, xMin)), b = xs(Math.min(hl.to, xMax));
      p += `<rect x="${a}" y="${cy - 15}" width="${b - a}" height="30" rx="6" ` +
           `fill="${hl.color}" opacity="0.15"/>`;
    }

    // baseline (faded outside the highlight when requested)
    const ms = opts.leftArrow ? `marker-start="url(#${mid})"` : "";
    const me = opts.rightArrow ? `marker-end="url(#${mid})"` : "";
    if (hl && opts.fadeOutside) {
      p += `<line x1="${xs(xMin)}" y1="${cy}" x2="${xs(xMax)}" y2="${cy}" ` +
           `stroke="#d9dce4" stroke-width="2.5" ${ms} ${me}/>`;
      const a = xs(Math.max(hl.from, xMin)), b = xs(Math.min(hl.to, xMax));
      p += `<line x1="${a}" y1="${cy}" x2="${b}" y2="${cy}" stroke="${hl.color}" stroke-width="3.5"/>`;
    } else {
      p += `<line x1="${xs(xMin)}" y1="${cy}" x2="${xs(xMax)}" y2="${cy}" ` +
           `stroke="#9aa3b2" stroke-width="2.5" ${ms} ${me}/>`;
    }

    // ticks
    (opts.ticks || []).forEach((t) => {
      const x = xs(t.x);
      p += `<line x1="${x}" y1="${cy - 5}" x2="${x}" y2="${cy + 5}" stroke="#9aa3b2" stroke-width="1.5"/>`;
      p += `<text x="${x}" y="${cy + 21}" text-anchor="middle" font-size="12" fill="#8a93a6">${t.label}</text>`;
    });

    // colored points (dot + bold label above, optional sub below)
    (opts.points || []).forEach((pt) => {
      const x = xs(pt.x);
      p += `<circle cx="${x}" cy="${cy}" r="4.5" fill="${pt.color}"/>`;
      p += `<text x="${x}" y="${cy - 12}" text-anchor="middle" font-size="13" font-weight="700" fill="${pt.color}">${pt.label}</text>`;
      if (pt.sub) p += `<text x="${x}" y="${cy + 21}" text-anchor="middle" font-size="10.5" fill="${pt.color}">${pt.sub}</text>`;
    });

    // end labels (e.g. −∞ / +∞)
    if (opts.endLabels) {
      if (opts.endLabels.left) p += `<text x="${xs(xMin)}" y="${cy - 12}" text-anchor="middle" font-size="14" fill="#8a93a6">${opts.endLabels.left}</text>`;
      if (opts.endLabels.right) p += `<text x="${xs(xMax)}" y="${cy - 12}" text-anchor="middle" font-size="14" fill="#8a93a6">${opts.endLabels.right}</text>`;
    }

    const cap = opts.caption ? `<div class="bc-caption">${opts.caption}</div>` : "";
    return `<div class="flow-wrap"><svg viewBox="0 0 ${W} ${H}" class="flowsvg" ` +
           `role="img" aria-label="${opts.alt || "number line"}" style="max-width:600px">` +
           `${p}</svg>${cap}</div>`;
  }

  const html = `
    <div class="eyebrow">Probability Meets AI · 6</div>
    <h1>Logits, Odds, and Probabilities</h1>

    <p>Let's slow down and look closely at one simple situation: a single <strong>yes/no
    question</strong>. Will it rain tomorrow? Is this email spam? Will the user click? There's
    just one event, and it either happens or it doesn't.</p>

    <p>Here's the key idea of this section: a single belief about that event can be written on
    <strong>three different scales</strong> — and they all say exactly the same thing. They're
    three <em>frames of reference</em>, like measuring the same temperature in Celsius or
    Fahrenheit. We'll start on the widest, most open scale and work our way down to the familiar
    one. The two functions you just learned, $e^x$ and its shape, are exactly the bridges
    between them.</p>

    <h2>Frame 1 — the number line: the <em>logit</em></h2>

    <p>Picture the ordinary number line, running from $-\\infty$ on the left to $+\\infty$ on the
    right. We'll summarize our belief about the event as a single number somewhere on that line.
    Call it the <strong>logit</strong> (you'll also hear <em>log-odds</em> — we'll see why
    shortly). Read it like a score of evidence:</p>

    <ul>
      <li>a <strong>very negative</strong> logit → the event is <strong>unlikely</strong>
      ("strong evidence against");</li>
      <li>a logit of <strong>$0$</strong> → perfectly torn, a <strong>50/50</strong> coin flip;</li>
      <li>a <strong>very positive</strong> logit → the event is <strong>likely</strong>
      ("strong evidence for").</li>
    </ul>

    ${numLine({
      xMin: -5, xMax: 5, leftArrow: true, rightArrow: true,
      ticks: [{ x: -4, label: "−4" }, { x: -2, label: "−2" }, { x: 2, label: "+2" }, { x: 4, label: "+4" }],
      points: [{ x: 0, label: "0", color: "#4f46e5", sub: "even chance" }],
      endLabels: { left: "−∞", right: "+∞" },
      alt: "The whole number line, for the logit",
      caption: "The logit lives on the whole number line: negative = unlikely, positive = likely, 0 = an even chance.",
    })}

    <p>The bigger the number, the stronger the belief; the sign tells you which way. For example,
    a spam filter might score an email at logit $+2$ — leaning clearly toward "spam," but not
    a sure thing.</p>

    ${T.callout(
      `<p>Why would a machine work on this scale? Because it has <strong>no walls</strong>. Evidence
       can keep piling up toward $+\\infty$ or $-\\infty$ without ever bumping into a floor or a
       ceiling — you can always "add a little more evidence." That freedom makes the logit the
       natural place for a model to do its adding-up. We convert to a tidy $0$-to-$1$ answer only
       at the very end.</p>`,
      { type: "ai", label: "Why models think in logits" }
    )}

    <h2>Frame 2 — the positive ray: <em>odds</em></h2>

    <p>Maybe you'd prefer a scale where "impossible" sits at the bottom and "certain" climbs
    upward without going negative — a scale from $0$ to $+\\infty$. That's <strong>odds</strong>.
    You already use them: "3 to 1 in favor" means the event is three times as likely to happen as
    not. As a single number, odds are the ratio of "yes" to "no":</p>

    <ul>
      <li>odds $= 1$ means <strong>1 to 1</strong> — an even chance;</li>
      <li>odds $> 1$ means it's favored (odds $3$ = "3 to 1 for");</li>
      <li>odds $< 1$ means it's unlikely (odds $\\tfrac13$ = "3 to 1 against").</li>
    </ul>

    ${numLine({
      xMin: -5, xMax: 5, leftArrow: true, rightArrow: true,
      highlight: { from: 0, to: 5, color: "#0d9488" }, fadeOutside: true,
      ticks: [{ x: 2, label: "2" }, { x: 3, label: "3" }, { x: 4, label: "4" }],
      points: [
        { x: 0, label: "0", color: "#8a93a6", sub: "impossible" },
        { x: 1, label: "1", color: "#4f46e5", sub: "even" },
      ],
      endLabels: { right: "+∞" },
      alt: "The number line with the positive half highlighted, for odds",
      caption: "Odds use only the right half of the same line (teal). The left half is greyed out — odds are never negative. Even chance is now at 1.",
    })}

    <p>How do we travel from a logit to odds? We need something that turns <em>any</em> number on
    the line — positive, negative, zero — into a <em>positive</em> number, and lands $0$ exactly
    on the even-chance point $1$. You met that something last section. It's the exponential:</p>

    $$\\text{odds} = e^{\\text{logit}}$$

    <p>It's a perfect fit. $e^{(\\text{big negative})}$ is a tiny positive number (long-shot odds),
    $e^0 = 1$ (even), and $e^{(\\text{big positive})}$ is huge (near-certain). Watch the
    even-chance points line up: logit $0$ becomes odds $1$.</p>

    <table class="dist-table">
      <thead><tr><th>Logit</th><th>Odds = $e^{\\text{logit}}$</th><th>In words</th></tr></thead>
      <tbody>
        <tr><td>$-2$</td><td>0.14</td><td>about 7 to 1 against</td></tr>
        <tr><td>$-1$</td><td>0.37</td><td>roughly 2.7 to 1 against</td></tr>
        <tr><td>$0$</td><td>1.00</td><td>even — 1 to 1</td></tr>
        <tr><td>$+1$</td><td>2.72</td><td>roughly 2.7 to 1 for</td></tr>
        <tr><td>$+2$</td><td>7.39</td><td>about 7 to 1 for</td></tr>
      </tbody>
    </table>

    ${T.callout(
      `<p>Look what the exponential's signature property does here. Last section:
       <strong>adding $1$ to the exponent multiplies the result by the base</strong>,
       $e^{x+1} = e \\cdot e^x$. On these scales that reads: <strong>each extra point of logit
       multiplies the odds by about $2.72$.</strong> Evidence that <em>adds</em> on the logit
       line <em>multiplies</em> on the odds ray. (And the reverse trip — odds back to a logit —
       uses a function called the natural log, written $\\ln$: the "undo" button for $e^x$, and the
       reason the logit is also called the <em>log-odds</em>. We'll meet the log properly later.)</p>`,
      { type: "", label: "Adding becomes multiplying" }
    )}

    <h2>Frame 3 — the unit interval: <em>probability</em></h2>

    <p>Finally, the everyday scale: a number between $0$ and $1$. Getting there from odds is pure
    bookkeeping. If the odds are "yes to no," then out of $\\text{odds} + 1$ total parts,
    "yes" claims $\\text{odds}$ of them:</p>

    $$p = \\frac{\\text{odds}}{\\text{odds} + 1}$$

    <p>So odds $1$ give $p = \\tfrac{1}{2}$; odds $7.39$ give $p = \\tfrac{7.39}{8.39} \\approx 0.88$;
    odds $0.14$ give $p = \\tfrac{0.14}{1.14} \\approx 0.12$. (Going the other way, the odds hidden
    in a probability are $\\text{odds} = \\dfrac{p}{1-p}$ — "yes over no.")</p>

    ${numLine({
      xMin: -0.6, xMax: 1.6, leftArrow: false, rightArrow: false,
      highlight: { from: 0, to: 1, color: "#0d9488" }, fadeOutside: true,
      points: [
        { x: 0, label: "0", color: "#8a93a6" },
        { x: 0.5, label: "½", color: "#4f46e5", sub: "even" },
        { x: 1, label: "1", color: "#8a93a6" },
      ],
      alt: "The interval from 0 to 1 highlighted, for probability",
      caption: "Zoomed in: probability is squeezed into the bounded interval 0 to 1 (teal), with hard walls at 0 and 1. Even chance sits at ½.",
    })}

    <h2>All three at once: the <em>sigmoid</em></h2>

    <p>Now chain the two bridges together. Start with a logit, exponentiate to get the odds, then
    turn the odds into a probability. To keep the algebra tidy, let's write $z$ for the logit
    (a standard shorthand for it). Our two bridges are then
    $\\text{odds} = e^{z}$ and $p = \\dfrac{\\text{odds}}{\\text{odds} + 1}$.</p>

    <p><strong>Step 1 — substitute the odds.</strong> Replace "odds" with $e^{z}$:</p>

    $$p = \\frac{e^{z}}{e^{z} + 1}$$

    <p>This is already correct — but the usual form is tidier, with a plain $1$ on top.
    <strong>Step 2 — multiply the top and bottom by $e^{-z}$.</strong> Scaling a fraction's
    numerator and denominator by the same amount never changes its value (it's just turning
    $\\tfrac12$ into $\\tfrac24$):</p>

    $$p = \\frac{e^{z}}{e^{z} + 1} \\cdot \\frac{e^{-z}}{e^{-z}}
        = \\frac{e^{z}\\cdot e^{-z}}{e^{z}\\cdot e^{-z} \\;+\\; 1\\cdot e^{-z}}$$

    <p><strong>Step 3 — use the exponent rule.</strong> Back in the exponential section,
    multiplying two powers <em>adds</em> their exponents, so
    $e^{z}\\cdot e^{-z} = e^{z-z} = e^{0} = 1$. That collapses the top to $1$ and the leading term
    on the bottom to $1$ as well (the other term, $1 \\cdot e^{-z}$, is just $e^{-z}$) — and since
    $z$ was only our shorthand for the logit:</p>

    $$p = \\frac{1}{1 + e^{-z}} = \\frac{1}{1 + e^{-\\text{logit}}}$$

    <p>This is the <strong>sigmoid</strong> (or <em>logistic</em>) function, often written
    $\\sigma$. It takes a logit from anywhere on the infinite number line and gently
    <strong>squashes</strong> it into a probability between $0$ and $1$. Here's the whole journey
    in one table — three columns, one belief:</p>

    <table class="dist-table">
      <thead><tr><th>Logit</th><th>Odds</th><th>Probability</th></tr></thead>
      <tbody>
        <tr><td>$-4$</td><td>0.018</td><td>1.8%</td></tr>
        <tr><td>$-2$</td><td>0.135</td><td>11.9%</td></tr>
        <tr><td>$0$</td><td>1.000</td><td>50.0%</td></tr>
        <tr><td>$+2$</td><td>7.389</td><td>88.1%</td></tr>
        <tr><td>$+4$</td><td>54.60</td><td>98.2%</td></tr>
      </tbody>
    </table>

    <p>Drag the logit below and watch all three frames move together — the point slides along the
    S-shaped curve, and the odds and probability update with it.</p>

    ${T.widget(
      "One belief, three scales",
      `<canvas id="sg-chart"></canvas>
       <div class="slider-row" style="grid-template-columns:auto 1fr 4em;margin-top:14px">
         <span class="slabel" style="white-space:nowrap">Logit</span>
         <input id="sg-logit" type="range" min="-6" max="6" step="0.1" value="0" />
         <span class="sval" id="sg-lval">0.0</span>
       </div>
       <div class="controls">
         <button class="btn ghost" data-logit="-2">Leaning no (−2)</button>
         <button class="btn ghost" data-logit="0">Even (0)</button>
         <button class="btn ghost" data-logit="2">Leaning yes (+2)</button>
       </div>
       <div class="readout">
         <div class="stat"><span class="label">Logit</span><span class="value" id="sg-logit-v">0.0</span></div>
         <div class="stat"><span class="label">Odds</span><span class="value" id="sg-odds-v">1.00</span></div>
         <div class="stat"><span class="label">Probability</span><span class="value" id="sg-prob-v">50%</span></div>
       </div>`
    )}

    <p>Notice the <strong>shape</strong> — it's the source of a lot of intuition:</p>
    <ul>
      <li>It passes through <strong>$(0, 0.5)$</strong>: a logit of zero is a coin flip, on every
      scale.</li>
      <li>It <strong>never quite reaches $0$ or $1$.</strong> Since $e^{-\\text{logit}}$ is always
      positive, the probability stays strictly inside $(0,1)$ — total certainty would need
      <em>infinite</em> evidence.</li>
      <li>It's <strong>steep in the middle, flat at the ends.</strong> Near $50/50$, a little more
      evidence swings the probability a lot; once you're already near-certain, piling on more
      evidence barely moves it. (Diminishing returns, drawn as a curve.)</li>
      <li>It's <strong>symmetric</strong>: flipping the sign of the logit flips "yes" into "no."
      A logit of $+2$ gives $88\\%$ for the event; $-2$ gives $88\\%$ <em>against</em> it
      (that's the $12\\%$).</li>
    </ul>

    ${T.callout(
      `<p>This is exactly how a model answers a single yes/no question — "is this review positive?",
       "is this transaction fraud?", "will this user click?" Inside, it produces a
       <strong>logit</strong>, then runs it through the <strong>sigmoid</strong> to report a clean
       probability. Logit to do the thinking, sigmoid to state the answer.</p>`,
      { type: "ai", label: "Where the sigmoid lives in AI" }
    )}

    <h2>What you learned</h2>
    <ul>
      <li>One belief about a yes/no event can be written three equivalent ways:
      <strong>logit</strong> $(-\\infty, \\infty)$, <strong>odds</strong> $(0, \\infty)$, and
      <strong>probability</strong> $(0, 1)$ — with even chance at $0$, $1$, and $0.5$.</li>
      <li>The bridges are this unit's functions: $\\text{odds} = e^{\\text{logit}}$ (always
      positive) and $p = \\dfrac{\\text{odds}}{\\text{odds}+1}$.</li>
      <li>Together they make the <strong>sigmoid</strong>
      $p = \\dfrac{1}{1+e^{-\\text{logit}}}$, which squashes the whole number line into $(0,1)$.</li>
      <li>Adding on the logit scale <strong>multiplies</strong> on the odds scale — the
      exponential property, made meaningful.</li>
    </ul>

    ${T.callout(
      `<p>One honest limit: this clean "logit $0$ means $50\\%$" story holds for a <strong>single
       yes/no event</strong>. When there are <em>many</em> competing outcomes — like which word
       comes next — the logits become <em>relative</em> (only their <em>differences</em> matter),
       so the single-event sigmoid no longer applies directly. Handling that case takes a
       multi-outcome cousin of the sigmoid.</p>`,
      { type: "note", label: "One important limit" }
    )}

  `;

  function onMount(root) {
    const canvas = root.querySelector("#sg-chart");
    if (!canvas) return;
    const slider = root.querySelector("#sg-logit");
    const lval = root.querySelector("#sg-lval");
    const logitV = root.querySelector("#sg-logit-v");
    const oddsV = root.querySelector("#sg-odds-v");
    const probV = root.querySelector("#sg-prob-v");

    let L = 0;
    const xMin = -6, xMax = 6;

    const sigmoid = (x) => 1 / (1 + Math.exp(-x));

    function fmtOdds(o) {
      if (o >= 10) return o.toFixed(1);
      if (o >= 1) return o.toFixed(2);
      return o.toFixed(3);
    }

    function updateReadouts() {
      const odds = Math.exp(L);
      const p = sigmoid(L);
      lval.textContent = L.toFixed(1);
      logitV.textContent = L.toFixed(1);
      oddsV.textContent = fmtOdds(odds);
      probV.textContent = (p * 100).toFixed(1) + "%";
    }

    function draw() {
      const { ctx, w, h } = T.fitCanvas(canvas, 260);
      ctx.clearRect(0, 0, w, h);
      const padL = 40, padR = 14, padT = 14, padB = 28;
      const x0 = padL, x1 = w - padR, yT = padT, yB = h - padB;
      const X = (x) => x0 + ((x - xMin) / (xMax - xMin)) * (x1 - x0);
      const Y = (p) => yB - p * (yB - yT);

      // horizontal gridlines + probability labels
      ctx.fillStyle = "#8a93a6";
      ctx.font = "11px -apple-system, sans-serif";
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      [0, 0.25, 0.5, 0.75, 1].forEach((p) => {
        ctx.strokeStyle = p === 0.5 ? "#dfe2ea" : "#eef0f4";
        ctx.beginPath(); ctx.moveTo(x0, Y(p)); ctx.lineTo(x1, Y(p)); ctx.stroke();
        ctx.fillText(p.toFixed(2), x0 - 6, Y(p));
      });

      // vertical gridlines + logit labels
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      for (let x = xMin; x <= xMax; x += 2) {
        ctx.strokeStyle = x === 0 ? "#dfe2ea" : "#f3f4f8";
        ctx.beginPath(); ctx.moveTo(X(x), yT); ctx.lineTo(X(x), yB); ctx.stroke();
        ctx.fillStyle = "#8a93a6";
        ctx.fillText((x > 0 ? "+" : "") + x, X(x), yB + 5);
      }

      // sigmoid curve
      ctx.strokeStyle = "#4f46e5";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let px = 0; px <= 1; px += 0.004) {
        const x = xMin + px * (xMax - xMin);
        const sx = X(x), sy = Y(sigmoid(x));
        if (px === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
      }
      ctx.stroke();

      // current point + guide lines
      const p = sigmoid(L);
      const cx = X(L), cy = Y(p);
      ctx.strokeStyle = "#0d9488";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 4]);
      ctx.beginPath(); ctx.moveTo(cx, yB); ctx.lineTo(cx, cy); ctx.stroke();   // up from axis
      ctx.beginPath(); ctx.moveTo(x0, cy); ctx.lineTo(cx, cy); ctx.stroke();   // left to axis
      ctx.setLineDash([]);
      ctx.fillStyle = "#0d9488";
      ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2); ctx.fill();

      // probability label near the point
      ctx.fillStyle = "#0d9488";
      ctx.font = "12px -apple-system, sans-serif";
      ctx.textAlign = L > 3 ? "right" : "left";
      ctx.textBaseline = "bottom";
      ctx.fillText((p * 100).toFixed(0) + "%", cx + (L > 3 ? -8 : 8), cy - 4);

      // axis titles
      ctx.fillStyle = "#8a93a6";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.font = "11px -apple-system, sans-serif";
      ctx.fillText("logit", (x0 + x1) / 2, h - 1);
    }

    function refresh() { updateReadouts(); draw(); }

    slider.addEventListener("input", () => {
      L = parseFloat(slider.value);
      refresh();
    });
    root.querySelectorAll("[data-logit]").forEach((b) =>
      b.addEventListener("click", () => {
        L = parseFloat(b.dataset.logit);
        slider.value = String(L);
        refresh();
      })
    );
    window.addEventListener("resize", draw);

    refresh();
  }

  window.SectionContent = window.SectionContent || {};
  window.SectionContent["logits-and-sigmoid"] = {
    title: "Logits, Odds & Probabilities",
    html,
    onMount,
  };
})();
