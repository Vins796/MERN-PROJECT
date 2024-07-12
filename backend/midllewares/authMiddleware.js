// Mi Importo il file per la gestione del token e gli autorizzazioni
import { verifyJWT } from "../utils/jwt.js";
import Authors from "../models/Authors.js";

// Middleware per la gestione dell'autenticazione
export const authMiddleware = async (req, res, next) => {
    try {
        // Estraggo il token dall'header 'Authorization'
        const token = req.headers.authorization?.replace('Bearer ', ''); 
        // L'operatore ?. (optional chain) ci assicura che non ci siano errori se non c'è il token
        // replace('Bearer ', '') rimuove il prefisso 'Bearer ' dal token

        // Se non c'è il token, ritorno un errore
        if(!token){
            return res.status(401).send("Unauthorized");
        }
        // Verifico e decodifico il token usando la funzione verifyJWT
        const decoded = verifyJWT(token);
        // Estraggo l'autore dal token
        // .select("-password") esclude la password dal risultato
        const author = await Authors.findById(decoded.id).select('-password');
        // Se non c'è l'autore, ritorno un errore
        if(!author){
            return res.status(401).send("Unauthorized, Utente non trovato!");
        }

        // Aggiungi l'oggetto author alla richiesta
        // Questo rende i dati dell'autore disponibili per le route successive
        req.author = author;

        // Passo al middleware successivo
        next();
    } catch(error){
        // Se c'è un errore, ritorno un errore
        res.status(401).json({message: "Unauthorized, Token non valido!"});
    }
};
