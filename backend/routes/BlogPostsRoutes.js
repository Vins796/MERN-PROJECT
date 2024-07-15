import express from 'express';
import BlogPosts from '../models/BlogPosts.js';

import cloudinaryUploader from "../config/cloudinaryConfig.js";
import { sendEmail } from "../services/emailServices.js";

import { authMiddleware } from "../midllewares/authMiddleware.js";

// Route per Commenti da riga 151

const router = express.Router();

// Proteggi le altre rotte con il middleware di autenticazione
router.use(authMiddleware);

// GET /blogPosts - Recupera tutti i post del blog
// 
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const query = search
            ? {
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { author: { $regex: search, $options: 'i' } }
                ]
              }
            : {};

        const blogPost = await BlogPosts.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await BlogPosts.countDocuments(query);

        res.json({
            blogPost,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalPosts: total
        });
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /blogPosts/:id - Recupera un singolo post del blog per ID
router.get('/:id', async (req,res) => {
    try {
        // Cerco il post
        const post = await BlogPosts.findById(req.params.id);
        // Verifico se il post non esiste -> restituisco un errore
        if(!post) {
            return res.status(404).json({message: 'Post non trovato'})
        } else {
            // Se esiste il post restituisco il post cercato tramite id
            res.json(post); 
        }
    } catch(err){
        res.status(500).json({message: err.message});
}});

// POST /blogPosts - Crea un nuovo post del blog
router.post('/', cloudinaryUploader.single('cover'), async (req,res) => {
    try {
        const postData = req.body;
        // Se è stato caricato un file, aggiungi il percorso del file ai dati del post
        if(req.file) {        
            postData.cover = req.file.path; // cloudinary
        }
        // Crea e salva il nuovo post
        const newPost = new BlogPosts(postData);
        await newPost.save();
        // Creo il contenuto della mail inviata tramite mailgun
        const htmlContent = `
            <h1>Il tuo post è stato pubblicato!</h1>
            <p>Ciao ${newPost.author},</p>
            <p>Il tuo post "${newPost.title}" è stato pubblicato con successo.</p>
            <p>Categoria: ${newPost.category}</p>
            <p>Grazie per il tuo contributo al blog!</p>
        `;
        // Invia un'email di conferma
        await sendEmail(newPost.author, 'Post pubblicato 8=D', htmlContent);
        // Invia il nuovo post come risposta
        res.status(201).json(newPost);
    } catch(err){
        console.error('Errore nella creazione', err);
        res.status(400).json({message: err.message});
    }
});

// PUT /blogPosts/:id - Aggiorna un post del blog esistente
router.put('/:id', async (req,res) => {
    try {
        const updatePost = await BlogPosts.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        )
        if(!updatePost) {
            return res.status(404).json({message: 'Post non trovato'})
        } else {
            res.json(updatePost);
        }
    } catch(err){
        res.status(400).json({message: err.message});
    }
});

// PATCH /blogPosts/:blogPostId/cover - Aggiorna solo l'immagine di copertina di un post
router.patch('/:blogPostId/cover', cloudinaryUploader.single('cover'), async (req,res) => {
    try {
        if(!req.file) {
            return res.status(400).json({message: 'Carica un file!'})
        }

        const patchPost = await BlogPosts.findById(req.params.id);
        if(!patchPost) {
            return res.status(401),json({message: 'Post non trovato'})
        }

        patchPost.cover = req.file.path;

        await patchPost.save();

        res.json(patchPost);

    } catch(err) {
        console.error('Errore nella modifica', err);
        res.status(500).json({message: err.message});
    }
})

// DELETE /blogPosts/:id - Elimina un post del blog
router.delete('/:id', async (req,res) => {
    try {
        const deletedPost = await BlogPosts.findByIdAndDelete(req.params.id);
        if(!deletedPost) {
            return res.status(404).json({message: 'Post non trovato'})
        } else {
            res.json({message: 'Post cancellato'});
        }
    } catch(err) {
        res.status(500).json({message: err.message});
    }
});



// SEZIONE COMMENTI //

