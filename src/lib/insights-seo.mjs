import { getPublishedLessons } from "./insights-content.mjs";

export function normalizeSiteUrl(value = process.env.SITE_URL || "https://marvatechnologies.pages.dev") {
  return String(value).trim().replace(/\/+$/, "");
}

export function escapeXml(value) {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

export function plainTextFromMdx(content) {
  return String(content)
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/~~~[\s\S]*?~~~/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/[>*_`~]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildRssFeed(lessons = getPublishedLessons(), siteUrl = normalizeSiteUrl()) {
  const base = normalizeSiteUrl(siteUrl);
  const items = lessons
    .filter((lesson) => lesson.status === "published")
    .map((lesson) => {
      const url = base + "/insights/" + encodeURIComponent(lesson.slug);
      const excerpt = plainTextFromMdx(lesson.content).slice(0, 700);
      const categories = (lesson.tags || []).map((tag) => "      <category>" + escapeXml(tag) + "</category>").join("\n");
      return [
        "    <item>",
        "      <title>" + escapeXml(lesson.title) + "</title>",
        "      <link>" + escapeXml(url) + "</link>",
        "      <guid isPermaLink=\"true\">" + escapeXml(url) + "</guid>",
        "      <description>" + escapeXml(lesson.summary + (excerpt ? " " + excerpt : "")) + "</description>",
        "      <pubDate>" + new Date(lesson.publishedAt).toUTCString() + "</pubDate>",
        "      <category>" + escapeXml(lesson.track) + "</category>",
        categories,
        "    </item>"
      ].filter(Boolean).join("\n");
    });
  const dates = lessons.filter((lesson) => lesson.status === "published").map((lesson) => lesson.updatedAt).sort();
  const lastBuildDate = dates.length ? "    <lastBuildDate>" + new Date(dates[dates.length - 1]).toUTCString() + "</lastBuildDate>\n" : "";
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    "    <title>Build Notes | Marva Technologies</title>",
    "    <link>" + escapeXml(base + "/insights") + "</link>",
    "    <description>Practical software engineering lessons from planning, building and maintaining real systems.</description>",
    "    <language>en</language>",
    '    <atom:link href="' + escapeXml(base + "/insights/rss.xml") + '" rel="self" type="application/rss+xml" />',
    lastBuildDate.trimEnd(),
    items.join("\n"),
    "  </channel>",
    "</rss>"
  ].filter(Boolean).join("\n");
}

export function getSitemapEntries(lessons = getPublishedLessons(), siteUrl = normalizeSiteUrl()) {
  const base = normalizeSiteUrl(siteUrl);
  const fixed = [
    { url: base + "/", changeFrequency: "monthly", priority: 1 },
    { url: base + "/about", changeFrequency: "monthly", priority: 0.7 },
    { url: base + "/services", changeFrequency: "monthly", priority: 0.7 },
    { url: base + "/insights", changeFrequency: "weekly", priority: 0.8 },
    { url: base + "/contact", changeFrequency: "monthly", priority: 0.6 }
  ];
  const published = lessons.filter((lesson) => lesson.status === "published").map((lesson) => ({
    url: base + "/insights/" + encodeURIComponent(lesson.slug),
    lastModified: new Date(lesson.updatedAt),
    changeFrequency: "monthly",
    priority: 0.7
  }));
  return [...fixed, ...published];
}

export function buildArticleJsonLd(lesson, siteUrl = normalizeSiteUrl()) {
  const base = normalizeSiteUrl(siteUrl);
  const url = base + "/insights/" + encodeURIComponent(lesson.slug);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: lesson.title,
    description: lesson.summary,
    datePublished: lesson.publishedAt,
    dateModified: lesson.updatedAt,
    author: { "@type": "Person", name: "Malvirn Gomo" },
    publisher: { "@type": "Organization", name: "Marva Technologies", url: base },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: url + "/opengraph-image.png",
    articleSection: lesson.track,
    keywords: lesson.tags
  };
}

export function buildBreadcrumbJsonLd(lesson, siteUrl = normalizeSiteUrl()) {
  const base = normalizeSiteUrl(siteUrl);
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: base },
      { "@type": "ListItem", position: 2, name: "Insights", item: base + "/insights" },
      { "@type": "ListItem", position: 3, name: lesson.track, item: base + "/insights?track=" + encodeURIComponent(lesson.track) },
      { "@type": "ListItem", position: 4, name: lesson.title, item: base + "/insights/" + encodeURIComponent(lesson.slug) }
    ]
  };
}

export function buildCollectionJsonLd(siteUrl = normalizeSiteUrl()) {
  const base = normalizeSiteUrl(siteUrl);
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Build Notes | Marva Technologies",
    description: "Practical software engineering lessons from planning, building and maintaining real systems.",
    url: base + "/insights",
    isPartOf: { "@type": "WebSite", name: "Marva Technologies", url: base }
  };
}

export function serializeJsonLd(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
}
