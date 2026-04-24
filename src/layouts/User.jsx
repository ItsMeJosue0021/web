import React from "react";
import { useState, createContext, useContext } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from "../AuthProvider";
import LoggingOut from "../components/LoggingOut";
import Logo from "../components/Logo";
import { LogOut } from 'lucide-react';

export const PortalContext = createContext();

const User = ({ children }) => {

  const { logout } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState('home');
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      toast.error("Failed to log out");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="w-screen min-h-screen h-auto overflow-hidden">
      <ToastContainer />
      <div className="w-full flex flex-col items-start justify-start ">
        <div className="fixed z-30 w-full h-fit flex items-center justify-between bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm px-4 md:px-8 py-3">
          <div className="h-fit flex items-center justify-between w-full">
            <Logo
              wrapperClassName="flex items-center space-x-2 text-black hover:text-black"
              imageClassName="min-w-14 w-14 min-h-14 h-14 rounded-full"
              textWrapperClassName="hidden md:flex flex-col text-sm font-bold"
              mainTextClassName="text-xs md:text-sm chewy"
              secondaryTextClassName="text-[10px] poppins-regular"
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-md border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 hover:text-red-700"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
        <div className="w-full min-screen h-screen pt-16 bg-white">
          <PortalContext.Provider value={{ activeTab, setActiveTab }}>
            {children}
          </PortalContext.Provider>
        </div>
      </div>
      {loggingOut && <LoggingOut />}
    </div>
  );
};

export default User;
