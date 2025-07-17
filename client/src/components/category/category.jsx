import React from "react";
import { Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Category.css";

const Category = (props) => {
    const { image, title, path } = props;

    return (
        <Link to={path} className="category-link">
            <div className="category-container">
                <Image className="category-image" src={`./images/categories/${image}`} alt={title} />
                <p className="category-title">{title}</p>
            </div>
        </Link>
    );
}

export default Category;
