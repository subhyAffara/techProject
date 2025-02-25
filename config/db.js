import { MongoClient, ServerApiVersion } from 'mongodb';
import * as dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI; // Make sure this is set in your environment
let db;
async function connectToDb() {
    try {
        console.log("Attempting to connect to MongoDB..."); // Add this line
        const client = new MongoClient(uri);
        await client.connect();
        db = client.db("sample_mflix");
        console.log("Successfully connected to MongoDB and DB initialized!");
        return db;
    } catch (error) {
        console.error("Error connecting to MongoDB (FATAL):", error);
        db = null;
        throw error;
    }
}

async function getCollection(collectionName) {
    if (!db) {
        await connectToDb();
    }
    return db.collection(collectionName);
}

export { connectToDb, getCollection };

