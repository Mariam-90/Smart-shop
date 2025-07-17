import React, { useState } from "react";
import { Image } from "react-bootstrap";
import { Button, Popover, FormControl, InputLabel, Select, MenuItem, TextField, Alert, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import "./product.css"; // וודא שהקובץ מחובר נכון

const Product = (props) => {
  const { image, price, title, source } = props;
  const formattedPrice = price.includes('₪') ? price : `${price}₪`;
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedList, setSelectedList] = useState('');
  const [newListName, setNewListName] = useState('');
  const [lists, setLists] = useState([]);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isCloseIconPressed, setIsCloseIconPressed] = useState(false);

  const handleAddToListClick = async (event) => {
    setAnchorEl(event.currentTarget);
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
    } catch (error) {
      console.error("Error fetching lists", error);
      setMessage("שגיאה בטעינת הרשימות");
      setIsSuccess(false);
    }
  };

  const handleSave = async () => {
    try {
      const listId = selectedList !== 'new' ? selectedList : newListName;
      if (!listId) {
        setMessage("אנא בחר או הזן שם לרשימה.");
        setIsSuccess(false);
        return;
      }

      const response = await axios.post('http://localhost:3000/api/user/add-to-list', {
        userId: localStorage.getItem("id"),
        listId,
        product: title
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
    <div className="product-card">
      <Image className="product-image" src={image.startsWith('http') ? image : `http://localhost:3000/product_images/${image}`} alt={title} />
      <div className="product-info">
        <Typography variant="h5" className="product-title">{title}</Typography>
        <Typography variant="body2" className="product-price">מחיר: {formattedPrice}</Typography>
        <Typography variant="body2" className="product-source">מקור: {source}</Typography>
        <Button className="add-to-list-button" onClick={handleAddToListClick}>הוסף לרשימה</Button>
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
            />
          )}
          <Button className="save-button" onClick={handleSave}>שמור</Button>
        </div>
      </Popover>
    </div>
  );
}

export default Product;
