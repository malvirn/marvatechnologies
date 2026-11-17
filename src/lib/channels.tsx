import { Phone } from "lucide-react";
import { BRAND_PATHS } from "./brand-paths";

export const WHATSAPP = "263711478580";
export const PHONE = "+263787874724";
export const EMAIL = "malvirngomo8@gmail.com";

function Brand({ d, fill, size = 22 }: { d: string; fill: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} aria-hidden="true" focusable="false">
      <path d={d} />
    </svg>
  );
}

function InstagramGlyph({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="ig-grad" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#FEDA75" />
          <stop offset=".3" stopColor="#FA7E1E" />
          <stop offset=".55" stopColor="#D62976" />
          <stop offset=".8" stopColor="#962FBF" />
          <stop offset="1" stopColor="#4F5BD5" />
        </linearGradient>
      </defs>
      <path d={BRAND_PATHS.instagram} fill="url(#ig-grad)" />
    </svg>
  );
}

export type Channel = {
  key: string;
  label: string;
  value: string;
  note: string;
  href: string;
  external: boolean;
  /** brand colour used for the icon tint */
  color: string;
  icon: React.ReactNode;
};

export const channels: Channel[] = [
  {
    key: "whatsapp",
    label: "WhatsApp",
    value: "+263 71 147 8580",
    note: "Fastest way to reach me",
    href: `https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hello Marva Technologies, I’d like to talk about a project.")}`,
    external: true,
    color: "#25D366",
    icon: <Brand d={BRAND_PATHS.whatsapp} fill="#25D366" />
  },
  {
    key: "call",
    label: "Call",
    value: "+263 78 787 4724",
    note: "Speak to me directly",
    href: `tel:${PHONE}`,
    external: false,
    color: "#34C759",
    icon: <Phone size={21} color="#34C759" fill="#34C759" strokeWidth={1.6} aria-hidden="true" />
  },
  {
    key: "email",
    label: "Email",
    value: EMAIL,
    note: "Projects, collaborations and opportunities",
    href: `mailto:${EMAIL}?subject=${encodeURIComponent("Marva Technologies enquiry")}`,
    external: false,
    color: "#EA4335",
    icon: <Brand d={BRAND_PATHS.gmail} fill="#EA4335" />
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    value: "Malvirn Gomo",
    note: "Professional profile",
    href: "https://www.linkedin.com/in/malvirn-gomo-4a7a6841a",
    external: true,
    color: "#0A66C2",
    icon: <Brand d={BRAND_PATHS.linkedin} fill="#0A66C2" />
  },
  {
    key: "instagram",
    label: "Instagram",
    value: "@m_a_r_v_a_8",
    note: "Behind the scenes",
    href: "https://www.instagram.com/m_a_r_v_a_8",
    external: true,
    color: "#E1306C",
    icon: <InstagramGlyph />
  },
  {
    key: "x",
    label: "X",
    value: "@GMOMO05",
    note: "Updates and thoughts",
    href: "https://x.com/GMOMO05",
    external: true,
    // X's brand colour is black/white, so it follows the theme
    color: "var(--text)",
    icon: <Brand d={BRAND_PATHS.x} fill="currentColor" />
  }
];
