(() => {
    console.log('Script loaded and executed.'); // Debug log to confirm script execution

    const SPOTIFY_CLIENT_ID = '75d7b61bcd6c478eae379ebb9f875eb8';
    const SPOTIFY_API_BASE_URL = 'https://api.spotify.com/v1';
    const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
    const REDIRECT_URI = 'https://ceanquinn.github.io/CS422-Project2/';
    let accessToken = '';

    // Utility function to update the log container
    function updateLogContainer(message) {
        const logContainer = document.getElementById('log-container');
        if (logContainer) {
            logContainer.textContent = message;
        } else {
            console.error('log-container element not found in the DOM.');
        }
    }

    // Function to get Spotify access token
    async function getAccessToken() {
        console.log('Checking for existing access token...');
        updateLogContainer('Checking for existing access token...');
        const authUrl = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=user-read-private`;

        if (!window.location.search.includes('code')) {
            console.log('Redirecting to Spotify authorization...');
            updateLogContainer('Redirecting to Spotify authorization...');
            window.location.href = authUrl;
        } else {
            const params = new URLSearchParams(window.location.search);
            const code = params.get('code');
            console.log('Authorization code found:', code);
            updateLogContainer('Authorization code found. Exchanging for access token...');

            try {
                const response = await window.axios.post(SPOTIFY_TOKEN_URL, null, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Authorization: `Basic ${btoa(SPOTIFY_CLIENT_ID + ':' + 'd99fa9fbc7d84892bb22151ab385fbfc')}`, // Replace with your client secret
                    },
                    params: {
                        grant_type: 'authorization_code',
                        code,
                        redirect_uri: REDIRECT_URI,
                    },
                });

                accessToken = response.data.access_token;
                console.log('Access token retrieved:', accessToken);
                updateLogContainer('Access token retrieved successfully.');
            } catch (error) {
                console.error('Error exchanging authorization code for access token:', error.message);
                updateLogContainer('Error retrieving access token.');
            }
        }
    }

    // Function to fetch and display a statement from Spotify API
    async function logSpotifyStatement() {
        try {
            if (!accessToken) {
                console.log('Access token not found, retrieving...');
                updateLogContainer('Access token not found, retrieving...');
                await getAccessToken();
            }

            console.log('Fetching data from Spotify API...');
            updateLogContainer('Fetching data from Spotify API...');
            const response = await window.axios.get(`${SPOTIFY_API_BASE_URL}/browse/new-releases`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            console.log('Spotify API response:', response.data);

            const song = response.data.albums.items[0];
            if (song) {
                const songInfo = `Song Name: ${song.name}, Artist: ${song.artists[0]?.name || 'Unknown Artist'}`;
                console.log(songInfo);
                updateLogContainer(songInfo);
            } else {
                console.log('No songs found.');
                updateLogContainer('No songs found.');
            }
        } catch (error) {
            console.error('Error fetching data from Spotify API:', error.message);
            updateLogContainer('Error fetching song information.');
        }
    }

    // Function to search Spotify
    async function searchSpotify(query) {
        try {
            if (!accessToken) {
                console.log('Access token not found, retrieving...');
                updateLogContainer('Access token not found, retrieving...');
                await getAccessToken();
            }

            console.log(`Searching Spotify for: ${query}`);
            updateLogContainer(`Searching Spotify for: ${query}`);
            const response = await window.axios.get(`${SPOTIFY_API_BASE_URL}/search`, {
                headers: { Authorization: `Bearer ${accessToken}` },
                params: { q: query, type: 'track', limit: 10 },
            });
            console.log('Spotify search response:', response.data);

            const tracks = response.data.tracks.items;
            if (tracks.length > 0) {
                const trackInfo = tracks.map(track => `Track: ${track.name}, Artist: ${track.artists[0]?.name || 'Unknown Artist'}`).join('\n');
                console.log(trackInfo);
                updateLogContainer(trackInfo.replace(/\n/g, '<br>'));
            } else {
                console.log('No tracks found.');
                updateLogContainer('No tracks found.');
            }
        } catch (error) {
            console.error('Error searching Spotify:', error.message);
            updateLogContainer('Error searching Spotify.');
        }
    }

    // Add event listener to search button
    document.addEventListener('DOMContentLoaded', () => {
        const searchButton = document.getElementById('search-button');
        const searchInput = document.getElementById('search-input');

        if (searchButton && searchInput) {
            searchButton.addEventListener('click', () => {
                const query = searchInput.value.trim();
                if (query) {
                    searchSpotify(query);
                } else {
                    updateLogContainer('Please enter a search term.');
                }
            });
        } else {
            console.error('Search input or button not found in the DOM.');
        }
    });

    // Ensure necessary functions are called when the page loads
    window.onload = async () => {
        console.log('Window onload triggered.'); // Debug log to confirm window.onload execution
        updateLogContainer('Initializing Spotify API...');
        try {
            await getAccessToken();
            console.log('Access token retrieved successfully.');
            await logSpotifyStatement();
        } catch (error) {
            console.error('Error during page load:', error.message);
            updateLogContainer('Error during page load.');
        }
    };

    console.log('Script setup complete.'); // Debug log to confirm script setup
})();
