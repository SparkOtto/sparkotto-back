import {beforeEach, describe, expect, it, jest} from '@jest/globals';
import UserDAO from "../../dao/user.dao";
import AdminService from "../admin.service";

jest.mock('../../dao/user.dao')

/**
 * test toggleUserStatus
 */
describe('AdminService', () => {
    let adminService: AdminService;
    let userDAO: jest.Mocked<UserDAO>;

    beforeEach(() => {
        userDAO = jest.mocked(new UserDAO()); // Cast en tant que Mocked<UserDAO>
        adminService = new AdminService();
        adminService.userDAO = userDAO; // Injecter le DAO mocké
    });

    it('test_toggleUserStatus', async () => {
        const userTest = {
            id_user: 1,
            first_name: "Test",
            last_name: "User",
            email: "test@example.com",
            phone_number: null,
            password: "hashed_password",
            roleId: 2,
            agency_id: null,
            license_number: null,
            failed_attempts: 0,
            account_locked: false,
            active: true,
            deactivation_date: null,
        };
        jest.spyOn(userDAO, 'getUserById').mockResolvedValue(userTest);
        jest.spyOn(userDAO, 'updateUser').mockResolvedValue({ ...userTest, active: true });
        const result = await adminService.toggleUserStatus(1, true);

        expect(userDAO.getUserById).toHaveBeenCalledWith(1);
        expect(userDAO.updateUser).toHaveBeenCalledWith(1, { active: true, deactivation_date: null });
        expect(result).toEqual({ ...userTest, active: true });
    });

    it('test_toggleUserStatus_erreur', async () => {
        jest.spyOn(userDAO, 'getUserById').mockResolvedValue(null); // utilisateur absent

        await expect(adminService.toggleUserStatus(2, true)).rejects.toThrow('L\'utilisateur n\'a pas été trouvé');
        expect(userDAO.getUserById).toHaveBeenCalledWith(2);
        expect(userDAO.updateUser).not.toHaveBeenCalled();
    });

    /**
     * test lockUnlockUser
     */
    describe("AdminService - lockUnlockUser", () => {
        let adminService: AdminService;
        let userDAO: jest.Mocked<UserDAO>;

        beforeEach(() => {
            userDAO = jest.mocked(new UserDAO());
            adminService = new AdminService();
            adminService.userDAO = userDAO;
        });

        it("devrait bloquer l'utilisateur", async () => {
            const userTest = {
                id_user: 1,
                first_name: "Test",
                last_name: "User",
                email: "test@example.com",
                phone_number: null,
                password: "hashed_password",
                roleId: 2,
                agency_id: null,
                license_number: null,
                failed_attempts: 0,
                account_locked: false, // Avant le blocage
                active: true,
                deactivation_date: null,
            };

            jest.spyOn(userDAO, "getUserById").mockResolvedValue(userTest);
            jest.spyOn(userDAO, "updateUser").mockResolvedValue({ ...userTest, account_locked: true });

            const result = await adminService.lockUnlockUser(1, true);

            expect(userDAO.getUserById).toHaveBeenCalledWith(1);
            expect(userDAO.updateUser).toHaveBeenCalledWith(1, { account_locked: true });
            expect(result).toEqual({ ...userTest, account_locked: true });
        });

        it("devrait débloquer l'utilisateur", async () => {
            const userTest = {
                id_user: 1,
                first_name: "Test",
                last_name: "User",
                email: "test@example.com",
                phone_number: null,
                password: "hashed_password",
                roleId: 2,
                agency_id: null,
                license_number: null,
                failed_attempts: 0,
                account_locked: true, // Avant le déblocage
                active: true,
                deactivation_date: null,
            };

            jest.spyOn(userDAO, "getUserById").mockResolvedValue(userTest);
            jest.spyOn(userDAO, "updateUser").mockResolvedValue({ ...userTest, account_locked: false });

            const result = await adminService.lockUnlockUser(1, false);

            expect(userDAO.getUserById).toHaveBeenCalledWith(1);
            expect(userDAO.updateUser).toHaveBeenCalledWith(1, { account_locked: false });
            expect(result).toEqual({ ...userTest, account_locked: false });
        });

        it("devrait retourner une erreur si l'utilisateur n'existe pas", async () => {
            jest.spyOn(userDAO, "getUserById").mockResolvedValue(null);

            await expect(adminService.lockUnlockUser(2, true)).rejects.toThrow("L'utilisateur n'a pas été trouvé");

            expect(userDAO.getUserById).toHaveBeenCalledWith(2);
            expect(userDAO.updateUser).not.toHaveBeenCalled();
        });

        it("devrait gérer une erreur lors de la mise à jour", async () => {
            const userTest = {
                id_user: 1,
                first_name: "Test",
                last_name: "User",
                email: "test@example.com",
                phone_number: null,
                password: "hashed_password",
                roleId: 2,
                agency_id: null,
                license_number: null,
                failed_attempts: 0,
                account_locked: false,
                active: true,
                deactivation_date: null,
            };

            jest.spyOn(userDAO, "getUserById").mockResolvedValue(userTest);
            jest.spyOn(userDAO, "updateUser").mockRejectedValue(new Error("Erreur de base de données"));

            await expect(adminService.lockUnlockUser(1, true)).rejects.toThrow("Erreur de base de données");

            expect(userDAO.getUserById).toHaveBeenCalledWith(1);
            expect(userDAO.updateUser).toHaveBeenCalledWith(1, { account_locked: true });
        });
    });
});
