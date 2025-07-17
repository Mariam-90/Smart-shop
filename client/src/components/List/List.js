import React from 'react';
import { Card, CardContent, CardMedia, Typography, Grid, Container, Box } from '@mui/material';
import axios from 'axios';
import './ListComponent.css';

const ListComponent = ({ searchResults }) => {
    const handleToggleFavorite = async (e) => {
        e.preventDefault();
        try {
            let button = null;

            if (!e.target.matches("button"))
                button = e.target.closest("button");
            else
                button = e.target;

            const url = "http://localhost:3000/api/user/ffavorites/update";
            const res = await axios.post(url, {
                id: localStorage.getItem("id"),
                contentId: button.id
            });

            const diff = res.data.diff;
            let countObj = button.querySelector("span");
            countObj.innerText = parseInt(countObj.innerText) + diff;
            let heart = button.querySelector("path");
            heart.style.color = diff === 1 ? "red" : "white";
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleSave = async () => {
        try {
            let jsonProductsText = document.getElementById("productsListText").innerText;
            let jsonProducts = jsonProductsText.split('\n').map(item => item.trim());

            const url = "http://localhost:3000/api/user/basket/add";
            await axios.post(url, {
                id: localStorage.getItem("id"),
                basket: jsonProducts
            });
            console.log("Basket saved successfully");
        } catch (error) {
            console.error("Error saving basket:", error);
        }
    };

    if (!searchResults || !searchResults.sourcesProducts || !searchResults.sourcesPrices) {
        return <div>Loading...</div>;
    }

    const { sourcesProducts, sourcesPrices, cheapestSource, cheapestPrice } = searchResults;

    const getImageUrl = (url) => {
        if (url.startsWith('http')) {
            return url;
        } else {
            return `http://localhost:3000/product_images/${url}`;
        }
    };

    return (
        <Container>
            {cheapestPrice !== null && cheapestSource && (
                <Box my={4} className="cheapest-source">
                    <Typography variant="h5">המקור הזול ביותר:</Typography>
                    <Typography variant="h6">{cheapestSource}</Typography>
                    <Typography variant="h6">המחיר הזול ביותר: ₪{Number(cheapestPrice).toFixed(2)}</Typography>
                </Box>
            )}
            {Object.keys(sourcesProducts).sort((a, b) => sourcesPrices[a] - sourcesPrices[b]).map((source) => (
                <Box my={4} key={source} className="scrollable">
                    <Typography variant="h5" gutterBottom className="source-title">מקור: {source}</Typography>
                    <Typography variant="h6" gutterBottom className="total-price">מחיר כולל: ₪{Number(sourcesPrices[source]).toFixed(2)}</Typography>
                    <Grid container spacing={2}>
                        {Array.isArray(sourcesProducts[source]) && sourcesProducts[source].map((product, index) => (
                            <Grid item key={index} xs={12} sm={6} md={4}>
                                <Card className="product-card">
                                    <CardMedia
                                        component="img"
                                        height="150"
                                        image={getImageUrl(product.ImageUrl)}
                                        alt={product.ItemName}
                                        className="product-image"
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h6" component="div" align="center">
                                            {product.ItemName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" align="center">
                                            מחיר: {product.ItemPrice}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" align="center">
                                            ספק: {product.ManufacturerName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" align="center">
                                            מקור: {product.Source}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            ))}
        </Container>
    );
};

export default ListComponent;
