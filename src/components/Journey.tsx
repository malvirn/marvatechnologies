"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type PanInfo,
} from "framer-motion";

type Project = {
  id: string;
  years: string;
  title: string;
  tag: string;
  summary: string;
  about: string;
  highlights: string[];
  stack: string[];
  href: string; // leave "" to hide the live-link button
  image: string;
  ratio: number; // width / height of the screenshot
  imageAlt: string;
  device: string;
  accent: string;
};

/* ---- Edit your milestones here ---- */
const PROJECTS: Project[] = [
  {
    id: "maternityhelp",
    years: "2024–25",
    title: "MaternityHelp",
    tag: "Healthcare web app",
    summary: "A maternity care platform for clinics and patients.",
    about:
      "MaternityHelp helps a maternity clinic run day to day: patient records, appointments and booking requests, bed availability, stock levels, patient feedback and a live attention list so nothing is missed.",
    highlights: [
      "Patient dashboard with antenatal tracking",
      "Appointments, booking requests and queue",
      "Beds, low-stock alerts and patient ratings",
      "Messaging and SOS support",
    ],
    stack: ["Web app", "Supabase", "Netlify"],
    href: "https://maternityhelp2.netlify.app",
    image: "/projects/maternityhelp-iphone6.webp",
    ratio: 9 / 19,
    imageAlt: "MaternityHelp dashboard shown on an iPhone 6",
    device: "MaternityHelp",
    accent: "#f472b6",
  },
  {
    id: "centric",
    years: "2026–Now",
    title: "Centric Auto Mobile",
    tag: "Workshop & finance system",
    summary: "Workshop management, inventory and accounting in one system.",
    about:
      "Centric Auto Mobile runs an auto workshop end to end: repair job cards, vehicle checklists, technicians and commissions, parts and suppliers, quotations and receipts, plus a cashbook, ledger and financial statements.",
    highlights: [
      "Job cards, vehicle checklist and technicians",
      "Shop, parts, suppliers and landed cost",
      "Cashbook, payables, ledger and accounting",
      "Analytics and Centric Intelligence",
    ],
    stack: ["Workshop", "Inventory", "Accounting"],
    href: "",
    image: "/projects/centric-iphone6.webp",
    ratio: 9 / 19,
    imageAlt: "Centric Auto Mobile billing screen shown on an iPhone 6",
    device: "Centric Auto Mobile",
    accent: "#D97757",
  },
];

/* Rolling digits: each digit spins up from 0 to its value */
function Roll({ text }: { text: string }) {
  return (
    <span className="jn-roll" aria-label={text}>
      {[...text].map((c, i) =>
        /\d/.test(c) ? (
          <span className="jn-digit" aria-hidden key={i}>
            <motion.span
              className="jn-col"
              initial={{ y: "0em" }}
              whileInView={{ y: `${-Number(c)}em` }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1.1 + i * 0.12, ease: [0.2, 0.7, 0.2, 1] }}
            >
              {"0123456789".split("").map((d) => (
                <span key={d}>{d}</span>
              ))}
            </motion.span>
          </span>
        ) : (
          <span aria-hidden key={i}>
            {c}
          </span>
        )
      )}
    </span>
  );
}

function TimelineItem({
  p,
  index,
  total,
  active,
  progress,
  onSelect,
}: {
  p: Project;
  index: number;
  total: number;
  active: boolean;
  progress: MotionValue<number>;
  onSelect: () => void;
}) {
  const t = (index + 0.35) / total;
  const node = useTransform(progress, [t - 0.08, t], ["#26262a", p.accent]);
  return (
    <li className={`jn-item${active ? " is-active" : ""}`}>
      <motion.span className="jn-node" style={{ backgroundColor: node }} aria-hidden />
      <button type="button" className="jn-card" onClick={onSelect} aria-pressed={active}>
        <span className="jn-years">
          <Roll text={p.years} />
        </span>
        <strong className="jn-title">{p.title}</strong>
        <span className="jn-summary">{p.summary}</span>
        <span className="jn-more">{active ? "Showing now" : "View project"} <i aria-hidden>→</i></span>
      </button>
    </li>
  );
}

