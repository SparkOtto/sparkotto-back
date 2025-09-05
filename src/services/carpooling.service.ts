import CarpoolingDAO from '../dao/carpooling.dao';
import TripDAO from '../dao/trip.dao';

class CarpoolingService {
    private dao: CarpoolingDAO;
    private tripDao: TripDAO;

    constructor() {
        this.dao = new CarpoolingDAO();
        this.tripDao = new TripDAO();
    }

    async createCarpooling(data: { id_trip: number; id_passenger: number }) {
        if(!data.id_trip || !data.id_passenger) {
            throw new Error('La liaison entre le trajet et le passager est incomplète');
        }
        
        const trip = await this.tripDao.getTripById(data.id_trip);
        const existingCarpooling = await this.dao.getCarpoolingsByTrip(data.id_trip);

        if (!trip) {
            throw new Error('Le trajet spécifié n\'existe pas');
        }

        // Vérifier que le covoiturage n'est pas complet
        if (existingCarpooling.length >= (trip.vehicle.seat_count - 1)) {
            throw new Error('Le covoiturage est complet');
        }

        // Vérifier que ce n'est pas le conducteur qui essaie de rejoindre son propre covoiturage
        if (trip.id_driver === data.id_passenger) {
            throw new Error('Vous ne pouvez pas rejoindre votre propre covoiturage');
        }

        // Vérifier que le passager n'a pas déjà rejoint ce covoiturage
        if (existingCarpooling.some(carpooling => carpooling.id_passenger === data.id_passenger)) {
            throw new Error('Vous avez déjà rejoint ce covoiturage');
        }

        return this.dao.createCarpooling(data);
    }

    async getCarpoolingsByTrip(id_trip: number) {
        return this.dao.getCarpoolingsByTrip(id_trip);
    }
}

export default CarpoolingService;