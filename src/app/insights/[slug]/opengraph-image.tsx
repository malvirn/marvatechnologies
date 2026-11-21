import { ImageResponse } from "next/og";
import { publishedOgLessons } from "@/generated/insights-og-data.mjs";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return publishedOgLessons.map((lesson) => ({ slug: lesson.slug }));
}

export default async function OpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = publishedOgLessons.find((item) => item.slug === slug);
  const title = lesson?.title ?? "Build Notes";
  const track = lesson?.track ?? "Marva Technologies";
  const summary = lesson?.summary ?? "Practical software engineering lessons.";
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "62px 72px", background: "#0A0A0A", color: "#F5F5F5", fontFamily: "Arial, sans-serif", position: "relative" }}>
      <div style={{ position: "absolute", right: -130, top: -190, width: 650, height: 650, borderRadius: 325, border: "1px solid rgba(245,245,245,.13)", display: "flex" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 15, fontSize: 22, letterSpacing: 4, color: "#A3A3A3" }}>
        <div style={{ width: 40, height: 40, border: "2px solid #D97757", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", color: "#F5F5F5", fontSize: 21, letterSpacing: 0 }}>M</div>
        MARVA TECHNOLOGIES <span style={{ color: "#D97757" }}>/</span> BUILD NOTES
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 1000 }}>
        <div style={{ color: "#D97757", fontSize: 22, letterSpacing: 4 }}>{track.toUpperCase()}</div>
        <div style={{ fontSize: title.length > 48 ? 58 : title.length > 32 ? 68 : 82, lineHeight: 1.08, fontWeight: 700, letterSpacing: -3 }}>{title}</div>
        <div style={{ maxWidth: 900, fontSize: 26, lineHeight: 1.4, color: "#A3A3A3" }}>{summary}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(245,245,245,.2)", paddingTop: 20, fontSize: 19, color: "#A3A3A3" }}>
        <span>NOTES FROM THE BUILD</span>
        <span>marvatechnologies.pages.dev</span>
      </div>
    </div>,
    size
  );
}
