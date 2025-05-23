import '../css/layout-head.css';
import logo from '../assets/img/logo.png';
import arrowDown from '../assets/icons/down-arrow.png';
import HeaderProfile from '../components/HeaderProfile';
import role from '../assets/icons/setting.png';
import { Link } from 'react-router-dom';
import { Users, Lightbulb, MessageSquareMore, Settings } from 'lucide-react';
import Logout from '../components/Logout';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Test = ({children, header}) => {

     const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="w-screen min-h-screen h-full bg-gray-50"> 
            <ToastContainer />
            <div className="w-full flex flex-col"> 
                <div className="w-full h-40 bg-orange-600">
                    <div className='flex items-start justify-between h-full p-4'>
                        <div className='flex items-center space-x-2 text-white'>
                            <img src={logo} alt="logo" className='w-16 h-16 rounded-full p-0.5 bg-white'/>
                            <div className='flex flex-col text-sm font-bold'>
                                <p className='text-base chewy'>Kalinga ng Kababaihan</p>
                                <p className='text-xs poppins-regular text-gray-200'>Women's League Las Piñas</p>
                            </div>
                        </div>
                        <HeaderProfile/>
                    </div>
                </div>

                <div className="relative flex items-start w-full gap-4">
                    <div className="w-full absolute left-0 -top-16 flex items-start">
                        <div className="min-w-80 w-80 h-full p-4 pt-2 pr-2 pl-0">
                            <div className='bg-white layout-sidebar h-full pl-2 p-8 shadow-sm'>
                                <div className="w-full h-full min-h-[600px] flex flex-col justify-start items-start gap-1">
                                    <Link to="/members" className={`w-full rounded-md flex items-center space-x-2 cursor-pointer h-10 px-2 ${location.pathname === "/members" ? "bg-gray-100" : "hover:bg-gray-100"}`}>
                                        <div className="flex justify-center w-10">
                                        <Users className="w-5 h-5 text-gray-700" />
                                        </div>
                                        <p className="text-sm font-medium text-black">Members</p>
                                    </Link>
                                    <Link to="/knowledgebase" className={`w-full rounded-md flex items-center space-x-2 cursor-pointer h-10 px-2 ${location.pathname === "/knowledgebase" ? "bg-gray-100" : "hover:bg-gray-100"}`}>
                                        <div className="flex justify-center w-10">
                                        <Lightbulb className="w-5 h-5 text-gray-700" />
                                        </div>
                                        <p className="text-sm font-medium text-black">Knowledgebase</p>
                                    </Link>
                                    <Link to="/inquiries" className={`w-full rounded-md flex items-center space-x-2 cursor-pointer h-10 px-2 ${location.pathname === "/inquiries" ? "bg-gray-100" : "hover:bg-gray-100"}`}>
                                        <div className="flex justify-center w-10">
                                        <MessageSquareMore className="w-5 h-5 text-gray-700" />
                                        </div>
                                        <p className="text-sm font-medium text-black">Inquiries</p>
                                    </Link>
                                    {/* main container */}
                                    <div className="w-full flex flex-col">
                                    {/* button to trigger the dropdown toggle */}
                                    <div onClick={() => setIsOpen(!isOpen)} className="w-full rounded-md hover:bg-gray-100 flex items-center space-x-2 cursor-pointer h-10 px-2">
                                        <div className="flex justify-center w-10">
                                            <Settings className="w-5 h-5 text-gray-700" />
                                        </div>
                                        <div className="flex items-center justify-between w-full">
                                            <p className="text-sm text-black font-medium">Settings</p>
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
                                            <img src={role} alt="icon" className="w-5 h-5" />
                                            </div>
                                            <p className="text-sm text-black font-medium">Users</p>
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
                            </div>
                        </div>
                        <div className="w-full h-full min-h-96 p-4">
                            <div className="w-full layout-head bg-white h-24 pt-2 p-4 pl-8 mb-4 shadow-sm flex flex-col items-start justify-center">
                                <div className='pl-2 border-l-4 border-orange-600'>
                                    <h1 className="text-xl font-semibold">{header.title}</h1>
                                    <p className="text-xs">{header.subTitle}</p>
                                </div>
                            </div>
                            <div className='w-full h-full max-h-[600px] overflow-y-auto'>
                                {children}
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Test;