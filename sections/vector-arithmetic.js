/* ============================================================
   Section: Adding and Scaling Vectors  (Vectors unit — section 3)
   Registered under id "vector-arithmetic" (see manifest.js).

   The two fundamental operations, both dead-simple component-wise
   and both with clean pictures:
     - SCALING (scalar multiple): multiply every component by c.
       Picture: same direction, length × |c|; c<0 flips; c=0 → 0.
       Ties to states: scaling keeps DIRECTION (density) fixed, only
       changes LENGTH (footprint).
     - ADDITION: add corresponding components. Picture: tip-to-tail
       / parallelogram. Subtraction = add the negative; u−v is the
       arrow from v's tip to u's tip.
   PAYOFF that uses BOTH: averaging = add then scale by 1/n. A
   sentence's embedding is often the MEAN of its word vectors
   (mean pooling) — the honest, on-theme application. Plus the
   famous king − man + woman ≈ queen analogy as an illustration of
   why differences of word vectors carry meaning.

   Two interactive canvases (reuse drawArrow + T.fitCanvas):
     1) scaling: a base vector v, a scalar slider c (−2..3)
     2) addition: two draggable vectors u, v with tip-to-tail sum,
        and an add / subtract toggle
   No forward lead-in (per no-forward-leadins). No currency $.
   ============================================================ */

