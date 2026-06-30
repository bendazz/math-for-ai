/* ============================================================
   Section: Cosine Similarity  (Vectors unit — section 7)
   Registered under id "cosine-similarity" (see manifest.js).

   The payoff of the whole vector-math thread. The raw dot product
   measures alignment but mixes in the vectors' lengths. Divide it
   out by both magnitudes and you isolate pure direction:
       cos-sim(u,v) = (u·v) / (‖u‖ ‖v‖) = cosθ = û · v̂
   Always in [−1, 1], independent of length:
       +1 same direction (identical) · 0 perpendicular (unrelated)
       −1 opposite.
   Uses BOTH prior tools — dot product (numerator) + magnitude
   (denominator) — so it's the natural capstone. AI grounding: THE
   standard similarity measure for embeddings (search/RAG, recommend,
   cluster); "king"~"queen" high, "king"~"bicycle" near 0; embeddings
   often pre-normalized so cosine = plain dot product.

   Interactive canvas (reuse drawArrow + angle arc) + an HTML −1..1
   gauge: two draggable vectors; the readout shows dot, ‖u‖, ‖v‖, the
   cosine, and the angle — and dragging v farther out (same direction)
   grows the dot but leaves the cosine fixed.

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
    <div class="eyebrow">Vectors · 7</div>
    <h1>Cosine Similarity</h1>

    <p>The dot product tells us how aligned two vectors are — but it has a quirk: it also grows when
    the vectors get <em>longer</em>. Two long vectors can have a bigger dot product than two short ones
    pointing the exact same way. If what we care about is <strong>direction</strong> — and for word
    meanings, it is — we want to factor the lengths out. Doing that gives the single most-used
    similarity score in all of AI: <strong>cosine similarity</strong>.</p>

    <h2>Divide out the lengths</h2>

    <p>Take the dot product and divide by both magnitudes:</p>

    $$\\text{cosine similarity}(\\mathbf{u}, \\mathbf{v})
      = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\lVert \\mathbf{u} \\rVert\\,\\lVert \\mathbf{v} \\rVert}
      = \\cos\\theta.$$

    <p>Look at what each piece does. The dot product on top carries the alignment; dividing by the two
    lengths on the bottom cancels out "how long" each vector is, leaving only "which way" they point.
    In fact, this is <em>exactly</em> the dot product of the two <strong>unit vectors</strong> from the
    magnitude section — normalize both first, then dot them: $\\hat{\\mathbf{u}} \\cdot \\hat{\\mathbf{v}}$.
    It uses both tools we just built — the dot product up top, the magnitudes down below.</p>

    <h2>A score from −1 to +1</h2>

    <p>Because the lengths are gone, cosine similarity always lands in a fixed range, $-1$ to $+1$, no
    matter how big the vectors are:</p>
    <ul>
      <li><strong>$+1$</strong> — the vectors point the <strong>same way</strong>: as similar as
      possible.</li>
      <li><strong>$0$</strong> — they're <strong>perpendicular</strong>: unrelated.</li>
      <li><strong>$-1$</strong> — they point in <strong>opposite</strong> directions.</li>
    </ul>

    <p>Work the $3$–$4$–$5$ vectors as an example. With $\\mathbf{u} = (3, 4)$ and $\\mathbf{v} =
    (4, 3)$:</p>

    $$\\frac{(3)(4) + (4)(3)}{\\lVert (3,4) \\rVert\\,\\lVert (4,3) \\rVert}
      = \\frac{12 + 12}{5 \\cdot 5} = \\frac{24}{25} = 0.96.$$

    <p>A cosine of $0.96$ is very close to $1$ — these two arrows point almost the same way, so they're
    highly similar. By contrast $(1, 0)$ and $(0, 1)$ give $\\tfrac{0}{1} = 0$ (perpendicular,
    unrelated), and $(2, 0)$ and $(-3, 0)$ give $\\tfrac{-6}{6} = -1$ (dead opposite).</p>

    ${T.callout(
      `<p>Here's the property that makes it "cosine": <strong>length doesn't matter, only direction.</strong>
       Stretch $\\mathbf{u}$ to $2\\mathbf{u}$ and the score is unchanged —
       $\\dfrac{(2\\mathbf{u}) \\cdot \\mathbf{v}}{\\lVert 2\\mathbf{u} \\rVert\\,\\lVert \\mathbf{v} \\rVert}
        = \\dfrac{2\\,(\\mathbf{u} \\cdot \\mathbf{v})}{2\\,\\lVert \\mathbf{u} \\rVert\\,\\lVert \\mathbf{v} \\rVert}
        = \\dfrac{\\mathbf{u} \\cdot \\mathbf{v}}{\\lVert \\mathbf{u} \\rVert\\,\\lVert \\mathbf{v} \\rVert}$ —
       the $2$ on top and bottom cancel. Two vectors on the same ray are a perfect $1.0$ no matter their
       lengths.</p>`,
      { type: "", label: "Only the angle counts" }
    )}

    <p>Drag the two arrowheads below. The gauge shows the cosine similarity on its $-1$ to $+1$ scale.
    Try dragging $\\mathbf{v}$ <em>farther out along the same line</em>: the dot product climbs, but the
    cosine similarity doesn't move at all.</p>

    ${T.widget(
      "Cosine similarity between two vectors",
      `<canvas id="cos-chart" style="touch-action:none;cursor:crosshair"></canvas>
       <div class="tr-meta" style="margin-top:4px">Drag either arrowhead (indigo = u, teal = v).</div>
       <div style="margin-top:14px">
         <div style="position:relative;height:12px;border-radius:6px;background:linear-gradient(to right,#fda4af,#e5e7eb,#86efac)">
           <div id="cos-marker" style="position:absolute;top:-4px;left:98%;width:18px;height:18px;border-radius:50%;background:#4f46e5;border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.25);transform:translateX(-50%)"></div>
         </div>
         <div style="display:flex;justify-content:space-between;font-size:.8em;color:#64748b;margin-top:6px">
           <span>−1 &middot; opposite</span><span>0 &middot; unrelated</span><span>+1 &middot; identical</span>
         </div>
       </div>
       <div id="cos-read" style="margin-top:12px"></div>`
    )}

    ${T.callout(
      `<p>This is the number behind "find me things like this one." Every word and sentence becomes an
       embedding vector; to ask how related two of them are, you take their <strong>cosine
       similarity</strong>. <em>king</em> and <em>queen</em> score high (their arrows nearly align);
       <em>king</em> and <em>bicycle</em> score near $0$. Search engines, retrieval for chatbots
       (the "R" in RAG), recommendations, and grouping documents into topics all rank results by
       cosine similarity. And since embeddings are usually <strong>normalized to unit length</strong>
       already (the magnitude section), the denominator is just $1 \\times 1$ — so in practice cosine
       similarity is simply the <strong>dot product</strong>. Every piece of this unit comes together
       in that one comparison.</p>`,
      { type: "ai", label: "How AI measures 'similar'" }
    )}

    <h2>What you learned</h2>
    <ul>
      <li><strong>Cosine similarity</strong> is the dot product divided by both lengths:
      $\\dfrac{\\mathbf{u} \\cdot \\mathbf{v}}{\\lVert \\mathbf{u} \\rVert\\,\\lVert \\mathbf{v} \\rVert}
      = \\cos\\theta$ — the dot product of the unit vectors.</li>
      <li>It always sits in $[-1, +1]$ and ignores length: $+1$ same direction, $0$ perpendicular,
      $-1$ opposite.</li>
      <li>It's <strong>the</strong> standard way AI measures how similar two words, sentences, or
      documents are — and for unit-length embeddings it's just the dot product.</li>
    </ul>
  `;

  function onMount(root) {
    const canvas = root.querySelector("#cos-chart");
    if (!canvas) return;
    const readEl = root.querySelector("#cos-read");
    const marker = root.querySelector("#cos-marker");
    const R = 6;
    let u = [3, 4], v = [4, 3], active = null, dragging = false;

    function draw() {
      const { ctx, w, h } = T.fitCanvas(canvas, 360);
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

      const dot = u[0] * v[0] + u[1] * v[1];
      const lu = Math.hypot(u[0], u[1]), lv = Math.hypot(v[0], v[1]);

      // angle arc (sampled in math space)
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

      // vectors
      drawArrow(ctx, X(0), Y(0), X(u[0]), Y(u[1]), "#4f46e5", 2.6);
      drawArrow(ctx, X(0), Y(0), X(v[0]), Y(v[1]), "#0d9488", 2.6);
      [[u, "#4f46e5", "u"], [v, "#0d9488", "v"]].forEach(([p, cc, lab]) => {
        ctx.fillStyle = cc; ctx.beginPath(); ctx.arc(X(p[0]), Y(p[1]), 5, 0, Math.PI * 2); ctx.fill();
        ctx.font = "600 12px -apple-system, sans-serif"; ctx.textAlign = "left"; ctx.textBaseline = "bottom";
        ctx.fillText(lab, X(p[0]) + 6, Y(p[1]) - 3);
      });

      // readout + gauge
      if (lu === 0 || lv === 0) {
        marker.style.left = "50%"; marker.style.background = "#cbd5e1";
        readEl.innerHTML = `<div style="color:#94a3b8">Give both vectors some length to compare their directions.</div>`;
        return;
      }
      const cos = Math.max(-1, Math.min(1, dot / (lu * lv)));
      const deg = Math.round(Math.acos(cos) * 180 / Math.PI);
      marker.style.left = ((cos + 1) / 2 * 100).toFixed(1) + "%";

      let label, col;
      if (cos >= 0.6) { label = "pointing nearly the same way — highly similar"; col = "#15803d"; }
      else if (cos >= 0.15) { label = "partly aligned — somewhat similar"; col = "#15803d"; }
      else if (cos > -0.15) { label = "roughly perpendicular — unrelated"; col = "#b45309"; }
      else if (cos > -0.6) { label = "partly opposed"; col = "#be123c"; }
      else { label = "pointing nearly opposite ways"; col = "#be123c"; }
      marker.style.background = col;

      readEl.innerHTML =
        `<div style="font-size:1.02em;color:#0f172a"><b>cos&nbsp;=&nbsp;${dot}&nbsp;/&nbsp;(${lu.toFixed(2)} &times; ${lv.toFixed(2)})&nbsp;=&nbsp;${cos.toFixed(2)}</b></div>` +
        `<div style="margin-top:4px;font-weight:600;color:${col}">angle &asymp; ${deg}° — ${label}</div>`;
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
  window.SectionContent["cosine-similarity"] = {
    title: "Cosine Similarity",
    html,
    onMount,
  };
})();
