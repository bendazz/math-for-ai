/* ============================================================
   Section: Precision and Recall  (Evaluation unit — section 2)
   Registered under id "precision-recall" (see manifest.js).
   Continues the spam-filter thread from confusion-matrix.

   Two ratios that look INSIDE the matrix:
     PRECISION = TP/(TP+FP) — of everything FLAGGED, how much was
       really spam. Reads the "flagged" COLUMN. High = few false alarms.
     RECALL    = TP/(TP+FN) — of all the real spam, how much got
       caught. Reads the "actually spam" ROW. High = few misses.
   The TRADEOFF: flag eagerly -> recall up, precision down; flag
   cautiously -> precision up, recall down. WHEN EACH MATTERS: spam ->
   precision (don't trash good mail); medical screening -> recall
   (don't miss a sick patient). Probability callback: precision =
   P(spam | flagged), recall = P(flagged | spam) — same TP, different
   denominators (conditioning reversed).

   (Threshold-as-the-sigmoid-dial + F1 is the NEXT section.)

   Interactive (onMount, Math.random once): a fixed population with an
   "eagerness" slider; live matrix + precision/recall cards; a
   Precision/Recall highlight toggle outlines the column vs the row.
   No inline problems (convention). No forward lead-in. No currency $.
   ============================================================ */

