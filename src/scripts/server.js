require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
const port = process.env.PORT || 3001;

let accessToken = null;

//fetch token once at startup :: token lasts ~ 1 hour
async function getToken() {
  const auth = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64');

  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    new URLSearchParams({ grant_type: 'client_credentials' }).toString(),
    {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );

  accessToken = response.data.access_token;
  setTimeout(getToken, 3500 * 1000); // Refresh token every ~1 hour
}

app.get('/search', async (req, res) => {
  const q = req.query.q;
  console.log(`[SEARCH] Content Searched:: "${q}"`);
  if (!accessToken) return res.status(500).json({ error: 'Token not ready' });

  try {
    const response = await axios.get('https://api.spotify.com/v1/search', {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { q, type: 'track', limit: 20 }
    });
    res.json(response.data);
  } catch (err) {
    console.error('Spotify search failed:', err.response?.data || err.message);
    res.status(500).json({ error: 'Spotify search failed' });
  }
});

getToken(); // Get token at startup

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
