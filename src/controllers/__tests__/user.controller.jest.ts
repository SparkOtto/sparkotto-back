import { Request, Response } from 'express';
import UserController from '../user.controller';
import UserService from '../../services/user.service';
import { User } from '@prisma/client';
import { describe, expect, jest, test, beforeEach } from '@jest/globals';

jest.mock('../../services/user.service');

describe('UserController', () => {
    let userController: UserController;
    let userService: jest.Mocked<UserService>;
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        userService = {
            createUser: jest.fn(),
            getUserById: jest.fn(),
            getAllUsers: jest.fn(),
            deleteUser: jest.fn(),
        } as unknown as jest.Mocked<UserService>;

        userController = new UserController();
        userController['userService'] = userService;

        req = {};
        res = {
            status: jest.fn().mockReturnThis() as jest.MockedFunction<Response['status']>,
            json: jest.fn() as jest.MockedFunction<Response['json']>,
            send: jest.fn() as jest.MockedFunction<Response['send']>,
        };
    });

    describe('createUser', () => {
        test('should create a new user and return it', async () => {
            const newUser: User = { id_user: 1, email: 'test@test.com', first_name: 'Test', password: 'hashedPassword', last_name: '', phone_number: null, roleId: 0, agency_id: null, license_number: null, failed_attempts: null, account_locked: false, active: false, deactivation_date: null };
            userService.createUser.mockResolvedValue(newUser);

            req.body = { email: 'test@test.com', first_name: 'Test', password: 'password123' };

            await userController.createUser(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(newUser);
        });

        test('should return 400 if an error occurs', async () => {
            userService.createUser.mockRejectedValue(new Error('Invalid data'));

            req.body = { email: 'test@test.com' };

            await userController.createUser(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid data' });
        });
    });

    describe('getUserById', () => {
        test('should return a user by id', async () => {
            const user: User = { id_user: 1, email: 'test@test.com', first_name: 'Test', password: 'hashedPassword', last_name: '', phone_number: null, roleId: 0, agency_id: null, license_number: null, failed_attempts: null, account_locked: false, active: false, deactivation_date: null };
            userService.getUserById.mockResolvedValue(user);

            req.params = { id: '1' };

            await userController.getUserById(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(user);
        });

        test('should return 404 if user not found', async () => {
            userService.getUserById.mockResolvedValue(null);

            req.params = { id: '1' };

            await userController.getUserById(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Utilisateur non trouvé' });
        });
    });

    describe('getAllUsers', () => {
        test('should return a list of users', async () => {
            const users: User[] = [
                { id_user: 1, email: 'test1@test.com', first_name: 'User1', password: 'hashedPassword1', last_name: '', phone_number: null, roleId: 0, agency_id: null, license_number: null, failed_attempts: null, account_locked: false, active: false, deactivation_date: null },
                { id_user: 2, email: 'test2@test.com', first_name: 'User2', password: 'hashedPassword2', last_name: '', phone_number: null, roleId: 0, agency_id: null, license_number: null, failed_attempts: null, account_locked: false, active: false, deactivation_date: null },
            ];
            userService.getAllUsers.mockResolvedValue(users);

            await userController.getAllUsers(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(users);
        });

        test('should return an empty list if no users are found', async () => {
            userService.getAllUsers.mockResolvedValue([]);

            await userController.getAllUsers(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([]);
        });
    });

    describe('deleteUser', () => {
        test('should delete a user and return 204', async () => {
            userService.deleteUser.mockResolvedValue({ id_user: 1, email: 'test@test.com', first_name: 'Test', password: 'hashedPassword', last_name: '', phone_number: null, roleId: 0, agency_id: null, license_number: null, failed_attempts: null, account_locked: false, active: false, deactivation_date: null });

            req.params = { id: '1' };

            await userController.deleteUser(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalled();
        });

        test('should return 404 if user not found', async () => {
            userService.deleteUser.mockRejectedValue(new Error('Utilisateur non trouvé'));

            req.params = { id: '1' };

            await userController.deleteUser(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Utilisateur non trouvé' });
        });
    });
});