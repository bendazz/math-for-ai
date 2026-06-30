/* ============================================================
   Section: When "Random" Means 7
   Registered under id "random-integer" (see manifest.js).
   Fourth section of the "Probability Meets AI" unit.

   One sentence carries the whole lesson: "Select a random
   integer between 1 and 10." Students expect the UNIFORM
   distribution they studied (each number 0.10). They get a
   lumpy, human-shaped distribution with a tower at 7 — because
   the model predicts likely HUMAN text, and humans asked the
   same thing also pick 7. "Random" out of an LLM means "what a
   person would probably write," not "what a die would roll."

   Centerpiece = an in-page SIMULATOR (onMount, reuses fitCanvas)
   that samples a realistic 1-10 distribution (7 ~ 0.72) against
   a dashed "uniform = 0.10" reference line, so the gap between
   expectation and reality is visible as the asks pile up.

   The hidden distribution is illustrative but faithful to the
   literature (7 dominant, odds > evens, extremes rare). Effect
   magnitude verified June 2026 vs. Coronado-Blázquez 2025,
   "Deterministic or probabilistic? The psychology of LLMs as
   random number generators" (arXiv:2502.19965) — several models
   pick 7 ~80% of the time for 1-10.

   Reuses the Lab 4 generator + the tally uploader for the real
   activity; no new flow to build.
   ============================================================ */

