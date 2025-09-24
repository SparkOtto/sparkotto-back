import { Router } from 'express';
import VehicleMaintenanceController from '../controllers/vehicleMaintenance.controller';
import { authenticateToken, CustomRequest } from '../middlewares/auth';

const router = Router();

router.post('/start-maintenance', authenticateToken, (req, res) => VehicleMaintenanceController.startMaintenance(req, res));

export default router;