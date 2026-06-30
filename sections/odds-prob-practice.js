/* ============================================================
   Section: Practice — Odds & Probabilities
   Registered under id "odds-prob-practice" (see manifest.js).
   Click-to-reveal practice for CONVERTING among the three frames
   of reference from the sigmoid section. FORWARD-ONLY: logit ->
   odds -> probability. The backward direction (-> logit) needs
   the log, which isn't taught yet. Pure HTML (no onMount);
   solutions via app.js.

   A small e^x reference table supplies the logit->odds values so
   students don't compute exponentials by hand; a calculator is
   still needed for the decimal division in the odds->probability
   step.

   All math is $...$; no currency $ is used (percentages are
   written as words / inside math with \%).
   ============================================================ */

(function () {
  const T = window.Toolkit;

  const html = `
    <div class="eyebrow">Probability Meets AI · Practice</div>
    <h1>Practice: Odds and Probabilities</h1>

    <p>The last section gave you three ways to describe one belief and the bridges between them.
    Now drill the conversions until they're automatic. Keep these four moves in view — every
    problem below is just one or two of them:</p>

    ${T.callout(
      `<p>
        <strong>logit → odds:</strong> $\\;\\text{odds} = e^{\\text{logit}}$<br>
        <strong>odds → probability:</strong> $\\;p = \\dfrac{\\text{odds}}{\\text{odds}+1}\\;$ &nbsp;•&nbsp;
        <strong>probability → odds:</strong> $\\;\\text{odds} = \\dfrac{p}{1-p}$
       </p>`,
      { type: "", label: "The conversions you'll need" }
    )}

    <p>Use the table below to turn a logit into odds ($e^{x}$) without working out the exponential
    yourself — then a calculator makes the division steps quick. (Going the other way, from odds
    <em>back</em> to a logit, needs the <em>log</em> function — we'll meet that in a later
    section. So every problem here runs <strong>forward</strong>: logits to odds to
    probabilities.)</p>

    <table class="dist-table">
      <thead><tr><th>Logit $x$</th><th>Odds $= e^{x}$</th></tr></thead>
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
      `<p>Turn each logit into odds: &nbsp;(a) $\\text{logit} = 2$, &nbsp;(b) $\\text{logit} = -1$,
       &nbsp;(c) $\\text{logit} = 0$.</p>`,
      `<p>Exponentiate ($\\text{odds} = e^{\\text{logit}}$), reading the table:
       (a) $e^{2} = 7.39$; &nbsp;(b) $e^{-1} = 0.37$; &nbsp;(c) $e^{0} = 1$. Notice (a) is favored
       (odds above $1$), (b) is unlikely (below $1$), and (c) is the even point.</p>`
    )}

    ${T.problem(
      `<p>Turn each set of odds into a probability: &nbsp;(a) odds $= 4$, &nbsp;(b) odds $= 0.25$.</p>`,
      `<p>Use $p = \\dfrac{\\text{odds}}{\\text{odds}+1}$:
       (a) $p = \\dfrac{4}{4+1} = \\dfrac{4}{5} = 0.8$; &nbsp;
       (b) $p = \\dfrac{0.25}{0.25+1} = \\dfrac{0.25}{1.25} = 0.2$.
       (Sanity check: odds above $1$ give $p$ above a half, odds below $1$ give $p$ below a half.)</p>`
    )}

    ${T.problem(
      `<p>Turn each probability into odds: &nbsp;(a) $p = 0.9$, &nbsp;(b) $p = 0.2$.</p>`,
      `<p>Use $\\text{odds} = \\dfrac{p}{1-p}$ ("yes over no"):
       (a) $\\dfrac{0.9}{0.1} = 9$ — nine to one for; &nbsp;
       (b) $\\dfrac{0.2}{0.8} = 0.25$ — i.e. four to one against.</p>`
    )}

    ${T.problem(
      `<p>A model outputs $\\text{logit} = 1$ for an event. Carry it all the way to a probability.</p>`,
      `<p>Two hops. First to odds: $e^{1} = 2.72$. Then to probability:
       $p = \\dfrac{2.72}{2.72+1} = \\dfrac{2.72}{3.72} \\approx 0.73$. &nbsp;(Equivalently, straight
       through the sigmoid: $p = \\dfrac{1}{1+e^{-1}} = \\dfrac{1}{1+0.37} \\approx 0.73$.)</p>`
    )}

    ${T.problem(
      `<p>A model outputs $\\text{logit} = -2$ for an event. Find the probability the event
       happens — and the probability it does <em>not</em>.</p>`,
      `<p>Forward in two hops. Odds: $e^{-2} = 0.14$. Probability:
       $p = \\dfrac{0.14}{0.14+1} = \\dfrac{0.14}{1.14} \\approx 0.12$. The chance it does
       <em>not</em> happen is the complement, $1 - 0.12 = 0.88$. (A negative logit lands below a
       half, as it should.)</p>`
    )}

    ${T.problem(
      `<p>A classifier reports $\\text{logit} = 0$. Give the odds and the probability, and say in
       plain words what the model believes.</p>`,
      `<p>Odds $= e^{0} = 1$, and $p = \\dfrac{1}{1+1} = 0.5$. The model is telling you it is
       <strong>completely undecided</strong> — a coin flip. Zero is the no-information point on
       every scale.</p>`
    )}

    ${T.problem(
      `<p>Another input scores $\\text{logit} = 3$. Estimate the probability.</p>`,
      `<p>Odds $= e^{3} = 20.1$, so $p = \\dfrac{20.1}{21.1} \\approx 0.95$ — about a
       <strong>95%</strong> chance. A logit of $3$ already means the model is quite confident.</p>`
    )}

    ${T.problem(
      `<p>Two inputs get logits $+1$ and $-1$. Without computing both from scratch, how must their
       probabilities be related?</p>`,
      `<p>Flipping the sign of the logit flips the event into its opposite, so the probabilities
       <strong>add to $1$</strong>. From earlier, $\\text{logit} = +1$ gives $p \\approx 0.73$, so
       $\\text{logit} = -1$ gives $p \\approx 0.27$. (Check: $0.73 + 0.27 = 1$.)</p>`
    )}

    ${T.problem(
      `<p>An email's logit rises from $1$ to $3$. By what factor do its <em>odds</em> grow?
       (Hint: think about what adding to an exponent does.)</p>`,
      `<p>The logit went up by $2$, and adding $2$ to the exponent multiplies the odds by $e^{2}$:
       $\\text{odds} \\times e^{2} = \\text{odds} \\times 7.39$. Check against the table: the odds go
       from $2.72$ to $20.1$, and $\\dfrac{20.1}{2.72} \\approx 7.39$. Evidence that
       <em>adds</em> on the logit scale <em>multiplies</em> on the odds scale.</p>`
    )}

    ${T.problem(
      `<p>Explain why no <em>finite</em> logit can ever give a probability of exactly $1$.</p>`,
      `<p>From $p = \\dfrac{1}{1+e^{-\\text{logit}}}$: for any finite logit, $e^{-\\text{logit}}$ is a
       positive number, so the denominator is always slightly more than $1$ and $p$ lands just
       below $1$. Only the unreachable limit $\\text{logit} \\to +\\infty$ would give exactly $1$ —
       so total certainty would take infinite evidence.</p>`
    )}

  `;

  window.SectionContent = window.SectionContent || {};
  window.SectionContent["odds-prob-practice"] = {
    title: "Practice: Odds and Probabilities",
    html,
  };
})();
