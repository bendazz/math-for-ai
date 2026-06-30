/* ============================================================
   Section: Practice — The Exponential Function
   Registered under id "exponential-practice" (see manifest.js).
   A click-to-reveal practice set reinforcing the exponential
   function section. Pure HTML (no onMount); solutions revealed
   via app.js delegation.

   Covers: evaluating powers, negative exponents, why b^0 = 1,
   classifying linear vs. exponential, building growth and decay
   formulas (base > 1 and 0 < base < 1), the ×b "next step"
   property, reading a base off points, comparing growth, and a
   few facts about e. No AI content yet, no calculus.

   Currency is written in words (KaTeX pairs $...$ within a text
   node; a stray currency $ next to math $...$ would mis-render).
   ============================================================ */

(function () {
  const T = window.Toolkit;

  const html = `
    <div class="eyebrow">Probability Meets AI · Practice</div>
    <h1>Practice: The Exponential Function</h1>

    <p>Ten problems to make the exponential function second nature. Try each one with pencil and
    paper first — most need no calculator — then reveal the worked solution. Aim to <em>explain</em>
    each answer, not just match it.</p>

    ${(T.resetProblems(), "")}

    ${T.problem(
      `<p>Evaluate without a calculator: $3^0$, &nbsp; $3^2$, &nbsp; $2^5$, &nbsp; $5^1$.</p>`,
      `<p>$3^0 = 1$ (any nonzero base to the zero power is $1$). &nbsp;
       $3^2 = 3 \\cdot 3 = 9$. &nbsp;
       $2^5 = 2\\cdot2\\cdot2\\cdot2\\cdot2 = 32$. &nbsp;
       $5^1 = 5$ (one factor of the base).</p>`
    )}

    ${T.problem(
      `<p>Evaluate the negative exponents: $2^{-1}$, &nbsp; $2^{-3}$, &nbsp; $10^{-2}$, &nbsp;
       $4^{-1}$.</p>`,
      `<p>A negative exponent means "one over the positive power":
       $2^{-1} = \\dfrac{1}{2} = 0.5$. &nbsp;
       $2^{-3} = \\dfrac{1}{2^3} = \\dfrac{1}{8} = 0.125$. &nbsp;
       $10^{-2} = \\dfrac{1}{100} = 0.01$. &nbsp;
       $4^{-1} = \\dfrac{1}{4} = 0.25$. &nbsp;
       Every answer is a positive number below $1$ — negative exponents never produce a
       negative value.</p>`
    )}

    ${T.problem(
      `<p>Use the pattern $2^3 = 8,\\ 2^2 = 4,\\ 2^1 = 2$ to explain <em>why</em> $2^0$ should
       equal $1$ (rather than $0$).</p>`,
      `<p>Reading the list downward, each step <strong>divides by the base</strong> $2$:
       $8 \\to 4 \\to 2$. Continuing the same rule, the next value is $2 \\div 2 = 1$, so
       $2^0 = 1$. Defining it any other way would break the steady pattern. The same argument
       works for any base, which is why $b^0 = 1$ for every (nonzero) $b$.</p>`
    )}

    ${T.problem(
      `<p>Classify each sequence as <strong>linear</strong> (grows by adding) or
       <strong>exponential</strong> (grows by multiplying), and give the step or base:
       <br>(a) $5, 8, 11, 14, \\ldots$ &nbsp;&nbsp; (b) $2, 6, 18, 54, \\ldots$ &nbsp;&nbsp;
       (c) $64, 32, 16, 8, \\ldots$</p>`,
      `<p>(a) <strong>Linear</strong> — each term adds $3$ (constant difference). &nbsp;
       (b) <strong>Exponential</strong> — each term is $\\times 3$ the last (base $b = 3$). &nbsp;
       (c) <strong>Exponential</strong> — each term is $\\times \\tfrac12$ the last (base
       $b = 0.5$); a base between $0$ and $1$ means it shrinks. The test: constant
       <em>difference</em> = linear, constant <em>ratio</em> = exponential.</p>`
    )}

    ${T.problem(
      `<p>A colony of bacteria starts at $3$ cells and <strong>doubles every hour</strong>.
       Write a formula for the number of cells after $x$ hours, and find the count after
       $5$ hours.</p>`,
      `<p>Doubling each hour multiplies by $2$ each step, starting from $3$:
       $\\text{cells} = 3 \\cdot 2^x$. After $5$ hours:
       $3 \\cdot 2^5 = 3 \\cdot 32 = 96$ cells. (The starting amount multiplies out front; the
       base $2$ is the growth factor.)</p>`
    )}

    ${T.problem(
      `<p>A ball is dropped from $200$ cm and bounces back to <strong>$0.6$ of its previous
       height</strong> each bounce. Write a formula for the height after $x$ bounces, and find
       the height after $3$ bounces.</p>`,
      `<p>Each bounce multiplies the height by $0.6$, starting from $200$:
       $\\text{height} = 200 \\cdot (0.6)^x$. After $3$ bounces:
       $200 \\cdot (0.6)^3 = 200 \\cdot 0.216 = 43.2$ cm. A base between $0$ and $1$ gives
       <strong>exponential decay</strong> — the same machinery as growth, just shrinking.</p>`
    )}

    ${T.problem(
      `<p>You're told $2^{10} = 1024$. Using the rule that adding $1$ to the exponent multiplies
       by the base, find $2^{11}$ and $2^{9}$ <em>without</em> recomputing from scratch.</p>`,
      `<p>$2^{11} = 2 \\cdot 2^{10} = 2 \\cdot 1024 = 2048$ (one more factor of $2$). &nbsp;
       Going the other way divides by the base: $2^{9} = \\dfrac{2^{10}}{2} = \\dfrac{1024}{2}
       = 512$. Each $\\pm 1$ in the exponent is one multiply or divide by $2$.</p>`
    )}

    ${T.problem(
      `<p>An exponential curve $y = b^x$ passes through $(0, 1)$, $(1, 4)$, and $(2, 16)$.
       What is the base $b$, what is the formula, and what is $y$ when $x = -1$?</p>`,
      `<p>From $(1, 4)$, the value at $x = 1$ is the base itself, so $b = 4$, giving
       $y = 4^x$. Check: $4^2 = 16$ matches $(2,16)$. &nbsp;
       At $x = -1$: $4^{-1} = \\dfrac{1}{4} = 0.25$. The curve stays positive and slips below $1$
       for negative $x$, just as it should.</p>`
    )}

    ${T.problem(
      `<p>Plan X starts at $0$ and <strong>adds $10$</strong> each step. Plan Y starts at $1$ and
       <strong>triples</strong> each step. Compute both after $5$ steps. Which is bigger, and what
       does the comparison illustrate?</p>`,
      `<p>Plan X (linear): $0, 10, 20, 30, 40, 50$ — after $5$ steps it's $50$. &nbsp;
       Plan Y (exponential): $1, 3, 9, 27, 81, 243$ — after $5$ steps it's $243$. &nbsp;
       Plan Y wins, $243$ to $50$. Notice Plan X was actually <em>ahead</em> early (step 1:
       $10$ vs $3$), but the exponential overtakes and then runs away — the signature of
       multiplying beating adding.</p>`
    )}

    ${T.problem(
      `<p>Recall $e \\approx 2.718$. Without a calculator, between which two whole numbers does
       $e^2$ fall? And can $e^x$ ever be zero or negative?</p>`,
      `<p>Since $e$ is a bit under $3$, $e^2$ is a bit under $9$ — and since $e$ is well above
       $2$, $e^2$ is above $4$. More precisely $e^2 \\approx 7.39$, so it falls
       <strong>between $7$ and $8$</strong>. And no: $e^x$ is built from multiplying positive
       numbers, so like every $b^x$ with $b > 0$ it is <strong>always positive</strong> — never
       zero, never negative, for any $x$.</p>`
    )}

  `;

  window.SectionContent = window.SectionContent || {};
  window.SectionContent["exponential-practice"] = {
    title: "Practice: The Exponential Function",
    html,
  };
})();
