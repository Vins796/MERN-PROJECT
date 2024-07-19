import { Link } from "react-router-dom"; // Importo Link
import { motion } from "framer-motion";

export default function Post({posts}) {

    // Controllo se i post sono stati recuperati
    // !Array.isArray(posts) controlla se posts è un array
    if (!Array.isArray(posts)) {
        return <div>Caricamento in corso...</div>;
    }

    return (
        <>
            {
                posts.map((post) => (
                    <motion.div className="my-[24px]" key={post._id}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Link to={`/post/${post._id}`} key={post._id}>
                            <div className="h-[340px]">
                                <img className="h-full rounded-t-[20px] w-full" src={post.cover} alt={post.title} />
                            </div>
                            <div className="bg-black w-full rounded-b-[20px] p-4 whitespace-nowrap">
                                <h2 className="font-mono text-white text-[24px] text-ellipsis overflow-hidden">{post.title}</h2>
                                <p className="font-mono text-gray-400">Autore: <span className="text-[#01FF84]">{post.author}</span></p>
                            </div>
                        </Link>  
                    </motion.div>
                ))
            }
        </>
    )
}
