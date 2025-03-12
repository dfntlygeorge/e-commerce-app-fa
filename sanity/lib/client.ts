import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  token: process.env.SANITY_API_READ_TOKEN,
  stega: {
    studioUrl: process.env.DOMAIN_URL
      ? `https://${process.env.DOMAIN_URL}/studio`
      : `${process.env.NEXT_PUBLIC_BASE_URL}/studio`,
  },

  // Set to false if statically generating pages, using ISR or tag-based revalidation
});
