import Link from "next/link";
import { channels } from "@/lib/channels";
import BrandMark from "@/components/BrandMark";

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" }
];

const email = channels.find(c => c.key === "email")!;
const call = channels.find(c => c.key === "call")!;

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="sf-inner">
        <div className="sf-brand">
          <Link href="/" className="brand-lockup" aria-label="Marva Technologies home">
            <span className="brand-emblem" aria-hidden="true"><BrandMark /></span>
            <span className="wordmark">
              <span className="wordmark-main">MARVA</span>
              <span className="wordmark-sub">TECHNOLOGIES</span>
            </span>
          </Link>
          <p className="sf-tag">Technology. Innovation. Impact.</p>
          <p className="sf-about">Practical software and thoughtful engineering from Harare, Zimbabwe.</p>
        </div>

        <nav className="sf-col" aria-label="Footer navigation">
          <h2 className="sf-title">Explore</h2>
          <ul className="sf-links">
            {links.map(l => (
              <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
            ))}
          </ul>
        </nav>

        <div className="sf-col">
          <h2 className="sf-title">Get in touch</h2>
          <ul className="sf-social" aria-label="Social and contact links">
            {channels.map(c => (
              <li key={c.key}>
                <a
                  className="ct-icon sf-icon"
                  href={c.href}
                  style={{ ["--brand" as string]: c.color }}
                  aria-label={`${c.label}: ${c.value}`}
                  title={c.label}
                  {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {c.icon}
                </a>
              </li>
            ))}
          </ul>
          <ul className="sf-details">
            <li><a href={email.href}>{email.value}</a></li>
            <li><a href={call.href}>{call.value}</a></li>
          </ul>
        </div>
      </div>

      <div className="sf-bottom">
        <span>© {new Date().getFullYear()} Marva Technologies. Built with purpose.</span>
        <span>Founded by Malvirn Gomo · Zimbabwe</span>
      </div>
    </footer>
  );
}
