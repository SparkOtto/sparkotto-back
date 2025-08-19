import express from 'express';
import AuthController from '../controllers/auth.controller';

const router = express.Router();
const authController = new AuthController();

router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.post('/logout', (req, res) => authController.logout(req, res));
router.post('/verify', (req, res) => authController.verifyToken(req, res));

export default router;