import CarpoolingDAO from '../dao/carpooling.dao';

class CarpoolingService {
    private dao: CarpoolingDAO;

    constructor() {
        this.dao = new CarpoolingDAO();
    }

    async createCarpooling(data: { id_trip: number; id_passenger: number; reserved_seats: number }) {
        if (data.reserved_seats <= 0) {
            throw new Error('Le nombre de places réservées doit être supérieur à 0.');
        }
        return this.dao.createCarpooling(data);
    }

    async getCarpoolingsByTrip(id_trip: number) {
        return this.dao.getCarpoolingsByTrip(id_trip);
    }
}

export default CarpoolingService;