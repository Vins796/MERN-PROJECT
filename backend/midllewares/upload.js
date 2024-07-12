// Importa il modulo multer per gestire l'upload di file
import multer from 'multer';

// Importa il modulo path per lavorare con i percorsi dei file
import path from 'path';

// Configura lo storage per multer
const storage = multer.diskStorage({
    // Specifica la destinazione dei file caricati
    destination: (req, file, cb) => {
        // cb è una funzione di callback
        // Il primo parametro è null (nessun errore)
        // Il secondo parametro è la cartella di destinazione
        cb(null, 'uploads/');
    },
    // Specifica come nominare i file caricati
    filename: (req, file, cb) => {
        // Crea un suffisso unico combinando timestamp e numero casuale
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        
        // Combina il nome del campo, il suffisso unico e l'estensione originale del file
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); 
    }
});

// Crea un'istanza di multer con la configurazione dello storage
const upload = multer({
    storage: storage
});

// Esporta l'istanza di multer configurata
export default upload;