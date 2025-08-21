import express from 'express';
import AgencyController from '../controllers/agency.controller';
import { authenticateToken, CustomRequest } from '../middlewares/auth';

const router = express.Router();
const agencyController = new AgencyController();

// Routes pour les agences
router.route('/')
    .post(authenticateToken, (req, res) => agencyController.createAgency(req, res))
    .get(authenticateToken, (req, res) => agencyController.getAgencies(req, res));

router.route('/:id')
    .get(authenticateToken, (req, res) => agencyController.getAgencyById(req, res))
    .put(authenticateToken, (req, res) => agencyController.updateAgency(req, res))
    .delete(authenticateToken, (req, res) => agencyController.deleteAgency(req, res));

router.route('/city/:city')
    .get(authenticateToken, (req, res) => agencyController.getAgenciesByCity(req, res));

export default router;