import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Button, Popover, FormControl, InputLabel, Select, MenuItem, TextField, Alert, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import './SearchResults.css';

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState('');
  const [newListName, setNewListName] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isCloseIconPressed, setIsCloseIconPressed] = useState(false);

  useEffect(() => {
    const query = localStorage.getItem('searchQuery');
    const location = localStorage.getItem('searchLocation');

    const fetchResults = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/search?q=${query}&location=${location}`);
        setResults(response.data);
      } catch (error) {
        console.error("Error fetching search results", error);
      }
    };

    fetchResults();
  }, []);

  const fetchLists = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/user/lists', {
        params: { userId: localStorage.getItem("id") }
      });

      if (Array.isArray(response.data)) {
        setLists(response.data);
      } else {
        setLists([]);
        setMessage("אין רשימות זמינות.");
        setIsSuccess(false);
      }

      console.log('Fetched lists:', response.data);
    } catch (error) {
      console.error("Error fetching lists", error);
      setMessage("שגיאה בטעינת הרשימות");
      setIsSuccess(false);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  const getImageUrl = (url) => {
    return url.startsWith('http') ? url : `http://localhost:3000/product_images/${url}`;
  };

  const handleAddToListClick = (event, product) => {
    setSelectedProduct(product.ItemName);
    setAnchorEl(event.currentTarget);
  };

  const handleSave = async () => {
    try {
      const listId = selectedList !== 'new' ? selectedList : newListName;
      if (!listId) {
        setMessage("אנא בחר או הזן שם לרשימה.");
        setIsSuccess(false);
        return;
      }

      console.log(`Adding product to list: ${selectedProduct} in list: ${listId}`);

      const url = "http://localhost:3000/api/user/add-to-list";
      const response = await axios.post(url, {
        userId: localStorage.getItem("id"),
        listId,
        product: selectedProduct
      });

      if (response.status === 200) {
        setMessage("המוצר נוסף לרשימה בהצלחה!");
        setIsSuccess(true);
        // לא נסגור את ה-Popover
      } else {
        console.error('Failed to add product to list:', response.status);
        setMessage('נכשל בהוספת המוצר לרשימה.');
        setIsSuccess(false);
      }
    } catch (error) {
      console.error("Error adding product to list", error);
      setMessage('נכשל בהוספת המוצר לרשימה.');
      setIsSuccess(false);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMessage('');
    setIsCloseIconPressed(false);
    setSelectedList('');
    setNewListName('');
    setIsSuccess(false);
  };

  return (
    <Container>
      <div className="cards-container">
        {results.map((product, index) => (
          <div className="product-card" key={index}>
            <img
              className="product-image"
              src={getImageUrl(product.ImageUrl)}
              alt={product.ItemName}
            />
            <div className="product-info">
              <Typography variant="h5">{product.ItemName}</Typography>
              <Typography variant="body2">מחיר: {product.ItemPrice}</Typography>
              <Typography variant="body2">ספק: {product.ManufacturerName}</Typography>
              <Typography variant="body2">מקור: {product.Source}</Typography>
              <Button variant="contained" color="primary" onClick={(e) => handleAddToListClick(e, product)}>הוסף לרשימה</Button>
            </div>
          </div>
        ))}
      </div>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <div className="popover-content">
          <IconButton 
            className="close-icon-button" 
            onClick={() => { setIsCloseIconPressed(true); handleClose(); }}
            sx={{ position: 'absolute', right: 8, top: 8, color: isCloseIconPressed ? 'red' : 'inherit' }}
          >
            <CloseIcon />
          </IconButton>
          <br />
          <h3>בחר רשימה או צור חדשה</h3>
          {message && <Alert severity={isSuccess ? 'success' : 'error'}>{message}</Alert>}
          <FormControl fullWidth>
            <InputLabel id="select-list-label">בחר רשימה</InputLabel>
            <Select
              labelId="select-list-label"
              value={selectedList}
              onChange={(e) => setSelectedList(e.target.value)}
            >
              {lists.map((list) => (
                <MenuItem key={list._id} value={list._id}>
                  {list.name}
                </MenuItem>
              ))}
              <MenuItem value="new">+ רשימה חדשה</MenuItem>
            </Select>
          </FormControl>
          {selectedList === 'new' && (
            <TextField
              fullWidth
              label="שם רשימה חדשה"
              variant="outlined"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              className="new-list-input"
              style={{ marginTop: '1rem' }}
            />
          )}
          <Button variant="contained" color="primary" onClick={handleSave} style={{ marginTop: '1rem' }}>שמור</Button>
        </div>
      </Popover>
    </Container>
  );
};

export default SearchResults;
