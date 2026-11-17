import Link from "next/link";
import { ArrowUpRight, Phone } from "lucide-react";
import Reveal from "@/components/Reveal";
import { channels } from "@/lib/channels";

export const metadata = {
  title: "Contact — Marva Technologies",
  description: "Get in touch with Marva Technologies by WhatsApp, phone, email, LinkedIn, Instagram or X."
};

export default function Contact() {
  return (
    <main className="shell page-hero ct">
      <div className="eyebrow">Contact Marva Technologies</div>
      <h1>
        Get in touch <span className="gradient">with me.</span>
      </h1>
      <p className="lead ct-lead">
        Have a project idea, a question or an opportunity? Pick whichever channel suits you. I reply fast.
      </p>

      <div className="chips ct-open" aria-label="Open to">
        <span>Open to:</span>
        <span>Software projects</span>
        <span>Internships</span>
        <span>Partnerships</span>
        <span>Learning &amp; mentorship</span>
      </div>

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
                  <span className="ct-icon" style={{ ["--brand" as string]: c.color }}>{c.icon}</span>
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
              alt="Two smiling colleagues looking at a phone together"
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
