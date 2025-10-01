import VehicleDAO from '../dao/vehicle.dao';

class VehicleMaintenanceService {
    private vehicleDAO: VehicleDAO;

    constructor() {
        this.vehicleDAO = new VehicleDAO();
    }

    async startMaintenance(id_vehicle: number, comment?: string) {
        // Vérifie si le véhicule existe via le DAO
        const vehicle = await this.vehicleDAO.getVehicleById(id_vehicle);

        if (!vehicle) {
            throw new Error('Véhicule introuvable.');
        }

        // Ajoute un enregistrement de maintenance via le DAO
        return await this.vehicleDAO.createVehicleStateRecord({
            id_vehicle,
            state_date: new Date(),
            state_type: 'MAINTENANCE',
            internal_cleanliness: 0,
            external_cleanliness: 0,
            comment,
        });
    }
}

export default VehicleMaintenanceService;