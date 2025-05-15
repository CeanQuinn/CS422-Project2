// api
const GENIUS_API_KEY = '_eIQErLcmOUQFt5Sk1it0zUUZdTq7V_J7Pqk2Mk6pAKIYBqx-ULsgJc1mJ4CfKZG'; // Replace with your Genius API key
const GENIUS_API_BASE_URL = 'http://localhost:3000/api'; // Use the proxy server URL

// Function to fetch and display 9 albums
async function displayAlbums() {
    try {
        const response = await window.axios.get(`${GENIUS_API_BASE_URL}/albums`);
        const albums = response.data.response.hits.slice(0, 9); // Get the first 9 albums
        const albumGrid = document.getElementById('selectAlbums');

        albums.forEach(album => {
            const albumData = album.result;
            const albumElement = document.createElement('div');
            albumElement.className = 'album';
            albumElement.innerHTML = `
                <img src="${albumData.song_art_image_thumbnail_url}" alt="${albumData.title}" />
                <p>${albumData.title}</p>
            `;
            albumElement.addEventListener('click', () => {
                alert(`You selected: ${albumData.title}`);
            });
            albumGrid.appendChild(albumElement);
        });
    } catch (error) {
        console.error('Error fetching albums:', error.message);
    }
}

function saveUsername(mode) {
    const username = document.getElementById('username').value.trim();
    if (username) {
        localStorage.setItem('username', username);
        localStorage.setItem('mode', mode);
        location.href = '../pages/home.html';
    } else {
        alert('Please enter a username.');
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

// Ensure displayAlbums and displayUsername are called when the page loads
if (window.location.pathname.includes('home.html')) {
    window.onload = () => {
        displayUsername();
        displayAlbums();
    };
}
