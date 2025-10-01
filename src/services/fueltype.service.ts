import FuelTypesDAO from '../dao/fueltype.dao';
import { FuelTypes } from '@prisma/client';

class FuelTypeService {
    private fuelTypesDAO: FuelTypesDAO;

    constructor() {
        this.fuelTypesDAO = new FuelTypesDAO();
    }

    // Créer un nouveau type de carburant
    async createFuelType(fuelData: Omit<FuelTypes, 'id_fuel'>): Promise<FuelTypes> {
        return this.fuelTypesDAO.createFuelType(fuelData);
    }

    // Obtenir tous les types de carburants
    async getAllFuelTypes(): Promise<FuelTypes[]> {
        return this.fuelTypesDAO.getAllFuelTypes();
    }

    // Obtenir un type de carburant par ID
    async getFuelTypeById(id: number): Promise<FuelTypes | null> {
        const fuelType = await this.fuelTypesDAO.getFuelTypeById(id);
        if (!fuelType) {
            throw new Error('Type de carburant non trouvé');
        }
        return fuelType;
    }

    // Mettre à jour un type de carburant
    async updateFuelType(id: number, fuelData: Partial<FuelTypes>): Promise<FuelTypes> {
        const existingFuelType = await this.fuelTypesDAO.getFuelTypeById(id);
        if (!existingFuelType) {
            throw new Error('Type de carburant non trouvé');
        }
        return this.fuelTypesDAO.updateFuelType(id, fuelData);
    }

    // Supprimer un type de carburant
    async deleteFuelType(id: number): Promise<FuelTypes> {
        const existingFuelType = await this.fuelTypesDAO.getFuelTypeById(id);
        if (!existingFuelType) {
            throw new Error('Type de carburant non trouvé');
        }
        return this.fuelTypesDAO.deleteFuelType(id);
    }
}

export default FuelTypeService;