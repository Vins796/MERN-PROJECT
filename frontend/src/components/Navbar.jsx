import { Link, useNavigate } from "react-router-dom";
import logo from '../assets/strive_logo_color.svg';
import avatarLogo from '../assets/avatar.jpeg';
import { DarkThemeToggle } from "flowbite-react";
import { Avatar, Dropdown, DropdownDivider, DropdownHeader, DropdownItem } from "flowbite-react";

import SearchInput from "./SearchInput";
import { useEffect, useState } from "react";
import { getAuthorEmail } from "../services/api";

export default function Navbar({search, handleChange}) {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [author, setAuthor] = useState([]);
    const navigate = useNavigate();

    // FUNZIONE PER CONTROLLARE LOGIN
    // useEffect(() => {
    //   const checkLoginStatus = () => {
    //     const token = localStorage.getItem("token");
    //     const storedUserData = JSON.parse(localStorage.getItem("userData"));
    //     setIsLoggedIn(!!token);
    //     setUserData(storedUserData);
    //   };
  
    //   checkLoginStatus();
    //   window.addEventListener("storage", checkLoginStatus);
  
    //   return () => {
    //     window.removeEventListener("storage", checkLoginStatus);
    //   };
    // }, []);
    useEffect(() => {
      const checkLoginStatus = () => {
        const token = localStorage.getItem("token");
        const storedUserData = JSON.parse(localStorage.getItem("userData"));
        setIsLoggedIn(!!token);
        setUserData(storedUserData);
        console.log("Stored user data:", storedUserData);
      };
    
      checkLoginStatus();
      window.addEventListener("storage", checkLoginStatus);
    
      return () => {
        window.removeEventListener("storage", checkLoginStatus);
      };
    }, []);

    // FUNZIONE PER OTTENERE DATI AUTORI
    // useEffect(() => {
    //   const fetchAuthor = async () => {
    //     if (userData && userData.email) {
    //       try {
    //         const response = await getAuthorEmail(userData.email);
    //         if (response && response.data) {
    //           setAuthor(response.data);
    //         } else {
    //           console.error("Dati dell'autore non validi");
    //         }
    //       } catch (error) {
    //         console.error("Errore nella richiesta dell'autore", error);
    //       }
    //     }
    //   };
  
    //   fetchAuthor();
    // }, [userData]); // EFFETTO CHE OTTENE DATI AUTORI

    useEffect(() => {
      const fetchAuthor = async () => {
        console.log("fetchAuthor called, userData:", userData);
        if (userData && userData.email) {
          try {
            console.log("Fetching author data for email:", userData.email);
            const authorData = await getAuthorEmail(userData.email);
            console.log("Author data received:", authorData);
            if (authorData) {
              setAuthor(authorData);
            } else {
              console.error("Dati dell'autore non validi");
            }
          } catch (error) {
            console.error("Errore nella richiesta dell'autore", error);
          }
        } else {
          console.log("userData o email mancante");
        }
      };
    
      fetchAuthor();
    }, [userData]);

    useEffect(() => {
      console.log("Author state:", author);
    }, [author]);

    console.log("Author state:", userData);
    // FUNZIONE PER LOGOUT
    const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      setIsLoggedIn(false);
      setUserData(null);
      setAuthor(null);
      navigate("/login");
    };   
    
  return (
    <nav className="flex justify-between items-center px-[10%] py-[50px] h-[80px] drop-shadow-lg bg-black gap-[30px] md:gap-0 ">
        <div>
            <Link to='/'>
                <img className="h-[60px]" src={logo} alt="Strive logo" />
            </Link>
        </div>
        {isLoggedIn ? (
            <>
                <div>
                    <SearchInput search={search} handleChange={handleChange}/>
                </div>
                <div className="flex items-center">        
                    <DarkThemeToggle className="mr-[30px] border border-[#01FF84]"/>
                    <Link to='/create'>
                        <button className="font-mono text-black text-[20px] bg-[#01FF84] px-[30px] py-[20px] hover:drop-shadow-xl hover:bg-black hover:border hover:border-[#01FF84] hover:text-white">+ New Post</button>
                    </Link>
                    <Dropdown
                        label={<Avatar className="ms-5" alt="User settings" img={author.avatar || avatarLogo} rounded />}
                        arrowIcon={false}
                        inline
                        >
                          {console.log("Author state:", author)}
                        <DropdownHeader>
                          {author ? (
                              <>
                                  <span className="block text-sm text-[#01FF84]">{author.nome} {author.cognome}</span>
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
    </nav>
  )
}
