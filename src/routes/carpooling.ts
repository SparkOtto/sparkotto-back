import express from 'express';
import CarpoolingController from '../controllers/carpooling.controller';
import {authenticateToken} from "../middlewares/auth";

const router = express.Router();
const carpoolingController = new CarpoolingController();

router.post('/', authenticateToken, (req,res) => carpoolingController.createCarpooling(req, res));
router.get('/trip/:id_trip', authenticateToken, (req,res) => carpoolingController.getCarpoolingsByTrip(req, res));

export default router;