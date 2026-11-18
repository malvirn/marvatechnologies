import { channels, WHATSAPP } from "./channels";

export type Chip = { label: string; href?: string };
export type Answer = { lines: string[]; chips?: Chip[]; action?: "lead" };

const val = (k: string) => channels.find(c => c.key === k)?.value ?? "";
const WA_CHIP: Chip = { label: "Chat on WhatsApp ↗", href: `https://wa.me/${WHATSAPP}` };

export const DEFAULT_CHIPS: Chip[] = [
  { label: "What do you build?" },
  { label: "Your projects" },
  { label: "Pricing" },
  { label: "Start a project" }
];

type Entry = { id: string; k: string[]; a: string[]; next?: Chip[]; action?: "lead" };

/*
  Keywords: "word" must match a whole word, "word*" matches any word starting with it,
  and a phrase with spaces must appear as written. Earlier entries win ties.
*/
const ENTRIES: Entry[] = [
  {
    id: "lead",
    action: "lead",
    k: ["start a project", "new project", "hire you", "hire me", "work with you", "work together", "need a website", "want a website", "need an app", "want an app", "build me", "build for me", "can you build", "project idea", "get started", "make me a"],
    a: []
  },
  { id: "bot", k: ["are you a bot", "are you ai", "are you real", "are you human", "are you a robot", "is this a bot", "am i talking to"], a: ["Good question! I’m an automated assistant on this site that answers common questions instantly.", "For anything personal or specific, message me on WhatsApp and I’ll reply myself."], next: [WA_CHIP] },
  { id: "greeting", k: ["hi", "hie", "hello", "hey", "howdy", "good morning", "good afternoon", "good evening", "how are you", "whats up", "sup"], a: ["Hey! 👋 Good to see you here.", "Ask me about my work, projects or tech stack, or tap an option below."] },
  { id: "bye", k: ["bye", "goodbye", "see you", "cheers", "later"], a: ["Thanks for stopping by! 👋 Message me anytime if you want to talk about a project."] },
  { id: "compliment", k: ["nice*", "great", "awesome", "cool", "love", "amazing", "beautiful", "impressive", "wow", "well done", "good job", "thanks", "thank*", "appreciate"], a: ["Thank you, that means a lot! 🙏", "If something caught your eye or you have an idea, tell me about it."], next: [{ label: "Your projects" }, { label: "Start a project" }] },
  { id: "who", k: ["who are you", "who is malvirn", "who is this", "about you", "about yourself", "yourself", "malvirn", "founder", "introduce", "your name", "tell me about you"], a: ["I’m Malvirn Gomo, a third-year IT student at Chinhoyi University of Technology and a full-stack developer from Zimbabwe.", "Marva Technologies is my software brand, where I build practical apps that solve local problems."], next: [{ label: "Your projects" }, { label: "Tech stack" }] },
  { id: "education", k: ["student", "university", "studying", "study", "degree", "chinhoyi", "school", "education"], a: ["I’m a third-year IT student at Chinhoyi University of Technology, building real projects alongside my studies."], next: [{ label: "Your projects" }] },
  { id: "services", k: ["what do you build", "what do you do", "what do you offer", "what can you build", "services", "service", "offer*", "build*", "develop*"], a: ["I build four kinds of things:", "• Web development: responsive websites and web apps\n• Business software: tools for workflows, records and operations\n• Database solutions: structured data, backends and integrations\n• Product prototyping: early ideas turned into something testable"], next: [{ label: "Pricing" }, { label: "Start a project" }] },
  { id: "projects", k: ["project*", "portfolio", "case study", "examples", "example", "past work", "your work", "my work", "experience", "shipped"], a: ["I’ve built three products so far:", "• Repair Management System: a workshop tool with AI-assisted diagnostics\n• MaternityHelp (2024–25): a maternity clinic platform\n• Centric Auto Mobile (2026–now): workshop, inventory and accounting in one system", "Ask me about any of them, or see screenshots on the About page."], next: [{ label: "MaternityHelp" }, { label: "Centric Auto Mobile" }, { label: "Repair Management System" }] },
  { id: "maternity", k: ["maternity*", "clinic", "healthcare", "hospital", "antenatal", "patient*"], a: ["MaternityHelp (2024–25) helps a maternity clinic run day to day: patient records and antenatal tracking, appointments and booking requests, bed availability, stock levels, patient feedback and a live attention list.", "It’s a web app built with Supabase and hosted on Netlify."], next: [{ label: "Open MaternityHelp ↗", href: "https://maternityhelp2.netlify.app" }, { label: "Your projects" }] },
  { id: "centric", k: ["centric*", "auto", "garage", "cashbook", "accounting", "inventory", "ledger"], a: ["Centric Auto Mobile (2026–now) runs an auto workshop end to end: job cards, vehicle checklists, technicians and commissions, parts and suppliers, quotations and receipts, plus a cashbook, ledger and financial statements.", "It also includes analytics and Centric Intelligence."], next: [{ label: "Your projects" }, { label: "Start a project" }] },
  { id: "repair", k: ["repair*", "diagnostic*", "groq", "workshop"], a: ["The Repair Management System is a lightweight workshop tool with a framework-free frontend and Supabase.", "It includes an AI-assisted diagnostic feature, powered by a Groq-backed Edge Function, that helps with fault diagnosis. I kept the stack simple so it loads fast on modest devices and connections."], next: [{ label: "Your projects" }] },
  { id: "tech", k: ["tech*", "stack", "language*", "framework*", "react", "next", "nextjs", "node*", "typescript", "supabase", "postgres*", "database*", "tools", "tailwind", "what do you use"], a: ["On the front end I use React and Next.js with Tailwind CSS. On the back end it’s Node.js and TypeScript, with Supabase and PostgreSQL for data.", "I use Git and GitHub for version control, and deploy on Netlify, Vercel or Cloudflare."], next: [{ label: "Your projects" }, { label: "Start a project" }] },
  { id: "ai", k: ["ai", "chatbot", "artificial intelligence", "machine learning", "gpt"], a: ["Yes, I’ve built AI-assisted features, like the diagnostic assistant in my Repair Management System.", "If you have an idea that could use something similar, tell me about it."], next: [{ label: "Start a project" }] },
  { id: "pricing", k: ["price*", "pricing", "cost*", "charge*", "rate*", "quote", "budget", "how much", "expensive", "cheap", "afford*", "pay", "fee*"], a: ["Pricing depends on the scope, so I quote each project individually.", "Tell me what you have in mind and I’ll give you a clear idea of the scope and cost."], next: [{ label: "Start a project" }, { label: "Contact details" }] },
  { id: "timeline", k: ["how long", "timeline", "deadline", "turnaround", "duration", "delivery", "deliver*", "how fast", "how soon"], a: ["It depends on the scope. A simple website can be quick, while a business system takes longer.", "Share your idea and I’ll give you a realistic timeline."], next: [{ label: "Start a project" }] },
  { id: "mobile", k: ["mobile app", "android", "ios", "iphone", "native app", "play store"], a: ["I mainly build web apps that work well on phones. If you need a native Android or iOS app, tell me what it should do and I’ll tell you honestly what fits best."], next: [{ label: "Start a project" }] },
  { id: "website", k: ["website*", "landing page", "web app", "webapp", "ecommerce", "online store", "web development"], a: ["Yes, I build responsive websites and web applications around your goals and your users.", "Tell me about yours and I’ll shape a plan."], next: [{ label: "Start a project" }, { label: "Pricing" }] },
  { id: "support", k: ["maintenance", "support", "after launch", "hosting", "host", "update*"], a: ["I deploy on Netlify, Vercel or Cloudflare. Support and updates after launch can be agreed for each project."], next: [{ label: "Start a project" }] },
  { id: "location", k: ["where are you", "where do you", "location", "based", "zimbabwe", "country", "city", "harare", "live"], a: ["I’m based in Zimbabwe, and I build technology for the people and businesses around me."], next: [{ label: "Contact details" }] },
  { id: "availability", k: ["available", "availability", "hiring", "freelance", "internship", "job", "jobs", "opportunit*", "collaborat*", "partner*", "mentor*", "open to"], a: ["Yes, I’m open to software projects, internships, partnerships and learning or mentorship.", "Tell me what you have in mind and we can take it from there."], next: [{ label: "Start a project" }] },
  { id: "insights", k: ["insight*", "blog", "article*", "writing", "write", "posts"], a: ["I’m writing about building software, product thinking, learning in public and building in Zimbabwe.", "The first articles are in progress. You can follow along on the Insights page."], next: [{ label: "Open Insights ↗", href: "/insights" }] },
  { id: "site", k: ["built with", "made with", "how was this", "how is this", "this site built", "website built", "site built"], a: ["This site is built with Next.js and React and hosted on Cloudflare Pages."], next: [{ label: "Tech stack" }] },
  { id: "contact", k: ["contact*", "reach", "email", "whatsapp", "phone", "call", "number", "linkedin", "instagram", "social*", "get in touch", "handle*", "x account", "twitter"], a: [`The fastest way to reach me is WhatsApp: ${val("whatsapp")}.`, `You can also call ${val("call")}, email ${val("email")}, or find me on LinkedIn (Malvirn Gomo), Instagram (${val("instagram")}) and X (${val("x")}).`], next: [WA_CHIP, { label: "Start a project" }] }
];

