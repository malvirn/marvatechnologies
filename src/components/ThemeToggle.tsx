"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "dark" | "light";
const KEY = "marva-theme";

function apply(theme: Theme) {
  const root = document.documentElement;
  root.classList.add("theme-anim");
  root.dataset.theme = theme;
  try { localStorage.setItem(KEY, theme); } catch {}
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "light" ? "#F6F4EF" : "#0A0A0A");
  window.setTimeout(() => root.classList.remove("theme-anim"), 450);
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark");
  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);
  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    apply(next);
  };
  return { theme, toggle };
}

/** Sliding sun/moon switch. variant "row" is the full-width menu item, "icon" the compact header button. */
export default function ThemeToggle({ variant = "icon" }: { variant?: "icon" | "row" }) {
  const { theme, toggle } = useTheme();
  const light = theme === "light";
  const label = light ? "Switch to dark theme" : "Switch to light theme";

  if (variant === "icon") {
    return (
      <button type="button" className="theme-icon-btn" onClick={toggle} aria-label={label} title={label}>
        <Sun className="ti ti-sun" size={18} strokeWidth={2} />
        <Moon className="ti ti-moon" size={18} strokeWidth={2} />
      </button>
    );
  }

  return (
    <button type="button" className="theme-row" onClick={toggle} role="switch" aria-checked={light} aria-label={label}>
      <span className="theme-row-icon" aria-hidden="true"><Sun className="ti ti-sun" size={19} /><Moon className="ti ti-moon" size={19} /></span>
      <span className="theme-row-text"><b>Theme</b><small>{light ? "Light mode" : "Dark mode"}</small></span>
      <span className="theme-switch" aria-hidden="true">
        <span className="theme-stars"><i /><i /><i /></span>
        <span className="theme-clouds"><i /><i /></span>
        <span className="theme-knob"><Sun size={15} strokeWidth={2.4} className="k-sun" /><Moon size={15} strokeWidth={2.4} className="k-moon" /></span>
      </span>
    </button>
  );
}
