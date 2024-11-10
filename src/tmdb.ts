const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${Bun.env.TMDB_KEY}`,
  },
};

export const search_series = async (series_name: string) => {
  const url = `https://api.themoviedb.org/3/search/tv?query=${encodeURI(series_name)}&include_adult=false&language=en-US&page=1`;
  const { results } = await (await fetch(url, options)).json();

  return results[0].id as number;
};

export const download_series_img = async (series_id: number) => {
  const url = `https://api.themoviedb.org/3/tv/${series_id}/images`;
  const { backdrops } = await (await fetch(url, options)).json();
  const file_url = backdrops[0].file_path as string;

  const img_url = "https://image.tmdb.org/t/p/original" + file_url;

  const image = await fetch(img_url);

  await Bun.write("img/new_bg." + file_url.split(".")[1], image);
};
