/* ============================================================
   Section: What Is a Vector?  (Vectors unit — section 1)
   Registered under id "vectors-intro" (see manifest.js).
   Opens the new "Vectors" group, building toward embeddings.

   Goal: a vector is a list of numbers, picturable two ways — as
   a POINT in space and as an ARROW from the origin. Build 2D and
   3D intuition with interactive canvases, then make the leap to
   "beyond 3D": you can't draw it, but it's still just a longer
   list, and all the arithmetic carries over (embeddings = vectors
   with hundreds of components).

   Three visuals:
     1) draggable 2D vector with a point/arrow toggle (onMount)
     2) 3D vector steered by x/y/z sliders, isometric projection
        with a floor parallelogram + vertical drop for depth
     3) a static colored strip standing in for a high-D embedding
        (built in the html via emb(), no onMount)

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

  // static colored strip standing in for a high-dimensional vector
  function emb() {
    let cells = "";
    for (let i = 0; i < 48; i++) {
      const v = Math.sin(i * 0.9) * Math.cos(i * 0.27); // deterministic, ~[-1,1]
      const t = (v + 1) / 2;
      let r, g, b;
      if (t < 0.5) { const k = t / 0.5; r = Math.round(70 + k * 185); g = Math.round(120 + k * 135); b = 245; }
      else { const k = (t - 0.5) / 0.5; r = 245; g = Math.round(255 - k * 150); b = Math.round(255 - k * 190); }
      cells += `<span style="display:inline-block;width:13px;height:24px;background:rgb(${r},${g},${b})"></span>`;
    }
    return `<div style="line-height:0;border-radius:6px;overflow:hidden;border:1px solid var(--line);` +
           `display:flex;flex-wrap:wrap;max-width:100%;margin:1.1em 0">${cells}</div>`;
  }

  const html = `
    <div class="eyebrow">Vectors · 1</div>
    <h1>What Is a Vector?</h1>

    <p>We're starting a new thread. Everything an AI does with words, images, or sound, it does by
    first turning them into <strong>vectors</strong> — and a vector is a surprisingly simple thing:
    a list of numbers. By the end of this unit you'll see how a model can decide that "king" and
    "queen" are related, or that two sentences mean nearly the same thing, using nothing but the
    geometry of these number-lists. First, the object itself.</p>

    <h2>A vector is a list of numbers</h2>

    <p>A <strong>vector</strong> is just an ordered list of numbers, called its
    <strong>components</strong>. Here's a two-component vector:</p>

    $$\\mathbf{v} = (3, 2)$$

    <p>The order matters — $(3, 2)$ is not $(2, 3)$ — and the number of components is the vector's
    <strong>dimension</strong>. So $(3, 2)$ is a <strong>2-dimensional</strong> vector. (You'll also
    see vectors written as a tall column, $\\begin{bmatrix} 3 \\\\ 2 \\end{bmatrix}$; same numbers,
    same vector.) That's the whole definition. Everything else is about how to <em>picture</em> it
    and <em>compute</em> with it.</p>

    <h2>Two pictures: a point and an arrow</h2>

    <p>Those two numbers can be drawn in the plane two different ways — and both are useful:</p>
    <ul>
      <li>as a <strong>point</strong>: go $3$ across and $2$ up, and put a dot there. The vector is
      a <em>location</em>.</li>
      <li>as an <strong>arrow</strong>: draw an arrow from the <strong>origin</strong> $(0,0)$ out
      to that same spot. The vector is a <em>direction with a length</em>.</li>
    </ul>

    <p>It's the same pair of numbers either way — two lenses on one object. The point view is handy
    when a vector marks <em>where something is</em>; the arrow view is handy when it represents a
    <em>movement</em> or a <em>strength and direction</em>. Drag the head below to move the vector,
    and flip between the two pictures.</p>

    ${T.widget(
      "A 2-D vector — drag it around",
      `<canvas id="v2-chart" style="touch-action:none;cursor:crosshair"></canvas>
       <div class="controls">
         <button class="btn" data-mode="arrow">Arrow</button>
         <button class="btn ghost" data-mode="point">Point</button>
       </div>
       <div class="readout">
         <div class="stat"><span class="label">The vector</span><span class="value" id="v2-read">(3, 2)</span></div>
       </div>`
    )}

    <p>Notice the two dashed lines: they read off the components. The arrow's tip sits exactly
    above its first number on the horizontal axis and exactly across from its second number on the
    vertical axis. The components <em>are</em> the coordinates.</p>

    <h2>Stepping up to 3-D</h2>

    <p>Add one more number and you have a <strong>3-dimensional</strong> vector — a point (or arrow)
    in space rather than on a flat plane:</p>

    $$\\mathbf{w} = (3, 2, 2)$$

    <p>The third component moves you along a new axis, often drawn coming "up" out of the floor.
    Steer the sliders below. The faint parallelogram on the floor and the dashed vertical line are
    just depth cues — they show where the arrow's tip sits above the ground.</p>

    ${T.widget(
      "A 3-D vector — steer the components",
      `<canvas id="v3-chart"></canvas>
       <div class="slider-grid" style="margin-top:12px">
         <div class="slider-row" style="grid-template-columns:1.5em 1fr 2.5em">
           <span class="slabel">x</span>
           <input type="range" class="v3-s" data-i="0" min="-4" max="4" step="1" value="3" />
           <span class="sval" id="v3-v0">3</span>
         </div>
         <div class="slider-row" style="grid-template-columns:1.5em 1fr 2.5em">
           <span class="slabel">y</span>
           <input type="range" class="v3-s" data-i="1" min="-4" max="4" step="1" value="2" />
           <span class="sval" id="v3-v1">2</span>
         </div>
         <div class="slider-row" style="grid-template-columns:1.5em 1fr 2.5em">
           <span class="slabel">z</span>
           <input type="range" class="v3-s" data-i="2" min="-4" max="4" step="1" value="2" />
           <span class="sval" id="v3-v2">2</span>
         </div>
       </div>
       <div class="readout">
         <div class="stat"><span class="label">The vector</span><span class="value" id="v3-read">(3, 2, 2)</span></div>
       </div>`
    )}

    <h2>Beyond 3-D: vectors you can't picture</h2>

    <p>Here's the leap that makes vectors so powerful for AI. Nothing in the definition — "an
    ordered list of numbers" — says you have to stop at three. A vector can have $4$ components, or
    $50$, or $768$. We simply lose the ability to <em>draw</em> it, because we live in three
    dimensions. But that's a limit on our eyes, not on the math.</p>

    <p>This is exactly what a language model produces. When it reads a word, it represents it as an
    <strong>embedding</strong> — a vector with hundreds of components (Google's free embedding model
    gives $768$ of them). You can't sketch a $768$-dimensional arrow, but you can still picture one
    word's embedding as a long strip of numbers:</p>

    ${emb()}

    <p>Each little block is one component. And here's the payoff to hold onto for the rest of the
    unit: <strong>every operation we'll learn — adding vectors, measuring their length, comparing
    their directions — is just arithmetic on these lists, and works the very same way whether
    there are $2$ numbers or $768$.</strong> Your 2-D and 3-D intuition doesn't get thrown away in
    high dimensions; it's the map you carry up there.</p>

    <h2>What you learned</h2>
    <ul>
      <li>A <strong>vector</strong> is an ordered list of numbers (its <strong>components</strong>);
      how many there are is its <strong>dimension</strong>.</li>
      <li>In 2-D and 3-D it can be pictured two ways: a <strong>point</strong> (a location) or an
      <strong>arrow</strong> from the origin (a direction and length) — same numbers, two views.</li>
      <li>Vectors aren't limited to 3 components. <strong>Beyond 3-D you can't draw them, but the
      arithmetic is identical</strong> — which is how AI represents words as $768$-number
      embeddings.</li>
    </ul>
  `;

  function onMount(root) {
    const c2 = root.querySelector("#v2-chart");
    if (!c2) return;

    /* ---------- 2-D draggable vector ---------- */
    let P = [3, 2];
    let mode = "arrow";
    const read2 = root.querySelector("#v2-read");

    function draw2() {
      const { ctx, w, h } = T.fitCanvas(c2, 320);
      ctx.clearRect(0, 0, w, h);
      const unit = (h - 36) / 12;            // 12 units tall (-6..6)
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

      const px = X(P[0]), py = Y(P[1]);

      // component dashed lines
      ctx.setLineDash([4, 4]); ctx.strokeStyle = "#b8bfce"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, Y(0)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(X(0), py); ctx.stroke();
      ctx.setLineDash([]);

      if (mode === "arrow") drawArrow(ctx, X(0), Y(0), px, py, "#4f46e5", 2.5);

      // the point / head
      ctx.fillStyle = "#0d9488";
      ctx.beginPath(); ctx.arc(px, py, 5.5, 0, Math.PI * 2); ctx.fill();

      // component value labels
      ctx.fillStyle = "#515a6e"; ctx.font = "12px -apple-system, sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      if (P[0] !== 0) ctx.fillText(P[0], px, Y(0) + 5);
      ctx.textAlign = "right"; ctx.textBaseline = "middle";
      if (P[1] !== 0) ctx.fillText(P[1], X(0) - 6, py);

      read2.textContent = "(" + P[0] + ", " + P[1] + ")";
    }

    function setFromEvent(e) {
      const rect = c2.getBoundingClientRect();
      const unit = (rect.height - 36) / 12;
      const ox = rect.width / 2, oy = rect.height / 2;
      const cxp = e.clientX - rect.left, cyp = e.clientY - rect.top;
      let x = Math.round((cxp - ox) / unit);
      let y = Math.round((oy - cyp) / unit);
      x = Math.max(-6, Math.min(6, x));
      y = Math.max(-6, Math.min(6, y));
      P = [x, y];
      draw2();
    }

    let dragging = false;
    c2.addEventListener("pointerdown", (e) => { dragging = true; c2.setPointerCapture(e.pointerId); setFromEvent(e); });
    c2.addEventListener("pointermove", (e) => { if (dragging) setFromEvent(e); });
    c2.addEventListener("pointerup", () => { dragging = false; });
    c2.addEventListener("pointercancel", () => { dragging = false; });

    root.querySelectorAll("[data-mode]").forEach((b) =>
      b.addEventListener("click", () => {
        mode = b.dataset.mode;
        root.querySelectorAll("[data-mode]").forEach((o) =>
          o.className = "btn" + (o.dataset.mode === mode ? "" : " ghost"));
        draw2();
      })
    );

    /* ---------- 3-D vector with sliders ---------- */
    const c3 = root.querySelector("#v3-chart");
    let V = [3, 2, 2];
    const read3 = root.querySelector("#v3-read");
    const v3vals = [0, 1, 2].map((i) => root.querySelector("#v3-v" + i));

    function draw3() {
      const { ctx, w, h } = T.fitCanvas(c3, 300);
      ctx.clearRect(0, 0, w, h);
      const s = 26, cx = w / 2, cy = h * 0.6;
      const proj = (x, y, z) => [cx + s * (x * 0.866 - y * 0.866), cy + s * (x * 0.5 + y * 0.5 - z)];
      const O = proj(0, 0, 0);

      function axis(dx, dy, dz, label, lox, loy) {
        const pos = proj(dx * 4, dy * 4, dz * 4);
        const neg = proj(-dx * 2.2, -dy * 2.2, -dz * 2.2);
        ctx.strokeStyle = "#e3e6ee"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(neg[0], neg[1]); ctx.lineTo(O[0], O[1]); ctx.stroke();
        drawArrow(ctx, O[0], O[1], pos[0], pos[1], "#9aa3b2", 1.5);
        ctx.fillStyle = "#8a93a6"; ctx.font = "13px -apple-system, sans-serif";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(label, pos[0] + lox, pos[1] + loy);
      }
      axis(1, 0, 0, "x", 10, 4);
      axis(0, 1, 0, "y", -10, 4);
      axis(0, 0, 1, "z", 0, -10);

      const [vx, vy, vz] = V;
      const Pp = proj(vx, vy, vz), foot = proj(vx, vy, 0), fx = proj(vx, 0, 0), fy = proj(0, vy, 0);

      // floor parallelogram + vertical drop (depth cues)
      ctx.setLineDash([4, 4]); ctx.strokeStyle = "#c7ccd8"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(O[0], O[1]); ctx.lineTo(fx[0], fx[1]); ctx.lineTo(foot[0], foot[1]); ctx.lineTo(fy[0], fy[1]); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(foot[0], foot[1]); ctx.lineTo(Pp[0], Pp[1]); ctx.stroke();
      ctx.setLineDash([]);

      drawArrow(ctx, O[0], O[1], Pp[0], Pp[1], "#4f46e5", 2.5);
      ctx.fillStyle = "#0d9488"; ctx.beginPath(); ctx.arc(Pp[0], Pp[1], 5, 0, Math.PI * 2); ctx.fill();

      read3.textContent = "(" + vx + ", " + vy + ", " + vz + ")";
    }

    root.querySelectorAll(".v3-s").forEach((sl) =>
      sl.addEventListener("input", () => {
        const i = parseInt(sl.dataset.i, 10);
        V[i] = parseInt(sl.value, 10);
        v3vals[i].textContent = V[i];
        draw3();
      })
    );

    window.addEventListener("resize", () => { draw2(); draw3(); });
    draw2();
    draw3();
  }

  window.SectionContent = window.SectionContent || {};
  window.SectionContent["vectors-intro"] = {
    title: "What Is a Vector?",
    html,
    onMount,
  };
})();
