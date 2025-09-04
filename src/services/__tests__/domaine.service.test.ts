// tests/DomaineService.test.ts
import {beforeEach, describe, expect, it, jest} from "@jest/globals";
import DomaineService from "../domaine.service";
import DomaineDao from "../../dao/domaine.dao";

// Mock du DAO
jest.mock("../dao/DomaineDao");

describe("DomaineService", () => {
    let domaineService: DomaineService;
    let mockDao: jest.Mocked<DomaineDao>;

    beforeEach(() => {
        mockDao = new DomaineDao() as jest.Mocked<DomaineDao>;
        domaineService = new DomaineService();
        // Remplace le DAO interne par le mock
        (domaineService as any).domaineDao = mockDao;
    });

    it("devrait récupérer tous les domaines", async () => {
        const fakeDomaines = [{ id_domaine: 1, domaine_name: "Informatique" }];
        mockDao.getAllDomaines.mockResolvedValue(fakeDomaines);

        const result = await domaineService.getAllDomaines();
        expect(result).toEqual(fakeDomaines);
        expect(mockDao.getAllDomaines).toHaveBeenCalled();
    });

    it("devrait créer un domaine", async () => {
        const domaineName = "Finance";
        const fakeDomaine = { id_domaine: 2, domaine_name: domaineName };
        mockDao.addDomaine.mockResolvedValue(fakeDomaine);

        const result = await domaineService.createDomaine(domaineName);
        expect(result).toEqual(fakeDomaine);
        expect(mockDao.addDomaine).toHaveBeenCalledWith(domaineName);
    });

    it("devrait mettre à jour un domaine", async () => {
        const updated = { id_domaine: 1, domaine_name: "RH" };
        mockDao.updateDomaine.mockResolvedValue(updated);

        const result = await domaineService.updateDomaine(1, "RH");
        expect(result).toEqual(updated);
        expect(mockDao.updateDomaine).toHaveBeenCalledWith(1, "RH");
    });


    it("devrait récupérer un domaine par ID", async () => {
        const domaine = { id_domaine: 3, domaine_name: "Marketing" };
        mockDao.getDomaineById.mockResolvedValue(domaine);

        const result = await domaineService.getDomaineById(3);
        expect(result).toEqual(domaine);
        expect(mockDao.getDomaineById).toHaveBeenCalledWith(3);
    });
});