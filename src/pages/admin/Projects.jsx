// import Admin from "../../layouts/Admin";
// import { useEffect, useState } from "react";
// import { X, Edit, Trash2 } from "lucide-react";
// import { _get, _post, _put, _delete } from "../../api";
// import { toast } from 'react-toastify';
// import { AnimatePresence, motion } from "framer-motion";
// import ConfirmationAlert from "../../components/alerts/ConfirmationAlert";
// import { useCallback } from "react";
// import debounce from "lodash.debounce";
// import CircularLoading from "../../components/CircularLoading";

// const Projects = () => {

//     const baseURL = "https://api.kalingangkababaihan.com/storage/";
//     // const baseURL = "http://127.0.0.1:8000/storage/";

//     const [projects, setProjects] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [currentTag, setCurrentTag] = useState("");
//     const [showAddProjectModal, setShowAddProjectModal] = useState(false);

//     const [tags, setTags] = useState([]);
//     const [title, setTitle] = useState("");
//     const [description, setDescription] = useState("");
//     const [location, setLocation] = useState("");
//     const [date, setDate] = useState("");
//     const [image, setImage] = useState(null);
//     const [isEvent, setIsEvent] = useState(false);

//     const [showEditProjectModal, setShowEditProjectModal] = useState(false);
//     const [toBeEditedProject, setToBeEditedProject] = useState(null);

//     const [openImage, setOpenImage] = useState(false);
//     const [viewImageURL, setViewImageURL] = useState("");

//     const [validationErrors, setValidationErrors] = useState({});

//     const handleOpenEditModal = (project) => {
//         setValidationErrors({});
//         if (project) {
//             setToBeEditedProject(project);
//             setTitle(project.title || "");
//             setDescription(project.description || "");  
//             setLocation(project.location || "");
//             setDate(project.date || "");
//             setImage(null);
//             setShowEditProjectModal(true);
//         }
//     }

//     useEffect(() => {
//         fetchProjects();
//     }, []);

//     const fetchProjects = async () => {
//         try {
//             const response = await _get("/projects"); 
//             const data = await response.data;
//             setProjects(data);
//         } catch (error) {
//             console.error('Error fetching projects:', error);
//         } finally {
//             setLoading(false);
//         }
//     }

//     const header = {
//         title: "Projects Management",
//         subTitle: "Easily manage your projects' information — create new entries, update project details, or remove completed or inactive projects."
//     };

//     const breadcrumbs = [
//         { name: "Projects", link: "/projects" }
//     ];

//     const handleAddTag = (tag) => {
//         if (tag && !tags.includes(tag)) {
//             setTags([...tags, tag]);
//         }
//         setCurrentTag("");
//     }

//     const clearForm = () => {
//         setTitle("");
//         setDescription("");
//         setLocation("");
//         setDate("");
//         setImage(null);
//         setTags([]);
//         setCurrentTag("");
//     }

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const formData = new FormData();
//         formData.append("title", title);
//         formData.append("description", description);
//         formData.append("location", location);
//         formData.append("date", date);
//         formData.append("is_event", isEvent ? '1' : '0');

//         if (image) {
//             formData.append("image", image);
//         }
//         tags.forEach(tag => formData.append("tags[]", tag));
//         console.log("Form Data:", formData);

//         try {
//             await _post("/projects", formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data"
//                 }
//             });

//             fetchProjects();
//             clearForm();
//             setShowAddProjectModal(false);
//             toast.success("Project added successfully!");
//             setValidationErrors({});
//         } catch (error) {
//             if (error.response && error.response.data && error.response.data.errors) {
//                 setValidationErrors(error.response.data.errors); // <- Set error messages
//             } else {
//                  toast.error("Error adding project. Please try again.");
//                 console.error('Error adding project:', error);
//             }
//         } finally 
//         {
//             setLoading(false);
//         }
//     }

//     const handleEditSubmit = async (e) => {
//         e.preventDefault();

//         const formData = new FormData();
//         formData.append("title", title);
//         formData.append("description", description);
//         formData.append("location", location);
//         formData.append("date", date);
//         formData.append("is_event", isEvent ? '1' : '0');
        
