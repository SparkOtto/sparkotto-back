import {vehicleDao} from '../dao/vehicle.dao';

class VehicleMaintenanceService {
    async startMaintenance(id_vehicle: number, comment?: string) {
        // Vérifie si le véhicule existe via le DAO
        const vehicle = await vehicleDao.getVehicleById(id_vehicle);

        if (!vehicle) {
            throw new Error('Véhicule introuvable.');
        }

        // Ajoute un enregistrement de maintenance via le DAO
        return await vehicleDao.createVehicleStateRecord({
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