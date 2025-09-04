export class ErrorMessages {
    static Vehicle = {
        NOT_FOUND: (id: number) => `Le véhicule avec l'id ${id} est introuvable`,
        UPDATE_FAILED: (id: number) => `Le véhicule avec l'id ${id} ne peut pas être mis à jour`,
        LICENSE_PLATE_EXISTS: 'Le véhicule avec cette plaque existe déjà',
        MISSING_REQUIRED_FIELDS: 'Les champs obligatoires pour le véhicule ne sont pas tous remplis',
    };

    static User = {
        NOT_FOUND: (id: number) => `L'utilisateur avec l'id ${id} est introuvable`,
        EMAIL_EXISTS: "L'email existe déjà",
        MISSING_REQUIRED_FIELDS: "Les informations personnelles sont incomplètes",
        OLD_PASSWORD_INCORRECT: "Ancien mot de passe incorrect",
        INVALID_CREDENTIALS: "Email ou mot de passe invalide",
        USER_NOT_FOUND: "Utilisateur non trouvé",
        USER_LOCKED: "Le compte est verrouillé",
        USER_INACTIVE: "Le compte est inactif",
        PASSWORD_MISMATCH: "Le mot de passe actuel ne correspond pas",
        // Ajoute d'autres messages spécifiques à User ici
    };

    static Trip = {
        NOT_FOUND: (id: number) => `Le trajet avec l'id ${id} est introuvable`,
        CREATE_FAILED: 'Le trajet ne peut pas être créé',
        UPDATE_FAILED: (id: number) => `Le trajet avec l'id ${id} ne peut pas être mis à jour`,
        DELETE_FAILED: (id: number) => `Le trajet avec l'id ${id} ne peut pas être supprimé`,
        MISSING_REQUIRED_FIELDS: 'Les champs obligatoires pour le trajet ne sont pas tous remplis',
    }

    static agency = {
        NOT_FOUND: (id: number) => `L'agence avec l'id ${id} est introuvable`,
        CREATE_FAILED: 'L\'agence ne peut pas être créée',
        UPDATE_FAILED: (id: number) => `L'agence avec l'id ${id} ne peut pas être mise à jour`,
        DELETE_FAILED: (id: number) => `L'agence avec l'id ${id} ne peut pas être supprimée`,
        MISSING_REQUIRED_FIELDS: 'Les champs obligatoires pour l\'agence ne sont pas tous remplis',
    }

    static Carpooling = {
        NOT_FOUND: (id: number) => `Le covoiturage avec l'id ${id} est introuvable`,
        CREATE_FAILED: 'Le covoiturage ne peut pas être créé',
        UPDATE_FAILED: (id: number) => `Le covoiturage avec l'id ${id} ne peut pas être mis à jour`,
        DELETE_FAILED: (id: number) => `Le covoiturage avec l'id ${id} ne peut pas être supprimé`,
        MISSING_REQUIRED_FIELDS: 'Les champs obligatoires pour le covoiturage ne sont pas tous remplis',
    }

    static Key = {
        NOT_FOUND: (id: number) => `La clé avec l'id ${id} est introuvable`,
        CREATE_FAILED: 'La clé ne peut pas être créée',
        UPDATE_FAILED: (id: number) => `La clé avec l'id ${id} ne peut pas être mise à jour`,
        DELETE_FAILED: (id: number) => `La clé avec l'id ${id} ne peut pas être supprimée`,
        MISSING_REQUIRED_FIELDS: 'Les champs obligatoires pour la clé ne sont pas tous remplis',
    }


}
