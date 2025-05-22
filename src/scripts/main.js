// Spotify API
const SPOTIFY_CLIENT_ID = '75d7b61bcd6c478eae379ebb9f875eb8';
const SPOTIFY_API_BASE_URL = 'https://api.spotify.com/v1';
let accessToken = '';

// Function to get Spotify access token
async function getAccessToken() {
    const redirectUri = encodeURIComponent('https://ceanquinn.github.io/CS422-Project2/'); // Replace with your GitHub Pages URL
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=token&redirect_uri=${redirectUri}&scope=user-read-private`;

    if (!window.location.hash.includes('access_token')) {
        window.location.href = authUrl;
    } else {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        accessToken = params.get('access_token');
    }
}

// Function to display the username in home.html
function displayUsername() {
    const username = localStorage.getItem('username');
    if (username) {
        const usernameDisplay = document.getElementById('username-display');
        if (usernameDisplay) {
            usernameDisplay.textContent = `Logged in as: ${username}`;
        }
    }
}

// Function to fetch and log 1 song
async function logSongInfo() {
    try {
        if (!accessToken) await getAccessToken();

        const response = await window.axios.get(`${SPOTIFY_API_BASE_URL}/browse/new-releases`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        const song = response.data.albums.items[0]; // Get the first song

        if (song) {
            console.log(`Song Name: ${song.name}`);
            console.log(`Artist: ${song.artists[0]?.name || 'Unknown Artist'}`);
            console.log(`Album Image URL: ${song.images[0]?.url || 'No Image Available'}`);
        } else {
            console.log('No songs found.');
        }
    } catch (error) {
        console.error('Error fetching song info:', error.message);
    }
}

// Ensure necessary functions are called when the page loads
if (window.location.pathname.includes('index.html')) {
    window.onload = async () => {
        await getAccessToken();
        logSongInfo(); // Log song info to the terminal
    };
}
