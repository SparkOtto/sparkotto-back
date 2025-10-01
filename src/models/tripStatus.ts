// Énumération des statuts de réservation
export const TRIP_STATUS = {
  PENDING: 'pending',           // En attente de confirmation
  CONFIRMED: 'confirmed',       // Confirmé, pas encore commencé
  IN_PROGRESS: 'in_progress',   // En cours (voyage actif)
  COMPLETED: 'completed',       // Terminé avec succès
  CANCELLED: 'cancelled',       // Annulé
  NO_SHOW: 'no_show'           // Utilisateur ne s'est pas présenté
} as const;

// Type TypeScript pour la validation
export type TripStatus = typeof TRIP_STATUS[keyof typeof TRIP_STATUS];

// Liste des statuts actifs (voyage en cours)
export const ACTIVE_STATUSES: TripStatus[] = [
  TRIP_STATUS.CONFIRMED,
  TRIP_STATUS.IN_PROGRESS
];

// Liste des statuts terminaux (voyage fini)
export const TERMINAL_STATUSES: TripStatus[] = [
  TRIP_STATUS.COMPLETED,
  TRIP_STATUS.CANCELLED,
  TRIP_STATUS.NO_SHOW
];

// Fonctions utilitaires
export const isActiveTrip = (status: string): boolean => {
  return ACTIVE_STATUSES.includes(status as TripStatus);
};

export const isCompletedTrip = (status: string): boolean => {
  return status === TRIP_STATUS.COMPLETED;
};

export const canReturnVehicle = (status: string): boolean => {
  return status === TRIP_STATUS.IN_PROGRESS;
};

// Messages d'affichage
export const STATUS_LABELS = {
  [TRIP_STATUS.PENDING]: 'En attente',
  [TRIP_STATUS.CONFIRMED]: 'Confirmé',
  [TRIP_STATUS.IN_PROGRESS]: 'En cours',
  [TRIP_STATUS.COMPLETED]: 'Terminé',
  [TRIP_STATUS.CANCELLED]: 'Annulé',
  [TRIP_STATUS.NO_SHOW]: 'Absence'
};
