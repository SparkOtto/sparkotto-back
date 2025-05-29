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

}
export default DomaineDao