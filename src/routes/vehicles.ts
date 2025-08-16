import express from 'express';
import VehicleController from '../controllers/vehicle.controller';

const router = express.Router();
const vehicleController = new VehicleController();

// Routes pour les véhicules
router.post('/', (req, res) => vehicleController.createVehicle(req, res));
router.get('/', (req, res) => vehicleController.getVehicles(req, res));
router.get('/:id', (req, res) => vehicleController.getVehicleById(req, res));
router.put('/:id', (req, res) => vehicleController.updateVehicle(req, res));
router.delete('/:id', (req, res) => vehicleController.deleteVehicle(req, res));


export default router;