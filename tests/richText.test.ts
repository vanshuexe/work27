import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { formatRichText, parseRichBlocks } from "../lib/richText";

test("formatRichText parses markdown links and bold correctly", () => {
  const result = formatRichText("Check the [love marriage line in a woman's hand](/blog/palmistry) for guidance.");
  assert.ok(result);

  const boldResult = formatRichText("Here is **important advice** for your love life.");
  assert.ok(boldResult);

  const htmlLink = formatRichText('Visit <a href="https://example.com">Astrologer site</a> today.');
  assert.ok(htmlLink);
});

test("parseRichBlocks parses headings, bullets and paragraphs", () => {
  const raw = `## Main Section

Some introductory text.

### Key Benefits
• Better relationship understanding
• Improved communication
• Emotional balance

Follow-up paragraph with a [link](/services/love-problem-solution).`;

  const blocks = parseRichBlocks(raw);
  assert.equal(blocks[0].type, "h2");
  assert.equal(blocks[0].text, "Main Section");
  assert.equal(blocks[1].type, "p");
  assert.equal(blocks[2].type, "h3");
  assert.equal(blocks[2].text, "Key Benefits");
  assert.equal(blocks[3].type, "ul");
  if (blocks[3].type === "ul") {
    assert.equal(blocks[3].items.length, 3);
    assert.equal(blocks[3].items[0], "Better relationship understanding");
  }
  assert.equal(blocks[4].type, "p");
});

