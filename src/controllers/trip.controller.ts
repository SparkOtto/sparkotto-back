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
}

export default new TripController();