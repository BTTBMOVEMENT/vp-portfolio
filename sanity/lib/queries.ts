export const SITE_SETTINGS_QUERY = `
  *[_type == "siteSettings"][0]{
    siteTitle,
    email,
    instagramPrimary,
    instagramSecondary,
    hero{
      roleLine,
      headline,
      intro,
      sequenceLabel,
      topSubLabel,
      railLeftTitle,
      railLeftSubtitle,
      railRightTitle,
      ctaPrimaryLabel,
      ctaSecondaryLabel,
      ctaTertiaryLabel
    },
    about{
      sectionLabel,
      title,
      body,
      secondaryBody,
      focusLabel,
      focusTags
    },
    works{
      sectionLabel,
      title,
      description,
      metaLabel,
      metaBody,
      archiveButtonLabel
    },
    journal{
      sectionLabel,
      title,
      description,
      ctaLabel,
      helperText
    },
    albumGateway{
      sectionLabel,
      title,
      description,
      buttonLabel,
      noteLabel
    },
    worksPage{
      pageLabel,
      pageIntro,
      title,
      description,
      statsBoardsLabel,
      statsPublishedLabel,
      statsNavigationLabel,
      statsNavigationValue,
      boardEyebrow,
      boardDescription,
      boardSheetTypeLabel,
      boardSheetTypeValue,
      boardLoadedFramesLabel,
      boardStatusLabel,
      boardStatusValue,
      boardNextFillLabel,
      boardStorySheetLabel,
      boardClickHint,
      boardEmptyFrameLabel,
      boardEmptyFrameDescription,
      boardStoryFrameLabel,
      boardOpenCaseStudyLabel
    },
    journalPage{
      pageLabel,
      pageIntro,
      title,
      description,
      featuredEntryLabel,
      allEntriesLabel,
      detailIntroLabel,
      detailActionsLabel,
      detailReturnToJournalLabel,
      detailReturnToWorksLabel,
      detailGalleryLabel,
      detailContinueReadingLabel,
      detailPreviousEntryLabel,
      detailNextEntryLabel,
      detailStartOfJournalLabel,
      detailEndOfJournalLabel
    },
    albumPage{
      pageLabel,
      title,
      description,
      emptyStateLabel,
      emptyStateTitle,
      emptyStateDescription,
      orbitalLabel,
      orbitalDescription,
      alignFramesLabel,
      returnToOrbitLabel,
      selectedFrameLabel,
      selectedFrameFallback,
      navigationLabel,
      previousLabel,
      nextLabel
    },
    contact{
      sectionLabel,
      title,
      body,
      emailLabel,
      instagramLabel,
      worksLabel,
      journalLabel,
      albumLabel
    }
  }
`

export const PROJECTS_QUERY = `
  *[_type == "project"]
  | order(coalesce(boardPage, 1) asc, coalesce(boardOrder, 9999) asc, coalesce(publishedAt, _createdAt) desc) {
    _id,
    title,
    "slug": slug.current,
    year,
    role,
    description,
    "imageUrl": coverImage.asset->url,
    format,
    pipeline,
    tools,
    boardPage,
    boardOrder,
    boardLabel,
    boardCaption,
    "publishedAt": coalesce(publishedAt, _createdAt)
  }
`

export const PROJECT_BY_SLUG_QUERY = `
  *[_type == "project" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    year,
    role,
    description,
    "imageUrl": coverImage.asset->url,
    format,
    pipeline,
    tools,
    overview,
    contribution,
    approach,
    quote,
    highlights,
    frameStudy[]{
      label,
      caption,
      "imageUrl": image.asset->url
    },
    processNotes[]{
      title,
      body
    },
    credits[]{
      label,
      value
    },
    boardPage,
    boardOrder,
    boardLabel,
    boardCaption,
    "publishedAt": coalesce(publishedAt, _createdAt)
  }
`

export const JOURNAL_ENTRIES_QUERY = `
  *[_type == "journalEntry"]
  | order(coalesce(publishedAt, _createdAt) desc){
    _id,
    title,
    "slug": slug.current,
    kind,
    excerpt,
    "coverImageUrl": coverImage.asset->url,
    tags,
    intro,
    body,
    "publishedAt": coalesce(publishedAt, _createdAt)
  }
`

export const JOURNAL_ENTRY_BY_SLUG_QUERY = `
  *[_type == "journalEntry" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    kind,
    excerpt,
    "coverImageUrl": coverImage.asset->url,
    tags,
    intro,
    body,
    gallery[]{
      "imageUrl": asset->url
    },
    "publishedAt": coalesce(publishedAt, _createdAt)
  }
`

export const ALBUM_ITEMS_QUERY = `
  *[_type == "albumItem"]
  | order(coalesce(sortOrder, 999999) asc, coalesce(capturedAt, _createdAt) desc){
    _id,
    title,
    note,
    "imageUrl": image.asset->url,
    "videoUrl": video.asset->url,
    "capturedAt": coalesce(capturedAt, _createdAt)
  }
`