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

    // Récupérer une transmission par son ID
    async getTransmissionById(id: number): Promise<Transmissions | null> {
        return this.prisma.transmissions.findUnique({
            where: { id_transmission: id },
        });
    }

    // Mettre à jour une transmission
    async updateTransmission(id: number, transmission_type: string): Promise<Transmissions> {
        return this.prisma.transmissions.update({
            where: { id_transmission: id },
            data: { transmission_type },
        });
    }

    // Supprimer une transmission
    async deleteTransmission(id: number): Promise<Transmissions> {
        return this.prisma.transmissions.delete({
            where: { id_transmission: id },
        });
    }
}

export default TransmissionDAO;