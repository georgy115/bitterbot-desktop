/** Deterministic fixtures shared by the benchmarks (no randomness → stable results). */

export function makeMarkdownDocument(sections: number): string {
  const parts: string[] = [];
  for (let i = 0; i < sections; i += 1) {
    parts.push(
      `## Section ${i}`,
      "",
      `This is **paragraph ${i}** with _emphasis_, ~~strikethrough~~, \`inline code\` and a [link](https://example.com/${i}).`,
      "",
      "- first bullet item",
      "- second bullet with **bold** text",
      "  - nested bullet",
      "1. ordered one",
      "2. ordered two",
      "",
      "> a quoted line of wisdom",
      "",
      "```ts",
      `const value${i} = compute(${i});`,
      "console.log(value);",
      "```",
      "",
      "| Name | Value |",
      "| ---- | ----- |",
      `| key${i} | ${i * 7} |`,
      "",
    );
  }
  return parts.join("\n");
}

/** Linear congruential generator for reproducible pseudo-random numbers. */
export function makeRng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x1_0000_0000;
  };
}

export function makeEmbedding(dims: number, seed: number): number[] {
  const rng = makeRng(seed);
  return Array.from({ length: dims }, () => rng() * 2 - 1);
}
