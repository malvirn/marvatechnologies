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