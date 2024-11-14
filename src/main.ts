import { mal_data } from "./mal";
import { download_discribe } from "./shinden";
import { download_series_img, search_series } from "./tmdb";
import { add_episodes_tui, new_series_tui } from "./tui";
import { parseArgs } from "util";
import { firefox } from "playwright";
import { add_episode, update_episodes } from "./playwright_scripts";
import type { EpisodeList } from "./types";

const { values: args, positionals } = parseArgs({
  args: Bun.argv,
  options: {
    new_series: {
      type: "boolean",
    },
    update_episodes: {
      type: "boolean",
    },
  },
  strict: true,
  allowPositionals: true,
});

if (args.new_series) {
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

  let series_name: string = "";
  let episodes_list: EpisodeList = {};
  episodes_array.forEach((row, index) => {
    if (row == "") return;
    if (index == 0) {
      series_name = row;
      return;
    }

    const columns = row.split(",");

    const episode_number = columns[0];
    const download_url = columns[1].replace(
      new RegExp("https://filemoon.sx/\\w/"),
      "https://filemoon.sx/d/",
    );
    const embed_url = columns[1].replace(
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
  if (args.update_episodes) {
    update_episodes(series_name, episodes_list);
  } else {
    add_episode(series_name, episodes_list);
  }
}
