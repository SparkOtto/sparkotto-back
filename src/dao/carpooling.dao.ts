import { PrismaClient } from '@prisma/client';

class CarpoolingDAO {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async createCarpooling(data: { id_trip: number; id_passenger: number; reserved_seats: number }) {
        return this.prisma.carpooling.create({
            data,
        });
    }

    async getCarpoolingsByTrip(id_trip: number) {
        return this.prisma.carpooling.findMany({
            where: { id_trip },
            include: {
                trip: true,
                passenger: true,
            },
        });
    }
}

export default CarpoolingDAO;