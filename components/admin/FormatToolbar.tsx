"use client";

import React, { useState } from "react";
import {
  Bold,
  Eye,
  Heading2,
  Heading3,
  Link as LinkIcon,
  List,
  ListOrdered,
  MessageCircle,
  Pencil,
  PhoneCall,
  Sparkles,
} from "lucide-react";
import { PHONE } from "@/lib/site";
import { cleanPlainField, cleanRichHtmlArtifacts } from "@/lib/htmlSanitize";

interface FormatToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (val: string) => void;
  showPreview?: boolean;
  onTogglePreview?: () => void;
  allowHeadings?: boolean;
}

export default function FormatToolbar({
  textareaRef,
  value,
  onChange,
  showPreview = false,
  onTogglePreview,
  allowHeadings = true,
}: FormatToolbarProps) {
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  const insertTextAtCursor = (prefix: string, suffix = "", defaultText = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end) || defaultText;

    const before = value.substring(0, start);
    const after = value.substring(end);
    const nextVal = `${before}${prefix}${selected}${suffix}${after}`;

    onChange(nextVal);

    // Reposition cursor
    setTimeout(() => {
      textarea.focus();
      const newCursor = start + prefix.length + selected.length + suffix.length;
      textarea.setSelectionRange(newCursor, newCursor);
    }, 10);
  };

  const handleOpenLinkModal = () => {
    const textarea = textareaRef.current;
    const selected = textarea
      ? value.substring(textarea.selectionStart, textarea.selectionEnd)
      : "";
    setLinkText(selected || "");
    setLinkUrl("");
    setShowLinkModal(true);
  };

  const handleApplyLink = () => {
    const cleanUrl = cleanRichHtmlArtifacts(linkUrl).trim();
    if (!cleanUrl) {
      setShowLinkModal(false);
      return;
    }
    const finalTxt = cleanPlainField(linkText) || cleanUrl;
    const markdown = `[${finalTxt}](${cleanUrl})`;

    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const before = value.substring(0, start);
      const after = value.substring(end);
      onChange(cleanRichHtmlArtifacts(`${before}${markdown}${after}`));
    } else {
      onChange(cleanRichHtmlArtifacts(`${value} ${markdown}`));
    }

    setShowLinkModal(false);
  };

  return (
    <div className="admin-fmt-toolbar-wrap">
      <div className="admin-fmt-toolbar">
        <button
          type="button"
          className="admin-fmt-btn admin-fmt-btn--link"
          onClick={handleOpenLinkModal}
          title="Add Hyperlink (link text to another service, city page, blog, or external URL)"
        >
          <LinkIcon size={14} /> Add Hyperlink
        </button>

        <button
          type="button"
          className="admin-fmt-btn"
          onClick={() => insertTextAtCursor("**", "**", "Bold text")}
          title="Bold (wrap in **text**)"
        >
          <Bold size={14} /> <strong>B</strong>
        </button>

        {allowHeadings && (
          <>
            <button
              type="button"
              className="admin-fmt-btn"
              onClick={() => insertTextAtCursor("\n\n## ", "\n", "Heading Title")}
              title="Heading 2 (## Section Title)"
            >
              <Heading2 size={14} /> H2
            </button>

            <button
              type="button"
              className="admin-fmt-btn"
              onClick={() => insertTextAtCursor("\n\n### ", "\n", "Subheading Title")}
              title="Heading 3 (### Subheading Title)"
            >
              <Heading3 size={14} /> H3
            </button>
          </>
        )}

        <button
          type="button"
          className="admin-fmt-btn"
          onClick={() => insertTextAtCursor("\n• ", "\n", "List point")}
          title="Bullet Point list item"
        >
          <List size={14} /> • List
        </button>

        <button
          type="button"
          className="admin-fmt-btn"
          onClick={() => insertTextAtCursor("\n1. ", "\n", "Step point")}
          title="Numbered list item"
        >
          <ListOrdered size={14} /> 1. List
        </button>

        <button
          type="button"
          className="admin-fmt-btn admin-fmt-btn--wa"
          onClick={() =>
            insertTextAtCursor(
              "[Chat on WhatsApp](https://wa.me/919649331806)",
              "",
              ""
            )
          }
          title="Insert WhatsApp direct consultation link"
        >
          <MessageCircle size={14} /> WhatsApp
        </button>

        <button
          type="button"
          className="admin-fmt-btn admin-fmt-btn--call"
          onClick={() =>
            insertTextAtCursor(
              `[Call Astrologer Kali Charan (${PHONE})](tel:+919649331806)`,
              "",
              ""
            )
          }
          title="Insert Call button link"
        >
          <PhoneCall size={14} /> Call
        </button>

        {onTogglePreview && (
          <button
            type="button"
            className={`admin-fmt-btn admin-fmt-btn--preview ${
              showPreview ? "is-active" : ""
            }`}
            onClick={onTogglePreview}
            title="Preview formatted content and test hyperlinks live"
          >
            {showPreview ? <Pencil size={14} /> : <Eye size={14} />}
            {showPreview ? "Write Mode" : "Live Preview"}
          </button>
        )}
      </div>

      {showLinkModal && (
        <div className="admin-fmt-link-dialog">
          <div className="admin-fmt-link-dialog-inner">
            <span style={{ fontWeight: 700, fontSize: "13px", color: "var(--gold-light)" }}>
              🔗 Insert Hyperlink
            </span>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", color: "#eed5a7" }}>
                Anchor Text (Words that will be clicked)
              </label>
              <input
                type="text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="e.g. love marriage line in a woman's hand"
                style={{
                  background: "#12080d",
                  border: "1px solid rgba(227, 182, 92, 0.4)",
                  color: "#fff",
                  padding: "6px 10px",
                  borderRadius: "6px",
                  fontSize: "13px",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", color: "#eed5a7" }}>
                Target Link (URL or Internal page)
              </label>
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="e.g. /services/love-problem-solution-in-delhi or https://..."
                style={{
                  background: "#12080d",
                  border: "1px solid rgba(227, 182, 92, 0.4)",
                  color: "#fff",
                  padding: "6px 10px",
                  borderRadius: "6px",
                  fontSize: "13px",
                }}
              />
              <small style={{ fontSize: "11px", color: "var(--a-muted)" }}>
                Tip: For internal links use <code>/services/...</code> or <code>/blog/...</code>. For external sites use <code>https://...</code>.
              </small>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "4px" }}>
              <button
                type="button"
                className="admin-button secondary"
                style={{ padding: "4px 10px", fontSize: "12px" }}
                onClick={() => setShowLinkModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="admin-button primary"
                style={{ padding: "4px 12px", fontSize: "12px" }}
                onClick={handleApplyLink}
                disabled={!linkUrl.trim()}
              >
                Insert Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

