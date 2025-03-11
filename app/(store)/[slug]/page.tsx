// ./src/app/[slug]/page.tsx

import { defineQuery } from "next-sanity";
import { draftMode } from "next/headers";
import { client } from "@/sanity/lib/client";

const query = defineQuery(
  `*[_type == "page" && slug.current == $slug][0]{title}`,
);

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { isEnabled } = await draftMode();

  const data = await client.fetch(
    query,
    { slug },
    isEnabled
      ? {
          perspective: "previewDrafts",
          useCdn: false,
          stega: true,
        }
      : undefined,
  );

  return <h1>{data?.title}</h1>;
}
