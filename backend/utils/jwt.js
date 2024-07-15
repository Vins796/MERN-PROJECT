// CREAZIONE DELLE UTILITY PER LA GESTIONE DEI TOKEN

// Importo la libreria jsonwebtoken
import jwt from 'jsonwebtoken';

// Creo la funzione che genera il token
export const generateJWT = (payload) => {
    // Restituisce una promise
    return new Promise((resolve, reject) => 
    jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1 day'}, (err, token) => {
        if(err) reject(err);
        resolve(token);
    })
    );
};

// Funzione per verificare un token
export const verifyJWT = (token) => {
    // Restituisce una promise
    return new Promise((resolve, reject) => {
        // Utilizzo il metodo verify per verificare il token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            // Callback che gestisce l'errore e il decoded
            if(err) {
                console.error("Errore nella verifica del token:", err);
                reject(err); // se c'è un errore, reject
            } else {
                resolve(decoded); // se il token è valido, resolve
            }
                
        });
    });
};
