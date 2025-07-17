import { productsFromUrl } from "../allSupers/helpers.mjs"

export const shufersalCoupons = async (browser, page) => {
    const url = `https://www.shufersal.co.il/online/he/promo/A`
    const productSelector = ".tile.miglog-promo"
    const selectors = {
        productDescriptionSelector: "span.description",
        productImageSelector: ".pic",
        untilSelector: ".rightSide",
        productPriceTextSelector: ".priceTxt"
    }
    const products = await productsFromUrl(browser, page, url, productSelector, selectors);
    return products;
}

