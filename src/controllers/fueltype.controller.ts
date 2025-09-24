import { Request, Response } from 'express';
import FuelTypeService from '../services/fueltype.service';

class FuelTypeController {
    private fuelTypeService: FuelTypeService;

    constructor() {
        this.fuelTypeService = new FuelTypeService();
    }

    // Créer un nouveau type de carburant
    async createFuelType(req: Request, res: Response): Promise<void> {
        try {
            const fuelData = req.body;
            const newFuelType = await this.fuelTypeService.createFuelType(fuelData);
            res.status(201).json(newFuelType);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    // Obtenir tous les types de carburants
    async getAllFuelTypes(req: Request, res: Response): Promise<void> {
        try {
            const fuelTypes = await this.fuelTypeService.getAllFuelTypes();
            res.status(200).json(fuelTypes);
        } catch (error: any) {
            res.status(500).json({ message: 'Erreur serveur pour l\'obtention des types de carburants' });
        }
    }

    // Obtenir un type de carburant par ID
    async getFuelTypeById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const fuelType = await this.fuelTypeService.getFuelTypeById(id);
            if (fuelType) {
                res.status(200).json(fuelType);
            } else {
                res.status(404).json({ message: 'Type de carburant non trouvé' });
            }
        } catch (error: any) {
            res.status(500).json({ message: 'Erreur serveur pour la récupération du type de carburant' });
        }
    }

    // Mettre à jour un type de carburant
    async updateFuelType(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const fuelData = req.body;
            const updatedFuelType = await this.fuelTypeService.updateFuelType(id, fuelData);
            res.status(200).json(updatedFuelType);
        } catch (error: any) {
            if (error.message === 'Type de carburant non trouvé') {
                res.status(404).json({ message: error.message });
            } else {
                res.status(400).json({ message: error.message });
            }
        }
    }

    // Supprimer un type de carburant
    async deleteFuelType(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            await this.fuelTypeService.deleteFuelType(id);
            res.status(204).send();
        } catch (error: any) {
            if (error.message === 'Type de carburant non trouvé') {
                res.status(404).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Erreur serveur pour la suppression du type de carburant' });
            }
        }
    }
}

export default FuelTypeController;