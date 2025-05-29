const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const { scrapeGameData } = require('./playwright/scraper');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/api/game/:name', async (req, res) => {
    try {
        const data = await scrapeGameData(req.params.name);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Scraping failed' });
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
