export type ComposerImage = { alt: string };
export type ComposerInput = {
  title: string; summary?: string; track: string; level?: string; tags?: string; builtFrom?: string;
  status: "draft" | "published"; body: string; images?: ComposerImage[];
};
export const COMPOSER_TRACKS: string[];
export const COMPOSER_LEVELS: string[];
export function slugify(title: string): string;
export function parseTags(value: string): string[];
export function imageExtension(mime: string): string;
export function imageUrlPath(slug: string, filename: string): string;
export function imageRepoPath(slug: string, filename: string): string;
export function imageMarkdown(alt: string, urlPath: string): string;
export function starterBody(): string;
export function deriveSummary(body: string): string;
export function resolveNote<T extends ComposerInput>(input: T): T & { summary: string; level: string; tags: string };
export function findMdxRisks(body: string): string[];
export function validateNote(input: ComposerInput, existingSlugs?: string[]): { errors: Record<string, string>; warnings: string[]; slug: string; valid: boolean };
export function buildNoteFile(input: ComposerInput, now?: Date): { slug: string; filename: string; repoPath: string; mdx: string };
