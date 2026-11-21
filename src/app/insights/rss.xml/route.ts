import { buildRssFeed } from "@/lib/insights-seo.mjs";

export const dynamic = "force-static";
export const revalidate = false;

export function GET() {
  return new Response(buildRssFeed(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600"
    }
  });
}
