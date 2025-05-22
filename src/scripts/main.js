// Spotify API
const SPOTIFY_CLIENT_ID = '75d7b61bcd6c478eae379ebb9f875eb8';
const SPOTIFY_API_BASE_URL = 'https://api.spotify.com/v1';
let accessToken = '';

// Function to get Spotify access token
async function getAccessToken() {
    const redirectUri = encodeURIComponent('https://<your-username>.github.io/<repository-name>/home.html'); // Replace with your GitHub Pages URL
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=token&redirect_uri=${redirectUri}&scope=user-read-private`;

    if (!window.location.hash.includes('access_token')) {
        window.location.href = authUrl;
    } else {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        accessToken = params.get('access_token');
    }
}

// Function to fetch and display 3 songs
async function displaySongs() {
    try {
        if (!accessToken) await getAccessToken();

        const response = await window.axios.get(`${SPOTIFY_API_BASE_URL}/browse/new-releases`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        const songs = response.data.albums.items.slice(0, 3); // Get the first 3 songs
        const songGrid = document.getElementById('selectSongs');

        songs.forEach(song => {
            const songElement = document.createElement('div');
            songElement.className = 'song';
            songElement.innerHTML = `
                <img src="${song.images[0].url}" alt="${song.name}" />
                <p>${song.name} by ${song.artists[0].name}</p>
            `;
            songElement.addEventListener('click', () => {
                alert(`You selected: ${song.name}`);
            });
            songGrid.appendChild(songElement);
        });
    } catch (error) {
        console.error('Error fetching songs:', error.message);
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

// Ensure displaySongs and displayUsername are called when the page loads
if (window.location.pathname.includes('home.html')) {
    window.onload = async () => {
        await getAccessToken();
        displayUsername();
        displaySongs();
    };
}
