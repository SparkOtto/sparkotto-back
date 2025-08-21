import { Request, Response } from 'express';
import CarpoolingService from '../services/carpooling.service';

class CarpoolingController {
    private service: CarpoolingService;

    constructor() {
        this.service = new CarpoolingService();
    }

    async createCarpooling(req: Request, res: Response): Promise<void> {
        try {
            const carpooling = await this.service.createCarpooling(req.body);
            res.status(201).json(carpooling);
        } catch (error) {
            res.status(400).json({ error: 'Erreur lors de la création du covoiturage' });
        }
    }

    async getCarpoolingsByTrip(req: Request, res: Response): Promise<void> {
        try {
            const { id_trip } = req.params;
            const carpoolings = await this.service.getCarpoolingsByTrip(Number(id_trip));
            res.status(200).json(carpoolings);
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur pour la récupération des covoiturages'});
        }
    }
}

export default CarpoolingController;