import Admin from "../../layouts/Admin";
import { useEffect, useState } from "react";
import { X, Edit, Trash2 } from "lucide-react";
import { _get, _post, _put, _delete } from "../../api";
import { AnimatePresence, motion } from "framer-motion";
import ConfirmationAlert from "../../components/alerts/ConfirmationAlert";
import { toast } from 'react-toastify';

const Events = () => {

    const baseURL = "https://api.kalingangkababaihan.com/storage/";

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');
    const [image, setImage] = useState(null);

    const [validationErrors, setValidationErrors] = useState({});
    const [toBeEditedEvent, setToBeEditedEvent] = useState(null);
    const [isSavingAdd, setIsSavingAdd] = useState(false);
    const [isSavingEdit, setIsSavingEdit] = useState(false);

    const [openImage, setOpenImage] = useState(false);
    const [viewImageURL, setViewImageURL] = useState("");


    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await _get("/events"); 
            const data = await response.data;
            setEvents(data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    }

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setLocation('');
        setDate('');
        setImage(null);
    }

    const handleViewImage = (image) => {
        setViewImageURL(image);
        setOpenImage(true);
    }

    const handleAddEvent = async (e) => {
        event.preventDefault();
        setIsSavingAdd(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('location', location);
        formData.append('date', date);
        if (image) {
            formData.append('image', image);
        }

        try {
            const response = await _post("/events", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            fetchEvents();
            toast.success("Event added successfully!");
            setOpenAddModal(false);
            resetForm();
            setValidationErrors({});
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                setValidationErrors(error.response.data.errors); // <- Set error messages
            } else {
                 toast.error("Error adding project. Please try again.");
                console.error('Error adding project:', error);
            }
        } finally {
            setIsSavingAdd(false);
        }
    }

        const handleEditEventSubmit = async (e) => {
        event.preventDefault();
        setIsSavingEdit(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('location', location);
        formData.append('date', date);
        if (image) {
            formData.append('image', image);
        }

        try {
            const response = await _post(`/events/update/${toBeEditedEvent.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            fetchEvents();
            toast.success("Event added successfully!");
            setOpenEditModal(false);
            resetForm();
            setValidationErrors({});
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                setValidationErrors(error.response.data.errors); // <- Set error messages
            } else {
                 toast.error("Error adding project. Please try again.");
                console.error('Error adding project:', error);
            }
        } finally {
            setIsSavingEdit(false);
        }
    }
    
    const handleConfirmDelete = (id) => {
        setDeleteId(id);
        setIsDeleteOpen(true);
    }

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await _delete(`/events/${deleteId}`);
            fetchEvents();
            toast.success("Event deleted successfully!");
        } catch (error) {
            toast.error("Error deleting event. Please try again.");
            console.error('Error deleting event:', error);
        } finally {
            setIsDeleting(false);
            setIsDeleteOpen(false);
        }
    }

    const handleEditEvent = (event) => {
        setValidationErrors({});
        setToBeEditedEvent(event);  
        setTitle(event.title);
        setDescription(event.description);
        setLocation(event.location);
        setDate(event.date);
        setImage(null);
        setOpenEditModal(true);
    }

    

    const header = {
        title: "Events Management",
        subTitle: "Easily manage your projects' information — create new entries, update project details, or remove completed or inactive projects."
    };

    const breadcrumbs = [
        { name: "Events", link: "/events-management" }
    ];

    return (
       <Admin header={header} breadcrumbs={breadcrumbs}>
        <div className="w-full mx-auto flex flex-col gap-4">
            <div className="flex items-center justify-between bg-white border-gray-100 p-3 rounded-lg">
                <div className="w-full min-w-80 max-w-[500px] flex items-center gap-4">
                    <p className="text-xs">Search</p>
                    <input type="text" className="placeholder:text-xs px-4 py-2 rounded border border-gray-200 text-sm" placeholder="Type something.." />
                </div>
                <div className="flex items-center justify-end gap-2">
                    <button onClick={() => setOpenAddModal(true)} className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-4 py-2 rounded">+ New</button>
                </div>
            </div>
            {loading ? (
                <div className="w-full h-36 flex items-center text-xs justify-center">
                    <div className="self-start h-full px-3 py-2 text-sm">
                        <div className="h-full flex items-center space-x-1">
                            <div className="dot dot-1 w-1 h-1 bg-orange-700 rounded-full"></div>
                            <div className="dot dot-2 w-1 h-1 bg-orange-700 rounded-full"></div>
                            <div className="dot dot-3 w-1 h-1 bg-orange-700 rounded-full"></div>
                            <div className="dot dot-4 w-1 h-1 bg-orange-700 rounded-full"></div>
                        </div>
                    </div>
                </div>
            ) : events.length === 0 ? (
                <div className="bg-white border border-dashed border-gray-200 rounded-lg p-8 text-center text-sm text-gray-500">
                    No events found. Create a new event to get started.
                    <div className="mt-3">
                        <button
                            onClick={() => setOpenAddModal(true)}
                            className="text-xs px-3 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600"
                        >
                            Add event
                        </button>
                    </div>
                </div>
            ) : (
                <table className="w-full border rounded-lg overflow-hidden shadow bg-white text-xs">
                    <thead className="bg-orange-500 text-white">
                    <tr>
                        <th className="p-3 text-start">Title</th>
                        <th className="p-3 text-start">Description</th>
                        <th className="p-3 text-start">Location</th>
                        <th className="p-3 text-start">Date</th>
                        <th className="p-3 text-start">Image</th>
                        <th className="p-3 text-end">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {events.map((event, index) => (
                        <tr key={event.id} className={`${index % 2 === 0 ? "bg-orange-50" : ""}`}>
                            <td className="p-3">{event.title || ''}</td>
                            <td className="p-3">
                            {(event.description || '').length > 100
                                ? event.description.substring(0, 100) + '...'
                                : event.description || ''}
                            </td>
                            <td className="p-3">{event.location || ''}</td>
                            <td className="p-3">{event.date || ''}</td>
                             <td className="p-3">
                                <button onClick={() => handleViewImage(event.image)} className="text-[10px] px-2 py-1 bg-gray-200 rounded">View</button>
                            </td>
                            <td className="p-3 h-full flex items-center justify-end gap-2">
                                <button onClick={() => handleEditEvent(event)} className="bg-blue-50 text-blue-600 px-1 py-1 rounded"><Edit size={16} /></button>
                                <button onClick={() => handleConfirmDelete(event.id)} className="bg-red-50 text-red-600 px-1 py-1 rounded" ><Trash2 size={16} /></button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>

        {openAddModal && (
            <AnimatePresence>
                <motion.div 
                role="alert"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }} 
                className="fixed inset-0 flex items-center justify-center bg-black/10 z-50">
                    <div className="relative bg-white p-6 rounded-lg shadow-lg min-w-96 w-[800px]">
                        <div className=" flex items-center justify-between mb-4">
                            <p className="text-xs">Add New Event</p>
                            <X onClick={() => {
                                    resetForm();
                                    setOpenAddModal(false)
                                    setValidationErrors({});
                                }} className="absolute top-4 right-4 cursor-pointer" size={20} />
                        </div>
                        <form className="flex flex-col gap-4" encType="multipart/form-data" onSubmit={handleAddEvent}>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs">Title <span className="text-xs text-red-500">*</span></label>
                                <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" className="placeholder:text-[11px] px-4 py-2 rounded border border-gray-200 text-xs" placeholder="Project Title" />
                                {validationErrors.title && (
                                    <p className="text-red-500 text-xs">{validationErrors.title[0]}</p>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs">Description <span className="text-xs text-red-500">*</span></label>
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="placeholder:text-[11px] px-4 py-2 rounded border border-gray-200 text-xs" placeholder="Project Description"></textarea>
                                {validationErrors.description && (
                                    <p className="text-red-500 text-xs">{validationErrors.description[0]}</p>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs">Location <span className="text-xs text-red-500">*</span></label>
                                <input value={location} onChange={(e) => setLocation(e.target.value)} type="text" className="placeholder:text-[11px] px-4 py-2 rounded border border-gray-200 text-xs" placeholder="Project Location" />
                                {validationErrors.location && (
                                    <p className="text-red-500 text-xs">{validationErrors.location[0]}</p>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs">Date <span className="text-xs text-red-500">*</span></label>
                                <input value={date} onChange={(e) => setDate(e.target.value)} type="date" className="placeholder:text-[11px] px-4 py-2 rounded border border-gray-200 text-xs" />
                                {validationErrors.date && (
                                    <p className="text-red-500 text-xs">{validationErrors.date[0]}</p>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs">Image</label>
                                <input
                                type="file"
                                onChange={(e) => setImage(e.target.files[0])}
                                className="placeholder:text-[11px] px-4 py-2 rounded border border-gray-200 text-xs"
                                />

                            </div>
                            <div className="flex items-center justify-end gap-2 mt-4">
                                <button
                                    type="submit"
                                    disabled={isSavingAdd}
                                    className={`bg-orange-500 text-white text-xs px-4 py-2 rounded ${isSavingAdd ? "opacity-60 cursor-not-allowed" : "hover:bg-orange-600"}`}
                                >
                                    {isSavingAdd ? "Saving.." : "Save"}
                                </button>
                                <div onClick={() => {
                                    resetForm();
                                    setOpenAddModal(false)
                                    setValidationErrors({})
                                }} type="submit" className="bg-gray-200 hover:bg-gray-300 text-xs px-4 py-2 rounded cursor-pointer">Cancel</div>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </AnimatePresence>
        )}

        {openEditModal && (
            <AnimatePresence>
                <motion.div 
                role="alert"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }} 
                className="fixed inset-0 flex items-center justify-center bg-black/10 z-50">
                    <div className="relative bg-white p-6 rounded-lg shadow-lg min-w-96 w-[800px]">
                        <div className=" flex items-center justify-between mb-4">
                            <p className="text-xs">Add New Event</p>
                            <X onClick={() => {
                                    resetForm();
                                    setOpenEditModal(false)
                                    setValidationErrors({});
                                }} className="absolute top-4 right-4 cursor-pointer" size={20} />
                        </div>
                        <form className="flex flex-col gap-4" encType="multipart/form-data" onSubmit={handleEditEventSubmit}>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs">Title <span className="text-xs text-red-500">*</span></label>
                                <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" className="placeholder:text-[11px] px-4 py-2 rounded border border-gray-200 text-xs" placeholder="Project Title" />
                                {validationErrors.title && (
                                    <p className="text-red-500 text-xs">{validationErrors.title[0]}</p>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs">Description <span className="text-xs text-red-500">*</span></label>
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="placeholder:text-[11px] px-4 py-2 rounded border border-gray-200 text-xs" placeholder="Project Description"></textarea>
                                {validationErrors.description && (
                                    <p className="text-red-500 text-xs">{validationErrors.description[0]}</p>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs">Location <span className="text-xs text-red-500">*</span></label>
                                <input value={location} onChange={(e) => setLocation(e.target.value)} type="text" className="placeholder:text-[11px] px-4 py-2 rounded border border-gray-200 text-xs" placeholder="Project Location" />
                                {validationErrors.location && (
                                    <p className="text-red-500 text-xs">{validationErrors.location[0]}</p>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs">Date <span className="text-xs text-red-500">*</span></label>
                                <input value={date} onChange={(e) => setDate(e.target.value)} type="date" className="placeholder:text-[11px] px-4 py-2 rounded border border-gray-200 text-xs" />
                                {validationErrors.date && (
                                    <p className="text-red-500 text-xs">{validationErrors.date[0]}</p>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs">Image</label>
                                <input
                                type="file"
                                onChange={(e) => setImage(e.target.files[0])}
                                className="placeholder:text-[11px] px-4 py-2 rounded border border-gray-200 text-xs"
                                />

                            </div>
                            <div className="flex items-center justify-end gap-2 mt-4">
                                <button
                                    type="submit"
                                    disabled={isSavingEdit}
                                    className={`bg-orange-500 text-white text-xs px-4 py-2 rounded ${isSavingEdit ? "opacity-60 cursor-not-allowed" : "hover:bg-orange-600"}`}
                                >
                                    {isSavingEdit ? "Saving.." : "Save"}
                                </button>
                                <div onClick={() => {
                                    resetForm();
                                    setOpenEditModal(false)
                                    setValidationErrors({});
                                }} type="submit" className="bg-gray-200 hover:bg-gray-300 text-xs px-4 py-2 rounded cursor-pointer">Cancel</div>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </AnimatePresence>
        )}

        {openImage && (
            <div onClick={() => setOpenImage(false)} className="fixed top-0 left-0 w-full h-screen bg-black/10 z-50 flex items-center justify-center">
                <div className="bg-white rounded h-[400px] max-h-[400px] w-auto min-w-[600px] max-w-[600px]">
                    <img src={`${baseURL}${viewImageURL}`} alt="img" className="w-full h-full rounded object-cover object-center obje"/>
                </div>
            </div>
        )}

        {isDeleteOpen && (
            <ConfirmationAlert 
            onClose={() => setIsDeleteOpen(false)} 
            onConfirm={() => handleDelete(deleteId)}
            title="Delete Project"
            message="Are you sure you want to delete this project? This action cannot be undone."
            isDelete={true}
            isDeleting={isDeleting}
            />
        )}
    </Admin>
    )
}

export default Events;
