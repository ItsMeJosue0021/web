import React from "react";
import Logout from "../components/Logout";
import logo from '../assets/img/logo.png';
import group from '../assets/icons/group.png';
import settings from '../assets/icons/settings.png';
import arrowDown from '../assets/icons/down-arrow.png';
import role from '../assets/icons/setting.png';
import { useState } from "react";

const Admin = ({ children }) => {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex w-full h-auto min-h-screen">
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
            <div className={`w-full rounded-md flex items-center space-x-2 cursor-pointer h-14 px-2 ${location.pathname === "/members" ? "bg-gray-100" : "hover:bg-gray-100"}`}>
                <div className="flex justify-center w-10">
                  <img src={group} alt="icon" className="w-10 h-10" />
                </div>
                <p className="text-base font-semibold">Members</p>
            </div>
            {/* main container */}
            <div className="w-full flex flex-col">
              {/* button to trigger the dropdown toggle */}
               <div onClick={() => setIsOpen(!isOpen)} className="w-full rounded-md hover:bg-gray-100 flex items-center space-x-2 cursor-pointer h-14 px-2">
                <div className="flex justify-center w-10">
                    <img src={settings} alt="icon" className="w-7 h-7" />
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <p className="text-base font-semibold">Settings</p>
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
                  <div className={`w-full rounded-md flex items-center space-x-2 cursor-pointer h-14 px-2 ${location.pathname === "/users" ? "bg-gray-100" : "hover:bg-gray-100"}`}>
                    <div className="flex justify-center w-10">
                      <img src={role} alt="icon" className="w-7 h-7" />
                    </div>
                    <p className="text-base font-semibold">Accounts</p>
                  </div>
                  <div className={`w-full rounded-md flex items-center space-x-2 cursor-pointer h-14 px-2 ${location.pathname === "/roles" ? "bg-gray-100" : "hover:bg-gray-100"}`}>
                    <div className="flex justify-center w-10">
                      <img src={role} alt="icon" className="w-7 h-7" />
                    </div>
                    <p className="text-base font-semibold">Roles</p>
                  </div>
                </div>
              )}
            </div>
        </div>

        <div className="absolute bottom-0 right-0 w-full h-auto flex flex-col justify-start items-start gap-1 p-4">
           <Logout/>
        </div>
      </div>

      <div className="z- w-screen pl-72 flex flex-col items-start justify-start ">
        <div className="fixed w-[calc(100vw-300px)] h-20 flex items-center justify-between bg-white border-b border-gray-200 px-8">
          <h1 className="text-2xl font-medium">Roles</h1>
          <div className="flex items-center space-x-3">
              <p>Lyra</p>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-100">
                <p className="text-smm font-bold text-orange-500">L</p>
              </div>
          </div>
        </div>
        <div className="w-full h-[1500px] flex items-center justify-center ">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Admin;