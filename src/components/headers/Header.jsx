import React from "react";
import logo from '../../assets/img/logo.png';
import { Link, useLocation  } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../AuthProvider";
import Logo from "../Logo";
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Header = () => {
    
    const [active, setActive] = useState('home');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    const { user } = useContext(AuthContext);
    const isLoginPage = location.pathname === "/login";
    const isRegisterPage = location.pathname === "/register";

    useEffect(() => {

        if (location.pathname.includes("about-us")) {
            setActive("about");
        } else if (location.pathname.includes("volunteers")) {
            setActive("volunteers");
        } else if (location.pathname.includes("faqs")) {
             setActive("faqs");
        } else if (location.pathname.includes("contact-us")) {
             setActive("contact");
        } else if (location.pathname.includes("events")) {
             setActive("events");
        }

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
    <header className={`z-20 text-xs fixed w-full transition-all ease-in-out duration-600 ${isScrolled ? 'bg-gray-50 py-2' : 'bg-transparent py-4'}`}>
        <div className="w-full max-w-[1200px] mx-auto flex items-center justify-between px-4">
            {!isLoginPage && !isRegisterPage && (
                <Logo/>
            )}

            <div className='hidden lg:flex items-center space-x-10 poppins-bold text-black'>
                {!isLoginPage && !isRegisterPage && (
                    <ul className='flex space-x-10'>
                        <li>
                            <Link to="/" className={`${active === "home" ? 'text-blue-600' : 'text-black'}`}>Home</Link>
                        </li>
                        <li>
                            <Link to="/about-us" className={`${active === "about" ? 'text-blue-600' : 'text-black'}`}>About Us</Link>
                        </li>
                        <li>
                            <Link to="/volunteers" className={`${active === "volunteers" ? 'text-blue-600' : 'text-black'}`}>Volunteers</Link>
                        </li>
                        <li>
                            <Link to="/events" className={`${active === "events" ? 'text-blue-600' : 'text-black'}`}>Events</Link>
                        </li>
                        <li>
                            <Link to="/faqs" className={`${active === "faqs" ? 'text-blue-600' : 'text-black'}`}>FAQs</Link>
                        </li>
                        <li>
                            <Link to="/contact-us" className={`${active === "contact" ? 'text-blue-600' : 'text-black'}`}>Contact Us</Link>
                        </li>
                    </ul>
                )}

                <div className="flex gap-2">
                    {!user ? (
                        <div className="flex items-center gap-2">
                            {!isLoginPage && !isRegisterPage && (
                                <div>
                                    <Link to="/login">
                                        <button className='px-4 py-2 rounded text-orange-600 border border-orange-600 hover:border-orange-600 hover:outline-none active:outline-none'>Login</button>
                                    </Link>
                                </div>
                            )} 

                            {!isRegisterPage && !isLoginPage && (
                                <div>
                                    <Link to="/register">
                                        <button className='px-4 py-2 rounded text-black bg-gray-200 hover:bg-gray-300  border-0 hover:outline-none active:outline-none'>Register</button>
                                    </Link>
                                </div>
                            )} 
                        </div>
                    ) : (
                        <Link to="/portal">
                            <button className='px-4 py-2 rounded text-white bg-orange-600  border-0 hover:outline-none active:outline-none'>Portal</button>
                        </Link>
                    )}
                    <Link to='/donate' className='px-4 py-2 rounded text-white hover:text-white bg-orange-600 border-0 hover:outline-none active:outline-none'>Donate Now</Link>
                </div>
            </div>
            
            <div className='relative flex lg:hidden'>
                <button onClick={toggleModal} className="bg-transparent">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-7 stroke-black bg-transparent" fill="none" viewBox="0 0 24 24" >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>

                {isModalOpen && (
                    <AnimatePresence>
                        <motion.div 
                        role="alert"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='fixed top-0 right-0 md:absolute md:right-0 md:top-16 h-full w-full md:h-fit md:w-72 bg-white px-2 py-5 rounded-lg shadow-md'>
                            <ul className='w-full h-full flex flex-col items-center justify-center gap-4 md:gap-0 poppins-bold text-black cursor-pointer text-lg md:text-sm'>
                                <div className="md:hidden flex">
                                    <X className="w-7 h-7 absolute top-4 right-4" onClick={toggleModal} />
                                </div>
                                <Link to="/" className="w-full flex justify-center md:justify-start px-4 py-2 hover:bg-orange-50 group rounded-md">
                                    <a onClick={toggleModal} className="text-black group-hover:text-orange-600 ">Home</a>
                                </Link>
                                <Link to="/about-us" className="w-full flex justify-center md:justify-start px-4 py-2 hover:bg-orange-50 group rounded-md">
                                    <a onClick={toggleModal} className="text-black group-hover:text-orange-600">About Us</a>
                                </Link>
                                <Link to="/volunteers" className="w-full flex justify-center md:justify-start px-4 py-2 hover:bg-orange-50 group rounded-md">
                                    <a onClick={toggleModal} className="text-black group-hover:text-orange-600">Volunteers</a>
                                </Link>
                                <Link to="/events" className="w-full flex justify-center md:justify-start px-4 py-2 hover:bg-orange-50 group rounded-md">
                                    <a onClick={toggleModal} className="text-black group-hover:text-orange-600">Events</a>
                                </Link>
                                <Link to="/faqs" className="w-full flex justify-center md:justify-start px-4 py-2 hover:bg-orange-50 group rounded-md">
                                    <a onClick={toggleModal} className="text-black group-hover:text-orange-600">FAQs</a>
                                </Link>
                                 <Link to="/contact-us" className="w-full flex justify-center md:justify-start px-4 py-2 hover:bg-orange-50 group rounded-md">
                                    <a onClick={toggleModal} className="text-black group-hover:text-orange-600">Contact Us</a>
                                </Link>
                                {!isLoginPage && (
                                    <Link to="/login" className="w-full flex justify-center md:justify-start px-4 py-2 hover:bg-orange-50 group rounded-md">
                                        <a  className="text-black group-hover:text-orange-600" onClick={toggleModal}>Login</a>
                                    </Link>  
                                )}
                            </ul>
                        </motion.div>
                    </AnimatePresence>
                 )}
            </div>
           
        </div>
        
    </header>
  );
}

export default Header;