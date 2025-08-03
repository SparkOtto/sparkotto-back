import express from 'express';
import AgencyController from '../controllers/agency.controller';

const router = express.Router();
const agencyController = new AgencyController();

// Routes pour les agences
router.route('/')
    .post((req, res) => agencyController.createAgency(req, res))
    .get((req, res) => agencyController.getAgencies(req, res));

router.route('/:id')
    .get((req, res) => agencyController.getAgencyById(req, res))
    .put((req, res) => agencyController.updateAgency(req, res))
    .delete((req, res) => agencyController.deleteAgency(req, res));

router.route('/city/:city')
    .get((req, res) => agencyController.getAgenciesByCity(req, res));

export default router;