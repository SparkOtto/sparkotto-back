import VehicleService from '../vehicle.service';
import VehicleDAO from '../../dao/vehicle.dao';
import {Vehicles} from '@prisma/client';
import {beforeEach, describe, expect, it, jest} from "@jest/globals";

jest.mock('../../dao/vehicle.dao');

describe('VehicleService', () => {
    let vehicleService: VehicleService;
    let mockVehicleDAO: jest.Mocked<VehicleDAO>;

    beforeEach(() => {
        jest.clearAllMocks();
        mockVehicleDAO = {
            getVehicles: jest.fn(),
            createVehicle: jest.fn(),
            getVehicleById: jest.fn(),
            updateVehicle: jest.fn(),
            deleteVehicle: jest.fn(),
            createVehicleStateRecord: jest.fn(),
        } as any;

        // Mock the constructor to return our mock
        (VehicleDAO as jest.MockedClass<typeof VehicleDAO>).mockImplementation(() => mockVehicleDAO);
        
        vehicleService = new VehicleService();
    });

    describe('createVehicle', () => {
        it('should create a vehicle if license plate is unique', async () => {
            mockVehicleDAO.getVehicles.mockResolvedValue([]);
            mockVehicleDAO.createVehicle.mockResolvedValue({id_vehicle: 1, license_plate: 'AA-123-BB'} as Vehicles);

            const result = await vehicleService.createVehicle({
                brand: 'Test Brand',
                model: 'Test Model',
                license_plate: 'AA-123-BB',
                mileage: 50000,
                fuelTypeId: 1,
                transmissionId: 1,
                agency_id: 1,
                seat_count: 5,
                available: true,
                fuel_capacity: 50
            } as any);

            expect(mockVehicleDAO.createVehicle).toHaveBeenCalled();
            expect(result).toEqual({id_vehicle: 1, license_plate: 'AA-123-BB'});
        });

        it('should throw error if license plate exists', async () => {
            mockVehicleDAO.getVehicles.mockResolvedValue([{license_plate: 'AA-123-BB'} as Vehicles]);

            await expect(vehicleService.createVehicle({license_plate: 'AA-123-BB'} as any)).rejects.toThrow('Le véhicule avec cette plaque existe déjà');
        });
    });

    describe('updateVehicle', () => {
        it('should update a vehicle if it exists', async () => {
            mockVehicleDAO.getVehicleById.mockResolvedValue({id_vehicle: 1} as Vehicles);
            mockVehicleDAO.updateVehicle.mockResolvedValue({id_vehicle: 1, mileage: 60000} as Vehicles);

            const result = await vehicleService.updateVehicle(1, {mileage: 60000} as any);

            expect(result).toEqual({id_vehicle: 1, mileage: 60000});
        });

        it('should throw error if vehicle does not exist', async () => {
            mockVehicleDAO.getVehicleById.mockResolvedValue(null);

            await expect(vehicleService.updateVehicle(1, {} as any)).rejects.toThrow('Le vehicule avec l\'id 1 est introuvable');
        });
    });

    describe('getVehicleById', () => {
        it('should return vehicle by id if it exists', async () => {
            mockVehicleDAO.getVehicleById.mockResolvedValue({id_vehicle: 1, license_plate: 'AA-123-BB'} as Vehicles);

            const result = await vehicleService.getVehicleById(1);

            expect(result).toEqual({id_vehicle: 1, license_plate: 'AA-123-BB'});
        });
    });

    describe('getVehicles', () => {
        it('should return list of vehicles from dao', async () => {
            mockVehicleDAO.getVehicles.mockResolvedValue([{id_vehicle: 1}, {id_vehicle: 2}] as Vehicles[]);

            const result = await vehicleService.getVehicles();

            expect(result).toHaveLength(2);
        });
    });

    describe('deleteVehicle', () => {
        it('should delete vehicle if it exists', async () => {
            mockVehicleDAO.getVehicleById.mockResolvedValue({id_vehicle: 1} as Vehicles);
            mockVehicleDAO.deleteVehicle.mockResolvedValue({id_vehicle: 1} as Vehicles);

            const result = await vehicleService.deleteVehicle(1);
            expect(result).toEqual({id_vehicle: 1});
        });

        it('should throw error if vehicle does not exist', async () => {
            mockVehicleDAO.getVehicleById.mockResolvedValue(null);

            await expect(vehicleService.deleteVehicle(1)).rejects.toThrow('Le vehicule avec l\'id 1 est introuvable');
        });
    });
});
