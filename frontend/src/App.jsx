//  REACT ROUTER DOM
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//PAGES
import Home from "./pages/Home";
import SinglePost from "./pages/SinglePost";
import CreatePost from "./pages/CreatePost";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// COMPONENTS
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// FLOWBITE REACT
import { Flowbite } from "flowbite-react";
import { useEffect, useState } from "react";
import Profile from "./pages/Profile";

import { DarkThemeToggle } from "flowbite-react";

export default function App() {

  // STATO PER LA RICERCA
  const [search, setSearch] = useState('');
  // FUNZIONE PER LA RICERCA
  const handleChange = (e) => {
      setSearch(e.target.value);
  };

  // STATE DEI DATI DELL'UTENTE
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  // CARICAMENTO DEI DATI DELL'UTENTE DAL LOCAL STORAGE
  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    if (storedUserData) {
      setForm(storedUserData);
    }
  }, []);

  return (
    <Flowbite>
      <Router>
        {/* Navbar renderizzata in tutte le pagine */}
        <Navbar search={search} handleChange={handleChange} />
        <Routes>
          {/* Pagina registrazione */}
          <Route path="/register" element={<Register />}></Route>
          {/* Pagina login */}
          <Route path="/login" element={<Login form={form} setForm={setForm} />}></Route>
          {/* Home Page */}
          <Route path="/" element={<Home search={search} handleChange={handleChange} />}></Route>
          {/* Pagina creazione post */}
          <Route path="/create" element={<CreatePost />}></Route>
          {/* Pagina singolo post */}
          <Route path="/post/:id" element={<SinglePost />}></Route>
          {/* Pagina profilo */}
          <Route path="/profile/:id" element={<Profile search={search}/>}></Route>
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
        <DarkThemeToggle className="mr-2 sm:mr-4 border border-black fixed bottom-4 right-4 sm:bottom-[50px] sm:right-[50px] z-10"/>
        {/* Footer renderizzato in tutte le pagine */}
        <Footer />
      </Router>
    </Flowbite>
  )
}
