import type { Metadata } from "next";
import { Inter, Sora, JetBrains_Mono } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-inter", display: "swap" });
const sora = Sora({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-sora", display: "swap" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: "Marva Technologies — Technology. Innovation. Impact.",
  description: "Digital solutions, thoughtful engineering and practical software by Marva Technologies.",
  metadataBase: new URL("https://marvatechnologies.pages.dev"),
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: { title: "Marva Technologies", description: "Technology. Innovation. Impact.", images: ["/branding/marva-logo.svg"] }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" className={`${inter.variable} ${sora.variable} ${jetbrainsMono.variable}`}>
    <body>
      <Header />
      {children}
    </body>
  </html>;
}
