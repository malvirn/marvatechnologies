import type { MetadataRoute } from "next";
import { getPublishedLessons } from "@/lib/insights-content.mjs";
import { getSitemapEntries } from "@/lib/insights-seo.mjs";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return getSitemapEntries(getPublishedLessons()) as MetadataRoute.Sitemap;
}
