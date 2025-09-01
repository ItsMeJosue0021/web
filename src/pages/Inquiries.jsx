import Admin from "../layouts/Admin";
import { Edit, Trash2, Mail } from "lucide-react";
import { _delete, _get } from "../api";
import { useState, useEffect } from "react";
import PrintButton from "../components/buttons/PrintButton";
import { motion, AnimatePresence } from 'framer-motion';
import PrintPreview from "../components/PrintPreview";
import '../css/loading.css'; 
import { _post } from "../api";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { useCallback } from "react";
import debounce from "lodash.debounce";
import CircularLoading from "../components/CircularLoading";

const Inquiries = () => {


    const [enquiries, setEnquiries] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState(null); // Tracks which enquiry is being deleted
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // State for reply modal
    const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
    const [replyData, setReplyData] = useState({
        email: "",
        subject: "",
        message: "",
    });

    useEffect(() => {
        fetchEnquiries();
    }, []);

    // Fetch all enquiries
    const fetchEnquiries = async () => {
        try {
            const response = await _get("/enquiries");
            setEnquiries(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching enquiries:", error);
        }
    };

     // Open delete confirmation modal
     const confirmDelete = (id) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    // Handle delete
    const handleDelete = async () => {
        if (!deleteId) return;
        setIsDeleting(true);
        try {
            await _delete(`/enquiries/${deleteId}`);
            setIsDeleteModalOpen(false);
            fetchEnquiries(); // Refresh list
        } catch (error) {
            console.error("Error deleting enquiry:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    // const handleSearch = async (search) => {
    //     try {
    //         const response = await _get(`/enquiries/search?search=${search}`);
    //         setEnquiries(response.data);
    //     } catch (error) {
    //         console.error("Error fetching data:", error);
    //     }
    // }

    const handleSearch = useCallback(
        debounce(async (search) => {
            setLoading(true);
            try {
                const response = await _get(`/enquiries/search?search=${search}`);
                setEnquiries(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        }, 500), 
        [] 
    );

    // Open reply modal
    const openReplyModal = (email) => {
        setReplyData({
            email,
            subject: "",
            message: "",
        });
        setIsReplyModalOpen(true);
    };

    const [sendingReply, setSendingReply] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});

    // Handle reply submission
    const handleSendReply = async () => {
        setSendingReply(true);
        setFieldErrors({}); // clear previous errors

        try {
            await _post("/send-email", replyData);
            setIsReplyModalOpen(false);
            toast.success("Reply sent successfully!");
        } catch (error) {
            if (error.response?.data?.errors) {
                setFieldErrors(error.response.data.errors);
            } else {
                toast.error("Something went wrong. Please try again.");
                console.error("Error sending reply:", error);
            }
        } finally {
            setSendingReply(false);
        }
    };


    const header = {
        title: "Inquiry Management",
        subTitle: "Manage and track inquiries efficiently - add new ones, update details, or remove resolved requests."
    }

    const breadcrumbs = [
        { name: "Inquiries", link: "/inquiries" }
    ]

    const printData = {
        title: "List of Inquiries",
        subtitle: "This is the official list of all inquiries received through the system",
    }

    return (
        <Admin header={header} breadcrumbs={breadcrumbs}>
            <div className="w-full mx-auto flex flex-col gap-4">
                <div className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-white">
                    <div className="w-full min-w-80 max-w-[500px] flex items-center gap-4 ">
                        <p className="text-sm">Search</p>
                        <input onChange={(e) => handleSearch(e.target.value)} type="text" className="placeholder:text-xs px-4 py-2 rounded border border-gray-200 text-sm" placeholder="Search for enquiries.." />
                    </div>
                </div>
               
                <table className="w-full border rounded-lg overflow-hidden shadow bg-white text-sm">
                    <thead className="bg-orange-500 text-white ">
                    <tr>
                        <th className="p-3 text-start">Name</th>
                        <th className="p-3 text-start">Email</th>
                        <th colSpan={2} className="p-3 text-start ">Message</th>
                        <th className="p-3 text-start">Actions</th>
                    </tr>
                    </thead>
                    {!loading && (
                        <tbody>
                            {enquiries.map((row, index) => (
                                <tr key={row.id}
                                className={`${index % 2 === 0 ? "bg-orange-50" : ""}`}>
                                    <td className="p-3 text-xs">{row.name}</td>
                                    <td className="p-3 text-xs">{row.email}</td>
                                    <td colSpan={2} className="p-3 text-xs ">{row.message}</td>
                                    <td className="p-3 text-xs flex justify-start gap-2">
                                    <button 
                                            onClick={() => openReplyModal(row.email)}
                                            className="bg-orange-500 text-[10px] text-white px-2 py-1 rounded flex items-center gap-1 hover:bg-orange-600"
                                        >
                                            <Mail size={14} /> Reply
                                    </button>
                                        <button onClick={() => confirmDelete(row.id)} className="bg-red-50 text-red-600 px-1 py-1 rounded"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    )}
                    
                </table>
                {loading && (
                    <div className="w-full h-40 flex items-center justify-center">
                        <CircularLoading customClass='w-full text-blue-500 w-6 h-6' />
                    </div>
                )}
            </div>

             {/* Delete Confirmation Modal */}
             {isDeleteModalOpen && (
                <AnimatePresence>
                    <motion.div 
                    role="alert"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 flex items-center justify-center bg-black/10 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h3 className="text-base font-semibold mb-2 text-red-500">Confirm Deletion</h3>
                            <p className="text-xs text-gray-600">
                                Are you sure you want to delete this enquiry?
                            </p>
                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded text-xs"
                                    onClick={() => setIsDeleteModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-xs"
                                    onClick={handleDelete}
                                >
                                    {isDeleting ? "Deleting.." : "Delete"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            )}

             {/* Reply Modal */}
             {isReplyModalOpen && (
                <AnimatePresence>
                    <motion.div 
                    role="alert"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }} 
                    className="fixed inset-0 flex items-center justify-center bg-black/10 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg min-w-96 w-[800px]">
                            <h3 className="text-sm font-semibold text-orange-500">Reply to Inquiry</h3>
                            <p className="text-xs text-gray-600">Replying to: <span className="text-blue-600">{replyData.email}</span></p>

                            <div className="flex flex-col gap-3 mt-4">
                                <input 
                                    type="text" 
                                    placeholder="Subject" 
                                    className="w-full p-2 border rounded text-xs" 
                                    value={replyData.subject}
                                    onChange={(e) => setReplyData({ ...replyData, subject: e.target.value })}
                                />
                                {fieldErrors.subject && (
                                    <p className="text-red-500 text-[10px]">{fieldErrors.subject[0]}</p>
                                )}

                                <textarea 
                                    placeholder="Message..." 
                                    className="w-full h-28 p-2 border rounded text-xs" 
                                    value={replyData.message}
                                    onChange={(e) => setReplyData({ ...replyData, message: e.target.value })}
                                />
                                {fieldErrors.message && (
                                    <p className="text-red-500 text-[10px]">{fieldErrors.message[0]}</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 mt-4">
                                <button 
                                    className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded text-xs"
                                    onClick={() => {
                                        setIsReplyModalOpen(false);
                                        setReplyData({
                                            email: "",
                                            subject: "",
                                            message: "",
                                        });
                                        setFieldErrors({}); 
                                    }}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded text-xs"
                                    onClick={handleSendReply}
                                >
                                    {sendingReply ? 'Sending..' : 'Send'} 
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            )}
             
        </Admin>
    )
}

export default Inquiries;