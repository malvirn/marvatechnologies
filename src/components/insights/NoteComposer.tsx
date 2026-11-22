"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Copy, Download, ImagePlus, Rocket, X } from "lucide-react";
import {
  COMPOSER_LEVELS, COMPOSER_TRACKS, buildNoteFile, imageExtension, imageMarkdown, imageRepoPath,
  imageUrlPath, slugify, starterBody, validateNote
} from "@/lib/note-composer.mjs";

type Picture = { id: string; blob: Blob; alt: string; name: string; preview: string };
type Form = { title: string; summary: string; track: string; level: string; tags: string; builtFrom: string; status: "draft" | "published"; body: string };
const DRAFT_KEY = "bn-composer-draft";
const TOKEN_KEY = "bn-composer-token";
const emptyForm: Form = { title: "", summary: "", track: "", level: "", tags: "", builtFrom: "", status: "draft", body: starterBody() };

function load<T>(storage: Storage | undefined, key: string): T | null {
  try { const raw = storage?.getItem(key); return raw ? (JSON.parse(raw) as T) : null; } catch { return null; }
}
function save(storage: Storage | undefined, key: string, value: unknown) {
  try { storage?.setItem(key, typeof value === "string" ? JSON.stringify(value) : JSON.stringify(value)); } catch { /* storage may be unavailable */ }
}

// Phone photos are huge. Resize to max 1600px so notes stay fast on slow connections.
async function shrink(file: File): Promise<{ blob: Blob; ext: string }> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const toBlob = (type: string) => new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.82));
  const webp = await toBlob("image/webp");
  if (webp && webp.type === "image/webp") return { blob: webp, ext: imageExtension("image/webp") };
  const jpg = await toBlob("image/jpeg");
  if (!jpg) throw new Error("Could not process that image.");
  return { blob: jpg, ext: imageExtension("image/jpeg") };
}

function toBase64(bytes: Uint8Array) {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary);
}

async function putFile(opts: { token: string; repo: string; branch: string; path: string; base64: string; message: string; allowOverwrite: boolean }) {
  const url = "https://api.github.com/repos/" + opts.repo + "/contents/" + opts.path.split("/").map(encodeURIComponent).join("/");
  const headers = { Authorization: "Bearer " + opts.token, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };
  let sha: string | undefined;
  const existing = await fetch(url + "?ref=" + encodeURIComponent(opts.branch), { headers });
  if (existing.ok) {
    if (!opts.allowOverwrite) throw new Error(opts.path + " already exists. Change the title so the slug is new.");
    sha = ((await existing.json()) as { sha?: string }).sha;
  } else if (existing.status === 401 || existing.status === 403) throw new Error("GitHub rejected the token. Check it has Contents: write on this repo.");
  else if (existing.status !== 404) throw new Error("GitHub returned " + existing.status + " while checking " + opts.path + ".");
  const response = await fetch(url, { method: "PUT", headers: { ...headers, "Content-Type": "application/json" }, body: JSON.stringify({ message: opts.message, content: opts.base64, branch: opts.branch, sha }) });
  if (!response.ok) throw new Error("GitHub could not save " + opts.path + " (" + response.status + ").");
}

