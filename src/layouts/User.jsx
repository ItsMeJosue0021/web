import React from "react";
import { useState, createContext, useContext } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";
import { GoHome } from "react-icons/go";
import { BiLogOut } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import { AuthContext } from "../AuthProvider";
import LoggingOut from "../components/LoggingOut";
import logopng from "../assets/img/logo.png";
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoSettingsOutline } from "react-icons/io5";

export const PortalContext = createContext();

const User = ({ children }) => {

  const { logout } = useContext(AuthContext);

  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [loggingOut, setLoggingOut] = useState(false);

  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } catch (error) { 
      toast.error("Failed to log out");
    } finally {
      setLoggingOut(false);
    }
  }



  return (
    <div className="w-screen min-h-screen h-auto overflow-hidden">
      <ToastContainer />
      <div className="w-full flex flex-col items-start justify-start ">
        <div className="fixed w-full h-fit flex items-center justify-between bg-white shadow-sm px-4 md:px-8 py-2">
          <div className=" h-fit flex items-center justify-between w-full  ">
            <Link to="/" className='flex items-center space-x-2 text-black hover:text-black'>
                <img src={logopng} alt="logo" className='min-w-14 w-14  min-h-14 h-14 rounded-full'/>
                <div className='hidden md:flex flex-col text-sm font-bold'>
                    <p className='text-xs md:text-sm chewy'>Kalinga ng Kababaihan</p>
                    <p className='text-[10px]  poppins-regular'>Women's League Las Piñas</p>
                </div>
            </Link>
            <div className="hidden md:flex items-center space-x-10">
              <ul className='text-xs flex space-x-10'>
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
                  <li>
                      <Link to="/contact-us" className='text-black'>Contact Us</Link>
                  </li>
              </ul>
              {/* <HeaderProfile /> */}
            </div>
            <div 
              onClick={() => setMobileNavOpen(!mobileNavOpen)} 
              className="md:hidden flex items-center justify-center p-2 rounded-lg border border-gray-100 cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-50 hover:border-blue-100 group"
            >
              <GiHamburgerMenu  
                size={20} 
                strokeWidth={0.5} 
                className="group-hover:text-blue-500 transition-all duration-300 ease-in-out"
              />
            </div>
          </div>
        </div>
        <div className="w-full h-auto flex items-start px-0 md:px-8 ">
          <div className={`${isOpen ? 'w-56 min-w-56' : 'w-fit'} hidden md:flex pr-8 min-h-screen h-auto pt-28 border-r border-gray-100`}>
              <div className="w-full flex flex-col items-start justify-start gap-1">
                  <div 
                    onClick={() => setIsOpen(!isOpen)} 
                    className="flex items-center justify-center p-2 rounded-lg border border-gray-100 cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-50 hover:border-blue-100 group"
                  >
                    <GiHamburgerMenu  
                      size={20} 
                      strokeWidth={0.5} 
                      className="group-hover:text-blue-500 transition-all duration-300 ease-in-out"
                    />
                  </div>

                  <div 
                    onClick={() => setActiveTab('home')} 
                    className={`${isOpen ? 'w-full' : 'w-fit'} ${activeTab === 'home' ? 'bg-gray-50 border-blue-100 text-blue-500' : ''} flex items-center gap-2 p-2 rounded-lg border border-gray-100 cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-50 hover:border-blue-100 group`}>
                      <div>
                        <GoHome 
                          size={20} 
                          strokeWidth={0.5} 
                          className="group-hover:text-blue-500 transition-all duration-300 ease-in-out" 
                        />
                      </div>
                      {isOpen && (<span className="text-xs group-hover:text-blue-500 transition-all duration-300 ease-in-out">Home</span>)}
                  </div>

                  <div 
                    onClick={() => setActiveTab('profile')} 
                    className={`${isOpen ? 'w-full' : 'w-fit'} ${activeTab === 'profile' ? 'bg-gray-50 border-blue-100 text-blue-500' : ''} flex items-center gap-2 p-2 rounded-lg border border-gray-100 cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-50 hover:border-blue-100 group`}>
                      <div>
                        <IoSettingsOutline
                          size={18} 
                          strokeWidth={0.5} 
                          className="group-hover:text-blue-500 transition-all duration-300 ease-in-out"
                        />
                      </div>
                      {isOpen && (<span className="text-xs group-hover:text-blue-500 transition-all duration-300 ease-in-out">Settings</span>)}
                  </div>

                  <div 
                    onClick={() => handleLogout()} 
                    className={`${isOpen ? 'w-full' : 'w-fit'} flex items-center gap-2 p-2 rounded-lg border border-gray-100 cursor-pointer transition-all duration-300 ease-in-out hover:bg-red-50 hover:border-red-100 group`}>
                      <div>
                        <BiLogOut 
                          size={18} 
                          strokeWidth={0.2} 
                          className="group-hover:text-red-500 transition-all duration-300 ease-in-out"/>
                      </div>
                      {isOpen && (<span className="text-xs group-hover:text-red-500 transition-all duration-300 ease-in-out">Logout</span>)}
                  </div>
              </div>
          </div>
          <div className="w-full min-screen h-screen pt-20 md:pt-24 ">
            <PortalContext.Provider value={{ activeTab, setActiveTab }}>
              {children}
            </PortalContext.Provider>
          </div>
        </div>
      </div>
      {loggingOut && <LoggingOut />}
      {/* {mobileNavOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex flex-col gap-4 items-center justify-center bg-white">
            <div>
              <span onClick={() => setMobileNavOpen(false)} className="border border-gray-200 px-4 py-2 rounded-xl bg-gray-100">Close</span>
            </div>
            <div className="flex items-center justify-center flex-col space-y-4">
              <span>
                  <Link to="/" className="text-black">Home</Link>
              </span>
              <span>
                  <Link to="/about-us" className='text-black'>About Us</Link>
              </span>
              <span>
                  <Link to="/volunteers" className='text-black'>Volunteers</Link>
              </span>
              <span>
                  <Link to="/faqs" className='text-black'>FAQs</Link>
              </span>
              <span onClick={() => {setMobileNavOpen(false); setActiveTab('home')}}>
                  <p className='text-black font-medium'>Portal</p>
              </span>
              <span onClick={() => {setMobileNavOpen(false); setActiveTab('profile')}}>
                  <p className='text-black font-medium'>Profile</p>
              </span>
              <span onClick={() => handleLogout()}>
                  <p className='text-black font-medium'>Logout</p>
              </span>
            </div>
        </div>
      )} */}

      {mobileNavOpen && (
        <AnimatePresence>
            <motion.div 
            role="alert"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed top-0 right-0 md:absolute md:right-0 md:top-16 h-full w-full md:h-fit md:w-72 bg-white px-2 py-5 rounded-lg shadow-md'>
                <ul className='w-full h-full flex flex-col items-center justify-center gap-4 md:gap-0 poppins-bold text-black cursor-pointer text-lg md:text-sm'>
                    <div className="md:hidden flex">
                        <X className="w-7 h-7 absolute top-4 right-4" onClick={() => setMobileNavOpen(false)} />
                    </div>
                    <Link to="/" className="w-full flex justify-center md:justify-start px-4 py-2 hover:bg-orange-50 group rounded-md">
                        <a className="text-black group-hover:text-orange-600 ">Home</a>
                    </Link>
                    <Link to="/about-us" className="w-full flex justify-center md:justify-start px-4 py-2 hover:bg-orange-50 group rounded-md">
                        <a className="text-black group-hover:text-orange-600">About Us</a>
                    </Link>
                    <Link to="/volunteers" className="w-full flex justify-center md:justify-start px-4 py-2 hover:bg-orange-50 group rounded-md">
                        <a className="text-black group-hover:text-orange-600">Volunteers</a>
                    </Link>
                    <Link to="/faqs" className="w-full flex justify-center md:justify-start px-4 py-2 hover:bg-orange-50 group rounded-md">
                        <a className="text-black group-hover:text-orange-600">FAQs</a>
                    </Link>
                    <Link to="/contact-us" className="w-full flex justify-center md:justify-start px-4 py-2 hover:bg-orange-50 group rounded-md">
                        <a className="text-black group-hover:text-orange-600">Contact Us</a>
                    </Link>
                    <span onClick={() => {setMobileNavOpen(false); setActiveTab('home')}} className="w-full flex justify-center md:justify-start px-4 py-2 hover:bg-orange-50 group rounded-md">
                        <a className="text-black group-hover:text-orange-600">Portal</a>
                    </span>
                    <span onClick={() => {setMobileNavOpen(false); setActiveTab('profile')}} className="w-full flex justify-center md:justify-start px-4 py-2 hover:bg-orange-50 group rounded-md">
                        <a className="text-black group-hover:text-orange-600">Profile</a>
                    </span>
                    <span onClick={() => handleLogout()} className="w-full flex justify-center md:justify-start px-4 py-2 hover:bg-orange-50 group rounded-md">
                        <a className="text-black group-hover:text-orange-600">Logout</a>
                    </span>
                </ul>
            </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

export default User;

