import { csv_tui } from "./src/tui.ts";
import { add_episodes, add_embeds } from "./src/puppeteer_scripts.ts";
import type { EpisodeList } from "./src/types.ts";
import { parseArgs } from "jsr:@std/cli/parse-args";

const args = parseArgs(Deno.args, {
  boolean: ["add_embeds"],
  string: ["csv"],
});

const csv_path = args.csv ? args.csv : await csv_tui();
const file = await Deno.readTextFile(csv_path);

const episodes_array = file.split("\n");

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

if (args.add_embeds) {
  console.log(episodes_list);
  add_embeds(series_name, episodes_list);
} else {
  console.log(episodes_list);
  add_episodes(series_name, episodes_list);
}
