"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Clock3, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { buildSearchIndex, searchLessons } from "@/lib/insights-search.mjs";
import { isStudioCommand } from "@/lib/note-composer.mjs";


type Lesson = {
  slug: string; title: string; summary: string; track: string; level: string;
  tags: string[]; readingTime: number; featured?: boolean; publishedAt: string;
};
const TRACKS = ["Frontend Engineering", "Backend Engineering", "System Design", "AI-Assisted Development"];
const LEVELS = ["Foundation", "Intermediate", "Advanced"];

function readFilters() {
  const params = new URLSearchParams(window.location.search);
  return { query: params.get("q") || "", track: params.get("track") || "", level: params.get("level") || "" };
}
function writeFilters(filters: { query: string; track: string; level: string }) {
  const url = new URL(window.location.href);
  const values = { q: filters.query, track: filters.track, level: filters.level };
  (["q", "track", "level"] as const).forEach((key) => {
    const value = values[key].trim();
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
  });
  window.history.replaceState(window.history.state, "", url.toString());
}

export default function BuildNotesExplorer({ lessons }: { lessons: Lesson[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [query, setQuery] = useState("");
  const [committedQuery, setCommittedQuery] = useState("");
  const [track, setTrack] = useState("");
  const [level, setLevel] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const filtersRef = useRef({ track, level });
  filtersRef.current = { track, level };
  const updateUrl = useCallback((next: { query: string; track: string; level: string }) => writeFilters(next), []);
  const index = useMemo(() => buildSearchIndex(lessons), [lessons]);

  useEffect(() => {
    const initial = readFilters();
    setQuery(initial.query);
    setCommittedQuery(initial.query);
    setTrack(TRACKS.includes(initial.track) ? initial.track : "");
    setLevel(LEVELS.includes(initial.level) ? initial.level : "");
    const onPopState = () => {
      const filters = readFilters();
      setQuery(filters.query);
      setCommittedQuery(filters.query);
      setTrack(TRACKS.includes(filters.track) ? filters.track : "");
      setLevel(LEVELS.includes(filters.level) ? filters.level : "");
    };
    const onKeyDown = (event: KeyboardEvent) => {
      const active = document.activeElement as HTMLElement | null;
      const typing = active && (active.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(active.tagName));
      if (event.key === "/" && !typing && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        inputRef.current?.focus();
      }
      if (event.key === "Escape" && document.activeElement === inputRef.current) {
        if (timerRef.current) clearTimeout(timerRef.current);
        setQuery("");
        setCommittedQuery("");
        updateUrl({ query: "", track: filtersRef.current.track, level: filtersRef.current.level });
        inputRef.current?.blur();
      }
    };
    window.addEventListener("popstate", onPopState);
    window.addEventListener("keydown", onKeyDown);
    setHydrated(true);
    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("keydown", onKeyDown);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [updateUrl]);

  const handleQuery = (value: string) => {
    if (isStudioCommand(value)) {
      setQuery("");
      router.push("/add-note");
      return;
    }
    setQuery(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const committed = value.trim();
      setCommittedQuery(committed);
      updateUrl({ query: committed, track: filtersRef.current.track, level: filtersRef.current.level });
    }, 250);
  };
  const handleTrack = (value: string) => {
    setTrack(value);
    updateUrl({ query: committedQuery, track: value, level });
  };
  const handleLevel = (value: string) => {
    setLevel(value);
    updateUrl({ query: committedQuery, track, level: value });
  };
  const clearFilters = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setQuery("");
    setCommittedQuery("");
    setTrack("");
    setLevel("");
    updateUrl({ query: "", track: "", level: "" });
  };

  const filtered = useMemo(
    () => searchLessons(index, committedQuery, track, level),
    [index, committedQuery, track, level]
  );
  const hasFilters = Boolean(query.trim() || track || level);
  const featured = !hasFilters ? filtered.find((lesson) => lesson.featured) ?? filtered[0] : filtered[0];
  const remaining = featured ? filtered.filter((lesson) => lesson.slug !== featured.slug) : [];

  return (
    <div className="bn-explorer" data-hydrated={hydrated ? "true" : "false"}>
      <div className="bn-discovery-controls">
        <div className="bn-search">
          <Search size={17} aria-hidden="true" />
          <input ref={inputRef} id="bn-search-input" type="search" aria-label="Search practical engineering notes" value={query} onChange={(event) => handleQuery(event.target.value)} placeholder="Search practical engineering notes..." autoComplete="off" />
          {query ? <button type="button" className="bn-search-clear" onClick={() => handleQuery("")} aria-label="Clear search"><X size={15} /></button> : <kbd aria-hidden="true">/</kbd>}
        </div>
        <div className="bn-filter-row">
          <label className="bn-filter"><span>Track</span><select aria-label="Filter by track" value={track} onChange={(event) => handleTrack(event.target.value)}><option value="">All tracks</option>{TRACKS.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <label className="bn-filter"><span>Level</span><select aria-label="Filter by level" value={level} onChange={(event) => handleLevel(event.target.value)}><option value="">All levels</option>{LEVELS.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          {hasFilters && <button type="button" className="bn-clear-filters" onClick={clearFilters}>Clear filters <X size={13} /></button>}
          <span className="bn-result-count" aria-live="polite">{filtered.length + (filtered.length === 1 ? " note" : " notes")}</span>
        </div>
        <p className="bn-keyboard-hint"><kbd>/</kbd> to search <span>·</span> <kbd>Esc</kbd> to clear</p>
      </div>

      {featured ? (
        <>
          <Link className="bn-featured" href={"/insights/" + featured.slug}>
            <div className="bn-featured-top"><span>{featured.featured ? "Featured note" : "Best match"}</span><span>{featured.track}</span></div>
            <div className="bn-featured-main"><div><h3>{featured.title}</h3><p>{featured.summary}</p></div><span className="bn-read-link">Read note <ArrowUpRight size={17} /></span></div>
            <div className="bn-meta"><span>{featured.level}</span><span><Clock3 size={14} /> {featured.readingTime} min read</span><span>{featured.tags.slice(0, 2).join(" · ")}</span></div>
          </Link>
          {remaining.length > 0 && <div className="bn-list" aria-label="Other matching notes">
            {remaining.map((lesson, itemIndex) => <Link className="bn-list-item" href={"/insights/" + lesson.slug} key={lesson.slug}>
              <span className="bn-list-number">{String(itemIndex + 2).padStart(2, "0")}</span>
              <span className="bn-list-copy"><strong>{lesson.title}</strong><small>{lesson.summary}</small></span>
              <span className="bn-list-meta">{lesson.track} · {lesson.level} · {lesson.readingTime} min</span><ArrowUpRight size={17} aria-hidden="true" />
            </Link>)}
          </div>}
        </>
      ) : (
        <div className="bn-empty bn-empty-filtered" role="status">
          <span className="bn-empty-index">{hasFilters ? "No matching notes" : "01 / Preparing the first notes"}</span>
          <h3>{hasFilters ? "No notes match those filters." : "Good notes take more than a code snippet."}</h3>
          <p>{hasFilters ? "Try another search or clear the filters to see every published note." : "The first lessons are being written and reviewed. They will appear here when they are ready."}</p>
          {hasFilters && <button type="button" className="bn-clear-empty" onClick={clearFilters}>Clear filters <ArrowUpRight size={15} /></button>}
        </div>
      )}
    </div>
  );
}
