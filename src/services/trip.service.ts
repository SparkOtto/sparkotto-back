import TripDAO from '../dao/trip.dao';
import { vehicleService } from './vehicle.service';
import KeyService from './key.service';
import { TRIP_STATUS, canReturnVehicle, isActiveTrip } from '../models/tripStatus';
import VehicleStateService, { VEHICLE_STATE_TYPE } from './vehicleState.service';

class TripService {
    private dao: TripDAO;

    constructor() {
        this.dao = new TripDAO();
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
        return this.dao.createTrip(data);
    }

    async getTripsByVehicle(id_vehicle: number) {
        return this.dao.getTripsByVehicle(id_vehicle);
    }

    async returnVehicle(tripId: number, returnData: {
        mileage: number;
        current_location_agency_id: number;
        key_location_id: number;
        // Ajout de l'état des lieux d'arrivée
        vehicle_state?: {
            internal_cleanliness: number;
            external_cleanliness: number;
            comment?: string;
        };
    }) {
        // Récupérer le voyage
        const trip = await this.dao.getTripById(tripId);
        if (!trip) {
            throw new Error('Voyage non trouvé');
        }

        // Vérifier que le voyage peut être restitué
        if (!canReturnVehicle(trip.reservation_status)) {
            throw new Error(`Impossible de restituer: voyage ${trip.reservation_status}`);
        }

        // Vérifier si le voyage n'est pas déjà terminé par la date
        if (trip.end_date < new Date()) {
            throw new Error('Ce voyage est déjà expiré');
        }

        // Créer l'état des lieux d'arrivée si fourni
        let vehicleState = null;
        if (returnData.vehicle_state) {
            const vehicleStateService = new VehicleStateService();
            vehicleState = await vehicleStateService.createVehicleState({
                id_vehicle: trip.id_vehicle,
                state_type: VEHICLE_STATE_TYPE.ARRIVAL,
                internal_cleanliness: returnData.vehicle_state.internal_cleanliness,
                external_cleanliness: returnData.vehicle_state.external_cleanliness,
                comment: returnData.vehicle_state.comment
            });
        }

        // Mettre à jour le kilométrage du véhicule
        const currentVehicle = await vehicleService.getVehicleById(trip.id_vehicle);
        if (!currentVehicle) {
            throw new Error('Véhicule non trouvé');
        }
        
        await vehicleService.updateVehicle(trip.id_vehicle, {
            ...currentVehicle,
            mileage: returnData.mileage,
            available: true
        });

        // Mettre à jour la localisation de la clé
        const keyService = new KeyService();
        await keyService.updateKey(trip.id_used_key, {
            agency_id: returnData.current_location_agency_id
        });

        // Marquer le voyage comme terminé
        const updatedTrip = await this.dao.updateTrip(tripId, {
            end_date: new Date(),
            arrival_agency: returnData.current_location_agency_id,
            reservation_status: TRIP_STATUS.COMPLETED
        });

        return {
            trip: updatedTrip,
            vehicleState: vehicleState,
            message: 'Véhicule restitué avec succès'
        };
    }

    // Nouvelle méthode pour créer un état des lieux de départ
    async createDepartureVehicleState(tripId: number, stateData: {
        internal_cleanliness: number;
        external_cleanliness: number;
        comment?: string;
    }) {
        const trip = await this.dao.getTripById(tripId);
        if (!trip) {
            throw new Error('Voyage non trouvé');
        }

        const vehicleStateService = new VehicleStateService();
        return vehicleStateService.createVehicleState({
            id_vehicle: trip.id_vehicle,
            state_type: VEHICLE_STATE_TYPE.DEPARTURE,
            internal_cleanliness: stateData.internal_cleanliness,
            external_cleanliness: stateData.external_cleanliness,
            comment: stateData.comment
        });
    }

    async getActiveTripByVehicle(id_vehicle: number) {
        return this.dao.getActiveTripByVehicle(id_vehicle);
    }

    async getTripById(tripId: number) {
        return this.dao.getTripById(tripId);
    }
}

export default TripService;