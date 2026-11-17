"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

const rowOne = ["Web apps", "Dashboards", "Business systems", "Databases", "Integrations", "Mobile-first", "Made in Zimbabwe"];
const rowTwo = ["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "APIs", "Responsive UI"];

type Stat = { value: number; suffix: string; label: string; visual: "ring" | "clock" | "pulse" };
const stats: Stat[] = [
  { value: 100, suffix: "%", label: "Responsive by design", visual: "ring" },
  { value: 24, suffix: "/7", label: "Always-on systems", visual: "clock" },
  { value: 1, suffix: " idea", label: "Is all we need to start", visual: "pulse" },
];

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, { duration: 1.8, ease: "easeOut", onUpdate: v => setN(Math.round(v)) });
    return () => controls.stop();
  }, [inView, to]);
  return <span ref={ref}>{n}{suffix}</span>;
}

function StatVisual({ kind }: { kind: Stat["visual"] }) {
  if (kind === "ring")
    return (
      <svg className="sv" viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r="18" className="sv-track" />
        <motion.circle
          cx="24" cy="24" r="18" className="sv-fill" pathLength={1}
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
          transition={{ duration: 1.8, ease: "easeOut" }}
        />
        <path className="sv-check" d="M16 25 L22 31 L33 18" />
      </svg>
    );
  if (kind === "clock")
    return (
      <svg className="sv" viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r="18" className="sv-track" />
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={i} x1="24" y1="8" x2="24" y2={i % 3 === 0 ? 11.5 : 10} className="sv-tick" transform={`rotate(${i * 30} 24 24)`} />
        ))}
        <line x1="24" y1="24" x2="24" y2="12" className="sv-hand sv-hand-m" />
        <line x1="24" y1="24" x2="24" y2="16" className="sv-hand sv-hand-h" />
        <circle cx="24" cy="24" r="2" fill="#fff" />
      </svg>
    );
  return (
    <svg className="sv" viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="4" fill="#fff" />
      <circle cx="24" cy="24" r="4" className="sv-ripple" />
      <circle cx="24" cy="24" r="4" className="sv-ripple sv-ripple-2" />
      <circle cx="24" cy="24" r="4" className="sv-ripple sv-ripple-3" />
    </svg>
  );
}

function StatCard({ s, i }: { s: Stat; i: number }) {
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--sx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--sy", `${e.clientY - r.top}px`);
  };
  return (
    <motion.div
      className="tech-stat"
      onPointerMove={onMove}
      initial={{ opacity: 0, y: 60, rotateX: -18, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.8, delay: i * 0.15, ease: [0.2, 0.7, 0.2, 1] }}
      whileHover={{ y: -8 }}
    >
      <span className="ts-no">0{i + 1}</span>
      <StatVisual kind={s.visual} />
      <strong><Counter to={s.value} suffix={s.suffix} /></strong>
      <span className="ts-label">{s.label}</span>
      <span className="ts-bar" aria-hidden="true" />
    </motion.div>
  );
}

const SRC = ["/tech-blueprint.webp", "/tech-render.webp"];
const ALT = [
  "Blueprint wireframe of a dashboard on a laptop and a phone",
  "The finished dashboard shown on a laptop and a phone",
];
const NAMES = ["Blueprint", "Product"];
const EASE = [0.65, 0, 0.35, 1] as const;
const HOLD_MS = 2600;
const MOVE_S = 1.3;

// PowerPoint-style transitions: how the incoming picture arrives
type Tr = { name: string; from: Record<string, string | number>; to: Record<string, string | number>; push?: boolean };
const TRANSITIONS: Tr[] = [
  { name: "Fade", from: { opacity: 0 }, to: { opacity: 1 } },
  { name: "Wipe", from: { clipPath: "inset(0 100% 0 0)" }, to: { clipPath: "inset(0 0% 0 0)" } },
  { name: "Split", from: { clipPath: "inset(0 50% 0 50%)" }, to: { clipPath: "inset(0 0% 0 0%)" } },
  { name: "Push", from: { x: "100%" }, to: { x: "0%" }, push: true },
  { name: "Iris", from: { clipPath: "circle(0% at 50% 50%)" }, to: { clipPath: "circle(75% at 50% 50%)" } },
  { name: "Zoom", from: { opacity: 0, scale: 1.45 }, to: { opacity: 1, scale: 1 } },
  { name: "Diamond", from: { clipPath: "polygon(50% 50%,50% 50%,50% 50%,50% 50%)" }, to: { clipPath: "polygon(50% -50%,150% 50%,50% 150%,-50% 50%)" } },
  { name: "Cover", from: { y: "100%" }, to: { y: "0%" } },
];

