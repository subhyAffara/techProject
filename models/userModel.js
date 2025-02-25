import { getCollection } from '../config/db.js'; // Import getCollection
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';


async function hashPassword(password) {
    const saltRounds = 10; // Adjust as needed
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    return hashedPassword;
}

async function getAllUsersFromDB() { // Model function naming convention: FromDB suffix
    try {
        const usersCollection = await getCollection("users"); // Get the collection
        const users = await usersCollection.find().toArray();
        return users;
    } catch (error) {
        console.error("Error getting all users from DB:", error);
        throw error;
    }
}

async function getUserByIdFromDB(userId) { // Model function naming convention: FromDB suffix
    console.log("get user by id from db model initiated");
    try {
        const usersCollection = await getCollection("users");
        // Validate if the ID is a valid ObjectId
        if (!ObjectId.isValid(userId)) {
            return null; // Or throw an error if you prefer to handle invalid IDs differently
        }
        const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            return null; // User not found
        }
        return user;
    } catch (error) {
        console.error("Error getting user by ID from DB:", error);
        throw error;
    }
}


async function getUserByEmailFromDB(email) { // Model function naming convention: FromDB suffix
    console.log("get user by email from db model initiated");
    try {
        const usersCollection = await getCollection("users");
        const user = await usersCollection.findOne({ email: email }); // Use findOne for a single user
        if (!user) {
            return null; // User not found
        }
        return user;
    } catch (error) {
        console.error("Error getting user by email from DB:", error);
        throw error; // Re-throw the error for handling elsewhere
    }
}

async function createUserInDB(userData) { // Model function naming convention: FromDB suffix
    try {
        const usersCollection = await getCollection("users");
        const hashedPassword = await hashPassword(userData.password);

        const newUser = {
            email: userData.email,
            password: hashedPassword,
            fullName: userData.fullName,
            firstName: userData.firstName,
            lastName: userData.lastName,
        };

        const result = await usersCollection.insertOne(newUser);
        return result.insertedId;
    } catch (error) {
        console.error("Error creating user in DB:", error);
        throw error;
    }
}


async function deleteUserFromDB(userId) { // Model function naming convention: FromDB suffix
    try {
        const usersCollection = await getCollection("users");
        // Validate if the ID is a valid ObjectId
        if (!ObjectId.isValid(userId)) {
            return 0; // Indicate not found or invalid ID
        }
        const result = await usersCollection.deleteOne({ _id: new ObjectId(userId) });
        return result.deletedCount; // Return the number of deleted documents
    } catch (error) {
        console.error("Error deleting user from DB:", error);
        throw error;
    }
}

export default {
    getAllUsersFromDB, // Export with "FromDB" suffix
    getUserByIdFromDB, // Export with "FromDB" suffix
    createUserInDB,    // Export with "FromDB" suffix
    getUserByEmailFromDB, // Export with "FromDB" suffix
    deleteUserFromDB   // Export with "FromDB" suffix
};