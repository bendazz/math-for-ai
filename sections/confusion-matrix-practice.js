/* ============================================================
   Section: Practice — The Confusion Matrix  (Evaluation · 2)
   Registered under id "confusion-matrix-practice" (see manifest.js).

   Dedicated practice (per [[concept-sections-no-inline-problems]])
   for the confusion-matrix section ONLY. It sits before
   precision-recall, so precision, recall and F1 are never named here —
   just the four outcomes, building/reading the 2x2 grid, accuracy,
   and the accuracy trap. (evaluation-practice later mixes all three.)

   The point of the set: classification beyond spam. Every problem uses
   a different real classifier (AI-writing detector, strep test, face
   unlock, discharge model, defect camera, pedestrian detector, fraud
   detector, plant-disease app, wildfire camera, comment moderation).
   The recurring lesson: "positive" means whatever the model is
   hunting for / said yes to — not "bad", not "good news". Problem 4
   (a model hunting for patients READY to go home) is built to catch
   students who have learned "positive = the bad thing".

   Format mirrors retrieval-practice: multiple choice (A–D) inside
   T.problem, solution gives the letter, the working, and "why not the
   others". Every distractor is a specific mistake (row vs column
   totals, TP read as "flagged", FP subtracted twice, the mistake share
   instead of accuracy, …). Correct letters: A 3, B 4, C 3, D 3.

   ARITHMETIC (all whole numbers, doable by hand — no calculator):
     Fraud: 200 transactions, 10 fraud, 12 flagged, 8 flagged were fraud
       TP 8, FP 12−8 = 4, FN 10−8 = 2, TN 200−8−4−2 = 186,
       accuracy (8+186)/200 = 194/200 = 97%.
     Plants: TP 18, FN 2, FP 6, TN 74 (100 plants)
       actually diseased 18+2 = 20, app said diseased 18+6 = 24,
       accuracy (18+74)/100 = 92%.
     Wildfire: 1,000 images, 10 fire, model says "no fire" always
       TN 990, FN 10 → accuracy 99%.
     Comments: 100, 5 toxic. A flags nothing → 95/100 = 95%.
       B catches all 5 and flags 10 harmless → TP 5, FP 10, TN 85,
       FN 0 → 90/100 = 90%.

   NO KaTeX in this section (whole-number arithmetic reads better as
   plain numerals, and it removes every $-pairing hazard). No currency
   glyph. Inequalities written in words. No forward lead-in.
   ============================================================ */

