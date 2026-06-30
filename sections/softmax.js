/* ============================================================
   Section: Softmax — From Scores to a Distribution
   Registered under id "softmax" (see manifest.js).
   The multi-outcome generalization of the sigmoid: turn a LIST of
   logits (one per candidate) into a probability distribution over
   all of them. Pays off the "logits become relative" loose end
   from logits-and-sigmoid.

   Builds only on tools already taught:
     - exponential (e^x always positive; exaggerates gaps;
       e^{a+b}=e^a·e^b)  [exponential-function]
     - "make it sum to 1" normalization  [prob-distributions]
   No log needed (that's only for the backward direction).

   Recipe: P_i = e^{z_i} / sum_j e^{z_j}  (exponentiate, normalize).
   Key properties: valid distribution; keeps ranking; exaggerates
   the leader; ONLY DIFFERENCES MATTER (shift-invariance, proved
   with the exponent rule). Sigmoid = the two-outcome case.

   Interactive (onMount): four logit sliders -> live softmax bars;
   an "add 1 to every logit" button shows the bars DON'T move
   (shift-invariance); reset.

   No forward lead-in at the end (per no-forward-leadins). No
   currency $ (only math $...$).
   ============================================================ */

(function () {
  const T = window.Toolkit;

  const html = `
    <div class="eyebrow">Probability Meets AI · 7</div>
    <h1>Softmax: From Scores to a Distribution</h1>

    <p>The sigmoid handled a single <strong>yes/no</strong> question by turning one logit into one
    probability. But a language model almost never faces a yes/no choice — it picks the next word
    from <em>thousands</em> of candidates; the "random number" model picks among ten. Each
    candidate gets its own score. So the real question is bigger:</p>

    ${T.callout(
      `<p>Given a whole <strong>list of logits</strong> — one score per option — how do we turn it
       into a single <strong>probability distribution</strong> over all the options: every
       probability $\\ge 0$, and the whole set summing to $1$? The tool that does it is called
       <strong>softmax</strong>.</p>`,
      { type: "", label: "The question" }
    )}

    <h2>The setup: one logit per option</h2>

    <p>Take a concrete case — completing <em>"I poured myself a cup of ___"</em>. Suppose the model
    scores four candidates with these logits (just numbers on the line, exactly like before, one
    per word):</p>

    <p style="text-align:center"><em>coffee</em>: $2$ &nbsp;&nbsp; <em>tea</em>: $1$ &nbsp;&nbsp;
    <em>water</em>: $0$ &nbsp;&nbsp; <em>juice</em>: $-1$.</p>

    <p>Higher score = the model likes that word more, but these raw numbers aren't probabilities:
    they're not between $0$ and $1$, and they don't add to anything in particular. We need to
    <strong>convert the whole list at once</strong> into a proper distribution — obeying the two
    rules you learned way back: each probability is non-negative, and they sum to $1$.</p>

    <h2>The recipe: exponentiate, then normalize</h2>

    <p>It's two steps, and you already know both of them.</p>

    <p><strong>Step 1 — exponentiate every score.</strong> Replace each logit $z$ with $e^{z}$.
    This is the exponential doing its two jobs from earlier: it makes every score
    <strong>positive</strong> (so it can be a probability weight), and it
    <strong>exaggerates the gaps</strong> between scores.</p>

    <p><strong>Step 2 — normalize.</strong> Add up all those weights, then divide each one by the
    total. That's the same "make it sum to $1$" move you've done on distributions before — and now
    the numbers <em>are</em> a probability distribution. Written out:</p>

    $$P_i = \\frac{e^{z_i}}{e^{z_1} + e^{z_2} + \\cdots + e^{z_k}} = \\frac{e^{z_i}}{\\sum_j e^{z_j}}$$

    <p>That $\\sum_j e^{z_j}$ is just shorthand: the symbol $\\sum$ ("sigma") means
    <strong>add them all up</strong> — here, add $e^{z_j}$ over every option $j$. The top is one
    option's weight; the bottom is the grand total of all the weights.</p>

    <p>Run it on our cup-of-coffee scores (reading $e^{z}$ off the exponential table from earlier):</p>

    <table class="dist-table">
      <thead><tr><th>Word</th><th>Logit $z$</th><th>Weight $e^{z}$</th><th>Probability</th></tr></thead>
      <tbody>
        <tr><td>coffee</td><td>$2$</td><td>7.39</td><td>$7.39 / 11.11 = 0.67$</td></tr>
        <tr><td>tea</td><td>$1$</td><td>2.72</td><td>$2.72 / 11.11 = 0.24$</td></tr>
        <tr><td>water</td><td>$0$</td><td>1.00</td><td>$1.00 / 11.11 = 0.09$</td></tr>
        <tr><td>juice</td><td>$-1$</td><td>0.37</td><td>$0.37 / 11.11 = 0.03$</td></tr>
      </tbody>
      <tfoot><tr><td>total</td><td></td><td>11.11</td><td>1.00</td></tr></tfoot>
    </table>

    <p>And there it is: four raw scores became a clean distribution — coffee $0.67$, tea $0.24$,
    water $0.09$, juice $0.03$, all adding to $1$. That is exactly the kind of bar chart you've
    been sampling from all unit.</p>

    <h2>Play with it</h2>

    <p>Drag the scores and watch the distribution respond. Notice how raising one word's logit
    <em>steals</em> probability from the others — there's a fixed total of $1$ to share, so it's
    always a competition.</p>

    ${T.widget(
      "Softmax: logits in, distribution out",
      `<div class="slider-grid" style="margin-top:4px">
         <div class="slider-row" style="grid-template-columns:4.5em 1fr 3em">
           <span class="slabel">coffee</span>
           <input type="range" class="sm-logit" data-i="0" min="-4" max="6" step="0.5" value="2" />
           <span class="sval" id="sm-val-0">+2</span>
         </div>
         <div class="slider-row" style="grid-template-columns:4.5em 1fr 3em">
           <span class="slabel">tea</span>
           <input type="range" class="sm-logit" data-i="1" min="-4" max="6" step="0.5" value="1" />
           <span class="sval" id="sm-val-1">+1</span>
         </div>
         <div class="slider-row" style="grid-template-columns:4.5em 1fr 3em">
           <span class="slabel">water</span>
           <input type="range" class="sm-logit" data-i="2" min="-4" max="6" step="0.5" value="0" />
           <span class="sval" id="sm-val-2">0</span>
         </div>
         <div class="slider-row" style="grid-template-columns:4.5em 1fr 3em">
           <span class="slabel">juice</span>
           <input type="range" class="sm-logit" data-i="3" min="-4" max="6" step="0.5" value="-1" />
           <span class="sval" id="sm-val-3">−1</span>
         </div>
       </div>
       <canvas id="sm-chart" style="margin-top:12px"></canvas>
       <div class="controls">
         <button class="btn ghost" id="sm-shift">Add 1 to every score</button>
         <button class="btn ghost" id="sm-reset">Reset</button>
       </div>
       <div class="readout">
         <div class="stat"><span class="label">Most likely</span><span class="value" id="sm-top">coffee</span></div>
         <div class="stat"><span class="label">Probabilities sum to</span><span class="value" id="sm-sum">1.00</span></div>
       </div>`
    )}

    <h2>What softmax guarantees</h2>
    <ul>
      <li><strong>It's always a valid distribution.</strong> Every weight $e^{z}$ is positive, and
      dividing by their total forces them to sum to $1$ — the two rules, automatically satisfied.</li>
      <li><strong>It keeps the order.</strong> The biggest logit always becomes the biggest
      probability; softmax never reshuffles the ranking, it just sets the heights.</li>
      <li><strong>It exaggerates the leader.</strong> Because of the exponential, a modest lead in
      score becomes a big lead in probability — a one-point gap multiplies a word's weight by
      $e \\approx 2.72$. That's why model distributions can be so <em>spiky</em>: a clear favorite
      runs away with most of the probability.</li>
    </ul>

    <h2>The big one: only differences matter</h2>

    <p>Here's the loose end the sigmoid section promised to tie up. With one yes/no event, a logit
    of $0$ meant exactly $50\\%$. With <em>many</em> options that anchor is gone — and the
    "add 1 to every score" button shows why. Push it: every score rises, but the bars
    <strong>don't move at all.</strong></p>

    <p>The algebra is short, and it's the same exponent rule again. Add a constant $c$ to every
    logit and watch it cancel:</p>

    $$\\frac{e^{z_i + c}}{\\sum_j e^{z_j + c}} = \\frac{e^{c}\\,e^{z_i}}{e^{c}\\sum_j e^{z_j}} = \\frac{e^{z_i}}{\\sum_j e^{z_j}}$$

    <p>The $e^{c}$ factors out of top and bottom and disappears. So <strong>softmax depends only on
    the <em>differences</em> between logits, never their absolute values.</strong> Scores of
    $\\{2, 1, 0\\}$ give the identical distribution as $\\{102, 101, 100\\}$. This is precisely what
    "the logits become relative" meant: there's no universal zero point anymore — only how far
    apart the options are.</p>

    <h2>Sigmoid was softmax all along</h2>

    <p>One more satisfying loop to close. Suppose there are just <strong>two</strong> options, with
    logits $z_1$ and $z_2$. Softmax says</p>

    $$P_1 = \\frac{e^{z_1}}{e^{z_1} + e^{z_2}}.$$

    <p>Divide top and bottom by $e^{z_2}$ (the exponent rule once more), and write $z = z_1 - z_2$
    for the gap between the two scores:</p>

    $$P_1 = \\frac{e^{z_1 - z_2}}{e^{z_1 - z_2} + 1} = \\frac{1}{1 + e^{-(z_1 - z_2)}} = \\frac{1}{1 + e^{-z}}.$$

    <p>That's the <strong>sigmoid</strong> — and it reveals what the sigmoid's single "logit"
    secretly was all along: the <em>difference</em> between the yes-score and the no-score. The
    sigmoid is just softmax with two options. One mechanism underneath both.</p>

    <h2>This is the model's next-word machine</h2>

    <p>Now you can state, exactly, what a language model does to choose a word. For every word in
    its vocabulary it computes a <strong>logit</strong>; it runs the whole list through
    <strong>softmax</strong> to get a probability distribution; and it <strong>samples</strong> one
    word from that distribution. The spiky "opposite of hot is cold" charts, the flat
    "favorite animal" ones, the surprising tower on $7$ — every distribution you've measured and
    sampled this unit is a softmax of the model's logits.</p>

    <h2>What you learned</h2>
    <ul>
      <li><strong>Softmax</strong> turns a list of logits into a probability distribution:
      $P_i = \\dfrac{e^{z_i}}{\\sum_j e^{z_j}}$ — <em>exponentiate, then normalize</em>.</li>
      <li>The result is always valid (positive, sums to $1$), keeps the ranking, and
      <strong>exaggerates</strong> the front-runner.</li>
      <li>It depends <strong>only on the differences</strong> between logits — adding a constant to
      all of them changes nothing.</li>
      <li>The <strong>sigmoid is the two-option special case</strong>, with input equal to the gap
      between the two scores.</li>
    </ul>
  `;

  function onMount(root) {
    const canvas = root.querySelector("#sm-chart");
    if (!canvas) return;
    const WORDS = ["coffee", "tea", "water", "juice"];
    const DEFAULTS = [2, 1, 0, -1];
    let logits = DEFAULTS.slice();

    const sliders = Array.from(root.querySelectorAll(".sm-logit"));
    const vals = WORDS.map((_, i) => root.querySelector("#sm-val-" + i));
    const topEl = root.querySelector("#sm-top");
    const sumEl = root.querySelector("#sm-sum");

    function softmax(zs) {
      const ws = zs.map((z) => Math.exp(z));
      const s = ws.reduce((a, b) => a + b, 0);
      return ws.map((w) => w / s);
    }

    function fmtLogit(z) {
      const r = Math.round(z * 10) / 10;
      return (r > 0 ? "+" : r < 0 ? "−" : "") + Math.abs(r);
    }

    function syncControls() {
      sliders.forEach((sl, i) => { sl.value = String(logits[i]); });
      vals.forEach((v, i) => { v.textContent = fmtLogit(logits[i]); });
    }

    function draw() {
      const p = softmax(logits);
      const { ctx, w, h } = T.fitCanvas(canvas, 230);
      ctx.clearRect(0, 0, w, h);
      const padL = 40, padR = 12, padT = 16, padB = 28;
      const x0 = padL, x1 = w - padR, y0 = padT, y1 = h - padB;
      const Y = (v) => y1 - v * (y1 - y0);

      // y gridlines 0, 0.5, 1
      ctx.fillStyle = "#8a93a6";
      ctx.font = "12px -apple-system, sans-serif";
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      [0, 0.5, 1].forEach((v) => {
        ctx.strokeStyle = "#eef0f4";
        ctx.beginPath(); ctx.moveTo(x0, Y(v)); ctx.lineTo(x1, Y(v)); ctx.stroke();
        ctx.fillText(v.toFixed(1), x0 - 6, Y(v));
      });

      let maxi = 0;
      p.forEach((v, i) => { if (v > p[maxi]) maxi = i; });

      const slot = (x1 - x0) / WORDS.length;
      const bw = Math.min(slot * 0.6, 70);
      WORDS.forEach((word, i) => {
        const cx = x0 + slot * (i + 0.5);
        const by = Y(p[i]);
        ctx.fillStyle = i === maxi ? "#0d9488" : "#4f46e5";
        ctx.fillRect(cx - bw / 2, by, bw, y1 - by);

        ctx.fillStyle = "#515a6e";
        ctx.font = "12px -apple-system, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillText(p[i].toFixed(2), cx, by - 3);

        ctx.textBaseline = "top";
        ctx.fillText(word, cx, y1 + 6);
      });

      topEl.textContent = WORDS[maxi];
      sumEl.textContent = p.reduce((a, b) => a + b, 0).toFixed(2);
    }

    function refresh() { syncControls(); draw(); }

    sliders.forEach((sl) =>
      sl.addEventListener("input", () => {
        logits[parseInt(sl.dataset.i, 10)] = parseFloat(sl.value);
        vals[parseInt(sl.dataset.i, 10)].textContent = fmtLogit(parseFloat(sl.value));
        draw();
      })
    );
    root.querySelector("#sm-shift").addEventListener("click", () => {
      // shift all logits up together, without letting the top exceed the slider max
      const room = 6 - Math.max.apply(null, logits);
      const step = Math.min(1, room);
      if (step > 0) { logits = logits.map((z) => z + step); refresh(); }
    });
    root.querySelector("#sm-reset").addEventListener("click", () => {
      logits = DEFAULTS.slice();
      refresh();
    });
    window.addEventListener("resize", draw);

    refresh();
  }

  window.SectionContent = window.SectionContent || {};
  window.SectionContent["softmax"] = {
    title: "Softmax: Scores to a Distribution",
    html,
    onMount,
  };
})();
