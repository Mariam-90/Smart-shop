import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import './TzunaiManagement.css';

const TzunaiManagement = ({ firstName, lastName }) => {
    const [articleSuccess, setArticleSuccess] = useState(false);
    const [recipeSuccess, setRecipeSuccess] = useState(false);

    const handleArticleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.append('tzunaiName', `${firstName} ${lastName}`);
        try {
            const url = 'http://localhost:3000/api/article/add';
            await axios.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setArticleSuccess(true);
            e.target.reset();
        } catch (error) {
            console.error('Error submitting article:', error);
        }
    };

    const handleRecipeSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.append('tzunaiName', `${firstName} ${lastName}`);
        try {
            const url = 'http://localhost:3000/api/recipe/add';
            await axios.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setRecipeSuccess(true);
            e.target.reset();
        } catch (error) {
            console.error('Error submitting recipe:', error);
        }
    };

    return (
        <div className="tzunai-management-container">
            <h1>ניהול תזונאי</h1>
            <Form onSubmit={handleArticleSubmit} className="article-form">
                <h2>הוספת כתבה</h2>
                <Form.Group className="mb-3">
                    <Form.Label>שם הכתבה</Form.Label>
                    <Form.Control required name="title" type="text" placeholder="שם הכתבה" />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>הכתבה</Form.Label>
                    <Form.Control required name="text" as="textarea" rows={3} placeholder="משהו מעניין על אוכל!" />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>תמונה</Form.Label>
                    <Form.Control name="image" type="file" accept="image/*" />
                </Form.Group>
                <Button variant="primary" type="submit">שלח</Button>
            </Form>
            {articleSuccess && <Alert variant="success">הכתבה נשלחה בהצלחה.</Alert>}

            <Form onSubmit={handleRecipeSubmit} className="recipe-form">
                <h2>הוספת מתכון</h2>
                <Form.Group className="mb-3">
                    <Form.Label>שם המתכון</Form.Label>
                    <Form.Control required name="title" type="text" placeholder="שם המתכון" />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>מצרכים</Form.Label>
                    <Form.Control required name="products" as="textarea" rows={3} placeholder="5 מלפפונים, 2 גמבות..." />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>המתכון</Form.Label>
                    <Form.Control required name="text" as="textarea" rows={3} placeholder="מערבבים הכל יחד ויוצא!..." />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>תמונה</Form.Label>
                    <Form.Control name="image" type="file" accept="image/*" />
                </Form.Group>
                <Button variant="primary" type="submit">שלח</Button>
            </Form>
            {recipeSuccess && <Alert variant="success">המתכון נשלח בהצלחה.</Alert>}
        </div>
    );
};

export default TzunaiManagement;
