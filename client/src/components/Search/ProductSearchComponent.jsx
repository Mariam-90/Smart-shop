import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, OutlinedInput, IconButton, Box, Typography, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import './ProductSearch.css';

const ProductSearch = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim() === '') return; // Prevent empty searches
    localStorage.setItem('searchQuery', query);
    navigate('/search-results');
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Container className="product-search-container" dir="rtl">
      <Paper elevation={6} className="motivation-article">
        <Typography variant="h5" component="h2" gutterBottom className="article-title">
          גלה את המחירים הטובים ביותר למוצרי הצריכה שלך!
        </Typography>
        <Typography variant="body1" className="article-text">
          חיפוש המוצרים בתוכנית שלנו מאפשר לך לגלות את המחירים הטובים ביותר בשוק. תתחיל לחפש היום ותחסוך בגדול!
        </Typography>
        <Box className="search-block">
          <OutlinedInput
            className="search-input"
            placeholder="חפש מוצר"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            fullWidth
          />
          <IconButton color="primary" onClick={handleSearch} className="search-icon">
            <SearchIcon />
          </IconButton>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProductSearch;
