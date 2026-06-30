/* ============================================================
   Section: Lab 8 — Build a Spam Filter, Then Grade It  (Evaluation · 5)
   Registered under id "lab-evaluate-classifier" (see manifest.js).
   THE COURSE FINALE / capstone eval lab.

   Students turn the Lab 4 loop into a real LLM SPAM CLASSIFIER that
   scores each message 0-100, run it over a PROVIDED labeled test set,
   then upload the scores to an in-page EVALUATION DASHBOARD that:
     - knows the true labels (embedded), pairs them with the uploaded
       scores BY ORDER,
     - has a THRESHOLD slider (flag as spam if score >= threshold),
     - builds the real confusion matrix + accuracy/precision/recall/F1
       from THEIR model, and lists every message with its score / truth
       / prediction, highlighting the mistakes (FP/FN).
   "Try sample results" button => works with no Langflow (Chromebook /
   demo), generating a realistic score spread. This unifies the whole
   course: Langflow + Lab 4 loop + classifier + confusion matrix +
   precision/recall/F1 + the threshold dial, on data students made.

   Test set: 20 short messages (no literal $ — KaTeX gotcha), 8 spam /
   12 ham incl. 4 borderline-ham (promotional/phishy) that drive the
   interesting FP errors. Langflow flow reuses Lab 4 (verified earlier).
   Predict-then-reveal problems are part of the lab. No currency $.
   ============================================================ */

