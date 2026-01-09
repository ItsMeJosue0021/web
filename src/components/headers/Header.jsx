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
        } else if (location.pathname.includes("our-projects")) {
             setActive("projects");
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
                        {/* <li>
                            <Link to="/volunteers" className={`${active === "volunteers" ? 'text-blue-600' : 'text-black'}`}>Volunteers</Link>
                        </li> */}
                        <li>
                            <Link to="/our-projects" className={`${active === "projects" ? 'text-blue-600' : 'text-black'}`}>Projects</Link>
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
                                        <button className='px-4 py-2 rounded bg-transparent text-orange-600 border border-orange-600 hover:border-orange-600 hover:outline-none active:outline-none'>Login</button>
                                    </Link>
                                </div>
                            )} 

                            {!isRegisterPage && !isLoginPage && (
                                <div>
                                    <Link to="/register">
                                        <button className='px-4 py-2 rounded text-black bg-gray-200/50 hover:bg-gray-300/50  border-0 hover:outline-none active:outline-none'>Register</button>
                                    </Link>
                                </div>
                            )} 

                             {!isRegisterPage && !isLoginPage && (
                                <Link to='/donate' className='px-4 py-2 rounded text-white hover:text-white bg-orange-600 border-0 hover:outline-none active:outline-none'>Donate Now</Link>
                             )}
                            
                        </div>
                    ) : (
                        <Link to="/portal">
                            <button className='px-4 py-2 rounded text-white bg-orange-600  border-0 hover:outline-none active:outline-none'>Profile</button>
                        </Link>
                    )}
                    
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
                            onClick={toggleModal}
                            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm md:absolute md:top-16 md:right-0 md:bg-transparent md:backdrop-blur-0"
                        >
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="absolute right-0 top-0 h-full w-full max-w-xs bg-white px-5 py-6 shadow-xl md:static md:h-fit md:w-72 md:rounded-xl md:border md:border-gray-100"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-sm font-semibold text-gray-900">Menu</p>
                                    <button
                                        className="bg-white md:hidden p-1 rounded-full border border-gray-200 shadow-sm"
                                        onClick={toggleModal}
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-2">
                                    <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                                        Browse
                                    </p>
                                    <Link to="/" onClick={toggleModal} className="w-full flex px-3 py-2 rounded-lg hover:bg-orange-50 text-black text-sm">
                                        Home
                                    </Link>
                                    <Link to="/about-us" onClick={toggleModal} className="w-full flex px-3 py-2 rounded-lg hover:bg-orange-50 text-black text-sm">
                                        About Us
                                    </Link>
                                    <Link to="/our-projects" onClick={toggleModal} className="w-full flex px-3 py-2 rounded-lg hover:bg-orange-50 text-black text-sm">
                                        Projects
                                    </Link>
                                    <Link to="/faqs" onClick={toggleModal} className="w-full flex px-3 py-2 rounded-lg hover:bg-orange-50 text-black text-sm">
                                        FAQs
                                    </Link>
                                    <Link to="/contact-us" onClick={toggleModal} className="w-full flex px-3 py-2 rounded-lg hover:bg-orange-50 text-black text-sm">
                                        Contact Us
                                    </Link>
                                </div>

                                <div className="mt-4 rounded-xl border border-gray-100 bg-white p-2">
                                    <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                                        Account
                                    </p>
                                    {!isLoginPage && !user && (
                                        <Link to="/login" onClick={toggleModal} className="w-full flex px-3 py-2 rounded-lg hover:bg-orange-50 text-black text-sm">
                                            Login
                                        </Link>
                                    )}
                                    {!isRegisterPage && !user && (
                                        <Link to="/register" onClick={toggleModal} className="w-full flex px-3 py-2 rounded-lg hover:bg-orange-50 text-black text-sm">
                                            Register
                                        </Link>
                                    )}
                                    {user && (
                                        <Link to="/portal" onClick={toggleModal} className="w-full flex px-3 py-2 rounded-lg hover:bg-orange-50 text-black text-sm">
                                            Profile
                                        </Link>
                                    )}
                                </div>

                                {!isRegisterPage && !isLoginPage && (
                                    <div className="mt-5">
                                        <Link
                                            to="/donate"
                                            onClick={toggleModal}
                                            className="w-full inline-flex items-center justify-center rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
                                        >
                                            Donate Now
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                 )}
            </div>
           
        </div>
        
    </header>
  );
}

export default Header;
