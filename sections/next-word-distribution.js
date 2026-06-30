/* ============================================================
   Section: The Next Word Is a Distribution
   Registered under id "next-word-distribution" (see manifest.js).
   First section of the "Probability Meets AI" bridge unit.

   Goal: make "a language model samples its next word from a
   probability distribution" tangible by having students ASK a
   model to pick the next word many times and tally the results —
   the coin-flip simulator from Section 1, but the coin is an AI
   and the faces are words. NO temperature yet (next sections).

   Two layers:
     1) an in-page SIMULATOR (onMount) that samples preset
        next-word distributions so the convergence is visible
        without Langflow;
     2) the real Langflow activity (build a "pick the next word"
        bot, run it repeatedly, tally and draw the bars by hand).
   ============================================================ */

(function () {
  const T = window.Toolkit;

  // Preset "model" distributions over candidate next words, chosen to
  // range from spiky (confident) to flat (unsure).
  const SENTENCES = [
    {
      text: "The opposite of hot is ___",
      shape: "very spiky — the model is almost certain",
      words: [
        { w: "cold", p: 0.88 },
        { w: "cool", p: 0.06 },
        { w: "warm", p: 0.04 },
        { w: "freezing", p: 0.02 },
      ],
    },
    {
      text: "I poured myself a cup of ___",
      shape: "medium — a clear favorite, but real competition",
      words: [
        { w: "coffee", p: 0.45 },
        { w: "tea", p: 0.28 },
        { w: "water", p: 0.17 },
        { w: "juice", p: 0.10 },
      ],
    },
    {
      text: "My favorite animal is the ___",
      shape: "flat — the model is genuinely unsure",
      words: [
        { w: "dog", p: 0.26 },
        { w: "cat", p: 0.24 },
        { w: "lion", p: 0.20 },
        { w: "tiger", p: 0.16 },
        { w: "panda", p: 0.14 },
      ],
    },
  ];

  const html = `
    <div class="eyebrow">Probability Meets AI · 1</div>
    <h1>The Next Word Is a Distribution</h1>

    <p>You've spent several sections on probability distributions — lists of outcomes,
    each with a probability, all adding to $1$. And you've built a chatbot. This section
    is where those two things become <strong>the same thing</strong>. We've said it in
    passing a few times; now you're going to <em>see</em> it with your own hands.</p>

    ${T.callout(
      `<p>A language model writes by choosing <strong>one word at a time</strong>. For each
       next word it builds a probability distribution over the candidates — a list like
       <em>cold</em> $0.88$, <em>cool</em> $0.06$, … — and then <strong>samples</strong> one,
       exactly the way you'd draw a marble from a bag. Different draws give different words.
       That's the whole reason a chatbot can answer the same question two different ways.</p>`,
      { type: "", label: "The big idea" }
    )}

    <p>Here's the catch: the model never shows you those bars directly. But you already
    know how to <em>uncover</em> a hidden distribution — you did it with the coin and the
    die in Section 1. Run the experiment many times and <strong>tally</strong> the
    outcomes; the fractions you get settle toward the real probabilities. Let's do that to
    a model.</p>

    <h2>Watch it happen (simulation)</h2>

    <p>The widget below stands in for a real model: each "ask" draws one next word from a
    hidden distribution. Pick a sentence, ask it many times, and watch the bars of
    <em>observed</em> words climb. Then reveal the model's true distribution and see how
    close your tally got.</p>

    ${T.widget(
      "Ask the model for the next word",
      `<div class="controls" id="nw-sentences"></div>
       <p style="margin:.6em 0 0"><strong>Sentence:</strong> <span id="nw-text"></span></p>
       <p style="margin:.2em 0 .2em; color:var(--ink-faint); font-size:.9rem">Last word drawn:
         <strong id="nw-last" style="color:var(--accent-ink)">—</strong></p>
       <canvas id="nw-chart"></canvas>
       <div class="controls">
         <button class="btn" data-ask="1">Ask once</button>
         <button class="btn" data-ask="10">Ask 10</button>
         <button class="btn" data-ask="50">Ask 50</button>
         <button class="btn ghost" data-reveal>Reveal true distribution</button>
         <button class="btn ghost" data-nw-reset>Reset</button>
       </div>
       <div class="readout">
         <div class="stat"><span class="label">Times asked</span><span class="value" id="nw-n">0</span></div>
       </div>`
    )}

    <p>Three things to notice — they're the heart of this whole unit:</p>
    <ul>
      <li><strong>The tally settles.</strong> With a handful of asks the bars are lopsided
      and jumpy; with fifty they hug the true distribution. Same long-run convergence you
      saw with the coin landing on ½.</li>
      <li><strong>"The opposite of hot is ___" is spiky.</strong> Almost every ask returns
      <em>cold</em>. A spiky distribution means the model is <strong>confident</strong>.</li>
      <li><strong>"My favorite animal is the ___" is flat.</strong> The asks spread across
      many words. A flat distribution means the model is <strong>unsure</strong> — there's
      no single right next word.</li>
    </ul>

    ${T.callout(
      `<p>Spiky versus flat is exactly the distinction you drew by hand back in the
       distributions practice — now it's coming out of a real model's behavior, not a
       textbook table. Confidence <em>is</em> a shape.</p>`,
      { type: "ai", label: "Connecting back" }
    )}

    <h2>Now do it for real, in Langflow</h2>

    <p>Open the chatbot you built (Gemini or Claude — either works). You're going to turn it
    into a one-word-at-a-time word picker and run the experiment yourself.</p>

    <ol class="steps">
      <li>Open your flow and click <strong>Playground</strong>.</li>
      <li>Send this exact message:<br>
      <em>"Here is a sentence with a blank: 'I poured myself a cup of ___'. Reply with only
      ONE word that could fill the blank — just the word, lowercase, no punctuation, no
      explanation."</em></li>
      <li>Write down the single word it returns.</li>
      <li><strong>Clear the chat</strong> (or start a fresh session) and send the
      <em>same</em> message again. Record the new word.</li>
      <li>Repeat until you have <strong>15–20</strong> words. Keep a tally: a mark next to
      each word every time it appears.</li>
      <li><strong>Draw the bar chart by hand</strong> — one bar per distinct word, bar
      height = how often it came up — just like the distributions practice. That chart is
      <em>your estimate of the model's hidden distribution.</em></li>
    </ol>

    ${T.callout(
      `<p>Why clear the chat between asks? So each run is an <strong>independent</strong>
       draw — a fresh experiment that doesn't remember the last one. It's the same point
       that sank the gambler's fallacy in Section 1: trials don't remember each other. If
       you <em>don't</em> clear it, the model sees its earlier answers and may just copy
       them, which spoils the tally.</p>`,
      { type: "note", label: "One important rule: start fresh each time" }
    )}

    ${T.callout(
      `<p>Real models are a little messy: now and then one slips in a period or an extra
       word despite your instructions. Just record the first word and move on — and if it
       gets chatty, tighten the prompt ("<em>one word only</em>"). Don't expect perfection;
       expect a distribution.</p>`,
      { type: "warn", label: "Heads up" }
    )}

    <p>Try it on two sentences: a near-certain one like
    <em>"The opposite of hot is ___"</em> and a wide-open one like
    <em>"My favorite animal is the ___"</em>. Compare your two bar charts. One should come
    out spiky, the other flat — and now you can say exactly what that means about how sure
    the model is.</p>

    <h2>What you just showed</h2>
    <ul>
      <li>A chatbot's next word is a <strong>sample from a probability distribution</strong>, not a fixed answer.</li>
      <li>Run it many times and <strong>tally</strong>, and the observed fractions reveal that hidden distribution — the same trick you used on the coin and die.</li>
      <li><strong>Spiky = confident, flat = unsure.</strong> The shape of the distribution <em>is</em> the model's certainty.</li>
    </ul>

    ${T.callout(
      `<p>We deliberately left one thing alone: the <strong>temperature</strong> knob. Right
       now you're seeing the model's <em>natural</em> distribution. In the next sections
       we'll turn that knob and watch these very bars sharpen and flatten on command — and
       dig into how the model decides on the numbers in the first place.</p>`,
      { type: "", label: "Where we're headed next" }
    )}

    <h2>Your turn</h2>

    ${(T.resetProblems(), "")}

    ${T.problem(
      `<p>You ask a model "The capital of France is ___" twenty times and get
       <em>Paris</em> nineteen times and <em>France</em> once. Sketch the distribution in
       words: is the model confident or unsure, and is this distribution spiky or flat?</p>`,
      `<p>Nineteen of twenty asks land on the same word, so the observed distribution is
       $P(\\text{Paris}) \\approx \\tfrac{19}{20} = 0.95$ with a tiny sliver elsewhere — a
       <strong>spiky</strong> distribution. A spiky shape means the model is
       <strong>confident</strong>. (That's the right behavior here: there really is one
       correct answer.)</p>`
    )}

    ${T.problem(
      `<p>A classmate tallies "I want to be a ___ when I grow up" and gets: doctor 5,
       teacher 4, artist 4, scientist 4, pilot 3 (out of 20 asks). Is the model confident
       or unsure here? Why does that make sense?</p>`,
      `<p>The 20 asks spread almost evenly across five different words — no single word
       dominates — so the distribution is <strong>flat</strong>, meaning the model is
       <strong>unsure</strong>. That's appropriate: there's no single correct next word, so
       a good model spreads its probability across many reasonable options.</p>`
    )}

    ${T.problem(
      `<p>After only 4 asks, your tally is coffee 3, tea 1, so you conclude
       $P(\\text{coffee}) = 0.75$ exactly. Why should you be cautious about that number?</p>`,
      `<p>Four draws is far too few — early tallies are jumpy, exactly like getting 3 heads
       in the first 4 coin flips. The fraction only settles toward the true probability
       after <em>many</em> asks. With 4 asks, $\\tfrac{3}{4}$ is a rough hint, not a
       reliable estimate; run 50 and it will likely move.</p>`
    )}
  `;

  function onMount(root) {
    const canvas = root.querySelector("#nw-chart");
    if (!canvas) return;
    const selWrap = root.querySelector("#nw-sentences");
    const textEl = root.querySelector("#nw-text");
    const lastEl = root.querySelector("#nw-last");
    const nEl = root.querySelector("#nw-n");

    let si = 0;                 // current sentence index
    let counts = [];            // observed counts per word
    let total = 0;
    let revealed = false;

    // build sentence selector buttons
    SENTENCES.forEach((s, i) => {
      const b = document.createElement("button");
      b.className = "btn" + (i === 0 ? "" : " ghost");
      b.textContent = `Sentence ${i + 1}`;
      b.addEventListener("click", () => {
        si = i;
        selWrap.querySelectorAll("button").forEach((btn, j) =>
          btn.className = "btn" + (j === i ? "" : " ghost")
        );
        reset();
      });
      selWrap.appendChild(b);
    });

    function words() { return SENTENCES[si].words; }

    function reset() {
      counts = words().map(() => 0);
      total = 0;
      revealed = false;
      textEl.textContent = SENTENCES[si].text;
      lastEl.textContent = "—";
      nEl.textContent = "0";
      draw();
    }

    function ask(n) {
      const ws = words();
      const cum = [];
      let acc = 0;
      ws.forEach((x) => { acc += x.p; cum.push(acc); });
      let lastWord = "";
      for (let k = 0; k < n; k++) {
        const r = Math.random();
        let idx = ws.length - 1;
        for (let i = 0; i < ws.length; i++) { if (r < cum[i]) { idx = i; break; } }
        counts[idx]++;
        total++;
        lastWord = ws[idx].w;
      }
      lastEl.textContent = lastWord;
      nEl.textContent = total;
      draw();
    }

    function draw() {
      const { ctx, w, h } = T.fitCanvas(canvas, 240);
      ctx.clearRect(0, 0, w, h);
      const ws = words();
      const padL = 40, padR = 12, padT = 14, padB = 30;
      const x0 = padL, x1 = w - padR, y0 = padT, y1 = h - padB;
      const Y = (p) => y1 - p * (y1 - y0);

      // y gridlines + labels 0, 0.5, 1
      ctx.fillStyle = "#8a93a6";
      ctx.font = "12px -apple-system, sans-serif";
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      [0, 0.5, 1].forEach((p) => {
        ctx.fillText(p.toFixed(1), x0 - 8, Y(p));
        ctx.strokeStyle = "#eef0f4";
        ctx.beginPath(); ctx.moveTo(x0, Y(p)); ctx.lineTo(x1, Y(p)); ctx.stroke();
      });

      const slot = (x1 - x0) / ws.length;
      const bw = slot * 0.6;
      ws.forEach((word, i) => {
        const cx = x0 + slot * (i + 0.5);

        // observed-frequency bar (filled)
        const obs = total ? counts[i] / total : 0;
        const oy = Y(obs);
        ctx.fillStyle = "#4f46e5";
        ctx.fillRect(cx - bw / 2, oy, bw, y1 - oy);

        // true-probability marker (revealed)
        if (revealed) {
          const ty = Y(word.p);
          ctx.strokeStyle = "#0d9488";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(cx - bw / 2 - 3, ty);
          ctx.lineTo(cx + bw / 2 + 3, ty);
          ctx.stroke();
        }

        // word label
        ctx.fillStyle = "#515a6e";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.font = "12px -apple-system, sans-serif";
        ctx.fillText(word.w, cx, y1 + 6);
      });

      // legend
      ctx.textAlign = "right";
      ctx.textBaseline = "top";
      ctx.fillStyle = "#4f46e5";
      ctx.fillText("■ your tally", x1, y0 - 4);
      if (revealed) {
        ctx.fillStyle = "#0d9488";
        ctx.fillText("— true distribution", x1, y0 + 12);
      }
      if (!total) {
        ctx.fillStyle = "#b8bfce";
        ctx.textAlign = "center";
        ctx.fillText("Press “Ask” to start", (x0 + x1) / 2, (y0 + y1) / 2);
      }
    }

    root.querySelectorAll("[data-ask]").forEach((b) =>
      b.addEventListener("click", () => ask(parseInt(b.dataset.ask, 10)))
    );
    root.querySelector("[data-reveal]").addEventListener("click", () => {
      revealed = !revealed;
      draw();
    });
    root.querySelector("[data-nw-reset]").addEventListener("click", reset);
    window.addEventListener("resize", draw);

    reset();
  }

  window.SectionContent = window.SectionContent || {};
  window.SectionContent["next-word-distribution"] = {
    title: "The Next Word Is a Distribution",
    html,
    onMount,
  };
})();
