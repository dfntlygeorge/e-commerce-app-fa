async function SearchPage({
  searchParams,
}: {
  searchParams: { query: string };
}) {
  // we need to destruct the query from the searchParams object. Also we need to await it for nextjs 15.
  const { query } = await searchParams;
  return <div> {query}</div>;
}

export default SearchPage;
