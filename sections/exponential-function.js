/* ============================================================
   Section: The Exponential Function
   Registered under id "exponential-function" (see manifest.js).
   A pure-MATH interlude inside the "Probability Meets AI" unit,
   motivated by softmax/temperature: the e^x in that formula is
   worth understanding on its own. No calculus.

   Teaches: adding vs. multiplying (linear vs. exponential), the
   function b^x and its key facts (through (0,1), always positive,
   negative exponents = reciprocals, the +1-in-exponent = ×b
   property), and the number e via compound interest.

   The section deliberately STOPS at e. The "why AI uses e^x"
   payoff is held for a later section; practice problems live in
   their own section ("exponential-practice").

   One canvas widget (onMount): a b^x grapher with a base slider,
   a "use e" button, a straight-line comparison, and live value
   chips. Dynamic readouts use plain Unicode superscripts (KaTeX
   only typesets once, before onMount).

   KaTeX/$ note: auto-render pairs $...$ only within a single text
   node, so a lone currency $ (isolated in its own cell/sentence)
   renders literally and is safe; only collisions with real math
   in the same text node need escaping/rewording.
   ============================================================ */

(function () {
  const T = window.Toolkit;

  const html = `
    <div class="eyebrow">Probability Meets AI · 5</div>
    <h1>The Exponential Function</h1>

    <p>When we sketched the temperature formula, one symbol was quietly doing all the work:
    $e^x$, the <strong>exponential function</strong>. Before we turn that knob, let's actually
    understand the machine behind it — because $e^x$ is one of the most important functions in
    all of mathematics, it shows up everywhere from money to populations to physics, and
    (good news) you can understand it completely <strong>without any calculus.</strong> This
    section is a genuine math lesson, worth knowing in its own right.</p>

    <h2>Two ways to grow: adding vs. multiplying</h2>

    <p>Imagine two savings plans, both starting at $1.</p>
    <ul>
      <li><strong>Plan A (add):</strong> every day you add $1.</li>
      <li><strong>Plan B (multiply):</strong> every day your money <em>doubles</em>.</li>
    </ul>

    <table class="dist-table">
      <thead><tr><th>Day</th><th>Plan A — add $1</th><th>Plan B — double</th></tr></thead>
      <tbody>
        <tr><td>0</td><td>$1</td><td>$1</td></tr>
        <tr><td>1</td><td>$2</td><td>$2</td></tr>
        <tr><td>2</td><td>$3</td><td>$4</td></tr>
        <tr><td>3</td><td>$4</td><td>$8</td></tr>
        <tr><td>4</td><td>$5</td><td>$16</td></tr>
        <tr><td>5</td><td>$6</td><td>$32</td></tr>
        <tr><td>6</td><td>$7</td><td>$64</td></tr>
        <tr><td>…</td><td>…</td><td>…</td></tr>
        <tr><td>10</td><td>$11</td><td>$1,024</td></tr>
      </tbody>
    </table>

    <p>For a few days they look comparable. Then Plan B detonates. That's the whole personality
    of exponential growth: <strong>repeated multiplication by a fixed factor</strong> beats
    repeated addition so badly it isn't a contest. Plan A grows by a constant <em>amount</em>
    (a straight line); Plan B grows by a constant <em>factor</em> (an exponential).</p>

    ${T.callout(
      `<p>This is why "grew exponentially" means "exploded." The factor doesn't have to be 2 —
       any constant multiplier (×3, ×1.5, ×0.9) gives exponential behavior. The number you
       multiply by each step is called the <strong>base</strong>.</p>`,
      { type: "", label: "The key distinction" }
    )}

    <h2>The function $b^x$</h2>

    <p>Write the base as $b$. Multiplying by $b$ a total of $x$ times is exactly what the
    notation $b^x$ means. For Plan B, $b = 2$: after $x$ days you have $2^x$ dollars, so
    $2^{10} = 1024$ matches the table. Whole-number exponents are just repeated multiplication —
    and mathematics smoothly fills in all the values <em>between</em> the whole numbers, giving
    one continuous curve $y = b^x$.</p>

    <p>Four facts are worth knowing by heart:</p>
    <ul>
      <li><strong>$b^0 = 1$.</strong> Anything to the zero power is $1$, so the curve always
      passes through the point $(0, 1)$.</li>
      <li><strong>$b^1 = b$.</strong> One step of growth is just the base itself.</li>
      <li><strong>$b^x$ is always positive.</strong> You start at $1$ and only ever multiply by
      a positive number, so the output never hits $0$ and <em>never goes negative</em> — no
      matter what $x$ is.</li>
      <li><strong>Negative exponents undo the growth.</strong> $b^{-x} = \\dfrac{1}{b^x}$, a
      number between $0$ and $1$. For example $2^{-1} = \\tfrac12$, $2^{-2} = \\tfrac14$. As $x$
      goes more negative the value shrinks toward $0$ but never reaches it.</li>
    </ul>

    <p>And one property that's the secret to everything: <strong>adding $1$ to the exponent
    multiplies the answer by $b$.</strong></p>

    $$b^{x+1} = b \\cdot b^x$$

    <p>So equal <em>steps</em> along the bottom turn into equal <em>multiplications</em> up the
    side. Take steps of $1$ with $b = 2$ and the outputs march $1, 2, 4, 8, 16$ — each one
    double the last. Hold onto this; it's the heart of how the exponential behaves.</p>

    <p>Play with the curve. Drag the <strong>base</strong> and watch the shape; flip on the
    straight line to see how fast multiplying outruns adding — and notice the exponential never
    dips below zero, while the line happily does.</p>

    ${T.widget(
      "The curve $y = b^x$",
      `<canvas id="ef-chart"></canvas>
       <div class="slider-row" style="grid-template-columns:auto 1fr 5.5em;margin-top:14px">
         <span class="slabel" style="white-space:nowrap">Base b</span>
         <input id="ef-base" type="range" min="1.2" max="4" step="0.1" value="2" />
         <span class="sval" id="ef-bval">2.0</span>
       </div>
       <div class="controls">
         <button class="btn ghost" id="ef-e">Use e ≈ 2.718</button>
         <label style="display:flex;align-items:center;gap:7px;font-size:.9rem;cursor:pointer">
           <input type="checkbox" id="ef-lin" checked style="width:17px;height:17px;accent-color:var(--accent)" />
           compare to a straight line
         </label>
       </div>
       <div id="ef-vals" style="margin-top:14px;font-family:var(--font-mono);font-size:.84rem;color:var(--ink-soft);line-height:1.6"></div>`
    )}

    <h2>A very special base: the number $e$</h2>

    <p>Any base bigger than $1$ gives this explode-upward shape. But mathematicians have a
    favorite, written $e$, with the never-ending value</p>

    $$e = 2.718281828\\ldots$$

    <p>Like $\\pi$, it's a constant that simply <em>falls out</em> of nature — and here's a
    calculus-free way to watch it appear. Put a single dollar in a magical account paying
    100% interest in one year. If that interest is handed over all at once, you end the year
    with two dollars. But what if it's paid in smaller, more frequent installments, each one
    then itself earning interest?</p>

    <table class="dist-table">
      <thead><tr><th>Interest paid…</th><th>Formula</th><th>Year-end total</th></tr></thead>
      <tbody>
        <tr><td>once</td><td>(1 + 1/1)¹</td><td>2.000</td></tr>
        <tr><td>twice</td><td>(1 + 1/2)²</td><td>2.250</td></tr>
        <tr><td>monthly</td><td>(1 + 1/12)¹²</td><td>2.613</td></tr>
        <tr><td>daily</td><td>(1 + 1/365)³⁶⁵</td><td>2.715</td></tr>
        <tr><td>every instant</td><td>→ as often as possible</td><td>2.71828… = e</td></tr>
      </tbody>
    </table>

    <p>Compound the growth as finely as you possibly can and the year-end total stops climbing
    at a specific ceiling: $e$. That's what $e$ <em>is</em> — the result of growth that's
    happening continuously, every instant. The function $e^x$ is so central it earns a name of
    its own: <strong>the natural exponential function</strong>. Its graph is the same family of
    curve you've been dragging above, with the base pinned to $e \\approx 2.718$.</p>

    ${T.callout(
      `<p>Honest aside for the curious: nothing forces the base to be $e$ — any base above $1$
       gives the same explode-upward behavior. $e$ earns its special status because it makes a
       lot of higher mathematics come out clean. For now, what matters is the <em>behavior</em>
       of $e^x$: it's the same curve you just explored.</p>`,
      { type: "note", label: "Why e and not 2 or 10?" }
    )}

    <h2>What you learned</h2>
    <ul>
      <li><strong>Exponential = repeated multiplication</strong> by a fixed base $b$ — it
      outruns linear (repeated addition) dramatically.</li>
      <li>$b^x$ passes through $(0,1)$, is <strong>always positive</strong>, and is never zero
      or negative — no matter what $x$ is.</li>
      <li>Equal steps in $x$ turn into equal <strong>multiplications</strong> of the output
      ($b^{x+1} = b \\cdot b^x$); negative exponents give reciprocals between $0$ and $1$.</li>
      <li>$e \\approx 2.718$ is the natural base — the ceiling of continuous growth — and $e^x$
      is the most important exponential of all.</li>
    </ul>

  `;

  function onMount(root) {
    const canvas = root.querySelector("#ef-chart");
    if (!canvas) return;
    const slider = root.querySelector("#ef-base");
    const bval = root.querySelector("#ef-bval");
    const eBtn = root.querySelector("#ef-e");
    const linChk = root.querySelector("#ef-lin");
    const valsEl = root.querySelector("#ef-vals");

    let b = 2;

    const xMin = -3, xMax = 3, yMin = -1, yMax = 8;

    function fmt(v) {
      if (v >= 100) return String(Math.round(v));
      if (v >= 1) return String(Math.round(v * 100) / 100);
      return String(Math.round(v * 1000) / 1000);
    }

    function updateVals() {
      const exps = [
        ["⁻²", -2], ["⁻¹", -1], ["⁰", 0], ["¹", 1], ["²", 2], ["³", 3],
      ];
      const parts = exps.map(([sup, e]) => `b${sup} = ${fmt(Math.pow(b, e))}`);
      valsEl.textContent = "b = " + (Math.round(b * 1000) / 1000) + "   →   " + parts.join("   ·   ");
    }

    function draw() {
      const { ctx, w, h } = T.fitCanvas(canvas, 270);
      ctx.clearRect(0, 0, w, h);
      const padL = 38, padR = 14, padT = 14, padB = 26;
      const x0 = padL, x1 = w - padR, yT = padT, yB = h - padB;
      const X = (x) => x0 + ((x - xMin) / (xMax - xMin)) * (x1 - x0);
      const Y = (y) => yB - ((y - yMin) / (yMax - yMin)) * (yB - yT);

      // grid
      ctx.strokeStyle = "#eef0f4";
      ctx.lineWidth = 1;
      ctx.fillStyle = "#8a93a6";
      ctx.font = "11px -apple-system, sans-serif";
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      [0, 1, 2, 4, 8].forEach((y) => {
        ctx.beginPath(); ctx.moveTo(x0, Y(y)); ctx.lineTo(x1, Y(y)); ctx.stroke();
        ctx.fillText(String(y), x0 - 6, Y(y));
      });
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      for (let x = xMin; x <= xMax; x++) {
        ctx.strokeStyle = "#f3f4f8";
        ctx.beginPath(); ctx.moveTo(X(x), yT); ctx.lineTo(X(x), yB); ctx.stroke();
        ctx.fillStyle = "#8a93a6";
        ctx.fillText(String(x), X(x), yB + 5);
      }

      // bold zero axes (y = 0 line, x = 0 line)
      ctx.strokeStyle = "#c7ccd8";
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(x0, Y(0)); ctx.lineTo(x1, Y(0)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(X(0), yT); ctx.lineTo(X(0), yB); ctx.stroke();

      // comparison straight line: y = 1 + (b-1)x  (matches b^x at x=0 and x=1)
      if (linChk.checked) {
        ctx.strokeStyle = "#9aa3b2";
        ctx.lineWidth = 1.8;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        let started = false;
        for (let px = 0; px <= 1; px += 0.01) {
          const x = xMin + px * (xMax - xMin);
          const y = 1 + (b - 1) * x;
          if (y < yMin - 0.5 || y > yMax + 0.5) { started = false; continue; }
          const sx = X(x), sy = Y(y);
          if (!started) { ctx.moveTo(sx, sy); started = true; } else ctx.lineTo(sx, sy);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // the exponential curve y = b^x
      ctx.strokeStyle = "#4f46e5";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      let started = false;
      for (let px = 0; px <= 1; px += 0.005) {
        const x = xMin + px * (xMax - xMin);
        const y = Math.pow(b, x);
        if (y > yMax + 0.5) { started = false; continue; }
        const sx = X(x), sy = Y(y);
        if (!started) { ctx.moveTo(sx, sy); started = true; } else ctx.lineTo(sx, sy);
      }
      ctx.stroke();

      // mark (0, 1)
      ctx.fillStyle = "#4f46e5";
      ctx.beginPath(); ctx.arc(X(0), Y(1), 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#515a6e";
      ctx.textAlign = "left";
      ctx.textBaseline = "bottom";
      ctx.font = "11px -apple-system, sans-serif";
      ctx.fillText("(0, 1)", X(0) + 7, Y(1) - 3);

      // legend
      ctx.textAlign = "right";
      ctx.textBaseline = "top";
      ctx.fillStyle = "#4f46e5";
      ctx.font = "12px -apple-system, sans-serif";
      ctx.fillText("y = b^x", x1, yT - 2);
      if (linChk.checked) {
        ctx.fillStyle = "#9aa3b2";
        ctx.fillText("straight line", x1, yT + 14);
      }
    }

    function refresh() { updateVals(); draw(); }

    slider.addEventListener("input", () => {
      b = parseFloat(slider.value);
      bval.textContent = (Math.round(b * 10) / 10).toFixed(1);
      refresh();
    });
    eBtn.addEventListener("click", () => {
      b = Math.E;
      slider.value = "2.7";
      bval.textContent = "e ≈ 2.718";
      refresh();
    });
    linChk.addEventListener("change", draw);
    window.addEventListener("resize", draw);

    refresh();
  }

  window.SectionContent = window.SectionContent || {};
  window.SectionContent["exponential-function"] = {
    title: "The Exponential Function",
    html,
    onMount,
  };
})();
