// controllers/DomaineController.ts
import {Request, Response} from "express";

class DomaineController {
    async getAllDomaines(req: Request, res: Response) {
        try {
            const domaines = await req.app.locals.domaineService.getAllDomaines();
            res.status(200).json(domaines);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération des domaines" });
        }
    }

    async getDomaineById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const domaine = await req.app.locals.domaineService.getDomaineById(id);
            if (!domaine) {
                return res.status(404).json({ message: "Domaine non trouvé" });
            }
            res.status(200).json(domaine);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération du domaine" });
        }
    }

    async createDomaine(req: Request, res: Response) {
        try {
            const { domaine_name } = req.body;
            const newDomaine = await req.app.locals.domaineService.createDomaine(domaine_name);
            res.status(201).json(newDomaine);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la création du domaine" });
        }
    }

    async updateDomaine(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const { domaine_name } = req.body;
            const updated = await req.app.locals.domaineService.updateDomaine(id, domaine_name);
            res.status(200).json(updated);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la mise à jour du domaine" });
        }
    }

    async deleteDomaine(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await req.app.locals.domaineService.deleteDomaine(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la suppression du domaine" });
        }
    }
}

export default DomaineController;