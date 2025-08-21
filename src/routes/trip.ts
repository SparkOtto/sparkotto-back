import { Router } from 'express';
import TripController from '../controllers/trip.controller';

const router = Router();

router.post('/', TripController.createTrip);
router.get('/vehicle/:id_vehicle', TripController.getTripsByVehicle);

export default router;