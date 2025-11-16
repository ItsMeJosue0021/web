// import { useEffect, useState } from "react";
// import { Edit, Trash2 } from "lucide-react";
// import Admin from "../layouts/Admin";
// import { _get, _delete } from "../api";
// import { toast } from 'react-toastify';
// import UpdateUserForm from "../components/forms/UpdateUserForm";
// import PrintButton from "../components/buttons/PrintButton";
// import PrintPreview from "../components/PrintPreview";
// import '../css/loading.css'; 
// import { Eye } from "lucide-react";
// import { motion, AnimatePresence } from 'framer-motion';
// import UserViewModal from "../components/UserViewModal";

// const Users = () => {

//     const [loading, setLoading] = useState(true);
//     const [users, setUsers] = useState([]);
//     const [editUser, setEditUser] = useState(null);
//     const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//     const [isDeleting, setIsDeleting] = useState(false);
//     const [deleteId, setDeleteId] = useState(null);
//     const [viewUser, setViewUser] = useState(false);
//     const [user, setUser] = useState(null);

//     const fetchUsers = async () => {
//         setLoading(true);
//         try {
//             const response = await _get("/users");
//             setUsers(response.data.users);
//             setLoading(false);
//         } catch (error) {
//             console.error("Error fetching users:", error);
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchUsers();
//     }, []);

//     const handleDeleteAction = (id) => {
//         setIsDeleteModalOpen(true);
//         setDeleteId(id);
//     }

//     const handleDelete = async () => {
//         if (!deleteId) return;
//         setIsDeleting(true);
//         try {
//             await _delete(`/users/${deleteId}`);
//             setIsDeleteModalOpen(false);
//             toast.success("User deleted successfully.");
//             fetchUsers(); // Refresh list
//         } catch (error) {
//             console.error("Error deleting user:", error);
//             toast.error("Error deleting user. Please try again.");
//         } finally {
//             setIsDeleting(false);
//         }
//     }

//     const viewUserDetails = (user) => {
//         setUser(user);
//         setViewUser(true);
//         console.log(user);
//     }

//     const header = {
//         title: "User Management",
//         subTitle: "Manage all users in the system",
//     }

//     const breadcrumbs = [
//         { name: "Settings", link: "/settings/users" },
//         { name: "Users", link: "/settings/users" }
//     ]

//     const [showPrintPreview, setShowPrintPreview] = useState(false);
    
//     const handlePrintPreview = () => {
//         setShowPrintPreview(true);
//     }

//     const printData = {
//         title: "List of Users",
//         subtitle: "This is the official list of all users of the system",
//     }

//     return (
//         <Admin header={header} breadcrumbs={breadcrumbs}>
//             {showPrintPreview && <PrintPreview onClose={() => setShowPrintPreview(false)} data={printData} />}
//             {viewUser && <UserViewModal onClose={() => setViewUser(false)} user={user}/>}
//             <div className="w-full mx-auto flex flex-col gap-4">
//                 <div className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-white">
//                     <div className="w-full min-w-80 max-w-[500px] flex items-center gap-4 ">
//                         <p className="text-sm">Search</p>
//                         <input type="text" className="placeholder:text-xs px-4 py-2 rounded border border-gray-200 text-sm" placeholder="Search for Users.." />
//                     </div>
//                     <div>
//                         <PrintButton onView={handlePrintPreview}/>
//                     </div>
//                 </div>
               
//                 <table className="w-full border rounded-lg overflow-hidden shadow bg-white text-sm">
//                     <thead className="bg-orange-500 text-white ">
//                     <tr>
//                         <th className="p-3 text-start">Name</th>
//                         <th className="p-3 text-start">Email</th>
//                         <th className="p-3 text-start">Username</th>
//                         <th className="p-3 text-start">Contact No.</th>
//                         <th className="p-3 text-end">Actions</th>
//                     </tr>
//                     </thead>
//                     <tbody>
//                         {users.map((row, index) => (
//                             <tr key={row.id}
//                             className={`text-xs ${index % 2 === 0 ? "bg-orange-50" : ""}`}>
//                                 <td className="p-3">{row.first_name} {row.middle_name} {row.last_name}</td>
//                                 <td className="p-3">{row.email}</td>
//                                 <td className="p-3">{row.username}</td>
//                                 <td className="p-3">{row.contact_number}</td>
//                                 <td className="p-3 flex justify-end gap-2">
//                                     <button onClick={() => viewUserDetails(row)}><Eye size={16}/></button>
//                                     <button onClick={() => handleDeleteAction(row.id)} className="bg-red-50 text-red-600 px-1 py-1 rounded"><Trash2 size={16} /></button>
//                                 </td>
//                             </tr>
//                         ))}
                        
