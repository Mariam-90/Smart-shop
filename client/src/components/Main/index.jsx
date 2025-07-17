import React, { useState, useEffect } from 'react';
import { Row, Col, Carousel, Button, Alert } from 'react-bootstrap';
import { TextField, Modal, IconButton, Snackbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'; // אייקון סגירה
import { Link } from "react-router-dom"; // שימוש ב-Link
import ProductSearch from '../Search/ProductSearchComponent.jsx';
import ListComponent from '../List/List.js';
import axios from 'axios';
import "./styles.css";
import Categories from "../category/categories";

const Main = () => {
  const [queries, setQueries] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [articles, setArticles] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false); // מצב לפתיחת וסגירת המודאל
  const [snackbarOpen, setSnackbarOpen] = useState(false); // מצב לפתיחת וסגירת Snackbar
  const [saveSuccess, setSaveSuccess] = useState(false); // מצב לפתיחת הודעת הצלחה במודאל

  const handleSearch = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/productsList', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ products: queries.split('\n').map(item => item.trim()) }),
      });

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
        setModalOpen(true); // פתיחת המודאל כאשר יש תוצאות חיפוש
      } else {
        console.error('Failed to fetch search results:', response.status);
      }
    } catch (error) {
      console.error('Error searching for products', error);
    }
  };

  const handleSave = async () => {
    try {
      const products = queries.split('\n').map(item => item.trim());
      const userId = localStorage.getItem("id");
  
      if (!userId) {
        alert('User ID is not set.');
        return;
      }
  
      if (!products.length) {
        alert('No products to save.');
        return;
      }
  
      const response = await fetch('http://localhost:3000/api/user/basket/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: userId, basket: { name: "My Basket", products } }), // וודא שהנתונים במבנה הנכון
      });
  
      if (response.ok) {
        console.log("List saved successfully");
        setSaveSuccess(true); // הצגת הודעת הצלחה במודאל
        setSnackbarOpen(true); // הצגת Snackbar בעת שמירה מוצלחת
      } else {
        const errorData = await response.json();
        alert(`Failed to save list: ${response.status} - ${errorData.message}`);
        console.error('Failed to save list:', response.status, errorData);
      }
    } catch (error) {
      alert(`Error saving list: ${error.message}`);
      console.error('Error saving list:', error);
    }
  };
  
  useEffect(() => {
    axios.get('http://localhost:3000/api/articles/list')
      .then((res) => setArticles(res.data.articles))
      .catch((err) => console.error('Error:', err));
      
    axios.get('http://localhost:3000/api/recipes/list')
      .then((res) => setRecipes(res.data.recipes))
      .catch((err) => console.error('Error:', err));
  }, []);

  return (
    <div>
      <Row style={{ justifyContent: 'space-between' }}>
        <Col md={12} lg={7} className='ProductSearchContainer'>
          <ProductSearch />
        </Col>
        <Col xs={12} lg={6} className="carousel-container">
          <Alert variant="info" className="text-center">
            <h4>הצטרפו למערכת שלנו עכשיו!</h4>
            <p>קבלו גישה להנחות ומבצעים מיוחדים <Link to="/signup">הירשמו עכשיו</Link></p>
          </Alert>
          <div className="moving-title-container">
            <div className="moving-title">קראו את הכתבות המובילות שלנו</div>
          </div>
          <Carousel className="custom-carousel">
            {articles.map(article => (
              <Carousel.Item key={article.id}>
                <img
                  className="d-block w-100"
                  src={`http://localhost:3000/${article.imagePath}`}
                  alt={article.title}
                  onClick={() => window.location.href = `/articles/${article.id}`}
                  style={{ objectFit: 'cover', height: '290px' }} // Use only height and object-fit
                />
                <Carousel.Caption className="custom-carousel-caption">
                  <h3 className="highlighted-title">{article.title}</h3>
                  <p onClick={() => window.location.href = `/articles`}>{article.author}</p>
                  <Button
                    className="custom-button"
                    onClick={() => window.location.href = `/articles`}
                  >
                    קרא עוד
                  </Button>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
            {recipes.map(recipe => (
              <Carousel.Item key={recipe.id}>
                <img
                  className="d-block w-100"
                  src={`http://localhost:3000/${recipe.imagePath}`}
                  alt={recipe.title}
                  onClick={() => window.location.href = `/recipes/${recipe.id}`}
                  style={{ objectFit: 'cover', height: '300px' }} // Use only height and object-fit
                />
                <Carousel.Caption className="custom-carousel-caption">
                  <h3 className="highlighted-title">{recipe.title}</h3>
                  <p onClick={() => window.location.href = `/recipes`}>{recipe.author}</p>
                  <Button
                    className="custom-button"
                    onClick={() => window.location.href = `/recipes/${recipe.id}`}                   
                  >
                    קרא עוד
                  </Button>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
        </Col>
        <Col md={12} lg={6} className="categories-column">
          <Categories />
        </Col>
        <Col md={12} lg={7} className='listContainer'>
          <TextField 
            label="הזן את המוצרים כאן, כל מוצר בשורה נפרדת"
            variant="outlined"
            multiline
            rows={6}
            value={queries}
            onChange={(e) => setQueries(e.target.value)}
            style={{ marginBottom: '20px', width: '100%' }}
          />
          <Button variant="contained" color="primary" onClick={handleSearch} className="search-button">חפש</Button>
        </Col>
      </Row>

      {/* מודאל להצגת תוצאות החיפוש */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="search-results-modal-title"
        aria-describedby="search-results-modal-description"
      >
        <div className="modal-content">
          <IconButton
            className="close-button"
            onClick={() => setModalOpen(false)}
            style={{ position: 'absolute', top: 10, right: 10 }}
          >
            <CloseIcon />
          </IconButton>

          {searchResults && <ListComponent searchResults={searchResults} />}
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSave}
            className="save-button"
            style={{ marginTop: '20px', width: '100%' }}
          >
            שמור רשימה
          </Button>
                    {/* הודעת הצלחה במודאל */}
                    {saveSuccess && (
            <Alert variant="success" style={{ marginBottom: '20px' }}>
              הרשימה נשמרה בהצלחה!
            </Alert>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Main;
