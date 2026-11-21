"use client";

import { useState } from "react";
import CopyButton from "@/components/insights/CopyButton";

export default function BeforeAfter({ before, after, beforeLabel = "Before", afterLabel = "After" }: { before: string; after: string; beforeLabel?: string; afterLabel?: string }) {
  const [active, setActive] = useState(0);
  const panels = [{ label: beforeLabel, code: before }, { label: afterLabel, code: after }];
  return (
    <section className="bn-before-after" aria-label="Before and after code comparison">
      <div className="bn-before-after-tabs" role="tablist" aria-label="Choose code version">
        <button type="button" role="tab" aria-selected={active === 0} aria-controls="bn-before-panel" id="bn-before-tab" onClick={() => setActive(0)}>{beforeLabel}</button>
        <button type="button" role="tab" aria-selected={active === 1} aria-controls="bn-after-panel" id="bn-after-tab" onClick={() => setActive(1)}>{afterLabel}</button>
      </div>
      <div className="bn-before-after-grid">
        {panels.map((panel, index) => <section id={index === 0 ? "bn-before-panel" : "bn-after-panel"} role="tabpanel" aria-labelledby={index === 0 ? "bn-before-tab" : "bn-after-tab"} data-active={active === index ? "true" : "false"} className="bn-before-after-panel" key={panel.label}>
          <div className="bn-before-after-label">{panel.label}</div>
          <div className="bn-code"><CopyButton text={panel.code} /><pre tabIndex={0} aria-label={panel.label + " code example"}><code>{panel.code}</code></pre></div>
        </section>)}
      </div>
    </section>
  );
}
