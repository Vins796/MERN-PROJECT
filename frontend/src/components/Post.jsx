import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Post({posts}) {
    if (!Array.isArray(posts)) {
        return <div>Caricamento in corso...</div>;
    }

    return (
        <>
            {posts.map((post) => (
                <motion.div 
                    className="mt-1 sm:mt-2 md:mt-4 lg:mt-6 xl:mt-8 2xl:mt-12 relative overflow-hidden rounded-[20px] h-[550px] max-w-[350px] mx-auto group"
                    key={post._id}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link to={`/post/${post._id}`}>
                        <div className="relative h-full w-full">
                            <img 
                                className="h-full w-full object-cover mt-[30px] rounded-[20px]" 
                                src={post.cover} 
                                alt={post.title} 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <h2 className="font-mono text-[22px] font-bold mb-2 line-clamp-2">{post.title}</h2>
                                <p className="font-mono text-xs line-clamp-3 mb-3">{post.content}</p>
                            </div>
                        </div>
                    </Link>  
                </motion.div>
            ))}
        </>
    )
}