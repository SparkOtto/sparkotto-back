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
}

export default TransmissionService;