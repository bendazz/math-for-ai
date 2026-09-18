/* ============================================================
   Section: Practice — Chunking by Hand (Split Text)
   Registered under id "chunking-practice" (see manifest.js).
   Fourth section of the "Embeddings" group; sits between
   vector-pooling and lab-sentence-matcher (Lab 7), which chunks
   real text before embedding it.

   DELIBERATE TWIN of the Intro-to-AI-Applications course's section
   of the same name. A handful of students take both courses, so the
   ALGORITHM, the vocabulary (atoms / glue / pop), and the cheat
   sheet are kept IDENTICAL on purpose — a student in both should
   recognise one method, not have to reconcile two. Only the
   PROBLEMS differ, so those students get extra practice rather than
   a contradiction.

   NOT ONE question is shared with the other course. Theirs covers:
   3-line cut at size 1000; the +1 tipping 17+23 over 40; club
   handbook 100/30; goggles 60/30; overlap-vanishes 100/30; \n\n
   oversized atom 60/10; two separators at 70/50; and three
   diagnose/design prompts about a 40-page handbook. This set uses
   entirely different documents and settings, and its two diagnosis
   problems are about THIS course's own Lab 6 word list, which the
   other course does not have.

   VERIFIED: every atom length, chunk length, seam count and shared-
   line count below was produced by running the REAL langchain
   CharacterTextSplitter out of the Langflow Desktop venv
   (~/.langflow/.langflow-venv, langchain_text_splitters) on the
   exact strings quoted, with the same arguments Langflow passes
   (chunk_size, chunk_overlap, separator, keep_separator=False).
   Do not adjust a number here without re-running it.

   Key facts the set is built on (split_text.py + base.py):
     - Phase 1 cut on separator; empty pieces dropped; atoms never
       subdivided later.
     - Phase 2 fit test INCLUDES one separator's length once the
       buffer is non-empty: total + len + sep_len > chunk_size.
       The test is STRICTLY greater, so landing exactly on the
       chunk size still fits (problem 2 turns on this).
     - On emit, pop from the FRONT while total > chunk_overlap,
       OR while the incoming atom still would not fit beside what
       is left (total + len + sep_len > chunk_size, total > 0).
       No problem in this set triggers the second condition; it is
       on the cheat sheet so the rule is complete. The first test is
       strictly greater, so a buffer of exactly the overlap
       stops popping (problems 4 and 5 both land on this).
     - Joined chunks are .strip()ed.

   Sample documents render through the local `chunkDoc` helper,
   which prints each line's character count in a right-hand gutter
   so students spend their time on the algorithm, not on counting.
   Counts are COMPUTED from the text, so they cannot drift; they
   exclude the separator, which keeps the +1 as something the
   student still has to supply. A blank line gets an EMPTY gutter,
   not a 0 — under \n\n that blank line IS the separator, and a 0
   would imply a third, empty atom.

   Styling is inlined in chunkDoc: this course's styles.css has no
   .doc / .doc-line rules (the other course's does), and a section
   should not need a global stylesheet edit.

   NO KaTeX in this section. Numbers are plain numerals in <strong>,
   not $-delimited math — there is no algebra here, and it removes
   every $-pairing hazard. The only "$" in the file is inside the
   helper's /\n$/ regex, which is JS and invisible to KaTeX; a
   checker that does not skip code will flag it as a false positive.
   Inequalities are written in words. No forward lead-in.
   ============================================================ */

