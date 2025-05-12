import React from "react";
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HeaderProfile from "../components/HeaderProfile";
import Logo from "../components/Logo";
import { Link } from "react-router-dom";

const User = ({ children }) => {

  return (
    <div className="w-screen max-w-screen min-h-screen h-auto bg-gray-50 overflow-hidden">
      <ToastContainer />
      <div className="z- w-full flex flex-col items-start justify-start ">
        <div className="fixed w-full h-fit flex items-center justify-between bg-white shadow-sm px-8 py-2">
          <div className=" h-fit flex items-center justify-between w-full max-w-[1200px] mx-auto">
            <Logo/>
            <div className="flex items-center space-x-10">
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
              </ul>
              <HeaderProfile />
            </div>
          </div>
        </div>
        <div className="w-full h-auto overflow-hidden">
          <div className="w-full h-full pt-20">
           {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default User;