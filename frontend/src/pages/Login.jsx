import { Link, useNavigate } from "react-router-dom"
import image from '../assets/logo.png'
import { loginUser } from "../services/api";

export default function Login({ form, setForm }) {

  const navigate = useNavigate(); // Permette di navigare tra le pagine

  // Funzione che aggiorna lo stato del form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  };
  

  // Funzione per gestire il submit del form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(form);
      console.log("Risposta dal server:", response);
      localStorage.setItem("token", response.token);
      localStorage.setItem("userData", JSON.stringify(form));
      console.log("Token salvato nel localStorage:", localStorage.getItem("token"));
      window.dispatchEvent(new Event("storage")); // Scatena un evento di storage per aggiornare componenti come la Navbar
      navigate("/");
    } catch(err) {
      console.error('Errore nel login:', err);
    }
  };


  return (
    <div className="flex w-full min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="flex items-center justify-center bg-black p-6 lg:p-10 rounded-lg w-[600px] h-[600px]">
        <div className="mx-auto w-full h-full space-y-6">
          <div className="text-center space-y-2">
            <Link to="/" className="inline-flex items-center gap-2">
            <img src={image} alt="logo" className="h-[50px] w-[100px] bg-white p-3 rounded" />
            </Link>
            <h1 className="text-3xl font-bold text-white">Sign in</h1>
            <p className="text-muted-foreground text-white font-mono">
              Don't have an account?{" "}
              <Link to="/register" className="underline text-[#01FF84]">
                Sign up
              </Link>
            </p>
          </div>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2 flex flex-col">
              <label className="text-white font-mono" htmlFor="email">Email</label>
              <input name="email" type="email" id="email" placeholder="m@example.com" required onChange={handleChange}/>
            </div>
            <div className="space-y-2 flex flex-col">
              <label className="text-white font-mono" htmlFor="password">Password</label>
              <input name="password" type="password" id="password" required onChange={handleChange}/>
            </div>
            <button type="submit" className="w-full bg-[#01FF84] p-2 rounded-lg font-mono">
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

