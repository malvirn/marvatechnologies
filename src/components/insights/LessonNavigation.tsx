"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export type TocItem = { id: string; text: string; level: 2 | 3 };

function TocLinks({ items, activeId }: { items: TocItem[]; activeId: string }) {
  return <ol className="bn-toc-list">{items.map((item) => <li className={item.level === 3 ? "bn-toc-sub" : ""} key={item.id}><a href={"#" + item.id} aria-current={activeId === item.id ? "location" : undefined}>{item.text}</a></li>)}</ol>;
}

export function LessonNavigation({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  useEffect(() => {
    if (!items.length || !("IntersectionObserver" in window)) return;
    const headings = items.map((item) => document.getElementById(item.id)).filter((node): node is HTMLElement => Boolean(node));
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]?.target.id) setActiveId(visible[0].target.id);
    }, { rootMargin: "-12% 0px -72% 0px", threshold: 0 });
    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [items]);
  if (!items.length) return null;
  return <>
    <details className="bn-toc-mobile"><summary>On this page <span>{items.length} sections</span></summary><nav aria-label="On this page"><TocLinks items={items} activeId={activeId} /></nav></details>
    <aside className="bn-toc-desktop" aria-label="On this page"><span className="bn-toc-title">On this page</span><nav><TocLinks items={items} activeId={activeId} /></nav></aside>
  </>;
}

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const article = document.getElementById("bn-article-body");
        if (!article) return;
        const top = article.getBoundingClientRect().top + window.scrollY;
        const distance = Math.max(1, article.offsetHeight - window.innerHeight);
        setProgress(Math.min(100, Math.max(0, ((window.scrollY - top) / distance) * 100)));
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);
  return <div className="bn-reading-progress" style={{ transform: "scaleX(" + (progress / 100) + ")" }} aria-hidden="true" />;
}

export function LessonPager({ previous, next }: { previous: { slug: string; title: string } | null; next: { slug: string; title: string } | null }) {
  if (!previous && !next) return null;
  return <nav className="bn-pager" aria-label="Lesson navigation">
    {previous ? <Link href={"/insights/" + previous.slug} className="bn-pager-link"><small>Previous note</small><strong>← {previous.title}</strong></Link> : <span />}
    {next ? <Link href={"/insights/" + next.slug} className="bn-pager-link bn-pager-next"><small>Next note</small><strong>{next.title} →</strong></Link> : <span />}
  </nav>;
}
