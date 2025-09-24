import { Request, Response } from 'express';
import AgencyController from '../agency.controller';
import { agencyService } from '../../services/agency.service';
import { Agencies } from '@prisma/client';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../services/agency.service');

describe('AgencyController', () => {
  let agencyController: AgencyController;
  let mockedAgencyService = agencyService as jest.Mocked<typeof agencyService>;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    agencyController = new AgencyController();
    mockedAgencyService = agencyService as jest.Mocked<typeof agencyService>;

    req = {};
    res = {
      status: jest.fn().mockReturnThis() as jest.MockedFunction<Response['status']>,
      json: jest.fn() as jest.MockedFunction<Response['json']>,
      send: jest.fn() as jest.MockedFunction<Response['send']>,
    };
  });

  describe('createAgency', () => {
    it('should create an agency and return it', async () => {
      const createdAgency: Agencies = {
        id_agency: 1,
        city: 'Paris',
        postal_code: 75001,
        street: 'Rue de Rivoli',
        additional_info: 'Near Louvre',
        phone: '0123456789',
        head_office: true,
      };
      mockedAgencyService.createAgency.mockResolvedValue(createdAgency);

      req.body = { city: 'Paris', postal_code: '75001' };

      await agencyController.createAgency(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdAgency);
    });

    it('should return 400 if service throws', async () => {
      mockedAgencyService.createAgency.mockRejectedValue(new Error('Invalid data'));
      req.body = { city: '' };

      await agencyController.createAgency(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid data' });
    });
  });

  describe('deleteAgency', () => {
    it('should delete an agency and return it', async () => {
      mockedAgencyService.deleteAgency.mockResolvedValue({
        id_agency: 1,
        city: 'Paris',
        postal_code: 75001,
        street: 'Rue de Rivoli',
        additional_info: 'Near Louvre',
        phone: '0123456789',
        head_office: true,
      });
      req.params = { id: '1' };

      await agencyController.deleteAgency(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        id_agency: 1,
        city: 'Paris',
        postal_code: 75001,
        street: 'Rue de Rivoli',
        additional_info: 'Near Louvre',
        phone: '0123456789',
        head_office: true,
      });
    });

    it('should return 404 if agency not found', async () => {
      mockedAgencyService.deleteAgency.mockRejectedValue(new Error('Agency not found'));
      req.params = { id: '1' };

      await agencyController.deleteAgency(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Agency not found' });
    });
  });
});
