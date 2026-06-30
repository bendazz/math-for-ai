/* ============================================================
   Section: Practice — Dot Product & Cosine Similarity
   Registered under id "dot-cosine-practice" (see manifest.js).

   Dedicated practice (per [[concept-sections-no-inline-problems]])
   for the two preceding concept sections:
     - dot-product: compute u·v, sign = alignment, perpendicular test
       (dot 0), u·u = ‖u‖², 3-D
     - cosine-similarity: compute cos-sim, the −1..1 range, length
       independence, interpretation, unit vectors → cosine = dot
   Pure HTML, no onMount — T.problem click-to-reveal. Inequalities
   avoided in math (phrased in words) to dodge raw < / > in HTML.
   No forward lead-in. No currency $.
   ============================================================ */

(function () {
  const T = window.Toolkit;

  const html = `
    <div class="eyebrow">Vectors · 8</div>
    <h1>Practice: Dot Product &amp; Cosine Similarity</h1>

    <p>Problems on the two ideas that power how AI compares meanings — the dot product and the cosine
    similarity built from it. Work each on paper, then reveal to check.</p>

    ${T.callout(
      `<p>Two reminders as you go: the dot product returns a single <em>number</em>, and cosine
       similarity is that number divided by both lengths. When a root isn't clean (like
       $\\tfrac{1}{\\sqrt{2}}$), leave it in symbolic form or round to two decimals — a calculator
       helps.</p>`,
      { type: "note", label: "Before you start" }
    )}

    ${(T.resetProblems(), "")}

    ${T.problem(
      `<p>Compute the dot products $(3,\\,2) \\cdot (5,\\,1)$ and $(2,\\,-4) \\cdot (3,\\,1)$.</p>`,
      `<p>Multiply matching components and add.
       $(3,\\,2) \\cdot (5,\\,1) = (3)(5) + (2)(1) = 15 + 2 = 17$, and
       $(2,\\,-4) \\cdot (3,\\,1) = (2)(3) + (-4)(1) = 6 - 4 = 2$.</p>`
    )}

    ${T.problem(
      `<p>Using only the <em>sign</em> of the dot product, decide whether each pair points in broadly
       the same direction, is perpendicular, or points in broadly opposite directions:
       (a) $(2,\\,3)$ and $(3,\\,-2)$; (b) $(1,\\,1)$ and $(2,\\,3)$; (c) $(1,\\,2)$ and
       $(-3,\\,-1)$.</p>`,
      `<p>(a) $(2)(3) + (3)(-2) = 6 - 6 = 0$ — <strong>perpendicular</strong>.
       (b) $(1)(2) + (1)(3) = 5$, a positive number — <strong>same general direction</strong>.
       (c) $(1)(-3) + (2)(-1) = -5$, a negative number — <strong>opposite directions</strong>.</p>`
    )}

    ${T.problem(
      `<p>For what value of $k$ is $(3,\\,k)$ perpendicular to $(2,\\,6)$?</p>`,
      `<p>Perpendicular means the dot product is zero: $(3)(2) + (k)(6) = 6 + 6k = 0$, so $6k = -6$ and
       $k = -1$. Check: $(3,\\,-1) \\cdot (2,\\,6) = 6 - 6 = 0$. &#10003;</p>`
    )}

    ${T.problem(
      `<p>Compute $(5,\\,12) \\cdot (5,\\,12)$. What does the answer tell you about the length of
       $(5,\\,12)$?</p>`,
      `<p>$(5)(5) + (12)(12) = 25 + 144 = 169$. A vector dotted with itself is its length squared, so
       $\\lVert (5,\\,12) \\rVert = \\sqrt{169} = 13$.</p>`
    )}

    ${T.problem(
      `<p>Compute the 3-D dot product $(1,\\,2,\\,2) \\cdot (2,\\,0,\\,3)$.</p>`,
      `<p>Same recipe, three terms: $(1)(2) + (2)(0) + (2)(3) = 2 + 0 + 6 = 8$.</p>`
    )}

    ${T.problem(
      `<p>Find the cosine similarity of $(1,\\,2)$ and $(2,\\,4)$. What's special about these two?</p>`,
      `<p>Dot product: $(1)(2) + (2)(4) = 10$. Lengths: $\\lVert (1,\\,2) \\rVert = \\sqrt{5}$ and
       $\\lVert (2,\\,4) \\rVert = \\sqrt{20} = 2\\sqrt{5}$, whose product is $\\sqrt{5} \\cdot
       2\\sqrt{5} = 10$. So the cosine similarity is $\\tfrac{10}{10} = 1$. They're special because
       $(2,\\,4) = 2\\,(1,\\,2)$ — same direction, so the score is a perfect $1$.</p>`
    )}

    ${T.problem(
      `<p>Find the cosine similarity of $(1,\\,0)$ and $(1,\\,1)$, and the angle between them.</p>`,
      `<p>Dot product: $(1)(1) + (0)(1) = 1$. Lengths: $\\lVert (1,\\,0) \\rVert = 1$ and
       $\\lVert (1,\\,1) \\rVert = \\sqrt{2}$. So the cosine similarity is
       $\\tfrac{1}{\\sqrt{2}} \\approx 0.71$, which is the cosine of a $45^\\circ$ angle.</p>`
    )}

    ${T.problem(
      `<p>Suppose two vectors have cosine similarity $0.8$. What is the cosine similarity of
       $3\\mathbf{u}$ and $\\mathbf{v}$? Of $-\\mathbf{u}$ and $\\mathbf{v}$?</p>`,
      `<p>Cosine similarity ignores length, so stretching $\\mathbf{u}$ to $3\\mathbf{u}$ leaves it
       <strong>unchanged at $0.8$</strong>. Flipping to $-\\mathbf{u}$ reverses the direction, which
       negates the score to <strong>$-0.8$</strong> (same alignment, opposite way).</p>`
    )}

    ${T.problem(
      `<p>Three pairs of word embeddings have cosine similarities $0.95$, $0.08$, and $-0.82$. Which
       pair is most alike? Which is essentially unrelated? Which points opposite?</p>`,
      `<p>$0.95$ is closest to $1$, so that pair is <strong>most alike</strong>. $0.08$ is close to
       $0$, so that pair is <strong>essentially unrelated</strong> (nearly perpendicular). $-0.82$ is
       close to $-1$, so that pair <strong>points in opposite directions</strong>.</p>`
    )}

    ${T.problem(
      `<p>Three (already unit-length) word vectors are $A = (0.6,\\,0.8)$, $B = (0.8,\\,0.6)$, and
       $C = (-0.6,\\,0.8)$. Since they're unit length, cosine similarity is just the dot product. Find
       the similarity of $A$ with $B$ and of $A$ with $C$. Which word is more like $A$?</p>`,
      `<p>$A \\cdot B = (0.6)(0.8) + (0.8)(0.6) = 0.48 + 0.48 = 0.96$.
       $A \\cdot C = (0.6)(-0.6) + (0.8)(0.8) = -0.36 + 0.64 = 0.28$.
       $B$ is much more like $A$ ($0.96$ versus $0.28$). With unit vectors you skip the division
       entirely — the dot product <em>is</em> the cosine similarity.</p>`
    )}

    ${T.problem(
      `<p>Let $\\mathbf{u} = (1,\\,0)$, $\\mathbf{v} = (10,\\,0)$, and $\\mathbf{w} = (2,\\,0)$. Compute
       $\\mathbf{u} \\cdot \\mathbf{v}$ and $\\mathbf{u} \\cdot \\mathbf{w}$. Do those dot products mean
       $\\mathbf{v}$ is "more similar" to $\\mathbf{u}$ than $\\mathbf{w}$ is? What do the cosine
       similarities say?</p>`,
      `<p>$\\mathbf{u} \\cdot \\mathbf{v} = 10$ and $\\mathbf{u} \\cdot \\mathbf{w} = 2$ — so the raw
       dot product is five times bigger for $\\mathbf{v}$. But all three vectors point the
       <em>exact same way</em>, so the cosine similarities are both $1$: $\\tfrac{10}{1 \\cdot 10} = 1$
       and $\\tfrac{2}{1 \\cdot 2} = 1$. The raw dot product was just rewarding $\\mathbf{v}$ for being
       <strong>longer</strong>, not more similar — which is exactly why we divide the lengths out.</p>`
    )}
  `;

  window.SectionContent = window.SectionContent || {};
  window.SectionContent["dot-cosine-practice"] = {
    title: "Practice: Dot Product & Cosine Similarity",
    html,
  };
})();
