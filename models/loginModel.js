
import { connectToDb } from '../config/db.js'; // Note the .js extension!
import bcrypt from 'bcrypt';





export default async function verifyPassword(email, password) {
    try {
        const db = await connectToDb();
        const user = await db.collection("users").findOne({ email: email });
        // console.log("User retrieved:", user); // Log the retrieved user object

        if (!user) {
            console.log("User not found in database"); // Log if user not found
            return false;
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        //console.log("bcrypt.compare result:", passwordMatch); // Log the comparison result

        return passwordMatch;

    } catch (error) {
        console.error("Error verifying password:", error);
        throw error; // Re-throw the error for handling elsewhere
    }
}