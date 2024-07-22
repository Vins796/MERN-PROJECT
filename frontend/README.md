# MERN BLOG PROJECT

Questo progetto è un'applicazione web full-stack per un blog, sviluppata utilizzando lo stack MERN (MongoDB, Express, React, Node.js). L'applicazione offre funzionalità di creazione, lettura, aggiornamento e cancellazione (CRUD) per post di blog e commenti, oltre a un sistema di autenticazione e autorizzazione degli utenti.

## Caratteristiche principali
- Autenticazione: Sistema di login e registrazione degli utenti, con supporto per l'autenticazione tramite Google OAuth.
- Gestione dei post: Gli utenti autenticati possono creare, modificare ed eliminare i propri post.
- Commenti: Possibilità di aggiungere commenti ai post e gestirli.
- Profili utente: Pagine profilo per gli autori con lista dei loro post.
- Ricerca: Funzionalità di ricerca per trovare post specifici.
- Responsive Design: Layout adattivo per una buona esperienza utente su dispositivi di diverse dimensioni.
- Dark Mode: Supporto per tema chiaro e scuro.

## Tecnologie utilizzate
### Frontend
- React
- React Router per la navigazione
- Axios per le chiamate API
- Tailwind CSS e Flowbite per lo styling
- Framer Motion per le animazioni

### Backend
- Node.js con Express
- MongoDB con Mongoose per la gestione del database
- JWT per l'autenticazione
- Passport.js per l'autenticazione OAuth
- Multer e Cloudinary per la gestione dei file

### Funzionalità aggiuntive 
- Gestione delle sessioni utente
- Paginazione per i post
- Sistema di like per i post
- Upload di immagini per i post e gli avatar degli utenti

### Struttura del progetto
- **frontend**: Contiene l'applicazione React
- **backend**: Contiene il server Express e la logica

### Configurazione e Avvio
- **frontend**: cd frontend && npm run dev
- **backend**: cd backend && node server.js