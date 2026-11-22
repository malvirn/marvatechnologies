"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

// The note studio has its own sidebar, so the public header, footer and chat button are hidden there.
export default function PublicChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "";
  if (pathname === "/add-note" || pathname.startsWith("/add-note/")) return null;
  return <>{children}</>;
}
