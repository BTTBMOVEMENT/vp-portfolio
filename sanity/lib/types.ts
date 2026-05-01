export type SiteSettings = {
  siteTitle?: string | null
  email?: string | null
  instagramPrimary?: string | null
  instagramSecondary?: string | null

  hero?: {
    roleLine?: string | null
    headline?: string | null
    intro?: string | null
    sequenceLabel?: string | null
    topSubLabel?: string | null
    railLeftTitle?: string | null
    railLeftSubtitle?: string | null
    railRightTitle?: string | null
    ctaPrimaryLabel?: string | null
    ctaSecondaryLabel?: string | null
    ctaTertiaryLabel?: string | null
  } | null

  about?: {
    sectionLabel?: string | null
    title?: string | null
    body?: string | null
    secondaryBody?: string | null
    focusLabel?: string | null
    focusTags?: string[] | null
  } | null

  works?: {
    sectionLabel?: string | null
    title?: string | null
    description?: string | null
    metaLabel?: string | null
    metaBody?: string | null
    archiveButtonLabel?: string | null
  } | null

  journal?: {
    sectionLabel?: string | null
    title?: string | null
    description?: string | null
    ctaLabel?: string | null
    helperText?: string | null
  } | null

  albumGateway?: {
    sectionLabel?: string | null
    title?: string | null
    description?: string | null
    buttonLabel?: string | null
    noteLabel?: string | null
  } | null

  worksPage?: {
    pageLabel?: string | null
    pageIntro?: string | null
    title?: string | null
    description?: string | null
    statsBoardsLabel?: string | null
    statsPublishedLabel?: string | null
    statsNavigationLabel?: string | null
    statsNavigationValue?: string | null
    boardEyebrow?: string | null
    boardDescription?: string | null
    boardSheetTypeLabel?: string | null
    boardSheetTypeValue?: string | null
    boardLoadedFramesLabel?: string | null
    boardStatusLabel?: string | null
    boardStatusValue?: string | null
    boardNextFillLabel?: string | null
    boardStorySheetLabel?: string | null
    boardClickHint?: string | null
    boardEmptyFrameLabel?: string | null
    boardEmptyFrameDescription?: string | null
    boardStoryFrameLabel?: string | null
    boardOpenCaseStudyLabel?: string | null
  } | null

  projectPage?: {
    pageLabel?: string | null
    overviewLabel?: string | null
    overviewTitle?: string | null
    contributionLabel?: string | null
    contributionTitle?: string | null
    approachLabel?: string | null
    approachTitle?: string | null
    quoteLabel?: string | null
    highlightsLabel?: string | null
    frameStudyLabel?: string | null
    frameStudyTitle?: string | null
    processNotesLabel?: string | null
    processNotesTitle?: string | null
    creditsLabel?: string | null
    metaLabel?: string | null
    boardPageLabel?: string | null
    boardOrderLabel?: string | null
    boardLabelText?: string | null
    boardCaptionLabel?: string | null
    publishedAtLabel?: string | null
    continueReadingLabel?: string | null
    previousChapterLabel?: string | null
    nextChapterLabel?: string | null
    sequenceStartLabel?: string | null
    sequenceEndLabel?: string | null
  } | null

  journalPage?: {
    pageLabel?: string | null
    pageIntro?: string | null
    title?: string | null
    description?: string | null
    featuredEntryLabel?: string | null
    allEntriesLabel?: string | null
    detailIntroLabel?: string | null
    detailActionsLabel?: string | null
    detailReturnToJournalLabel?: string | null
    detailReturnToWorksLabel?: string | null
    detailGalleryLabel?: string | null
    detailContinueReadingLabel?: string | null
    detailPreviousEntryLabel?: string | null
    detailNextEntryLabel?: string | null
    detailStartOfJournalLabel?: string | null
    detailEndOfJournalLabel?: string | null

    orbitLabel?: string | null
    orbitDescription?: string | null
    spreadLabel?: string | null
    mixLabel?: string | null
    selectedEntryLabel?: string | null
    selectedEntryFallback?: string | null
    previousLabel?: string | null
    nextLabel?: string | null
    enterEntryLabel?: string | null
  } | null

  albumPage?: {
    pageLabel?: string | null
    title?: string | null
    description?: string | null
    emptyStateLabel?: string | null
    emptyStateTitle?: string | null
    emptyStateDescription?: string | null
    orbitalLabel?: string | null
    orbitalDescription?: string | null
    alignFramesLabel?: string | null
    returnToOrbitLabel?: string | null
    selectedFrameLabel?: string | null
    selectedFrameFallback?: string | null
    navigationLabel?: string | null
    previousLabel?: string | null
    nextLabel?: string | null
  } | null

  contact?: {
    sectionLabel?: string | null
    title?: string | null
    body?: string | null
    emailLabel?: string | null
    instagramLabel?: string | null
    worksLabel?: string | null
    journalLabel?: string | null
    albumLabel?: string | null
  } | null
} | null

export type ProjectListItem = {
  _id: string
  title: string
  slug: string
  year?: string
  role?: string
  description?: string
  imageUrl?: string
  format?: string
  pipeline?: string
  tools?: string[]
  boardPage?: number
  boardOrder?: number
  boardLabel?: string
  boardCaption?: string
  publishedAt?: string
}

export type ProjectDetail = ProjectListItem & {
  overview?: string
  contribution?: string
  approach?: string
  quote?: string
  highlights?: string[]
  frameStudy?: Array<{
    label?: string
    caption?: string
    imageUrl?: string
  }>
  processNotes?: Array<{
    title?: string
    body?: string
  }>
  credits?: Array<{
    label?: string
    value?: string
  }>
}

export type JournalKind = "essay" | "note" | "photo" | "video"

export type JournalListItem = {
  _id: string
  title: string
  slug: string
  kind: JournalKind
  excerpt?: string
  coverImageUrl?: string
  tags?: string[]
  intro?: string
  body?: any[]
  publishedAt?: string
}

export type JournalDetail = JournalListItem & {
  gallery?: Array<{
    imageUrl?: string
  }>
}

export type AlbumItem = {
  _id: string
  title?: string
  note?: any[]
  imageUrl?: string
  videoUrl?: string
  capturedAt?: string
}