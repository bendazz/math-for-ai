/* ============================================================
   Section: Temperature — The Randomness Knob
   Registered under id "temperature" (see manifest.js).
   The payoff of the exponential -> sigmoid -> softmax arc, and
   the long-foreshadowed Langflow "Temperature" field.

   Mechanism: softmax with the logits divided by T first:
     P_i = e^{z_i / T} / sum_j e^{z_j / T}.
   Because softmax depends only on DIFFERENCES between logits
   (softmax section), dividing every logit by T scales every gap
   by 1/T:
     - T = 1  -> natural distribution
     - T < 1  -> gaps grow  -> sharper (spiky, deterministic)
     - T > 1  -> gaps shrink -> flatter (toward uniform)
     - T -> 0 -> argmax (always the top option; greedy)
     - T -> inf -> uniform (maximally random)

   Centerpiece widget (onMount): the section-11 "random integer
   1-10" 7-tower (hardcoded logits) reshaped live by a T slider,
   against a dashed uniform=0.1 reference line. Cold -> all 7;
   hot -> flattens toward uniform.

   No forward lead-in (per no-forward-leadins). No currency $.
   ============================================================ */

(function () {
  const T = window.Toolkit;

  // Logits for the "random integer 1-10" model (a 7-tower at T=1).
  const NUMS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const LOGITS = [0.2, 0.6, 2.6, 0.8, 2.0, 0.7, 4.3, 0.7, 1.8, 0.4];

  const html = `
    <div class="eyebrow">Probability Meets AI · 8</div>
    <h1>Temperature: The Randomness Knob</h1>

    <p>Way back in the Langflow lab you spotted a setting called <strong>Temperature</strong> and
    we said "leave it alone — we'll come back to it." This is that moment. You now have every piece
    needed to understand it completely, because temperature is a single, tiny change to the softmax
    you just learned.</p>

    <p>Here's the idea in one sentence: the model computes its logits and softmax gives a natural
    distribution over the options — and <strong>temperature reshapes that distribution before we
    sample from it</strong>, making it spikier or flatter, <em>without changing the logits the
    model actually produced</em>. It's a knob on how predictable versus surprising the model's
    choices are.</p>

    <h2>The formula: divide the logits by $T$</h2>

    <p>Take ordinary softmax and divide every logit by a number $T$ — the
    <strong>temperature</strong> — before exponentiating:</p>

    $$P_i = \\frac{e^{z_i / T}}{\\sum_j e^{z_j / T}}$$

    <p>That's the entire change: a single $T$ in the exponent. When $T = 1$ the division does
    nothing and you get the model's ordinary distribution back. The interesting part is what
    happens when you turn $T$ away from $1$.</p>

    <h2>Why dividing reshapes the bars</h2>

    <p>The key fact you proved last section: softmax depends <strong>only on the differences</strong>
    between logits. So watch what dividing by $T$ does to those differences — it scales every gap
    by $\\tfrac{1}{T}$:</p>

    <ul>
      <li><strong>$T = 1$ — natural.</strong> Gaps unchanged; the model's honest distribution.</li>
      <li><strong>$T &lt; 1$ — cold.</strong> Dividing by a number below $1$ is the same as
      <em>multiplying</em>, so the gaps <strong>grow</strong>. Bigger gaps mean softmax exaggerates
      even harder, and the distribution <strong>sharpens</strong> toward the top option — confident,
      repetitive, predictable.</li>
      <li><strong>$T &gt; 1$ — hot.</strong> The gaps <strong>shrink</strong> toward zero, so the
      bars even out and the distribution <strong>flattens</strong> toward uniform — surprising,
      varied, sometimes incoherent.</li>
    </ul>

    <p>Pushed to the extremes: as $T \\to 0$ the gaps blow up to infinity and <em>all</em> the
    probability piles onto the single highest logit (the model always picks its favorite — totally
    deterministic). As $T \\to \\infty$ the gaps vanish and every option becomes equally likely
    (pure randomness). Temperature is a dial sliding between <strong>"always the top choice"</strong>
    and <strong>"anything goes."</strong></p>

    <p>Concretely, here's softmax of the logits $2$, $1$, $0$ at three temperatures (using
    $e^{0.5} = 1.65$ for the $T = 2$ column):</p>

    <table class="dist-table">
      <thead><tr><th>Logit</th><th>$T = 0.5$ (cold)</th><th>$T = 1$</th><th>$T = 2$ (hot)</th></tr></thead>
      <tbody>
        <tr><td>$2$</td><td>0.87</td><td>0.67</td><td>0.51</td></tr>
        <tr><td>$1$</td><td>0.12</td><td>0.24</td><td>0.31</td></tr>
        <tr><td>$0$</td><td>0.02</td><td>0.09</td><td>0.19</td></tr>
      </tbody>
      <tfoot><tr><td>sum</td><td>1.00</td><td>1.00</td><td>1.00</td></tr></tfoot>
    </table>

    <p>Read across: cooling to $T = 0.5$ pushes the favorite from $0.67$ up to $0.87$ (spikier);
    heating to $T = 2$ pulls it down to $0.51$ and lifts the long shots (flatter). Same logits the
    whole time — only the knob moved.</p>

    <h2>Turn the knob yourself</h2>

    <p>Here's the "random integer between 1 and 10" model from earlier — the one with the
    surprising tower on $7$. Those bars came from the model's logits at the default temperature.
    Now slide $T$ and watch the same logits give wildly different distributions. The dashed line
    marks a perfectly uniform $0.1$.</p>

    ${T.widget(
      "Temperature over the 7-tower",
      `<canvas id="tm-chart"></canvas>
       <div class="slider-row" style="grid-template-columns:auto 1fr 3.5em;margin-top:14px">
         <span class="slabel" style="white-space:nowrap">Temperature T</span>
         <input id="tm-T" type="range" min="0.1" max="5" step="0.1" value="1" />
         <span class="sval" id="tm-Tval">1.0</span>
       </div>
       <div class="controls">
         <button class="btn ghost" data-temp="0.3">Cold (0.3)</button>
         <button class="btn ghost" data-temp="1">Default (1.0)</button>
         <button class="btn ghost" data-temp="3">Hot (3.0)</button>
       </div>
       <div class="readout">
         <div class="stat"><span class="label">Temperature</span><span class="value" id="tm-Tread">1.0</span></div>
         <div class="stat"><span class="label">Chance of 7</span><span class="value" id="tm-seven">—</span></div>
       </div>`
    )}

    <p>Slide it cold and the tower on $7$ swallows everything — the model would return $7$ almost
    every single time. Slide it hot and the bars sink toward the uniform line — the "random number"
    finally starts to look genuinely random. (That's the real fix for the $7$-bias from before:
    not a smarter model, just a higher temperature.)</p>

    <h2>What temperature means in a real chatbot</h2>

    <p>This single knob is the <strong>creativity dial</strong> on every language model, and it's
    exactly the <em>Temperature</em> field you saw in Langflow:</p>
    <ul>
      <li><strong>Low temperature</strong> (cold): safe, focused, repetitive. The model keeps
      picking its top choice, so answers are consistent and predictable — good for facts, code, and
      anything where you want the "right" answer, not a creative one.</li>
      <li><strong>High temperature</strong> (hot): adventurous and varied, willing to choose
      unlikely words — good for brainstorming, storytelling, and variety, but crank it too far and
      it drifts into nonsense.</li>
      <li><strong>$T = 1$</strong>: the model's honest, natural distribution — no reshaping at all.</li>
    </ul>

    <p>This also finally explains something you saw with your own eyes. When you ran the
    "pick the next word" experiment and got <em>different</em> words each time, that variety came
    from sampling at the default (nonzero) temperature. Had the temperature been $0$, you'd have
    gotten the very same word on every single run.</p>

    <h2>The precise $T = 0$ case</h2>

    <p>You can't literally set $T = 0$ in the formula — it would divide by zero. It's the
    <strong>limit</strong> as $T$ shrinks, and in real software it's handled as a special case:
    "skip the randomness and just take the highest-scoring option" (often called
    <em>greedy</em> decoding). The result is fully deterministic — same input, same output, every
    time. Your earlier instinct was exactly right: at $T = 0$ a "pick the next word" bot would
    return one fixed word forever.</p>

    <h2>What you learned</h2>
    <ul>
      <li><strong>Temperature</strong> is softmax with the logits divided by $T$:
      $P_i = \\dfrac{e^{z_i/T}}{\\sum_j e^{z_j/T}}$.</li>
      <li>It scales the <strong>gaps</strong> between logits: $T &lt; 1$ sharpens the distribution
      (toward always-the-favorite), $T &gt; 1$ flattens it (toward uniform), $T = 1$ leaves it
      natural.</li>
      <li>The logits — what the model "believes" — never change; temperature only changes
      <strong>how we sample</strong> from them.</li>
      <li>It's the real chatbot <strong>creativity/randomness knob</strong>: cold for precise,
      hot for creative.</li>
    </ul>

    <p>That closes a long thread. The exponential turned scores into positive weights; the sigmoid
    handled one yes/no; softmax handled many options; and temperature reshapes the whole
    distribution on a single dial. From here on, "the model samples its next word from a
    distribution" is something you can write down, compute, and tune.</p>
  `;

  function onMount(root) {
    const canvas = root.querySelector("#tm-chart");
    if (!canvas) return;
    const slider = root.querySelector("#tm-T");
    const tval = root.querySelector("#tm-Tval");
    const tread = root.querySelector("#tm-Tread");
    const sevenEl = root.querySelector("#tm-seven");

    let Temp = 1;

    function dist(t) {
      const ws = LOGITS.map((z) => Math.exp(z / t));
      const s = ws.reduce((a, b) => a + b, 0);
      return ws.map((w) => w / s);
    }

    function draw() {
      const p = dist(Temp);
      const { ctx, w, h } = T.fitCanvas(canvas, 250);
      ctx.clearRect(0, 0, w, h);
      const padL = 40, padR = 12, padT = 16, padB = 30;
      const x0 = padL, x1 = w - padR, y0 = padT, y1 = h - padB;
      const Y = (v) => y1 - v * (y1 - y0);

      // y gridlines
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

      const slot = (x1 - x0) / NUMS.length;
      const bw = slot * 0.62;
      NUMS.forEach((n, i) => {
        const cx = x0 + slot * (i + 0.5);
        const by = Y(p[i]);
        ctx.fillStyle = i === maxi ? "#0d9488" : "#4f46e5";
        ctx.fillRect(cx - bw / 2, by, bw, y1 - by);
        ctx.fillStyle = "#515a6e";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.font = "12px -apple-system, sans-serif";
        ctx.fillText(n, cx, y1 + 6);
      });

      // dashed uniform = 0.1 reference line
      const uy = Y(0.1);
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
      ctx.fillText("uniform = 0.1", x1, uy - 3);

      sevenEl.textContent = Math.round(p[6] * 100) + "%";
    }

    function setT(t) {
      Temp = t;
      slider.value = String(t);
      tval.textContent = t.toFixed(1);
      tread.textContent = t.toFixed(1);
      draw();
    }

    slider.addEventListener("input", () => setT(parseFloat(slider.value)));
    root.querySelectorAll("[data-temp]").forEach((b) =>
      b.addEventListener("click", () => setT(parseFloat(b.dataset.temp)))
    );
    window.addEventListener("resize", draw);

    setT(1);
  }

  window.SectionContent = window.SectionContent || {};
  window.SectionContent["temperature"] = {
    title: "Temperature: The Randomness Knob",
    html,
    onMount,
  };
})();
