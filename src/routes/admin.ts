import express, { Request, Response } from 'express';
import AdminController from "../controllers/admin.controller";

const router = express.Router();
const adminController = new AdminController();

//Routes pour le menu administrateur
router.put('/toggleUserStatus', (req: Request, res: Response) => {
    adminController.toggleUserStatus(req, res);
});
router.post('/activateUserAccount', (req: Request, res: Response) => {
    adminController.activateUserAccount(req, res);
})
export default router;