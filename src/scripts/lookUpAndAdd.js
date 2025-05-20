require('dotenv').config();
const axios = require('axios');

// Replace with your Genius API access token
const GENIUS_API_KEY = '_eIQErLcmOUQFt5Sk1it0zUUZdTq7V_J7Pqk2Mk6pAKIYBqx-ULsgJc1mJ4CfKZG';


// Replace with your backend server URL
const BACKEND_URL = 'http://localhost:3000/api/albums';

// Function to search Genius for an album by name
async function searchAndAddAlbum(albumName) {
    try {
        // Search Genius API for the album
        const response = await axios.get('https://api.genius.com/search', {
            params: { q: albumName },
            headers: { Authorization: `Bearer ${GENIUS_API_KEY}` }
        });

        // Find the first album result (Genius search returns songs, so you may need to filter)
        const hits = response.data.response.hits;
        if (hits.length === 0) {
            console.log('No results found.');
            return;
        }

        // For demo, just use the first result's album (if available)
        const song = hits[0].result;
        const album = song.album;
        if (!album) {
            console.log('No album found for this song. Here is the song result:');
            console.log(JSON.stringify(song, null, 2)); // Pretty-print the song object
            return;
        }

        // Add the album ID to your database
        const addRes = await axios.post(BACKEND_URL, { albumId: album.id.toString() });
        console.log('Album added:', addRes.data);
    } catch (err) {
        console.error('Error:', err.response ? err.response.data : err.message);
    }
}

searchAndAddAlbum('Mirage City King Gizzard & The Lizard Wizard'); // Example album name