const norm = (s: string) => s.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();

function score(e: Entry, text: string, tokens: string[]) {
  let s = 0;
  const padded = ` ${text} `;
  for (const k of e.k) {
    if (k.includes(" ")) {
      if (padded.includes(` ${k} `)) s += 4;
    } else if (k.endsWith("*")) {
      const p = k.slice(0, -1);
      if (tokens.some(t => t.startsWith(p))) s += 2;
    } else if (tokens.includes(k)) s += 2;
  }
  return s;
}

/** Returns the best answer for a message, or null when nothing fits. */
export function answerFor(input: string): Answer | null {
  const text = norm(input);
  if (!text) return null;
  const tokens = text.split(" ");
  let best: Entry | null = null;
  let top = 1;
  for (const e of ENTRIES) {
    const s = score(e, text, tokens);
    if (s > top) { top = s; best = e; }
  }
  if (!best) return null;
  return { lines: best.a, chips: best.next, action: best.action };
}

export const looksLikeQuestion = (t: string) =>
  /\?/.test(t) || /^(what|how|where|who|when|why|do|does|can|could|is|are|will|would|which|tell me)\b/i.test(t.trim());

export const cleanName = (t: string) =>
  t.trim().replace(/^(my name is|i am|i'm|im|it's|its|this is|call me)\s+/i, "").replace(/[.!,]+$/g, "").slice(0, 40) || t.trim().slice(0, 40);
