import React, { Component } from 'react';
import './styles.css';
import axios from 'axios';
import { ListGroup, ListGroupItem } from 'reactstrap';

export default class Coupons extends Component {
  state = {
    data: null,
    error: null,
  };

  componentDidMount() {
    // Check if there's saved data in localStorage
    const savedData = localStorage.getItem('couponsData');
    if (savedData) {
      this.setState({ data: JSON.parse(savedData) });
    } else {
      this.getData();
    }
  }

  componentWillUnmount() {
    // Clear the timeout to avoid memory leaks
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  getData() {
    axios
      .get('http://localhost:3000/api/coupons')
      .then(({ data }) => {
        this.setState({ data });
        console.log(data);
        // Set a timeout to save the data to localStorage after 40 seconds
        this.timeoutId = setTimeout(this.saveToLocalStorage, 40000); // 40000 ms = 40 seconds
      })
      .catch((err) => {
        this.setState({ error: err.message });
      });
  }

  saveToLocalStorage = () => {
    const { data } = this.state;
    if (data) {
      localStorage.setItem('couponsData', JSON.stringify(data));
      console.log('Data saved to localStorage');
    }
  };

  render() {
    return (
      <div className='Coupons'>
        <h1 className="text-center">מבצעים</h1>
        {this.state.data ? (
          <div className="text-center">
            <div className="d-flex justify-content-center">
              {Object.entries(this.state.data).map(([source, products]) => (
                <div style={{ width: 'max-content', margin: '10px' }} key={source}>
                  <h2>{source}</h2>
                  <ListGroup className="d-inline-flex">
                    {products.map((product, index) => (
                      <ListGroupItem key={index}>
                        <img src={product.image} alt={product.description} style={{ width: '100px', height: 'auto' }} />
                        <p>{product.pricetext}</p>
                        <p>{product.description}</p>
                        <code>{product.until}</code>
                      </ListGroupItem>
                    ))}
                  </ListGroup>
                </div>
              ))}
            </div>
          </div>
        ) : this.state.error ? (
          <div className="text-center">{this.state.error}</div>
        ) : (
          <div className="text-center">Loading...</div>
        )}
      </div>
    );
  }
}
