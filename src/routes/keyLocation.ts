import express from 'express';
import KeyLocationController from '../controllers/keyLocation.controller';
import { authenticateToken } from '../middlewares/auth';

const router = express.Router();
const keyLocationController = new KeyLocationController();

// Routes pour les emplacements de clés
router.get('/', authenticateToken, (req, res) => keyLocationController.getAllKeyLocations(req, res));
router.get('/:id', authenticateToken, (req, res) => keyLocationController.getKeyLocationById(req, res));
router.get('/agency/:agencyId', authenticateToken, (req, res) => keyLocationController.getKeyLocationsByAgency(req, res));
router.post('/', authenticateToken, (req, res) => keyLocationController.createKeyLocation(req, res));
router.put('/:id', authenticateToken, (req, res) => keyLocationController.updateKeyLocation(req, res));
router.delete('/:id', authenticateToken, (req, res) => keyLocationController.deleteKeyLocation(req, res));

export default router;