export default function TechShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [moving, setMoving] = useState(false);
  const [reduced, setReduced] = useState(false);

  const base = step % 2;
  const incoming = (step + 1) % 2;
  const tr = TRANSITIONS[step % TRANSITIONS.length];

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // fully automatic: hold, play the next transition, hold...
  useEffect(() => {
    if (reduced || moving) return;
    const t = setTimeout(() => setMoving(true), HOLD_MS);
    return () => clearTimeout(t);
  }, [moving, step, reduced]);

  // tilt
  const tiltX = useSpring(0, { stiffness: 120, damping: 16 });
  const tiltY = useSpring(0, { stiffness: 120, damping: 16 });
  const onMove = (e: React.PointerEvent) => {
    const el = stageRef.current;
    if (!el || e.pointerType !== "mouse") return;
    const rect = el.getBoundingClientRect();
    tiltY.set(((e.clientX - rect.left) / rect.width - 0.5) * 6);
    tiltX.set(-((e.clientY - rect.top) / rect.height - 0.5) * 6);
  };

  // scroll
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const glowY = useTransform(scrollYProgress, [0, 1], [-60, 100]);
  const stageScale = useTransform(scrollYProgress, [0, 0.35, 0.6], [0.9, 1, 1]);
  const stageRotate = useTransform(scrollYProgress, [0, 0.35], [6, 0]);

  const headline = ["From", "blueprint", "to", "product."];

  return (
    <section className="section tech-section" ref={sectionRef}>
      <motion.div className="tech-glow tech-glow-a" style={{ y: glowY }} aria-hidden />
      <div className="tech-grid" aria-hidden />

      <div className="shell">
        <div className="tech-head">
          <motion.div className="eyebrow" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            How we build
          </motion.div>
          <h2 className="tech-title" aria-label="From blueprint to product.">
            {headline.map((w, i) => (
              <span className="tech-word-mask" key={w} aria-hidden>
                <motion.span
                  className={`tech-word ${w === "product." ? "tech-word-accent" : ""}`}
                  initial={{ y: "110%", rotate: 6 }}
                  whileInView={{ y: "0%", rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.1 + i * 0.12, ease: [0.2, 0.7, 0.2, 1] }}
                >
                  {w}
                </motion.span>{" "}
              </span>
            ))}
          </h2>
          <motion.p className="tech-copy" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.6 }}>
            Every great product starts as a rough sketch. We turn ideas into clean, fast and
            dependable software, from the first wireframe to the finished interface on your
            laptop and in your pocket.
          </motion.p>
        </div>

        <motion.div className="tech-stage-wrap" style={{ scale: stageScale, rotateX: stageRotate }}>
          <motion.div
            ref={stageRef}
            className="tech-stage"
            style={{ rotateX: tiltX, rotateY: tiltY }}
            onPointerMove={onMove}
            onPointerLeave={() => {
              tiltX.set(0);
              tiltY.set(0);
            }}
          >
            {/* picture on screen now (pushed out by the next one during a Push) */}
            <motion.img
              className="tech-img"
              src={SRC[base]}
              alt={ALT[base]}
              width={1672}
              height={941}
              loading="lazy"
              decoding="async"
              draggable={false}
              animate={{ x: moving && tr.push ? "-100%" : "0%" }}
              transition={moving && tr.push ? { duration: MOVE_S, ease: EASE } : { duration: 0 }}
            />

            {/* picture arriving with the current transition */}
            {moving && (
              <motion.img
                key={step}
                className="tech-img tech-img-in"
                src={SRC[incoming]}
                alt=""
                aria-hidden="true"
                width={1672}
                height={941}
                decoding="async"
                draggable={false}
                initial={tr.from}
                animate={tr.to}
                transition={{ duration: MOVE_S, ease: EASE }}
                onAnimationComplete={() => {
                  setStep(n => n + 1);
                  setMoving(false);
                }}
              />
            )}

            <i className="tech-corner tc-tl" aria-hidden />
            <i className="tech-corner tc-tr" aria-hidden />
            <i className="tech-corner tc-bl" aria-hidden />
            <i className="tech-corner tc-br" aria-hidden />

            <span className="tech-tag tech-tag-l">0{base + 1} · {NAMES[base]}</span>
            <span className="tech-tag tech-tag-r">Transition · {tr.name}</span>

            <div className="tech-progress" aria-hidden>
              <span key={`${step}-${moving}`} className={moving ? "is-moving" : "is-holding"} style={{ animationDuration: moving ? `${MOVE_S}s` : `${HOLD_MS}ms` }} />
            </div>
          </motion.div>
        </motion.div>

        <div className="tech-stats">
          {stats.map((s, i) => <StatCard s={s} i={i} key={s.label} />)}
        </div>
      </div>

      <div className="mq" aria-hidden>
        {[rowOne, rowTwo].map((row, ri) => (
          <div className={`mq-row ${ri === 1 ? "mq-rev" : ""}`} key={ri}>
            <div className="mq-track">
              {[...row, ...row].map((w, i) => (
                <span className="mq-pill" key={i}><i />{w}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
