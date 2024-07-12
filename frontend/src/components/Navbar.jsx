import { Link } from "react-router-dom";
import logo from '../assets/strive_logo_color.svg';
import avatarLogo from '../assets/avatar.jpeg';
import { DarkThemeToggle } from "flowbite-react";
import { Avatar, Dropdown, DropdownDivider, DropdownHeader, DropdownItem } from "flowbite-react";

import SearchInput from "./SearchInput";
import { useState } from "react";

export default function Navbar() {

    // FUNZIONE RICERCA
    const [search, setSearch] = useState('');
    const handleChange = (e) => setSearch(e.target.value);

  return (
    <nav className="flex justify-between items-center px-[10%] py-[50px] h-[80px] drop-shadow-lg bg-black gap-[30px] md:gap-0 ">
        <div>
            <Link to='/'>
                <img className="h-[60px]" src={logo} alt="Strive logo" />
            </Link>
        </div>
        <div>
            <SearchInput search={search} handleChange={handleChange}/>
        </div>
        <div className="flex items-center">        
            <DarkThemeToggle className="mr-[30px] border border-[#01FF84]"/>
            <Link to='/create'>
                <button className="font-mono text-black text-[20px] bg-[#01FF84] px-[30px] py-[20px] hover:drop-shadow-xl hover:bg-black hover:border hover:border-[#01FF84] hover:text-white">+ New Post</button>
            </Link>
            <Dropdown
                label={<Avatar className="ms-5" alt="User settings" img={avatarLogo} rounded />}
                arrowIcon={false}
                inline
                >
                <DropdownHeader>
                    <span className="block text-sm">Bonnie Green</span>
                    <span className="block truncate text-sm font-medium">name@flowbite.com</span>
                </DropdownHeader>
                <DropdownItem>Dashboard</DropdownItem>
                <DropdownItem>Settings</DropdownItem>
                <DropdownItem>Earnings</DropdownItem>
                <DropdownDivider />
                <DropdownItem>Sign out</DropdownItem>
            </Dropdown>
        </div>
    </nav>
  )
}
