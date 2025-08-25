import { Request, Response } from 'express';
import KeyService from '../services/key.service';

class KeyController {
    private service: KeyService;

    constructor() {
        this.service = new KeyService();
    }

    async createKey(req: Request, res: Response): Promise<void> {
        try {
            const key = await this.service.createKey(req.body);
            res.status(201).json(key);
        } catch (error) {
            res.status(400).json({ error: 'Erreur lors de la création de la clé.' });
        }
    }

    async getAllKeys(req: Request, res: Response): Promise<void> {
        try {
            const keys = await this.service.getAllKeys();
            res.status(200).json(keys);
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la récupération des clés.' });
        }
    }

    async getKeyByVehicleId(req: Request, res: Response): Promise<void> {
        try {
            const { id_vehicle } = req.params;
            const key = await this.service.getKeyByVehicleId(Number(id_vehicle));
            if (key) {
                res.status(200).json(key);
            } else {
                res.status(404).json({ error: 'Clé non trouvée pour ce véhicule.' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la récupération de la clé.' });
        }
    }

    async getKeyById(req: Request, res: Response): Promise<void> {
        try {
            const { id_key } = req.params;
            const key = await this.service.getKeyById(Number(id_key));
            if (key) {
                res.status(200).json(key);
            } else {
                res.status(404).json({ error: 'Clé non trouvée.' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la récupération de la clé.' });
        }
    }

    async updateKey(req: Request, res: Response): Promise<void> {
        try {
            const { id_key } = req.params;
            const key = await this.service.updateKey(Number(id_key), req.body);
            res.status(200).json(key);
        } catch (error) {
            res.status(400).json({ error: 'Erreur lors de la mise à jour de la clé.' });
        }
    }

    async deleteKey(req: Request, res: Response): Promise<void> {
        try {
            const { id_key } = req.params;
            await this.service.deleteKey(Number(id_key));
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ error: 'Erreur lors de la suppression de la clé.' });
        }
    }
  
    async getKeyLocationsByAgency(req: Request, res: Response): Promise<void> {
        try {
            const { agency_id } = req.params;
            const keyLocations = await this.service.getKeyLocationsByAgency(Number(agency_id));
            res.status(200).json(keyLocations);
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la récupération des emplacements de clés.' });
        }
    }

    async getAllKeyLocations(req: Request, res: Response): Promise<void> {
        try {
            const keyLocations = await this.service.getAllKeyLocations();
            res.status(200).json(keyLocations);
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la récupération des emplacements de clés.' });
        }
    }
}

export default KeyController;