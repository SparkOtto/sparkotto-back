import express from 'express';
import UserController from '../controllers/user.controller';

const router = express.Router();
const userController = new UserController();

// Routes pour les utilisateurs
router.post('/users', (req, res) => userController.createUser(req, res));
router.get('/users/:id', (req, res) => userController.getUserById(req, res));
router.get('/users', (req, res) => userController.getAllUsers(req, res));
router.put('/users/:id', (req, res) => userController.updateUser(req, res));
router.delete('/users/:id', (req, res) => userController.deleteUser(req, res));
router.get('/users/search', (req, res) => userController.searchUsers(req, res));
router.get('/users/paginate', (req, res) => userController.paginateUsers(req, res));

export default router;


