import React from "react";
import Logout from "../components/Logout";
import logo from '../assets/img/logo.png';
import group from '../assets/icons/group.png';
import settings from '../assets/icons/settings.png';
import arrowDown from '../assets/icons/down-arrow.png';
import role from '../assets/icons/setting.png';
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";

const User = ({ children }) => {

    const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="flex w-screen h-auto min-h-screen">
      <ToastContainer />
      <div className="z- w-full flex flex-col items-start justify-start ">
        <div className="fixed w-full mx-auto h-20 flex items-center justify-between bg-white border-b border-gray-200 px-8">
          <h1 className="text-2xl font-medium"></h1>
          <div className="relative flex items-center space-x-3">
              <p>Lyra</p>
              <div onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-100">
                <p className="text-smm font-bold text-orange-500">L</p>
              </div>

            {isProfileOpen && (
                <div className="absolute top-14 right-0 w-48 bg-white border border-gray-200 rounded-md shadow-md">
                    <div className="flex flex-col items-center justify-start p-4 gap-4">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-orange-100">
                            <p className="text-lg font-bold text-orange-500">L</p>
                        </div>
                        <Logout/>
                    </div>
                </div>
            )}
              
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