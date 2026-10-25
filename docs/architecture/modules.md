# Proposed module boundaries

Modules are introduced only when they have implementation, not as empty directories.

| Module | Responsibility | Does not own |
| --- | --- | --- |
| bible | navigation, reading, verse/token display | lexicon editorial text, audio synthesis |
| audio | audio manifests, playback, synchronization | biblical text authority |
| lexicon | lemmas, senses, attestations, explanations | personal essays |
| morphology | forms, parsing, grammatical analysis | presentation layout |
| research | search, sources, evidence relationships | canonical corpus editing |
| patristics | historical authors, works, provenance | biblical textual authority |
| my-work | owner-authored publications, notes, essays | corpus imports |
| typology | public existing Works portfolio and project case studies | private album data |
| private-album | protected My Album content | public site navigation |
| site-content | editable labels, page text, metadata | security rules |

## Data modeling rules
- Separate lemma, inflected form, token occurrence, sense, and citation IDs.
- Separate corpus edition/version from editorial interpretations.
- Preserve source provenance, dating, uncertainty, and revision history.
- Use stable IDs and explicit relationships; avoid duplicating reference records inside articles.
- Keep presentation-independent application contracts where feasible.
- Treat published/draft/private states as server-enforced, not client-only filters.

## Sanity Studio
Retain existing `siteSettings`, `project`, `journalEntry`, `albumItem`, and `activityLog` schemas. Add editorial models incrementally and migrate existing data with tested scripts and backups. Extend the Studio navigation without forcing users to use Visual Studio for ordinary copy editing.

## Architecture decision process
For significant changes, record context, alternatives, decision, data migration impact, security impact, and rollback plan in an ADR. Prefer the smallest reversible change.
