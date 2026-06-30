/* ============================================================
   Section: Practice — Softmax
   Registered under id "softmax-practice" (see manifest.js).
   Click-to-reveal drills for the softmax section: computing a
   softmax by hand (exponentiate + normalize) and reasoning about
   its properties (sums to 1, keeps ranking, exaggerates the
   leader, ONLY DIFFERENCES MATTER, sigmoid = 2-option case).

   Forward-only and log-free (softmax never needs the log). An
   e^x reference table supplies the exponentials; a calculator
   handles the division in the normalize step.

   Pure HTML (no onMount); solutions via app.js delegation.
   Sets are written with literal braces in plain text; all other
   math is $...$. No currency $ (percentages in words).
   No forward lead-in at the end (per no-forward-leadins).
   ============================================================ */

(function () {
  const T = window.Toolkit;

  const html = `
    <div class="eyebrow">Probability Meets AI · Practice</div>
    <h1>Practice: Softmax</h1>

    <p>Time to make softmax automatic. Remember the whole recipe is just two moves:
    <strong>exponentiate</strong> every logit, then <strong>normalize</strong> (divide each by the
    total):</p>

    ${T.callout(
      `<p>$$P_i = \\frac{e^{z_i}}{\\sum_j e^{z_j}} = \\frac{e^{z_i}}{e^{z_1} + e^{z_2} + \\cdots + e^{z_k}}$$</p>`,
      { type: "", label: "The softmax formula" }
    )}

    <p>Use this table for the exponentials; a calculator is handy for the division step. (Every
    problem runs <strong>forward</strong> — logits to probabilities — so no logs are needed.)</p>

    <table class="dist-table">
      <thead><tr><th>Logit $z$</th><th>Weight $e^{z}$</th></tr></thead>
      <tbody>
        <tr><td>$-3$</td><td>0.05</td></tr>
        <tr><td>$-2$</td><td>0.14</td></tr>
        <tr><td>$-1$</td><td>0.37</td></tr>
        <tr><td>$0$</td><td>1.00</td></tr>
        <tr><td>$+1$</td><td>2.72</td></tr>
        <tr><td>$+2$</td><td>7.39</td></tr>
        <tr><td>$+3$</td><td>20.1</td></tr>
      </tbody>
    </table>

    ${(T.resetProblems(), "")}

    ${T.problem(
      `<p>Two options have logits $1$ and $0$. Compute the softmax distribution.</p>`,
      `<p>Exponentiate: $e^{1} = 2.72$ and $e^{0} = 1$. Total $= 3.72$. Divide:
       $P = \\left[\\dfrac{2.72}{3.72},\\ \\dfrac{1}{3.72}\\right] = [0.73,\\ 0.27]$. &nbsp;
       (Notice this is $\\sigma(1) = 0.73$ — with two options, softmax <em>is</em> the sigmoid.)</p>`
    )}

    ${T.problem(
      `<p>Three words have logits $2$, $1$, and $0$. Find the softmax probabilities.</p>`,
      `<p>Weights: $e^{2} = 7.39$, $e^{1} = 2.72$, $e^{0} = 1$. Total $= 11.11$. Divide each:
       $P = [0.67,\\ 0.24,\\ 0.09]$. Check that they sum to $1.00$ — they must, because that's what
       the normalize step guarantees.</p>`
    )}

    ${T.problem(
      `<p>Three options all have the <em>same</em> logit (say all $2$). What distribution does
       softmax give, and what does it say about the model?</p>`,
      `<p>Equal scores give equal weights ($e^{2} = 7.39$ each), total $22.17$, so each probability
       is $\\dfrac{7.39}{22.17} = \\dfrac{1}{3} \\approx 0.33$ — a <strong>uniform</strong>
       distribution. Equal logits mean the model has <strong>no preference</strong>: maximally
       unsure, the flat shape. (The common value doesn't matter — all-$0$ or all-$100$ also give
       thirds.)</p>`
    )}

    ${T.problem(
      `<p>Without recomputing from scratch, argue that the logits {5, 4, 3} produce the
       <em>same</em> distribution as {2, 1, 0}.</p>`,
      `<p>Subtract $3$ from each score in {5, 4, 3} and you get {2, 1, 0}. Softmax depends
       <strong>only on the differences</strong> between logits, and both sets have the identical
       gaps ($1$ between neighbors). Adding the same constant to every logit cancels out, so both
       give $[0.67,\\ 0.24,\\ 0.09]$.</p>`
    )}

    ${T.problem(
      `<p>Which of these two-option logit sets produce the <em>same</em> softmax distribution?
       &nbsp;(a) {2, 0} &nbsp;(b) {5, 3} &nbsp;(c) {2, 1}</p>`,
      `<p>Only the <strong>difference</strong> matters. (a) has gap $2$, (b) has gap $2$, (c) has
       gap $1$. So <strong>(a) and (b) match</strong> (both give about $[0.88,\\ 0.12]$); (c) is
       different (about $[0.73,\\ 0.27]$).</p>`
    )}

    ${T.problem(
      `<p>Word A's logit is $2$ higher than word B's. How many times more probable is A than B
       under softmax?</p>`,
      `<p>The ratio of two softmax probabilities is
       $\\dfrac{P_A}{P_B} = \\dfrac{e^{z_A}}{e^{z_B}} = e^{z_A - z_B}$. With a gap of $2$, that's
       $e^{2} \\approx 7.39$ — A is about <strong>7.4 times</strong> as probable. (A gap of just
       $1$ already makes it $e \\approx 2.72$ times as likely. The exponential exaggerates leads.)</p>`
    )}

    ${T.problem(
      `<p>Before computing anything: among a set of logits, can softmax ever make a
       <em>lower</em>-scoring word come out more probable than a higher-scoring one?</p>`,
      `<p>No. $e^{z}$ is an increasing function, so a bigger logit always becomes a bigger weight,
       and dividing every weight by the same total can't change which is largest. Softmax
       <strong>never reorders</strong> the options — it only sets the bar heights. The top logit is
       always the top probability.</p>`
    )}

    ${T.problem(
      `<p>A classmate says their softmax output is $[0.5,\\ 0.4,\\ 0.2]$. Without seeing the logits,
       how do you know they made a mistake?</p>`,
      `<p>Those add to $1.1$, not $1$. Every softmax output is a genuine probability distribution —
       the normalize step <em>forces</em> the values to sum to exactly $1$. Anything that doesn't
       can't be a softmax result, so there's an arithmetic slip somewhere.</p>`
    )}

    ${T.problem(
      `<p>Two options have logits $3$ and $1$. Find the probability of the first — and explain why
       it matches the answer for logits $2$ and $0$.</p>`,
      `<p>Weights $e^{3} = 20.1$ and $e^{1} = 2.72$, total $22.82$, so
       $P_{\\text{first}} = \\dfrac{20.1}{22.82} \\approx 0.88$. It matches {2, 0} because the
       <strong>difference is the same</strong> ($3 - 1 = 2 - 0 = 2$), and softmax only sees
       differences. Both also equal $\\sigma(2) = 0.88$ — the two-option softmax is the sigmoid of
       the gap.</p>`
    )}

    ${T.problem(
      `<p>A model's vocabulary has $50{,}000$ words. If it gives every word the same logit, what is
       the probability of each word? And to make one word almost certain, what has to be true of
       its logit?</p>`,
      `<p>Equal logits give a uniform distribution: each word gets $\\dfrac{1}{50{,}000} = 0.00002$
       — the model is completely undecided. To make one word dominate, its logit must be
       <strong>much larger</strong> than all the others. Because the exponential exaggerates gaps,
       even a lead of a few points sends almost all the probability to that one word (a very spiky
       distribution).</p>`
    )}
  `;

  window.SectionContent = window.SectionContent || {};
  window.SectionContent["softmax-practice"] = {
    title: "Practice: Softmax",
    html,
  };
})();
