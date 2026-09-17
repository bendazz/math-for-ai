/* ============================================================
   Section: Practice — Precision and Recall in Search
   Registered under id "retrieval-practice" (see manifest.js).
   Fifth section of the "Embeddings" group; sits between
   chunking-practice and lab-sentence-matcher (Lab 7).

   DELIBERATE TWIN of the Intro-to-AI-Applications course's
   "Practice: precision and recall" (sections/retrieval-practice.js
   there), the same way chunking-practice twins its counterpart. A
   handful of students take both courses, so the METHOD, the
   vocabulary (hits / k / relevant / best possible) and the cheat
   sheet are kept IDENTICAL on purpose. Only the PROBLEMS differ, so
   those students get extra practice rather than a repeat.

   NOT ONE question is shared with the other course. Theirs uses a
   20-chunk syllabus (6 relevant, k = 4, 3 hits; then 3 relevant,
   k = 10, 2 hits), a two-team comparison at 3 relevant, a "which k"
   at 4-of-20, a work-backwards at k = 5 / 60% / 50%, and an
   impossible-result at 4 relevant / 6 not. This set uses different
   documents and every number is different; problem 13 (k = relevant
   forces precision = recall) has no counterpart there at all.

   PLACEMENT NOTE — this lands FIVE sections before the Evaluation
   group defines precision and recall on a confusion matrix, so the
   section is written SELF-CONTAINED: it defines both ratios from
   scratch in search terms and never refers back. Nothing here needs
   TP/FP/FN, and confusion-matrix / precision-recall later re-derive
   the same two ratios formally. Concrete first, formal after. Do not
   "fix" this by adding a back-reference unless the section moves.

   Vocabulary vs the other course: that one says "chunks retrieved"
   and cites Chroma's Number of Results, because its students run a
   vector store. This book has no Chroma yet, so k is "how many
   results the search returns" — the top-k of the similarity ranking
   that Lab 6 and Lab 7 build. Same k, same formulas.

   The NEW idea beyond the two ratios: the BEST POSSIBLE score.
     best possible hits      = the smaller of k and relevant
     best possible precision = best hits ÷ k
     best possible recall    = best hits ÷ relevant
   Only k = relevant lets both reach 100%.

   Distractor rule: every wrong choice is a SPECIFIC mistake (swapped
   denominators, dividing by everything in the collection, dividing by
   the not-relevant count, the junk share, the actual score where the
   best was asked, assuming 100% is always reachable). Correct answers
   balanced across A/B/C/D (A 3, B 4, C 3, D 3). Percentages rounded to
   the nearest whole percent.

   ARITHMETIC (verified by hand, and by the check script in this
   commit — see the header of each scenario for the full ledger):
     Scenario A: 24 sentences, 6 relevant, 18 not, k = 5, 2 hits.
       precision 2÷5 = 40%, recall 2÷6 = 33%, best hits 5,
       best precision 5÷5 = 100%, best recall 5÷6 = 83%.
     Scenario B: 30 sentences, 4 relevant, 26 not, k = 10, 3 hits.
       precision 3÷10 = 30%, recall 3÷4 = 75%, best hits 4,
       best precision 4÷10 = 40%, best recall 4÷4 = 100%.
   Do not adjust a number without re-checking every distractor that
   quotes it.

   NO KaTeX in this section, matching chunking-practice next door (and
   the twin in the other course): the math here is arithmetic on whole
   numbers, not algebra, so numerals in <strong> read better than
   $-delimited math and every $-pairing hazard disappears. Percent
   signs sit in plain prose, never inside math. No currency glyph.
   Inequalities written in words. No forward lead-in.
   ============================================================ */

