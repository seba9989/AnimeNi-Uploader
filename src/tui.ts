// import inquirer from "@inquirer/prompts";
import Ask from "https://deno.land/x/ask@1.0.6/mod.ts";

const ask = new Ask();

export const csv_tui = async () => {
  const { csv_file } = await ask.prompt([
    {
      name: "csv_file",
      type: "input",
      message: "Path to episodes list:",
      default: "NazwaSerii.csv",
    },
  ]);

  if (typeof csv_file != "string") {
    throw new Error("csv_file not exist");
  }
  return csv_file;
};

export const login_tui = async () => {
  const { login, password } = await ask.prompt([
    {
      name: "login",
      type: "input",
      message: "Podaj Login:",
    },
    {
      name: "password",
      type: "input",
      message: "Podaj Hasło:",
    },
  ]);

  if (typeof login != "string") {
    throw new Error("login not exist");
  }
  if (typeof password != "string") {
    throw new Error("password not exist");
  }
  return { login, password };
};