(function () {
  const T = window.Toolkit;

  // A realistic (illustrative) distribution for an LLM answering
  // "pick a random integer 1-10": 7 towers, odds beat evens,
  // the extremes barely appear. Sums to 1.
  const DIST = [
    { n: 1,  p: 0.01 },
    { n: 2,  p: 0.02 },
    { n: 3,  p: 0.07 },
    { n: 4,  p: 0.02 },
    { n: 5,  p: 0.05 },
    { n: 6,  p: 0.02 },
    { n: 7,  p: 0.72 },
    { n: 8,  p: 0.02 },
    { n: 9,  p: 0.05 },
    { n: 10, p: 0.02 },
  ];
  const UNIFORM = 0.10; // what students expect: 1/10 each

  const html = `
    <div class="eyebrow">Probability Meets AI · 4</div>
    <h1>When "Random" Means 7</h1>

    <p>Here's a prompt so plain it looks like a waste of time:</p>

    <blockquote style="margin:1.1em 0;padding:.6em 1.1em;border-left:4px solid var(--accent);background:var(--accent-soft);border-radius:8px;font-size:1.05rem">
      <em>"Select a random integer between 1 and 10."</em>
    </blockquote>

    <p>You already know what the answer <em>should</em> look like over many tries. Ten
    outcomes, no reason to prefer any one of them — the <strong>uniform distribution</strong>
    from earlier: every number with probability $\\tfrac{1}{10} = 0.10$, ten bars all the same
    height. Picture that flat chart in your head and <strong>commit to the prediction</strong>
    before you run the widget.</p>

    ${T.callout(
      `<p>Write it down: "If I ask a model for a random number 1–10 a few hundred times, the
       tally will be roughly <strong>flat</strong> — about 10% on each number." Hold onto that
       prediction. We're about to test it.</p>`,
      { type: "", label: "Make your prediction first" }
    )}

    <h2>Run the experiment</h2>

    <p>Each "ask" draws one number the way a real model does. The dashed line marks
    <strong>0.10</strong> — the flat result you predicted. Ask a few hundred times and watch
    where the bars actually settle.</p>

    ${T.widget(
      "Ask the model for a random integer (1–10)",
      `<canvas id="ri-chart"></canvas>
       <div class="controls">
         <button class="btn" data-ask="10">Ask 10</button>
         <button class="btn" data-ask="50">Ask 50</button>
         <button class="btn" data-ask="200">Ask 200</button>
         <button class="btn ghost" data-reveal>Reveal the model's real shape</button>
         <button class="btn ghost" data-reset>Reset</button>
       </div>
       <div class="readout">
         <div class="stat"><span class="label">Times asked</span><span class="value" id="ri-n">0</span></div>
         <div class="stat"><span class="label">Share that were 7</span><span class="value" id="ri-seven">—</span></div>
       </div>`
    )}

    <p>Your prediction just broke. The result isn't flat — it's a <strong>skyscraper at 7</strong>
    with a scatter of rubble around it. And look closer at the rubble: the
    <strong>odd</strong> numbers (3, 5, 9) poke up higher than the <strong>even</strong> ones
    next to them, and the <strong>extremes</strong> — 1 and 10 — almost never come up at all.
    More asks don't fix this; they make the lopsided shape <em>sharper</em>. The tally is
    converging, exactly as it should — just not to the distribution you assumed.</p>

    ${T.callout(
      `<p>This is the cleanest "uniform vs. non-uniform" lesson in the whole course. You
       <em>expected</em> uniform because nothing about "1 to 10" favors a number. The model
       hands you a <strong>strongly non-uniform</strong> distribution anyway. The shape is the
       surprise — so the obvious question is <em>where does it come from?</em></p>`,
      { type: "", label: "Not a bug — a shape" }
    )}

    <h2>Why on earth does it pick 7?</h2>

    <p>Here's the thing to internalize: <strong>the model is not rolling a die.</strong> There's
    no random-number generator hiding inside it. When you ask for a "random integer," the model
    does the only thing it ever does — it predicts the <strong>text a human would most likely
    write next</strong>. And it has read millions of humans being asked this exact question.</p>

    <p>So the real question becomes: when <em>people</em> are told "pick a random number from 1
    to 10," what do they say? Overwhelmingly, they say <strong>7</strong>. People reason
    (without noticing) like this:</p>

    <ul>
      <li><strong>1 and 10 feel too obvious</strong> — they're the edges, so they don't "feel
      random." Out they go.</li>
      <li><strong>5 feels like the boring middle</strong>, and <strong>even numbers feel less
      random</strong> than odd ones. Down they go.</li>
      <li><strong>7 is left standing</strong> — odd, prime, off-center, not an edge. To a human
      it just <em>feels</em> like the most random pick. So that's what people write.</li>
    </ul>

    <p>The model learned that pattern perfectly and reproduces it. It isn't malfunctioning — it's
    succeeding at its real job (imitate human text) on a task where we <em>wanted</em> something
    humans are bad at (being uniformly random). It's holding up a <strong>mirror to us.</strong></p>

    ${T.callout(
      `<p>This is measured, not a fluke. In one study spanning <strong>75,600 requests</strong>
       across six different language models, several picked 7 about <strong>80% of the time</strong>
       for the 1–10 range — and humans show the very same tilt toward 7 (a 200,000-person survey
       on 1–100 found people flock to numbers containing 7). The bias is baked into the training
       text, so nearly every model inherits it.</p>`,
      { type: "note", label: "This is a real, documented effect" }
    )}

    ${T.callout(
      `<p>The deep lesson for building AI: when you ask a language model for something
       "random," you don't get mathematical randomness — you get <strong>the most probable
       human answer</strong>, which is reliably lopsided. If your app genuinely needs a fair,
       uniform random number (a dice game, a raffle, a coin flip), <strong>don't ask the
       model</strong> — use an actual random-number generator. Knowing the difference is the
       kind of judgment that separates someone who <em>uses</em> AI from someone who
       <em>understands</em> it.</p>`,
      { type: "ai", label: "What this means for building with AI" }
    )}

    <h2>Now measure it yourself</h2>

    <p>You already built every tool you need for this — no new flow required. Use the machine
    from the last two sections:</p>

    <ol class="steps">
      <li>Go back to <strong>Lab 4</strong>'s generator and set the sentence to
      <strong>Select a random integer between 1 and 10</strong> (you can drop the <code>___</code> —
      it's a full instruction this time). Set N to <strong>50</strong> and download the
      <strong>prompts.csv</strong>.</li>
      <li>Run your Langflow loop on it to produce a fresh <strong>results.csv</strong>.</li>
      <li>Bring that file to <strong>"Your Data: Tabulate the Results"</strong> and upload it.
      Watch your own tower rise — almost certainly on 7.</li>
    </ol>

    ${T.callout(
      `<p>Two great things to try: (1) compare your chart with a classmate using a
       <em>different</em> model (Gemini vs. Claude) — the 7-bias usually shows up in both,
       which is the whole point. (2) Change the prompt to <em>"between 1 and 100"</em> and see
       which numbers win — you'll spot 7s everywhere (7, 17, 37, 77).</p>`,
      { type: "", label: "Push it further" }
    )}

    <h2>What you just showed</h2>
    <ul>
      <li>A model asked for a "random" number returns a <strong>strongly non-uniform</strong>
      distribution — not the flat one you'd expect.</li>
      <li>The reason is that a model <strong>predicts likely human text</strong>; it has no real
      randomizer, so it inherits human biases like the love of 7.</li>
      <li>You uncovered that hidden distribution the same way as always: <strong>sample many
      times and tally.</strong></li>
    </ul>

    ${T.callout(
      `<p>Notice we still haven't touched the <strong>temperature</strong> knob — this lopsided
       7-tower is the model's <em>natural</em> shape at its default setting. There's a setting that
       can reshape a distribution like this one, sharpening or flattening it on command. You now
       have a vivid, surprising distribution to experiment with.</p>`,
      { type: "", label: "The shape isn't fixed" }
    )}

    <h2>Your turn</h2>

    ${(T.resetProblems(), "")}

    ${T.problem(
      `<p>You predicted each number would come up about $0.10$ of the time. After 100 asks you
       got <em>7</em> seventy-three times. Is the model's distribution uniform? What's your
       estimate $\\hat{P}(7)$, and how does it compare to what you expected?</p>`,
      `<p>Definitely <strong>not uniform</strong>. Your estimate is
       $\\hat{P}(7) = \\tfrac{73}{100} = 0.73$ — more than <strong>seven times</strong> the
       $0.10$ you'd expect under a fair, uniform draw. One outcome carrying most of the
       probability is the signature of a spiky, non-uniform distribution.</p>`
    )}

    ${T.problem(
      `<p>In your tally, 1 and 10 almost never appear. Give the reason in terms of <em>how the
       model produces its answer</em> — not "the model is broken."</p>`,
      `<p>The model isn't generating a random number; it's predicting the word a human would
       likely write. People feel the endpoints 1 and 10 are "too obvious" to count as random, so
       they rarely say them — and the model, trained on that human text, rarely says them either.
       The model is faithfully copying a human habit, which is exactly what it's built to do.</p>`
    )}

    ${T.problem(
      `<p>A classmate says: "If I need a fair random number 1–10 for a board-game app, I'll just
       ask the AI for one each turn." What's wrong with that plan, and what should they do
       instead?</p>`,
      `<p>An LLM's "random" number isn't fair — it'll land on 7 most of the time and almost never
       on 1 or 10, so the game would be badly skewed. For genuine uniform randomness they should
       use an actual random-number generator (a line of code, a dice library, a hardware RNG),
       not a language model. Use each tool for the job it's actually good at.</p>`
    )}
  `;

  function onMount(root) {
    const canvas = root.querySelector("#ri-chart");
    if (!canvas) return;
    const nEl = root.querySelector("#ri-n");
    const sevenEl = root.querySelector("#ri-seven");

    let counts = DIST.map(() => 0);
    let total = 0;
    let revealed = false;

    // cumulative thresholds for sampling
    const cum = [];
    let acc = 0;
    DIST.forEach((d) => { acc += d.p; cum.push(acc); });

    function reset() {
      counts = DIST.map(() => 0);
      total = 0;
      revealed = false;
      nEl.textContent = "0";
      sevenEl.textContent = "—";
      draw();
    }

    function ask(n) {
      for (let k = 0; k < n; k++) {
        const r = Math.random();
        let idx = DIST.length - 1;
        for (let i = 0; i < DIST.length; i++) { if (r < cum[i]) { idx = i; break; } }
        counts[idx]++;
        total++;
      }
      nEl.textContent = total;
      const sevenIdx = DIST.findIndex((d) => d.n === 7);
      sevenEl.textContent = total ? Math.round((counts[sevenIdx] / total) * 100) + "%" : "—";
      draw();
    }

    function draw() {
      const { ctx, w, h } = T.fitCanvas(canvas, 250);
      ctx.clearRect(0, 0, w, h);
      const padL = 42, padR = 12, padT = 16, padB = 32;
      const x0 = padL, x1 = w - padR, y0 = padT, y1 = h - padB;
      const yMax = 0.8;
      const Y = (p) => y1 - (p / yMax) * (y1 - y0);

      // y gridlines + labels
      ctx.fillStyle = "#8a93a6";
      ctx.font = "12px -apple-system, sans-serif";
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      [0, 0.4, 0.8].forEach((p) => {
        ctx.fillText(p.toFixed(1), x0 - 8, Y(p));
        ctx.strokeStyle = "#eef0f4";
        ctx.beginPath(); ctx.moveTo(x0, Y(p)); ctx.lineTo(x1, Y(p)); ctx.stroke();
      });

      const slot = (x1 - x0) / DIST.length;
      const bw = slot * 0.62;
      DIST.forEach((d, i) => {
        const cx = x0 + slot * (i + 0.5);
        const obs = total ? counts[i] / total : 0;
        const oy = Y(obs);
        ctx.fillStyle = "#4f46e5";
        ctx.fillRect(cx - bw / 2, oy, bw, y1 - oy);

        // true-probability marker (revealed)
        if (revealed) {
          const ty = Y(d.p);
          ctx.strokeStyle = "#0d9488";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(cx - bw / 2 - 3, ty);
          ctx.lineTo(cx + bw / 2 + 3, ty);
          ctx.stroke();
        }

        // x label (the number)
        ctx.fillStyle = "#515a6e";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.font = "12px -apple-system, sans-serif";
        ctx.fillText(d.n, cx, y1 + 6);
      });

      // dashed "uniform = 0.10" reference line
      const uy = Y(UNIFORM);
      ctx.save();
      ctx.strokeStyle = "#b45309";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 4]);
      ctx.beginPath(); ctx.moveTo(x0, uy); ctx.lineTo(x1, uy); ctx.stroke();
      ctx.restore();
      ctx.fillStyle = "#b45309";
      ctx.textAlign = "right";
      ctx.textBaseline = "bottom";
      ctx.font = "11px -apple-system, sans-serif";
      ctx.fillText("uniform = 0.10 (what you expected)", x1, uy - 3);

      // legend
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillStyle = "#4f46e5";
      ctx.fillText("■ your tally", x0, y0 - 6);
      if (revealed) {
        ctx.fillStyle = "#0d9488";
        ctx.textAlign = "center";
        ctx.fillText("— true distribution", (x0 + x1) / 2, y0 - 6);
      }
      if (!total) {
        ctx.fillStyle = "#b8bfce";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "14px -apple-system, sans-serif";
        ctx.fillText("Press “Ask” and watch where the bars land", (x0 + x1) / 2, (y0 + y1) / 2);
      }
    }

    root.querySelectorAll("[data-ask]").forEach((b) =>
      b.addEventListener("click", () => ask(parseInt(b.dataset.ask, 10)))
    );
    root.querySelector("[data-reveal]").addEventListener("click", () => {
      revealed = !revealed;
      draw();
    });
    root.querySelector("[data-reset]").addEventListener("click", reset);
    window.addEventListener("resize", draw);

    reset();
  }

  window.SectionContent = window.SectionContent || {};
  window.SectionContent["random-integer"] = {
    title: "When “Random” Means 7",
    html,
    onMount,
  };
})();
