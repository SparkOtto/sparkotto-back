import {vehicleService} from '../vehicle.service';
import {vehicleDao} from '../../dao/vehicle.dao';
import {Vehicles} from '@prisma/client';
import {beforeEach, describe, expect, it, jest} from "@jest/globals";


jest.mock('../../dao/vehicle.dao');

const mockedDao = vehicleDao as jest.Mocked<typeof vehicleDao>;

describe('vehicleService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createVehicle', () => {
        it('should create a vehicle if license plate is unique', async () => {
            mockedDao.getVehicles.mockResolvedValue([]);
            mockedDao.createVehicle.mockResolvedValue({id_vehicle: 1, license_plate: 'AA-123-BB'} as Vehicles);

            const result = await vehicleService.createVehicle({} as any);

            expect(mockedDao.createVehicle).toHaveBeenCalled();
            expect(result).toEqual({id_vehicle: 1, license_plate: 'AA-123-BB'});
        });

        it('should throw error if license plate exists', async () => {
            mockedDao.getVehicles.mockResolvedValue([{license_plate: 'AA-123-BB'} as Vehicles]);

            await expect(vehicleService.createVehicle({license_plate: 'AA-123-BB'} as any)).rejects.toThrow('A vehicle with this license plate already exists');
        });
    });

    describe('updateVehicle', () => {
        it('should update a vehicle if it exists', async () => {
            mockedDao.getVehicleById.mockResolvedValue({id_vehicle: 1} as Vehicles);
            mockedDao.updateVehicle.mockResolvedValue({id_vehicle: 1, mileage: 60000} as Vehicles);

            const result = await vehicleService.updateVehicle(1, {mileage: 60000});

            expect(result).toEqual({id_vehicle: 1, mileage: 60000});
        });

        it('should throw error if vehicle does not exist', async () => {
            mockedDao.getVehicleById.mockResolvedValue(null);

            await expect(vehicleService.updateVehicle(1, {})).rejects.toThrow('Vehicle with id 1 not found');
        });
    });

    describe('getVehicleById', () => {
        it('should return vehicle by id if it exists', async () => {
                mockedDao.getVehicleById.mockResolvedValue({id_vehicle: 1, license_plate: 'AA-123-BB'} as Vehicles);

                const result = await vehicleService.getVehicleById(1);

                expect(result).toEqual({id_vehicle: 1, license_plate: 'AA-123-BB'});
            }
        );
    });

    describe('getVehicles', () => {
        it('should return list of vehicles from dao', async () => {
            mockedDao.getVehicles.mockResolvedValue([{id_vehicle: 1}, {id_vehicle: 2}] as Vehicles[]);

            const result = await vehicleService.getVehicles();

            expect(result).toHaveLength(2);
        });
    });

    describe('deleteVehicle', () => {
        it('should delete vehicle if it exists', async () => {
            mockedDao.getVehicleById.mockResolvedValue({id_vehicle: 1} as Vehicles);
            mockedDao.deleteVehicle.mockResolvedValue({id_vehicle: 1} as Vehicles);

            const result = await vehicleService.deleteVehicle(1);
            expect(result).toEqual({id_vehicle: 1});
        });

        it('should throw error if vehicle does not exist', async () => {
            mockedDao.getVehicleById.mockResolvedValue(null);

            await expect(vehicleService.deleteVehicle(99)).rejects.toThrow('Vehicle with id 99 not found');
        });
    });
});
