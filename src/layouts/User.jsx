import React from "react";
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HeaderProfile from "../components/HeaderProfile";
import Logo from "../components/Logo";

const User = ({ children }) => {

    const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="flex w-screen h-auto min-h-screen">
      <ToastContainer />
      <div className="z- w-full flex flex-col items-start justify-start ">
        <div className="fixed w-full h-20 flex items-center justify-between bg-white border-b border-gray-200 px-8 py-2">
          <div className=" h-20 flex items-center justify-between w-full max-w-[1200px] mx-auto">
          <Logo/>
          <HeaderProfile />
          </div>
        </div>
        <div className="w-full h-auto">
          <div className="w-full h-full p-4 pt-20">
          {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default User;