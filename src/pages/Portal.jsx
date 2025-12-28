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
import { MdOutlineCameraAlt } from "react-icons/md";
import VolunteerButton from "../components/volunteering/VolunteerButton";
import VolunteerRequestsTable from "../components/volunteering/VolunteerRequestsTable";

const Portal = () => {

    const {user, refreshUser} = useContext(AuthContext);
    const {activeTab, setActiveTab} = useContext(PortalContext);
    const baseURL = "https://api.kalingangkababaihan.com/storage/";


    const [events, setEvents] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState([]);
    const [requestsLoading, setRequestsLoading] = useState(false);

    const [membershipData, setMembershipData] = useState({
        payment_reference_number: '',
        proof_of_payment: null,
        proof_of_identity: null,
    });
    const [membershipErrors, setMembershipErrors] = useState({});
    const [membershipSubmitting, setMembershipSubmitting] = useState(false);
    const [membershipSuccess, setMembershipSuccess] = useState(false);

    const [selectedIamge, setSelectedImage] = useState();
    const [viewImage, setViewImage] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [showUpdateProfilePic, setShowUpdateProfilePic] = useState(false);

    const [selectedFile, setSelectedFile] = useState(null);

    const [tab, setTab] = useState('events'); 

    const [modal, setModal] = useState({
        eventDetails: false,
        updateProfilePic: false,
        updateProfileInfo: false,
        profileUpdateSuccessful: false
    });

    const [changingPassword, setChangingPassword] = useState(false);
    const [showChangePasswordSuucess, setShowChangePasswordSuccess] = useState(false);
    const [errors, setErrors] = useState([]);
    const [password, setPassword] = useState({
        oldPassword: '',
        newPassword: '',
        newPassword_confirmation: ''
    });

    const [CPSuccess, setCPSuccess] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPassword(prevData => ({
            ...prevData,
            [name]: value
        }));
    }

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const response = await _get('/projects');
            setProjects(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchVolunteerRequests = async () => {
        setRequestsLoading(true);
        try {
            const response = await _get(`/volunteering-requests/by-user/${user.id}`);
            setRequests(response.data.requests || []);
        } catch (error) {
            console.log(error);
        } finally {
            setRequestsLoading(false);
        }
    }

    useEffect(() => {
        if (activeTab === 'requests') {
            fetchVolunteerRequests();
        }
    }, [activeTab]);


    const handleImageClick = (url) => {
        setSelectedImage(url);
        setViewImage(true);
    };

    const onSave = () => {
        setModal(prev => ({...prev, profileUpdateSuccessful: true}));
        refreshUser();
    }

    const handleChangePassword = async () => {
        setErrors([]);
        setChangingPassword(true);
        try {
            const response = await _post(`/users/change-password/${user.id}`, password);
            if (response.status === 200) {
                setPassword({
                    oldPassword: '',
                    newPassword: '',
                    newPassword_confirmation: ''
                });
            }
            setShowChangePasswordSuccess(true);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else if (error.response && error.response.data && error.response.data.error) {
                setErrors(prev => ({...prev, oldPassword: [error.response.data.error]}));
            } else {
                console.error('An unexpected error occurred:', error);
            }
        } finally {
            setChangingPassword(false);
        }
    }

    const handleSearchProjects = async(e) => {
        setLoading(true);
        try {
            const response = await _get(`/projects/search?search=${e.target.value}`);
            setProjects(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const isProjectUpcoming = (project) => {
        const dateString = project?.time ? `${project.date} ${project.time}` : project?.date;
        if (!dateString) return true;

        const parsed = new Date(dateString);
        if (Number.isNaN(parsed.getTime())) return true;

        return parsed.getTime() >= Date.now();
    }

    const handleMembershipTextChange = (e) => {
        const { name, value } = e.target;
        setMembershipData(prev => ({ ...prev, [name]: value }));
        setMembershipErrors(prev => ({ ...prev, [name]: undefined }));
    };

    const handleMembershipFileChange = (e) => {
        const { name, files } = e.target;
        const file = files && files[0] ? files[0] : null;
        setMembershipData(prev => ({ ...prev, [name]: file }));
        setMembershipErrors(prev => ({ ...prev, [name]: undefined }));
    };

    const resetMembershipForm = () => {
        setMembershipData({
            payment_reference_number: '',
            proof_of_payment: null,
            proof_of_identity: null,
        });
        setMembershipErrors({});
    };

    const submitMembershipRequest = async () => {
        setMembershipSubmitting(true);
        setMembershipErrors({});
        try {
            const formData = new FormData();
            formData.append('user_id', user.id);
            formData.append('payment_reference_number', membershipData.payment_reference_number);
            if (membershipData.proof_of_payment) {
                formData.append('proof_of_payment', membershipData.proof_of_payment);
            }
            if (membershipData.proof_of_identity) {
                formData.append('proof_of_identity', membershipData.proof_of_identity);
            }

            await _post('/membership-requests', formData);
            resetMembershipForm();
            setMembershipSuccess(true);
        } catch (error) {
            if (error.response?.data?.errors) {
                setMembershipErrors(error.response.data.errors);
            }
        } finally {
            setMembershipSubmitting(false);
        }
    };

    return (
        <div className="h-full">
            {showDetails && <EventDetailsModal event={null} onClose={() => setShowDetails(false)} />}
            <div className="w-full h-[95%] flex items-center justify-center flex-col p-4 overflow-hidden">
                <div className="w-full max-w-[600px] h-full mx-auto flex items-start justify-between gap-4" >

                    {activeTab === 'home' && (
                        <div className="w-full h-full rounded flex items-start flex-col justify-start gap-3">
                            <div className="w-full sticky top-2 z-10">
                                <div className="w-full text-sm rounded-xl px-4 py-3 flex items-center justify-start gap-2 bg-white shadow hover:bg-blue-50 border border-gray-100 hover:border-blue-200 group transition-colors duration-300 ease-in-out">
                                    <Search className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors duration-300 ease-in-out" />
                                    <input  
                                        onChange={handleSearchProjects}   
                                        type="text" 
                                        placeholder="Search projects..." 
                                        className="w-full h-full border-0 text-xs placeholder:text-xs bg-transparent outline-none group-hover:placeholder:text-blue-400 transition-colors duration-300 ease-in-out"/>
                                </div>
                            </div>
                            {loading ? (
                                <div className="w-full flex items-center justify-center py-10">
                                    <CircularLoading customClass='text-blue-500 w-6 h-6' />
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-3 w-full h-full overflow-y-auto pb-2 pr-1 hide-scrollbar">
                                    {projects.length > 0 ? projects.map((project, index) => (
                                        <div key={index} className="w-full h-full flex flex-col gap-2 bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-2">
                                                    <img src="logo.png" alt="img" className="w-8 h-8 rounded-full"/>
                                                    <div className="flex flex-col items-start">
                                                        <p className="text-xs font-medium">Kalinga ng Kababaihan</p>
                                                        <p className="text-[9px] text-gray-500">{project.date} {project.time ? `• ${project.time}` : ""}</p>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] px-2 py-1 rounded-full bg-green-50 text-green-600 border border-green-100">
                                                    {isProjectUpcoming(project) ? "Upcoming" : "Past"}
                                                </span>
                                            </div>

                                            <div className="flex flex-col gap-1">
                                                <h1 className="text-sm font-semibold text-gray-800 line-clamp-2">{project.title}</h1>
                                                <p className="text-xs text-gray-600 line-clamp-3">{project.description}</p>
                                            </div>

                                            {project.image && (
                                                <div className="w-full h-44 rounded-lg overflow-hidden bg-gray-100">
                                                    <img 
                                                        onClick={() => handleImageClick(project.image)}
                                                        src={`${baseURL}${project.image}`} 
                                                        className="w-full h-full object-cover cursor-pointer"
                                                        alt={project.title}
                                                    />
                                                </div>
                                            )}
                                            
                                            <div className="flex items-center justify-between gap-2 mt-1">
                                                <p className="text-[11px] text-gray-500 flex items-center gap-1">
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-100">
                                                        {project.date} {project.time ? `• ${project.time}` : ""}
                                                    </span>
                                                </p>
                                                {isProjectUpcoming(project) && <VolunteerButton project={project} />}
                                            </div>
                                        </div> 
                                    )) : (
                                        <div className="h-full w-full flex flex-col items-center justify-center bg-white border border-dashed border-gray-200 rounded-xl py-12 px-4 text-center">
                                            <p className="text-sm font-semibold text-gray-700">No projects found</p>
                                            <p className="text-[11px] text-gray-500">Try adjusting your search or check back later.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'requests' && (
                        <div className="w-full h-full rounded flex items-start flex-col justify-start gap-2">
                            <VolunteerRequestsTable requests={requests} loading={requestsLoading} />
                        </div>
                    )}

                    {activeTab === 'membership' && (
                        <div className="w-full h-full rounded flex items-start flex-col justify-start gap-3 overflow-y-auto px-2 md:px-4">
                            <div className="w-full bg-gradient-to-r from-orange-50 via-white to-orange-50 border border-orange-100 rounded-xl shadow-sm p-5 space-y-4">
                                <div className="flex flex-col lg:flex-row items-center gap-6">
                                    <div className="w-fit bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-center">
                                        <img 
                                            src="/gcashqrcode.jpg" 
                                            alt="GCash QR code" 
                                            className="w-full max-w-[150px] h-auto object-contain"
                                        />
                                    </div>
                                    <div className="w-full lg:w-1/2 flex flex-col gap-3 text-center lg:text-left">
                                        <p className="text-sm font-semibold text-gray-800">Pay via GCash</p>
                                        <p className="text-xs text-gray-600">
                                            Send your membership fee to the GCash account below, then upload your proof of payment and a valid ID.
                                        </p>
                                        <div className="flex flex-col gap-1 rounded-lg bg-white border border-gray-200 p-3">
                                            <p className="text-[11px] text-gray-500 uppercase tracking-wide">GCash Number</p>
                                            <p className="text-lg font-semibold text-orange-600">0917 123 4567</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-5 space-y-4">
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm font-semibold text-orange-600">Submit Membership Request</p>
                                    <p className="text-xs text-gray-500">Upload your proof of payment and proof of identity. Accepted formats: JPG, JPEG, PNG up to 5MB.</p>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {/* <div className="flex flex-col gap-1">
                                        <label className="text-[11px] text-gray-600">User ID</label>
                                        <input 
                                            type="text" 
                                            value={user?.id ?? ''} 
                                            readOnly 
                                            className="text-xs bg-gray-50 border border-gray-200 rounded px-3 py-2" 
                                        />
                                    </div> */}
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[11px] text-gray-600">Payment Reference Number</label>
                                        <input 
                                            type="text" 
                                            name="payment_reference_number"
                                            value={membershipData.payment_reference_number}
                                            onChange={handleMembershipTextChange}
                                            placeholder="Enter your payment reference number"
                                            className="text-xs border border-gray-200 rounded px-3 py-2 placeholder:text-gray-400"
                                        />
                                        {membershipErrors.payment_reference_number && (
                                            <span className="text-red-500 text-[11px]">{membershipErrors.payment_reference_number[0]}</span>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[11px] text-gray-600">Proof of Payment (JPG/PNG, max 5MB)</label>
                                            <label className="flex items-center justify-between border border-dashed border-gray-300 rounded-lg px-3 py-3 bg-gray-50 hover:bg-gray-100 cursor-pointer text-xs text-gray-600">
                                                <span className="truncate">{membershipData.proof_of_payment ? membershipData.proof_of_payment.name : "Upload receipt"}</span>
                                                <span className="text-blue-500 text-[11px]">Browse</span>
                                                <input 
                                                    type="file" 
                                                    name="proof_of_payment" 
                                                    accept=".jpg,.jpeg,.png" 
                                                    className="hidden"
                                                    onChange={handleMembershipFileChange}
                                                />
                                            </label>
                                            {membershipErrors.proof_of_payment && (
                                                <span className="text-red-500 text-[11px]">{membershipErrors.proof_of_payment[0]}</span>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[11px] text-gray-600">Proof of Identity (JPG/PNG, max 5MB)</label>
                                            <label className="flex items-center justify-between border border-dashed border-gray-300 rounded-lg px-3 py-3 bg-gray-50 hover:bg-gray-100 cursor-pointer text-xs text-gray-600">
                                                <span className="truncate">{membershipData.proof_of_identity ? membershipData.proof_of_identity.name : "Upload valid ID"}</span>
                                                <span className="text-blue-500 text-[11px]">Browse</span>
                                                <input 
                                                    type="file" 
                                                    name="proof_of_identity" 
                                                    accept=".jpg,.jpeg,.png" 
                                                    className="hidden"
                                                    onChange={handleMembershipFileChange}
                                                />
                                            </label>
                                            {membershipErrors.proof_of_identity && (
                                                <span className="text-red-500 text-[11px]">{membershipErrors.proof_of_identity[0]}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 text-[11px] text-gray-500">
                                    <p>Each file must be an image (JPEG or PNG) and no larger than 5MB.</p>
                                    <button 
                                        onClick={submitMembershipRequest}
                                        disabled={membershipSubmitting}
                                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs rounded shadow disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {membershipSubmitting ? "Submitting..." : "Submit Request"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'profile' && (
                        <div className="w-full flex h-fit flex-col gap-4">
                            <div className="w-full rounded-xl bg-gradient-to-r from-orange-50 via-white to-orange-50 border border-orange-100 shadow-sm p-5 flex flex-col gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="flex items-center justify-center min-w-32 w-32 min-h-32 h-32 rounded-full bg-white border border-orange-100 shadow-sm">
                                        {user?.image ? (
                                            <img 
                                                src={`${baseURL}${user.image}`} 
                                                alt="Profile" 
                                                className="w-full h-full rounded-full object-cover object-center cursor-pointer" 
                                                onClick={() => setModal(prev => ({...prev, updateProfilePic: true}))}
                                            />
                                        ) : (
                                            <div 
                                                className="w-full h-full flex items-center justify-center rounded-full cursor-pointer"
                                                onClick={() => setModal(prev => ({...prev, updateProfilePic: true}))}
                                            >
                                                <MdOutlineCameraAlt size={28} className="text-orange-400 cursor-pointer" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="w-full flex flex-col gap-2">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-gray-900 text-lg">{user.fullName}</span>
                                                <span className="text-xs text-blue-500">@{user.username}</span>
                                            </div>
                                            <button
                                                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-orange-200 bg-white text-[11px] hover:bg-orange-50 transition-all"
                                                onClick={() => setModal(prev => ({...prev, updateProfileInfo: true}))}
                                            >
                                                <PencilLine size={12} strokeWidth={2.5}/>
                                                Edit Profile
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-600">
                                            <div className="flex flex-col gap-1 bg-white border border-gray-100 rounded-lg p-3">
                                                <p className="text-[11px] text-gray-500 uppercase tracking-wide">Email</p>
                                                <p className="font-medium text-gray-800 break-all">{user.email}</p>
                                            </div>
                                            <div className="flex flex-col gap-1 bg-white border border-gray-100 rounded-lg p-3">
                                                <p className="text-[11px] text-gray-500 uppercase tracking-wide">Contact</p>
                                                <p className="font-medium text-gray-800">{user.contactNumber || '-'}</p>
                                            </div>
                                            <div className="flex flex-col gap-1 bg-white border border-gray-100 rounded-lg p-3 md:col-span-2">
                                                <p className="text-[11px] text-gray-500 uppercase tracking-wide">Address</p>
                                                <p className="font-medium text-gray-800">
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
                            </div>

                            <div className="flex flex-col items-start gap-3 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                                <div className="w-full flex items-center justify-between">
                                    <p className="text-sm font-semibold">Security</p>
                                    <span className="text-[11px] text-gray-500">Keep your account safe by updating your password regularly.</span>
                                </div>
                                <div className='w-full flex flex-col gap-3'>
                                    <div className='w-full md:flex items-center justify-between gap-4'>
                                        <label className='text-xs font-medium text-gray-600 md:min-w-40'>Old Password</label>
                                        <div className='flex flex-col w-full md:w-80'>
                                            <input 
                                                type="password" 
                                                className='text-[11px] w-full rounded-md px-4 py-2 border border-gray-200 focus:outline-none focus:border-orange-400 placeholder:text-gray-300' 
                                                placeholder='Old Password'
                                                value={password.oldPassword}
                                                name='oldPassword'
                                                onChange={handleInputChange}
                                            />
                                            {errors.oldPassword && (
                                                <span className="text-red-500 text-[11px] px-1">{errors.oldPassword[0]}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className='md:flex items-center justify-between gap-4'>
                                        <label className='text-xs font-medium text-gray-600 md:min-w-40'>New Password</label>
                                        <div className='flex flex-col w-full md:w-80'>
                                            <input 
                                                type="password" 
                                                className='text-[11px] w-full rounded-md px-4 py-2 border border-gray-200 focus:outline-none focus:border-orange-400 placeholder:text-gray-300' 
                                                placeholder='New Password'
                                                value={password.newPassword}
                                                name='newPassword'
                                                onChange={handleInputChange}
                                            />
                                            {errors.newPassword && (
                                                <span className="text-red-500 text-[11px] px-1">{errors.newPassword[0]}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className='md:flex items-center justify-between gap-4'>
                                        <label className='text-xs font-medium text-gray-600 md:min-w-40'>Confirm Password</label>
                                        <div className='flex flex-col w-full md:w-80'>
                                            <input 
                                                type="password" 
                                                value={password.newPassword_confirmation}
                                                className='text-[11px] w-full rounded-md px-4 py-2 border border-gray-200 focus:outline-none focus:border-orange-400 placeholder:text-gray-300' 
                                                placeholder='Confirm Password'
                                                name='newPassword_confirmation'
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full flex items-center justify-end mt-2">
                                    <button 
                                        onClick={() => handleChangePassword()} 
                                        className="px-4 py-2 text-[11px] text-white rounded bg-orange-500 hover:bg-orange-600 shadow-sm">
                                            {changingPassword ? <div className="flex items-center gap-2"><CircularLoading customClass='text-white w-4 h-4' /><span>Changing...</span></div> : 'Update Password'}
                                    </button>
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
                        id={user.id}  
                        setModal={setModal} 
                        onSuccess ={() => setCPSuccess(true)}
                    />
                )}

                {modal.profileUpdateSuccessful && (
                    <SuccesAlert 
                        message='Your information has been updated succesfully!'
                        onClose={() => setModal(prev => ({...prev, profileUpdateSuccessful: false}))}
                    />
                )}

                {showChangePasswordSuucess && (
                    <SuccesAlert 
                        message='Your password has been updated succesfully!'
                        onClose={() => setShowChangePasswordSuccess(false)}
                    />
                )}

                {membershipSuccess && (
                    <SuccesAlert 
                        message="Membership request submitted successfully!" 
                        onClose={() => setMembershipSuccess(false)} 
                    />
                )}

                {CPSuccess && (
                    <SuccesAlert 
                        message="Profile picture updated successfully!" 
                        onClose={() => setCPSuccess(false)} 
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
