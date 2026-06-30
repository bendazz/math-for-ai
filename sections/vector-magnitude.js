/* ============================================================
   Section: How Long Is a Vector?  (Vectors unit — section 4)
   Registered under id "vector-magnitude" (see manifest.js).

   The LENGTH / magnitude / norm of a vector, via Pythagoras:
       ‖v‖ = sqrt(v1^2 + v2^2)        (2-D)
            = sqrt(v1^2 + v2^2 + v3^2) (3-D)
            = sqrt(sum of squares)     (any dimension, incl. 768)
   Worked anchor: ‖(3,4)‖ = 5.
   Properties: ‖v‖ ≥ 0 (=0 only for the zero vector); ‖c·v‖ = |c|·‖v‖
   (the measurable version of last section's "scaling changes length
   by |c|"). Then UNIT VECTORS / NORMALIZATION: v / ‖v‖ has length 1,
   same direction — "pure direction." AI payoff: embeddings are often
   normalized to unit length so only DIRECTION (meaning) matters,
   which is the natural setup for comparing words by direction.

   One interactive canvas (reuse drawArrow + T.fitCanvas): a draggable
   vector showing its right triangle (legs = components, hypotenuse =
   the vector), a live ‖v‖ computation, and a "show unit vector"
   toggle that draws the normalized vector on the unit circle.

   No inline problems (practice lives in a dedicated section — see
   [[concept-sections-no-inline-problems]]). No forward lead-in.
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
    <div class="eyebrow">Vectors · 4</div>
    <h1>How Long Is a Vector?</h1>

    <p>We can add vectors, scale them, and average them. Here's the next natural question about a
    single vector: <strong>how long is its arrow?</strong> That length has a name — the
    <strong>magnitude</strong> (also called the <strong>norm</strong>) — and it turns out to be an
    old friend in disguise.</p>

    <h2>It's just the Pythagorean theorem</h2>

    <p>Draw the vector $\\mathbf{v} = (v_1, v_2)$ as an arrow, and drop its components as the two legs
    of a right triangle: go $v_1$ across, then $v_2$ up. The arrow itself is the
    <strong>hypotenuse</strong>. So its length is exactly what Pythagoras gives you:</p>

    $$\\lVert \\mathbf{v} \\rVert = \\sqrt{v_1^{\\,2} + v_2^{\\,2}}.$$

    <p>The double bars $\\lVert \\mathbf{v} \\rVert$ are the notation for "length of $\\mathbf{v}$." A
    clean example is the classic $3$–$4$–$5$ triangle:</p>

    $$\\lVert (3, 4) \\rVert = \\sqrt{3^{\\,2} + 4^{\\,2}} = \\sqrt{9 + 16} = \\sqrt{25} = 5.$$

    <p>Drag the arrowhead below. The dashed legs are the components; the readout squares them, adds
    them, and takes the square root — the length of the arrow.</p>

    ${T.widget(
      "A vector and its length",
      `<canvas id="mag-chart" style="touch-action:none;cursor:crosshair"></canvas>
       <div class="controls">
         <button class="btn ghost" data-toggle-unit>Show unit vector</button>
       </div>
       <div id="mag-read" style="margin-top:6px"></div>`
    )}

    <h2>Up to 3-D, and far beyond</h2>

    <p>Adding a third component just adds another squared term under the root — it's Pythagoras
    applied twice:</p>

    $$\\lVert (v_1, v_2, v_3) \\rVert = \\sqrt{v_1^{\\,2} + v_2^{\\,2} + v_3^{\\,2}}.$$

    <p>And the pattern doesn't stop. For a vector with any number of components, the length is the
    square root of the sum of all the squares:</p>

    $$\\lVert \\mathbf{v} \\rVert = \\sqrt{v_1^{\\,2} + v_2^{\\,2} + \\cdots + v_n^{\\,2}}.$$

    <p>You can't <em>draw</em> the triangle for a $768$-component embedding, but the formula doesn't
    care — square every component, add them up, take the root, and you have the length of that word's
    vector. The picture stops at 3-D; the arithmetic keeps going.</p>

    <h2>Two facts worth keeping</h2>
    <ul>
      <li>A length is never negative: $\\lVert \\mathbf{v} \\rVert \\ge 0$, and it equals $0$
      <em>only</em> for the zero vector $(0, 0, \\dots)$ — the one arrow with no length.</li>
      <li>Scaling scales the length: $\\lVert c\\,\\mathbf{v} \\rVert = |c|\\,\\lVert \\mathbf{v}
      \\rVert$. This is the measurable version of last section's picture — doubling a vector
      ($c = 2$) really does make it <strong>twice</strong> as long, and a negative $c$ doesn't change
      the length at all (only the direction).</li>
    </ul>

    <h2>Unit vectors: pure direction</h2>

    <p>Here's the move that makes length especially useful. If you <strong>divide a vector by its own
    length</strong>, you get a vector of length exactly $1$ pointing the very same way:</p>

    $$\\hat{\\mathbf{v}} = \\frac{\\mathbf{v}}{\\lVert \\mathbf{v} \\rVert}
      \\qquad\\text{(length } 1\\text{, same direction).}$$

    <p>This is called <strong>normalizing</strong>, and the result $\\hat{\\mathbf{v}}$ is a
    <strong>unit vector</strong>. Check it on the $3$–$4$–$5$ example: $(3,4)$ has length $5$, so
    $\\tfrac15(3,4) = (0.6,\\ 0.8)$, and indeed $\\sqrt{0.6^{\\,2} + 0.8^{\\,2}} = \\sqrt{0.36 + 0.64}
    = \\sqrt{1} = 1$. Toggle "Show unit vector" above: every direction, once normalized, lands on the
    same circle of radius $1$. Normalizing throws away the length and keeps <em>only</em> the
    direction.</p>

    ${T.callout(
      `<p>This is why embeddings are so often <strong>normalized to unit length</strong> (the
       in-browser model we'll use does it automatically). A word vector's <em>direction</em> is what
       carries its meaning; its raw <em>length</em> can be a distraction — sometimes just an artifact
       of how common or long the word is. Normalizing puts every word on the same unit sphere, so the
       only thing left to compare between two words is the <strong>direction</strong> they point.
       That's exactly the comparison we'll want for measuring how similar two words are.</p>`,
      { type: "ai", label: "Why embeddings get normalized" }
    )}

    <h2>What you learned</h2>
    <ul>
      <li>The <strong>magnitude</strong> (length, norm) of a vector is
      $\\lVert \\mathbf{v} \\rVert = \\sqrt{v_1^{\\,2} + \\cdots + v_n^{\\,2}}$ — the Pythagorean
      theorem, in any number of dimensions.</li>
      <li>Length is $\\ge 0$ (zero only for the zero vector), and scaling obeys
      $\\lVert c\\,\\mathbf{v} \\rVert = |c|\\,\\lVert \\mathbf{v} \\rVert$.</li>
      <li><strong>Normalizing</strong> — dividing by the length — gives a <strong>unit vector</strong>
      (length $1$) that keeps the direction and discards the size. It's how embeddings are put on an
      equal footing so that direction alone carries the meaning.</li>
    </ul>
  `;

  function onMount(root) {
    const canvas = root.querySelector("#mag-chart");
    if (!canvas) return;
    const readEl = root.querySelector("#mag-read");
    let P = [3, 4];
    let showUnit = false;

    function draw() {
      const { ctx, w, h } = T.fitCanvas(canvas, 360);
      ctx.clearRect(0, 0, w, h);
      const unit = (h - 36) / 12;          // 12 units tall (−6..6)
      const ox = w / 2, oy = h / 2;
      const X = (x) => ox + x * unit, Y = (y) => oy - y * unit;

      // grid
      ctx.strokeStyle = "#f0f1f6"; ctx.lineWidth = 1;
      const xspan = Math.ceil((w / 2) / unit);
      for (let gx = -xspan; gx <= xspan; gx++) { ctx.beginPath(); ctx.moveTo(X(gx), 0); ctx.lineTo(X(gx), h); ctx.stroke(); }
      for (let gy = -6; gy <= 6; gy++) { ctx.beginPath(); ctx.moveTo(0, Y(gy)); ctx.lineTo(w, Y(gy)); ctx.stroke(); }
      // axes
      ctx.strokeStyle = "#c7ccd8"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(0, Y(0)); ctx.lineTo(w, Y(0)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(X(0), 0); ctx.lineTo(X(0), h); ctx.stroke();

      const len = Math.hypot(P[0], P[1]);

      // unit circle + unit vector (drawn under the main arrow)
      if (showUnit) {
        ctx.strokeStyle = "#e7c9f2"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(X(0), Y(0), unit, 0, Math.PI * 2); ctx.stroke();
        if (len > 0) {
          const u = [P[0] / len, P[1] / len];
          drawArrow(ctx, X(0), Y(0), X(u[0]), Y(u[1]), "#0d9488", 3);
          ctx.fillStyle = "#0d9488"; ctx.beginPath(); ctx.arc(X(u[0]), Y(u[1]), 4.5, 0, Math.PI * 2); ctx.fill();
        }
      }

      // right-triangle legs (components)
      ctx.setLineDash([4, 4]); ctx.strokeStyle = "#b8bfce"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(X(0), Y(0)); ctx.lineTo(X(P[0]), Y(0)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(X(P[0]), Y(0)); ctx.lineTo(X(P[0]), Y(P[1])); ctx.stroke();
      ctx.setLineDash([]);
      // leg-length labels
      ctx.fillStyle = "#8a93a6"; ctx.font = "11px -apple-system, sans-serif";
      if (P[0] !== 0) { ctx.textAlign = "center"; ctx.textBaseline = "top"; ctx.fillText(Math.abs(P[0]), X(P[0] / 2), Y(0) + 5); }
      if (P[1] !== 0) { ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(Math.abs(P[1]), X(P[0]) + 6, Y(P[1] / 2)); }

      // the vector (hypotenuse)
      drawArrow(ctx, X(0), Y(0), X(P[0]), Y(P[1]), "#4f46e5", 2.6);
      ctx.fillStyle = "#4f46e5"; ctx.beginPath(); ctx.arc(X(P[0]), Y(P[1]), 5.5, 0, Math.PI * 2); ctx.fill();

      // readout
      const sq = P[0] * P[0] + P[1] * P[1];
      let htmlR =
        `<div style="font-size:1.05em;color:#0f172a"><b>‖v‖ = &radic;(${P[0]}² + ${P[1]}²) = &radic;${sq} = ${len.toFixed(2)}</b></div>`;
      if (showUnit) {
        if (len > 0) {
          htmlR += `<div style="margin-top:5px;color:#0d9488;font-weight:600">unit vector v&#770; = (${(P[0] / len).toFixed(2)}, ${(P[1] / len).toFixed(2)}) — length 1</div>`;
        } else {
          htmlR += `<div style="margin-top:5px;color:#94a3b8">the zero vector has no direction to normalize</div>`;
        }
      }
      readEl.innerHTML = htmlR;
    }

    function setFromEvent(e) {
      const rect = canvas.getBoundingClientRect();
      const unit = (rect.height - 36) / 12;
      const ox = rect.width / 2, oy = rect.height / 2;
      let x = Math.round((e.clientX - rect.left - ox) / unit);
      let y = Math.round((oy - (e.clientY - rect.top)) / unit);
      x = Math.max(-6, Math.min(6, x));
      y = Math.max(-6, Math.min(6, y));
      P = [x, y];
      draw();
    }

    let dragging = false;
    canvas.addEventListener("pointerdown", (e) => { dragging = true; canvas.setPointerCapture(e.pointerId); setFromEvent(e); });
    canvas.addEventListener("pointermove", (e) => { if (dragging) setFromEvent(e); });
    canvas.addEventListener("pointerup", () => { dragging = false; });
    canvas.addEventListener("pointercancel", () => { dragging = false; });

    const toggle = root.querySelector("[data-toggle-unit]");
    toggle.addEventListener("click", () => {
      showUnit = !showUnit;
      toggle.textContent = showUnit ? "Hide unit vector" : "Show unit vector";
      toggle.className = "btn" + (showUnit ? "" : " ghost");
      draw();
    });

    window.addEventListener("resize", draw);
    draw();
  }

  window.SectionContent = window.SectionContent || {};
  window.SectionContent["vector-magnitude"] = {
    title: "How Long Is a Vector?",
    html,
    onMount,
  };
})();
