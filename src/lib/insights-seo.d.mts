import type { Lesson } from "./insights-content.mjs";

export interface SitemapEntry {
  url: string;
  lastModified?: Date;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
}

export function normalizeSiteUrl(value?: string): string;
export function escapeXml(value: unknown): string;
export function plainTextFromMdx(content: string): string;
export function buildRssFeed(lessons?: Lesson[], siteUrl?: string): string;
export function getSitemapEntries(lessons?: Lesson[], siteUrl?: string): SitemapEntry[];
export function buildArticleJsonLd(lesson: Lesson, siteUrl?: string): Record<string, unknown>;
export function buildBreadcrumbJsonLd(lesson: Lesson, siteUrl?: string): Record<string, unknown>;
export function buildCollectionJsonLd(siteUrl?: string): Record<string, unknown>;
export function serializeJsonLd(value: unknown): string;
