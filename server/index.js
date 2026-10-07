require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const connection = require("./db"); // Ensure this is the correct path to your DB connection file
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const userRoutes = require("./routes/user");
const articleRoutes = require("./routes/article");
const articlesRoutes = require("./routes/articles");
const recipeRoutes = require("./routes/recipe");
const recipesRoutes = require("./routes/recipes");
const passwordResetRoutes = require("./routes/passwordReset");
const contactRoutes = require("./routes/contact");
const adminRoutes = require("./routes/admin");

// database connection

const axios = require('axios');

// middlewares
const app = express();
app.use(express.json());
app.use(cors());
// Ensure the uploads directories exist
const uploadDirArticles = path.join(__dirname, 'uploads/articles');
if (!fs.existsSync(uploadDirArticles)) {
    fs.mkdirSync(uploadDirArticles, { recursive: true });
}

const uploadDirRecipes = path.join(__dirname, 'uploads/recipes');
if (!fs.existsSync(uploadDirRecipes)) {
    fs.mkdirSync(uploadDirRecipes, { recursive: true });
}

app.use('/uploads/articles', express.static(uploadDirArticles));
app.use('/uploads/recipes', express.static(uploadDirRecipes));


// Ensure the message-uploads directory exists
const uploadDir = path.join(__dirname, 'message-uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/message-uploads', express.static(uploadDir));

// Ensure the product_images directory exists
const productImagesDir = path.join(__dirname, 'product_images');
if (!fs.existsSync(productImagesDir)) {
    fs.mkdirSync(productImagesDir);
}
app.use('/product_images', express.static(productImagesDir));

// contact routes
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);

// Auth routes
app.use("/api/auth", authRoutes);
app.use("/api/password-reset", passwordResetRoutes);

// Users routes
app.use("/api/users", usersRoutes);
app.use("/api/user", userRoutes);

//articles routes
app.use("/api/article", articleRoutes);
app.use("/api/articles", articlesRoutes);

//recipes routes
app.use("/api/recipe", recipeRoutes);
app.use("/api/recipes", recipesRoutes);

// Products routes
app.get('/api/coupons', async (req, res) => {
    try {
      const response = await axios.get('http://localhost:3002/coupons', {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(response.data);
      res.json(response.data);
    }
    catch (error) {
      console.error("Error during search:", error);
      res.status(500).send({ message: 'Internal server error' });
    }
}); 

// פונקציה לקריאת כל קבצי ה-JSON מהתיקייה
const readJsonFiles = (directory) => {
    console.log(`Reading JSON files from directory: ${directory}`);
    const files = fs.readdirSync(directory);
    let products = [];
    files.forEach(file => {
        console.log(`Reading file: ${file}`);
        const data = fs.readFileSync(path.join(directory, file), 'utf8');
        const json = JSON.parse(data);
        console.log(`JSON data: ${JSON.stringify(json)}`);
        if (json.root && json.root.Items && json.root.Items.Item) {
            products = products.concat(json.root.Items.Item);
        }
    });
    console.log(`Total products read: ${products.length}`);
    return products;
};

// Category routes
app.get('/api/category/:category', (req, res) => {
  const category = req.params.category.toLowerCase();
  console.log(`Fetching category: ${category}`);
  const products = readJsonFiles(path.join(__dirname, 'json_files_directory'));
  console.log(`Total products found: ${products.length}`);
  const categoryProducts = products.filter(product => product.Category && product.Category.toLowerCase() === category);
  console.log(`Category products found: ${categoryProducts.length}`);
  res.json(categoryProducts);
});

// פונקציה למציאת המוצרים הזולים ביותר לכל סופר
const findCheapestProductsByStore = (productList, stores) => {
    let results = {};

    productList.forEach(product => {
        stores.forEach(store => {
            let storeName = store.name;
            if (!results[storeName]) {
                results[storeName] = [];
            }
            
            let cheapestProduct = store.products.reduce((cheapest, currentProduct) => {
                if (typeof currentProduct.ItemName === 'string' && currentProduct.ItemName.toLowerCase().includes(product) && (!cheapest || parseFloat(currentProduct.ItemPrice) < parseFloat(cheapest.ItemPrice))) {
                    return currentProduct;
                }
                return cheapest;
            }, null);

            if (cheapestProduct) {
                results[storeName].push(cheapestProduct);
            }
        });
    });

    return results;
};

// נתיב לחיפוש מוצרים
app.get('/api/search', (req, res) => {
  const query = typeof req.query.q === 'string' ? req.query.q.trim().toLowerCase() : '';
  if (!query) return res.status(400).json({ message: 'A search query is required' });
  console.log(`Search query received: ${query}`);
  const products = readJsonFiles(path.join(__dirname, 'json_files_directory')); // ודא שהתיקייה נכונה
  const results = products
      .filter(product => product.ItemName && product.ItemName.toLowerCase().includes(query))
      .sort((a, b) => parseFloat(a.ItemPrice) - parseFloat(b.ItemPrice)); // מיון לפי מחיר מהנמוך לגבוה
  console.log(`Number of results: ${results.length}`);
  res.json(results);
});

app.post('/api/productsList', async (req, res) => {
    try {
        console.log(req.body);
        const searchQueries = req.body.products;
        if (!Array.isArray(searchQueries) || searchQueries.length === 0 || searchQueries.some(query => typeof query !== 'string' || !query.trim())) {
            return res.status(400).send({ message: 'No search queries provided' });
        }

        const products = readJsonFiles(path.join(__dirname, 'json_files_directory'));
        
        // קיבוץ מוצרים לפי סופר
        const stores = {};
        products.forEach(product => {
            if (!stores[product.Source]) {
                stores[product.Source] = {
                    name: product.Source,
                    products: []
                };
            }
            stores[product.Source].products.push(product);
        });

        const storeArray = Object.values(stores);
        const results = findCheapestProductsByStore(searchQueries.map(query => query.trim().toLowerCase()), storeArray);

        const sourceToPrice = {};
        Object.keys(results).forEach(source => {
            sourceToPrice[source] = results[source].reduce((total, product) => total + parseFloat(String(product.ItemPrice).replace(/[^0-9.-]+/g, "")), 0);
        });

        const [cheapestSource, cheapestPrice] = Object.entries(sourceToPrice).reduce((acc, [source, price]) => {
            return (acc[1] > price) ? [source, price] : acc;
        }, ['', Infinity]);

        console.log(`The cheapest basket comes from ${cheapestSource} and costs ${cheapestPrice} shekels.`);

        res.json({
            sourcesProducts: results,
            sourcesPrices: sourceToPrice,
            cheapestSource: cheapestSource,
            cheapestPrice: cheapestPrice
        });

    } catch (error) {
        console.error("Error during search:", error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

// Products routes
app.get('/api/product/:id', (req, res) => {
  // Implement your logic here
});

// Cart routes
app.get('/api/cart', (req, res) => {
  // Implement your logic here
});
app.post('/api/cart/add', (req, res) => {
  // Implement your logic here
});
app.post('/api/cart/remove', (req, res) => {
  // Implement your logic here
});
app.post('/api/cart/checkout', (req, res) => {
  // Implement your logic here
});

if (require.main === module) {
  const port = process.env.PORT || 3000;
  connection().then(() => {
    app.listen(port, () => console.log(`Listening on port ${port}...`));
  });
}

module.exports = app;
