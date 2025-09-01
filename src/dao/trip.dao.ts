import { PrismaClient } from '@prisma/client';
import { ACTIVE_STATUSES } from '../models/tripStatus';

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

    async getTripById(tripId: number) {
        return this.prisma.trips.findUnique({
            where: { id_trip: tripId },
            include: {
                vehicle: true,
                driver: true,
                key: true,
                carpoolings: true,
            },
        });
    }

    async getActiveTripByVehicle(id_vehicle: number) {
        return this.prisma.trips.findFirst({
            where: {
                id_vehicle,
                reservation_status: {
                    in: ACTIVE_STATUSES
                },
                end_date: {
                    gte: new Date()
                }
            },
            include: {
                vehicle: true,
                driver: true,
                key: true,
            },
        });
    }

    async updateTrip(tripId: number, data: {
        end_date?: Date;
        arrival_agency?: number;
        reservation_status?: string;
    }) {
        return this.prisma.trips.update({
            where: { id_trip: tripId },
            data,
            include: {
                vehicle: true,
                driver: true,
                key: true,
            },
        });
    }
}

export default TripDAO;