//                     </tbody>
//                 </table>
//                 {loading && (
//                     <div className="w-full h-36 flex items-center text-xs justify-center">
//                         <div className="self-start h-full px-3 py-2 text-sm">
//                             <div className="h-full flex items-center space-x-1">
//                                 <div className="dot dot-1 w-1 h-1 bg-orange-700 rounded-full"></div>
//                                 <div className="dot dot-2 w-1 h-1 bg-orange-700 rounded-full"></div>
//                                 <div className="dot dot-3 w-1 h-1 bg-orange-700 rounded-full"></div>
//                                 <div className="dot dot-4 w-1 h-1 bg-orange-700 rounded-full"></div>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {editUser && (
//                     <div className="fixed top-0 left-0 w-full h-screen bg-black/10 flex items-center justify-center">
//                         <UpdateUserForm user={editUser} onClose={() => setEditUser(null)} onSuccess={() => fetchUsers()}/>
//                     </div>
//                 )}

//                  {/* Delete Confirmation Modal */}
//                 {isDeleteModalOpen && (
//                     <AnimatePresence>
//                         <motion.div
//                         role="alert"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }} 
//                         className="fixed inset-0 flex items-center justify-center bg-black/10 z-50">
//                             <div className="bg-white p-6 rounded-lg shadow-lg ">
//                                 <h3 className="text-base font-semibold text-red-500 mb-2">Confirm Deletion</h3>
//                                 <p className="text-xs text-gray-600">
//                                     Are you sure you want to delete this user?
//                                 </p>
//                                 <div className="flex justify-end gap-2 mt-4">
//                                     <button
//                                         className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded text-xs"
//                                         onClick={() => setIsDeleteModalOpen(false)}
//                                     >
//                                         Cancel
//                                     </button>
//                                     <button
//                                         className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-xs"
//                                         onClick={handleDelete}
//                                     >
//                                         {isDeleting ? "Deleting.." : "Delete"}
//                                     </button>
//                                 </div>
//                             </div>
//                         </motion.div>
//                     </AnimatePresence>
                    
//                 )}
//             </div>
//         </Admin>
//     )
// }

// export default Users;

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

const Users = () => {

    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [editUser, setEditUser] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [viewUser, setViewUser] = useState(false);
    const [user, setUser] = useState(null);
    const [showPrintPreview, setShowPrintPreview] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await _get("/users");
            setUsers(response.data.users);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

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

    const handlePrintPreview = () => {
        setShowPrintPreview(true);
    };

    const printData = {
        title: "List of Users",
        subtitle: "This is the official list of all users of the system",
    };

    return (
        <Admin header={header} breadcrumbs={breadcrumbs}>
            
            {showPrintPreview && <PrintPreview onClose={() => setShowPrintPreview(false)} data={printData} />}
            {viewUser && <UserViewModal onClose={() => setViewUser(false)} user={user}/>}

            <div className="w-full mx-auto flex flex-col gap-4 mt-4">

                {/* ▶ TOP BAR */}
                <div className="w-full flex flex-col sm:flex-row gap-3 sm:gap-0 items-start sm:items-center justify-between p-4 rounded-lg border border-gray-100 bg-white">
                    
                    {/* SEARCH */}
                    <div className="w-full sm:max-w-[450px] flex items-center gap-3">
                        <p className="text-xs sm:text-sm">Search</p>
                        <input 
                            type="text" 
                            className="w-full bg-white placeholder:text-xs px-4 py-2 rounded border border-gray-200 text-sm" 
                            placeholder="Search for Users.." 
                        />
                    </div>

                    {/* PRINT BUTTON */}
                    <div className="w-full sm:w-auto flex justify-end">
                        <PrintButton onView={handlePrintPreview}/>
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
                            {users.map((row, index) => (
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
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ▶ LOADING INDICATOR */}
                {loading && (
                    <div className="w-full h-36 flex items-center justify-center text-xs">
                        <div className="flex items-center space-x-1">
                            <div className="dot dot-1 w-1 h-1 bg-orange-700 rounded-full"></div>
                            <div className="dot dot-2 w-1 h-1 bg-orange-700 rounded-full"></div>
                            <div className="dot dot-3 w-1 h-1 bg-orange-700 rounded-full"></div>
                            <div className="dot dot-4 w-1 h-1 bg-orange-700 rounded-full"></div>
                        </div>
                    </div>
                )}

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
                            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
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
