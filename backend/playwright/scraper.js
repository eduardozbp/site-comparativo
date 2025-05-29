const { chromium } = require('playwright');

async function scrapeGameData(gameName) {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://store.steampowered.com/');
    await page.fill('input[name="term"]', gameName);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);

    const results = await page.$$eval('.search_result_row', rows => {
        return rows.map(row => ({
            title: row.querySelector('.title')?.innerText,
            price: row.querySelector('.search_price')?.innerText?.trim(),
            link: row.href
        }));
    });

    await browser.close();
    return results;
}

module.exports = { scrapeGameData };
