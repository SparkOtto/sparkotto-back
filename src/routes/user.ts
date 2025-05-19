import express from 'express';
import UserController from '../controllers/user.controller';

const router = express.Router();
const userController = new UserController();

// Routes pour les utilisateurs
router.post('/', (req, res) => userController.createUser(req, res));
router.get('/:id', (req, res) => userController.getUserById(req, res));
router.get('/', (req, res) => userController.getAllUsers(req, res));
router.put('/:id', (req, res) => userController.updateUser(req, res));
router.delete('/:id', (req, res) => userController.deleteUser(req, res));
router.get('/search', (req, res) => userController.searchUsers(req, res));
router.get('/paginate', (req, res) => userController.paginateUsers(req, res));

export default router;

