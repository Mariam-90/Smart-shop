// browser.mjs 
import puppeteer from 'puppeteer';
import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha';
import pluginStealth from 'puppeteer-extra-plugin-stealth';
import { addExtra } from 'puppeteer-extra';
import userAgent from 'user-agents';

const Puppeteer = async () => {
    const puppeteerExtra = addExtra(puppeteer);
    puppeteerExtra.use(pluginStealth());
    puppeteerExtra.use(
        RecaptchaPlugin({
            provider: { id: "2captcha", token: process.env.CAPTCHA_KEY },
            visualFeedback: true,
        })
    );
    const browser = await puppeteerExtra.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--headless'],
        slowMo: 350,
        headless: "new"
    });
    const page = await browser.newPage();
    await page.setUserAgent(userAgent.random().toString());
    return { browser, page };
};

async function newPage(browser) {
    const page = await browser.newPage();
    await page.setUserAgent(userAgent.random().toString());
    return page;
}

export { Puppeteer, newPage };
