import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUiExpress from 'swagger-ui-express';
import * as OpenApiValidator from 'express-openapi-validator';
import path from "path";
import fs from "fs";
import * as yaml from 'yaml';



dotenv.config();

const app = express();

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("🚀 Sparkotto Backend is running!");
});


// Chemin vers le dossier des routes
const routesPath = path.join(__dirname, 'routes');


// Load OpenAPI specification
const openApiPath = path.join(__dirname, 'openapi.yaml');
const openApiDocument = yaml.parse(fs.readFileSync(openApiPath, 'utf8'));

// Serve Swagger UI
app.use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(openApiDocument));


/*app.use(
  OpenApiValidator.middleware({
    apiSpec: openApiDocument,
    validateRequests: true,
    validateResponses: true,
  })
);*/

// Charger les variables en fonction de l'environnement
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: envFile });

console.log(`Chargement des variables d'environnement depuis ${envFile}`);
console.log(`Environnement: ${process.env.NODE_ENV}`);
console.log(`Base de données: ${process.env.DATABASE_URL}`);


// Fonction pour charger dynamiquement les routes
async function loadRoutes(routesPath: string) {
  const files = fs.readdirSync(routesPath);

  for (const file of files) {
    const filePath = path.join(routesPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isFile() && (file.endsWith('.ts') || file.endsWith('.js'))) {
      try {
        const routeModule = await import(filePath);

        // Vérifiez si le module exporte un routeur par défaut
        if (routeModule.default && typeof routeModule.default === 'function') {
          const router = routeModule.default;
          const routeName = path.basename(file, path.extname(file)); // Nom de la route basé sur le nom du fichier
          app.use(`/api/${routeName}`, router); // Préfixez avec /api et le nom de la route
          
          console.log(`Route chargée : /api/${routeName}`);
        } else {
          console.warn(`Fichier de route ignoré car il n'exporte pas de routeur par défaut : ${file}`);
        }
      } catch (error) {
        console.error(`Erreur lors du chargement de la route ${file} :`, error);
      }
    }
  }
}


// Chargement des routes au démarrage de l'application
loadRoutes(routesPath).then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
  });
});



