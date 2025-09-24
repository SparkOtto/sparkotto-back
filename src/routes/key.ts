import express from 'express';
import KeyController from '../controllers/key.controller';
import { authenticateToken } from '../middlewares/auth';

const router = express.Router();
const controller = new KeyController();

router.post('/', authenticateToken, controller.createKey.bind(controller));
router.get('/', authenticateToken, controller.getAllKeys.bind(controller));
router.get('/vehicle/:id_vehicle', authenticateToken, controller.getKeyByVehicleId.bind(controller));
router.get('/:id_key', authenticateToken, controller.getKeyById.bind(controller));
router.put('/:id_key', authenticateToken, controller.updateKey.bind(controller));
router.delete('/:id_key', authenticateToken, controller.deleteKey.bind(controller));


export default router;