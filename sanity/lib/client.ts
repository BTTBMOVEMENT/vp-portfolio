import { createClient, type QueryParams } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});

export async function sanityFetch<const QueryString extends string>({
  query,
  params = {},
  revalidate = 0,
}: {
  query: QueryString;
  params?: QueryParams;
  revalidate?: number | false;
}) {
  return client.fetch(query, params, {
    next: {
      revalidate,
    },
  });
}