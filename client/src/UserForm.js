import React, { useState } from 'react';
import axios from 'axios';

const UserForm = () => {
    const [userID, setUserID] = useState('');

    const handleFormSubmit = (event) => {
        event.preventDefault();
        axios.post('/api/logs', { UserID: userID })
            .then(response => {
                console.log(response.data.message);
                setUserID(''); // Clear the input field after submission
            })
            .catch(error => {
                console.error(error);
            });
    };

    return (
        <div>
            <h2>Create User</h2>
            <form onSubmit={handleFormSubmit}>
                <label>
                    UserID:
                    <input
                        type="text"
                        value={userID}
                        onChange={(e) => setUserID(e.target.value)}
                    />
                </label>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default UserForm;
