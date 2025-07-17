import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Form } from 'react-bootstrap';
import ListComponent from '../List/List'; // ייבוא הרכיב ListComponent לתצוגת התוצאות
import "./index.css";
import { FaListUl } from 'react-icons/fa'; // ייבוא האייקון של רשימה

const MyLists = () => {
  const [baskets, setBaskets] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentBasketIndex, setCurrentBasketIndex] = useState(null);
  const [updatedBasket, setUpdatedBasket] = useState([]);
  const [basketName, setBasketName] = useState(''); // להוסיף שם הרשימה

  const handleSearchSubmit = async (listItems) => {
    try {
      const response = await fetch('http://localhost:3000/api/productsList', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ products: listItems }),
      });

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data); // וודא שהנתונים הם בפורמט הנכון
        setShowSearchResults(true);
      } else {
        console.error('Failed to fetch search results:', response.status);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const handleDelete = async ({ currentTarget: btn }) => {
    const url = "http://localhost:3000/api/user/basket/delete";
    try {
      const res = await axios.post(url, {
        id: localStorage.getItem("id"),
        basketIndex: parseInt(btn.id)
      });
      setBaskets(baskets.filter((_, index) => index !== parseInt(btn.id)));
    } catch (error) {
      console.error('Error deleting basket:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/user/basket/update', {
        id: localStorage.getItem("id"),
        basket: updatedBasket,
        basketId: currentBasketIndex
      });

      if (response.status === 200) {
        const updatedBaskets = await axios.post('http://localhost:3000/api/user/basket/list', {
          id: localStorage.getItem("id")
        });
        setBaskets(updatedBaskets.data.baskets);
        setShowUpdateModal(false);
      } else {
        console.error('Failed to update basket:', response.status);
      }
    } catch (error) {
      console.error('Error updating basket:', error);
    }
  };

  const handleAddToList = async (product) => {
    try {
      const listId = currentBasketIndex !== null ? baskets[currentBasketIndex]._id : "רשימה חדשה";
      const response = await axios.post('http://localhost:3000/api/user/add-to-list', {
        userId: localStorage.getItem("id"),
        listId,
        product
      });

      if (response.status === 200) {
        const updatedBaskets = await axios.post('http://localhost:3000/api/user/basket/list', {
          id: localStorage.getItem("id")
        });
        setBaskets(updatedBaskets.data.baskets);
        setShowUpdateModal(false);
      } else {
        console.error('Failed to add product to list:', response.status);
      }
    } catch (error) {
      console.error('Error adding product to list:', error);
    }
  };

  useEffect(() => {
    const fetchBaskets = async () => {
      try {
        const res = await axios.post('http://localhost:3000/api/user/basket/list', {
          id: localStorage.getItem("id")
        });
        if (res.data.baskets.length > 0) {
          setBaskets(res.data.baskets);
        }
      } catch (error) {
        console.error('Error fetching baskets:', error);
      }
    };
    fetchBaskets();
  }, []);

  return (
    <div className="user-management-container">
      <h1>הרשימות שלי</h1>
      {baskets.length > 0 ? (
        baskets.map((basket, index) => (
          <div key={index} className="list-container">
<div className="basket-header">
  <FaListUl className="basket-icon" />
  <span style={{ marginRight: '15px' }}></span> {/* הוספת מרווח באמצעות span */}
  <h2>{basket.name}</h2>
</div>

            <ul>
              {basket.products.map((product, i) => (
                <li key={i}>{`${i + 1}. ${product}`}</li>
              ))}
            </ul>
            <Button variant="danger" id={index} onClick={handleDelete}>מחק</Button>
            <Button variant="primary" onClick={() => handleSearchSubmit(basket.products)}>חיפוש</Button>
            <Button variant="secondary" onClick={() => { setShowUpdateModal(true); setCurrentBasketIndex(index); setUpdatedBasket(basket.products); setBasketName(basket.name); }}>עדכן</Button>
          </div>
        ))
      ) : (
        <div>לא נמצאו רשימות</div>
      )}

      {showSearchResults && searchResults && (
        <div className="search-results">
          <ListComponent searchResults={searchResults} />
        </div>
      )}

      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>עדכון רשימה</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {updatedBasket.map((item, index) => (
              <Form.Group key={index}>
                <Form.Label>פריט {index + 1}</Form.Label>
                <Form.Control
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const newBasket = [...updatedBasket];
                    newBasket[index] = e.target.value;
                    setUpdatedBasket(newBasket);
                  }}
                />
              </Form.Group>
            ))}
            <Button variant="secondary" onClick={() => setUpdatedBasket([...updatedBasket, ''])}>
              הוסף פריט
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>סגור</Button>
          <Button variant="primary" onClick={handleUpdate}>שמור</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MyLists;
