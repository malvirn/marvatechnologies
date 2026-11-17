import Link from "next/link";
import { ArrowUpRight, ArrowRight, Wrench, Database, BrainCircuit, Cloud, GitBranch, Code2 } from "lucide-react";

const stack = [
  { icon: Code2, name: "Frontend", detail: "Vanilla HTML, CSS and JavaScript" },
  { icon: Database, name: "Backend & database", detail: "Supabase, PostgreSQL and Edge Functions" },
  { icon: BrainCircuit, name: "AI diagnostic assist", detail: "Groq-backed Edge Function for fault-diagnosis assistance" },
  { icon: Cloud, name: "Hosting", detail: "Vercel" },
  { icon: GitBranch, name: "Version control", detail: "Git and GitHub" }
];

export default function Projects() {
  return (
    <main className="shell page-hero">
      <div className="eyebrow">Selected work</div>
      <h1>Software built around <span className="gradient">practical ideas.</span></h1>
      <p className="lead">A growing collection of projects, experiments and products developed through the Marva Technologies journey.</p>

      <article className="project">
        <div className="project-visual"><Wrench size={76} strokeWidth={1.2} /></div>
        <div>
          <div className="eyebrow">Completed project · Business software</div>
          <h2>Repair Management System</h2>
          <p className="section-copy">A lightweight repair-workshop management system built with a framework-free frontend and Supabase services. The project also includes an AI-assisted diagnostic feature, powered by a Groq-backed Edge Function, to help with fault diagnosis.</p>
          <p className="section-copy">I deliberately kept the stack simple and dependency-light, with the aim of making the system fast to load and straightforward to maintain for small repair shops using modest devices and internet connections.</p>
          <div className="chips"><span>Completed</span><span>Vanilla JavaScript</span><span>Supabase</span><span>AI-assisted diagnostics</span></div>
        </div>
      </article>

      <section className="section">
        <div className="eyebrow">Under the hood</div>
        <h2>Technology <span className="gradient">stack.</span></h2>
        <p className="section-copy">A focused set of technologies chosen for simplicity, maintainability and practical deployment.</p>
        <div className="cards">
          {stack.map(({ icon: Icon, name, detail }, index) => (
            <article className="card" key={name}>
              <small>0{index + 1} / STACK</small>
              <h3><Icon size={19} style={{ display: "inline", marginRight: 10, color: "#62e5e0" }} />{name}</h3>
              <p>{detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="eyebrow">Design decision</div>
        <h2>Keep it lean. <span className="gradient">Make it useful.</span></h2>
        <p className="section-copy">Rather than introducing a large frontend framework, the system uses standard web technologies and managed backend services. This keeps the client-side stack lightweight while Supabase provides the PostgreSQL database and server-side Edge Functions.</p>
        <p className="section-copy">The Groq integration is described as diagnostic assistance, not an automated repair decision-maker. A human technician remains responsible for assessing faults and deciding on repairs.</p>
        <Link href="/contact" className="btn secondary">Discuss a project <ArrowUpRight size={15} /></Link>
      </section>

      <section className="section">
        <div className="eyebrow">More work</div>
        <h2>Tutoring marketplace</h2>
        <p className="section-copy">A concept exploring how learners and tutors could connect through a digital platform. Development status and confirmed features will be published when verified.</p>
        <Link href="/contact" className="btn secondary">Start a conversation <ArrowRight size={15} /></Link>
      </section>
    </main>
  );
}