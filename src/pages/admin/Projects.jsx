import Admin from "../../layouts/Admin";
import { useEffect, useState } from "react";
import { X, Edit, Trash2 } from "lucide-react";
import { _get, _post, _put, _delete } from "../../api";
import { toast } from 'react-toastify';
import { AnimatePresence, motion } from "framer-motion";

const Projects = () => {

    const [projects, setPorjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTag, setCurrentTag] = useState("");
    const [showAddProjectModal, setShowAddProjectModal] = useState(false);

    const [tags, setTags] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [image, setImage] = useState(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await _get("/projects"); 
            const data = await response.data;
            setPorjects(data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    }

    const header = {
        title: "Projects Management",
        subTitle: "Easily manage your projects' information — create new entries, update project details, or remove completed or inactive projects."
    };

    const breadcrumbs = [
        { name: "Projects", link: "/projects" }
    ];

    const handleAddTag = (tag) => {
        if (tag && !tags.includes(tag)) {
            setTags([...tags, tag]);
        }
        setCurrentTag("");
    }

    const clearForm = () => {
        setTitle("");
        setDescription("");
        setLocation("");
        setDate("");
        setImage(null);
        setTags([]);
        setCurrentTag("");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (title === "" || description === "" || location === "" || date === "") {
            toast.error("Please fill in all required fields.");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("location", location);
        formData.append("date", date);
        if (image) {
            formData.append("image", image);
        }
        tags.forEach(tag => formData.append("tags[]", tag));
        console.log("Form Data:", formData);

        try {
            await _post("/projects", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            fetchProjects();
            clearForm();
            setShowAddProjectModal(false);
            toast.success("Project added successfully!");
        } catch (error) {
            toast.error("Error adding project. Please try again.");
            console.error('Error adding project:', error);
        }
    }

    return (
        <Admin header={header} breadcrumbs={breadcrumbs}>
            <div className="w-full mx-auto flex flex-col gap-4 pb-4">
                <div className="flex items-center justify-between bg-white border-gray-100 p-3 rounded-lg">
                    <div className="w-full min-w-80 max-w-[500px] flex items-center gap-4">
                        <p className="text-xs">Search</p>
                        <input type="text" className="placeholder:text-xs px-4 py-2 rounded border border-gray-200 text-sm" placeholder="Type something.." />
                    </div>
                    <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setShowAddProjectModal(true)} className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-4 py-2 rounded">+ New</button>
                    </div>
                </div>
                <table className="w-full border rounded-lg overflow-hidden shadow bg-white text-xs">
                    <thead className="bg-orange-500 text-white">
                    <tr>
                        <th className="p-3 text-start">Title</th>
                        <th className="p-3 text-start">Description</th>
                        <th className="p-3 text-start">Location</th>
                        <th className="p-3 text-start">Date</th>
                        <th className="p-3 text-end">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {projects.map((project, index) => (
                        <tr key={project.id} className={`${index % 2 === 0 ? "bg-orange-50" : ""}`}>
                            <td className="p-3">{project.title || ''}</td>
                            <td className="p-3">
                            {(project.description || '').length > 100
                                ? project.description.substring(0, 100) + '...'
                                : project.description || ''}
                            </td>
                            <td className="p-3">{project.location || ''}</td>
                            <td className="p-3">{project.date || ''}</td>
                            <td className="p-3 h-full flex items-center justify-end gap-2">
                                <button className="bg-blue-50 text-blue-600 px-1 py-1 rounded"><Edit size={16} /></button>
                                <button className="bg-red-50 text-red-600 px-1 py-1 rounded" ><Trash2 size={16} /></button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                {loading && (
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
                )}
            </div>

            {showAddProjectModal && (
                <AnimatePresence>
                    <motion.div 
                    role="alert"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }} 
                    className="fixed inset-0 flex items-center justify-center bg-black/10 z-50">
                        <div className="relative bg-white p-6 rounded-lg shadow-lg min-w-96 w-[800px]">
                            <div className=" flex items-center justify-between mb-4">
                                <p className="text-xs">Add New Project</p>
                                <X onClick={() => setShowAddProjectModal(false)} className="absolute top-4 right-4 cursor-pointer" size={20} />
                            </div>
                            <form className="flex flex-col gap-4" encType="multipart/form-data" onSubmit={handleSubmit}>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs">Title <span className="text-xs text-red-500">*</span></label>
                                    <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" className="placeholder:text-[11px] px-4 py-2 rounded border border-gray-200 text-xs" placeholder="Project Title" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs">Description <span className="text-xs text-red-500">*</span></label>
                                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="placeholder:text-[11px] px-4 py-2 rounded border border-gray-200 text-xs" placeholder="Project Description"></textarea>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs">Location <span className="text-xs text-red-500">*</span></label>
                                    <input value={location} onChange={(e) => setLocation(e.target.value)} type="text" className="placeholder:text-[11px] px-4 py-2 rounded border border-gray-200 text-xs" placeholder="Project Location" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs">Date <span className="text-xs text-red-500">*</span></label>
                                    <input value={date} onChange={(e) => setDate(e.target.value)} type="date" className="placeholder:text-[11px] px-4 py-2 rounded border border-gray-200 text-xs" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs">Image</label>
                                    <input
                                    type="file"
                                    onChange={(e) => setImage(e.target.files[0])}
                                    className="placeholder:text-[11px] px-4 py-2 rounded border border-gray-200 text-xs"
                                    />

                                </div>
                                {/* <div>
                                    <label className="text-xs">Tags</label>
                                    <div className="w-fit flex items-center gap-2">
                                        <input value={currentTag} onChange={(e) => setCurrentTag(e.target.value)} type="text" className="w-64 min-w-64 placeholder:text-[11px] px-4 py-2 rounded border border-gray-200 text-xs" placeholder="Tags.." />
                                        <div onClick={() => handleAddTag(currentTag)} className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-4 py-2 rounded">Add</div>
                                    </div>
                                    <div className="flex items-center flex-wrap gap-2 mt-2">
                                        {tags.map((tag, index) => (
                                            <span key={index} className=" text-[10px] px-2 py-1 pr-0 rounded flex items-center gap-1">
                                                <span className="text-blue-600">#{tag}</span>
                                                <button type="button" className="text-red-500 bg-transparent border-0" onClick={() => setTags(tags.filter(t => t !== tag))}>
                                                    <X size={12} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div> */}
                                <div className="flex items-center justify-end gap-2 mt-4">
                                    <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-4 py-2 rounded">Save</button>
                                    <div onClick={() => {
                                        clearForm();
                                        setShowAddProjectModal(false)
                                    }} type="submit" className="bg-gray-200 hover:bg-gray-300 text-xs px-4 py-2 rounded cursor-pointer">Cancel</div>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </AnimatePresence>
            )}
        </Admin>
    )
}

export default Projects;