const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 3000;

// SQLite3 setup
const db = new sqlite3.Database('hall.db');

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Routes
app.post('/api/logs', (req, res) => {
    const { UserID } = req.body;
    const entryTime = '2000-01-01 01:00:00'; // Entry time of January 1st, 2000, at 1 AM

    db.run('INSERT INTO logs (UserID, entryTime) VALUES (?, ?)', [UserID, entryTime], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'UserID and entry/exit Time logged successfully' });
    });
});

app.post('/api/check-user', (req, res) => {
    const { UserID } = req.body;

    // Check if user exists
    db.get('SELECT * FROM logs WHERE UserID = ? ORDER BY rowid DESC LIMIT 1', [UserID], (err, row) => {

    
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Database error' });
            return;
        }

        if (!row) {
            res.json({ message: 'User does not exist' });
            return;
        }

        const now = new Date();
        const entryTime = row.entryTime ? new Date(row.entryTime) : null;
        const exitTime = row.exitTime ? new Date(row.exitTime) : null;

        if (!exitTime) {
            // Last log was an entryTime
            if (now - entryTime < 3600000) { // Less than 1 hour
                res.json({ message: 'You just went to the bathroom!' });
            } else {
                // Insert new log entry
                db.run('INSERT OR IGNORE INTO logs (UserID, exitTime) VALUES (?, ?)', [UserID, now.toISOString()], (err) => {
                    if (err) {
                        console.error(err);
                        res.status(500).json({ error: 'Failed to log entryTime' });
                        return;
                    }
                    res.json({ message: 'Hurry Back!' });
                });
            }
        } else {
            // Last log was an exitTime
            // Insert new log entry
            db.run('INSERT OR IGNORE INTO logs (UserID, entryTime) VALUES (?, ?)', [UserID, now.toISOString()], (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: 'Failed to log entryTime' });
                    return;
                }
                res.json({ message: 'Welcome Back!' });
            });
        }
    });
});

app.get('/api/last-exit-users', (req, res) => {
    db.all('SELECT UserID FROM logs WHERE rowid IN (SELECT MAX(rowid) FROM logs GROUP BY UserID) AND exitTime IS NOT NULL', (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        console.log('Rows from database:', rows); // Log the rows returned from the database
        const users = rows.map(row => row.userID);
        console.log('Users:', users); // Log the extracted user IDs
        res.json({ users });
    });
});









// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
