export type EpisodeList = Record<
  number,
  { download_url?: string; embed_url: string[] | string }
>;
