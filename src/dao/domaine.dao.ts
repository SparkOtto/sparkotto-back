import { PrismaClient, Agencies, Domaines } from "@prisma/client";

class DomaineDao {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    // Récupérer un domaine spécifique
    async getDomaine(domaine: string) {
        return await this.prisma.domaines.findUnique({
            where: { domaine_name: domaine }
        });
    }

    // Récupérer tous les domaines
    async getAllDomaines() {
        return this.prisma.domaines.findMany();
    }

    //Récupérer un domaine par son ID
    async getDomaineById(id: number) {
        return this.prisma.domaines.findUnique({
            where: {id_domaine: id}
        });
    }

    // Ajouter un nouveau domaine
    async addDomaine(domaine: string) {
        return this.prisma.domaines.create({
            data: {domaine_name: domaine}
        });
    }

    // Mettre à jour un domaine existant
    async updateDomaine(id: number, domaine: string) {
        return this.prisma.domaines.update({
            where: {id_domaine: id},
            data: {domaine_name: domaine}
        });
    }

    // Supprimer un domaine
    async deleteDomaine(id: number) {
        return this.prisma.domaines.delete({
            where: {id_domaine: id}
        });
    }



}
export default DomaineDao