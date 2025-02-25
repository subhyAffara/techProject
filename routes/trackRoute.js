import { Router } from 'express';
const router = Router();
import TracksController from '../controllers/trackController.js';
import { authenticateJWT } from '../config/authMiddleware.js';

router.use(authenticateJWT); // Apply JWT authentication to routes below

router.get('/track/:trackId', TracksController.getTrackById);
router.get('/', TracksController.getAllTracks); // Route to get all tracks - moved here
router.get('/title/:title', TracksController.getTrackByTitle);

export default router;