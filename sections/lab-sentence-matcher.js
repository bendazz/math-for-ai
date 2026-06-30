/* ============================================================
   Section: Lab 7 — A Search Engine for Sentences  (Embeddings · 4)
   Registered under id "lab-sentence-matcher" (see manifest.js).

   Parallel to Lab 6 (lab-word-matcher) but the documents are now
   SENTENCES (a tiny knowledge base of facts). Same Langflow flow;
   only the file (one sentence per line) and the queries (questions /
   phrases) change. The payoff & tie to vector-pooling: the embedding
   model POOLS each whole sentence into one vector for you — you don't
   average by hand. This is real RAG retrieval: ask a question, get the
   most related stored fact, by meaning not keywords.

   Split Text config that makes each LINE its own document regardless
   of length (verified live vs docs.langflow.org/split-text, June 2026):
   Separator = newline, Chunk Size = 1, Chunk Overlap = 0. (Pieces
   larger than chunk_size pass through unchanged and are never merged;
   only pieces SMALLER than chunk_size get merged — so size 1 keeps
   every sentence whole AND separate.)

   Generator widget (onMount): editable facts -> download sentences.txt
   (Blob pattern). 3 predict-then-reveal problems (lab activity, as in
   Lab 5/6). No currency $. No forward lead-in.
   ============================================================ */

