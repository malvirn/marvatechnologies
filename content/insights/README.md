# Writing Build Notes

Create one `.mdx` file per lesson in this directory.

Required frontmatter:
- title
- slug (must match the filename)
- summary (20 to 160 characters)
- track: Frontend Engineering, Backend Engineering, System Design, or AI-Assisted Development
- level: Foundation, Intermediate, or Advanced
- tags
- publishedAt, updatedAt, lastReviewed (ISO date-time strings)
- status: draft or published
- related and prerequisites (arrays of lesson slugs)
- featured and hasDemo (booleans)

New lessons should start with `status: draft`. A draft is excluded from the public hub and static lesson routes. Publish only after the owner reviews the technical content and any personal project story.

Do not invent personal incidents, metrics, client details or project outcomes. Use synthetic examples for code. Never include patient/customer information, secrets, credentials or live private endpoints.

## Phase 2 search and navigation

The Insights hub builds its client search index from published lessons only. Search waits 250 ms after typing, while the selected query, track and level are kept in the URL. The slash key focuses search and Escape clears it.

Lesson headings use GitHub-style heading IDs with a `bn-` prefix to avoid generic global names. The table of contents is generated from h2 and h3 headings. Related notes prefer explicit frontmatter references, then fall back to the same track. Previous and next links stay within the current track.

## Tests

- Run unit tests with `npm test`.
- Install the Chromium browser once with `npx playwright install chromium`.
- Run browser tests with `npm run test:e2e`.
- To enable the published-lesson browser checks, set `E2E_LESSON_SLUG` and `E2E_LESSON_TITLE` to an owner-approved published lesson.

The browser suite can exercise the hub and 404 route without publishing content. Lesson-content assertions are skipped until an approved lesson is published.

## Added dependencies

- `rehype-slug@6.0.0`: creates heading IDs during MDX rendering. npm reports approximately 11.2 kB unpacked.\n- `github-slugger@2.0.0`: keeps the server-generated TOC IDs identical to rendered heading IDs, including duplicate and Unicode headings. It has no dependencies and ships about 10 kB of JavaScript.
- `@playwright/test@1.65.1`: development-only browser test runner. The test-runner package is reported at approximately 29 kB; its Playwright runtime dependency is approximately 4.8 MB unpacked. Browser binaries are installed separately and are not shipped to visitors.

No new runtime service, database or user tracking was added.
