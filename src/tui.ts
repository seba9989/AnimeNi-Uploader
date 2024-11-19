import * as i from "@inquirer/prompts";
import { parseArgs } from "jsr:@std/cli/parse-args";

const args = parseArgs(Deno.args, {
  boolean: ["add_embeds", "add_episodes"],
  string: ["csv", "login", "password"],
});

export const mode_tui = async () => {
  let mode: string | undefined;

  switch (true) {
    case args.add_episodes:
      mode = "add_episodes";
      break;
    case args.add_embeds:
      mode = "add_embeds";
      break;
  }

  if (!mode) {
    mode = await i.select({
      message: "Wybierz tryb pracy:",
      choices: [
        { name: "Dodaj odcinki", value: "add_episodes" },
        {
          name: "Dodaj embeds",
          value: "add_embeds",
          description: "Dodawanie kolejnych playerów do istniejących odcinków",
        },
      ],
    });
  }

  return { mode };
};

export const csv_tui = async () => {
  let csv_file = args.csv;

  if (!csv_file) {
    csv_file = await i.input(
      {
        message: "Ścieżka do pliku:",
        default: "NazwaSerii.csv",
      },
    );
  }

  return csv_file;
};

export const login_tui = async () => {
  let login = args.login ?? Deno.env.get("LOGIN");
  let password = args.password ?? Deno.env.get("PASSWORD");

  if (!login) {
    login = await i.input(
      {
        message: "Podaj Login:",
      },
    );
  }

  if (!password) {
    password = await i.password(
      {
        message: "Podaj Hasło:",
      },
    );
  }

  return { login, password };
};
