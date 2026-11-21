"use client";

import { useEffect, useRef, useState } from "react";

export default function DuplicateRequestsDemo() {
  const inFlight = useRef(false);
  const timer = useRef<number | null>(null);
  useEffect(() => () => { if (timer.current !== null) window.clearTimeout(timer.current); }, []);
  const [pending, setPending] = useState(false);
  const [accepted, setAccepted] = useState(0);
  const [ignored, setIgnored] = useState(0);
  const submit = () => {
    if (inFlight.current) { setIgnored((count) => count + 1); return; }
    inFlight.current = true;
    setPending(true);
    timer.current = window.setTimeout(() => {
      setAccepted((count) => count + 1);
      setPending(false);
      inFlight.current = false;
      timer.current = null;
    }, 1200);
  };
  return (
    <div className="bn-demo-surface">
      <div className="bn-demo-order"><span>Sample order</span><strong>ORD-DEMO-001</strong><small>Idempotency key: demo-order-001</small></div>
      <button type="button" className="bn-demo-primary" onClick={submit}>{pending ? "Submitting…" : "Submit order"}</button>
      <div className="bn-demo-stats"><span>{pending ? "Request in progress" : "Ready for a new request"}</span><strong>{accepted} completed</strong></div>
      <p className="bn-demo-feedback" aria-live="polite">{ignored ? ignored + " repeated click(s) ignored while the first request was running." : "Try clicking several times quickly."}</p>
      <p className="bn-demo-note">The in-flight guard protects this UI. A real server still needs idempotency and transaction safeguards.</p>
      <button type="button" className="bn-demo-secondary" disabled={pending} onClick={() => { inFlight.current = false; setPending(false); setAccepted(0); setIgnored(0); }}>Reset example</button>
    </div>
  );
}