const AUTOPLAY_MS = 5200;
const mod = (n: number, m: number) => ((n % m) + m) % m;

/* One phone travelling on a 3D orbit; `pos` is a spring-driven "turn" counter */
function OrbitSlide({
  p,
  i,
  pos,
  active,
  onSelect,
}: {
  p: Project;
  i: number;
  pos: MotionValue<number>;
  active: boolean;
  onSelect: () => void;
}) {
  const step = (Math.PI * 2) / PROJECTS.length;
  const th = useTransform(pos, (v) => (i - v) * step);
  const x = useTransform(th, (t) => `${Math.sin(t) * 50}%`);
  const z = useTransform(th, (t) => Math.cos(t) * 170 - 170);
  const rotateY = useTransform(th, (t) => -Math.sin(t) * 48);
  const rotateZ = useTransform(th, (t) => -Math.sin(t) * 5);
  const scale = useTransform(th, (t) => 0.72 + 0.28 * ((Math.cos(t) + 1) / 2));
  const opacity = useTransform(th, (t) => 0.25 + 0.75 * Math.pow((Math.cos(t) + 1) / 2, 0.7));
  const filter = useTransform(th, (t) => `blur(${(((1 - Math.cos(t)) / 2) * 5).toFixed(2)}px)`);

  return (
    <motion.figure
      className="jn-slide is-phone"
      style={{ x, z, rotateY, rotateZ, scale, opacity, filter, aspectRatio: p.ratio, ["--mask" as string]: `url(${p.image})` }}
      onTap={() => !active && onSelect()}
      aria-hidden={!active}
    >
      <img src={p.image} alt={p.imageAlt} draggable={false} loading={i === 0 ? "eager" : "lazy"} decoding="async" />
    </motion.figure>
  );
}

