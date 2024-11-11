import { chromium } from "playwright";
import type { EpisodeList } from "./types";

export const add_episode = async (
  series_name: string,
  episodes_list: EpisodeList,
) => {
  const login = Bun.env.LOGIN;
  const password = Bun.env.PASSWORD;

  if (!login) throw Error("Nie podano loginu");
  if (!password) throw Error("Nie podano hasła");

  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto("https://animeni.pl/wp-admin");

  await page.getByLabel("Nazwa użytkownika lub adres e").fill(login);
  await page.getByLabel("Hasło", { exact: true }).click();
  await page.getByLabel("Hasło", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Zaloguj się" }).click();

  for (const [episode_number, { download_url, embed_url }] of Object.entries(
    episodes_list,
  )) {
    await page.getByRole("link", { name: "Series", exact: true }).click();

    if (page.url() == "https://animeni.pl/wp-admin/edit.php?post_type=anime")
      console.log("Zalogowano");

    const row = page.locator(`tr:has(.row-title:text("${series_name}"))`);

    await row.getByRole("link", { name: "Add", exact: true }).click();

    await page.locator("#title").click();
    await page.locator("#title").fill(`${series_name} ${episode_number}`);

    await page.getByLabel("Episode Number*").click();
    await page.getByLabel("Episode Number*").fill(episode_number.toString());

    await page.getByLabel("Download Link").click();
    await page.getByLabel("Download Link").fill(download_url);
    console.log(await page.getByLabel("Download Link").inputValue());

    await page.getByRole("textbox", { name: "Host Name" }).fill("Lektor");

    await page.getByRole("textbox", { name: "Embed" }).click();
    await page
      .getByRole("textbox", { name: "Embed" })
      .fill(
        `<iframe src="${embed_url}" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" width="640" height="360" allowfullscreen></iframe>`,
      );
    console.log(
      await page.getByRole("textbox", { name: "Embed" }).inputValue(),
    );

    await new Promise((resolve) => setTimeout(resolve, 10000));

    await page.getByRole("button", { name: "Opublikuj", exact: true }).click();
  }

  await browser.close();
};