(function () {
  const T = window.Toolkit;

  /* Renders a sample document with a live character count beside every line.
     Counts are computed here, so they can never drift out of step with the
     text, and they exclude the separator — which is exactly the +1 the fit
     test makes students remember for themselves. */
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
    <div class="eyebrow">Embeddings · 4</div>
    <h1>Practice: Chunking by Hand</h1>

    <p>Before a long document can be embedded it has to be cut into pieces — <strong>chunks</strong> —
    and each chunk gets its own vector. You have already set Chunk Size and Chunk Overlap in Langflow's
    <strong>Split Text</strong> block. These problems are about running that algorithm yourself, on
    paper, so you can predict what a setting will do before you click Run.</p>

    <p>Every number below is real: these are the chunks Langflow actually produces for the text and
    settings given.</p>

    ${T.callout(
      `<strong>The whole algorithm, both phases:</strong>
       <ol>
         <li><strong>Cut.</strong> Break the text at <em>every</em> occurrence of the Separator. Throw
         away any empty pieces. Call what is left <strong>atoms</strong>. Chunk Size and Chunk Overlap
         do nothing here, and <strong>no atom is ever split later</strong>.</li>
         <li><strong>Glue.</strong> Walk the atoms left to right into a buffer. Before adding an atom,
         test whether it fits:
         <br><code>buffer + atom + 1 separator &gt; Chunk Size ?</code>
         <br>(Count the separator only when the buffer already has something in it.)
         <ul>
           <li><strong>Fits:</strong> add it. The buffer grows by the atom plus one separator.</li>
           <li><strong>Does not fit:</strong> emit the buffer as a chunk. Then <strong>pop atoms off
           the front while the buffer is bigger than Chunk Overlap</strong> — <strong>or while the atom
           still would not fit</strong> beside what is left. Whatever survives is carried into the next
           chunk. Now add the atom.</li>
         </ul></li>
         <li>At the end of the text, emit whatever is still in the buffer.</li>
       </ol>
       <strong>Both tests are strictly "bigger than".</strong> A buffer that lands <em>exactly</em> on
       the Chunk Size still fits, and a buffer that pops down to <em>exactly</em> the Chunk Overlap
       stops popping. Watch for that — several problems below turn on it.`,
      { type: "note", label: "Cheat sheet" }
    )}

    ${(T.resetProblems(), "")}

    ${T.problem(
      `<strong>Just the cut.</strong> Separator <code>\\n</code>, Chunk Size <strong>500</strong>,
       Chunk Overlap <strong>0</strong>.
       ${chunkDoc(`Welcome aboard.
Coffee is free.
The wifi is not.`)}
       How many atoms, and how many chunks come out?`,
      `<p><strong>Three atoms:</strong> 15, 15 and 16 characters.</p>
       <p>Now glue. Buffer 15, then 15 + 15 + 1 = 31, then 31 + 16 + 1 = 48. Nothing ever comes near
       500, so nothing is emitted early.</p>
       <p><strong>One chunk, 48 characters</strong> — the whole document, newlines and all.</p>
       <p>Cutting and chunking are not the same step. The separator decided there were three atoms;
       the Chunk Size decided they all went into one chunk anyway.</p>`
    )}

    ${T.problem(
      `<strong>Landing exactly on the size.</strong> Separator <code>\\n</code>, Chunk Size
       <strong>36</strong>, Chunk Overlap <strong>0</strong>.
       ${chunkDoc(`Water the greenhouse.
Feed the fish.
Sweep the hallway.
Lock the cabinet.`)}
       Give the chunks and their lengths.`,
      `<p>Atoms: 21, 14, 18, 17.</p>
       <p>Buffer 21. Does atom 2 fit? 21 + 14 + 1 = <strong>36</strong> — the test asks whether that is
       <em>bigger than</em> 36, and it is not. <strong>It fits.</strong> Buffer 36.</p>
       <p>Atom 3: 36 + 18 + 1 = 55, bigger than 36. <strong>Emit chunk 1 = 36.</strong> Pop while the
       buffer is over 0 — that empties it. Buffer takes atom 3: 18.</p>
       <p>Atom 4: 18 + 17 + 1 = <strong>36</strong> again, not bigger. It fits. End of text:
       <strong>emit chunk 2 = 36.</strong></p>
       <p><strong>Two chunks, 36 and 36.</strong></p>
       <p>The lesson is the boundary. Landing exactly on the Chunk Size is allowed — the test is
       strictly "bigger than". If you read it as "36 or more, so stop", you would predict four chunks
       instead of two and be wrong twice over.</p>`
    )}

    ${T.problem(
      `<strong>The choir notice.</strong> Separator <code>\\n</code>, Chunk Size <strong>100</strong>,
       Chunk Overlap <strong>30</strong>.
       ${chunkDoc(`The choir meets Thursday.
Rehearsal starts at six.
Bring your own folder.
Risers go up at five.
Concert dress is black.
Parking is behind the hall.`)}
       How many chunks, and how long is each?`,
      `<p>Atoms: 25, 24, 22, 21, 23, 27.</p>
       <p>Buffer: 25 → 50 → 73 → 95 (atoms 1–4). Atom 5 would make 95 + 23 + 1 = 119, over 100.
       <strong>Emit chunk 1 = 95</strong> (atoms 1–4).</p>
       <p>Pop while the buffer is over 30: 95 → drop atom 1 → 69 → drop atom 2 → 44 → drop atom 3 → 21.
       Stop, 21 is not over 30. <strong>Atom 4 carries forward</strong> — that is the overlap.</p>
       <p>Buffer: 21 → 45 (atom 5) → 73 (atom 6). End of text. <strong>Emit chunk 2 = 73.</strong></p>
       <p><strong>Two chunks: 95 and 73</strong>, sharing one line.</p>
       <p>Notice neither chunk is 100. Chunk Size is a ceiling you bump into, not a length you hit.</p>`
    )}

    ${T.problem(
      `<strong>Two lines carried.</strong> Separator <code>\\n</code>, Chunk Size <strong>55</strong>,
       Chunk Overlap <strong>25</strong>.
       ${chunkDoc(`Stretch first.
Warm up.
Run a lap.
Drink water.
Cool down.
Stretch again.
Log the time.`)}
       Give the chunks, and say how many lines each shares with the one before it.`,
      `<p>Atoms: 14, 8, 10, 12, 10, 14, 13.</p>
       <p>Buffer: 14 → 23 → 34 → 47 (atoms 1–4). Atom 5 would make 58, over 55.
       <strong>Emit chunk 1 = 47.</strong> Pop while over 25: 47 → drop atom 1 → 32 → drop atom 2 → 23.
       Stop. <strong>Atoms 3 and 4 carry — two lines.</strong></p>
       <p>Buffer: 23 → 34 (atom 5) → 49 (atom 6). Atom 7 would make 63, over 55.
       <strong>Emit chunk 2 = 49.</strong> Pop while over 25: 49 → drop atom 3 → 38 → drop atom 4 →
       <strong>25</strong>. Stop — 25 is not <em>over</em> 25. <strong>Atoms 5 and 6 carry — two
       lines.</strong></p>
       <p>Buffer: 25 → 39 (atom 7). End. <strong>Emit chunk 3 = 39.</strong></p>
       <p><strong>Three chunks: 47, 49, 39, each sharing two lines with the previous one.</strong></p>
       <p>Two things worth keeping. The overlap is not a fixed number of characters — it is however many
       whole atoms fit under the budget, and it can change from seam to seam. And that second pop
       stopped at exactly 25: "bigger than" again, on the other test.</p>`
    )}

    ${T.problem(
      `<strong>Count the overlap.</strong> Separator <code>\\n</code>, Chunk Size <strong>60</strong>,
       Chunk Overlap <strong>25</strong>.
       ${chunkDoc(`Sign in.
Take a badge.
Find your seat.
Silence your phone.
Wait for the bell.
Stand to sing.`)}
       Give the chunks and their lengths.`,
      `<p>Atoms: 8, 13, 15, 19, 18, 14.</p>
       <p>Buffer: 8 → 22 → 38 → 58 (atoms 1–4). Atom 5 would make 58 + 18 + 1 = 77, over 60.
       <strong>Emit chunk 1 = 58.</strong></p>
       <p>Pop while over 25: 58 → drop atom 1 → 49 → drop atom 2 → 35 → drop atom 3 → 19. Stop.
       <strong>Atom 4 carries — one line.</strong></p>
       <p>Buffer: 19 → 38 (atom 5) → 53 (atom 6). End. <strong>Emit chunk 2 = 53.</strong></p>
       <p><strong>Two chunks: 58 and 53, sharing one line.</strong></p>
       <p>Compare this with the previous problem: a bigger Chunk Overlap there (25 against a much
       smaller set of atoms) bought two lines of overlap, while here the same 25 buys only one. The
       overlap you actually get depends on how big your lines are.</p>`
    )}

    ${T.problem(
      `<strong>Where did the overlap go?</strong> Separator <code>\\n</code>, Chunk Size
       <strong>90</strong>, Chunk Overlap <strong>25</strong>.
       ${chunkDoc(`The greenhouse opens at seven each morning.
Volunteers water the seedlings on Mondays.
Compost goes in the bin behind the shed.`)}
       Give the chunks. How much overlap do you get?`,
      `<p>Atoms: 43, 42, 40.</p>
       <p>Buffer: 43 → 43 + 42 + 1 = 86 (atoms 1–2). Atom 3 would make 86 + 40 + 1 = 127, over 90.
       <strong>Emit chunk 1 = 86.</strong></p>
       <p>Pop while over 25: 86 → drop atom 1 → 42. Still over 25, so drop atom 2 → <strong>0. The
       buffer is empty.</strong></p>
       <p>Buffer takes atom 3: 40. End. <strong>Emit chunk 2 = 40.</strong></p>
       <p><strong>Two chunks, 86 and 40, with zero overlap</strong> — even though Chunk Overlap is set
       to 25 and neither chunk is oversized.</p>
       <p>The pop loop does not stop once it has kept "about 25 characters". It keeps going while the
       buffer is over 25, and atom 2 is 42 on its own. There is no way to keep part of an atom, so it
       goes too. <strong>Overlap only survives when atoms are smaller than the Chunk Overlap
       budget.</strong> Here every atom is far bigger, so the answer was always going to be zero.</p>`
    )}

    ${T.problem(
      `<strong>An atom that will not fit.</strong> Separator <code>\\n\\n</code>, Chunk Size
       <strong>70</strong>, Chunk Overlap <strong>15</strong>. Two paragraphs with a blank line between
       them:
       ${chunkDoc(`Practice is Wednesday.

Anyone borrowing a club laptop must return it to the cabinet the same evening and sign the log sheet.`)}
       Give the chunks and their lengths.`,
      `<p><strong>Two</strong> atoms: 22 and <strong>101</strong>. The blank line is not a third, empty
       atom — those two newlines <em>are</em> the separator, and the cut consumes them. That is why the
       blank line carries no character count above.</p>
       <p>Buffer 22. Atom 2 would make 22 + 101 + 2 = 125, over 70. <strong>Emit chunk 1 = 22.</strong>
       Pop while over 15: 22 → drop atom 1 → 0, empty.</p>
       <p>Buffer takes atom 2: 101. End. <strong>Emit chunk 2 = 101.</strong></p>
       <p><strong>Two chunks: 22 and 101 — and the second is 31 characters over the Chunk Size you
       set.</strong></p>
       <p>Split Text does not subdivide it and does not error. It emits the atom whole and writes a
       line to the log: <em>"Created a chunk of size 101, which is longer than the specified 70."</em>
       Nothing in the output itself tells you this happened.</p>
       <p>Lowering Chunk Size would not help. The only lever that touches this chunk is the
       <strong>Separator</strong> — a paragraph is one atom, and breaking it up means cutting at
       something finer.</p>`
    )}

    ${T.problem(
      `<strong>One document, two separators.</strong> Chunk Size <strong>45</strong>, Chunk Overlap
       <strong>20</strong> for both runs. The document, with a blank line in the middle:
       ${chunkDoc(`Tryouts are Monday.
Bring cleats.

Buses leave at four.
Sit with your team.`)}
       Run it once with Separator <code>\\n\\n</code> and once with <code>\\n</code>. What comes out
       each time?`,
      `<p><strong>With <code>\\n\\n</code>:</strong> two atoms, 33 and 40 — each still contains a
       newline inside it, because on this run a single newline is not a separator. Buffer 33; atom 2
       would make 33 + 40 + 2 = 75, over 45. Emit chunk 1 = 33. Pop while over 20: 33 → drop atom 1 →
       0, empty. Buffer takes atom 2: 40. End, emit chunk 2 = 40.
       <strong>Two chunks, 33 and 40, zero overlap.</strong></p>
       <p><strong>With <code>\\n</code>:</strong> four atoms — 19, 13, 20, 19. Buffer 19 → 33. Atom 3
       would make 54, over 45. Emit chunk 1 = 33. Pop while over 20: 33 → drop atom 1 → 13, stop —
       atom 2 carries. Buffer 13 → 34 (atom 3). Atom 4 would make 54, over 45. Emit chunk 2 = 34. Pop
       while over 20: 34 → drop atom 2 → 20, stop — atom 3 carries. Buffer 20 → 40 (atom 4). End, emit
       chunk 3 = 40. <strong>Three chunks: 33, 34, 40, each sharing a line with the one
       before.</strong></p>
       <p>Same document, same Chunk Size, same Chunk Overlap — one run has real overlap at every seam
       and the other has none at all. The <strong>Separator decided it</strong>, by deciding how big
       the atoms were.</p>`
    )}

    ${T.problem(
      `<strong>Back to Lab 6.</strong> In the word-search lab you set Separator <code>\\n</code>, Chunk
       Size <strong>1</strong> and Chunk Overlap <strong>0</strong> on a file with one word per line.
       Chunk Size 1 sounds like it should cut every word down to a single letter — but you got whole
       words. Why?
       ${chunkDoc(`king
queen
cat
dog
car`)}`,
      `<p>Because <strong>no atom is ever subdivided.</strong> The cut happens first and it happens on
       newlines, giving five atoms: 4, 5, 3, 3, 3. Chunk Size has no say in that phase at all.</p>
       <p>In the glue phase the buffer starts empty and takes atom 1: "king", 4 characters. Atom 2
       would make 4 + 5 + 1 = 10, over 1 — so emit "king" as its own chunk. Pop while over 0, which
       empties the buffer. Then the same thing happens for every remaining atom.</p>
       <p><strong>Five chunks: king, queen, cat, dog, car</strong> — each one a whole word.</p>
       <p>So Chunk Size 1 does not mean "chunks of one character". It means "stop gluing immediately",
       which for a one-word-per-line file gives exactly one word per chunk. That is precisely what the
       word search needs: one embedding per word.</p>`
    )}

    ${T.problem(
      `<strong>Diagnose it.</strong> A classmate builds the Lab 6 flow and gets a single chunk
       containing every word run together, so the search returns that one blob no matter what they
       type. They insist their word list is fine. Name <em>two</em> different settings that would each
       produce this, and say how to tell them apart.`,
      `<p><strong>Cause one: Chunk Size left at its default of 1000.</strong> The cut still produces one
       atom per word, but the glue phase never fills up — a short word list is nowhere near 1000
       characters — so every atom ends up in the same buffer and one chunk comes out at the end. The
       fix is Chunk Size 1.</p>
       <p><strong>Cause two: the Separator box was emptied.</strong> With no separator to cut on, the
       splitter falls back to cutting between <em>every character</em> — so the atoms are single
       letters. The glue phase then simply reassembles them, gathering characters until it approaches
       1000, and the file comes back out as one chunk. The fix is to put the newline back.</p>
       <p><strong>How to tell them apart: look at the Separator field.</strong> That is the harder one
       to spot, because a correct Separator holds a newline character, which shows as an
       empty-looking box — identical at a glance to an actually empty box. Type the two characters
       <code>\\n</code> into it instead and the setting becomes something you can read.</p>
       <p>Notice that the second cause depends on Chunk Size to disguise itself. The empty Separator
       always produces single-character atoms; at Chunk Size 1000 the glue phase hides that by
       reassembling them into one blob, while at Chunk Size 1 nothing is glued at all and you get a
       database full of single letters instead. Same broken setting, opposite-looking symptoms — which
       is why the Separator is the thing to check first either way.</p>`
    )}
  `;

  window.SectionContent = window.SectionContent || {};
  window.SectionContent["chunking-practice"] = {
    title: "Practice: Chunking by Hand",
    html,
  };
})();
