// server.js

import express from 'express';
import * as sqlite from 'sqlite';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = 3000;

const initializeServer = async () => {
  // SQLite setup
  const db = await sqlite.open({
    filename: 'hall.db',
    driver: sqlite3.Database
  });

  // Middleware
  app.use(express.json());
  app.use(cors()); // Enable CORS for all routes
  app.use(helmet()); // Enhance app security with Helmet
  app.use(cookieParser()); // Parse cookies from request headers

  // Global error handler
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
  });

  // Routes
  app.post('/api/logs', async (req, res) => {
    const { UserID } = req.body;
    const entryTime = '2000-01-01 01:00:00'; // Entry time of January 1st, 2000, at 1 AM

    await db.run('INSERT INTO logs (UserID, entryTime) VALUES (?, ?)', [UserID, entryTime]);
    res.json({ message: 'UserID and entry/exit Time logged successfully' });
  });

  app.post('/api/check-user', async (req, res) => {
    const { UserID } = req.body;

    const row = await db.get('SELECT * FROM logs WHERE UserID = ? ORDER BY rowid DESC LIMIT 1', [UserID]);

    if (!row) {
      return res.json({ message: 'User does not exist' });
    }

    const now = new Date();
    const entryTime = row.entryTime ? new Date(row.entryTime) : null;
    const exitTime = row.exitTime ? new Date(row.exitTime) : null;

    if (!exitTime) {
      if (now - entryTime < 3600000) {
        return res.json({ message: 'You just went to the bathroom!' });
      } else {
        await db.run('INSERT OR IGNORE INTO logs (UserID, exitTime) VALUES (?, ?)', [UserID, now.toISOString()]);
        return res.json({ message: 'Hurry Back!' });
      }
    } else {
      await db.run('INSERT OR IGNORE INTO logs (UserID, entryTime) VALUES (?, ?)', [UserID, now.toISOString()]);
      return res.json({ message: 'Welcome Back!' });
    }
  });

  app.get('/api/last-exit-users', async (req, res) => {
    const rows = await db.all('SELECT userID FROM logs WHERE rowid IN (SELECT MAX(rowid) FROM logs GROUP BY UserID) AND exitTime IS NOT NULL');
    const users = rows.map(row => row.userID);
    res.json({ users });
  });

  // Start server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

initializeServer();
