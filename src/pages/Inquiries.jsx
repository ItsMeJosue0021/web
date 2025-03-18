import Admin from "../layouts/Admin";
import { Edit, Trash2, Mail } from "lucide-react";
import { _delete, _get } from "../api";
import { useState, useEffect } from "react";

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

    const handleSearch = async (search) => {
        if (search.trim() === "") return;

        try {
            const response = await _get(`/enquiries/search?search=${search}`);
            setEnquiries(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    // Open reply modal
    const openReplyModal = (email) => {
        setReplyData({
            email,
            subject: "",
            message: "",
        });
        setIsReplyModalOpen(true);
    };

    // Handle reply submission
    const handleSendReply = async () => {
        try {
            await _post("/enquiries/reply", replyData);
            setIsReplyModalOpen(false);
            alert("Reply sent successfully!");
        } catch (error) {
            console.error("Error sending reply:", error);
        }
    };


    return (
        <Admin>
            <div className="p-6 w-full mx-auto flex flex-col gap-4">
                <p className="text-base text-blue-500">/Inquiries</p>
                <h2 className="text-xl font-medium">Inquiry Management</h2>
                <div className="w-full min-w-80 max-w-[500px] flex items-center gap-4">
                    <p>Search</p>
                    <input onChange={(e) => handleSearch(e.target.value)} type="text" className="px-4 py-2 rounded border border-gray-300 text-sm" placeholder="Search for enquiries.." />
                </div>
                <table className="w-full border rounded-lg overflow-hidden shadow">
                    <thead className="bg-gray-200">
                    <tr>
                        <th className="p-3 text-start">Name</th>
                        <th className="p-3 text-start">Email</th>
                        <th colSpan={2} className="p-3 text-start">Message</th>
                        <th className="p-3 text-start">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                        {enquiries.map((row) => (
                            <tr key={row.id} className="border-t">
                                <td className="p-3">{row.name}</td>
                                <td className="p-3">{row.email}</td>
                                <td colSpan={2} className="p-3">{row.message}</td>
                                <td className="p-3 flex justify-start gap-2">
                                <button 
                                        onClick={() => openReplyModal(row.email)}
                                        className="bg-orange-500 text-xs text-white px-2 py-1 rounded flex items-center gap-1 hover:bg-orange-600"
                                    >
                                        <Mail size={16} /> Reply
                                    </button>
                                    <button onClick={() => confirmDelete(row.id)} className="bg-red-50 text-red-600 px-1 py-1 rounded"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                        
                    </tbody>
                </table>
                {loading && (
                    <div className="w-full h-20 flex items-center justify-center"><p>Loading..</p></div>
                )}
            </div>

             {/* Delete Confirmation Modal */}
             {isDeleteModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/10 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold">Confirm Deletion</h3>
                        <p className="text-sm text-gray-600">
                            Are you sure you want to delete this enquiry?
                        </p>
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded text-sm"
                                onClick={() => setIsDeleteModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
                                onClick={handleDelete}
                            >
                                {isDeleting ? "Deleting.." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

             {/* Reply Modal */}
             {isReplyModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/10 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg min-w-96 w-[800px]">
                        <h3 className="text-lg font-semibold text-orange-500">Reply to Inquiry</h3>
                        <p className="text-sm text-gray-600">Replying to: <span className="text-blue-600">{replyData.email}</span></p>

                        <div className="flex flex-col gap-3 mt-4">
                            <input 
                                type="text" 
                                placeholder="Subject" 
                                className="w-full p-2 border rounded text-sm" 
                                value={replyData.subject}
                                onChange={(e) => setReplyData({ ...replyData, subject: e.target.value })}
                            />
                            <textarea 
                                placeholder="Message..." 
                                className="w-full h-28 p-2 border rounded text-sm" 
                                value={replyData.message}
                                onChange={(e) => setReplyData({ ...replyData, message: e.target.value })}
                            />
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                            <button 
                                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded text-sm"
                                onClick={() => setIsReplyModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded text-sm"
                                onClick={handleSendReply}
                            >
                                Send Reply
                            </button>
                        </div>
                    </div>
                </div>
            )}
             
        </Admin>
    )
}

export default Inquiries;