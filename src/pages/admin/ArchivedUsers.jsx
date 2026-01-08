import { useEffect, useState } from "react";
import Admin from "../../layouts/Admin";
import { _get, _post } from "../../api";
import { toast } from "react-toastify";
import "../../css/loading.css";
import CircularLoading from "../../components/CircularLoading";

const ArchivedUsers = () => {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [restoringId, setRestoringId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchUsers = async (term = searchTerm) => {
        setLoading(true);
        try {
            const query = term ? `?search=${encodeURIComponent(term)}` : "";
            const response = await _get(`/archived-users${query}`);
            setUsers(response.data.users);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Unable to load archived users.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(searchTerm);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm]);

    const handleRestore = async (id) => {
        if (!id) return;
        setRestoringId(id);
        try {
            await _post(`/archived-users/restore/${id}`);
            toast.success("User restored successfully.");
            fetchUsers();
        } catch (error) {
            console.error("Error restoring user:", error);
            toast.error("Error restoring user. Please try again.");
        } finally {
            setRestoringId(null);
        }
    };

    const header = {
        title: "Archived User Management",
        subTitle: "Manage all archived users in the system",
    };

    const breadcrumbs = [
        { name: "Settings", link: "/settings/archived-users" },
        { name: "Archived Users", link: "/settings/archived-users" }
    ];

    return (
        <Admin header={header} breadcrumbs={breadcrumbs}>
            <div className="w-full mx-auto flex flex-col gap-4 mt-4">

                {/* TOP BAR */}
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
                </div>

                {loading ? (
                    <div className="w-full h-40 flex items-center justify-center">
                        <CircularLoading customClass="text-blue-500 w-6 h-6" />
                    </div>
                ) : users.length === 0 ? (
                    <div className="bg-white border border-dashed border-gray-200 rounded-lg p-8 text-center text-sm text-gray-500">
                        No archived users found. Adjust search or clear filters to see more results.
                        <div className="mt-3">
                            <button
                                onClick={() => { setSearchTerm(""); fetchUsers(""); }}
                                className="text-xs px-3 py-2 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
                            >
                                Clear filters
                            </button>
                        </div>
                    </div>
                ) : (
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
                                            <button 
                                                onClick={() => handleRestore(row.id)} 
                                                className="bg-green-50 text-green-600 px-3 py-1 rounded text-xs"
                                                disabled={restoringId === row.id}
                                            >
                                                {restoringId === row.id ? "Restoring..." : "Restore"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

            </div>
        </Admin>
    );
};

export default ArchivedUsers;
