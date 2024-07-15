import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost, getMe } from "../services/api.js";

export default function CreatePost() {

  const navigate = useNavigate();

  const [post, setPost] = useState({
    title: '',
    category: '',
    content: '',
    cover: '',
    readTime: {
        value: 0,
        unit: 'minutes'
    },
    author: ''
  });

  const [coverFile, setCoverFile] = useState(null);

  // Recupero l'email dell'utente loggato
  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const userData = await getMe();
        setPost((prevPost) => ({ ...prevPost, author: userData.email }));
      } catch (error) {
        console.error("Errore nel recupero dei dati utente:", error);
        navigate("/login");
      }
    };
    fetchUserEmail();
  }, [navigate]);


  const handleChange = (e) => {
      const {name, value} = e.target;
      if(name === 'readTimeValue') {
          setPost({...post, readTime: {...post.readTime, value: parseInt(value)}});
      } else {
          setPost({...post, [name]: value});
      }
  } 

  const handleSubmit = async (e) => {
      e.preventDefault();
      try{
        const formData = new FormData();
        Object.keys(post).forEach((key) => {
          if(key === 'readTime') {
            formData.append("readTime[value]", post.readTime.value);
            formData.append("readTime[unit]", post.readTime.unit);
          } else {
            formData.append(key, post[key]);
          }

        })

        if(coverFile) {
          formData.append('cover', coverFile);
        }

        await createPost(formData);
        navigate('/');
      }catch(err) {
          console.error('Errore stupido', err);
      }
  }

  const handleFileChange = (e) => {
    setCoverFile(e.target.files[0]);
  }

  return (
    <div className="min-h-screen bg-radial-gradient from-gray-900 via-gray-800 to-black flex items-center justify-center dark:bg-white dark:from-white dark:via-gray-100 dark:to-gray-200">
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md mx-auto">
        <h1 className="text-3xl mb-6 font-mono text-center">Create New Post</h1>
        
        <div className='flex flex-col gap-4'>
          <div className="flex flex-col">
            <label htmlFor="title" className="mb-1 font-semibold font-mono">Title</label>
            <input 
              id="title"
              className='px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
              type="text"
              name="title"
              value={post.title}
              onChange={handleChange}
              required
            />
          </div>
      
          <div className="flex flex-col">
            <label htmlFor="category" className="mb-1 font-semibold font-mono">Category</label>
            <input 
              id="category"
              className='px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
              type="text"
              name="category"
              value={post.category}
              onChange={handleChange}
              required
            />
          </div>
      
          <div className="flex flex-col">
            <label htmlFor="cover" className="mb-1 font-semibold font-mono">Cover Image</label>
            <input 
              id="cover"
              className='px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
              type="file"
              name="cover"
              onChange={handleFileChange}
              required
            />
          </div>
      
          <div className="flex flex-col">
            <label htmlFor="readTimeValue" className="mb-1 font-semibold font-mono">Read Time (minutes)</label>
            <input 
              id="readTimeValue"
              className='px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
              type="number"
              name="readTimeValue"
              value={post.readTime.value}
              onChange={handleChange}
              required
            />
          </div>
      
          <div className="flex flex-col">
            <label htmlFor="author" className="mb-1 font-semibold font-mono">Author Email</label>
            <input 
              id="author"
              className='px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
              type="email"
              name="author"
              value={post.author}
              readOnly
            />
          </div>
      
          <div className="flex flex-col">
            <label htmlFor="content" className="mb-1 font-semibold font-mono">Content</label>
            <textarea 
              id="content"
              className='px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32'
              name="content"
              value={post.content}
              onChange={handleChange}
              required
            />
          </div>
      
          <button type="submit" className="mt-4 text-black bg-[#01FF84] border-2 border-solid border-[#01FF84] text-[20px] font-bold  font-mono hover:text-white hover:bg-stone-950 rounded-lg p-3 transition duration-300 ease-in-out">
            Create Post
          </button>
        </div>  
      </form>
    </div>
  )
}
