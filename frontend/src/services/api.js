import axios from 'axios';

const API_URL = 'http://localhost:5001/api';
const api = axios.create({baseURL: API_URL});

export const getPosts = (page = 1, limit = 10) => {
    return axios.get(`${API_URL}/blogPosts?page=${page}&limit=${limit}`);
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
    return axios.get(`${API_URL}/authors?page=${page}&limit=${limit}`);
};
export const getAuthor = (id) => api.get(`/authors/${id}`);
export const createAuthor = (authorData) => api.post('/authors/', authorData, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});
export const updateAuthor = (authorData, id) => api.put(`/authors/${id}`, authorData);
export const deleteAuthor = (id) => api.delete(`/authors/${id}`);

// --------------------------------------------------------------------------------------------------------- //

// Se poi aggiungiamo operazioni sui commenti le mettiamo qua sotto
export const getComments = (id) => {
    return axios.get(`${API_URL}/blogPosts/${id}/comments`);
};

export const createComment = (id, commentData) => api.post(`/blogPosts/${id}/comments`, commentData);


// --------------------------------------------------------------------------------------------------------- //


// Funzione per registrare un nuovo utente
export const registerUser = (userData) => api.post("/authors", userData);

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