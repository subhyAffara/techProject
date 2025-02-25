import { Router } from 'express';
const router = Router();
import userController from '../controllers/userController.js';

router.get('/', userController.getUsers);
router.get('/email/:email', userController.getUser);
router.get('/:id', userController.getUserById);
router.post('/', userController.createNewUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;