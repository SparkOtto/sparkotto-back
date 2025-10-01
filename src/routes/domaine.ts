import express, { Request, Response } from 'express';
import DomaineController from '../controllers/domaine.controller';

const router = express.Router();
const domaineController = new DomaineController();

// Récupérer tous les domaines
router.get('/domaine/list', (req: Request, res: Response) => {
    domaineController.getAllDomaines(req, res);
});

// Récupérer un domaine par son ID
router.get('/domaine/:id', (req: Request, res: Response) => {
    domaineController.getDomaineById(req, res);
});

// Créer un nouveau domaine
router.post('/domaine/new', (req: Request, res: Response) => {
    domaineController.createDomaine(req, res);
});

// Mettre à jour un domaine existant
router.put('/domaine/:id', (req: Request, res: Response) => {
    domaineController.updateDomaine(req, res);
});

// Supprimer un domaine
router.delete('/domaine/:id', (req: Request, res: Response) => {
    domaineController.deleteDomaine(req, res);
});

export default router;