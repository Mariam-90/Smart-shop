import { productsFromUrl } from "../allSupers/helpers.mjs"

export const carefourCoupons = async (browser, page) => {
    const url = `https://www.carrefour.co.il/specials`
    const productSelector = ".products-list-item.sale";
    const selectors = {
        productDescriptionSelector: ".special-description",
        productImageSelector: ".product-image img",
        productPriceTextSelector: ".tag",
        untilSelector: "div.ng-binding.ng-scope"
    };
    const products = await productsFromUrl(browser, page, url, productSelector, selectors);
    return products;
}
