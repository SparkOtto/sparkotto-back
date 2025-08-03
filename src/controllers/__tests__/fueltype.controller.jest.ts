import { Request, Response } from 'express';
import FuelTypeController from '../fueltype.controller';
import FuelTypeService from '../../services/fueltype.service';
import { describe, expect, jest, beforeEach, it } from '@jest/globals';

jest.mock('../../services/fueltype.service');

describe('FuelTypeController', () => {
    let fuelTypeController: FuelTypeController;
    let fuelTypeService: jest.Mocked<FuelTypeService>;
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        fuelTypeService = {
            createFuelType: jest.fn(),
            getAllFuelTypes: jest.fn(),
            getFuelTypeById: jest.fn(),
            updateFuelType: jest.fn(),
            deleteFuelType: jest.fn(),
        } as unknown as jest.Mocked<FuelTypeService>;

        fuelTypeController = new FuelTypeController();
        fuelTypeController['fuelTypeService'] = fuelTypeService;

        req = {};
        res = {
            status: jest.fn().mockReturnThis() as jest.MockedFunction<Response['status']>,
            json: jest.fn() as jest.MockedFunction<Response['json']>,
            send: jest.fn() as jest.MockedFunction<Response['send']>,
        };
    });

    describe('createFuelType', () => {
        it('should create a new fuel type and return it', async () => {
            const newFuelType = { id_fuel: 1, fuel_name: 'Diesel' };
            fuelTypeService.createFuelType.mockResolvedValue(newFuelType);

            req.body = { fuel_name: 'Diesel' };

            await fuelTypeController.createFuelType(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(newFuelType);
        });

        it('should return 400 if an error occurs', async () => {
            fuelTypeService.createFuelType.mockRejectedValue(new Error('Invalid data'));

            req.body = { fuel_name: '' };

            await fuelTypeController.createFuelType(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid data' });
        });
    });

    describe('getAllFuelTypes', () => {
        it('should return all fuel types', async () => {
            const fuelTypes = [
                { id_fuel: 1, fuel_name: 'Diesel' },
                { id_fuel: 2, fuel_name: 'Essence' },
            ];
            fuelTypeService.getAllFuelTypes.mockResolvedValue(fuelTypes);

            await fuelTypeController.getAllFuelTypes(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(fuelTypes);
        });

        it('should return 500 if an error occurs', async () => {
            fuelTypeService.getAllFuelTypes.mockRejectedValue(new Error('Server error'));

            await fuelTypeController.getAllFuelTypes(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Erreur serveur pour l\'obtention des types de carburants' });
        });
    });

    describe('getFuelTypeById', () => {
        it('should return a fuel type by id', async () => {
            const fuelType = { id_fuel: 1, fuel_name: 'Diesel' };
            fuelTypeService.getFuelTypeById.mockResolvedValue(fuelType);

            req.params = { id: '1' };

            await fuelTypeController.getFuelTypeById(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(fuelType);
        });

        it('should return 404 if fuel type not found', async () => {
            fuelTypeService.getFuelTypeById.mockResolvedValue(null);

            req.params = { id: '1' };

            await fuelTypeController.getFuelTypeById(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Type de carburant non trouvé' });
        });
    });

    describe('updateFuelType', () => {
        it('should update a fuel type and return it', async () => {
            const updatedFuelType = { id_fuel: 1, fuel_name: 'Super Diesel' };
            fuelTypeService.updateFuelType.mockResolvedValue(updatedFuelType);

            req.params = { id: '1' };
            req.body = { fuel_name: 'Super Diesel' };

            await fuelTypeController.updateFuelType(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(updatedFuelType);
        });

        it('should return 404 if fuel type not found', async () => {
            fuelTypeService.updateFuelType.mockRejectedValue(new Error('Type de carburant non trouvé'));

            req.params = { id: '1' };
            req.body = { fuel_name: 'Super Diesel' };

            await fuelTypeController.updateFuelType(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Type de carburant non trouvé' });
        });
    });

    describe('deleteFuelType', () => {
        it('should delete a fuel type and return 204', async () => {
            fuelTypeService.deleteFuelType.mockResolvedValue({ id_fuel: 1, fuel_name: 'Diesel' });

            req.params = { id: '1' };

            await fuelTypeController.deleteFuelType(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalled();
        });

        it('should return 404 if fuel type not found', async () => {
            fuelTypeService.deleteFuelType.mockRejectedValue(new Error('Type de carburant non trouvé'));

            req.params = { id: '1' };

            await fuelTypeController.deleteFuelType(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Type de carburant non trouvé' });
        });
    });
});