import { bench, describe } from "vitest";
import { chunkMarkdownText, chunkText } from "../src/auto-reply/chunk.js";
import { chunkMarkdownIR, markdownToIR } from "../src/markdown/ir.js";
import { markdownToWhatsApp } from "../src/markdown/whatsapp.js";
import { makeMarkdownDocument } from "./fixtures.js";

const smallDoc = makeMarkdownDocument(5);
const largeDoc = makeMarkdownDocument(100);
const largeIR = markdownToIR(largeDoc);

describe("markdown IR", () => {
  bench("markdownToIR - small document", () => {
    markdownToIR(smallDoc);
  });

  bench("markdownToIR - large document", () => {
    markdownToIR(largeDoc);
  });

  bench("chunkMarkdownIR - large document", () => {
    chunkMarkdownIR(largeIR, 2000);
  });
});

describe("channel formatting", () => {
  bench("markdownToWhatsApp - large document", () => {
    markdownToWhatsApp(largeDoc);
  });

  bench("chunkText - large document", () => {
    chunkText(largeDoc, 2000);
  });

  bench("chunkMarkdownText - large document", () => {
    chunkMarkdownText(largeDoc, 2000);
  });
});
