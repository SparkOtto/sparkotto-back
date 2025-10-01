import { agencyDao } from '../dao/agency.dao';
import { Agencies } from '@prisma/client';
import { Prisma } from '@prisma/client';

export const agencyService = {
  async createAgency(input: Prisma.AgenciesCreateInput): Promise<Agencies> {
    const isAgencyExists = await agencyDao.getAgencyByCity(input.city);
    if (isAgencyExists.length > 0) {
      throw new Error(`Agency in city ${input.city} already exists`);
    }
    if(!input.city || !input.street || !input.postal_code) {
        throw new Error('les champs obligatoires pour l\'agence ne sont pas tous remplis');
    }
    const newAgency = await agencyDao.createAgency(input);
    if (!newAgency) {
      throw new Error('Failed to create agency');
    }
    return newAgency;
  },

  async updateAgency(id: number, update: Partial<Omit<Agencies, 'id_agency'>>): Promise<Agencies> {
    const agency = await agencyDao.getAgencyById(id);
    if (!agency) {
      throw new Error(`Agency with id ${id} not found`);
    }
      if(!update.city || !update.street || !update.postal_code) {
          throw new Error('les champs obligatoires pour l\'agence ne sont pas tous remplis');
      }
    const updatedAgency = await agencyDao.updateAgency(id, update);
    if (!updatedAgency) {
      throw new Error(`Failed to update agency with id ${id}`);
    }

    return updatedAgency;
  },

  async deleteAgency(id: number): Promise<Agencies> {
    const agency = await agencyDao.getAgencyById(id);
    if (!agency) {
      throw new Error(`Agency with id ${id} not found`);
    }

    return await agencyDao.deleteAgency(id);
  },

  async getAgencies(): Promise<Agencies[]> {
    return agencyDao.getAgencies();
  },

  async getAgencyById(id: number): Promise<Agencies | null> {
    const agency = await agencyDao.getAgencyById(id);
    if (!agency) {
      throw new Error(`Agency with id ${id} not found`);
    }

    return agency;
  },

  async getAgencyByCity(city: string): Promise<Agencies[]> {
    const agency = await agencyDao.getAgencyByCity(city);
    if (agency.length === 0) {
      throw new Error(`No agency found in city ${city}`);
    }
    return agency;
  }

};
