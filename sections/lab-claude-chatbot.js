/* ============================================================
   Section: Lab 3 — Build a Chatbot with Claude (and Cap Costs)
   Registered under id "lab-claude-chatbot" (see manifest.js).

   Parallel to Lab 2 (Gemini), but using Anthropic's Claude — and
   with heavy emphasis on COST CONTROL, since students use their own
   paid key. Teaches the prepaid-credit ceiling, turning OFF
   auto-reload, and setting a monthly spend limit, then builds the
   same 3-block chatbot with the cheap Haiku model.

   Schematic SVG flow diagrams via a local flow() helper (same as
   Lab 2; each section file is self-contained).

   Verified June 2026: Haiku model id `claude-haiku-4-5`
   ($1/$5 per 1M tokens, 200K context); Langflow "Anthropic"
   component fields; Anthropic Console prepaid credits ($5 min),
   monthly spend limit, auto-reload.
   ============================================================ */

(function () {
  const T = window.Toolkit;

  // ---- schematic flow diagram (inline SVG), same as Lab 2 ----
  let _flowSeq = 0;
  function flow(nodes, opts = {}) {
    _flowSeq += 1;
    const mid = "claudeflow" + _flowSeq;
    const C = { input: "#4f46e5", model: "#0d9488", output: "#b45309", data: "#3a32c0" };
    const bw = 150, bh = 80, gap = 58, padX = 10, padY = 18;
    const n = nodes.length;
    const W = n * bw + (n - 1) * gap + padX * 2;
    const H = bh + padY * 2;
    const cy = padY + bh / 2;
    let parts = "";
    for (let i = 0; i < n - 1; i++) {
      const x1 = padX + i * (bw + gap) + bw;
      const x2 = padX + (i + 1) * (bw + gap);
      parts += `<line x1="${x1 + 5}" y1="${cy}" x2="${x2 - 4}" y2="${cy}" ` +
               `stroke="#9aa3b2" stroke-width="2" marker-end="url(#${mid})"/>`;
    }
    nodes.forEach((nd, i) => {
      const x = padX + i * (bw + gap);
      const col = C[nd.kind] || "#4f46e5";
      const tag = (nd.tag || nd.kind || "").toUpperCase();
      parts += `<rect x="${x}" y="${padY}" width="${bw}" height="${bh}" rx="12" ` +
               `fill="#ffffff" stroke="${col}" stroke-width="2.5"/>`;
      parts += `<text x="${x + bw / 2}" y="${padY + 21}" text-anchor="middle" ` +
               `font-size="10" font-weight="700" letter-spacing="0.6" fill="${col}">${tag}</text>`;
      parts += `<text x="${x + bw / 2}" y="${padY + 47}" text-anchor="middle" ` +
               `font-size="15" font-weight="700" fill="#1f2430">${nd.label}</text>`;
      if (nd.sub) {
        parts += `<text x="${x + bw / 2}" y="${padY + 65}" text-anchor="middle" ` +
                 `font-size="11" fill="#8a93a6">${nd.sub}</text>`;
      }
      if (i > 0) parts += `<circle cx="${x}" cy="${cy}" r="4" fill="${col}"/>`;
      if (i < n - 1) parts += `<circle cx="${x + bw}" cy="${cy}" r="4" fill="${col}"/>`;
    });
    const cap = opts.caption ? `<div class="bc-caption">${opts.caption}</div>` : "";
    return `<div class="flow-wrap"><svg viewBox="0 0 ${W} ${H}" class="flowsvg" ` +
           `role="img" aria-label="${opts.alt || "Langflow flow diagram"}">` +
           `<defs><marker id="${mid}" viewBox="0 0 10 10" refX="9" refY="5" ` +
           `markerWidth="7" markerHeight="7" orient="auto-start-reverse">` +
           `<path d="M0,0 L10,5 L0,10 z" fill="#9aa3b2"/></marker></defs>` +
           `${parts}</svg>${cap}</div>`;
  }

  const CHATBOT = [
    { kind: "input",  tag: "Input",  label: "Chat Input",  sub: "your message" },
    { kind: "model",  tag: "Model",  label: "Claude",      sub: "Anthropic · Haiku" },
    { kind: "output", tag: "Output", label: "Chat Output", sub: "the reply" },
  ];

  const html = `
    <div class="eyebrow">Hands-On · Lab 3</div>
    <h1>Build a Chatbot with Claude — and Cap Your Costs</h1>

    <p>You've built a chatbot with Google's Gemini. Now we'll build the same thing with
    <strong>Claude</strong>, from Anthropic — a different engine behind the same three
    blocks. There's one real difference: Claude's key is <strong>pay-as-you-go</strong>,
    so this lab spends as much care on <strong>guarding your wallet</strong> as on
    building. Do the guardrails first and you can experiment freely, knowing the most you
    can ever spend is a few dollars you chose in advance.</p>

    ${flow(CHATBOT, { caption: "Same three blocks as before — only the engine in the middle changes." })}

    ${T.callout(
      `<p>Here's the honest cost picture up front: with the cheap <strong>Haiku</strong>
       model and the spending caps in Part 2, a whole semester of normal classroom use
       runs to <strong>a few dollars at most</strong> — less than one coffee. The point of
       this lab is to make that a guarantee, not a hope.</p>`,
      { type: "note", label: "How much will this cost me?" }
    )}

    <h2>Part 1 — Create an Anthropic account &amp; key</h2>

    <ol class="steps">
      <li>Go to <strong>console.anthropic.com</strong> and sign up (or sign in) with an
      email or Google account.</li>
      <li>In the left sidebar, open <strong>API Keys</strong>, then click
      <strong>Create Key</strong>. Give it a name like "Math for AI class."</li>
      <li>A key appears starting with <strong>"sk-ant-…"</strong>. Copy it now and keep it
      somewhere safe — you won't be able to see it again.</li>
    </ol>

    ${T.callout(
      `<p>This key spends <strong>real money from your account</strong>. Treat it like a
       debit-card number: never paste it into a chat, a screenshot, or a shared document.
       If it ever leaks, delete it in the Console immediately and make a new one.</p>`,
      { type: "warn", label: "This key spends your money — protect it" }
    )}

    <h2>Part 2 — Put guardrails on spending (do this before anything else)</h2>

    <p>Anthropic's API works on <strong>prepaid credits</strong>: you add a small amount of
    money up front, and usage draws it down. This is your best protection — <strong>you
    cannot spend credits you never loaded.</strong> Set it up so a stuck app or a leaked
    key can't surprise you:</p>

    <ol class="steps">
      <li>In the Console, open <strong>Billing</strong> (or <strong>Plans &amp; Billing</strong>)
      and add a <strong>small</strong> amount of credit — the minimum is
      <strong>$5</strong>. That $5 is now your hard ceiling.</li>
      <li>Find <strong>Auto-reload</strong> (auto-recharge) and make sure it is
      <strong>OFF</strong>. With it off, the balance can never refill itself — when the
      money's gone, the chatbot simply stops instead of quietly buying more.</li>
      <li>Open <strong>Limits</strong> and set a <strong>monthly spend limit</strong> —
      something low like <strong>$5</strong>. If usage ever reaches it, requests stop with
      a "limit reached" error instead of continuing to charge.</li>
    </ol>

    ${T.callout(
      `<p>Why two layers? The <strong>prepaid balance</strong> caps the <em>total</em> you
       can ever spend (you only loaded $5). The <strong>monthly limit</strong> caps spend
       <em>per month</em>. With auto-reload off, both are real walls, not suggestions. This
       is exactly how you'd protect any account that can spend money — set the ceiling
       <em>before</em> you start, not after a surprise.</p>`,
      { type: "", label: "Why this makes you safe" }
    )}

    <h2>Part 3 — How cheap is this, really?</h2>

    <p>AI usage is billed by the <strong>token</strong> — roughly a chunk of a word (about
    ¾ of a word each). You pay a tiny amount per token in, and a bit more per token out.
    On <strong>Claude Haiku</strong>, the cheapest current Claude model:</p>

    <table class="dist-table">
      <thead><tr><th>What you're paying for</th><th>Price</th></tr></thead>
      <tbody>
        <tr><td>Text you send <em>in</em> (per 1 million tokens)</td><td>$1.00</td></tr>
        <tr><td>Text Claude sends <em>out</em> (per 1 million tokens)</td><td>$5.00</td></tr>
        <tr><td>One typical back-and-forth message</td><td>≈ $0.0025</td></tr>
        <tr><td>What your $5 of credit buys you</td><td>≈ 2,000 messages</td></tr>
      </tbody>
    </table>

    <p>A million tokens is <em>a lot</em> of text — roughly a 700-page book. A single
    chatbot exchange is a few hundred tokens, a fraction of a penny. So the $5 you loaded
    in Part 2 stretches to <strong>thousands</strong> of messages. (These are rounded
    estimates to build intuition, not a bill.)</p>

    <h2>Part 4 — Build the flow</h2>

    <p>This is the same shape as the Gemini lab. Open Langflow and create a
    <strong>new Blank Flow</strong>, then:</p>

    <ol class="steps">
      <li>From <strong>Inputs</strong>, drag a <strong>Chat Input</strong> block (left).</li>
      <li>From <strong>Outputs</strong>, drag a <strong>Chat Output</strong> block (right).</li>
      <li>In the components <strong>search box</strong>, type <strong>"Anthropic"</strong>
      and drag the <strong>Anthropic</strong> block into the middle.</li>
      <li><strong>Wire them up</strong> port to port: Chat Input → Anthropic → Chat Output.</li>
      <li>Click the <strong>Anthropic</strong> block. In its settings, paste your key into
      <strong>Anthropic API Key</strong>, and set the <strong>Model</strong> to
      <strong>claude-haiku-4-5</strong> (the cheap, fast one).</li>
    </ol>

    ${flow(CHATBOT, { caption: "Wired up: Chat Input → Claude (Anthropic) → Chat Output." })}

    ${T.callout(
      `<p>Two settings on the Anthropic block double as cost knobs. <strong>Model</strong>
       — Haiku is the most economical; the bigger Claude models are smarter but cost more,
       so stay on Haiku for class. <strong>Max Tokens</strong> — this caps how long each
       reply can get; a smaller number means shorter answers and a lower bill. You don't
       need to change it now, just know it's there.</p>`,
      { type: "note", label: "Two knobs that control cost" }
    )}

    <h2>Part 5 — Chat with it</h2>

    <ol class="steps">
      <li>Click <strong>Playground</strong> near the top of the window.</li>
      <li>Type a message — try <em>"In one sentence, what is probability?"</em> — and press
      <strong>Enter</strong>.</li>
      <li>Claude replies. You've now built the same chatbot on two different engines, and
      you can compare how they answer.</li>
    </ol>

    ${T.callout(
      `<p>Everything you learned about Gemini applies here unchanged: Claude writes its
       reply one word at a time, sampling each next word from a <strong>probability
       distribution</strong> (the bars again), and the <strong>Temperature</strong> setting
       reshapes those bars. Same mathematics, different engine — which is exactly the point
       of this course.</p>`,
      { type: "ai", label: "Same math under the hood" }
    )}

    <h2>Good cost habits — tick these off</h2>

    <ul class="checklist">
      <li><label><input type="checkbox"> I created an Anthropic key (starts with "sk-ant-") and kept it private.</label></li>
      <li><label><input type="checkbox"> I loaded only a small amount of credit (e.g. $5).</label></li>
      <li><label><input type="checkbox"> I confirmed <strong>auto-reload is OFF</strong>.</label></li>
      <li><label><input type="checkbox"> I set a low <strong>monthly spend limit</strong>.</label></li>
      <li><label><input type="checkbox"> My Anthropic block uses the <strong>claude-haiku-4-5</strong> model.</label></li>
      <li><label><input type="checkbox"> I sent a message in the Playground and got a reply.</label></li>
      <li><label><input type="checkbox"> I know where the <strong>Usage</strong> / billing page is to watch my running spend.</label></li>
    </ul>

    ${T.callout(
      `<ul>
         <li><strong>"Invalid API key" / authentication error</strong> — re-copy the whole key
         (starts with "sk-ant-", no spaces) into the <strong>Anthropic API Key</strong> field.</li>
         <li><strong>"Your credit balance is too low"</strong> — you haven't loaded credit yet
         (or it ran out). Add a few dollars in <strong>Billing</strong>. This is the system
         protecting you, working exactly as intended.</li>
         <li><strong>"Model not found" / a model error</strong> — set the <strong>Model</strong>
         field to exactly <strong>claude-haiku-4-5</strong>.</li>
         <li><strong>"Rate limit" message</strong> — you sent requests too fast; wait a few
         seconds and try again.</li>
         <li><strong>The Playground has no message box</strong> — check that Chat Input is wired
         into the Anthropic block, and the Anthropic block into Chat Output.</li>
         <li><strong>Still stuck?</strong> Note exactly what the screen says and bring it to class.</li>
       </ul>`,
      { type: "warn", label: "Troubleshooting" }
    )}
  `;

  window.SectionContent = window.SectionContent || {};
  window.SectionContent["lab-claude-chatbot"] = {
    title: "Lab 3: Build a Chatbot with Claude",
    html,
  };
})();
