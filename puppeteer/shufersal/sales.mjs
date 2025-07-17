const shufersalSales = async (browser, page) => {
    try {
        const url = `https://www.carrefour.co.il/products/${encodeURIComponent('מבצעים')}`
        await navigateToUrl(page, url);
        console.log(`Searched ${url}`);
        const products = await collectProducts(page);
        console.log(products);
        await page.close();
        await browser.close();
        console.log("Browser closed");
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

const navigateToUrl = async (page, url) => {
    try {
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 300000 });
    } catch (error) {
        console.error("Failed to load page:", error);
        throw error;
    }
};

const collectProducts = async (page) => {
    return await page.evaluate(() => {
        const productElements = document.querySelectorAll('.product_Vun');
        const products = [];
        productElements.forEach(el => {
            const nameEl = el.querySelector('.name__7t');
            const priceMajorEl = el.querySelector('.promotionSumWrapper_A6f strong');
            const priceMinorEls = el.querySelectorAll('.promotionSumWrapper_A6f small');
            const imageEl = el.querySelector('.imageWrapper_XN8 img');
            const unitEl = el.querySelector('.unitLabel_Gqb');
            if (!nameEl || !priceMajorEl || priceMinorEls.length < 2 || !imageEl || !unitEl) {
                console.log("Missing data for product");
                return;
            }
            const name = nameEl.innerText;
            const image = imageEl.src;
            const unit = unitEl.innerText.replace(/[^\d.\/]+/g, '').trim() + ''
            const priceMinorEl = priceMinorEls[1];
            const price = `${priceMajorEl.innerText}.${priceMinorEl.innerText}`;
            products.push({ name, price, unit, image });
        });
        return products;
    });
};

export { shufersalSales };