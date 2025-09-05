import VehicleDAO, {VehicleFilterParams} from '../dao/vehicle.dao';
import {Vehicles} from '@prisma/client';
import {ErrorMessages} from "../command/errorMessages";

class VehicleService {
    private vehicleDAO: VehicleDAO;

    constructor() {
        this.vehicleDAO = new VehicleDAO();
    }
    async createVehicle(input: Vehicles): Promise<Vehicles> {
        // Vérifie unicité de la plaque
        const existing = await this.vehicleDAO.getVehicles({});
        if (existing.find((v: Vehicles) => v.license_plate === input.license_plate)) {
            throw new Error(ErrorMessages.Vehicle.LICENSE_PLATE_EXISTS);
        }

        if(!input.brand || !input.model || !input.license_plate || !input.mileage || !input.fuelTypeId || !input.transmissionId || !input.agency_id) {
            throw new Error(ErrorMessages.Vehicle.MISSING_REQUIRED_FIELDS);
        }

        return await this.vehicleDAO.createVehicle(input);
    }

    async updateVehicle(id: number, update: Vehicles): Promise<Vehicles> {
        const current = await this.vehicleDAO.getVehicleById(id);
        if (!current) {
            throw new Error(ErrorMessages.Vehicle.NOT_FOUND(id));
        }
        const updated = await this.vehicleDAO.updateVehicle(id, update);
        if (!updated) {
            throw new Error(ErrorMessages.Vehicle.UPDATE_FAILED(id));
        }
        return updated;
    }

    async deleteVehicle(id: number): Promise<Vehicles> {
        const existing = await this.vehicleDAO.getVehicleById(id);
        if (!existing) {
            throw new Error(ErrorMessages.Vehicle.NOT_FOUND(id));
        }
        return await this.vehicleDAO.deleteVehicle(id);
    }


    async getVehicles(filters: VehicleFilterParams = {}): Promise<Vehicles[]> {
        return await this.vehicleDAO.getVehicles(filters);
    }

    async getVehicleById(id: number): Promise<Vehicles | null> {
        return await this.vehicleDAO.getVehicleById(id);
    }
}

export default VehicleService;
