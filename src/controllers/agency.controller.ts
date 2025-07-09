import { Request, Response } from 'express';
import { agencyService } from '../services/agency.service';

class AgencyController {
  // POST /api/agencies
  async createAgency(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      const created = await agencyService.createAgency(data);
      res.status(201).json(created);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // PUT /api/agencies/:id
  async updateAgency(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const data = req.body;
      const updated = await agencyService.updateAgency(id, data);
      res.status(200).json(updated);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  // GET /api/agencies
  async getAgencies(req: Request, res: Response): Promise<void> {
    try {
      const users = await agencyService.getAgencies();

      //const users = 'test';
      res.status(200).json(users);
    } catch (error: any) {
      res.status(500).json({ message: 'Erreur serveur pour l\'obtention de toutes les agences' });
    }
  }

  // GET /api/agencies/:id
  async getAgencyById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const agency = await agencyService.getAgencyById(id);
      res.status(200).json(agency);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  // GET /api/agencies/:city
  async getAgenciesByCity(req: Request, res: Response): Promise<void> {
    try {
      const city = req.params.city;
      const agencies = await agencyService.getAgencies();
      const filteredAgencies = agencies.filter(agency => agency.city.toLowerCase() === city.toLowerCase());
      if (filteredAgencies.length === 0) {
        res.status(404).json({ message: 'No agencies found in this city' });
        return;
      }
      res.status(200).json(filteredAgencies);
    } catch (error: any) {
      res.status(500).json({ message: 'Error retrieving agencies by city' });
    }
  }

  // DELETE /api/agencies/:id
  async deleteAgency(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const deleted = await agencyService.deleteAgency(id);
      res.status(200).json(deleted);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }
}

export default AgencyController;