//         if (image) {
//             formData.append("image", image);
//         }
//         tags.forEach(tag => formData.append("tags[]", tag));
//         console.log("Form Data:", formData);

//         try {
//             await _post(`/projects/update/${toBeEditedProject.id}`, formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data"
//                 }
//             });

//             fetchProjects();
//             clearForm();
//             setShowEditProjectModal(false);
//             toast.success("Project updated successfully!");
//             setValidationErrors({});
//         } catch (error) {
//             toast.error("Error updating project. Please try again.");
//             console.error('Error updating project:', error);
//         } finally 
//         {
//             setLoading(false);
//         }
//     }

//     const handleViewImage = (image) => {
//         setViewImageURL(image);
//         setOpenImage(true);
//     }

//     const [isDeleteOpen, setIsDeleteOpen] = useState(false);
//     const [deleteId, setDeleteId] = useState(null);
//     const [isDeleting, setIsDeleting] = useState(false);

//     const handleConfirmDelete = (id) => {
//         setDeleteId(id);
//         setIsDeleteOpen(true);
//     }

//     const handleDelete = async () => {
//         setIsDeleting(true);
//         try {
//             await _delete(`/projects/${deleteId}`);
//             setProjects(projects.filter(project => project.id !== deleteId));
//             toast.success("Project deleted successfully!");
//         } catch (error) {
//             toast.error("Error deleting project. Please try again.");
//             console.error('Error deleting project:', error);
//         } finally {
//             setIsDeleting(false);
//             setIsDeleteOpen(false);
//         }
//     }
    
//     const handleSearch = useCallback(
//         debounce(async (search) => {
//             setLoading(true);
//             try {
//                 const response = await _get(`/projects/search?search=${search}`);
//                 setProjects(response.data);
//             } catch (error) {
//                 console.error("Error fetching data:", error);
//             } finally {
//                 setLoading(false);
//             }
//         }, 500), 
//         [] 
//     );


//     return (
//         <Admin header={header} breadcrumbs={breadcrumbs}>
//             <div className="w-full mx-auto flex flex-col gap-4 pb-4">
//                 <div className="flex items-center justify-between bg-white border-gray-100 p-3 rounded-lg">
//                     <div className="w-full min-w-80 max-w-[500px] flex items-center gap-4">
//                         <p className="text-xs">Search</p>
//                         <input 
//                             onChange={(e) => handleSearch(event.target.value)}
//                             type="text" 
//                             className="bg-white placeholder:text-xs px-4 py-2 rounded border border-gray-200 text-sm" 
//                             placeholder="Type something.." 
//                         />
//                     </div>
//                     <div className="flex items-center justify-end gap-2">
//                         <button onClick={() => setShowAddProjectModal(true)} className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-4 py-2 rounded">+ New</button>
//                     </div>
//                 </div>
//                 <table className="w-full border rounded-lg overflow-hidden shadow bg-white text-xs">
//                     <thead className="bg-orange-500 text-white">
//                     <tr>
//                         <th className="p-3 text-start">Title</th>
//                         <th className="p-3 text-start">Description</th>
//                         <th className="p-3 text-start">Location</th>
//                         <th className="p-3 text-start">Image</th>
//                         <th className="p-3 text-start">Date</th>
//                         <th className="p-3 text-end">Actions</th>
//                     </tr>
//                     </thead>
//                     {!loading && (
//                         <tbody>
//                             {projects.map((project, index) => (
//                                 <tr key={project.id} className={`${index % 2 === 0 ? "bg-orange-50" : ""}`}>
//                                     <td className="p-3">{project.title || ''}</td>
//                                     <td className="p-3">
//                                     {(project.description || '').length > 100
//                                         ? project.description.substring(0, 100) + '...'
//                                         : project.description || ''}
//                                     </td>
//                                     <td className="p-3">{project.location || ''}</td>
//                                     <td className="p-3">
//                                         <button onClick={() => handleViewImage(project.image)} className="text-[10px] px-2 py-1 bg-gray-200 rounded">View</button>
//                                     </td>
//                                     <td className="p-3">{project.date || ''}</td>
//                                     <td className="p-3 h-full flex items-center justify-end gap-2">
//                                         <button onClick={() => handleOpenEditModal(project)} className="bg-blue-50 text-blue-600 px-1 py-1 rounded"><Edit size={16} /></button>
//                                         <button onClick={() => handleConfirmDelete(project.id)} className="bg-red-50 text-red-600 px-1 py-1 rounded" ><Trash2 size={16} /></button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     )}
//                 </table>
//                 {loading && (
//                     <div className="w-full h-40 flex items-center justify-center">
//                         <CircularLoading customClass='w-full text-blue-500 w-6 h-6' />
//                     </div>
//                 )}
//             </div>

