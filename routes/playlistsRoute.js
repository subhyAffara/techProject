// routes/playlistsRoute.js
import { Router } from 'express';
const router = Router();
import PlaylistController from '../controllers/playlistsController.js';
import { authenticateJWT } from '../config/authMiddleware.js';

router.use(authenticateJWT); // Apply JWT authentication to routes below



router.get('/', PlaylistController.getAllPlaylists);
router.get('/playlist/:playlistId', PlaylistController.getPlaylistById);
router.get('/favs/:id', PlaylistController.getFavoriteTracks);
router.post('/', PlaylistController.createPlaylist);
router.post('/tracks', PlaylistController.addToPlaylist); // Corrected to POST for adding tracks
router.delete('/tracks/:id/:playlistId', PlaylistController.deleteTrackFromPlaylist);
router.delete('/:playlistId', PlaylistController.deletePlaylist);
export default router;