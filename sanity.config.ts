'use client'

import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

import blockContent from './schemas/blockContent'
import siteSettings from './schemas/siteSettings'
import project from './schemas/project'
import journalEntry from './schemas/journalEntry'
import albumItem from './schemas/albumItem'
import activityLog from './schemas/activityLog'

export default defineConfig({
  name: 'default',
  title: 'BTTB Movement CMS',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,

  basePath: '/studio',

  plugins: [structureTool()],

  schema: {
    types: [
      blockContent,
      siteSettings,
      project,
      journalEntry,
      albumItem,
      activityLog,
    ],
  },
})