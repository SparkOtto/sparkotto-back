import { Request, Response } from 'express';
import { vehicleService } from '../services/vehicle.service';

class VehicleController {
  // POST /api/vehicles
  async createVehicle(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      const created = await vehicleService.createVehicle(data);
      res.status(201).json(created);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // PUT /api/vehicles/:id
  async updateVehicle(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const data = req.body;
      const updated = await vehicleService.updateVehicle(id, data);
      res.status(200).json(updated);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  // GET /api/vehicles
  async getVehicles(req: Request, res: Response): Promise<void> {
    try {
      const filters = {
        available: req.query.available ? req.query.available === 'true' : undefined,
        agency_id: req.query.agency_id ? parseInt(req.query.agency_id as string) : undefined,
        minMileage: req.query.minMileage ? parseInt(req.query.minMileage as string) : undefined,
        maxMileage: req.query.maxMileage ? parseInt(req.query.maxMileage as string) : undefined,
        model: req.query.model as string,
      };
      const list = await vehicleService.getVehicles(filters);
      res.status(200).json(list);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteVehicle(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const deleted = await vehicleService.deleteVehicle(id);
      res.status(200).json(deleted);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

}

export default VehicleController;
