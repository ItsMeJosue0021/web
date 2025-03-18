import React from "react";
import Logout from "../components/Logout";
import logo from '../assets/img/logo.png';
import group from '../assets/icons/group.png';
import settings from '../assets/icons/settings.png';
import arrowDown from '../assets/icons/down-arrow.png';
import lightbulb from '../assets/icons/lightbulb.png';
import role from '../assets/icons/setting.png';
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";
import HeaderProfile from "../components/HeaderProfile";
import { Lightbulb, MessageSquareMore, Settings, Users } from "lucide-react";

const Admin = ({ children }) => {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex w-screen h-auto min-h-screen">
      <ToastContainer />
      <div className="fixed z-30 w-72 h-full min-h-screen border-r border-gray-200 flex flex-col items-start justify-start bg-white">
        <div className="w-full flex flex-col justify-start items-start p-4">
            <div className='flex items-center space-x-2 text-black hover:text-black'>
                <img src={logo} alt="logo" className='w-16 h-16 rounded-full'/>
                <div className='flex flex-col text-sm font-bold'>
                    <p className='text-base chewy'>Kalinga ng Kababaihan</p>
                    <p className='text-xs poppins-regular'>Women's League Las Piñas</p>
                </div>
            </div>
        </div>
        <div className="w-full h-auto flex flex-col justify-start items-start gap-1 p-4">
            <Link to="/members" className={`w-full rounded-md flex items-center space-x-2 cursor-pointer h-12 px-2 ${location.pathname === "/members" ? "bg-gray-100" : "hover:bg-gray-100"}`}>
                <div className="flex justify-center w-10">
                  <Users className="w-5 h-5 text-gray-700" />
                </div>
                <p className="text-sm font-medium text-black">Members</p>
            </Link>
            <Link to="/knowledgebase" className={`w-full rounded-md flex items-center space-x-2 cursor-pointer h-12 px-2 ${location.pathname === "/knowledgebase" ? "bg-gray-100" : "hover:bg-gray-100"}`}>
                <div className="flex justify-center w-10">
                  <Lightbulb className="w-5 h-5 text-gray-700" />
                </div>
                <p className="text-sm font-medium text-black">Knowledgebase</p>
            </Link>
            <Link to="/inquiries" className={`w-full rounded-md flex items-center space-x-2 cursor-pointer h-12 px-2 ${location.pathname === "/inquiries" ? "bg-gray-100" : "hover:bg-gray-100"}`}>
                <div className="flex justify-center w-10">
                  <MessageSquareMore className="w-5 h-5 text-gray-700" />
                </div>
                <p className="text-sm font-medium text-black">Inquiries</p>
            </Link>
            {/* main container */}
            <div className="w-full flex flex-col">
              {/* button to trigger the dropdown toggle */}
               <div onClick={() => setIsOpen(!isOpen)} className="w-full rounded-md hover:bg-gray-100 flex items-center space-x-2 cursor-pointer h-12 px-2">
                <div className="flex justify-center w-10">
                    <Settings className="w-5 h-5 text-gray-700" />
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <p className="text-sm text-black font-semibold">Settings</p>
                    <img
                      src={arrowDown}
                      alt="icon"
                      className={`w-6 h-6 transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}
                    />
                  </div>
               </div>
               {/* dropdown  */}
               {isOpen && (
                <div className="pl-4">
                  <div className={`w-full rounded-md flex items-center space-x-2 cursor-pointer h-12 px-2 ${location.pathname === "/users" ? "bg-gray-100" : "hover:bg-gray-100"}`}>
                    <div className="flex justify-center w-10">
                      <img src={role} alt="icon" className="w-6 h-6" />
                    </div>
                    <p className="text-sm text-black font-medium">User Accounts</p>
                  </div>
                  {/* <Link to="/roles"  className={`w-full rounded-md flex items-center space-x-2 cursor-pointer h-12 px-2 ${location.pathname === "/roles" ? "bg-gray-100" : "hover:bg-gray-100"}`}>
                    <div className="flex justify-center w-10">
                      <img src={role} alt="icon" className="w-7 h-7" />
                    </div>
                    <p className="text-sm text-black font-semibold">Roles</p>
                  </Link> */}
                </div>
              )}
            </div>
        </div>

        <div className="absolute bottom-0 right-0 w-full h-auto flex flex-col justify-start items-start gap-1 p-4">
           <Logout/>
        </div>
      </div>

      <div className="z- w-full pl-72 flex flex-col items-start justify-start ">
        <div className="fixed w-[calc(100vw-300px)] h-20 flex items-center justify-between bg-white border-b border-gray-200 px-8">
          <h1 className="text-2xl font-medium"></h1>
          <HeaderProfile/>
          
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

export default Admin;