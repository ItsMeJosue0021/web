import '../css/layout-head.css';
import logo from '../assets/img/logo.png';
import { useEffect, useState, useContext } from 'react';
import { ToastContainer } from 'react-toastify';
import Breadcrumbs from '../components/Breadcrumbs';
import arrowDown from '../assets/icons/down-arrow.png';
import HeaderProfile from '../components/HeaderProfile';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { 
    motion, 
    AnimatePresence 
} from 'framer-motion';
import { 
    Users, 
    Lightbulb, 
    MessageSquareMore, 
    Settings, 
    LayoutPanelLeftIcon, 
    CalendarCog, 
    HandHeart, 
    LayoutDashboard 
} from 'lucide-react';
import NavItem from '../components/NavItem';
import Dropdown from '../components/Dropdown';
import UserProfile from '../components/UserProfile';
import { AuthContext } from '../AuthProvider';



const Admin = ({children, header, breadcrumbs = []}) => {

    const { user } = useContext(AuthContext);

    const [isOpen, setIsOpen] = useState(false);
    const [isWebOpen, setIsWebOpen] = useState(false);
    const [isDonOpen, setIsDonOpen] = useState(false);
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [isDonationOpen, setIsDonationOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    useEffect(() => {
        if (location.pathname.includes("/settings")) {
            setIsOpen(true);
        }
        if (location.pathname.includes("/web")) {
            setIsWebOpen(true);
        }
        if (location.pathname.includes("/donations")) {
            setIsDonOpen(true);
        }
    }, [location.pathname]);


    const toggleModal = () => {
        setIsNavOpen(!isNavOpen);
    };

    return (
        <div className="w-screen max-w-screen min-h-screen h-auto bg-gray-50 overflow-hidden text-gray-700"> 
            <ToastContainer />
            <div className="w-full flex flex-col"> 
                <div className="w-full h-36 md:h-40 bg-orange-500 ">
                    <div className='flex items-start justify-between h-full p-4'>
                        <div className='flex items-center space-x-2 text-white'>
                            <img src={logo} alt="logo" className='w-16 h-16 rounded-full p-0.5 bg-white'/>
                            <div className='hidden md:flex flex-col text-sm font-bold'>
                                <p className='text-base chewy'>Kalinga ng Kababaihan</p>
                                <p className='text-xs poppins-regular text-gray-50'>Women's League Las Piñas</p>
                            </div>
                        </div>
                        <div className='hidden md:block'>
                            <HeaderProfile/>
                        </div>
                        <div className='relative flex lg:hidden'>
                            <button onClick={toggleModal} className="bg-transparent">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-7 stroke-white bg-transparent" fill="none" viewBox="0 0 24 24" >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                </svg>
                            </button>
                            {isNavOpen && (
                                <AnimatePresence>
                                    <motion.div
                                        role="alert"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="fixed top-0 right-0 md:absolute md:top-16 md:right-0
                                                h-full w-full md:h-fit md:w-72 bg-white p-5
                                                rounded-lg shadow-md z-50"
                                    >
                                    {/* Container */}
                                    <div className="flex flex-col gap-4 text-black text-lg md:text-sm poppins-bold">

                                         <UserProfile
                                            name={user.fullName}
                                            email={user.email}
                                            avatarUrl="/images/avatar.png"
                                            onClose={toggleModal}
                                        />

                                        {/* Close Button (Mobile Only) */}
                                        <button
                                            className="bg-transparent md:hidden absolute top-4 right-4"
                                            onClick={toggleModal}
                                        >
                                        <X className="w-7 h-7" />
                                        </button>

                                        {/* Main Nav Items */}
                                        <NavItem 
                                            to="/dashboard" 
                                            label="Dashboard" 
                                            icon={LayoutDashboard}
                                            onClick={toggleModal} 
                                        />

                                        {/* Donation Dropdown */}
                                        <Dropdown
                                            label="Donation"
                                            icon={HandHeart}
                                            isOpen={isDonationOpen}
                                            toggle={() => setIsDonationOpen(!isDonationOpen)}
                                            items={[
                                                { to: "/donations/cash", label: "Cash" },
                                                { to: "/donations/gcash", label: "GCash" },
                                                { to: "/donations/goods", label: "Goods" }
                                            ]}
                                            onItemClick={toggleModal}
                                        />

                                        <NavItem 
                                            to="/members" 
                                            label="Members" 
                                            icon={Users}
                                            onClick={toggleModal} 
                                        />
                                        <NavItem 
                                            to="/inquiries" 
                                            label="Inquiries"
                                            icon={MessageSquareMore}
                                            onClick={toggleModal} 
                                        />
                                        <NavItem 
                                            to="/projects" 
                                            label="Projects" 
                                            icon={CalendarCog}
                                            onClick={toggleModal} 
                                        />

                                        {/* Settings Dropdown */}
                                        <Dropdown
                                            label="Settings"
                                            icon={Settings}
                                            isOpen={isSettingsOpen}
                                            toggle={() => setIsSettingsOpen(!isSettingsOpen)}
                                            items={[
                                                { to: "/knowledgebase", label: "Chatbot" },
                                                { to: "/settings/users", label: "Users" }
                                            ]}
                                            onItemClick={toggleModal}
                                        />

                                    </div>
                                    </motion.div>
                                </AnimatePresence>
                            )}
                        </div>
                    </div>
                </div>

                <div className="relative w-full">
                    <div className="w-full absolute left-0 -top-16 flex items-start">
                        {/* SIDE BAR */}
                        <div className="hidden md:block min-w-56 w-56 h-auto p-4 pt-2 pr-2 pl-0">
                            <div className='bg-white layout-sidebar h-[600px] max-h-[600px] overflow-y-auto pl-2 p-8 pr-5 shadow-sm scrollbar-hide'>
                                <div className="w-full h-auto  flex flex-col justify-start items-start gap-1">
                                    <Link to="/dashboard" className={`w-full rounded-md flex items-center space-x-2 cursor-pointer h-9 px-2 ${location.pathname === "/dashboard" ? "bg-gray-200" : "hover:bg-gray-100"}`}>
                                        <div className="flex justify-center w-10">
                                        <LayoutDashboard className="w-5 h-5 text-gray-700" />
                                        </div>
                                        <p className="text-xs font-medium text-black">Dashboard</p>
                                    </Link>
                                    <div onClick={() => setIsDonOpen(!isDonOpen)} className="w-full rounded-md hover:bg-gray-100 flex items-center space-x-2 cursor-pointer h-9 px-2">
                                        <div className="flex justify-center w-10">
                                            <HandHeart className="w-5 h-5 text-gray-700" />
                                        </div>
                                        <div className="flex items-center justify-between w-full">
                                            <p className="text-xs text-black font-medium">Donations</p>
                                            <img
                                            src={arrowDown}
                                            alt="icon"
                                            className={`w-4 h-4 transition-transform ${isDonOpen ? "rotate-180" : "rotate-0"}`}
                                            />
                                        </div>
                                    </div>
                                    {isDonOpen && (
                                        <div className="w-full pl-4 pt-1">
                                            <Link to="/donations/cash" className={`w-full rounded-md flex items-center space-x-2 cursor-pointer h-9 px-2 ${location.pathname === "/donations/cash" ? "bg-gray-100" : "hover:bg-gray-100"}`}>
                                                <p className="text-xs text-black font-medium">Cash</p>
                                            </Link>
                                            <Link to="/donations/gcash" className={`w-full rounded-md flex items-center space-x-2 cursor-pointer h-9 px-2 ${location.pathname === "/donations/gcash" ? "bg-gray-100" : "hover:bg-gray-100"}`}>
                                                <p className="text-xs text-black font-medium">GCash</p>
                                            </Link>
                                             <Link to="/donations/goods" className={`w-full rounded-md flex items-center space-x-2 cursor-pointer h-9 px-2 ${location.pathname === "/donations/goods" ? "bg-gray-100" : "hover:bg-gray-100"}`}>
                                                <p className="text-xs text-black font-medium">Goods</p>
                                            </Link>
                                        </div>
                                    )}



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
                                        <p className="text-xs font-medium text-black">Chatbot Settings</p>
                                    </Link>
                                    <Link to="/inquiries" className={`w-full rounded-md flex items-center space-x-2 cursor-pointer h-9 px-2 ${location.pathname === "/inquiries" ? "bg-gray-100" : "hover:bg-gray-100"}`}>
                                        <div className="flex justify-center w-10">
                                        <MessageSquareMore className="w-5 h-5 text-gray-700" />
                                        </div>
                                        <p className="text-xs font-medium text-black">Inquiries</p>
                                    </Link>
                                    <Link to="/projects" className={`w-full rounded-md flex items-center space-x-2 cursor-pointer h-9 px-2 ${location.pathname === "/projects" ? "bg-gray-100" : "hover:bg-gray-100"}`}>
                                        <div className="flex justify-center w-10">
                                        <CalendarCog className="w-5 h-5 text-gray-700" />
                                        </div>
                                        <p className="text-xs font-medium text-black">Projects</p>
                                    </Link>
                                    {/* <Link to="/events-management" className={`w-full rounded-md flex items-center space-x-2 cursor-pointer h-9 px-2 ${location.pathname === "/events-management" ? "bg-gray-100" : "hover:bg-gray-100"}`}>
                                        <div className="flex justify-center w-10">
                                        <CalendarCog className="w-5 h-5 text-gray-700" />
                                        </div>
                                        <p className="text-xs font-medium text-black">Events</p>
                                    </Link> */}
                                    
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
                                                    {/* <div className="flex justify-center w-10">
                                                        <img src={role} alt="icon" className="w-5 h-5" />
                                                    </div> */}
                                                    <p className="text-xs text-black font-medium">Users</p>
                                                </Link>

                                                {/* <Link to="/settings/banner-images" className={`w-full rounded-md flex items-center space-x-2 cursor-pointer h-9 px-2 ${location.pathname === "/settings/banner-images" ? "bg-gray-100" : "hover:bg-gray-100"}`}>
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
                                                </Link> */}
                                            </div>
                                        )}
                                        <div onClick={() => setIsWebOpen(!isWebOpen)} className="w-full rounded-md hover:bg-gray-100 flex items-center space-x-2 cursor-pointer h-9 px-2">
                                            <div className="flex justify-center w-10">
                                                <LayoutPanelLeftIcon className="w-5 h-5 text-gray-700" />
                                            </div>
                                            <div className="flex items-center justify-between w-full">
                                                <p className="text-xs text-black font-medium">Web Content</p>
                                                <img
                                                src={arrowDown}
                                                alt="icon"
                                                className={`w-4 h-4 transition-transform ${isWebOpen ? "rotate-180" : "rotate-0"}`}
                                                />
                                            </div>
                                        </div>
                                        {isWebOpen && (
                                            <div className="pl-4 pt-1">
                                                <Link to="/web-content/home" className={`w-full rounded-md flex items-center space-x-2 cursor-pointer h-9 px-2 ${location.pathname === "/web-content/home" ? "bg-gray-100" : "hover:bg-gray-100"}`}>
                                                    <p className="text-xs text-black font-medium">Home</p>
                                                </Link>

                                                <Link to="/web-content/about-us" className={`w-full rounded-md flex items-center space-x-2 cursor-pointer h-9 px-2 ${location.pathname === "/web-content/about-us" ? "bg-gray-100" : "hover:bg-gray-100"}`}>
                                                    <p className="text-xs text-black font-medium">About Us</p>
                                                </Link>

                                                <Link to="/web-content/faqs" className={`w-full rounded-md flex items-center space-x-2 cursor-pointer h-9 px-2 ${location.pathname === "/web-content/faqs" ? "bg-gray-100" : "hover:bg-gray-100"}`}>
                                                    <p className="text-xs text-black font-medium">Faqs</p>
                                                </Link>

                                                {/* <Link to="/web-content/volunteers" className={`w-full rounded-md flex items-center space-x-2 cursor-pointer h-9 px-2 ${location.pathname === "/web-content/volunteers" ? "bg-gray-100" : "hover:bg-gray-100"}`}>
                                                    <p className="text-xs text-black font-medium">Volunteers</p>
                                                </Link> */}

                                                <Link  to="/web-content/events" className={`w-full rounded-md flex items-center space-x-2 cursor-pointer h-9 px-2 ${location.pathname === "/web-content/events" ? "bg-gray-100" : "hover:bg-gray-100"}`}>
                                                    <p className="text-xs text-black font-medium">Events</p>
                                                </Link>

                                                <Link to="/web-content/contact-us"className={`w-full rounded-md flex items-center space-x-2 cursor-pointer h-9 px-2 ${location.pathname === "/web-content/contact-us" ? "bg-gray-100" : "hover:bg-gray-100"}`}>
                                                    <p className="text-xs text-black font-medium">Contact Us</p>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full h-full min-h-96 p-4 pt-2">
                            <div className="w-full layout-head bg-white h-16 md:h-20 p-4 pl-8 md:mb-4 shadow-sm flex items-center justify-between">
                                <div className='pl-2 border-l-4 border-orange-600'>
                                    <h1 className="text-sm md:text-lg font-semibold">{header.title}</h1>
                                    <p className="hidden md:block text-xs">{header.subTitle}</p>
                                </div>
                                <div className='hidden md:block'>
                                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                                </div>
                            </div>
                            <div className='w-full h-full max-h-[530px] overflow-y-auto pb-4'>
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