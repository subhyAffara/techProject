import { getCollection } from '../config/db.js';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose'

const playlistModel = {

    async getAllPlaylistsFromDB() { // Updated function name with "FromDB" suffix
        console.log("getAllPlaylistsFromDB model function started");
        try {
            const playlistsCollection = await getCollection('playlists');
            console.log("Got playlistsCollection");
            const playlists = await playlistsCollection.find().toArray();
            console.log("Playlists fetched from DB:", playlists.length);
            return playlists;
        } catch (error) {
            console.error("Error in getAllPlaylistsFromDB model:", error); // More specific error log
            throw error;
        }
    },


    // async getPlaylistByIdFromDB(playlistId) { // Updated function name with "FromDB" suffix
    //     console.log("getPlaylistByIdFromDB model function - playlistId:", playlistId);
    //     types.objectId.isvalid
    //     try {
    //         const playlistsCollection = await getCollection('playlists');
    //         let playlist;
    //         try {
    //             const objectId = new ObjectId(playlistId);
    //             playlist = await playlistsCollection.findOne({ _id: objectId });
    //             console.log("ObjectId after conversion:", objectId);
    //             console.log("MongoDB query result:", playlist);
    //         } catch (objectIdError) { // More specific error variable name
    //             console.error("ObjectId conversion error in getPlaylistByIdFromDB:", objectIdError);
    //             return null; // Return null if ObjectId conversion fails
    //         }
    //         return playlist;
    //     } catch (error) {
    //         console.error("Error in getPlaylistByIdFromDB model:", error); // More specific error log
    //         throw error;
    //     }
    // }


    async getPlaylistByIdFromDB(playlistId) {
        console.log("getPlaylistByIdFromDB model function - playlistId:", playlistId);

        // Validate ObjectId before using it
        if (!mongoose.Types.ObjectId.isValid(playlistId)) {
            console.error("Invalid ObjectId format:", playlistId);
            return null; // or throw an error
        }

        try {
            const playlistsCollection = await getCollection("playlists");
            const objectId = new mongoose.Types.ObjectId(playlistId);

            const playlist = await playlistsCollection.findOne({ _id: objectId });

            console.log("MongoDB query result:", playlist);
            return playlist;
        } catch (error) {
            console.error("Error in getPlaylistByIdFromDB:", error);
            throw error;
        }
    },

    async getFavoriteTracksFromDB(userId) { // Updated function name with "FromDB" suffix
        console.log("getFavoriteTracksFromDB model function - userId:", userId);
        try {
            const usersCollection = await getCollection('users');
            const tracksCollection = await getCollection('tracks'); // Get tracks collection

            const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

            if (!user || !user.favorites) {
                console.log("User not found or no favorites.");
                return [];
            }

            const favoriteTrackIds = user.favorites.map(trackId => new ObjectId(trackId));
            const tracks = await tracksCollection.find({ _id: { $in: favoriteTrackIds } }).toArray();
            console.log("Favorite tracks fetched:", tracks.length);
            return tracks;
        } catch (error) {
            console.error("Error in getFavoriteTracksFromDB model:", error); // More specific error log
            throw error;
        }
    },

    async createNewPlaylistInDB(userId, playlistData) { // Updated function name with "FromDB" suffix
        console.log("createNewPlaylistInDB model function - userId:", userId, "playlistData:", playlistData);
        try {
            const playlistsCollection = await getCollection('playlists');
            const usersCollection = await getCollection('users');

            const newPlaylistDocument = {
                ...playlistData,
                tracks: [],
                createdById: new ObjectId(userId)
            };

            const result = await playlistsCollection.insertOne(newPlaylistDocument);

            if (!result.insertedId) {
                const errorMessage = "Failed to create new playlist in playlists collection.";
                console.error("Error in createNewPlaylistInDB model:", errorMessage);
                throw new Error(errorMessage);
            }

            const playlistId = result.insertedId;

            const updateUserResult = await usersCollection.updateOne(
                { _id: new ObjectId(userId) },
                { $push: { playlists: playlistId } }
            );

            if (updateUserResult.modifiedCount === 0) {
                await playlistsCollection.deleteOne({ _id: playlistId });
                const errorMessage = "Failed to update user with new playlist. Playlist creation rolled back.";
                console.error("Error in createNewPlaylistInDB model:", errorMessage);
                throw new Error(errorMessage);
            }

            console.log("New playlist created successfully with ID:", playlistId.toString());
            return playlistId.toString();

        } catch (error) {
            console.error("Error in createNewPlaylistInDB model:", error); // More specific error log
            throw error;
        }
    },


    async addToPlaylistInDB(playlistId, trackId) { // Updated function name with "FromDB" suffix
        console.log("addToPlaylistInDB model function - playlistId:", playlistId, "trackId:", trackId);
        try {
            const playlistsCollection = await getCollection('playlists');

            const result = await playlistsCollection.updateOne(
                { _id: new ObjectId(playlistId) },
                { $push: { tracks: new ObjectId(trackId) } }
            );
            console.log("Track added to playlist. Modified count:", result.modifiedCount);
            return result.modifiedCount;
        } catch (error) {
            console.error("Error in addToPlaylistInDB model:", error); // More specific error log
            throw error;
        }
    },

    async deleteTrackFromPlaylistInDB(playlistId, trackId) { // Updated function name with "FromDB" suffix
        console.log("deleteTrackFromPlaylistInDB model function - playlistId:", playlistId, "trackId:", trackId);
        try {
            const playlistsCollection = await getCollection('playlists');
            const result = await playlistsCollection.updateOne(
                { _id: new ObjectId(playlistId) },
                { $pull: { tracks: new ObjectId(trackId) } }
            );
            console.log("Track deleted from playlist. Modified count:", result.modifiedCount);
            return result.modifiedCount;
        } catch (error) {
            console.error("Error in deleteTrackFromPlaylistInDB model:", error); // More specific error log
            throw error;
        }
    },

    async deletePlaylistFromDB(userId, playlistId) { // Updated function name with "FromDB" suffix
        console.log("deletePlaylistFromDB model function - userId:", userId, "playlistId:", playlistId);
        try {
            const playlistsCollection = await getCollection('playlists');
            const usersCollection = await getCollection('users');

            const deletePlaylistResult = await playlistsCollection.deleteOne({ _id: new ObjectId(playlistId) });

            if (deletePlaylistResult.deletedCount === 0) {
                const errorMessage = "Playlist not found in playlists collection.";
                console.error("Error in deletePlaylistFromDB model:", errorMessage);
                throw new Error(errorMessage);
            }

            const updateUserResult = await usersCollection.updateOne(
                { _id: new ObjectId(userId) },
                { $pull: { playlists: new ObjectId(playlistId) } }
            );

            console.log("Playlist deleted successfully. Deleted count:", deletePlaylistResult.deletedCount);
            return deletePlaylistResult.deletedCount;

        } catch (error) {
            console.error("Error in deletePlaylistFromDB model:", error); // More specific error log
            throw error;
        }
    },

    async getUserPlaylistsWithTracksFromDB(userId) { // Updated function name with "FromDB" suffix
        console.log("getUserPlaylistsWithTracksFromDB model function - userId:", userId);
        try {
            const usersCollection = await getCollection('users');
            const playlistsCollection = await getCollection('playlists');

            const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

            if (!user || !user.playlists) {
                console.log("User not found or no playlists.");
                return [];
            }

            const playlistIds = user.playlists.map(playlistId => new ObjectId(playlistId));

            const userPlaylists = await playlistsCollection.find({
                _id: { $in: playlistIds }
            }).toArray();


            return userPlaylists.map(playlist => ({
                _id: playlist._id.toString(),
                ...playlist,
            }));

        } catch (error) {
            console.error("Error in getUserPlaylistsWithTracksFromDB model:", error); // More specific error log
            throw error;
        }
    },
    async getGeneralPlaylistsFromDB() { // Updated function name with "FromDB" suffix
        console.log("getGeneralPlaylistsFromDB model function called");

        try {
            const playlistsCollection = await getCollection('playlists');

            const generalPlaylists = await playlistsCollection.find({ category: "General" }).toArray();
            console.log("General playlists fetched:", generalPlaylists.length);
            return generalPlaylists;
        } catch (error) {
            console.error("Error in getGeneralPlaylistsFromDB model:", error); // More specific error log
            throw error;
        }
    },
};

export default playlistModel;