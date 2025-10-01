import { PrismaClient, FuelTypes, Vehicles } from '@prisma/client';

class FuelTypesDAO {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    // Créer un nouveau type de carburant
    async createFuelType(fuelData: Omit<FuelTypes, 'id_fuel'>): Promise<FuelTypes> {
        return this.prisma.fuelTypes.create({
            data: fuelData,
        });
    }

    // Obtenir un type de carburant par son ID
    async getFuelTypeById(id: number): Promise<FuelTypes | null> {
        return this.prisma.fuelTypes.findUnique({
            where: { id_fuel: id },
            include: { vehicles: true },
        });
    }

    // Obtenir tous les types de carburants
    async getAllFuelTypes(): Promise<FuelTypes[]> {
        return this.prisma.fuelTypes.findMany({
            include: { vehicles: true },
        });
    }

    // Mettre à jour un type de carburant
    async updateFuelType(id: number, fuelData: Partial<FuelTypes>): Promise<FuelTypes> {
        return this.prisma.fuelTypes.update({
            where: { id_fuel: id },
            data: fuelData,
        });
    }

    // Supprimer un type de carburant
    async deleteFuelType(id: number): Promise<FuelTypes> {
        return this.prisma.fuelTypes.delete({
            where: { id_fuel: id },
        });
    }
}

export default FuelTypesDAO;