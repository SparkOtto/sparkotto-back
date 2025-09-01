import { Request, Response } from 'express';
import TripService from '../services/trip.service';

class VehicleReturnController {
    private tripService: TripService;

    constructor() {
        this.tripService = new TripService();
    }

    /**
     * POST /api/vehicles/return/:tripId
     * Restituer un véhicule
     */
    async returnVehicle(req: Request, res: Response): Promise<void> {
        try {
            const tripId = parseInt(req.params.tripId);
            const { mileage, current_location_agency_id, key_location_id } = req.body;

            // Validation des données
            if (!mileage || !current_location_agency_id || !key_location_id) {
                res.status(400).json({
                    error: 'Données manquantes',
                    required: ['mileage', 'current_location_agency_id', 'key_location_id']
                });
                return;
            }

            if (typeof mileage !== 'number' || mileage < 0) {
                res.status(400).json({
                    error: 'Le kilométrage doit être un nombre positif'
                });
                return;
            }

            const result = await this.tripService.returnVehicle(tripId, {
                mileage,
                current_location_agency_id,
                key_location_id
            });

            res.status(200).json({
                success: true,
                message: 'Véhicule restitué avec succès',
                data: result
            });
        } catch (error: any) {
            console.error('Erreur lors de la restitution du véhicule:', error);
            res.status(400).json({
                error: error.message || 'Erreur lors de la restitution du véhicule'
            });
        }
    }

    /**
     * GET /api/vehicles/active-trip/:vehicleId
     * Récupérer le voyage actif d'un véhicule
     */
    async getActiveTripByVehicle(req: Request, res: Response): Promise<void> {
        try {
            const vehicleId = parseInt(req.params.vehicleId);
            const activeTrip = await this.tripService.getActiveTripByVehicle(vehicleId);

            if (!activeTrip) {
                res.status(404).json({
                    message: 'Aucun voyage actif trouvé pour ce véhicule'
                });
                return;
            }

            res.status(200).json(activeTrip);
        } catch (error: any) {
            console.error('Erreur lors de la récupération du voyage actif:', error);
            res.status(500).json({
                error: 'Erreur lors de la récupération du voyage actif'
            });
        }
    }

    /**
     * GET /api/trips/:tripId
     * Récupérer les détails d'un voyage
     */
    async getTripById(req: Request, res: Response): Promise<void> {
        try {
            const tripId = parseInt(req.params.tripId);
            const trip = await this.tripService.getTripById(tripId);

            if (!trip) {
                res.status(404).json({
                    message: 'Voyage non trouvé'
                });
                return;
            }

            res.status(200).json(trip);
        } catch (error: any) {
            console.error('Erreur lors de la récupération du voyage:', error);
            res.status(500).json({
                error: 'Erreur lors de la récupération du voyage'
            });
        }
    }
}

export default VehicleReturnController;
