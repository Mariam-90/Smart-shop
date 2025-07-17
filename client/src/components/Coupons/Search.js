import React, { useState, useEffect } from 'react';
import { ListGroup, Card } from 'reactstrap';
const ListComponent = ({ searchResults }) => {
  // const [cheapestSupplier, setCheapestSupplier] = useState(null);

  // useEffect(() => {
  // const fetchCheapestSupplier = async () => {
  //   try {
  //     console.log(productsList);
  //     let body = Array.isArray(productsList) ? productsList : [productsList]; // Simplified condition
  //     const response = await fetch('http://localhost:3000/api/search', { // Corrected URL
  //       method: 'POST',
  //       body: JSON.stringify({ products: body }),
  //       headers: { 'Content-Type': 'application/json' },
  //     });
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`); // Handle HTTP errors
  //     }
  //     const data = await response.json();
  //     console.log(data); // should be correct data from server
  //     setCheapestSupplier(data);
  //   } catch (error) {
  //     console.error('Error fetching cheapest supplier:', error);
  //     // Consider setting an error state here and displaying it in the UI
  //   }
  // };

  // if (productsList.length > 0) {
  // fetchCheapestSupplier();
  // }
  // }, [productsList]);

  return (
    <div className="list-component">
      {searchResults && searchResults.sourcesProducts && searchResults.sourcesPrices ? (
        <div>
          <h2>Supermarket Lists</h2>
          {Object.entries(searchResults.sourcesProducts).map(([SourceName, products]) => (
            <Card style={{ width: '18rem' }}>
              <Card.Body>
                <Card.Title>{SourceName}: {searchResults.sourcesPrices[SourceName]}</Card.Title>
                <ListGroup variant="flush">
                  {
                    Object.entries(products).map(([productName, product]) => (
                      <ListGroup.Item>
                        {productName}
                        {product.price}
                        <img src={product.image} />
                      </ListGroup.Item>
                    ))}
                </ListGroup>
              </Card.Body>
            </Card>
          ))}
        </div>
      ) : (
        <p>Loading cheapest supplier...</p>
      )}
    </div>
  );
};

export default ListComponent;

