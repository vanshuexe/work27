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
import { markdownToHtml } from "@/lib/richText";
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
  { name: "Warm Amber", hex: "#f59e0b" },
  { name: "Pure White", hex: "#ffffff" },
  { name: "Soft Cream", hex: "#fef3c7" },
  { name: "Emerald Green", hex: "#10b981" },
  { name: "Ruby Red", hex: "#ef4444" },
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

export default function RichWysiwygEditor({
  value,
  onChange,
  placeholder = "Start typing your content here... Click Bold (B), Headings or Bullets to format instantly!",
  title,
  minHeight = 280,
}: RichWysiwygEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isTypingRef = useRef(false);
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
    if (!editorRef.current) return;
    if (value === lastEmittedHtmlRef.current) return;
    if (document.activeElement === editorRef.current) return;

    const currentHtml = editorRef.current.innerHTML;
    const targetHtml = markdownToHtml(value || "");
    const finalHtml = targetHtml.trim() ? targetHtml : "<p><br></p>";
    if (currentHtml !== finalHtml) {
      editorRef.current.innerHTML = finalHtml;
    }
  }, [value]);

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
    isTypingRef.current = true;
    const html = editorRef.current.innerHTML;
    lastEmittedHtmlRef.current = html;
    onChange(html);
    updateActiveFormats();
    setTimeout(() => {
      isTypingRef.current = false;
    }, 100);
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
    const hasSelection = sel && !sel.isCollapsed;
    if (hasSelection) {
      handleInput();
    }
    updateActiveFormats();
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
        setLinkText(selection.toString());
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
    if (!linkUrl.trim()) {
      setShowLinkModal(false);
      return;
    }

    const cleanUrl = linkUrl.trim();
    const cleanText = linkText.trim() || cleanUrl;
    const isInternal = cleanUrl.startsWith("/") || cleanUrl.startsWith("#");
    const targetAttr = openNewTab || !isInternal ? ' target="_blank" rel="noopener noreferrer"' : "";
    const htmlSnippet = `<a href="${cleanUrl}"${targetAttr} class="content-link">${cleanText}</a>`;

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
    const snippet = `<p><a href="${telUrl}" class="content-link" style="color: #c98818; font-weight: bold;">📞 Call Astrologer Kali Charan: ${PHONE}</a></p>`;
    exec("insertHTML", snippet);
  }

  // Apply custom text color
  function applyColor(hex: string) {
    exec("foreColor", hex);
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
              if (isCodeMode && editorRef.current) {
                editorRef.current.innerHTML = value;
              }
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
            style={{ color: "#f59e0b" }}
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
            style={{ color: "#25d366" }}
          >
            <MessageCircle size={15} />
          </button>
          <button
            type="button"
            className="wysiwyg-btn"
            onMouseDown={(e) => e.preventDefault()}
            onClick={insertCallLink}
            title="Insert Direct Call Link"
            style={{ color: "#c98818" }}
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
                      border: "1px solid rgba(255,255,255,0.3)",
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
                onClick={() => applyColor("#f7f1e6")}
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
            style={{ color: showPreview ? "#fbbf24" : "var(--a-text)" }}
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
          onChange={(e) => onChange(e.target.value)}
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
                className="admin-icon-btn"
                onClick={() => setShowLinkModal(false)}
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
