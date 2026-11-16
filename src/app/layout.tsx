import type { Metadata } from "next";
import { Inter, Sora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
const inter = Inter({subsets:["latin"],variable:"--font-inter",display:"swap"});
const sora = Sora({subsets:["latin"],variable:"--font-sora",display:"swap"});
const mono = JetBrains_Mono({subsets:["latin"],variable:"--font-mono",display:"swap"});
export const metadata:Metadata={title:"Marva Technologies — Technology. Innovation. Impact.",description:"Digital solutions, thoughtful engineering and practical software by Marva Technologies.",metadataBase:new URL("https://marvatechnologies.pages.dev"),icons:{icon:"/favicon.svg",shortcut:"/favicon.svg"},openGraph:{title:"Marva Technologies",description:"Technology. Innovation. Impact.",images:["/branding/marva-logo.svg"]}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body className={`${inter.variable} ${sora.variable} ${mono.variable}`}><Navbar/>{children}</body></html>}