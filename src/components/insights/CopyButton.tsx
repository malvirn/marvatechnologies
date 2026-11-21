"use client";

import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 1800);
    } catch {
      setStatus("failed");
    }
  }

  return (
    <>
      <button type="button" className="bn-code-copy" onClick={copy}>
        {status === "copied" ? "Copied" : status === "failed" ? "Copy unavailable" : "Copy code"}
      </button>
      <span className="bn-visually-hidden" aria-live="polite">
        {status === "copied" ? "Code copied to clipboard." : status === "failed" ? "Could not copy code. Select it manually." : ""}
      </span>
    </>
  );
}
