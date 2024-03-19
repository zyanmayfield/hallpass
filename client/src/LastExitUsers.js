import React, { useState } from 'react';
import axios from 'axios';

const LastExitUsers = () => {
    const [users, setUsers] = useState([]);

    const handleFetchUsers = () => {
        axios.get('/api/last-exit-users')
            .then(response => {
                setUsers(response.data.users);
            })
            .catch(error => {
                console.error(error);
            });
    };

    return (
        <div>
            <button onClick={handleFetchUsers}>Fetch Users</button>
            <ul>
                {users.map(user => (
                    <li key={user}>{user}</li>
                ))}
            </ul>
        </div>
    );
};

export default LastExitUsers;
