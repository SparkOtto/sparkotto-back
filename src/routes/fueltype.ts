import express from 'express';
import FuelTypeController from '../controllers/fueltype.controller';
import { authenticateToken, CustomRequest } from '../middlewares/auth';

const router = express.Router();
const fuelTypeController = new FuelTypeController();

// Routes pour les types de carburants
router.post('/', authenticateToken, (req, res) => fuelTypeController.createFuelType(req, res));
router.get('/', authenticateToken, (req, res) => fuelTypeController.getAllFuelTypes(req, res));
router.get('/:id', authenticateToken, (req, res) => fuelTypeController.getFuelTypeById(req, res));
router.put('/:id', authenticateToken, (req, res) => fuelTypeController.updateFuelType(req, res));
router.delete('/:id', authenticateToken, (req, res) => fuelTypeController.deleteFuelType(req, res));

export default router;