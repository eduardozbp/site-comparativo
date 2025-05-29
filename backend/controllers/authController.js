const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Missing fields' });

    const hashedPassword = await bcrypt.hash(password, 10);
    db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.status(201).json({ message: 'User created' });
    });
};

exports.login = (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err || results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
        const user = results[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, username: user.username }, 'secretKey', { expiresIn: '1h' });
        res.json({ token });
    });
};

exports.logout = (req, res) => {
    res.json({ message: 'Logout successful' });
};
