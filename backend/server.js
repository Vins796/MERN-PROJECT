// Importa il framework Express per creare l'applicazione web
import express from 'express';

// Importa Mongoose per la connessione e l'interazione con MongoDB
import mongoose from 'mongoose';

// Importa dotenv per caricare le variabili d'ambiente dal file .env
import dotenv from 'dotenv';

// Importa una utility per elencare tutti gli endpoint dell'applicazione
import endpoints from 'express-list-endpoints';

// Importa il middleware CORS per gestire le richieste cross-origin
import cors from 'cors';

// Importa le route per i post del blog
import blogPostRoutes from './routes/BlogPostsRoutes.js';

// Importa le route per gli autori
import authorRoutes from './routes/AuthorsRoutes.js';

// Importo le rotte per l'autenticazione
import authRoutes from './routes/AuthRoutes.js';

// Importa moduli per gestire i percorsi dei file
import path from 'path';
import { fileURLToPath } from 'url';

// Ottiene il percorso del file corrente
const __filename = fileURLToPath(import.meta.url);
// Ottiene la directory del file corrente
const __dirname = path.dirname(__filename);

// Importa i middleware per la gestione degli errori
import {
    badRequestHandler,
    unauthorizedHandler,
    notFoundHandler,
    genericErrorHandler
} from './midllewares/errorHandlers.js';

// Carica le variabili d'ambiente dal file .env
dotenv.config();

// Crea un'istanza dell'applicazione Express
const app = express();

// Abilita CORS per tutte le richieste
app.use(cors());

app.use(express.json());

// Connette al database MongoDB usando l'URI
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connesso'))
    .catch((err) => console.error('Errore di connessione', err));

// Imposta le route per gli autori
app.use('/api/authors', authorRoutes);

// Imposta le route per i post del blog
app.use('/api/blogPosts', blogPostRoutes);

// Imposta le route per l'autenticazione
app.use('/api/auth', authRoutes);

// Imposta la porta del server specifica o 5000
const PORT = process.env.PORT || 5000;

// Aggiunge i middleware per la gestione degli errori
app.use(badRequestHandler);
app.use(unauthorizedHandler);
app.use(notFoundHandler);
app.use(genericErrorHandler);

// Avvia il server sulla porta specificata
app.listen(PORT, () => {
    console.log('Server connesso sulla porta ' + PORT);
    
    // Stampa una tabella con tutti gli endpoint dell'applicazione
    console.table(
        endpoints(app).map((route) => ({
          path: route.path,
          methods: route.methods.join(", "),
        })),
    );
});