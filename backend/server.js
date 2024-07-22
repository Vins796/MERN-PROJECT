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

import session from "express-session";
import passport from "./config/passportConfig.js";

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

app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve i file statici della cartella uploads

// Abilita CORS per tutte le richieste
// Configurazione CORS
const corsOptions = {
  origin: function (origin, callback) {
    // Definiamo una whitelist di origini consentite. 
    // Queste sono gli URL da cui il nostro frontend farà richieste al backend.
    const whitelist = [
      'http://localhost:5173', // Frontend in sviluppo
      '', // Frontend in produzione (prendere da vercel!)
      '' // URL del backend (prendere da render!)
    ];
    
    if (process.env.NODE_ENV === 'development') {
      // In sviluppo, permettiamo anche richieste senza origine (es. Postman)
      callback(null, true);
    } else if (whitelist.indexOf(origin) !== -1 || !origin) {
      // In produzione, controlliamo se l'origine è nella whitelist
      callback(null, true);
    } else {
      callback(new Error('PERMESSO NEGATO - CORS'));
    }
  },
  credentials: true // Permette l'invio di credenziali, come nel caso di autenticazione
  // basata su sessioni.
};

// NEW! passiamo `corsOptions` a cors()
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Abilita il parsing dei dati del form

// Inizializzazione di Express Session
app.use(
    session({
      // Il 'secret' è usato per firmare il cookie di sessione
      // È importante che sia una stringa lunga, unica e segreta
      secret: process.env.SESSION_SECRET,
  
      // 'resave: false' dice al gestore delle sessioni di non
      // salvare la sessione se non è stata modificata
      resave: false,
  
      // 'saveUninitialized: false' dice al gestore delle sessioni di non
      // creare una sessione finché non memorizziamo qualcosa
      // Aiuta a implementare le "login sessions" e riduce l'uso del server di memorizzazione
      saveUninitialized: false,
    })
);

// Inizializzazione di Passport
app.use(passport.initialize());
app.use(passport.session());

// Proxy per caricare le immagini da Google
app.get('/proxy-image', async (req, res) => {
    const { url } = req.query;
    try {
      const response = await fetch(url);
      const buffer = await response.buffer();
      res.set('Content-Type', response.headers.get('content-type'));
      res.send(buffer);
    } catch (error) {
      console.error('Errore nel proxy dell\'immagine:', error);
      res.status(500).send('Errore nel caricamento dell\'immagine');
    }
  });

// Connette al database MongoDB usando l'URI
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connesso'))
    .catch((err) => console.error('Errore di connessione', err));

// Imposta le route per l'autenticazione
app.use('/api/auth', authRoutes);

// Imposta le route per gli autori
app.use('/api/authors', authorRoutes);

// Imposta le route per i post del blog
app.use('/api/blogPosts', blogPostRoutes);

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