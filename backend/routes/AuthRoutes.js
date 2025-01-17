import express from "express";
import Author from "../models/Authors.js";
import { generateJWT } from "../utils/jwt.js";
import { authMiddleware } from "../midllewares/authMiddleware.js";
import passport from "../config/passportConfig.js"; // Importiamo passport

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const router = express.Router();

// POST /login => restituisce token di accesso
router.post("/login", async (req, res) => {
    try {
        // Estrae email e password dal corpo della richiesta
        const { email, password } = req.body;
  
        // Cerca l'autore nel database usando l'email
        const author = await Author.findOne({ email });
        if (!author) {
            // Se l'autore non viene trovato, restituisce un errore 401
            return res.status(401).json({ message: "Credenziali non valide" });
        }
    
        // Verifica la password usando il metodo comparePassword definito nel modello Author
        const isMatch = await author.comparePassword(password);
        if (!isMatch) {
            // Se la password non corrisponde, restituisce un errore 401
            return res.status(401).json({ message: "Credenziali non valide" });
        }
    
        // Se le credenziali sono corrette, genera un token JWT
        const token = await generateJWT({ id: author._id });
        console.log("Token generato:", token);    
        // Restituisce il token e un messaggio di successo
        res.json({ token, message: "Login effettuato con successo" });
    } catch (error) {
        // Gestisce eventuali errori del server
        console.error("Errore nel login:", error);
        res.status(500).json({ message: "Errore del server" });
    }
});

// GET /me => restituisce l'autore collegato al token di accesso
// authMiddleware verifica il token e aggiunge i dati dell'autore a req.author
router.get("/me", authMiddleware, (req, res) => {
    // Converte il documento Mongoose in un oggetto JavaScript semplice
    const authorData = req.author.toObject();
    // Rimuove il campo password per sicurezza
    delete authorData.password;
    // Invia i dati dell'autore come risposta
    res.json(authorData);
});

// Rotta per iniziare il processo di autenticazione Google
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);


// Questo endpoint inizia il flusso di autenticazione OAuth con Google
// 'google' si riferisce alla strategia GoogleStrategy configurata in passportConfig.js
// scope: specifica le informazioni richiediamo a Google (profilo e email)  
// Rotta di callback per l'autenticazione Google

router.get(
    "/google/callback",
    (req,res,next) => {
      console.log("Google callback route reached");
      next();
    },
    passport.authenticate("google", { failureRedirect: `${FRONTEND_URL}/login` }),
    async (req, res) => {
      try {
        console.log("Google auth callback - User:",  req.user);
        // const token = await generateJWT({ id: req.user._id });
        const token = await generateJWT({ id: req.user._id, email: req.user.email });
        const userData = {
          id: req.user._id,
          email: req.user.email,
          nome: req.user.nome,
          cognome: req.user.cognome,
          avatar: req.user.avatar
        };
        res.redirect(`${FRONTEND_URL}/login?token=${token}&userData=${encodeURIComponent(JSON.stringify(userData))}`);
      } catch (error) {
        console.error("Errore nella generazione del token:", error);
        res.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
      }
    }
  );
  
export default router;