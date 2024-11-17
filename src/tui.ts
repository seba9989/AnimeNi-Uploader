// import inquirer from "@inquirer/prompts";
import Ask from "https://deno.land/x/ask@1.0.6/mod.ts";

export const add_episodes_tui = async () => {
  const ask = new Ask(); 

  const { csv_file } = await ask.prompt([
    {
      name: "csv_file",
      type: "input",
      message: "Path to episodes list:",
      default: "NazwaSerii.csv",
    },
  ]);

  if (typeof csv_file != "string") {
    throw new Error("mal_url not exist");
  }
  return csv_file;
};
