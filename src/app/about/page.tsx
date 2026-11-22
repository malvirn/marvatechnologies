import type { Metadata } from "next";
import Link from "next/link";
import Journey from "@/components/Journey";
import { normalizeSiteUrl } from "@/lib/insights-seo.mjs";

const pageTitle = "About Malvirn Gomo | Marva Technologies";
const pageDescription = "Meet Malvirn Gomo, the developer behind Marva Technologies, and explore the values, experience and projects shaping his journey in software development.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: normalizeSiteUrl() + "/about" },
  openGraph: {
    type: "website",
    url: normalizeSiteUrl() + "/about",
    title: pageTitle,
    description: pageDescription,
    siteName: "Marva Technologies",
    images: [{ url: "/branding/marva-social.png", width: 1200, height: 630, alt: "Marva Technologies" }]
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: ["/branding/marva-social.png"]
  }
};

export default function About(){return <main><div className="about-top"><div className="shell page-hero"><div className="eyebrow">The person behind the work</div><h1>Curiosity. <span className="gradient">Craft.</span> Progress.</h1><p className="lead">I’m Malvirn Gomo, a third-year IT student at Chinhoyi University of Technology and a full-stack developer from Zimbabwe. I build practical apps with React, Node.js and PostgreSQL/Supabase that solve local problems.</p><section className="section"><div className="eyebrow">My point of view</div><h2>Build for people. Solve real problems.</h2><p className="section-copy">Marva Technologies is my software brand, built with the foundations to grow into a technology company. My focus is useful software, clear communication and continuous learning.</p><p><Link className="btn primary" href="#jn-heading">Explore projects ↗</Link></p></section></div></div><Journey /></main>}
