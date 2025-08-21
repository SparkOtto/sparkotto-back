import express from 'express';
import VehicleController from '../controllers/vehicle.controller';
import { authenticateToken, CustomRequest } from '../middlewares/auth';

const router = express.Router();
const vehicleController = new VehicleController();

// Routes pour les véhicules
router.post('/', authenticateToken, (req, res) => vehicleController.createVehicle(req, res));
router.get('/', authenticateToken, (req, res) => vehicleController.getVehicles(req, res));
router.get('/:id', authenticateToken, (req, res) => vehicleController.getVehicleById(req, res));
router.put('/:id', authenticateToken, (req, res) => vehicleController.updateVehicle(req, res));
router.delete('/:id', authenticateToken, (req, res) => vehicleController.deleteVehicle(req, res));



export default router;