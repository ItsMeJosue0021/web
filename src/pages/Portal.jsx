import { useEffect } from "react";
import User from "../layouts/User";
import { useContext } from "react";
import { AuthContext } from "../AuthProvider";
import Logout from "../components/Logout";
import { div } from "framer-motion/client";
import { SlidersHorizontal, X } from "lucide-react";
import { Search } from "lucide-react";
import { useState, useRef  } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import ChatButton from "../components/chatbot/ChatButton";
import EventDetailsModal from "../components/EventDetailsModal";
import { PencilLine, Image } from "lucide-react";
import { _get, _post } from "../api";
import { toast } from "react-toastify";

const prevEvents = [
    {
        title: "Health and Wellness Talk",
        date: "2023-10-05",
        time: "9:00 AM",
        description: "A session on women’s health and self-care with guest medical professionals.",
        thumbnail: "about.png",
    },
    {
        title: "Livelihood Training Workshop",
        date: "2023-10-06",
        time: "1:00 PM",
        description: "Hands-on workshop on soap-making and other income-generating skills.",
        thumbnail: "activity1.png",
    },
    {
        title: "Legal Rights Awareness Seminar",
        date: "2023-10-07",
        time: "10:30 AM",
        description: "Discussion about women’s legal rights and protection against abuse.",
        thumbnail: "activity2.png",
    },
    {
        title: "Empowerment Through Art",
        date: "2023-10-08",
        time: "3:00 PM",
        description: "Creative painting and storytelling session to express women's strength.",
        thumbnail: "feeding.png",
    }
];


