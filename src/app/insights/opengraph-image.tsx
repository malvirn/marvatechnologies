import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "Build Notes by Marva Technologies";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "66px 76px", background: "#0A0A0A", color: "#F5F5F5", fontFamily: "Arial, sans-serif", position: "relative" }}>
      <div style={{ position: "absolute", right: -100, top: -210, width: 620, height: 620, borderRadius: 310, border: "1px solid rgba(245,245,245,.13)", display: "flex" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 24, letterSpacing: 5, color: "#A3A3A3" }}>
        <div style={{ width: 42, height: 42, border: "2px solid #D97757", borderRadius: 21, display: "flex", alignItems: "center", justifyContent: "center", color: "#F5F5F5", fontSize: 22, letterSpacing: 0 }}>M</div>
        MARVA TECHNOLOGIES
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 940 }}>
        <div style={{ color: "#D97757", fontSize: 23, letterSpacing: 5 }}>NOTES FROM THE BUILD</div>
        <div style={{ fontSize: 92, lineHeight: 1.02, fontWeight: 700, letterSpacing: -5 }}>Build Notes<span style={{ color: "#D97757" }}>.</span></div>
        <div style={{ maxWidth: 800, fontSize: 30, lineHeight: 1.4, color: "#A3A3A3" }}>Practical lessons from planning, building and maintaining real software.</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(245,245,245,.2)", paddingTop: 22, fontSize: 20, color: "#A3A3A3" }}>
        <span>Frontend · Backend · System Design · AI</span>
        <span>marvatechnologies.pages.dev</span>
      </div>
    </div>,
    size
  );
}
