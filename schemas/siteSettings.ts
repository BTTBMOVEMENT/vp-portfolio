import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Site Title',
      type: 'string',
    }),

    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),

    defineField({
      name: 'instagramPrimary',
      title: 'Instagram Primary',
      type: 'string',
    }),

    defineField({
      name: 'instagramSecondary',
      title: 'Instagram Secondary',
      type: 'string',
    }),

    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      fields: [
        defineField({
          name: 'roleLine',
          title: 'Role Line',
          type: 'string',
        }),
        defineField({
          name: 'headline',
          title: 'Headline',
          type: 'string',
        }),
        defineField({
          name: 'intro',
          title: 'Intro',
          type: 'text',
          rows: 4,
        }),
        defineField({
          name: 'sequenceLabel',
          title: 'Sequence Label',
          type: 'string',
        }),
        defineField({
          name: 'topSubLabel',
          title: 'Top Sub Label',
          type: 'string',
        }),
        defineField({
          name: 'railLeftTitle',
          title: 'Rail Left Title',
          type: 'string',
        }),
        defineField({
          name: 'railLeftSubtitle',
          title: 'Rail Left Subtitle',
          type: 'string',
        }),
        defineField({
          name: 'railRightTitle',
          title: 'Rail Right Title',
          type: 'string',
        }),
        defineField({
          name: 'ctaPrimaryLabel',
          title: 'CTA Primary Label',
          type: 'string',
        }),
        defineField({
          name: 'ctaSecondaryLabel',
          title: 'CTA Secondary Label',
          type: 'string',
        }),
        defineField({
          name: 'ctaTertiaryLabel',
          title: 'CTA Tertiary Label',
          type: 'string',
        }),
      ],
    }),

    defineField({
      name: 'about',
      title: 'About',
      type: 'object',
      fields: [
        defineField({
          name: 'sectionLabel',
          title: 'Section Label',
          type: 'string',
        }),
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
        }),
        defineField({
          name: 'body',
          title: 'Body',
          type: 'text',
          rows: 6,
        }),
        defineField({
          name: 'secondaryBody',
          title: 'Secondary Body',
          type: 'text',
          rows: 6,
        }),
      ],
    }),

    defineField({
      name: 'works',
      title: 'Works',
      type: 'object',
      fields: [
        defineField({
          name: 'sectionLabel',
          title: 'Section Label',
          type: 'string',
        }),
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 4,
        }),
        defineField({
          name: 'metaLabel',
          title: 'Meta Label',
          type: 'string',
        }),
        defineField({
          name: 'metaBody',
          title: 'Meta Body',
          type: 'text',
          rows: 3,
        }),
        defineField({
          name: 'archiveButtonLabel',
          title: 'Archive Button Label',
          type: 'string',
        }),
      ],
    }),

    defineField({
      name: 'journal',
      title: 'Journal',
      type: 'object',
      fields: [
        defineField({
          name: 'sectionLabel',
          title: 'Section Label',
          type: 'string',
        }),
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 4,
        }),
        defineField({
          name: 'ctaLabel',
          title: 'CTA Label',
          type: 'string',
        }),
        defineField({
          name: 'helperText',
          title: 'Helper Text',
          type: 'string',
        }),
      ],
    }),

    defineField({
      name: 'albumGateway',
      title: 'My Album Gateway',
      type: 'object',
      fields: [
        defineField({
          name: 'sectionLabel',
          title: 'Section Label',
          type: 'string',
        }),
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 4,
        }),
        defineField({
          name: 'buttonLabel',
          title: 'Button Label',
          type: 'string',
        }),
        defineField({
          name: 'noteLabel',
          title: 'Note Label',
          type: 'string',
        }),
      ],
    }),

    defineField({
      name: 'contact',
      title: 'Contact',
      type: 'object',
      fields: [
        defineField({
          name: 'sectionLabel',
          title: 'Section Label',
          type: 'string',
        }),
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
        }),
        defineField({
          name: 'body',
          title: 'Body',
          type: 'text',
          rows: 4,
        }),
        defineField({
          name: 'emailLabel',
          title: 'Email Label',
          type: 'string',
        }),
        defineField({
          name: 'instagramLabel',
          title: 'Instagram Label',
          type: 'string',
        }),
        defineField({
          name: 'worksLabel',
          title: 'Works Label',
          type: 'string',
        }),
        defineField({
          name: 'journalLabel',
          title: 'Journal Label',
          type: 'string',
        }),
        defineField({
          name: 'albumLabel',
          title: 'Album Label',
          type: 'string',
        }),
      ],
    }),
  ],
})