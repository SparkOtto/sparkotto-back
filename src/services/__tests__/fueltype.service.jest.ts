import FuelTypeService from '../fueltype.service';
import FuelTypesDAO from '../../dao/fueltype.dao';
import { FuelTypes } from '@prisma/client';
import { describe, expect, jest, beforeEach, it } from '@jest/globals';

jest.mock('../../dao/fueltype.dao');

describe('FuelTypeService', () => {
    let fuelTypeService: FuelTypeService;
    let fuelTypesDAO: jest.Mocked<FuelTypesDAO>;

    beforeEach(() => {
        fuelTypesDAO = new FuelTypesDAO() as jest.Mocked<FuelTypesDAO>;
        fuelTypeService = new FuelTypeService();
        fuelTypeService['fuelTypesDAO'] = fuelTypesDAO;
    });

    describe('createFuelType', () => {
        it('should create a new fuel type', async () => {
            const fuelData: Omit<FuelTypes, 'id_fuel'> = { fuel_name: 'Diesel' };

            fuelTypesDAO.createFuelType.mockResolvedValue({ id_fuel: 1, ...fuelData });

            const result = await fuelTypeService.createFuelType(fuelData);

            expect(result).toEqual({ id_fuel: 1, ...fuelData });
            expect(fuelTypesDAO.createFuelType).toHaveBeenCalledWith(fuelData);
        });
    });

    describe('getAllFuelTypes', () => {
        it('should return all fuel types', async () => {
            const fuelTypes: FuelTypes[] = [
                { id_fuel: 1, fuel_name: 'Diesel' },
                { id_fuel: 2, fuel_name: 'Essence' },
            ];

            fuelTypesDAO.getAllFuelTypes.mockResolvedValue(fuelTypes);

            const result = await fuelTypeService.getAllFuelTypes();

            expect(result).toEqual(fuelTypes);
            expect(fuelTypesDAO.getAllFuelTypes).toHaveBeenCalled();
        });
    });

    describe('getFuelTypeById', () => {
        it('should return a fuel type by id', async () => {
            const fuelType: FuelTypes = { id_fuel: 1, fuel_name: 'Diesel' };

            fuelTypesDAO.getFuelTypeById.mockResolvedValue(fuelType);

            const result = await fuelTypeService.getFuelTypeById(1);

            expect(result).toEqual(fuelType);
            expect(fuelTypesDAO.getFuelTypeById).toHaveBeenCalledWith(1);
        });

        it('should throw an error if fuel type not found', async () => {
            fuelTypesDAO.getFuelTypeById.mockResolvedValue(null);

            await expect(fuelTypeService.getFuelTypeById(1)).rejects.toThrow('Type de carburant non trouvé');
            expect(fuelTypesDAO.getFuelTypeById).toHaveBeenCalledWith(1);
        });
    });

    describe('updateFuelType', () => {
        it('should update a fuel type', async () => {
            const fuelData: Partial<FuelTypes> = { fuel_name: 'Super Diesel' };
            const existingFuelType: FuelTypes = { id_fuel: 1, fuel_name: 'Diesel' };

            fuelTypesDAO.getFuelTypeById.mockResolvedValue(existingFuelType);
            fuelTypesDAO.updateFuelType.mockResolvedValue({ id_fuel: 1, fuel_name: fuelData.fuel_name ?? existingFuelType.fuel_name });

            const result = await fuelTypeService.updateFuelType(1, fuelData);

            expect(result).toEqual({ id_fuel: 1, ...fuelData });
            expect(fuelTypesDAO.getFuelTypeById).toHaveBeenCalledWith(1);
            expect(fuelTypesDAO.updateFuelType).toHaveBeenCalledWith(1, fuelData);
        });

        it('should throw an error if fuel type not found', async () => {
            fuelTypesDAO.getFuelTypeById.mockResolvedValue(null);

            await expect(fuelTypeService.updateFuelType(1, { fuel_name: 'Super Diesel' })).rejects.toThrow('Type de carburant non trouvé');
            expect(fuelTypesDAO.getFuelTypeById).toHaveBeenCalledWith(1);
        });
    });

    describe('deleteFuelType', () => {
        it('should delete a fuel type', async () => {
            const existingFuelType: FuelTypes = { id_fuel: 1, fuel_name: 'Diesel' };

            fuelTypesDAO.getFuelTypeById.mockResolvedValue(existingFuelType);
            fuelTypesDAO.deleteFuelType.mockResolvedValue(existingFuelType);

            const result = await fuelTypeService.deleteFuelType(1);

            expect(result).toEqual(existingFuelType);
            expect(fuelTypesDAO.getFuelTypeById).toHaveBeenCalledWith(1);
            expect(fuelTypesDAO.deleteFuelType).toHaveBeenCalledWith(1);
        });

        it('should throw an error if fuel type not found', async () => {
            fuelTypesDAO.getFuelTypeById.mockResolvedValue(null);

            await expect(fuelTypeService.deleteFuelType(1)).rejects.toThrow('Type de carburant non trouvé');
            expect(fuelTypesDAO.getFuelTypeById).toHaveBeenCalledWith(1);
        });
    });
});