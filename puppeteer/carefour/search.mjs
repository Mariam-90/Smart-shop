const carefourSearch = async (browser, page, searchQueries) => {
    try {
       
        for (const searchQuery of searchQueries) {
            const url = `https://www.carrefour.co.il/search/${encodeURIComponent(searchQuery)}`;
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
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000000 });
    } catch (error) {
        console.error("Failed to load page:", error);
    }
};

const collectProducts = async (page) => {
    return page.evaluate(() => {
        const productElements = document.querySelectorAll('.product-item.clickable');
        const products = [];
        productElements.forEach(el => {
            const nameEl = el.querySelector('.name');
            const priceMajorEl = el.querySelector('.sp-product-price .price');
            const backgroundImageEl = el.querySelector('.image-wrapper .image'); // Corrected variable usage
            let imageUrl = '';
            if (backgroundImageEl) {
                const backgroundImage = backgroundImageEl.style.backgroundImage;
                const match = backgroundImage.match(/url\("?(.*?)"?\)/);
                imageUrl = match && match[1] ? match[1] : '';
            }
            const brandEl = el.querySelector('.data .brand');
            const unitEl = el.querySelector('.data .weight');
            if (!nameEl || !priceMajorEl || !imageUrl || !brandEl || !unitEl) {
                console.log('Missing essential information, skipping product'); // Log when skipping a product
                return;
            }
            const name = nameEl.innerText.trim();
            const brand = brandEl.innerText.trim();
            const unit = unitEl.innerText.replace(/[^\d.\/]+/g, '').trim();
            const price = priceMajorEl.innerText.trim();
            products.push({ name, price, brand, unit, image: imageUrl, source: 'carefour' });
        });
        return products;
    });
};


export { carefourSearch };
