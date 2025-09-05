
import TripService from '../trip.service';
import TripDAO from '../../dao/trip.dao';
import VehicleService from '../vehicle.service';
import KeyService from '../key.service';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import {Messages} from "../../command/messages";

jest.mock('../../dao/trip.dao');
jest.mock('../vehicle.service');
jest.mock('../key.service');

describe('TripService - Vehicle Return', () => {
    let tripService: TripService;
    let mockedTripDAO: jest.Mocked<TripDAO>;
    let mockedVehicleService: jest.Mocked<VehicleService>;
    let mockedKeyService: jest.Mocked<KeyService>;

    beforeEach(() => {
        jest.clearAllMocks();
        tripService = new TripService();
        mockedTripDAO = (TripDAO as jest.MockedClass<typeof TripDAO>).mock.instances[0] as jest.Mocked<TripDAO>;
        mockedVehicleService = (VehicleService as jest.MockedClass<typeof VehicleService>).mock.instances[0] as jest.Mocked<VehicleService>;
        mockedKeyService = KeyService.prototype as jest.Mocked<KeyService>;
    });

    describe('returnVehicle', () => {
        const mockTrip = {
            id_trip: 1,
            id_vehicle: 1,
            id_used_key: 1,
            id_driver: 1,
            start_date: new Date('2024-01-01T10:00:00Z'),
            end_date: new Date('2025-01-01T18:00:00Z'), // Future date
            departure_agency: 1,
            arrival_agency: 2,
            reservation_status: 'confirmed',
            carpooling: false
        };

        const mockVehicle = {
            id_vehicle: 1,
            brand: 'Toyota',
            model: 'Yaris',
            fuelTypeId: 1,
            license_plate: 'ABC-123',
            mileage: 50000,
            seat_count: 5,
            agency_id: 1,
            available: false,
            fuel_capacity: 45,
            transmissionId: 1
        };

        const returnData = {
            mileage: 52000,
            current_location_agency_id: 2,
            key_location_id: 3
        };

        it('should successfully return a vehicle', async () => {
            mockedTripDAO.getTripById.mockResolvedValue(mockTrip as any);
            mockedVehicleService.getVehicleById.mockResolvedValue(mockVehicle as any);
            mockedVehicleService.updateVehicle.mockResolvedValue({ ...mockVehicle, mileage: 52000, available: true } as any);
            mockedKeyService.updateKey.mockResolvedValue({
                id_key: 1,
                key_name: 'Key1',
                keyLocationId: 3,
                vehicleKeyId: 1
            } as any);
            mockedTripDAO.updateTrip.mockResolvedValue({ ...mockTrip, reservation_status: 'completed' } as any);

            const result = await tripService.returnVehicle(1, returnData);

            expect(mockedTripDAO.getTripById).toHaveBeenCalledWith(1);
            expect(mockedVehicleService.getVehicleById).toHaveBeenCalledWith(1);
            expect(mockedVehicleService.updateVehicle).toHaveBeenCalledWith(1, {
                ...mockVehicle,
                mileage: 52000,
                available: true
            });
            expect(mockedKeyService.updateKey).toHaveBeenCalledWith(1, {
                keyLocationId: 3
            });
            expect(mockedTripDAO.updateTrip).toHaveBeenCalledWith(1, {
                end_date: expect.any(Date),
                arrival_agency: 2,
                reservation_status: 'completed'
            });
            expect(result.message).toBe('Véhicule restitué avec succès');
        });

        it('should throw error if trip not found', async () => {
            mockedTripDAO.getTripById.mockResolvedValue(null);

            await expect(tripService.returnVehicle(1, returnData)).rejects.toThrow('Voyage non trouvé');
        });

        it('should throw error if vehicle not found', async () => {
            const futureTripMock = { ...mockTrip, end_date: new Date('2025-01-01T18:00:00Z') };
            mockedTripDAO.getTripById.mockResolvedValue(futureTripMock as any);
            mockedVehicleService.getVehicleById.mockResolvedValue(null);

            await expect(tripService.returnVehicle(1, returnData)).rejects.toThrow(Messages.Vehicle.NOT_FOUND(futureTripMock.id_vehicle));
        });

        it('should throw error if trip is already completed', async () => {
            const pastTrip = {
                ...mockTrip,
                end_date: new Date('2024-01-01T08:00:00Z') // Past end date
            };
            mockedTripDAO.getTripById.mockResolvedValue(pastTrip as any);

            await expect(tripService.returnVehicle(1, returnData)).rejects.toThrow('Ce voyage est déjà terminé');
        });
    });

    describe('getActiveTripByVehicle', () => {
        it('should return active trip for vehicle', async () => {
            const mockTrip = { id_trip: 1, id_vehicle: 1 };
            mockedTripDAO.getActiveTripByVehicle.mockResolvedValue(mockTrip as any);

            const result = await tripService.getActiveTripByVehicle(1);

            expect(mockedTripDAO.getActiveTripByVehicle).toHaveBeenCalledWith(1);
            expect(result).toBe(mockTrip);
        });
    });
});
