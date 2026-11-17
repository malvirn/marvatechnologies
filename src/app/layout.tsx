import type { Metadata, Viewport } from "next";
import { DM_Sans, Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import Header from "@/components/Header";
import FloatingMessage from "@/components/FloatingMessage";
import "./globals.css";

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body", display: "swap" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-display", display: "swap" });
const ibmPlexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0A0A0A" };

export const metadata: Metadata = {
  title: "Marva Technologies — Technology. Innovation. Impact.",
  description: "Digital solutions, thoughtful engineering and practical software by Marva Technologies.",
  metadataBase: new URL("https://marvatechnologies.pages.dev"),
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: { title: "Marva Technologies", description: "Technology. Innovation. Impact.", images: ["/branding/marva-logo.svg"] }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" className={`${dmSans.variable} ${spaceGrotesk.variable} ${ibmPlexMono.variable}`}>
    <body>
      <Header />
      {children}
      <FloatingMessage />
    </body>
  </html>;
}
