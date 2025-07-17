import { productsFromUrl } from "../allSupers/helpers.mjs"

export const quikCoupons = async (browser, page) => {
    const url = `https://www.quik.co.il/specials`
    const productSelector = ".special-product";
    const selectors = {
        productDescriptionSelector: ".promotion-description",
        productImageSelector: ".image-wrapper .image",
        productPriceTextSelector: ".tag",
    };
    const products = await productsFromUrl(browser, page, url, productSelector, selectors);
    console.log(products);
    return products;
}