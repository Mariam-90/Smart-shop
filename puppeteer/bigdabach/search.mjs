const bigdabachSearch = async (browser, page, searchQueries) => {
    try {
        for (const searchQuery of searchQueries) {
            const url = `https://www.bigdabach.co.il/search/${encodeURIComponent(searchQuery)}`;
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
            const priceEl = el.querySelector('.sp-product-price .price'); // Assuming this is correct based on your provided HTML
            // Attempt to find an <img> tag for the image
            let imageUrlEl = el.querySelector('.image-wrapper img');
            let image = imageUrlEl ? imageUrlEl.src : '';
            // If no <img> tag found, attempt to extract background-image URL
            if (!image) {
                const backgroundEl = el.querySelector('.image-wrapper .image');
                image = backgroundEl ? backgroundEl.style.backgroundImage.slice(4, -1).replace(/"/g, "") : '';
            }
            const brandEl = el.querySelector('.data .brand'); // Check if this selector matches your actual HTML structure
            const unitEl = el.querySelector('.data .weight'); // Adjust based on actual structure if necessary
            if (!nameEl || !priceEl || !image || !brandEl || !unitEl) {
                return; // Skip if essential information is missing
            }
            const name = nameEl.innerText.trim();
            const price = priceEl.innerText.trim();
            const brand = brandEl.innerText.trim();
            const unit = unitEl.innerText.trim(); // Adjust how you extract the unit if necessary
            products.push({ name, price, brand, unit, image, source: 'Big Dabach' });
        });
        return products;
    });
};



export { bigdabachSearch };