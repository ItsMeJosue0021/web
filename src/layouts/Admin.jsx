// import '../css/layout-head.css';
// import logo from '../assets/img/logo.png';
// import arrowDown from '../assets/icons/down-arrow.png';
// import HeaderProfile from '../components/HeaderProfile';
// import role from '../assets/icons/setting.png';
// import { Link } from 'react-router-dom';
// import { Users, Lightbulb, MessageSquareMore, Settings } from 'lucide-react';
// import Logout from '../components/Logout';
// import { useEffect, useState } from 'react';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Breadcrumbs from '../components/Breadcrumbs';

// const Admin = ({children, header, breadcrumbs = []}) => {

//      const [isOpen, setIsOpen] = useState(false);

//      useEffect(() => {
//         if (location.pathname === "/settings/users") {
//             setIsOpen(true);
//         }
//      }, [location.pathname]);

//     return (
//         <div className="w-screen max-w-screen min-h-screen h-auto bg-gray-50 overflow-hidden"> 
//             <ToastContainer />
//             <div className="w-full flex flex-col"> 
//                 <div className="w-full h-40 bg-orange-500 ">
//                     <div className='flex items-start justify-between h-full p-4'>
//                         <div className='flex items-center space-x-2 text-white'>
//                             <img src={logo} alt="logo" className='w-16 h-16 rounded-full p-0.5 bg-white'/>
//                             <div className='flex flex-col text-sm font-bold'>
//                                 <p className='text-base chewy'>Kalinga ng Kababaihan</p>
//                                 <p className='text-xs poppins-regular text-gray-50'>Women's League Las Piñas</p>
//                             </div>
//                         </div>
//                         <HeaderProfile/>
//                     </div>
//                 </div>

//                 <div className="relative w-full">
//                     <div className="w-full absolute left-0 -top-16 flex items-start">
//                         <div className="min-w-56 w-56 h-screen p-4 pt-2 pr-2 pl-0">
//                             <div className='bg-white layout-sidebar h-full pl-2 p-8 shadow-sm'>
//                                 <div className="w-full h-full min-h-[650px] flex flex-col justify-start items-start gap-1">
//                                     <Link to="/members" className={`w-full rounded-md flex items-center space-x-2 cursor-pointer h-9 px-2 ${location.pathname === "/members" ? "bg-gray-100" : "hover:bg-gray-100"}`}>
//                                         <div className="flex justify-center w-10">
//                                         <Users className="w-5 h-5 text-gray-700" />
//                                         </div>
//                                         <p className="text-xs font-medium text-black">Members</p>
//                                     </Link>
//                                     <Link to="/knowledgebase" className={`w-full rounded-md flex items-center space-x-2 cursor-pointer h-9 px-2 ${location.pathname === "/knowledgebase" ? "bg-gray-100" : "hover:bg-gray-100"}`}>
//                                         <div className="flex justify-center w-10">
//                                         <Lightbulb className="w-5 h-5 text-gray-700" />
//                                         </div>
//                                         <p className="text-xs font-medium text-black">Knowledgebase</p>
//                                     </Link>
//                                     <Link to="/inquiries" className={`w-full rounded-md flex items-center space-x-2 cursor-pointer h-9 px-2 ${location.pathname === "/inquiries" ? "bg-gray-100" : "hover:bg-gray-100"}`}>
//                                         <div className="flex justify-center w-10">
//                                         <MessageSquareMore className="w-5 h-5 text-gray-700" />
//                                         </div>
//                                         <p className="text-xs font-medium text-black">Inquiries</p>
//                                     </Link>
//                                     <div className="w-full flex flex-col">
//                                     <div onClick={() => setIsOpen(!isOpen)} className="w-full rounded-md hover:bg-gray-100 flex items-center space-x-2 cursor-pointer h-9 px-2">
//                                         <div className="flex justify-center w-10">
//                                             <Settings className="w-5 h-5 text-gray-700" />
//                                         </div>
//                                         <div className="flex items-center justify-between w-full">
//                                             <p className="text-xs text-black font-medium">Settings</p>
//                                             <img
//                                             src={arrowDown}
//                                             alt="icon"
//                                             className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}
//                                             />
//                                         </div>
//                                     </div>
//                                     {isOpen && (
//                                         <div className="pl-4 pt-1">
//                                             <Link to="/settings/users" className={`w-full rounded-md flex items-center space-x-2 cursor-pointer h-9 px-2 ${location.pathname === "/settings/users" ? "bg-gray-100" : "hover:bg-gray-100"}`}>
//                                                 <div className="flex justify-center w-10">
//                                                     <img src={role} alt="icon" className="w-5 h-5" />
//                                                 </div>
//                                                 <p className="text-xs text-black font-medium">Users</p>
//                                             </Link>
//                                         </div>
//                                     )}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="w-full h-full min-h-96 p-4 pt-2">
//                             <div className="w-full layout-head bg-white h-20 p-4 pl-8 mb-4 shadow-sm flex items-center justify-between">
//                                 <div className='pl-2 border-l-4 border-orange-600'>
//                                     <h1 className="text-lg font-semibold">{header.title}</h1>
//                                     <p className="text-xs">{header.subTitle}</p>
//                                 </div>
//                                 <div>
//                                     <Breadcrumbs breadcrumbs={breadcrumbs} />
//                                 </div>
//                             </div>
//                             <div className='w-full h-full max-h-[600px] overflow-y-auto'>
//                                 {children}
//                             </div>
                            
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Admin;