const Portal = () => {

    const {user} = useContext(AuthContext);
    const baseURL = "https://api.kalingangkababaihan.com/storage/";


    const [events, setEvents] = useState([]);
    const [projects, setPrjects] = useState([]);

    const [selectedIamge, setSelectedImage] = useState();
    const [viewImage, setViewImage] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [showUpdateProfilePic, setShowUpdateProfilePic] = useState(false);

    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    const [tab, setTab] = useState('events'); 

    useEffect(() => {
        fetchEvents();
        fetchProjects();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await _get('/events');
            setEvents(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const fetchProjects = async () => {
        try {
            const response = await _get('/projects');
            setPrjects(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleImageClick = (url) => {
        setSelectedImage(url);
        setViewImage(true);
    };

    const openUpdateProfilePicModal = () => {
        setShowUpdateProfilePic(true);
    }

    const imageContainers = useRef([]);

    const scrollImagesLeft = (index) => {
        if (imageContainers.current[index]) {
            imageContainers.current[index].scrollBy({ left: -100, behavior: 'smooth' });
        }
    };

    const scrollImagesRight = (index) => {
        if (imageContainers.current[index]) {
            imageContainers.current[index].scrollBy({ left: 100, behavior: 'smooth' });
        }
    };

    const handleEditProfilePic = async () => {

        const formData = new FormData();
        formData.append('picture', selectedFile);

        try {
            const response = await _post('/profile/picture-update', formData);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <User>
            {showDetails && <EventDetailsModal event={null} onClose={() => setShowDetails(false)} />}
            <div className="w-full flex items-center justify-center flex-col p-4 overflow-hidden ">
                <div className="w-full max-w-[1200px] grid grid-cols-3 md:grid-cols-7 gap-4" >
                    <div className="hidden md:block col-span-2 h-72">
                        <p className="font-medium text-sm py-2 mb-2">My Previous Eevents</p>
                        <div className="flex flex-col gap-2">
                            {prevEvents.map((event, index) => (
                                <div key={index} className="flex items-center gap-2 p-2 rounded-md shadow-sm bg-white">
                                    <img src={event.thumbnail} alt="img" className="w-10 h-10 rounded bg-gray-gray-300 object-cover object-center" onClick={() => handleImageClick(event.thumbnail)}/>
                                    <div className="flex flex-col items-start justify-start gap-1">
                                        <h1 className="text-xs font-semibold text-gray-700">{event.title}</h1>
                                        <p className="text-[9px] text-gray-500">{event.date} - {event.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="col-span-3 h-auto rounded flex items-start flex-col justify-start gap-2">
                        <div className="w-full">
                            <div className="w-full text-xs rounded px-4 py-1.5 flex items-center justify-start gap-2 bg-white shadow-sm">
                                <Search className="w-4 h-4 text-gray-500" />
                                <input type="text" placeholder="Search.." className="w-full h-full border-0 text-xs placeholder:text-xs bg-transparent outline-none"/>
                            </div>
                            

                            <div className="flex items-center justify-start gap-1 mt-2">
                                <div className="bg-white mr-1 p-1 border rounded">
                                    <SlidersHorizontal className="w-4 h-4 text-gray-500" />
                                </div>
                                <button onClick={() => setTab('events')} className={`text-[10px] px-2 py-1 rounded  ${tab === 'events' ? 'bg-blue-500 text-white border-0' : 'border border-gray-200'}`}>Events</button>
                                <button onClick={() => setTab('projects')} className={`text-[10px] px-2 py-1 rounded  ${tab === 'projects' ? 'bg-blue-500 text-white border-0' : 'border border-gray-200'}`}>Projects</button>
                            </div>
                        </div>
                        <div className="flex flex-col items-start justify-start gap-2 w-full h-auto md:max-h-[530px] overflow-y-auto py-2 hide-scrollbar">
                            {tab === 'projects' && projects.map((project, index) => (
                               <div key={index} className="w-full h-fit flex flex-col items-start justify-start gap-2 bg-white rounded-md shadow-sm p-4 border border-gray-50">
                                    <div className="flex items-center justify-start gap-2">
                                        <img src="logo.png" alt="img" className="w-8 h-8 rounded-full"/>
                                        <div className="flex flex-col items-start justify-start ">
                                            <p className="text-xs font-medium">Kalinga ng Kababaihan</p>
                                            <p className="text-[9px]">April 9 10:00 AM</p>
                                        </div>
                                        
                                    </div>
                                    <div className="flex flex-col items-start justify-start gap-1">
                                        <h1 className="text-sm font-semibold text-gray-700">{project.title}</h1>
                                        <p className="text-[10px] text-gray-500 rounded-md px-2 bg-green-100">{project.date} - {project.time}</p>
                                        <p className="text-xs text-gray-500">{project.description}</p>
                                    </div>

                                    <div>
                                        {project.image && (
                                            <div className="flex items-center justify-start gap-2 mt-2 overflow-scroll hide-scrollbar">
                                                <img onClick={() => handleImageClick(project.image)} key={index} src={`${baseURL}${project.image}`} className="w-24 h-24 rounded bg-gray-gray-300 object-cover object-center cursor-pointer"/>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* <div>
                                        {event.images && event.images.length > 0 && (
                                            <div className="flex items-center justify-start gap-2 mt-2 overflow-scroll hide-scrollbar">
                                                {event.images.map((image, index) => (
                                                    <img key={index} src={image.src} alt={image.alt} className="w-24 h-24 rounded bg-gray-gray-300 object-cover object-center cursor-pointer" onClick={() => handleImageClick(image.src)}/>
                                                ))}
                                            </div>
                                        )}
                                    </div> */}
                                    {/* {event.images && event.images.length > 0 && (
                                        <div className="relative w-full">
                                           
                                            <button
                                                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow px-2 py-1 rounded-l hover:bg-gray-100"
                                                onClick={() => scrollImagesLeft(index)}
                                            >
                                                ◀
                                            </button>
                                            <div
                                                className="flex items-center justify-start gap-2 mt-2 overflow-x-auto hide-scrollbar scroll-smooth"
                                                ref={(el) => (imageContainers.current[index] = el)}
                                            >
                                                {event.images.map((image, imgIndex) => (
                                                    <img
                                                        key={imgIndex}
                                                        src={image.src}
                                                        alt={image.alt}
                                                        className="w-24 h-24 rounded bg-gray-gray-300 object-cover object-center cursor-pointer"
                                                        onClick={() => handleImageClick(image.src)}
                                                    />
                                                ))}
                                            </div>
                                            <button
                                                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow px-2 py-1 rounded-r hover:bg-gray-100"
                                                onClick={() => scrollImagesRight(index)}
                                            >
                                                ▶
                                            </button>
                                        </div>
                                    )} */}

                                    <div className="flex items-center justify-start gap-2 mt-2">
                                        <button onClick={() => setShowDetails(true)} className="px-2 py-1 text-[10px] bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded">Details</button>
                                        <button className="px-2 py-1 text-[10px] bg-blue-500 text-white hover:bg-blue-600 rounded">Volunteer</button>
                                    </div>
                                </div> 
                            ))}
                            {tab === 'events' && events.map((event, index) => (
                                <div key={index} className="w-full h-fit flex flex-col items-start justify-start gap-2 bg-white rounded-md shadow-sm p-4 border border-gray-50">
                                    <div className="flex items-center justify-start gap-2">
                                        <img src="logo.png" alt="img" className="w-8 h-8 rounded-full"/>
                                        <div className="flex flex-col items-start justify-start ">
                                            <p className="text-xs font-medium">Kalinga ng Kababaihan</p>
                                            <p className="text-[9px]">April 9 10:00 AM</p>
                                        </div>
                                        
                                    </div>
                                    <div className="flex flex-col items-start justify-start gap-1">
                                        <h1 className="text-sm font-semibold text-gray-700">{event.title}</h1>
                                        <p className="text-[10px] text-gray-500 rounded-md px-2 bg-green-100">{event.date} - {event.time}</p>
                                        <p className="text-xs text-gray-500">{event.description}</p>
                                    </div>

                                    {/* <div>
                                        {event.image && (
                                            <div className="flex items-center justify-start gap-2 mt-2 overflow-scroll hide-scrollbar">
                                                <img key={index} src={`${baseURL}${event.image}`} className="w-24 h-24 rounded bg-gray-gray-300 object-cover object-center cursor-pointer" onClick={() => handleImageClick(image.src)}/>
                                            </div>
                                        )}
                                    </div> */}
                                    
                                    {/* <div>
                                        {event.images && event.images.length > 0 && (
                                            <div className="flex items-center justify-start gap-2 mt-2 overflow-scroll hide-scrollbar">
                                                {event.images.map((image, index) => (
                                                    <img key={index} src={image.src} alt={image.alt} className="w-24 h-24 rounded bg-gray-gray-300 object-cover object-center cursor-pointer" onClick={() => handleImageClick(image.src)}/>
                                                ))}
                                            </div>
                                        )}
                                    </div> */}
                                    {/* {event.images && event.images.length > 0 && (
                                        <div className="relative w-full">
                                           
                                            <button
                                                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow px-2 py-1 rounded-l hover:bg-gray-100"
                                                onClick={() => scrollImagesLeft(index)}
                                            >
                                                ◀
                                            </button>
                                            <div
                                                className="flex items-center justify-start gap-2 mt-2 overflow-x-auto hide-scrollbar scroll-smooth"
                                                ref={(el) => (imageContainers.current[index] = el)}
                                            >
                                                {event.images.map((image, imgIndex) => (
                                                    <img
                                                        key={imgIndex}
                                                        src={image.src}
                                                        alt={image.alt}
                                                        className="w-24 h-24 rounded bg-gray-gray-300 object-cover object-center cursor-pointer"
                                                        onClick={() => handleImageClick(image.src)}
                                                    />
                                                ))}
                                            </div>
                                            <button
                                                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow px-2 py-1 rounded-r hover:bg-gray-100"
                                                onClick={() => scrollImagesRight(index)}
                                            >
                                                ▶
                                            </button>
                                        </div>
                                    )} */}

                                    <div className="flex items-center justify-start gap-2 mt-2">
                                        <button onClick={() => setShowDetails(true)} className="px-2 py-1 text-[10px] bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded">Details</button>
                                        <button className="px-2 py-1 text-[10px] bg-blue-500 text-white hover:bg-blue-600 rounded">Volunteer</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {viewImage && (
                                <AnimatePresence>
                                    <motion.div 
                                    role="alert"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="w-screen h-screen flex items-center justify-center bg-black/40 fixed top-0 left-0 z-50 cursor-pointer px-5" onClick={() => setViewImage(false)}>
                                        <motion.div 
                                        initial={{ scale: 0.95, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.95, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="bg-white h-auto min-h-80 rounded-lg w-full max-w-[600px] flex flex-col justify-start gap-4">
                                            <img src={`${baseURL}${selectedIamge}`} alt="image" className="h-full w-full rounded-lg" />
                                        </motion.div>
                                    </motion.div>
                                </AnimatePresence>
                            )
                        }
                    </div>

                    <div className="hidden md:flex col-span-2 h-fit w-full flex-col gap-4">
                        <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-sm">
                            <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-orange-100 mb-2 z-0">
                                <p className="text-lg font-medium text-orange-500">{user?.fullName?.charAt(0) || ''}</p>
                                <PencilLine size={14} onClick={openUpdateProfilePicModal} className="absolute -right-0 bottom-0 hover:text-blue-500 cursor-pointer" />
                            </div>
                            {showUpdateProfilePic && (
                                    <AnimatePresence>
                                        <motion.div
                                            role="alert"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="w-screen h-screen flex items-center justify-center bg-black/40 fixed top-0 left-0 z-40 cursor-pointer px-5"
                                            
                                        >
                                            <motion.div
                                            initial={{ scale: 0.95, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.95, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="bg-white rounded-lg h-auto flex flex-col w-fit justify-start gap-4"
                                            >
                                                <div className="flex flex-col w-fit items-center justify-center p-4">

                                                    {/* Hidden input + clickable label */}
                                                    <input
                                                    type="file"
                                                    id="fileUpload"
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                    accept="image/*"
                                                    />

                                                    <label
                                                    htmlFor="fileUpload"
                                                    className="w-80 h-72 rounded-lg border-dashed border-2 border-gray-300 hover:border-gray-400 group flex items-center justify-center cursor-pointer overflow-hidden relative"
                                                    >
                                                    {selectedFile ? (
                                                        <img
                                                        src={URL.createObjectURL(selectedFile)}
                                                        alt="Preview"
                                                        className="object-cover w-full h-full"
                                                        />
                                                    ) : (
                                                        <Image size={42} strokeWidth={1} className="text-gray-300 group-hover:text-gray-700" />
                                                    )}
                                                    </label>

                                                    {/* Buttons */}
                                                    <div className="w-full flex items-center justify-end gap-2 mt-4">
                                                    <button
                                                        className="px-4 py-2 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded"
                                                        onClick={() => {
                                                        // upload logic here
                                                        }}
                                                    >
                                                        Save
                                                    </button>

                                                    <button
                                                        className="px-4 py-2 text-xs bg-gray-200 hover:bg-gray-300 rounded"
                                                        onClick={() => {
                                                        setSelectedFile(null);
                                                        setShowUpdateProfilePic(false);
                                                        }}
                                                    >
                                                        Cancel
                                                    </button>
                                                    </div>

                                                </div>

                                            </motion.div>
                                        </motion.div>
                                    </AnimatePresence>
                                )}
                            <h5 className="mb-1  font-medium text-gray-900 dark:text-white">{user.fullName}</h5>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{user.email}</span>
                            <span className="text-xs text-blue-500 dark:text-gray-400">@{user.username}</span>
                        </div>

                        <div className="flex flex-col items-center gap-2 p-6 bg-white rounded-lg shadow-sm">
                            <p className="text-sm font-semibold w-full text-left pb-1 border-b">Other Information</p>
                            <div className="w-full flex items-center justify-start gap-2">
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold min-w-20">Email</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                            </div>

                            <div className="w-full flex items-center justify-start gap-2">
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold min-w-20">Contact No.</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{user.contactNumber}</p>
                            </div>

                            <div className="w-full flex items-center justify-start gap-2">
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold min-w-20">Username</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{user.username}</p>
                            </div>
                           
                            <div className="w-full flex items-start justify-start gap-2">
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold min-w-20">Address</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {(user.address.block ?? '') + ' '}  
                                    {(user.address.lot ?? '') + ' '} 
                                    {(user.address.street ?? '') + ' '} 
                                    {(user.subdivision ?? '') + ' '} 
                                    {(user.address.barangay ?? '') + ' '} 
                                    {(user.address.city ?? '') + ' '} 
                                    {(user.address.province ?? '') + ' '} 
                                    {user.address.code ?? ''} 
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <ChatButton/>
            </div>
        </User>
    );
}

export default Portal;