import React from 'react';
import UserForm from './UserForm'; // Assuming UserForm.js is in the same directory as App.js
import UserCheck from './UserCheck';
import LastExitUsers from './LastExitUsers';

const App = () => {
    return (
        <div>
            <h1>My App</h1>
            <UserForm />
            <UserCheck />
            <LastExitUsers />

        </div>
    );
};

export default App;
