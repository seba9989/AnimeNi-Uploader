import { add_episodes_tui } from "./src/tui.ts";
import { add_episode, update_episodes } from "./src/playwright_scripts.ts";
import type { EpisodeList } from "./src/types.ts";
import { parseArgs } from "jsr:@std/cli/parse-args";

const args = parseArgs(Deno.args, {
  boolean: ["update_episodes"],
});

if (args.update_episodes) {
  const csv_path = await add_episodes_tui();
  const file = await Deno.readTextFile(csv_path);

  const episodes_array = file.split("\n");

  const series_name: string = episodes_array.shift()!;
  let episodes_list: EpisodeList = {};

  for (const row of episodes_array)
    if (row != "") {
      const columns = row.split(",");

      const episode_number = columns.shift()!;

      episodes_list = {
        ...episodes_list,
        [episode_number]: {
          embed_url: columns,
        },
      };
    }

  console.log(episodes_list);
  update_episodes(series_name, episodes_list);
} else {
  const csv_path = await add_episodes_tui();
  const file = await Deno.readTextFile(csv_path);

  const episodes_array = file.split("\n");

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
  add_episode(series_name, episodes_list);
}

