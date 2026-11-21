import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import Reveal from "@/components/Reveal";
import Principles from "@/components/Principles";
import CodeTyper from "@/components/CodeTyper";
import { getPublishedLessons } from "@/lib/insights-content";

export default function Insights() {
  const lessons = getPublishedLessons();
  const featured = lessons.find((lesson) => lesson.featured) ?? lessons[0];
  const remaining = featured ? lessons.filter((lesson) => lesson.slug !== featured.slug) : [];

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

        {featured ? (
          <>
            <Reveal>
              <Link className="bn-featured" href={`/insights/${featured.slug}`}>
                <div className="bn-featured-top"><span>Featured note</span><span>{featured.track}</span></div>
                <div className="bn-featured-main">
                  <div><h3>{featured.title}</h3><p>{featured.summary}</p></div>
                  <span className="bn-read-link">Read note <ArrowUpRight size={17} /></span>
                </div>
                <div className="bn-meta"><span>{featured.level}</span><span><Clock3 size={14} /> {featured.readingTime} min read</span><span>{featured.tags.slice(0, 2).join(" · ")}</span></div>
              </Link>
            </Reveal>
            {remaining.length > 0 && <div className="bn-list" aria-label="All notes">
              {remaining.map((lesson, index) => (
                <Reveal key={lesson.slug} delay={index * 60}>
                  <Link className="bn-list-item" href={`/insights/${lesson.slug}`}>
                    <span className="bn-list-number">{String(index + 2).padStart(2, "0")}</span>
                    <span className="bn-list-copy"><strong>{lesson.title}</strong><small>{lesson.summary}</small></span>
                    <span className="bn-list-meta">{lesson.track} · {lesson.readingTime} min</span>
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </Link>
                </Reveal>
              ))}
            </div>}
          </>
        ) : (
          <div className="bn-empty">
            <span className="bn-empty-index">01 / Preparing the first notes</span>
            <h3>Good notes take more than a code snippet.</h3>
            <p>The first lessons are being written and reviewed. They will be published here when the examples are ready to teach something useful.</p>
          </div>
        )}
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
