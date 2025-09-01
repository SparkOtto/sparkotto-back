import { Request, Response } from 'express';
import KeyLocationService from '../services/keyLocation.service';

class KeyLocationController {
    private keyLocationService: KeyLocationService;

    constructor() {
        this.keyLocationService = new KeyLocationService();
    }

    async getAllKeyLocations(req: Request, res: Response): Promise<void> {
        try {
            const keyLocations = await this.keyLocationService.getAllKeyLocations();
            res.status(200).json(keyLocations);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getKeyLocationById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const keyLocation = await this.keyLocationService.getKeyLocationById(id);
            
            if (!keyLocation) {
                res.status(404).json({ error: 'Emplacement de clé non trouvé' });
                return;
            }
            
            res.status(200).json(keyLocation);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getKeyLocationsByAgency(req: Request, res: Response): Promise<void> {
        try {
            const agencyId = parseInt(req.params.agencyId);
            const keyLocations = await this.keyLocationService.getKeyLocationsByAgency(agencyId);
            res.status(200).json(keyLocations);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async createKeyLocation(req: Request, res: Response): Promise<void> {
        try {
            const { agency_id, comment } = req.body;
            const keyLocation = await this.keyLocationService.createKeyLocation({
                agency_id,
                comment
            });
            res.status(201).json(keyLocation);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateKeyLocation(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const { agency_id, comment } = req.body;
            
            const keyLocation = await this.keyLocationService.updateKeyLocation(id, {
                agency_id,
                comment
            });
            
            res.status(200).json(keyLocation);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async deleteKeyLocation(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            await this.keyLocationService.deleteKeyLocation(id);
            res.status(200).json({ message: 'Emplacement de clé supprimé avec succès' });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}

export default KeyLocationController;
