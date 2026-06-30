/* ============================================================
   manifest.js — THE ONLY PLACE that fixes section order.

   This is your living table of contents. To add a section:
     1) create sections/<id>.js  (registers SectionContent[<id>])
     2) add a <script> tag for it in index.html
     3) add a line to the list below

   To reorder the book, just move lines around. To group sections
   under a heading in the sidebar, give them the same `group`.
   `group` is optional — sections without one sit at the top level.
   ============================================================ */

window.SECTIONS = [
  { id: "prob-intro",         title: "What Is Probability?",        group: "Probability" },
  { id: "prob-practice",      title: "Practice: Basic Probability", group: "Probability" },
  { id: "prob-distributions", title: "Probability Distributions",   group: "Probability" },
  { id: "dist-practice",      title: "Practice: Distributions",     group: "Probability" },

  { id: "lab-langflow-setup", title: "Lab 1: Setting Up Your AI Workshop", group: "AI Workshop" },
  { id: "lab-gemini-chatbot", title: "Lab 2: Build a Chatbot with Gemini", group: "AI Workshop" },
  { id: "lab-claude-chatbot", title: "Lab 3: Build a Chatbot with Claude", group: "AI Workshop" },

  { id: "next-word-distribution", title: "The Next Word Is a Distribution", group: "Probability Meets AI" },
  { id: "lab-loop-to-file",       title: "Lab 4: Run a Loop, Save a File",  group: "Probability Meets AI" },
  { id: "tally-your-results",     title: "Your Data: Tabulate the Results", group: "Probability Meets AI" },
  { id: "random-integer",         title: "When “Random” Means 7",           group: "Probability Meets AI" },
  { id: "exponential-function",   title: "The Exponential Function",        group: "Probability Meets AI" },
  { id: "exponential-practice",   title: "Practice: The Exponential Function", group: "Probability Meets AI" },
  { id: "logits-and-sigmoid",     title: "Logits, Odds & Probabilities",    group: "Probability Meets AI" },
  { id: "odds-prob-practice",     title: "Practice: Odds & Probabilities",  group: "Probability Meets AI" },
  { id: "softmax",                title: "Softmax: Scores to a Distribution", group: "Probability Meets AI" },
  { id: "softmax-practice",       title: "Practice: Softmax",                group: "Probability Meets AI" },
  { id: "temperature",            title: "Temperature: The Randomness Knob", group: "Probability Meets AI" },
  { id: "lab-temperature-experiment", title: "Lab 5: Temperature on a Real Model", group: "Probability Meets AI" },

  { id: "vectors-intro",          title: "What Is a Vector?",                group: "Vectors" },
  { id: "states-as-vectors",      title: "Every State Is a Vector",          group: "Vectors" },
  { id: "vector-arithmetic",      title: "Adding and Scaling Vectors",       group: "Vectors" },
  { id: "vector-magnitude",       title: "How Long Is a Vector?",            group: "Vectors" },
  { id: "vector-practice",        title: "Practice: Vector Arithmetic & Length", group: "Vectors" },
  { id: "dot-product",            title: "The Dot Product",                  group: "Vectors" },
  { id: "cosine-similarity",      title: "Cosine Similarity",                group: "Vectors" },
  { id: "dot-cosine-practice",    title: "Practice: Dot Product & Cosine Similarity", group: "Vectors" },

  { id: "embeddings-intro",       title: "What Is an Embedding?",            group: "Embeddings" },
  { id: "lab-word-matcher",       title: "Lab 6: A Tiny Search Engine for Words", group: "Embeddings" },
  { id: "vector-pooling",         title: "Pooling: From Words to Sentences", group: "Embeddings" },
  { id: "lab-sentence-matcher",   title: "Lab 7: A Search Engine for Sentences", group: "Embeddings" },

  { id: "confusion-matrix",       title: "The Confusion Matrix",             group: "Evaluation" },
  { id: "precision-recall",       title: "Precision and Recall",             group: "Evaluation" },
  { id: "threshold-dial",         title: "The Threshold Dial",               group: "Evaluation" },
  { id: "evaluation-practice",    title: "Practice: Evaluating a Classifier", group: "Evaluation" },
  { id: "lab-evaluate-classifier", title: "Lab 8: Build a Spam Filter, Then Grade It", group: "Evaluation" },
];