export default function NoteComposer({ existingSlugs, onClose }: { existingSlugs: string[]; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const [form, setForm] = useState<Form>(emptyForm);
  const [pictures, setPictures] = useState<Picture[]>([]);
  const [showErrors, setShowErrors] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [repo, setRepo] = useState("malvirn/marvatechnologies");
  const [branch, setBranch] = useState("main");
  const [token, setToken] = useState("");

  useEffect(() => {
    const draft = load<Form>(window.localStorage, DRAFT_KEY);
    if (draft) setForm({ ...emptyForm, ...draft, status: "draft" });
    setToken(load<string>(window.sessionStorage, TOKEN_KEY) ?? "");
    dialogRef.current?.showModal();
  }, []);
  useEffect(() => { if (form.title || form.summary) save(window.localStorage, DRAFT_KEY, form); }, [form]);
  useEffect(() => () => pictures.forEach((p) => URL.revokeObjectURL(p.preview)), []); // eslint-disable-line react-hooks/exhaustive-deps

  const set = <K extends keyof Form>(key: K, value: Form[K]) => setForm((prev) => ({ ...prev, [key]: value }));
  const check = useMemo(() => validateNote({ ...form, images: pictures }, existingSlugs), [form, pictures, existingSlugs]);
  const slug = slugify(form.title);
  const shown = (key: string) => (showErrors ? check.errors[key] : undefined);
  const blockedByRisk = form.status === "published" && check.warnings.length > 0;

  const nameFor = useCallback((index: number, ext: string) => (slug || "note") + "-" + (index + 1) + "." + ext, [slug]);

  async function addPictures(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true); setMessage(null);
    try {
      const next: Picture[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        const { blob, ext } = await shrink(file);
        next.push({ id: crypto.randomUUID(), blob, alt: "", name: ext, preview: URL.createObjectURL(blob) });
      }
      setPictures((prev) => [...prev, ...next]);
    } catch (error) { setMessage({ kind: "error", text: error instanceof Error ? error.message : "Could not add that picture." }); }
    setBusy(false);
  }
  function insertPicture(index: number) {
    const picture = pictures[index];
    const url = imageUrlPath(slug || "note", nameFor(index, picture.name));
    const area = bodyRef.current;
    const at = area ? area.selectionStart : form.body.length;
    set("body", form.body.slice(0, at) + imageMarkdown(picture.alt || "Describe this picture", url) + form.body.slice(at));
    setMessage({ kind: "ok", text: "Picture inserted into the note." });
  }

  const ready = () => { setShowErrors(true); return check.valid; };
  const file = () => buildNoteFile({ ...form, images: pictures });

  async function copyNote() {
    if (!ready()) return;
    try { await navigator.clipboard.writeText(file().mdx); setMessage({ kind: "ok", text: "Note copied." }); }
    catch { setMessage({ kind: "error", text: "Copy was blocked. Use Download instead." }); }
  }
  function downloadBlob(blob: Blob, name: string) {
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  function downloadAll() {
    if (!ready()) return;
    const note = file();
    downloadBlob(new Blob([note.mdx], { type: "text/markdown" }), note.filename);
    pictures.forEach((p, i) => downloadBlob(p.blob, nameFor(i, p.name)));
    setMessage({ kind: "ok", text: "Downloaded. Put the .mdx in content/insights and the pictures in public/insights/images/" + note.slug + "/." });
  }
  async function publish() {
    if (!ready() || blockedByRisk) return;
    if (!token.trim() || !/^[\w.-]+\/[\w.-]+$/.test(repo.trim())) { setMessage({ kind: "error", text: "Add a GitHub token and a repo like owner/name first." }); return; }
    setBusy(true); setMessage(null);
    const note = file();
    try {
      save(window.sessionStorage, TOKEN_KEY, token.trim());
      for (let i = 0; i < pictures.length; i++) {
        const bytes = new Uint8Array(await pictures[i].blob.arrayBuffer());
        await putFile({ token: token.trim(), repo: repo.trim(), branch: branch.trim() || "main", path: imageRepoPath(note.slug, nameFor(i, pictures[i].name)), base64: toBase64(bytes), message: "Add picture for note: " + form.title.trim(), allowOverwrite: true });
      }
      await putFile({ token: token.trim(), repo: repo.trim(), branch: branch.trim() || "main", path: note.repoPath, base64: toBase64(new TextEncoder().encode(note.mdx)), message: "Add note: " + form.title.trim(), allowOverwrite: false });
      try { window.localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
      setMessage({ kind: "ok", text: form.status === "published" ? "Committed. Cloudflare rebuilds in about a minute, then the note is live." : "Saved as a draft in the repo. It stays hidden until you set status to published." });
    } catch (error) { setMessage({ kind: "error", text: error instanceof Error ? error.message : "Publishing failed." }); }
    setBusy(false);
  }

  const close = () => { dialogRef.current?.close(); onClose(); };

  return (
    <dialog ref={dialogRef} className="bn-composer" aria-labelledby="bn-composer-title" onCancel={(e) => { e.preventDefault(); close(); }}>
      <div className="bn-composer-head">
        <div><span className="bn-composer-eyebrow">Owner tool</span><h2 id="bn-composer-title">Add a new note</h2></div>
        <button type="button" className="bn-composer-close" onClick={close} aria-label="Close note composer"><X size={18} /></button>
      </div>
      <div className="bn-composer-body">
        <label className="bn-field"><span>Title</span>
          <input value={form.title} onChange={(e) => set("title", e.target.value)} autoComplete="off" aria-invalid={Boolean(shown("title"))} />
          <small>{slug ? "Slug: " + slug : "The slug is made from the title."}</small>{shown("title") && <em role="alert">{shown("title")}</em>}</label>
        <div className="bn-field-row">
          <label className="bn-field"><span>Category</span>
            <select value={form.track} onChange={(e) => set("track", e.target.value)}><option value="">Choose…</option>{COMPOSER_TRACKS.map((t: string) => <option key={t}>{t}</option>)}</select>{shown("track") && <em role="alert">{shown("track")}</em>}</label>
          <label className="bn-field"><span>Level</span>
            <select value={form.level} onChange={(e) => set("level", e.target.value)}><option value="">Choose…</option>{COMPOSER_LEVELS.map((t: string) => <option key={t}>{t}</option>)}</select>{shown("level") && <em role="alert">{shown("level")}</em>}</label>
        </div>
        <label className="bn-field"><span>Summary</span>
          <textarea rows={2} value={form.summary} onChange={(e) => set("summary", e.target.value)} />
          <small>{form.summary.trim().length}/160</small>{shown("summary") && <em role="alert">{shown("summary")}</em>}</label>
        <div className="bn-field-row">
          <label className="bn-field"><span>Tags (comma separated)</span><input value={form.tags} onChange={(e) => set("tags", e.target.value)} autoComplete="off" /></label>
          <label className="bn-field"><span>Built from (optional)</span><input value={form.builtFrom} onChange={(e) => set("builtFrom", e.target.value)} autoComplete="off" placeholder="Project name" /></label>
        </div>
        <label className="bn-field"><span>Note (Markdown)</span>
          <textarea ref={bodyRef} rows={12} value={form.body} onChange={(e) => set("body", e.target.value)} spellCheck />
          {shown("body") && <em role="alert">{shown("body")}</em>}</label>
        {check.warnings.map((w: string) => <p key={w} className="bn-composer-warn">{w}</p>)}

        <div className="bn-field"><span>Pictures</span>
          <label className="bn-composer-pick"><ImagePlus size={16} /> Add pictures<input type="file" accept="image/*" multiple hidden onChange={(e) => { void addPictures(e.target.files); e.target.value = ""; }} /></label>
          <small>Pictures are shrunk to 1600px so the page stays fast.</small>
          {shown("images") && <em role="alert">{shown("images")}</em>}
          <ul className="bn-composer-pics">{pictures.map((p, i) => (
            <li key={p.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.preview} alt="" />
              <input aria-label={"Description of picture " + (i + 1)} placeholder="Describe the picture" value={p.alt} onChange={(e) => setPictures((prev) => prev.map((x) => x.id === p.id ? { ...x, alt: e.target.value } : x))} />
              <button type="button" onClick={() => insertPicture(i)}>Insert</button>
              <button type="button" aria-label={"Remove picture " + (i + 1)} onClick={() => setPictures((prev) => prev.filter((x) => x.id !== p.id))}><X size={14} /></button>
            </li>))}
          </ul>
        </div>

        <fieldset className="bn-field bn-composer-status"><legend>Visibility</legend>
          <label><input type="radio" name="bn-status" checked={form.status === "draft"} onChange={() => set("status", "draft")} /> Draft (hidden)</label>
          <label><input type="radio" name="bn-status" checked={form.status === "published"} onChange={() => set("status", "published")} /> Published (live after rebuild)</label>
          {blockedByRisk && <em role="alert">Fix the MDX warnings above before publishing, or a bad note can break the site build.</em>}
        </fieldset>

        <details className="bn-composer-gh"><summary>Publish straight to GitHub</summary>
          <label className="bn-field"><span>Repository</span><input value={repo} onChange={(e) => setRepo(e.target.value)} autoComplete="off" /></label>
          <label className="bn-field"><span>Branch</span><input value={branch} onChange={(e) => setBranch(e.target.value)} autoComplete="off" /></label>
          <label className="bn-field"><span>Fine-grained token (Contents: write, this repo only)</span><input type="password" value={token} onChange={(e) => setToken(e.target.value)} autoComplete="off" /></label>
          <small>The token stays in this browser tab only and is never sent anywhere except api.github.com.</small>
        </details>
        <p className="bn-composer-status-msg" role="status" data-kind={message?.kind}>{message?.text}</p>
      </div>
      <div className="bn-composer-actions">
        <button type="button" onClick={copyNote} disabled={busy}><Copy size={15} /> Copy</button>
        <button type="button" onClick={downloadAll} disabled={busy}><Download size={15} /> Download</button>
        <button type="button" className="bn-composer-primary" onClick={publish} disabled={busy || blockedByRisk}>{busy ? "Working…" : <><Rocket size={15} /> Save to GitHub</>}</button>
      </div>
    </dialog>
  );
}
