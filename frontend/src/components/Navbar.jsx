import { Link, useNavigate } from "react-router-dom";
import logo from '../assets/strive_logo_color.svg';
import { Dropdown, DropdownDivider, DropdownHeader, DropdownItem } from "flowbite-react";

import SearchInput from "./SearchInput";
import { useEffect, useState } from "react";
import { getAuthorEmail, getUserData } from "../services/api";
import { Menu, X } from 'lucide-react';

export default function Navbar({search, handleChange}) {

    const [isLoggedIn, setIsLoggedIn] = useState(false); // Stato che controlla se l'utente è loggato
    const [userData, setUserData] = useState(null); // Stato che contiene i dati dell'utente
    const [author, setAuthor] = useState([]); // Stato che contiene i dati dell'autore
    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    // EFFETTO CHE CONTROLLA LOGIN
    useEffect(() => {
      // EFFETTO CHE CONTROLLA LOGIN
      const checkLoginStatus = async () => {
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const userData = await getUserData(); // Richiede i dati dell'utente
            setIsLoggedIn(true); // Imposta lo stato di login a true
            setUserData(userData); // Imposta i dati dell'utente nello stato
            localStorage.setItem("userData", JSON.stringify(userData));
          } catch (error) {
            console.error("Token non valido o errore nel recupero dei dati:", error);
            localStorage.removeItem("token");
            localStorage.removeItem("userData");
            setIsLoggedIn(false);
            setUserData(null);
          }
        } else {
          setIsLoggedIn(false);
          setUserData(null);
        }
      };
    
      checkLoginStatus();
    
      window.addEventListener("storage", checkLoginStatus); // Aggiunge un listener che aggiorna lo stato di login quando il token viene modificato
      window.addEventListener("loginStateChange", checkLoginStatus); // Aggiunge un listener che aggiorna lo stato di login quando il token viene modificato
    
      return () => {
        window.removeEventListener("storage", checkLoginStatus);
        window.removeEventListener("loginStateChange", checkLoginStatus);
      };
    }, []); 

    // EFFETTO CHE OTTENE DATI AUTORI
    useEffect(() => {
      const fetchAuthor = async () => {
        // console.log("fetchAuthor called, userData:", userData);
        if (userData && userData.email) {
          try {
            // console.log("Fetching author data for email:", userData.email);
            const authorData = await getAuthorEmail(userData.email); // Richiede i dati dell'autore
            // console.log("Author data received:", authorData);
            // console.log("Avatar URL:", authorData && authorData.avatar ? authorData.avatar : avatarLogo);
            if (authorData) {
              setAuthor(authorData);
            } else {
              console.error("Dati dell'autore non validi");
            }
          } catch (error) {
            console.error("Errore nella richiesta dell'autore", error);
          }
        } else {
          // console.log("userData o email mancante");
        }
      };
      
      if (isLoggedIn) {
        fetchAuthor();
      }
    }, [userData, isLoggedIn]);

    // EFFETTO CHE STAMPA GLI AUTORI
    useEffect(() => {
      // console.log("Author state:", author);
    }, [author]);

    // console.log("Author state:", userData);

    // FUNZIONE PER LOGOUT
    const handleLogout = () => {
      localStorage.removeItem("token"); // Rimuovo il token dal localStorage
      localStorage.removeItem("userData"); // Rimuovo i dati dell'utente dal localStorage
      setIsLoggedIn(false); // Imposto lo stato di login a false
      setUserData(null);
      setAuthor(null);
      navigate("/login"); // Reindirizzo alla pagina di login
      window.dispatchEvent(new Event("loginStateChange"));
    };   
    
  return (
    <nav className="fixed w-full flex justify-between items-center px-4 sm:px-6 md:px-8 lg:px-[10%] py-2 sm:py-4 h-16 sm:h-24 drop-shadow-lg bg-black z-50">
        <div className="flex items-center">
            <Link to='/'>
                <img className="h-8 sm:h-12" src={logo} alt="Strive logo" />
            </Link>
        </div>
        {isLoggedIn ? (
            <>
                <div className="hidden md:block mx-4">
                    <SearchInput search={search} handleChange={handleChange}/>
                </div>
                <div className="hidden md:flex items-center">        
                    <Link to='/create'>
                        <button className="font-mono text-2xl text-black bg-[#01FF84] px-3 sm:px-4 py-2 sm:py-4 hover:drop-shadow-xl hover:bg-black hover:border hover:border-[#01FF84] hover:text-white">+ New Post</button>
                    </Link>
                    <Dropdown
                        label={<img 
                          alt="User settings"
                          src={author && author.avatar ? author.avatar : ' '} // ci mette un po' di tempo per caricare l'immagine
                          rounded="true"
                          className="ms-3 sm:ms-5 h-8 sm:h-12 rounded-full"
                          onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src = '';
                          }}
                        />}
                        arrowIcon={false}
                        inline
                        >
                          {/* {console.log("Author state:", author)} */}
                        <DropdownHeader>
                          {author ? (
                              <>
                                  <span className="block text-sm">{author.nome} {author.cognome}</span>
                                  <span className="block truncate text-sm font-medium">{author.email}</span>
                              </>
                        ) : (
                            <span className="block text-sm">Caricamento...</span>
                          )}
                        </DropdownHeader>
                        <Link to='/'><DropdownItem>Home</DropdownItem></Link>
                        <DropdownItem onClick={() => navigate(`/profile/${author._id}`)}>Profile</DropdownItem>
                        <DropdownDivider />
                        <Link to='/login'><DropdownItem onClick={handleLogout}>Sign out</DropdownItem></Link>
                    </Dropdown>
                </div>
                <button className="md:hidden text-white" onClick={toggleMenu}>
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </>
        ) : (
            <ul className="flex items-center gap-[30px]">
              <li className="nav-item">
                <Link to="/login" className="nav-link text-white">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link text-white">
                  Registrati
                </Link>
              </li>
            </ul>
        )}  
        {isMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-black md:hidden">
                    {isLoggedIn ? (
                        <div className="flex flex-col p-4">
                            <SearchInput search={search} handleChange={handleChange}/>
                            <Link to='/create' className="my-2">
                                <button className="w-full font-mono text-black text-sm bg-[#01FF84] px-3 py-2 hover:drop-shadow-xl hover:bg-black hover:border hover:border-[#01FF84] hover:text-white">+ New Post</button>
                            </Link>
                            <Link to='/' className="text-white py-2">Home</Link>
                            <button onClick={() => navigate(`/profile/${author._id}`)} className="text-white text-left py-2">Profile</button>
                            <button onClick={handleLogout} className="text-white text-left py-2">Sign out</button>
                        </div>
                    ) : (
                        <div className="flex flex-col p-4">
                            <Link to="/login" className="text-white py-2">Login</Link>
                            <Link to="/register" className="text-white py-2">Registrati</Link>
                        </div>
                    )}
            </div>
        )}      
    </nav>
  )
}
