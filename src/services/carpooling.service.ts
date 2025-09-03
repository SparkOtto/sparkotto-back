import CarpoolingDAO from '../dao/carpooling.dao';

class CarpoolingService {
    private dao: CarpoolingDAO;

    constructor() {
        this.dao = new CarpoolingDAO();
    }

    async createCarpooling(data: { id_trip: number; id_passenger: number }) {
        if(!data.id_trip || !data.id_passenger) {
            throw new Error('La liaison entre le trajet et le passager est incomplète');
        }
        return this.dao.createCarpooling(data);
    }

    async getCarpoolingsByTrip(id_trip: number) {
        return this.dao.getCarpoolingsByTrip(id_trip);
    }
}

export default CarpoolingService;