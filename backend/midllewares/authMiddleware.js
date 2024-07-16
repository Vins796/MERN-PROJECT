// Mi Importo il file per la gestione del token e gli autorizzazioni
import { verifyJWT } from "../utils/jwt.js";
import Authors from "../models/Authors.js";

// Middleware per la gestione dell'autenticazione
// export const authMiddleware = async (req, res, next) => {
//     console.log("Middleware di autenticazione chiamato");
//     console.log("Headers:", req.headers);
    
//     try {
//       const token = req.headers.authorization?.replace('Bearer ', '');
//       console.log("Token estratto:", token);
      
//       if (!token) {
//         console.log("Nessun token fornito");
//         return res.status(401).json({ message: "Nessun token fornito" });
//       }
      
//       const decoded = await verifyJWT(token);
//       console.log("Token decodificato:", decoded);
      
//       const author = await Authors.findById(decoded.id).select('-password');
//       if (!author) {
//         console.log("Autore non trovato");
//         return res.status(401).json({ message: "Autore non trovato" });
//       }
      
//       console.log("Autore trovato:", author);
//       req.author = author;
//       next();
//     } catch (error) {
//       console.error("Errore nel middleware di autenticazione:", error);
//       res.status(401).json({ message: "Token non valido" });
//     }
//   };
export const authMiddleware = async (req, res, next) => {
  console.log("Auth middleware called");
  console.log("Headers:", req.headers);
  
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    console.log("Token extracted:", token);
    
    if (!token) {
      console.log("No token provided");
      return res.status(401).json({ message: "No token provided" });
    }
    
    const decoded = await verifyJWT(token);
    console.log("Decoded token:", decoded);
    
    const author = await Authors.findById(decoded.id).select('-password');
    if (!author) {
      console.log("Author not found");
      return res.status(401).json({ message: "Author not found" });
    }
    
    console.log("Author found:", author);
    req.author = author;
    next();
  } catch (error) {
    console.error("Error in auth middleware:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};
