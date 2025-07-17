import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaHeart } from 'react-icons/fa';
import axios from 'axios';
import './styles.css';

const ContentCard = ({ content, isFavourite }) => {
  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    try {
      const button = e.target.closest('button');
      const url = 'http://localhost:3000/api/user/favorites/update';
      const res = await axios.post(url, {
        id: localStorage.getItem('id'),
        contentId: button.id
      });

      const diff = res.data.diff;
      let countObj = button.querySelector('span');
      countObj.innerText = parseInt(countObj.innerText) + diff;
      let heart = button.querySelector('path');
      heart.style.color = diff === 1 ? 'red' : 'white';
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Card className="content-card">
      <Card.Body>
      {content.imagePath && <Card.Img variant="top" src={`http://localhost:3000/${content.imagePath}`} alt={content.title} className="content-image" />}
      </Card.Body>
      <Card.Footer>
      {content.type === 'Article' && <Card.Text className="content-text">{content.text}</Card.Text>}
        {content.type === 'Recipe' && (
          <>
            <Card.Text className="content-text">
              <strong>מצרכים:</strong>
              <br />
              {content.products}
            </Card.Text>
            <Card.Text className="content-text">
              <strong>המתכון:</strong>
              <br />
              {content.text}
            </Card.Text>
          </>
        )}
        <small className="text-muted">מאת: {content.tzunaiName}</small>
        <br></br><span className='like1'>מספר המעדפים {content.heartCount} </span>
        <Button id={content._id} onClick={handleToggleFavorite} className="favorite-button">
          <FaHeart color={isFavourite ? 'red' : 'white'} />
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default ContentCard;
