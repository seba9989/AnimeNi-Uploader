import { csv_tui, mode_tui } from "./src/tui.ts";
import { add_embeds, add_episodes } from "./src/playwright_scripts.ts";
import type { EpisodeList } from "./src/types.ts";

const csv_path = await csv_tui();
const file = await Bun.file(csv_path);

const file_text = await file.text();

const episodes_array = file_text.split("\n");

const series_name: string = episodes_array.shift()!;

let episodes_list: EpisodeList = {};
for (const row of episodes_array) {
  if (row != "") {
    const columns = row.split(",");

    const episode_number = columns.shift()!;
    const download_url = columns.shift()!;
    const embed_urls = columns;

    episodes_list = {
      ...episodes_list,
      [episode_number]: {
        download_url,
        embed_urls,
      },
    };
  }
}

const { mode } = await mode_tui();

switch (mode) {
  case "add_episodes":
    add_episodes(series_name, episodes_list);
    break;
  case "add_embeds":
    add_embeds(series_name, episodes_list);
    break;
}
