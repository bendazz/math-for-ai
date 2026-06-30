/* ============================================================
   Section: Practice — Probability Distributions
   Registered under id "dist-practice" (see sections/manifest.js).

   Pure practice for Section 3: validity checks, finding a missing
   probability, normalizing, uniform vs. non-uniform, reading and
   DRAWING bar charts by hand, and the softmax/temperature framing.

   Visual problems use a tiny local bars() helper that emits a
   CSS bar chart (no canvas) so it renders correctly even while a
   solution is hidden. The reveal behavior is wired globally in
   app.js, so this file is otherwise just HTML — no onMount.
   ============================================================ */

(function () {
  const T = window.Toolkit;
  T.resetProblems();

  // Static CSS bar chart. items: [{label, p, v?}]. opts.scale (default 1,
  // so a probability of 1 fills the plot), opts.color ("teal"), opts.caption.
  function bars(items, opts = {}) {
    const scale = opts.scale || 1;
    const cls = opts.color ? ` ${opts.color}` : "";
    const cols = items.map((it) => {
      const hPct = Math.max(0, Math.min(1, it.p / scale)) * 100;
      const val = it.v != null ? it.v : it.p.toFixed(2);
      return `<div class="bc-col"><span class="bc-val">${val}</span>` +
             `<div class="bc-bar" style="height:${hPct}%"></div></div>`;
    }).join("");
    const labs = items.map((it) => `<span>${it.label}</span>`).join("");
    const cap = opts.caption ? `<div class="bc-caption">${opts.caption}</div>` : "";
    return `<div class="barchart${cls}"><div class="bc-plot">${cols}</div>` +
           `<div class="bc-labels">${labs}</div>${cap}</div>`;
  }

  const html = `
    <div class="eyebrow">Probability · Practice</div>
    <h1>Practice: Probability Distributions</h1>

    <p>Ten problems to make distributions second nature: checking the two rules,
    repairing bad ones by normalizing, telling uniform from non-uniform, and
    <strong>drawing and reading bar charts</strong>. As before, work each on paper
    first — there's a couple where the whole point is to sketch a picture yourself.</p>

    ${T.callout(
      `<p>For the "draw it" problems, grab paper and pencil. Put the outcomes along the
       bottom and a probability scale from $0$ to $1$ up the side, then draw one bar per
       outcome. Reveal the solution only to <em>check</em> your sketch.</p>`,
      { type: "note", label: "You'll want paper for this one" }
    )}

    <h2>Are these valid?</h2>

    ${T.problem(
      `<p>For each list, decide whether it is a valid probability distribution, and if
       not, say which rule it breaks.</p>
       <ul>
         <li><strong>A:</strong> $0.2,\\ 0.5,\\ 0.3$</li>
         <li><strong>B:</strong> $0.4,\\ 0.4,\\ 0.4$</li>
         <li><strong>C:</strong> $0.7,\\ 0.5,\\ -0.2$</li>
       </ul>`,
      `<p><strong>A — valid.</strong> Each value is in $[0,1]$ and they sum to
       $0.2+0.5+0.3 = 1$. Both rules hold.</p>
       <p><strong>B — invalid (Rule 2).</strong> Every value is fine on its own, but they
       sum to $1.2 \\ne 1$.</p>
       <p><strong>C — invalid (Rule 1).</strong> $-0.2$ is a negative probability, which is
       impossible. (It sums to $1$, but that doesn't save it.)</p>`
    )}

    ${T.problem(
      `<p>A six-sided die has these probabilities for faces 1–5:
       $0.1,\\ 0.1,\\ 0.2,\\ 0.2,\\ 0.15$. What must $P(\\text{face }6)$ be for this to be
       a valid distribution?</p>`,
      `<p>All six must add to $1$. The five known values total
       $0.1+0.1+0.2+0.2+0.15 = 0.75$.</p>
       <p>$P(6) = 1 - 0.75 = 0.25.$</p>`
    )}

    ${T.problem(
      `<p>A spinner's three regions are advertised as $A: 0.6$, $B: 0.4$, $C: 0.2$.
       These don't form a valid distribution. <strong>Normalize</strong> them (divide each
       by the total) so they do, and give the three repaired probabilities.</p>`,
      `<p>The total is $0.6 + 0.4 + 0.2 = 1.2$. Divide each by $1.2$:</p>
       <p>$A = \\tfrac{0.6}{1.2} = 0.5,\\quad B = \\tfrac{0.4}{1.2} \\approx 0.333,\\quad
          C = \\tfrac{0.2}{1.2} \\approx 0.167.$</p>
       <p>Check: $0.5 + 0.333 + 0.167 = 1.0$ ✓, and the relative sizes are unchanged
       ($A$ is still three times $C$).</p>`
    )}

    <h2>Uniform and shape</h2>

    ${T.problem(
      `<p>A fair eight-sided die (faces 1–8) is rolled. (a) What is the probability of
       each face? (b) Is the distribution uniform or non-uniform? (c) Describe what its
       bar chart looks like.</p>`,
      `<p><strong>(a)</strong> Equally likely faces: $P(\\text{each}) = \\tfrac{1}{8} = 0.125.$</p>
       <p><strong>(b)</strong> Uniform — every outcome has the same probability.</p>
       <p><strong>(c)</strong> Eight bars, all exactly the same height ($0.125$): a flat
       top. That flatness <em>is</em> what "uniform" looks like.</p>
       ${bars([1,2,3,4,5,6,7,8].map((n) => ({ label: n, p: 0.125 })),
              { caption: "Fair eight-sided die — all bars equal" })}`
    )}

    ${T.problem(
      `<p>Read this bar chart. (a) Write the distribution as a list of probabilities.
       (b) Verify it's valid. (c) Which outcome is the <em>most likely</em> (the "mode")?</p>
       ${bars([
         { label: "Red", p: 0.5 },
         { label: "Blue", p: 0.3 },
         { label: "Green", p: 0.15 },
         { label: "Gold", p: 0.05 },
       ], { caption: "Prize-wheel colors" })}`,
      `<p><strong>(a)</strong> Red $0.5$, Blue $0.3$, Green $0.15$, Gold $0.05$.</p>
       <p><strong>(b)</strong> Each is in $[0,1]$ and $0.5+0.3+0.15+0.05 = 1$ ✓.</p>
       <p><strong>(c)</strong> Red, the tallest bar at $0.5$, is the most likely outcome —
       its <em>mode</em>.</p>`
    )}

    <h2>Draw it by hand</h2>

    ${T.problem(
      `<p>A loaded four-sided die has $P(1)=0.1$, $P(2)=0.2$, $P(3)=0.3$, $P(4)=0.4$.
       <strong>Draw the bar chart by hand</strong> on a $0$-to-$1$ scale. Then check: do
       your bars climb steadily, and do the four heights add to $1$?</p>`,
      `<p>Four bars of increasing height — a staircase going up to the right. They should
       total $0.1+0.2+0.3+0.4 = 1$ ✓. Here's the answer key to compare against:</p>
       ${bars([
         { label: "1", p: 0.1 },
         { label: "2", p: 0.2 },
         { label: "3", p: 0.3 },
         { label: "4", p: 0.4 },
       ], { color: "teal", caption: "Loaded four-sided die" })}
       <p>Common slip: drawing all four bars near the top of the scale. Each height is the
       <em>probability itself</em>, so the tallest reaches only $0.4$ — well below $1$.</p>`
    )}

    ${T.problem(
      `<p>Sketch the distribution for a <strong>fair coin</strong> (outcomes Heads and
       Tails). What do the two bars look like, and what is each one's height?</p>`,
      `<p>Two equal bars, each at height $0.5$ — the simplest uniform distribution.</p>
       ${bars([
         { label: "Heads", p: 0.5 },
         { label: "Tails", p: 0.5 },
       ], { caption: "Fair coin — two bars at 0.5" })}`
    )}

    <h2>Thinking like an AI model</h2>

    ${T.problem(
      `<p>A model assigns raw scores to four next words: $A:6$, $B:3$, $C:2$, $D:1$.
       Turn these into a probability distribution by normalizing (divide each by the
       total). Which word is the model's top pick?</p>`,
      `<p>Total $= 6+3+2+1 = 12$. Divide each by $12$:</p>
       <p>$A = \\tfrac{6}{12} = 0.5,\\quad B = \\tfrac{3}{12} = 0.25,\\quad
          C = \\tfrac{2}{12} \\approx 0.167,\\quad D = \\tfrac{1}{12} \\approx 0.083.$</p>
       <p>They sum to $1$ ✓. The top pick is $A$ at $0.5$. (Real models use softmax, but
       the idea is the same: rescale raw scores into probabilities that sum to $1$.)</p>`
    )}

    ${T.problem(
      `<p>Below are two distributions a model might produce for the <em>same</em> four
       words. One came from a <strong>low</strong> temperature setting (sharp, confident)
       and one from a <strong>high</strong> temperature (flattened, more random). Which is
       which — and which one is more likely to produce a surprising word?</p>
       <div style="display:flex; gap:24px; flex-wrap:wrap">
         <div style="flex:1; min-width:200px">
           ${bars([
             { label: "A", p: 0.85 },
             { label: "B", p: 0.08 },
             { label: "C", p: 0.04 },
             { label: "D", p: 0.03 },
           ], { caption: "Distribution X" })}
         </div>
         <div style="flex:1; min-width:200px">
           ${bars([
             { label: "A", p: 0.3 },
             { label: "B", p: 0.28 },
             { label: "C", p: 0.22 },
             { label: "D", p: 0.2 },
           ], { color: "teal", caption: "Distribution Y" })}
         </div>
       </div>`,
      `<p><strong>X</strong> is the <em>low</em>-temperature one: it's spiky, dumping
       $0.85$ on word $A$ — high confidence. <strong>Y</strong> is the <em>high</em>-temperature
       one: nearly flat, almost uniform.</p>
       <p>Y is far more likely to produce a surprising word: words $B$, $C$, $D$ together
       hold $0.7$ of the probability, so the model will often wander off the top choice.
       Higher temperature flattens the bars toward uniform and makes output more varied;
       lower temperature sharpens them toward the single best word.</p>`
    )}

    ${T.problem(
      `<p>A weather model gives: sunny $0.55$, cloudy $0.25$, rainy $0.20$. (a) Is this a
       valid distribution? (b) What is $P(\\text{not sunny})$? (c) What's the mode?</p>`,
      `<p><strong>(a)</strong> Each value is in $[0,1]$ and $0.55+0.25+0.20 = 1$ — valid ✓.</p>
       <p><strong>(b)</strong> $P(\\text{not sunny}) = 1 - 0.55 = 0.45$ (the complement
       shortcut), which matches $0.25 + 0.20$.</p>
       <p><strong>(c)</strong> Sunny, at $0.55$, is the most likely outcome — the mode.</p>`
    )}

    ${T.callout(
      `<p>Reading a bar chart, checking it sums to $1$, spotting the mode, normalizing raw
       scores, telling a confident (spiky) distribution from an unsure (flat) one — these
       are the everyday moves for reasoning about <em>any</em> model's output. You've now
       practiced all of them on dice, coins, and prize wheels; the AI version is the same
       picture with more bars.</p>`,
      { type: "ai" }
    )}

    <h2>Key reminders</h2>
    <ul>
      <li>Valid distribution = every bar in $[0,1]$ <em>and</em> all heights sum to $1$.</li>
      <li>A missing probability is whatever makes the total reach $1$.</li>
      <li><strong>Normalize</strong> a bad set by dividing each value by its total — relative sizes stay put.</li>
      <li>Uniform = all bars equal height; the <strong>mode</strong> is the tallest bar.</li>
      <li>When drawing, each bar's height is the probability itself — most bars sit well below $1$.</li>
    </ul>
  `;

  window.SectionContent = window.SectionContent || {};
  window.SectionContent["dist-practice"] = {
    title: "Practice: Probability Distributions",
    html,
  };
})();
