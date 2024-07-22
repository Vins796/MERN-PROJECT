import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createComment, getAuthorByEmail, getComments, getPost, getMe, deleteComment, deletePost, updatePost } from "../services/api";

import { HandThumbUpIcon } from '@heroicons/react/24/outline';
import { ChatBubbleOvalLeftIcon } from '@heroicons/react/24/outline';
import DeleteModal from "../components/DeleteModal";
import ModifyModal from "../components/ModifyModal";

export default function SinglePost() {

  const navigate = useNavigate(); // Permette di navigare tra le pagine

  // Imposto un counter a 0 per i like
  const [counter, setCounter] = useState(0);
  // Creo la funzione per incrementare il contatore dei like
  const handleClick = () => {
    setCounter(counter + 1);
  };

  const [isPostOwner, setIsPostOwner] = useState(false);
  // Imposto lo stato del modal di cancellazione del post
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false); // Imposto lo stato del modal di modifica del post

  // Imposto lo stato a false per la visualizzazione del form dei commenti
  const [isVisible, setIsVisible] = useState(false);
  // Funzione del toggle per mostrare e nascondere il form dei commenti
  const toggleCommentForm = () => {
    setIsVisible(!isVisible);
  };

  // Ottengo l'id del post
  const { id } = useParams();
  const [userData, setUserData] = useState(null); // Imposto lo stato di userData a null

  // Definisco lo stato del post come array vuoto per iniettarci la response all'interno
  const [singlePost, setSinglePost] = useState([]);

  // Definisco cioò che mi serve per la creazione di un nuovo commento
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({
    name: '',
    email: '',
    content: ''
  });

  // Imposto lo stato delle email dell'utente
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  // Funzione per ottenere i dati dell'utente
  useEffect(() => {
    const fetchUserData = async () => { // Funzione per recuperare i dati dell'utente
      try {
        const user = await getMe(); // Richiede i dati dell'utente
        setCurrentUserEmail(user.email); // Imposta lo stato dell'email dell'utente
        setNewComment(prevComment => ({ // Imposta lo stato del nuovo commento
          ...prevComment,
          name: `${user.nome} ${user.cognome}`.trim(), // Imposta lo stato del nome dell'utente
          email: user.email || '' // Imposta lo stato dell'email dell'utente
        }));
        // Controllo se l'utente è l'autore del post
        setIsPostOwner(user.email === singlePost.author); // Imposta lo stato se l'utente è l'autore del post
      } catch (error) {
          console.error("Errore nel recupero dei dati utente:", error); // Mostro un messaggio di errore
      }
    };
    fetchUserData();
  }, [singlePost.author]);
  
  // Funzione per ottenere sia il post che i commenti
  useEffect(() => {
    const fetchPostAndComments = async () => { // Funzione per recuperare il post e i commenti  
        try{
            const PostResponse = await getPost(id); // Richiede il post
            setSinglePost(PostResponse.data);
            
            const commentsResponse = await getComments(id); // Richiede i commenti
            // console.log(commentsResponse.data);
            setComments(commentsResponse.data) // Imposta lo stato dei commenti
        }catch(err) {
            console.error('Errore nella richiesta dei post', err); // Mostro un messaggio di errore
        }
    }
    fetchPostAndComments(); // Chiamo la funzione
  }, [id]);

  // Funzione per cancellare il post
  const handleDeletePost = async () => { // Funzione per cancellare il post
    try {
      console.log("Deleting post with ID:", id); // Mostro un messaggio di conferma
      const response = await deletePost(id); // Richiede la cancellazione del post
      // console.log("Risposta del server:", response);
      navigate("/"); // Navigo alla pagina principale
      
    } catch(err) {
      console.error("Errore nella cancellazione del post:", err);
    }      
  };

  // Funzione per modificare il post
  const handleModifySubmit = async (modifiedPost) => { // Funzione per modificare il post
    try {
      const response = await updatePost(modifiedPost, id);
      console.log("Post modificato con successo:", response);
      setSinglePost(modifiedPost);
      setIsModifyModalOpen(false);
    } catch (error) {
      console.error("Errore nella modifica del post:", error);
    }
  };

  // Funzione asincrona che gestisce l'invio del form dei commenti
  const handleCommentSubmit = async (e) => {
    e.preventDefault();    
    try {
      const createdComment = await createComment(id, newComment); 
      // console.log("Risposta del server per il nuovo commento:", createdComment);
      
      if (createdComment && createdComment._id) {
        setComments(prevComments => [...prevComments, createdComment]);        
        setNewComment({name: "", email: "", content: ""});
        // console.log("Commento aggiunto con successo:", createdComment);
      } else {
        console.error("Risposta del server non valida:", createdComment);
      }
    } catch(err) {
      console.error("Errore nell'aggiunta del commento:", err);
    }
  };

  // Funzione per gestire il cambio dei dati del commento
  const handleCommentChange = (e) => {
    const { name, value } = e.target;
    setNewComment((prev) => ({ ...prev, [name]: value }));
  };

  // Funzione per cancellare un commento
  const handleDeleteComment = async (commentId) => {
    if (!commentId) {
      console.error("ID del commento non valido");
      return;
    }
    console.log("Deleting comment with ID:", commentId);
    try {
      const response = await deleteComment(id, commentId);
      // console.log("Risposta del server:", response);
      if (response.message === "Commento eliminato con successo!") {
        setComments(prevComments => prevComments.filter(comment => comment._id !== commentId));
      } else {
        console.error("Errore imprevisto nella cancellazione del commento");
      }
    } catch (error) {
      console.error("Errore nella cancellazione del commento:", error.response?.data || error.message);
    }
  };

  // Funzione per navigare al profilo dell'autore
  const navigateToProfile = async (email) => {
    try {
      const response = await getAuthorByEmail(email); // Richiede l'autore del post 
      if (response && response.data && response.data._id) { // Controllo se l'autore è stato trovato
        const authorId = response.data._id; // Imposta lo stato dell'ID dell'autore
        navigate(`/profile/${authorId}`);
      } else {
        // Autore non trovato
        alert("Profilo autore non disponibile.");
      }
    } catch (error) {
      console.error("Errore nel recupero dell'ID dell'autore:", error);
      if (error.response && error.response.status === 404) {
        alert("Profilo autore inesistente.");
      } else {
        alert("Si è verificato un errore nel recupero del profilo dell'autore.");
      }
    }
  };

  return (
    <div className="flex justify-center py-[30px] md:py-[60px] min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black dark:bg-white dark:from-white dark:via-gray-100 dark:to-gray-200">
      <div className="w-full max-w-4xl px-4 md:px-0">
        <img className="rounded-[20px] h-[200px] md:h-[400px] lg:h-[500px] w-full object-cover mt-[40px] md:mt-[80px]" src={singlePost.cover} alt={singlePost.title} />
        <div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-[15px] md:gap-[30px] mt-[20px] md:mt-[40px]">
            <div className="flex flex-col">
              <h1 className="text-2xl md:text-3xl mt-3 md:mt-5 mb-2 font-mono text-white dark:text-black">{singlePost.title}</h1>
              <p className="font-mono mb-2 text-white dark:text-black">Autore: <span onClick={() => navigateToProfile(singlePost.author)} className="text-[#01FF84] dark:text-black cursor-pointer">{singlePost.author}</span></p>
              <p className="font-mono text-sm md:text-base text-white dark:text-black">{singlePost.content}</p>
            </div>
            {isPostOwner && (
              <div className="flex items-center gap-2 mt-4 md:mt-0">
                <button onClick={() => setIsModifyModalOpen(true)} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs md:text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 md:h-10 px-2 md:px-4 py-1 md:py-2 hover:text-white hover:bg-orange-400 dark:border-black text-white dark:text-black">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4"
                  >
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                    <path d="m15 5 4 4"></path>
                  </svg>
                  Modify
                </button>
                <button onClick={() => setIsDeleteModalOpen(true)} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs md:text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background h-8 md:h-10 px-2 md:px-4 py-1 md:py-2 text-red-500 hover:bg-red-500 hover:text-red-50 dark:border-black">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4"
                  >
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    <line x1="10" x2="10" y1="11" y2="17"></line>
                    <line x1="14" x2="14" y1="11" y2="17"></line>
                  </svg>
                  Delete
                </button>
                {isDeleteModalOpen && <DeleteModal handleDeletePost={handleDeletePost} onClose={() => setIsDeleteModalOpen(false)}/>}
                {isModifyModalOpen && <ModifyModal post={singlePost} onClose={() => setIsModifyModalOpen(false)} onModify={handleModifySubmit}/>}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-[14px] mt-[14px]">
            <HandThumbUpIcon className="h-[24px] md:h-[30px] cursor-pointer text-white dark:text-black" onClick={handleClick}/> <span className="text-white dark:text-black">{counter}</span>
            <ChatBubbleOvalLeftIcon onClick={toggleCommentForm} className="h-[24px] md:h-[30px] cursor-pointer text-white dark:text-black"/>
          </div>
          <div className="mt-[14px]">
            <h2 className="text-xl md:text-2xl text-center font-mono text-white dark:text-black">Commenti</h2>
            <div className="mt-3 overflow-y-auto max-h-[300px] md:max-h-[400px]">
              {comments.map((comment, index) => (
                <div key={index} className="p-3 md:p-4 border border-black mb-2">
                  <h3 className="font-semibold font-mono text-sm md:text-base text-[#01FF84] dark:text-black">{comment.name} <span onClick={() =>navigateToProfile(comment.email)} className="font-normal text-white dark:text-black cursor-pointer">/ {comment.email}</span></h3>
                  <p className="text-sm md:text-base text-white dark:text-black">{comment.content}</p>
                  {comment.email === currentUserEmail && (
                    <button 
                      onClick={() => handleDeleteComment(comment._id)}
                      className="inline-flex items-center rounded-md bg-red-500 px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm text-white transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 mt-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4"
                      >
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      </svg>
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>

            {isVisible && (
              <form className="mt-[30px] md:mt-[50px]" onSubmit={handleCommentSubmit}>
                <h3 className="text-xl md:text-2xl font-mono text-center mb-3 text-white dark:text-black">Lascia un commento</h3>
                <input onChange={handleCommentChange} type="text" name="name" value={newComment.name} placeholder="Nome..." className="p-[20px] w-full mb-4 text-black hidden" readOnly/>
                <input onChange={handleCommentChange} type="email" name="email" value={newComment.email} placeholder="Email..." className="p-[20px] w-full mb-4 text-black hidden" readOnly/>
                <input onChange={handleCommentChange} type="text-area" name="content" value={newComment.content} placeholder="     Lascia un commento..." className="py-3 md:py-5 w-full mb-3 text-black"/>
                <button className="w-full text-black bg-[#01FF84] border border-[#000] text-[16px] md:text-[20px] font-semibold font-mono hover:text-white hover:bg-stone-950 p-2 md:p-3 transition duration-300 ease-in-out" type="submit">Invia</button>
              </form>
            )}  
          </div>
        </div>
      </div>
    </div>
  )
}
