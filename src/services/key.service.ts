import KeyDAO from '../dao/key.dao';

class KeyService {
    private keyDAO = new KeyDAO();

    async createKey(data: { key_name: string; keyLocationId: number; vehicleKeyId: number }) {
        return this.keyDAO.create(data);
    }

    async getAllKeys() {
        return this.keyDAO.findAll();
    }

    async getKeyById(id_key: number) {
        return this.keyDAO.findById(id_key);
    }

    async getKeyByVehicleId(id_vehicle: number) {
        return this.keyDAO.findByVehicleId(id_vehicle);
    }

    async updateKey(id_key: number, data: { key_name?: string; keyLocationId?: number; vehicleKeyId?: number }) {
        return this.keyDAO.update(id_key, data);
    }

    async deleteKey(id_key: number) {
        return this.keyDAO.delete(id_key);
    }

    // Méthode utilitaire pour récupérer les emplacements de clés par agence
    // (utilisé pour le formulaire de restitution)
    async getKeyLocationsByAgency(agency_id: number) {
        const keys = await this.keyDAO.findAll();
        
        // Extraire les emplacements uniques pour une agence donnée
        const locations = new Map();
        
        keys.forEach(key => {
            if (key.key_location && key.key_location.agency_id === agency_id) {
                const loc = key.key_location;
                if (!locations.has(loc.id_key_location)) {
                    locations.set(loc.id_key_location, {
                        id_key_location: loc.id_key_location,
                        agency_id: loc.agency_id,
                        comment: loc.comment,
                        agency: loc.agency
                    });
                }
            }
        });
        
        return Array.from(locations.values());
    }

    // Méthode utilitaire pour récupérer tous les emplacements de clés
    async getAllKeyLocations() {
        const keys = await this.keyDAO.findAll();
        
        // Extraire tous les emplacements uniques
        const locations = new Map();
        
        keys.forEach(key => {
            if (key.key_location) {
                const loc = key.key_location;
                if (!locations.has(loc.id_key_location)) {
                    locations.set(loc.id_key_location, {
                        id_key_location: loc.id_key_location,
                        agency_id: loc.agency_id,
                        comment: loc.comment,
                        agency: loc.agency
                    });
                }
            }
        });
        
        return Array.from(locations.values());
    }
}

export default KeyService;