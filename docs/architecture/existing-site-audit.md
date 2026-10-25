# Existing-site integration audit — initial findings

Date: 2026-10-25. Scope: selected files inspected through the GitHub connector; not a complete security audit.

## Verified
- `sanity.config.ts` embeds Sanity Studio at `/studio` and registers siteSettings, project, journalEntry, albumItem, activityLog.
- `components/site/SiteNavigation.tsx` defines public nav links; the development branch labels `/works` as Typology.
- `app/works/page.tsx` and `app/projects/[slug]/page.tsx` query project data from Sanity. Keep these public.
- `app/my-album/page.tsx` fetches album records with image/video asset URLs; no authorization check appears in that page.
- `sanity/lib/queries.ts` resolves `image.asset->url` and `video.asset->url`; private asset delivery must be investigated.
- `sanity/lib/client.ts` uses a generic client with `useCdn:false`; that setting is not access control.
- `app/sitemap.ts` currently includes `/my-album`, `/works`, and project detail routes.
- `app/robots.ts` currently allows all routes.
- `components/home/HomePageClient.tsx` contains a public My Album gateway; this must be addressed in the privacy release.
- `app/layout.tsx` currently has portfolio-focused metadata.

## Next implementation tasks (not yet completed)
1. Verify Sanity dataset visibility, auth model, media URL exposure, and whether assets have already been indexed.
2. Choose a private media strategy and authenticated server boundary; avoid pretending that noindex or route middleware alone protects CDN assets.
3. Remove My Album from public navigation, homepage gateway and sitemap *together with* working access restrictions; test unauthenticated direct URLs.
4. Keep Typology public and preserve existing project detail routes and data.
5. Migrate Journal to My Work with redirects and Sanity field preservation after content and route audits.
6. Add tests and a preview deployment check before merging into production.

## Rollback
All work remains isolated on `architecture/foundation-v1`. No production branch merge has been made. Revert individual commits or discard the branch if needed.
