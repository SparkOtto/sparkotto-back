// src/controllers/__tests__/user.controller.jest.ts
import { Request, Response } from 'express';
import UserController from '../user.controller';
import UserService from '../../services/user.service';
import { User } from '@prisma/client';
import { describe, expect, jest } from '@jest/globals';
import { beforeEach, it } from 'node:test';

jest.mock('../../services/user.service');

describe('UserController', () => {
    let userController: UserController;
    let userService: jest.Mocked<UserService>;
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        userService = new UserService() as jest.Mocked<UserService>;
        userController = new UserController();
        userController['userService'] = userService;

        req = {};
        res = {
            status: jest.fn().mockReturnThis() as jest.MockedFunction<(code: number) => Response>,
            json: jest.fn().mockReturnThis() as jest.MockedFunction<Response['json']>,
        };
    });

    describe('getUserById', () => {
        it('should return a user by id', async () => {
            const user: User = {
                id_user: 1, email: 'test@test.com', first_name: 'Test User', password: 'password123',
                last_name: '',
                phone_number: null,
                roleId: 0,
                agency_id: null,
                license_number: null,
                failed_attempts: null,
                account_locked: null,
                active: null,
                deactivation_date: null
            };
            userService.getUserById.mockResolvedValue(user);

            req.params = { id: '1' };

            await userController.getUserById(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(user);
        });

        it('should return 404 if user not found', async () => {
            userService.getUserById.mockResolvedValue(null);

            req.params = { id: '1' };

            await userController.getUserById(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Utilisateur non trouvé' });
        });
    });

    describe('getAllUsers', () => {
        it('should return a list of users', async () => {
            const users: User[] = [
                {
                    id_user: 1, email: 'test1@test.com', first_name: 'User 1', password: 'password1',
                    last_name: '',
                    phone_number: null,
                    roleId: 0,
                    agency_id: null,
                    license_number: null,
                    failed_attempts: null,
                    account_locked: null,
                    active: null,
                    deactivation_date: null
                },
                {
                    id_user: 2, email: 'test2@test.com', first_name: 'User 2', password: 'password2',
                    last_name: '',
                    phone_number: null,
                    roleId: 0,
                    agency_id: null,
                    license_number: null,
                    failed_attempts: null,
                    account_locked: null,
                    active: null,
                    deactivation_date: null
                },
            ];
            userService.getAllUsers.mockResolvedValue(users);

            await userController.getAllUsers(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(users);
        });

        it('should return an empty list if no users are found', async () => {
            userService.getAllUsers.mockResolvedValue([]);

            await userController.getAllUsers(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([]);
        });
    });

    describe('createUser', () => {
        it('should create a new user and return it', async () => {
            const newUser: User = {
                id_user: 1, email: 'new@test.com', first_name: 'New User', password: 'password123',
                last_name: 'new',
                phone_number: null,
                roleId: 0,
                agency_id: null,
                license_number: null,
                failed_attempts: null,
                account_locked: null,
                active: null,
                deactivation_date: null
            };
            userService.createUser.mockResolvedValue(newUser);

            req.body = { email: 'new@test.com', name: 'New User', password: 'password123' };

            await userController.createUser(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(newUser);
        });

        it('should return 400 if required fields are missing', async () => {
            req.body = { email: 'new@test.com' }; // Missing name and password

            await userController.createUser(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Champs requis manquants' });
        });
    });
});