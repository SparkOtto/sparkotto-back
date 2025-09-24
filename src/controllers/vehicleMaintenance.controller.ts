import { Request, Response } from 'express';
import VehicleMaintenanceService from '../services/vehicleMaintenance.service';

class VehicleMaintenanceController {
    private service: VehicleMaintenanceService;

    constructor() {
        this.service = new VehicleMaintenanceService();
    }

    async startMaintenance(req: Request, res: Response): Promise<void> {
        try {
            const { id_vehicle, comment } = req.body;
            const result = await this.service.startMaintenance(id_vehicle, comment);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ error: "Erreur lors du démarrage de la maintenance du véhicule." });
        }
    }
}

export default new VehicleMaintenanceController();