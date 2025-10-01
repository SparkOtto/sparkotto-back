import { Request, Response } from 'express';
import VehicleStateService from '../services/vehicleState.service';

class VehicleStateController {
    private vehicleStateService: VehicleStateService;

    constructor() {
        this.vehicleStateService = new VehicleStateService();
    }

    async createVehicleState(req: Request, res: Response) {
        try {
            const { id_vehicle, state_type, internal_cleanliness, external_cleanliness, comment } = req.body;

            if (!id_vehicle || !state_type || !internal_cleanliness || !external_cleanliness) {
                return res.status(400).json({ 
                    error: 'Données manquantes: id_vehicle, state_type, internal_cleanliness, external_cleanliness sont requis' 
                });
            }

            const vehicleState = await this.vehicleStateService.createVehicleState({
                id_vehicle: parseInt(id_vehicle),
                state_type,
                internal_cleanliness: parseInt(internal_cleanliness),
                external_cleanliness: parseInt(external_cleanliness),
                comment
            });

            res.status(201).json(vehicleState);
        } catch (error: any) {
            console.error('Erreur lors de la création de l\'état des lieux:', error);
            res.status(400).json({ error: error.message });
        }
    }

    async getVehicleStatesByTrip(req: Request, res: Response) {
        try {
            const { tripId } = req.params;
            const vehicleStates = await this.vehicleStateService.getVehicleStatesByTrip(parseInt(tripId));
            
            res.status(200).json(vehicleStates);
        } catch (error: any) {
            console.error('Erreur lors de la récupération des états des lieux:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async getLatestVehicleState(req: Request, res: Response) {
        try {
            const { vehicleId } = req.params;
            const { state_type } = req.query;

            const vehicleState = await this.vehicleStateService.getLatestVehicleState(
                parseInt(vehicleId),
                state_type as any
            );

            if (!vehicleState) {
                return res.status(404).json({ error: 'Aucun état des lieux trouvé' });
            }

            res.status(200).json(vehicleState);
        } catch (error: any) {
            console.error('Erreur lors de la récupération de l\'état des lieux:', error);
            res.status(500).json({ error: error.message });
        }
    }
}

export default VehicleStateController;
