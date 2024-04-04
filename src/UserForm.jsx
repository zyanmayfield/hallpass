import { useState } from 'react';

const UserForm = () => {
    const [userID, setUserID] = useState('');

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('/api/logs', {
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
            console.log(data.message);
            setUserID(''); // Clear the input field after submission
        } catch (error) {
            console.error('Error creating user:', error);
        }
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
