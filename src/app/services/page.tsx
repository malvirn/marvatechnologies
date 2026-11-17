import Image from "next/image";
import Link from "next/link";

const items=[["Web development","Responsive websites and web applications built around clear goals and user needs."],["Business software","Custom tools for organising workflows, records and day-to-day operations."],["Database solutions","Structured data, backend foundations and integrations for reliable applications."],["Product prototyping","Turning early ideas into practical prototypes that can be tested and improved."]];

const stacks=[
  {id:"vc",label:"Version Control",src:"/services/version-control.webp",alt:"Version Control: Git and GitHub keep every change tracked, reviewed and reversible"},
  {id:"fe",label:"Frontend",src:"/services/frontend.webp",alt:"Frontend Development: React and Next.js power fast, responsive interfaces"},
  {id:"be",label:"Backend",src:"/services/backend.webp",alt:"Backend and APIs: Node.js and TypeScript services that handle logic, authentication and integrations"},
  {id:"db",label:"Database",src:"/services/database.webp",alt:"Database and Storage: Supabase and PostgreSQL give your data a secure, structured home"},
];

export default function Services(){return <main className="shell page-hero">
<div className="eyebrow">Capabilities</div>
<h1>Digital services for <span className="gradient">real-world needs.</span></h1>
<p className="lead">Marva Technologies is developing a focused set of software capabilities. Project scope and delivery are discussed individually.</p>
<div className="cards">{items.map(([t,d],i)=><article className="card" key={t}><small>0{i+1} / CAPABILITY</small><h3>{t}</h3><p>{d}</p></article>)}</div>

<section className="section sv-section">
<div className="eyebrow">What we build</div>
<h2>Software made to <span className="gradient">fit your business.</span></h2>
<figure className="sv-card sv-feature">
<div className="sv-frame"><Image className="sv-img" src="/services/custom-software.webp" alt="Custom Business Software: tailor-made tools that organise your workflows, records and daily operations" width={1400} height={788} sizes="(max-width:1200px) 100vw, 1200px" priority/></div>
</figure>
</section>

<section className="section sv-section">
<div className="eyebrow">Our stack</div>
<h2>The tools behind <span className="gradient">every build.</span></h2>
<div className="sv-grid">{stacks.map((s,i)=><figure className={`sv-card sv-${s.id}`} key={s.id}>
<figcaption className="sv-tag">0{i+1} / {s.label}</figcaption>
<div className="sv-frame"><Image className="sv-img" src={s.src} alt={s.alt} width={1400} height={788} sizes="(max-width:800px) 100vw, 590px" loading="lazy"/></div>
</figure>)}</div>
</section>

<section className="section"><h2>Have a challenge to solve?</h2><Link className="btn primary" href="/contact">Discuss your project ↗</Link></section>
</main>}