import '../css/layout-head.css';
import logo from '../assets/img/logo.png';
import arrowDown from '../assets/icons/down-arrow.png';
import HeaderProfile from '../components/HeaderProfile';
import role from '../assets/icons/setting.png';
import { Link } from 'react-router-dom';
import { Users, Lightbulb, MessageSquareMore, Settings } from 'lucide-react';
import Logout from '../components/Logout';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Breadcrumbs from '../components/Breadcrumbs';

const Admin = ({children, header, breadcrumbs = []}) => {

     const [isOpen, setIsOpen] = useState(false);

     useEffect(() => {
        if (location.pathname.includes("/settings")) {
            setIsOpen(true);
        }
     }, [location.pathname]);

    return (
        <div className="w-screen max-w-screen min-h-screen h-auto bg-gray-50 overflow-hidden"> 
            <ToastContainer />
            <div className="w-full flex flex-col"> 
                <div className="w-full h-40 bg-orange-500 ">
                    <div className='flex items-start justify-between h-full p-4'>
                        <div className='flex items-center space-x-2 text-white'>
                            <img src={logo} alt="logo" className='w-16 h-16 rounded-full p-0.5 bg-white'/>
                            <div className='flex flex-col text-sm font-bold'>
                                <p className='text-base chewy'>Kalinga ng Kababaihan</p>
                                <p className='text-xs poppins-regular text-gray-50'>Women's League Las Piñas</p>
                            </div>
                        </div>
                        <HeaderProfile/>
                    </div>
                </div>

                <div className="relative w-full">
                    <div className="w-full absolute left-0 -top-16 flex items-start">
                        <div className="min-w-56 w-56 h-screen p-4 pt-2 pr-2 pl-0">
                            <div className='bg-white layout-sidebar h-full pl-2 p-8 shadow-sm'>
                                <div className="w-full h-full min-h-[650px] flex flex-col justify-start items-start gap-1">
                                    <Link to="/members" className={`w-full rounded-md flex items-center space-x-2 cursor-pointer h-9 px-2 ${location.pathname === "/members" ? "bg-gray-100" : "hover:bg-gray-100"}`}>
                                        <div className="flex justify-center w-10">
                                        <Users className="w-5 h-5 text-gray-700" />
                                        </div>
                                        <p className="text-xs font-medium text-black">Members</p>
                                    </Link>
                                    <Link to="/knowledgebase" className={`w-full rounded-md flex items-center space-x-2 cursor-pointer h-9 px-2 ${location.pathname === "/knowledgebase" ? "bg-gray-100" : "hover:bg-gray-100"}`}>
                                        <div className="flex justify-center w-10">
                                        <Lightbulb className="w-5 h-5 text-gray-700" />
                                        </div>
                                        <p className="text-xs font-medium text-black">Knowledgebase</p>
                                    </Link>
                                    <Link to="/inquiries" className={`w-full rounded-md flex items-center space-x-2 cursor-pointer h-9 px-2 ${location.pathname === "/inquiries" ? "bg-gray-100" : "hover:bg-gray-100"}`}>
                                        <div className="flex justify-center w-10">
                                        <MessageSquareMore className="w-5 h-5 text-gray-700" />
                                        </div>
                                        <p className="text-xs font-medium text-black">Inquiries</p>
                                    </Link>
                                    <div className="w-full flex flex-col">
                                    <div onClick={() => setIsOpen(!isOpen)} className="w-full rounded-md hover:bg-gray-100 flex items-center space-x-2 cursor-pointer h-9 px-2">
                                        <div className="flex justify-center w-10">
                                            <Settings className="w-5 h-5 text-gray-700" />
                                        </div>
                                        <div className="flex items-center justify-between w-full">
                                            <p className="text-xs text-black font-medium">Settings</p>
                                            <img
                                            src={arrowDown}
                                            alt="icon"
                                            className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}
                                            />
                                        </div>
                                    </div>
                                    {isOpen && (
                                        <div className="pl-4 pt-1">
                                            <Link to="/settings/users" className={`w-full rounded-md flex items-center space-x-2 cursor-pointer h-9 px-2 ${location.pathname === "/settings/users" ? "bg-gray-100" : "hover:bg-gray-100"}`}>
                                                <div className="flex justify-center w-10">
                                                    <img src={role} alt="icon" className="w-5 h-5" />
                                                </div>
                                                <p className="text-xs text-black font-medium">Users</p>
                                            </Link>

                                            <Link to="/settings/banner-images" className={`w-full rounded-md flex items-center space-x-2 cursor-pointer h-9 px-2 ${location.pathname === "/settings/banner-images" ? "bg-gray-100" : "hover:bg-gray-100"}`}>
                                                <div className="flex justify-center w-10">
                                                    <img src={role} alt="icon" className="w-5 h-5" />
                                                </div>
                                                <p className="text-xs text-black font-medium">Banner Images</p>
                                            </Link>

                                            <Link to="/settings/contact-info" className={`w-full rounded-md flex items-center space-x-2 cursor-pointer h-9 px-2 ${location.pathname === "/settings/contact-info" ? "bg-gray-100" : "hover:bg-gray-100"}`}>
                                                <div className="flex justify-center w-10">
                                                    <img src={role} alt="icon" className="w-5 h-5" />
                                                </div>
                                                <p className="text-xs text-black font-medium">Contact Info</p>
                                            </Link>
                                        </div>
                                    )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full h-full min-h-96 p-4 pt-2">
                            <div className="w-full layout-head bg-white h-20 p-4 pl-8 mb-4 shadow-sm flex items-center justify-between">
                                <div className='pl-2 border-l-4 border-orange-600'>
                                    <h1 className="text-lg font-semibold">{header.title}</h1>
                                    <p className="text-xs">{header.subTitle}</p>
                                </div>
                                <div>
                                    <Breadcrumbs breadcrumbs={breadcrumbs} />
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

export default Admin;