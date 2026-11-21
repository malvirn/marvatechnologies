export type LessonTrack = "Frontend Engineering" | "Backend Engineering" | "System Design" | "AI-Assisted Development";
export type LessonLevel = "Foundation" | "Intermediate" | "Advanced";
export type LessonStatus = "draft" | "published";

export interface Lesson {
  title: string;
  slug: string;
  summary: string;
  track: LessonTrack;
  level: LessonLevel;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  lastReviewed: string;
  status: LessonStatus;
  related: string[];
  prerequisites: string[];
  builtFrom?: string;
  featured: boolean;
  hasDemo: boolean;
  content: string;
  readingTime: number;
  filename: string;
}

export interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
}

export interface LessonNavigationResult {
  previous: Lesson | null;
  next: Lesson | null;
}

export const lessonSchema: {
  parse(value: unknown): Omit<Lesson, "content" | "readingTime" | "filename">;
};

export function estimateReadingTime(content: string): number;
export function parseLessonSource(source: string, filename?: string): Lesson;
export function validateLessonCollection(lessons: Lesson[]): Lesson[];
export function extractTableOfContents(content: string): TableOfContentsItem[];
export function getRelatedLessons(lesson: Lesson, lessons: Lesson[], limit?: number): Lesson[];
export function getLessonNavigation(lesson: Lesson, lessons: Lesson[]): LessonNavigationResult;
export function getAllLessons(): Lesson[];
export function getPublishedLessons(): Lesson[];
export function getPublishedLessonBySlug(slug: string): Lesson | undefined;
