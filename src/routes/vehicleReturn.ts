import express from 'express';
import VehicleReturnController from '../controllers/vehicleReturn.controller';

const router = express.Router();
const vehicleReturnController = new VehicleReturnController();

// Route pour restituer un véhicule
router.post('/return/:tripId', (req, res) => vehicleReturnController.returnVehicle(req, res));

// Route pour récupérer le voyage actif d'un véhicule
router.get('/active-trip/:vehicleId', (req, res) => vehicleReturnController.getActiveTripByVehicle(req, res));

// Route pour récupérer les détails d'un voyage
router.get('/trip/:tripId', (req, res) => vehicleReturnController.getTripById(req, res));

export default router;
