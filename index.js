import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("🚀 Sparkotto Backend is running!");
});

// Charger les variables en fonction de l'environnement
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: envFile });

console.log(`Chargement des variables d'environnement depuis ${envFile}`);
console.log(`Environnement: ${process.env.NODE_ENV}`);
console.log(`Base de données: ${process.env.DATABASE_URL}`);
