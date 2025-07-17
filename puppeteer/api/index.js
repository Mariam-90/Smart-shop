import express from 'express';
import { carefourSearch } from '../carefour/search.mjs';
import { shufersalSearch } from '../shufersal/search.mjs';
import { quikSearch } from '../quik/search.mjs';
import { bigdabachSearch } from '../bigdabach/search.mjs';
import { carefourCoupons } from '../carefour/coupons.mjs'
import { shufersalCoupons } from '../shufersal/coupons.mjs'
import { quikCoupons } from '../quik/coupons.mjs'
import { Puppeteer, newPage } from '../browser.mjs';
import { productsFromUrl } from "../allSupers/helpers.mjs"

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Launch the browser and create a new page
const { browser, page } = await Puppeteer();

app.post('/search', async (req, res) => {
    try {
        const searchQueries = req.body.products;
        if (!searchQueries || searchQueries.length === 0) {
            return res.status(400).send({ message: 'No search queries provided' });
        }

        let resultsByQuery = {};

        for (let query of searchQueries) {
            // Ensure each search function returns an iterable array (even if it's empty)
            const quikProducts = await quikSearch(browser, page, [query]);
            const carefourProducts = await carefourSearch(browser, page, [query]);
            const shufersalProducts = await shufersalSearch(browser, page, [query]);
            const bigdabachProducts = await bigdabachSearch(browser, page, [query]);
            //const victoryProducts = await victorySearch(browser, page, [query]) ;
            // Verify iterability before spreading
            const combinedProducts = [
                ...(Array.isArray(carefourProducts) ? carefourProducts : []),
                ...(Array.isArray(quikProducts) ? quikProducts : []),
                ...(Array.isArray(shufersalProducts) ? shufersalProducts : []),
                ...(Array.isArray(bigdabachProducts) ? bigdabachProducts : []),
                //...(Array.isArray(victoryProducts) ? victoryProducts : []),
            ];

            const sortedProducts = combinedProducts.sort((a, b) => {
                const priceA = parseFloat(a.price.replace(/[^\d.-]/g, ''));
                const priceB = parseFloat(b.price.replace(/[^\d.-]/g, ''));
                return priceA - priceB;
            });

            resultsByQuery[query] = sortedProducts;
        }

        res.json(resultsByQuery);
    } catch (error) {
        console.error("Error during search:", error);
        res.status(500).send({ message: 'Internal server error' });
    }
});
app.get('/coupons', async (req, res) => {
    try {
        // Use Promise.all to execute all coupon retrieval functions in parallel
        const [quikProducts, carefourProducts, shufersalProducts] = await Promise.all([
            quikCoupons(browser, await newPage(browser)),
            carefourCoupons(browser, await newPage(browser)),
            shufersalCoupons(browser, await newPage(browser))
        ]);

        const combinedProducts = {
            "quik": quikProducts,
            "carefour": carefourProducts,
            "shufersal": shufersalProducts
        };

        console.log("combinedProducts:");
        console.log(combinedProducts);

        return res.json(combinedProducts);
    } catch (error) {
        console.error("Error during search:", error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

// app.get('/coupons', async (req, res) => {
//     try {
//         const quikPage = await newPage(browser);
//         const quikProducts = await quikCoupons(browser, quikPage);
//         console.log("quikProducts:");
//         console.log(quikProducts);

//         const carefourPage = await newPage(browser);
//         const carefourProducts = await carefourCoupons(browser, carefourPage);
//         console.log("carefourProducts");
//         console.log(carefourProducts);

//         const shufersalPage = await newPage(browser);
//         const shufersalProducts = await shufersalCoupons(browser, shufersalPage);
//         console.log("shufersalProducts:");
//         console.log(shufersalProducts);

//         const combinedProducts = { "quik": quikProducts, "carefour": carefourProducts, "shufersal": shufersalProducts };
//         console.log("combinedProducts:");
//         console.log(combinedProducts);

//         return res.json(combinedProducts);
//     } catch (error) {
//         console.error("Error during search:", error);
//         res.status(500).send({ message: 'Internal server error' });
//     }
// });

app.get('/category/:name', async (req, res) => {
    const name = req.params.name;
    const productSelector = "li.miglog-prod"
    const selectors = {
        productDescriptionSelector: "span:nth-of-type(1)",
        productImageSelector: ".pic",
        productPriceTextSelector: ".number"
    }
    console.log(name);
    const categories =
    {
        "bread": "https://www.shufersal.co.il/online/he/%D7%A7%D7%98%D7%92%D7%95%D7%A8%D7%99%D7%95%D7%AA/%D7%A1%D7%95%D7%A4%D7%A8%D7%9E%D7%A8%D7%A7%D7%98/%D7%9C%D7%97%D7%9E%D7%99%D7%9D-%D7%95%D7%9E%D7%95%D7%A6%D7%A8%D7%99-%D7%9E%D7%90%D7%A4%D7%94/c/A10",
        "meat": "https://www.shufersal.co.il/online/he/%D7%A7%D7%98%D7%92%D7%95%D7%A8%D7%99%D7%95%D7%AA/%D7%A1%D7%95%D7%A4%D7%A8%D7%9E%D7%A8%D7%A7%D7%98/%D7%9E%D7%95%D7%A6%D7%A8%D7%99-%D7%91%D7%A9%D7%A8%2C-%D7%A2%D7%95%D7%A3-%D7%95%D7%93%D7%92%D7%99%D7%9D-/c/A07",
        "milk": "https://www.shufersal.co.il/online/he/%D7%A7%D7%98%D7%92%D7%95%D7%A8%D7%99%D7%95%D7%AA/%D7%A1%D7%95%D7%A4%D7%A8%D7%9E%D7%A8%D7%A7%D7%98/%D7%97%D7%9C%D7%91-%D7%95%D7%91%D7%99%D7%A6%D7%99%D7%9D/c/A01",
        "fruits": "https://www.shufersal.co.il/online/he/%D7%A7%D7%98%D7%92%D7%95%D7%A8%D7%99%D7%95%D7%AA/%D7%A1%D7%95%D7%A4%D7%A8%D7%9E%D7%A8%D7%A7%D7%98/%D7%A4%D7%99%D7%A8%D7%95%D7%AA-%D7%95%D7%99%D7%A8%D7%A7%D7%95%D7%AA/c/A04",
        "organic": "https://www.shufersal.co.il/online/he/%D7%A7%D7%98%D7%92%D7%95%D7%A8%D7%99%D7%95%D7%AA/%D7%A1%D7%95%D7%A4%D7%A8%D7%9E%D7%A8%D7%A7%D7%98/%D7%90%D7%95%D7%A8%D7%92%D7%A0%D7%99-%D7%95%D7%91%D7%A8%D7%99%D7%90%D7%95%D7%AA/c/A28",
        "wine": "https://www.shufersal.co.il/online/he/%D7%A7%D7%98%D7%92%D7%95%D7%A8%D7%99%D7%95%D7%AA/%D7%A1%D7%95%D7%A4%D7%A8%D7%9E%D7%A8%D7%A7%D7%98/%D7%9E%D7%A9%D7%A7%D7%90%D7%95%D7%AA-%D7%90%D7%9C%D7%9B%D7%95%D7%94%D7%95%D7%9C-%D7%95%D7%99%D7%99%D7%9F/c/A13",
    };

    if (name in categories) {
        const url = categories[name];
        console.log(`Navigating to ${url}`);
        const products = await productsFromUrl(browser, page, url, productSelector, selectors);
        console.log(`Found ${products.length} products`);
        console.log(products);
        return res.json(products); // Return the products;
    } else {
        return res.json([]); // Return an empty array if the category is not found[];
    }
});

app.get('/health', (req, res) => res.send({ status: 'ok' }));

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
