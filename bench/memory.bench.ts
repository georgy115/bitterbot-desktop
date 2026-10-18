import { bench, describe } from "vitest";
import {
  mergeHybridResults,
  mergeHybridResultsRRF,
  type HybridKeywordResult,
  type HybridVectorResult,
} from "../src/memory/hybrid.js";
import { chunkMarkdown, computeCentroid, cosineSimilarity } from "../src/memory/internal.js";
import { makeEmbedding, makeMarkdownDocument, makeRng } from "./fixtures.js";

const memoryDoc = makeMarkdownDocument(100);

const DIMS = 768;
const query = makeEmbedding(DIMS, 1);
const corpus = Array.from({ length: 200 }, (_, i) => makeEmbedding(DIMS, i + 2));

function makeResults(count: number, seed: number) {
  const rng = makeRng(seed);
  const vector: HybridVectorResult[] = [];
  const keyword: HybridKeywordResult[] = [];
  for (let i = 0; i < count; i += 1) {
    const base = {
      path: `memory/notes-${i % 20}.md`,
      startLine: i * 10,
      endLine: i * 10 + 9,
      source: "memory",
      snippet: `snippet for chunk ${i}`,
      importanceScore: rng(),
      updatedAt: 1_700_000_000_000 + i * 1000,
    };
    vector.push({ ...base, id: `chunk-${i}`, vectorScore: rng() });
    // Half of the keyword hits overlap with vector hits.
    keyword.push({ ...base, id: `chunk-${i + Math.floor(count / 2)}`, textScore: rng() });
  }
  return { vector, keyword };
}

const { vector, keyword } = makeResults(500, 42);

describe("memory indexing", () => {
  bench("chunkMarkdown - large document", () => {
    chunkMarkdown(memoryDoc, { tokens: 256, overlap: 32 });
  });
});

describe("memory vector math", () => {
  bench("cosineSimilarity - 200 x 768d", () => {
    let best = -Infinity;
    for (const emb of corpus) {
      const score = cosineSimilarity(query, emb);
      if (score > best) {
        best = score;
      }
    }
  });

  bench("computeCentroid - 200 x 768d", () => {
    computeCentroid(corpus);
  });
});

describe("memory hybrid search", () => {
  bench("mergeHybridResults - 500 + 500 results", () => {
    mergeHybridResults({ vector, keyword, vectorWeight: 0.7, textWeight: 0.3 });
  });

  bench("mergeHybridResultsRRF - 500 + 500 results", () => {
    mergeHybridResultsRRF({ vector, keyword });
  });
});
