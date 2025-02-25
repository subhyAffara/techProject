// controllers/playlistsController.js
import playlistModel from '../models/playlistsModel.js';
import { ObjectId } from 'mongodb'; // Import ObjectId if not already

const PlaylistController = {
    async getAllPlaylists(req, res) {
        console.log("getAllPlaylists controller initiated");
        try {
            const playlists = await playlistModel.getAllPlaylistsFromDB(); // Updated model function name
            console.log("Playlists received from model:", playlists.length);
            return res.json({ playlists });
        } catch (error) {
            console.error("Error in getAllplaylists controller", error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    async getPlaylistById(req, res) {
        try {
            const playlistId = req.params.playlistId;
            console.log("playlistsController.js - getPlaylistById - playlistId:", playlistId, typeof playlistId);

            if (!playlistId) {
                return res.status(400).json({ message: 'Playlist ID is required' });
            }

            const playlist = await playlistModel.getPlaylistByIdFromDB(playlistId); // Updated model function name

            if (!playlist) {
                return res.status(404).json({ message: 'Playlist not found' });
            }

            res.json(playlist);

        } catch (error) {
            console.error("Error in getPlaylistById controller:", error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    async getFavoriteTracks(req, res) {
        try {
            const userId = req.user.userId; // Access userId from req.user
            const tracks = await playlistModel.getFavoriteTracksFromDB(userId); // Updated model function name
            res.json(tracks);
        } catch (error) {
            console.error("Error in getFavoriteTracks controller:", error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    async createPlaylist(req, res) {
        try {
            const userId = req.user.userId;
            const playlistData = req.body;

            const playlistId = await playlistModel.createNewPlaylistInDB(userId, playlistData); // Updated model function name
            res.status(201).json({ playlistId }); // 201 Created status code

        } catch (error) {
            console.error("Error in controller createPlaylist:", error);

            if (error.message.includes("Failed to create new playlist")) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Server Error' });
            }
        }
    },
    async getUserPlaylistsWithTracks(req, res) {
        try {
            const userId = req.user.userId; // Access userId from req.user
            const playlists = await playlistModel.getUserPlaylistsWithTracksFromDB(userId); // Updated model function name
            res.json(playlists);
        } catch (error) {
            console.error("Error in getUserPlaylistsWithTracks controller:", error);
            res.status(500).json({ message: 'Server Error' });
        }
    },


    async addToPlaylist(req, res) {
        try {
            const { playlistId, trackId } = req.body;
            console.log("playlistsController.js - addToPlaylist - playlistId:", playlistId, typeof playlistId);
            console.log("playlistsController.js - addToPlaylist - trackId:", trackId, typeof trackId);


            const result = await playlistModel.addToPlaylistInDB(playlistId, trackId); // Updated model function name

            if (result === 0) {
                return res.status(404).json({ message: 'Playlist or track not found' });
            }

            res.status(200).json({ message: 'Track added to playlist' });
        } catch (error) {
            console.error("Error in addToPlaylist controller:", error);
            res.status(500).json({ message: 'Server error' });
        }
    },
    async deleteTrackFromPlaylist(req, res) {
        try {
            const { playlistId, trackId } = req.body;

            const result = await playlistModel.deleteTrackFromPlaylistInDB(playlistId, trackId); // Updated model function name

            if (result === 0) {
                return res.status(404).json({ message: 'Playlist or track not found' });
            }

            res.status(200).json({ message: 'Track deleted from playlist' });

        } catch (error) {
            console.error("Error in deleteTrackFromPlaylist controller:", error);
            res.status(500).json({ message: 'Server error' });
        }
    },
    async deletePlaylist(req, res) {
        try {
            const playlistId = req.params.playlistId;
            const userId = req.user.userId;


            const result = await playlistModel.deletePlaylistFromDB(userId, playlistId); // Updated model function name

            if (result === 0) {
                return res.status(404).json({ message: 'Playlist not found or not authorized to delete' });
            }
            res.status(200).json({ message: 'Playlist deleted successfully' });

        } catch (error) {
            res.status(500).json({ message: 'Server error while deleting playlist' });
        }
    },
    async getGeneralPlaylists(req, res) {
        console.log("getGeneralPlaylists controller initiated");
        try {
            const playlists = await playlistModel.getGeneralPlaylistsFromDB(); // Updated model function name
            return res.json({ playlists });
        } catch (error) {
            console.error("Error in getGeneralPlaylists controller", error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },


};

export default PlaylistController;