export default function Journey() {
  const reduce = useReducedMotion();
  const [turn, setTurn] = useState(0);
  const [hover, setHover] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const inView = useInView(stageRef, { amount: 0.35 });
  const active = mod(turn, PROJECTS.length);

  const raw = useMotionValue(0);
  const spring = useSpring(raw, { stiffness: 55, damping: 13, mass: 1 });
  const pos = reduce ? raw : spring;
  useEffect(() => {
    raw.set(turn);
  }, [turn, raw]);

  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 75%", "end 55%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });

  const next = () => setTurn((t) => t + 1);
  const prev = () => setTurn((t) => t - 1);
  const go = (n: number) => setTurn((t) => t + mod(n - mod(t, PROJECTS.length), PROJECTS.length));

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -50 || info.velocity.x < -400) next();
    else if (info.offset.x > 50 || info.velocity.x > 400) prev();
  };

  const current = PROJECTS[active];
  const accentVar = { ["--c" as string]: current.accent };
  const blurIn = reduce
    ? {}
    : {
        initial: { opacity: 0, filter: "blur(14px)", y: 10 },
        animate: { opacity: 1, filter: "blur(0px)", y: 0 },
        exit: { opacity: 0, filter: "blur(10px)", y: -6 },
      };

  return (
    <section className="section jn" aria-labelledby="jn-heading">
      <div className="shell">
        <div className="section-head">
          <div className="eyebrow">My journey</div>
          <h2 id="jn-heading">
            What I’ve <span className="gradient">built</span>
          </h2>
          <p className="section-copy">
            A timeline of the products I’ve shipped. Watch the phones swap places on their own, or pick a milestone.
          </p>
        </div>

        <div className="jn-grid">
          {/* Timeline */}
          <div className="jn-timeline">
            <div className="jn-spine" aria-hidden>
              <motion.span className="jn-spine-fill" style={{ scaleY: reduce ? 1 : fill }} />
            </div>
            <ol ref={listRef} className="jn-list">
              {PROJECTS.map((p, i) => (
                <TimelineItem
                  key={p.id}
                  p={p}
                  index={i}
                  total={PROJECTS.length}
                  active={i === active}
                  progress={fill}
                  onSelect={() => go(i)}
                />
              ))}
            </ol>
          </div>

          {/* Carousel + details */}
          <div className="jn-showcase">
            <div
              ref={stageRef}
              className="jn-stage"
              tabIndex={0}
              role="group"
              aria-roledescription="carousel"
              aria-label="Project screenshots"
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") next();
                if (e.key === "ArrowLeft") prev();
              }}
              onPointerEnter={() => setHover(true)}
              onPointerLeave={() => setHover(false)}
            >
              <motion.div
                className="jn-glow"
                aria-hidden
                animate={{ backgroundColor: current.accent }}
                transition={{ duration: reduce ? 0 : 0.9 }}
              />

              {/* Hologram platform under the phones */}
              <div className="jn-halo" aria-hidden style={accentVar}>
                <i className="jn-halo-r1" />
                <i className="jn-halo-r2" />
                <div className="jn-halo-spin">
                  {Array.from({ length: 14 }, (_, k) => (
                    <b key={k} style={{ ["--a" as string]: `${k * (360 / 14)}deg` }} />
                  ))}
                </div>
              </div>

              {/* Shockwave and sparks on every swap */}
              <span key={`rg-${turn}`} className="jn-ring" aria-hidden style={accentVar} />
              <span key={`rg2-${turn}`} className="jn-ring jn-ring-2" aria-hidden style={accentVar} />
              <div key={`sp-${turn}`} className="jn-sparks" aria-hidden style={accentVar}>
                {Array.from({ length: 16 }, (_, k) => (
                  <i
                    key={k}
                    style={{
                      ["--a" as string]: `${k * (360 / 16) + (k % 2 ? 9 : 0)}deg`,
                      ["--d" as string]: `${95 + ((k * 37) % 80)}px`,
                      ["--dl" as string]: `${(k % 4) * 0.04}s`,
                    }}
                  />
                ))}
              </div>

              <motion.div
                className="jn-track"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.18}
                onDragEnd={onDragEnd}
              >
                <div className="jn-bob">
                  {PROJECTS.map((p, i) => (
                    <OrbitSlide key={p.id} p={p} i={i} pos={pos} active={i === active} onSelect={() => go(i)} />
                  ))}
                </div>
              </motion.div>

              <div className="jn-controls">
                <button type="button" onClick={prev} aria-label="Previous project">
                  ←
                </button>
                <div className="jn-dots">
                  {PROJECTS.map((p, i) => (
                    <button
                      key={p.id}
                      type="button"
                      className={i === active ? "is-active" : ""}
                      onClick={() => go(i)}
                      aria-label={`Show ${p.title}`}
                      aria-current={i === active}
                    />
                  ))}
                </div>
                <button type="button" onClick={next} aria-label="Next project">
                  →
                </button>
              </div>

              {/* Autoplay timer: when its animation ends, the phones swap */}
              {!reduce && (
                <span
                  key={`pg-${turn}`}
                  className="jn-progress"
                  aria-hidden
                  style={{
                    ...accentVar,
                    animationDuration: `${AUTOPLAY_MS}ms`,
                    animationPlayState: hover || !inView ? "paused" : "running",
                  }}
                  onAnimationEnd={next}
                />
              )}
            </div>

            <div className="jn-detail" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={current.id}
                  {...blurIn}
                  transition={{ duration: reduce ? 0 : 0.5, ease: [0.2, 0.7, 0.2, 1] }}
                >
                  <div className="jn-panel">
                    <div className="jn-meta">
                      <div className="jn-tag">
                        <span style={{ background: current.accent }} aria-hidden /> {current.tag}
                      </div>
                      <span className="jn-years-pill">{current.years}</span>
                    </div>
                    <h3>{current.title}</h3>
                    <p className="jn-lead">{current.summary}</p>

                    <div className="jn-block">
                      <h4>Overview</h4>
                      <p className="jn-about">{current.about}</p>
                    </div>
                    <div className="jn-block">
                      <h4>Key features</h4>
                      <ul className="jn-points">
                        {current.highlights.map((h) => (
                          <li key={h}>{h}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="jn-block">
                      <h4>Built with</h4>
                      <div className="chips">
                        {current.stack.map((s) => (
                          <span key={s}>{s}</span>
                        ))}
                      </div>
                    </div>

                    {current.href && (
                      <div className="jn-actions">
                        <a className="btn primary" href={current.href} target="_blank" rel="noopener noreferrer">
                          Visit live site ↗
                        </a>
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
