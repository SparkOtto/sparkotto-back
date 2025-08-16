import express from 'express';
import TransmissionController from '../controllers/transmission.controller';

const router = express.Router();
const transmissionController = new TransmissionController();

router.get('/', (req, res) => transmissionController.getAllTransmissions(req,res));
router.post('/', (req, res) => transmissionController.createTransmission(req,res));

export default router;