(function () {
  const T = window.Toolkit;

  function drawArrow(ctx, x1, y1, x2, y2, color, width) {
    ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = width;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    const ang = Math.atan2(y2 - y1, x2 - x1);
    const a = 9;
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - a * Math.cos(ang - 0.4), y2 - a * Math.sin(ang - 0.4));
    ctx.lineTo(x2 - a * Math.cos(ang + 0.4), y2 - a * Math.sin(ang + 0.4));
    ctx.closePath(); ctx.fill();
  }

  const html = `
    <div class="eyebrow">Vectors · 3</div>
    <h1>Adding and Scaling Vectors</h1>

    <p>A vector is a list of numbers — but a list you can <em>do things to</em>. There are two basic
    moves, and almost everything else is built from them: you can <strong>scale</strong> a vector
    (stretch or shrink it) and you can <strong>add</strong> two vectors (combine them). Both are
    trivial to compute and both have a clean picture. Let's take them one at a time.</p>

    <h2>Scaling: stretch, shrink, or flip</h2>

    <p>To <strong>scale</strong> a vector by a number $c$ (called a <strong>scalar</strong>), just
    multiply <em>every component</em> by $c$:</p>

    $$c\\,\\mathbf{v} = c\\,(v_1,\\, v_2) = (c\\,v_1,\\ c\\,v_2)
      \\qquad\\text{so}\\qquad 2\\,(3,\\,2) = (6,\\,4).$$

    <p>The picture is just as simple — scaling changes the arrow's <strong>length</strong> but not the
    line it points along:</p>
    <ul>
      <li>$c &gt; 1$ <strong>stretches</strong> it ($2\\,\\mathbf{v}$ is twice as long, same direction);</li>
      <li>$0 &lt; c &lt; 1$ <strong>shrinks</strong> it ($\\tfrac12\\,\\mathbf{v}$ is half as long);</li>
      <li>$c = 0$ collapses it to the <strong>zero vector</strong> $\\mathbf{0} = (0,0)$;</li>
      <li>$c &lt; 0$ <strong>flips</strong> it to point the opposite way ($-\\mathbf{v}$ is the same
      length, reversed).</li>
    </ul>

    <p>Drag the slider and watch the arrow grow, shrink, and flip — its <em>direction</em> only ever
    stays the same or reverses.</p>

    ${T.widget(
      "Scaling a vector",
      `<canvas id="sc-chart" style="touch-action:none"></canvas>
       <div class="slider-row" style="grid-template-columns:auto 1fr 3.2em;align-items:center;gap:12px;margin-top:12px">
         <span class="slabel">c =</span>
         <input type="range" id="sc-c" min="-2" max="3" step="0.5" value="2" />
         <span class="sval" id="sc-cv">2</span>
       </div>
       <div class="readout">
         <div class="stat"><span class="label">c · v</span><span class="value" id="sc-read">(4, 2)</span></div>
       </div>`
    )}

    ${T.callout(
      `<p>This connects straight back to the states. Scaling keeps a vector's <em>direction</em> fixed
       — and direction was the state's <em>density</em>. So doubling New Jersey's vector gives a
       made-up region with the <strong>same density</strong> but <strong>twice the footprint</strong>.
       Length is size; direction is character; scaling touches only the size.</p>`,
      { type: "", label: "Back to the states" }
    )}

    <h2>Adding: combine, tip to tail</h2>

    <p>To <strong>add</strong> two vectors, add their matching components:</p>

    $$\\mathbf{u} + \\mathbf{v} = (u_1 + v_1,\\ u_2 + v_2)
      \\qquad\\text{so}\\qquad (3,\\,1) + (1,\\,2) = (4,\\,3).$$

    <p>The picture is the one worth remembering: <strong>tip to tail</strong>. Draw $\\mathbf{u}$ from
    the origin, then start $\\mathbf{v}$ at the <em>tip</em> of $\\mathbf{u}$. Wherever you land is the
    sum $\\mathbf{u} + \\mathbf{v}$, an arrow from the origin to that final point. (Start with
    $\\mathbf{v}$ instead and you land in the same place — order doesn't matter, which is why the two
    arrows and the sum form a parallelogram.)</p>

    <p>Drag either arrowhead. The dashed arrow is the second vector slid over to start at the first
    one's tip; the purple arrow is the sum.</p>

    ${T.widget(
      "Adding two vectors",
      `<canvas id="ad-chart" style="touch-action:none;cursor:crosshair"></canvas>
       <div class="controls">
         <button class="btn" data-op="add">u + v</button>
         <button class="btn ghost" data-op="sub">u − v</button>
       </div>
       <div class="readout">
         <div class="stat"><span class="label">result</span><span class="value" id="ad-read">(3, 1) + (1, 2) = (4, 3)</span></div>
       </div>`
    )}

    <h2>Subtracting: the difference vector</h2>

    <p>Subtraction is just "add the negative": $\\mathbf{u} - \\mathbf{v} = \\mathbf{u} + (-\\mathbf{v})$,
    which component-wise is $(u_1 - v_1,\\ u_2 - v_2)$. Flip the toggle above to $\\mathbf{u} -
    \\mathbf{v}$ and you'll see $-\\mathbf{v}$ (the flipped copy) laid tip-to-tail on $\\mathbf{u}$.</p>

    <p>There's a second, very useful way to read $\\mathbf{u} - \\mathbf{v}$: it's the arrow that goes
    <strong>from $\\mathbf{v}$'s tip to $\\mathbf{u}$'s tip</strong> — "what you'd add to $\\mathbf{v}$
    to get $\\mathbf{u}$." A difference of two vectors captures <em>how to get from one to the other</em>.
    Hold onto that idea — it's the whole reason vector arithmetic says anything about <em>meaning</em>,
    as we'll see in a moment.</p>

    <h2>Averaging: adding and scaling together</h2>

    <p>Put both operations together and you get something an AI uses constantly: the
    <strong>average</strong> of several vectors. To average, you <strong>add them all up</strong> and
    then <strong>scale by $1/n$</strong>:</p>

    $$\\text{average of } \\mathbf{v}_1, \\dots, \\mathbf{v}_n
      = \\frac{1}{n}\\,(\\mathbf{v}_1 + \\mathbf{v}_2 + \\cdots + \\mathbf{v}_n).$$

    <p>For two vectors, the average $\\tfrac12(\\mathbf{u} + \\mathbf{v})$ sits exactly at the
    <strong>midpoint</strong> between their tips. For many, it lands at their "balance point" — the
    center of the cloud.</p>

    ${T.callout(
      `<p>Here's the honest payoff. A single word becomes a vector (an <strong>embedding</strong>).
       How do you turn a whole <em>sentence</em> into one vector? The simplest method that really gets
       used: <strong>average the word vectors</strong> — add up the embedding of every word and scale
       by $1/n$. That one "mean" vector stands in for the sentence's overall meaning. The toy
       operations on this page — add, then scale — are exactly the machinery behind it
       (it's called <em>mean pooling</em>).</p>`,
      { type: "ai", label: "Turning a sentence into one vector" }
    )}

    ${T.callout(
      `<p>And the difference idea pays off too. In a good word-embedding space, <em>directions carry
       meaning</em>, so differences carry <em>relationships</em>. The arrow from <strong>man</strong>
       to <strong>woman</strong> turns out to be about the same as the arrow from <strong>king</strong>
       to <strong>queen</strong> — a little "make it feminine" step. So if you compute
       $\\text{king} - \\text{man} + \\text{woman}$ with real embeddings, you land remarkably close to
       <strong>queen</strong>. Subtraction and addition of vectors doing actual word analogies — that
       famous result is nothing more than the arithmetic on this page.</p>`,
      { type: "ai", label: "king − man + woman ≈ queen" }
    )}

    <h2>What you learned</h2>
    <ul>
      <li><strong>Scaling</strong> $c\\,\\mathbf{v}$ multiplies every component by $c$: it changes
      length by $|c|$ (and flips direction if $c&lt;0$), but never tilts the arrow.</li>
      <li><strong>Adding</strong> $\\mathbf{u}+\\mathbf{v}$ adds matching components; picture it
      <strong>tip to tail</strong>. <strong>Subtracting</strong> gives the arrow from one tip to the
      other.</li>
      <li><strong>Averaging</strong> is add-then-scale-by-$1/n$ — and it's how word vectors get
      combined into a sentence vector (mean pooling).</li>
      <li>Every one of these works the same on $2$ components or $768$ — the pictures are your guide
      into high dimensions.</li>
    </ul>
  `;

  function onMount(root) {
    const scc = root.querySelector("#sc-chart");
    const adc = root.querySelector("#ad-chart");
    if (!scc || !adc) return;

    // shared grid: draws plane spanning [-R, R] vertically, returns mapping
    function grid(canvas, R, cssH) {
      const { ctx, w, h } = T.fitCanvas(canvas, cssH);
      ctx.clearRect(0, 0, w, h);
      const unit = (h - 36) / (2 * R);
      const ox = w / 2, oy = h / 2;
      const X = (x) => ox + x * unit, Y = (y) => oy - y * unit;
      ctx.strokeStyle = "#f0f1f6"; ctx.lineWidth = 1;
      const xspan = Math.ceil((w / 2) / unit);
      for (let gx = -xspan; gx <= xspan; gx++) { ctx.beginPath(); ctx.moveTo(X(gx), 0); ctx.lineTo(X(gx), h); ctx.stroke(); }
      for (let gy = -R; gy <= R; gy++) { ctx.beginPath(); ctx.moveTo(0, Y(gy)); ctx.lineTo(w, Y(gy)); ctx.stroke(); }
      ctx.strokeStyle = "#c7ccd8"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(0, Y(0)); ctx.lineTo(w, Y(0)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(X(0), 0); ctx.lineTo(X(0), h); ctx.stroke();
      return { ctx, w, h, unit, ox, oy, X, Y };
    }

    const trim = (n) => (Number.isInteger(n) ? n : Number(n.toFixed(1)));
    const fmt = (a) => "(" + trim(a[0]) + ", " + trim(a[1]) + ")";

    /* ---------- scaling ---------- */
    const BASE = [2, 1];
    let c = 2;
    const scCv = root.querySelector("#sc-cv");
    const scRead = root.querySelector("#sc-read");

    function drawScale() {
      const g = grid(scc, 7, 300);
      const ctx = g.ctx;
      // faint original v
      drawArrow(ctx, g.X(0), g.Y(0), g.X(BASE[0]), g.Y(BASE[1]), "#c7ccd8", 2);
      ctx.fillStyle = "#94a3b8"; ctx.font = "600 12px -apple-system, sans-serif";
      ctx.textAlign = "left"; ctx.textBaseline = "bottom";
      ctx.fillText("v", g.X(BASE[0]) + 5, g.Y(BASE[1]) - 3);

      const s = [BASE[0] * c, BASE[1] * c];
      const col = c < 0 ? "#e11d48" : "#4f46e5";
      if (c !== 0) drawArrow(ctx, g.X(0), g.Y(0), g.X(s[0]), g.Y(s[1]), col, 2.6);
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.arc(g.X(s[0]), g.Y(s[1]), 5, 0, Math.PI * 2); ctx.fill();

      scRead.textContent = fmt(s);
    }

    root.querySelector("#sc-c").addEventListener("input", (e) => {
      c = parseFloat(e.target.value);
      scCv.textContent = trim(c);
      drawScale();
    });

    /* ---------- addition (two draggable heads) ---------- */
    const R = 8;
    let u = [3, 1], v = [1, 2], op = "add", active = null, dragging = false;
    const adRead = root.querySelector("#ad-read");

    function drawAdd() {
      const g = grid(adc, R, 360);
      const ctx = g.ctx;
      const neg = op === "sub";
      const vv = neg ? [-v[0], -v[1]] : [v[0], v[1]];
      const res = [u[0] + vv[0], u[1] + vv[1]];

      // u (indigo) and v (teal) from the origin
      drawArrow(ctx, g.X(0), g.Y(0), g.X(u[0]), g.Y(u[1]), "#4f46e5", 2.5);
      drawArrow(ctx, g.X(0), g.Y(0), g.X(v[0]), g.Y(v[1]), "#0d9488", 2.5);

      // second vector slid to the tip of u (dashed) — the tip-to-tail step
      ctx.setLineDash([5, 4]);
      drawArrow(ctx, g.X(u[0]), g.Y(u[1]), g.X(res[0]), g.Y(res[1]), neg ? "#e11d48" : "#0d9488", 1.8);
      ctx.setLineDash([]);

      // the sum / difference (purple)
      drawArrow(ctx, g.X(0), g.Y(0), g.X(res[0]), g.Y(res[1]), "#7c3aed", 3);

      // heads
      [[u, "#4f46e5"], [v, "#0d9488"], [res, "#7c3aed"]].forEach(([p, cc]) => {
        ctx.fillStyle = cc; ctx.beginPath(); ctx.arc(g.X(p[0]), g.Y(p[1]), 5, 0, Math.PI * 2); ctx.fill();
      });

      // labels
      ctx.font = "600 12px -apple-system, sans-serif"; ctx.textAlign = "left"; ctx.textBaseline = "bottom";
      ctx.fillStyle = "#4f46e5"; ctx.fillText("u", g.X(u[0]) + 6, g.Y(u[1]) - 3);
      ctx.fillStyle = "#0d9488"; ctx.fillText("v", g.X(v[0]) + 6, g.Y(v[1]) - 3);
      ctx.fillStyle = "#7c3aed"; ctx.fillText(neg ? "u − v" : "u + v", g.X(res[0]) + 6, g.Y(res[1]) - 3);

      adRead.textContent = fmt(u) + (neg ? " − " : " + ") + fmt(v) + " = " + fmt(res);
    }

    function adGeom(rect) {
      const unit = (rect.height - 36) / (2 * R);
      return { unit, ox: rect.width / 2, oy: rect.height / 2 };
    }
    function pickHead(e) {
      const rect = adc.getBoundingClientRect();
      const { unit, ox, oy } = adGeom(rect);
      const mx = e.clientX - rect.left, my = e.clientY - rect.top;
      const du = (mx - (ox + u[0] * unit)) ** 2 + (my - (oy - u[1] * unit)) ** 2;
      const dv = (mx - (ox + v[0] * unit)) ** 2 + (my - (oy - v[1] * unit)) ** 2;
      active = du <= dv ? "u" : "v";
    }
    function adSet(e) {
      const rect = adc.getBoundingClientRect();
      const { unit, ox, oy } = adGeom(rect);
      let x = Math.round((e.clientX - rect.left - ox) / unit);
      let y = Math.round((oy - (e.clientY - rect.top)) / unit);
      x = Math.max(-4, Math.min(4, x));
      y = Math.max(-4, Math.min(4, y));
      if (active === "u") u = [x, y]; else v = [x, y];
      drawAdd();
    }

    adc.addEventListener("pointerdown", (e) => { dragging = true; adc.setPointerCapture(e.pointerId); pickHead(e); adSet(e); });
    adc.addEventListener("pointermove", (e) => { if (dragging) adSet(e); });
    adc.addEventListener("pointerup", () => { dragging = false; });
    adc.addEventListener("pointercancel", () => { dragging = false; });

    root.querySelectorAll("[data-op]").forEach((b) =>
      b.addEventListener("click", () => {
        op = b.dataset.op;
        root.querySelectorAll("[data-op]").forEach((o) =>
          o.className = "btn" + (o.dataset.op === op ? "" : " ghost"));
        drawAdd();
      })
    );

    window.addEventListener("resize", () => { drawScale(); drawAdd(); });
    drawScale();
    drawAdd();
  }

  window.SectionContent = window.SectionContent || {};
  window.SectionContent["vector-arithmetic"] = {
    title: "Adding and Scaling Vectors",
    html,
    onMount,
  };
})();
