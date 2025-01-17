// Importiamo le dipendenze necessarie
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import Author from "../models/Authors.js";

// Configuriamo la strategia di autenticazione Google
// passport.use(
//   new GoogleStrategy(
//     {
//       // Usiamo le variabili d'ambiente per le credenziali OAuth
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       // L'URL a cui Google reindizzerà dopo l'autenticazione
//       callbackURL: "/api/auth/google/callback",
//     },
//     // Questa funzione viene chiamata quando l'autenticazione Google ha successo
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         // Cerchiamo se esiste già un autore con questo ID Google
//         let author = await Author.findOne({ googleId: profile.id });

//         // Se l'autore non esiste, ne creiamo uno nuovo
//         if (!author) {
//           author = new Author({
//             googleId: profile.id, // ID univoco fornito da Google
//             nome: profile.name.givenName, // Nome dell'utente
//             cognome: profile.name.familyName, // Cognome dell'utente
//             email: profile.emails[0].value, // Email principale dell'utente
//             // Nota: la data di nascita non è fornita da Google, quindi la impostiamo a null
//             dataDiNascita: null,
//           });
//           // Salviamo il nuovo autore nel database
//           await author.save();
//         }

//         // Passiamo l'autore al middleware di Passport
//         // Il primo argomento null indica che non ci sono errori
//         done(null, author);
//       } catch (error) {
//         // Se si verifica un errore, lo passiamo a Passport
//         done(error, null);
//       }
//     }
//   )
// );
passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log("Google profile:", profile);
          let author = await Author.findOne({ googleId: profile.id });
          console.log("Existing author:", author);
  
          if (!author) {
            author = new Author({
              googleId: profile.id,
              nome: profile.name.givenName,
              cognome: profile.name.familyName,
              email: profile.emails[0].value,
              avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
              dataDiNascita: null,
            });
            await author.save();
            console.log("New author saved:", author);
          } else if (!author.avatar && profile.photos && profile.photos[0]) {
            // Aggiorna l'avatar se non esiste
            author.avatar = profile.photos[0].value;
            await author.save();
            console.log("Author avatar updated:", author);
          }
  
          done(null, author);
        } catch (error) {
          console.error("Error in Google strategy:", error);
          done(error, null);
        }
      }
    )
  );

// Serializzazione dell'utente per la sessione
// Questa funzione determina quali dati dell'utente devono essere memorizzati nella sessione
passport.serializeUser((user, done) => {
  // Memorizziamo solo l'ID dell'utente nella sessione
  done(null, user.id);
});

// Deserializzazione dell'utente dalla sessione
// Questa funzione viene usata per recuperare l'intero oggetto utente basandosi sull'ID memorizzato
passport.deserializeUser(async (id, done) => {
  try {
    // Cerchiamo l'utente nel database usando l'ID
    const user = await Author.findById(id);
    // Passiamo l'utente completo al middleware di Passport
    done(null, user);
  } catch (error) {
    // Se si verifica un errore durante la ricerca, lo passiamo a Passport
    done(error, null);
  }
});

// Esportiamo la configurazione di Passport
export default passport;