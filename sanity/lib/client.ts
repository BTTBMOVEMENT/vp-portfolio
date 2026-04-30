import {createClient} from 'next-sanity'
import {apiVersion, dataset, projectId} from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
})

export async function sanityFetch({
  query,
  params = {},
  revalidate = 0,
}: {
  query: string
  params?: Record<string, unknown>
  revalidate?: number
}) {
  return client.fetch(query, params, {
    next: {
      revalidate,
    },
  })
}