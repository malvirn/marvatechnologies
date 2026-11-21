"use client";

import { useEffect, useState } from "react";

export default function DebounceDemo() {
  const [value, setValue] = useState("");
  const [committed, setCommitted] = useState("");
  const [runs, setRuns] = useState(0);
  const [waiting, setWaiting] = useState(false);
  useEffect(() => {
    if (!value.trim()) { setCommitted(""); setWaiting(false); return; }
    setWaiting(true);
    const timer = window.setTimeout(() => {
      setCommitted(value.trim());
      setRuns((count) => count + 1);
      setWaiting(false);
    }, 450);
    return () => window.clearTimeout(timer);
  }, [value]);
  return (
    <div className="bn-demo-surface">
      <label className="bn-demo-label" htmlFor="bn-debounce-input">Try a search</label>
      <input id="bn-debounce-input" className="bn-demo-input" value={value} onChange={(event) => setValue(event.target.value)} placeholder="Type something quickly…" />
      <div className="bn-demo-stats"><span>{waiting ? "Waiting for a pause…" : "No pending search"}</span><strong>{runs} {runs === 1 ? "search" : "searches"} executed</strong></div>
      <div className="bn-demo-output" aria-live="polite"><small>Last committed value</small><strong>{committed || "Nothing searched yet"}</strong></div>
      <button className="bn-demo-secondary" type="button" onClick={() => { setValue(""); setCommitted(""); setRuns(0); }}>Reset example</button>
    </div>
  );
}
