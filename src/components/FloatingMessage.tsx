"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FloatingMessage() {
  const pathname = usePathname();
  if (pathname === "/contact" || pathname === "/contact/") return null;

  return (
    <div className="fm" aria-live="polite">
      <span className="fm-tip" aria-hidden="true">
        <span className="fm-dots"><i /><i /><i /></span>
        <span className="fm-msg">Let’s talk</span>
      </span>

      <Link href="/contact" className="fm-btn" aria-label="Send us a message">
        <span className="fm-pulse" aria-hidden="true" />
        <span className="fm-pulse fm-pulse-2" aria-hidden="true" />
        <svg className="fm-icon" viewBox="0 0 60 60" aria-hidden="true">
          <defs>
            <linearGradient id="fm-green" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#67F27A" />
              <stop offset="1" stopColor="#0BBE2C" />
            </linearGradient>
          </defs>
          <rect width="60" height="60" rx="14" fill="url(#fm-green)" />
          <g className="fm-bubble">
            <path
              fill="#fff"
              d="M30 12.5c-11.6 0-21 7.4-21 16.6 0 5.2 3 9.8 7.7 12.8-.4 2.4-1.6 4.6-3.4 6.4-.5.5-.1 1.4.6 1.3 4-.5 7.4-2.1 9.6-3.8 2.1.5 4.3.7 6.5.7 11.6 0 21-7.4 21-16.6S41.6 12.5 30 12.5z"
            />
          </g>
        </svg>
        <span className="fm-badge" aria-hidden="true">1</span>
      </Link>
    </div>
  );
}
