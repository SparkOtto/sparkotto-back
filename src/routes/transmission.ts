import express from 'express';
import TransmissionController from '../controllers/transmission.controller';
import { authenticateToken, CustomRequest } from '../middlewares/auth';

const router = express.Router();
const transmissionController = new TransmissionController();

router.get('/', authenticateToken, (req, res) => transmissionController.getAllTransmissions(req,res));
router.post('/', authenticateToken, (req, res) => transmissionController.createTransmission(req,res));
router.get('/:id', authenticateToken, (req, res) => transmissionController.getTransmissionById(req,res));
router.put('/:id', authenticateToken, (req, res) => transmissionController.updateTransmission(req,res));
router.delete('/:id', authenticateToken, (req, res) => transmissionController.deleteTransmission(req,res));

export default router;