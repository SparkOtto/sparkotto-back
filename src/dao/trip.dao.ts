import { PrismaClient } from '@prisma/client';

class TripDAO {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async createTrip(data: {
        id_used_key: number;
        id_vehicle: number;
        id_driver: number;
        start_date: Date;
        end_date: Date;
        departure_agency: number;
        arrival_agency: number;
        reservation_status: string;
        carpooling: boolean;
        meeting_time?: Date;
        meeting_comment?: string;
    }) {
        return this.prisma.trips.create({
            data,
        });
    }

    async getTripsByVehicle(id_vehicle: number) {
        return this.prisma.trips.findMany({
            where: { id_vehicle },
            include: {
                vehicle: true,
                driver: true,
                carpoolings: true,
            },
        });
    }
}

export default TripDAO;