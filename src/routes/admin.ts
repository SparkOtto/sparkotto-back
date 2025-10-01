import express, { Request, Response } from 'express';
import AdminController from "../controllers/admin.controller";
import { authenticateToken, authorizeRoles } from '../middlewares/auth';

const router = express.Router();
const adminController = new AdminController();

//Routes pour le menu administrateur
router.put(
    '/toggleUserStatus/:id',
    authenticateToken,
    authorizeRoles(['admin']),
    (req, res) => {
        adminController.toggleUserStatus(req, res);
    }
);
router.post(
    "/lockUnlockUser",
    authenticateToken,
    authorizeRoles(['admin']),
    (req, res) => {
        adminController.lockUnlockUser(req, res);
    }
);


export default router;