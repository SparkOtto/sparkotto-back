import express from 'express';
import KeyController from '../controllers/key.controller';
import { authenticateToken } from '../middlewares/auth';

const router = express.Router();
const controller = new KeyController();

// Routes pour les clés
router.post('/', authenticateToken, controller.createKey.bind(controller));
router.get('/', authenticateToken, controller.getAllKeys.bind(controller));
router.get('/:id_key', authenticateToken, controller.getKeyById.bind(controller));
router.put('/:id_key', authenticateToken, controller.updateKey.bind(controller));
router.delete('/:id_key', authenticateToken, controller.deleteKey.bind(controller));

// Routes pour les emplacements de clés (via le service Key existant)
router.get('/locations/all', authenticateToken, controller.getAllKeyLocations.bind(controller));
router.get('/locations/agency/:agency_id', authenticateToken, controller.getKeyLocationsByAgency.bind(controller));

export default router;