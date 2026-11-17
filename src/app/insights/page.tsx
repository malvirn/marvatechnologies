import Link from "next/link";
import { Lightbulb, PenLine, SearchCheck, Rocket, ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import Principles from "@/components/Principles";

const topics = [
  { id: "code", tag: "01 / Engineering", title: "Building software", text: "Practical lessons from building web and business applications: what worked, what broke and what I would do differently." },
  { id: "flow", tag: "02 / Product", title: "Product thinking", text: "How a rough idea becomes a prototype, and how a prototype becomes something people actually use." },
  { id: "bars", tag: "03 / Learning", title: "Learning in public", text: "Notes on skills, tools and habits picked up along the way, shared so others can move faster." },
  { id: "orbit", tag: "04 / Community", title: "Building in Zimbabwe", text: "Perspectives on creating useful technology close to home, for the people and businesses around me." },
];
const steps = [["Idea", "A problem worth writing about", Lightbulb], ["Draft", "Shaped into a clear first version", PenLine], ["Review", "Checked for accuracy and usefulness", SearchCheck], ["Publish", "Shared here, ready to read", Rocket]] as const;
const words = ["Software", "Product thinking", "Databases", "Design", "Learning", "Zimbabwe"];

function Visual({ id }: { id: string }) {
  if (id === "code") return <div className="in-vis in-code" aria-hidden="true">
    <div className="in-dots"><i /><i /><i /></div>
    {[["62%", "#7cc4ff"], ["38%", "#c792ea"], ["74%", "#7ce3a6"], ["50%", "#ffcb6b"], ["68%", "#7cc4ff"], ["30%", "#c792ea"]].map(([w, c], n) => <span key={n} className="in-ln" style={{ ["--w" as string]: w, ["--c" as string]: c, ["--d" as string]: `${n * 0.45}s`, ["--ind" as string]: n === 1 || n === 2 || n === 3 ? "18px" : "0px" }} />)}
    <b className="in-cursor" />
  </div>;
  if (id === "flow") return <div className="in-vis in-flow" aria-hidden="true">
    <span className="in-track" /><span className="in-fill" /><span className="in-runner" />
    {["Idea", "Prototype", "Launch"].map((t, n) => <div key={t} className="in-node" style={{ ["--n" as string]: n }}><i /><small>{t}</small></div>)}
  </div>;
  if (id === "bars") return <div className="in-vis in-bars" aria-hidden="true">
    {[22, 34, 30, 48, 58, 72, 92].map((h, n) => <span key={n} style={{ ["--h" as string]: `${h}%`, ["--d" as string]: `${n * 0.18}s` }} />)}
    <svg viewBox="0 0 100 60" preserveAspectRatio="none"><polyline pathLength="1" points="4,50 20,42 34,45 50,32 64,24 80,15 96,5" /></svg>
  </div>;
  return <div className="in-vis in-orbit" aria-hidden="true">
    <i className="in-ring" style={{ ["--d" as string]: "0s" }} /><i className="in-ring" style={{ ["--d" as string]: "1.3s" }} /><i className="in-ring" style={{ ["--d" as string]: "2.6s" }} />
    <div className="in-spin">{[0, 120, 240].map((a, n) => <span key={a} className="in-sat" style={{ ["--a" as string]: `${a}deg`, ["--r" as string]: `${58 + n * 8}px` }} />)}</div>
    <b className="in-core" />
  </div>;
}

export default function Insights() {
  return <main className="in-page">
    <section className="shell page-hero in-hero">
      <div className="in-orb in-orb-a" aria-hidden="true" /><div className="in-orb in-orb-b" aria-hidden="true" /><svg className="in-waves" viewBox="0 0 1440 620" preserveAspectRatio="none" aria-hidden="true">
        <defs><linearGradient id="in-wg" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stopColor="#4682ff" stopOpacity="0"/><stop offset=".35" stopColor="#4682ff"/><stop offset=".7" stopColor="#D97757"/><stop offset="1" stopColor="#D97757" stopOpacity="0"/></linearGradient></defs>
        {["M-20 420 C 260 300, 460 520, 740 400 S 1200 250, 1460 360","M-20 480 C 300 380, 520 580, 800 470 S 1180 330, 1460 430","M-20 360 C 220 260, 520 440, 760 330 S 1160 190, 1460 290"].map((d, n) => <g key={n}><path className="in-wave-base" d={d} /><path className="in-wave-run" d={d} style={{ ["--d" as string]: `${n * -3.2}s` }} /></g>)}
      </svg>
      <div className="in-particles" aria-hidden="true">{Array.from({ length: 22 }, (_, n) => <i key={n} style={{ ["--x" as string]: `${(n * 37 + 11) % 100}%`, ["--y" as string]: `${(n * 53 + 7) % 90}%`, ["--s" as string]: `${3 + (n % 4) * 1.5}px`, ["--d" as string]: `${(n * 0.7) % 9}s`, ["--t" as string]: `${9 + (n % 5) * 2}s` }} className={n % 3 ? "pb" : "po"} />)}</div>
      <div className="eyebrow">Notes from the build</div>
      <h1>Ideas, lessons & <span className="gradient">perspectives.</span></h1>
      <p className="in-roll" aria-label="Notes on software, product thinking, databases, design, learning and Zimbabwe">
        <span className="in-roll-label">Writing about</span>
        <span className="in-roll-window" aria-hidden="true">{words.map((w, n) => <span key={w} style={{ ["--n" as string]: n }}>{w}</span>)}</span>
      </p>
      <p className="lead">A space for practical software lessons, product thinking and notes from building technology in Zimbabwe.</p>
      <div className="in-status"><span className="in-pulse" />First articles are in progress</div>
    </section>


    <section className="shell in-section">
      <Reveal><div className="eyebrow">What’s coming</div><h2>Four topics I am <span className="gradient">writing about.</span></h2></Reveal>
      <div className="in-topics">{topics.map((t, n) => <Reveal key={t.id} delay={n * 110}><article className="in-topic">
        <Visual id={t.id} />
        <div className="in-topic-body"><small>{t.tag}</small><h3>{t.title}</h3><p>{t.text}</p><span className="in-chip"><span className="in-pulse" />In draft</span></div>
      </article></Reveal>)}</div>
    </section>

    <section className="shell in-section">
      <Reveal><div className="eyebrow">How an article is made</div><h2>From a rough idea to <span className="gradient">something useful.</span></h2></Reveal>
      <ol className="in-steps"><span className="in-steps-line" aria-hidden="true"><span /></span>
        {steps.map(([t, d, Icon], n) => <li key={t} style={{ ["--i" as string]: n }}><span className="in-step-ico"><Icon size={22} strokeWidth={1.9} /></span><b>{t}</b><small>{d}</small></li>)}
      </ol>
    </section>

    <section className="shell in-section">
      <Reveal><div className="eyebrow">Working principles</div><h2>What guides the <span className="gradient">writing.</span></h2></Reveal>
      <Reveal delay={120}><Principles /></Reveal>
    </section>

    <section className="shell in-section in-cta-sec">
      <Reveal><div className="in-cta">
        <div><div className="eyebrow">Stay close</div><h2>Want to read the first article <span className="gradient">when it lands?</span></h2><p>Send me a message and I will let you know as soon as new writing is published.</p></div>
        <Link className="btn primary in-cta-btn" href="/contact">Get in touch <ArrowUpRight size={16} /></Link>
      </div></Reveal>
    </section>
  </main>;
}
