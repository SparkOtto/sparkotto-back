import express from 'express';
import TripController from '../controllers/trip.controller';
import {authenticateToken} from "../middlewares/auth";

const router = express.Router();
const tripController = new TripController();

router.post('/', authenticateToken, (req, res) => tripController.createTrip(req, res));
router.get('/', authenticateToken, (req, res) => tripController.getTrips(req, res));
router.get('/vehicle/:id_vehicle', authenticateToken, (req,res) => tripController.getTripsByVehicle(req, res));
router.put('/return/:tripId', authenticateToken, (req, res) => tripController.returnVehicle(req, res));
router.put('/:tripId', authenticateToken, (req, res) => tripController.updateTrip(req, res));

// Route pour créer un état des lieux de départ
router.post('/:tripId/departure-state', authenticateToken, (req, res) => tripController.createDepartureVehicleState(req, res));

export default router;