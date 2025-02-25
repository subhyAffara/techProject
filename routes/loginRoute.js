import { Router } from 'express';
const router = Router();
import loginController from '../controllers/loginController.js'


router.post('/:email', loginController.loginVerify);
router.put('/forgotPassword', loginController.updatePass)


export default router;