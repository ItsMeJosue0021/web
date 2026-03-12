import { useCallback, useEffect, useMemo, useState } from "react";
import { Edit, Plus, Trash2, X } from "lucide-react";
import { toast } from "react-toastify";
import Admin from "../../layouts/Admin";
import { _delete, _get, _post, _put } from "../../api";
import CircularLoading from "../../components/CircularLoading";
import SuccesAlert from "../../components/alerts/SuccesAlert";
import ConfirmationAlert from "../../components/alerts/ConfirmationAlert";

const emptyForms = {
    itemName: { name: "" },
    category: { name: "" },
    subcategory: { name: "", g_d_category_id: "" },
    unit: { unit: "", description: "" },
};

const resourceConfig = {
    itemName: {
        title: "Item name",
        endpoint: "/item-names",
        createMessage: "Item name added successfully.",
        updateMessage: "Item name updated successfully.",
        deleteMessage: "Item name deleted successfully.",
        deleteTitle: "Delete Item Name",
        deletePrompt: "Are you sure you want to delete this item name? This action cannot be undone.",
    },
    category: {
        title: "Category",
        endpoint: "/goods-donation-categories",
        createMessage: "Category added successfully.",
        updateMessage: "Category updated successfully.",
        deleteMessage: "Category deleted successfully.",
        deleteTitle: "Delete Category",
        deletePrompt: "Are you sure you want to delete this category?",
    },
    subcategory: {
        title: "Subcategory",
        endpoint: "/goods-donation-subcategories",
        createMessage: "Subcategory added successfully.",
        updateMessage: "Subcategory updated successfully.",
        deleteMessage: "Subcategory deleted successfully.",
        deleteTitle: "Delete Subcategory",
        deletePrompt: "Are you sure you want to delete this subcategory?",
    },
    unit: {
        title: "Unit",
        endpoint: "/units",
        createMessage: "Unit added successfully.",
        updateMessage: "Unit updated successfully.",
        deleteMessage: "Unit deleted successfully.",
        deleteTitle: "Delete Unit",
        deletePrompt: "Are you sure you want to delete this unit?",
    },
};

