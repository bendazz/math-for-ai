/* ============================================================
   Section: Practice — Vector Arithmetic & Length
   Registered under id "vector-practice" (see manifest.js).

   Dedicated practice section (per [[concept-sections-no-inline-problems]])
   drilling the two preceding concept sections:
     - vector-arithmetic: scaling, addition, subtraction, averaging /
       mean pooling
     - vector-magnitude: length via Pythagoras, the ‖cv‖=|c|‖v‖ rule,
       normalizing / unit vectors
   Pure HTML, no onMount — T.problem click-to-reveal (revealed via
   delegation in app.js). Mirrors prob-practice / softmax-practice.
   Magnitudes chosen mostly clean (3-4-5, 5-12-13, 6-8-10, 1-2-2) with
   one deliberate non-clean root to practice leaving/approximating it.
   No forward lead-in. No currency $.
   ============================================================ */

(function () {
  const T = window.Toolkit;

  const html = `
    <div class="eyebrow">Vectors · 5</div>
    <h1>Practice: Vector Arithmetic &amp; Length</h1>

    <p>A mixed set covering everything from the last two sections — scaling, adding, subtracting, and
    averaging vectors, plus measuring their length and normalizing them. Work each one on paper, then
    reveal the solution to check.</p>

    ${T.callout(
      `<p>Some lengths come out to whole numbers; others don't. When a square root isn't clean, it's
       fine to <strong>leave it in $\\sqrt{\\;}$ form</strong> and then give a two-decimal
       approximation — a calculator makes that quick.</p>`,
      { type: "note", label: "Before you start" }
    )}

    ${(T.resetProblems(), "")}

    ${T.problem(
      `<p>Scale each vector: compute $4\\,(-1,\\,3)$ and $-2\\,(2,\\,-5)$.</p>`,
      `<p>Multiply every component by the scalar.
       $4\\,(-1,\\,3) = (-4,\\,12)$ and $-2\\,(2,\\,-5) = (-4,\\,10)$.</p>`
    )}

    ${T.problem(
      `<p>Compute $(3,\\,-2) + (-1,\\,5)$ and $(4,\\,1) - (6,\\,-2)$.</p>`,
      `<p>Add or subtract matching components.
       $(3,\\,-2) + (-1,\\,5) = (2,\\,3)$ and
       $(4,\\,1) - (6,\\,-2) = (4-6,\\ 1-(-2)) = (-2,\\,3)$.</p>`
    )}

    ${T.problem(
      `<p>Let $\\mathbf{u} = (2,\\,-1)$ and $\\mathbf{v} = (1,\\,4)$. Compute $3\\mathbf{u} -
       2\\mathbf{v}$.</p>`,
      `<p>Scale first, then subtract. $3\\mathbf{u} = (6,\\,-3)$ and $2\\mathbf{v} = (2,\\,8)$, so
       $3\\mathbf{u} - 2\\mathbf{v} = (6-2,\\ -3-8) = (4,\\,-11)$.</p>`
    )}

    ${T.problem(
      `<p>Find the average of $(-2,\\,6)$ and $(4,\\,2)$. Where does that point sit relative to the
       two?</p>`,
      `<p>Add and scale by $\\tfrac12$:
       $\\tfrac12\\big((-2,\\,6) + (4,\\,2)\\big) = \\tfrac12\\,(2,\\,8) = (1,\\,4)$. It sits exactly
       at the <strong>midpoint</strong> between the two tips.</p>`
    )}

    ${T.problem(
      `<p>A three-word phrase has embeddings (shrunk to 2-D) $(2,\\,-2)$, $(0,\\,4)$, and $(1,\\,1)$.
       Mean-pool them into one phrase vector.</p>`,
      `<p>Add them up, then divide by $3$.
       $(2,\\,-2) + (0,\\,4) + (1,\\,1) = (3,\\,3)$, and $\\tfrac13\\,(3,\\,3) = (1,\\,1)$.</p>`
    )}

    ${T.problem(
      `<p>Find the lengths $\\lVert (6,\\,8) \\rVert$ and $\\lVert (5,\\,12) \\rVert$.</p>`,
      `<p>Square, add, square-root.
       $\\lVert (6,\\,8) \\rVert = \\sqrt{36 + 64} = \\sqrt{100} = 10$ and
       $\\lVert (5,\\,12) \\rVert = \\sqrt{25 + 144} = \\sqrt{169} = 13$.</p>`
    )}

    ${T.problem(
      `<p>Find $\\lVert (2,\\,3) \\rVert$. Leave it as a square root, then give a two-decimal
       approximation.</p>`,
      `<p>$\\lVert (2,\\,3) \\rVert = \\sqrt{2^{\\,2} + 3^{\\,2}} = \\sqrt{4 + 9} = \\sqrt{13} \\approx
       3.61$. Not every vector has a whole-number length — most don't.</p>`
    )}

    ${T.problem(
      `<p>Find the length of the 3-D vector $(1,\\,2,\\,2)$.</p>`,
      `<p>Same rule, one more squared term:
       $\\lVert (1,\\,2,\\,2) \\rVert = \\sqrt{1^{\\,2} + 2^{\\,2} + 2^{\\,2}} = \\sqrt{1 + 4 + 4} =
       \\sqrt{9} = 3$.</p>`
    )}

    ${T.problem(
      `<p>Suppose $\\lVert \\mathbf{v} \\rVert = 10$. <em>Without</em> knowing $\\mathbf{v}$'s
       components, find $\\lVert 3\\mathbf{v} \\rVert$ and $\\lVert -2\\mathbf{v} \\rVert$.</p>`,
      `<p>Use $\\lVert c\\,\\mathbf{v} \\rVert = |c|\\,\\lVert \\mathbf{v} \\rVert$.
       $\\lVert 3\\mathbf{v} \\rVert = 3 \\cdot 10 = 30$, and
       $\\lVert -2\\mathbf{v} \\rVert = |-2| \\cdot 10 = 20$ — the negative sign flips the direction
       but doesn't change the length.</p>`
    )}

    ${T.problem(
      `<p>Find the unit vector pointing the same way as $(3,\\,4)$. Then do the same for $(0,\\,-5)$.</p>`,
      `<p>Divide each vector by its own length. $\\lVert (3,\\,4) \\rVert = 5$, so the unit vector is
       $\\tfrac15\\,(3,\\,4) = (0.6,\\,0.8)$. And $\\lVert (0,\\,-5) \\rVert = 5$, so its unit vector is
       $\\tfrac15\\,(0,\\,-5) = (0,\\,-1)$. Both now have length $1$.</p>`
    )}

    ${T.problem(
      `<p>Let $\\mathbf{u} = (3,\\,0)$ and $\\mathbf{v} = (0,\\,4)$. Is $\\lVert \\mathbf{u} +
       \\mathbf{v} \\rVert$ the same as $\\lVert \\mathbf{u} \\rVert + \\lVert \\mathbf{v} \\rVert$?</p>`,
      `<p><strong>No.</strong> $\\lVert \\mathbf{u} \\rVert = 3$ and $\\lVert \\mathbf{v} \\rVert = 4$,
       so the sum of the lengths is $7$. But $\\mathbf{u} + \\mathbf{v} = (3,\\,4)$, whose length is
       $\\sqrt{9 + 16} = 5$, not $7$. The length of a sum is generally <em>not</em> the sum of the
       lengths — they only match when the two vectors point the exact same way. In general
       $\\lVert \\mathbf{u} + \\mathbf{v} \\rVert \\le \\lVert \\mathbf{u} \\rVert + \\lVert
       \\mathbf{v} \\rVert$ (the "triangle inequality" — a detour is never shorter than the straight
       path).</p>`
    )}
  `;

  window.SectionContent = window.SectionContent || {};
  window.SectionContent["vector-practice"] = {
    title: "Practice: Vector Arithmetic & Length",
    html,
  };
})();
