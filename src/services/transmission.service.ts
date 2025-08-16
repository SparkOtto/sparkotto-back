import TransmissionDAO from '../dao/transmission.dao';

class TransmissionService {
    private transmissionDao;
    constructor() {
        this.transmissionDao = new TransmissionDAO();
    }
    async getAllTransmissions() {
        return await this.transmissionDao.getAllTransmissions();
    }

    async createTransmission(transmission_type: string) {
        if (!transmission_type) {
            throw new Error('Le type de transmission est requis.');
        }
        return await this.transmissionDao.createTransmission(transmission_type);
    }

    async getTransmissionById(id: number) {
        const transmission = await this.transmissionDao.getTransmissionById(id);
        if (!transmission) {
            throw new Error('Transmission non trouvée');
        }
        return transmission;
    }

    async updateTransmission(id: number, transmission_type: string) {
        const existingTransmission = await this.transmissionDao.getTransmissionById(id);
        if (!existingTransmission) {
            throw new Error('Transmission non trouvée');
        }
        return await this.transmissionDao.updateTransmission(id, transmission_type);
    }

    async deleteTransmission(id: number) {
        const existingTransmission = await this.transmissionDao.getTransmissionById(id);
        if (!existingTransmission) {
            throw new Error('Transmission non trouvée');
        }
        return await this.transmissionDao.deleteTransmission(id);
    }
}

export default TransmissionService;