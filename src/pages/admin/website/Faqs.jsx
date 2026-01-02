import { useCallback, useEffect, useState } from "react";
import Admin from "../../../layouts/Admin";
import { _get, _post, _put, _delete } from "../../../api";
import CircularLoading from "../../../components/CircularLoading";
import { Edit, Trash2, X } from "lucide-react";
import SuccesAlert from "../../../components/alerts/SuccesAlert";
import ConfirmationAlert from "../../../components/alerts/ConfirmationAlert";
import { toast } from "react-toastify";

const WebFaqs = () => {
    const [faqs, setFaqs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [editingFaq, setEditingFaq] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [faqToDelete, setFaqToDelete] = useState(null);
    const [formData, setFormData] = useState({
        question: "",
        answer: "",
        category: "general",
    });

    const fetchFaqs = useCallback(async (term = "") => {
        setLoading(true);
        try {
            const query = term ? `?search=${encodeURIComponent(term)}` : "";
            const response = await _get(`/faqs${query}`);
            setFaqs(response.data || []);
        } catch (error) {
            console.error("Error fetching FAQs:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFaqs();
    }, [fetchFaqs]);

    useEffect(() => {
        const handler = setTimeout(() => {
            fetchFaqs(searchTerm);
        }, 400);

        return () => clearTimeout(handler);
    }, [searchTerm, fetchFaqs]);

    const handleCreate = async (e) => {
        e.preventDefault();

        setSaving(true);
        try {
            setValidationErrors({});
            await _post("/faqs", formData);
            setSuccessMessage("FAQ added successfully.");
            setShowSuccessAlert(true);
            setShowCreateModal(false);
            setFormData({ question: "", answer: "", category: "general" });
            fetchFaqs(searchTerm);
        } catch (error) {
            console.error("Error creating FAQ:", error);
            if (error.response?.status === 422 && error.response?.data?.errors) {
                setValidationErrors(error.response.data.errors);
            } else {
                toast.error("Unable to save FAQ. Please try again.");
            }
        } finally {
            setSaving(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editingFaq) return;

        setSaving(true);
        try {
            setValidationErrors({});
            await _put(`/faqs/${editingFaq.id}`, formData);
            setSuccessMessage("FAQ updated successfully.");
            setShowSuccessAlert(true);
            setShowCreateModal(false);
            setEditingFaq(null);
            setFormData({ question: "", answer: "", category: "general" });
            fetchFaqs(searchTerm);
        } catch (error) {
            console.error("Error updating FAQ:", error);
            if (error.response?.status === 422 && error.response?.data?.errors) {
                setValidationErrors(error.response.data.errors);
            } else {
                toast.error("Unable to update FAQ. Please try again.");
            }
        } finally {
            setSaving(false);
        }
    };

    const openCreateModal = () => {
        setValidationErrors({});
        setEditingFaq(null);
        setFormData({ question: "", answer: "", category: "general" });
        setShowCreateModal(true);
    };

    const openEditModal = (faq) => {
        setValidationErrors({});
        setEditingFaq(faq);
        setFormData({
            question: faq.question || "",
            answer: faq.answer || "",
            category: faq.category || "general",
        });
        setShowCreateModal(true);
    };

    const handleDelete = async () => {
        if (!faqToDelete?.id) return;
        setDeletingId(faqToDelete.id);
        try {
            await _delete(`/faqs/${faqToDelete.id}`);
            setSuccessMessage("FAQ deleted successfully.");
            setShowSuccessAlert(true);
            setShowDeleteModal(false);
            setFaqToDelete(null);
            fetchFaqs(searchTerm);
        } catch (error) {
            console.error("Error deleting FAQ:", error);
            toast.error("Unable to delete FAQ. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    const header = {
        title: "Website FAQs",
        subTitle: "Manage the frequently asked questions shown on the public site"
    };

    const breadcrumbs = [
        { name: "Website Content", link: "/web-content" },
        { name: "FAQs", link: "/web-content/faqs" }
    ];

    return (
        <Admin header={header} breadcrumbs={breadcrumbs}>
            <div className="w-full mx-auto flex flex-col gap-4 mt-4">

                {/* TOP BAR */}
                <div className="w-full flex flex-col sm:flex-row gap-3 sm:gap-0 items-start sm:items-center justify-between p-4 rounded-lg border border-gray-100 bg-white">
                    <div className="w-full sm:max-w-[450px] flex items-center gap-3">
                        <p className="text-xs">Search</p>
                        <input
                            type="text"
                            className="w-full bg-white placeholder:text-xs px-4 py-2 rounded border border-gray-200 text-sm"
                            placeholder="Search FAQs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="px-4 py-2 text-xs rounded bg-orange-500 text-white hover:bg-orange-600 transition"
                    >
                        Add FAQ
                    </button>
                </div>

                {/* TABLE */}
                <div className="w-full overflow-x-auto rounded-lg border border-gray-200 bg-white">
                    <table className="w-full text-sm min-w-[900px]">
                        <thead className="bg-orange-500 text-white">
                            <tr>
                                <th className="p-3 text-left">Question</th>
                                <th className="p-3 text-left">Answer</th>
                                <th className="p-3 text-left">Category</th>
                                <th className="p-3 text-left">Updated</th>
                                <th className="p-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!loading ? (
                                faqs.length > 0 ? (
                                    faqs.map((row, index) => (
                                        <tr
                                            key={row.id ?? index}
                                            className={`text-xs ${index % 2 === 0 ? "bg-orange-50" : ""}`}
                                        >
                                            <td className="p-3 text-gray-700">{row.question}</td>
                                            <td className="p-3 text-gray-700">{row.answer}</td>
                                            <td className="p-3 capitalize">{row.category || "Uncategorized"}</td>
                                            <td className="p-3 text-gray-500">{row.updated_at ? new Date(row.updated_at).toLocaleDateString() : "-"}</td>
                                            <td className="p-3 flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(row)}
                                                    className="bg-blue-50 text-blue-600 px-1 py-1 rounded"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setFaqToDelete(row);
                                                        setShowDeleteModal(true);
                                                    }}
                                                    className="bg-red-50 text-red-600 px-1 py-1 rounded disabled:opacity-60"
                                                    disabled={deletingId === row.id}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-xs text-gray-500">
                                            No FAQs found.
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

            </div>

            {/* CREATE FAQ MODAL */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-base font-semibold text-gray-800">{editingFaq ? "Edit FAQ" : "Add FAQ"}</h3>
                                <p className="text-xs text-gray-500">{editingFaq ? "Update this frequently asked question." : "Create a new frequently asked question."}</p>
                            </div>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="w-6 h-6 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 text-sm"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <form className="flex flex-col gap-4" onSubmit={editingFaq ? handleUpdate : handleCreate}>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-gray-700">Question</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-orange-200 outline-none"
                                    placeholder="Enter the question"
                                    value={formData.question}
                                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                />
                                {validationErrors.question && (
                                    <p className="text-xs text-red-500">{validationErrors.question[0]}</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-gray-700">Answer</label>
                                <textarea
                                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm h-28 resize-none focus:ring-2 focus:ring-orange-200 outline-none"
                                    placeholder="Enter the answer"
                                    value={formData.answer}
                                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                                />
                                {validationErrors.answer && (
                                    <p className="text-xs text-red-500">{validationErrors.answer[0]}</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
                                <span className="text-xs font-semibold text-gray-700">Category</span>
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2 text-sm text-gray-700">
                                        <input
                                            type="radio"
                                            name="category"
                                            value="general"
                                            checked={formData.category === "general"}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        />
                                        General question
                                    </label>
                                    <label className="flex items-center gap-2 text-sm text-gray-700">
                                        <input
                                            type="radio"
                                            name="category"
                                            value="donation"
                                            checked={formData.category === "donation"}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        />
                                        Donation related
                                    </label>
                                </div>
                                {validationErrors.category && (
                                    <p className="text-xs text-red-500">{validationErrors.category[0]}</p>
                                )}
                            </div>

                            <div className="flex items-center justify-end gap-3 mt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        setEditingFaq(null);
                                    }}
                                    className="px-4 py-2 text-xs rounded border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={`px-4 py-2 text-xs rounded text-white transition ${saving ? "bg-orange-300 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"}`}
                                    disabled={saving}
                                >
                                    {saving ? "Saving..." : editingFaq ? "Update FAQ" : "Save FAQ"}
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
                        setFaqToDelete(null);
                    }}
                    onConfirm={handleDelete}
                    title="Delete FAQ"
                    message="Are you sure you want to delete this FAQ? This action cannot be undone."
                    isDelete={true}
                    isDeleting={deletingId === faqToDelete?.id}
                />
            )}
        </Admin>
    );
};

export default WebFaqs;
