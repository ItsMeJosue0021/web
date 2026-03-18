import { useEffect, useMemo, useState } from "react";
import { Edit2, PlusCircle, Trash2, X } from "lucide-react";
import Admin from "../layouts/Admin";
import { _delete, _get, _post, _put } from "../api";
import { toast } from "react-toastify";

const emptyForm = {
    first_name: "",
    middle_name: "",
    last_name: "",
    username: "",
    contact_number: "",
    email: "",
    password: "",
    confirmPassword: "",
};

const Roles = () => {
    const [roles, setRoles] = useState([]);
    const [adminUsers, setAdminUsers] = useState([]);
    const [adminSearch, setAdminSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [savingUserId, setSavingUserId] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formMode, setFormMode] = useState("");
    const [formUser, setFormUser] = useState(null);
    const [formData, setFormData] = useState(emptyForm);

    const fetchAllData = async () => {
        setLoading(true);
        const buildUserQuery = (role, term = "") => {
            const params = new URLSearchParams();
            params.set("role", role);
            if (term) {
                params.set("search", term);
            }
            return params.toString() ? `?${params.toString()}` : "";
        };

        try {
            const [rolesResponse, adminUsersResponse] = await Promise.all([
                _get("/roles"),
                _get(`/users${buildUserQuery("admin", adminSearch)}`),
            ]);

            setRoles(rolesResponse.data || []);
            setAdminUsers(adminUsersResponse.data.users || []);
        } catch (error) {
            toast.error("Unable to load admin management data.");
            console.error("Admin management load failed:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [adminSearch]);

    const adminRoleId = useMemo(() => {
        return roles.find((role) => role?.name === "admin")?.id;
    }, [roles]);

    const closeModal = () => {
        setIsModalOpen(false);
        setFormMode("");
        setFormUser(null);
        setFormData(emptyForm);
        setSavingUserId(null);
    };

    const openAddAdmin = () => {
        setFormMode("add");
        setFormUser(null);
        setFormData(emptyForm);
        setIsModalOpen(true);
    };

    const openEditAdmin = (user) => {
        setFormMode("edit");
        setFormUser(user);
        setFormData({
            first_name: user.first_name || "",
            middle_name: user.middle_name || "",
            last_name: user.last_name || "",
            username: user.username || "",
            contact_number: user.contact_number || "",
            email: user.email || "",
            password: "",
            confirmPassword: "",
        });
        setIsModalOpen(true);
    };

    const handleDeleteAdmin = async (userId) => {
        if (!window.confirm("Delete this admin account?")) return;

        setSavingUserId(userId);
        try {
            await _delete(`/users/${userId}`);
            toast.success("Admin removed.");
            await fetchAllData();
        } catch (error) {
            const message = error?.response?.data?.message || "Unable to delete admin.";
            toast.error(message);
        } finally {
            setSavingUserId(null);
        }
    };

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setFormData((state) => ({
            ...state,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const isAdd = formMode === "add";

        if (isAdd && !adminRoleId) {
            toast.error("Admin role is not available.");
            return;
        }

        if (formData.password && formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        if (isAdd && !formData.password) {
            toast.error("Password is required for new admin.");
            return;
        }

        if (isAdd && !formData.confirmPassword) {
            toast.error("Confirm password is required for new admin.");
            return;
        }

        const payload = {
            first_name: formData.first_name.trim(),
            middle_name: formData.middle_name.trim(),
            last_name: formData.last_name.trim(),
            username: formData.username.trim(),
            contact_number: formData.contact_number.trim(),
            email: formData.email.trim(),
        };

        if (formData.password) {
            payload.password = formData.password;
        }

        if (!isAdd && !formUser?.id) return;
        setSavingUserId(isAdd ? "new-admin" : formUser.id);

        try {
            if (isAdd) {
                const registerPayload = {
                    firstName: formData.first_name.trim(),
                    middleName: formData.middle_name.trim(),
                    lastName: formData.last_name.trim(),
                    contactNumber: formData.contact_number.trim(),
                    username: formData.username.trim(),
                    email: formData.email.trim(),
                    password: formData.password.trim(),
                    confirmPassword: formData.confirmPassword.trim(),
                    block: "",
                    lot: "",
                    street: "",
                    subdivision: "",
                    barangay: "",
                    city: "",
                    province: "",
                };

                const created = await _post("/register", registerPayload);
                const newAdminUser = created?.data?.user;

                if (!newAdminUser?.id) {
                    throw new Error("Failed to create admin account.");
                }

                await _post(`/users/${newAdminUser.id}/role`, { role_id: adminRoleId });
                toast.success("New admin created.");
            } else {
                await _put(`/users/${formUser.id}`, payload);
                toast.success("Admin updated.");
            }

            await fetchAllData();
            closeModal();
        } catch (error) {
            const message = error?.response?.data?.message || "Unable to save admin.";
            toast.error(message);
        } finally {
            setSavingUserId(null);
        }
    };

    const header = {
        title: "Admin Management",
        subTitle: "Manage admin accounts (assign/edit/delete admins).",
    };
    const isAddMode = formMode === "add";

    const breadcrumbs = [
        { name: "Settings", link: "/roles" },
        { name: "Admin Management", link: "/roles" },
    ];

    return (
        <Admin header={header} breadcrumbs={breadcrumbs}>
                <div className="w-full mx-auto flex flex-col gap-4 mt-4">
                <div className="w-full flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 rounded-lg border border-gray-100 bg-white">
                    <div className="w-full sm:max-w-[350px] flex items-center gap-3">
                        <p className="text-xs">Search admins</p>
                        <input
                            type="text"
                            value={adminSearch}
                            onChange={(event) => setAdminSearch(event.target.value)}
                            className="w-full bg-white placeholder:text-xs px-4 py-2 rounded border border-gray-200 text-sm"
                            placeholder="Search admins..."
                        />
                    </div>
                    <button
                        type="button"
                        onClick={openAddAdmin}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-2 rounded-md border border-orange-600 text-orange-600 text-xs hover:bg-orange-50"
                    >
                        <PlusCircle size={15} />
                        Add Admin
                    </button>
                </div>

                <div className="w-full overflow-x-auto rounded-lg border border-gray-200 bg-white">
                    <table className="w-full text-sm min-w-[720px]">
                        <thead className="bg-orange-500 text-white">
                            <tr>
                                <th className="p-3 text-left">Name</th>
                                <th className="p-3 text-left">Email</th>
                                <th className="p-3 text-left">Username</th>
                                <th className="p-3 text-left">Contact No.</th>
                                <th className="p-3 text-left">Role</th>
                                <th className="p-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-xs text-gray-500">
                                        Loading admins...
                                    </td>
                                </tr>
                            ) : adminUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-xs text-gray-500">
                                        No admins found.
                                    </td>
                                </tr>
                            ) : (
                                adminUsers.map((record) => (
                                    <tr key={record.id} className="text-xs odd:bg-orange-50">
                                        <td className="p-3">
                                            {record.first_name} {record.middle_name} {record.last_name}
                                        </td>
                                        <td className="p-3">{record.email}</td>
                                        <td className="p-3">{record.username || "-"}</td>
                                        <td className="p-3">{record.contact_number || "-"}</td>
                                        <td className="p-3 uppercase tracking-wide">
                                            {typeof record.role === "string" ? record.role : record?.role?.name}
                                        </td>
                                        <td className="p-3 flex justify-end gap-3">
                                            <button
                                                type="button"
                                                onClick={() => openEditAdmin(record)}
                                                className="text-blue-600 bg-transparent"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteAdmin(record.id)}
                                                disabled={savingUserId === record.id}
                                                className="text-red-600 bg-transparent"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/25 p-4 flex items-center justify-center">
                    <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg border border-gray-200">
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                            <p className="text-sm font-semibold">
                                {formMode === "add" ? "Add Admin" : "Edit Admin"}
                            </p>
                            <button type="button" onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-4">
                            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-xs">
                                            First Name <span className="text-red-500">*</span>
                                        </p>
                                        <input
                                            type="text"
                                            name="first_name"
                                            value={formData.first_name}
                                            onChange={handleFormChange}
                                            className="bg-white border border-gray-200 text-sm rounded px-4 py-2 w-full"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <p className="text-xs">Middle Name</p>
                                        <input
                                            type="text"
                                            name="middle_name"
                                            value={formData.middle_name}
                                            onChange={handleFormChange}
                                            className="bg-white border border-gray-200 text-sm rounded px-4 py-2 w-full"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-xs">
                                            Last Name <span className="text-red-500">*</span>
                                        </p>
                                        <input
                                            type="text"
                                            name="last_name"
                                            value={formData.last_name}
                                            onChange={handleFormChange}
                                            className="bg-white border border-gray-200 text-sm rounded px-4 py-2 w-full"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <p className="text-xs">
                                            Username <span className="text-red-500">*</span>
                                        </p>
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleFormChange}
                                            className="bg-white border border-gray-200 text-sm rounded px-4 py-2 w-full"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <p className="text-xs">
                                            Email <span className="text-red-500">*</span>
                                        </p>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleFormChange}
                                            className="bg-white border border-gray-200 text-sm rounded px-4 py-2 w-full"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <p className="text-xs">Contact Number</p>
                                        <input
                                            type="text"
                                            name="contact_number"
                                            value={formData.contact_number}
                                            onChange={handleFormChange}
                                            className="bg-white border border-gray-200 text-sm rounded px-4 py-2 w-full"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-xs">
                                            Password{" "}
                                            {isAddMode ? <span className="text-red-500">*</span> : <span>(leave blank to keep)</span>}
                                        </p>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleFormChange}
                                            className="bg-white border border-gray-200 text-sm rounded px-4 py-2 w-full"
                                            required={formMode === "add"}
                                        />
                                    </div>
                                    <div>
                                        <p className="text-xs">
                                            Confirm Password{" "}
                                            {isAddMode && <span className="text-red-500">*</span>}
                                        </p>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleFormChange}
                                            className="bg-white border border-gray-200 text-sm rounded px-4 py-2 w-full"
                                            required={formMode === "add"}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 rounded border border-gray-200 text-xs text-gray-600 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={savingUserId === (formMode === "add" ? "new-admin" : formUser?.id)}
                                        className="px-4 py-2 rounded text-xs text-white bg-orange-500 hover:bg-orange-600"
                                    >
                                        {savingUserId === (formMode === "add" ? "new-admin" : formUser?.id)
                                            ? "Saving..."
                                            : formMode === "add"
                                                ? "Create Admin"
                                                : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </Admin>
    );
};

export default Roles;
