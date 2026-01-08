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
import { _get, _post, _delete } from "../../api";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import ConfirmationAlert from "../../components/alerts/ConfirmationAlert";
import debounce from "lodash.debounce";
import CircularLoading from "../../components/CircularLoading";
import ModalContainer from "../../components/ModalContainer";
import VolunteerListPerProject from "../../components/VolunteerListPerProject";

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
    const [isSavingProject, setIsSavingProject] = useState(false);
    const [isUpdatingProject, setIsUpdatingProject] = useState(false);

    // Liquidation
    const [isLiquidateOpen, setIsLiquidateOpen] = useState(false);
    const [liquidateProject, setLiquidateProject] = useState(null);
    const [inventoryItems, setInventoryItems] = useState([]);
    const [inventoryLoading, setInventoryLoading] = useState(false);
    const [itemSearch, setItemSearch] = useState("");
    const [itemCategory, setItemCategory] = useState("");
    const [itemSubCategory, setItemSubCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [savingLiquidation, setSavingLiquidation] = useState(false);
    const [existingResourcesLoading, setExistingResourcesLoading] = useState(false);

    const generateUid = () => `uid-${Date.now()}-${Math.random().toString(16).slice(2)}`;

    const formatAddedOn = (value) => {
        if (!value) return "";
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return value;
        return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    };

    const totalUsedForItem = (itemId, excludeUid = null, items = selectedItems, includeExisting = false) =>
        items.reduce((sum, item) => {
            if (item.id !== itemId) return sum;
            if (excludeUid && item.uid === excludeUid) return sum;
            if (!includeExisting && item.isExisting) return sum;
            return sum + Number(item.usedQuantity || 0);
        }, 0);

    const getRemainingQuantity = (item) => {
        const available = Number(item.quantity) || 0;
        const used = totalUsedForItem(item.id);
        const remaining = available - used;
        return remaining > 0 ? remaining : 0;
    };

    // FETCH PROJECTS
    useEffect(() => {
        fetchProjects();
        fetchCategories();
    }, []);

    useEffect(() => {
        if (isLiquidateOpen) {
            fetchInventoryItems({ search: "", categoryId: "", subCategoryId: "" });
        }
    }, [isLiquidateOpen]);

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
        setIsSavingProject(true);

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
        } finally {
            setIsSavingProject(false);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setIsUpdatingProject(true);
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
            console.error("Error updating project:", error);
            toast.error("Error updating project.");
        } finally {
            setIsUpdatingProject(false);
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
            console.error("Error deleting project:", error);
            toast.error("Error deleting project.");
        } finally {
            setIsDeleteOpen(false);
            setIsDeleting(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await _get(`/goods-donation-categories`);
            setCategories(response.data.categories || []);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchInventoryItems = async ({
        search = itemSearch,
        categoryId = itemCategory,
        subCategoryId = itemSubCategory,
    } = {}) => {
        setInventoryLoading(true);
        try {
            const params = {};
            if (search) params.search = search;
            if (categoryId) params.category = categoryId;
            if (subCategoryId) params.sub_category = subCategoryId;

            const response = await _get("/items", { params });
            if (response.data && response.status === 200) {
                const fetched = response.data.items || [];
                const filtered = fetched.filter(
                    (item) => Number(item.quantity) > 0 && item.status === "available"
                );
                setInventoryItems(filtered);
            }
        } catch (error) {
            console.error("Error fetching items:", error);
        } finally {
            setInventoryLoading(false);
        }
    };

    const fetchProjectResources = async (projectId) => {
        setExistingResourcesLoading(true);
        try {
            const response = await _get(`/projects/${projectId}/resources`);
            const resources = response.data?.items || response.data?.resources || response.data || [];
            const mapped = resources
                .map((res) => {
                    const itemData = res.item || {};
                    const id = res.item_id || res.id || itemData.id;
                    if (!id) return null;
                    return {
                        id,
                        uid: generateUid(),
                        name: res.name || res.item_name || itemData.name || "",
                        category_name: res.category_name || itemData.category_name || res.category?.name || "",
                        sub_category_name: res.sub_category_name || itemData.sub_category_name || res.subcategory?.name || "",
                        quantity: res.available_quantity ?? itemData.quantity ?? res.quantity ?? 0,
                        unit: res.unit || itemData.unit || "",
                        notes: res.notes || itemData.notes || "",
                        status: res.status || itemData.status || "available",
                        usedQuantity: Number(res.quantity_used || res.used_quantity || res.quantity || 1) || 1,
                        isExisting: true,
                        addedOn: res.created_at || res.added_at || itemData.created_at || "",
                    };
                })
                .filter(Boolean);
            setSelectedItems(mapped);
        } catch (error) {
            console.error("Error fetching project resources:", error);
            setSelectedItems([]);
        } finally {
            setExistingResourcesLoading(false);
        }
    };

    const openLiquidateModal = async (project) => {
        setLiquidateProject(project);
        setIsLiquidateOpen(true);
        setItemSearch("");
        setItemCategory("");
        setItemSubCategory("");
        await fetchProjectResources(project.id);
        fetchInventoryItems({ search: "", categoryId: "", subCategoryId: "" });
    };

    const closeLiquidateModal = () => {
        setIsLiquidateOpen(false);
        setLiquidateProject(null);
        setSelectedItems([]);
    };

    const handleItemSearchChange = (value) => {
        setItemSearch(value);
        fetchInventoryItems({ search: value, categoryId: itemCategory, subCategoryId: itemSubCategory });
    };

    const handleItemCategoryChange = (value) => {
        setItemCategory(value);
        const resetSub = "";
        setItemSubCategory(resetSub);
        fetchInventoryItems({ search: itemSearch, categoryId: value, subCategoryId: resetSub });
    };

    const handleItemSubCategoryChange = (value) => {
        setItemSubCategory(value);
        fetchInventoryItems({ search: itemSearch, categoryId: itemCategory, subCategoryId: value });
    };

    const handleSelectItem = (item) => {
        const remaining = getRemainingQuantity(item);
        if (remaining <= 0) {
            toast.warn("No remaining quantity for this item.");
            return;
        }

        const defaultQty = remaining < 1 ? remaining : 1;
        setSelectedItems((prev) => [
            ...prev,
            {
                ...item,
                uid: generateUid(),
                usedQuantity: defaultQty,
                isExisting: false,
                addedOn: new Date().toISOString(),
            },
        ]);
    };

    const handleQuantityChange = (itemUid, value) => {
        if (value === "") {
            setSelectedItems((prev) =>
                prev.map((i) => (i.uid === itemUid ? { ...i, usedQuantity: "" } : i))
            );
            return;
        }

        const numericValue = Number(value);
        if (Number.isNaN(numericValue)) return;

        setSelectedItems((prev) =>
            prev.map((i) => {
                if (i.uid !== itemUid) return i;

                const available = Number(i.quantity) || 0;
                const usedByOthers = prev.reduce((sum, current) => {
                    if (current.id === i.id && current.uid !== itemUid && !current.isExisting) {
                        return sum + Number(current.usedQuantity || 0);
                    }
                    return sum;
                }, 0);

                const allowed = Math.max(available - usedByOthers, 0);
                const safeValue = allowed === 0 ? 0 : Math.max(1, Math.min(allowed, numericValue));

                return { ...i, usedQuantity: safeValue };
            })
        );
    };

    const handleRemoveSelectedItem = (itemUid) => {
        setSelectedItems((prev) => prev.filter((i) => i.uid !== itemUid));
    };

    const submitLiquidation = async () => {
        if (!liquidateProject) return;
        if (selectedItems.length === 0) {
            toast.warn("Select at least one item to liquidate.");
            return;
        }

        const payload = {
            items: selectedItems
                .filter((item) => !item.isExisting)
                .map((item) => ({
                    item_id: item.id,
                    quantity: Number(item.usedQuantity) > 0 ? Number(item.usedQuantity) : 1,
                })),
        };

        setSavingLiquidation(true);
        try {
            await _post(`/projects/${liquidateProject.id}/liquidate`, payload);
            toast.success("Liquidation saved.");
            closeLiquidateModal();
            fetchProjects();
        } catch (error) {
            console.error("Error saving liquidation:", error);
            toast.error("Error saving liquidation.");
        } finally {
            setSavingLiquidation(false);
        }
    };

    const subCategoryOptions = itemCategory
        ? categories.find((cat) => `${cat.id}` === `${itemCategory}`)?.subcategories || []
        : categories.flatMap((cat) => cat.subcategories || []);

    const [openVolunteerList, setOpenVolunteerList] = useState(false);
    const [projectId, setProjectId] = useState(null);

    const handleOpenVolunteerList = (projectId) => {
        setOpenVolunteerList(true);
        setProjectId(projectId);
    }

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
                            <th className="p-3">Volunteers</th>
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
                                    <td className="p-3">
                                        <button
                                            onClick={() => handleOpenVolunteerList(project.id)}
                                            className="text-[10px] px-2 py-1 bg-gray-200 rounded"
                                        >
                                            View
                                        </button>
                                    </td>
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
                                        <button
                                            onClick={() => openLiquidateModal(project)}
                                            className="bg-green-500 text-white px-2 text-xs py-1 rounded"
                                        >
                                            Liquidate
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

            {/* LIQUIDATE MODAL */}
            {isLiquidateOpen && (
                <ModalContainer isFull={true} close={closeLiquidateModal}>
                    <div className="w-full flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 w-full">
                            <div>
                                <p className="text-lg font-semibold text-orange-600">Liquidate Items</p>
                                <p className="text-xs text-gray-500">
                                    {liquidateProject?.title ? `For project: ${liquidateProject.title}` : "Select the items used for this project."}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={closeLiquidateModal}
                                    className="text-xs px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={submitLiquidation}
                                    disabled={savingLiquidation || selectedItems.length === 0}
                                    className={`text-xs px-4 py-2 rounded text-white ${savingLiquidation || selectedItems.length === 0 ? "bg-green-300 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
                                >
                                    {savingLiquidation ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 h-[70vh]">
                            <div className="flex flex-col gap-3 border rounded-lg p-3 overflow-hidden">
                                <div className="flex flex-wrap gap-2">
                                    <input
                                        value={itemSearch}
                                        onChange={(e) => handleItemSearchChange(e.target.value)}
                                        type="text"
                                        className="w-full md:flex-1 bg-white placeholder:text-xs px-4 py-2 rounded border border-gray-200 text-sm"
                                        placeholder="Search items..."
                                    />
                                    <select
                                        value={itemCategory}
                                        onChange={(e) => handleItemCategoryChange(e.target.value)}
                                        className="bg-white text-xs px-3 py-2 rounded border border-gray-200"
                                    >
                                        <option value="">All categories</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        value={itemSubCategory}
                                        onChange={(e) => handleItemSubCategoryChange(e.target.value)}
                                        className="bg-white text-xs px-3 py-2 rounded border border-gray-200"
                                    >
                                        <option value="">All subcategories</option>
                                        {subCategoryOptions.map((sub) => (
                                            <option key={sub.id} value={sub.id}>
                                                {sub.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex-1 overflow-y-auto border rounded p-2 bg-gray-50/50">
                                    {inventoryLoading || existingResourcesLoading ? (
                                        <div className="w-full h-full flex items-center justify-center py-8">
                                            <CircularLoading customClass="text-blue-500 w-6 h-6" />
                                        </div>
                                    ) : inventoryItems.length === 0 ? (
                                        <p className="text-xs text-center text-gray-500 py-6">No items found.</p>
                                    ) : (
                                        <div className="flex flex-col gap-2">
                                            {inventoryItems.map((item) => {
                                                const remaining = getRemainingQuantity(item);
                                                const isMaxedOut = remaining <= 0;
                                                return (
                                                    <div
                                                        key={item.id}
                                                        className="flex items-start justify-between gap-3 bg-white border rounded p-2"
                                                    >
                                                        <div className="flex-1 flex flex-col gap-1">
                                                            <p className="text-sm font-medium">{item.name}</p>
                                                            <p className="text-[11px] text-gray-600">
                                                                {item.category_name} {item.sub_category_name ? `• ${item.sub_category_name}` : ""}
                                                            </p>
                                                            <p className="text-[11px] text-gray-500">
                                                                Available: {item.quantity} {item.unit || ""}
                                                            </p>
                                                            <p className="text-[11px] text-gray-500">
                                                                Remaining after selection: {remaining} {item.unit || ""}
                                                            </p>
                                                            {item.notes && (
                                                                <p className="text-[11px] text-gray-500">Notes: {item.notes}</p>
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={() => handleSelectItem(item)}
                                                            disabled={isMaxedOut}
                                                            className={`text-xs px-3 py-1 rounded ${
                                                                isMaxedOut
                                                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                                    : "bg-orange-500 text-white hover:bg-orange-600"
                                                            }`}
                                                        >
                                                            {isMaxedOut ? "Maxed" : "Add"}
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 border rounded-lg p-3 overflow-hidden">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-semibold">Selected Items</p>
                                    <p className="text-[11px] text-gray-500">{selectedItems.length} item(s)</p>
                                </div>

                                <div className="flex-1 overflow-y-auto border rounded p-2 bg-gray-50/50">
                                    {selectedItems.length === 0 ? (
                                        <p className="text-xs text-center text-gray-500 py-6">
                                            No items selected yet.
                                        </p>
                                    ) : (
                                        <div className="flex flex-col gap-2">
                                            {selectedItems.map((item) => (
                                                <div
                                                    key={item.uid || item.id}
                                                    className="flex flex-col gap-2 bg-white border rounded p-2"
                                                >
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div>
                                                            <p className="text-sm font-medium">{item.name}</p>
                                                            <p className="text-[11px] text-gray-600">
                                                                {item.category_name} {item.sub_category_name ? `• ${item.sub_category_name}` : ""}
                                                            </p>
                                                            <p className="text-[11px] text-gray-500">
                                                                Available: {item.quantity} {item.unit || ""}
                                                            </p>
                                                            {item.addedOn && (
                                                                <p className="text-[11px] text-gray-500">
                                                                    Added on: {formatAddedOn(item.addedOn)}
                                                                </p>
                                                            )}
                                                            {item.isExisting && (
                                                                <span className="inline-block text-[10px] text-green-600 bg-green-50 px-2 py-1 rounded mt-1">
                                                                    Already itemized
                                                                </span>
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={() => handleRemoveSelectedItem(item.uid)}
                                                            className="text-[11px] text-red-500 hover:text-red-600"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <label className="text-[11px] text-gray-600">Quantity used</label>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={item.usedQuantity}
                                                            onChange={(e) => handleQuantityChange(item.uid, e.target.value)}
                                                            className={`w-24 bg-white border px-2 py-1 rounded text-xs ${item.isExisting ? "opacity-60 cursor-not-allowed" : ""}`}
                                                            disabled={item.isExisting}
                                                        />
                                                        {item.unit && (
                                                            <span className="text-[11px] text-gray-500">{item.unit}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalContainer>
            )}

            {/* ADD PROJECT MODAL */}
            {showAddProjectModal && (
                <AnimatePresence>
                    <motion.div
                        className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="bg-white w-full max-w-[92vw] sm:max-w-[720px] md:max-w-[900px] rounded-2xl shadow-2xl border border-gray-100 relative overflow-hidden">
                            <X
                                onClick={() => {
                                    clearForm();
                                    setShowAddProjectModal(false);
                                    setValidationErrors({});
                                }}
                                className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-gray-700"
                            />

                            <div className="bg-orange-50/70 border-b border-orange-100 px-6 py-5">
                                <p className="text-lg font-semibold text-orange-600">Add New Project</p>
                                <p className="text-xs text-gray-600">
                                    Provide the key details so this project is easy to track and manage.
                                </p>
                            </div>

                            <form className="px-6 py-5 flex flex-col gap-4" onSubmit={handleSubmit}>
                                <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                                    <input
                                        type="checkbox"
                                        id="isEvent"
                                        checked={isEvent}
                                        onChange={(e) => setIsEvent(e.target.checked)}
                                        className="h-4 w-4 bg-white border border-gray-300 cursor-pointer accent-white"
                                        style={{ accentColor: '#fff' }}
                                    />
                                    <label htmlFor="isEvent" className="text-xs text-gray-700">
                                        Mark this project as an event
                                    </label>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1 md:col-span-2">
                                        <label className="text-xs font-medium text-gray-700">Title *</label>
                                        <input
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="bg-white border border-gray-200 px-3 py-2 text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-100"
                                            placeholder="Project Title"
                                        />
                                        {validationErrors.title && (
                                            <p className="text-xs text-red-500">{validationErrors.title[0]}</p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-1 md:col-span-2">
                                        <label className="text-xs font-medium text-gray-700">Description *</label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="bg-white border border-gray-200 px-3 py-2 text-xs rounded-lg min-h-[96px] focus:outline-none focus:ring-2 focus:ring-orange-100"
                                            placeholder="Short summary of the project"
                                        />
                                        {validationErrors.description && (
                                            <p className="text-xs text-red-500">{validationErrors.description[0]}</p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-medium text-gray-700">Location *</label>
                                        <input
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            className="bg-white border border-gray-200 px-3 py-2 text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-100"
                                            placeholder="Project Location"
                                        />
                                        {validationErrors.location && (
                                            <p className="text-xs text-red-500">{validationErrors.location[0]}</p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-medium text-gray-700">Date *</label>
                                        <input
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="bg-white border border-gray-200 px-3 py-2 text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-100"
                                        />
                                        {validationErrors.date && (
                                            <p className="text-xs text-red-500">{validationErrors.date[0]}</p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-1 md:col-span-2">
                                        <label className="text-xs font-medium text-gray-700">Image</label>
                                        <input
                                            type="file"
                                            onChange={(e) => setImage(e.target.files[0])}
                                            className="bg-white border border-gray-200 px-3 py-2 text-xs rounded-lg"
                                        />
                                        <p className="text-[11px] text-gray-500">
                                            Optional. Upload a clear project photo (JPG or PNG).
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            clearForm();
                                            setShowAddProjectModal(false);
                                            setValidationErrors({});
                                        }}
                                        className="bg-gray-100 hover:bg-gray-200 px-4 py-2 text-xs rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSavingProject}
                                        className={`bg-orange-500 text-white px-5 py-2 text-xs rounded-lg ${isSavingProject ? "opacity-60 cursor-not-allowed" : "hover:bg-orange-600"}`}
                                    >
                                        {isSavingProject ? "Saving.." : "Save Project"}
                                    </button>
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
                        <div className="bg-white w-full max-w-[92vw] sm:max-w-[720px] md:max-w-[900px] rounded-2xl shadow-2xl border border-gray-100 relative overflow-hidden">
                            <X
                                onClick={() => {
                                    clearForm();
                                    setShowEditProjectModal(false);
                                    setValidationErrors({});
                                }}
                                className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-gray-700"
                            />

                            <div className="bg-orange-50/70 border-b border-orange-100 px-6 py-5">
                                <p className="text-lg font-semibold text-orange-600">Edit Project</p>
                                <p className="text-xs text-gray-600">
                                    Update the project details to keep records accurate.
                                </p>
                            </div>

                            <form className="px-6 py-5 flex flex-col gap-4" onSubmit={handleEditSubmit}>
                                <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                                    <input
                                        type="checkbox"
                                        id="isEvent"
                                        checked={isEvent}
                                        onChange={(e) => setIsEvent(e.target.checked)}
                                        className="h-4 w-4 bg-white border border-gray-300 rounded cursor-pointer accent-white"
                                        style={{ accentColor: '#fff' }}
                                    />
                                    <label htmlFor="isEvent" className="text-xs text-gray-700">
                                        Mark this project as an event
                                    </label>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1 md:col-span-2">
                                        <label className="text-xs font-medium text-gray-700">Title *</label>
                                        <input
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="bg-white border border-gray-200 px-3 py-2 text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-100"
                                            placeholder="Project Title"
                                        />
                                        {validationErrors.title && (
                                            <p className="text-xs text-red-500">{validationErrors.title[0]}</p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-1 md:col-span-2">
                                        <label className="text-xs font-medium text-gray-700">Description *</label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="bg-white border border-gray-200 px-3 py-2 text-xs rounded-lg min-h-[96px] focus:outline-none focus:ring-2 focus:ring-orange-100"
                                            placeholder="Short summary of the project"
                                        />
                                        {validationErrors.description && (
                                            <p className="text-xs text-red-500">{validationErrors.description[0]}</p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-medium text-gray-700">Location *</label>
                                        <input
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            className="bg-white border border-gray-200 px-3 py-2 text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-100"
                                            placeholder="Project Location"
                                        />
                                        {validationErrors.location && (
                                            <p className="text-xs text-red-500">{validationErrors.location[0]}</p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-medium text-gray-700">Date *</label>
                                        <input
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="bg-white border border-gray-200 px-3 py-2 text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-100"
                                        />
                                        {validationErrors.date && (
                                            <p className="text-xs text-red-500">{validationErrors.date[0]}</p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-1 md:col-span-2">
                                        <label className="text-xs font-medium text-gray-700">Image</label>
                                        <input
                                            type="file"
                                            onChange={(e) => setImage(e.target.files[0])}
                                            className="bg-white border border-gray-200 px-3 py-2 text-xs rounded-lg"
                                        />
                                        <p className="text-[11px] text-gray-500">
                                            Optional. Upload a clear project photo (JPG or PNG).
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            clearForm();
                                            setShowEditProjectModal(false);
                                            setValidationErrors({});
                                        }}
                                        className="bg-gray-100 hover:bg-gray-200 px-4 py-2 text-xs rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isUpdatingProject}
                                        className={`bg-orange-500 text-white px-5 py-2 text-xs rounded-lg ${isUpdatingProject ? "opacity-60 cursor-not-allowed" : "hover:bg-orange-600"}`}
                                    >
                                        {isUpdatingProject ? "Saving.." : "Save Changes"}
                                    </button>
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

            {openVolunteerList && (
                <ModalContainer
                    isFull={false}
                    close={() => setOpenVolunteerList(false)}
                >
                    <div className="w-full md:w-[600px] h-96 max-h-96 overflow-y-auto rounded-xl bg-white p-4">
                        <div className="mb-4">
                            <p className="text-orange-600 font-semibold">Volunteers</p>
                            <p className="text-xs">Here&apos;s the list of approved volunteers for this project.</p>
                        </div>
                        <VolunteerListPerProject projectId={projectId} />
                    </div>
                </ModalContainer>
            )}
        </Admin>
    );
};

export default Projects;
