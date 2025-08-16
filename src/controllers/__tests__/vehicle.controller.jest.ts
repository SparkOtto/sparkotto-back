import { Request, Response } from 'express';
import VehicleController from '../vehicle.controller';
import { vehicleService } from '../../services/vehicle.service';
import { Vehicles } from '@prisma/client';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';


jest.mock('../../services/vehicle.service');

describe('VehicleController', () => {
  let vehicleController: VehicleController;
  let mockedVehicleService = vehicleService as jest.Mocked<typeof vehicleService>;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    vehicleController = new VehicleController();
    mockedVehicleService = vehicleService as jest.Mocked<typeof vehicleService>;



    req = {};
    res = {
      status: jest.fn().mockReturnThis() as jest.MockedFunction<Response['status']>,
      json: jest.fn() as jest.MockedFunction<Response['json']>,
      send: jest.fn() as jest.MockedFunction<Response['send']>,
    };
  });

  describe('createVehicle', () => {
    it('should create a vehicle and return it', async () => {
      const createdVehicle : Vehicles ={
        id_vehicle: 4,
        brand: "Toyota",
        model: "Yaris",
        fuelTypeId: 1,
        license_plate: "GH-111-IJ",
        mileage: 80000,
        seat_count: 4,
        agency_id: 2,
        available: true,
        fuel_capacity: 42,
        transmissionId: 1
    };
      mockedVehicleService.createVehicle.mockResolvedValue(createdVehicle);

      req.body = { license_plate: 'XX-000-YY' };

      await vehicleController.createVehicle(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdVehicle);
    });

    it('should return 400 if service throws', async () => {
      mockedVehicleService.createVehicle.mockRejectedValue(new Error('Invalid data'));
      req.body = { license_plate: 'INVALID' };

      await vehicleController.createVehicle(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid data' });
    });
  });

  describe('deleteVehicle', () => {
    it('should delete a vehicle and return it', async () => {
      mockedVehicleService.deleteVehicle.mockResolvedValue({
        id_vehicle: 4,
        brand: "Toyota",
        model: "Yaris",
        fuelTypeId: 1,
        license_plate: "GH-111-IJ",
        mileage: 80000,
        seat_count: 4,
        agency_id: 2,
        available: true,
        fuel_capacity: 42,
        transmissionId: 1
    });
      req.params = { id: '1' };

      await vehicleController.deleteVehicle(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        id_vehicle: 4,
        brand: "Toyota",
        model: "Yaris",
        fuelTypeId: 1,
        license_plate: "GH-111-IJ",
        mileage: 80000,
        seat_count: 4,
        agency_id: 2,
        available: true,
        fuel_capacity: 42,
        transmissionId: 1
    });
    });

    it('should return 404 if vehicle not found', async () => {
      mockedVehicleService.deleteVehicle.mockRejectedValue(new Error('Vehicle not found'));
      req.params = { id: '1' };

      await vehicleController.deleteVehicle(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Vehicle not found' });
    });
  });
});
