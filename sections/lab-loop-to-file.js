/* ============================================================
   Section: Lab 4 — Run a Loop, Save a File
   Registered under id "lab-loop-to-file" (see manifest.js).
   Second section of the "Probability Meets AI" unit.

   The previous section had students ask "pick the next word"
   BY HAND, clearing the chat each time and tallying ~15-20.
   Tedious. Here they automate it: a Langflow Loop asks the same
   question N times and a Write File component saves the raw
   words to results.csv — which the NEXT section tabulates.

   Two interactive pieces:
     1) Part 1 generator (onMount): type a sentence, pick N, and
        download a prompts.csv with N identical rows to feed the
        Loop.
     2) A custom schematic SVG of the loop flow (File -> Loop ->
        Convert -> Model -> back to Loop; Loop Done -> Write File).

   Langflow Loop mechanics verified against official docs
   (docs.langflow.org/loop, /write-file), June 2026: the Loop
   component splits a CSV/list into items, sends each out the
   Item port, takes results back at the Looping port, and emits
   the aggregated list at the Done port. Write File saves a
   DataFrame/JSON to CSV.
   ============================================================ */

(function () {
  const T = window.Toolkit;

  // The instruction each row of the input file will carry.
  function promptFor(sentence) {
    return (
      "Fill in the blank with one word that could complete this sentence. " +
      "Reply with ONLY that word — lowercase, no punctuation, no " +
      "explanation. Sentence: " + sentence
    );
  }

  // ---- one schematic loop diagram (inline SVG) ---------------
  const C = { data: "#3a32c0", model: "#0d9488", output: "#b45309" };
  function box(x, y, w, h, col, tag, label, sub) {
    const cx = x + w / 2;
    let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="11" ` +
            `fill="#ffffff" stroke="${col}" stroke-width="2.5"/>`;
    s += `<text x="${cx}" y="${y + 17}" text-anchor="middle" font-size="9" ` +
         `font-weight="700" letter-spacing="0.5" fill="${col}">${tag}</text>`;
    s += `<text x="${cx}" y="${y + 37}" text-anchor="middle" font-size="13" ` +
         `font-weight="700" fill="#1f2430">${label}</text>`;
    if (sub) {
      s += `<text x="${cx}" y="${y + 52}" text-anchor="middle" font-size="10" ` +
           `fill="#8a93a6">${sub}</text>`;
    }
    return s;
  }
  function arrow(d, label, lx, ly, anchor) {
    let s = `<path d="${d}" fill="none" stroke="#9aa3b2" stroke-width="2" ` +
            `marker-end="url(#lpar)"/>`;
    if (label) {
      s += `<text x="${lx}" y="${ly}" text-anchor="${anchor || "middle"}" ` +
           `font-size="10" fill="#515a6e">${label}</text>`;
    }
    return s;
  }
  const loopSVG =
    `<div class="flow-wrap"><svg viewBox="0 0 560 280" class="flowsvg" ` +
    `role="img" aria-label="Langflow loop that saves results to a file" ` +
    `style="max-width:620px">` +
    `<defs><marker id="lpar" viewBox="0 0 10 10" refX="8" refY="5" ` +
    `markerWidth="7" markerHeight="7" orient="auto-start-reverse">` +
    `<path d="M0,0 L10,5 L0,10 z" fill="#9aa3b2"/></marker></defs>` +
    box(10, 70, 110, 60, C.data, "INPUT FILE", "prompts.csv", "N rows") +
    box(150, 70, 110, 60, C.data, "LOOP", "one row at a time", "") +
    box(290, 70, 110, 60, C.data, "CONVERT", "row → text", "") +
    box(430, 70, 110, 60, C.model, "MODEL", "Gemini / Claude", "one word") +
    box(150, 190, 110, 60, C.data, "WRITE FILE", "save as CSV", "") +
    box(320, 190, 170, 60, C.output, "OUTPUT FILE", "results.csv", "N words") +
    arrow("M120,100 L146,100") +
    arrow("M260,100 L286,100", "Item", 273, 91) +
    arrow("M400,100 L426,100") +
    arrow("M485,70 L485,40 L205,40 L205,67", "each new word loops back in", 345, 32) +
    arrow("M205,130 L205,187", "Done: all N words", 214, 162, "start") +
    arrow("M260,220 L316,220") +
    `</svg><div class="bc-caption">The whole experiment as one flow. The Loop sends each ` +
    `row out to the Model, collects the word that comes back, and — once every row is ` +
    `done — hands the full list to Write File, which saves results.csv. (A sketch of the ` +
    `idea; your real canvas will look busier.)</div></div>`;

  const html = `
    <div class="eyebrow">Probability Meets AI · 2</div>
    <h1>Lab 4: Run a Loop, Save a File</h1>

    <p>Last section you asked the model "pick the next word" <strong>by hand</strong> —
    type the prompt, write down the word, clear the chat, repeat. Fifteen times. It worked,
    but it was slow, and fifteen draws is barely enough to trust a tally.</p>

    <p>Now you'll hand that chore to the computer. You'll build a Langflow flow that asks the
    <strong>same question many times automatically</strong> and writes every answer to a
    file — a clean column of words you can analyze. This is your fourth Langflow build,
    and the most powerful one yet.</p>

    ${loopSVG}

    <p>The new idea here is the <strong>Loop</strong>. Instead of one trip through the model,
    the Loop walks down a list — one row per ask — sending each row to the model,
    catching the word that comes back, and moving to the next row. When the list runs out, it
    passes the <em>whole pile of words</em> to a <strong>Write File</strong> block that saves
    them as <code>results.csv</code>.</p>

    ${T.callout(
      `<p>So "ask 20 times" becomes "make a list with 20 rows." That's the trick: the
       <em>length of your input file</em> is how many times the experiment runs. We'll make
       that file first, then build the flow that chews through it.</p>`,
      { type: "", label: "The key idea" }
    )}

    <h2>Part 1 — Make your input file</h2>

    <p>Each row of the file is one identical request to the model. Set your sentence and how
    many times you want to ask, then download the file. (Use <code>___</code> where the blank
    goes.)</p>

    ${T.widget(
      "Build your prompts.csv",
      `<label class="slabel" for="lf-sentence">Your sentence:</label>
       <input id="lf-sentence" type="text" value="The opposite of hot is ___"
         style="width:100%;font:inherit;padding:8px 10px;border:1px solid var(--line);border-radius:8px;margin:.4em 0 1.1em" />
       <div class="slider-row" style="grid-template-columns:auto 1fr 3em">
         <span class="slabel" style="white-space:nowrap">Number of asks (N)</span>
         <input id="lf-n" type="range" min="5" max="50" step="5" value="20" />
         <span class="sval" id="lf-nval">20</span>
       </div>
       <p style="margin:1.1em 0 .3em;font-size:.85rem;color:var(--ink-faint)">
         Every one of your <strong id="lf-nrows">20</strong> rows will say:</p>
       <div id="lf-preview" style="font-family:var(--font-mono);font-size:.8rem;background:var(--bg);border:1px solid var(--line);border-radius:8px;padding:10px 12px;color:var(--ink-soft);line-height:1.5"></div>
       <div class="controls">
         <button class="btn" id="lf-download">Download prompts.csv</button>
       </div>`
    )}

    ${T.callout(
      `<p>Keep N modest (20–50 is plenty). Every row is one call to the model. On free
       Gemini that's nothing; on Claude Haiku, 50 calls is a fraction of a cent — but it's
       a good habit to know your file's length <em>is</em> your bill. Your Lab 3 spending
       guardrails are still doing their job in the background.</p>`,
      { type: "note", label: "N rows = N model calls" }
    )}

    <h2>Part 2 — Build the flow</h2>

    <p>Open Langflow, start a <strong>new Blank Flow</strong>, and place these five blocks.
    Use the components panel's <strong>search box</strong> to find each one by name.</p>

    <ol class="steps">
      <li>Drag in a <strong>File</strong> block (you used this in Lab 1). Click it and load the
      <strong>prompts.csv</strong> you just downloaded.</li>
      <li>Search <strong>"Loop"</strong> and drag in the <strong>Loop</strong> block. Wire the
      <strong>File</strong>'s output into the Loop's <strong>input</strong> port. The Loop will
      split your file into one item per row.</li>
      <li>Search <strong>"Type Convert"</strong> (it may also be called "Parse Data" or
      "Data → Message") and drop it in. Wire the Loop's <strong>Item</strong> port into it.
      This turns each row into plain text the model can read.</li>
      <li>Drag in your <strong>model</strong> block — the <strong>Google Generative AI</strong>
      (Lab 2) or <strong>Anthropic</strong> (Lab 3) block. Paste your key and set the model
      (<strong>gemini-2.5-flash</strong> or <strong>claude-haiku-4-5</strong>). Wire
      <strong>Convert → Model input</strong>, then wire the <strong>Model's output back into
      the Loop's looping/feedback port</strong> — that's the wire that sends each new word
      home.</li>
      <li>Search <strong>"Write File"</strong> and drag it in. Wire the Loop's
      <strong>Done</strong> port into it. In its settings set <strong>Format = CSV</strong>,
      <strong>File Name = results.csv</strong>, and <strong>Storage = Local</strong>.</li>
    </ol>

    ${loopSVG}

    <p>Now run it: click the <strong>Run</strong> (play) button on the <strong>Write File</strong>
    block so the whole chain fires. Langflow will loop through every row — you'll see it
    work down the list — and then save the file.</p>

    <ol class="steps">
      <li>After it finishes, click <strong>Inspect</strong> (or the output preview) on the Write
      File block to see <strong>where results.csv was saved</strong> — it shows the full path
      on your computer. Write that path down; you'll need the file next section.</li>
      <li>Open <strong>results.csv</strong> in a spreadsheet or text editor and take a look. It's
      a single column of words — one per ask. <strong>That's your raw data.</strong></li>
    </ol>

    ${T.callout(
      `<p>Each loop pass is a <strong>fresh, independent</strong> call — there's no memory
       block, so the model never sees its earlier answers. That's the independence you had to
       create by hand last time (clearing the chat between asks). The Loop gives it to you for
       free, which is exactly why the file is a trustworthy sample.</p>`,
      { type: "ai", label: "Why this is honest data" }
    )}

    ${T.callout(
      `<p>Why do the words vary at all, if every row is identical? Because the model is sampling
       from that next-word distribution — and the amount of spread is set by the
       <strong>temperature</strong> knob you spotted back in Lab 2. We're leaving it at its
       default for now. That single knob is the whole topic of the section after next; this file
       is the evidence we'll use to understand it.</p>`,
      { type: "", label: "Where the variety comes from" }
    )}

    ${T.callout(
      `<ul>
         <li><strong>The Loop only runs once / sees one row</strong> — your input must be a
         CSV with <em>one prompt per row</em> and a header line (the generator above does this).
         If the File block reads it as one big blob, the Loop has nothing to split.</li>
         <li><strong>Can't find the Convert block</strong> — names drift between Langflow
         versions. Search for <em>"convert"</em>, <em>"parse"</em>, or <em>"message"</em>; you
         want anything that turns a data row into plain text for the model.</li>
         <li><strong>It never finishes / spins forever</strong> — the Model's output must
         wire <em>back into the Loop</em> (the looping port), not straight to an output block.
         That return wire is what lets the Loop advance.</li>
         <li><strong>Where's results.csv?</strong> — use the Write File block's Inspect/output;
         it prints the absolute path. On Langflow Desktop the file is on your own machine.</li>
         <li><strong>The model writes sentences, not single words</strong> — your row text
         already says "only that one word," but you can tighten it in the generator. A stray
         period is fine; we'll clean it up next section.</li>
       </ul>`,
      { type: "warn", label: "Troubleshooting" }
    )}

    <h2>Did it work? Tick these off</h2>

    <ul class="checklist">
      <li><label><input type="checkbox"> I downloaded a <strong>prompts.csv</strong> with N identical rows.</label></li>
      <li><label><input type="checkbox"> I wired <strong>File → Loop → Convert → Model</strong>, with the Model's output looping back into the Loop.</label></li>
      <li><label><input type="checkbox"> I wired the Loop's <strong>Done</strong> port into <strong>Write File</strong> (CSV, results.csv, Local).</label></li>
      <li><label><input type="checkbox"> I ran the flow and it worked down every row.</label></li>
      <li><label><input type="checkbox"> I found <strong>results.csv</strong> and saw a column of words.</label></li>
    </ul>

    ${T.callout(
      `<p>You just turned a tedious by-hand experiment into a machine that runs it for you and
       files the results. Next section you'll feed <strong>results.csv</strong> straight into
       this page and watch your numbers become a distribution — then swap the sentence,
       re-run, and compare.</p>`,
      { type: "", label: "🏁 Next: see your data come alive" }
    )}
  `;

  function onMount(root) {
    const sEl = root.querySelector("#lf-sentence");
    const nEl = root.querySelector("#lf-n");
    const nValEl = root.querySelector("#lf-nval");
    const nRowsEl = root.querySelector("#lf-nrows");
    const prevEl = root.querySelector("#lf-preview");
    const dlBtn = root.querySelector("#lf-download");
    if (!sEl) return;

    function sentence() {
      return (sEl.value || "").trim() || "The opposite of hot is ___";
    }
    function refresh() {
      const n = parseInt(nEl.value, 10);
      nValEl.textContent = n;
      nRowsEl.textContent = n;
      prevEl.textContent = promptFor(sentence());
    }
    sEl.addEventListener("input", refresh);
    nEl.addEventListener("input", refresh);

    dlBtn.addEventListener("click", () => {
      const n = parseInt(nEl.value, 10);
      const field = '"' + promptFor(sentence()).replace(/"/g, '""') + '"';
      let csv = "prompt\n";
      for (let k = 0; k < n; k++) csv += field + "\n";
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "prompts.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });

    refresh();
  }

  window.SectionContent = window.SectionContent || {};
  window.SectionContent["lab-loop-to-file"] = {
    title: "Lab 4: Run a Loop, Save a File",
    html,
    onMount,
  };
})();
