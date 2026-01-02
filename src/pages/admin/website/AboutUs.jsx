import { useEffect, useMemo, useState } from "react";
import Admin from "../../../layouts/Admin";
import { _get, _post, _delete } from "../../../api";
import CircularLoading from "../../../components/CircularLoading";
import SuccesAlert from "../../../components/alerts/SuccesAlert";
import ConfirmationAlert from "../../../components/alerts/ConfirmationAlert";
import { Edit, Trash2, Plus } from "lucide-react";
import { toast } from "react-toastify";

const emptyForm = {
    name: "",
    position: "",
    image: null,
    preview: "",
    existingImage: "",
};

const WebAboutUs = () => {
    const [officers, setOfficers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingOfficer, setEditingOfficer] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const [formData, setFormData] = useState(emptyForm);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [officerToDelete, setOfficerToDelete] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const fetchOfficers = async () => {
        setLoading(true);
        try {
            const response = await _get("/officers");
            setOfficers(response.data || []);
        } catch (error) {
            console.error("Error fetching officers:", error);
            toast.error("Unable to load officers.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOfficers();
    }, []);

    const modalHasChanges = useMemo(() => {
        if (!showModal) return false;
        if (!editingOfficer) {
            return Boolean(formData.name || formData.position || formData.image);
        }
        const baseChanged =
            formData.name !== (editingOfficer?.name || "") ||
            formData.position !== (editingOfficer?.position || "");
        return baseChanged || Boolean(formData.image);
    }, [editingOfficer, formData.image, formData.name, formData.position, showModal]);

    const resetForm = () => {
        setFormData(emptyForm);
        setValidationErrors({});
        setEditingOfficer(null);
    };

    const openCreateModal = () => {
        resetForm();
        setShowModal(true);
    };

    const openEditModal = (officer) => {
        setValidationErrors({});
        setEditingOfficer(officer);
        setFormData({
            name: officer.name || "",
            position: officer.position || "",
            image: null,
            preview: "",
            existingImage: officer.image || "",
        });
        setShowModal(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setFormData((prev) => ({
            ...prev,
            image: file,
            preview: URL.createObjectURL(file),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!modalHasChanges) return;

        setSaving(true);
        const payload = new FormData();
        payload.append("name", formData.name);
        payload.append("position", formData.position);
        if (formData.image) {
            payload.append("image", formData.image);
        }

        try {
            setValidationErrors({});
            if (editingOfficer) {
                await _post(`/officers/${editingOfficer.id}?_method=PUT`, payload);
                setSuccessMessage("Officer updated successfully.");
            } else {
                await _post("/officers", payload);
                setSuccessMessage("Officer added successfully.");
            }
            setShowSuccessAlert(true);
            setShowModal(false);
            resetForm();
            fetchOfficers();
        } catch (error) {
            console.error("Error saving officer:", error);
            if (error.response?.status === 422 && error.response?.data?.errors) {
                setValidationErrors(error.response.data.errors);
            } else {
                toast.error("Unable to save officer. Please try again.");
            }
        } finally {
            setSaving(false);
        }
    };

    const handleConfirmDelete = (officer) => {
        setOfficerToDelete(officer);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (!officerToDelete?.id) return;
        setDeletingId(officerToDelete.id);
        try {
            await _delete(`/officers/${officerToDelete.id}`);
            setSuccessMessage("Officer deleted successfully.");
            setShowSuccessAlert(true);
            setShowDeleteModal(false);
            setOfficerToDelete(null);
            fetchOfficers();
        } catch (error) {
            console.error("Error deleting officer:", error);
            toast.error("Unable to delete officer. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    const header = {
        title: "Officers",
        subTitle: "Manage the leadership profiles shown on the About Us page",
    };

    const breadcrumbs = [
        { name: "Website Content", link: "/web-content" },
        { name: "Officers", link: "/web-content/about-us" },
    ];

    return (
        <Admin header={header} breadcrumbs={breadcrumbs}>
            <div className="w-full max-w-6xl mx-auto mt-4">
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">Officers</h2>
                            <p className="text-xs text-gray-500">Add, edit, or remove officers shown on the site.</p>
                        </div>
                        <button
                            onClick={openCreateModal}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-xs rounded bg-orange-500 text-white hover:bg-orange-600 transition"
                        >
                            <Plus size={16} />
                            Add Officer
                        </button>
                    </div>

                    {loading ? (
                        <div className="py-12 flex items-center justify-center">
                            <CircularLoading customClass="text-orange-500 w-6 h-6" />
                        </div>
                    ) : officers.length === 0 ? (
                        <div className="py-12 text-center text-sm text-gray-500">
                            <p className="mb-3">No officers have been added yet.</p>
                            <button
                                onClick={openCreateModal}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs rounded bg-orange-500 text-white hover:bg-orange-600 transition"
                            >
                                <Plus size={16} />
                                Add the first officer
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {officers.map((officer) => {
                                const imageSrc = officer.photo_url || "";
                                return (
                                    <div key={officer.id} className="border border-gray-200 rounded-lg p-4 flex flex-col gap-3 shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-14 h-14 rounded-full bg-orange-50 overflow-hidden flex items-center justify-center text-sm font-semibold text-orange-600">
                                                {imageSrc ? (
                                                    <img
                                                        src={imageSrc}
                                                        alt={officer.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    officer.name?.slice(0, 2)?.toUpperCase() || "OF"
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">{officer.position}</p>
                                                <p className="text-sm font-semibold text-gray-800">{officer.name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openEditModal(officer)}
                                                className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs inline-flex items-center gap-1"
                                            >
                                                <Edit size={14} />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleConfirmDelete(officer)}
                                                className="bg-red-50 text-red-600 px-2 py-1 rounded text-xs inline-flex items-center gap-1 disabled:opacity-60"
                                                disabled={deletingId === officer.id}
                                            >
                                                <Trash2 size={14} />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* CREATE / EDIT MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-base font-semibold text-gray-800">{editingOfficer ? "Edit Officer" : "Add Officer"}</h3>
                                <p className="text-xs text-gray-500">{editingOfficer ? "Update officer details." : "Create a new officer entry."}</p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    resetForm();
                                }}
                                className="text-gray-500 hover:text-gray-700 text-sm"
                            >
                                x
                            </button>
                        </div>

                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-gray-700">Position</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-orange-200 outline-none"
                                    placeholder="e.g., President"
                                    value={formData.position}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, position: e.target.value }))}
                                />
                                {validationErrors.position && (
                                    <p className="text-xs text-red-500">{validationErrors.position[0]}</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-gray-700">Name</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-orange-200 outline-none"
                                    placeholder="e.g., Jane Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                />
                                {validationErrors.name && (
                                    <p className="text-xs text-red-500">{validationErrors.name[0]}</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-gray-700">Photo</label>
                                <div className="flex items-center gap-3">
                                    <div className="w-16 h-16 rounded-full bg-orange-50 overflow-hidden flex items-center justify-center text-xs text-orange-600">
                                        {(formData.preview || formData.existingImage) ? (
                                            <img
                                                src={formData.preview || formData.existingImage}
                                                alt="Officer"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            "No Image"
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="w-full text-xs"
                                        />
                                        <p className="text-[11px] text-gray-500 mt-1">Upload a square image for best results.</p>
                                        {validationErrors.image && (
                                            <p className="text-xs text-red-500">{validationErrors.image[0]}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 mt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        resetForm();
                                    }}
                                    className="px-4 py-2 text-xs rounded border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={`px-4 py-2 text-xs rounded text-white transition ${saving || !modalHasChanges ? "bg-orange-300 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"}`}
                                    disabled={saving || !modalHasChanges}
                                >
                                    {saving ? "Saving..." : editingOfficer ? "Update Officer" : "Save Officer"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showSuccessAlert && (
                <SuccesAlert
                    message={successMessage || "Success!"}
                    onClose={() => setShowSuccessAlert(false)}
                />
            )}

            {showDeleteModal && (
                <ConfirmationAlert
                    onClose={() => {
                        setShowDeleteModal(false);
                        setOfficerToDelete(null);
                    }}
                    onConfirm={handleDelete}
                    title="Delete Officer"
                    message="Are you sure you want to delete this officer? This action cannot be undone."
                    isDelete={true}
                    isDeleting={deletingId === officerToDelete?.id}
                />
            )}
        </Admin>
    );
};

export default WebAboutUs;
