import React from "react";
import logo from '../../assets/img/logo.png';
import { Link, useLocation  } from "react-router-dom";

const Header = () => {
    
    const location = useLocation();
    const isLoginPage = location.pathname === "/login"

  return (
    <header className='fixed w-full'>
        <div className="w-full max-w-screen-2xl mx-auto flex items-center justify-between px-4 py-4">
            <Link to="/" className='flex items-center space-x-2 text-black hover:text-black'>
                <img src={logo} alt="logo" className='w-20 h-20 rounded-full'/>
                <div className='flex flex-col text-sm font-bold'>
                    <p className='text-xl chewy'>Kalinga ng Kababaihan</p>
                    <p className='poppins-regular'>Women's League Las Piñas</p>
                </div>
            </Link>

            <div className='flex items-center space-x-10 poppins-bold text-black'>
                <ul className='flex space-x-10'>
                    <li>
                        <Link to="/" className="text-black">Home</Link>
                    </li>
                    <li>
                    <a  className='text-black'>About Us</a>
                    </li>
                    <li>
                    <a  className='text-black'>Volunteers</a>
                    </li>
                    <li>
                    <a  className='text-black'>FAQ</a>
                    </li>
                </ul>

                {!isLoginPage && (
                    <div>
                        <Link to="login">
                            <button className='px-6 py-3 rounded-md text-white bg-orange-600  border-0 hover:outline-none active:outline-none'>Login</button>
                        </Link>
                    </div>
                )} 
            </div>
        </div>
        
    </header>
  );
}

export default Header;