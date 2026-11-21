/** @typedef {{slug:string,title:string,summary:string,track:string,level:string,tags:string[],readingTime:number,featured?:boolean,publishedAt:string}} SearchLesson */
/** @typedef {{lesson:SearchLesson,haystack:string,title:string,summary:string}} SearchEntry */
export function normalizeSearchText(value) {
  return String(value ?? "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}
/** @param {SearchLesson[]} lessons */
export function buildSearchIndex(lessons) {
  return lessons.map((lesson) => ({
    lesson,
    title: normalizeSearchText(lesson.title),
    summary: normalizeSearchText(lesson.summary),
    haystack: normalizeSearchText([lesson.title, lesson.summary, lesson.track, lesson.level, ...(lesson.tags || [])].join(" "))
  }));
}
/** @param {SearchEntry[]} index @param {string} query @param {string} track @param {string} level */
export function searchLessons(index, query, track = "", level = "") {
  const terms = normalizeSearchText(query).split(" ").filter(Boolean);
  return index
    .filter(({ lesson, haystack }) => (!track || lesson.track === track) && (!level || lesson.level === level) && terms.every((term) => haystack.includes(term)))
    .map((entry) => {
      const score = terms.reduce((total, term) => total + (entry.title === term ? 12 : entry.title.startsWith(term) ? 8 : entry.title.includes(term) ? 5 : entry.summary.includes(term) ? 2 : 1), 0);
      return { lesson: entry.lesson, score };
    })
    .sort((a, b) => b.score - a.score || b.lesson.publishedAt.localeCompare(a.lesson.publishedAt))
    .map(({ lesson }) => lesson);
}
