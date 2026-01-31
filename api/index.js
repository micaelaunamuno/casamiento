const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
// Vercel handles the port, so we don't need app.listen() at the bottom for the lambda
// but we keep it compatible.

const DB_PATH = path.join('/tmp', 'db.json');

app.use(cors());
app.use(bodyParser.json());

// Initialize DB in /tmp since Vercel filesystem is read-only
const initializeDB = () => {
    if (!fs.existsSync(DB_PATH)) {
        // Try to seed from local db.json if it exists in the build, otherwise empty
        const seedPath = path.join(__dirname, '..', 'server', 'db.json');
        let initialData = { rsvps: [], leaderboard: [], wishes: [] };
        if (fs.existsSync(seedPath)) {
            try {
                initialData = JSON.parse(fs.readFileSync(seedPath));
            } catch (e) {
                console.error("Failed to read seed DB", e);
            }
        }
        fs.writeFileSync(DB_PATH, JSON.stringify(initialData));
    }
};

const getDB = () => {
    initializeDB();
    return JSON.parse(fs.readFileSync(DB_PATH));
};

const saveDB = (data) => {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

app.post('/api/rsvp', (req, res) => {
    const db = getDB();
    db.rsvps.push(req.body);
    saveDB(db);
    res.status(201).send({ message: 'RSVP saved' });
});

app.get('/api/rsvps', (req, res) => {
    const db = getDB();
    res.send(db.rsvps);
});

app.post('/api/quiz', (req, res) => {
    const db = getDB();
    db.leaderboard.push(req.body);
    db.leaderboard.sort((a, b) => b.score - a.score || a.timeElapsed - b.timeElapsed);
    db.leaderboard = db.leaderboard.slice(0, 10);
    saveDB(db);
    res.status(201).send(db.leaderboard);
});

app.get('/api/leaderboard', (req, res) => {
    const db = getDB();
    res.send(db.leaderboard);
});

app.post('/api/wish', (req, res) => {
    const db = getDB();
    if (!db.wishes) db.wishes = [];
    db.wishes.push(req.body);
    saveDB(db);
    res.status(201).send({ message: 'Wish saved' });
});

app.get('/api/wishes', (req, res) => {
    const db = getDB();
    res.send(db.wishes || []);
});

// Export the app for Vercel
module.exports = app;
