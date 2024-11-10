import inquirer from "inquirer";
import { parseArgs } from "util";

export const new_series_tui = async (): Promise<string> => {
  const { mal_url }: { mal_url: string } = await inquirer.prompt([
    {
      name: "mal_url",
      type: "input",
      message: "Link do serii na MyAnimeList:",
    },
  ]);

  if (!mal_url) {
    throw new Error("mal_url not exist");
  }
  return mal_url;
};

export const add_episodes_tui = async () => {
  const { csv_file }: { csv_file: string } = await inquirer.prompt([
    {
      name: "csv_file",
      type: "input",
      message: "Path to episodes list:",
      default: "NazwaSerii.csv",
    },
  ]);

  if (!csv_file) {
    throw new Error("mal_url not exist");
  }
  return csv_file;
};
