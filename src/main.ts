import { mal_data } from "./mal";
import { download_discribe } from "./shinden";
import { download_series_img, search_series } from "./tmdb";
import { add_episodes_tui, new_series_tui } from "./tui";
import { parseArgs } from "util";
import { firefox } from "playwright";
import { add_episode } from "./playwright_scripts";
import type { EpisodeList } from "./types";

const { values, positionals } = parseArgs({
  args: Bun.argv,
  options: {
    new_series: {
      type: "boolean",
    },
  },
  strict: true,
  allowPositionals: true,
});

if (values.new_series) {
  const mal_url = await new_series_tui();

  const { series_id, series_name } = mal_data(mal_url);

  console.log(series_id, series_name);

  const dmdb_id = await search_series(series_name);

  download_series_img(dmdb_id);

  download_discribe(series_name);
} else {
  const csv_path = await add_episodes_tui();
  const file = Bun.file(csv_path);

  const episodes_array = (await file.text()).split("\n");
  const series_name = file.name!.split("/").pop()!.replace(".csv", "");

  let episodes_list: EpisodeList = {};
  episodes_array.forEach((episode_link) => {
    if (episode_link == "") return;
    const episode_number = Number(episode_link.split(/_0*/).pop());
    const download_url = episode_link.replace(
      new RegExp("https://filemoon.sx/\\w/"),
      "https://filemoon.sx/d/",
    );
    const embed_url = episode_link.replace(
      new RegExp("https://filemoon.sx/\\w/"),
      "https://filemoon.sx/e/",
    );

    episodes_list = {
      ...episodes_list,
      [episode_number]: {
        download_url,
        embed_url,
      },
    };
  });

  console.log(episodes_list);
  add_episode(series_name, episodes_list);
}
