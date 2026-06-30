/* ============================================================
   Section: Pooling — From Words to Sentences  (Embeddings · 3)
   Registered under id "vector-pooling" (see manifest.js).

   How a whole SENTENCE becomes one vector: MEAN POOLING — embed each
   word, average the vectors (add, then ÷ n). Callback to vector-
   arithmetic (averaging = add then scale by 1/n) and to magnitude/
   cosine.

   Two real insights, both honest on our data:
     1) Averaging UNIT vectors gives length < 1; the average's length
        = how much the words AGREE in direction. Aligned -> ~1,
        perpendicular -> 0.707, opposite -> 0 (cancellation). So a
        coherent phrase pools long; a jumble pools short. Usually you
        re-normalize; cosine ignores length anyway.
     2) The pooled vector sits among its own ingredient words.
   Honest nuance: real models pass words through a transformer that
   BLENDS CONTEXT first, then mean-pool the contextual token vectors;
   averaging raw word vectors is the simpler classic "bag of words".

   Two interactives:
     - angle slider: two unit vectors + their average, length = cos(θ/2)
     - real-data chips: pick words -> pooled length + coherence + cosine
       of the pooled vector to each of the 10 words (loads
       sections/word-embeddings.json, graceful fallback)

   No inline problems (convention). No forward lead-in. No currency $.
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
    <div class="eyebrow">Embeddings · 3</div>
    <h1>Pooling: From Words to Sentences</h1>

    <p>We can turn a single word into a vector. But meaning really lives in <em>phrases</em> and
    <em>sentences</em> — and a search engine, or a chatbot looking something up, needs to compare whole
    sentences, not just words. So we need a way to collapse the several vectors of a sentence's words
    down into <strong>one</strong> vector for the sentence. The simplest and most common way is called
    <strong>pooling</strong>.</p>

    <h2>Mean pooling: just average the word vectors</h2>

    <p>You already met this move back in vector arithmetic. To <strong>mean-pool</strong> a sentence,
    embed each of its words and take the <strong>average</strong> of those vectors — add them all up and
    divide by how many there are:</p>

    $$\\mathbf{s} = \\frac{1}{n}\\,(\\mathbf{w}_1 + \\mathbf{w}_2 + \\cdots + \\mathbf{w}_n).$$

    <p>The sentence vector $\\mathbf{s}$ lands at the <strong>balance point</strong> of its word vectors
    — pointing in their average direction. A sentence about dogs and parks gets a vector sitting between
    "dog" and "park." One vector now stands in for the whole phrase, and you can cosine-compare it to any
    other sentence exactly as you compared single words.</p>

    <h2>A subtlety worth seeing: averaging shrinks the length</h2>

    <p>Here's something that surprises people. Our word vectors all have length $1$. But the average of
    several unit vectors is usually <strong>shorter</strong> than $1$ — and <em>how much</em> shorter
    tells you how much the words agree. Three quick 2-D cases with unit vectors:</p>
    <ul>
      <li>Two <strong>identical</strong> directions, $(1,0)$ and $(1,0)$: average $(1,0)$, length
      <strong>$1$</strong> — no shrink.</li>
      <li>Two <strong>perpendicular</strong> ones, $(1,0)$ and $(0,1)$: average $(\\tfrac12,\\tfrac12)$,
      length $\\sqrt{\\tfrac12} \\approx \\textbf{0.71}$.</li>
      <li>Two <strong>opposite</strong> ones, $(1,0)$ and $(-1,0)$: average $(0,0)$, length
      <strong>$0$</strong> — they cancel completely.</li>
    </ul>

    <p>So the pooled vector's <strong>length is a coherence meter</strong>: words pulling the same way
    reinforce (long result), words pulling different ways cancel (short result). Slide the angle below
    and watch the average arrow shrink as the two unit vectors spread apart.</p>

    ${T.widget(
      "Averaging two unit vectors",
      `<canvas id="pool-angle" style="touch-action:none"></canvas>
       <div class="slider-row" style="grid-template-columns:auto 1fr 4.5em;align-items:center;gap:12px;margin-top:12px">
         <span class="slabel">angle</span>
         <input type="range" id="pool-theta" min="0" max="180" step="5" value="70" />
         <span class="sval" id="pool-theta-v">70°</span>
       </div>
       <div id="pool-angle-read" class="tr-meta" style="margin-top:2px"></div>`
    )}

    <p>Because the length wanders, the pooled vector is normally <strong>re-normalized</strong> back to
    length $1$ before it's stored. And recall that <strong>cosine similarity ignores length anyway</strong>
    — so whether or not you re-normalize, comparing sentences by cosine gives the same answer. The length
    is information about coherence; the direction is the meaning.</p>

    <h2>Pool some real words</h2>

    <p>Now on the actual $384$-dimensional embeddings. Pick a few words to form a little "sentence," and
    we'll average them into one pooled vector — then show its length and how close it sits (by cosine) to
    each of the ten words. Watch two things: a <strong>coherent</strong> set pools to a longer vector than
    a <strong>mixed</strong> one, and the pooled vector always sits <strong>nearest its own ingredients</strong>.</p>

    ${T.widget(
      "Mean-pool a few words",
      `<div id="pool-chips" class="emb-chips"></div>
       <div id="pool-len" style="margin-top:12px"></div>
       <div id="pool-list" style="margin-top:8px"></div>`
    )}

    ${T.callout(
      `<p>One honest wrinkle about how the <em>real</em> models do it. They don't simply average the raw
       word vectors the way we just did. First they run the whole sentence through a network (a
       "transformer") that lets every word <strong>adjust to its neighbors</strong> — so "bank" in
       <em>river bank</em> and in <em>savings bank</em> ends up with different vectors — and only
       <em>then</em> do they mean-pool those context-adjusted vectors into one. Plain averaging of word
       vectors, like we did, is the simpler classic version (a "bag of words"); it's real and useful, just
       blind to word order and context. The pooling step itself, though, is exactly this average — it's
       literally the "pooling" in models like the one we've been using.</p>`,
      { type: "note", label: "How real sentence embeddings differ" }
    )}

    ${T.callout(
      `<p>This is the step that turns the word-matcher you built into a <strong>sentence</strong>- or
       <strong>document</strong>-matcher — the real version of RAG. Embed every word of a document, pool
       them into one vector, store it; embed the user's question and pool it the same way; then it's the
       same cosine search you already built. Pooling is the bridge from "find a similar word" to "find a
       relevant paragraph."</p>`,
      { type: "ai", label: "Why pooling matters" }
    )}

    <h2>What you learned</h2>
    <ul>
      <li><strong>Mean pooling</strong> turns many word vectors into one sentence vector by
      <strong>averaging</strong> them — add, divide by $n$ — landing at their balance point.</li>
      <li>Averaging unit vectors usually gives a vector <strong>shorter than $1$</strong>; the length
      measures how much the words <strong>agree in direction</strong> (aligned reinforce, opposing cancel).
      Pooled vectors are then typically re-normalized, and cosine ignores the length regardless.</li>
      <li>Real models blend context through a network <em>before</em> pooling, but the pooling step itself
      is exactly this average — and it's what lets us embed and compare whole sentences and documents.</li>
    </ul>
  `;

  function onMount(root) {
    /* ---------- interactive 1: averaging two unit vectors ---------- */
    const ac = root.querySelector("#pool-angle");
    const slider = root.querySelector("#pool-theta");
    const tv = root.querySelector("#pool-theta-v");
    const aread = root.querySelector("#pool-angle-read");

    function drawAngle() {
      if (!ac) return;
      const { ctx, w, h } = T.fitCanvas(ac, 300);
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2, U = Math.min(w, h) * 0.34;
      const th = parseFloat(slider.value) * Math.PI / 180;
      const X = (x) => cx + x * U, Y = (y) => cy - y * U;

      // unit circle + axes
      ctx.strokeStyle = "#eef0f5"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(cx, cy, U, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = "#e3e6ee";
      ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke();

      const u = [1, 0], v = [Math.cos(th), Math.sin(th)];
      const avg = [(u[0] + v[0]) / 2, (u[1] + v[1]) / 2];
      const len = Math.hypot(avg[0], avg[1]);

      // the two unit vectors
      drawArrow(ctx, X(0), Y(0), X(u[0]), Y(u[1]), "#4f46e5", 2.4);
      drawArrow(ctx, X(0), Y(0), X(v[0]), Y(v[1]), "#4f46e5", 2.4);
      // the average (teal)
      if (len > 0.001) drawArrow(ctx, X(0), Y(0), X(avg[0]), Y(avg[1]), "#0d9488", 3);
      ctx.fillStyle = "#0d9488"; ctx.beginPath(); ctx.arc(X(avg[0]), Y(avg[1]), 4.5, 0, Math.PI * 2); ctx.fill();

      tv.textContent = slider.value + "°";
      aread.innerHTML = `average length = cos(${(slider.value / 2)}°) = <b>${len.toFixed(3)}</b>` +
        (len > 0.97 ? " — the words agree, almost no shrink"
          : len < 0.2 ? " — nearly opposite, they cancel"
            : " — partial agreement, partial cancellation");
    }
    if (slider) { slider.addEventListener("input", drawAngle); }

    /* ---------- interactive 2: pool real words ---------- */
    const chipsEl = root.querySelector("#pool-chips");
    const lenEl = root.querySelector("#pool-len");
    const listEl = root.querySelector("#pool-list");

    function cosine(a, b) {
      let d = 0, na = 0, nb = 0;
      for (let i = 0; i < a.length; i++) { d += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; }
      return d / (Math.sqrt(na) * Math.sqrt(nb));
    }

    if (chipsEl) {
      chipsEl.innerHTML = `<span style="color:#94a3b8;font-size:.9em">loading real embeddings…</span>`;
      fetch("sections/word-embeddings.json")
        .then((r) => { if (!r.ok) throw new Error("no file"); return r.json(); })
        .then((EMB) => buildPool(EMB))
        .catch(() => {
          chipsEl.innerHTML = `<span style="color:#be123c;font-size:.9em">Couldn't load
            sections/word-embeddings.json — run embed_words.py and serve over Live Server.</span>`;
        });
    }

    function buildPool(EMB) {
      const words = Object.keys(EMB);
      const dim = EMB[words[0]].length;
      const selected = new Set(["cat", "dog"]);

      chipsEl.innerHTML = "";
      words.forEach((w) => {
        const b = document.createElement("button");
        b.textContent = w; b.className = "emb-chip" + (selected.has(w) ? " on" : "");
        b.addEventListener("click", () => {
          if (selected.has(w)) selected.delete(w); else selected.add(w);
          b.classList.toggle("on");
          render();
        });
        chipsEl.appendChild(b);
      });

      function render() {
        const chosen = [...selected];
        if (chosen.length === 0) {
          lenEl.innerHTML = `<span style="color:#94a3b8">Pick a word or two to pool.</span>`;
          listEl.innerHTML = ""; return;
        }
        // mean-pool
        const pooled = new Array(dim).fill(0);
        chosen.forEach((w) => { const v = EMB[w]; for (let i = 0; i < dim; i++) pooled[i] += v[i]; });
        for (let i = 0; i < dim; i++) pooled[i] /= chosen.length;
        const len = Math.sqrt(pooled.reduce((s, x) => s + x * x, 0));

        const note = chosen.length === 1 ? "one word pools to itself (length 1)"
          : len > 0.85 ? "the words point a similar way — a focused phrase"
            : len > 0.7 ? "a bit of a mix"
              : "the words pull in different directions — lots of cancellation";
        lenEl.innerHTML =
          `<div style="font-size:1.02em;color:#0f172a"><b>pooled length = ${len.toFixed(3)}</b></div>` +
          `<div class="tr-meta" style="margin-top:2px">${note}</div>`;

        const scored = words.map((w) => ({ w, c: cosine(pooled, EMB[w]), inSet: selected.has(w) }))
          .sort((a, b) => b.c - a.c);
        listEl.innerHTML = scored.map((s) => {
          const pct = Math.max(4, Math.min(100, (s.c - 0.2) / 0.7 * 100));
          const col = s.inSet ? "#0d9488" : "#c7d2fe";
          const wcol = s.inSet ? "#0d9488" : "#334155";
          const wt = s.inSet ? "600" : "400";
          return `<div style="display:grid;grid-template-columns:5.5em 1fr 3em;align-items:center;gap:10px;margin:4px 0">
            <span style="font-size:.92em;color:${wcol};font-weight:${wt}">${s.w}</span>
            <span style="height:13px;border-radius:7px;background:${col};width:${pct}%"></span>
            <span style="font-size:.88em;font-weight:600;color:${wcol};text-align:right">${s.c.toFixed(2)}</span>
          </div>`;
        }).join("");
      }
      render();
    }

    window.addEventListener("resize", drawAngle);
    drawAngle();
  }

  window.SectionContent = window.SectionContent || {};
  window.SectionContent["vector-pooling"] = {
    title: "Pooling: From Words to Sentences",
    html,
    onMount,
  };
})();
