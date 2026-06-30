/* ============================================================
   Section: Lab 6 — A Tiny Search Engine for Words (Your First RAG)
   Registered under id "lab-word-matcher" (see manifest.js).
   Second section of the "Embeddings" group; the hands-on twin of
   embeddings-intro's "nearest words by cosine" widget.

   Students build a PURE-RETRIEVAL flow in Langflow:
     words.txt -> Split Text -> Chroma DB (Ingest Data)
     Google Generative AI Embeddings -> Chroma DB (Embedding)
     Chat Input -> Chroma DB (Search Query)
     Chroma DB (results) -> Parser -> Chat Output
   One Chroma node ingests the word list AND searches the query in the
   same run (Allow Duplicates = false dedupes re-ingests), so ingest +
   query use the SAME embedder automatically. No LLM — the cosine match
   is the whole show. Query words need NOT be in the list ("kitten" ->
   "cat"): semantic, not keyword, matching.

   Verified live vs docs.langflow.org/bundles-chroma, /bundles-google,
   /chat-with-rag (June 2026): Chroma DB inputs (Collection Name,
   Persist Directory, Ingest Data, Search Query, Embedding [built-in
   default if empty], Number of Results, Allow Duplicates); Google
   Generative AI Embeddings (API Key, Model Name models/text-embedding-004,
   free AI Studio key works).

   One generator widget (onMount): editable word list -> download
   words.txt (reuses the Blob/URL.createObjectURL pattern from Lab 4).
   Predict-then-reveal problems are part of the lab activity (as in
   Lab 5), not a concept "Your turn". No currency $. No forward lead-in.
   ============================================================ */

