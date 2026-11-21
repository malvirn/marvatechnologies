import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import Principles from "@/components/Principles";
import CodeTyper from "@/components/CodeTyper";
import BuildNotesExplorer from "@/components/insights/BuildNotesExplorer";
import { getPublishedLessons } from "@/lib/insights-content.mjs";
import { buildCollectionJsonLd, serializeJsonLd } from "@/lib/insights-seo.mjs";

const SITE_URL = process.env.SITE_URL || "https://marvatechnologies.pages.dev";

export const metadata: Metadata = {
  title: "Build Notes | Marva Technologies",
  description: "Practical software engineering lessons from planning, building and maintaining real systems.",
  alternates: { canonical: SITE_URL + "/insights" },
  openGraph: {
    title: "Build Notes | Marva Technologies",
    description: "Practical software engineering lessons from planning, building and maintaining real systems.",
    url: SITE_URL + "/insights",
    siteName: "Marva Technologies"
  },
  twitter: { card: "summary_large_image", title: "Build Notes | Marva Technologies", description: "Practical software engineering lessons from planning, building and maintaining real systems.", images: [SITE_URL + "/insights/opengraph-image.png"] },
  openGraph: { title: "Build Notes | Marva Technologies", description: "Practical software engineering lessons from planning, building and maintaining real systems.", url: SITE_URL + "/insights", siteName: "Marva Technologies", images: [{ url: SITE_URL + "/insights/opengraph-image.png", width: 1200, height: 630, alt: "Build Notes by Marva Technologies" }] }
};

export default function Insights() {
  const lessons = getPublishedLessons();
  const searchLessons = lessons.map(({ slug, title, summary, track, level, tags, readingTime, featured, publishedAt }) => ({
    slug, title, summary, track, level, tags, readingTime, featured, publishedAt
  }));

  return (
    <main className="in-page bn-page">
      <section className="shell page-hero in-hero bn-hero">
        <div className="in-orb in-orb-a" aria-hidden="true" />
        <div className="in-orb in-orb-b" aria-hidden="true" />
        <div className="in-waves" aria-hidden="true" />
        <div className="eyebrow">Notes from the build</div>
        <h1>Build Notes<span className="gradient">.</span></h1>
        <p className="lead">Practical lessons from planning, building and maintaining real software. Clear explanations, useful examples and the decisions behind the code.</p>
        <div className="bn-hero-code" aria-label="A small JavaScript example"><CodeTyper /></div>
        <div className="bn-hero-meta"><span>Frontend</span><i /> <span>Backend</span><i /> <span>System design</span><i /> <span>AI-assisted development</span></div>
      </section>

      <section className="shell bn-library" aria-labelledby="bn-library-title">
        <Reveal>
          <div className="eyebrow">The library</div>
          <h2 id="bn-library-title">Learn the thinking <span className="gradient">behind the build.</span></h2>
          <p className="bn-intro">Each note looks at why a technique matters, when to use it, how it works and what can go wrong.</p>
        </Reveal>
        <BuildNotesExplorer lessons={searchLessons} />
      </section>

      <section className="shell in-section">
        <Reveal><div className="eyebrow">Working principles</div><h2>What guides the <span className="gradient">writing.</span></h2></Reveal>
        <Reveal delay={120}><Principles /></Reveal>
      </section>

      <section className="shell in-section in-cta-sec">
        <Reveal><div className="in-cta">
          <div><div className="eyebrow">Stay close</div><h2>Have a problem worth <span className="gradient">solving?</span></h2><p>Let’s talk about the software you need and the people it should help.</p></div>
          <Link className="btn primary in-cta-btn" href="/contact">Start a conversation <ArrowUpRight size={16} /></Link>
        </div></Reveal>
      </section>
    </main>
  );
}
