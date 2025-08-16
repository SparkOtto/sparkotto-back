import {PrismaClient, Vehicles} from '@prisma/client';
import {Prisma} from '@prisma/client';


const prisma = new PrismaClient();

export type VehicleFilterParams = {
    available?: boolean;
    agency_id?: number;
    minMileage?: number;
    maxMileage?: number;
    model?: string;
};

export const vehicleDao = {
    async createVehicle(data: Prisma.VehiclesCreateInput): Promise<Vehicles> {
        return await prisma.vehicles.create({data});
    },

    async updateVehicle(id_vehicle: number, data: Partial<Omit<Vehicles, 'id_vehicle'>>): Promise<Vehicles | null> {
        return await prisma.vehicles.update({
            where: {id_vehicle},
            data,
        });
    },

    async deleteVehicle(id_vehicle: number): Promise<Vehicles> {
        return await prisma.vehicles.delete({
            where: {id_vehicle},
        });
    },

    async getVehicles(filters: VehicleFilterParams = {}): Promise<Vehicles[]> {
        const {
            available,
            agency_id,
            minMileage,
            maxMileage,
            model,
        } = filters;

        return await prisma.vehicles.findMany({
            where: {
                ...(available !== undefined && {available}),
                ...(agency_id !== undefined && {agency_id}),
                ...(model && {model: {contains: model, mode: 'insensitive'}}),
                ...(minMileage !== undefined || maxMileage !== undefined
                    ? {
                        mileage: {
                            ...(minMileage !== undefined && {gte: minMileage}),
                            ...(maxMileage !== undefined && {lte: maxMileage}),
                        },
                    }
                    : {}),
            },
            include: { fuel_type: true },
        });
    },

    async getVehicleById(id_vehicle: number): Promise<Vehicles | null> {
        return await prisma.vehicles.findUnique({where: {id_vehicle}, include: { fuel_type: true },});
    },
    async createVehicleStateRecord(param: {
        id_vehicle: number;
        state_date: Date;
        state_type: string;
        internal_cleanliness: number;
        external_cleanliness: number;
        comment: string | undefined
    }) {
        return prisma.vehicleStateRecords.create({
            data: {
                id_vehicle: param.id_vehicle,
                state_date: param.state_date,
                state_type: param.state_type,
                internal_cleanliness: param.internal_cleanliness,
                external_cleanliness: param.external_cleanliness,
                comment: param.comment || null,
            },
        });
    },
};
