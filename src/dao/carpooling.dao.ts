import { PrismaClient } from '@prisma/client';

class CarpoolingDAO {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async createCarpooling(data: { id_trip: number; id_passenger: number }) {
        return this.prisma.carpooling.create({
            data: {
                trip: {
                    connect: { id_trip: data.id_trip }, // Connexion au voyage existant
                },
                passenger: {
                    connect: { id_user: data.id_passenger }, // Connexion au passager existant
                },
            },
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