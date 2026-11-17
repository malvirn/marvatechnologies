"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const SCENES = ["chat", "idea", "code", "devices", "launch"] as const;
const SCENE_LABELS = ["Let's talk", "Idea to product", "Built in code", "Every screen", "Launch day"];
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


function DevicesScene() {
  return (
    <div className="scene scene-devices">
      <img className="dev-img" src="/tech-blueprint.webp" width={1672} height={941} alt="" loading="lazy" decoding="async" draggable={false} />
      <img className="dev-img dev-img-top" src="/tech-render.webp" width={1672} height={941} alt="" loading="lazy" decoding="async" draggable={false} />
      <span className="dev-line" />
      <span className="dev-tag dev-tag-a">Sketch</span>
      <span className="dev-tag dev-tag-b">Shipped</span>
    </div>
  );
}

function LaunchScene() {
  return (
    <div className="scene scene-launch">
      <svg viewBox="0 0 360 240" className="launch" fill="none" aria-hidden="true">
        {Array.from({ length: 14 }).map((_, i) => (
          <circle key={i} className="star" cx={(i * 53 + 17) % 350 + 5} cy={(i * 37 + 11) % 170 + 8} r={i % 3 === 0 ? 1.8 : 1.1} style={{ ["--d" as string]: `${(i % 5) * 0.4}s` }} />
        ))}
        <path className="orbit" d="M40 210 C 120 200, 150 90, 290 40" pathLength={1} />
        <g className="rocket">
          <path d="M0 -14 C 7 -8, 7 6, 4 12 L -4 12 C -7 6, -7 -8, 0 -14 Z" fill="#F5F5F5" />
          <circle cx="0" cy="-3" r="3" fill="#6c8dff" />
          <path d="M-4 8 L-10 15 L-4 13 Z M4 8 L10 15 L4 13 Z" fill="#D97757" />
          <path className="flame" d="M-3 12 Q0 26 3 12 Z" fill="#ffb36b" />
        </g>
        <g className="pad">
          <rect x="22" y="212" width="70" height="6" rx="3" fill="#ffffff" fillOpacity=".25" />
        </g>
      </svg>
      <span className="live-badge"><i /> Live</span>
      <span className="launch-cta" aria-hidden="true">Get in touch <ArrowUpRight size={14} /></span>
    </div>
  );
}

export default function ContactBand() {
  const [scene, setScene] = useState(0);
  const [paused, setPaused] = useState(false);
  const [ripple, setRipple] = useState<{ x: number; y: number; id: number } | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const next = (dir = 1) => setScene(s => (s + dir + SCENES.length) % SCENES.length);

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
  const onClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const el = stageRef.current;
    if (el) {
      const r = el.getBoundingClientRect();
      setRipple({ x: event.clientX - r.left, y: event.clientY - r.top, id: Date.now() });
    }
    next();
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
        className={`cta-stage ${paused ? "is-paused" : ""}`}
        ref={stageRef}
        role="button"
        tabIndex={0}
        aria-label={`Change animation. Currently showing: ${SCENE_LABELS[scene]}`}
        onClick={onClick}
        onKeyDown={e => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            next();
          } else if (e.key === "ArrowRight") next();
          else if (e.key === "ArrowLeft") next(-1);
        }}
        onPointerMove={onMove}
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={onLeave}
      >
        <div className="stage-progress" aria-hidden="true">
          <span key={scene} style={{ animationDuration: `${SCENE_MS}ms` }} />
        </div>

        {scene === 0 && <ChatScene key="chat" />}
        {scene === 1 && <IdeaScene key="idea" />}
        {scene === 2 && <CodeScene key="code" />}
        {scene === 3 && <DevicesScene key="devices" />}
        {scene === 4 && <LaunchScene key="launch" />}

        <span className="stage-wipe" key={`w${scene}`} aria-hidden="true" />
        {ripple && <span className="stage-ripple" key={ripple.id} style={{ left: ripple.x, top: ripple.y }} aria-hidden="true" />}

        <span className="stage-label" aria-hidden="true">{String(scene + 1).padStart(2, "0")} · {SCENE_LABELS[scene]}</span>
        <span className="stage-hint" aria-hidden="true">Tap to change</span>

        <div className="stage-dots">
          {SCENES.map((name, i) => (
            <button
              key={name}
              type="button"
              tabIndex={-1}
              aria-label={SCENE_LABELS[i]}
              className={i === scene ? "is-active" : ""}
              onClick={e => {
                e.stopPropagation();
                setScene(i);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
