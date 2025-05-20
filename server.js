require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose'); // mongoDB package

mongoose.connect('mongodb+srv://williamjurewitz12:TspwHaDKUxLRdyZ3@cluster0.f20x5gm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const albumSchema = new mongoose.Schema({ // schema for album storage, just use id and fetch the rest of the info on load
    albumId: {type: String, required: true, unique: true}
});
const Album = mongoose.model('Album', albumSchema); // model for album storage

// database connection to add new albums to the database via the albumID number
app.post('/api/albums', async (req, res) => {
   try{
        const { albumId } = req.body;
        if (!albumId) {
            return res.status(400).json({ error: 'Album ID is required' });
        }
        const album = await Album.findOneAndUpdate(
            { albumId },
            { albumId },
            { upsert: true, new: true }
        );
        res.status(201).json(album);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add album' });
   }
});

app.get('/api/albums/stored', async (req, res) => {
    try {
        const albums = await Album.find({});
        res.json(albums);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch albums' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
