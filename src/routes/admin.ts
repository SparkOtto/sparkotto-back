// @ts-ignore
import express from 'express';
import AdminController from "../controllers/admin.controller";

const router = express.Router();
const adminController = new AdminController();

//Routes pour le menu administrateur
router.post('/toggleUserStatus', (req, res) => adminController.toggleUserStatus(req, res));

export default router;