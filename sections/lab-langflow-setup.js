/* ============================================================
   Section: Lab 1 — Setting Up Your AI Workshop (Langflow Desktop)
   Registered under id "lab-langflow-setup" (see manifest.js).

   A hands-on, KEY-FREE lab: install Langflow Desktop, tour the
   canvas, drag and wire components, load a text file, save. Nothing
   here runs a model or needs an API key — that comes in a later lab.

   Pure HTML (no widgets), so no onMount. Uses .steps and .checklist
   styles added to styles.css. Install steps verified against the
   official docs (langflow.org/desktop, docs.langflow.org) for
   Langflow 1.10 Desktop, June 2026.
   ============================================================ */

(function () {
  const T = window.Toolkit;

  const html = `
    <div class="eyebrow">Hands-On · Lab 1</div>
    <h1>Setting Up Your AI Workshop</h1>

    <p>So far you've reasoned about probability and distributions on paper. Now we'll
    install the tool that lets you <em>build</em> with AI — a free app called
    <strong>Langflow</strong> — so that soon you can watch a real chatbot produce the
    kind of varied, uncertain output those distributions describe.</p>

    <p>Think of Langflow as a <strong>visual workshop</strong>. Instead of writing code,
    you drag building blocks onto a canvas and connect them with wires, like plugging
    pedals together or wiring a circuit. Today is pure setup and exploration: we'll
    install it and get comfortable moving around. <strong>You won't need an account, a
    credit card, or any "AI key" yet</strong> — and nothing you do today can break.</p>

    ${T.callout(
      `<p>Everything in this lab is <strong>safe to click</strong>. We are not going to
       run anything or connect to the internet's AI models today, so there's nothing to
       sign up for and no way to rack up a bill. Explore freely — poke at things, drag
       stuff around, undo with <strong>Ctrl/Cmd&nbsp;+&nbsp;Z</strong>. Curiosity is the
       whole assignment.</p>`,
      { type: "note", label: "Relax — nothing can go wrong here" }
    )}

    <h2>Part 1 — Install Langflow Desktop</h2>

    <p>Langflow Desktop is a free app for <strong>Mac and Windows</strong>. (On a
    Chromebook or Linux machine it won't install — tell your instructor and we'll get
    you on a browser version instead.) To download it you'll fill out a short form with
    your contact info; that's expected.</p>

    <h3>On a Mac <span style="font-weight:400;color:var(--ink-faint)">(needs macOS 13 or later)</span></h3>
    <ol class="steps">
      <li>In your web browser, go to <strong>langflow.org/desktop</strong>.</li>
      <li>Click <strong>Download Langflow</strong>, enter your contact information, then click <strong>Download</strong>.</li>
      <li>Open the downloaded file. When the installer window appears, drag the
      <strong>Langflow</strong> icon into your <strong>Applications</strong> folder.</li>
      <li>Open <strong>Langflow</strong> from your Applications folder (or Launchpad).
      The first launch can take a minute — that's normal.</li>
    </ol>

    <h3>On Windows</h3>
    <ol class="steps">
      <li>In your web browser, go to <strong>langflow.org/desktop</strong>.</li>
      <li>Click <strong>Download Langflow</strong>, enter your contact information, then click <strong>Download</strong>.</li>
      <li>Open <strong>File Explorer</strong> and go to your <strong>Downloads</strong> folder.</li>
      <li>Double-click the downloaded <strong>.msi</strong> file and follow the install wizard.</li>
      <li>Open <strong>Langflow</strong> from the Start menu. The first launch can take a
      minute — that's normal.</li>
    </ol>

    ${T.callout(
      `<p>If Windows shows a <strong>"C++ Build Tools Required!"</strong> message during
       install, that's a known step — follow the on-screen prompt to install
       <em>Microsoft C++ Build Tools</em>, let it finish, then run the Langflow installer
       again. If you get stuck here, flag your instructor; it's a one-time fix.</p>`,
      { type: "warn", label: "Windows: a common one-time prompt" }
    )}

    ${T.callout(
      `<p><strong>You'll know it worked when…</strong> Langflow opens to a home screen
       showing flow templates and a button to create a new flow. That's the door to your
       workshop.</p>`,
      { type: "", label: "Checkpoint" }
    )}

    <h2>Part 2 — Meet the workspace</h2>

    <p>From the Langflow home screen, create a <strong>new flow</strong> and choose the
    <strong>Blank Flow</strong> option (we want an empty canvas, not a pre-built one).
    You're now looking at your workspace. Three things to find:</p>

    <ul>
      <li><strong>The canvas</strong> — the big open area in the middle where you'll build.</li>
      <li><strong>The components panel</strong> — a list down one side, with building
      blocks grouped by job: <em>Inputs</em>, <em>Outputs</em>, <em>Data</em>, and more.</li>
      <li><strong>Empty space</strong> — because we chose a blank flow. You'll fill it next.</li>
    </ul>

    <p>Get a feel for moving around:</p>
    <ul>
      <li><strong>Pan</strong> (slide the canvas): click an empty spot and drag.</li>
      <li><strong>Zoom</strong>: scroll your mouse wheel, or pinch on a trackpad.</li>
    </ul>

    <h2>Part 3 — Drag, move, and wire two blocks together</h2>

    <p>This is the core skill. We'll place two simple blocks and connect them — without
    running anything.</p>

    <ol class="steps">
      <li>In the components panel, find the <strong>Inputs</strong> group. Drag a
      <strong>Chat Input</strong> block onto the canvas.</li>
      <li>Find the <strong>Outputs</strong> group and drag a <strong>Chat Output</strong>
      block onto the canvas, to the right of the first one. (Can't find a block? Use the
      <strong>search box</strong> at the top of the components panel and type its name.)</li>
      <li><strong>Move them around.</strong> Click and drag each block to reposition it.
      Pan and zoom so you can see both comfortably.</li>
      <li><strong>Wire them up.</strong> Each block has little dots on its edges called
      <em>ports</em>. Drag from the port on the <em>right</em> of Chat Input to the port on
      the <em>left</em> of Chat Output. A line snaps between them — that's a wire carrying
      data from one block to the next.</li>
    </ol>

    ${T.callout(
      `<p>Ports are <strong>color-coded by the kind of data</strong> they carry. A wire
       only connects two ports of the <em>same color</em> — Langflow won't let you join
       mismatched types. That's a guardrail, not an error you caused: it's the app keeping
       your flow sensible.</p>`,
      { type: "note", label: "Why some wires won't connect" }
    )}

    <p>Now click once on a block to <strong>select</strong> it. A panel opens on the right
    showing that block's <strong>settings</strong>. Look around — you don't need to change
    anything, and you definitely don't need a key. We're just seeing that every block has
    knobs we can adjust later.</p>

    <p>Finally, try <strong>Add Note</strong> (look in the canvas toolbar or right-click
    menu) and drop a sticky note on your canvas. Label your two blocks "in" and "out" so
    future-you remembers what they do.</p>

    <h2>Part 4 — Load a file (still no key needed)</h2>

    <p>Langflow can also read data from your computer — useful later when you want an AI to
    work with your own documents. Let's prove it can read a file, no model required.</p>

    <ol class="steps">
      <li>On your computer, make a plain text file — open a text editor, type a few
      sentences, and save it as <strong>notes.txt</strong>.</li>
      <li>In Langflow's components panel, open the <strong>Data</strong> group and drag a
      <strong>File</strong> block onto the canvas.</li>
      <li>Select the <strong>File</strong> block. In its settings panel, use the upload
      control to choose your <strong>notes.txt</strong>.</li>
      <li>That's it — Langflow has loaded your file's contents, ready to feed into a flow.
      No internet, no key, no cost.</li>
    </ol>

    <h2>Part 5 — Save your work</h2>

    <p>Langflow usually saves your flow automatically, but give it a real name so you can
    find it next time: look for the flow's name near the top of the canvas, click it, and
    rename it to something like <strong>"Lab 1 — My First Canvas."</strong></p>

    <h2>Did it stick? Tick these off</h2>

    <ul class="checklist">
      <li><label><input type="checkbox"> Langflow Desktop is installed and opens on my machine.</label></li>
      <li><label><input type="checkbox"> I created a new <strong>Blank Flow</strong>.</label></li>
      <li><label><input type="checkbox"> I can pan and zoom the canvas.</label></li>
      <li><label><input type="checkbox"> I dragged a <strong>Chat Input</strong> and <strong>Chat Output</strong> onto the canvas and moved them around.</label></li>
      <li><label><input type="checkbox"> I connected the two blocks with a wire.</label></li>
      <li><label><input type="checkbox"> I clicked a block and saw its settings panel.</label></li>
      <li><label><input type="checkbox"> I loaded a <strong>notes.txt</strong> file with a <strong>File</strong> block.</label></li>
      <li><label><input type="checkbox"> I named and saved my flow.</label></li>
    </ul>

    ${T.callout(
      `<p>Right now your canvas is a quiet circuit with no engine. In the next lab we'll
       add the engine — an AI <em>model</em> block — and plug in a free key so you can
       actually <strong>chat</strong> with it. Then comes the fun part: ask it the same
       question several times and watch the answers change. That variation isn't a glitch —
       it's the model sampling from a <strong>probability distribution</strong> over words,
       exactly the bars you've been drawing. The <em>temperature</em> setting you'll find
       reshapes those bars in real time.</p>`,
      { type: "ai", label: "What this is building toward" }
    )}

    ${T.callout(
      `<ul>
         <li><strong>Download form won't proceed?</strong> Try a different browser, and make
         sure pop-ups aren't blocked.</li>
         <li><strong>Mac says the app "can't be opened" / is from an unidentified developer?</strong>
         Right-click (or Control-click) the Langflow app and choose <strong>Open</strong>,
         then confirm — this only needs doing once.</li>
         <li><strong>Windows "C++ Build Tools Required!"</strong> — install Microsoft C++
         Build Tools when prompted, then rerun the installer (see Part 1).</li>
         <li><strong>Can't find a component?</strong> Use the search box at the top of the
         components panel.</li>
         <li><strong>Wire won't connect?</strong> The two ports are probably different colors
         (different data types). That's expected — try ports that match.</li>
         <li><strong>Anything else?</strong> Note exactly what the screen said and bring it to
         class. Setup snags are normal and quick to fix together.</li>
       </ul>`,
      { type: "warn", label: "Troubleshooting" }
    )}
  `;

  window.SectionContent = window.SectionContent || {};
  window.SectionContent["lab-langflow-setup"] = {
    title: "Lab 1: Setting Up Your AI Workshop",
    html,
  };
})();