(function () {
  const T = window.Toolkit;

  /* A small confusion matrix in the same orientation as the concept
     section: truth down the side, the model's call across the top. */
  const grid = (colYes, colNo, rowYes, rowNo, tp, fn, fp, tn) => {
    const th = "padding:6px 10px;font-size:.85em;color:var(--ink-soft);font-weight:600;text-align:center";
    const side = "padding:6px 10px;font-size:.85em;color:var(--ink-soft);font-weight:600;text-align:right;white-space:nowrap";
    const td = (n, lab) =>
      `<td style="border:1px solid var(--line);padding:10px 14px;text-align:center;min-width:90px">
         <div style="font-size:1.35em;font-weight:700">${n}</div>
         <div style="font-size:.78em;color:var(--ink-soft)">${lab}</div></td>`;
    return `<div style="overflow-x:auto;margin:12px 0"><table style="border-collapse:collapse;margin:0 auto">
      <tr><td></td><td style="${th}">${colYes}</td><td style="${th}">${colNo}</td></tr>
      <tr><td style="${side}">${rowYes}</td>${td(tp, "TP")}${td(fn, "FN")}</tr>
      <tr><td style="${side}">${rowNo}</td>${td(fp, "FP")}${td(tn, "TN")}</tr>
    </table></div>`;
  };

  const html = `
    ${(T.resetProblems(), "")}
    <div class="eyebrow">Evaluation · 2</div>
    <h1>Practice: The Confusion Matrix</h1>

    <p>Spam filters are only one kind of yes-or-no AI. The same four outcomes show up any time a model
    makes a two-way call: a medical test, a fraud alarm, a camera watching for fire, a detector
    deciding whether an essay was written by AI. This set moves the confusion matrix off the spam
    folder and into all of those.</p>

    <p>The one habit that makes every problem easy: <strong>before you name anything, decide what the
    model is looking for.</strong> That thing is the "positive", whatever it is.</p>

    ${T.callout(
      `<strong>Everything you need:</strong>
       <ul>
         <li><strong>Positive</strong> = the model said <em>yes, I found the thing I'm looking for</em>.
         <strong>Negative</strong> = it said <em>no</em>. "Positive" is not "good" or "bad"; it's just
         whatever the model is hunting for.</li>
         <li><strong>True</strong> = the model was right. <strong>False</strong> = it was wrong.</li>
         <li><strong>TP</strong>: said yes, and right. <strong>FP</strong>: said yes, but wrong (a false
         alarm). <strong>FN</strong>: said no, but wrong (a miss). <strong>TN</strong>: said no, and
         right.</li>
         <li>In the grid, the truth runs down the side and the model's call runs across the top. A
         <strong>row</strong> total counts what was <em>really</em> there (TP + FN is everything that
         really was positive). A <strong>column</strong> total counts what the model <em>said</em> (TP + FP
         is everything it said yes to).</li>
         <li><strong>Accuracy</strong> = (TP + TN) ÷ everything. It is the share the model got right,
         and it can look great while the model misses every positive.</li>
       </ul>
       Every problem is multiple choice: commit to an answer before you open the solution.`,
      { label: "Cheat sheet" }
    )}

    <h2>Name the outcome</h2>

    ${T.problem(
      `<p>A college runs essays through an <strong>AI-writing detector</strong> that flags essays it
       believes were written by AI. A student wrote their essay entirely on their own, and the detector
       flags it. Which outcome is this?</p>
       <ol type="A">
         <li>True Positive</li>
         <li>False Positive</li>
         <li>False Negative</li>
         <li>True Negative</li>
       </ol>`,
      `<p><strong>B — False Positive</strong></p>
       <p>The detector is hunting for AI-written essays, so a flag is a <strong>positive</strong>. The
       essay was not AI-written, so the flag was <strong>wrong</strong>. Said yes, and wrong: a false
       positive, a false alarm. For the student, it's also an accusation of cheating.</p>
       <p>Why not the others:</p>
       <ul>
         <li><strong>True Positive</strong> treats "it got flagged" as the whole story. True/False is
         whether the flag was <em>right</em>, and this one wasn't.</li>
         <li><strong>False Negative</strong> would mean the detector said "not AI" and was wrong: an
         AI-written essay slipping through.</li>
         <li><strong>True Negative</strong> is an honest essay that <em>wasn't</em> flagged.</li>
       </ul>`
    )}

    ${T.problem(
      `<p>A rapid <strong>strep test</strong> checks a throat swab for strep bacteria. It comes back
       negative. A lab culture of the same swab later shows the patient <em>does</em> have strep. Which
       outcome was the rapid test?</p>
       <ol type="A">
         <li>True Negative</li>
         <li>False Positive</li>
         <li>True Positive</li>
         <li>False Negative</li>
       </ol>`,
      `<p><strong>D — False Negative</strong></p>
       <p>The test is looking for strep, so "negative" means it said <em>no strep</em>. The patient had
       strep, so it was <strong>wrong</strong>. Said no, and wrong: a <strong>miss</strong>. This is the
       dangerous kind for a medical test: a sick patient goes home untreated.</p>
       <p>Why not the others:</p>
       <ul>
         <li><strong>True Negative</strong> copies the word "negative" from the result but forgets to ask
         whether it was right.</li>
         <li><strong>False Positive</strong> gets "false" right but flips what the test said. It said
         no, so the second word is Negative.</li>
         <li><strong>True Positive</strong> describes the lab culture (it found strep, correctly), not the
         rapid test.</li>
       </ul>`
    )}

    ${T.problem(
      `<p>A phone's <strong>face unlock</strong> is a classifier. Its "positive" is <em>this is the
       owner</em>, and a positive unlocks the phone. The owner's identical twin picks it up, and it
       unlocks. Which outcome is this?</p>
       <ol type="A">
         <li>True Positive</li>
         <li>False Negative</li>
         <li>False Positive</li>
         <li>True Negative</li>
       </ol>`,
      `<p><strong>C — False Positive</strong></p>
       <p>The phone said <strong>yes, it's the owner</strong>: a positive. It isn't the owner, so it was
       <strong>wrong</strong>. A false positive, and for face unlock that's the security hole: someone else
       is in your phone.</p>
       <p>Why not the others:</p>
       <ul>
         <li><strong>A</strong> judges the <em>face</em> instead of the <em>call</em>. The faces do
         match, but the question the model answers is "is this the owner?", and the answer it gave was
         wrong.</li>
         <li><strong>False Negative</strong> is the opposite mistake: the real owner is locked out of their
         own phone. Annoying, but not a break-in.</li>
         <li><strong>True Negative</strong> would be the twin getting locked out.</li>
       </ul>`
    )}

    ${T.problem(
      `<p>A hospital tests a model that flags patients who are <strong>ready to be sent home</strong>. It
       flags a patient who is actually still too sick to leave. Which outcome is this?</p>
       <ol type="A">
         <li>False Positive</li>
         <li>False Negative</li>
         <li>True Positive</li>
         <li>True Negative</li>
       </ol>`,
      `<p><strong>A — False Positive</strong></p>
       <p>Read carefully what this model hunts for: <em>ready to go home</em>. So a flag, a
       <strong>positive</strong>, means "send this patient home." The patient wasn't ready, so the flag was
       <strong>wrong</strong>. A false positive.</p>
       <p>Why not the others:</p>
       <ul>
         <li><strong>False Negative</strong> is the answer if you assume "positive" always means "sick".
         It doesn't. Positive is whatever the model is looking for, and this model is looking for
         <em>healthy enough</em>.</li>
         <li><strong>True Positive</strong> ignores that the call was wrong.</li>
         <li><strong>True Negative</strong> is a sick patient the model correctly did <em>not</em> flag.</li>
       </ul>`
    )}

    ${T.problem(
      `<p>A camera on a factory line looks for <strong>cracked parts</strong> and rejects any it finds.
       Which of these is a <strong>True Negative</strong>?</p>
       <ol type="A">
         <li>A good part is rejected.</li>
         <li>A good part passes.</li>
         <li>A cracked part passes.</li>
         <li>A cracked part is rejected.</li>
       </ol>`,
      `<p><strong>B — a good part passes</strong></p>
       <p>The camera hunts for cracks, so "rejected" is a positive and "passes" is a negative. A good
       part that passes: the camera said <em>no crack</em>, and it was right. True Negative.</p>
       <p>Why not the others:</p>
       <ul>
         <li><strong>A</strong> is a False Positive: said "crack," wrong. A good part gets thrown away.</li>
         <li><strong>C</strong> is a False Negative: said "no crack," wrong. A bad part gets shipped.</li>
         <li><strong>D</strong> is a True Positive: said "crack," right.</li>
       </ul>`
    )}

    ${T.problem(
      `<p>A self-driving car runs a <strong>pedestrian detector</strong>: a positive means "there's a
       person ahead, brake." Which kind of mistake is more dangerous?</p>
       <ol type="A">
         <li>A False Positive — the car brakes hard for a shadow.</li>
         <li>Neither — a mistake is a mistake.</li>
         <li>A False Negative — a person is there and the car doesn't see them.</li>
         <li>A True Negative — the road is clear and the car keeps driving.</li>
       </ol>`,
      `<p><strong>C — a False Negative</strong></p>
       <p>A miss means a real person ahead and no braking. A false alarm means a sudden stop for
       nothing: jarring, maybe a fender-bender, but far less serious. The two mistakes are
       <strong>not</strong> equally bad, which is exactly why we keep FP and FN in separate cells
       instead of just counting "wrong".</p>
       <p>Why not the others:</p>
       <ul>
         <li><strong>A</strong> is a real cost, but the smaller one here.</li>
         <li><strong>B</strong> is what a single accuracy number assumes. The whole reason to look inside
         the matrix is that different mistakes cost different amounts.</li>
         <li><strong>D</strong> isn't a mistake at all: clear road, no braking, correct.</li>
       </ul>
       <p>Notice this flips from the essay detector in the first problem, where the false positive
       (an honest student accused) was the one that really hurts. Which mistake is worse depends on the
       job, not on the math.</p>`
    )}

    <h2>Build and read a matrix</h2>

    <p>A bank's <strong>fraud detector</strong> reviews <strong>200</strong> card transactions. Afterward,
    investigators find that <strong>10</strong> of them were really fraud. The detector flagged
    <strong>12</strong> transactions, and <strong>8</strong> of those flagged were really fraud.</p>

    ${T.problem(
      `<p><strong>Fraud detector</strong> (200 transactions, 10 really fraud, 12 flagged, 8 flagged were
       really fraud). How many <strong>false positives</strong>?</p>
       <ol type="A">
         <li>4</li>
         <li>2</li>
         <li>12</li>
         <li>186</li>
       </ol>`,
      `<p><strong>A — 4</strong></p>
       <p>A false positive is a flag that was wrong. Of the 12 flagged transactions, 8 were really
       fraud, so the other 12 − 8 = <strong>4</strong> were honest purchases that got flagged.</p>
       <p>Why not the others:</p>
       <ul>
         <li><strong>2</strong> is 10 − 8: fraud that <em>wasn't</em> flagged. Those are the false
         negatives.</li>
         <li><strong>12</strong> is everything flagged, right and wrong together. That's TP + FP, a
         column total.</li>
         <li><strong>186</strong> is the true negatives.</li>
       </ul>`
    )}

    ${T.problem(
      `<p><strong>Fraud detector</strong> (200 transactions, 10 really fraud, 12 flagged, 8 flagged were
       really fraud). How many <strong>true negatives</strong>?</p>
       <ol type="A">
         <li>190</li>
         <li>184</li>
         <li>188</li>
         <li>186</li>
       </ol>`,
      `<p><strong>D — 186</strong></p>
       <p>Fill in the other three cells first: TP = 8, FP = 4, FN = 10 − 8 = 2. Everything else is a true
       negative: 200 − 8 − 4 − 2 = <strong>186</strong>.</p>
       ${grid("Flagged", "Not flagged", "Really fraud", "Really honest", 8, 2, 4, 186)}
       <p>Check: the four cells add to 8 + 2 + 4 + 186 = 200. ✓</p>
       <p>Why not the others:</p>
       <ul>
         <li><strong>190</strong> is 200 − 10, every honest transaction. But 4 of those were flagged, so
         they're false positives, not true negatives.</li>
         <li><strong>184</strong> is 200 − 12 − 4: it subtracts the 4 false positives twice, since they
         are already inside the 12.</li>
         <li><strong>188</strong> is 200 − 12, everything not flagged. But 2 of those were fraud that
         slipped through, so they're false negatives.</li>
       </ul>`
    )}

    ${T.problem(
      `<p><strong>Fraud detector</strong> (TP 8, FP 4, FN 2, TN 186, out of 200). What is its
       <strong>accuracy</strong>?</p>
       <ol type="A">
         <li>93%</li>
         <li>97%</li>
         <li>80%</li>
         <li>67%</li>
       </ol>`,
      `<p><strong>B — 97%</strong></p>
       <p>Accuracy = (TP + TN) ÷ everything = (8 + 186) ÷ 200 = 194 ÷ 200 = <strong>97%</strong>. (By
       hand: 194 out of 200 is the same as 97 out of 100.)</p>
       <p>Why not the others:</p>
       <ul>
         <li><strong>93%</strong> is 186 ÷ 200: only the true negatives. The fraud it correctly caught
         counts as right too.</li>
         <li><strong>80%</strong> is 8 ÷ 10, the share of the fraud it caught. That's a real and useful
         number, but it isn't accuracy.</li>
         <li><strong>67%</strong> is 8 ÷ 12, the share of its flags that were right. Also useful, also not
         accuracy.</li>
       </ul>`
    )}

    <p>A gardening app looks at a photo of a plant and says whether it is <strong>diseased</strong>.
    Tested on <strong>100</strong> plants that experts had already checked, it produced this matrix:</p>

    ${grid("App said diseased", "App said healthy", "Really diseased", "Really healthy", 18, 2, 6, 74)}

    ${T.problem(
      `<p><strong>Plant app</strong> (TP 18, FN 2, FP 6, TN 74). How many of the 100 plants were
       <strong>really diseased</strong>?</p>
       <ol type="A">
         <li>24</li>
         <li>18</li>
         <li>20</li>
         <li>26</li>
       </ol>`,
      `<p><strong>C — 20</strong></p>
       <p>"Really diseased" is a <strong>row</strong>: the plants the app caught plus the ones it
       missed. TP + FN = 18 + 2 = <strong>20</strong>.</p>
       <p>Why not the others:</p>
       <ul>
         <li><strong>24</strong> is TP + FP = 18 + 6: the <strong>column</strong>, how many times the
         app <em>said</em> diseased. Six of those were healthy plants.</li>
         <li><strong>18</strong> counts only the diseased plants the app caught. The 2 it missed were
         diseased too.</li>
         <li><strong>26</strong> is 18 + 2 + 6: every cell except the true negatives, mixing a row with a
         column.</li>
       </ul>`
    )}

    ${T.problem(
      `<p><strong>Plant app</strong> (TP 18, FN 2, FP 6, TN 74). What is its
       <strong>accuracy</strong>?</p>
       <ol type="A">
         <li>92%</li>
         <li>18%</li>
         <li>74%</li>
         <li>8%</li>
       </ol>`,
      `<p><strong>A — 92%</strong></p>
       <p>(TP + TN) ÷ everything = (18 + 74) ÷ 100 = 92 ÷ 100 = <strong>92%</strong>. The green diagonal
       over the whole table.</p>
       <p>Why not the others:</p>
       <ul>
         <li><strong>18%</strong> counts only the true positives as correct.</li>
         <li><strong>74%</strong> counts only the true negatives as correct.</li>
         <li><strong>8%</strong> is (2 + 6) ÷ 100, the share it got <em>wrong</em>. Accuracy is the other
         92%.</li>
       </ul>`
    )}

    <h2>Accuracy and its trap</h2>

    ${T.problem(
      `<p>A forest service tests a <strong>wildfire camera</strong> on 1,000 images; <strong>10</strong>
       of them show fire. The model is broken and answers "no fire" to every single image. What is its
       accuracy?</p>
       <ol type="A">
         <li>1%</li>
         <li>99%</li>
         <li>0% — it never found a fire</li>
         <li>90%</li>
       </ol>`,
      `<p><strong>B — 99%</strong></p>
       <p>It says "no fire" 1,000 times. That's right on the 990 images with no fire (true negatives) and
       wrong on the 10 fires (false negatives). Accuracy = (0 + 990) ÷ 1,000 = <strong>99%</strong>.</p>
       <p>A camera that has never detected a fire in its life, scoring 99%. That's the
       <strong>accuracy trap</strong>: when the thing you're hunting for is rare, saying "no" to
       everything is almost always right, and completely useless. The matrix gives it away instantly:
       the TP cell is 0.</p>
       <p>Why not the others:</p>
       <ul>
         <li><strong>1%</strong> is 10 ÷ 1,000, the share of images that had fire.</li>
         <li><strong>C</strong> describes how many fires it caught (none), not its accuracy. That's the
         point: accuracy doesn't show it.</li>
         <li><strong>90%</strong> is a slip in the arithmetic: 990 out of 1,000 is 99%, not 90%.</li>
       </ul>`
    )}

    ${T.problem(
      `<p>Two <strong>comment-moderation</strong> models are tested on 100 comments, and
       <strong>5</strong> of those comments are genuinely toxic.</p>
       <ul>
         <li><strong>Model A</strong> flags nothing.</li>
         <li><strong>Model B</strong> flags all 5 toxic comments, and also flags 10 harmless ones.</li>
       </ul>
       <p>Which statement is true?</p>
       <ol type="A">
         <li>Model A is better: 95% accuracy beats 90%.</li>
         <li>They're equally good, since each makes some mistakes.</li>
         <li>Model B's accuracy is 100%, because it caught every toxic comment.</li>
         <li>Model B has the lower accuracy, but it's the only one doing its job.</li>
       </ol>`,
      `<p><strong>D</strong></p>
       <p>Model A: TP 0, FP 0, FN 5, TN 95. Accuracy = 95 ÷ 100 = 95%, and it has caught
       <strong>nothing</strong>.</p>
       <p>Model B: TP 5, FP 10, FN 0, TN 85. Accuracy = (5 + 85) ÷ 100 = 90%. It catches every toxic
       comment; the cost is 10 harmless ones sent to a human to double-check.</p>
       <p>The model with the higher accuracy is the useless one. Accuracy alone ranks them backwards;
       the four cells tell the real story.</p>
       <p>Why not the others:</p>
       <ul>
         <li><strong>A</strong> falls straight into the accuracy trap.</li>
         <li><strong>B</strong> ignores <em>which</em> mistakes: Model A misses every toxic comment, while
         Model B's mistakes are false alarms.</li>
         <li><strong>C</strong> confuses "caught every toxic comment" with "got everything right." Its 10
         false positives are mistakes, and they count against accuracy.</li>
       </ul>`
    )}

    <p>The habit worth keeping: for any yes-or-no AI, first say out loud what it's hunting for (that's
    the positive), then look at all four cells before you trust a single score.</p>
  `;

  window.SectionContent = window.SectionContent || {};
  window.SectionContent["confusion-matrix-practice"] = {
    title: "Practice: The Confusion Matrix",
    html,
  };
})();
