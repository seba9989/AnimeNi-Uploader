import * as i from "@inquirer/prompts";
import { parseArgs } from "util";

const { values: args } = parseArgs({
  args: Bun.argv,
  options: {
    add_embeds: {
      type: "boolean",
    },
    add_episodes: {
      type: "boolean",
    },
    csv: {
      type: "string",
    },
    login: {
      type: "string",
    },
    password: {
      type: "string",
    },
    headless: { type: "boolean" },
  },

  strict: true,
  allowPositionals: true,
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
    default:
      mode = await i.select({
        message: "Wybierz tryb pracy:",
        choices: [
          { name: "Dodaj odcinki", value: "add_episodes" },
          {
            name: "Dodaj embeds",
            value: "add_embeds",
            description:
              "Dodawanie kolejnych playerów do istniejących odcinków",
          },
        ],
      });
      break;
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
  let login = args.login ?? Bun.env.LOGIN;
  let password = args.password ?? Bun.env.PASSWORD;

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

export const is_headless = !args.headless;
