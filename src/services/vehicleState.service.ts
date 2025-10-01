import { PrismaClient } from '@prisma/client';

export const VEHICLE_STATE_TYPE = {
    DEPARTURE: 'departure',  // État de lieux départ
    ARRIVAL: 'arrival'      // État de lieux arrivée
} as const;

export type VehicleStateType = typeof VEHICLE_STATE_TYPE[keyof typeof VEHICLE_STATE_TYPE];

class VehicleStateService {
    private prisma = new PrismaClient();

    async createVehicleState(data: {
        id_vehicle: number;
        state_type: VehicleStateType;
        internal_cleanliness: number;  // Note de 1 à 5
        external_cleanliness: number;  // Note de 1 à 5
        comment?: string;
    }) {
        // Validation des notes (1 à 5)
        if (data.internal_cleanliness < 1 || data.internal_cleanliness > 5) {
            throw new Error('La note de propreté interne doit être entre 1 et 5');
        }
        if (data.external_cleanliness < 1 || data.external_cleanliness > 5) {
            throw new Error('La note de propreté externe doit être entre 1 et 5');
        }

        return this.prisma.vehicleStateRecords.create({
            data: {
                id_vehicle: data.id_vehicle,
                state_date: new Date(),
                state_type: data.state_type,
                internal_cleanliness: data.internal_cleanliness,
                external_cleanliness: data.external_cleanliness,
                comment: data.comment
            },
            include: {
                vehicle: {
                    select: {
                        brand: true,
                        model: true,
                        license_plate: true
                    }
                }
            }
        });
    }

    async getVehicleStatesByTrip(tripId: number) {
        // Récupérer les états via le véhicule du voyage
        const trip = await this.prisma.trips.findUnique({
            where: { id_trip: tripId },
            select: { id_vehicle: true }
        });

        if (!trip) {
            throw new Error('Voyage non trouvé');
        }

        return this.prisma.vehicleStateRecords.findMany({
            where: {
                id_vehicle: trip.id_vehicle,
                state_date: {
                    // États des 24 dernières heures pour ce voyage
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
                }
            },
            orderBy: {
                state_date: 'asc'
            },
            include: {
                vehicle: true
            }
        });
    }

    async getLatestVehicleState(vehicleId: number, stateType?: VehicleStateType) {
        const where: any = { id_vehicle: vehicleId };
        if (stateType) {
            where.state_type = stateType;
        }

        return this.prisma.vehicleStateRecords.findFirst({
            where,
            orderBy: {
                state_date: 'desc'
            },
            include: {
                vehicle: true
            }
        });
    }
}

export default VehicleStateService;
