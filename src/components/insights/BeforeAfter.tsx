"use client";

import { Children, useState, type ReactNode } from "react";

export default function BeforeAfter({ children, beforeLabel = "Before", afterLabel = "After" }: { children: ReactNode; beforeLabel?: string; afterLabel?: string }) {
  const panels = Children.toArray(children).filter(Boolean).slice(0, 2);
  const [active, setActive] = useState(0);
  if (panels.length !== 2) return <div className="bn-before-after">{children}</div>;
  return (
    <section className="bn-before-after" aria-label="Before and after comparison">
      <div className="bn-before-after-tabs" role="tablist" aria-label="Choose code version">
        <button type="button" role="tab" aria-selected={active === 0} aria-controls="bn-before-panel" id="bn-before-tab" onClick={() => setActive(0)}>{beforeLabel}</button>
        <button type="button" role="tab" aria-selected={active === 1} aria-controls="bn-after-panel" id="bn-after-tab" onClick={() => setActive(1)}>{afterLabel}</button>
      </div>
      <div className="bn-before-after-grid">
        <div id="bn-before-panel" role="tabpanel" aria-labelledby="bn-before-tab" data-active={active === 0 ? "true" : "false"} className="bn-before-after-panel">
          <span className="bn-before-after-label">{beforeLabel}</span>{panels[0]}
        </div>
        <div id="bn-after-panel" role="tabpanel" aria-labelledby="bn-after-tab" data-active={active === 1 ? "true" : "false"} className="bn-before-after-panel">
          <span className="bn-before-after-label">{afterLabel}</span>{panels[1]}
        </div>
      </div>
    </section>
  );
}
