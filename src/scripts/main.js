(() => {
    console.log('Script loaded and executed.'); // Debug log to confirm script execution

    const SPOTIFY_CLIENT_ID = '75d7b61bcd6c478eae379ebb9f875eb8';
    const SPOTIFY_API_BASE_URL = 'https://api.spotify.com/v1';
    const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
    const REDIRECT_URI = 'https://ceanquinn.github.io/CS422-Project2/';
    let accessToken = '';

    // Function to get Spotify access token
    async function getAccessToken() {
        console.log('Checking for existing access token...');
        const authUrl = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=user-read-private`;

        if (!window.location.search.includes('code')) {
            console.log('Redirecting to Spotify authorization...');
            window.location.href = authUrl;
        } else {
            const params = new URLSearchParams(window.location.search);
            const code = params.get('code');
            console.log('Authorization code found:', code);

            try {
                console.log('Exchanging authorization code for access token...');
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

                // Remove the code parameter from the URL
                const newUrl = window.location.origin + window.location.pathname;
                window.history.replaceState({}, document.title, newUrl);
                console.log('Authorization code removed from URL.');
            } catch (error) {
                console.error('Error exchanging authorization code for access token:', error.message);
            }
        }
    }

    // Function to fetch and display a statement from Spotify API
    async function logSpotifyStatement() {
        try {
            if (!accessToken) {
                console.log('Access token not found, retrieving...');
                await getAccessToken();
            }

            console.log('Fetching data from Spotify API...');
            const response = await window.axios.get(`${SPOTIFY_API_BASE_URL}/browse/new-releases`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            console.log('Spotify API response:', response.data);

            const song = response.data.albums.items[0];
            const logContainer = document.getElementById('log-container');

            if (song) {
                const songInfo = `Spotify API is working: Song Name: ${song.name}, Artist: ${song.artists[0]?.name || 'Unknown Artist'}`;
                console.log(songInfo);

                if (logContainer) {
                    logContainer.textContent = songInfo;
                } else {
                    console.error('log-container element not found in the DOM.');
                }
            } else {
                console.log('No songs found.');
                if (logContainer) {
                    logContainer.textContent = 'No songs found.';
                }
            }
        } catch (error) {
            console.error('Error fetching data from Spotify API:', error.message);
            const logContainer = document.getElementById('log-container');
            if (logContainer) {
                logContainer.textContent = 'Error fetching song information.';
            }
        }
    }

    // Ensure necessary functions are called when the page loads
    window.onload = async () => {
        console.log('Window onload triggered.'); // Debug log to confirm window.onload execution
        try {
            console.log('Initializing Spotify API...');
            await getAccessToken();
            console.log('Access token retrieved successfully.');
            await logSpotifyStatement();
        } catch (error) {
            console.error('Error during page load:', error.message);
        }
    };

    console.log('Script setup complete.'); // Debug log to confirm script setup
})();