(function () {
  const T = window.Toolkit;

  const html = `
    <div class="eyebrow">Evaluation · 2</div>
    <h1>Precision and Recall</h1>

    <p>Accuracy mashed the four cells into one number and lost the plot. The fix is to ask two sharper
    questions, each looking at a different part of the confusion matrix. Both are about the spam the
    filter is hunting for, and both are simple fractions.</p>

    <h2>Precision: when it flags, is it right?</h2>

    <p><strong>Precision</strong> asks: of all the email the filter <strong>flagged</strong>, what
    fraction was actually spam?</p>

    $$\\text{precision} = \\frac{\\text{TP}}{\\text{TP} + \\text{FP}}
      = \\frac{\\text{caught spam}}{\\text{everything flagged}}.$$

    <p>It reads the <strong>"flagged" column</strong> of the matrix — the caught spam (TP) over
    everything the filter raised its hand on (TP plus the false alarms, FP). High precision means
    <strong>few false alarms</strong>: when this filter sends something to the spam folder, you can trust
    it really is spam. Low precision means it cries wolf — good emails keep getting trashed.</p>

    <h2>Recall: does it catch what it should?</h2>

    <p><strong>Recall</strong> asks the opposite-facing question: of all the email that was
    <strong>really spam</strong>, what fraction did the filter catch?</p>

    $$\\text{recall} = \\frac{\\text{TP}}{\\text{TP} + \\text{FN}}
      = \\frac{\\text{caught spam}}{\\text{all the real spam}}.$$

    <p>It reads the <strong>"actually spam" row</strong> — the caught spam (TP) over all the spam there
    was to catch (TP plus the misses, FN). High recall means <strong>few misses</strong>: little spam
    slips into your inbox. Low recall means lots gets through.</p>

    <p>Notice both fractions share the same top, TP (the spam it got right), but divide by different
    totals: precision by <em>everything flagged</em>, recall by <em>all the real spam</em>. That single
    difference is everything.</p>

    <h2>The tug-of-war</h2>

    <p>Here's why you need both: <strong>they pull against each other.</strong> Make the filter
    <em>eager</em> — flag at the faintest whiff of spam — and it'll catch nearly all the spam (recall
    soars) but also trash a pile of good email (precision sinks). Make it <strong>cautious</strong> — flag
    only dead-obvious spam — and almost everything it flags is right (precision soars) but lots of subtler
    spam sails through (recall sinks). Drag the slider and watch the two numbers move in opposite
    directions.</p>

    ${T.widget(
      "Precision vs recall as the filter gets eager",
      `<div class="slider-row" style="grid-template-columns:auto 1fr auto;align-items:center;gap:12px">
         <span class="slabel" style="white-space:nowrap">cautious</span>
         <input type="range" id="pr-eager" min="0" max="100" step="1" value="55" />
         <span class="slabel" style="white-space:nowrap">eager</span>
       </div>
       <div class="controls" style="margin-top:10px">
         <button class="btn" data-hl="prec">Highlight precision</button>
         <button class="btn ghost" data-hl="rec">Highlight recall</button>
       </div>
       <div id="pr-matrix" style="margin-top:14px;overflow-x:auto"></div>
       <div id="pr-cards" style="margin-top:14px;display:flex;gap:12px;flex-wrap:wrap"></div>`
    )}

    <h2>So which one do you want?</h2>

    <p>You usually can't have both maxed out, so you decide based on <strong>which mistake hurts more</strong>:</p>
    <ul>
      <li>For a <strong>spam filter</strong>, the painful error is a <em>false alarm</em> — a real email
      lost to the spam folder. So you lean toward <strong>precision</strong>: only flag when you're
      confident, and tolerate a little spam sneaking through.</li>
      <li>For a <strong>medical screening test</strong>, the painful error is a <em>miss</em> — telling a
      sick patient they're fine. So you lean hard toward <strong>recall</strong>: catch every possible
      case, even if it means more false alarms that a follow-up test can sort out.</li>
    </ul>

    <p>Same two numbers, opposite priorities — because the cost of the two kinds of mistake is completely
    different. That's the whole reason we refuse to collapse evaluation into a single "accuracy."</p>

    ${T.callout(
      `<p>If the probability unit is rattling around in your memory: precision and recall are
       <strong>conditional probabilities</strong> — the chance of one thing <em>given</em> another.
       Precision is the chance an email is really spam <em>given that it was flagged</em>; recall is the
       chance an email gets flagged <em>given that it's really spam</em>. Same event (caught spam) on top,
       but you're dividing by a different "given" each time — the flagged column versus the spam row.
       Reversing what you condition on flips precision into recall.</p>`,
      { type: "", label: "A probability connection" }
    )}

    <h2>What you learned</h2>
    <ul>
      <li><strong>Precision</strong> $= \\text{TP}/(\\text{TP}+\\text{FP})$ — of what it flagged, how much
      was right. Reads the <em>flagged column</em>; high precision = few false alarms.</li>
      <li><strong>Recall</strong> $= \\text{TP}/(\\text{TP}+\\text{FN})$ — of the real spam, how much it
      caught. Reads the <em>actual-spam row</em>; high recall = few misses.</li>
      <li>They <strong>trade off</strong>: eager flagging raises recall and lowers precision, and vice
      versa. Which one you favor depends on whether a <em>false alarm</em> or a <em>miss</em> is the worse
      mistake.</li>
    </ul>
  `;

  function onMount(root) {
    const slider = root.querySelector("#pr-eager");
    const matrixEl = root.querySelector("#pr-matrix");
    const cardsEl = root.querySelector("#pr-cards");
    if (!slider) return;

    // fixed population, generated once
    const SPAM = 60, HAM = 140;
    const spamScores = [], hamScores = [];
    for (let i = 0; i < SPAM; i++) spamScores.push(0.40 + Math.random() * 0.60); // skew high
    for (let i = 0; i < HAM; i++) hamScores.push(Math.random() * 0.60);          // skew low
    let highlight = "prec";

    function counts(thresh) {
      let tp = 0, fn = 0, fp = 0, tn = 0;
      spamScores.forEach((s) => (s >= thresh ? tp++ : fn++));
      hamScores.forEach((s) => (s >= thresh ? fp++ : tn++));
      return { tp, fn, fp, tn };
    }

    function cell(count, label, ok, on) {
      const bg = ok ? "#ecfdf5" : "#fff1f2";
      const fg = ok ? "#065f46" : "#9f1239";
      const border = on ? `3px solid ${on}` : "1px solid var(--line)";
      return `<td style="border:${border};padding:11px 14px;background:${bg};text-align:center;min-width:130px">
        <div style="font-size:1.5em;font-weight:700;color:${fg}">${count}</div>
        <div style="font-size:.8em;color:${fg};margin-top:2px">${label}</div>
      </td>`;
    }

    function render() {
      const thresh = 1 - parseInt(slider.value, 10) / 100;   // eager -> low threshold
      const { tp, fn, fp, tn } = counts(thresh);
      const IND = "#4f46e5", TEAL = "#0d9488";
      const pOn = highlight === "prec", rOn = highlight === "rec";
      // precision cells: TP, FP (flagged column). recall cells: TP, FN (spam row).
      const head = `font-size:.82em;color:var(--ink-soft);font-weight:600;padding:8px;text-align:center`;
      const side = `font-size:.82em;color:var(--ink-soft);font-weight:600;padding:8px;text-align:right;white-space:nowrap`;
      matrixEl.innerHTML =
        `<table style="border-collapse:separate;border-spacing:3px;margin:0 auto">
           <tr><td></td><td style="${head}">Flagged as spam</td><td style="${head}">Let through</td></tr>
           <tr>
             <td style="${side}">Actually&nbsp;spam</td>
             ${cell(tp, "caught spam", true, pOn ? IND : (rOn ? TEAL : null))}
             ${cell(fn, "missed spam", false, rOn ? TEAL : null)}
           </tr>
           <tr>
             <td style="${side}">Actually&nbsp;fine</td>
             ${cell(fp, "good email trashed", false, pOn ? IND : null)}
             ${cell(tn, "delivered", true, null)}
           </tr>
         </table>`;

      const prec = tp + fp === 0 ? null : tp / (tp + fp);
      const rec = tp + fn === 0 ? null : tp / (tp + fn);
      const card = (title, color, frac, val, note, active) =>
        `<div style="flex:1;min-width:200px;border:${active ? 2 : 1}px solid ${active ? color : "var(--line)"};border-radius:10px;padding:12px 14px">
           <div style="font-weight:700;color:${color}">${title}</div>
           <div style="font-size:1.15em;margin:4px 0;color:#0f172a"><b>${frac} = ${val}</b></div>
           <div class="tr-meta">${note}</div>
         </div>`;
      cardsEl.innerHTML =
        card("Precision", "#4f46e5", `${tp} / (${tp} + ${fp})`,
          prec === null ? "—" : Math.round(prec * 100) + "%",
          "of the email it flagged, this much was really spam", pOn) +
        card("Recall", "#0d9488", `${tp} / (${tp} + ${fn})`,
          rec === null ? "—" : Math.round(rec * 100) + "%",
          "of all the real spam, this much got caught", rOn);
    }

    slider.addEventListener("input", render);
    root.querySelectorAll("[data-hl]").forEach((b) =>
      b.addEventListener("click", () => {
        highlight = b.dataset.hl;
        root.querySelectorAll("[data-hl]").forEach((o) =>
          o.className = "btn" + (o.dataset.hl === highlight ? "" : " ghost"));
        render();
      })
    );
    render();
  }

  window.SectionContent = window.SectionContent || {};
  window.SectionContent["precision-recall"] = {
    title: "Precision and Recall",
    html,
    onMount,
  };
})();
