import { useState } from 'react';

const LastExitUsers = () => {
    const [users, setUsers] = useState([]);

    const handleFetchUsers = async () => {
        try {
            const response = await fetch('/api/last-exit-users', {
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setUsers(data.users);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
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
