import { PrismaClient } from '@prisma/client';

class KeyDAO {
    private prisma = new PrismaClient();

    async create(data: { key_name: string; keyLocationId: number; vehicleKeyId?: number }) {
        return this.prisma.keys.create({ data });
    }

    async findAll() {
        return this.prisma.keys.findMany({
            include: {
                key_location: true,
                vehicle_key: true,
                trips: true,
            },
        });
    }

    async findById(id_key: number) {
        return this.prisma.keys.findUnique({
            where: { id_key },
            include: {
                key_location: true,
                vehicle_key: true,
                trips: true,
            },
        });
    }

    async findByVehicleId(id_vehicle: number) {
        return this.prisma.keys.findMany({
            where: { vehicleKeyId: id_vehicle },
            include: {
                key_location: true,
                vehicle_key: true,
                trips: true,
            },
        });
    }

    async update(id_key: number, data: { key_name?: string; keyLocationId?: number; vehicleKeyId?: number }) {
        return this.prisma.keys.update({
            where: { id_key },
            data,
        });
    }

    async delete(id_key: number) {
        return this.prisma.keys.delete({ where: { id_key } });
    }
}

export default KeyDAO;