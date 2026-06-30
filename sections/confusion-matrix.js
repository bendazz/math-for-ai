/* ============================================================
   Section: The Confusion Matrix  (Evaluation unit — section 1)
   Registered under id "confusion-matrix" (see manifest.js).
   Opens the new "Evaluation" group — the course's closing unit:
   "is the thing we built any good?"

   Anchored on the SPAM FILTER (callback to logits-and-sigmoid). A
   binary classifier's call vs the truth = four outcomes:
     TP caught spam · FN missed spam · FP good mail trashed · TN delivered
   Mnemonic taught explicitly: True/False = was it RIGHT?; Positive/
   Negative = what the filter SAID (flagged = positive). So a False
   Positive = said spam, was wrong = a good email trashed.
   Then ACCURACY = (TP+TN)/N, and the ACCURACY TRAP: on imbalanced
   classes a do-nothing filter scores high while catching zero spam —
   so accuracy alone hides failure; you must look inside the matrix.
   (Precision/recall is the NEXT section; not named here.)

   Interactive (onMount; Math.random OK in browser): a random batch of
   24 emails sorted into the 2x2 matrix with counts + accuracy; "New
   batch" reshuffles; "lazy filter" toggle flags nothing -> shows the
   trap. No inline problems (convention). No forward lead-in. No $.
   ============================================================ */

