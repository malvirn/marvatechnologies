"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Mail, Phone, RotateCcw, Send, X } from "lucide-react";
import BrandMark from "@/components/BrandMark";
import { EMAIL, PHONE, WHATSAPP } from "@/lib/channels";
import { DEFAULT_CHIPS, answerFor, cleanName, looksLikeQuestion, type Chip } from "@/lib/faq";

type Msg = { id: number; from: "bot" | "me"; text: string };
type Step = "chat" | "name" | "message";

const PLACEHOLDER: Record<Step, string> = {
  chat: "Ask me anything…",
  name: "Your name",
  message: "What do you need?"
};

const waLink = (text: string) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;

function WhatsAppGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function FloatingMessage() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [step, setStep] = useState<Step>("chat");
  const [draft, setDraft] = useState("");
  const [name, setName] = useState("");
  const [chips, setChips] = useState<Chip[]>([]);
  const [leadText, setLeadText] = useState<string | null>(null);
  const [askText, setAskText] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const idRef = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  /** Bot says each line in turn, with a short "typing…" pause before each. */
  const say = useCallback((lines: string[], after?: Chip[]) => {
    let wait = 0;
    lines.forEach((text, i) => {
      timers.current.push(setTimeout(() => setTyping(true), wait));
      wait += 450 + Math.min(text.length * 8, 450);
      timers.current.push(
        setTimeout(() => {
          setMsgs(m => [...m, { id: ++idRef.current, from: "bot", text }]);
          if (i === lines.length - 1) {
            setTyping(false);
            setChips(after ?? []);
          }
        }, wait)
      );
      wait += 100;
    });
  }, []);

  const greet = useCallback(
    () => say(["Hi 👋 Welcome to Marva Technologies.", "Ask me about my work, projects or tech stack, or start a project chat."], DEFAULT_CHIPS),
    [say]
  );

  // First open: start the conversation
  useEffect(() => {
    if (open && msgs.length === 0 && !typing) greet();
  }, [open, msgs.length, typing, greet]);

  useEffect(() => () => clearTimers(), []);

  // Keep the newest message in view
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing, chips, sent]);

  // Escape closes
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Focus the box whenever it is the user's turn
  useEffect(() => {
    if (open && !typing) inputRef.current?.focus({ preventScroll: true });
  }, [open, typing, step, msgs.length]);

  const startLead = () => {
    if (name) {
      setStep("message");
      say([`Sure, ${name}. Tell me a little about what you need.`]);
    } else {
      setStep("name");
      say(["Great, let’s set it up.", "What’s your name?"]);
    }
  };

  const submit = (raw: string) => {
    const text = raw.trim();
    if (!text || typing) return;
    setMsgs(m => [...m, { id: ++idRef.current, from: "me", text }]);
    setDraft("");
    setChips([]);
    setAskText(null);
    setSent(false);

    if (step !== "chat" && /^(cancel|stop|back|never ?mind|exit)$/i.test(text)) {
      setStep("chat");
      say(["No problem. Ask me anything else, or start again whenever you like."], DEFAULT_CHIPS);
      return;
    }

    if (step === "name") {
      const q = looksLikeQuestion(text) ? answerFor(text) : null;
      if (q && q.action !== "lead") {
        say([...q.lines, "By the way, what’s your name?"]);
        return;
      }
      const nm = cleanName(text);
      setName(nm);
      setStep("message");
      say([`Nice to meet you, ${nm}.`, "Tell me a little about what you need."]);
      return;
    }

    if (step === "message") {
      const q = looksLikeQuestion(text) ? answerFor(text) : null;
      if (q && q.action !== "lead") {
        say([...q.lines, "When you’re ready, tell me about your project."]);
        return;
      }
      setLeadText(`Hello Marva Technologies, I’m ${name || "a visitor"}.\n${text}`);
      setStep("chat");
      say(["All set. Tap the button below to send this on WhatsApp and I’ll reply there."], DEFAULT_CHIPS);
      return;
    }

    const a = answerFor(text);
    if (a?.action === "lead") {
      startLead();
    } else if (a) {
      say(a.lines, a.chips ?? DEFAULT_CHIPS);
    } else {
      setAskText(`Hello Marva Technologies, I have a question: ${text}`);
      say(["Good question, and I don’t want to guess on that one.", "Send it to me on WhatsApp and I’ll answer you personally."], DEFAULT_CHIPS);
    }
  };

  const reset = () => {
    clearTimers();
    setMsgs([]);
    setTyping(false);
    setStep("chat");
    setDraft("");
    setName("");
    setChips([]);
    setLeadText(null);
    setAskText(null);
    setSent(false);
  };

  if (pathname === "/contact" || pathname === "/contact/") return null;

  const waText = askText ?? leadText;

  return (
    <>
      {!open && (
        <div className="fm" aria-live="polite">
          <span className="fm-tip" aria-hidden="true">
            <span className="fm-dots"><i /><i /><i /></span>
            <span className="fm-msg">Let’s talk</span>
          </span>

          <button
            type="button"
            className="fm-btn"
            aria-label="Chat with me"
            aria-haspopup="dialog"
            onClick={() => { setOpen(true); setSeen(true); }}
          >
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
            {!seen && <span className="fm-badge" aria-hidden="true">1</span>}
          </button>
        </div>
      )}

      {open && (
        <section className="chat" role="dialog" aria-label="Chat with Marva Technologies">
          <header className="chat-head">
            <span className="brand-emblem chat-av" aria-hidden="true"><BrandMark /></span>
            <div className="chat-who">
              <strong>Marva Technologies</strong>
              <span className="chat-status"><i /> Instant answers · WhatsApp replies</span>
            </div>
            <button type="button" className="chat-icon-btn" onClick={reset} aria-label="Start over" title="Start over">
              <RotateCcw size={16} />
            </button>
            <button type="button" className="chat-icon-btn" onClick={() => setOpen(false)} aria-label="Close chat">
              <X size={18} />
            </button>
          </header>

          <div className="chat-body" ref={bodyRef}>
            {msgs.map(m => (
              <div key={m.id} className={`msg ${m.from === "bot" ? "msg-bot" : "msg-me"}`}>{m.text}</div>
            ))}
            {typing && (
              <div className="msg msg-bot msg-typing" aria-label="Typing"><i /><i /><i /></div>
            )}

            {!typing && chips.length > 0 && (
              <div className="chat-chips">
                {chips.map(c =>
                  c.href ? (
                    <a
                      key={c.label}
                      className="chat-chip"
                      href={c.href}
                      {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      {c.label}
                    </a>
                  ) : (
                    <button key={c.label} type="button" className="chat-chip" onClick={() => submit(c.label)}>{c.label}</button>
                  )
                )}
              </div>
            )}

            {waText && !typing && (
              <div className="chat-send">
                <a
                  className="chat-wa"
                  href={waLink(waText)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    if (sent) return;
                    setSent(true);
                    say(["Thanks! WhatsApp should be opening now. Just press send there. 🙌"]);
                  }}
                >
                  <WhatsAppGlyph /> {askText ? "Ask on WhatsApp" : "Send on WhatsApp"}
                </a>
                <div className="chat-alt">
                  <a href={`mailto:${EMAIL}?subject=${encodeURIComponent("Marva Technologies enquiry")}&body=${encodeURIComponent(waText)}`}><Mail size={14} /> Email instead</a>
                  <a href={`tel:${PHONE}`}><Phone size={14} /> Call</a>
                </div>
              </div>
            )}
          </div>

          <form className="chat-form" onSubmit={e => { e.preventDefault(); submit(draft); }}>
            <input
              ref={inputRef}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              placeholder={PLACEHOLDER[step]}
              disabled={typing}
              maxLength={500}
              autoComplete={step === "name" ? "name" : "off"}
              aria-label={PLACEHOLDER[step]}
            />
            <button type="submit" className="chat-send-btn" aria-label="Send message" disabled={!draft.trim() || typing}>
              <Send size={18} />
            </button>
          </form>
        </section>
      )}
    </>
  );
}
