import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  decodeHtmlEntities,
  formatRichText,
  markdownToHtml,
  parseRichBlocks,
  toPlainText,
} from "../lib/richText";
import { validateBlogContent, validateContent } from "../lib/admin/types";

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

test("regression: &nbsp; and entities never render literally in headings or hyperlinks", () => {
  const html = `<h3 style="color: rgb(0, 0, 0); font-family: Verdana;">Famous&nbsp;astrologer Kali Charan Ji<br></h3>
<p style="font-size: 11px;">Meet the <a data-mce-href="https://old.example.com" href="/services/famous-astrologer-in-delhi"><strong>Best Astrologer in&nbsp;Delhi</strong></a> for vashikaran &amp; love&rsquo;s guidance.</p>`;

  const blocks = parseRichBlocks(html);
  assert.equal(blocks.length, 2);
  assert.equal(blocks[0].type, "h3");
  assert.equal(blocks[0].text, "Famous astrologer Kali Charan Ji");
  assert.ok(!blocks[0].text.includes("&nbsp;"));

  assert.equal(blocks[1].type, "p");
  const renderedPara = renderToStaticMarkup(React.createElement(React.Fragment, null, formatRichText(blocks[1].text)));
  assert.ok(!renderedPara.includes("&amp;nbsp;"));
  assert.ok(!renderedPara.includes("&nbsp;"));
  assert.ok(!renderedPara.includes("&amp;amp;"));
  assert.ok(!renderedPara.includes("&amp;rsquo;"));
  assert.ok(renderedPara.includes('href="/services/famous-astrologer-in-delhi"'));
  assert.ok(!renderedPara.includes("old.example.com"));
  assert.ok(renderedPara.includes("<strong>Best Astrologer in Delhi</strong>"));
  assert.ok(renderedPara.includes("love\u2019s guidance"));
});

test("regression: nested <p> inside <h2> unwraps cleanly and preserves hyperlinks", () => {
  const dirty = `<h2 style="color: rgb(0, 0, 0); font-family: Verdana, Arial, Helvetica, sans-serif;"><p style="color: rgb(0, 0, 0); font-size: 11px; font-weight: 400;"><strong><a href="/services/vashikaran-specialist" data-mce-href="https://stale.example.com">Vashikaran Specialist New York</a></strong>&nbsp;Pandit Kali Charan helps with vashikaran &amp; peace.</p></h2>`;

  const blocks = parseRichBlocks(dirty);
  assert.equal(blocks.length, 1);
  assert.equal(blocks[0].type, "p");

  const rendered = renderToStaticMarkup(React.createElement("div", null, formatRichText(blocks[0].text)));
  assert.ok(rendered.includes('href="/services/vashikaran-specialist"'));
  assert.ok(!rendered.includes("stale.example.com"));
  assert.ok(rendered.includes("<strong><a"));
  assert.ok(rendered.includes(">Vashikaran Specialist New York</a></strong> Pandit Kali Charan"));
  assert.ok(!rendered.includes("&amp;nbsp;"));
});

test("regression: headings with inline links and arbitrary span/font tags render cleanly", () => {
  const headingWithLink = `<h2><a href="/services/love-back">Ex Love&nbsp;Back</a> &amp; Relationship Help</h2>`;
  const blocks = parseRichBlocks(headingWithLink);
  assert.equal(blocks.length, 1);
  assert.equal(blocks[0].type, "h2");

  const renderedH2 = renderToStaticMarkup(React.createElement("h2", null, formatRichText(blocks[0].text)));
  assert.ok(renderedH2.includes('href="/services/love-back"'));
  assert.ok(renderedH2.includes("Ex Love Back"));
  assert.ok(!renderedH2.includes("&nbsp;"));

  const spanAndFont = formatRichText(
    '<span class="Apple-converted-space">Clean</span> and <span style="color: rgb(0, 0, 0); font-family: Verdana; font-size: 11px;">BlackPasted</span> and <font color="#c98818">Golden</font>'
  );
  const renderedSpans = renderToStaticMarkup(React.createElement("p", null, spanAndFont));
  assert.ok(!renderedSpans.includes("&lt;span"));
  assert.ok(!renderedSpans.includes("&lt;font"));
  assert.ok(!renderedSpans.includes("Verdana"));
  assert.ok(!renderedSpans.includes("11px"));
  assert.ok(!renderedSpans.includes("rgb(0, 0, 0)"));
  assert.ok(renderedSpans.includes("color:#c98818"));
  assert.ok(renderedSpans.includes("Clean and BlackPasted and "));
});

test("decodeHtmlEntities, toPlainText, validateContent, and validateBlogContent normalize entities", () => {
  assert.equal(decodeHtmlEntities("Famous&nbsp;Astrologer &amp; Expert&#39;s"), "Famous Astrologer & Expert's");
  assert.equal(toPlainText("<p>Hello&nbsp;<strong>[World](/w)</strong>!</p>"), "Hello World!");

  const validatedServices = validateContent({
    updatedAt: null,
    services: [
      {
        id: "love-1",
        slug: "famous-astrologer-in-delhi",
        title: "Famous&nbsp;Astrologer in&nbsp;Delhi",
        text: "<p>Best&nbsp;service &amp; care</p>",
        content: '<h3>Famous&nbsp;astrologer Kali Charan Ji<br></h3><p><a data-mce-href="/old" href="/new">Link&nbsp;Text</a></p>',
        img: "/assets/img/service/love-problem-realistic.webp",
        group: "love",
        visible: true,
      },
    ],
  });
  assert.equal(validatedServices.services[0].title, "Famous Astrologer in Delhi");
  assert.ok(!validatedServices.services[0].content.includes("&nbsp;"));
  assert.ok(!validatedServices.services[0].content.includes("data-mce-href"));

  const validatedBlogs = validateBlogContent({
    updatedAt: null,
    blogs: [
      {
        id: "blog-1",
        slug: "test-blog",
        title: "Love &amp; Marriage&nbsp;Remedies",
        excerpt: "Summary with&nbsp;non-breaking space",
        content: "<h3>Subheading&nbsp;Here</h3><p>Body&nbsp;text</p>",
        img: "/assets/img/service/love-problem-realistic.webp",
        category: "Love&nbsp;Problem",
        author: "Astrologer&nbsp;Kali Charan",
        date: "2026-11-10",
        readTime: "3 min read",
        visible: true,
      },
    ],
  });
  assert.equal(validatedBlogs.blogs[0].title, "Love & Marriage Remedies");
  assert.equal(validatedBlogs.blogs[0].category, "Love Problem");
  assert.equal(validatedBlogs.blogs[0].author, "Astrologer Kali Charan");
  assert.ok(!validatedBlogs.blogs[0].content.includes("&nbsp;"));
});