//             {showAddProjectModal && (
//                 <AnimatePresence>
//                     <motion.div 
//                     role="alert"
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }} 
//                     className="fixed inset-0 flex items-center justify-center bg-black/10 z-50">
//                         <div className="relative bg-white p-6 rounded-lg shadow-lg min-w-96 w-[800px]">
//                             <div className=" flex items-center justify-between mb-4">
//                                 <p className="text-xs">Add New Project</p>
//                                 <X onClick={() => {
//                                         clearForm();
//                                         setShowAddProjectModal(false)   
//                                         setValidationErrors({})
//                                     }} className="absolute top-4 right-4 cursor-pointer" size={20} />
//                             </div>
//                             <form className="flex flex-col gap-4" encType="multipart/form-data" onSubmit={handleSubmit}>
//                                 <div className="w-full flex items-center justify-start gap-2">
//                                     <input
//                                         type="checkbox"
//                                         id="isEvent"
//                                         checked={isEvent}
//                                         onChange={(e) => setIsEvent(e.target.checked)}
//                                         className=" text-orange-500 border-gray-300 rounded focus:ring-orange-500"
//                                     />
//                                     <label htmlFor="isEvent" className="w-full text-xs">Is this an event?</label>
//                                 </div>

//                                 <div className="flex flex-col gap-2">
//                                     <label className="text-xs">Title <span className="text-xs text-red-500">*</span></label>
//                                     <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" className="placeholder:text-[11px] px-4 py-2 rounded border border-gray-200 text-xs" placeholder="Project Title" />
//                                     {validationErrors.title && (
//                                         <p className="text-red-500 text-xs">{validationErrors.title[0]}</p>
//                                     )}
//                                 </div>
//                                 <div className="flex flex-col gap-2">
//                                     <label className="text-xs">Description <span className="text-xs text-red-500">*</span></label>
//                                     <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="placeholder:text-[11px] px-4 py-2 rounded border border-gray-200 text-xs" placeholder="Project Description"></textarea>
//                                     {validationErrors.description && (
//                                         <p className="text-red-500 text-xs">{validationErrors.description[0]}</p>
//                                     )}
//                                 </div>
//                                 <div className="flex flex-col gap-2">
//                                     <label className="text-xs">Location <span className="text-xs text-red-500">*</span></label>
//                                     <input value={location} onChange={(e) => setLocation(e.target.value)} type="text" className="placeholder:text-[11px] px-4 py-2 rounded border border-gray-200 text-xs" placeholder="Project Location" />
//                                     {validationErrors.location && (
//                                         <p className="text-red-500 text-xs">{validationErrors.location[0]}</p>
//                                     )}
//                                 </div>
//                                 <div className="flex flex-col gap-2">
//                                     <label className="text-xs">Date <span className="text-xs text-red-500">*</span></label>
//                                     <input value={date} onChange={(e) => setDate(e.target.value)} type="date" className="placeholder:text-[11px] px-4 py-2 rounded border border-gray-200 text-xs" />
//                                     {validationErrors.date && (
//                                         <p className="text-red-500 text-xs">{validationErrors.date[0]}</p>
//                                     )}
//                                 </div>
//                                 <div className="flex flex-col gap-2">
//                                     <label className="text-xs">Image</label>
//                                     <input
//                                     type="file"
//                                     onChange={(e) => setImage(e.target.files[0])}
//                                     className="placeholder:text-[11px] px-4 py-2 rounded border border-gray-200 text-xs"
//                                     />