const DonationResources = () => {
    const [itemNames, setItemNames] = useState([]);
    const [categories, setCategories] = useState([]);
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [modalState, setModalState] = useState({ type: null, mode: "create" });
    const [editingRecord, setEditingRecord] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const [formData, setFormData] = useState(emptyForms.itemName);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const fetchResources = useCallback(async () => {
        setLoading(true);
        try {
            const [itemNameResponse, categoryResponse, unitResponse] = await Promise.all([
                _get("/item-names"),
                _get("/goods-donation-categories"),
                _get("/units"),
            ]);

            setItemNames(itemNameResponse.data?.item_names || []);
            setCategories(categoryResponse.data?.categories || []);
            setUnits(unitResponse.data?.units || unitResponse.data || []);
        } catch (error) {
            console.error("Error loading donation resources:", error);
            toast.error("Unable to load donation resources.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchResources();
    }, [fetchResources]);

    const subcategories = useMemo(
        () =>
            categories.flatMap((category) =>
                (category.subcategories || []).map((subcategory) => ({
                    ...subcategory,
                    category_name: category.name,
                }))
            ),
        [categories]
    );

    const closeModal = () => {
        setModalState({ type: null, mode: "create" });
        setEditingRecord(null);
        setValidationErrors({});
    };

    const openCreateModal = (type) => {
        setValidationErrors({});
        setEditingRecord(null);
        setModalState({ type, mode: "create" });
        setFormData({ ...emptyForms[type] });
    };

    const openEditModal = (type, record) => {
        setValidationErrors({});
        setEditingRecord(record);
        setModalState({ type, mode: "edit" });

        if (type === "subcategory") {
            setFormData({
                name: record.name || "",
                g_d_category_id: `${record.g_d_category_id || record.category?.id || ""}`,
            });
            return;
        }
        if (type === "unit") {
            setFormData({
                unit: record.unit || "",
                description: record.description || "",
            });
            return;
        }

        setFormData({
            name: record.name || "",
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();

        const config = resourceConfig[modalState.type];
        if (!config) return;

        setSaving(true);
        setValidationErrors({});

        try {
            if (modalState.mode === "edit" && editingRecord?.id) {
                await _put(`${config.endpoint}/${editingRecord.id}`, formData);
                setSuccessMessage(config.updateMessage);
            } else {
                await _post(config.endpoint, formData);
                setSuccessMessage(config.createMessage);
            }

            setShowSuccessAlert(true);
            closeModal();
            await fetchResources();
        } catch (error) {
            console.error(`Error saving ${modalState.type}:`, error);
            if (error.response?.status === 422 && error.response?.data?.errors) {
                setValidationErrors(error.response.data.errors);
            } else {
                toast.error(error.response?.data?.message || "Unable to save this resource.");
            }
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget?.record?.id) return;

        const config = resourceConfig[deleteTarget.type];
        setDeleting(true);

        try {
            await _delete(`${config.endpoint}/${deleteTarget.record.id}`);
            setSuccessMessage(config.deleteMessage);
            setShowSuccessAlert(true);
            setDeleteTarget(null);
            await fetchResources();
        } catch (error) {
            console.error(`Error deleting ${deleteTarget.type}:`, error);
            toast.error(error.response?.data?.message || "Unable to delete this resource.");
        } finally {
            setDeleting(false);
        }
    };

    const header = {
        title: "Donation Resources",
        subTitle: "Manage item names, categories, and subcategories used by goods donations and inventory.",
    };

    const breadcrumbs = [
        { name: "Settings", link: "/settings/chatbot" },
        { name: "Donation Resources", link: "/settings/donation-resources" },
    ];

    const currentConfig = modalState.type ? resourceConfig[modalState.type] : null;

    return (
        <Admin header={header} breadcrumbs={breadcrumbs}>
            <div className="w-full mx-auto flex flex-col gap-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Item names</p>
                        <p className="mt-2 text-2xl font-semibold text-gray-900">{itemNames.length}</p>
                        <p className="text-xs text-gray-500">Saved item name suggestions</p>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Units</p>
                        <p className="mt-2 text-2xl font-semibold text-gray-900">{units.length}</p>
                        <p className="text-xs text-gray-500">Unit choices for item quantities</p>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Categories</p>
                        <p className="mt-2 text-2xl font-semibold text-gray-900">{categories.length}</p>
                        <p className="text-xs text-gray-500">Donation and inventory groups</p>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Subcategories</p>
                        <p className="mt-2 text-2xl font-semibold text-gray-900">{subcategories.length}</p>
                        <p className="text-xs text-gray-500">Category-specific donation types</p>
                    </div>
                </div>

                {loading ? (
                    <div className="w-full h-52 flex items-center justify-center">
                        <CircularLoading customClass="text-blue-500 w-6 h-6" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
                            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">Item Names</p>
                                    <p className="text-xs text-gray-500">Autocomplete options used in the public donation form.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => openCreateModal("itemName")}
                                    className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-3 py-2 text-xs font-medium text-white hover:bg-orange-600"
                                >
                                    <Plus size={14} />
                                    Add
                                </button>
                            </div>
                            <div className="max-h-[440px] overflow-y-auto">
                                {itemNames.length === 0 ? (
                                    <div className="p-6 text-xs text-gray-500">No item names saved yet.</div>
                                ) : (
                                    <table className="w-full text-sm">
                                        <thead className="sticky top-0 border-b border-gray-100 bg-white">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">Name</th>
                                                <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-gray-500">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {itemNames.map((itemName, index) => (
                                                <tr key={itemName.id} className={index % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                                                    <td className="px-4 py-3 text-xs text-gray-700">{itemName.name}</td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => openEditModal("itemName", itemName)}
                                                                className="rounded-md bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                                                            >
                                                                <Edit size={14} />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => setDeleteTarget({ type: "itemName", record: itemName })}
                                                                className="rounded-md bg-red-50 p-2 text-red-600 hover:bg-red-100"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </section>

                        <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
                            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">Units</p>
                                    <p className="text-xs text-gray-500">Units used for goods donation quantities.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => openCreateModal("unit")}
                                    className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-3 py-2 text-xs font-medium text-white hover:bg-orange-600"
                                >
                                    <Plus size={14} />
                                    Add
                                </button>
                            </div>
                            <div className="max-h-[440px] overflow-y-auto">
                                {units.length === 0 ? (
                                    <div className="p-6 text-xs text-gray-500">No units saved yet.</div>
                                ) : (
                                    <table className="w-full text-sm">
                                        <thead className="sticky top-0 border-b border-gray-100 bg-white">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">Unit</th>
                                                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">Description</th>
                                                <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-gray-500">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {units.map((unitRecord, index) => (
                                                <tr key={unitRecord.id} className={index % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                                                    <td className="px-4 py-3 text-xs font-medium text-gray-800">{unitRecord.unit}</td>
                                                    <td className="px-4 py-3 text-xs text-gray-700">{unitRecord.description}</td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => openEditModal("unit", unitRecord)}
                                                                className="rounded-md bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                                                            >
                                                                <Edit size={14} />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => setDeleteTarget({ type: "unit", record: unitRecord })}
                                                                className="rounded-md bg-red-50 p-2 text-red-600 hover:bg-red-100"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </section>

                        <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
                            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">Categories</p>
                                    <p className="text-xs text-gray-500">Top-level groups used by goods donations and inventory.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => openCreateModal("category")}
                                    className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-3 py-2 text-xs font-medium text-white hover:bg-orange-600"
                                >
                                    <Plus size={14} />
                                    Add
                                </button>
                            </div>
                            <div className="max-h-[440px] overflow-y-auto">
                                {categories.length === 0 ? (
                                    <div className="p-6 text-xs text-gray-500">No categories saved yet.</div>
                                ) : (
                                    <table className="w-full text-sm">
                                        <thead className="sticky top-0 border-b border-gray-100 bg-white">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">Category</th>
                                                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">Subcategories</th>
                                                <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-gray-500">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {categories.map((category, index) => (
                                                <tr key={category.id} className={index % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                                                    <td className="px-4 py-3 align-top text-xs font-medium text-gray-800">{category.name}</td>
                                                    <td className="px-4 py-3 align-top">
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {(category.subcategories || []).length > 0 ? (
                                                                category.subcategories.map((subcategory) => (
                                                                    <span key={subcategory.id} className="rounded-full border border-orange-100 bg-orange-50 px-2 py-1 text-[11px] text-orange-700">
                                                                        {subcategory.name}
                                                                    </span>
                                                                ))
                                                            ) : (
                                                                <span className="text-[11px] text-gray-400">No subcategories</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 align-top">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => openEditModal("category", category)}
                                                                className="rounded-md bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                                                            >
                                                                <Edit size={14} />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => setDeleteTarget({ type: "category", record: category })}
                                                                className="rounded-md bg-red-50 p-2 text-red-600 hover:bg-red-100"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </section>

                        <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
                            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">Subcategories</p>
                                    <p className="text-xs text-gray-500">Detailed types nested under each category.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => openCreateModal("subcategory")}
                                    disabled={categories.length === 0}
                                    className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium text-white ${categories.length === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"}`}
                                >
                                    <Plus size={14} />
                                    Add
                                </button>
                            </div>
                            <div className="max-h-[440px] overflow-y-auto">
                                {subcategories.length === 0 ? (
                                    <div className="p-6 text-xs text-gray-500">No subcategories saved yet.</div>
                                ) : (
                                    <table className="w-full text-sm">
                                        <thead className="sticky top-0 border-b border-gray-100 bg-white">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">Subcategory</th>
                                                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">Category</th>
                                                <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-gray-500">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {subcategories.map((subcategory, index) => (
                                                <tr key={subcategory.id} className={index % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                                                    <td className="px-4 py-3 text-xs text-gray-700">{subcategory.name}</td>
                                                    <td className="px-4 py-3 text-xs text-gray-500">{subcategory.category_name || subcategory.category?.name || "-"}</td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => openEditModal("subcategory", subcategory)}
                                                                className="rounded-md bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                                                            >
                                                                <Edit size={14} />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => setDeleteTarget({ type: "subcategory", record: subcategory })}
                                                                className="rounded-md bg-red-50 p-2 text-red-600 hover:bg-red-100"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </section>
                    </div>
                )}
            </div>

            {currentConfig && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-base font-semibold text-gray-900">
                                    {modalState.mode === "edit" ? `Edit ${currentConfig.title}` : `Add ${currentConfig.title}`}
                                </h2>
                                <p className="text-xs text-gray-500">
                                    {modalState.type === "subcategory"
                                        ? "Choose the parent category, then enter the subcategory name."
                                        : "Enter the details below and save your changes."}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="rounded-full bg-gray-100 p-1.5 text-gray-500 hover:bg-gray-200"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <form className="flex flex-col gap-4" onSubmit={handleSave}>
                                {modalState.type === "subcategory" && (
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-semibold text-gray-700">Category</label>
                                    <select
                                        value={formData.g_d_category_id}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, g_d_category_id: e.target.value }))}
                                        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                                    >
                                        <option value="">Select category...</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                        <p className="min-h-[16px] text-xs text-red-500">{validationErrors.g_d_category_id?.[0] || ""}</p>
                                    </div>
                                )}

                                {modalState.type === "unit" && (
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-semibold text-gray-700">Unit</label>
                                        <input
                                            type="text"
                                            value={formData.unit}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, unit: e.target.value }))}
                                            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                                            placeholder="Enter unit code (e.g. kg)"
                                        />
                                        <p className="min-h-[16px] text-xs text-red-500">{validationErrors.unit?.[0] || ""}</p>
                                    </div>
                                )}

                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold text-gray-700">
                                        {modalState.type === "unit" ? "Description" : modalState.type === "itemName" ? "Item name" : "Name"}
                                    </label>
                                    <input
                                        type="text"
                                        value={modalState.type === "unit" ? formData.description : formData.name}
                                        onChange={(e) =>
                                            setFormData((prev) =>
                                                modalState.type === "unit" ? { ...prev, description: e.target.value } : { ...prev, name: e.target.value }
                                            )
                                        }
                                        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                                        placeholder={
                                            modalState.type === "unit"
                                                ? "Enter unit description"
                                                : modalState.type === "itemName"
                                                    ? "Enter item name"
                                                    : modalState.type === "category"
                                                        ? "Enter category name"
                                                        : "Enter subcategory name"
                                        }
                                    />
                                    <p className="min-h-[16px] text-xs text-red-500">
                                        {modalState.type === "unit" ? validationErrors.description?.[0] || "" : validationErrors.name?.[0] || ""}
                                    </p>
                                </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-md border border-gray-200 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className={`rounded-md px-4 py-2 text-xs font-medium text-white ${saving ? "bg-orange-300 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"}`}
                                >
                                    {saving ? "Saving..." : modalState.mode === "edit" ? "Update" : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deleteTarget && (
                <ConfirmationAlert
                    onClose={() => setDeleteTarget(null)}
                    onConfirm={handleDelete}
                    title={resourceConfig[deleteTarget.type].deleteTitle}
                    message={resourceConfig[deleteTarget.type].deletePrompt}
                    isDelete={true}
                    isDeleting={deleting}
                />
            )}

            {showSuccessAlert && (
                <SuccesAlert
                    message={successMessage || "Success!"}
                    onClose={() => setShowSuccessAlert(false)}
                />
            )}
        </Admin>
    );
};

export default DonationResources;
