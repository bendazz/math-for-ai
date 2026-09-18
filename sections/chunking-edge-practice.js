/* ============================================================
   Section: Practice — Chunking Edge Cases (Split Text)
   Registered under id "chunking-edge-practice" (see manifest.js).
   Fifth section of the "Embeddings" group; sits right after
   chunking-practice.

   Written at the instructor's request after working through the
   first set. It drills the two places people slip, and nothing else:
     1. WHEN A SEPARATOR COUNTS. Only between two atoms that are both
        in the buffer. A lone carried atom has none; popping an atom
        takes its separator with it; the separator that joins the
        carried atoms to the next atom is charged when that atom is
        added, not in the overlap test. (Problems 1-3.)
     2. CHUNK SIZE WINS. The pop loop also runs while the incoming
        atom would not fit beside what is left, so a tail that passes
        the overlap test can still be dropped. (Problems 4-6.)
   Problem 7 is a spot-the-mistake on idea 2, exam-shaped.

   DELIBERATE TWIN of the Intro-to-AI-Applications section of the
   same name: same two ideas, same vocabulary, but NOT ONE document
   or setting is shared, so students in both courses get extra
   practice. (That set's spot-the-mistake is on idea 1; this one's
   is on idea 2.)

   VERIFIED: every atom length, buffer total, pop and chunk below was
   produced by an instrumented copy of langchain's _merge_splits and
   asserted equal to the REAL CharacterTextSplitter output (Langflow
   Desktop venv, keep_separator=False) on the exact strings quoted.
   Do not adjust a number here without re-running it.

   NO KaTeX in this section, same as chunking-practice. The only "$"
   is inside the helper's /\n$/ regex. Inequalities are written in
   words. No forward lead-in.
   ============================================================ */

