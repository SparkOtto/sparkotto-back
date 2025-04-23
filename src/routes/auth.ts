import express from 'express';
import AuthController from '../controllers/auth.controller';

const router = express.Router();
const authController = new AuthController();

router.post('/login', (req, res) => authController.login(req, res));
router.post('/logout', (req, res) => authController.logout(req, res));

export default router;