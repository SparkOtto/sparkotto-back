import express from 'express';
import VehicleStateController from '../controllers/vehicleState.controller';

const router = express.Router();
const vehicleStateController = new VehicleStateController();

// Route pour créer un état des lieux
router.post('/', async (req, res) => {
    await vehicleStateController.createVehicleState(req, res);
});

// Route pour récupérer les états des lieux d'un voyage
router.get('/trip/:tripId', async (req, res) => {
    await vehicleStateController.getVehicleStatesByTrip(req, res);
});

// Route pour récupérer le dernier état des lieux d'un véhicule
router.get('/vehicle/:vehicleId/latest', async (req, res) => {
    await vehicleStateController.getLatestVehicleState(req, res);
});

export default router;
