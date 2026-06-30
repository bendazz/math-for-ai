/* ============================================================
   Section: Probability Distributions
   Registered under id "prob-distributions" (see manifest.js).

   Centerpiece is one interactive "distribution builder": six
   sliders set the probability of each die face; a live bar chart
   + running sum make the "must add to 1" rule tactile; presets
   show uniform vs. non-uniform; "Normalize to 1" demonstrates
   normalization (the softmax move); and sampling rolls the die so
   observed frequencies converge onto the bars (extends Section 1's
   convergence idea to the non-uniform case).
   ============================================================ */

(function () {
  const T = window.Toolkit;

  const html = `
    <div class="eyebrow">Probability · Section 2</div>
    <h1>Probability Distributions</h1>

    <p>You've already built several of these without knowing the name. The weather
    list — sunny $0.6$, cloudy $0.3$, rainy $0.1$ — was one. The model's next-word
    list — dog $0.4$, cat $0.35$, bird $0.15$, fish $0.1$ — was another. Each is a
    complete rundown of <strong>every outcome and how likely it is</strong>. That
    object has a name: a <strong>probability distribution</strong>.</p>

    ${T.callout(
      `<p>A <strong>probability distribution</strong> is just the full list of all
       possible outcomes together with a probability for each one. Nothing new — it's
       the bookkeeping that holds everything you already know about an uncertain
       situation in one place.</p>`,
      { type: "", label: "The big idea" }
    )}

    <h2>Two rules, both already familiar</h2>

    <p>For a list of probabilities to be a <em>legitimate</em> distribution, it only
    has to obey the two rules you met in Section 1:</p>

    <ul>
      <li><strong>Rule 1 — every probability is between 0 and 1.</strong>
      $0 \\le P(\\text{outcome}) \\le 1$. No negative chances, nothing above certain.</li>
      <li><strong>Rule 2 — the probabilities add up to exactly 1.</strong>
      The outcomes cover every possibility and don't overlap, so together they account
      for <em>all</em> of the certainty there is.</li>
    </ul>

    <p>We can write a distribution as a table. Here is the weather example:</p>

    <table class="dist-table">
      <thead><tr><th>Outcome</th><th>Probability</th></tr></thead>
      <tbody>
        <tr><td>Sunny</td><td>$0.6$</td></tr>
        <tr><td>Cloudy</td><td>$0.3$</td></tr>
        <tr><td>Rainy</td><td>$0.1$</td></tr>
      </tbody>
      <tfoot><tr><td>Total</td><td>$1.0$</td></tr></tfoot>
    </table>

    <p>The same information is easier to <em>feel</em> as a picture: one bar per
    outcome, bar height = probability. The whole rest of this section is about reading
    and building these pictures.</p>

    <h2>Uniform vs. non-uniform</h2>

    <p>When every outcome is equally likely, all the bars are the same height — a
    <strong>uniform</strong> distribution. A fair die is the poster child: six faces,
    each with probability $\\tfrac{1}{6} \\approx 0.167$. That's exactly the
    "equally likely" case from Section 1, now seen as the special, flat-topped
    distribution.</p>

    <p>Most real distributions are <strong>non-uniform</strong> — some outcomes are
    likelier than others. A loaded die, tomorrow's weather, the next word a model
    picks: all lopsided. Use the builder below to make both kinds and watch the rules
    in action.</p>

    ${T.widget(
      "Build a distribution (a six-faced die)",
      `<canvas id="dist-chart"></canvas>
       <div class="slider-grid" id="dist-sliders"></div>
       <div class="controls">
         <button class="btn" data-preset="fair">Fair die</button>
         <button class="btn" data-preset="loaded">Loaded die</button>
         <button class="btn" data-preset="trick">Trick die</button>
         <button class="btn ghost" data-normalize>Normalize to 1</button>
         <button class="btn ghost" data-dist-reset>Reset</button>
       </div>
       <div class="readout">
         <div class="stat"><span class="label">Sum of probabilities</span><span class="value" id="dist-sum">1.00</span></div>
         <div class="stat"><span class="label">Valid distribution?</span><span class="value" id="dist-valid">—</span></div>
       </div>
       <div class="controls">
         <button class="btn" data-sample="300">Roll 300 times</button>
         <button class="btn ghost" data-sample-reset>Clear rolls</button>
         <div class="stat" style="margin-left:auto"><span class="label">Total rolls</span><span class="value" id="dist-rolls">0</span></div>
       </div>`
    )}

    <p>Three things to try:</p>
    <ul>
      <li>Drag any face <em>up</em> and watch the sum leave $1$ — the readout turns
      amber to warn you it's no longer a valid distribution.</li>
      <li>Press <strong>Normalize to 1</strong>. It scales every bar down (or up) by
      the same factor so they sum to $1$ again, <em>keeping their relative heights</em>.
      Turning a pile of raw scores into probabilities that sum to $1$ is exactly what an
      AI model does to its outputs — the operation is called the <em>softmax</em>.</li>
      <li>Pick <strong>Loaded die</strong>, then <strong>Roll 300 times</strong>. The
      hollow bars are what actually happened; they climb to meet the solid probability
      bars — the same long-run settling you saw with the fair coin, now for a lopsided
      distribution.</li>
    </ul>

    ${T.callout(
      `<p>Rolling reconnects the two halves of the idea. A distribution is a
       <em>prediction</em> about the long run: set face 6 to probability $0.5$ and, over
       many rolls, a $6$ really does come up about half the time. The bars aren't just
       decoration — they forecast the frequencies.</p>`,
      { type: "note", label: "Why sampling matters" }
    )}

    <h2>Worked example</h2>

    <p><strong>Is this a valid distribution?</strong> A game spinner is advertised as
    landing on $A$ with probability $0.5$, $B$ with $0.3$, $C$ with $0.4$.</p>
    <p>Check the rules. Each value is between $0$ and $1$ (Rule 1 ✓). But
    $0.5 + 0.3 + 0.4 = 1.2 \\ne 1$ (Rule 2 ✗). So <em>no</em> — it isn't a legitimate
    distribution as stated. If those three were meant to be the only outcomes, the
    numbers are wrong; normalizing them (divide each by $1.2$) would repair the totals
    to $0.417, 0.25, 0.333$.</p>

    <h2>Your turn</h2>

    ${(T.resetProblems(), "")}

    ${T.problem(
      `<p>A four-sided die has these probabilities: face 1 is $0.1$, face 2 is $0.2$,
       face 3 is $0.3$. There is no other information about face 4. What must
       $P(\\text{face }4)$ be for this to be a valid distribution?</p>`,
      `<p>The four faces are the only outcomes, so all four probabilities must add to $1$.</p>
       <p>$P(4) = 1 - (0.1 + 0.2 + 0.3) = 1 - 0.6 = 0.4.$</p>`
    )}

    ${T.problem(
      `<p>Someone proposes the distribution: red $0.5$, blue $0.6$, green $-0.1$.
       Give the <strong>two</strong> separate reasons this can't be a probability
       distribution.</p>`,
      `<p><strong>Reason 1 (Rule 1):</strong> $-0.1$ is negative; a probability can never
       be below $0$.</p>
       <p><strong>Reason 2 (Rule 2):</strong> the values sum to $0.5 + 0.6 - 0.1 = 1.0$ —
       which happens to total $1$, but that doesn't rescue it, because the negative entry
       already breaks Rule 1. Both rules must hold.</p>`
    )}

    ${T.problem(
      `<p>A model gives raw scores (not yet probabilities) to three next words:
       cat $3$, dog $1$, bird $0$. You decide to turn them into a distribution by
       <em>normalizing</em> — dividing each score by the total. What probability does
       each word get?</p>`,
      `<p>The scores total $3 + 1 + 0 = 4$. Divide each by $4$:</p>
       <p>$P(\\text{cat}) = \\tfrac{3}{4} = 0.75,\\quad
          P(\\text{dog}) = \\tfrac{1}{4} = 0.25,\\quad
          P(\\text{bird}) = \\tfrac{0}{4} = 0.$</p>
       <p>They're each between $0$ and $1$ and add to $1$ — a valid distribution. (Real
       models use softmax, a fancier normalizer that never assigns exactly $0$, but the
       spirit is identical: rescale raw scores so they sum to $1$.)</p>`
    )}

    ${T.problem(
      `<p>Two distributions over the same four outcomes both sum to $1$. Distribution A
       is $0.25, 0.25, 0.25, 0.25$. Distribution B is $0.7, 0.1, 0.1, 0.1$. Which one is
       uniform, and which one is a model "more confident" about its top choice?</p>`,
      `<p>Distribution A is <strong>uniform</strong> — all four outcomes equally likely,
       the flat case. Distribution B is non-uniform and piles most of its probability on
       the first outcome, so B represents <strong>more confidence</strong> in that top
       pick. A flat distribution is maximal uncertainty; a spiky one is confidence.</p>`
    )}

    ${T.callout(
      `<p>Everything a language model emits is a probability distribution over the next
       token — thousands of bars, one per possible word, all between $0$ and $1$ and
       summing to $1$. A flat distribution means "I'm unsure"; a spiky one means
       "I'm confident." The <em>temperature</em> setting literally reshapes these bars:
       low temperature sharpens them toward the top pick, high temperature flattens them
       toward uniform. You now have the exact mental picture that knob controls.</p>`,
      { type: "ai" }
    )}

    <h2>Key takeaways</h2>
    <ul>
      <li>A <strong>probability distribution</strong> lists every outcome with its probability.</li>
      <li>It's valid only if each probability is in $[0,1]$ <em>and</em> they sum to $1$.</li>
      <li><strong>Uniform</strong> = all outcomes equally likely (the flat case, like a fair die); most real distributions are <strong>non-uniform</strong>.</li>
      <li><strong>Normalizing</strong> rescales raw numbers so they sum to $1$ — how raw model scores become probabilities (softmax).</li>
      <li>A distribution predicts <strong>long-run frequencies</strong>: sample it many times and the observed bars climb to meet it.</li>
    </ul>
  `;

  function onMount(root) {
    const FACES = 6;
    const PRESETS = {
      fair:   [1/6, 1/6, 1/6, 1/6, 1/6, 1/6],
      loaded: [0.08, 0.10, 0.12, 0.15, 0.20, 0.35],
      trick:  [0.04, 0.04, 0.04, 0.04, 0.04, 0.80],
    };

    const canvas = root.querySelector("#dist-chart");
    if (!canvas) return;
    const sliderWrap = root.querySelector("#dist-sliders");
    const sumEl   = root.querySelector("#dist-sum");
    const validEl = root.querySelector("#dist-valid");
    const rollsEl = root.querySelector("#dist-rolls");

    let probs = PRESETS.fair.slice();      // current bar heights (0..1 each)
    let counts = new Array(FACES).fill(0); // observed roll counts
    let rolls = 0;

    // build slider rows
    const sliders = [];
    for (let i = 0; i < FACES; i++) {
      const row = document.createElement("div");
      row.className = "slider-row";
      row.innerHTML =
        `<span class="slabel">${i + 1}</span>` +
        `<input type="range" min="0" max="1" step="0.01" />` +
        `<span class="sval"></span>`;
      const input = row.querySelector("input");
      input.value = probs[i];
      input.addEventListener("input", () => {
        probs[i] = parseFloat(input.value);
        clearRolls();        // changing the distribution invalidates past rolls
        syncLabels();
        draw();
      });
      sliderWrap.appendChild(row);
      sliders.push(input);
    }

    function syncLabels() {
      const sum = probs.reduce((a, b) => a + b, 0);
      sliders.forEach((inp, i) => {
        inp.value = probs[i];
        inp.parentElement.querySelector(".sval").textContent = probs[i].toFixed(2);
      });
      sumEl.textContent = sum.toFixed(2);
      const valid = Math.abs(sum - 1) < 0.005;
      sumEl.className   = "value " + (valid ? "ok" : "bad");
      validEl.textContent = valid ? "Yes ✓" : "No — must total 1";
      validEl.className   = "value " + (valid ? "ok" : "bad");
    }

    function setProbs(arr) {
      probs = arr.slice();
      clearRolls();
      syncLabels();
      draw();
    }

    function normalize() {
      const sum = probs.reduce((a, b) => a + b, 0);
      if (sum <= 0) return;                 // can't normalize all-zero
      probs = probs.map((p) => p / sum);
      syncLabels();
      draw();
    }

    function clearRolls() {
      counts = new Array(FACES).fill(0);
      rolls = 0;
      rollsEl.textContent = "0";
    }

    function sample(n) {
      normalize();                          // can only sample a valid distribution
      const cum = [];
      let acc = 0;
      probs.forEach((p) => { acc += p; cum.push(acc); });
      for (let k = 0; k < n; k++) {
        const r = Math.random();
        let face = FACES - 1;
        for (let i = 0; i < FACES; i++) { if (r < cum[i]) { face = i; break; } }
        counts[face]++;
        rolls++;
      }
      rollsEl.textContent = rolls;
      draw();
    }

    function draw() {
      const { ctx, w, h } = T.fitCanvas(canvas, 240);
      ctx.clearRect(0, 0, w, h);
      const padL = 40, padR = 12, padT = 12, padB = 28;
      const x0 = padL, x1 = w - padR, y0 = padT, y1 = h - padB;
      const Y = (p) => y1 - p * (y1 - y0);  // probabilities run 0..1

      // gridlines + y labels at 0, 0.5, 1
      ctx.fillStyle = "#8a93a6";
      ctx.font = "12px -apple-system, sans-serif";
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      [0, 0.5, 1].forEach((p) => {
        ctx.fillText(p.toFixed(1), x0 - 8, Y(p));
        ctx.strokeStyle = "#eef0f4";
        ctx.beginPath(); ctx.moveTo(x0, Y(p)); ctx.lineTo(x1, Y(p)); ctx.stroke();
      });

      // dashed uniform reference at 1/6
      ctx.strokeStyle = "#0d9488";
      ctx.setLineDash([5, 5]);
      ctx.beginPath(); ctx.moveTo(x0, Y(1 / 6)); ctx.lineTo(x1, Y(1 / 6)); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#0d9488";
      ctx.textAlign = "left";
      ctx.textBaseline = "bottom";
      ctx.fillText("uniform 1/6", x0 + 2, Y(1 / 6) - 3);

      const slot = (x1 - x0) / FACES;
      const bw = slot * 0.6;
      for (let i = 0; i < FACES; i++) {
        const cx = x0 + slot * (i + 0.5);

        // solid probability bar
        const py = Y(probs[i]);
        ctx.fillStyle = "#4f46e5";
        ctx.fillRect(cx - bw / 2, py, bw, y1 - py);

        // hollow observed-frequency bar (only after rolling)
        if (rolls > 0) {
          const obs = counts[i] / rolls;
          const oy = Y(obs);
          ctx.strokeStyle = "#be123c";
          ctx.lineWidth = 2;
          ctx.strokeRect(cx - bw / 2, oy, bw, y1 - oy);
        }

        // face label
        ctx.fillStyle = "#515a6e";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText((i + 1).toString(), cx, y1 + 6);
      }

      // legend when rolls present
      if (rolls > 0) {
        ctx.textAlign = "right";
        ctx.textBaseline = "top";
        ctx.fillStyle = "#4f46e5";
        ctx.fillText("■ probability", x1, y0 - 2 + 0);
        ctx.fillStyle = "#be123c";
        ctx.fillText("▭ observed", x1, y0 + 14);
      }
    }

    // wire controls
    root.querySelectorAll("[data-preset]").forEach((b) =>
      b.addEventListener("click", () => setProbs(PRESETS[b.dataset.preset]))
    );
    root.querySelector("[data-normalize]").addEventListener("click", normalize);
    root.querySelector("[data-dist-reset]").addEventListener("click", () => setProbs(PRESETS.fair));
    root.querySelectorAll("[data-sample]").forEach((b) =>
      b.addEventListener("click", () => sample(parseInt(b.dataset.sample, 10)))
    );
    root.querySelector("[data-sample-reset]").addEventListener("click", () => { clearRolls(); draw(); });
    window.addEventListener("resize", draw);

    syncLabels();
    draw();
  }

  window.SectionContent = window.SectionContent || {};
  window.SectionContent["prob-distributions"] = {
    title: "Probability Distributions",
    html,
    onMount,
  };
})();
