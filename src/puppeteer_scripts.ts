import puppeteer from "npm:puppeteer";
import { EpisodeList } from "./types.ts";
import { parseArgs } from "jsr:@std/cli/parse-args";
import { login_tui } from "./tui.ts";

const args = parseArgs(Deno.args, {
    string: ["login", "password"],
});

const wait = async (seconds?: number) => {
    await new Promise((resolve) => setTimeout(resolve, (seconds ?? 1) * 1000));
};

const login = async () => {
    let login = args.login ?? Deno.env.get("LOGIN");
    let password = args.password ?? Deno.env.get("PASSWORD");

    if (!login || !password) {
        const login_data = await login_tui();
        login = login_data.login, password = login_data.password;
    }

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    });
    const page = await browser.newPage();

    // Navigate the page to a URL.
    await page.goto("https://animeni.pl/wp-admin");

    await page.locator("::-p-aria(Nazwa użytkownika lub adres e-mail)").fill(
        login,
    );
    await page.locator("::-p-aria(Hasło)").fill(
        password,
    );

    await page.locator("input[type=submit]").click();

    console.log("Zalogowano");

    return {
        browser,
        page,
    };
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
        console.log(
            `Dodaję: ${series_name} ${episode_number}`,
            episodes_list[episode_number],
        );

        await page.locator("::-p-aria(Series)").click();

        await page.locator("input#post-search-input").fill(series_name);
        await page.locator("input#search-submit").click();

        const table = await page.locator("#the-list").waitHandle();

        const rows = await table.$$("tr");

        for (const row of rows) {
            const titleElement = await row.$(".row-title");
            const titleText = await page.evaluate(
                (el) => el.textContent.trim(),
                titleElement,
            );
            if (titleText === series_name) {
                const addButton = await row.$(
                    "a.page-title-action.ts-cas-add-new",
                );
                addButton?.click();
                break;
            }
        }

        console.log("test");

        await page.locator("input[name=post_title]").fill(episode_number);

        // Download Link
        await page.locator("::-p-aria(Episode Number*)").fill(episode_number);
        await page.locator("::-p-aria(Download Link)").fill(download_url);

        // Embed Link
        for (const embed_url of embed_urls) {
            const host_name = await page.$$(
                "::-p-aria(Host Name)",
            );
            await host_name[host_name.length - 1].type("Lektor");

            const embed = await page.$$("::-p-aria(Embed)");
            await embed[embed.length - 1].type(
                `<iframe src="${embed_url}" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" width="640" height="360" allowfullscreen></iframe>`,
            );

            await page.locator("text/+ Add more").click();
        }

        await wait();

        await page.locator('aria/Opublikuj[role="button"]').click();
    }

    await browser.close();
};

export const add_embeds = async (
    series_name: string,
    episodes_list: EpisodeList,
) => {
    const { browser, page } = await login();

    for (
        const [episode_number, { embed_urls }] of Object.entries(
            episodes_list,
        )
    ) {
        console.log(
            `Dodaję: ${series_name} ${episode_number}`,
            episodes_list[episode_number],
        );

        await page.locator("aria/Wpisy").click();

        await page.locator(
            'select[name="cat"]',
        ).wait();
        const selectElem = await page.$('select[name="cat"]');
        await selectElem!.type(series_name);

        await page.locator("aria/Przefiltruj").click();

        await page.locator("aria/Szukaj wpisów:").fill(
            `${series_name} ${episode_number}`,
        );
        await page.locator("aria/Szukaj wpisów").click();

        let episode_url;

        while (true) {
            try {
                await page.locator(
                    `aria/„${series_name} ${episode_number}” (Edycja)`,
                ).setTimeout(3000).wait();

                const episode_element = await page.$(
                    `aria/„${series_name} ${episode_number}” (Edycja)`,
                );

                episode_url = await episode_element?.evaluate((el) => el.href);

                console.log(episode_url);
                
                break;
            } catch {
                console.log("Nie znaleziono odcinka szukam dalej.");
                await page.locator("div.top a.next-page").click();
            }
        }

        await page.goto(episode_url);

        for (const embed_url of embed_urls) {
            await page.locator("text/+ Add more").click();

            const host_name = await page.$$(
                "::-p-aria(Host Name)",
            );
            await host_name[host_name.length - 1].type("Lektor");

            const embed = await page.$$("::-p-aria(Embed)");
            await embed[embed.length - 1].type(
                `<iframe src="${embed_url}" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" width="640" height="360" allowfullscreen></iframe>`,
            );
        }

        await wait();

        await page.locator('aria/Aktualizuj[role="button"]').click();
    }
    await browser.close();
};
