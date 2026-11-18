import { channels } from "@/lib/channels";


export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="sf-inner">
        <div className="sf-col">
          <h2 className="sf-title">Get in touch</h2>
          <ul className="sf-social" aria-label="Social and contact links">
            {channels.filter(c => c.key !== "email" && c.key !== "call").map(c => (
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
        </div>
      </div>

      <div className="sf-bottom">
        <span>© {new Date().getFullYear()} Marva Technologies. Built with purpose.</span>
        <span>Founded by Malvirn Gomo · Zimbabwe</span>
      </div>
    </footer>
  );
}
