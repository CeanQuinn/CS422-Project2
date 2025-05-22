require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

app.get('/api/albums', async (req, res) => {
    try {
        const response = await axios.get('https://api.genius.com/search', {
            headers: {
                Authorization: `Bearer ${process.env.GENIUS_API_KEY}`
            },
            params: {
                q: 'album'
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching albums:', error.message);
        res.status(500).json({ error: 'Failed to fetch albums' });
    }
});

app.get('/api/songs', async (req, res) => {
    try {
        const response = await axios.get('https://api.spotify.com/v1/tracks', {
            headers: {
                Authorization: `Bearer ${process.env.SPOTIFY_API_KEY}`
            },
            params: {
                ids: '3n3Ppam7vgaVa1iaRUc9Lp,7ouMYWpwJ422jRcDASZB7P,1dNIEtp7AY3oDAKCGg2XkH' // Example song IDs
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching songs:', error.message);
        res.status(500).json({ error: 'Failed to fetch songs' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
