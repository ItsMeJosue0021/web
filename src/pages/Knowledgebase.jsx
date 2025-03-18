import Admin from "../layouts/Admin"; 
import { Edit, Trash2, X } from "lucide-react";
import { useState, useEffect } from "react";
import { _post, _get, _put, _delete } from "../api";
import { toast } from 'react-toastify';
import ChatBox from "../components/chatbot/ChatBox";
import ChatButton from "../components/chatbot/ChatButton";

const Knowledgebase = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const [knowledgebase, setKnowledgebase] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
    });

    const fetchKnowledgebase = async () => {
        try {
            const response = await _get("/knowledgebase");
            setKnowledgebase(response.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKnowledgebase();
    }, []);
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setErrors({}); 

        try {
            if (selectedId) {
                await _put(`/knowledgebase/${selectedId}`, formData);
            } else {
                await _post("/knowledgebase", formData);
            }
            toast.success("Knowledgebase has been saved!")
            fetchKnowledgebase();
            setFormData({ title: "", content: "" }); 
            setSelectedId(null);
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
                toast.success("Something went wrong!")
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleEdit = (entry) => {
        setFormData({ title: entry.title, content: entry.content });
        setSelectedId(entry.id);
        setIsOpen(true);
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await _delete(`/knowledgebase/${deleteId}`);
            toast.success("Knowledgebase has been deleted!")
            fetchKnowledgebase();
            setIsDeleteModalOpen(false);
            setIsDeleting(false);
        } catch (error) {
            console.log(error);
            toast.success("Something went wrong!")
            setIsDeleting(false);
        }
    };


    return (
        <Admin>
            <div className="p-6 w-full mx-auto flex flex-col gap-4">
                <div>
                    {!isOpen ? (
                        <button className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-4 py-2 rounded" onClick={() => setIsOpen(true)}>
                            + Add Knowledgebase
                        </button>
                    ) : (
                        <button className="bg-gray-200 hover:bg-gray-300 text-sm px-4 py-2 rounded" onClick={() => { setIsOpen(false); setSelectedId(null); setFormData({ title: "", content: "" }); }}>
                            Close
                        </button>
                    )}
                </div>

                {isOpen && (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                        <div>
                            <p className="text-sm">Title</p>
                            <input
                                type="text"
                                name="title"
                                id="title"
                                placeholder="Your knowledgebase title here.."
                                className="text-sm px-4 py-2 w-full rounded-md border border-gray-300"
                                value={formData.title}
                                onChange={handleChange}
                            />
                            {errors.title && <p className="text-red-500 text-xs">{errors.title[0]}</p>}
                        </div>
                        <div>
                            <p className="text-sm">Content</p>
                            <textarea
                                name="content"
                                id="content"
                                placeholder="Your knowledgebase content here.."
                                className="h-20 w-full p-4 rounded-md border border-gray-300"
                                value={formData.content}
                                onChange={handleChange}
                            />
                            {errors.content && <p className="text-red-500 text-xs">{errors.content[0]}</p>}
                        </div>
                        <button type="submit" className="w-fit text-sm px-6 py-2 rounded bg-orange-600 text-white">
                            {isSaving ? "Saving.." : selectedId ? "Update" : "Save"}
                        </button>
                    </form>
                )}

                <div className="w-full">
                    <div className="w-full">
                        <table className="w-full border rounded-lg overflow-hidden shadow table-auto">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="p-3 text-start w-1/4">Title</th>
                                    <th className="p-3 text-start w-full">Content</th>
                                    <th colSpan={2} className="p-3 text-start w-1/6">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {knowledgebase.map((row) => (
                                    <tr className="border-t" key={row.id}>
                                        <td className="p-3">{row.title}</td>
                                        <td className="p-3 w-full">{row.content}</td>
                                        <td className="p-3 flex justify-start gap-2">
                                            <button onClick={() => handleEdit(row)} className="bg-blue-50 text-blue-600 px-1 py-1 rounded">
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => { setDeleteId(row.id); setIsDeleteModalOpen(true); }} className="bg-red-50 text-red-600 px-1 py-1 rounded">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {loading && (
                            <div className="w-full h-20 flex items-center justify-center"><p>Loading..</p></div>
                        )}
                    </div>
                    <div>
                        <ChatButton/>
                    </div>
                </div>

                

                {/* Delete Confirmation Modal */}
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/10 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h3 className="text-lg font-semibold">Confirm Deletion</h3>
                            <p className="text-sm text-gray-600">Are you sure you want to delete this knowledgebase entry?</p>
                            <div className="flex justify-end gap-2 mt-4">
                                <button className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded text-sm" onClick={() => setIsDeleteModalOpen(false)}>
                                    Cancel
                                </button>
                                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm" onClick={handleDelete}>
                                    {isDeleting ? 'Deleting..' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Admin>
    );
};

export default Knowledgebase;
