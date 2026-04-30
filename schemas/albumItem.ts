import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'albumItem',
  title: 'Album Item',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'video',
      title: 'Video',
      type: 'file',
      options: {
        accept: 'video/*',
      },
    }),
    defineField({
      name: 'note',
      title: 'Note',
      type: 'blockContent',
    }),
    defineField({
      name: 'capturedAt',
      title: 'Captured At',
      type: 'datetime',
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      initialValue: 1,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'capturedAt',
      media: 'image',
    },
  },
})