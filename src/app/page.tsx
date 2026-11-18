import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Hero from "@/components/Hero";
import Founder from "@/components/Founder";
import WorkShowcase from "@/components/WorkShowcase";
import ContactBand from "@/components/ContactBand";
import TechShowcase from "@/components/TechShowcase";

export default function Home(){return <main>
<Hero />
<Founder />
<TechShowcase />
<section className="section"><div className="shell"><div className="section-head"><div className="eyebrow">Selected work</div><h2>Ideas becoming <span className="gradient">real products.</span></h2><p className="section-copy">A look at practical software projects and experiments from the Marva Technologies journey.</p></div>
<article className="project"><WorkShowcase /><div><div className="eyebrow">Featured project · Completed</div><h2>Repair Management System</h2><p className="section-copy">A lightweight repair-workshop management system built with a framework-free frontend and Supabase. It includes an AI-assisted diagnostic feature, powered by a Groq-backed Edge Function, that helps with fault diagnosis. I kept the stack simple so it loads fast on modest devices and connections.</p><div className="chips"><span>Business software</span><span>Vanilla JavaScript</span><span>Supabase</span><span>AI-assisted diagnostics</span></div><Link className="btn secondary" href="/about#jn-heading">See all projects <ArrowUpRight size={15}/></Link></div></article></div></section>
<section className="section"><div className="shell"><ContactBand /></div></section>
</main>}
