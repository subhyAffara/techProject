// dbUtils.js
import { getCollection } from './config/db.js'; // Adjust path if necessary

async function fixPlaylistsFieldType() {
    try {
        const usersCollection = await getCollection('users');
        if (!usersCollection) {
            console.error("Could not get users collection. Aborting fixPlaylistsFieldType.");
            return;
        }

        const result = await usersCollection.updateMany(
            {}, // Empty query to select all documents in the 'users' collection
            [
                {
                    $addFields: {
                        playlistsArray: { $objectToArray: "$playlists" }
                    }
                },
                {
                    $addFields: {
                        playlistsArray: {
                            $map: {
                                input: "$playlistsArray",
                                as: "pair",
                                in: "$$pair.v"
                            }
                        }
                    }
                },
                {
                    $unset: "playlists"
                },
                {
                    $rename: { "playlistsArray": "playlists" }
                }
            ]
        );

        console.log(`Successfully updated ${result.modifiedCount} users to fix playlists field type.`);
    } catch (error) {
        console.error("Error in fixPlaylistsFieldType:", error);
    }
}

export { fixPlaylistsFieldType };