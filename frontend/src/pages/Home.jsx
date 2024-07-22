import { useEffect, useState } from "react";
import { getPosts, getUserData } from "../services/api.js";
import Post from "../components/Post";
import Pagination from "../components/Pagination.jsx";
import { useNavigate } from "react-router-dom";


// Scheletro dei post
const PostSkeleton = () => (
    <div className="bg-gray-800 rounded-lg shadow-md p-4 animate-pulse h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] xl:h-[550px] w-full max-w-[350px] mb-6 mx-auto mt-6 sm:mt-6 md:mt-8 lg:mt-12 xl:mt-16"></div>
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
            await new Promise(resolve => setTimeout(resolve, 1000));
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
            {isLoggedIn ? (           
                <main className="relative z-0 min-h-screen mx-auto bg-gradient-to-br from-gray-900 via-gray-800 to-black dark:from-white dark:via-gray-100 dark:to-gray-200">
                    
                    <div className="pt-24 sm:pt-24 md:pt-28 lg:pt-32">
                        <h1 className="lg:mt-5 text-center text-2xl sm:text-4xl font-mono text-white dark:text-black">
                            Benvenuto<span className="text-[#01FF84] dark:text-black">{authorData?.nome ? ` ${authorData.nome}!` : '!'}</span>
                        </h1>
                    </div>
                    <div className="max-w-8xl mx-auto mt-0 sm:mt-0 md:mt-0 lg:mt-0 mb-[50px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-0">
                        {posts.length === 0 ? (
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
                navigate("/login")
            )}
        </>
    )
}