// GET /blogPosts/:id/comments => ritorna tutti i commenti di uno specifico post
router.get("/:id/comments", async (req, res) => {
    try {
      // Cerca il post nel database usando l'ID fornito
      const post = await BlogPosts.findById(req.params.id);
      if (!post) {
        // Se il post non viene trovato, invia una risposta 404
        return res.status(404).json({ message: "Post non trovato" });
      }
      // Invia i commenti del post come risposta JSON
      res.json(post.comments);
    } catch (error) {
      // In caso di errore, invia una risposta di errore
      res.status(500).json({ message: error.message });
    }
});

// GET /blogPosts/:id/comments/:commentId => ritorna un commento specifico di un post specifico
router.get('/:id/comments/:commentId', async (req,res) => {
    try {
        // Cerco il post specifico usando l'id fornito
        const post = await BlogPosts.findById(req.params.id);
        // Verifico che il post non sia presente 
        if(!post) {
            return res.status(404).json({message: 'Post non presente'})
        };
        // Cerco il commento all'interno del post
        const comment = post.comments.id(req.params.commentId); // non uso await perché il post in questo caso è stato trovato
        // Verifico se il commento non viene trovato
        if(!comment) {
            return res.status(404).json({message: 'Commento non presente'});
        }
        // Restituisco il commento
        res.json(comment);
    } catch(err) {
        res.status(500).json({ message: err.message });
    }    
});

// POST /blogPosts/:id/comments => aggiungi un nuovo commento ad un post specifico
router.post('/:id/comments', async (req,res) => {
    try {
        // Cerco il post presente nel db
        const post = await BlogPosts.findById(req.params.id);
        // Verifico che il post non sia presente
        if(!post) {
            return res.status(404).json({message: 'Post non presente'})
        };
        // Creo un nuovo oggetto con i dati forniti
        const newComment = {
            name: req.body.name,
            email: req.body.email,
            content: req.body.content
        };
        // Pusho i commenti nell'array dei commenti
        post.comments.push(newComment);
        // Salvo le modifiche nel db
        await post.save();
        // Invio la risposta di avvenuta creazione del post
        res.status(201).json(newComment);
    } catch(err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT /blogPosts/:id/comments/:commentId => cambia un commento di un post specifico
router.put('/:id/comments/:commentId', async (req,res) => {
    try {
        // Cerco il post presente nel db
        const post = await BlogPosts.findById(req.params.id);
        // Verifico che il post non sia presente
        if(!post) {
            return res.status(404).json({message: 'Post non presente'})
        };
        // Cerco il commento specifico all'interno del post
        const comment = post.comments.id(req.params.commentId);
        // Verifico se il commento è presente
        if(!comment) {
            return res.status(404).json({ message: "Commento non trovato" });
        };
        // Aggiorno il contenuto del commento
        comment.content = req.body.content;
        // Salvo le modifiche nel db
        await post.save();
    } catch(err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE /blogPosts/:id/comments/:commentId => elimina un commento specifico da un post specifico
router.delete('/:id/comments/:commentId', async (req,res) => {
    try {
        // Cerco il post presente nel db
        const post = await BlogPosts.findById(req.params.id);
        // Verifico che il post non sia presente
        if(!post) {
            return res.status(404).json({message: 'Post non presente'})
        };
        // Cerco il commento specifico all'interno del post
        const comment = post.comments.id(req.params.commentId);
        // Verifico se il commento è presente
        if(!comment) {
            return res.status(404).json({ message: "Commento non trovato" });
        };
        // Rimuovo il commento dal db
        comment.remove();
        // Salvo il post nel db
        await post.save();
        // Invio un messaggio di confermo per capire che è andato tutto a buon fine
        res.json({ message: "Commento eliminato con successo!" });
    } catch(err) {
        res.status(400).json({ message: err.message });
    }
});

// GET /blogPosts/author/:email - Recupera tutti i post di un autore specifico
router.get('/author/:email', async (req, res) => {
    try {
      console.log("Email ricevuta:", req.params.email);
      const posts = await BlogPosts.find({ author: req.params.email });
      console.log("Post trovati:", posts.length);
      if (posts.length === 0) {
        return res.status(404).json({ message: "Nessun post trovato per questo autore" });
      }
      res.json(posts);
    } catch (err) {
      console.error("Errore server:", err);
      res.status(500).json({ message: err.message });
    }
  });



export default router;