//                                 </div>
//                                 {/* <div>
//                                     <label className="text-xs">Tags</label>
//                                     <div className="w-fit flex items-center gap-2">
//                                         <input value={currentTag} onChange={(e) => setCurrentTag(e.target.value)} type="text" className="w-64 min-w-64 placeholder:text-[11px] px-4 py-2 rounded border border-gray-200 text-xs" placeholder="Tags.." />
//                                         <div onClick={() => handleAddTag(currentTag)} className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-4 py-2 rounded">Add</div>
//                                     </div>
//                                     <div className="flex items-center flex-wrap gap-2 mt-2">
//                                         {tags.map((tag, index) => (
//                                             <span key={index} className=" text-[10px] px-2 py-1 pr-0 rounded flex items-center gap-1">
//                                                 <span className="text-blue-600">#{tag}</span>
//                                                 <button type="button" className="text-red-500 bg-transparent border-0" onClick={() => setTags(tags.filter(t => t !== tag))}>
//                                                     <X size={12} />
//                                                 </button>
//                                             </span>
//                                         ))}
//                                     </div>
//                                 </div> */}
//                                 <div className="flex items-center justify-end gap-2 mt-4">
//                                     <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-4 py-2 rounded">Save</button>
//                                     <div onClick={() => {
//                                         clearForm();
//                                         setShowAddProjectModal(false)
//                                         setValidationErrors({})
//                                     }} type="submit" className="bg-gray-200 hover:bg-gray-300 text-xs px-4 py-2 rounded cursor-pointer">Cancel</div>
//                                 </div>
//                             </form>
//                         </div>
//                     </motion.div>
//                 </AnimatePresence>
//             )}

//             {showEditProjectModal && (
//                 <AnimatePresence>
//                     <motion.div 
//                     role="alert"
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }} 
//                     className="fixed inset-0 flex items-center justify-center bg-black/10 z-50">
//                         <div className="relative bg-white p-6 rounded-lg shadow-lg min-w-96 w-[800px]">
//                             <div className=" flex items-center justify-between mb-4">
//                                 <p className="text-xs">Add New Project</p>
//                                 <X  onClick={() => {
//                                         clearForm();
//                                         setShowEditProjectModal(false)
//                                         setValidationErrors({})
//                                     }} 
//                                     className="absolute top-4 right-4 cursor-pointer" size={20} />
//                             </div>
//                             <form className="flex flex-col gap-4" encType="multipart/form-data" onSubmit={handleEditSubmit}>
//                                 <div className="w-full flex items-center justify-start gap-2">
//                                     <input
//                                         type="checkbox"
//                                         id="isEvent"
//                                         checked={isEvent}
//                                         onChange={(e) => setIsEvent(e.target.checked)}
//                                         className=" text-orange-500 border-gray-300 rounded focus:ring-orange-500"
//                                     />
//                                     <label htmlFor="isEvent" className="w-full text-xs">Is this an event?</label>
//                                 </div>
//                                 <div className="flex flex-col gap-2">
//                                     <label className="text-xs">Title <span className="text-xs text-red-500">*</span></label>
//                                     <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" className="placeholder:text-[11px] px-4 py-2 rounded border border-gray-200 text-xs" placeholder="Project Title" />
//                                     {validationErrors.title && (
//                                         <p className="text-red-500 text-xs">{validationErrors.title[0]}</p>
//                                     )}
//                                 </div>
//                                 <div className="flex flex-col gap-2">
//                                     <label className="text-xs">Description <span className="text-xs text-red-500">*</span></label>
//                                     <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="placeholder:text-[11px] px-4 py-2 rounded border border-gray-200 text-xs" placeholder="Project Description"></textarea>
//                                     {validationErrors.description && (
//                                         <p className="text-red-500 text-xs">{validationErrors.description[0]}</p>
//                                     )}
//                                 </div>
//                                 <div className="flex flex-col gap-2">
//                                     <label className="text-xs">Location <span className="text-xs text-red-500">*</span></label>
//                                     <input value={location} onChange={(e) => setLocation(e.target.value)} type="text" className="placeholder:text-[11px] px-4 py-2 rounded border border-gray-200 text-xs" placeholder="Project Location" />
//                                     {validationErrors.location && (
//                                         <p className="text-red-500 text-xs">{validationErrors.location[0]}</p>
//                                     )}
//                                 </div>
//                                 <div className="flex flex-col gap-2">
//                                     <label className="text-xs">Date <span className="text-xs text-red-500">*</span></label>
//                                     <input value={date} onChange={(e) => setDate(e.target.value)} type="date" className="placeholder:text-[11px] px-4 py-2 rounded border border-gray-200 text-xs" />
//                                     {validationErrors.date && (
//                                         <p className="text-red-500 text-xs">{validationErrors.date[0]}</p>
//                                     )}
//                                 </div>
//                                 <div className="flex flex-col gap-2">
//                                     <label className="text-xs">Image</label>
//                                     <input
//                                     type="file"
//                                     onChange={(e) => setImage(e.target.files[0])}
//                                     className="placeholder:text-[11px] px-4 py-2 rounded border border-gray-200 text-xs"
//                                     />

