"use client";

import { useEffect, useRef, useState } from "react";

export default function OptimisticUiDemo() {
  const timer = useRef<number | null>(null);
  useEffect(() => () => { if (timer.current !== null) window.clearTimeout(timer.current); }, []);
  const [rejectNext, setRejectNext] = useState(false);
  const [complete, setComplete] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("Changes appear immediately in the interface.");
  const toggle = () => {
    if (pending) return;
    const previous = complete;
    const next = !previous;
    setComplete(next);
    setPending(true);
    setMessage("Updated locally. Waiting for the simulated server…");
    timer.current = window.setTimeout(() => {
      if (rejectNext) {
        setRejectNext(false);
        setComplete(previous);
        setMessage("The server rejected the change. The interface rolled back.");
      } else {
        setMessage("The simulated server accepted the change.");
      }
      setPending(false);
      timer.current = null;
    }, 900);
  };
  return (
    <div className="bn-demo-surface">
      <div className="bn-demo-task">
        <span className={"bn-demo-check " + (complete ? "is-complete" : "")} aria-hidden="true">{complete ? "✓" : ""}</span>
        <div><strong>Prepare the job card</strong><small>{complete ? "Marked complete" : "Still in progress"}</small></div>
        <button type="button" className="bn-demo-primary" onClick={toggle} disabled={pending}>{pending ? "Saving…" : complete ? "Undo" : "Mark complete"}</button>
      </div>
      <label className="bn-demo-reject"><input type="checkbox" disabled={pending} checked={rejectNext} onChange={(event) => setRejectNext(event.target.checked)} /> Reject the next simulated save</label>
      <p className="bn-demo-feedback" role="status">{message}</p>
      <button type="button" className="bn-demo-secondary" disabled={pending} onClick={() => { setRejectNext(false); setComplete(false); setPending(false); setMessage("Example reset."); }}>Reset example</button>
    </div>
  );
}
