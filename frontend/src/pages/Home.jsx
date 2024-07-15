import { useEffect, useState } from "react";
import { getPosts, getUserData } from "../services/api.js";
import Post from "../components/Post";
import Pagination from "../components/Pagination.jsx";
import { useNavigate } from "react-router-dom";

// Scheletro dei post
const PostSkeleton = () => (
    <div className="bg-gray-800 rounded-lg shadow-md p-4 animate-pulse h-[340px]"></div>
);

export default function Home({search}) {

    // AUTORI
    const [posts, setPosts] = useState([]);
    const [authorData, setAuthorData] = useState(null);

    // PAGINAZIONE
    const [currentPage, setCurrentPage] = useState(1); // Pagina corrente
    const [totalPages, setTotalPages] = useState(1); // Numero totale di pagine
    const [limit, setLimit] = useState(10); // Numero limite di utenti per pagina

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // fetch dei post
    const fetchPosts = async () => {
        const token = localStorage.getItem("token"); // Controllo se esiste un token nel localStorage
        // console.log("Token nel localStorage prima della richiesta:", token);
        if (!token) {
            console.log("Nessun token trovato, reindirizzamento al login");
            navigate("/login");
            return;
        }
        try {
            // Ritardo artificiale di 1.5 secondi
            await new Promise(resolve => setTimeout(resolve, 1500));
            const response = await getPosts(currentPage, limit, search);
            setPosts(response.data.blogPost); // Imposta i post
            setCurrentPage(response.data.currentPage); // Imposta la pagina corrente
            setTotalPages(response.data.totalPages); // Imposta il numero totale di pagine
        } catch(err) {
            console.error('Errore nella richiesta dei post', err);
            if (err.response && err.response.status === 401) { // Controllo se la risposta ha lo stato 401 Unauthorized
                console.log("Token scaduto o non valido, reindirizzamento al login");
                localStorage.removeItem("token"); // Rimuovi il token scaduto
                navigate("/login");
            }
        }
    }
    // Fetch dei post
    useEffect(() => {
        fetchPosts();
    }, [currentPage, limit, search]);
    // Controllo lo stato di login
    useEffect(() => {
        // Controlla se esiste un token nel localStorage
        const checkLoginStatus = () => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
        };

        // Controlla lo stato di login all'avvio
        checkLoginStatus();

        // Aggiungi un event listener per controllare lo stato di login
        window.addEventListener("storage", checkLoginStatus);

        // Rimuovi l'event listener quando il componente viene smontato
        return () => {
        window.removeEventListener("storage", checkLoginStatus);
        };
    }, []);

    // Fetch dei dati dell'autore
    const fetchAuthorData = async () => {
        try {
            setIsLoading(true); // Imposta lo stato di caricamento
            const token = localStorage.getItem("token"); // Controllo se esiste un token nel localStorage
            if (!token) { // Se non esiste, reindirizza alla pagina di login
                navigate("/login");
                return;
            }
            const user = await getUserData();
            setAuthorData(user);
        } catch(err) {
            console.error("Errore nella richiesta dei dati dell'autore", err);
        } 
        setIsLoading(false);       
    };

    // Fetch dei dati dell'autore
    useEffect(() => {
        fetchAuthorData();
    }, []);


    return (
        <>
            {isLoggedIn ? ( // Controllo se l'utente è loggato
                <main className="px-[10%] min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black dark:bg-white dark:from-white dark:via-gray-100 dark:to-gray-200">
                    <div className="pt-[50px]">
                        <h1 className="text-3xl font-mono text-white dark:text-black">Benvuenuto sul mio Blog, <span className="text-[#01FF84]">{authorData?.nome ? `, ${authorData.nome}!` : '!'}</span></h1>
                    </div>
                    <div className="mt-[30px] mb-[50px] grid grid-cols md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-[50px]">
                        {posts.length === 0 ? (
                            // Mostra gli scheletri durante il caricamento
                            // limit = numero di scheletri da mostrare
                            // fill = crea un array di dimensioni limitate
                            Array(limit).fill().map((_, index) => (
                                <PostSkeleton key={index}/>
                            ))
                            ) : (
                            <Post posts={posts} />
                        )}
                    </div>
                    <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} limit={limit} setLimit={setLimit}/>
                </main>
            ) : (
                // Se l'utente non è loggato, reindirizza alla pagina di login
                navigate("/login")
            )}
        </>
        
        
    )
}
