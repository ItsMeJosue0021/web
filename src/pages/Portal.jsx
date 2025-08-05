import { useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../AuthProvider";
import { PortalContext } from "../layouts/User";
import { SlidersHorizontal, X } from "lucide-react";
import { Search } from "lucide-react";
import { useState, useRef  } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import ChatButton from "../components/chatbot/ChatButton";
import EventDetailsModal from "../components/EventDetailsModal";
import { PencilLine, Image } from "lucide-react";
import { _get, _post } from "../api";
import UpdateProfileModal from "../components/profile/UpdateProfileModal";
import UpdateProfilePicModal from "../components/profile/UpdateProfilePicModal";
import SuccesAlert from "../components/alerts/SuccesAlert";
import CircularLoading from "../components/CircularLoading";

const Portal = () => {

    const {user, refreshUser} = useContext(AuthContext);
    const {activeTab, setActiveTab} = useContext(PortalContext);
    const baseURL = "https://api.kalingangkababaihan.com/storage/";


    const [events, setEvents] = useState([]);
    const [projects, setPrjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedIamge, setSelectedImage] = useState();
    const [viewImage, setViewImage] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [showUpdateProfilePic, setShowUpdateProfilePic] = useState(false);

    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    const [tab, setTab] = useState('events'); 

    const [modal, setModal] = useState({
        eventDetails: false,
        updateProfilePic: false,
        updateProfileInfo: false,
        profileUpdateSuccessful: false
    });

    const [errors, setErrors] = useState([]);
    const [password, setPassword] = useState({
        oldPassword: '',
        newPassword: '',
        newPassword_confirmation: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPassword(prevData => ({
            ...prevData,
            [name]: value
        }));
    }

    useEffect(() => {
        fetchEvents();
        fetchProjects();
    }, []);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const response = await _get('/events');
            setEvents(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const response = await _get('/projects');
            setPrjects(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
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

    const onSave = () => {
        setModal(prev => ({...prev, profileUpdateSuccessful: true}));
        refreshUser();
    }

    return (
        <div className="h-full">
            {showDetails && <EventDetailsModal event={null} onClose={() => setShowDetails(false)} />}
            <div className="w-full h-[95%] flex items-center justify-center flex-col p-4 overflow-hidden">
                <div className="w-full max-w-[600px] h-full mx-auto flex items-start justify-between gap-4" >

                    {activeTab === 'home' && (
                        <div className="w-full h-full rounded flex items-start flex-col justify-start gap-2">
                            <div className="w-full">
                                <div className="w-full text-sm rounded-xl px-4 py-3 flex items-center justify-start gap-2 bg-white shadow ">
                                    <Search className="w-4 h-4 text-gray-500" />
                                    <input type="text" placeholder="Search.." className="w-full h-full border-0 text-xs placeholder:text-xs bg-transparent outline-none"/>
                                </div>
                                
                                {/* <div className="flex items-center justify-start gap-1 mt-2">
                                    <div className="bg-white mr-1 p-1 border rounded">
                                        <SlidersHorizontal className="w-5 h-5 text-gray-500" />
                                    </div>
                                    <button 
                                        onClick={() => setTab('events')} 
                                        className={`text-[10px] px-2 py-1.5 rounded  ${tab === 'events' ? 'bg-blue-500 text-white border-0' : 'border border-gray-200'}`}>
                                        Events
                                    </button>

                                    <button 
                                        onClick={() => setTab('projects')} 
                                        className={`text-[10px] px-2 py-1.5 rounded  ${tab === 'projects' ? 'bg-blue-500 text-white border-0' : 'border border-gray-200'}`}>
                                        Projects
                                    </button>
                                </div> */}
                            </div>
                            {loading ? (<CircularLoading />) : (
                                <div className="flex flex-col items-start justify-start gap-2 h-full overflow-y-auto py-2 hide-scrollbar">
                                    {projects.map((project, index) => (
                                        <div key={index} className="w-full h-fit flex flex-col items-start justify-start gap-2 bg-white rounded-xl shadow-sm p-4 border border-gray-200">
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
                                            
                                            <div className="flex items-center justify-start gap-2 mt-2">
                                                <button onClick={() => setShowDetails(true)} className="px-2 py-1 text-[10px] bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded">Details</button>
                                                <button className="px-2 py-1 text-[10px] bg-blue-500 text-white hover:bg-blue-600 rounded">Volunteer</button>
                                            </div>
                                        </div> 
                                    ))}
                                    {/* {tab === 'events' && events.map((event, index) => (
                                        <div key={index} className="w-full h-fit flex flex-col items-start justify-start gap-2 bg-white rounded-lg shadow-sm p-4 border border-gray-200">
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

                                            <div className="flex items-center justify-start gap-2 mt-2">
                                                <button onClick={() => setShowDetails(true)} className="px-2 py-1 text-[10px] bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded">Details</button>
                                                <button className="px-2 py-1 text-[10px] bg-blue-500 text-white hover:bg-blue-600 rounded">Volunteer</button>
                                            </div>
                                        </div>
                                    ))} */}
                                </div>
                            )}
                            
                            
                        </div>
                    )}
                    
                    {activeTab === 'profile' && (
                        <div className="w-full hidden md:flex  h-fit flex-col gap-4">

                            <div className="p-4  bg-transparent rounded-xl border border-gray-200">
                                <div className="flex items-center justify-start gap-4">
                                    <div className="flex items-center justify-center min-w-32 w-32 min-h-32 h-32 rounded-full bg-orange-100">
                                        <p className="text-lg font-medium text-orange-500">{user?.fullName?.charAt(0) || ''}</p>
                                    </div>
                                    <div className="w-full flex flex-col gap-1 items-start justify-start">
                                        <div className="w-full flex items-center justify-between">
                                            <span className="font-semibold text-gray-900 text-lg">{user.fullName}</span>
                                            <span className="flex items-center gap-2 px-2 py-1 rounded-lg border border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-all duration-300 ease-in-out" 
                                            onClick={() => setModal(prev => ({...prev, updateProfileInfo: true}))}>
                                                <p className="text-[11px]">Edit</p>
                                                <PencilLine size={12} strokeWidth={2.5}/>
                                            </span>
                                        </div>
                                        
                                        <span className="text-xs text-blue-500 dark:text-gray-400">@{user.username}</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">{user.email}</span>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{user.contactNumber}</p>
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

                            <div className="flex flex-col items-center gap-2 p-6 bg-white rounded-xl border border-gray-200">
                                <p className="text-sm font-semibold w-full text-left pb-1 ">Change Password</p>
                                <div className='w-full flex flex-col gap-2'>
                                    <div className='w-full flex items-center justify-between gap-4'>
                                        <label className='text-xs font-medium text-gray-600'>Old Password</label>
                                        <div className='flex flex-col'>
                                            <input 
                                                type="password" 
                                                className='text-[11px] w-80 max-w-80 border-0 border-b border-gray-300 px-2 focus:outline-none placeholder:text-gray-300 focus:border-blue-500' 
                                                placeholder='Old Password'
                                                value={password.oldPassword}
                                                name='oldPassword'
                                                onChange={handleInputChange}
                                            />
                                            {errors.oldPassword && (
                                                <span className="text-red-500 text-[9px] px-2">{errors.oldPassword[0]}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className='flex items-center justify-between gap-4'>
                                        <label className='text-xs font-medium text-gray-600'>New Password</label>
                                        <div className='flex flex-col'>
                                            <input 
                                                type="password" 
                                                className='text-[11px] w-80 max-w-80 border-0 border-b border-gray-300 px-2 focus:outline-none placeholder:text-gray-300 focus:border-blue-500' 
                                                placeholder='New Password'
                                                value={password.newPassword}
                                                name='newPassword'
                                                onChange={handleInputChange}
                                            />
                                            {errors.newPassword && (
                                                <span className="text-red-500 text-[9px] px-2">{errors.newPassword[0]}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className='flex items-center justify-between gap-4'>
                                        <label className='text-xs font-medium text-gray-600'>Confirm Password</label>
                                        <div className='flex flex-col'>
                                            <input 
                                                type="password" 
                                                className='text-[11px] w-80 max-w-80 border-0 border-b border-gray-300 px-2 focus:outline-none placeholder:text-gray-300 focus:border-blue-500' 
                                                placeholder='Confirm Password'
                                                name='newPassword_confirmation'
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full flex items-center justify-end mt-4">
                                    <button className="px-4 py-1.5 text-[11px] text-white rounded bg-blue-500 hover:bg-blue-600">Change</button>
                                </div>
                            </div>
                        </div>
                    )}
                    
                </div>

                <ChatButton/>

                {modal.updateProfileInfo && (
                    <UpdateProfileModal 
                        data={user}
                        setModal={setModal}
                        onSave={onSave}
                    />
                )}

                {modal.updateProfilePic && (
                    <UpdateProfilePicModal 
                        data={user} 
                        setSelectedFile={setSelectedFile} 
                        selectedFile={selectedFile} 
                        setModal={setModal} 
                        handleFileChange={handleFileChange} 
                    />
                )}

                {modal.profileUpdateSuccessful && (
                    <SuccesAlert 
                        message='Your information has been updated succesfully!'
                        onClose={() => setModal(prev => ({...prev, profileUpdateSuccessful: false}))}
                    />
                )}

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
        </div>
    );
}

export default Portal;