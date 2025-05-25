(() => {
    console.log('Script loaded and executed.'); // Debug log to confirm script execution

    // Spotify API configuration constants
    const SPOTIFY_CLIENT_ID = '75d7b61bcd6c478eae379ebb9f875eb8'; // Do not edit this unless the client ID changes
    const SPOTIFY_API_BASE_URL = 'https://api.spotify.com/v1'; // Base URL for Spotify API
    const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token'; // URL to get access tokens
    const REDIRECT_URI = 'https://ceanquinn.github.io/CS422-Project2/'; // Redirect URI for Spotify authorization
    let accessToken = ''; // Variable to store the access token

    // Function to get Spotify access token
    async function getAccessToken() {
        console.log('Checking for existing access token...');
        const authUrl = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=user-read-private`;

        if (!window.location.search.includes('code')) {
            console.log('Redirecting to Spotify authorization...');
            window.location.href = authUrl; // Redirects user to Spotify login page
        } else {
            const params = new URLSearchParams(window.location.search);
            const code = params.get('code'); // Extract authorization code from URL
            console.log('Authorization code found:', code);

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

                accessToken = response.data.access_token; // Store the access token
                console.log('Access token retrieved:', accessToken);
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
                await getAccessToken(); // Ensure access token is available
            }

            console.log('Fetching data from Spotify API...');
            const response = await window.axios.get(`${SPOTIFY_API_BASE_URL}/browse/new-releases`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            console.log('Spotify API response:', response.data);

            const song = response.data.albums.items[0]; // Get the first song from new releases
            if (song) {
                const songInfo = `Song Name: ${song.name}, Artist: ${song.artists[0]?.name || 'Unknown Artist'}`;
                console.log(songInfo); // Log song information
            } else {
                console.log('No songs found.');
            }
        } catch (error) {
            console.error('Error fetching data from Spotify API:', error.message);
        }
    }

    // Function to search Spotify
    async function searchSpotify(query) {
        try {
            if (!accessToken) {
                console.log('Access token not found, retrieving...');
                await getAccessToken(); // Ensure access token is available
            }

            console.log(`Searching Spotify for: ${query}`);
            const response = await window.axios.get(`${SPOTIFY_API_BASE_URL}/search`, {
                headers: { Authorization: `Bearer ${accessToken}` },
                params: { q: query, type: 'track', limit: 10 }, // Search for tracks with the query
            });
            console.log('Spotify search response:', response.data);

            const tracks = response.data.tracks.items; // Extract tracks from response
            const resultsContainer = document.getElementById('results-container');
            resultsContainer.innerHTML = ''; // Clear previous results

            if (tracks.length > 0) {
                tracks.forEach(track => {
                    const trackElement = document.createElement('div');
                    trackElement.textContent = `Track: ${track.name}, Artist: ${track.artists[0]?.name || 'Unknown Artist'}`;
                    trackElement.style.marginBottom = '10px';
                    trackElement.style.padding = '10px';
                    trackElement.style.border = '1px solid #ccc';
                    trackElement.style.backgroundColor = '#f1f1f1';
                    resultsContainer.appendChild(trackElement); // Append each track to the container
                });
            } else {
                resultsContainer.textContent = 'No tracks found.';
            }
        } catch (error) {
            console.error('Error searching Spotify:', error.message);
        }
    }

    // Add event listener to search button
    document.addEventListener('DOMContentLoaded', () => {
        const searchButton = document.getElementById('search-button');
        const searchInput = document.getElementById('search-input');

        const resultsContainer = document.createElement('div');
        resultsContainer.id = 'results-container';
        resultsContainer.style.marginTop = '20px';
        document.body.appendChild(resultsContainer);

        if (searchButton && searchInput) {
            searchButton.addEventListener('click', () => {
                const query = searchInput.value.trim();
                if (query) {
                    searchSpotify(query); // Trigger Spotify search
                } else {
                    console.log('Please enter a search term.');
                }
            });
        } else {
            console.error('Search input or button not found in the DOM.');
        }
        const sliders = [
        { id: 'speechiness', min: 0, max: 1, step: 0.01 },
        { id: 'tempo', min: 50, max: 200, step: 1 },
        { id: 'energy', min: 0, max: 1, step: 0.01 },
        { id: 'danceability', min: 0, max: 1, step: 0.01 }
        ];
        sliders.forEach(slider => {
            const input = document.getElementById(`${slider.id}-slider`);
            const value = document.getElementById(`${slider.id}-value`);
            if (input && value) {
                input.addEventListener('input', () => {
                    value.textContent = input.value;
                });
            }
        });
    });

    // Ensure necessary functions are called when the page loads
    window.onload = async () => {
        console.log('Window onload triggered.'); // Debug log to confirm window.onload execution
        try {
            await getAccessToken(); // Retrieve access token on page load
            console.log('Access token retrieved successfully.');
            await logSpotifyStatement(); // Log a statement from Spotify API
        } catch (error) {
            console.error('Error during page load:', error.message);
        }
    };

    // Placeholder for future functionality
    // TODO: Add a function here to fetch and display a song's audio features using the Spotify API.
    // Use the endpoint: `${SPOTIFY_API_BASE_URL}/audio-features/{id}`
    // Replace `{id}` with the track ID obtained from the search results.

    console.log('Script setup complete.'); // Debug log to confirm script setup
})();
