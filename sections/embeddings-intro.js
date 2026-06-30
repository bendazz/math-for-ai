/* ============================================================
   Section: What Is an Embedding?  (Embeddings unit — section 1)
   Registered under id "embeddings-intro" (see manifest.js).
   Opens the new "Embeddings" group — the payoff the Vectors unit
   was built toward.

   Approach (instructor's call, 2026-06-30): NO 2-D squashing, NO
   hand-faked toy map — honest real data only. Flow:
     1) WARM-UP on the states: cosine similarity between the real
        2-D (area-share, pop-share) state vectors. Clean full-range
        story — same density profile ~0.999, opposite ~0.09.
     2) CONCEPT: an embedding = the LEARNED version. A model turns a
        word into ~384 numbers, tuned so meaning becomes geometry.
        Can't picture 384-D, but cosine doesn't care about dimension.
        These come out UNIT LENGTH, so cosine = dot product.
     3) Click a word to REVEAL its actual 384-number vector (then
        hide) — the sheer size is the point.
     4) Cosine between the real words — and the honest "cone" lesson:
        real embeddings are all positively correlated & bunched
        (here ~0.24–0.69), so similarity is RELATIVE, not vs 0/1.

   Real vectors from ChromaDB's default embedder (all-MiniLM-L6-v2,
   384-dim, unit length), generated once by embed_words.py and loaded
   at runtime from sections/word-embeddings.json (fetch; degrades
   gracefully if unavailable — the prose + states warm-up still work).

   No inline problems (convention). No forward lead-in. No currency $.
   ============================================================ */

