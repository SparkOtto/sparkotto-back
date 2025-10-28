import { PrismaClient, Agencies } from '@prisma/client';
import { Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const agencyDao = {
  async createAgency(data: Prisma.AgenciesCreateInput): Promise<Agencies> {
    return await prisma.agencies.create({
      data: {
        ...data,
        additional_info: data.additional_info ?? null,
      },
    });
  },

  async updateAgency(id_agency: number, data: Partial<Omit<Agencies, 'id_agency'>>): Promise<Agencies | null> {
    return await prisma.agencies.update({
      where: { id_agency },
      data,
    });
  },

  async deleteAgency(id_agency: number): Promise<Agencies> {
    return await prisma.agencies.delete({
      where: { id_agency },
    });
  },

  async getAgencies(): Promise<Agencies[]> {
    return prisma.agencies.findMany();
  },
  

  async getAgencyById(id_agency: number): Promise<Agencies | null> {
    return await prisma.agencies.findUnique({ where: { id_agency } });
  },

  async getAgencyByCity(city: string): Promise<Agencies[]> {
    return await prisma.agencies.findMany({
      where: { city },
    });
  }
};
