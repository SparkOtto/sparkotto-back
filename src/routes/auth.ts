import express from 'express';
import AuthController from '../controllers/auth.controller';

const router = express.Router();
const authController = new AuthController();

router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.post('/logout', (req, res) => authController.logout(req, res));
router.post('/verify', (req, res) => authController.verifyToken(req, res));

// Routes pour la gestion du mot de passe oublié
router.post('/forgot-password', (req, res) => authController.forgotPassword(req, res));
router.post('/reset-password', (req, res) => authController.resetPassword(req, res));
router.get('/validate-reset-token/:token', (req, res) => authController.validateResetToken(req, res));

// health fait moi une requete ping pong
router.get('/ping', (req, res) => {
    res.status(200).json({ message: 'pong' });
});

export default router;