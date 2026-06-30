/* ============================================================
   Section: Practice — Evaluating a Classifier  (Evaluation · 4)
   Registered under id "evaluation-practice" (see manifest.js).

   Dedicated practice (per [[concept-sections-no-inline-problems]])
   drilling confusion-matrix / precision-recall / threshold-dial:
   identify TP/FP/FN/TN, build a matrix, accuracy + the accuracy trap,
   precision, recall, F1 (harmonic mean), the threshold tradeoff, and
   which metric matters when. Spam-filter thread throughout.

   Pure HTML, no onMount — T.problem click-to-reveal. Inequalities
   phrased in words to avoid raw < / > in HTML. No currency $ (percents
   use \\%). No forward lead-in.
   ============================================================ */

(function () {
  const T = window.Toolkit;

  const html = `
    <div class="eyebrow">Evaluation · 4</div>
    <h1>Practice: Evaluating a Classifier</h1>

    <p>A mixed set on judging a yes/no classifier — confusion matrix, accuracy, precision, recall, F1, and
    the threshold dial. The spam filter runs through most of them. Work each on paper, then reveal.</p>

    ${T.callout(
      `<p>A calculator helps with the divisions. Recall the formulas: accuracy
       $= (\\text{TP}+\\text{TN})/N$, precision $= \\text{TP}/(\\text{TP}+\\text{FP})$, recall
       $= \\text{TP}/(\\text{TP}+\\text{FN})$, and $\\text{F1} = 2PR/(P+R)$. Round to two decimals or a
       percent.</p>`,
      { type: "note", label: "Before you start" }
    )}

    ${(T.resetProblems(), "")}

    ${T.problem(
      `<p>Name each outcome (TP, FP, FN, or TN): (a) a spam email lands in your inbox; (b) a newsletter you
       actually wanted gets sent to the spam folder; (c) a scam email is correctly sent to the spam
       folder.</p>`,
      `<p>(a) <strong>False Negative</strong> — it was spam, but the filter let it through (a miss).
       (b) <strong>False Positive</strong> — it was fine, but the filter flagged it (a false alarm).
       (c) <strong>True Positive</strong> — it was spam, and the filter flagged it.</p>`
    )}

    ${T.problem(
      `<p>Out of $100$ emails, $30$ are really spam. The filter flags $35$ emails, and $25$ of those flagged
       are truly spam. Fill in TP, FP, FN, TN, then compute accuracy.</p>`,
      `<p>TP $= 25$ (flagged and spam). FP $= 35 - 25 = 10$ (flagged but fine). FN $= 30 - 25 = 5$ (spam not
       flagged). TN $= 70 - 10 = 60$ (fine and not flagged). Check: $25+10+5+60 = 100$. Accuracy
       $= (25 + 60)/100 = \\textbf{85\\%}$.</p>`
    )}

    ${T.problem(
      `<p>A filter's confusion matrix is TP $= 40$, FP $= 10$, FN $= 20$, TN $= 130$. Find its precision and
       recall, and say in words what each means here.</p>`,
      `<p>Precision $= 40/(40+10) = 40/50 = \\textbf{0.80}$ — of everything it flagged, $80\\%$ was really
       spam. Recall $= 40/(40+20) = 40/60 \\approx \\textbf{0.67}$ — it caught about $67\\%$ of the actual
       spam. So: trustworthy when it flags, but missing a third of the spam.</p>`
    )}

    ${T.problem(
      `<p>Using the precision $0.80$ and recall $0.67$ from the last problem, compute the F1 score.</p>`,
      `<p>$\\text{F1} = \\dfrac{2 \\cdot 0.80 \\cdot 0.67}{0.80 + 0.67} = \\dfrac{1.07}{1.47} \\approx
       \\textbf{0.73}$. It sits between the two, pulled a little toward the smaller (recall).</p>`
    )}

    ${T.problem(
      `<p>In a mailbox, $95\\%$ of email is legitimate. A lazy filter labels <em>every</em> email "not spam."
       What's its accuracy? Its recall on spam? What's the lesson?</p>`,
      `<p>It's right on every legitimate email and wrong on every spam, so accuracy $= \\textbf{95\\%}$ — it
       looks great. But it caught zero spam, so recall $= 0/(0+\\text{all spam}) = \\textbf{0}$ (and with no
       flags at all, precision isn't even defined). The lesson: <strong>accuracy alone is fooled by
       imbalance</strong>; precision and recall expose the filter as useless.</p>`
    )}

    ${T.problem(
      `<p>A filter has precision $0.95$ but recall $0.40$. Describe its behavior in plain language.</p>`,
      `<p>It's <strong>cautious</strong>. When it flags something, it's almost always right ($95\\%$) — very
       few false alarms — but it only catches $40\\%$ of the spam, letting most of it through. High
       precision, low recall: a filter that rarely cries wolf but misses a lot.</p>`
    )}

    ${T.problem(
      `<p>You lower a filter's decision threshold from $0.5$ to $0.3$, so it flags an email as spam more
       readily. What happens to its precision and its recall, in general?</p>`,
      `<p>Flagging more readily means it catches more of the real spam, so <strong>recall goes up</strong> —
       but it also trips on more good email, so <strong>precision goes down</strong>. Lowering the threshold
       slides you toward the eager, high-recall end of the tradeoff.</p>`
    )}

    ${T.problem(
      `<p>For each app, is precision or recall the more important target? (a) a cancer screening test;
       (b) a filter that <em>permanently deletes</em> flagged email; (c) a "you might also like" box showing
       five products.</p>`,
      `<p>(a) <strong>Recall</strong> — missing a sick patient is far worse than a false alarm, which a
       follow-up test can clear. (b) <strong>Precision</strong> — deleting a real email forever is
       catastrophic, so only flag when very sure. (c) <strong>Precision</strong> — with just five slots you
       want them all to be good suggestions; a few missed matches don't hurt.</p>`
    )}

    ${T.problem(
      `<p>Filter A has precision $0.9$ and recall $0.9$. Filter B has precision $1.0$ and recall $0.5$. Which
       has the higher F1, and what does that say about F1?</p>`,
      `<p>Filter A: $\\text{F1} = \\dfrac{2(0.9)(0.9)}{0.9+0.9} = \\textbf{0.90}$. Filter B:
       $\\text{F1} = \\dfrac{2(1.0)(0.5)}{1.0+0.5} = \\dfrac{1.0}{1.5} \\approx \\textbf{0.67}$. <strong>A
       wins.</strong> Even though B has perfect precision, its weak recall drags its F1 down — the harmonic
       mean rewards being good at <em>both</em>, not great at one.</p>`
    )}

    ${T.problem(
      `<p>For a disease test you can pick the threshold. One setting gives precision $0.6$, recall $0.95$;
       another gives precision $0.9$, recall $0.6$. Which would you choose, and why — even though the second
       has the higher F1?</p>`,
      `<p>Choose the <strong>first</strong> (recall $0.95$). For a disease test a <em>miss</em> (telling a
       sick person they're fine) is the dangerous error, so you want recall high — you accept more false
       alarms, which a follow-up test sorts out. F1 treats the two errors as equally costly, but here they
       aren't, so the balanced-looking choice isn't the right one. <strong>The threshold is a judgment about
       which mistake hurts more.</strong></p>`
    )}

    ${T.problem(
      `<p>A classifier scores TP $= 50$, FP $= 25$, FN $= 10$, TN $= 115$ (that's $200$ items). Compute its
       accuracy, precision, recall, and F1.</p>`,
      `<p>Accuracy $= (50+115)/200 = 165/200 = \\textbf{0.825}$. Precision $= 50/(50+25) = 50/75 \\approx
       \\textbf{0.67}$. Recall $= 50/(50+10) = 50/60 \\approx \\textbf{0.83}$. F1
       $= \\dfrac{2(0.67)(0.83)}{0.67+0.83} = \\dfrac{1.11}{1.50} \\approx \\textbf{0.74}$. Notice accuracy
       $0.83$ and F1 $0.74$ tell slightly different stories — the lower F1 reflects the modest precision.</p>`
    )}
  `;

  window.SectionContent = window.SectionContent || {};
  window.SectionContent["evaluation-practice"] = {
    title: "Practice: Evaluating a Classifier",
    html,
  };
})();
