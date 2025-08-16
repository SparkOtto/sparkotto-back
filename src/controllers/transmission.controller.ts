import { Request, Response } from 'express';
import TransmissionService from '../services/transmission.service';

class TransmissionController {
    private service: TransmissionService;

    constructor() {
        this.service = new TransmissionService();
    }

    async getAllTransmissions(req: Request, res: Response): Promise<void> {
        try {
            const transmissions = await this.service.getAllTransmissions();
            res.status(200).json(transmissions);
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la récupération des transmissions.' });
        }
    }

    async createTransmission(req: Request, res: Response): Promise<void> {
        try {
            const { transmission_type } = req.body;
            const transmission = await this.service.createTransmission(transmission_type);
            res.status(201).json(transmission);
        } catch (error) {
            res.status(400).json({ error: 'Erreur lors de la création de la transmission. Assurez-vous que le type de transmission est fourni.' });
        }
    }
}

export default TransmissionController;