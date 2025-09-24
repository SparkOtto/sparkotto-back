import express from 'express';
import UserController from '../controllers/user.controller';
import { authenticateToken, CustomRequest } from '../middlewares/auth';

const router = express.Router();
const userController = new UserController();

// Routes pour les utilisateurs

router.post('/', authenticateToken, (req, res) => userController.createUser(req, res));
router.get('/:id', authenticateToken, (req, res) => userController.getUserById(req, res));
router.get('/', authenticateToken, (req, res) => userController.getAllUsers(req, res));
router.put('/:id', authenticateToken, (req, res) => userController.updateUser(req, res));
router.delete('/:id', authenticateToken, (req, res) => userController.deleteUser(req, res));
router.get('/search', authenticateToken, (req, res) => userController.searchUsers(req, res));
router.get('/paginate', authenticateToken, (req, res) => userController.paginateUsers(req, res));
router.post('/change-password/:id', authenticateToken, (req, res) => userController.changePassword(req, res));

export default router;

