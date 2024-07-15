import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createComment, getAuthorByEmail, getComments, getPost } from "../services/api";

import { HandThumbUpIcon } from '@heroicons/react/24/outline';
import { ChatBubbleOvalLeftIcon } from '@heroicons/react/24/outline';

export default function SinglePost() {

  const navigate = useNavigate();

  // Imposto un counter a 0 per i like
  const [counter, setCounter] = useState(0);
  // Creo la funzione per incrementare il contatore dei like
  const handleClick = () => {
    setCounter(counter + 1);
  };

  // Imposto lo stato a false per la visualizzazione del form dei commenti
  const [isVisible, setIsVisible] = useState(false);
  // Funzione del toggle per mostrare e nascondere il form dei commenti
  const toggleCommentForm = () => {
    setIsVisible(!isVisible);
  };

  // Ottengo l'id del post
  const { id } = useParams();

  // Definisco lo stato del post come array vuoto per iniettarci la response all'interno
  const [singlePost, setSinglePost] = useState([]);

  // Definisco cioò che mi serve per la creazione di un nuovo commento
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({
    name: '',
    email: '',
    content: ''
  });
  
  // Funzione per ottenere sia il post che i commenti
  useEffect(() => {
    const fetchPostAndComments = async () => {
        try{
            const PostResponse = await getPost(id);
            setSinglePost(PostResponse.data);
            
            const commentsResponse = await getComments(id);
            // console.log(commentsResponse.data);
            setComments(commentsResponse.data)
        }catch(err) {
            console.error('Errore nella richiesta dei post', err);
        }
    }
    fetchPostAndComments();
  }, [id]);

  // Funzione asincrona che gestisce l'invio del form dei commenti
  const handleCommentSubmit = async (e) => {
    // Previene il comportamento predefinito del form (refresh della pagina)
    e.preventDefault();    
    try {
        // Invia la richiesta al server per creare un nuovo commento
        // 'id' è l'ID del post, 'newComment' contiene i dati del commento
        const createdComment = await createComment(id, newComment);        
        // Aggiorna lo stato dei commenti aggiungendo il nuovo commento
        // Usa una funzione di callback per assicurarsi di avere lo stato più recente
        setComments(prevComments => [...prevComments, createdComment.data]);        
        // Resetta il form del commento svuotando tutti i campi
        setNewComment({name: "", email: "", content: ""});
    } catch(err) {
        // In caso di errore durante l'aggiunta del commento, logga l'errore nella console
        console.error("Errore nell'aggiunta del commento:", err);
    }
  };

  const handleCommentChange = (e) => {
    const { name, value } = e.target;
    setNewComment((prev) => ({ ...prev, [name]: value }));
  };

  const navigateToProfile = async (email) => {
    try {
      // console.log("Navigating to profile for email:", email);
      const response = await getAuthorByEmail(email);
      // console.log("Author response:", response);
      if (response && response.data && response.data._id) {
        const authorId = response.data._id;
        // console.log("Navigating to:", `/profile/${authorId}`);
        navigate(`/profile/${authorId}`);
      } else {
        console.error("Invalid response structure:", response);
        alert("Impossibile trovare il profilo dell'autore.");
      }
    } catch (error) {
      console.error("Errore nel recupero dell'ID dell'autore:", error);
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", error.response.data);
      }
      alert(`Si è verificato un errore nel recupero del profilo dell'autore: ${error.message}`);
    }
  };

  return (
    <div className="flex justify-center py-[60px] min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black dark:bg-white dark:from-white dark:via-gray-100 dark:to-gray-200">
      <div>
        <img className="rounded-[20px] h-[500px] mx-auto w-[1000px]" src={singlePost.cover} alt={singlePost.title} />
        <div>
          <h1 className="text-3xl mt-5 mb-2 font-mono text-white dark:text-black">{singlePost.title}</h1>
          <p className="font-mono mb-2 text-white dark:text-black">Autore: <span onClick={() => navigateToProfile(singlePost.author)} className="text-[#01FF84] dark:text-black cursor-pointer">{singlePost.author}</span></p>
          {/* {console.log("Author email", singlePost.author)} */}
          <p className="font-mono text-white dark:text-black">{singlePost.content}</p>
          <div className="flex items-center gap-[14px] mt-[14px]">
            <HandThumbUpIcon className="h-[30px] cursor-pointer text-white dark:text-black" onClick={handleClick}/> <span className="text-white dark:text-black">{counter}</span>
            <ChatBubbleOvalLeftIcon onClick={toggleCommentForm} className="h-[30px] cursor-pointer text-white dark:text-black"/>
          </div>
          <div className="mt-[14px]">
            <h2 className="text-2xl text-center font-mono text-white dark:text-black">Commenti</h2>
            <div className="mt-3 overflow-y-auto">
              {/* // TODO : qua dovrò stampare i commenti  */}
              {comments.map((comment, index) => (
                <div key={index} className="p-4 border border-black">
                  <h3 className="font-semibold font-mono text-[#01FF84] dark:text-black">{comment.name} <span onClick={() =>navigateToProfile(comment.email)} className="font-normal text-white dark:text-black cursor-pointer">/ {comment.email}</span></h3>
                  <span className="text-white dark:text-black">{comment.content}</span>
                </div>
              ))}
            </div>

            {isVisible && (
              <form className="mt-[50px]" onSubmit={handleCommentSubmit}>
                <h3 className="text-2xl font-mono text-center mb-3 text-white">Lascia un commento</h3>
                <input onChange={handleCommentChange} type="text" name="name" value={newComment.name} placeholder="Nome..." className="p-[20px] w-full mb-4 text-black"/>
                <input onChange={handleCommentChange} type="email" name="email" value={newComment.email} placeholder="Email..." className="p-[20px] w-full mb-4 text-black"/>
                <input onChange={handleCommentChange} type="text-area" name="content" value={newComment.content} placeholder="     Lascia un commento..." className="py-5 w-full mb-3 text-black"/>
                <button className="w-full text-black bg-[#01FF84] border border-[#000] text-[20px] font-semibold font-mono hover:text-white hover:bg-stone-950 p-3 transition duration-300 ease-in-out" type="submit">Invia</button>
              </form>
            )}  
          </div>
        </div>
      </div>
    </div>
  )
}
