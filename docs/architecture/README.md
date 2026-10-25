# BTTB Movement Architecture — Foundation v1

Status: proposed foundation; implementation is incremental. Production behavior is unchanged.

## Goals
- Keep the existing Next.js App Router, Sanity Studio, and working portfolio features.
- Make editorial copy and scholarly commentary editable in Sanity without code changes.
- Keep layout, behavior, security rules, and reference corpus integrity under version-controlled code.
- Make features replaceable without coupling unrelated domains.
- Protect My Album and other explicitly private material, preserve public Works/Typology, and allow safe rollback.

## Public information architecture
- `/bible`: The Bible — Majority Text reading, listening, token lookup.
- `/research`: Back to the Bible — reference tools and evidence.
- `/my-work`: My Work — the owner's essays, notes, research, publications.
- `Typology`: public presentation of the existing Works portfolio and project case studies; retain existing content and functionality. Decide the canonical URL (`/works` or `/typology`) after auditing links and SEO.
- `/my-album`: My Album — private archive, not publicly navigable.

Legacy `/journal`, `/journal/[slug]`, `/works`, `/projects/[slug]`, `/my-album`, and homepage links must be audited before any redirect or access-policy change. Existing Works and `/projects/[slug]` remain public as Typology; do not accidentally protect them. Do not blindly redirect private legacy URLs to a public page.

## Dependency rules
- `app/`: routing, page composition, metadata, and server authorization boundaries.
- `features/<feature>/`: one feature's UI, application services, and data adapters; avoid importing another feature's internals.
- `domain/`: stable, framework-independent types and rules for scripture, lexicon, citations, and research.
- `components/`: existing shared UI; preserve working components until migration is justified.
- `schemas/` and `sanity.config.ts`: existing Studio definitions; extend, do not replace.
- `sanity/lib/`: existing data client and queries; migration to feature adapters is gradual.
- `lib/`: existing helpers; no forced move.
- `docs/architecture/`: decisions and migration notes.

Use server-only access for privileged tokens and private data. Never rely on a hidden menu, robots.txt, or client-side gating for authorization.

## Content ownership
- **Immutable/versioned reference dataset**: the chosen licensed Majority Text edition, book/chapter/verse identifiers, tokens, morphology mappings and corpus provenance. Updates through validated imports and migrations, not casual text editing.
- **Sanity editorial content**: page text, labels, metadata, lexicon explanations, citations, interpretive research, patristic commentary, author works, audio metadata, visibility and publishing workflow.
- **Media**: separate storage/access policies for public and private images, video, and audio. Sanity CDN assets may remain publicly reachable even when pages are protected; verify before promising privacy.

Research claims must carry evidence/source metadata, temporal context, and clear separation between textual evidence and the owner's interpretation. The lexicon corpus excludes the Septuagint per project scope.

## Security and publishing gates
1. Audit public routes, sitemap, robots, navigation, Sanity dataset visibility, and direct asset URLs. Preserve public Works/Typology project routes; restrict My Album and its assets.
2. Define administrator identity and server-side authorization, including preview environments.
3. Back up Sanity documents/assets and establish recovery and rollback procedures.
4. Introduce My Album private route guards and verify unauthorized requests never return private data; keep Typology public.
5. Remove private pages from public navigation and sitemap; use noindex as defense in depth, not security.
6. Validate tests and preview deployment before any production merge.

## Quality gates
- Build, lint, type checks and relevant automated tests.
- Permission tests for private routes and data endpoints.
- Content schema compatibility and migration rollback notes.
- Preview verification and explicit approval before production merge.

## Rollout
Phase 0: architecture docs and repository audit only.
Phase 1: My Album privacy and preservation, with Works/Typology remaining public.
Phase 2: public information architecture and My Work CMS migration.
Phase 3: Bible corpus pilot and audio playback.
Phase 4: research/lexicon/patristic tools and editorial workflows.

This document records intended architecture; it does not assert that the new modules or security controls have been implemented.
