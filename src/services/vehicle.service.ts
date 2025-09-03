import {vehicleDao, VehicleFilterParams} from '../dao/vehicle.dao';
import {Vehicles} from '@prisma/client';
import {Prisma} from '@prisma/client';
import tripDao from "../dao/trip.dao";

export const vehicleService = {
    async createVehicle(input: Vehicles): Promise<Vehicles> {
        // Vérifie unicité de la plaque
        const existing = await vehicleDao.getVehicles({});
        if (existing.find(v => v.license_plate === input.license_plate)) {
            throw new Error('Le véhicule avec cette plaque existe déjà');
        }

        if(!input.brand || !input.model || !input.license_plate || !input.mileage || !input.fuelTypeId || !input.transmissionId || !input.agency_id) {
            throw new Error('les champs obligatoires pour le véhicule ne sont pas tous remplis');
        }

        return await vehicleDao.createVehicle(input);
    },

    async updateVehicle(id: number, update: Vehicles): Promise<Vehicles> {
        const current = await vehicleDao.getVehicleById(id);
        if (!current) {
            throw new Error(`Le vehicule avec l\'id ${id} est introuvable`);
        }
        const updated = await vehicleDao.updateVehicle(id, update);
        if (!updated) {
            throw new Error(`Le vehicule avec l\'id ${id} ne peut pas être mis à jour`);
        }
        return updated;
    },

    async deleteVehicle(id: number): Promise<Vehicles> {
        const existing = await vehicleDao.getVehicleById(id);
        if (!existing) {
            throw new Error(`Le vehicule avec l\'id ${id} est introuvable`);
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
