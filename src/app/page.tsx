import Link from "next/link";
import { ArrowUpRight, Code2, Database, Layers3, Sparkles } from "lucide-react";
import Hero from "@/components/Hero";
import Founder from "@/components/Founder";

const services = [
 {icon:Code2,number:"01",title:"Web applications",text:"Modern, responsive web experiences designed around real people and practical business needs."},
 {icon:Database,number:"02",title:"Business systems",text:"Purpose-built tools that help teams organise operations, information and everyday workflows."},
 {icon:Layers3,number:"03",title:"Data & integrations",text:"Thoughtful database design and connected services that give digital products a solid foundation."}
];

export default function Home(){return <main>
<Hero />
<Founder />
<section className="section"><div className="shell"><div className="section-head"><div className="eyebrow">What we focus on</div><h2>Technology with a <span className="gradient">purpose.</span></h2><p className="section-copy">Good software should do more than look impressive. It should make a task easier, a service more accessible or an idea possible.</p></div>
<div className="cards">{services.map(({icon:Icon,number,title,text})=><article className="card" key={number}><small>{number} / EXPERTISE</small><h3><span className="card-icon"><Icon size={18}/></span>{title}</h3><p>{text}</p></article>)}</div></div></section>
<section className="section"><div className="shell"><div className="section-head"><div className="eyebrow">Selected work</div><h2>Ideas becoming <span className="gradient">real products.</span></h2><p className="section-copy">A look at practical software projects and experiments from the Marva Technologies journey.</p></div>
<article className="project"><div className="project-visual"><Sparkles size={74} strokeWidth={1}/></div><div><div className="eyebrow">Featured project · Completed</div><h2>Repair Management System</h2><p className="section-copy">A completed software project focused on supporting repair-workshop management. A detailed case study will be added with verified features and project screenshots.</p><div className="chips"><span>Business software</span><span>Full-stack development</span></div><Link className="btn secondary" href="/projects">View project details <ArrowUpRight size={15}/></Link></div></article></div></section>
<section className="section"><div className="shell"><div className="contact-band"><div><div className="eyebrow">Have an idea?</div><h2>Let’s make something useful.</h2><p className="section-copy">Have a project, collaboration or opportunity in mind? Let’s talk.</p></div><Link className="btn primary" href="/contact">Get in touch <ArrowUpRight size={16}/></Link></div></div></section>
<footer className="shell footer"><span>© {new Date().getFullYear()} Marva Technologies. Built with purpose.</span><span>Founded by Malvirn Gomo · Zimbabwe</span></footer></main>}