(function () {
  const T = window.Toolkit;

  // order is fixed; the answer key and the generated prompts share it.
  const TESTS = [
    { t: "Congratulations! You have WON a free gift card. Click here to claim now!", spam: true },
    { t: "Hey, are we still on for lunch tomorrow at noon?", spam: false },
    { t: "URGENT: your account will be suspended. Verify your password immediately at this link.", spam: true },
    { t: "Can you send me the slides from today's meeting?", spam: false },
    { t: "Make 5000 dollars a week from home, no experience needed. Sign up today!", spam: true },
    { t: "Reminder: your dentist appointment is on Thursday at 3 pm.", spam: false },
    { t: "You are our lucky winner! Claim your free phone before it expires.", spam: true },
    { t: "The package was delivered to your front door this afternoon.", spam: false },
    { t: "Lower your mortgage rate now! Limited time offer, act fast!!!", spam: true },
    { t: "Great game last night! Want to grab coffee this weekend?", spam: false },
    { t: "Cheap meds online, no prescription required. Discreet shipping.", spam: true },
    { t: "Please review the attached report before our call on Monday.", spam: false },
    { t: "Final notice: claim your inheritance of ten million dollars now.", spam: true },
    { t: "Mom called, she wants to know if you are coming for the holidays.", spam: false },
    { t: "Hot deals just for you tonight, do not miss out, click now!", spam: true },
    { t: "The library books you reserved are ready for pickup.", spam: false },
    { t: "Your monthly newsletter from TechWeekly is here: the top 10 gadgets of the year.", spam: false, b: true },
    { t: "Action required: update your billing information to keep your subscription active.", spam: false, b: true },
    { t: "We miss you! Here is 20 percent off your next purchase, just for you.", spam: false, b: true },
    { t: "Security alert: an unusual sign-in to your account was detected.", spam: false, b: true },
  ];

  const PROMPT_HEAD = "Rate how likely this message is spam, from 0 (definitely not spam) to 100 (definitely spam). Reply with only the number. Message: ";

  const html = `
    <div class="eyebrow">Evaluation · 5</div>
    <h1>Lab 8: Build a Spam Filter, Then Grade It</h1>

    <p>This is where the whole course comes together. You'll build a <strong>real</strong> spam filter in
    Langflow, run it on a set of test messages whose true answers we already know, and then
    <strong>grade it</strong> — building its confusion matrix and measuring its precision, recall, and F1
    on your own model's behavior. The abstract scores from the last few sections become a verdict on
    something you built.</p>

    ${T.callout(
      `<p>The plan, end to end:</p>
       <ol style="margin:.4em 0 0">
         <li>Turn your Lab 4 loop into a classifier that scores each message $0$–$100$ for spamminess.</li>
         <li>Run it over the $20$ provided test messages to get a <strong>results.csv</strong> of scores.</li>
         <li>Upload those scores to the dashboard below and read off the confusion matrix and metrics.</li>
         <li>Slide the decision threshold and decide where <em>you</em> want the filter to sit.</li>
       </ol>`,
      { type: "", label: "The plan" }
    )}

    <h2>Part 1 — Turn the loop into a classifier</h2>

    <p>Open your <strong>Lab 4</strong> flow (File → Loop → Model → Write File). The only change is the
    instruction: instead of filling in a blank, each row now asks the model to <strong>score a message</strong>.
    Download the ready-made prompts below — one per test message, already wrapped in this instruction:</p>

    <p style="padding:10px 12px;background:var(--accent-soft);border-radius:8px;color:var(--accent-ink);font-size:.92em">
      ${PROMPT_HEAD}<em>(the message)</em>
    </p>

    ${T.widget(
      "Get the test prompts",
      `<div class="controls">
         <button class="btn" id="ev-dl">Download prompts.csv</button>
         <span class="tr-meta">20 messages, scored 0–100 each</span>
       </div>
       <details style="margin-top:10px">
         <summary style="cursor:pointer;color:var(--ink-soft);font-size:.9em">Peek at the 20 test messages</summary>
         <div id="ev-preview" style="margin-top:8px"></div>
       </details>`
    )}

    <h2>Part 2 — Run it</h2>

    <p>Load <strong>prompts.csv</strong> into your Lab 4 flow's File block and run the loop, exactly as
    before. The model reads each message and replies with a number; the Write File block saves them to
    <strong>results.csv</strong>. Keep the rows <strong>in order</strong> — the dashboard pairs the first
    score with the first message, and so on. (It's just $20$ calls; pennies at most, and free on Gemini.)</p>

    <h2>Part 3 — Grade your filter</h2>

    <p>Upload your <strong>results.csv</strong>. The dashboard knows the true label of every test message,
    so it can build the real confusion matrix and compute the metrics. No Langflow handy? Hit
    <strong>"Try sample results"</strong> to grade a stand-in filter. Then drag the threshold and watch
    everything move — it's the threshold dial, now running on your own data.</p>

    ${T.widget(
      "Evaluation dashboard",
      `<div class="controls" style="align-items:center;gap:12px;flex-wrap:wrap">
         <label class="filebtn">Upload results.csv<input type="file" id="ev-file" accept=".csv,text/csv" hidden></label>
         <button class="btn ghost" id="ev-sample">Try sample results</button>
         <span id="ev-status" class="tr-meta"></span>
       </div>
       <div id="ev-dash" style="display:none;margin-top:14px">
         <div class="slider-row" style="grid-template-columns:auto 1fr 3em;align-items:center;gap:12px">
           <span class="slabel" style="white-space:nowrap">flag as spam at score ≥</span>
           <input type="range" id="ev-thresh" min="1" max="99" step="1" value="50" />
           <span class="sval" id="ev-thresh-v">50</span>
         </div>
         <div id="ev-matrix" style="margin-top:14px;overflow-x:auto"></div>
         <div id="ev-metrics" style="margin-top:12px;display:flex;gap:10px;flex-wrap:wrap"></div>
         <div id="ev-list" style="margin-top:16px"></div>
       </div>`
    )}

    <h2>Predict, then look</h2>

    ${(T.resetProblems(), "")}

    ${T.problem(
      `<p>Before you grade it: on this test set, do you expect your filter to make more <em>false alarms</em>
       (flagging good email) or more <em>misses</em> (letting spam through)? Why?</p>`,
      `<p>Most likely <strong>false alarms</strong>. The blatant spam is easy to catch, so misses are rare —
       but several legitimate messages are written to <em>look</em> spammy (a promotional newsletter, a
       "billing update," a security alert). A spam-trained model tends to flag those, producing false
       positives. So <strong>precision</strong> is usually the weaker number here, while recall stays high.</p>`
    )}

    ${T.problem(
      `<p>Your manager says: "I never want to lose a real email." Which way do you move the threshold, and
       which metric are you pushing toward $100\\%$ — at the cost of which other one?</p>`,
      `<p>Move the threshold <strong>up</strong> (flag only when the score is very high). That drives
       <strong>precision</strong> toward $100\\%$ — almost nothing it flags is a real email — but it lets
       more spam slip through, so <strong>recall</strong> falls. You've decided a miss is cheaper than a
       lost email, and set the dial to match.</p>`
    )}

    ${T.problem(
      `<p>As you slide the threshold from low to high on the dashboard, describe the path precision and
       recall take.</p>`,
      `<p>At a <strong>low</strong> threshold the filter flags almost everything: recall is high (it catches
       all the spam) but precision is low (it also trashes good mail). As you raise it, precision climbs and
       recall falls, until at a very <strong>high</strong> threshold it flags almost nothing — high
       precision on the few it does flag, but recall near zero. Same tradeoff you saw in the threshold-dial
       section, now on a filter you built.</p>`
    )}

    ${T.callout(
      `<ul>
         <li><strong>The dashboard says the score count doesn't match.</strong> Your results.csv should have
         one number per message, in the original order — $20$ in total. Make sure the loop didn't drop or
         reorder rows, and that the file holds the model's scores (not the prompts).</li>
         <li><strong>Every score is $0$ or $100$.</strong> Real models often answer with extremes, which
         makes the threshold less interesting. That's expected — try the sample results to see a fuller
         spread, and note in your write-up that your model was very decisive.</li>
         <li><strong>A score came back as words, not a number.</strong> Strengthen the prompt: "Reply with
         only a number from 0 to 100, nothing else."</li>
       </ul>`,
      { type: "warn", label: "Troubleshooting" }
    )}

    <h2>Did it work? Tick these off</h2>

    <ul class="checklist">
      <li><label><input type="checkbox"> I turned the Lab 4 loop into a $0$–$100$ spam scorer and ran the $20$ messages.</label></li>
      <li><label><input type="checkbox"> I uploaded results.csv and saw my filter's <strong>confusion matrix</strong>.</label></li>
      <li><label><input type="checkbox"> I read off its <strong>accuracy, precision, recall, and F1</strong>.</label></li>
      <li><label><input type="checkbox"> I found which messages it got wrong and saw <em>why</em> (the tricky ones).</label></li>
      <li><label><input type="checkbox"> I set the threshold for a goal I chose and explained the tradeoff.</label></li>
    </ul>

    ${T.callout(
      `<p>Look at how far you've come. You started by asking what a probability is. Since then you've built
       chatbots, turned the randomness knob, followed the math from logits through softmax and temperature,
       learned what a vector is and watched words become geometry, built a search engine that matches
       meaning, and — just now — <strong>built an AI classifier and measured whether it's any good</strong>.
       That's the entire arc of an AI project: build it, understand the math inside it, and judge it
       honestly. The mystery is gone. What's left is yours to build.</p>`,
      { type: "ai", label: "The whole loop" }
    )}
  `;

  function onMount(root) {
    const csvField = (s) => '"' + String(s).replace(/"/g, '""') + '"';

    // message preview (no labels — predict first)
    const preview = root.querySelector("#ev-preview");
    if (preview) {
      preview.innerHTML = `<ol style="margin:0;padding-left:1.4em;color:var(--ink-soft);font-size:.86em">` +
        TESTS.map((x) => `<li style="margin:3px 0">${x.t}</li>`).join("") + `</ol>`;
    }

    // download prompts.csv
    const dlBtn = root.querySelector("#ev-dl");
    if (dlBtn) dlBtn.addEventListener("click", () => {
      const rows = ["prompt"].concat(TESTS.map((x) => csvField(PROMPT_HEAD + x.t)));
      const blob = new Blob([rows.join("\n") + "\n"], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "prompts.csv";
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
    });

    // dashboard
    const fileInput = root.querySelector("#ev-file");
    const sampleBtn = root.querySelector("#ev-sample");
    const statusEl = root.querySelector("#ev-status");
    const dash = root.querySelector("#ev-dash");
    const slider = root.querySelector("#ev-thresh");
    const threshV = root.querySelector("#ev-thresh-v");
    const matrixEl = root.querySelector("#ev-matrix");
    const metricsEl = root.querySelector("#ev-metrics");
    const listEl = root.querySelector("#ev-list");
    if (!fileInput) return;

    let scores = null;

    function parseScores(text) {
      const out = [];
      text.split(/\r?\n/).forEach((line) => {
        const t = line.trim();
        if (!t) return;
        const nums = t.match(/\d+(?:\.\d+)?/g);
        if (!nums) return;                       // skip header / blank
        for (const n of nums) {
          const v = parseFloat(n);
          if (v >= 0 && v <= 100) { out.push(v); break; }
        }
      });
      return out;
    }

    function sample() {
      return TESTS.map((x) =>
        x.spam ? Math.round(70 + Math.random() * 30)
          : x.b ? Math.round(35 + Math.random() * 45)
            : Math.round(Math.random() * 35));
    }

    function cell(count, label, ok) {
      const bg = ok ? "#ecfdf5" : "#fff1f2", fg = ok ? "#065f46" : "#9f1239";
      return `<td style="border:1px solid var(--line);padding:11px 14px;background:${bg};text-align:center;min-width:128px">
        <div style="font-size:1.5em;font-weight:700;color:${fg}">${count}</div>
        <div style="font-size:.8em;color:${fg}">${label}</div></td>`;
    }
    function metricCard(name, val, color) {
      return `<div style="flex:1;min-width:120px;border:1px solid var(--line);border-top:3px solid ${color};border-radius:9px;padding:10px 12px;text-align:center">
        <div style="font-size:1.4em;font-weight:700;color:#0f172a">${val}</div>
        <div style="font-size:.82em;color:var(--ink-soft)">${name}</div></div>`;
    }

    function render() {
      if (!scores) return;
      const th = parseInt(slider.value, 10);
      threshV.textContent = th;
      let tp = 0, fp = 0, fn = 0, tn = 0;
      const n = Math.min(scores.length, TESTS.length);
      for (let i = 0; i < n; i++) {
        const pred = scores[i] >= th, truth = TESTS[i].spam;
        if (truth && pred) tp++;
        else if (!truth && pred) fp++;
        else if (truth && !pred) fn++;
        else tn++;
      }
      matrixEl.innerHTML =
        `<table style="border-collapse:separate;border-spacing:3px;margin:0 auto">
           <tr><td></td><td style="font-size:.82em;color:var(--ink-soft);font-weight:600;padding:6px;text-align:center">Flagged as spam</td><td style="font-size:.82em;color:var(--ink-soft);font-weight:600;padding:6px;text-align:center">Let through</td></tr>
           <tr><td style="font-size:.82em;color:var(--ink-soft);font-weight:600;padding:6px;text-align:right">Actually&nbsp;spam</td>${cell(tp, "caught", true)}${cell(fn, "missed", false)}</tr>
           <tr><td style="font-size:.82em;color:var(--ink-soft);font-weight:600;padding:6px;text-align:right">Actually&nbsp;fine</td>${cell(fp, "trashed", false)}${cell(tn, "delivered", true)}</tr>
         </table>`;

      const acc = Math.round((tp + tn) / n * 100);
      const prec = tp + fp === 0 ? null : tp / (tp + fp);
      const rec = tp + fn === 0 ? null : tp / (tp + fn);
      const f1 = (prec === null || rec === null || prec + rec === 0) ? null : 2 * prec * rec / (prec + rec);
      const pct = (x) => x === null ? "—" : Math.round(x * 100) + "%";
      metricsEl.innerHTML =
        metricCard("accuracy", acc + "%", "#64748b") +
        metricCard("precision", pct(prec), "#4f46e5") +
        metricCard("recall", pct(rec), "#0d9488") +
        metricCard("F1", f1 === null ? "—" : f1.toFixed(2), "#b45309");

      // per-message list, errors highlighted
      const rows = [];
      for (let i = 0; i < n; i++) {
        const s = scores[i], pred = s >= th, truth = TESTS[i].spam;
        const err = pred !== truth;
        const tag = truth ? (pred ? "TP" : "FN") : (pred ? "FP" : "TN");
        const tagcol = err ? "#9f1239" : "#065f46";
        const bg = err ? "#fff1f2" : "transparent";
        const msg = TESTS[i].t.length > 58 ? TESTS[i].t.slice(0, 57) + "…" : TESTS[i].t;
        rows.push(`<div style="display:grid;grid-template-columns:1fr 3em 2.6em;gap:10px;align-items:center;padding:5px 8px;border-radius:6px;background:${bg}">
          <span style="font-size:.85em;color:#334155">${msg}</span>
          <span style="font-size:.85em;color:var(--ink-soft);text-align:right">${s}</span>
          <span style="font-size:.8em;font-weight:700;color:${tagcol};text-align:right">${tag}</span>
        </div>`);
      }
      listEl.innerHTML =
        `<div class="tr-meta" style="margin-bottom:6px">Each message: its score, and the outcome at this threshold (red = mistake).</div>` +
        rows.join("");
    }

    function load(arr, label) {
      scores = arr;
      dash.style.display = "block";
      if (scores.length !== TESTS.length) {
        statusEl.textContent = `${label}: got ${scores.length} scores, expected ${TESTS.length} — pairing the first ${Math.min(scores.length, TESTS.length)}.`;
      } else {
        statusEl.textContent = `${label}: ${scores.length} scores loaded.`;
      }
      render();
    }

    fileInput.addEventListener("change", (e) => {
      const f = e.target.files[0]; if (!f) return;
      const r = new FileReader();
      r.onload = () => load(parseScores(String(r.result)), f.name);
      r.readAsText(f);
    });
    sampleBtn.addEventListener("click", () => load(sample(), "Sample filter"));
    slider.addEventListener("input", render);
  }

  window.SectionContent = window.SectionContent || {};
  window.SectionContent["lab-evaluate-classifier"] = {
    title: "Lab 8: Build a Spam Filter, Then Grade It",
    html,
    onMount,
  };
})();
