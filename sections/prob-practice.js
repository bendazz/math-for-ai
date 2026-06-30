/* ============================================================
   Section: Practice — Basic Probability
   Registered under id "prob-practice" (see sections/manifest.js).

   A pure-practice section: no widgets, just ten problems with
   click-to-reveal worked solutions. The reveal behavior is wired
   globally in app.js, so this file is only HTML — no onMount.

   These reinforce Section 1: equally-likely counting, the 0-to-1
   scale, "everything adds to 1," and the complement ("1 - P")
   shortcut. A few carry the same AI framing used in the intro.
   ============================================================ */

(function () {
  const T = window.Toolkit;
  T.resetProblems();

  const html = `
    <div class="eyebrow">Probability · Practice</div>
    <h1>Practice: Basic Probability</h1>

    <p>Here are ten problems to build fluency with the ideas from
    <em>What Is Probability?</em> — counting equally likely outcomes, keeping
    answers on the $0$-to-$1$ scale, using the fact that all the possibilities
    add to $1$, and the handy <em>complement</em> shortcut $P(\\text{not }E) = 1 - P(E)$.</p>

    ${T.callout(
      `<p>Try each one on paper <strong>before</strong> you press <em>Show solution</em>.
       Getting it wrong first is part of how this sticks — the worked answer will mean
       far more once you've already wrestled with the question.</p>`,
      { type: "note", label: "How to use this" }
    )}

    <h2>Warm-ups</h2>

    ${T.problem(
      `<p>A fair die is rolled once. What is the probability of rolling a number
       <strong>less than 3</strong>?</p>`,
      `<p>The faces less than $3$ are $1$ and $2$ — that's $2$ favorable outcomes out
       of $6$ equally likely faces.</p>
       <p>$P(\\text{less than }3) = \\dfrac{2}{6} = \\dfrac{1}{3} \\approx 0.33.$</p>`
    )}

    ${T.problem(
      `<p>A bag holds $4$ red, $1$ blue, and $5$ yellow marbles. You draw one without
       looking. What is $P(\\text{yellow})$? Give your answer as a fraction and a decimal.</p>`,
      `<p>There are $4 + 1 + 5 = 10$ equally likely marbles, and $5$ of them are yellow.</p>
       <p>$P(\\text{yellow}) = \\dfrac{5}{10} = \\dfrac{1}{2} = 0.5.$</p>`
    )}

    ${T.problem(
      `<p>From a standard deck of $52$ cards you draw one at random. What is the
       probability it is a <strong>face card</strong> (a Jack, Queen, or King)?</p>`,
      `<p>Each of the four suits has $3$ face cards, so there are $4 \\times 3 = 12$
       face cards in all.</p>
       <p>$P(\\text{face card}) = \\dfrac{12}{52} = \\dfrac{3}{13} \\approx 0.23.$</p>`
    )}

    <h2>Using the complement</h2>

    ${T.problem(
      `<p>A fair die is rolled once. What is the probability of <strong>not</strong>
       rolling a $6$? Solve it two ways.</p>`,
      `<p><strong>Direct count.</strong> The faces that aren't a $6$ are $1,2,3,4,5$ —
       five outcomes out of six: $\\dfrac{5}{6} \\approx 0.83.$</p>
       <p><strong>Complement shortcut.</strong> $P(\\text{not }6) = 1 - P(6) = 1 - \\dfrac{1}{6}
       = \\dfrac{5}{6}.$ Same answer, less counting — that's the point of the shortcut.</p>`
    )}

    ${T.problem(
      `<p>The probability that a flight leaves on time is $0.85$. What is the probability
       it does <strong>not</strong> leave on time?</p>`,
      `<p>"On time" and "not on time" are the only two possibilities and they can't both
       happen, so their probabilities add to $1$.</p>
       <p>$P(\\text{not on time}) = 1 - 0.85 = 0.15.$</p>`
    )}

    <h2>Adding to 1</h2>

    ${T.problem(
      `<p>A spinner is split into three colored regions. The maker says
       $P(\\text{red}) = 0.5$ and $P(\\text{green}) = 0.2$, and the only other color is
       blue. What must $P(\\text{blue})$ be?</p>`,
      `<p>The three colors are the only possibilities and don't overlap, so all three
       probabilities add to $1$.</p>
       <p>$P(\\text{blue}) = 1 - 0.5 - 0.2 = 0.3.$</p>`
    )}

    ${T.problem(
      `<p>A weather model claims: sunny $0.5$, cloudy $0.3$, rainy $0.3$. Without knowing
       anything about the weather, how can you tell these numbers are <strong>wrong</strong>?</p>`,
      `<p>They cover all the possibilities and don't overlap, so they should add to exactly
       $1$. But $0.5 + 0.3 + 0.3 = 1.1 > 1$. A set of probabilities that sums to more than
       $1$ (or less than $1$) can't describe a complete set of outcomes — something has been
       miscounted or double-counted.</p>`
    )}

    <h2>A little more counting</h2>

    ${T.problem(
      `<p>You roll a fair die once. What is the probability of rolling a number that is
       <strong>even or greater than 3</strong>?</p>`,
      `<p>List the faces that qualify. Even faces: $2, 4, 6$. Faces greater than $3$:
       $4, 5, 6$. Pooling them — and counting each face only <em>once</em> — gives
       $\\{2, 4, 5, 6\\}$, which is $4$ faces.</p>
       <p>$P = \\dfrac{4}{6} = \\dfrac{2}{3} \\approx 0.67.$</p>
       <p><em>Watch out:</em> $4$ and $6$ are both even <strong>and</strong> greater than $3$.
       If you'd counted $3 + 3 = 6$ outcomes you'd have counted them twice.</p>`
    )}

    ${T.problem(
      `<p>A deck has $52$ cards: $26$ red and $26$ black. You draw one card. What is the
       probability it is a red card <strong>or</strong> a Jack? (There are $4$ Jacks: two
       red, two black.)</p>`,
      `<p>Start with the $26$ red cards. Among the $4$ Jacks, the two <em>red</em> Jacks are
       already in that count, so they'd be double-counted — only the two <em>black</em> Jacks
       are new. That's $26 + 2 = 28$ favorable cards.</p>
       <p>$P(\\text{red or Jack}) = \\dfrac{28}{52} = \\dfrac{7}{13} \\approx 0.54.$</p>`
    )}

    <h2>Thinking like an AI model</h2>

    ${T.problem(
      `<p>A language model is choosing the next word and reports these candidates:
       <em>"dog"</em> $0.4$, <em>"cat"</em> $0.35$, <em>"bird"</em> $0.15$, and one
       remaining option <em>"fish"</em>. (a) What probability must it assign to
       <em>"fish"</em>? (b) If the model simply always picks the single most likely word,
       which word does it output?</p>`,
      `<p><strong>(a)</strong> The candidate probabilities must add to $1$, so
       $P(\\text{fish}) = 1 - (0.4 + 0.35 + 0.15) = 1 - 0.9 = 0.1.$</p>
       <p><strong>(b)</strong> The largest probability is $0.4$, for <em>"dog"</em>, so a
       "always take the top choice" strategy outputs <strong>dog</strong>. (Turning up the
       model's <em>temperature</em> would let it sometimes pick <em>cat</em> or the rarer
       words instead — that's how you trade safety for variety.)</p>`
    )}

    ${T.callout(
      `<p>Every problem above is the same machinery a model uses when it scores its next
       word: a list of outcomes, each with a number between $0$ and $1$, all adding to $1$.
       Master the dice-and-marbles version and you've already understood the shape of what's
       happening inside the AI.</p>`,
      { type: "ai" }
    )}

    <h2>Key reminders</h2>
    <ul>
      <li>Every probability lands between $0$ and $1$ — if you get a negative number or something above $1$, recheck your counting.</li>
      <li>For equally likely outcomes, $P(E) = \\dfrac{\\text{favorable}}{\\text{total}}$.</li>
      <li>When outcomes cover every possibility without overlapping, their probabilities add to $1$.</li>
      <li>The complement shortcut $P(\\text{not }E) = 1 - P(E)$ often saves work.</li>
      <li>In an "$A$ or $B$" count, don't double-count outcomes that are in both.</li>
    </ul>
  `;

  window.SectionContent = window.SectionContent || {};
  window.SectionContent["prob-practice"] = {
    title: "Practice: Basic Probability",
    html,
  };
})();
