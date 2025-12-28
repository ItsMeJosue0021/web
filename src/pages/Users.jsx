import { useEffect, useState } from "react";
import { Edit, Trash2, Eye } from "lucide-react";
import Admin from "../layouts/Admin";
import { _get, _delete } from "../api";
import { toast } from 'react-toastify';
import UpdateUserForm from "../components/forms/UpdateUserForm";
import PrintButton from "../components/buttons/PrintButton";
import PrintPreview from "../components/PrintPreview";
import '../css/loading.css'; 
import { motion, AnimatePresence } from 'framer-motion';
import UserViewModal from "../components/UserViewModal";
import CircularLoading from "../components/CircularLoading";

const Users = () => {

    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [editUser, setEditUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [viewUser, setViewUser] = useState(false);
    const [user, setUser] = useState(null);
    const [showPrintPreview, setShowPrintPreview] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [isPrintLoading, setIsPrintLoading] = useState(false);

    const fetchUsers = async (term = searchTerm) => {
        setLoading(true);
        try {
            const query = term ? `?search=${encodeURIComponent(term)}` : "";
            const response = await _get(`/users${query}`);
            setUsers(response.data.users);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(searchTerm);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm]);

    const handleDeleteAction = (id) => {
        setIsDeleteModalOpen(true);
        setDeleteId(id);
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        setIsDeleting(true);
        try {
            await _delete(`/users/${deleteId}`);
            setIsDeleteModalOpen(false);
            toast.success("User deleted successfully.");
            fetchUsers();
        } catch (error) {
            toast.error("Error deleting user. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };

    const viewUserDetails = (user) => {
        setUser(user);
        setViewUser(true);
    };

    const header = {
        title: "User Management",
        subTitle: "Manage all users in the system",
    };

    const breadcrumbs = [
        { name: "Settings", link: "/settings/users" },
        { name: "Users", link: "/settings/users" }
    ];

    const handlePrint = async () => {
        setIsPrintLoading(true);
        try {
            const response = await _get("/users/print", {
                responseType: "blob",
            });

            const fileURL = window.URL.createObjectURL(
                new Blob([response.data], { type: "application/pdf" })
            );

            setPdfUrl(fileURL);
            setShowPrintPreview(true);
        } catch (error) {
            console.error("Error printing users:", error);
            toast.error("Unable to generate users PDF.");
        } finally {
            setIsPrintLoading(false);
        }
    };

    const handleClosePreview = () => {
        if (pdfUrl) {
            window.URL.revokeObjectURL(pdfUrl);
        }
        setPdfUrl(null);
        setShowPrintPreview(false);
    };

    useEffect(() => {
        return () => {
            if (pdfUrl) {
                window.URL.revokeObjectURL(pdfUrl);
            }
        };
    }, [pdfUrl]);

    return (
        <Admin header={header} breadcrumbs={breadcrumbs}>
            
            {showPrintPreview && (
                <PrintPreview 
                    onClose={handleClosePreview} 
                    pdfUrl={pdfUrl} 
                />
            )}
            {viewUser && <UserViewModal onClose={() => setViewUser(false)} user={user}/>}

            <div className="w-full mx-auto flex flex-col gap-4 mt-4">

                {/* ▶ TOP BAR */}
                <div className="w-full flex flex-col sm:flex-row gap-3 sm:gap-0 items-start sm:items-center justify-between p-4 rounded-lg border border-gray-100 bg-white">
                    
                    {/* SEARCH */}
                    <div className="w-full sm:max-w-[450px] flex items-center gap-3">
                        <p className="text-xs">Search</p>
                        <input 
                            type="text" 
                            className="w-full bg-white placeholder:text-xs px-4 py-2 rounded border border-gray-200 text-sm" 
                            placeholder="Search for Users.." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* PRINT BUTTON */}
                    <div className="w-full sm:w-auto flex justify-end">
                        <PrintButton onView={handlePrint} isPrinting={isPrintLoading}/>
                    </div>
                </div>

                {/* ▶ TABLE WRAPPER */}
                <div className="w-full overflow-x-auto rounded-lg border border-gray-200 bg-white">
                    <table className="w-full text-sm min-w-[700px]">
                        <thead className="bg-orange-500 text-white">
                            <tr>
                                <th className="p-3 text-left">Name</th>
                                <th className="p-3 text-left">Email</th>
                                <th className="p-3 text-left">Username</th>
                                <th className="p-3 text-left">Contact No.</th>
                                <th className="p-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!loading ? (
                                users.length > 0 ? (
                                    users.map((row, index) => (
                                        <tr 
                                            key={row.id}
                                            className={`text-xs ${index % 2 === 0 ? "bg-orange-50" : ""}`}
                                        >
                                            <td className="p-3">{row.first_name} {row.middle_name} {row.last_name}</td>
                                            <td className="p-3">{row.email}</td>
                                            <td className="p-3">{row.username}</td>
                                            <td className="p-3">{row.contact_number}</td>
                                            <td className="p-3 flex justify-end gap-3">
                                                <button className="bg-transparent" onClick={() => viewUserDetails(row)}>
                                                    <Eye size={16}/>
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteAction(row.id)} 
                                                    className="bg-red-50 text-red-600 px-1 py-1 rounded"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-xs text-gray-500">
                                        No records found.
                                        </td>
                                    </tr>
                                )
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-10 text-center">
                                        <div className="flex items-center justify-center">
                                            <CircularLoading customClass="text-blue-500 w-6 h-6" />
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ▶ UPDATE FORM MODAL */}
                {editUser && (
                    <div className="fixed inset-0 bg-black/10 flex items-center justify-center p-4">
                        <UpdateUserForm 
                            user={editUser} 
                            onClose={() => setEditUser(null)} 
                            onSuccess={() => fetchUsers()} 
                        />
                    </div>
                )}

                {/* ▶ DELETE CONFIRMATION MODAL */}
                {isDeleteModalOpen && (
                    <AnimatePresence>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/10 flex items-center justify-center p-4 z-50"
                        >
                            <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-96 max-w-96">
                                <h3 className="text-base font-semibold text-red-500">Confirm Deletion</h3>
                                <p className="text-xs text-gray-600 mt-2">
                                    Are you sure you want to delete this user?
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
                                        {isDeleting ? "Deleting..." : "Delete"}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                )}

            </div>
        </Admin>
    );
};

export default Users;
