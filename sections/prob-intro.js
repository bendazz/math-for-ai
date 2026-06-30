/* ============================================================
   Section: What Is Probability?
   Registered under id "prob-intro" (see sections/manifest.js).

   A section is just an object with:
     - title   (optional, for the tab title)
     - html    (a string, or a function returning a string)
     - onMount (optional, wires up interactive widgets)
   Structure inside html is entirely up to you — there is no
   required template.
   ============================================================ */

(function () {
  const T = window.Toolkit;
  T.resetProblems();

  const html = `
    <div class="eyebrow">Probability · Section 1</div>
    <h1>What Is Probability?</h1>

    <p>Ask an AI assistant to finish the sentence <em>"The weather today is
    ___"</em> and, under the hood, it does not pick one word with certainty.
    It weighs the options: maybe <em>sunny</em> is fairly likely, <em>cold</em>
    a bit less so, <em>purple</em> almost never. In other words, the machine is
    reasoning about <strong>how likely</strong> each possibility is. That single
    idea — putting a number on how likely something is — is
    <strong>probability</strong>, and it is the mathematical heart of nearly
    every modern AI system.</p>

    ${T.callout(
      `<p>Before any AI, probability is just the math of <strong>uncertainty</strong>:
       coin flips, dice, drawing a card, tomorrow's weather. We'll start with those
       everyday examples because the ideas are exactly the same ones an AI uses — only
       the dressing changes.</p>`,
      { type: "", label: "The big idea" }
    )}

    <h2>A number between 0 and 1</h2>

    <p>The probability of an event is a number that measures how likely it is to
    happen. We always put it on the same scale:</p>

    <ul>
      <li><strong>0</strong> means the event is <strong>impossible</strong> — it never happens.</li>
      <li><strong>1</strong> means the event is <strong>certain</strong> — it always happens.</li>
      <li>Anything in between measures the shades of "maybe." A value of
      <strong>½</strong> means a perfectly even chance.</li>
    </ul>

    ${T.probabilityScale()}

    <p>We write the probability of an event $E$ as $P(E)$, read aloud as
    <em>"the probability of $E$."</em> So every probability obeys:</p>

    $$0 \\le P(E) \\le 1.$$

    <p>You'll also see probabilities written as fractions ($\\tfrac{1}{2}$),
    decimals ($0.5$), or percentages ($50\\%$) — they're three ways of saying
    the same thing.</p>

    <h2>Counting equally likely outcomes</h2>

    <p>When every possible outcome is <strong>equally likely</strong>, finding a
    probability is just careful counting. List all the outcomes, count the ones
    you care about, and divide:</p>

    $$P(E) = \\frac{\\text{number of outcomes in } E}{\\text{total number of equally likely outcomes}}.$$

    <p><strong>A coin.</strong> A fair coin has two equally likely outcomes:
    heads or tails. So</p>

    $$P(\\text{heads}) = \\frac{1}{2} = 0.5.$$

    <p><strong>A die.</strong> A standard die has six equally likely faces. The
    probability of rolling a $4$ is</p>

    $$P(4) = \\frac{1}{6} \\approx 0.167,$$

    <p>and the probability of rolling an <em>even</em> number (a $2$, $4$, or $6$ —
    three of the six faces) is</p>

    $$P(\\text{even}) = \\frac{3}{6} = \\frac{1}{2}.$$

    ${T.callout(
      `<p>The phrase "equally likely" is doing a lot of work. A <em>fair</em> coin or
       a <em>fair</em> die is one where every outcome really does have the same chance.
       Later we'll handle <em>unfair</em> situations — which is exactly what an AI faces,
       since "sunny" and "purple" are <em>not</em> equally likely next words.</p>`,
      { type: "note" }
    )}

    <h2>What does ½ actually mean? Flip and see.</h2>

    <p>Saying "the probability of heads is ½" does <em>not</em> mean that in any
    two flips you'll get exactly one head. Flip a coin twice and you might get two
    heads. The ½ shows up in the <strong>long run</strong>: over many, many flips,
    the fraction of heads settles closer and closer to one-half. Try it.</p>

    ${T.widget(
      "Coin-flip simulator",
      `<canvas id="coin-chart"></canvas>
       <div class="controls">
         <button class="btn" data-flip="1">Flip once</button>
         <button class="btn" data-flip="10">Flip 10</button>
         <button class="btn" data-flip="100">Flip 100</button>
         <button class="btn ghost" data-coin-reset>Reset</button>
       </div>
       <div class="readout">
         <div class="stat"><span class="label">Flips</span><span class="value" id="coin-n">0</span></div>
         <div class="stat"><span class="label">Heads</span><span class="value" id="coin-h">0</span></div>
         <div class="stat"><span class="label">Tails</span><span class="value" id="coin-t">0</span></div>
         <div class="stat"><span class="label">Fraction heads</span><span class="value" id="coin-p">—</span></div>
       </div>`
    )}

    <p>Notice how jumpy the line is at first and how it calms down and hugs the
    ½ mark as the flips pile up. This settling-down is one of the most important
    facts in all of probability — it's what lets us trust an average computed from
    lots of data, which is precisely how AI systems learn from examples.</p>

    <h2>More than two outcomes: a die</h2>

    <p>A die has six faces, each with probability $\\tfrac{1}{6}$. If outcomes
    are equally likely, then over many rolls each face should appear about
    equally often. Roll a few and watch the six bars try to even out.</p>

    ${T.widget(
      "Die-roll simulator",
      `<canvas id="die-chart"></canvas>
       <div class="controls">
         <button class="btn" data-roll="1">Roll once</button>
         <button class="btn" data-roll="60">Roll 60</button>
         <button class="btn ghost" data-die-reset>Reset</button>
       </div>
       <div class="readout">
         <div class="stat"><span class="label">Total rolls</span><span class="value" id="die-n">0</span></div>
       </div>`
    )}

    <p>The dashed line marks $\\tfrac{1}{6}$ — the share each face <em>should</em>
    get. With only a handful of rolls the bars are lopsided; with hundreds they
    flatten toward that line.</p>

    <h2>Worked examples</h2>

    <p><strong>Example 1 — a single die.</strong> What is the probability of
    rolling a number greater than $4$?</p>
    <p>The faces greater than $4$ are $5$ and $6$ — that's $2$ outcomes out of
    $6$. So $P(\\text{greater than }4) = \\tfrac{2}{6} = \\tfrac{1}{3} \\approx 0.33.$</p>

    <p><strong>Example 2 — a bag of marbles.</strong> A bag holds $3$ red, $2$
    blue, and $5$ green marbles. You draw one without looking. What is
    $P(\\text{blue})$?</p>
    <p>There are $3 + 2 + 5 = 10$ equally likely marbles, $2$ of which are blue,
    so $P(\\text{blue}) = \\tfrac{2}{10} = \\tfrac{1}{5} = 0.2.$</p>

    <h2>Your turn</h2>

    ${T.problem(
      `<p>A fair die is rolled once. What is the probability of rolling an odd
       number?</p>`,
      `<p>The odd faces are $1$, $3$, and $5$ — three outcomes out of six.</p>
       <p>$P(\\text{odd}) = \\dfrac{3}{6} = \\dfrac{1}{2} = 0.5.$</p>`
    )}

    ${T.problem(
      `<p>A standard deck has $52$ cards, $13$ of which are hearts. If you draw one
       card at random, what is the probability it is a heart? Give your answer as a
       fraction and a percentage.</p>`,
      `<p>There are $52$ equally likely cards and $13$ hearts, so</p>
       <p>$P(\\text{heart}) = \\dfrac{13}{52} = \\dfrac{1}{4} = 25\\%.$</p>`
    )}

    ${T.problem(
      `<p>The weather model assigns these probabilities to tomorrow's sky:
       sunny $0.6$, cloudy $0.3$, rainy $0.1$. (a) Do these make sense together?
       (b) What is the probability it is <em>not</em> sunny?</p>`,
      `<p><strong>(a)</strong> They're each between $0$ and $1$, and they add to
       $0.6 + 0.3 + 0.1 = 1$ — exactly what we expect when the options cover every
       possibility and don't overlap. So yes.</p>
       <p><strong>(b)</strong> "Not sunny" is everything else: $0.3 + 0.1 = 0.4$.
       Equivalently, $1 - 0.6 = 0.4$. We'll lean on that "$1 - P$" shortcut a lot
       later.</p>`
    )}

    ${T.problem(
      `<p>You flip a fair coin $4$ times and get heads every time. A friend says
       "it's basically certain the next flip is tails — it's overdue." Are they
       right?</p>`,
      `<p>No. The coin has no memory. Each flip is its own fresh experiment with
       $P(\\text{heads}) = \\tfrac{1}{2}$, regardless of what came before. The
       long-run settling toward ½ that you saw in the simulator happens because new
       flips <em>dilute</em> early streaks, not because the coin "corrects" itself.
       Believing otherwise is so common it has a name: the
       <em>gambler's fallacy</em>.</p>`
    )}

    ${T.callout(
      `<p>When a language model reads your prompt and chooses the next word, it
       produces a list of candidate words each tagged with a probability — just like
       sunny/cloudy/rainy above, those numbers are all between $0$ and $1$ and add up
       to $1$. A setting called <em>temperature</em> then decides whether it boldly
       takes the most likely word or samples more adventurously. Everything in this
       course is building toward understanding that picture.</p>`,
      { type: "ai" }
    )}

    <h2>Key takeaways</h2>
    <ul>
      <li>A probability is a number from $0$ (impossible) to $1$ (certain); $\\tfrac{1}{2}$ is an even chance.</li>
      <li>When outcomes are equally likely, $P(E) = \\dfrac{\\text{favorable outcomes}}{\\text{total outcomes}}$.</li>
      <li>Probability describes the <strong>long run</strong>, not any single trial — and trials don't remember each other.</li>
      <li>The probabilities of all distinct possibilities add up to $1$.</li>
    </ul>
  `;

  function onMount(root) {
    /* ---------------- Coin simulator ---------------- */
    (function coin() {
      const canvas = root.querySelector("#coin-chart");
      if (!canvas) return;
      const nEl = root.querySelector("#coin-n");
      const hEl = root.querySelector("#coin-h");
      const tEl = root.querySelector("#coin-t");
      const pEl = root.querySelector("#coin-p");

      let heads = 0, total = 0;
      const history = []; // running fraction of heads after each flip

      function draw() {
        const { ctx, w, h } = T.fitCanvas(canvas, 220);
        ctx.clearRect(0, 0, w, h);
        const padL = 44, padR = 12, padT = 12, padB = 26;
        const x0 = padL, x1 = w - padR, y0 = padT, y1 = h - padB;
        const X = (i, n) => x0 + (n <= 1 ? 0 : (i / (n - 1)) * (x1 - x0));
        const Y = (p) => y1 - p * (y1 - y0);

        // axes labels 0, 0.5, 1
        ctx.fillStyle = "#8a93a6";
        ctx.font = "12px -apple-system, sans-serif";
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        [0, 0.5, 1].forEach((p) => {
          ctx.fillText(p.toString(), x0 - 8, Y(p));
          ctx.strokeStyle = "#eef0f4";
          ctx.beginPath(); ctx.moveTo(x0, Y(p)); ctx.lineTo(x1, Y(p)); ctx.stroke();
        });

        // target line at 0.5
        ctx.strokeStyle = "#c7cbff";
        ctx.setLineDash([5, 5]);
        ctx.beginPath(); ctx.moveTo(x0, Y(0.5)); ctx.lineTo(x1, Y(0.5)); ctx.stroke();
        ctx.setLineDash([]);

        // the running-fraction line
        if (history.length) {
          ctx.strokeStyle = "#4f46e5";
          ctx.lineWidth = 2;
          ctx.beginPath();
          history.forEach((p, i) => {
            const x = X(i, history.length), y = Y(p);
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          });
          ctx.stroke();
        } else {
          ctx.fillStyle = "#b8bfce";
          ctx.textAlign = "center";
          ctx.fillText("Press a button to start flipping", (x0 + x1) / 2, (y0 + y1) / 2);
        }
      }

      function flip(n) {
        for (let i = 0; i < n; i++) {
          if (Math.random() < 0.5) heads++;
          total++;
          history.push(heads / total);
        }
        nEl.textContent = total;
        hEl.textContent = heads;
        tEl.textContent = total - heads;
        pEl.textContent = total ? (heads / total).toFixed(3) : "—";
        draw();
      }

      function reset() {
        heads = 0; total = 0; history.length = 0;
        nEl.textContent = "0"; hEl.textContent = "0";
        tEl.textContent = "0"; pEl.textContent = "—";
        draw();
      }

      root.querySelectorAll("[data-flip]").forEach((b) =>
        b.addEventListener("click", () => flip(parseInt(b.dataset.flip, 10)))
      );
      root.querySelector("[data-coin-reset]").addEventListener("click", reset);
      window.addEventListener("resize", draw);
      draw();
    })();

    /* ---------------- Die simulator ---------------- */
    (function die() {
      const canvas = root.querySelector("#die-chart");
      if (!canvas) return;
      const nEl = root.querySelector("#die-n");
      const counts = [0, 0, 0, 0, 0, 0];
      let total = 0;

      function draw() {
        const { ctx, w, h } = T.fitCanvas(canvas, 220);
        ctx.clearRect(0, 0, w, h);
        const padL = 36, padR = 12, padT = 12, padB = 28;
        const x0 = padL, x1 = w - padR, y0 = padT, y1 = h - padB;

        // y is "fraction of rolls"; show up to a sensible ceiling
        const fractions = counts.map((c) => (total ? c / total : 0));
        const ceil = Math.max(0.35, ...fractions) * 1.15;
        const Y = (f) => y1 - (f / ceil) * (y1 - y0);

        // gridlines + labels
        ctx.fillStyle = "#8a93a6";
        ctx.font = "12px -apple-system, sans-serif";
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        [0, ceil / 2, ceil].forEach((f) => {
          ctx.fillText(f.toFixed(2), x0 - 8, Y(f));
          ctx.strokeStyle = "#eef0f4";
          ctx.beginPath(); ctx.moveTo(x0, Y(f)); ctx.lineTo(x1, Y(f)); ctx.stroke();
        });

        // bars
        const slot = (x1 - x0) / 6;
        const bw = slot * 0.62;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        for (let i = 0; i < 6; i++) {
          const cx = x0 + slot * (i + 0.5);
          const fy = Y(fractions[i]);
          ctx.fillStyle = "#4f46e5";
          ctx.fillRect(cx - bw / 2, fy, bw, y1 - fy);
          ctx.fillStyle = "#515a6e";
          ctx.fillText((i + 1).toString(), cx, y1 + 6);
        }

        // theoretical 1/6 line
        ctx.strokeStyle = "#0d9488";
        ctx.setLineDash([5, 5]);
        ctx.beginPath(); ctx.moveTo(x0, Y(1 / 6)); ctx.lineTo(x1, Y(1 / 6)); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "#0d9488";
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom";
        ctx.fillText("1/6", x0 + 2, Y(1 / 6) - 2);
      }

      function roll(n) {
        for (let i = 0; i < n; i++) {
          counts[Math.floor(Math.random() * 6)]++;
          total++;
        }
        nEl.textContent = total;
        draw();
      }

      function reset() {
        for (let i = 0; i < 6; i++) counts[i] = 0;
        total = 0;
        nEl.textContent = "0";
        draw();
      }

      root.querySelectorAll("[data-roll]").forEach((b) =>
        b.addEventListener("click", () => roll(parseInt(b.dataset.roll, 10)))
      );
      root.querySelector("[data-die-reset]").addEventListener("click", reset);
      window.addEventListener("resize", draw);
      draw();
    })();
  }

  window.SectionContent = window.SectionContent || {};
  window.SectionContent["prob-intro"] = {
    title: "What Is Probability?",
    html,
    onMount,
  };
})();