(function () {
  const T = window.Toolkit;

  /* Same helper as chunking-practice: a sample document with a computed
     character count beside every line (separator excluded). */
  const chunkDoc = (raw) => {
    const lines = raw.replace(/^\n/, "").replace(/\n$/, "").split("\n");
    const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const row = (a, b, extra) =>
      `<div style="display:flex;justify-content:space-between;gap:18px;padding:3px 12px;${extra || ""}">
         <span>${a}</span><span style="opacity:.55;font-variant-numeric:tabular-nums">${b}</span>
       </div>`;
    return `<div style="border:1px solid var(--line);border-radius:8px;overflow:hidden;margin:14px 0;
                        font-family:var(--font-mono);font-size:.85rem;line-height:1.6">
      ${row("", "chars", "border-bottom:1px solid var(--line);opacity:.7;font-size:.75rem;padding-bottom:5px")}
      ${lines.map((l) => row(esc(l) || "&nbsp;", l.length || "")).join("")}
    </div>`;
  };

  const html = `
    <div class="eyebrow">Embeddings · 5</div>
    <h1>Practice: Chunking Edge Cases</h1>

    <p>Same algorithm as the previous practice set. These problems aim at the two places where careful
    people still slip: <strong>when to count the separator</strong>, and <strong>what happens when the
    overlap and the Chunk Size disagree</strong>.</p>

    <p>Every number below is real: these are the chunks Langflow actually produces.</p>

    ${T.callout(
      `<strong>1. When does a separator count?</strong> Only <em>between</em> two atoms that are both in
       the buffer.
       <ul>
         <li>A buffer holding one atom holds <strong>no</strong> separator.</li>
         <li>When you pop an atom off the front, its separator leaves with it.</li>
         <li>The separator that will join the carried atoms to the next atom is not part of the overlap.
         It is counted when that next atom is added.</li>
         <li>With Separator <code>\\n\\n</code>, each separator counts as <strong>2</strong>.</li>
       </ul>
       <strong>2. Chunk Size wins.</strong> After emitting a chunk, pop atoms off the front while the
       buffer is bigger than Chunk Overlap — <strong>or while the next atom still would not fit</strong>
       beside what is left. Overlap is a limit on how much <em>may</em> carry, not a promise that
       anything will.`,
      { type: "note", label: "The two ideas" }
    )}

    ${(T.resetProblems(), "")}

    ${T.problem(
      `<strong>One seam carries, one does not.</strong> Separator <code>\\n</code>, Chunk Size
       <strong>36</strong>, Chunk Overlap <strong>15</strong>.
       ${chunkDoc(`Rake the beds.
Pull the weeds.
Turn the compost.
Water the tomatoes.`)}
       Give the chunks, and say what each chunk shares with the one before it.`,
      `<p>Atoms: 14, 15, 17, 19.</p>
       <p>Buffer 14 → 14 + 15 + 1 = 30. Atom 3 would make 30 + 17 + 1 = 48, over 36.
       <strong>Emit chunk 1 = 30.</strong></p>
       <p>Pop while over 15: drop atom 1 — and the newline that joined it to atom 2 — so
       30 − 14 − 1 = <strong>15</strong>. Stop: 15 is not over 15. Atom 2 is alone in the buffer, so
       there is no newline left to count. The carried size is 15, not 16.</p>
       <p>Add atom 3: 15 + 1 + 17 = 33. <em>That</em> +1 is the newline between "Pull the weeds." and
       "Turn the compost." — counted now, as the buffer grows.</p>
       <p>Atom 4 would make 33 + 19 + 1 = 53, over 36. <strong>Emit chunk 2 = 33.</strong> Pop: drop
       atom 2 → 33 − 15 − 1 = 17. That is over 15, so atom 3 goes too → 0.</p>
       <p>Add atom 4: 19. End. <strong>Emit chunk 3 = 19.</strong></p>
       <p><strong>Three chunks: 30, 33, 19.</strong> Chunk 2 shares "Pull the weeds." with chunk 1;
       chunk 3 shares nothing. A 15-character line fits an overlap of 15 exactly; a 17-character line
       does not.</p>`
    )}

    ${T.problem(
      `<strong>Two lines that look like they fit.</strong> Separator <code>\\n</code>, Chunk Size
       <strong>55</strong>, Chunk Overlap <strong>20</strong>.
       ${chunkDoc(`The bus leaves at eight.
Pack light
Dress warm
Lunch is at the science museum.`)}
       The two short lines are 10 characters each, and the overlap is 20. Do both of them carry into
       the second chunk?`,
      `<p>Atoms: 24, 10, 10, 31.</p>
       <p>Buffer 24 → 35 → 46. Atom 4 would make 46 + 31 + 1 = 78, over 55.
       <strong>Emit chunk 1 = 46.</strong></p>
       <p>Pop while over 20: drop atom 1 → 46 − 24 − 1 = <strong>21</strong>. Still over 20. The two
       lines are 10 + 10 = 20, but they are both in the buffer, so the newline <em>between</em> them
       counts: 10 + 1 + 10 = 21. Drop atom 2 → 10. Stop.</p>
       <p>Add atom 4: 10 + 1 + 31 = 42. End. <strong>Emit chunk 2 = 42.</strong></p>
       <p><strong>Two chunks: 46 and 42. Only one line carries, not two.</strong></p>
       <p>Compare with the previous problem. There, one carried line with nothing beside it had no
       separator. Here, two carried lines have one separator between them, and that single character is
       what tips 20 into 21.</p>`
    )}

    ${T.problem(
      `<strong>A separator worth two.</strong> Separator <code>\\n\\n</code>, Chunk Size
       <strong>60</strong>, Chunk Overlap <strong>33</strong>. Four one-line paragraphs with blank
       lines between them:
       ${chunkDoc(`Choir is Tuesday.

Sing the scales.

Learn the alto part.

Stay for notes.`)}
       Give the chunks. How many paragraphs does chunk 2 share with chunk 1?`,
      `<p>Atoms: 17, 16, 20, 15. The blank lines are the separators, and each one is
       <strong>two</strong> characters (two newlines).</p>
       <p>Buffer 17 → 17 + 16 + 2 = 35 → 35 + 20 + 2 = 57. Atom 4 would make 57 + 15 + 2 = 74, over
       60. <strong>Emit chunk 1 = 57.</strong></p>
       <p>Pop while over 33: drop atom 1 → 57 − 17 − 2 = 38. Still over 33 (16 + 2 + 20). Drop atom 2 →
       20. Stop.</p>
       <p>Add atom 4: 20 + 2 + 15 = 37. End. <strong>Emit chunk 2 = 37.</strong></p>
       <p><strong>Two chunks: 57 and 37, sharing one paragraph.</strong></p>
       <p>Notice the two-character separator on both sides of the work: it is subtracted when atom 1
       leaves (− 2) and added when atom 4 arrives (+ 2).</p>`
    )}

    ${T.problem(
      `<strong>Fits the overlap, but not the chunk.</strong> Separator <code>\\n</code>, Chunk Size
       <strong>55</strong>, Chunk Overlap <strong>15</strong>.
       ${chunkDoc(`Permission slips due.
Bring a coat.
Students must stay with a chaperone at all times.`)}
       Give the chunks. Does "Bring a coat." appear twice?`,
      `<p>Atoms: 21, 13, 49.</p>
       <p>Buffer 21 → 35. Atom 3 would make 35 + 49 + 1 = 85, over 55.
       <strong>Emit chunk 1 = 35.</strong></p>
       <p>Pop while over 15: drop atom 1 → 13. The overlap test is satisfied — 13 is not over 15 — so
       "Bring a coat." is ready to carry.</p>
       <p>But atom 3 has to fit beside it: 13 + 1 + 49 = 63, over 55. It does not, so the pop loop keeps
       going. Drop atom 2 → 0.</p>
       <p>Add atom 3: 49. End. <strong>Emit chunk 2 = 49.</strong></p>
       <p><strong>Two chunks: 35 and 49, zero overlap.</strong> "Bring a coat." appears only once.</p>
       <p>Keeping it would have produced a 63-character chunk with a Chunk Size of 55. Split Text will
       not do that just to keep an overlap: <strong>Chunk Size wins.</strong></p>`
    )}

    ${T.problem(
      `<strong>Room for one, not two.</strong> Separator <code>\\n</code>, Chunk Size
       <strong>55</strong>, Chunk Overlap <strong>25</strong>.
       ${chunkDoc(`Garden workday.
Bring water.
Wear boots.
The new raised beds need filling today.`)}
       Give the chunks, and say how many lines chunk 2 shares with chunk 1.`,
      `<p>Atoms: 15, 12, 11, 39.</p>
       <p>Buffer 15 → 28 → 40. Atom 4 would make 40 + 39 + 1 = 80, over 55.
       <strong>Emit chunk 1 = 40.</strong></p>
       <p>Pop while over 25: drop atom 1 → 40 − 15 − 1 = 24. The overlap test is satisfied with
       <em>two</em> lines, "Bring water." and "Wear boots."</p>
       <p>Does atom 4 fit beside them? 24 + 1 + 39 = 64, over 55. No — pop again. Drop atom 2 → 11. Now
       11 + 1 + 39 = 51, which fits. Stop.</p>
       <p>Add atom 4: 51. End. <strong>Emit chunk 2 = 51.</strong></p>
       <p><strong>Two chunks: 40 and 51, sharing one line.</strong> The overlap allowed two lines; the
       Chunk Size only had room for one.</p>`
    )}

    ${T.problem(
      `<strong>Landing exactly on the size.</strong> Separator <code>\\n</code>, Chunk Size
       <strong>46</strong>, Chunk Overlap <strong>14</strong>.
       ${chunkDoc(`Tune up first.
Warm up next.
The soloists stand at the front.`)}
       After chunk 1 is emitted, does "Warm up next." survive the second check?`,
      `<p>Atoms: 14, 13, 32.</p>
       <p>Buffer 14 → 28. Atom 3 would make 28 + 32 + 1 = 61, over 46.
       <strong>Emit chunk 1 = 28.</strong></p>
       <p>Pop while over 14: drop atom 1 → 13. Stop.</p>
       <p>Does atom 3 fit beside it? 13 + 1 + 32 = <strong>46</strong>. The question is whether that
       is <em>bigger than</em> 46, and it is not. It fits, so nothing more pops.</p>
       <p>Add atom 3: 46. End. <strong>Emit chunk 2 = 46.</strong></p>
       <p><strong>Two chunks: 28 and 46, sharing one line.</strong> Both checks in the pop loop are
       strictly "bigger than", just like the fit test.</p>`
    )}

    ${T.problem(
      `<strong>Spot the mistake.</strong> Separator <code>\\n</code>, Chunk Size <strong>50</strong>,
       Chunk Overlap <strong>16</strong>.
       ${chunkDoc(`Sign in at the desk.
Get a name tag.
The keynote speaker begins promptly at nine.`)}
       A classmate's work: <em>"Atoms 20, 15, 44. Chunk 1 = 36 (atoms 1–2). Pop while over 16: drop
       atom 1, leaving 15. Stop, so atom 2 carries. Add atom 3: 15 + 1 + 44 = 60. End. Chunks: 36 and
       60."</em> What is wrong, and what are the right chunks?`,
      `<p>The classmate stopped popping too soon. 15 passes the overlap test, but the pop loop also asks
       whether the next atom fits beside what is left: 15 + 1 + 44 = 60, over 50. It does not, so atom 2
       is dropped as well → 0.</p>
       <p>Add atom 3: 44. <strong>Two chunks: 36 and 44, zero overlap.</strong></p>
       <p>There was a warning sign in their own answer: a 60-character chunk with a Chunk Size of 50,
       even though no single line is anywhere near 50. The only way to get an oversized chunk is an
       oversized <em>atom</em>. If your chunk is over the size and no atom is, recheck the pop.</p>`
    )}
  `;

  window.SectionContent = window.SectionContent || {};
  window.SectionContent["chunking-edge-practice"] = {
    title: "Practice: Chunking Edge Cases",
    html,
  };
})();
