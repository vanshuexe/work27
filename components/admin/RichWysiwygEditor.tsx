"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code2,
  Eye,
  EyeOff,
  Indent,
  Italic,
  Link2,
  List,
  ListOrdered,
  MessageCircle,
  Outdent,
  Palette,
  PhoneCall,
  Redo,
  RemoveFormatting,
  Strikethrough,
  Underline,
  Undo,
  Unlink,
  X,
} from "lucide-react";
import { cleanRichHtmlArtifacts, markdownToHtml } from "@/lib/richText";
import LiveContentPreview from "./LiveContentPreview";
import { PHONE } from "@/lib/site";

interface RichWysiwygEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  title?: string;
  minHeight?: number;
}

const COLOR_PRESETS = [
  { name: "Astrology Gold", hex: "#c98818" },
  { name: "Vedic Saffron", hex: "#ea580c" },
  { name: "Warm Amber", hex: "#d97706" },
  { name: "Emerald Green", hex: "#10b981" },
  { name: "Ruby Red", hex: "#ef4444" },
  { name: "Crimson Rose", hex: "#e11d48" },
  { name: "Royal Indigo", hex: "#6366f1" },
];

const SUGGESTED_LINKS = [
  { label: "Ex Love Back", url: "/services/get-your-ex-love-back" },
  { label: "Love Marriage", url: "/services/love-marriage-specialist" },
  { label: "Vashikaran Specialist", url: "/services/vashikaran-specialist" },
  { label: "Husband-Wife", url: "/services/husband-wife-problem-solution" },
  { label: "Blog / Remedies", url: "/blog" },
  { label: "Call Consultation", url: `tel:${PHONE.replace(/\s+/g, "")}` },
  { label: "WhatsApp Chat", url: `https://wa.me/${PHONE.replace(/[^0-9]/g, "")}` },
];

const BLOCK_TAG_SET = new Set(["h1", "h2", "h3", "h4", "h5", "h6", "p", "div", "ul", "ol", "blockquote"]);
const DROP_TAG_SET = new Set(["script", "style", "noscript", "iframe", "object", "embed", "meta", "link", "head", "o:p"]);

