import { Router } from 'express';
import VehicleMaintenanceController from '../controllers/vehicleMaintenance.controller';

const router = Router();

router.post('/start-maintenance', VehicleMaintenanceController.startMaintenance);

export default router;