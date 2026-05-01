import {createClient} from 'next-sanity'
import {apiVersion, dataset, projectId} from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
})

export async function sanityFetch<T>({
  query,
  params = {},
  revalidate = 0,
}: {
  query: string
  params?: Record<string, unknown>
  revalidate?: number
}): Promise<T> {
  return client.fetch<T>(query, params, {
    next: {
      revalidate,
    },
  })
}