(function () {
  const T = window.Toolkit;

  const SAMPLE = ["king", "queen", "cat", "dog", "car", "truck", "banana", "ocean", "doctor", "guitar"];

  const html = `
    <div class="eyebrow">Embeddings · 2</div>
    <h1>Lab 6: A Tiny Search Engine for Words</h1>

    <p>Last section you watched a tool rank words by cosine similarity. Now you'll <strong>build</strong>
    one in Langflow — a little app that takes a query and finds the closest words you've stored, purely
    by the geometry of their embeddings. This is a <strong>RAG</strong> (retrieval-augmented generation)
    system, or at least its beating heart: the <em>retrieval</em> step that real chatbots use to look
    things up before they answer.</p>

    <p>We'll keep it pure retrieval — no chatbot writing sentences at the end, just the raw match — so
    the embedding similarity is right out in the open where you can see it work.</p>

    <h2>What you're building</h2>

    <p>The idea, start to finish:</p>
    <ol class="steps">
      <li>Take a handful of <strong>words</strong> and embed each one into a vector.</li>
      <li>Store those vectors in a <strong>vector database</strong> — we'll use <strong>Chroma</strong>,
      the same Chroma whose built-in model produced the $384$ numbers you inspected last section.</li>
      <li>When a user types a <strong>query</strong>, embed it the same way and ask the database for the
      <strong>nearest stored vectors</strong> — the top one or two words.</li>
    </ol>

    <p>The magic you'll see: the query <strong>doesn't have to be one of your words</strong>. Store
    <em>cat</em> and query <em>"kitten"</em>, and it comes back with <em>cat</em> — even though the two
    share almost no letters. The match is by <strong>meaning</strong>, not spelling. That's semantic
    search, and it's exactly the "nearest by cosine" idea, now running live on words you choose.</p>

    <h2>Step 1 — Make your word list</h2>

    <p>Chroma will store one word per "document," so we feed it a plain text file with
    <strong>one word per line</strong>. Edit the list below and download it as
    <strong>words.txt</strong>. Keep them in loose groups (a couple of animals, a couple of vehicles,
    etc.) so the matches are fun to predict.</p>

    ${T.widget(
      "Build your words.txt",
      `<textarea id="wm-words" rows="10" spellcheck="false"
         style="width:100%;box-sizing:border-box;font-family:var(--font-mono);font-size:.85rem;padding:10px;border:1px solid var(--line);border-radius:8px;resize:vertical">${SAMPLE.join("\n")}</textarea>
       <div class="controls" style="margin-top:10px">
         <button class="btn" id="wm-dl">Download words.txt</button>
         <span id="wm-count" class="tr-meta"></span>
       </div>`
    )}

    <h2>Step 2 — Build the flow</h2>

    <p>Open a new flow in Langflow and drop in these components (find them in the left-hand component
    list and drag them onto the canvas):</p>

    <ul>
      <li><strong>File</strong> — to load your <strong>words.txt</strong>.</li>
      <li><strong>Split Text</strong> — to cut the file into one document per word.</li>
      <li><strong>Google Generative AI Embeddings</strong> — the model that turns each word into a
      vector.</li>
      <li><strong>Chroma DB</strong> — the vector database that stores them and does the search.</li>
      <li><strong>Chat Input</strong> and <strong>Chat Output</strong> — the query and the answer.</li>
      <li><strong>Parser</strong> (it may appear as <em>Parse Data</em>) — to turn the search result
      into readable text for the chat.</li>
    </ul>

    <p>Set a few fields:</p>
    <ul>
      <li>On <strong>Split Text</strong>: set <strong>Separator</strong> to a newline, <strong>Chunk
      Size</strong> to $1$, and <strong>Chunk Overlap</strong> to $0$. (Small chunks + splitting on
      newlines is what keeps each word in its own document.)</li>
      <li>On <strong>Google Generative AI Embeddings</strong>: paste the <strong>same free Google AI
      Studio key</strong> you used in Lab 2. Leave Model Name at <strong>models/text-embedding-004</strong>.</li>
      <li>On <strong>Chroma DB</strong>: set <strong>Number of Results</strong> to $2$ (the top two
      matches), and set <strong>Allow Duplicates</strong> to <strong>off</strong> (so re-running doesn't
      pile up copies of the same words).</li>
    </ul>

    <p>Then wire it up. Here's every connection at a glance:</p>

    <table class="dist-table">
      <thead><tr><th>From (a component's output)</th><th>To (an input port)</th></tr></thead>
      <tbody>
        <tr><td>File</td><td>Split Text</td></tr>
        <tr><td>Split Text · <em>Chunks</em></td><td>Chroma DB · <strong>Ingest Data</strong></td></tr>
        <tr><td>Google Generative AI Embeddings</td><td>Chroma DB · <strong>Embedding</strong></td></tr>
        <tr><td>Chat Input</td><td>Chroma DB · <strong>Search Query</strong></td></tr>
        <tr><td>Chroma DB · <em>search results</em></td><td>Parser</td></tr>
        <tr><td>Parser</td><td>Chat Output</td></tr>
      </tbody>
    </table>

    <p>One Chroma block does double duty: the <strong>Ingest Data</strong> line loads and embeds your
    words, while the <strong>Search Query</strong> line embeds the user's question and searches — both
    using the one embedding model you connected, so they always speak the same language.</p>

    ${T.callout(
      `<p>No Gemini key handy, or want to keep it totally offline? <strong>Leave the Chroma DB
       "Embedding" port empty.</strong> Chroma will fall back to its own built-in model — the very same
       <em>all-MiniLM</em> embedder that made the $384$ numbers from the last section. The flow works
       with no key at all; you just won't need the Google Embeddings block.</p>`,
      { type: "note", label: "A no-key shortcut" }
    )}

    <h2>Step 3 — Try it in the Playground</h2>

    <p>Open the <strong>Playground</strong> and type a query. Start with a word that <em>isn't</em> in
    your list but is close in meaning to one that is — try <strong>"kitten"</strong>. You should get
    <strong>cat</strong> (and a runner-up). Then explore:</p>
    <ul>
      <li><em>"automobile"</em> or <em>"a way to get around"</em> &rarr; car, truck</li>
      <li><em>"royalty"</em> &rarr; king, queen</li>
      <li><em>"a fruit"</em> &rarr; banana</li>
      <li><em>"the sea"</em> &rarr; ocean</li>
    </ul>

    <h2>Predict, then look</h2>

    <p>Before you run each one, predict. Then check.</p>

    ${(T.resetProblems(), "")}

    ${T.problem(
      `<p>Your words include <em>cat</em> but not <em>kitten</em>. You query <strong>"kitten"</strong>.
       What comes back, and how did it match a word it shares barely any letters with?</p>`,
      `<p>You get <strong>cat</strong>. The embedding model maps <em>kitten</em> and <em>cat</em> to
       nearly the same direction in $384$-dimensional space because they mean similar things, and Chroma
       returns the stored vector closest to the query's. <strong>No letters were compared at all</strong>
       — the match is purely by meaning. That's the whole point of semantic search.</p>`
    )}

    ${T.problem(
      `<p>You query <strong>"a way to get around the city"</strong> with Number of Results set to $2$.
       Why might <em>both</em> <em>car</em> and <em>truck</em> come back?</p>`,
      `<p>Both are vehicles, so both embeddings sit close to the query's "transportation" direction —
       and you asked for the top $2$. Retrieval doesn't return one "right" answer; it returns the
       <strong>nearest few</strong>, and here the two nearest are both vehicles.</p>`
    )}

    ${T.problem(
      `<p>You query something with <em>no</em> related word in your list — say <strong>"democracy"</strong>.
       What happens, and what does that teach you about retrieval?</p>`,
      `<p>It still returns something — whatever stored word is <em>least far</em> from <em>democracy</em>
       — even though nothing is a good match. <strong>Retrieval always hands back the nearest neighbors,
       relevant or not.</strong> Remember the "cone" from last section: every pair of embeddings has
       some positive similarity, so there's always a closest one. It's on you (or a downstream model) to
       decide whether the nearest match is actually <em>close enough</em> to be useful.</p>`
    )}

    ${T.callout(
      `<p>Notice what never happened: at no point did the app search for matching <em>letters</em> or
       keywords. <em>kitten</em> found <em>cat</em>, <em>automobile</em> found <em>car</em> — words with
       almost nothing in common on the page, but everything in common in meaning. You've built the
       retrieval core of a RAG system: embed everything, store the vectors, and answer a query by
       fetching its nearest neighbors. Swap the words for sentences or documents and this same flow is
       how chatbots look up what they know.</p>`,
      { type: "ai", label: "What you just built" }
    )}

    ${T.callout(
      `<ul>
         <li><strong>The result is one big blob of several words.</strong> Your Split Text didn't break
         the file into separate words — set <strong>Chunk Size</strong> to $1$, <strong>Chunk
         Overlap</strong> to $0$, and the <strong>Separator</strong> to a newline, and make sure
         words.txt really has one word per line.</li>
         <li><strong>Matches look random.</strong> Almost always the ingest and the query used different
         embedders. Use a <em>single</em> Chroma block (as wired above) so one embedding model serves
         both, and re-run.</li>
         <li><strong>Re-running keeps adding duplicates.</strong> Turn <strong>Allow Duplicates</strong>
         off on the Chroma block.</li>
         <li><strong>A Google API error.</strong> Reuse the exact AI Studio key from Lab 2; embeddings
         are on the same free tier as the chat model.</li>
         <li><strong>Empty result.</strong> Make sure the File actually loaded words.txt and the Split
         Text is connected to <em>Ingest Data</em> (not Search Query).</li>
       </ul>`,
      { type: "warn", label: "Troubleshooting" }
    )}

    <h2>Did it work? Tick these off</h2>

    <ul class="checklist">
      <li><label><input type="checkbox"> I made a <strong>words.txt</strong> with one word per line and loaded it in the File block.</label></li>
      <li><label><input type="checkbox"> I connected Split Text to Chroma's <strong>Ingest Data</strong> and the embeddings to Chroma's <strong>Embedding</strong>.</label></li>
      <li><label><input type="checkbox"> I connected <strong>Chat Input</strong> to Chroma's <strong>Search Query</strong> and ran a query in the Playground.</label></li>
      <li><label><input type="checkbox"> I queried a word <em>not</em> in my list (like "kitten") and got a sensible match.</label></li>
      <li><label><input type="checkbox"> I saw the match come from <strong>meaning</strong>, not matching letters.</label></li>
    </ul>

    ${T.callout(
      `<p>You started this unit asking what a vector is. You've now built a working search engine whose
       only trick is geometry: turn words into vectors, and "find related things" becomes "find the
       nearest neighbors." Every dial you learned — components, length, the dot product, cosine
       similarity — is doing its job inside this one little flow.</p>`,
      { type: "", label: "Full circle" }
    )}
  `;

  function onMount(root) {
    const ta = root.querySelector("#wm-words");
    const btn = root.querySelector("#wm-dl");
    const count = root.querySelector("#wm-count");
    if (!ta || !btn) return;

    function refresh() {
      const words = ta.value.split("\n").map((w) => w.trim()).filter(Boolean);
      count.textContent = words.length + (words.length === 1 ? " word" : " words");
    }
    ta.addEventListener("input", refresh);
    refresh();

    btn.addEventListener("click", () => {
      const words = ta.value.split("\n").map((w) => w.trim()).filter(Boolean);
      const text = words.join("\n") + "\n";
      const blob = new Blob([text], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "words.txt";
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
    });
  }

  window.SectionContent = window.SectionContent || {};
  window.SectionContent["lab-word-matcher"] = {
    title: "Lab 6: A Tiny Search Engine for Words",
    html,
    onMount,
  };
})();
