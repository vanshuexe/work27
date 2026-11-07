"use client";

import React from "react";
import { formatRichText, parseRichBlocks } from "@/lib/richText";

export default function LiveContentPreview({
  content,
  title,
}: {
  content: string;
  title?: string;
}) {
  const blocks = parseRichBlocks(content);

  return (
    <div className="admin-live-preview-box">
      <div className="admin-live-preview-header">
        <span>👁️ Live Content Preview (Formatting &amp; Links Active)</span>
      </div>

      <div className="admin-live-preview-body">
        {title && <h2 className="sdc__h2" style={{ marginTop: 0 }}>{title}</h2>}
        {blocks.length === 0 ? (
          <p style={{ color: "var(--a-muted)", fontStyle: "italic" }}>
            Nothing written yet. Type your content or remedies above.
          </p>
        ) : (
          blocks.map((block, idx) => {
            if (block.type === "h2") {
              return (
                <h2 key={idx} className="sdc__h2">
                  {block.text}
                </h2>
              );
            }
            if (block.type === "h3") {
              return (
                <h3 key={idx} className="sdc__h3">
                  {block.text}
                </h3>
              );
            }
            if (block.type === "ul") {
              return (
                <ul key={idx} className="sdc__ul sdc__ul--standalone">
                  {block.items.map((item, lIdx) => (
                    <li key={lIdx}>
                      <span>{formatRichText(item)}</span>
                    </li>
                  ))}
                </ul>
              );
            }
            if (block.type === "ol") {
              return (
                <ol key={idx} className="sdc__ol sdc__ol--standalone">
                  {block.items.map((item, lIdx) => (
                    <li key={lIdx}>
                      <span className="sdc__ol-num">{lIdx + 1}</span>
                      <span>{formatRichText(item)}</span>
                    </li>
                  ))}
                </ol>
              );
            }
            return (
              <p key={idx} className="sdc__para">
                {formatRichText(block.text)}
              </p>
            );
          })
        )}
      </div>
    </div>
  );
}

