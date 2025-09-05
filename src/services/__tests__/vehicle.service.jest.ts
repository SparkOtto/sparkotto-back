import VehicleService from '../vehicle.service';
import VehicleDAO from '../../dao/vehicle.dao';
import {Vehicles} from '@prisma/client';
import {beforeEach, describe, expect, it, jest} from "@jest/globals";
import {Messages} from "../../command/messages";
import TripDAO from "../../dao/trip.dao";

jest.mock('../../dao/vehicle.dao');
jest.mock('../../dao/trip.dao');

describe('VehicleService', () => {
    let vehicleService: VehicleService;
    let mockVehicleDAO: jest.Mocked<VehicleDAO>;
    let mockedTripDAO: jest.Mocked<TripDAO>;

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

        mockedTripDAO = {
            getTripsByVehicle: jest.fn(),
        } as any;

        // Mock the constructor to return our mock
        (VehicleDAO as jest.MockedClass<typeof VehicleDAO>).mockImplementation(() => mockVehicleDAO);
        (TripDAO as jest.MockedClass<typeof TripDAO>).mockImplementation(() => mockedTripDAO);
        vehicleService = new VehicleService();
    });

    describe('createVehicle', () => {
        it('should create a vehicle if license plate is unique', async () => {
            mockVehicleDAO.getVehicles.mockResolvedValue([]);
            mockVehicleDAO.createVehicle.mockResolvedValue({id_vehicle: 1, license_plate: 'AA-123-BB',
                brand: 'Toyota',
                model: 'Yaris',
                fuelTypeId: 1,
                mileage: 50000,
                seat_count: 5,
                agency_id: 1,
                available: true,
                fuel_capacity: 45,
                transmissionId: 1
            } as Vehicles);

            const result = await vehicleService.createVehicle({
                brand: 'Toyota',
                model: 'Yaris',
                license_plate: 'AA-123-BB',
                mileage: 50000,
                fuelTypeId: 1,
                transmissionId: 1,
                agency_id: 1,
                seat_count: 5,
                available: true,
                fuel_capacity: 45
            } as any);

            expect(mockVehicleDAO.createVehicle).toHaveBeenCalled();
            expect(result).toEqual({id_vehicle: 1, license_plate: 'AA-123-BB',
                brand: 'Toyota',
                model: 'Yaris',
                fuelTypeId: 1,
                mileage: 50000,
                seat_count: 5,
                agency_id: 1,
                available: true,
                fuel_capacity: 45,
                transmissionId: 1});
        });

        it('should throw error if license plate exists', async () => {
            mockVehicleDAO.getVehicles.mockResolvedValue([{license_plate: 'AA-123-BB'} as Vehicles]);

            await expect(vehicleService.createVehicle({license_plate: 'AA-123-BB'} as any)).rejects.toThrow(Messages.Vehicle.LICENSE_PLATE_EXISTS);
        });
    });

    describe('updateVehicle', () => {
        it('should update a vehicle if it exists', async () => {
            const vehicleUpdate = {
                id_vehicle: 1,
                brand: 'Peugeot',
                model: '208',
                fuelTypeId: 1,
                license_plate: 'AA-123-BB',
                mileage: 60000,
                seat_count: 5,
                agency_id: 1,
                available: true,
                fuel_capacity: 50,
                transmissionId: 1
            };
            mockVehicleDAO.getVehicleById.mockResolvedValue(vehicleUpdate as Vehicles);
            mockVehicleDAO.updateVehicle.mockResolvedValue(vehicleUpdate as Vehicles);

            const result = await vehicleService.updateVehicle(1, vehicleUpdate);

            expect(result).toEqual(vehicleUpdate);
        });

        it('should throw error if vehicle does not exist', async () => {
            mockVehicleDAO.getVehicleById.mockResolvedValue(null);
            const emptyVehicle = {
                id_vehicle: 1,
                brand: '',
                model: '',
                fuelTypeId: 1,
                license_plate: '',
                mileage: 0,
                seat_count: 0,
                agency_id: 1,
                available: false,
                fuel_capacity: null,
                transmissionId: 1
            };

            await expect(vehicleService.updateVehicle(1, emptyVehicle)).rejects.toThrow(Messages.Vehicle.NOT_FOUND(1));
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
            mockedTripDAO.getTripsByVehicle.mockResolvedValue([]);
            mockVehicleDAO.deleteVehicle.mockResolvedValue({id_vehicle: 1} as Vehicles);

            const result = await vehicleService.deleteVehicle(1);
            expect(result).toEqual({id_vehicle: 1});
        });
        it('should throw error if vehicle has active trips', async () => {
            mockVehicleDAO.getVehicleById.mockResolvedValue({id_vehicle: 1} as Vehicles);
            mockedTripDAO.getTripsByVehicle.mockResolvedValue([{id_trip: 1, status: 'active'}] as any);

            await expect(vehicleService.deleteVehicle(1)).rejects.toThrow(Messages.Vehicle.DELETE_FAILED(1));
        });
        it('should throw error if vehicle does not exist', async () => {
            mockVehicleDAO.getVehicleById.mockResolvedValue(null);

            await expect(vehicleService.deleteVehicle(99)).rejects.toThrow(Messages.Vehicle.NOT_FOUND(99));
        });
    });
});