(function () {
  const T = window.Toolkit;

  const html = `
    <div class="eyebrow">Embeddings · 1</div>
    <h1>What Is an Embedding?</h1>

    <p>This is what the whole Vectors unit was building toward. Back with the states, <em>we</em> chose
    the two features — share of area, share of population — and the geometry came alive: direction meant
    density, and cosine similarity could measure how alike two states were. An <strong>embedding</strong>
    is that same idea, with the feature-picking handed over to a machine. A model invents <em>hundreds</em>
    of features automatically, tuned so that <strong>meaning turns into geometry</strong>: words that mean
    similar things get vectors that point the same way.</p>

    <p>And we already built the instrument to detect that — <strong>cosine similarity</strong>. Let's warm
    up with it on familiar ground before meeting a real embedding.</p>

    <h2>Warm-up: cosine similarity on the states</h2>

    <p>Each state is the 2-D vector (share of U.S. area, share of U.S. population). The cosine similarity
    between two states compares their <em>directions</em> — which, from the states section, is their
    <strong>density profile</strong>. Here are a few real ones:</p>

    <table class="dist-table">
      <thead><tr><th>State pair</th><th>cosine</th><th>what it says</th></tr></thead>
      <tbody>
        <tr><td>New Jersey &amp; Rhode Island</td><td>0.999</td><td>nearly identical direction — both very dense</td></tr>
        <tr><td>Alaska &amp; Wyoming</td><td>0.998</td><td>nearly identical — both very empty</td></tr>
        <tr><td>California &amp; New Jersey</td><td>0.965</td><td>similar — both lean dense</td></tr>
        <tr><td>New Jersey &amp; Alaska</td><td>0.094</td><td>almost perpendicular — dense vs empty</td></tr>
        <tr><td>Alaska &amp; Massachusetts</td><td>0.142</td><td>far apart in direction — empty vs dense</td></tr>
      </tbody>
    </table>

    <p>Clean and intuitive: same kind of state scores near $1$, opposite kinds score near $0$. Two
    numbers per state was enough to do this. Now we let a model use a few hundred.</p>

    <h2>A word becomes a few hundred numbers</h2>

    <p>Feed a word to an embedding model — we'll use the one that ships inside <strong>ChromaDB</strong>, a
    small, free model called <em>all-MiniLM-L6-v2</em> that runs on a laptop with no API key — and it hands
    back a vector with <strong>$384$ components</strong>. That vector is the word's embedding. You can't
    sketch a $384$-dimensional arrow, and there's no tidy meaning to any single component. But here's the
    saving grace: <strong>cosine similarity doesn't care how many dimensions there are</strong>. The very
    same formula — dot product over the two lengths — works on $384$ numbers exactly as it did on $2$.</p>

    <p>One more real detail you can verify in a moment: these embeddings come out <strong>already
    normalized to unit length</strong> (every one has $\\lVert \\mathbf{v} \\rVert = 1$). So, just as we
    saw, the division falls away and <strong>cosine similarity is simply the dot product</strong>.</p>

    <h2>Look inside a real word</h2>

    <p>Click any word to unfurl its actual embedding — all $384$ numbers the model produced. Click it again
    to fold it back up. It's a lot to take in, and that's exactly the point: this overwhelming list of
    numbers <em>is</em> what the word "looks like" to an AI.</p>

    ${T.widget(
      "The actual numbers",
      `<div id="emb-chips" class="emb-chips"></div>
       <div id="emb-vec" class="emb-vec" style="display:none"></div>`
    )}

    <h2>Which words are most alike?</h2>

    <p>Now the payoff. Pick a word, and we'll rank every other word by the cosine similarity of their real
    embeddings — highest (most alike) at the top. This is the model's own sense of meaning, read straight
    off the geometry.</p>

    ${T.widget(
      "Nearest words by cosine similarity",
      `<div class="controls" style="align-items:center;gap:10px">
         <span style="color:#515a6e;font-size:.92em">Most similar to</span>
         <select id="nn-pick" style="padding:5px 8px;border:1px solid var(--line);border-radius:7px;font-size:.95em"></select>
       </div>
       <div id="nn-list" style="margin-top:12px"></div>`
    )}

    ${T.callout(
      `<p><strong>Real embeddings don't hit $0$ or go negative — and that's important.</strong> Every pair
       of these ten words scores somewhere between about $0.24$ and $0.69$; nothing is near $0$, nothing is
       negative. High-dimensional embeddings all sit in a kind of "cone," mildly aligned with one another.
       So you don't judge similarity against an absolute $0$-to-$1$ ruler the way the tidy states did —
       you <strong>compare</strong>. <em>cat</em>–<em>dog</em> at $0.66$ towering over <em>cat</em>–<em>ocean</em>
       at $0.28$ is the signal; the gap between them is what means "more alike," not the raw value.</p>`,
      { type: "note", label: "Reading real similarity scores" }
    )}

    ${T.callout(
      `<p>That ranking you just made — "given this item, find the most similar ones by cosine" — is one of
       the most-used operations in all of AI. It's how semantic search finds relevant pages, how a chatbot
       retrieves the right documents to answer from (the "R" in RAG), and how recommendations surface
       "more like this." Embed everything, then sort by cosine similarity. Every idea in this unit —
       vectors, length, the dot product, cosine — comes together in that one move.</p>`,
      { type: "ai", label: "How AI finds 'related' things" }
    )}

    <h2>What you learned</h2>
    <ul>
      <li>An <strong>embedding</strong> is a word turned into a vector of a few hundred numbers (here
      $384$) by a model, with the features <em>learned</em> so that <strong>meaning becomes
      geometry</strong>.</li>
      <li>You can't visualize $384$ dimensions, but <strong>cosine similarity works unchanged</strong> —
      and since embeddings are unit length, it's just the dot product.</li>
      <li>Real embeddings are all mildly positive and bunched together, so similarity is read by
      <strong>comparison</strong> (this pair vs that pair), not against an absolute $0$.</li>
      <li>"Rank everything by cosine similarity to a query" is the engine behind semantic search,
      retrieval, and recommendations.</li>
    </ul>
  `;

  function cosine(a, b) {
    let dot = 0, na = 0, nb = 0;
    for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; }
    return dot / (Math.sqrt(na) * Math.sqrt(nb));
  }

  function onMount(root) {
    const chipsEl = root.querySelector("#emb-chips");
    const vecEl = root.querySelector("#emb-vec");
    const pick = root.querySelector("#nn-pick");
    const listEl = root.querySelector("#nn-list");
    if (!chipsEl) return;

    chipsEl.innerHTML = `<span style="color:#94a3b8;font-size:.9em">loading real embeddings…</span>`;

    fetch("sections/word-embeddings.json")
      .then((r) => { if (!r.ok) throw new Error("not found"); return r.json(); })
      .then((EMB) => build(EMB))
      .catch(() => {
        const msg = `<span style="color:#be123c;font-size:.9em">Couldn't load the embeddings file
          (sections/word-embeddings.json). Run <code>embed_words.py</code> and serve the site over
          Live Server.</span>`;
        chipsEl.innerHTML = msg;
        if (listEl) listEl.innerHTML = "";
      });

    function build(EMB) {
      const words = Object.keys(EMB);
      let openWord = null;

      // --- reveal widget ---
      chipsEl.innerHTML = "";
      words.forEach((w) => {
        const b = document.createElement("button");
        b.textContent = w;
        b.className = "emb-chip";
        b.addEventListener("click", () => {
          if (openWord === w) { openWord = null; vecEl.style.display = "none"; refreshChips(); return; }
          openWord = w;
          const nums = EMB[w].map((x) => x.toFixed(4)).join(",  ");
          vecEl.innerHTML =
            `<div class="emb-vec-head">“${w}” &rarr; ${EMB[w].length} numbers, and every one matters to the model</div>` +
            `<div class="emb-vec-nums">[ ${nums} ]</div>`;
          vecEl.style.display = "block";
          refreshChips();
        });
        chipsEl.appendChild(b);
      });
      function refreshChips() {
        chipsEl.querySelectorAll(".emb-chip").forEach((c) =>
          c.classList.toggle("on", c.textContent === openWord));
      }

      // --- nearest-words widget ---
      pick.innerHTML = words.map((w) => `<option value="${w}">${w}</option>`).join("");
      pick.value = words.includes("cat") ? "cat" : words[0];

      function renderNN() {
        const focus = pick.value;
        const scored = words.filter((w) => w !== focus)
          .map((w) => ({ w, c: cosine(EMB[focus], EMB[w]) }))
          .sort((a, b) => b.c - a.c);
        listEl.innerHTML = scored.map((s, i) => {
          const pct = Math.max(4, Math.min(100, (s.c - 0.2) / 0.5 * 100));
          const col = i === 0 ? "#0d9488" : "#c7d2fe";
          const valcol = i === 0 ? "#0d9488" : "#475569";
          return `<div style="display:grid;grid-template-columns:5.5em 1fr 3em;align-items:center;gap:10px;margin:5px 0">
            <span style="font-size:.92em;color:#334155">${s.w}</span>
            <span style="height:14px;border-radius:7px;background:${col};width:${pct}%"></span>
            <span style="font-size:.9em;font-weight:600;color:${valcol};text-align:right">${s.c.toFixed(2)}</span>
          </div>`;
        }).join("");
      }
      pick.addEventListener("change", renderNN);
      renderNN();
    }
  }

  window.SectionContent = window.SectionContent || {};
  window.SectionContent["embeddings-intro"] = {
    title: "What Is an Embedding?",
    html,
    onMount,
  };
})();
