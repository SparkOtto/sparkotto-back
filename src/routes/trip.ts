import express from 'express';
import TripController from '../controllers/trip.controller';
import {authenticateToken} from "../middlewares/auth";

const router = express.Router();
const tripController = new TripController();

router.post('/', authenticateToken, (req, res) => tripController.createTrip(req, res));
router.get('/vehicle/:id_vehicle', authenticateToken, (req,res) => tripController.getTripsByVehicle(req, res));

export default router;