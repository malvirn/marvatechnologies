import type { MetadataRoute } from "next";
import { normalizeSiteUrl } from "@/lib/insights-seo.mjs";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = normalizeSiteUrl();
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: siteUrl + "/sitemap.xml",
    host: siteUrl
  };
}
