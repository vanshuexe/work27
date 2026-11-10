import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { formatRichText, parseRichBlocks, markdownToHtml } from "../lib/richText";

test("formatRichText parses markdown links and bold correctly", () => {
  const result = formatRichText("Check the [love marriage line in a woman's hand](/blog/palmistry) for guidance.");
  assert.ok(result);

  const boldResult = formatRichText("Here is **important advice** for your love life.");
  assert.ok(boldResult);

  const htmlLink = formatRichText('Visit <a href="https://example.com">Astrologer site</a> today.');
  assert.ok(htmlLink);

  const htmlBold = formatRichText("Special <strong>Vashikaran Remedies</strong> for you.");
  assert.ok(htmlBold);

  const bTag = formatRichText("Text with <b>bold words</b> here.");
  assert.ok(bTag);

  const italicTag = formatRichText("Text with <i>italic words</i> and <em>em words</em>.");
  assert.ok(italicTag);

  const uTag = formatRichText("Text with <u>underlined words</u> here.");
  assert.ok(uTag);
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

test("parseRichBlocks parses HTML from WYSIWYG editor", () => {
  const html = `<h2>Vedic Consultation</h2>
<p>Introductory paragraph with <strong>bold</strong> words.</p>
<h3>Personalized Guidance</h3>
<ul>
  <li>Better relationship understanding</li>
  <li>Improved communication</li>
  <li>Emotional balance</li>
</ul>
<p>End with a <a href="/services/get-your-ex-love-back">consultation link</a>.</p>`;

  const blocks = parseRichBlocks(html);
  assert.equal(blocks.length, 5);
  assert.equal(blocks[0].type, "h2");
  assert.equal(blocks[0].text, "Vedic Consultation");
  assert.equal(blocks[1].type, "p");
  assert.equal(blocks[2].type, "h3");
  assert.equal(blocks[2].text, "Personalized Guidance");
  assert.equal(blocks[3].type, "ul");
  if (blocks[3].type === "ul") {
    assert.equal(blocks[3].items.length, 3);
    assert.equal(blocks[3].items[0], "Better relationship understanding");
  }
  assert.equal(blocks[4].type, "p");
});

test("markdownToHtml converts markdown correctly into HTML", () => {
  const md = `### Guidance
- Point 1
- Point 2

Paragraph with **bold** text.`;

  const html = markdownToHtml(md);
  assert.ok(html.includes("<h3>Guidance</h3>"));
  assert.ok(html.includes("<li>Point 1</li>"));
  assert.ok(html.includes("<strong>bold</strong>"));
});