//                                 </div>
//                                 {/* <div>
//                                     <label className="text-xs">Tags</label>
//                                     <div className="w-fit flex items-center gap-2">
//                                         <input value={currentTag} onChange={(e) => setCurrentTag(e.target.value)} type="text" className="w-64 min-w-64 placeholder:text-[11px] px-4 py-2 rounded border border-gray-200 text-xs" placeholder="Tags.." />
//                                         <div onClick={() => handleAddTag(currentTag)} className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-4 py-2 rounded">Add</div>
//                                     </div>
//                                     <div className="flex items-center flex-wrap gap-2 mt-2">
//                                         {tags.map((tag, index) => (
//                                             <span key={index} className=" text-[10px] px-2 py-1 pr-0 rounded flex items-center gap-1">
//                                                 <span className="text-blue-600">#{tag}</span>
//                                                 <button type="button" className="text-red-500 bg-transparent border-0" onClick={() => setTags(tags.filter(t => t !== tag))}>
//                                                     <X size={12} />
//                                                 </button>
//                                             </span>
//                                         ))}
//                                     </div>
//                                 </div> */}
//                                 <div className="flex items-center justify-end gap-2 mt-4">
//                                     <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-4 py-2 rounded">Save</button>
//                                     <div onClick={() => {
//                                         clearForm();
//                                         setShowEditProjectModal(false)
//                                         setValidationErrors({})
//                                     }} className="bg-gray-200 hover:bg-gray-300 text-xs px-4 py-2 rounded cursor-pointer">Cancel</div>
//                                 </div>
//                             </form>
//                         </div>
//                     </motion.div>
//                 </AnimatePresence>
//             )}

//             {openImage && (
//                 <div onClick={() => setOpenImage(false)} className="fixed top-0 left-0 w-full h-screen bg-black/10 z-50 flex items-center justify-center">
//                     <div className="bg-white rounded h-[400px] max-h-[400px] w-auto min-w-[600px] max-w-[600px]">
//                         <img src={`${baseURL}${viewImageURL}`} alt="img" className="w-full h-full rounded object-cover object-center obje"/>
//                     </div>
//                 </div>
//             )}
            
//             {isDeleteOpen && (
//                 <ConfirmationAlert 
//                 onClose={() => setIsDeleteOpen(false)} 
//                 onConfirm={() => handleDelete(deleteId)}
//                 title="Delete Project"
//                 message="Are you sure you want to delete this project? This action cannot be undone."
//                 isDelete={true}
//                 isDeleting={isDeleting}
//                 />
//             )}


//         </Admin>
//     )
// }

// export default Projects;


