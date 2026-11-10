import React from "react";
import Link from "next/link";
import { cleanRichHtmlArtifacts, decodeHtmlEntities, toPlainText } from "./htmlSanitize";

export { cleanRichHtmlArtifacts, decodeHtmlEntities, toPlainText };

export type RichBlock =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] };

function isIgnoredPasteColor(val: string): boolean {
  const norm = val.trim().toLowerCase().replace(/\s+/g, "");
  return (
    norm === "black" ||
    norm === "#000" ||
    norm === "#000000" ||
    norm === "rgb(0,0,0)" ||
    norm === "rgba(0,0,0,1)" ||
    norm === "white" ||
    norm === "#fff" ||
    norm === "#ffffff" ||
    norm === "rgb(255,255,255)" ||
    norm === "#f7f1e6" ||
    norm === "rgb(247,241,230)" ||
    norm === "inherit" ||
    norm === "initial" ||
    norm === "unset"
  );
}

function parseSafeInlineStyle(styleStr: string): React.CSSProperties {
  const styleObj: React.CSSProperties = {};
  if (!styleStr) return styleObj;
  const pairs = styleStr.split(";");
  for (const pair of pairs) {
    const colonIdx = pair.indexOf(":");
    if (colonIdx === -1) continue;
    const rawKey = pair.slice(0, colonIdx).trim().toLowerCase();
    const val = pair.slice(colonIdx + 1).trim();
    if (!rawKey || !val) continue;

    if (rawKey === "color") {
      if (!isIgnoredPasteColor(val)) {
        styleObj.color = val;
      }
    } else if (rawKey === "font-weight" && /^(bold|[6-9]00)$/i.test(val)) {
      styleObj.fontWeight = val;
    } else if (rawKey === "font-style" && /^italic$/i.test(val)) {
      styleObj.fontStyle = "italic";
    } else if (rawKey === "text-decoration" && /underline|line-through/i.test(val)) {
      styleObj.textDecoration = val;
    }
  }
  return styleObj;
}

