import express from 'express';
import FuelTypeController from '../controllers/fueltype.controller';

const router = express.Router();
const fuelTypeController = new FuelTypeController();

// Routes pour les types de carburants
router.post('/', (req, res) => fuelTypeController.createFuelType(req, res));
router.get('/', (req, res) => fuelTypeController.getAllFuelTypes(req, res));
router.get('/:id', (req, res) => fuelTypeController.getFuelTypeById(req, res));
router.put('/:id', (req, res) => fuelTypeController.updateFuelType(req, res));
router.delete('/:id', (req, res) => fuelTypeController.deleteFuelType(req, res));

export default router;