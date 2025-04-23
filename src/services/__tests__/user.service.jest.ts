import UserService from '../user.service';
import UserDAO from '../../dao/user.dao';
import { User } from '@prisma/client';
import {describe, expect, jest} from "@jest/globals";
import {beforeEach, it} from "node:test";

jest.mock('../../dao/user.dao');

describe('UserService', () => {
    let userService: UserService;
    let userDAO: jest.Mocked<UserDAO>;

    beforeEach(() => {
        userDAO = new UserDAO() as jest.Mocked<UserDAO>;
        userService = new UserService();
        userService['userDAO'] = userDAO;
    });

    describe('createUser', () => {
        it('should create a new user', async () => {
            const userData: Omit<User, 'id'> = {
                email: 'test@test.com',
                name: 'Test User',
                password: 'password123',
            };

            userDAO.getUserByEmail.mockResolvedValue(null);
            userDAO.createUser.mockResolvedValue({ id: 1, ...userData });

            const result = await userService.createUser(userData);

            expect(result).toEqual({ id: 1, ...userData });
            expect(userDAO.getUserByEmail).toHaveBeenCalledWith(userData.email);
            expect(userDAO.createUser).toHaveBeenCalledWith(userData);
        });

        it('should throw an error if user already exists', async () => {
            const userData: Omit<User, 'id'> = {
                email: 'test@test.com',
                name: 'Test User',
                password: 'password123',
            };

            userDAO.getUserByEmail.mockResolvedValue({ id: 1, ...userData });

            await expect(userService.createUser(userData)).rejects.toThrow('Un utilisateur avec cet email existe déjà');
            expect(userDAO.getUserByEmail).toHaveBeenCalledWith(userData.email);
            expect(userDAO.createUser).not.toHaveBeenCalled();
        });
    });

    describe('getUserById', () => {
        it('should return a user by id', async () => {
            const user: User = { id: 1, email: 'test@test.com', name: 'Test User', password: 'password123' };

            userDAO.getUserById.mockResolvedValue(user);

            const result = await userService.getUserById(1);

            expect(result).toEqual(user);
            expect(userDAO.getUserById).toHaveBeenCalledWith(1);
        });

        it('should return null if user not found', async () => {
            userDAO.getUserById.mockResolvedValue(null);

            const result = await userService.getUserById(1);

            expect(result).toBeNull();
            expect(userDAO.getUserById).toHaveBeenCalledWith(1);
        });
    });
});