(function () {
  const T = window.Toolkit;

  const html = `
    ${(T.resetProblems(), "")}
    <div class="eyebrow">Embeddings · 5</div>
    <h1>Practice: Precision and Recall in Search</h1>

    <p>Your search engine ranks every sentence in a collection by cosine similarity
    and hands back the top few. Call that number <strong>k</strong>. The obvious
    question is whether what came back was any good — and "good" turns out to be two
    separate questions, each a simple fraction.</p>

    <h2>The two questions</h2>

    <p>Start with an <strong>answer key</strong>: for one question, go through the
    collection yourself and mark every sentence that genuinely answers it. Those are
    the <strong>relevant</strong> sentences. Now run the search and see which of the
    k results are on that list. Those are the <strong>hits</strong>.</p>

    <ul>
      <li><strong>Precision</strong> — of what came back, how much was relevant?
      That is <strong>hits ÷ k</strong>. Low precision means the results were padded
      out with junk.</li>
      <li><strong>Recall</strong> — of what was relevant, how much came back? That is
      <strong>hits ÷ relevant</strong>. Low recall means good sentences were sitting
      in the collection and the search walked past them.</li>
    </ul>

    <p>Same numerator, different denominators. A search can score beautifully on one
    and badly on the other, which is exactly why one number was never enough.</p>

    <h2>The best possible score</h2>

    <p>It is tempting to grade both against 100%. But k itself can make 100%
    impossible, before the search engine does anything at all.</p>

    <ul>
      <li>Say 4 sentences are relevant and you ask for <strong>10</strong> results.
      Even if the search is perfect and all 4 come back, the other 6 slots have to be
      filled with something. Precision cannot beat 4 ÷ 10 = <strong>40%</strong>.</li>
      <li>Say 4 sentences are relevant and you ask for <strong>2</strong> results.
      Even if both are relevant, at least 2 relevant sentences get left out. Recall
      cannot beat 2 ÷ 4 = <strong>50%</strong>.</li>
    </ul>

    <p>So a score only means something next to its best possible value. Judge the
    search against what the setting allowed, not against a perfect 100%.</p>

    ${T.callout(
      `<strong>Everything you need:</strong>
       <ul>
         <li><strong>k</strong> — how many results the search returns.</li>
         <li><strong>Relevant</strong> — how many sentences the answer key marks as
         truly answering the question.</li>
         <li><strong>Hits</strong> — sentences that are both relevant and
         returned.</li>
         <li><strong>Precision</strong> = hits ÷ k</li>
         <li><strong>Recall</strong> = hits ÷ relevant</li>
         <li><strong>Best possible hits</strong> = the smaller of k and relevant
         (what a perfect search would get).</li>
         <li><strong>Best possible precision</strong> = best possible hits ÷ k</li>
         <li><strong>Best possible recall</strong> = best possible hits ÷ relevant</li>
         <li>The number of <strong>not relevant</strong> sentences is in neither
         formula. It tells you what <em>could</em> happen.</li>
       </ul>
       Round percentages to the nearest whole percent. Every problem is multiple
       choice: commit to an answer before you open the solution.`,
      { label: "Cheat sheet" }
    )}

    <h2>Scenario A</h2>

    <p>You build a search engine over <strong>24 sentences</strong> from a first-aid
    manual and ask, <em>"What do I do for a burn?"</em> Your answer key marks
    <strong>6 sentences relevant</strong> and <strong>18 not relevant</strong>. You
    set <strong>k = 5</strong>, and <strong>2</strong> of the 5 results that come back
    are relevant.</p>

    ${T.problem(
      `<p><strong>Scenario A</strong> (6 relevant, 18 not relevant, k = 5, 2 hits).
       What is the <strong>precision</strong>?</p>
       <ol type="A">
         <li>33%</li>
         <li>8%</li>
         <li>40%</li>
         <li>60%</li>
       </ol>`,
      `<p><strong>C — 40%</strong></p>
       <p>Precision = hits ÷ k = 2 ÷ 5 = 40%. Of the 5 sentences that came back, 2
       were relevant.</p>
       <p>Why not the others:</p>
       <ul>
         <li><strong>33%</strong> is 2 ÷ 6 — dividing by the relevant sentences.
         That is recall.</li>
         <li><strong>8%</strong> is 2 ÷ 24 — dividing by every sentence in the
         collection. Precision only asks about the ones that came back.</li>
         <li><strong>60%</strong> is 3 ÷ 5 — the share that was junk, the opposite of
         precision.</li>
       </ul>`
    )}

    ${T.problem(
      `<p><strong>Scenario A</strong> (6 relevant, 18 not relevant, k = 5, 2 hits).
       What is the <strong>recall</strong>?</p>
       <ol type="A">
         <li>33%</li>
         <li>40%</li>
         <li>8%</li>
         <li>11%</li>
       </ol>`,
      `<p><strong>A — 33%</strong></p>
       <p>Recall = hits ÷ relevant = 2 ÷ 6 = 33%. Of the 6 sentences that could have
       helped, the search found 2.</p>
       <p>Why not the others:</p>
       <ul>
         <li><strong>40%</strong> is 2 ÷ 5 — dividing by k. That is precision.</li>
         <li><strong>8%</strong> is 2 ÷ 24 — dividing by every sentence in the
         collection.</li>
         <li><strong>11%</strong> is 2 ÷ 18 — dividing by the not-relevant sentences,
         which appear in neither formula.</li>
       </ul>`
    )}

    ${T.problem(
      `<p><strong>Scenario A</strong> (6 relevant, 18 not relevant, k = 5, 2 hits).
       What was the <strong>best possible precision</strong>?</p>
       <ol type="A">
         <li>83%</li>
         <li>40%</li>
         <li>21%</li>
         <li>100%</li>
       </ol>`,
      `<p><strong>D — 100%</strong></p>
       <p>Best possible hits = the smaller of k (5) and relevant (6) = 5. Best possible
       precision = 5 ÷ 5 = 100%. There are more relevant sentences than slots, so a
       perfect search could fill every slot with a relevant one.</p>
       <p>Why not the others:</p>
       <ul>
         <li><strong>83%</strong> is 5 ÷ 6 — the right best possible hits, divided by
         relevant instead of k. That is the best possible recall.</li>
         <li><strong>40%</strong> is the precision this search <em>actually</em> got,
         not the best it could have got.</li>
         <li><strong>21%</strong> is 5 ÷ 24 — k over the whole collection, which has
         nothing to do with either ratio.</li>
       </ul>`
    )}

    ${T.problem(
      `<p><strong>Scenario A</strong> (6 relevant, 18 not relevant, k = 5, 2 hits).
       What was the <strong>best possible recall</strong>?</p>
       <ol type="A">
         <li>100%</li>
         <li>83%</li>
         <li>33%</li>
         <li>25%</li>
       </ol>`,
      `<p><strong>B — 83%</strong></p>
       <p>Best possible hits = the smaller of 5 and 6 = 5. Best possible recall =
       5 ÷ 6 = 83%. With only 5 slots, at least 1 of the 6 relevant sentences is always
       left out, no matter how good the search is.</p>
       <p>Notice what that does to the verdict. This search scored 33% recall against a
       ceiling of 83% — genuinely poor, and the small k is not the excuse. Compare
       precision: 40% against a ceiling of 100%.</p>
       <p>Why not the others:</p>
       <ul>
         <li><strong>100%</strong> assumes a perfect score is always reachable. When k
         is smaller than the number of relevant sentences, it is not.</li>
         <li><strong>33%</strong> is the recall this search actually got.</li>
         <li><strong>25%</strong> is 6 ÷ 24 — relevant sentences over the whole
         collection, which says nothing about k.</li>
       </ul>`
    )}

    <h2>Scenario B</h2>

    <p>A different collection: <strong>30 sentences</strong> from a houseplant care
    guide. The question is <em>"How often should I water it?"</em> The answer key marks
    <strong>4 sentences relevant</strong> and <strong>26 not relevant</strong>. You set
    <strong>k = 10</strong>, and <strong>3</strong> of the 10 results that come back are
    relevant.</p>

    ${T.problem(
      `<p><strong>Scenario B</strong> (4 relevant, 26 not relevant, k = 10, 3 hits).
       What is the <strong>precision</strong>?</p>
       <ol type="A">
         <li>75%</li>
         <li>30%</li>
         <li>10%</li>
         <li>70%</li>
       </ol>`,
      `<p><strong>B — 30%</strong></p>
       <p>Precision = hits ÷ k = 3 ÷ 10 = 30%.</p>
       <p>Why not the others:</p>
       <ul>
         <li><strong>75%</strong> is 3 ÷ 4 — dividing by relevant. That is recall.</li>
         <li><strong>10%</strong> is 3 ÷ 30 — dividing by every sentence in the
         collection.</li>
         <li><strong>70%</strong> is 7 ÷ 10 — the share that was junk.</li>
       </ul>`
    )}

    ${T.problem(
      `<p><strong>Scenario B</strong> (4 relevant, 26 not relevant, k = 10, 3 hits).
       What is the <strong>recall</strong>?</p>
       <ol type="A">
         <li>30%</li>
         <li>10%</li>
         <li>12%</li>
         <li>75%</li>
       </ol>`,
      `<p><strong>D — 75%</strong></p>
       <p>Recall = hits ÷ relevant = 3 ÷ 4 = 75%. One of the four relevant sentences
       never came back.</p>
       <p>Why not the others:</p>
       <ul>
         <li><strong>30%</strong> is 3 ÷ 10 — dividing by k. That is precision.</li>
         <li><strong>10%</strong> is 3 ÷ 30 — dividing by every sentence in the
         collection.</li>
         <li><strong>12%</strong> is 3 ÷ 26 — dividing by the not-relevant
         sentences.</li>
       </ul>`
    )}

    ${T.problem(
      `<p><strong>Scenario B</strong> (4 relevant, 26 not relevant, k = 10, 3 hits).
       What was the <strong>best possible precision</strong>?</p>
       <ol type="A">
         <li>40%</li>
         <li>100%</li>
         <li>30%</li>
         <li>13%</li>
       </ol>`,
      `<p><strong>A — 40%</strong></p>
       <p>Best possible hits = the smaller of k (10) and relevant (4) = 4. Best possible
       precision = 4 ÷ 10 = 40%. Only 4 relevant sentences exist, so even a perfect
       search fills the other 6 slots with junk.</p>
       <p>Why not the others:</p>
       <ul>
         <li><strong>100%</strong> assumes a perfect score is always reachable. When k
         is bigger than the number of relevant sentences, it is not.</li>
         <li><strong>30%</strong> is the precision this search actually got.</li>
         <li><strong>13%</strong> is 4 ÷ 30 — relevant over the whole collection.</li>
       </ul>`
    )}

    ${T.problem(
      `<p><strong>Scenario B</strong> (4 relevant, 26 not relevant, k = 10, 3 hits).
       What was the <strong>best possible recall</strong>?</p>
       <ol type="A">
         <li>75%</li>
         <li>40%</li>
         <li>100%</li>
         <li>33%</li>
       </ol>`,
      `<p><strong>C — 100%</strong></p>
       <p>Best possible hits = the smaller of 10 and 4 = 4. Best possible recall =
       4 ÷ 4 = 100%. With 10 slots there was room for all 4 relevant sentences, so
       missing one is a real miss.</p>
       <p>Put the two scenarios side by side. In A, the 40% precision was already at its
       ceiling and there was nothing to fix. Here the 30% precision is close to its
       ceiling of 40%, but the 75% recall had every chance to be 100%. Same-looking
       numbers, opposite diagnoses.</p>
       <p>Why not the others:</p>
       <ul>
         <li><strong>75%</strong> is the recall this search actually got.</li>
         <li><strong>40%</strong> is the right best possible hits divided by k instead
         of relevant. That is the best possible precision.</li>
         <li><strong>33%</strong> is 10 ÷ 30 — k over the whole collection.</li>
       </ul>`
    )}

    <h2>Using the best possible score</h2>

    ${T.problem(
      `<p>Two students search the same 30-sentence collection for a question with
       <strong>4 relevant</strong> sentences. <strong>Student One</strong> sets k = 10
       and gets all 4 relevant sentences: precision 40%, recall 100%.
       <strong>Student Two</strong> sets k = 6 and gets 3 of them: precision 50%,
       recall 75%.</p>
       <p>Student Two says their search did the better job, since their precision was
       higher. Is that fair?</p>
       <ol type="A">
         <li>Yes — Student Two's precision is higher, so their search ranked
         better.</li>
         <li>No — Student One hit both of their ceilings (40% and 100%); Student Two
         missed both of theirs (67% and 100%).</li>
         <li>Yes — Student One's 40% precision means 6 of their 10 results were junk,
         which is a worse result.</li>
         <li>No — Student One's precision is really 4 ÷ 4 = 100%, which beats 50%.</li>
       </ol>`,
      `<p><strong>B</strong></p>
       <p>Student One: best possible hits = the smaller of 10 and 4 = 4, so best
       precision = 4 ÷ 10 = 40% and best recall = 4 ÷ 4 = 100%. They reached
       <strong>both</strong>. For that setting, the search was perfect.</p>
       <p>Student Two: best possible hits = the smaller of 6 and 4 = 4, so best
       precision = 4 ÷ 6 = 67% and best recall = 100%. They got 50% and 75% — short on
       both. There was room for every relevant sentence and they missed one.</p>
       <p>The fair complaint about Student One is not the search, it is the
       <strong>setting</strong>: k = 10 drags 6 junk sentences along on every question.
       That is a reason to lower k, not evidence that the search failed.</p>
       <p>Why not the others:</p>
       <ul>
         <li><strong>A</strong> compares raw scores without their ceilings. Student Two
         scored higher on precision and still did worse against what was possible.</li>
         <li><strong>C</strong> grades against 100%. The junk was forced by k, not
         caused by a bad ranking.</li>
         <li><strong>D</strong> divides by relevant instead of k. 4 ÷ 4 is Student
         One's recall, not their precision.</li>
       </ul>`
    )}

    ${T.problem(
      `<p>A question has <strong>7 relevant</strong> sentences in a collection of
       <strong>35</strong>. Which k lets a perfect search score 100% on
       <strong>both</strong> precision and recall?</p>
       <ol type="A">
         <li>k = 1</li>
         <li>k = 7</li>
         <li>k = 10</li>
         <li>k = 35</li>
       </ol>`,
      `<p><strong>B — k = 7</strong></p>
       <p>When k equals the number of relevant sentences, best possible hits = 7, so
       best precision = 7 ÷ 7 = 100% and best recall = 7 ÷ 7 = 100%. It is the only k
       where both ceilings reach 100%.</p>
       <p>Why not the others:</p>
       <ul>
         <li><strong>k = 1</strong>: best precision is 1 ÷ 1 = 100%, but best recall is
         only 1 ÷ 7 = 14%. Returning less is not automatically better.</li>
         <li><strong>k = 10</strong>: best recall is 100%, but best precision is only
         7 ÷ 10 = 70%.</li>
         <li><strong>k = 35</strong> returns the entire collection, so recall is
         guaranteed 100% — and best precision is only 7 ÷ 35 = 20%. A search that
         returns everything never misses anything, which is why recall on its own
         proves nothing.</li>
       </ul>
       <p>In a real collection, different questions have different numbers of relevant
       sentences, so no single k is right for all of them. That is why the trade-off
       never fully goes away.</p>`
    )}

    ${T.problem(
      `<p>Your search returns <strong>8</strong> results. Precision is
       <strong>25%</strong> and recall is <strong>40%</strong>. How many sentences does
       the answer key mark as relevant?</p>
       <ol type="A">
         <li>2</li>
         <li>8</li>
         <li>5</li>
         <li>20</li>
       </ol>`,
      `<p><strong>C — 5</strong></p>
       <p>Work backwards one formula at a time.</p>
       <p>Precision = hits ÷ k, so 25% = hits ÷ 8, and hits = 2.</p>
       <p>Recall = hits ÷ relevant, so 40% = 2 ÷ relevant. 2 is four tenths of what
       number? Relevant = 5.</p>
       <p>Why not the others:</p>
       <ul>
         <li><strong>2</strong> is the number of hits — stopping one step early.</li>
         <li><strong>8</strong> is 2 ÷ 25%, which just gets k back.</li>
         <li><strong>20</strong> is 8 ÷ 40% — using k where hits belongs.</li>
       </ul>`
    )}

    ${T.problem(
      `<p>An answer key marks <strong>5 sentences relevant</strong> and <strong>7 not
       relevant</strong> (12 sentences in all). Which of these results <strong>could
       not</strong> happen?</p>
       <ol type="A">
         <li>Return 7 results and get 0 hits</li>
         <li>Return 12 results and get 5 hits</li>
         <li>Return 4 results and get 4 hits</li>
         <li>Return 10 results and get 2 hits</li>
       </ol>`,
      `<p><strong>D</strong></p>
       <p>10 results with 2 hits means the other 8 were not relevant — but only 7
       not-relevant sentences exist. Return 10 and at least 10 − 7 = 3 of them
       <em>must</em> be relevant, so 3 hits is the worst you can do.</p>
       <p>Why the others can happen:</p>
       <ul>
         <li><strong>A</strong>: all 7 not-relevant sentences come back and nothing
         else. A terrible search, but a possible one.</li>
         <li><strong>B</strong>: returning all 12 sentences always gets all 5 relevant
         ones.</li>
         <li><strong>C</strong>: 4 hits is fine, since 5 relevant sentences exist.</li>
       </ul>
       <p>This is the one job of the not-relevant count: it is in neither formula, but
       it tells you which results are possible at all.</p>`
    )}

    ${T.problem(
      `<p>Suppose k happens to equal the number of relevant sentences. What must be
       true of that search?</p>
       <ol type="A">
         <li>Precision and recall are equal, whatever the search returns.</li>
         <li>Precision and recall are both 100%.</li>
         <li>Precision is higher than recall.</li>
         <li>Precision and recall are equal only if the search is perfect.</li>
       </ol>`,
      `<p><strong>A</strong></p>
       <p>Precision = hits ÷ k and recall = hits ÷ relevant. The two fractions share a
       numerator, and when k = relevant they share a denominator too — so they are the
       same fraction. Every hit the search wins or loses moves both numbers by exactly
       the same amount.</p>
       <p>Take 4 relevant sentences and k = 4. Three hits gives precision 3 ÷ 4 = 75%
       and recall 3 ÷ 4 = 75%. One hit gives 25% and 25%. Zero hits gives 0% and 0%.</p>
       <p>Why not the others:</p>
       <ul>
         <li><strong>B</strong> confuses equal with perfect. Both ceilings are 100% at
         this k, but a bad search still scores 25% and 25%.</li>
         <li><strong>C</strong> has no reason behind it. Equal fractions, neither
         larger.</li>
         <li><strong>D</strong> gets it backwards: they are equal at every hit count,
         not only when the search gets everything right.</li>
       </ul>`
    )}

    <p>The habit worth keeping: a precision or recall score means little on its own.
    Write down <strong>k</strong> and the <strong>number of relevant sentences</strong>
    next to every score you report, work out the best possible value, and judge the
    score against that.</p>
  `;

  window.SectionContent = window.SectionContent || {};
  window.SectionContent["retrieval-practice"] = {
    title: "Practice: Precision and Recall in Search",
    html,
  };
})();
