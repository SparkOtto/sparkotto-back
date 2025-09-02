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
    async createVehicle(data: Omit<Vehicles, 'id_vehicle'> & { fuelTypeId: number; transmissionId: number; agency_id: number }): Promise<Vehicles> {
        const { fuelTypeId, transmissionId, agency_id, ...vehicleData } = data;
        // Créer le véhicule sans les clés initiales
        const newVehicle = await prisma.vehicles.create({
            data: {
            ...vehicleData,
            agency: { connect: { id_agency: agency_id } },
            fuel_type: { connect: { id_fuel: fuelTypeId } },
            transmission: { connect: { id_transmission: transmissionId } },
            trips: { create: [] },
            },
            include: { fuel_type: true, transmission: true, agency: true, trips: true, keys: { include: { agency: true }} },
        });

        await prisma.keys.createManyAndReturn({
            data: [
                {
                    key_name: 'Clé ' + newVehicle.license_plate,
                    agency_id: agency_id,
                    vehicleKeyId: newVehicle.id_vehicle
                },
                {
                    key_name: 'Clé de secours ' + newVehicle.license_plate,
                    agency_id: agency_id,
                    vehicleKeyId: newVehicle.id_vehicle
                }
            ]
        });

        // Retourner le véhicule avec les clés ajoutées
        return await prisma.vehicles.findUnique({
            where: { id_vehicle: newVehicle.id_vehicle },
            include: { fuel_type: true, transmission: true, agency: true, trips: true, keys: { include: { agency: true }} },
        }) as Vehicles;
    },

    async updateVehicle(
        id_vehicle: number,
        data: Partial<Omit<Vehicles, 'id_vehicle'>> & { fuelTypeId?: number; transmissionId?: number }
    ): Promise<Vehicles> {
        // Destructure and remove custom fields from data
        const { fuelTypeId, transmissionId, agency_id, ...vehicleData } = data;

        return await prisma.vehicles.update({
            where: { id_vehicle },
            data: {
                ...vehicleData,
                ...(agency_id !== undefined && { agency: { connect: { id_agency: agency_id } } }),
                ...(fuelTypeId !== undefined && { fuel_type: { connect: { id_fuel: fuelTypeId } } }),
                ...(transmissionId !== undefined && { transmission: { connect: { id_transmission: transmissionId } } }),
                // Removed trips and keys from update data
                trips: { create: [] }, // Do not modify trips on update
                keys: { create: [] }, // Do not modify keys on update
            },
            include: { fuel_type: true, transmission: true, agency: true, trips: true, keys: { include: { agency: true }} },
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
            include: {fuel_type: true, transmission: true, agency: true, trips: true, keys: { include: { agency: true }} },
        });
    },

    async getVehicleById(id_vehicle: number): Promise<Vehicles | null> {
        return await prisma.vehicles.findUnique({where: {id_vehicle}, include: { fuel_type: true, transmission: true, agency: true, trips: true, keys: { include: { agency: true }} }});
    },

    createVehicleStateRecord: async function (param: {
        id_vehicle: number;
        state_date: Date;
        state_type: string;
        internal_cleanliness: number;
        external_cleanliness: number;
        comment: string | undefined;
    }) {
        return prisma.vehicleStateRecords.create({
            data: {
                state_date: param.state_date,
                state_type: param.state_type,
                internal_cleanliness: param.internal_cleanliness,
                external_cleanliness: param.external_cleanliness,
                comment: param.comment || null,
                vehicle: {
                    connect: { id_vehicle: param.id_vehicle }, // Utilisation correcte de connect
                },
            },
        });
    },
};