function escapeHtmlText(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeHtmlAttr(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function sanitizeUrlInput(rawUrl: string): string {
  const cleaned = cleanRichHtmlArtifacts(rawUrl).trim();
  if (!cleaned) return "";
  const lower = cleaned.replace(/[\s\u0000-\u001F]+/g, "").toLowerCase();
  if (lower.startsWith("javascript:") || lower.startsWith("vbscript:") || lower.startsWith("data:")) {
    return "";
  }
  return cleaned;
}

function isIgnoredColor(colorVal: string): boolean {
  const norm = colorVal.trim().toLowerCase().replace(/\s+/g, "");
  return (
    !norm ||
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

/**
 * Sanitizes pasted or legacy TinyMCE/Word HTML in the browser into clean, semantic HTML:
 * - Converts &nbsp; / \u00A0 into regular spaces
 * - Strips pasted invisible colors (rgb(0,0,0) black-on-dark, #fff white-on-light), tiny font sizes & Verdana font
 * - Unwraps malformed <h2><p>...</p></h2> nesting
 * - Drops data-mce-* attributes and junk tags
 */
function sanitizeHtmlForEditor(rawHtml: string): string {
  const preCleaned = cleanRichHtmlArtifacts(rawHtml);
  if (!preCleaned.trim()) return "";
  if (typeof window === "undefined" || typeof DOMParser === "undefined") {
    return preCleaned;
  }

  const doc = new DOMParser().parseFromString(preCleaned, "text/html");

  const hasBlockDescendants = (el: HTMLElement): boolean =>
    el.querySelector("h1,h2,h3,h4,h5,h6,p,div,ul,ol,blockquote") !== null;

  const serializeNode = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = cleanRichHtmlArtifacts(node.textContent || "");
      return escapeHtmlText(text);
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return "";
    }

    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();

    if (DROP_TAG_SET.has(tag)) return "";
    if (tag === "br") return "<br>";

    const childrenHtml = Array.from(el.childNodes).map(serializeNode).join("");

    if (tag === "h1" || tag === "h2" || tag === "h3" || tag === "h4" || tag === "h5" || tag === "h6") {
      if (hasBlockDescendants(el)) {
        return childrenHtml;
      }
      const trimmedHeading = childrenHtml
        .replace(/^(?:\s*<br>\s*)+/gi, "")
        .replace(/(?:\s*<br>\s*)+$/gi, "")
        .trim();
      if (!trimmedHeading) return "";
      const outTag = tag === "h1" || tag === "h2" ? "h2" : "h3";
      return `<${outTag}>${trimmedHeading}</${outTag}>`;
    }

    if (tag === "p" || tag === "blockquote") {
      if (hasBlockDescendants(el)) {
        return childrenHtml;
      }
      if (/^(?:\s*<br>\s*)+$/i.test(childrenHtml)) {
        return "<p><br></p>";
      }
      const cleanedP = childrenHtml
        .replace(/^(?:\s*<br>\s*)+/gi, "")
        .replace(/(?:\s*<br>\s*)+$/gi, "")
        .trim();
      if (!cleanedP) return "";
      const align = el.style?.textAlign?.trim().toLowerCase();
      const alignAttr =
        align === "center" || align === "right" || align === "justify"
          ? ` style="text-align: ${align};"`
          : "";
      return `<${tag}${alignAttr}>${cleanedP}</${tag}>`;
    }

    if (tag === "div") {
      if (hasBlockDescendants(el)) {
        return childrenHtml;
      }
      if (/^(?:\s*<br>\s*)+$/i.test(childrenHtml)) {
        return "<p><br></p>";
      }
      const cleanedDiv = childrenHtml
        .replace(/^(?:\s*<br>\s*)+/gi, "")
        .replace(/(?:\s*<br>\s*)+$/gi, "")
        .trim();
      return cleanedDiv ? `<p>${cleanedDiv}</p>` : "";
    }

    if (tag === "ul" || tag === "ol") {
      return childrenHtml.trim() ? `<${tag}>${childrenHtml}</${tag}>` : "";
    }

    if (tag === "li") {
      const cleanedLi = childrenHtml
        .replace(/^\s*<p(?:\s[^>]*)?>([\s\S]*?)<\/p>\s*$/i, "$1")
        .replace(/^(?:\s*<br>\s*)+/gi, "")
        .replace(/(?:\s*<br>\s*)+$/gi, "")
        .trim();
      return cleanedLi ? `<li>${cleanedLi}</li>` : "";
    }

    if (tag === "strong" || tag === "b") {
      return childrenHtml.trim() ? `<strong>${childrenHtml}</strong>` : "";
    }

    if (tag === "em" || tag === "i") {
      return childrenHtml.trim() ? `<em>${childrenHtml}</em>` : "";
    }

    if (tag === "u") {
      return childrenHtml.trim() ? `<u>${childrenHtml}</u>` : "";
    }

    if (tag === "s" || tag === "del" || tag === "strike") {
      return childrenHtml.trim() ? `<del>${childrenHtml}</del>` : "";
    }

    if (tag === "a") {
      const safeHref = sanitizeUrlInput(el.getAttribute("href") || "");
      if (!safeHref) return childrenHtml;
      const isInternal =
        safeHref.startsWith("/") ||
        safeHref.startsWith("#") ||
        safeHref.startsWith("tel:") ||
        safeHref.startsWith("mailto:");
      const targetAttr = !isInternal ? ' target="_blank" rel="noopener noreferrer"' : "";
      const inlineColor = el.style?.color?.trim() || "";
      const safeColor = inlineColor && !isIgnoredColor(inlineColor) ? `color: ${escapeHtmlAttr(inlineColor)};` : "";
      const styleAttr = safeColor ? ` style="${safeColor}"` : "";
      const inner = childrenHtml || escapeHtmlText(safeHref);
      return `<a href="${escapeHtmlAttr(safeHref)}"${targetAttr} class="content-link"${styleAttr}>${inner}</a>`;
    }

    if (tag === "span" || tag === "font") {
      let wrapped = childrenHtml;
      const fontWeight = el.style?.fontWeight?.trim().toLowerCase() || "";
      if (fontWeight === "bold" || Number.parseInt(fontWeight, 10) >= 600) {
        wrapped = `<strong>${wrapped}</strong>`;
      }
      if (el.style?.fontStyle?.trim().toLowerCase() === "italic") {
        wrapped = `<em>${wrapped}</em>`;
      }
      if (/underline/i.test(el.style?.textDecoration || el.style?.textDecorationLine || "")) {
        wrapped = `<u>${wrapped}</u>`;
      }
      const rawColor = el.style?.color?.trim() || el.getAttribute("color")?.trim() || "";
      if (rawColor && !isIgnoredColor(rawColor)) {
        return `<span style="color: ${escapeHtmlAttr(rawColor)}">${wrapped}</span>`;
      }
      return wrapped;
    }

    if (BLOCK_TAG_SET.has(tag)) {
      return childrenHtml;
    }

    return childrenHtml;
  };

  return Array.from(doc.body.childNodes).map(serializeNode).join("").trim();
}

export default function RichWysiwygEditor({
  value,
  onChange,
  placeholder = "Start typing your content here... Click Bold (B), Headings or Bullets to format instantly!",
  title,
  minHeight = 280,
}: RichWysiwygEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const lastEmittedHtmlRef = useRef<string>("");
  const savedSelectionRangeRef = useRef<Range | null>(null);

  const [isCodeMode, setIsCodeMode] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Link dialog state
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [openNewTab, setOpenNewTab] = useState(false);

  // Active toolbar commands
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
    ul: false,
    ol: false,
    alignLeft: false,
    alignCenter: false,
    alignRight: false,
    alignJustify: false,
  });

  // Initialize and synchronize HTML content safely without jumping caret
  useEffect(() => {
    if (isCodeMode || showPreview) return;
    if (!editorRef.current) return;

    const domIsPopulated = editorRef.current.innerHTML.trim() !== "";
    if (domIsPopulated && value === lastEmittedHtmlRef.current) return;
    if (domIsPopulated && document.activeElement === editorRef.current) return;

    const currentHtml = editorRef.current.innerHTML;
    const htmlFromVal = markdownToHtml(value || "");
    const targetHtml = sanitizeHtmlForEditor(htmlFromVal);
    const finalHtml = targetHtml.trim() ? targetHtml : "<p><br></p>";
    if (currentHtml !== finalHtml) {
      editorRef.current.innerHTML = finalHtml;
      lastEmittedHtmlRef.current = targetHtml;
    }
  }, [value, isCodeMode, showPreview]);

  // Check which formatting states are active at current cursor position
  function updateActiveFormats() {
    if (typeof document === "undefined") return;
    try {
      setActiveFormats({
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        underline: document.queryCommandState("underline"),
        strikeThrough: document.queryCommandState("strikeThrough"),
        ul: document.queryCommandState("insertUnorderedList"),
        ol: document.queryCommandState("insertOrderedList"),
        alignLeft: document.queryCommandState("justifyLeft"),
        alignCenter: document.queryCommandState("justifyCenter"),
        alignRight: document.queryCommandState("justifyRight"),
        alignJustify: document.queryCommandState("justifyFull"),
      });
    } catch {
      // Ignore queryCommandState errors in edge cases
    }
  }

  function handleInput() {
    if (!editorRef.current) return;
    const cleanedHtml = cleanRichHtmlArtifacts(editorRef.current.innerHTML);
    lastEmittedHtmlRef.current = cleanedHtml;
    onChange(cleanedHtml);
    updateActiveFormats();
  }

  function ensureEditorFocus() {
    if (!editorRef.current) return;
    if (document.activeElement !== editorRef.current) {
      editorRef.current.focus();
    }
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !editorRef.current.contains(sel.anchorNode)) {
      const range = document.createRange();
      if (!editorRef.current.hasChildNodes() || editorRef.current.innerHTML.trim() === "") {
        editorRef.current.innerHTML = "<p><br></p>";
      }
      range.selectNodeContents(editorRef.current);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }

  function exec(command: string, arg?: string) {
    ensureEditorFocus();
    document.execCommand(command, false, arg);
    const sel = window.getSelection();
    const isCollapsedToggle =
      (command === "bold" ||
        command === "italic" ||
        command === "underline" ||
        command === "strikeThrough") &&
      sel?.isCollapsed;
    if (!isCollapsedToggle) {
      handleInput();
    }
    updateActiveFormats();
  }

  function handlePaste(e: React.ClipboardEvent<HTMLDivElement>) {
    const htmlData = e.clipboardData?.getData("text/html") || "";
    const plainData = e.clipboardData?.getData("text/plain") || "";

    if (htmlData) {
      e.preventDefault();
      const cleaned = sanitizeHtmlForEditor(htmlData);
      if (cleaned) {
        ensureEditorFocus();
        document.execCommand("insertHTML", false, cleaned);
        handleInput();
      }
      return;
    }

    if (plainData) {
      e.preventDefault();
      const cleanedPlain = cleanRichHtmlArtifacts(plainData);
      ensureEditorFocus();
      document.execCommand("insertText", false, cleanedPlain);
      handleInput();
    }
  }

  // Handle format block dropdown (p, h2, h3, blockquote)
  function handleFormatBlock(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    if (!val) return;
    exec("formatBlock", `<${val}>`);
    e.target.value = "";
  }

  // Save selection before opening link modal
  function openLinkDialog() {
    if (typeof window !== "undefined") {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        savedSelectionRangeRef.current = range.cloneRange();
        setLinkText(cleanRichHtmlArtifacts(selection.toString()));
      } else {
        savedSelectionRangeRef.current = null;
        setLinkText("");
      }
    }
    setLinkUrl("");
    setOpenNewTab(false);
    setShowLinkModal(true);
  }

  function applyLink(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const cleanUrl = sanitizeUrlInput(linkUrl);
    if (!cleanUrl) {
      setShowLinkModal(false);
      return;
    }

    const cleanText = cleanRichHtmlArtifacts(linkText).trim() || cleanUrl;
    const isInternal =
      cleanUrl.startsWith("/") ||
      cleanUrl.startsWith("#") ||
      cleanUrl.startsWith("tel:") ||
      cleanUrl.startsWith("mailto:");
    const targetAttr = openNewTab || !isInternal ? ' target="_blank" rel="noopener noreferrer"' : "";
    const htmlSnippet = `<a href="${escapeHtmlAttr(cleanUrl)}"${targetAttr} class="content-link">${escapeHtmlText(cleanText)}</a>`;

    ensureEditorFocus();

    if (typeof window !== "undefined" && savedSelectionRangeRef.current) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(savedSelectionRangeRef.current);
      }
    }

    // Insert anchor tag
    document.execCommand("insertHTML", false, htmlSnippet);
    handleInput();
    setShowLinkModal(false);
  }

  // Insert quick WhatsApp button
  function insertWhatsAppLink() {
    const waUrl = `https://wa.me/${PHONE.replace(/[^0-9]/g, "")}`;
    const snippet = `<p><a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="content-link" style="color: #25d366; font-weight: bold;">💬 Chat with Astrologer Kali Charan on WhatsApp</a></p>`;
    exec("insertHTML", snippet);
  }

  // Insert quick Call button
  function insertCallLink() {
    const telUrl = `tel:${PHONE.replace(/\s+/g, "")}`;
    const snippet = `<p><a href="${telUrl}" class="content-link" style="color: #c98818; font-weight: bold;">📞 Call Astrologer Kali Charan: ${escapeHtmlText(PHONE)}</a></p>`;
    exec("insertHTML", snippet);
  }

  // Apply custom text color
  function applyColor(hex: string) {
    exec("foreColor", hex);
    setShowColorPicker(false);
  }

  function resetTextColor() {
    exec("removeFormat");
    setShowColorPicker(false);
  }

  return (
    <div className="wysiwyg-wrapper">
      {/* ── Toolbar matching user's requested layout ── */}
      <div className="wysiwyg-toolbar" role="toolbar" aria-label="Rich text editor toolbar">
        {/* Undo / Redo */}
        <div className="wysiwyg-group">
          <button
            type="button"
            className="wysiwyg-btn"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec("undo")}
            title="Undo (Ctrl+Z)"
          >
            <Undo size={15} />
          </button>
          <button
            type="button"
            className="wysiwyg-btn"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec("redo")}
            title="Redo (Ctrl+Y)"
          >
            <Redo size={15} />
          </button>
        </div>

        <span className="wysiwyg-separator" />

        {/* View Mode & Clean */}
        <div className="wysiwyg-group">
          <button
            type="button"
            className={`wysiwyg-btn ${isCodeMode ? "active" : ""}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              lastEmittedHtmlRef.current = "";
              setIsCodeMode(!isCodeMode);
            }}
            title="Toggle HTML Code View (<>)"
          >
            <Code2 size={15} />
          </button>
          <button
            type="button"
            className="wysiwyg-btn"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec("removeFormat")}
            title="Clear Formatting (Tx)"
          >
            <RemoveFormatting size={15} />
          </button>
        </div>

        <span className="wysiwyg-separator" />

        {/* Formats Dropdown */}
        <div className="wysiwyg-group">
          <select
            className="wysiwyg-select"
            defaultValue=""
            onChange={handleFormatBlock}
            title="Paragraph & Heading Formats"
          >
            <option value="" disabled>
              Formats ▾
            </option>
            <option value="p">Paragraph (Normal)</option>
            <option value="h2">Heading 2 (H2)</option>
            <option value="h3">Heading 3 (H3 Subheading)</option>
            <option value="blockquote">Quote / Highlight</option>
          </select>
        </div>

        <span className="wysiwyg-separator" />

        {/* Character Formatting: Bold, Italic, Underline, Strike */}
        <div className="wysiwyg-group">
          <button
            type="button"
            className={`wysiwyg-btn ${activeFormats.bold ? "active" : ""}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec("bold")}
            title="Bold (Ctrl+B) — Choose Bold and start typing directly!"
          >
            <Bold size={15} />
          </button>
          <button
            type="button"
            className={`wysiwyg-btn ${activeFormats.italic ? "active" : ""}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec("italic")}
            title="Italic (Ctrl+I)"
          >
            <Italic size={15} />
          </button>
          <button
            type="button"
            className={`wysiwyg-btn ${activeFormats.underline ? "active" : ""}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec("underline")}
            title="Underline (Ctrl+U)"
          >
            <Underline size={15} />
          </button>
          <button
            type="button"
            className={`wysiwyg-btn ${activeFormats.strikeThrough ? "active" : ""}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec("strikeThrough")}
            title="Strikethrough"
          >
            <Strikethrough size={15} />
          </button>
        </div>

        <span className="wysiwyg-separator" />

        {/* Alignments */}
        <div className="wysiwyg-group">
          <button
            type="button"
            className={`wysiwyg-btn ${activeFormats.alignLeft ? "active" : ""}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec("justifyLeft")}
            title="Align Left"
          >
            <AlignLeft size={15} />
          </button>
          <button
            type="button"
            className={`wysiwyg-btn ${activeFormats.alignCenter ? "active" : ""}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec("justifyCenter")}
            title="Align Center"
          >
            <AlignCenter size={15} />
          </button>
          <button
            type="button"
            className={`wysiwyg-btn ${activeFormats.alignRight ? "active" : ""}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec("justifyRight")}
            title="Align Right"
          >
            <AlignRight size={15} />
          </button>
          <button
            type="button"
            className={`wysiwyg-btn ${activeFormats.alignJustify ? "active" : ""}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec("justifyFull")}
            title="Justify Text"
          >
            <AlignJustify size={15} />
          </button>
        </div>

        <span className="wysiwyg-separator" />

        {/* Bullet and Numbered Lists */}
        <div className="wysiwyg-group">
          <button
            type="button"
            className={`wysiwyg-btn ${activeFormats.ul ? "active" : ""}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec("insertUnorderedList")}
            title="Bullet List (•) — Matches your guidance list"
          >
            <List size={15} />
          </button>
          <button
            type="button"
            className={`wysiwyg-btn ${activeFormats.ol ? "active" : ""}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec("insertOrderedList")}
            title="Numbered List (1. 2.)"
          >
            <ListOrdered size={15} />
          </button>
          <button
            type="button"
            className="wysiwyg-btn"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec("outdent")}
            title="Decrease Indent"
          >
            <Outdent size={15} />
          </button>
          <button
            type="button"
            className="wysiwyg-btn"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec("indent")}
            title="Increase Indent"
          >
            <Indent size={15} />
          </button>
        </div>

        <span className="wysiwyg-separator" />

        {/* Links & Quick Actions */}
        <div className="wysiwyg-group">
          <button
            type="button"
            className="wysiwyg-btn"
            onMouseDown={(e) => e.preventDefault()}
            onClick={openLinkDialog}
            title="Insert / Edit Hyperlink (🔗)"
            style={{ color: "#b45309" }}
          >
            <Link2 size={15} />
            <span style={{ fontSize: "11px", marginLeft: "4px" }}>Link</span>
          </button>
          <button
            type="button"
            className="wysiwyg-btn"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec("unlink")}
            title="Remove Hyperlink"
          >
            <Unlink size={15} />
          </button>
          <button
            type="button"
            className="wysiwyg-btn"
            onMouseDown={(e) => e.preventDefault()}
            onClick={insertWhatsAppLink}
            title="Insert WhatsApp Consultation Link"
            style={{ color: "#16a34a" }}
          >
            <MessageCircle size={15} />
          </button>
          <button
            type="button"
            className="wysiwyg-btn"
            onMouseDown={(e) => e.preventDefault()}
            onClick={insertCallLink}
            title="Insert Direct Call Link"
            style={{ color: "#b45309" }}
          >
            <PhoneCall size={15} />
          </button>
        </div>

        <span className="wysiwyg-separator" />

        {/* Color Palette */}
        <div className="wysiwyg-group" style={{ position: "relative" }}>
          <button
            type="button"
            className="wysiwyg-btn"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setShowColorPicker(!showColorPicker)}
            title="Text Color (A)"
          >
            <Palette size={15} />
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#c98818",
                marginLeft: "4px",
              }}
            />
          </button>

          {showColorPicker && (
            <div className="wysiwyg-color-popover">
              <div style={{ fontSize: "11px", fontWeight: "600", marginBottom: "6px" }}>
                Select Text Color:
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px" }}>
                {COLOR_PRESETS.map((col) => (
                  <button
                    key={col.hex}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => applyColor(col.hex)}
                    title={col.name}
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "4px",
                      background: col.hex,
                      border: "1px solid rgba(15,23,42,0.22)",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
              <button
                type="button"
                className="admin-button secondary"
                style={{ width: "100%", marginTop: "8px", padding: "3px 6px", fontSize: "11px" }}
                onMouseDown={(e) => e.preventDefault()}
                onClick={resetTextColor}
              >
                Reset Color
              </button>
            </div>
          )}
        </div>

        <span className="wysiwyg-separator" />

        {/* Live Preview Toggle */}
        <div className="wysiwyg-group" style={{ marginLeft: "auto" }}>
          <button
            type="button"
            className={`wysiwyg-btn ${showPreview ? "active" : ""}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setShowPreview(!showPreview)}
            title="Live Website Preview"
            style={{ color: showPreview ? "#6e1020" : "#374151" }}
          >
            {showPreview ? <EyeOff size={15} /> : <Eye size={15} />}
            <span style={{ fontSize: "11px", marginLeft: "4px" }}>
              {showPreview ? "Edit Mode" : "Preview"}
            </span>
          </button>
        </div>
      </div>

      {/* ── Editor Canvas Area ── */}
      {showPreview ? (
        <div className="wysiwyg-preview-container">
          <LiveContentPreview content={value} title={title} />
        </div>
      ) : isCodeMode ? (
        <textarea
          className="wysiwyg-code-textarea"
          value={value}
          onChange={(e) => {
            lastEmittedHtmlRef.current = "";
            onChange(cleanRichHtmlArtifacts(e.target.value));
          }}
          placeholder="Edit raw HTML code..."
          style={{ minHeight }}
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          className="wysiwyg-content"
          style={{ minHeight }}
          onInput={handleInput}
          onPaste={handlePaste}
          onKeyDown={() => setTimeout(updateActiveFormats, 10)}
          onKeyUp={updateActiveFormats}
          onMouseUp={updateActiveFormats}
          onSelect={updateActiveFormats}
          data-placeholder={placeholder}
        />
      )}

      {/* ── Link Modal Dialog ── */}
      {showLinkModal && (
        <div className="admin-fmt-link-dialog">
          <div className="admin-fmt-link-card" style={{ maxWidth: "440px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <strong style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Link2 size={16} color="#c98818" /> Insert Hyperlink
              </strong>
              <button
                type="button"
                className="admin-icon-button"
                onClick={() => setShowLinkModal(false)}
                aria-label="Close link dialog"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={applyLink}>
              <label style={{ fontSize: "12px", marginBottom: "4px", display: "block" }}>
                Text to Display:
              </label>
              <input
                type="text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="e.g. love marriage line in a woman's hand"
                style={{ width: "100%", marginBottom: "10px" }}
              />

              <label style={{ fontSize: "12px", marginBottom: "4px", display: "block" }}>
                Web URL / Address:
              </label>
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="e.g. /services/love-marriage-specialist or https://..."
                required
                style={{ width: "100%", marginBottom: "10px" }}
              />

              <div style={{ marginBottom: "12px" }}>
                <span
                  style={{
                    fontSize: "11px",
                    color: "var(--a-muted)",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Quick links:
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  {SUGGESTED_LINKS.map((sug) => (
                    <button
                      key={sug.url}
                      type="button"
                      className="admin-button secondary"
                      style={{ padding: "2px 6px", fontSize: "11px" }}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setLinkUrl(sug.url);
                        if (!linkText) setLinkText(sug.label);
                      }}
                    >
                      {sug.label}
                    </button>
                  ))}
                </div>
              </div>

              <label
                className="admin-checkbox"
                style={{ fontSize: "12px", marginBottom: "14px", display: "flex" }}
              >
                <input
                  type="checkbox"
                  checked={openNewTab}
                  onChange={(e) => setOpenNewTab(e.target.checked)}
                />
                Open link in a new tab
              </label>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                <button
                  type="button"
                  className="admin-button secondary"
                  onClick={() => setShowLinkModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-button primary">
                  Insert Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
