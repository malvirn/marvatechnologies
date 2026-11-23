"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ExternalLink, LogOut, PenLine } from "lucide-react";
import { COMPOSER_LEVELS, COMPOSER_TRACKS, buildNoteFile, resolveNote, validateNote } from "@/lib/note-composer.mjs";

type Form = { title: string; track: string; body: string; summary: string; level: string; tags: string; builtFrom: string; status: "draft" | "published" };
type Auth = { username: string; password: string };
const AUTH_KEY = "marva-studio-auth";
const DRAFT_KEY = "marva-studio-draft";
const empty: Form = { title: "", track: "", body: "", summary: "", level: "", tags: "", builtFrom: "", status: "published" };

function read<T>(key: string): T | null {
  try { const raw = window.localStorage.getItem(key); return raw ? (JSON.parse(raw) as T) : null; } catch { return null; }
}
function write(key: string, value: unknown) { try { window.localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable */ } }
function remove(key: string) { try { window.localStorage.removeItem(key); } catch { /* ignore */ } }

async function call(action: "login" | "publish", auth: Auth, note?: unknown): Promise<{ ok: boolean; error?: string; slug?: string; noteStatus?: string; code?: string; unreachable?: boolean }> {
  try {
    const response = await fetch("/api/add-note", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, ...auth, note }) });
    return await response.json();
  } catch {
    return { ok: false, unreachable: true, error: "Could not reach the save service. Check your connection, and that the Cloudflare Function is deployed." };
  }
}

