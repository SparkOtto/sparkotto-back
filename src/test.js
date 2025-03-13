import pkg from 'pg';  // Importation par défaut du module pg
const { Client } = pkg;

// Créer un nouveau client PostgreSQL
const client = new Client({
  host: 'localhost',        // L'adresse de votre serveur PostgreSQL
  port: 5432,               // Le port par défaut pour PostgreSQL
  user: 'postgres',         // Votre utilisateur PostgreSQL
  password: 'postgres',     // Votre mot de passe PostgreSQL
  database: 'sparkotto'     // Le nom de la base de données à laquelle se connecter
});

// Se connecter à la base de données
client.connect()
  .then(() => {
    console.log('Connexion réussie à la base de données PostgreSQL');
  })
  .catch(err => {
    console.error('Erreur de connexion à la base de données:', err.stack);
  });
