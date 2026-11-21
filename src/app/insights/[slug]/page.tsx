import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock3 } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPublishedLessonBySlug, getPublishedLessons } from "@/lib/insights-content.mjs";
import { mdxComponents } from "@/components/insights/MdxComponents";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://marvatechnologies.pages.dev";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedLessons().map((lesson) => ({ slug: lesson.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getPublishedLessonBySlug(slug);
  if (!lesson) return { title: "Note not found | Build Notes" };

  const url = SITE_URL + "/insights/" + lesson.slug;
  return {
    title: lesson.title + " | Build Notes",
    description: lesson.summary,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: lesson.title,
      description: lesson.summary,
      url,
      siteName: "Marva Technologies",
      publishedTime: lesson.publishedAt,
      modifiedTime: lesson.updatedAt,
      authors: ["Malvirn Gomo"]
    },
    twitter: { card: "summary", title: lesson.title, description: lesson.summary }
  };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(value));
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = getPublishedLessonBySlug(slug);
  if (!lesson) notFound();

  return (
    <main className="bn-article">
      <nav className="bn-breadcrumb" aria-label="Breadcrumb">
        <Link href="/insights">Insights</Link><span aria-hidden="true">/</span><span>{lesson.track}</span>
      </nav>

      <header className="bn-article-head">
        <div className="bn-article-track">{lesson.track} / {lesson.level}</div>
        <h1>{lesson.title}</h1>
        <p className="bn-article-summary">{lesson.summary}</p>
        <div className="bn-article-meta">
          <span><Clock3 size={14} /> {lesson.readingTime} min read</span>
          <span>Updated {formatDate(lesson.updatedAt)}</span>
          <span>Last reviewed {formatDate(lesson.lastReviewed)}</span>
          {lesson.builtFrom && <span>Built from: {lesson.builtFrom}</span>}
        </div>
      </header>

      <article className="bn-article-body">
        <MDXRemote source={lesson.content} components={mdxComponents} />
      </article>

      <footer className="bn-article-footer">
        <p>Have a system problem worth thinking through? <Link href="/contact">Let’s talk about it.</Link></p>
        <Link href="/insights">← Back to all notes</Link>
      </footer>
    </main>
  );
}
