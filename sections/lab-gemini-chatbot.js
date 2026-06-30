/* ============================================================
   Section: Lab 2 — Build a Chatbot with Gemini
   Registered under id "lab-gemini-chatbot" (see manifest.js).

   Hands-on: get a free Google Gemini API key, build a 3-block
   chatbot in Langflow (Chat Input -> Google Generative AI ->
   Chat Output), and chat with it in the Playground. Ends by
   connecting the model's varied replies back to probability
   distributions; the Temperature knob is pointed at but saved
   for the next lab.

   Schematic SVG flow diagrams are drawn by a local flow() helper
   (they represent Langflow, they don't replicate its exact look).

   Details verified against official docs (Google AI Studio key
   flow; Langflow "Google Generative AI" component fields; the
   Playground), June 2026.
   ============================================================ */

(function () {
  const T = window.Toolkit;

  // ---- schematic flow diagram (inline SVG) -------------------
  // nodes: [{ kind, tag, label, sub }]; kind sets color.
  let _flowSeq = 0;
  function flow(nodes, opts = {}) {
    _flowSeq += 1;
    const mid = "flowarrow" + _flowSeq;
    const C = { input: "#4f46e5", model: "#0d9488", output: "#b45309", data: "#3a32c0" };
    const bw = 150, bh = 80, gap = 58, padX = 10, padY = 18;
    const n = nodes.length;
    const W = n * bw + (n - 1) * gap + padX * 2;
    const H = bh + padY * 2;
    const cy = padY + bh / 2;
    let parts = "";

    // arrows between boxes
    for (let i = 0; i < n - 1; i++) {
      const x1 = padX + i * (bw + gap) + bw;
      const x2 = padX + (i + 1) * (bw + gap);
      parts += `<line x1="${x1 + 5}" y1="${cy}" x2="${x2 - 4}" y2="${cy}" ` +
               `stroke="#9aa3b2" stroke-width="2" marker-end="url(#${mid})"/>`;
    }
    // boxes
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
    { kind: "model",  tag: "Model",  label: "Gemini",      sub: "Google Gen AI" },
    { kind: "output", tag: "Output", label: "Chat Output", sub: "the reply" },
  ];

  const html = `
    <div class="eyebrow">Hands-On · Lab 2</div>
    <h1>Build a Chatbot with Gemini</h1>

    <p>In Lab 1 you built a quiet canvas with no engine. Today you'll drop in an
    engine — Google's <strong>Gemini</strong> AI model — and end the lab actually
    <strong>chatting with a bot you built yourself</strong>. It's only three blocks
    wired left to right, exactly the skill you practiced last time.</p>

    <p>Here's the whole thing, as a picture:</p>

    ${flow(CHATBOT, { caption: "The entire chatbot: three blocks, two wires. (A sketch of the idea — your real Langflow canvas will look fancier.)" })}

    <p>Reading it left to right: your typed message enters at <strong>Chat Input</strong>,
    flows along the wire into the <strong>Gemini</strong> block where the AI composes a
    reply, and that reply comes out at <strong>Chat Output</strong>. Data moves along the
    wires in the direction of the arrows — that's all a "flow" is.</p>

    ${T.callout(
      `<p>This lab needs a free <strong>Gemini API key</strong>. It takes about two
       minutes to get, needs only a Google account, and <strong>does not require a credit
       card</strong>. We'll get it first, then build.</p>`,
      { type: "note", label: "What you'll need" }
    )}

    <h2>Part 1 — Get your free Gemini key</h2>

    <p>An <em>API key</em> is a long secret password that lets your Langflow flow talk to
    Google's AI. Here's how to create one:</p>

    <ol class="steps">
      <li>In your browser, go to <strong>aistudio.google.com</strong> and sign in with a
      Google account.</li>
      <li>If asked, <strong>accept the terms</strong> to start using Google AI Studio.</li>
      <li>In the left sidebar, click <strong>Get API key</strong>, then
      <strong>Create API key</strong>.</li>
      <li>After a few seconds a key appears — a long string starting with
      <strong>"AIza…"</strong>. Click to <strong>copy</strong> it.</li>
    </ol>

    ${T.callout(
      `<p>Your API key is a <strong>password</strong>. Anyone who has it can spend your
       free quota. So: don't paste it into a chat, don't put it in a screenshot you share,
       and don't email it around. If you ever think it leaked, return to AI Studio and
       delete it, then make a new one — that instantly disables the old one.</p>`,
      { type: "warn", label: "Treat the key like a password" }
    )}

    ${T.callout(
      `<p>On the free tier, Google may use your prompts and the model's replies to improve
       its products. For class that's fine — just don't type anything private or personal
       into your chatbot.</p>`,
      { type: "note", label: "A privacy heads-up" }
    )}

    <h2>Part 2 — Build the flow</h2>

    <p>Open Langflow and create a <strong>new Blank Flow</strong> (just like Lab 1). Now
    place the three blocks:</p>

    <ol class="steps">
      <li>From the <strong>Inputs</strong> group, drag a <strong>Chat Input</strong> block
      onto the canvas (left side).</li>
      <li>From the <strong>Outputs</strong> group, drag a <strong>Chat Output</strong>
      block onto the canvas (right side).</li>
      <li>In the components panel's <strong>search box</strong>, type
      <strong>"Google"</strong> and drag the <strong>Google Generative AI</strong> block
      into the middle.</li>
      <li><strong>Wire them up</strong>, port to port, just like Lab 1:
      Chat Input → Google Generative AI → Chat Output.</li>
    </ol>

    ${flow(CHATBOT, { caption: "After wiring: Chat Input → Gemini → Chat Output." })}

    <p>Now teach the Gemini block who to call and how:</p>

    <ol class="steps">
      <li>Click the <strong>Google Generative AI</strong> block to open its settings panel
      on the right.</li>
      <li>Paste your key into the <strong>Google API Key</strong> field.</li>
      <li>Set the <strong>Model</strong> field to <strong>gemini-2.5-flash</strong> — it's
      fast and free.</li>
    </ol>

    ${T.callout(
      `<p>While you're in there, notice the <strong>Temperature</strong> setting. That's
       the randomness knob — it directly reshapes the probability distributions you've
       been drawing. <strong>Leave it alone for now</strong> — later in the course we'll turn it
       up and down and watch the bot go from cautious to wild.</p>`,
      { type: "", label: "Spot this knob for later" }
    )}

    <h2>Part 3 — Chat with it</h2>

    <ol class="steps">
      <li>Near the top of the window, click <strong>Playground</strong>. This opens a chat
      panel for your flow.</li>
      <li>In the message box, type something like
      <em>"Hi! Tell me a surprising fact about octopuses."</em> and press
      <strong>Enter</strong>.</li>
      <li>Wait a moment — Gemini's reply appears in the chat. <strong>You just talked to a
      chatbot you built.</strong></li>
    </ol>

    ${T.callout(
      `<p>That's a real, working AI app: three blocks, one key, your own chatbot. Everything
       from here is variations on this same idea — swap the model, add a prompt, feed it a
       document. You've crossed the line from <em>reading</em> about AI to
       <em>building</em> it.</p>`,
      { type: "", label: "🎉 You built an AI app" }
    )}

    <h2>The math is hiding in plain sight</h2>

    <p>Try this little experiment. Ask your bot the <strong>exact same question</strong>
    three or four times in a row (clear the chat or just send it again). Watch what
    happens: the answers come out <strong>worded differently each time</strong>, even
    though your question never changed.</p>

    <p>That's not a bug — it's the distributions you studied, in action. To write a reply,
    Gemini produces it <strong>one word at a time</strong>, and for each next word it builds
    a probability distribution — a set of candidate words with a $P(\\text{word})$ on each,
    all summing to $1$, exactly the bars you've been drawing — and then <em>samples</em>
    one. Different samples → different sentences. Run the same prompt twice and you're
    drawing from the same distribution twice, like flipping the same coin again.</p>

    ${T.callout(
      `<p>The <em>Temperature</em> knob you spotted controls how those bars are shaped before
       sampling. Low temperature sharpens them toward the single most likely word (safe,
       repetitive); high temperature flattens them toward uniform (surprising, sometimes
       nonsense). Later on, you'll move that slider and literally watch the variety you just
       saw grow and shrink.</p>`,
      { type: "ai", label: "About the temperature knob" }
    )}

    <h2>Did it work? Tick these off</h2>

    <ul class="checklist">
      <li><label><input type="checkbox"> I created a free Gemini API key (starts with "AIza").</label></li>
      <li><label><input type="checkbox"> I built a Blank Flow with <strong>Chat Input</strong>, <strong>Google Generative AI</strong>, and <strong>Chat Output</strong>.</label></li>
      <li><label><input type="checkbox"> I wired all three blocks together.</label></li>
      <li><label><input type="checkbox"> I pasted my key and set the model to <strong>gemini-2.5-flash</strong>.</label></li>
      <li><label><input type="checkbox"> I opened the <strong>Playground</strong> and got a reply.</label></li>
      <li><label><input type="checkbox"> I asked the same question a few times and noticed the answers vary.</label></li>
    </ul>

    ${T.callout(
      `<ul>
         <li><strong>"API key not valid"</strong> — re-copy the whole key (it starts with
         "AIza", no spaces), and make sure it's pasted into the <strong>Google API Key</strong>
         field of the Google Generative AI block.</li>
         <li><strong>The Playground has no message box</strong> — your <strong>Chat Input</strong>
         must be wired into the Gemini block, and the Gemini block into <strong>Chat Output</strong>.
         Check that both wires are connected.</li>
         <li><strong>"Model not found" / a model error</strong> — set the <strong>Model</strong>
         field to exactly <strong>gemini-2.5-flash</strong>.</li>
         <li><strong>"Quota" or "rate limit" message</strong> — the free tier limits how fast you
         can ask. Wait a minute and try again.</li>
         <li><strong>Nothing happens after you send</strong> — confirm the Gemini block has your
         key and you pressed Enter; give it a few seconds to respond.</li>
         <li><strong>Still stuck?</strong> Write down exactly what the screen says and bring it to
         class.</li>
       </ul>`,
      { type: "warn", label: "Troubleshooting" }
    )}
  `;

  window.SectionContent = window.SectionContent || {};
  window.SectionContent["lab-gemini-chatbot"] = {
    title: "Lab 2: Build a Chatbot with Gemini",
    html,
  };
})();
