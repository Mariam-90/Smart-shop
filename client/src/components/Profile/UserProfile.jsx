import React from 'react';
import './UserProfile.css';

const UserProfile = ({ firstName, lastName, email, isTzunai, isAdmin }) => {
    const getUserRole = () => {
        if (isTzunai) return "תזונאי";
        if (isAdmin) return "מנהל";
        return "צרכן";
    };

    return (
        <div className="user-profile-container">
            <h2>פרטי המשתמש</h2>
            <p><strong>שם:</strong> {firstName} {lastName}</p>
            <p><strong>אימייל:</strong> {email}</p>
            <p><strong>תפקיד:</strong> {getUserRole()}</p>
        </div>
    );
};

export default UserProfile;
