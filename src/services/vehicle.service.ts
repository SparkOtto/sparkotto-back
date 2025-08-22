import {vehicleDao, VehicleFilterParams} from '../dao/vehicle.dao';
import {Vehicles} from '@prisma/client';
import {Prisma} from '@prisma/client';

export const vehicleService = {
    async createVehicle(input: Vehicles): Promise<Vehicles> {
        // Vérifie unicité de la plaque
        const existing = await vehicleDao.getVehicles({});
        if (existing.find(v => v.license_plate === input.license_plate)) {
            throw new Error('A vehicle with this license plate already exists');
        }
        return await vehicleDao.createVehicle(input);
    },

    async updateVehicle(id: number, update: Partial<Omit<Vehicles, 'id_vehicle'>>): Promise<Vehicles> {
        const current = await vehicleDao.getVehicleById(id);
        if (!current) {
            throw new Error(`Vehicle with id ${id} not found`);
        }
        const updated = await vehicleDao.updateVehicle(id, update);
        if (!updated) {
            throw new Error(`Vehicle with id ${id} could not be updated`);
        }
        return updated;
    },

    async deleteVehicle(id: number): Promise<Vehicles> {
        const existing = await vehicleDao.getVehicleById(id);
        if (!existing) {
            throw new Error(`Vehicle with id ${id} not found`);
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
