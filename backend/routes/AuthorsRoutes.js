import express from 'express'; // Importo express
import Authors from '../models/Authors.js'; // Importo il modello Authors
import BlogPosts from '../models/BlogPosts.js'; // Importo il modello BlogPosts
import cloudinaryUploader from "../config/cloudinaryConfig.js";
import { authMiddleware } from "../midllewares/authMiddleware.js";

import multer from 'multer';

const upload = multer({ dest: 'uploads/' });


const router = express.Router();

// GET /authors - Recupera tutti gli autori
router.get('/', async (req, res) => {
    try {
        // Imposta i parametri di paginazione e ordinamento
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sort = req.query.sort || 'nome';
        const sortDirection = req.query.sortDirection === 'desc' ? -1 : 1;
        const skip = (page -1) * limit;
        const authors = await Authors.find({})
            .sort({[sort]: sortDirection})
            .skip(skip)
            .limit(limit)

        // Conta il numero totale di documenti
        const total = await Authors.countDocuments();

        // Invia la risposta con i dati e le informazioni sulla paginazione
        res.json({
            authors,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalAuthors: total
        })
    } catch(error) {
        res.status(500).json({message: error.message});
    }
});

// GET /authors/:id - Recupera un singolo autore per ID
router.get('/:id', async (req,res) => {
    try {
        console.log("Ricerca autore con ID:", req.params.id);
        // Cerco l'autore specifico
        const author = await Authors.findById(req.params.id);
        // Se l'autore non esiste -> restituisco l'errore
        if(!author) {
            return res.status(404).json({message: 'Autore non trovato'})
        } else {
            // Altrimenti resistuisco l'autore
            res.json(author);
        }
    } catch(err){
        res.status(500).json({message: err.message});
}});


router.get('/mail/:email', authMiddleware, async (req, res) => {
  console.log("GET /mail/:email route called");
  try {
    console.log("Richiesta ricevuta per email:", req.params.email);
    const author = await Authors.findOne({ email: req.params.email }).select('+avatar');
    console.log("Risultato della ricerca:", author);
    if (!author) {
      console.log("Autore non trovato");
      return res.status(404).json({ message: "Autore non trovato" });
    }
    console.log("Autore trovato:", author);
    res.json(author);
  } catch (error) {
    console.error("Errore durante la ricerca dell'autore:", error);
    res.status(500).json({ message: "Errore interno del server" });
  }
});

router.get('/author/:author', async (req, res) => {
    try {
        const { author } = req.params;

        if (!author) {
            return res.status(400).json({ message: "L'email dell'autore è richiesta per la ricerca" });
        }

        const posts = await BlogPosts.find({ author: author });

        if (posts.length === 0) {
            return res.status(404).json({ message: "Nessun post trovato per questo autore" });
        }

        res.json(posts);
    } catch (error) {
        console.error("Errore durante la ricerca dei post dell'autore:", error);
        res.status(500).json({ message: "Errore interno del server" });
    }
});


// POST /authors - Crea un nuovo autore
router.post('/', upload.single('avatar'), async (req,res) => {
    console.log("Body:", req.body);
    console.log("File:", req.file);
    try {
        const authorData = req.body;
        if (req.file) {
          authorData.avatar = `${process.env.BACKEND_URL}/${req.file.path.replace(/\\/g, "/")}`; // Salva il percorso del file
        }
        const author = new Authors(authorData); // Creo una nuova istanza del modello Authors utilizzando i dati forniti nel corpo della richiesta
        const newAuthor = await author.save(); // Salvo i dati nel db

        // Rimuovi la password dalla risposta per sicurezza
        const authorResponse = newAuthor.toObject();
        delete authorResponse.password;
        
        res.status(201).json(authorResponse)
    } catch(err) {
        console.error("Errore dettagliato:", err);
        res.status(400).json({message: err.message});
    }
});

// PUT /authors/:id - Aggiorna un autore esistente
router.put('/:id', async (req,res) => {
    try {
        const updateAuthor = await Authors.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        )
        if(!updateAuthor) {
            return res.status(404).json({message: 'Autore non trovato'})
        } else {
            res.json(updateAuthor);
        }
    } catch(err){
        res.status(400).json({message: err.message});
    }
});

// PATCH /authors/:authorId/avatar - Aggiorna l'avatar di un autore
router.patch('/:authorId/avatar', cloudinaryUploader.single('avatar'), async (req,res) => {
    try {
        // Se il file non è presente -> restituisco l'errore
        if(!req.file) {
            return res.status(400).json({message: 'Carica un file!'})
        }
        // 
        const patchAuthor = await Authors.findById(req.params.id);
        // Se l'utente da modificare non è presente -> restituisco l'errore
        if(!patchAuthor) {
            return res.status(401),json({message: 'Autore non trovato'})
        }
        // Assegno il percorso del file caricato al campo cover
        patchAuthor.cover = req.file.path;
        // Salvo le modifiche nel db
        await patchAuthor.save();
        // Restituisco l'autore modificato
        res.json(patchAuthor);
    } catch(err) {
        console.error('Errore nella modifica', err);
        res.status(500).json({message: err.message});
    }
})

// DELETE /authors/:id - Elimina un autore
router.delete('/:id', async (req,res) => {
    try {
        const deletedAuthor = await Authors.findByIdAndDelete(req.params.id);
        if(!deletedAuthor) {
            return res.status(404).json({message: 'Autore non trovato'})
        } else {
            res.json({message: 'Autore cancellato'});
        }
    } catch(err) {
        res.status(500).json({message: err.message});
    }
});

// GET /authors/:id/blogPosts - Recupera tutti i post di un autore specifico
router.get('/:id/blogPosts', async (req,res) => {
    try {
        // Cerco l'autore specifico
        const author = await Authors.findById(req.params.id);
        // Se l'utente cercato non è presente -> restituisco l'errore
        if(!author) {
            return res.status(404).json({message: 'Autore non trovato'})
        }
        // Cerco il post e gli passo l'email dell'autore
        const blogPosts = await BlogPosts.find({
            author: author.email
        })
        // Restituisco il post 
        res.json(blogPosts);
    } catch(err){
        res.status(500).json({message: err.message});
    }
});

export default router;

