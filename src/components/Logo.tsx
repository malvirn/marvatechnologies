"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function Logo() {
  const reduce = useReducedMotion();
  const pulse = reduce ? {} : { scale: [1, 1.5, 1], opacity: [1, 0.6, 1] };
  return (
    <span className="marva-mark" aria-hidden="true">
      <svg viewBox="0 0 40 40" width="40" height="40" fill="none">
        {!reduce && <motion.circle cx="20" cy="20" r="17" stroke="var(--accent)" strokeWidth="0.8" strokeDasharray="2 4" animate={{ rotate: 360 }} transition={{ duration: 14, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "20px 20px" }} />}
        <path d="M11 29V13l9 10 9-10v16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {[[11,13],[20,23],[29,13]].map(([cx,cy],i) => <motion.circle key={i} cx={cx} cy={cy} r="2" fill="var(--accent)" animate={pulse} transition={reduce ? {} : { duration: 2.4, repeat: Infinity, delay: i * 0.32, ease: "easeInOut" }} />)}
        {!reduce && <motion.circle cx="20" cy="3" r="1.7" fill="var(--accent)" animate={{ rotate: 360 }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "20px 20px" }} />}
      </svg>
    </span>
  );
}
