import React from 'react';
import { useParams } from 'react-router-dom';
import Login from "../Login";
import Categories from "../category/categories";
import CategoryPage from "../category/CategoryPage";

const Sidebar = () => {
    const isLoggedIn = localStorage.getItem('token');
    const { name } = useParams();

    return (
        <>
            {!isLoggedIn && <Login />}
            <Categories />
            {name && <CategoryPage />}
        </>
    );
};

export default Sidebar;
