import { agencyService } from '../agency.service';
import { agencyDao } from '../../dao/agency.dao';
import { Agencies } from '@prisma/client';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../dao/agency.dao');

const mockedDao = agencyDao as jest.Mocked<typeof agencyDao>;

describe('agencyService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createAgency', () => {
    it('should create an agency if name is unique', async () => {
      mockedDao.getAgencies.mockResolvedValue([]);
      mockedDao.createAgency.mockResolvedValue({
        id_agency: 101,
        city: 'New City',
        postal_code: 12345,
        street: 'New Street',
        additional_info: 'Additional Info',
        phone: '123-456-7890',
        head_office: true,
      } as Agencies);

      const result = await agencyService.createAgency({
        city: 'New City',
        postal_code: 12345,
        street: 'New Street',
        additional_info: 'Additional Info',
        phone: '123-456-7890',
        head_office: true,
      });

      expect(mockedDao.createAgency).toHaveBeenCalled();
      expect(result).toEqual({
        id_agency: 101,
        city: 'New City',
        postal_code: 12345,
        street: 'New Street',
        additional_info: 'Additional Info',
        phone: '123-456-7890',
        head_office: true,
      });
    });

    it('should throw error if agency name exists', async () => {
      mockedDao.getAgencies.mockResolvedValue([
        {
          id_agency: 101,
          city: 'Existing City',
          postal_code: 54321,
          street: 'Existing Street',
          additional_info: 'Existing Info',
          phone: '987-654-3210',
          head_office: false,
        } as Agencies,
      ]);

      await expect(
        agencyService.createAgency({
          city: 'Existing City',
          postal_code: 54321,
          street: 'Existing Street',
          additional_info: 'Existing Info',
          phone: '987-654-3210',
          head_office: false,
        })
      ).rejects.toThrow('An agency with this name already exists');
    });
  });

  describe('updateAgency', () => {
    it('should update an agency if it exists', async () => {
      mockedDao.getAgencyById.mockResolvedValue({
        id_agency: 101,
        city: 'Old City',
        postal_code: 11111,
        street: 'Old Street',
        additional_info: 'Old Info',
        phone: '111-222-3333',
        head_office: false,
      } as Agencies);

      mockedDao.updateAgency.mockResolvedValue({
        id_agency: 101,
        city: 'Updated City',
        postal_code: 54321,
        street: 'Updated Street',
        additional_info: 'Updated Info',
        phone: '987-654-3210',
        head_office: true,
      } as Agencies);

      const result = await agencyService.updateAgency(101, {
        city: 'Updated City',
        postal_code: 54321,
        street: 'Updated Street',
        additional_info: 'Updated Info',
        phone: '987-654-3210',
        head_office: true,
      });

      expect(result).toEqual({
        id_agency: 101,
        city: 'Updated City',
        postal_code: 54321,
        street: 'Updated Street',
        additional_info: 'Updated Info',
        phone: '987-654-3210',
        head_office: true,
      });
    });

    it('should throw error if agency does not exist', async () => {
      mockedDao.getAgencyById.mockResolvedValue(null);

      await expect(
        agencyService.updateAgency(101, {
          city: 'Nonexistent City',
          postal_code: 99999,
          street: 'Nonexistent Street',
          additional_info: 'Nonexistent Info',
          phone: '000-000-0000',
          head_office: false,
        })
      ).rejects.toThrow('Agency with id 101 not found');
    });
  });

  describe('getAgencies', () => {
    it('should return list of agencies from dao', async () => {
      mockedDao.getAgencies.mockResolvedValue([
        {
          id_agency: 101,
          city: 'City A',
          postal_code: 12345,
          street: 'Street A',
          additional_info: 'Info A',
          phone: '123-456-7890',
          head_office: true,
        },
        {
          id_agency: 102,
          city: 'City B',
          postal_code: 54321,
          street: 'Street B',
          additional_info: 'Info B',
          phone: '987-654-3210',
          head_office: false,
        },
      ] as Agencies[]);

      const result = await agencyService.getAgencies();

      expect(result).toHaveLength(2);
      expect(result).toEqual([
        {
          id_agency: 101,
          city: 'City A',
          postal_code: 12345,
          street: 'Street A',
          additional_info: 'Info A',
          phone: '123-456-7890',
          head_office: true,
        },
        {
          id_agency: 102,
          city: 'City B',
          postal_code: 54321,
          street: 'Street B',
          additional_info: 'Info B',
          phone: '987-654-3210',
          head_office: false,
        },
      ]);
    });
  });

  describe('deleteAgency', () => {
    it('should delete agency if it exists', async () => {
      mockedDao.getAgencyById.mockResolvedValue({
        id_agency: 101,
        city: 'City A',
        postal_code: 12345,
        street: 'Street A',
        additional_info: 'Info A',
        phone: '123-456-7890',
        head_office: true,
      } as Agencies);

      mockedDao.deleteAgency.mockResolvedValue({
        id_agency: 101,
        city: 'City A',
        postal_code: 12345,
        street: 'Street A',
        additional_info: 'Info A',
        phone: '123-456-7890',
        head_office: true,
      } as Agencies);

      const result = await agencyService.deleteAgency(101);

      expect(result).toEqual({
        id_agency: 101,
        city: 'City A',
        postal_code: 12345,
        street: 'Street A',
        additional_info: 'Info A',
        phone: '123-456-7890',
        head_office: true,
      });
    });

    it('should throw error if agency does not exist', async () => {
      mockedDao.getAgencyById.mockResolvedValue(null);

      await expect(agencyService.deleteAgency(99)).rejects.toThrow('Agency with id 99 not found');
    });
  });
});