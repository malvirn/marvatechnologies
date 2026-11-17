import { channels } from "@/lib/channels";

const email = channels.find(c => c.key === "email")!;
const call = channels.find(c => c.key === "call")!;

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="sf-inner">
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
