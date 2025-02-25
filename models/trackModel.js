// models/tracksModel.js
import { getCollection } from '../config/db.js';
import { ObjectId } from 'mongodb';

const TracksModel = {
    async getTrackByIdFromDB(trackId) { // Updated function name with "FromDB" suffix, renamed parameter for clarity
        console.log("getTrackByIdFromDB model function - trackId:", trackId);
        try {
            const tracksCollection = await getCollection('tracks');
            const track = await tracksCollection.findOne({ _id: new ObjectId(trackId) });
            console.log("Track fetched by ID:", track ? track.title : 'Not found'); // Log if track is found or not
            return track;
        } catch (error) {
            console.error("Error in getTrackByIdFromDB model:", error); // More specific error log
            throw error;
        }
    },

    async getTrackByTitleFromDB(title, artist) { // Updated function name with "FromDB" suffix
        console.log("getTrackByTitleFromDB model function - title:", title, "artist:", artist);
        try {
            const tracksCollection = await getCollection('tracks');
            const track = await tracksCollection.findOne({
                $or: [
                    { title: { $regex: title, $options: 'i' } },
                    { artist: { $regex: artist, $options: 'i' } }
                ]
            });
            console.log("Track fetched by title/artist:", track ? track.title : 'Not found'); // Log if track is found or not
            return track;
        } catch (error) {
            console.error("Error in getTrackByTitleFromDB model:", error); // More specific error log
            throw error;
        }
    },
    async getAllTracksFromDB() { // Updated function name with "FromDB" suffix
        console.log("getAllTracksFromDB model function started");
        try {
            const tracksCollection = await getCollection('tracks');
            const allTracks = await tracksCollection.find({}).toArray(); // Fetch all documents from 'tracks' collection
            console.log("All tracks fetched from DB:", allTracks.length);
            return allTracks;
        } catch (error) {
            console.error("Error in getAllTracksFromDB model:", error); // More specific error log
            throw error;
        }
    },
};

export default TracksModel;