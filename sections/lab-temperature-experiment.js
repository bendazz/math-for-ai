/* ============================================================
   Section: Lab 5 — Temperature on a Real Model
   Registered under id "lab-temperature-experiment" (manifest.js).
   CAPSTONE of the "Probability Meets AI" unit: students turn the
   real Temperature knob in Langflow, re-run the Lab 4 loop to
   produce results.csv at several temperatures, upload each to the
   tally page, and watch the live distribution sharpen (cold) and
   flatten (hot) — the temperature-section simulator, now on a
   real model with their own data.

   Reuses existing tools (structural cross-refs, allowed):
     - lab-loop-to-file (Lab 4): prompts.csv generator + the loop
     - tally-your-results: the CSV uploader / bar chart

   Provider temperature ranges verified June 2026:
     - Google Gemini: 0.0–2.0 (default ~1.0; very low can loop)
     - Anthropic Claude: 0.0–1.0 (temp 0 still has minor variance)

   No new canvas widget (pure lab: steps, observation table,
   predict-then-reveal). No forward lead-in. No currency $.
   ============================================================ */

(function () {
  const T = window.Toolkit;

  const html = `
    <div class="eyebrow">Probability Meets AI · 9</div>
    <h1>Lab 5: Temperature on a Real Model</h1>

    <p>This is where everything meets. You've learned what temperature does to a distribution and
    watched it reshape the $7$-tower with a slider. Now you'll turn the <em>real</em> knob on your
    own chatbot, measure the distribution with your own data, and see the simulator's prediction
    come true on a live model.</p>

    <p>The good news: you already built every tool. You'll reuse the <strong>prompts.csv
    generator</strong> and the <strong>loop</strong> from Lab 4, and the <strong>upload-and-tally
    page</strong> from "Your Data." The only new move is changing one setting — Temperature —
    between runs.</p>

    ${T.callout(
      `<p>The whole experiment, start to finish:</p>
       <ol style="margin:.4em 0 0">
         <li>Pick a sentence and make a <strong>prompts.csv</strong> (Lab 4 generator).</li>
         <li>Set a <strong>Temperature</strong> on your model block.</li>
         <li>Run the loop → save <strong>results.csv</strong> (rename it for that temperature).</li>
         <li>Upload it on the tally page and note the shape.</li>
         <li>Change the temperature and repeat.</li>
       </ol>`,
      { type: "", label: "The plan" }
    )}

    <h2>Part 1 — Find the Temperature field</h2>

    <p>Open the flow you built in Lab 4 (File → Loop → Convert → Model → Write File). Click your
    <strong>model block</strong> — Google Generative AI or Anthropic — and find the
    <strong>Temperature</strong> setting in its panel. It's the same field you first spotted back
    in Lab 2. How high it goes depends on the provider:</p>

    <table class="dist-table">
      <thead><tr><th>Model</th><th>Cold (spiky)</th><th>Middle</th><th>Hot (flat)</th></tr></thead>
      <tbody>
        <tr><td>Gemini (range 0–2)</td><td>0.2</td><td>1.0</td><td>1.8</td></tr>
        <tr><td>Claude (range 0–1)</td><td>0.1</td><td>0.5</td><td>1.0</td></tr>
      </tbody>
    </table>

    <p>Note the difference: <strong>Gemini reaches all the way to 2.0</strong>, so it can get
    dramatically flat; <strong>Claude stops at 1.0</strong>, so its "hot" is gentler. Use the
    three values for your provider as your cold / middle / hot settings.</p>

    <h2>Part 2 — Run the experiment at three temperatures</h2>

    <p>Keep the <strong>same sentence</strong> and the <strong>same N</strong> (about $25$ is
    plenty) the whole time — only the temperature changes. Start with an open-ended sentence like
    <em>"I poured myself a cup of ___"</em>.</p>

    <ol class="steps">
      <li>Make your <strong>prompts.csv</strong> with the Lab 4 generator and load it into the
      File block (you can reuse the one you already made).</li>
      <li>Set the model's <strong>Temperature</strong> to your <strong>cold</strong> value. Run the
      loop, and save the output as <strong>results-cold.csv</strong>.</li>
      <li>Change Temperature to your <strong>middle</strong> value, run again, save as
      <strong>results-mid.csv</strong>.</li>
      <li>Change Temperature to your <strong>hot</strong> value, run again, save as
      <strong>results-hot.csv</strong>.</li>
      <li>Upload each file in turn on the <strong>"Your Data: Tabulate the Results"</strong> page
      and look at the bar chart. Record what you see.</li>
    </ol>

    <p>Keep a little table as you go — copy this onto paper and fill it in:</p>

    <table class="dist-table">
      <thead><tr><th>Temperature</th><th>Distinct words</th><th>Top word's share</th><th>Spiky or flat?</th></tr></thead>
      <tbody>
        <tr><td>cold</td><td>—</td><td>—</td><td>—</td></tr>
        <tr><td>middle</td><td>—</td><td>—</td><td>—</td></tr>
        <tr><td>hot</td><td>—</td><td>—</td><td>—</td></tr>
      </tbody>
    </table>

    ${T.callout(
      `<p>Each run is N calls to the model, and you're doing it three times — so maybe $75$ calls
       total. On Gemini's free tier that's nothing; on Claude Haiku it's a fraction of a cent, and
       your Lab 3 spending guardrails are still in place. Keep N modest (around $25$) and you'll
       barely register it.</p>`,
      { type: "note", label: "A quick cost check" }
    )}

    <h2>Part 3 — Predict, then look</h2>

    <p>Before you read your charts, predict. Then reveal what a real model almost always does.</p>

    ${(T.resetProblems(), "")}

    ${T.problem(
      `<p>At your <strong>cold</strong> setting, how many distinct words do you expect across $25$
       runs, and how will the bar chart look?</p>`,
      `<p><strong>Very few distinct words</strong> — often just the model's top one or two choices,
       and at the coldest settings frequently the <em>same</em> word all $25$ times. The chart is a
       tall <strong>spike</strong>: cold temperature shrinks the distribution onto the favorite,
       exactly like sliding the simulator's $T$ toward $0$. (Repetitive and predictable.)</p>`
    )}

    ${T.problem(
      `<p>At your <strong>hot</strong> setting, what changes — and what surprising thing might show
       up?</p>`,
      `<p>You'll see <strong>many more distinct words</strong> and a <strong>flatter</strong> chart,
       with probability spread across lots of options. You'll likely also catch rare, oddball, or
       even nonsense words — the model dipping into the unlikely tail it normally ignores. That's
       hot temperature flattening the bars toward uniform.</p>`
    )}

    ${T.problem(
      `<p>You run the confident sentence <em>"The opposite of hot is ___"</em> at a hot temperature
       and suddenly get lots of different words. Does that mean the model is <em>unsure</em> about
       the answer?</p>`,
      `<p><strong>No.</strong> This is "flat because hot," not "flat because unsure" — two different
       causes that look the same on the chart. The model's logits haven't changed; it still
       <em>knows</em> <em>cold</em> is the best answer. A high temperature just forces it to sample
       the long shots anyway, overriding its confidence. Turn the temperature back down and the
       spike on <em>cold</em> snaps right back.</p>`
    )}

    <h2>Try the two kinds of sentence</h2>

    <p>For the full picture, run the experiment on <strong>two</strong> sentences and compare how
    they respond to the knob:</p>
    <ul>
      <li>a <strong>confident</strong> one — <em>"The opposite of hot is ___"</em> — which is
      naturally spiky, and</li>
      <li>an <strong>open</strong> one — <em>"My favorite animal is the ___"</em> — which is
      naturally flat.</li>
    </ul>
    <p>The confident sentence stays spiky until you heat it hard; the open one is already spread
    out and flattens fast. Temperature and the model's own certainty <em>combine</em> to set the
    final shape.</p>

    ${T.callout(
      `<ul>
         <li><strong>Cold output looks broken or repeats a phrase</strong> — some models degrade at
         very low temperature. Nudge it up to around $0.2$.</li>
         <li><strong>Even at temperature 0 the words still vary a little</strong> — that's expected;
         real models (Claude especially) keep a touch of randomness even at the floor. "Cold" means
         <em>mostly</em> the same, not a perfect lock.</li>
         <li><strong>Hot output is full of gibberish</strong> — that's the point, not a bug. Past a
         certain heat the tail takes over. Ease it back toward $1.0$ for sensible-but-varied.</li>
         <li><strong>Claude won't accept a temperature above 1</strong> — correct, that's its max.
         For more dramatic flattening, run the same experiment on Gemini, which goes to $2.0$.</li>
       </ul>`,
      { type: "warn", label: "Troubleshooting" }
    )}

    <h2>Did it work? Tick these off</h2>

    <ul class="checklist">
      <li><label><input type="checkbox"> I found the <strong>Temperature</strong> field on my model block.</label></li>
      <li><label><input type="checkbox"> I produced <strong>results.csv</strong> at cold, middle, and hot temperatures (same sentence, same N).</label></li>
      <li><label><input type="checkbox"> I uploaded each and recorded the distinct-word count and shape.</label></li>
      <li><label><input type="checkbox"> I saw the chart <strong>sharpen when cold</strong> and <strong>flatten when hot</strong>.</label></li>
      <li><label><input type="checkbox"> I tried both a confident and an open sentence.</label></li>
    </ul>

    ${T.callout(
      `<p>Look back at what you just did. You started the course asking "what is a probability?" —
       and you've now <strong>measured a real AI's word-choice distribution, explained it with
       softmax, and tuned its randomness with temperature</strong>, watching your own data match
       the math. The chatbot's mystery is gone: it's a distribution you can read, compute, and
       turn a knob on.</p>`,
      { type: "ai", label: "Full circle" }
    )}
  `;

  window.SectionContent = window.SectionContent || {};
  window.SectionContent["lab-temperature-experiment"] = {
    title: "Lab 5: Temperature on a Real Model",
    html,
  };
})();
