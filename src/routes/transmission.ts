import express from 'express';
import TransmissionController from '../controllers/transmission.controller';

const router = express.Router();
const transmissionController = new TransmissionController();

router.get('/', (req, res) => transmissionController.getAllTransmissions(req,res));
router.post('/', (req, res) => transmissionController.createTransmission(req,res));
router.get('/:id', (req, res) => transmissionController.getTransmissionById(req,res));
router.put('/:id', (req, res) => transmissionController.updateTransmission(req,res));
router.delete('/:id', (req, res) => transmissionController.deleteTransmission(req,res));

export default router;