import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Category from "./category";
import "./Categories.css";

const Categories = () => {
    const categories = [
        {
            image: "bread.png",
            title: "לחמים ומאפים",
            path: "/category/bread"
        },
        {
            image: "meat.png",
            title: "בשר ודגים",
            path: "/category/meat"
        },
        {
            image: "milk.png",
            title: "מוצרי חלב",
            path: "/category/milk"
        },
        {
            image: "making.png",
            title: "סיכות מזווה",
            path: "/category/Pantry Staples"
        },
        {
            image: "sweet.png",
            title: "חטיפים",
            path: "/category/snacks"
        },
        {
            image: "wine.png",
            title:"משקאות",
            path: "/category/Beverage"
        }
    ];

    return (
        <div className="categories-container">
            <Row>
                {categories.map((category) => (
                    <Col xs={12} sm={6} md={4} key={category.title}>
                        <Category
                            image={category.image}
                            title={category.title}
                            path={category.path}
                        />
                    </Col>
                ))}
            </Row>
        </div>
    );
}

export default Categories;
