import { PrismaClient } from '@prisma/client';

class KeyLocationService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async getAllKeyLocations() {
        return this.prisma.keyLocations.findMany({
            include: {
                agency: true,
                keys: true
            }
        });
    }

    async getKeyLocationById(id_key_location: number) {
        return this.prisma.keyLocations.findUnique({
            where: { id_key_location },
            include: {
                agency: true,
                keys: true
            }
        });
    }

    async getKeyLocationsByAgency(agency_id: number) {
        return this.prisma.keyLocations.findMany({
            where: { agency_id },
            include: {
                agency: true,
                keys: true
            }
        });
    }

    async createKeyLocation(data: {
        agency_id: number;
        comment?: string;
    }) {
        return this.prisma.keyLocations.create({
            data,
            include: {
                agency: true
            }
        });
    }

    async updateKeyLocation(id_key_location: number, data: {
        agency_id?: number;
        comment?: string;
    }) {
        return this.prisma.keyLocations.update({
            where: { id_key_location },
            data,
            include: {
                agency: true,
                keys: true
            }
        });
    }

    async deleteKeyLocation(id_key_location: number) {
        return this.prisma.keyLocations.delete({
            where: { id_key_location }
        });
    }
}

export default KeyLocationService;