export default function StudioApp({ existingSlugs }: { existingSlugs: string[] }) {
  const [phase, setPhase] = useState<"checking" | "out" | "in">("checking");
  const [auth, setAuth] = useState<Auth>({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState<Form>(empty);
  const [showErrors, setShowErrors] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string; slug?: string; live?: boolean } | null>(null);

  useEffect(() => {
    const saved = read<Auth>(AUTH_KEY);
    const draft = read<Form>(DRAFT_KEY);
    if (draft) setForm({ ...empty, ...draft });
    if (!saved) { setPhase("out"); return; }
    setAuth(saved);
    void call("login", saved).then((result) => {
      if (result.ok) setPhase("in");
      else { setPhase("out"); if (!result.unreachable) remove(AUTH_KEY); }
    });
  }, []);
  useEffect(() => { if (form.title || form.body) write(DRAFT_KEY, form); }, [form]);

  const set = <K extends keyof Form>(key: K, value: Form[K]) => setForm((prev) => ({ ...prev, [key]: value }));
  const check = useMemo(() => validateNote(form, existingSlugs), [form, existingSlugs]);
  const shown = (key: string) => (showErrors ? check.errors[key] : undefined);
  const blockedByRisk = form.status === "published" && check.warnings.length > 0;

  async function signIn(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true); setLoginError("");
    const result = await call("login", { username: auth.username.trim(), password: auth.password });
    setBusy(false);
    if (result.ok) { write(AUTH_KEY, { username: auth.username.trim(), password: auth.password }); setPhase("in"); }
    else setLoginError(result.error || "Could not sign in.");
  }
  function signOut() { remove(AUTH_KEY); setAuth({ username: "", password: "" }); setPhase("out"); }

  async function publish() {
    setShowErrors(true);
    if (!check.valid || blockedByRisk) return;
    setBusy(true); setMessage(null);
    const note = buildNoteFile(form);
    const result = await call("publish", auth, { slug: note.slug, mdx: note.mdx, images: [] });
    setBusy(false);
    if (result.ok) {
      remove(DRAFT_KEY); setForm(empty); setShowErrors(false);
      setMessage({ kind: "ok", slug: result.slug, live: result.noteStatus === "published", text: result.noteStatus === "published" ? "Saved. It goes live in about a minute." : "Saved as a draft. It stays hidden until you publish it." });
    } else {
      if (result.code !== "not_configured" && /Wrong username/.test(result.error || "")) { signOut(); return; }
      setMessage({ kind: "error", text: result.error || "Could not save the note." });
    }
  }

  const sidebar = (
    <aside className="studio-side" aria-label="Studio navigation">
      <div className="studio-brand"><strong>MARVA</strong><span>Studio</span></div>
      <nav className="studio-nav">
        <a href="#new-note" aria-current="page"><PenLine size={17} aria-hidden="true" /> New note</a>
        <Link href="/notes"><ExternalLink size={17} aria-hidden="true" /> View Build Notes</Link>
        {phase === "in" && <button type="button" onClick={signOut}><LogOut size={17} aria-hidden="true" /> Sign out</button>}
      </nav>
    </aside>
  );

  return (
    <div className="studio">
      {sidebar}
      <main id="main-content" tabIndex={-1} className="studio-main">
        {phase === "checking" && <p className="studio-muted" role="status">Checking sign-in…</p>}

        {phase === "out" && (
          <form className="studio-card studio-login" onSubmit={signIn}>
            <h1>Sign in</h1>
            <p className="studio-muted">Owner access only.</p>
            <label className="studio-field"><span>Username</span><input value={auth.username} onChange={(e) => setAuth({ ...auth, username: e.target.value })} autoComplete="username" autoCapitalize="none" required /></label>
            <label className="studio-field"><span>Password</span><input type="password" value={auth.password} onChange={(e) => setAuth({ ...auth, password: e.target.value })} autoComplete="current-password" required /></label>
            {loginError && <p className="studio-error" role="alert">{loginError}</p>}
            <button className="studio-primary" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
          </form>
        )}

        {phase === "in" && (
          <div className="studio-card" id="new-note">
            <h1 id="studio-title">Add a new note</h1>
            {message && (
              <p className="studio-message" role="status" data-kind={message.kind}>
                {message.text} {message.kind === "ok" && message.live && message.slug && <Link href={"/notes/" + message.slug}>Open note</Link>}
              </p>
            )}
            <label className="studio-field"><span>Title</span>
              <input value={form.title} onChange={(e) => set("title", e.target.value)} autoComplete="off" aria-invalid={Boolean(shown("title"))} />
              {shown("title") && <em role="alert">{shown("title")}</em>}</label>
            <label className="studio-field"><span>Category</span>
              <select value={form.track} onChange={(e) => set("track", e.target.value)}><option value="">Choose a category…</option>{COMPOSER_TRACKS.map((t: string) => <option key={t}>{t}</option>)}</select>
              {shown("track") && <em role="alert">{shown("track")}</em>}</label>
            <label className="studio-field"><span>Your note</span>
              <textarea rows={12} value={form.body} onChange={(e) => set("body", e.target.value)} placeholder="Write your note here. Start a heading with ##" />
              {shown("body") && <em role="alert">{shown("body")}</em>}
              {shown("summary") && !shown("body") && <em role="alert">{shown("summary")}</em>}</label>
            {check.warnings.map((w: string) => <p key={w} className="studio-warn">{w}</p>)}

            <details className="studio-more"><summary>More options</summary>
              <label className="studio-field"><span>Summary (made from your note if left blank)</span><textarea rows={2} value={form.summary} onChange={(e) => set("summary", e.target.value)} /><small>{(form.summary.trim() || resolveNote(form).summary).length}/160</small></label>
              <label className="studio-field"><span>Level</span><select value={form.level} onChange={(e) => set("level", e.target.value)}><option value="">Foundation (default)</option>{COMPOSER_LEVELS.map((t: string) => <option key={t}>{t}</option>)}</select></label>
              <label className="studio-field"><span>Tags, comma separated (category if blank)</span><input value={form.tags} onChange={(e) => set("tags", e.target.value)} autoComplete="off" /></label>
              <label className="studio-field"><span>Built from (project name)</span><input value={form.builtFrom} onChange={(e) => set("builtFrom", e.target.value)} autoComplete="off" /></label>
              <label className="studio-check"><input type="checkbox" checked={form.status === "draft"} onChange={(e) => set("status", e.target.checked ? "draft" : "published")} /> Save as a hidden draft instead of publishing</label>
            </details>
            {blockedByRisk && <p className="studio-error" role="alert">Fix the warning above before publishing. It could break the site build.</p>}
            <div className="studio-actions"><button type="button" className="studio-primary" onClick={publish} disabled={busy || blockedByRisk}>{busy ? "Saving…" : form.status === "draft" ? "Save draft" : "Publish note"}</button></div>
          </div>
        )}
      </main>
    </div>
  );
}
