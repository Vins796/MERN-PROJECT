import axios from 'axios';

const API_URL = 'https://mern-project-u054.onrender.com/api' || 'http://localhost:5001/api';
const api = axios.create({baseURL: API_URL});

// Aggiungi un interceptor per includere il token in tutte le richieste
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.log('Nessun token fornito');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getPosts = (page = 1, limit = 10, search = '') => {
    return api.get(`/blogPosts?page=${page}&limit=${limit}&search=${search}`);
};
export const getPost = (id) => api.get(`/blogPosts/${id}`);
export const createPost = (postData) => api.post('/blogPosts/', postData, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});
export const updatePost = (postData, id) => api.put(`/blogPosts/${id}`, postData);
export const deletePost = (id) => api.delete(`/blogPosts/${id}`);

// --------------------------------------------------------------------------------------------------------- //

// Se poi aggiungiamo operazioni sugli autori le mettiamo qua sotto
export const getAuthors = (page = 1, limit = 10) => {
    return api.get(`/authors?page=${page}&limit=${limit}`);
};
export const getAuthor = (id) => api.get(`/authors/${id}`);
export const createAuthor = (authorData) => api.post('/authors/', authorData, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});

export const getAuthorByEmail = (email) => {
  // console.log("Email:", email);
  return api.get(`/authors/mail/${email}`);
} 
  

export const getPostAuthor = async (authorEmail) => {
  if (!authorEmail) {
    throw new Error("L'email è undefined");
  }
  
  const url = `${API_URL}/blogPosts/author/${authorEmail}`;
  // console.log("URL completo della richiesta:", url);
  
  try {
    const response = await api.get(url);
    return response;
  } catch (error) {
    console.error("Errore dettagliato:", error.response || error);
    throw error;
  }
};


export const updateAuthor = (authorData, id) => api.put(`/authors/${id}`, authorData);
export const deleteAuthor = (id) => api.delete(`/authors/${id}`);

// --------------------------------------------------------------------------------------------------------- //

// Se poi aggiungiamo operazioni sui commenti le mettiamo qua sotto
export const getComments = (id) => {
    return api.get(`/blogPosts/${id}/comments`);
};

export const createComment = (id, commentData) => 
  api.post(`/blogPosts/${id}/comments`, commentData)
    .then(response => response.data);

export const deleteComment = (postId, commentId) => 
  api.delete(`/blogPosts/${postId}/comments/${commentId}`)
    .then(response => response.data);


// --------------------------------------------------------------------------------------------------------- //


// Funzione per registrare un nuovo utente
export const registerUser = (userData) => {
  console.log("Dati inviati al server:", userData);
  return api.post("/authors", userData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

// NEW: Funzione per effettuare il login di un utente
export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials); // Effettua la richiesta di login
    console.log("Risposta API login:", response.data); // Log della risposta per debugging
    return response.data; // Restituisce i dati della risposta
  } catch (error) {
    console.error("Errore nella chiamata API di login:", error); // Log dell'errore per debugging
    throw error; // Lancia l'errore per essere gestito dal chiamante
  }
};

// Funzione per ottenere l'autore con l'email specificata
export const getAuthorEmail = async (email) => {
  try {
    const response = await api.get(`/authors/mail/${email}`);
    // console.log("Risposta completa da getAuthorEmail:", response.data);
    return response.data;
  } catch (error) {
    console.error("Errore in getAuthorEmail:", error);
    throw error;
  }
};

// Funzione per ottenere i dati dell'utente attualmente autenticato
export const getMe = () =>
  api.get("/auth/me").then((response) => response.data);


// Funzione per ottenere i dati dell'utente attualmente autenticato con gestione degli errori
export const getUserData = async () => {
  try {
    const response = await api.get("/auth/me"); // Effettua la richiesta per ottenere i dati dell'utente
    return response.data; // Restituisce i dati della risposta
  } catch (error) {
    console.error("Errore nel recupero dei dati utente:", error); // Log dell'errore per debugging
    throw error; // Lancia l'errore per essere gestito dal chiamante
  }
};


export default api;