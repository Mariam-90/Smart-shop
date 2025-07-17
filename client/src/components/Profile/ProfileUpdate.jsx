
import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import axios from 'axios';
import "./ProfileUpdate.css";

function ProfileUpdate() {
    const [data, setData] = useState({});
    const [user, setUser] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [isTzunai, setTzunai] = useState(false);
    const [isAdmin, setAdmin] = useState(false);
    const [location, setLocation] = useState({ lat: '', lng: '' });
    const [profilePicture, setProfilePicture] = useState(null);
    const [articleSuccess, setArticleSuccess] = useState(false);
    const [recipeSuccess, setRecipeSuccess] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        const userEmail = localStorage.getItem('email');
        fetchUser(userEmail);
    }, []);

    const fetchUser = async (userEmail) => {
        const urlEncodedEmail = encodeURIComponent(userEmail);
        try {
            const response = await axios.get(`http://localhost:3000/api/user/email/${urlEncodedEmail}`);
            setUser(response.data);
            setFirstName(response.data.firstName);
            setLastName(response.data.lastName);
            setEmail(response.data.email);
            setTzunai(response.data.isTzunai);
            setAdmin(response.data.isAdmin);
            setLocation(response.data.location);
            setProfilePicture(response.data.profilePictureUrl);
        } catch (error) {
            console.log('fetchUser: ', error);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('email', email);
        formData.append('location', JSON.stringify(location));
        if (e.target.profilePicture.files[0]) {
            formData.append('profilePicture', e.target.profilePicture.files[0]);
        }
        try {
            const url = `http://localhost:3000/api/user/update/${user._id}`;
            const { data: res } = await axios.put(url, formData);
            setUpdateSuccess(true);
            setProfilePicture(res.profilePictureUrl);
        } catch (error) {
            setError(true);
        }
    };

    return (
        <>
            <div className="profile-wrapper">
                <div className="card_container">
                    <div className="card p-4 shadow-sm">
                        <h2 className="mb-4">פרופיל</h2>
                        <div className="profile-picture mb-3">
                            {profilePicture && <img src={`http://localhost:3000${profilePicture}`} alt="Profile" className="img-thumbnail profile-img" />}
                        </div>
                        <Form onSubmit={handleProfileUpdate}>
                            <Form.Group className="mb-3">
                                <Form.Label>שם פרטי</Form.Label>
                                <Form.Control type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>שם משפחה</Form.Label>
                                <Form.Control type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>אימייל</Form.Label>
                                <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>מיקום (קו רוחב ואורך)</Form.Label>
                                <Form.Control type="text" value={location.lat} onChange={(e) => setLocation({ ...location, lat: e.target.value })} />
                                <Form.Control type="text" value={location.lng} onChange={(e) => setLocation({ ...location, lng: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>תמונת פרופיל</Form.Label>
                                <Form.Control type="file" name="profilePicture" accept="image/*" />
                            </Form.Group>
                            <Button variant="primary" type="submit">עדכן פרטים</Button>
                        </Form>
                        {updateSuccess && <Alert variant="success" className="mt-3">הפרטים עודכנו בהצלחה.</Alert>}
                        {error && <Alert variant="danger" className="mt-3">אירעה שגיאה בעדכון הפרטים.</Alert>}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfileUpdate;
