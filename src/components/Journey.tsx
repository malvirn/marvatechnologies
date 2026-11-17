"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
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
    image: "/projects/maternityhelp-samsung.webp",
    imageAlt: "MaternityHelp dashboard shown on a Samsung Galaxy S26 Ultra",
    device: "Samsung S26 Ultra",
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
    imageAlt: "Centric Auto Mobile cashbook shown on an iPhone 6",
    device: "iPhone 6",
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

export default function Journey() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);

  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 75%", "end 55%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });

  const go = (n: number) => setActive(Math.max(0, Math.min(PROJECTS.length - 1, n)));

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -50 || info.velocity.x < -400) go(active + 1);
    else if (info.offset.x > 50 || info.velocity.x > 400) go(active - 1);
  };

  const current = PROJECTS[active];
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
            A timeline of the products I’ve shipped. Pick a milestone or swipe the phones to see what each one does.
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
              className="jn-stage"
              tabIndex={0}
              role="group"
              aria-roledescription="carousel"
              aria-label="Project screenshots"
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") go(active + 1);
                if (e.key === "ArrowLeft") go(active - 1);
              }}
            >
              <motion.div
                className="jn-glow"
                aria-hidden
                animate={{ backgroundColor: current.accent }}
                transition={{ duration: reduce ? 0 : 0.9 }}
              />
              <motion.div
                className="jn-track"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.18}
                onDragEnd={onDragEnd}
              >
                {PROJECTS.map((p, i) => {
                  const o = i - active;
                  const isActive = o === 0;
                  return (
                    <motion.figure
                      key={p.id}
                      className="jn-slide"
                      style={{ zIndex: 10 - Math.abs(o) }}
                      initial={false}
                      animate={{
                        x: `${o * 62}%`,
                        rotateY: reduce ? 0 : o * -34,
                        scale: isActive ? 1 : 0.76,
                        opacity: isActive ? 1 : 0.5,
                        filter: isActive ? "blur(0px)" : "blur(3px)",
                      }}
                      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 140, damping: 22, mass: 0.9 }}
                      onTap={() => go(i)}
                      aria-hidden={!isActive}
                    >
                      <img src={p.image} alt={p.imageAlt} draggable={false} loading={i === 0 ? "eager" : "lazy"} decoding="async" />
                      <figcaption>{p.device}</figcaption>
                    </motion.figure>
                  );
                })}
              </motion.div>

              <div className="jn-controls">
                <button type="button" onClick={() => go(active - 1)} disabled={active === 0} aria-label="Previous project">
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
                <button type="button" onClick={() => go(active + 1)} disabled={active === PROJECTS.length - 1} aria-label="Next project">
                  →
                </button>
              </div>
            </div>

            <div className="jn-detail" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={current.id}
                  {...blurIn}
                  transition={{ duration: reduce ? 0 : 0.5, ease: [0.2, 0.7, 0.2, 1] }}
                >
                  <div className="jn-tag">
                    <span style={{ background: current.accent }} aria-hidden /> {current.tag}
                  </div>
                  <h3>{current.title}</h3>
                  <p className="jn-about">{current.about}</p>
                  <ul className="jn-points">
                    {current.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                  <div className="chips">
                    {current.stack.map((s) => (
                      <span key={s}>{s}</span>
                    ))}
                  </div>
                  {current.href && (
                    <a className="btn primary" href={current.href} target="_blank" rel="noopener noreferrer">
                      Visit live site ↗
                    </a>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
