import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock3 } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import { getPublishedLessonBySlug, getPublishedLessons, extractTableOfContents, getRelatedLessons, getLessonNavigation } from "@/lib/insights-content.mjs";
import { mdxComponents } from "@/components/insights/MdxComponents";
import { normalizeSiteUrl, buildArticleJsonLd, buildBreadcrumbJsonLd, serializeJsonLd } from "@/lib/insights-seo.mjs";
import { LessonNavigation, LessonPager, ReadingProgress } from "@/components/insights/LessonNavigation";

const SITE_URL = normalizeSiteUrl();
export const dynamicParams = false;
const EMPTY_BUILD_SLUG = "__build-notes-empty__";

export function generateStaticParams() {
  const lessons = getPublishedLessons();
  return lessons.length ? lessons.map((lesson) => ({ slug: lesson.slug })) : [{ slug: EMPTY_BUILD_SLUG }];
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
      authors: ["Malvirn Gomo"],
      images: [{ url: url + "/opengraph-image", width: 1200, height: 630, alt: lesson.title }]
    },
    twitter: { card: "summary_large_image", title: lesson.title, description: lesson.summary, images: [url + "/opengraph-image"] }
  };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(value));
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = getPublishedLessonBySlug(slug);
  if (!lesson) notFound();

  const lessons = getPublishedLessons();
  const toc = extractTableOfContents(lesson.content);
  const related = getRelatedLessons(lesson, lessons);
  const pager = getLessonNavigation(lesson, lessons);
  const articleJsonLd = buildArticleJsonLd(lesson, SITE_URL);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(lesson, SITE_URL);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }} />
      <ReadingProgress />
      <main id="main-content" tabIndex={-1} className="bn-article">
        <nav className="bn-breadcrumb" aria-label="Breadcrumb">
          <Link href="/insights">Insights</Link><span aria-hidden="true">/</span><Link href={"/insights?track=" + encodeURIComponent(lesson.track)}>{lesson.track}</Link>
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

        <LessonNavigation items={toc} variant="mobile" />
        <div className="bn-article-layout">
          <article id="bn-article-body" className="bn-article-body">
            <MDXRemote source={lesson.content} components={mdxComponents} options={{ mdxOptions: { rehypePlugins: [[rehypeSlug, { prefix: "bn-" }]] } }} />
          </article>
          <div className="bn-toc-rail"><LessonNavigation items={toc} variant="desktop" /></div>
        </div>

        {related.length > 0 && <section className="bn-related" aria-labelledby="bn-related-title">
          <div className="bn-related-heading"><span className="eyebrow">Keep exploring</span><h2 id="bn-related-title">Related notes</h2></div>
          <div className="bn-related-list">
            {related.map((item) => <Link className="bn-related-item" href={"/insights/" + item.slug} key={item.slug}>
              <span>{item.track} · {item.level}</span><strong>{item.title}</strong><small>{item.summary}</small>
            </Link>)}
          </div>
        </section>}

        <LessonPager previous={pager.previous} next={pager.next} />
        <footer className="bn-article-footer">
          <p>Have a system problem worth thinking through? <Link href="/contact">Let’s talk about it.</Link></p>
          <Link href="/insights">← Back to all notes</Link>
        </footer>
      </main>
    </>
  );
}
