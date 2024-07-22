import { Link, useNavigate } from "react-router-dom" // Importo il Link per il routing
import image from '../assets/logo.png' // Importo l'immagine del logo
import { registerUser } from '../services/api.js'; // Importo la funzione per la registrazione dell'utente
import { useState } from "react";

export default function Register() {

  // Dichiaro lo stato del form con i campi vuoti
  const [form, setForm] = useState({
    nome: "",
    cognome: '',
    dataDiNascita: "",
    avatar: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate(); // Importo useNavigate per il routing

  // Funzione per gestire il cambio dei valori del form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  // Funzione per gestire il cambio dell'avatar
  const handleFileChange = (e) => {
    setForm({ ...form, avatar: e.target.files[0] });
  };

  // Funzione per gestire il submit del form
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     // Creo un nuovo FormData
  //     const formData = new FormData();
  //     // Per ogni chiave del form, se il valore è presente, lo appendo al FormData
  //     Object.keys(form).forEach(key => { 
  //       if (form[key]) { // Controllo se il valore è presente
  //         if (key === 'avatar' && form[key] instanceof File) { // Controllo se la chiave è l'avatar e se il valore è un file
  //           formData.append(key, form[key], form[key].name); // Appendo il valore al FormData
  //         } else {
  //           formData.append(key, form[key]);
  //         }
  //         console.log(`Appending to FormData: ${key}:`, form[key]); // Mostro il valore che viene aggiunto al FormData
  //       }
  //     });
  //     await registerUser(formData); // Invio i dati al server
  //     alert("Registrazione avvenuta con successo!"); // Mostro un messaggio di conferma
  //     navigate('/login'); // Reindirizzo l'utente alla pagina di login
  //   } catch(err) {
  //     console.error("Errore nella registrazione", err.response?.data || err.message);
  //   }
  // }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (form[key]) {
          formData.append(key, form[key]);
        }
      });
      if (form.avatar) {
        formData.append('avatar', form.avatar);
      }
      console.log("Dati inviati al server:", Object.fromEntries(formData));
      const response = await registerUser(formData);
      console.log("Risposta del server:", response);
      alert("Registrazione avvenuta con successo!");
      navigate('/login');
    } catch(err) {
      console.error("Errore nella registrazione", err.response?.data || err.message);
    }
  }

  return (
    <div className="flex w-full min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="mt-8 flex items-center justify-center bg-black rounded-lg w-[600px]">
        <div className="mx-auto w-full h-full space-y-6 p-12">
          <div className="text-center space-y-2">
            <Link to="/" className="inline-flex items-center gap-2">
              <img src={image} alt="logo" className="h-[50px] w-[100px] bg-white p-3 rounded" />
            </Link>
            <h1 className="text-3xl font-bold text-white">Sign up</h1>
            <p className="text-muted-foreground text-white font-mono">
              Already have an account?{" "}
              <Link to="/login" className="underline text-[#01FF84]">
                Sign in
              </Link>
            </p>
          </div>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2 flex flex-col">
              <label className="text-white font-mono" htmlFor="nome">Name</label>
              <input name="nome" type="text" id="nome" placeholder="Name" className="placeholder:italic" required onChange={handleChange}/>
            </div>
            <div className="space-y-2 flex flex-col">
              <label className="text-white font-mono" htmlFor="cognome">Surname</label>
              <input name="cognome" type="text" id="cognome" placeholder="Cognome" className="placeholder:italic" required onChange={handleChange}/>
            </div>
            <div className="space-y-2 flex flex-col">
              <label className="text-white font-mono" htmlFor="dataDiNascita">Date of Birth</label>
              <input name="dataDiNascita" type="date" id="dataDiNascita" placeholder="Age" required onChange={handleChange}/>
            </div>
            <div className="space-y-2 flex flex-col">
              <label className="text-white font-mono" htmlFor="avatar">Avatar</label>
              <input name="avatar" type="file" id="avatar" className="bg-white rounded p-2 placeholder:italic" required onChange={handleFileChange}/>
            </div>
            <div className="space-y-2 flex flex-col">
              <label className="text-white font-mono after:content-['*'] after:text-red-500" htmlFor="email">Email</label>
              <input name="email" type="email" id="email" placeholder="m@example.com" className="placeholder:italic" required onChange={handleChange}/>
            </div>
            <div className="space-y-2 flex flex-col">
              <label className="text-white font-mono" htmlFor="password">Password</label>
              <input name="password" type="password" id="password" placeholder="Password" className="placeholder:italic" required onChange={handleChange}/>
            </div>
            <button type="submit" className="w-full bg-[#01FF84] p-2 rounded-lg font-mono">
              Sign up
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

