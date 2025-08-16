import express, { Request, Response } from 'express';
import AdminController from "../controllers/admin.controller";

const router = express.Router();
const adminController = new AdminController();

//Routes pour le menu administrateur
router.put('/toggleUserStatus/:id', (req: Request, res: Response) => {
    adminController.toggleUserStatus(req, res);
});
router.post('/activateUserAccount', (req: Request, res: Response) => {
    adminController.activateUserAccount(req, res);
});
router.post("/lockUnlockUser", (req: Request, res: Response) => {
    adminController.lockUnlockUser(req, res);
});
export default router;