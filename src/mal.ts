export const mal_data = (mal_url: string) => {
  const url_parts: string[] = mal_url.split("/");

  const series_name = url_parts[url_parts.length - 1]
    .replaceAll("__", ": ")
    .replaceAll("_", " ");
  const series_id = url_parts[url_parts.length - 2];

  return {
    series_name,
    series_id,
  };
};
