import { useEffect, useState } from "react";
import { getAuthor, getPosts } from "../services/api.js";
import Post from "../components/Post";
import Pagination from "../components/Pagination.jsx";

const PostSkeleton = () => (
    <div className="bg-gray-800 rounded-lg shadow-md p-4 animate-pulse h-[340px]"></div>
);

export default function Home() {

    // AUTORI
    const [posts, setPosts] = useState([]);
    const [author, setAuthor] = useState([]);

    // PAGINAZIONE
    const [currentPage, setCurrentPage] = useState(1); // Pagina corrente
    const [totalPages, setTotalPages] = useState(1); // Numero totale di pagine
    const [limit, setLimit] = useState(10); // Numero limite di utenti per pagina

    const fetchPosts = async () => {
        try {
            // Ritardo artificiale di 1.5 secondi
            await new Promise(resolve => setTimeout(resolve, 1500));
            const response = await getPosts(currentPage, limit);
            setPosts(response.data.blogPost);
            setCurrentPage(response.data.currentPage);
            setTotalPages(response.data.totalPages);
        } catch(err) {
            console.error('Errore nella richiesta dei post', err);
        }
    }

    useEffect(() => {
        fetchPosts();
    }, [currentPage, limit]);

    return (
    <main className="px-[10%] min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black dark:bg-white dark:from-white dark:via-gray-100 dark:to-gray-200">
        <div className="pt-[50px]">
            <h1 className="text-3xl font-mono text-white dark:text-black">Benvuenuto sul mio Blog!</h1>
        </div>
        <div className="mt-[30px] mb-[50px] grid grid-cols md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-[50px]">
            {posts.length === 0 ? (
                // Mostra gli scheletri durante il caricamento
                Array(limit).fill().map((_, index) => (
                    <PostSkeleton key={index}/>
                ))
                ) : (
                <Post posts={posts} />
            )}
        </div>
        <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} limit={limit} setLimit={setLimit}/>
    </main>
    )
}
