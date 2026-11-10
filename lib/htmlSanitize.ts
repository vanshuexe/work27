const NAMED_HTML_ENTITIES: Record<string, string> = {
  nbsp: " ",
  ensp: " ",
  emsp: " ",
  thinsp: " ",
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  rsquo: "\u2019",
  lsquo: "\u2018",
  rdquo: "\u201D",
  ldquo: "\u201C",
  sbquo: "\u201A",
  bdquo: "\u201E",
  ndash: "\u2013",
  mdash: "\u2014",
  hellip: "\u2026",
  bull: "\u2022",
  middot: "\u00B7",
  copy: "\u00A9",
  reg: "\u00AE",
  trade: "\u2122",
  deg: "\u00B0",
  plusmn: "\u00B1",
  times: "\u00D7",
  divide: "\u00F7",
  frac12: "\u00BD",
  laquo: "\u00AB",
  raquo: "\u00BB",
  rarr: "\u2192",
  larr: "\u2190",
  hearts: "\u2665",
  starf: "\u2605",
};

/**
 * Decodes common HTML entities (&nbsp;, &amp;, &quot;, &#39;, numeric entities, etc.)
 * and converts non-breaking spaces (\u00A0) into normal spaces so literal entities never render on screen.
 */
export function decodeHtmlEntities(input: string): string {
  if (!input) return "";
  return input
    .replace(/\u00A0/g, " ")
    .replace(/&([a-zA-Z]+|#\d+|#x[0-9a-fA-F]+);/g, (full, entity: string) => {
      if (entity.startsWith("#x") || entity.startsWith("#X")) {
        const code = Number.parseInt(entity.slice(2), 16);
        if (code === 160) return " ";
        if (code >= 1 && code <= 0x10ffff && (code < 0xd800 || code > 0xdfff)) {
          return String.fromCodePoint(code);
        }
        return full;
      }
      if (entity.startsWith("#")) {
        const code = Number.parseInt(entity.slice(1), 10);
        if (code === 160) return " ";
        if (code >= 1 && code <= 0x10ffff && (code < 0xd800 || code > 0xdfff)) {
          return String.fromCodePoint(code);
        }
        return full;
      }
      const mapped = NAMED_HTML_ENTITIES[entity.toLowerCase()];
      return mapped !== undefined ? mapped : full;
    });
}

/**
 * Normalizes non-breaking spaces and removes pasted TinyMCE/Word artifacts inside HTML strings
 * WITHOUT decoding &lt; / &gt; / &amp; structure before tag parsing.
 */
export function cleanRichHtmlArtifacts(html: string): string {
  if (!html) return "";
  return html
    .replace(/\u00A0/g, " ")
    .replace(/&(?:nbsp|ensp|emsp|thinsp);/gi, " ")
    .replace(/&#0*160;/g, " ")
    .replace(/&#x0*a0;/gi, " ")
    .replace(/\s+data-mce-[a-z0-9_-]+=(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\/?o:p(?:\s+[^>]*)?>/gi, "");
}

/**
 * Cleans plain-text fields (titles, locations, categories, authors) so non-breaking spaces
 * and HTML entities (&nbsp;, &amp;) are decoded cleanly and spaces collapsed.
 */
export function cleanPlainField(input: string): string {
  if (!input) return "";
  return decodeHtmlEntities(cleanRichHtmlArtifacts(input))
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Strips inline wrapper clutter and produces clean readable plain text (used for SEO metadata & cards).
 */
export function toPlainText(input: string): string {
  if (!input) return "";
  const cleaned = cleanRichHtmlArtifacts(input)
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/(?:p|div|h[1-6]|li|blockquote)>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "$1");
  return decodeHtmlEntities(cleaned).replace(/\s+/g, " ").trim();
}

