/* ============================================================
   Section: Your Data — Tabulate the Results
   Registered under id "tally-your-results" (see manifest.js).
   Third section of the "Probability Meets AI" unit.

   Pairs with Lab 4: students upload the results.csv they made
   (a column of one-word model answers), and this page tabulates
   it into a frequency table + bar chart, naming the mode and the
   observed proportions. They then swap the sentence in Langflow,
   re-run, and compare spiky vs. flat shapes with THEIR OWN data.

   A "try a sample file" button generates a realistic results set
   in-browser so students who can't run Langflow Desktop (e.g.
   Chromebook) can still do the analysis.

   All client-side: a small CSV parser (handles quoted fields),
   a column auto-picker + manual override, normalization
   (trim/lowercase/strip stray punctuation), tally, and a canvas
   bar chart via Toolkit.fitCanvas.
   ============================================================ */

(function () {
  const T = window.Toolkit;

  // Headers that, if seen in row 0, mark the word column / a header row.
  const KNOWN_COLS = ["text", "word", "words", "message", "result",
                      "output", "response", "answer", "value"];

  const html = `
    <div class="eyebrow">Probability Meets AI · 3</div>
    <h1>Your Data: Tabulate the Results</h1>

    <p>In the last lab your Langflow loop produced <strong>results.csv</strong> — a column of
    words, one per ask. On its own it's just a list. The moment you <em>count</em> it, though,
    a probability distribution appears. That counting is exactly what you did by hand with
    the coin and the die; here the page does the arithmetic so you can focus on the shape.</p>

    <p>Drop your file in below. (No file yet, or running on a Chromebook? Click
    <strong>Try a sample file</strong> to use a realistic stand-in.)</p>

    ${T.widget(
      "Tabulate your results.csv",
      `<div class="uploader">
         <label class="filebtn">Choose your results file
           <input id="tr-file" type="file" accept=".csv,.txt" hidden />
         </label>
         <button class="btn ghost" id="tr-sample">Try a sample file</button>
         <button class="btn ghost" id="tr-clear">Clear</button>
       </div>
       <p class="tr-meta" id="tr-meta">Waiting for a file…</p>
       <div class="colpick" id="tr-colpick" style="display:none">
         <label for="tr-col">Which column holds the words?</label>
         <select id="tr-col"></select>
       </div>
       <canvas id="tr-chart" style="margin-top:14px"></canvas>
       <div class="readout">
         <div class="stat"><span class="label">Total asks (N)</span><span class="value" id="tr-n">0</span></div>
         <div class="stat"><span class="label">Distinct words</span><span class="value" id="tr-distinct">0</span></div>
         <div class="stat"><span class="label">Most common</span><span class="value" id="tr-mode">—</span></div>
       </div>
       <div id="tr-table"></div>`
    )}

    <p>The tallest bar is the <strong>mode</strong> — the model's single favorite next word.
    Its height, as a fraction of N, is your estimate of that word's probability:
    $\\hat{P}(\\text{word}) = \\dfrac{\\text{times it appeared}}{N}$. Every bar is one such
    estimate, and (because every ask lands on <em>some</em> word) the fractions add to $1$.
    You've rebuilt a probability distribution from raw model output.</p>

    ${T.callout(
      `<p>The page tidies each answer before counting — trims spaces, lowercases, and drops a
       stray trailing period — so <em>Cold</em>, <em>cold</em>, and <em>cold.</em> all land in
       the same bar. Real model output is a little messy; counting forgivingly is part of the
       job.</p>`,
      { type: "note", label: "About the cleanup" }
    )}

    <h2>Now experiment</h2>

    <p>This is the payoff: the distribution is <strong>yours</strong>, measured from a model,
    and you can change it. Go back to Lab 4, swap the sentence in the generator, download a
    fresh <strong>prompts.csv</strong>, re-run the flow, and upload the new
    <strong>results.csv</strong> here.</p>

    <ul>
      <li><strong>Try a near-certain sentence</strong> — <em>"The opposite of hot is ___"</em>.
      You should get one towering bar: a <strong>spiky</strong> distribution, the model is
      <strong>confident</strong>.</li>
      <li><strong>Try a wide-open one</strong> — <em>"My favorite animal is the ___"</em>. The
      counts spread across many short bars: a <strong>flat</strong> distribution, the model is
      <strong>unsure</strong>.</li>
      <li><strong>Push N higher</strong> — run 20, then 50. Watch the bars steady as N grows,
      the same settling-down you saw when a coin's heads-fraction crept toward ½.</li>
    </ul>

    ${T.callout(
      `<p>Same picture, three sections deep now: a chatbot's next word is a draw from a hidden
       distribution; counting many draws reveals it; and the <em>shape</em> of what you reveal
       — one tall bar vs. many short ones — is the model's confidence made visible.</p>`,
      { type: "ai", label: "Connecting it together" }
    )}

    <h2>Your turn</h2>

    ${(T.resetProblems(), "")}

    ${T.problem(
      `<p>You upload 20 results for "The opposite of hot is ___" and the table shows
       <em>cold</em> 17, <em>cool</em> 2, <em>chilly</em> 1. What's your estimate
       $\\hat{P}(\\text{cold})$, and is this distribution spiky or flat?</p>`,
      `<p>$\\hat{P}(\\text{cold}) = \\tfrac{17}{20} = 0.85$. One bar towers over the rest, so the
       distribution is <strong>spiky</strong> — the model is <strong>confident</strong>, which
       fits a sentence that really has one right answer. (Check: $0.85 + 0.10 + 0.05 = 1$.)</p>`
    )}

    ${T.problem(
      `<p>A classmate's file for "My favorite animal is the ___" has 18 distinct words across
       20 asks. What does that tell you about the model's distribution here, and roughly how
       tall is the tallest bar?</p>`,
      `<p>Eighteen different words in twenty asks means almost no word repeats — the probability
       is spread thin across many options. That's a very <strong>flat</strong> distribution, so
       the model is <strong>unsure</strong> (there's no single correct animal). The tallest bar
       can't be more than a count of 2 or 3, so $\\hat{P}$ for even the favorite is only about
       $0.10$–$0.15$.</p>`
    )}

    ${T.problem(
      `<p>You run the same sentence twice — once with N = 10, once with N = 50 — and the two
       bar charts don't match exactly. Is something broken? Which one should you trust more?</p>`,
      `<p>Nothing's broken — that's sampling. Small batches are jumpy, so the N = 10 chart will
       wobble more from the truth; the N = 50 chart is steadier and closer to the model's real
       distribution. Trust the larger N. It's the same reason 5 coin flips can give 4 heads but
       500 flips sit near half.</p>`
    )}
  `;

  // ---- tiny CSV parser (handles quoted fields, commas, CRLF) ----
  function parseCSV(text) {
    const rows = [];
    let row = [], field = "", inQ = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (inQ) {
        if (c === '"') {
          if (text[i + 1] === '"') { field += '"'; i++; }
          else inQ = false;
        } else field += c;
      } else if (c === '"') {
        inQ = true;
      } else if (c === ",") {
        row.push(field); field = "";
      } else if (c === "\n") {
        row.push(field); rows.push(row); row = []; field = "";
      } else if (c !== "\r") {
        field += c;
      }
    }
    if (field.length || row.length) { row.push(field); rows.push(row); }
    // drop fully-empty rows
    return rows.filter((r) => r.some((c) => c.trim() !== ""));
  }

  // Normalize a raw answer into a tally key.
  function clean(s) {
    return String(s).trim().toLowerCase().replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, "");
  }

  function onMount(root) {
    const fileEl = root.querySelector("#tr-file");
    const sampleBtn = root.querySelector("#tr-sample");
    const clearBtn = root.querySelector("#tr-clear");
    const metaEl = root.querySelector("#tr-meta");
    const colWrap = root.querySelector("#tr-colpick");
    const colSel = root.querySelector("#tr-col");
    const canvas = root.querySelector("#tr-chart");
    const nEl = root.querySelector("#tr-n");
    const distinctEl = root.querySelector("#tr-distinct");
    const modeEl = root.querySelector("#tr-mode");
    const tableEl = root.querySelector("#tr-table");
    if (!fileEl) return;

    let rows = [];        // parsed data rows (header stripped)
    let nCols = 0;
    let headers = [];     // column labels for the picker

    function looksLikeHeader(r) {
      return r.some((c) => KNOWN_COLS.includes(clean(c)));
    }

    // Guess the best word column: most cells that are short single tokens.
    function guessCol() {
      // honor a known header name first
      for (let j = 0; j < nCols; j++) {
        if (KNOWN_COLS.includes(clean(headers[j]))) return j;
      }
      let best = 0, bestScore = -1;
      for (let j = 0; j < nCols; j++) {
        let score = 0;
        for (const r of rows) {
          const v = (r[j] || "").trim();
          if (v && !/\s/.test(v) && v.length <= 24) score++;
        }
        if (score > bestScore) { bestScore = score; best = j; }
      }
      return best;
    }

    function setData(parsed, label) {
      if (!parsed.length) { showEmpty(label + " — couldn't find any rows."); return; }
      nCols = parsed.reduce((m, r) => Math.max(m, r.length), 1);
      let body = parsed;
      headers = [];
      if (parsed.length > 1 && looksLikeHeader(parsed[0])) {
        headers = parsed[0].map((h, j) => h.trim() || "Column " + (j + 1));
        body = parsed.slice(1);
      } else {
        for (let j = 0; j < nCols; j++) headers.push("Column " + (j + 1));
      }
      rows = body;

      // build column picker (only meaningful when >1 column)
      colSel.innerHTML = "";
      headers.forEach((h, j) => {
        const o = document.createElement("option");
        o.value = j; o.textContent = h;
        colSel.appendChild(o);
      });
      colSel.value = guessCol();
      colWrap.style.display = nCols > 1 ? "flex" : "none";

      metaEl.textContent = label + " — " + rows.length +
        " row" + (rows.length === 1 ? "" : "s") + " loaded.";
      render();
    }

    function tally() {
      const j = parseInt(colSel.value, 10) || 0;
      const counts = new Map();
      let n = 0;
      for (const r of rows) {
        const key = clean(r[j] || "");
        if (!key) continue;
        counts.set(key, (counts.get(key) || 0) + 1);
        n++;
      }
      const items = [...counts.entries()]
        .map(([w, c]) => ({ w, c }))
        .sort((a, b) => b.c - a.c || a.w.localeCompare(b.w));
      return { items, n };
    }

    function render() {
      const { items, n } = tally();
      nEl.textContent = n;
      distinctEl.textContent = items.length;
      modeEl.textContent = items.length ? items[0].w : "—";

      // frequency table
      if (!items.length) {
        tableEl.innerHTML =
          `<p class="freq-empty">No words to count — try picking a different column above.</p>`;
      } else {
        let rowsHTML = items.map((it) =>
          `<tr><td>${it.w}</td><td>${it.c}</td><td>${(it.c / n).toFixed(2)}</td></tr>`
        ).join("");
        tableEl.innerHTML =
          `<table class="dist-table" style="margin-top:1.2em">
             <thead><tr><th>Word</th><th>Count</th><th>Proportion</th></tr></thead>
             <tbody>${rowsHTML}</tbody>
             <tfoot><tr><td>Total</td><td>${n}</td><td>1.00</td></tr></tfoot>
           </table>`;
      }
      drawChart(items, n);
    }

    function drawChart(items, n) {
      const { ctx, w, h } = T.fitCanvas(canvas, 240);
      ctx.clearRect(0, 0, w, h);
      const padL = 40, padR = 12, padT = 14, padB = 34;
      const x0 = padL, x1 = w - padR, y0 = padT, y1 = h - padB;

      if (!items.length || !n) {
        ctx.fillStyle = "#b8bfce";
        ctx.font = "14px -apple-system, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Upload a file (or try the sample) to see the bars", (x0 + x1) / 2, (y0 + y1) / 2);
        return;
      }

      // show at most 12 bars so labels stay readable
      const show = items.slice(0, 12);
      const hidden = items.length - show.length;
      const top = Math.max(...show.map((it) => it.c)) / n;
      const yMax = Math.min(1, Math.max(0.2, top * 1.15));
      const Y = (p) => y1 - (p / yMax) * (y1 - y0);

      // y axis ticks
      ctx.fillStyle = "#8a93a6";
      ctx.font = "12px -apple-system, sans-serif";
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      const ticks = [0, yMax / 2, yMax];
      ticks.forEach((p) => {
        ctx.fillText(p.toFixed(2), x0 - 8, Y(p));
        ctx.strokeStyle = "#eef0f4";
        ctx.beginPath(); ctx.moveTo(x0, Y(p)); ctx.lineTo(x1, Y(p)); ctx.stroke();
      });

      const slot = (x1 - x0) / show.length;
      const bw = Math.min(slot * 0.62, 60);
      show.forEach((it, i) => {
        const cx = x0 + slot * (i + 0.5);
        const p = it.c / n;
        const by = Y(p);
        ctx.fillStyle = i === 0 ? "#0d9488" : "#4f46e5"; // mode in teal
        ctx.fillRect(cx - bw / 2, by, bw, y1 - by);

        // count above bar
        ctx.fillStyle = "#515a6e";
        ctx.font = "11px -apple-system, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillText(it.c, cx, by - 3);

        // word label (truncated)
        const lab = it.w.length > 9 ? it.w.slice(0, 8) + "…" : it.w;
        ctx.textBaseline = "top";
        ctx.fillText(lab, cx, y1 + 6);
      });

      // legend / overflow note
      ctx.textAlign = "right";
      ctx.textBaseline = "top";
      ctx.fillStyle = "#0d9488";
      ctx.fillText("■ most common", x1, y0 - 4);
      if (hidden > 0) {
        ctx.fillStyle = "#8a93a6";
        ctx.textAlign = "left";
        ctx.fillText("+" + hidden + " more word" + (hidden === 1 ? "" : "s") + " not shown", x0, y0 - 4);
      }
    }

    function showEmpty(msg) {
      rows = []; nCols = 0; headers = [];
      colWrap.style.display = "none";
      metaEl.textContent = msg;
      nEl.textContent = "0";
      distinctEl.textContent = "0";
      modeEl.textContent = "—";
      tableEl.innerHTML = "";
      drawChart([], 0);
    }

    // ---- a realistic sample results.csv, generated in-browser ----
    function makeSample() {
      // "I poured myself a cup of ___" — a medium-spiky distribution
      const dist = [
        { w: "coffee", p: 0.45 }, { w: "tea", p: 0.28 },
        { w: "water", p: 0.17 }, { w: "juice", p: 0.10 },
      ];
      const cum = []; let acc = 0;
      dist.forEach((d) => { acc += d.p; cum.push(acc); });
      const out = [["text"]];
      for (let k = 0; k < 30; k++) {
        const r = Math.random();
        let idx = dist.length - 1;
        for (let i = 0; i < dist.length; i++) { if (r < cum[i]) { idx = i; break; } }
        out.push([dist[idx].w]);
      }
      return out;
    }

    // ---- events ----
    fileEl.addEventListener("change", (e) => {
      const f = e.target.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = () => setData(parseCSV(String(reader.result)), f.name);
      reader.readAsText(f);
    });
    colSel.addEventListener("change", render);
    sampleBtn.addEventListener("click", () =>
      setData(makeSample(), "sample (cup of ___)")
    );
    clearBtn.addEventListener("click", () => {
      fileEl.value = "";
      showEmpty("Waiting for a file…");
    });
    window.addEventListener("resize", () => { if (rows.length) render(); else drawChart([], 0); });

    showEmpty("Waiting for a file…");
  }

  window.SectionContent = window.SectionContent || {};
  window.SectionContent["tally-your-results"] = {
    title: "Your Data: Tabulate the Results",
    html,
    onMount,
  };
})();
