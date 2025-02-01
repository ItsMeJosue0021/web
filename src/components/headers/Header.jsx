import React from "react";
import logo from '../../assets/img/logo.png';
import { Link, useLocation  } from "react-router-dom";
import { useState, useEffect } from "react";

const Header = () => {
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    const isLoginPage = location.pathname === "/login";

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

  return (
    <header className={`z-20 fixed w-full transition-all ease-in-out duration-600 ${isScrolled ? 'bg-gray-50 py-2' : 'bg-transparent py-4'}`}>
        <div className="w-full max-w-[1500px] mx-auto flex items-center justify-between px-4">
            <Link to="/" className='flex items-center space-x-2 text-black hover:text-black'>
                <img src={logo} alt="logo" className='w-16 md:w-20 h-16 md:h-20 rounded-full'/>
                <div className='flex flex-col text-sm font-bold'>
                    <p className='text-base md:text-xl chewy'>Kalinga ng Kababaihan</p>
                    <p className='text-xs md:text-base poppins-regular'>Women's League Las Piñas</p>
                </div>
            </Link>

            <div className='hidden lg:flex items-center space-x-10 poppins-bold text-black'>
                <ul className='flex space-x-10'>
                    <li>
                        <Link to="/" className="text-black">Home</Link>
                    </li>
                    <li>
                        <Link to="/about-us" className='text-black'>About Us</Link>
                    </li>
                    <li>
                        <Link to="/volunteers" className='text-black'>Volunteers</Link>
                    </li>
                    <li>
                        <Link to="/faqs" className='text-black'>FAQs</Link>
                    </li>
                </ul>

                {!isLoginPage && (
                    <div>
                        <Link to="/login">
                            <button className='px-6 py-3 rounded-md text-white bg-orange-600  border-0 hover:outline-none active:outline-none'>Login</button>
                        </Link>
                    </div>
                )} 
            </div>
            
            <div className='relative flex lg:hidden'>
                <button onClick={toggleModal} className="bg-transparent">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-7 stroke-black bg-transparent" fill="none" viewBox="0 0 24 24" >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>

                {isModalOpen && (
                    <div className='absolute right-0 top-16 w-80 bg-white px-2 py-5 rounded-lg shadow-md'>
                        <ul className='w-full flex flex-col poppins-bold text-black cursor-pointer text-lg'>
                            <Link to="/" className="w-full px-4 py-2 hover:bg-orange-50 group rounded-md">
                                <a onClick={toggleModal} className="text-black group-hover:text-orange-600">Home</a>
                            </Link>
                            <Link to="/about-us" className="w-full px-4 py-2 hover:bg-orange-50 group rounded-md">
                                <a onClick={toggleModal} className="text-black group-hover:text-orange-600">About Us</a>
                            </Link>
                            <Link to="/volunteers" className="w-full px-4 py-2 hover:bg-orange-50 group rounded-md">
                                <a onClick={toggleModal} className="text-black group-hover:text-orange-600">Volunteers</a>
                            </Link>
                            <Link to="/faqs" className="w-full px-4 py-2 hover:bg-orange-50 group rounded-md">
                                <a onClick={toggleModal} className="text-black group-hover:text-orange-600">FAQs</a>
                            </Link>
                            {!isLoginPage && (
                                <Link to="/login" className="w-full px-4 py-2 hover:bg-orange-50 group rounded-md">
                                    <a  className="text-black group-hover:text-orange-600" onClick={toggleModal}>Login</a>
                                </Link>  
                            )}
                         </ul>
                    </div>
                 )}
            </div>
           
        </div>
        
    </header>
  );
}

export default Header;