(function () {
  const T = window.Toolkit;

  const SAMPLE = [
    "Cats purr when they feel calm and content.",
    "The ocean covers more than seventy percent of the Earth's surface.",
    "Bananas are technically berries, but strawberries are not.",
    "A guitar makes sound when its strings vibrate the air.",
    "Drinking water through the day helps keep you healthy.",
    "The moon takes about a month to travel once around the Earth.",
    "Bread rises because yeast fills the dough with tiny bubbles of gas.",
    "Electric cars run on batteries instead of gasoline.",
  ];

  const html = `
    <div class="eyebrow">Embeddings · 4</div>
    <h1>Lab 7: A Search Engine for Sentences</h1>

    <p>In Lab 6 you built a matcher for single words. Now you'll do the same thing for whole
    <strong>sentences</strong> — a tiny <strong>knowledge base</strong>. Store a handful of facts, ask a
    question in your own words, and watch it pull back the most related fact, by meaning rather than
    matching words. That's genuine RAG retrieval: the lookup a real chatbot does before it answers.</p>

    <p>The wonderful part connects straight to the last section. You learned that a sentence becomes one
    vector by <strong>pooling</strong> its words. Here you don't pool anything by hand — when the
    embedding model reads a whole sentence, <strong>it does the pooling for you</strong>, handing back a
    single vector for the entire sentence. Long fact or short question, each collapses to one vector you
    can compare with cosine.</p>

    <h2>Same flow, new documents</h2>

    <p>The Langflow flow is exactly the one you built in Lab 6 — File &rarr; Split Text &rarr; Chroma,
    with embeddings and a Chat Input/Output. Only two things change:</p>
    <ul>
      <li>your text file now has <strong>one sentence per line</strong> instead of one word, and</li>
      <li>your queries are now <strong>questions or phrases</strong>, not single words.</li>
    </ul>

    <h2>Step 1 — Write your knowledge base</h2>

    <p>Put <strong>one fact per line</strong>. Keep them on clearly different topics so the matches are
    easy to predict. Edit the list and download it as <strong>sentences.txt</strong>.</p>

    ${T.widget(
      "Build your sentences.txt",
      `<textarea id="sm-text" rows="9" spellcheck="false"
         style="width:100%;box-sizing:border-box;font-family:var(--font-mono);font-size:.82rem;padding:10px;border:1px solid var(--line);border-radius:8px;resize:vertical">${SAMPLE.join("\n")}</textarea>
       <div class="controls" style="margin-top:10px">
         <button class="btn" id="sm-dl">Download sentences.txt</button>
         <span id="sm-count" class="tr-meta"></span>
       </div>`
    )}

    <h2>Step 2 — Build the flow (same as Lab 6)</h2>

    <p>If you still have your Lab 6 flow, you can reuse it — just load <strong>sentences.txt</strong> in
    the File block instead of words.txt. Building fresh, drop in the same components and wire them the
    same way:</p>

    <table class="dist-table">
      <thead><tr><th>From (a component's output)</th><th>To (an input port)</th></tr></thead>
      <tbody>
        <tr><td>File (sentences.txt)</td><td>Split Text</td></tr>
        <tr><td>Split Text · <em>Chunks</em></td><td>Chroma DB · <strong>Ingest Data</strong></td></tr>
        <tr><td>Google Generative AI Embeddings</td><td>Chroma DB · <strong>Embedding</strong></td></tr>
        <tr><td>Chat Input</td><td>Chroma DB · <strong>Search Query</strong></td></tr>
        <tr><td>Chroma DB · <em>search results</em></td><td>Parser</td></tr>
        <tr><td>Parser</td><td>Chat Output</td></tr>
      </tbody>
    </table>

    <p>Keep the same settings that worked before — they're what make each <em>line</em> its own document,
    no matter how long:</p>
    <ul>
      <li><strong>Split Text</strong>: <strong>Separator</strong> = a newline, <strong>Chunk Size</strong>
      = $1$, <strong>Chunk Overlap</strong> = $0$. (A whole sentence is longer than $1$ character, so it
      passes through as one piece and is never merged with its neighbors — exactly one sentence per
      document.)</li>
      <li><strong>Chroma DB</strong>: <strong>Number of Results</strong> = $1$ or $2$, <strong>Allow
      Duplicates</strong> off.</li>
      <li><strong>Google Generative AI Embeddings</strong>: your free Lab 2 key,
      <strong>models/text-embedding-004</strong>. (Or leave Chroma's Embedding port empty to use its
      built-in model — no key — just like last lab.)</li>
    </ul>

    <h2>Step 3 — Ask it questions</h2>

    <p>Open the Playground and ask things in your <em>own</em> words — not the words in your facts. With
    the sample knowledge base, try:</p>
    <ul>
      <li><em>"How can I tell my pet is happy?"</em> &rarr; the cat fact</li>
      <li><em>"What is the biggest body of water?"</em> &rarr; the ocean fact</li>
      <li><em>"Why does dough get bigger?"</em> &rarr; the bread fact</li>
      <li><em>"Tell me something about the night sky."</em> &rarr; the moon fact</li>
      <li><em>"How does a car run without fuel?"</em> &rarr; the electric-car fact</li>
    </ul>

    <h2>Predict, then look</h2>

    ${(T.resetProblems(), "")}

    ${T.problem(
      `<p>Your facts include "Cats purr when they feel calm and content," but you ask
       <strong>"How can I tell my pet is happy?"</strong> — sharing almost no words with the fact. Why
       does it still come back?</p>`,
      `<p>The embedding model turns the whole question into one vector and the whole fact into one vector,
       and those two vectors point in nearly the same direction because they're <em>about</em> the same
       thing (a content pet). Chroma returns the stored sentence whose vector is closest. <strong>No
       words were matched</strong> — "happy pet" found "cats purr" purely by meaning. That's the pooling
       from last section doing its job inside the model.</p>`
    )}

    ${T.problem(
      `<p>You ask <strong>"What is the deepest ocean?"</strong> The stored fact is about how <em>much</em>
       of the Earth the ocean covers, not its depth. What comes back, and what's the catch?</p>`,
      `<p>You still get the <strong>ocean fact</strong> — it's clearly the most related sentence, so it
       wins the cosine match. But notice it doesn't actually <em>answer</em> "deepest." Retrieval finds
       the most <strong>related</strong> document, not necessarily one that answers your exact question.
       Deciding whether the match truly answers you is a separate step (often handed to a language model
       — the "generation" half of RAG).</p>`
    )}

    ${T.problem(
      `<p>Your facts are long sentences; your question is short. Yet they're compared as vectors of the
       <em>same</em> size. How can a $5$-word question and a $12$-word fact end up the same shape?</p>`,
      `<p>Because <strong>pooling makes length irrelevant</strong>. However many words go in, the
       embedding model pools them into one fixed-size vector ($768$ numbers for this model). A short
       question and a long fact both come out as a single $768$-vector, so cosine similarity compares
       them directly. Turning any amount of text into one same-size vector is exactly what makes this
       search possible.</p>`
    )}

    ${T.callout(
      `<p>You've now built the real thing: a question-answering <strong>knowledge lookup</strong>. Swap
       the eight facts for the paragraphs of a textbook, a help center, or a company's documents, and
       this exact flow is how a chatbot finds the right passage before answering. Embed every passage,
       pool each into a vector, store them; embed the user's question, pool it, and return the nearest
       passages. That retrieval step is the "R" in RAG — and it's nothing more than the cosine search you
       built, running on pooled sentence vectors.</p>`,
      { type: "ai", label: "This is real RAG retrieval" }
    )}

    ${T.callout(
      `<p>Want it to actually <em>answer</em> in a sentence instead of just handing back the matching
       fact? Add a <strong>Prompt</strong> and a <strong>Language Model</strong> after the search: feed
       the retrieved fact <em>and</em> the user's question into the model and let it write a reply. That
       added step is the <strong>generation</strong> in retrieval-augmented generation. We kept this lab
       to pure retrieval so the matching stays visible — but that's the one piece between you and a full
       RAG chatbot.</p>`,
      { type: "note", label: "Optional: make it answer (full RAG)" }
    )}

    ${T.callout(
      `<ul>
         <li><strong>Two facts get glued into one result.</strong> Your Split Text merged lines — set
         <strong>Chunk Size</strong> to $1$, <strong>Chunk Overlap</strong> to $0$, <strong>Separator</strong>
         to a newline, and confirm each fact is on its own line.</li>
         <li><strong>Matches feel off.</strong> Make sure ingest and query share one embedder (one Chroma
         block), and that your facts really are on distinct topics — vague or overlapping facts blur the
         matches.</li>
         <li><strong>It returns a fact that doesn't answer the question.</strong> That's expected —
         retrieval returns the most <em>related</em> sentence, not a guaranteed answer. Add the language
         model step above if you want a real answer.</li>
         <li><strong>Re-running piles up duplicates / a Google key error.</strong> Same fixes as Lab 6:
         Allow Duplicates off, and reuse your free AI Studio key.</li>
       </ul>`,
      { type: "warn", label: "Troubleshooting" }
    )}

    <h2>Did it work? Tick these off</h2>

    <ul class="checklist">
      <li><label><input type="checkbox"> I made a <strong>sentences.txt</strong> with one fact per line.</label></li>
      <li><label><input type="checkbox"> I loaded it in the File block with Split Text set to one line per document.</label></li>
      <li><label><input type="checkbox"> I asked a question in my own words and got the right fact back.</label></li>
      <li><label><input type="checkbox"> I saw a match where the question and the fact shared almost no words.</label></li>
      <li><label><input type="checkbox"> I understand the embedding model <strong>pooled</strong> each sentence into one vector for me.</label></li>
    </ul>

    ${T.callout(
      `<p>From "what is a vector?" to a working knowledge search in a few steps: words became vectors,
       vectors gained length and direction, the dot product and cosine measured similarity, pooling
       folded whole sentences into single vectors — and here they all run together as a little engine
       that finds meaning. That's the math of AI, doing something real.</p>`,
      { type: "", label: "Full circle" }
    )}
  `;

  function onMount(root) {
    const ta = root.querySelector("#sm-text");
    const btn = root.querySelector("#sm-dl");
    const count = root.querySelector("#sm-count");
    if (!ta || !btn) return;

    function refresh() {
      const lines = ta.value.split("\n").map((s) => s.trim()).filter(Boolean);
      count.textContent = lines.length + (lines.length === 1 ? " sentence" : " sentences");
    }
    ta.addEventListener("input", refresh);
    refresh();

    btn.addEventListener("click", () => {
      const lines = ta.value.split("\n").map((s) => s.trim()).filter(Boolean);
      const blob = new Blob([lines.join("\n") + "\n"], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "sentences.txt";
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
    });
  }

  window.SectionContent = window.SectionContent || {};
  window.SectionContent["lab-sentence-matcher"] = {
    title: "Lab 7: A Search Engine for Sentences",
    html,
    onMount,
  };
})();
