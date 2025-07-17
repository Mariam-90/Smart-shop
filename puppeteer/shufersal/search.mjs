const shufersalSearch = async (browser, page, searchQueries) => {
    try {
        for (const searchQuery of searchQueries) {
            const url = `https://www.shufersal.co.il/online/he/search?q=${encodeURIComponent(searchQuery)}`;
            await navigateToUrl(page, url);
            console.log(`Searched for ${searchQuery} at ${url}`);
            const products = await collectProducts(page);
            console.log(products);
            return products;
        }
        await page.close();
        await browser.close();
        console.log("Browser closed");
    } catch (error) {
        console.error("Error:", error);
    }
}

const navigateToUrl = async (page, url) => {
    try {
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 300000 });
    } catch (error) {
        console.error("Failed to load page:", error);
    }
};

const collectProducts = async (page) => {
    return page.evaluate(() => {
        const productElements = document.querySelectorAll('.tile.miglog-prod-inStock.notOverlay');
        const products = [];
        productElements.forEach(el => {
            const nameEl = el.querySelector('strong');
            const priceEl = el.querySelector('.price .number');
            const imageEl = el.querySelector('.imgContainer img');
            const unitEls = el.querySelectorAll('.brand-name span');
            if (!nameEl || !priceEl || !imageEl || !unitEls.length) {
                return;
            }
            const name = nameEl.innerText;
            const price = priceEl.innerText;
            const image = imageEl.src;
            const unit = unitEls[0].innerText;
            const brand = unitEls[1].innerText;
            products.push({ name, price, brand, unit, image, source: 'shufersal' });
        });
        return products;
    });
};

export { shufersalSearch };
