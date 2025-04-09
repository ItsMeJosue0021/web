import { useEffect, useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import Admin from "../layouts/Admin";
import { _get, _delete } from "../api";
import { toast } from 'react-toastify';
import UpdateUserForm from "../components/forms/UpdateUserForm";
import PrintButton from "../components/buttons/PrintButton";
import PrintPreview from "../components/PrintPreview";
import '../css/loading.css'; 

const Users = () => {

    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [editUser, setEditUser] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await _get("/users");
            setUsers(response.data.users);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching users:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDeleteAction = (id) => {
        setIsDeleteModalOpen(true);
        setDeleteId(id);
    }

    const handleDelete = async () => {
        if (!deleteId) return;
        setIsDeleting(true);
        try {
            await _delete(`/users/${deleteId}`);
            setIsDeleteModalOpen(false);
            toast.success("User deleted successfully.");
            fetchUsers(); // Refresh list
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Error deleting user. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    }

    const header = {
        title: "User Management",
        subTitle: "Manage all users in the system",
    }

    const breadcrumbs = [
        { name: "Settings", link: "/settings/users" },
        { name: "Users", link: "/settings/users" }
    ]

    const [showPrintPreview, setShowPrintPreview] = useState(false);
    
    const handlePrintPreview = () => {
        setShowPrintPreview(true);
    }

    const printData = {
        title: "List of Users",
        subtitle: "This is the official list of all users of the system",
    }

    return (
        <Admin header={header} breadcrumbs={breadcrumbs}>
            {showPrintPreview && <PrintPreview onClose={() => setShowPrintPreview(false)} data={printData} />}
            <div className="w-full mx-auto flex flex-col gap-4">
                <div className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-white">
                    <div className="w-full min-w-80 max-w-[500px] flex items-center gap-4 ">
                        <p className="text-sm">Search</p>
                        <input type="text" className="placeholder:text-xs px-4 py-2 rounded border border-gray-200 text-sm" placeholder="Search for Users.." />
                    </div>
                    <div>
                        <PrintButton onView={handlePrintPreview}/>
                    </div>
                </div>
               
                <table className="w-full border rounded-lg overflow-hidden shadow bg-white text-sm">
                    <thead className="bg-orange-500 text-white ">
                    <tr>
                        <th className="p-3 text-start">Name</th>
                        <th className="p-3 text-start">Email</th>
                        <th className="p-3 text-start">Username</th>
                        <th className="p-3 text-start">Contact No.</th>
                        <th className="p-3 text-end">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                        {users.map((row, index) => (
                            <tr key={row.id}
                            className={`text-xs ${index % 2 === 0 ? "bg-orange-50" : ""}`}>
                                <td className="p-3">{row.first_name} {row.middle_name} {row.last_name}</td>
                                <td className="p-3">{row.email}</td>
                                <td className="p-3">{row.username}</td>
                                <td className="p-3">{row.contact_number}</td>
                                <td className="p-3 flex justify-end gap-2">
                                    <button onClick={() => setEditUser(row)} className="bg-red-50 text-blue-600 px-1 py-1 rounded"><Edit size={16} /></button>
                                    <button onClick={() => handleDeleteAction(row.id)} className="bg-red-50 text-red-600 px-1 py-1 rounded"><Trash2 size={16} /></button>
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

                {editUser && (
                    <div className="fixed top-0 left-0 w-full h-screen bg-black/10 flex items-center justify-center">
                        <UpdateUserForm user={editUser} onClose={() => setEditUser(null)} onSuccess={() => fetchUsers()}/>
                    </div>
                )}

                 {/* Delete Confirmation Modal */}
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/10 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h3 className="text-lg font-semibold">Confirm Deletion</h3>
                            <p className="text-sm text-gray-600">
                                Are you sure you want to delete this user?
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
            </div>
        </Admin>
    )
}

export default Users;