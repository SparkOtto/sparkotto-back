import TripDAO from '../dao/trip.dao';

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
}

export default TripService;