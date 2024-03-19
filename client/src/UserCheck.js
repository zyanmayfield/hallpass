import React, { useState } from 'react';
import axios from 'axios';

const UserCheck = () => {
    const [userID, setUserID] = useState('');
    const [message, setMessage] = useState('');

    const handleCheck = () => {
        axios.post('/api/check-user', { UserID: userID })
            .then(response => {
                setMessage(response.data.message);
            })
            .catch(error => {
                console.error(error);
            });
    };

    return (
        <div>
            <input
                type="text"
                value={userID}
                onChange={(e) => setUserID(e.target.value)}
            />
            <button onClick={handleCheck}>Check User</button>
            <p>{message}</p>
        </div>
    );
};

export default UserCheck;
