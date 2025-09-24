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

    async getTransmissionById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const transmission = await this.service.getTransmissionById(id);
            if (transmission) {
                res.status(200).json(transmission);
            } else {
                res.status(404).json({ error: 'Transmission non trouvée.' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la récupération de la transmission.' });
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

    async updateTransmission(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const { transmission_type } = req.body;
            const updatedTransmission = await this.service.updateTransmission(id, transmission_type);
            res.status(200).json(updatedTransmission);
        } catch (error) {
            if (error instanceof Error && error.message === 'Transmission non trouvée') {
                res.status(404).json({ error: 'Transmission non trouvée.' });
            } else {
                res.status(400).json({ error: 'Erreur lors de la mise à jour de la transmission.' });
            }
        }
    }

    async deleteTransmission(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            await this.service.deleteTransmission(id);
            res.status(204).send();
        } catch (error) {
            if (error instanceof Error && error.message === 'Transmission non trouvée') {
                res.status(404).json({ error: 'Transmission non trouvée.' });
            } else {
                res.status(500).json({ error: 'Erreur lors de la suppression de la transmission.' });
            }
        }
    }
}

export default TransmissionController;