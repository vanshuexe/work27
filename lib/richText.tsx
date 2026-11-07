import React from "react";
import Link from "next/link";

export type RichBlock =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] };

/**
 * Parses inline rich text formatting:
 * - Markdown links: [Anchor Text](/services/url or https://...)
 * - HTML links: <a href="...">Anchor Text</a>
 * - Bold: **Bold Text**
 * - Italic: *Italic Text*
 */
export function formatRichText(text: string): React.ReactNode {
  if (!text) return null;

  // Pattern matches:
  // 1. [text](url) -> match[2] = text, match[3] = url
  // 2. <a href="url">text</a> -> match[4] = url, match[5] = text
  // 3. **text** -> match[6] = text
  // 4. *text* -> match[7] = text
  const tokenRegex = /(\[([^\]]+)\]\(([^)]+)\)|<a\s+[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>|\*\*([^*]+)\*\*|(?<!\*)\*([^*]+)\*(?!\*))/gi;

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

    if (fullMatch.startsWith("[") && match[2] && match[3]) {
      // Markdown link
      const linkText = match[2];
      const href = match[3].trim();
      const isInternal = href.startsWith("/") || href.startsWith("#");

      nodes.push(
        isInternal ? (
          <Link key={key} href={href} className="content-link">
            {formatBoldOnly(linkText)}
          </Link>
        ) : (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="content-link"
          >
            {formatBoldOnly(linkText)}
          </a>
        )
      );
    } else if (fullMatch.toLowerCase().startsWith("<a") && (match[4] || match[5])) {
      // HTML <a> link
      const href = match[4]?.trim() || "#";
      const linkText = match[5] || href;
      const isInternal = href.startsWith("/") || href.startsWith("#");

      nodes.push(
        isInternal ? (
          <Link key={key} href={href} className="content-link">
            {formatBoldOnly(linkText)}
          </Link>
        ) : (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="content-link"
          >
            {formatBoldOnly(linkText)}
          </a>
        )
      );
    } else if (fullMatch.startsWith("**") && fullMatch.endsWith("**") && match[6]) {
      // Bold
      nodes.push(<strong key={key}>{match[6]}</strong>);
    } else if (fullMatch.startsWith("*") && fullMatch.endsWith("*") && match[7]) {
      // Italic
      nodes.push(<em key={key}>{match[7]}</em>);
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

function formatBoldOnly(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  if (parts.length === 1) return text;
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
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

/**
 * Parses markdown blocks (Headings ## / ###, Bullets -, *, •, Numbered lists 1., and paragraphs)
 */
export function parseRichBlocks(raw: string): RichBlock[] {
  if (!raw) return [];
  const blocks: RichBlock[] = [];
  const paras = raw.split(/\n\s*\n/);

  for (const para of paras) {
    const trimmed = para.trim();
    if (!trimmed) continue;
    const lines = trimmed.split("\n").map((l) => l.trim()).filter(Boolean);
    processLines(lines, blocks);
  }

  return blocks;
}
