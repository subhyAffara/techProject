import verifyPassword from '../models/loginModel.js'; // Correct import
import jwt from 'jsonwebtoken'; // Install JWT: npm install jsonwebtoken
import { connectToDb } from '../config/db.js';
import bcrypt from 'bcrypt'
import * as dotenv from 'dotenv';
dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY;
async function hashPassword(password) {
    const saltRounds = 10; // Adjust as needed
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}



async function loginVerify(req, res) {
    const { password } = req.body;
    const email = req.params.email;

    try {
        const isValidPassword = await verifyPassword(email, password);

        if (isValidPassword) {
            const db = await connectToDb();
            const user = await db.collection("users").findOne({ email: email }, { projection: { password: 0 } }); // Get user data (without password)

            if (!user) {
                return res.status(500).json({ message: 'User not found after successful password verification' }); // Handle this unlikely case
            }

            const token = jwt.sign({ userId: user._id }, secretKey); // Replace 'your_secret_key' with a strong secret

            res.json({ user: user, token: token }); // Send *both* user data and token
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


async function updatePass(req, res) {
    console.log('update initiated');

    const { email, password } = req.body;

    try {
        const db = await connectToDb(); // Await the database connection

        const userdata = await db.collection("users").findOne({ email });

        if (!userdata) {
            return res.status(404).json({ message: "User not found" });
        }

        const newHashPass = await hashPassword(password); // Hash password (await bcrypt.hash)

        const result = await db.collection("users").updateOne(
            { email },
            { $set: { password: newHashPass } }
        );

        if (result.modifiedCount === 1) {
            return res.json({ message: "Password updated successfully" });
        } else {
            return res.status(500).json({ message: "Failed to update password" });
        }

    } catch (error) {
        console.error("Error updating password:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
const isAdmin = (req, res, next) => {
    const userRole = req.user.role; // Extract role from the token
    if (userRole === 'admin') {
        next(); // Allow access
    } else {
        res.status(403).send('Forbidden'); // Deny access
    }
};



export default { loginVerify, updatePass, isAdmin };