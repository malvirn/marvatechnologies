import Link from "next/link";
import { ArrowUpRight, Instagram, Linkedin, Mail, MessageCircle, Phone } from "lucide-react";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "Contact — Marva Technologies",
  description: "Get in touch with Marva Technologies by WhatsApp, phone, email, LinkedIn, Instagram or X."
};

function XIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const WHATSAPP = "263711478580";
const PHONE = "+263787874724";
const EMAIL = "malvirngomo8@gmail.com";

const channels = [
  {
    key: "whatsapp",
    label: "WhatsApp",
    value: "+263 71 147 8580",
    note: "Fastest way to reach us",
    href: `https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hello Marva Technologies, I’d like to talk about a project.")}`,
    icon: <MessageCircle size={20} />,
    external: true
  },
  {
    key: "call",
    label: "Call",
    value: "+263 78 787 4724",
    note: "Speak to us directly",
    href: `tel:${PHONE}`,
    icon: <Phone size={20} />,
    external: false
  },
  {
    key: "email",
    label: "Email",
    value: EMAIL,
    note: "Projects, collaborations and opportunities",
    href: `mailto:${EMAIL}?subject=${encodeURIComponent("Marva Technologies enquiry")}`,
    icon: <Mail size={20} />,
    external: false
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    value: "Malvirn Gomo",
    note: "Professional profile",
    href: "https://www.linkedin.com/in/malvirn-gomo-4a7a6841a",
    icon: <Linkedin size={20} />,
    external: true
  },
  {
    key: "instagram",
    label: "Instagram",
    value: "@m_a_r_v_a_8",
    note: "Behind the scenes",
    href: "https://www.instagram.com/m_a_r_v_a_8",
    icon: <Instagram size={20} />,
    external: true
  },
  {
    key: "x",
    label: "X",
    value: "@GMOMO05",
    note: "Updates and thoughts",
    href: "https://x.com/GMOMO05",
    icon: <XIcon />,
    external: true
  }
];

export default function Contact() {
  return (
    <main className="shell page-hero ct">
      <div className="eyebrow">Contact Marva Technologies</div>
      <h1>
        Get in touch <span className="gradient">with us.</span>
      </h1>
      <p className="lead ct-lead">
        Have a project idea, a question or an opportunity? Pick whichever channel suits you. We reply fast.
      </p>

      <div className="ct-actions">
        <a className="intro-button button-accent" href={channels[0].href} target="_blank" rel="noopener noreferrer">
          Chat on WhatsApp <ArrowUpRight size={16} className="button-arrow" />
        </a>
        <a className="intro-button button-outline" href={channels[1].href}>
          Call now <Phone size={16} className="button-arrow" />
        </a>
      </div>

      <div className="ct-grid">
        <ul className="ct-list">
          {channels.map((c, i) => (
            <li key={c.key}>
              <Reveal delay={i * 60}>
                <a
                  className="ct-item"
                  href={c.href}
                  {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  aria-label={`${c.label}: ${c.value}`}
                >
                  <span className="ct-icon">{c.icon}</span>
                  <span className="ct-text">
                    <span className="ct-label">{c.label}</span>
                    <span className="ct-value">{c.value}</span>
                    <span className="ct-note">{c.note}</span>
                  </span>
                  <ArrowUpRight size={18} className="ct-arrow" aria-hidden="true" />
                </a>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal className="ct-poster-wrap" delay={120}>
          <figure className="ct-poster">
            <img
              src="/contact/get-in-touch.webp"
              width={941}
              height={1672}
              alt="Two smiling colleagues looking at a phone together beside the words Get in touch with us"
              loading="lazy"
              decoding="async"
            />
          </figure>
        </Reveal>
      </div>

      <p className="muted ct-foot">Based in Harare, Zimbabwe. Open daily.</p>
      <Link href="/" className="muted">← Back home</Link>
    </main>
  );
}
