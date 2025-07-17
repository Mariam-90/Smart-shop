import React, { useRef } from 'react';
import ContentCard from './contentCard';
import './styles.css';

const ContentMap = ({ contents, favouriteContents, onlyFavourites, align }) => {
  const filteredContents = onlyFavourites
    ? contents.filter(content => favouriteContents.includes(content._id))
    : contents;

  const carouselRef = useRef(null);

  const scrollLeft = () => {
    carouselRef.current.scrollBy({
      left: -carouselRef.current.clientWidth,
      behavior: 'smooth'
    });
  };

  const scrollRight = () => {
    carouselRef.current.scrollBy({
      left: carouselRef.current.clientWidth,
      behavior: 'smooth'
    });
  };

  return (
    <div className={`carousel-container ${align === 'center' ? 'center-align' : 'left-align'}`}>
      <button className="carousel-button left" onClick={scrollLeft}>←</button>
      <div className="content-map" ref={carouselRef}>
        {filteredContents.map((content, index) => (
          <ContentCard key={index} content={content} isFavourite={favouriteContents.includes(content._id)} />
        ))}
      </div>
      <button className="carousel-button right" onClick={scrollRight}>→</button>
    </div>
  );
};

export default ContentMap;
