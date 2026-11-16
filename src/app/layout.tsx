import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: "Marva Technologies — Technology. Innovation. Impact.",
  description: "Digital solutions, thoughtful engineering and practical software by Malvirn Gomo.",
  metadataBase: new URL("https://marvatechnologies.pages.dev")
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body><Navbar />{children}</body>
    </html>
  );
}