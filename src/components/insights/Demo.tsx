"use client";

import { lazy, Suspense, useEffect, useRef, useState } from "react";

type DemoType = "debounce" | "duplicate-requests" | "optimistic-ui";
const demos = {
  debounce: lazy(() => import("./demos/DebounceDemo")),
  "duplicate-requests": lazy(() => import("./demos/DuplicateRequestsDemo")),
  "optimistic-ui": lazy(() => import("./demos/OptimisticUiDemo"))
};
const descriptions: Record<DemoType, string> = {
  debounce: "Type quickly and watch the search operation wait until you pause.",
  "duplicate-requests": "Try submitting repeatedly while a simulated request is in progress.",
  "optimistic-ui": "Change an item immediately, then simulate a server rejection to see rollback."
};

export default function Demo({ type }: { type: DemoType }) {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const DemoView = demos[type];
  useEffect(() => {
    const node = host.current;
    if (!node || !("IntersectionObserver" in window)) { setReady(true); return; }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setReady(true);
        observer.disconnect();
      }
    }, { rootMargin: "240px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    <section ref={host} className="bn-demo" aria-label={"Interactive demonstration: " + type.replaceAll("-", " ")}>
      <div className="bn-demo-heading"><span>Interactive demo</span><p>{descriptions[type]}</p></div>
      {ready ? <Suspense fallback={<div className="bn-demo-loading" role="status">Loading demo…</div>}><DemoView /></Suspense> : <div className="bn-demo-loading">Demo loads when it gets close to view.</div>}
      <p className="bn-demo-note">This example runs locally in your browser. It does not contact a server or save data.</p>
    </section>
  );
}