(function () {
  const T = window.Toolkit;

  const html = `
    <div class="eyebrow">Evaluation · 1</div>
    <h1>The Confusion Matrix</h1>

    <p>You've built things that make decisions — a chatbot, a randomness knob, a search that matches
    meaning. There's one question we've never asked: <strong>are they any good?</strong> This closing
    unit is about measuring that. We start with the simplest kind of judgment an AI makes: a
    <strong>yes-or-no call</strong>.</p>

    <p>Picture the <strong>spam filter</strong> from the sigmoid section. For every email, it makes one
    decision: <em>flag as spam</em>, or <em>let it through</em>. To know if it's good, we line its
    decisions up against the <strong>truth</strong> and count what happens. There are exactly four
    possibilities.</p>

    <h2>Four outcomes</h2>

    <p>Each email is really spam or really fine, and the filter either flags it or doesn't. Crossing
    those gives four cases:</p>
    <ul>
      <li><strong>Caught spam</strong> — it was spam, and the filter flagged it. Correct.</li>
      <li><strong>Missed spam</strong> — it was spam, but the filter let it through. Wrong (spam lands
      in your inbox).</li>
      <li><strong>Good email trashed</strong> — it was a fine email, but the filter flagged it. Wrong
      (and the <em>worse</em> mistake — you might miss something important).</li>
      <li><strong>Delivered</strong> — it was fine, and the filter let it through. Correct.</li>
    </ul>

    <p>Those two kinds of mistakes are <strong>not</strong> equally bad, and that asymmetry is the whole
    reason we need more than one number. Letting one spam through is a shrug; sending a job offer to the
    spam folder is a disaster.</p>

    <h2>The names: True/False and Positive/Negative</h2>

    <p>The standard names for the four cases sound confusing until you crack the code, so here's the
    code. Every name is two words:</p>
    <ul>
      <li>the second word — <strong>Positive</strong> or <strong>Negative</strong> — is <em>what the
      filter said</em>. "Positive" means it <strong>flagged</strong> the email (it's hunting for spam,
      so spam is the "positive" thing). "Negative" means it let the email through.</li>
      <li>the first word — <strong>True</strong> or <strong>False</strong> — is <em>whether the filter
      was right</em>. "True" = correct, "False" = wrong.</li>
    </ul>

    <p>Snap those together and the four cases name themselves:</p>
    <ul>
      <li><strong>True Positive (TP)</strong> — flagged, and right: <em>caught spam</em>.</li>
      <li><strong>False Positive (FP)</strong> — flagged, but wrong: <em>a good email trashed</em>.</li>
      <li><strong>False Negative (FN)</strong> — let through, but wrong: <em>spam missed</em>.</li>
      <li><strong>True Negative (TN)</strong> — let through, and right: <em>good email delivered</em>.</li>
    </ul>

    <p>"Positive" never means "good news" — it just means "the filter raised its hand." A <em>false
    positive</em> is a false alarm; a <em>false negative</em> is a miss.</p>

    <h2>Stacking them in a grid</h2>

    <p>Now count, over a whole batch of email, how many fall into each of the four cases, and arrange the
    counts in a $2 \\times 2$ grid — the <strong>confusion matrix</strong>. The truth runs down the side,
    the filter's decision runs across the top:</p>

    <p>Run a batch through and watch it fill in. The green squares are correct calls, the red squares are
    mistakes. Hit "New batch" for a fresh sample of email.</p>

    ${T.widget(
      "A spam filter's confusion matrix",
      `<div class="controls">
         <button class="btn" id="cm-new">New batch of email</button>
         <button class="btn ghost" id="cm-lazy">Use a lazy filter</button>
       </div>
       <div id="cm-matrix" style="margin-top:14px;overflow-x:auto"></div>
       <div id="cm-acc" style="margin-top:12px"></div>`
    )}

    <h2>Accuracy — and why it can fool you</h2>

    <p>The most obvious score is <strong>accuracy</strong>: of all the email, what fraction did the filter
    get right? That's the two green cells over the total:</p>

    $$\\text{accuracy} = \\frac{\\text{TP} + \\text{TN}}{\\text{TP} + \\text{FP} + \\text{FN} + \\text{TN}}.$$

    <p>Accuracy is useful, but it hides a trap — press <strong>"Use a lazy filter"</strong> above to see
    it. That filter flags <em>nothing</em>: it never traps a good email, but it also <strong>catches zero
    spam</strong>. And yet, because most email is legitimate, it still scores a respectable-looking
    accuracy. A number in the 80s or 90s that describes a filter doing <em>nothing useful</em>.</p>

    <p>This is the <strong>accuracy trap</strong>, and it gets worse the rarer the thing you're hunting.
    If only $1$ email in $100$ is spam, a filter that flags nothing is $99\\%$ accurate — and completely
    worthless. The single accuracy number blurred together two very different cells (caught spam vs.
    delivered good mail) that we actually care about separately. To judge a classifier honestly, you have
    to look <em>inside</em> the matrix — at how it does on the spam and on the good mail on their own
    terms.</p>

    <h2>What you learned</h2>
    <ul>
      <li>A yes/no classifier's calls sort into four outcomes — <strong>TP, FP, FN, TN</strong> — laid out
      in a <strong>confusion matrix</strong> (truth vs. the filter's decision).</li>
      <li>The names decode cleanly: <strong>Positive/Negative</strong> = what it <em>said</em> (flagged or
      not), <strong>True/False</strong> = whether it was <em>right</em>. A false positive is a false alarm;
      a false negative is a miss.</li>
      <li><strong>Accuracy</strong> $= (\\text{TP}+\\text{TN})/N$ is handy but can lie: on rare events, a
      do-nothing classifier scores high while being useless. The four cells hold the real story.</li>
    </ul>
  `;

  function onMount(root) {
    const matrixEl = root.querySelector("#cm-matrix");
    const accEl = root.querySelector("#cm-acc");
    const newBtn = root.querySelector("#cm-new");
    const lazyBtn = root.querySelector("#cm-lazy");
    if (!matrixEl) return;

    const N = 24, PREV = 0.25;   // 25% of email is actually spam
    let emails = [];
    let lazy = false;

    function gen() {
      emails = [];
      for (let i = 0; i < N; i++) {
        const spam = Math.random() < PREV;
        const flagged = spam ? Math.random() < 0.82 : Math.random() < 0.12;
        emails.push({ spam, flagged });
      }
    }

    function counts() {
      let tp = 0, fp = 0, fn = 0, tn = 0;
      emails.forEach((e) => {
        const pred = lazy ? false : e.flagged;
        if (e.spam && pred) tp++;
        else if (e.spam && !pred) fn++;
        else if (!e.spam && pred) fp++;
        else tn++;
      });
      return { tp, fp, fn, tn };
    }

    function cell(count, label, ok) {
      const bg = ok ? "#ecfdf5" : "#fff1f2";
      const fg = ok ? "#065f46" : "#9f1239";
      const mark = ok ? "✓" : "✗";
      return `<td style="border:1px solid var(--line);padding:12px 14px;background:${bg};text-align:center;min-width:140px">
        <div style="font-size:1.7em;font-weight:700;color:${fg}">${count}</div>
        <div style="font-size:.82em;color:${fg};margin-top:2px">${mark} ${label}</div>
      </td>`;
    }

    function render() {
      const { tp, fp, fn, tn } = counts();
      const head = `font-size:.85em;color:var(--ink-soft);font-weight:600;padding:8px;text-align:center`;
      const side = `font-size:.85em;color:var(--ink-soft);font-weight:600;padding:8px;text-align:right;white-space:nowrap`;
      matrixEl.innerHTML =
        `<table style="border-collapse:collapse;margin:0 auto">
           <tr>
             <td></td>
             <td colspan="2" style="${head}">— the filter's decision —</td>
           </tr>
           <tr>
             <td></td>
             <td style="${head}">Flagged as spam</td>
             <td style="${head}">Let through</td>
           </tr>
           <tr>
             <td style="${side}">Actually&nbsp;spam</td>
             ${cell(tp, "caught spam", true)}
             ${cell(fn, "missed spam", false)}
           </tr>
           <tr>
             <td style="${side}">Actually&nbsp;fine</td>
             ${cell(fp, "good email trashed", false)}
             ${cell(tn, "delivered", true)}
           </tr>
         </table>`;

      const correct = tp + tn;
      const acc = Math.round(correct / N * 100);
      let line = `<div style="font-size:1.02em;color:#0f172a"><b>Accuracy = (${tp} + ${tn}) / ${N} = ${acc}% correct</b></div>`;
      if (lazy) {
        line += `<div class="tr-meta" style="margin-top:4px;color:#9f1239">This filter flagged nothing — it caught <b>0</b> spam, yet accuracy still looks decent. That's the trap.</div>`;
      } else {
        line += `<div class="tr-meta" style="margin-top:4px">Caught ${tp} of ${tp + fn} spam; trashed ${fp} good email${fp === 1 ? "" : "s"}.</div>`;
      }
      accEl.innerHTML = line;
    }

    newBtn.addEventListener("click", () => { gen(); render(); });
    lazyBtn.addEventListener("click", () => {
      lazy = !lazy;
      lazyBtn.textContent = lazy ? "Use the real filter" : "Use a lazy filter";
      lazyBtn.className = "btn" + (lazy ? "" : " ghost");
      render();
    });

    gen();
    render();
  }

  window.SectionContent = window.SectionContent || {};
  window.SectionContent["confusion-matrix"] = {
    title: "The Confusion Matrix",
    html,
    onMount,
  };
})();
