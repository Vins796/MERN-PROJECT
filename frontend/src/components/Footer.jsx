import { Link } from 'react-router-dom'
import logo from '../assets/strive_logo_color.svg'

export default function Footer() {
  return (
    <footer className="bg-black py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          <Link to='/'>
            <img src={logo} alt="Strive School Logo" className="h-8 mb-4" />
          </Link>
          <p className="text-center text-white">
            2024 <Link to='/'><span className="text-[#01FF84]">Diritti riservati alla Banana Gang</span></Link>
          </p>
        </div>
      </div>
    </footer>   
  )
}
