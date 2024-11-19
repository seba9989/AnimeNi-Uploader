import { chromium } from "playwright";
import type { EpisodeList } from "./types.ts";
import { is_headless, login_tui } from "./tui.ts";

const wait = async (seconds?: number) => {
    await new Promise((resolve) => setTimeout(resolve, (seconds ?? 5) * 1000));
};

const login = async () => {
    const { login, password } = await login_tui();

    const browser = await chromium.launch({ headless: is_headless });
    const page = await browser.newPage();
    await page.goto("https://animeni.pl/wp-admin");

    await page.getByLabel("Nazwa użytkownika lub adres e").fill(login);

    await page.getByLabel("Hasło", { exact: true }).fill(password);

    await page.getByRole("button", { name: "Zaloguj się" }).click();

    console.log("Zalogowano");

    return { page, browser };
};

export const add_episodes = async (
    series_name: string,
    episodes_list: EpisodeList,
) => {
    const { browser, page } = await login();

    for (
        const [episode_number, { download_url, embed_urls }] of Object.entries(
            episodes_list,
        )
    ) {
        await page.getByRole("link", { name: "Series", exact: true }).click();

        if (
            page.url() == "https://animeni.pl/wp-admin/edit.php?post_type=anime"
        ) {
            console.log(
                `Dodaję: ${series_name} ${episode_number}`,
                episodes_list[episode_number],
            );
        }

        await page.getByLabel("Search Series:").fill(series_name);

        await page.getByRole("button", { name: "Search Series" }).click();

        const row = page.locator("tr").filter({ hasText: "Bleach" }).first();

        await row.getByRole("link", { name: "Add", exact: true }).click();
        await page.locator("#title").click();
        await page.locator("#title").fill(`${series_name} ${episode_number}`);

        await page.getByLabel("Episode Number*").fill(episode_number);
        await page.getByLabel("Download Link").fill(download_url);
        console.log(await page.getByLabel("Download Link").inputValue());

        for (const embed_url of embed_urls) {
            await page
                .getByRole("textbox", { name: "Host Name" })
                .last()
                .fill(
                    "Lektor",
                );

            await page
                .getByRole("textbox", { name: "Embed" })
                .last()
                .fill(
                    `<iframe src="${embed_url}" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" width="640" height="360" allowfullscreen></iframe>`,
                );

            await page.locator("#embed-video").getByRole("link", {
                name: "+ Add more",
            }).click();
        }

        await wait();

        await page.getByRole("button", { name: "Opublikuj", exact: true })
            .click();
    }

    await browser.close();
};

export const add_embeds = async (
    series_name: string,
    episodes_list: EpisodeList,
) => {
    const { page, browser } = await login();

    for (
        const [episode_number, { embed_urls }] of Object.entries(
            episodes_list,
        )
    ) {
        const episode_name = `${series_name} ${episode_number}`;

        await page.getByRole("link", { name: "Wpisy", exact: true }).click();
        if (page.url() == "https://animeni.pl/wp-admin/edit.php") {
            console.log(
                `Dodaję: ${series_name} ${episode_number}`,
                episodes_list[episode_number],
            );
        }

        await page.getByLabel("Szukaj wpisów:").fill(episode_name);
        await page.getByRole("button", { name: "Szukaj wpisów" }).click();

        while (true) {
            try {
                await page.getByLabel(`„${episode_name}” (Edycja)`).click({
                    timeout: 1000,
                });

                console.log("Znalazłem odcinek");

                break;
            } catch {
                try {
                    await page.getByRole("link", { name: "Następna strona" })
                        .first()
                        .click();
                } catch {
                    throw Error(
                        `Nie znaleziono odcinka: ${episode_name}`,
                    );
                }
            }
        }

        for (const embed_url of embed_urls) {
            await page
                .locator("#embed-video")
                .getByRole("link", { name: "+ Add more" })
                .click();
            await page
                .getByRole("textbox", { name: "Host Name" })
                .last()
                .fill("Lektor");
            await page
                .getByRole("textbox", { name: "Embed" })
                .last()
                .fill(
                    `<iframe src="${embed_url}" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" width="640" height="360" allowfullscreen></iframe>`,
                );

            await wait();
        }
    }
};
