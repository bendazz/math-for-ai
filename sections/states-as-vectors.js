/* ============================================================
   Section: Every State Is a Vector  (Vectors unit — section 2)
   Registered under id "states-as-vectors" (see manifest.js).

   Goal: make "a thing becomes a vector" concrete and HONEST, with
   axes the student already understands — before learned embeddings
   arrive with hundreds of invisible axes. Each U.S. state becomes a
   2-D vector from two hand-picked features:
       x = the state's share of total U.S. AREA
       y = the state's share of total U.S. POPULATION
   Both are fractions of the national total, so they're on the same
   (dimensionless) scale. The payoff: DIRECTION now means something.
       slope = popShare / areaShare
             = (state density) / (U.S. average density)
   So the arrow's ANGLE reads as population density relative to the
   national average, and the 45-degree line is "U.S. average density":
   above it = denser than average, below it = emptier. Length = the
   state's overall footprint in the country.

   Reuses drawArrow + T.fitCanvas conventions from vectors-intro.
   Data: 2020 Census population + total area (sq mi). Denominators are
   the true national totals, so a curated subset is fine.
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
    <div class="eyebrow">Vectors · 2</div>
    <h1>Every State Is a Vector</h1>

    <p>Last section, a vector was a bare list of numbers with two pictures — a point and an arrow.
    But where do the numbers <em>come from</em>? Here's the move at the heart of the whole unit:
    you turn a <strong>thing</strong> into a vector by <strong>measuring a few features of it</strong>.
    Pick the features, measure them, and the thing becomes coordinates you can plot.</p>

    <p>Let's do it with something concrete — the U.S. states — using two features:</p>
    <ul>
      <li>the state's <strong>share of the country's total area</strong>, and</li>
      <li>the state's <strong>share of the country's total population</strong>.</li>
    </ul>

    <p>So each state becomes a 2-component vector, <em>(area share, population share)</em>. New Jersey,
    for instance, is about $1$ four-hundredth of the nation's land but nearly $3\\%$ of its people:</p>

    $$\\textbf{New Jersey} = (0.0023,\\ 0.0280)$$

    <p>Why fractions of the national total instead of raw square miles and head-counts? Because raw
    square miles (hundreds of thousands) and raw people (millions) live on wildly different scales —
    you couldn't sensibly compare the two numbers. Turning both into a <strong>share of the U.S.
    total</strong> strips the units away: now each component is just "what fraction of the country,"
    and the two are directly comparable. That one choice is what makes the <em>geometry</em> below
    say something real.</p>

    <h2>Plot them — and read the direction</h2>

    <p>Here are the states, each plotted at its (area share, population share). Pick one to see its
    arrow from the origin. Watch the <strong>angle</strong> of that arrow against the dashed
    diagonal.</p>

    ${T.widget(
      "The states as vectors",
      `<canvas id="st-chart" style="touch-action:none;cursor:pointer"></canvas>
       <div class="controls" style="align-items:center;gap:14px;flex-wrap:wrap">
         <label style="display:flex;align-items:center;gap:7px">
           <span style="color:#515a6e;font-size:.92em">Highlight a state</span>
           <select id="st-pick" style="padding:5px 8px;border:1px solid var(--line);border-radius:7px;font-size:.92em"></select>
         </label>
         <label style="display:flex;align-items:center;gap:6px;color:#515a6e;font-size:.92em;cursor:pointer">
           <input type="checkbox" id="st-arrows" /> Show every state as an arrow
         </label>
       </div>
       <div id="st-read" style="margin-top:6px"></div>`
    )}

    <p>The dashed amber line is the key. On it, a state's share of the people exactly equals its share
    of the land — that's a state of perfectly <strong>average density</strong>. So:</p>
    <ul>
      <li>An arrow that climbs <strong>steeper than the line</strong> (more people-share than
      land-share) belongs to a state <strong>denser than the national average</strong> — New Jersey,
      Massachusetts, Rhode Island shoot almost straight up.</li>
      <li>An arrow <strong>shallower than the line</strong> (more land-share than people-share) is a
      state <strong>emptier than average</strong> — Alaska lies almost flat along the area axis;
      Wyoming and Montana hug it too.</li>
      <li>An arrow lying <strong>right on the line</strong> is about average — Texas sits nearly on
      it.</li>
    </ul>

    <p>That's the thing to notice: the arrow's <strong>direction is not decoration — it's a real
    quantity</strong>. The angle <em>is</em> the state's population density measured against the
    nation's. Spin from flat to steep and you sweep from empty frontier to packed city-state.</p>

    ${T.callout(
      `<p>Why does the angle equal density? Because the slope of the arrow is
       $$\\frac{\\text{population share}}{\\text{area share}}
        = \\frac{\\text{state's people} \\,/\\, \\text{U.S. people}}{\\text{state's area} \\,/\\, \\text{U.S. area}}
        = \\frac{\\text{state's density}}{\\text{U.S. average density}}.$$
       A slope of $1$ (the $45^\\circ$ line) means exactly average density; slope $12$ means twelve
       times as dense; slope $0.01$ means a hundredth as dense. The direction carries the whole
       density story.</p>`,
      { type: "", label: "Where the direction comes from" }
    )}

    <h2>And the length? That's overall footprint</h2>

    <p>Direction tells you what <em>kind</em> of state it is; the arrow's <strong>length</strong>
    tells you how <em>big a piece of the country</em> it is. A long arrow means a large share of the
    nation's land or people (or both): California and Texas reach far out, Alaska is long too (all
    that land). The little states — Rhode Island, Connecticut — sit in a short huddle near the
    origin, small slices on both counts. Two states pointing the same direction but at different
    lengths are <strong>equally dense but different in size</strong>.</p>

    <p>So our two pictures from last section have <em>both</em> come alive here: the <strong>point</strong>
    locates the state in feature-space, and the <strong>arrow</strong> splits cleanly into a meaningful
    <em>direction</em> (density) and a meaningful <em>length</em> (footprint).</p>

    ${T.callout(
      `<p>This is exactly what an AI does with a word — only it doesn't stop at two features it picked
       by hand. It uses hundreds, tuned automatically so that words close in <em>meaning</em> land
       close in space. The principle is the one you just used on the states: a thing becomes a vector
       by measuring features, and then the <em>geometry</em> — direction and distance — carries the
       meaning.</p>`,
      { type: "ai", label: "The same trick, scaled up" }
    )}

    <h2>What you learned</h2>
    <ul>
      <li>You turn a <strong>thing into a vector</strong> by choosing features and measuring them.
      Here: state $\\rightarrow$ (share of U.S. area, share of U.S. population).</li>
      <li>Expressing both features as a <strong>share of the same total</strong> puts them on one
      scale, which is what lets the geometry mean something.</li>
      <li><strong>Direction</strong> reads as population density relative to the national average
      (the $45^\\circ$ line); <strong>length</strong> reads as the state's overall footprint in the
      country.</li>
    </ul>
  `;

  /* ---- data: 2020 Census population + total area (sq mi) ----
     Denominators are the true national totals, so this curated
     subset's shares are correct (they just don't sum to 1). ---- */
  const US_AREA = 3796742, US_POP = 331449281;
  const RAW = [
    ["Alaska", "AK", 665384, 733391, true],
    ["Texas", "TX", 268596, 29145505, true],
    ["California", "CA", 163695, 39538223, true],
    ["Montana", "MT", 147040, 1084225, false],
    ["New Mexico", "NM", 121590, 2117522, false],
    ["Nevada", "NV", 110572, 3104614, false],
    ["Colorado", "CO", 104094, 5773714, false],
    ["Wyoming", "WY", 97813, 576851, false],
    ["Utah", "UT", 84897, 3271616, false],
    ["Kansas", "KS", 82278, 2937880, false],
    ["Florida", "FL", 65758, 21538187, true],
    ["Georgia", "GA", 59425, 10711908, false],
    ["Illinois", "IL", 57914, 12812508, false],
    ["New York", "NY", 54555, 20201249, true],
    ["North Carolina", "NC", 53819, 10439388, false],
    ["Pennsylvania", "PA", 46054, 13002700, false],
    ["Ohio", "OH", 44826, 11799448, false],
    ["Maine", "ME", 35380, 1362359, false],
    ["Massachusetts", "MA", 10554, 7029917, false],
    ["New Jersey", "NJ", 8723, 9288994, true],
    ["Connecticut", "CT", 5543, 3605944, false],
    ["Rhode Island", "RI", 1545, 1097379, false],
  ];
  const STATES = RAW.map(([name, abbr, area, pop, anchor]) => ({
    name, abbr, area, pop, anchor,
    ax: area / US_AREA,   // area share  (x)
    px: pop / US_POP,     // population share (y)
  }));

  const MAX = 0.18;       // both axes 0..MAX (equal scale → diagonal is true 45°)
  const ARROW = "→", TIMES = "×", MIDDOT = "·", NBSP = " ";

  function onMount(root) {
    const canvas = root.querySelector("#st-chart");
    if (!canvas) return;
    const pick = root.querySelector("#st-pick");
    const arrowsBox = root.querySelector("#st-arrows");
    const readEl = root.querySelector("#st-read");

    // populate the dropdown
    pick.innerHTML = STATES
      .map((s, i) => `<option value="${i}">${s.name}</option>`)
      .join("");
    let sel = STATES.findIndex((s) => s.name === "New Jersey");
    pick.value = sel;

    function geom(w, h) {
      const mL = 54, mR = 18, mT = 16, mB = 48;
      const side = Math.min(w - mL - mR, h - mT - mB);
      const left = mL, bottom = h - mB;
      return {
        side, left, bottom,
        X: (v) => left + (v / MAX) * side,
        Y: (v) => bottom - (v / MAX) * side,
      };
    }

    const fmtInt = (n) => n.toLocaleString("en-US");
    const fmtPct = (v) => { const p = v * 100; return (p < 1 ? p.toFixed(2) : p.toFixed(1)) + "%"; };

    function densityText(s) {
      const d = s.px / s.ax;   // density relative to the U.S. average
      if (d >= 1.15) {
        const m = d >= 10 ? Math.round(d) : d.toFixed(1);
        return { text: `Direction ${ARROW} about ${m}${TIMES} the U.S. average density (denser than average).`, col: "#4338ca" };
      }
      if (d <= 0.87) {
        const p = d < 0.1 ? (d * 100).toFixed(1) : Math.round(d * 100);
        return { text: `Direction ${ARROW} about ${p}% of the U.S. average density (emptier than average).`, col: "#0d9488" };
      }
      return { text: `Direction ${ARROW} right around the U.S. average density.`, col: "#b45309" };
    }

    function updateReadout(s) {
      const d = densityText(s);
      readEl.innerHTML =
        `<div style="font-weight:600;font-size:1.05em;margin-bottom:6px;color:#0f172a">${s.name}</div>
         <div style="display:grid;grid-template-columns:auto 1fr;gap:3px 14px;font-size:.92em;color:#475569">
           <span>Area</span><span><b>${fmtInt(s.area)} sq${NBSP}mi</b> ${MIDDOT} ${fmtPct(s.ax)} of U.S. area</span>
           <span>People</span><span><b>${fmtInt(s.pop)}</b> ${MIDDOT} ${fmtPct(s.px)} of U.S. population</span>
           <span>Vector</span><span><b>(${s.ax.toFixed(4)}, ${s.px.toFixed(4)})</b></span>
         </div>
         <div style="margin-top:8px;font-weight:600;color:${d.col}">${d.text}</div>`;
    }

    function draw() {
      const { ctx, w, h } = T.fitCanvas(canvas, 440);
      ctx.clearRect(0, 0, w, h);
      const g = geom(w, h);
      const showArrows = arrowsBox.checked;
      const ticks = [0, 0.05, 0.10, 0.15];

      // gridlines + tick labels
      ctx.font = "11px -apple-system, sans-serif";
      ticks.forEach((t) => {
        ctx.strokeStyle = "#eef0f5"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(g.X(t), g.Y(0)); ctx.lineTo(g.X(t), g.Y(MAX)); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(g.X(0), g.Y(t)); ctx.lineTo(g.X(MAX), g.Y(t)); ctx.stroke();
        ctx.fillStyle = "#8a93a6";
        ctx.textAlign = "center"; ctx.textBaseline = "top";
        ctx.fillText((t * 100) + "%", g.X(t), g.Y(0) + 6);
        if (t > 0) { ctx.textAlign = "right"; ctx.textBaseline = "middle"; ctx.fillText((t * 100) + "%", g.X(0) - 6, g.Y(t)); }
      });

      // axes
      ctx.strokeStyle = "#c7ccd8"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(g.X(0), g.Y(0)); ctx.lineTo(g.X(MAX), g.Y(0)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(g.X(0), g.Y(0)); ctx.lineTo(g.X(0), g.Y(MAX)); ctx.stroke();

      // axis titles
      ctx.fillStyle = "#515a6e"; ctx.font = "12px -apple-system, sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.fillText("share of U.S. area " + ARROW, (g.X(0) + g.X(MAX)) / 2, g.Y(0) + 24);
      ctx.save();
      ctx.translate(g.left - 38, (g.Y(0) + g.Y(MAX)) / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.textAlign = "center"; ctx.textBaseline = "bottom";
      ctx.fillText("share of U.S. population " + ARROW, 0, 0);
      ctx.restore();

      // diagonal: U.S. average density
      ctx.setLineDash([6, 5]); ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(g.X(0), g.Y(0)); ctx.lineTo(g.X(MAX), g.Y(MAX)); ctx.stroke();
      ctx.setLineDash([]);
      ctx.save();
      ctx.translate(g.X(0.123), g.Y(0.123));
      ctx.rotate(-Math.PI / 4);
      ctx.fillStyle = "#b45309"; ctx.font = "11px -apple-system, sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "bottom";
      ctx.fillText("U.S. average density", 0, -4);
      ctx.restore();

      // optional faint arrows to every state
      if (showArrows) {
        STATES.forEach((s, i) => {
          if (i === sel) return;
          drawArrow(ctx, g.X(0), g.Y(0), g.X(s.ax), g.Y(s.px), "rgba(79,70,229,0.16)", 1);
        });
      }

      // dots (+ anchor labels)
      STATES.forEach((s, i) => {
        if (i === sel) return;
        ctx.fillStyle = "#94a3b8";
        ctx.beginPath(); ctx.arc(g.X(s.ax), g.Y(s.px), 3.5, 0, Math.PI * 2); ctx.fill();
        if (s.anchor) {
          ctx.fillStyle = "#64748b"; ctx.font = "10px -apple-system, sans-serif";
          ctx.textAlign = "left"; ctx.textBaseline = "middle";
          ctx.fillText(s.abbr, g.X(s.ax) + 5, g.Y(s.px));
        }
      });

      // selected: arrow + dot + name
      const s = STATES[sel];
      drawArrow(ctx, g.X(0), g.Y(0), g.X(s.ax), g.Y(s.px), "#4f46e5", 2.5);
      ctx.fillStyle = "#0d9488";
      ctx.beginPath(); ctx.arc(g.X(s.ax), g.Y(s.px), 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#0f172a"; ctx.font = "600 12px -apple-system, sans-serif";
      ctx.textAlign = "left"; ctx.textBaseline = "middle";
      ctx.fillText(s.name, g.X(s.ax) + 9, g.Y(s.px));

      updateReadout(s);
    }

    // click a dot to select it
    canvas.addEventListener("click", (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left, my = e.clientY - rect.top;
      const g = geom(rect.width, rect.height);
      let best = -1, bd = 1e9;
      STATES.forEach((s, i) => {
        const dx = g.X(s.ax) - mx, dy = g.Y(s.px) - my;
        const d = dx * dx + dy * dy;
        if (d < bd) { bd = d; best = i; }
      });
      if (best >= 0 && bd < 18 * 18) { sel = best; pick.value = best; draw(); }
    });

    pick.addEventListener("change", () => { sel = parseInt(pick.value, 10); draw(); });
    arrowsBox.addEventListener("change", draw);
    window.addEventListener("resize", draw);
    draw();
  }

  window.SectionContent = window.SectionContent || {};
  window.SectionContent["states-as-vectors"] = {
    title: "Every State Is a Vector",
    html,
    onMount,
  };
})();
