import express, { json } from 'express';
import userRoute from './routes/userRoutes.js';
import loginRoute from './routes/loginRoute.js';
import playlistRoute from './routes/playlistsRoute.js';
import trackRoute from './routes/trackRoute.js'; // Import tracks route
import { connectToDb } from './config/db.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(json());

// Routes
app.use('/users', userRoute);
app.use('/playlists', playlistRoute);
app.use('/tracks', trackRoute); // Use tracks route
app.use('/login', loginRoute);

async function startServer() {
    try {
        await connectToDb(); // Connect to the database
        app.listen(PORT, () => console.log(`App listening on http://localhost:${PORT}`));
    } catch (error) {
        console.error("Server startup failed:", error);
    }
}

startServer();

process.on('SIGINT', () => {
    console.log('Closing MongoDB connection...');
    // No need to close the client manually if you're exiting the process
    process.exit(0);
});