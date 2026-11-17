"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

const words = ["Web apps", "Dashboards", "Business systems", "Databases", "Integrations", "Mobile-first", "Made in Zimbabwe"];

const stats = [
  { value: 100, suffix: "%", label: "Responsive by design" },
  { value: 24, suffix: "/7", label: "Always-on systems" },
  { value: 1, suffix: " idea", label: "Is all we need to start" },
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

export default function TechShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const auto = useRef(true);

  // reveal position 0-100 (how much of the finished render is shown)
  const reveal = useMotionValue(50);
  const clip = useTransform(reveal, v => `inset(0 ${100 - v}% 0 0)`);
  const handleLeft = useTransform(reveal, v => `${v}%`);

  // sweep back and forth until the visitor takes control
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const controls = animate(reveal, [8, 92, 8], {
      duration: 9,
      ease: "easeInOut",
      repeat: Infinity,
      onUpdate: () => {
        if (!auto.current) controls.stop();
      },
    });
    return () => controls.stop();
  }, [reveal]);

  const setFromPointer = (clientX: number) => {
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    reveal.set(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };

  // mouse tilt
  const tiltX = useSpring(0, { stiffness: 120, damping: 16 });
  const tiltY = useSpring(0, { stiffness: 120, damping: 16 });
  const onMove = (e: React.PointerEvent) => {
    const el = stageRef.current;
    if (el && e.pointerType === "mouse") {
      const r = el.getBoundingClientRect();
      tiltY.set(((e.clientX - r.left) / r.width - 0.5) * 8);
      tiltX.set(-((e.clientY - r.top) / r.height - 0.5) * 8);
    }
    if (dragging.current) setFromPointer(e.clientX);
  };

  // scroll parallax
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const glowY = useTransform(scrollYProgress, [0, 1], [-80, 120]);
  const glowY2 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const marqueeX = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const stageScale = useTransform(scrollYProgress, [0, 0.35, 0.6], [0.88, 1, 1]);
  const stageRotate = useTransform(scrollYProgress, [0, 0.35], [6, 0]);
  const [pct, setPct] = useState(50);
  useMotionValueEvent(reveal, "change", v => setPct(Math.round(v)));

  const headline = ["From", "blueprint", "to", "product."];

  return (
    <section className="section tech-section" ref={sectionRef}>
      <motion.div className="tech-glow tech-glow-a" style={{ y: glowY }} aria-hidden />
      <motion.div className="tech-glow tech-glow-b" style={{ y: glowY2 }} aria-hidden />

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
            onPointerDown={e => {
              auto.current = false;
              dragging.current = true;
              (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
              setFromPointer(e.clientX);
            }}
            onPointerUp={() => (dragging.current = false)}
            onPointerCancel={() => (dragging.current = false)}
            onPointerMove={onMove}
            onPointerLeave={() => {
              tiltX.set(0);
              tiltY.set(0);
            }}
          >
            <img className="tech-img" src="/tech-blueprint.webp" width={1672} height={941} alt="Blueprint wireframe of a dashboard on a laptop and a phone" loading="lazy" decoding="async" draggable={false} />
            <motion.img className="tech-img tech-img-top" style={{ clipPath: clip }} src="/tech-render.webp" width={1672} height={941} alt="The finished dashboard shown on a laptop and a phone" loading="lazy" decoding="async" draggable={false} />
            <div className="tech-scan" aria-hidden />

            <motion.div className="tech-handle" style={{ left: handleLeft }} aria-hidden>
              <span className="tech-handle-line" />
              <span className="tech-handle-knob">⟷</span>
            </motion.div>

            <span className="tech-tag tech-tag-l">Blueprint</span>
            <span className="tech-tag tech-tag-r">Product · {pct}%</span>
            <span className="tech-hint">Drag to reveal</span>
          </motion.div>
        </motion.div>

        <div className="tech-stats">
          {stats.map((s, i) => (
            <motion.div
              className="tech-stat"
              key={s.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: i * 0.12 }}
              whileHover={{ y: -6 }}
            >
              <strong><Counter to={s.value} suffix={s.suffix} /></strong>
              <span>{s.label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="tech-marquee" aria-hidden>
        <motion.div className="tech-marquee-inner" style={{ x: marqueeX }}>
          {[...words, ...words, ...words].map((w, i) => (
            <span key={i}>{w}<i>✦</i></span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
