"""
embed_words.py — generate REAL embeddings for a fixed word list, once.

Uses ChromaDB's default embedder (the all-MiniLM-L6-v2 model, 384 dims,
no API key, runs locally). Writes word-embeddings.json next to this file;
Claude reads that file and bakes the vectors into the embeddings section.

Run once:
    pip install chromadb
    python3 embed_words.py

First run downloads the model (~80 MB) to a local cache; after that it's
offline. If you'd rather not install chromadb, see the sentence-transformers
alternative at the bottom.
"""

import json
import os

# ---- Edit this list freely (keep it to ~8-12 words for a clean section) ----
WORDS = ["king", "queen", "man", "woman", "cat", "dog", "car", "truck", "banana", "ocean"]

# ---- ChromaDB's default embedder = all-MiniLM-L6-v2, 384-dim, local, no key
from chromadb.utils import embedding_functions

ef = embedding_functions.DefaultEmbeddingFunction()
vectors = ef(WORDS)  # list of 384-float lists, one per word

data = {w: [round(float(x), 6) for x in v] for w, v in zip(WORDS, vectors)}

out_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "word-embeddings.json")
with open(out_path, "w") as f:
    json.dump(data, f)

dims = len(next(iter(data.values())))
print(f"Wrote {out_path}")
print(f"{len(WORDS)} words x {dims} dimensions")

# ---------------------------------------------------------------------------
# Alternative without chromadb (same model):
#     pip install sentence-transformers
#     from sentence_transformers import SentenceTransformer
#     m = SentenceTransformer("all-MiniLM-L6-v2")
#     vectors = m.encode(WORDS, normalize_embeddings=True)
# (then build `data` and write the file exactly as above)
# ---------------------------------------------------------------------------
