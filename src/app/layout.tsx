import type { Metadata, Viewport } from "next";
import Header from "@/components/Header";
import FloatingMessage from "@/components/FloatingMessage";
import SiteFooter from "@/components/SiteFooter";
import "./globals.css";

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0A0A0A" };

export const metadata: Metadata = {
  title: "Marva Technologies — Technology. Innovation. Impact.",
  description: "Digital solutions, thoughtful engineering and practical software by Marva Technologies.",
  metadataBase: new URL("https://marvatechnologies.pages.dev"),
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: { title: "Marva Technologies", description: "Technology. Innovation. Impact.", images: ["/branding/marva-logo.svg"] }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" suppressHydrationWarning>
    <head>
      <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem("marva-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t;else document.documentElement.dataset.theme="dark";if(t==="light"){var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content","#F6F4EF")}}catch(e){document.documentElement.dataset.theme="dark"}` }} />
    </head>
    <body>
      <Header />
      {children}
      <SiteFooter />
      <FloatingMessage />
    </body>
  </html>;
}
