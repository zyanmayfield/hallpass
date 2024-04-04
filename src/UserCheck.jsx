import { useState } from 'react';

const UserCheck = () => {
    const [userID, setUserID] = useState('');
    const [message, setMessage] = useState('');

    const handleCheck = async () => {
        try {
            const response = await fetch('/api/check-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ UserID: userID }),
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setMessage(data.message);
        } catch (error) {
            console.error('Error checking user:', error);
        }
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
