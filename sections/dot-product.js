/* ============================================================
   Section: The Dot Product  (Vectors unit — section 6)
   Registered under id "dot-product" (see manifest.js).

   The keystone operation. Two faces:
     - ALGEBRA: u·v = u1 v1 + u2 v2 (+ ...)  → a single NUMBER (scalar).
       Contrast with scaling/adding, which return vectors.
     - GEOMETRY: u·v = ‖u‖‖v‖cosθ. The dot product measures ALIGNMENT.
         > 0  angle < 90°  pointing broadly the same way
         = 0  perpendicular (orthogonal) — a clean right-angle test
         < 0  angle > 90°  pointing broadly opposite
   Plus u·u = ‖u‖² (ties back to magnitude: ‖u‖ = sqrt(u·u)).
   AI payoff: the dot product is the workhorse of modern AI — embedding
   similarity, the LLM's logits (callback to the probability unit!),
   attention, vector search. With unit vectors the dot IS cosθ, a clean
   −1..1 similarity score (bridge to the cosine-similarity section).

   One interactive canvas (reuse drawArrow + T.fitCanvas): two draggable
   vectors with a live dot product, the angle arc, and a sign-coded
   "same way / perpendicular / opposite" readout.

   No inline problems (dedicated practice later). No forward lead-in.
   No currency $.
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
    <div class="eyebrow">Vectors · 6</div>
    <h1>The Dot Product</h1>

    <p>So far our operations on vectors have <em>returned vectors</em>: scaling, adding, averaging.
    The <strong>dot product</strong> is different — it takes two vectors and returns a single
    <strong>number</strong>. That number turns out to measure something deep: <strong>how much the two
    vectors point the same way</strong>. It is, without exaggeration, the single most important
    operation in this whole course for understanding AI.</p>

    <h2>The recipe: multiply matching components, add them up</h2>

    <p>To take the dot product of two vectors, multiply their matching components and add the results:</p>

    $$\\mathbf{u} \\cdot \\mathbf{v} = u_1 v_1 + u_2 v_2.$$

    <p>That's it. A worked example:</p>

    $$(3,\\,2) \\cdot (1,\\,4) = (3)(1) + (2)(4) = 3 + 8 = 11.$$

    <p>Notice the answer, $11$, is just a number — not a vector. (For that reason the dot product is
    also called the <strong>scalar product</strong>.) The recipe extends to any dimension the obvious
    way — for $768$-component embeddings you'd multiply all $768$ matching pairs and add — and the
    order doesn't matter: $\\mathbf{u} \\cdot \\mathbf{v} = \\mathbf{v} \\cdot \\mathbf{u}$.</p>

    <h2>What that number means: alignment</h2>

    <p>Here's the remarkable part. That simple sum of products is secretly about the <strong>angle</strong>
    between the two arrows. The exact relationship is:</p>

    $$\\mathbf{u} \\cdot \\mathbf{v} = \\lVert \\mathbf{u} \\rVert\\,\\lVert \\mathbf{v} \\rVert
      \\cos\\theta,$$

    <p>where $\\theta$ is the angle between $\\mathbf{u}$ and $\\mathbf{v}$. You don't need to compute
    cosines by hand — just read $\\cos\\theta$ as an <strong>alignment dial</strong> that runs from
    $+1$ to $-1$:</p>
    <ul>
      <li>$\\cos\\theta = +1$ when the arrows point the <strong>same way</strong> ($\\theta = 0^\\circ$),</li>
      <li>$\\cos\\theta = 0$ when they're <strong>perpendicular</strong> ($\\theta = 90^\\circ$),</li>
      <li>$\\cos\\theta = -1$ when they point <strong>opposite ways</strong> ($\\theta = 180^\\circ$).</li>
    </ul>

    <p>So the <strong>sign of the dot product</strong> tells you, at a glance, how two vectors relate:</p>
    <ul>
      <li>$\\mathbf{u} \\cdot \\mathbf{v} &gt; 0$ — they point in <strong>broadly the same direction</strong>
      (angle less than $90^\\circ$);</li>
      <li>$\\mathbf{u} \\cdot \\mathbf{v} = 0$ — they are <strong>exactly perpendicular</strong>. This is
      the cleanest test for a right angle there is;</li>
      <li>$\\mathbf{u} \\cdot \\mathbf{v} &lt; 0$ — they point in <strong>broadly opposite directions</strong>
      (angle more than $90^\\circ$).</li>
    </ul>

    <p>Drag the two arrowheads below. Watch the dot product grow when they line up, drop to exactly
    $0$ as they cross into a right angle, and go negative as they swing apart.</p>

    ${T.widget(
      "Two vectors and their dot product",
      `<canvas id="dot-chart" style="touch-action:none;cursor:crosshair"></canvas>
       <div class="tr-meta" style="margin-top:4px">Drag either arrowhead (indigo = u, teal = v).</div>
       <div id="dot-read" style="margin-top:8px"></div>`
    )}

    ${T.callout(
      `<p>The perpendicular case is worth pausing on. Try $(1,\\,0) \\cdot (0,\\,1) = (1)(0) + (0)(1) =
       0$ — the two axes are at a right angle, and their dot product is exactly zero. Whenever a dot
       product comes out to $0$, the vectors are <strong>orthogonal</strong> (the fancy word for
       perpendicular), no matter how many dimensions they live in.</p>`,
      { type: "", label: "Zero means perpendicular" }
    )}

    <h2>A vector dotted with itself</h2>

    <p>What happens if you dot a vector with <em>itself</em>? The angle is $0$, so you'd expect the
    biggest possible alignment — and indeed:</p>

    $$\\mathbf{u} \\cdot \\mathbf{u} = u_1 u_1 + u_2 u_2 = u_1^{\\,2} + u_2^{\\,2} = \\lVert \\mathbf{u}
      \\rVert^{2}.$$

    <p>Dotting a vector with itself gives its <strong>length squared</strong>. That's a tidy link back
    to the last section: the magnitude is just $\\lVert \\mathbf{u} \\rVert = \\sqrt{\\mathbf{u} \\cdot
    \\mathbf{u}}$. Length and the dot product are two faces of the same idea.</p>

    ${T.callout(
      `<p>This little operation is the engine room of modern AI. A few places it shows up:</p>
       <ul>
         <li><strong>Comparing meanings.</strong> To measure how related two words or two sentences are,
         you take the dot product of their embeddings. Bigger means more alike.</li>
         <li><strong>The model's logits.</strong> Remember logits, back in the probability unit? When a
         language model scores how well each possible next word fits, <em>each score is a dot product</em>
         between vectors the model has learned. Those dot products are the logits that softmax then turns
         into probabilities. The whole next-word machine starts here.</li>
         <li><strong>Attention and search.</strong> The "attention" inside a model, and the vector search
         behind recommendations and retrieval, are both built on piles of dot products.</li>
       </ul>
       <p>One catch: the raw dot product mixes in the vectors' <em>lengths</em> as well as their
       direction — long vectors give big dot products. If both vectors have length $1$, that goes away
       and the dot product equals $\\cos\\theta$ exactly: a clean similarity score from $-1$ to $1$.
       That's the measure we want for comparing meanings.</p>`,
      { type: "ai", label: "Why the dot product runs AI" }
    )}

    <h2>What you learned</h2>
    <ul>
      <li>The <strong>dot product</strong> $\\mathbf{u} \\cdot \\mathbf{v} = u_1 v_1 + u_2 v_2 + \\cdots$
      multiplies matching components and adds them — returning a single <strong>number</strong>.</li>
      <li>That number measures <strong>alignment</strong>: $\\mathbf{u} \\cdot \\mathbf{v} = \\lVert
      \\mathbf{u} \\rVert\\,\\lVert \\mathbf{v} \\rVert \\cos\\theta$. Its sign says same direction
      ($&gt;0$), perpendicular ($=0$), or opposite ($&lt;0$).</li>
      <li>A vector dotted with itself is its length squared: $\\mathbf{u} \\cdot \\mathbf{u} = \\lVert
      \\mathbf{u} \\rVert^{2}$.</li>
      <li>It's the core operation behind embedding similarity, attention, vector search, and the very
      logits the model feeds to softmax.</li>
    </ul>
  `;

  function onMount(root) {
    const canvas = root.querySelector("#dot-chart");
    if (!canvas) return;
    const readEl = root.querySelector("#dot-read");
    const R = 6;
    let u = [4, 1], v = [1, 3], active = null, dragging = false;

    function draw() {
      const { ctx, w, h } = T.fitCanvas(canvas, 380);
      ctx.clearRect(0, 0, w, h);
      const unit = (h - 36) / (2 * R);
      const ox = w / 2, oy = h / 2;
      const X = (x) => ox + x * unit, Y = (y) => oy - y * unit;

      // grid + axes
      ctx.strokeStyle = "#f0f1f6"; ctx.lineWidth = 1;
      const xspan = Math.ceil((w / 2) / unit);
      for (let gx = -xspan; gx <= xspan; gx++) { ctx.beginPath(); ctx.moveTo(X(gx), 0); ctx.lineTo(X(gx), h); ctx.stroke(); }
      for (let gy = -R; gy <= R; gy++) { ctx.beginPath(); ctx.moveTo(0, Y(gy)); ctx.lineTo(w, Y(gy)); ctx.stroke(); }
      ctx.strokeStyle = "#c7ccd8"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(0, Y(0)); ctx.lineTo(w, Y(0)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(X(0), 0); ctx.lineTo(X(0), h); ctx.stroke();

      const lu = Math.hypot(u[0], u[1]), lv = Math.hypot(v[0], v[1]);

      // angle arc (sampled in math space → robust to orientation)
      if (lu > 0 && lv > 0) {
        const aU = Math.atan2(u[1], u[0]), aV = Math.atan2(v[1], v[0]);
        let d = aV - aU;
        while (d > Math.PI) d -= 2 * Math.PI;
        while (d < -Math.PI) d += 2 * Math.PI;
        const r = 1.1, steps = 28;
        ctx.strokeStyle = "#cbd5e1"; ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let k = 0; k <= steps; k++) {
          const ang = aU + d * k / steps;
          const px = X(r * Math.cos(ang)), py = Y(r * Math.sin(ang));
          if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }

      // the two vectors
      drawArrow(ctx, X(0), Y(0), X(u[0]), Y(u[1]), "#4f46e5", 2.6);
      drawArrow(ctx, X(0), Y(0), X(v[0]), Y(v[1]), "#0d9488", 2.6);
      [[u, "#4f46e5", "u"], [v, "#0d9488", "v"]].forEach(([p, cc, lab]) => {
        ctx.fillStyle = cc; ctx.beginPath(); ctx.arc(X(p[0]), Y(p[1]), 5, 0, Math.PI * 2); ctx.fill();
        ctx.font = "600 12px -apple-system, sans-serif"; ctx.textAlign = "left"; ctx.textBaseline = "bottom";
        ctx.fillText(lab, X(p[0]) + 6, Y(p[1]) - 3);
      });

      // readout
      const dot = u[0] * v[0] + u[1] * v[1];
      let line2, col;
      if (lu === 0 || lv === 0) {
        line2 = "give both vectors some length to form an angle"; col = "#94a3b8";
      } else {
        const cos = Math.max(-1, Math.min(1, dot / (lu * lv)));
        const deg = Math.round(Math.acos(cos) * 180 / Math.PI);
        if (dot > 0) { line2 = `angle &asymp; ${deg}° — pointing broadly the same way`; col = "#15803d"; }
        else if (dot < 0) { line2 = `angle &asymp; ${deg}° — pointing broadly opposite ways`; col = "#be123c"; }
        else { line2 = `angle = 90° — exactly perpendicular`; col = "#b45309"; }
      }
      readEl.innerHTML =
        `<div style="font-size:1.05em;color:#0f172a"><b>u · v = (${u[0]})(${v[0]}) + (${u[1]})(${v[1]}) = ${dot}</b></div>` +
        `<div style="margin-top:4px;font-weight:600;color:${col}">${line2}</div>`;
    }

    function geom(rect) {
      const unit = (rect.height - 36) / (2 * R);
      return { unit, ox: rect.width / 2, oy: rect.height / 2 };
    }
    function pickHead(e) {
      const rect = canvas.getBoundingClientRect();
      const { unit, ox, oy } = geom(rect);
      const mx = e.clientX - rect.left, my = e.clientY - rect.top;
      const du = (mx - (ox + u[0] * unit)) ** 2 + (my - (oy - u[1] * unit)) ** 2;
      const dv = (mx - (ox + v[0] * unit)) ** 2 + (my - (oy - v[1] * unit)) ** 2;
      active = du <= dv ? "u" : "v";
    }
    function setFromEvent(e) {
      const rect = canvas.getBoundingClientRect();
      const { unit, ox, oy } = geom(rect);
      let x = Math.round((e.clientX - rect.left - ox) / unit);
      let y = Math.round((oy - (e.clientY - rect.top)) / unit);
      x = Math.max(-R, Math.min(R, x));
      y = Math.max(-R, Math.min(R, y));
      if (active === "u") u = [x, y]; else v = [x, y];
      draw();
    }

    canvas.addEventListener("pointerdown", (e) => { dragging = true; canvas.setPointerCapture(e.pointerId); pickHead(e); setFromEvent(e); });
    canvas.addEventListener("pointermove", (e) => { if (dragging) setFromEvent(e); });
    canvas.addEventListener("pointerup", () => { dragging = false; });
    canvas.addEventListener("pointercancel", () => { dragging = false; });

    window.addEventListener("resize", draw);
    draw();
  }

  window.SectionContent = window.SectionContent || {};
  window.SectionContent["dot-product"] = {
    title: "The Dot Product",
    html,
    onMount,
  };
})();
