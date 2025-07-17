import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Form, Card } from 'react-bootstrap';
import ContentMap from './contentMap';
import './styles.css';

const Articles = () => {
  const [articles, setArticles] = useState(null);
  const [recipes, setRecipes] = useState(null);
  const [favouriteContents, setFavouriteContents] = useState([]);
  const [recipesShowOnlyFavourites, setRecipesShowOnlyFavourites] = useState(false);
  const [articlesShowOnlyFavourites, setArticlesShowOnlyFavourites] = useState(false);

  useEffect(() => {
    axios.post('http://localhost:3000/api/user/favorites/list', { id: localStorage.getItem('id') })
      .then((res) => setFavouriteContents(res.data.favouriteContents))
      .catch((err) => console.error('Error:', err));
  }, []);

  useEffect(() => {
    axios.get('http://localhost:3000/api/articles/list')
      .then((res) => setArticles(res.data.articles))
      .catch((err) => console.error('Error:', err));
  }, []);

  useEffect(() => {
    axios.get('http://localhost:3000/api/recipes/list')
      .then((res) => setRecipes(res.data.recipes))
      .catch((err) => console.error('Error:', err));
  }, []);

  return (
    <Row>
      <Col md={6}>
        <Card className="mb-3">
          <Card.Body>
            {articles ? (
              <>
                <h1 className="custom-header">כתבות</h1>
                <Form.Check
                  style={{ display: 'inline-block' }}
                  type="switch"
                  checked={articlesShowOnlyFavourites}
                  label="הצג רק את הכתבות המועדפות שלי"
                  onChange={() => setArticlesShowOnlyFavourites(!articlesShowOnlyFavourites)}
                />
                <ContentMap
                  contents={articles}
                  favouriteContents={favouriteContents}
                  onlyFavourites={articlesShowOnlyFavourites}
                  align="right"
                />
              </>
            ) : (
              <h1>אין כתבות עדיין...</h1>
            )}
          </Card.Body>
        </Card>
      </Col>
      <Col md={6}>
        <Card className="mb-3">
          <Card.Body>
            {recipes ? (
              <>
                <h1 className="custom-header">מתכונים</h1>
                <Form.Check
                  style={{ display: 'inline-block' }}
                  type="switch"
                  checked={recipesShowOnlyFavourites}
                  label="הצג רק את המתכונים המועדפים שלי"
                  onChange={() => setRecipesShowOnlyFavourites(!recipesShowOnlyFavourites)}
                />
                <ContentMap
                  contents={recipes}
                  favouriteContents={favouriteContents}
                  onlyFavourites={recipesShowOnlyFavourites}
                  align="left"
                />
              </>
            ) : (
              <h1>אין מתכונים עדיין...</h1>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default Articles;
