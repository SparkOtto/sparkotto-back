import express from 'express';
import AuthController from '../controllers/auth.controller';
import { requireAdmin } from '../middlewares/auth';

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

// Routes pour la gestion des comptes (admin seulement)
router.put('/unlock-account/:userId', requireAdmin, (req, res) => authController.unlockAccount(req, res));
router.put('/lock-account/:userId', requireAdmin, (req, res) => authController.lockAccount(req, res));

export default router;