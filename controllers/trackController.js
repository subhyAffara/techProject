// controllers/tracksController.js
import TracksModel from '../models/trackModel.js';

const TracksController = {
    async getTrackById(req, res) {
        try {
            // Correctly access trackId from URL parameters using req.params.trackId
            const track = await TracksModel.getTrackById(req.params.trackId);
            if (!track) {
                return res.status(404).json({ message: 'Track not found' });
            }
            res.json(track);
        } catch (error) {
            console.error("Error in getTrackById controller:", error);
            res.status(500).json({ message: 'Server error' });
        }
    },
    async getTrackByTitle(req, res) {
        try {
            const { title, artist } = req.query; // Get title and artist from query parameters
            const track = await TracksModel.getTrackByTitle(title, artist);
            if (!track) {
                return res.status(404).json({ message: 'Track not found' });
            }
            res.json(track);
        } catch (error) {
            console.error("Error in getTrackByTitle controller:", error);
            res.status(500).json({ message: 'Server error' });
        }
    },
    async getAllTracks(req, res) {
        try {
            const tracks = await TracksModel.getAllTracks();
            res.status(200).json(tracks);
        } catch (error) {
            console.error("Error in getAllTracks controller:", error);
            res.status(500).json({ message: "Failed to fetch all tracks", error: error.message });
        }
    },
};

export default TracksController;