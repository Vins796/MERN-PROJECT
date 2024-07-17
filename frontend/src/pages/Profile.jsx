import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import avatarLogo from '../assets/avatar.jpeg';
import { getAuthor, getPostAuthor } from "../services/api";

export default function Profile({search}) {

    const {id} = useParams();
    const [author, setAuthor] = useState([]);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetchAuthor();
    }, [id]);

    useEffect(() => {
        // console.log("Dati autore:", author);
        if (author && author.email) {
        //   console.log("Email autore:", author.email);
          fetchPosts();
        }
    }, [author, author.email]);

    const [filteredPosts, setFilteredPosts] = useState([]);

    useEffect(() => {
        if (posts.length > 0) {
            const filtered = posts.filter(post =>
                post.title.toLowerCase().includes(search.toLowerCase()) ||
                post.content.toLowerCase().includes(search.toLowerCase())
            );
            setFilteredPosts(filtered);
        }
    }, [posts, search]);

    const fetchAuthor = async () => {
            try {
                const response = await getAuthor(id);
                setAuthor(response.data);
            } catch(error) {
                console.error(error);
            }
    }

    const fetchPosts = async () => {
        if (author && author.email) {
          try {
            const response = await getPostAuthor(author.email);
            setPosts(response.data);
          } catch (error) {
            if (error.response && error.response.status === 404) {
              console.log("Nessun post trovato per questo autore");
              setPosts([]); // CASO IN CUI NON CI SONO POST
            } else {
              console.error("Errore nel recupero dei post:", error);
            }
          }
        }
    };

  return (    
        <main className="flex justify-center min-h-screen pt-[50px] bg-gradient-to-br from-gray-900 via-gray-800 to-black dark:bg-white dark:from-white dark:via-gray-100 dark:to-gray-200">
            <div className="flex flex-col items-center">
                <div>
                    <img src={avatarLogo} alt="imageLogo" className="w-40 h-40 rounded-full mb-[20px] mx-auto"/>
                </div>
                <div className="text-center">
                    <h1 className="text-2xl font-bold font-mono text-white dark:text-black">{author.nome} {author.cognome}</h1>
                    <p className="text-gray-500 font-mono">{author.email}</p>
                    <p className="text-gray-500 font-mono">{author.dataDiNascita}</p>
                </div>
                <div>
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map((post) => (
                                <div className="my-[24px] hover:animate-bounce-light-smooth" key={post._id}>
                                    <Link to={`/post/${post._id}`} key={post._id}>
                                        <div className="h-[340px]">
                                            <img className="h-full rounded-t-[20px] w-full" src={post.cover} alt={post.title} />
                                        </div>
                                        <div className="bg-black w-full rounded-b-[20px] p-4">
                                            <h2 className="font-mono text-white text-[24px]">{post.title}</h2>
                                            <p className="font-mono text-gray-400">Autore: {post.author}</p>
                                        </div>
                                    </Link>  
                                </div>
                        ))
                    ) : (
                        <p>Nessun post disponibile per questo autore.</p>
                    )}
                </div>
            </div>
        </main>    
  )
}
