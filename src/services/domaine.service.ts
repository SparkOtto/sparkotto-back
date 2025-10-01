import DomaineDao from "../dao/domaine.dao";

class DomaineService {
    private domaineDao: DomaineDao;

    constructor() {
        this.domaineDao = new DomaineDao();
    }

    async getAllDomaines() {
        return this.domaineDao.getAllDomaines();
    }

    async getDomaineById(id: number) {
        return this.domaineDao.getDomaineById(id);
    }

    async getDomaineByName(name: string) {
        return this.domaineDao.getDomaine(name);
    }

    async createDomaine(name: string) {
        return this.domaineDao.addDomaine(name);
    }

    async updateDomaine(id: number, name: string) {
        return this.domaineDao.updateDomaine(id, name);
    }

    async deleteDomaine(id: number) {
        return this.domaineDao.deleteDomaine(id);
    }
}

export default DomaineService;