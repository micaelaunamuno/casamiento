const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5001;
const DB_PATH = path.join(__dirname, 'db.json');

app.use(cors());
app.use(bodyParser.json());

// Initialize DB if not exists
if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ rsvps: [], leaderboard: [], wishes: [] }));
}

const getDB = () => JSON.parse(fs.readFileSync(DB_PATH));
const saveDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

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
    // Sort by score (points) desc, then by timeElapsed (asc) just in case
    db.leaderboard.sort((a, b) => b.score - a.score || a.timeElapsed - b.timeElapsed);
    db.leaderboard = db.leaderboard.slice(0, 10); // Keep top 10
    saveDB(db);
    res.status(201).send(db.leaderboard);
});

app.get('/api/leaderboard', (req, res) => {
    const db = getDB();
    res.send(db.leaderboard);
});

app.post('/api/wish', (req, res) => {
    const db = getDB();
    db.wishes.push(req.body);
    saveDB(db);
    res.status(201).send({ message: 'Wish saved' });
});

app.get('/api/wishes', (req, res) => {
    const db = getDB();
    res.send(db.wishes);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
