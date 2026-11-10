import React from "react";
import Link from "next/link";

export type RichBlock =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] };

function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

function parseInlineStyle(styleStr: string): React.CSSProperties {
  const styleObj: Record<string, string> = {};
  if (!styleStr) return styleObj;
  const pairs = styleStr.split(";");
  for (const pair of pairs) {
    const [key, val] = pair.split(":");
    if (key && val) {
      const camelKey = key.trim().replace(/-([a-z])/g, (_, g) => g.toUpperCase());
      styleObj[camelKey] = val.trim();
    }
  }
  return styleObj;
}

/**
 * Parses inline rich text formatting for both HTML tags and Markdown syntax:
 * - Markdown links: [Anchor Text](/services/url or https://...)
 * - HTML links: <a href="...">Anchor Text</a>
 * - Bold: <strong>, <b>, **text**
 * - Italic: <em>, <i>, *text*
 * - Underline: <u>
 * - Span style: <span style="...">
 * - Line break: <br>
 */
export function formatRichText(text: string): React.ReactNode {
  if (!text) return null;

  const tokenRegex =
    /(<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>|\[([^\]]+)\]\(([^)]+)\)|<(?:strong|b)(?:\s+[^>]*)?>([\s\S]*?)<\/(?:strong|b)>|\*\*([^*]+)\*\*|<(?:em|i)(?:\s+[^>]*)?>([\s\S]*?)<\/(?:em|i)>|(?<!\*)\*([^*]+)\*(?!\*)|<u(?:\s+[^>]*)?>([\s\S]*?)<\/u>|<span\s+style=["']([^"']+)["'][^>]*>([\s\S]*?)<\/span>|<br\s*\/?>)/gi;

  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(text)) !== null) {
    const matchIndex = match.index;
    if (matchIndex > lastIndex) {
      nodes.push(text.slice(lastIndex, matchIndex));
    }

    const fullMatch = match[0];
    const key = `rt-${matchIndex}`;

    if (match[2] !== undefined) {
      // HTML <a href="url">text</a>
      const href = match[2].trim() || "#";
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
      const href = match[5].trim();
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
    } else if (match[11] !== undefined && match[12] !== undefined) {
      // <span style="...">
      nodes.push(
        <span key={key} style={parseInlineStyle(match[11])}>
          {formatRichText(match[12])}
        </span>
      );
    } else if (fullMatch.toLowerCase().startsWith("<br")) {
      nodes.push(<br key={key} />);
    } else {
      nodes.push(fullMatch);
    }

    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes.length === 1 ? nodes[0] : <React.Fragment>{nodes}</React.Fragment>;
}

function processLines(lines: string[], blocks: RichBlock[]) {
  let currentPara: string[] = [];
  let currentList: { type: "ul" | "ol"; items: string[] } | null = null;

  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (currentPara.length > 0) {
        blocks.push({ type: "p", text: currentPara.join(" ") });
        currentPara = [];
      }
      if (currentList) {
        blocks.push(currentList);
        currentList = null;
      }
      blocks.push({ type: "h2", text: line.replace(/^##\s+/, "").trim() });
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
      blocks.push({ type: "h3", text: line.replace(/^###\s+/, "").trim() });
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
      currentList.items.push(bulletMatch[1]);
    } else if (orderedMatch) {
      if (currentPara.length > 0) {
        blocks.push({ type: "p", text: currentPara.join(" ") });
        currentPara = [];
      }
      if (!currentList || currentList.type !== "ol") {
        if (currentList) blocks.push(currentList);
        currentList = { type: "ol", items: [] };
      }
      currentList.items.push(orderedMatch[1]);
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
  if (currentList) {
    blocks.push(currentList);
  }
}

function parseHtmlBlocks(html: string): RichBlock[] {
  const blocks: RichBlock[] = [];
  const blockRegex = /<(h2|h3|h4|ul|ol|p|div|blockquote)(?:\s+[^>]*)?>([\s\S]*?)<\/\1>/gi;
  let match: RegExpExecArray | null;

  while ((match = blockRegex.exec(html)) !== null) {
    const tag = match[1].toLowerCase();
    const inner = match[2].trim();
    if (!inner) continue;

    if (tag === "h2") {
      blocks.push({ type: "h2", text: stripTags(inner) });
    } else if (tag === "h3" || tag === "h4") {
      blocks.push({ type: "h3", text: stripTags(inner) });
    } else if (tag === "ul") {
      const items: string[] = [];
      const liMatches = inner.matchAll(/<li(?:\s+[^>]*)?>([\s\S]*?)<\/li>/gi);
      for (const li of liMatches) {
        const itemText = li[1].trim();
        if (itemText) items.push(itemText);
      }
      if (items.length > 0) {
        blocks.push({ type: "ul", items });
      }
    } else if (tag === "ol") {
      const items: string[] = [];
      const liMatches = inner.matchAll(/<li(?:\s+[^>]*)?>([\s\S]*?)<\/li>/gi);
      for (const li of liMatches) {
        const itemText = li[1].trim();
        if (itemText) items.push(itemText);
      }
      if (items.length > 0) {
        blocks.push({ type: "ol", items });
      }
    } else if (tag === "p" || tag === "blockquote" || tag === "div") {
      if (/<(h2|h3|h4|ul|ol|p)[^>]*>/i.test(inner)) {
        blocks.push(...parseHtmlBlocks(inner));
      } else {
        blocks.push({ type: "p", text: inner });
      }
    }
  }

  if (blocks.length === 0) {
    const lines = html.split("\n").map((l) => l.trim()).filter(Boolean);
    processLines(lines, blocks);
  }

  return blocks;
}

/**
 * Parses markdown or HTML blocks (Headings h2/h3, Bullets ul/ol, paragraphs)
 */
export function parseRichBlocks(raw: string): RichBlock[] {
  if (!raw) return [];
  const trimmed = raw.trim();
  if (/<(p|h2|h3|h4|ul|ol|div|blockquote)[^>]*>/i.test(trimmed)) {
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
  return text
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="content-link">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "<em>$1</em>");
}

/**
 * Converts markdown text to clean semantic HTML for editing in the WYSIWYG editor
 */
export function markdownToHtml(raw: string): string {
  if (!raw) return "";
  const trimmed = raw.trim();
  if (/<(p|h2|h3|h4|ul|ol|div|blockquote)[^>]*>/i.test(trimmed)) {
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