function extractAttr(attrs: string, attrName: string): string | null {
  if (!attrs) return null;
  const regex = new RegExp(`(?:^|\\s)${attrName}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i");
  const match = regex.exec(attrs);
  if (!match) return null;
  return match[1] ?? match[2] ?? match[3] ?? null;
}

function sanitizeHref(rawHref: string): string {
  const decoded = decodeHtmlEntities(rawHref).trim();
  if (!decoded) return "#";
  const lower = decoded.replace(/[\s\u0000-\u001F]+/g, "").toLowerCase();
  if (lower.startsWith("javascript:") || lower.startsWith("vbscript:") || lower.startsWith("data:")) {
    return "#";
  }
  return decoded;
}

/**
 * Parses inline rich text formatting for both HTML tags and Markdown syntax:
 * - Markdown links: [Anchor Text](/services/url or https://...)
 * - HTML links: <a href="...">Anchor Text</a> (ignores TinyMCE data-mce-href)
 * - Bold: <strong>, <b>, **text**
 * - Italic: <em>, <i>, *text*
 * - Underline: <u>
 * - Strikethrough: <s>, <del>, <strike>
 * - Span / Font styles: <span ...>, <font ...>
 * - Line break: <br>
 * - Automatically decodes &nbsp;, &amp;, &rsquo;, etc. in all text slices
 */
export function formatRichText(text: string): React.ReactNode {
  if (!text) return null;

  const normalizedInput = cleanRichHtmlArtifacts(text);

  const tokenRegex =
    /(<a\s+(?:[^>]*?\s)?href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>|\[([^\]]+)\]\(([^)]+)\)|<(?:strong|b)(?:\s+[^>]*)?>([\s\S]*?)<\/(?:strong|b)>|\*\*([^*]+)\*\*|<(?:em|i)(?:\s+[^>]*)?>([\s\S]*?)<\/(?:em|i)>|(?<!\*)\*([^*]+)\*(?!\*)|<u(?:\s+[^>]*)?>([\s\S]*?)<\/u>|<(?:s|del|strike)(?:\s+[^>]*)?>([\s\S]*?)<\/(?:s|del|strike)>|<span([^>]*)>([\s\S]*?)<\/span>|<font([^>]*)>([\s\S]*?)<\/font>|<br\s*\/?>|<\/?(?:span|font|div|p|section|article|blockquote|a)[^>]*>)/gi;

  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(normalizedInput)) !== null) {
    if (match[0].length === 0) {
      tokenRegex.lastIndex++;
      continue;
    }

    const matchIndex = match.index;
    if (matchIndex > lastIndex) {
      const plainChunk = decodeHtmlEntities(normalizedInput.slice(lastIndex, matchIndex));
      if (plainChunk) nodes.push(plainChunk);
    }

    const fullMatch = match[0];
    const key = `rt-${matchIndex}`;

    if (match[2] !== undefined) {
      // HTML <a href="url">text</a>
      const href = sanitizeHref(match[2]);
      const inner = match[3] || href;
      const isInternal = href.startsWith("/") || href.startsWith("#");

      nodes.push(
        isInternal ? (
          <Link key={key} href={href} className="content-link">
            {formatRichText(inner)}
          </Link>
        ) : (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="content-link"
          >
            {formatRichText(inner)}
          </a>
        )
      );
    } else if (match[4] !== undefined && match[5] !== undefined) {
      // Markdown [text](url)
      const linkText = match[4];
      const href = sanitizeHref(match[5]);
      const isInternal = href.startsWith("/") || href.startsWith("#");

      nodes.push(
        isInternal ? (
          <Link key={key} href={href} className="content-link">
            {formatRichText(linkText)}
          </Link>
        ) : (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="content-link"
          >
            {formatRichText(linkText)}
          </a>
        )
      );
    } else if (match[6] !== undefined) {
      // <strong> or <b>
      nodes.push(<strong key={key}>{formatRichText(match[6])}</strong>);
    } else if (match[7] !== undefined) {
      // **bold**
      nodes.push(<strong key={key}>{formatRichText(match[7])}</strong>);
    } else if (match[8] !== undefined) {
      // <em> or <i>
      nodes.push(<em key={key}>{formatRichText(match[8])}</em>);
    } else if (match[9] !== undefined) {
      // *italic*
      nodes.push(<em key={key}>{formatRichText(match[9])}</em>);
    } else if (match[10] !== undefined) {
      // <u>
      nodes.push(<u key={key}>{formatRichText(match[10])}</u>);
    } else if (match[11] !== undefined) {
      // <s>, <del>, <strike>
      nodes.push(<del key={key}>{formatRichText(match[11])}</del>);
    } else if (match[12] !== undefined && match[13] !== undefined) {
      // <span ...>
      const styleAttr = extractAttr(match[12], "style") || "";
      const safeStyle = parseSafeInlineStyle(styleAttr);
      const innerNodes = formatRichText(match[13]);
      if (Object.keys(safeStyle).length > 0) {
        nodes.push(
          <span key={key} style={safeStyle}>
            {innerNodes}
          </span>
        );
      } else {
        nodes.push(<React.Fragment key={key}>{innerNodes}</React.Fragment>);
      }
    } else if (match[14] !== undefined && match[15] !== undefined) {
      // <font ...> (emitted by Chrome execCommand("foreColor"))
      const colorAttr = extractAttr(match[14], "color") || "";
      const safeStyle = parseSafeInlineStyle(colorAttr ? `color: ${colorAttr}` : "");
      const innerNodes = formatRichText(match[15]);
      if (Object.keys(safeStyle).length > 0) {
        nodes.push(
          <span key={key} style={safeStyle}>
            {innerNodes}
          </span>
        );
      } else {
        nodes.push(<React.Fragment key={key}>{innerNodes}</React.Fragment>);
      }
    } else if (/^<br/i.test(fullMatch)) {
      nodes.push(<br key={key} />);
    }
    // Stray unmatched wrapper tags (<span...>, </span>, <font>, <div>, <p>, <o:p>, <a> without href) are dropped cleanly

    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < normalizedInput.length) {
    const trailing = decodeHtmlEntities(normalizedInput.slice(lastIndex));
    if (trailing) nodes.push(trailing);
  }

  if (nodes.length === 0) return null;
  return nodes.length === 1 ? nodes[0] : <React.Fragment>{nodes}</React.Fragment>;
}

function processLines(lines: string[], blocks: RichBlock[]) {
  let currentPara: string[] = [];
  let currentList: { type: "ul" | "ol"; items: string[] } | null = null;

  for (const rawLine of lines) {
    const line = cleanRichHtmlArtifacts(rawLine).trim();
    if (!line) continue;

    if (line.startsWith("## ")) {
      if (currentPara.length > 0) {
        blocks.push({ type: "p", text: currentPara.join(" ") });
        currentPara = [];
      }
      if (currentList) {
        blocks.push(currentList);
        currentList = null;
      }
      const h2Text = line.replace(/^##\s+/, "").trim();
      if (h2Text) blocks.push({ type: "h2", text: h2Text });
      continue;
    }

    if (line.startsWith("### ")) {
      if (currentPara.length > 0) {
        blocks.push({ type: "p", text: currentPara.join(" ") });
        currentPara = [];
      }
      if (currentList) {
        blocks.push(currentList);
        currentList = null;
      }
      const h3Text = line.replace(/^###\s+/, "").trim();
      if (h3Text) blocks.push({ type: "h3", text: h3Text });
      continue;
    }

    const bulletMatch = line.match(/^[-*•]\s*(.*)$/);
    const orderedMatch = line.match(/^\d+\.\s*(.*)$/);

    if (bulletMatch) {
      if (currentPara.length > 0) {
        blocks.push({ type: "p", text: currentPara.join(" ") });
        currentPara = [];
      }
      if (!currentList || currentList.type !== "ul") {
        if (currentList) blocks.push(currentList);
        currentList = { type: "ul", items: [] };
      }
      if (bulletMatch[1].trim()) currentList.items.push(bulletMatch[1].trim());
    } else if (orderedMatch) {
      if (currentPara.length > 0) {
        blocks.push({ type: "p", text: currentPara.join(" ") });
        currentPara = [];
      }
      if (!currentList || currentList.type !== "ol") {
        if (currentList) blocks.push(currentList);
        currentList = { type: "ol", items: [] };
      }
      if (orderedMatch[1].trim()) currentList.items.push(orderedMatch[1].trim());
    } else {
      if (currentList) {
        blocks.push(currentList);
        currentList = null;
      }
      currentPara.push(line);
    }
  }

  if (currentPara.length > 0) {
    blocks.push({ type: "p", text: currentPara.join(" ") });
  }
  if (currentList && currentList.items.length > 0) {
    blocks.push(currentList);
  }
}

function cleanBlockInner(inner: string): string {
  return cleanRichHtmlArtifacts(inner)
    .replace(/^(?:\s*<br\s*\/?>\s*)+/gi, "")
    .replace(/(?:\s*<br\s*\/?>\s*)+$/gi, "")
    .trim();
}

function hasNestedBlockTags(inner: string): boolean {
  return /<(?:h[1-6]|ul|ol|p|div|blockquote)(?:\s[^>]*)?>/i.test(inner);
}

/**
 * Depth-aware top-level HTML block parser so nested <div> or malformed <h2><p>...</p></h2>
 * split cleanly, headings preserve inline links/bold with decoded entities, and unwrapped gaps
 * between HTML tags are never dropped.
 */
function parseHtmlBlocks(html: string): RichBlock[] {
  const cleanedHtml = cleanRichHtmlArtifacts(html);
  const blocks: RichBlock[] = [];
  const tagRegex = /<(\/?)(h1|h2|h3|h4|h5|h6|ul|ol|p|div|blockquote)(?:\s[^>]*)?>/gi;

  let currentTag: string | null = null;
  let contentStart = 0;
  let depth = 0;
  let cursor = 0;

  const pushGapText = (gap: string) => {
    const trimmedGap = cleanBlockInner(gap);
    if (!trimmedGap) return;
    // Strip stray unmatched closing block tags in malformed inputs
    const sanitizedGap = trimmedGap.replace(/<\/?(?:h[1-6]|ul|ol|p|div|blockquote)(?:\s[^>]*)?>/gi, "").trim();
    if (!sanitizedGap) return;
    const lines = sanitizedGap.split("\n").map((l) => l.trim()).filter(Boolean);
    processLines(lines, blocks);
  };

  const handleClosedBlock = (tag: string, rawInner: string) => {
    const inner = cleanBlockInner(rawInner);
    if (!inner) return;

    if (tag === "h1" || tag === "h2" || tag === "h3" || tag === "h4" || tag === "h5" || tag === "h6") {
      if (hasNestedBlockTags(inner)) {
        blocks.push(...parseHtmlBlocks(inner));
        return;
      }
      // Strip decorative wrapper tags inside headings while keeping inline links & emphasis
      const headingInner = cleanRichHtmlArtifacts(inner)
        .replace(/<\/?(?:span|font)(?:\s[^>]*)?>/gi, "")
        .trim();
      const visibleCheck = headingInner.replace(/<[^>]*>/g, "").trim();
      if (!visibleCheck) return;
      blocks.push({
        type: tag === "h1" || tag === "h2" ? "h2" : "h3",
        text: headingInner.includes("<")
          ? headingInner
          : decodeHtmlEntities(headingInner),
      });
    } else if (tag === "ul" || tag === "ol") {
      const items: string[] = [];
      const liMatches = inner.matchAll(/<li(?:\s+[^>]*)?>([\s\S]*?)<\/li>/gi);
      for (const li of liMatches) {
        const cleanLi = cleanBlockInner(
          li[1].replace(/^<p(?:\s+[^>]*)?>([\s\S]*?)<\/p>$/gi, "$1")
        );
        if (cleanLi) items.push(cleanLi);
      }
      if (items.length > 0) {
        blocks.push({ type: tag, items });
      }
    } else if (tag === "p" || tag === "blockquote" || tag === "div") {
      if (hasNestedBlockTags(inner)) {
        blocks.push(...parseHtmlBlocks(inner));
      } else {
        const visibleCheck = decodeHtmlEntities(inner.replace(/<[^>]*>/g, "")).trim();
        if (visibleCheck) {
          blocks.push({ type: "p", text: inner });
        }
      }
    }
  };

  let match: RegExpExecArray | null;
  while ((match = tagRegex.exec(cleanedHtml)) !== null) {
    const isClosing = match[1] === "/";
    const tag = match[2].toLowerCase();

    if (currentTag === null) {
      if (isClosing) continue;
      if (match.index > cursor) {
        pushGapText(cleanedHtml.slice(cursor, match.index));
      }
      currentTag = tag;
      contentStart = match.index + match[0].length;
      depth = 1;
    } else if (tag === currentTag) {
      if (!isClosing) {
        depth++;
      } else {
        depth--;
        if (depth === 0) {
          const inner = cleanedHtml.slice(contentStart, match.index);
          const closedTag = currentTag;
          currentTag = null;
          cursor = match.index + match[0].length;
          handleClosedBlock(closedTag, inner);
        }
      }
    }
  }

  if (currentTag !== null && depth > 0) {
    handleClosedBlock(currentTag, cleanedHtml.slice(contentStart));
  } else if (cursor < cleanedHtml.length) {
    pushGapText(cleanedHtml.slice(cursor));
  }

  if (blocks.length === 0) {
    const lines = cleanedHtml.split("\n").map((l) => l.trim()).filter(Boolean);
    processLines(lines, blocks);
  }

  return blocks;
}

/**
 * Parses markdown or HTML blocks (Headings h2/h3, Bullets ul/ol, paragraphs)
 */
export function parseRichBlocks(raw: string): RichBlock[] {
  if (!raw) return [];
  const trimmed = cleanRichHtmlArtifacts(raw).trim();
  if (/<(?:p|h[1-6]|ul|ol|div|blockquote)(?:\s[^>]*)?>/i.test(trimmed)) {
    return parseHtmlBlocks(trimmed);
  }

  const blocks: RichBlock[] = [];
  const paras = trimmed.split(/\n\s*\n/);

  for (const para of paras) {
    const pTrim = para.trim();
    if (!pTrim) continue;
    const lines = pTrim.split("\n").map((l) => l.trim()).filter(Boolean);
    processLines(lines, blocks);
  }

  return blocks;
}

function inlineMarkdownToHtml(text: string): string {
  if (!text) return "";
  return cleanRichHtmlArtifacts(text)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="content-link">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "<em>$1</em>");
}

/**
 * Converts markdown text to clean semantic HTML for editing in the WYSIWYG editor
 */
export function markdownToHtml(raw: string): string {
  if (!raw) return "";
  const trimmed = cleanRichHtmlArtifacts(raw).trim();
  if (/<(?:p|h[1-6]|ul|ol|div|blockquote)(?:\s[^>]*)?>/i.test(trimmed)) {
    return trimmed;
  }

  const blocks = parseRichBlocks(trimmed);
  if (blocks.length === 0) return `<p>${inlineMarkdownToHtml(trimmed)}</p>`;

  return blocks
    .map((b) => {
      if (b.type === "h2") return `<h2>${inlineMarkdownToHtml(b.text)}</h2>`;
      if (b.type === "h3") return `<h3>${inlineMarkdownToHtml(b.text)}</h3>`;
      if (b.type === "ul") {
        return `<ul>${b.items.map((it) => `<li>${inlineMarkdownToHtml(it)}</li>`).join("")}</ul>`;
      }
      if (b.type === "ol") {
        return `<ol>${b.items.map((it) => `<li>${inlineMarkdownToHtml(it)}</li>`).join("")}</ol>`;
      }
      return `<p>${inlineMarkdownToHtml(b.text)}</p>`;
    })
    .join("\n");
}