import Admin from "../../layouts/Admin";
import { useEffect, useState, useCallback } from "react";
import { X, Edit, Trash2 } from "lucide-react";
import { _get, _post, _put, _delete } from "../../api";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import ConfirmationAlert from "../../components/alerts/ConfirmationAlert";
import debounce from "lodash.debounce";
import CircularLoading from "../../components/CircularLoading";

const Projects = () => {
    const baseURL = "https://api.kalingangkababaihan.com/storage/";

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [image, setImage] = useState(null);
    const [isEvent, setIsEvent] = useState(false);

    const [showAddProjectModal, setShowAddProjectModal] = useState(false);
    const [showEditProjectModal, setShowEditProjectModal] = useState(false);
    const [toBeEditedProject, setToBeEditedProject] = useState(null);

    const [validationErrors, setValidationErrors] = useState({});

    const [openImage, setOpenImage] = useState(false);
    const [viewImageURL, setViewImageURL] = useState("");

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // FETCH PROJECTS
    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await _get("/projects");
            setProjects(response.data);
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            setLoading(false);
        }
    };

    const header = {
        title: "Projects Management",
        subTitle:
            "Easily manage your projects' information — create new entries, update project details, or remove completed or inactive projects.",
    };

    const breadcrumbs = [{ name: "Projects", link: "/projects" }];

    const clearForm = () => {
        setTitle("");
        setDescription("");
        setLocation("");
        setDate("");
        setImage(null);
        setIsEvent(false);
    };

    const handleOpenEditModal = (project) => {
        clearForm();
        setValidationErrors({});

        setToBeEditedProject(project);
        setTitle(project.title || "");
        setDescription(project.description || "");
        setLocation(project.location || "");
        setDate(project.date || "");
        setIsEvent(project.is_event == 1);
        setShowEditProjectModal(true);
    };

    const handleViewImage = (image) => {
        setViewImageURL(image);
        setOpenImage(true);
    };

    // SEARCH — Debounced
    const handleSearch = useCallback(
        debounce(async (searchValue) => {
            setLoading(true);
            try {
                const response = await _get(`/projects/search?search=${searchValue}`);
                setProjects(response.data);
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setLoading(false);
            }
        }, 500),
        []
    );

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("location", location);
        formData.append("date", date);
        formData.append("is_event", isEvent ? "1" : "0");

        if (image) formData.append("image", image);

        try {
            await _post("/projects", formData);
            fetchProjects();
            clearForm();
            setShowAddProjectModal(false);
            toast.success("Project added successfully!");
            setValidationErrors({});
        } catch (error) {
            if (error.response?.data?.errors) {
                setValidationErrors(error.response.data.errors);
            } else {
                toast.error("Error adding project.");
            }
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append("title", title);
        formData.append("description", description);
        formData.append("location", location);
        formData.append("date", date);
        formData.append("is_event", isEvent ? "1" : "0");

        if (image) formData.append("image", image);

        try {
            await _post(`/projects/update/${toBeEditedProject.id}`, formData);
            fetchProjects();
            clearForm();
            setShowEditProjectModal(false);
            toast.success("Project updated successfully!");
        } catch (error) {
            toast.error("Error updating project.");
        }
    };

    const handleConfirmDelete = (id) => {
        setDeleteId(id);
        setIsDeleteOpen(true);
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await _delete(`/projects/${deleteId}`);
            toast.success("Project deleted successfully!");
            setProjects(projects.filter((p) => p.id !== deleteId));
        } catch (error) {
            toast.error("Error deleting project.");
        } finally {
            setIsDeleteOpen(false);
            setIsDeleting(false);
        }
    };

    return (
        <Admin header={header} breadcrumbs={breadcrumbs}>
            {/* SEARCH + NEW BUTTON */}
            <div className="w-full flex flex-col lg:flex-row items-center justify-between bg-white p-3 mt-4 rounded-lg gap-3">
                <div className="w-full flex items-center gap-3">
                    <p className="text-xs whitespace-nowrap">Search</p>
                    <input
                        onChange={(e) => handleSearch(e.target.value)}
                        type="text"
                        className="w-full bg-white placeholder:text-xs px-4 py-2 rounded border border-gray-200 text-sm"
                        placeholder="Type something..."
                    />
                </div>

                <button
                    onClick={() => setShowAddProjectModal(true)}
                    className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-4 py-2 rounded w-full sm:w-auto flex items-center gap-2 justify-center"
                >
                    <span>+</span>
                    <span>New</span>
                </button>
            </div>

            {/* TABLE */}
            <div className="w-full overflow-x-auto rounded-lg shadow bg-white mt-4">
                <table className="min-w-[900px] w-full text-xs">
                    <thead className="bg-orange-500 text-white">
                        <tr>
                            <th className="p-3">Title</th>
                            <th className="p-3">Description</th>
                            <th className="p-3">Location</th>
                            <th className="p-3">Image</th>
                            <th className="p-3">Date</th>
                            <th className="p-3 text-end">Actions</th>
                        </tr>
                    </thead>

                    {!loading && (
                        <tbody>
                            {projects.map((project, index) => (
                                <tr
                                    key={project.id}
                                    className={`${index % 2 === 0 ? "bg-orange-50" : ""}`}
                                >
                                    <td className="p-3">{project.title}</td>
                                    <td className="p-3">
                                        {(project.description || "").length > 100
                                            ? project.description.substring(0, 100) + "..."
                                            : project.description}
                                    </td>
                                    <td className="p-3">{project.location}</td>
                                    <td className="p-3">
                                        <button
                                            onClick={() => handleViewImage(project.image)}
                                            className="text-[10px] px-2 py-1 bg-gray-200 rounded"
                                        >
                                            View
                                        </button>
                                    </td>
                                    <td className="p-3">{project.date}</td>
                                    <td className="p-3 flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleOpenEditModal(project)}
                                            className="bg-blue-50 text-blue-600 px-1 py-1 rounded"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleConfirmDelete(project.id)}
                                            className="bg-red-50 text-red-600 px-1 py-1 rounded"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    )}
                </table>

                {loading && (
                    <div className="w-full h-40 flex items-center justify-center">
                        <CircularLoading customClass="text-blue-500 w-6 h-6" />
                    </div>
                )}
            </div>

            {/* ADD PROJECT MODAL */}
            {showAddProjectModal && (
                <AnimatePresence>
                    <motion.div
                        className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="bg-white w-full max-w-[95%] sm:max-w-[600px] md:max-w-[800px] p-6 rounded-lg shadow relative">
                            <X
                                onClick={() => {
                                    clearForm();
                                    setShowAddProjectModal(false);
                                    setValidationErrors({});
                                }}
                                className="absolute top-4 right-4 cursor-pointer"
                            />

                            <p className="text-xs mb-4">Add New Project</p>

                            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="isEvent"
                                        checked={isEvent}
                                        onChange={(e) => setIsEvent(e.target.checked)}
                                        className="bg-white border-gray-300 rounded"
                                    />
                                    <label className="text-xs">Is this an event?</label>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-xs">Title *</label>
                                    <input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="bg-white border px-3 py-2 text-xs rounded"
                                        placeholder="Project Title"
                                    />
                                    {validationErrors.title && (
                                        <p className="text-xs text-red-500">
                                            {validationErrors.title[0]}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-xs">Description *</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="bg-white border px-3 py-2 text-xs rounded"
                                        placeholder="Project Description"
                                    />
                                    {validationErrors.description && (
                                        <p className="text-xs text-red-500">
                                            {validationErrors.description[0]}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-xs">Location *</label>
                                    <input
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="bg-white border px-3 py-2 text-xs rounded"
                                        placeholder="Project Location"
                                    />
                                    {validationErrors.location && (
                                        <p className="text-xs text-red-500">
                                            {validationErrors.location[0]}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-xs">Date *</label>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="bg-white border px-3 py-2 text-xs rounded"
                                    />
                                    {validationErrors.date && (
                                        <p className="text-xs text-red-500">
                                            {validationErrors.date[0]}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-xs">Image</label>
                                    <input
                                        type="file"
                                        onChange={(e) => setImage(e.target.files[0])}
                                        className="bg-white border px-3 py-2 text-xs rounded"
                                    />
                                </div>

                                <div className="flex justify-end gap-2 mt-3">
                                    <button
                                        type="submit"
                                        className="bg-orange-500 text-white px-4 py-2 text-xs rounded"
                                    >
                                        Save
                                    </button>
                                    <div
                                        onClick={() => {
                                            clearForm();
                                            setShowAddProjectModal(false);
                                            setValidationErrors({});
                                        }}
                                        className="bg-gray-200 px-4 py-2 text-xs rounded cursor-pointer"
                                    >
                                        Cancel
                                    </div>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </AnimatePresence>
            )}

            {/* EDIT PROJECT MODAL */}
            {showEditProjectModal && (
                <AnimatePresence>
                    <motion.div
                        className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="bg-white w-full max-w-[95%] sm:max-w-[600px] md:max-w-[800px] p-6 rounded-lg shadow relative">
                            <X
                                onClick={() => {
                                    clearForm();
                                    setShowEditProjectModal(false);
                                    setValidationErrors({});
                                }}
                                className="absolute top-4 right-4 cursor-pointer"
                            />

                            <p className="text-xs mb-4">Edit Project</p>

                            <form className="flex flex-col gap-4" onSubmit={handleEditSubmit}>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="isEvent"
                                        checked={isEvent}
                                        onChange={(e) => setIsEvent(e.target.checked)}
                                        className="bg-white border-gray-300 rounded"
                                    />
                                    <label className="text-xs">Is this an event?</label>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-xs">Title *</label>
                                    <input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="bg-white border px-3 py-2 text-xs rounded"
                                        placeholder="Project Title"
                                    />
                                    {validationErrors.title && (
                                        <p className="text-xs text-red-500">
                                            {validationErrors.title[0]}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-xs">Description *</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="bg-white border px-3 py-2 text-xs rounded"
                                        placeholder="Project Description"
                                    />
                                    {validationErrors.description && (
                                        <p className="text-xs text-red-500">
                                            {validationErrors.description[0]}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-xs">Location *</label>
                                    <input
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="bg-white border px-3 py-2 text-xs rounded"
                                        placeholder="Project Location"
                                    />
                                    {validationErrors.location && (
                                        <p className="text-xs text-red-500">
                                            {validationErrors.location[0]}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-xs">Date *</label>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="bg-white border px-3 py-2 text-xs rounded"
                                    />
                                    {validationErrors.date && (
                                        <p className="text-xs text-red-500">
                                            {validationErrors.date[0]}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-xs">Image</label>
                                    <input
                                        type="file"
                                        onChange={(e) => setImage(e.target.files[0])}
                                        className="bg-white border px-3 py-2 text-xs rounded"
                                    />
                                </div>

                                <div className="flex justify-end gap-2 mt-3">
                                    <button
                                        type="submit"
                                        className="bg-orange-500 text-white px-4 py-2 text-xs rounded"
                                    >
                                        Save
                                    </button>
                                    <div
                                        onClick={() => {
                                            clearForm();
                                            setShowEditProjectModal(false);
                                            setValidationErrors({});
                                        }}
                                        className="bg-gray-200 px-4 py-2 text-xs rounded cursor-pointer"
                                    >
                                        Cancel
                                    </div>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </AnimatePresence>
            )}

            {/* IMAGE VIEWER */}
            {openImage && (
                <div
                    onClick={() => setOpenImage(false)}
                    className="fixed inset-0 bg-black/10 flex items-center justify-center z-50 p-4"
                >
                    <div className="bg-white rounded w-full max-w-[600px] max-h-[80vh]">
                        <img
                            src={`${baseURL}${viewImageURL}`}
                            alt="img"
                            className="w-full h-full object-contain rounded"
                        />
                    </div>
                </div>
            )}

            {/* DELETE CONFIRMATION */}
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
    );
};

export default Projects;
