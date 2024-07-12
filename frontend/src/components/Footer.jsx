import { Link } from 'react-router-dom'
import logo from '../assets/strive_logo_color.svg'

export default function Footer() {
  return (
    <footer class="bg-black py-6 mt-auto">
      <div class="container mx-auto px-4">
        <div class="flex flex-col items-center">
          <Link to='/'>
            <img src={logo} alt="Strive School Logo" class="h-8 mb-4" />
          </Link>
          <p class="text-center text-white">
            2024 <Link to='/'><span class="text-[#01FF84]">Diritti riservati alla Banana Gang</span></Link>
          </p>
        </div>
      </div>
    </footer>   
  )
}
