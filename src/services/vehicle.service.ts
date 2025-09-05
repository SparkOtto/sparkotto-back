import VehicleDAO, {VehicleFilterParams} from '../dao/vehicle.dao';
import {Vehicles} from '@prisma/client';
import {Messages} from "../command/messages";
import TripDAO from "../dao/trip.dao";

class VehicleService {
    private vehicleDAO: VehicleDAO;
    private tripDAO: TripDAO;

    constructor() {
        this.vehicleDAO = new VehicleDAO();
        this.tripDAO = new TripDAO();
    }
    async createVehicle(input: Vehicles): Promise<Vehicles> {
        // Vérifie unicité de la plaque
        const existing = await this.vehicleDAO.getVehicles({});
        if (existing.find((v: Vehicles) => v.license_plate === input.license_plate)) {
            throw new Error(Messages.Vehicle.LICENSE_PLATE_EXISTS);
        }

        if(!input.brand || !input.model || !input.license_plate || !input.mileage || !input.fuelTypeId || !input.transmissionId || !input.agency_id) {
            throw new Error(Messages.Vehicle.MISSING_REQUIRED_FIELDS);
        }

        return await this.vehicleDAO.createVehicle(input);
    }

    async updateVehicle(id: number, update: Vehicles): Promise<Vehicles> {
        const current = await this.vehicleDAO.getVehicleById(id);
        if (!current) {
            throw new Error(Messages.Vehicle.NOT_FOUND(id));
        }
        const updated = await this.vehicleDAO.updateVehicle(id, update);
        if (!updated) {
            throw new Error(Messages.Vehicle.UPDATE_FAILED(id));
        }
        return updated;
    }

    async deleteVehicle(id: number): Promise<Vehicles> {
        const existing = await this.vehicleDAO.getVehicleById(id);
        if (!existing) {
            throw new Error(Messages.Vehicle.NOT_FOUND(id));
        }
        const activeTrips = await this.tripDAO.getTripsByVehicle(id);
        if (activeTrips.length > 0) {
            throw new Error(Messages.Vehicle.DELETE_FAILED(id));
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
