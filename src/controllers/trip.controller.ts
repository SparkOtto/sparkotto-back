import { Request, Response } from 'express';
import TripService from '../services/trip.service';

class TripController {
    private service: TripService;

    constructor() {
        this.service = new TripService();
    }

    async createTrip(req: Request, res: Response): Promise<void> {
        try {
            const trip = await this.service.createTrip(req.body);
            res.status(201).json(trip);
        } catch (error) {
            res.status(400).json({ error: 'Erreur lors de la création du voyage.' });
        }
    }

    async getTripsByVehicle(req: Request, res: Response): Promise<void> {
        try {
            const { id_vehicle } = req.params;
            const trips = await this.service.getTripsByVehicle(Number(id_vehicle));
            res.status(200).json(trips);
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la récupération des voyages.' });
        }
    }

    /**
     * PUT /api/trips/return/:tripId
     * Restituer un véhicule en terminant le voyage
     */
    async returnVehicle(req: Request, res: Response): Promise<void> {
        try {
            const tripId = parseInt(req.params.tripId);
            const { 
                mileage, 
                current_location_agency_id, 
                key_location_id,
                vehicle_state 
            } = req.body;

            const result = await this.service.returnVehicle(tripId, {
                mileage,
                current_location_agency_id,
                key_location_id,
                vehicle_state
            });

            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * POST /api/trips/:tripId/departure-state
     * Créer un état des lieux de départ
     */
    async createDepartureVehicleState(req: Request, res: Response): Promise<void> {
        try {
            const tripId = parseInt(req.params.tripId);
            const { internal_cleanliness, external_cleanliness, comment } = req.body;

            const vehicleState = await this.service.createDepartureVehicleState(tripId, {
                internal_cleanliness,
                external_cleanliness,
                comment
            });

            res.status(201).json(vehicleState);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}

export default TripController;