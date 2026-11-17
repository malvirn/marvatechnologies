"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const SCENES = ["chat", "idea", "code"] as const;
const SCENE_LABELS = ["Let's talk", "Idea to product", "Built in code"];
const SCENE_MS = 7200;

function ChatScene() {
  return (
    <div className="scene scene-chat">
      <div className="bubble bubble-in" style={{ ["--d0" as string]: "0s" }}>
        <span className="b-dots" style={{ ["--d" as string]: "0s" }}><i /><i /><i /></span>
        <span className="b-text typed" style={{ ["--n" as string]: 13, ["--d" as string]: "1.1s" }}>Have an idea?</span>
      </div>
      <div className="bubble bubble-out" style={{ ["--d0" as string]: "2.3s" }}>
        <span className="b-dots" style={{ ["--d" as string]: "2.3s" }}><i /><i /><i /></span>
        <span className="b-text typed" style={{ ["--n" as string]: 28, ["--d" as string]: "3.4s" }}>Let&rsquo;s make something useful.</span>
      </div>
      <div className="chat-cta" aria-hidden="true">Get in touch <ArrowUpRight size={14} /></div>
    </div>
  );
}

function IdeaScene() {
  return (
    <div className="scene scene-idea">
      <svg viewBox="0 0 360 240" className="net" fill="none" aria-hidden="true">
        <g className="net-parallax">
          {/* lines: idea -> nodes -> product */}
          <path className="ln" pathLength={1} style={{ ["--d" as string]: ".6s" }} d="M56 120 L150 58" />
          <path className="ln" pathLength={1} style={{ ["--d" as string]: ".8s" }} d="M56 120 L170 120" />
          <path className="ln" pathLength={1} style={{ ["--d" as string]: "1s" }} d="M56 120 L150 182" />
          <path className="ln ln-2" pathLength={1} style={{ ["--d" as string]: "1.7s" }} d="M150 58 L246 92" />
          <path className="ln ln-2" pathLength={1} style={{ ["--d" as string]: "1.9s" }} d="M170 120 L246 120" />
          <path className="ln ln-2" pathLength={1} style={{ ["--d" as string]: "2.1s" }} d="M150 182 L246 150" />
          {/* nodes */}
          <circle className="nd" style={{ ["--d" as string]: "1.1s" }} cx="150" cy="58" r="5" />
          <circle className="nd" style={{ ["--d" as string]: "1.3s" }} cx="170" cy="120" r="5" />
          <circle className="nd" style={{ ["--d" as string]: "1.5s" }} cx="150" cy="182" r="5" />
          {/* finished product: a tiny dashboard */}
          <g className="dash" style={{ ["--d" as string]: "2.5s" }}>
            <rect x="246" y="64" width="98" height="112" rx="11" className="dash-card" />
            <circle cx="262" cy="80" r="3" fill="#D97757" />
            <rect x="272" y="77" width="34" height="6" rx="3" fill="#ffffff" fillOpacity=".35" />
            <rect className="bar" style={{ ["--d" as string]: "3.1s" }} x="262" y="130" width="14" height="30" rx="3" fill="#6c8dff" />
            <rect className="bar" style={{ ["--d" as string]: "3.3s" }} x="284" y="112" width="14" height="48" rx="3" fill="#6c8dff" />
            <rect className="bar" style={{ ["--d" as string]: "3.5s" }} x="306" y="96" width="14" height="64" rx="3" fill="#D97757" />
            <path className="tick" pathLength={1} style={{ ["--d" as string]: "3.9s" }} d="M322 78 L327 83 L336 73" stroke="#7CE3A6" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          {/* the idea */}
          <g className="idea">
            <circle className="idea-ring" cx="56" cy="120" r="8" />
            <circle className="idea-ring r2" cx="56" cy="120" r="8" />
            <circle className="idea-dot" cx="56" cy="120" r="7.5" />
          </g>
        </g>
      </svg>
      <span className="net-tag">idea</span>
      <span className="net-tag net-tag-r">useful</span>
    </div>
  );
}

function CodeScene() {
  return (
    <div className="scene scene-code">
      <div className="code-win">
        <div className="code-bar"><i /><i /><i /><span>marva.ts</span></div>
        <div className="code-body">
          <div className="code-lines">
            <p><span className="typed" style={{ ["--n" as string]: 21, ["--d" as string]: ".3s" }}><b className="k">const</b> idea = <b className="s">&quot;yours&quot;</b>;</span></p>
            <p><span className="typed" style={{ ["--n" as string]: 21, ["--d" as string]: "1.4s" }}><b className="f">ship</b>(idea, <b className="s">&quot;useful&quot;</b>);</span></p>
            <p><span className="typed" style={{ ["--n" as string]: 13, ["--d" as string]: "2.5s" }}><b className="c">{"// launched ✓"}</b></span></p>
          </div>
          <div className="code-cta" aria-hidden="true">Get in touch <ArrowUpRight size={15} /></div>
        </div>
      </div>
    </div>
  );
}

export default function ContactBand() {
  const [scene, setScene] = useState(0);
  const [paused, setPaused] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setScene(s => (s + 1) % SCENES.length), SCENE_MS);
    return () => clearInterval(timer);
  }, [paused, scene]);

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = stageRef.current;
    if (!el || event.pointerType === "touch") return;
    const rect = el.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    el.style.setProperty("--mx", x.toFixed(3));
    el.style.setProperty("--my", y.toFixed(3));
  };
  const onLeave = () => {
    const el = stageRef.current;
    if (!el) return;
    el.style.setProperty("--mx", "0");
    el.style.setProperty("--my", "0");
    setPaused(false);
  };

  return (
    <div className="contact-band cta-live">
      <span className="cta-orb cta-orb-a" aria-hidden="true" />
      <span className="cta-orb cta-orb-b" aria-hidden="true" />

      <div className="cta-copy">
        <div className="eyebrow">Have an idea?</div>
        <h2>Let’s make something useful.</h2>
        <p className="section-copy">Have a project, collaboration or opportunity in mind? Let’s talk.</p>
        <Link className="btn primary cta-btn" href="/contact">
          Get in touch <ArrowUpRight size={16} />
        </Link>
      </div>

      <div
        className="cta-stage"
        ref={stageRef}
        onPointerMove={onMove}
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={onLeave}
        aria-hidden="true"
      >
        {scene === 0 && <ChatScene key="chat" />}
        {scene === 1 && <IdeaScene key="idea" />}
        {scene === 2 && <CodeScene key="code" />}
        <div className="stage-dots">
          {SCENES.map((name, i) => (
            <button
              key={name}
              type="button"
              tabIndex={-1}
              aria-label={SCENE_LABELS[i]}
              className={i === scene ? "is-active" : ""}
              onClick={() => setScene(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
