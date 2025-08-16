import { PrismaClient, Transmissions } from '@prisma/client';

class TransmissionDAO {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    // Récupérer toutes les transmissions
    async getAllTransmissions(): Promise<Transmissions[]> {
        return this.prisma.transmissions.findMany();
    }

    // Créer une nouvelle transmission
    async createTransmission(transmission_type: string): Promise<Transmissions> {
        return this.prisma.transmissions.create({
            data: { transmission_type },
        });
    }
}

export default TransmissionDAO;