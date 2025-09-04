import {vehicleDao, VehicleFilterParams} from '../dao/vehicle.dao';
import {Vehicles} from '@prisma/client';
import {Prisma} from '@prisma/client';
import tripDao from "../dao/trip.dao";
import {ErrorMessages} from "../command/errorMessages";

export const vehicleService = {
    async createVehicle(input: Vehicles): Promise<Vehicles> {
        // Vérifie unicité de la plaque
        const existing = await vehicleDao.getVehicles({});
        if (existing.find(v => v.license_plate === input.license_plate)) {
            throw new Error(ErrorMessages.Vehicle.LICENSE_PLATE_EXISTS);
        }

        if(!input.brand || !input.model || !input.license_plate || !input.mileage || !input.fuelTypeId || !input.transmissionId || !input.agency_id) {
            throw new Error(ErrorMessages.Vehicle.MISSING_REQUIRED_FIELDS);
        }

        return await vehicleDao.createVehicle(input);
    },

    async updateVehicle(id: number, update: Vehicles): Promise<Vehicles> {
        const current = await vehicleDao.getVehicleById(id);
        if (!current) {
            throw new Error(ErrorMessages.Vehicle.NOT_FOUND(id));
        }
        const updated = await vehicleDao.updateVehicle(id, update);
        if (!updated) {
            throw new Error(ErrorMessages.Vehicle.UPDATE_FAILED(id));
        }
        return updated;
    },

    async deleteVehicle(id: number): Promise<Vehicles> {
        const existing = await vehicleDao.getVehicleById(id);
        if (!existing) {
            throw new Error(ErrorMessages.Vehicle.NOT_FOUND(id));
        }
        return await vehicleDao.deleteVehicle(id);
    },


    async getVehicles(filters: VehicleFilterParams = {}): Promise<Vehicles[]> {
        return await vehicleDao.getVehicles(filters);
    },

    async getVehicleById(id: number): Promise<Vehicles | null> {
        return await vehicleDao.getVehicleById(id);
    }
};
