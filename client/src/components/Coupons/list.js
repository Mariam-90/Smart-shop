const form = document.getElementById('product-search-form');
const productResults = document.getElementById('product-results');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const productsList = formData.get('product-input').split(',').map(product => product.trim());
    const productsData = await fetchProducts(productsList);
    if (productsData) {
        renderProducts(productsData);
    } else {
        productResults.innerHTML = "<p>אירעה שגיאה בעת הבאת המוצרים.</p>";
    }
});

async function fetchProducts(products) {
    const query = { products };
    try {
        const response = await fetch("http://localhost:3000/api/api/productsList", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(query)
        });
        if (response.status === 200) {
            return await response.json();
        } else {
            console.log(`Failed to fetch products: ${response.status}`);
            return null;
        }
    } catch (error) {
        console.error("Error fetching products:", error);
        return null;
    }
}

function renderProducts(productsData) {
    let html = "<h2>פרטי המוצרים:</h2>";
    productsData.forEach(product => {
        html += `<div>
                    <p>שם המוצר: ${product.name}</p>
                    <p>מחיר: ${product.price}</p>
                    <p>תיאור: ${product.description}</p>
                    <p>זמינות: ${product.availability}</p>
                    <p>דירוגים: ${product.ratings}</p>
                    <p>דילים: ${product.deals}</p>
                    <p>חנויות הזולות ביותר: ${product.cheapest_stores}</p>
                </div><br>`;
    });
    productResults.innerHTML = html;
}
