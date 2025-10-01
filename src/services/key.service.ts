import KeyDAO from '../dao/key.dao';

class KeyService {
    private keyDAO = new KeyDAO();

    async createKey(data: { key_name: string; agency_id: number; vehicleKeyId: number }) {
        if(!data.key_name || !data.agency_id || !data.vehicleKeyId) {
            throw new Error('Les informations de la clé sont incomplètes');
        }

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

    async updateKey(id_key: number, data: { key_name?: string; agency_id?: number; vehicleKeyId?: number }) {
        if(!data.key_name || !data.agency_id || !data.vehicleKeyId) {
            throw new Error('Les informations de la clé sont incomplètes');
        }

        return this.keyDAO.update(id_key, data);
    }

    async deleteKey(id_key: number) {
        return this.keyDAO.delete(id_key);
    }
}

export default KeyService;