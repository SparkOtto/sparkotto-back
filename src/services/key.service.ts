import KeyDAO from '../dao/key.dao';

class KeyService {
    private keyDAO = new KeyDAO();

    async createKey(data: { key_name: string; keyLocationId: number; vehicleKeyId?: number }) {
        return this.keyDAO.create(data);
    }

    async getAllKeys() {
        return this.keyDAO.findAll();
    }

    async getKeyById(id_key: number) {
        return this.keyDAO.findById(id_key);
    }

    async updateKey(id_key: number, data: { key_name?: string; keyLocationId?: number; vehicleKeyId?: number }) {
        return this.keyDAO.update(id_key, data);
    }

    async deleteKey(id_key: number) {
        return this.keyDAO.delete(id_key);
    }
}

export default KeyService;