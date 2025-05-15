require('dotenv').config();
const axios = require('axios');

// api
const GENIUS_API_KEY = process.env.GENIUS_API_KEY;
const GENIUS_API_BASE_URL = 'https://api.genius.com';

// search function
async function searchSong(query) {
    try {
        const response = await axios.get(`${GENIUS_API_BASE_URL}/search`, {
            headers: {
                Authorization: `Bearer ${GENIUS_API_KEY}`
            },
            params: {
                q: query
            }
        });

        // Log the search results
        console.log('Search Results:', response.data.response.hits);
    } catch (error) {
        console.error('Error searching for song:', error.response?.data || error.message);
    }
}

// Searching for bohemian rhapsody
searchSong('Bohemian Rhapsody');