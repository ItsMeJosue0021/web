import '../../css/loading.css'; 
import Admin from "../../layouts/Admin";
import { useEffect, useState } from "react";
import { _delete, _get, _post, _put } from "../../api";
import CircularLoading from "../../components/CircularLoading";
import { Edit, HandCoins, Mail, Trash2, X, Search, Filter, Coins } from "lucide-react";
import ConfirmationAlert from '../../components/alerts/ConfirmationAlert';
import ModalContainer from '../../components/ModalContainer';
import { toast } from "react-toastify";

const Expenses = () => {

    const baseURL = "https://api.kalingangkababaihan.com/storage/";

    const [loading, setLoading] = useState(false);
    const [expenses, setExpenses] = useState([]);
    const [totals, setTotals] = useState({
        totalMonetaryDonations: 0,
        totalExpenses: 0
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [deleteId, setDeleteId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isPrintOpen, setIsPrintOpen] = useState(false);
    const [printUrl, setPrintUrl] = useState("");
    const [printFilename, setPrintFilename] = useState("");
    const [printLoading, setPrintLoading] = useState(false);

    // add modal states
    const [form, setForm] = useState({
        name: "",
        description: "",
        amount: "",
        date_incurred: "",
        payment_method: "",
        notes: "",
        attachment: null,
    });
    const [validationErrors, setValidationErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [attachmentPreview, setAttachmentPreview] = useState(null);

    // edit modal states
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    amount: "",
    date_incurred: "",
    payment_method: "",
    notes: "",
    attachment: null,
    });
    const [editValidationErrors, setEditValidationErrors] = useState({});
    const [isUpdating, setIsUpdating] = useState(false);
    const [editAttachmentPreview, setEditAttachmentPreview] = useState(null);

    // bulk edit states
    const [editItems, setEditItems] = useState([]);
    const [editItemForm, setEditItemForm] = useState({
        name: "",
        description: "",
        quantity: 1,
        unit_price: "",
        image: null,
    });
    const [editItemPreview, setEditItemPreview] = useState(null);
    const [deletingItemId, setDeletingItemId] = useState(null);


    useEffect(() => {
        fetchExpenses();
        fetchTotals();
    }, []);

    // fetch expenses
    const fetchExpenses = async ({ start = "", end = "" } = {}) => {
        setLoading(true);
        try {
            const params = {};
            if (start) params.start_date = start;
            if (end) params.end_date = end;
            const response = await _get('/expenditures', { params });
            if (response && response.data) {
                setExpenses(response.data.expenditures);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }   
    }

    // fetch totals
    const fetchTotals = async () => {
        try {
            const response = await _get('/expenditures/totals'); 
            if (response && response.data) {
                setTotals({
                    totalMonetaryDonations: response.data.total_monetary_donations,
                    totalExpenses: response.data.total_expenditures
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    // delete expense
    const deleteExpense = async (id) => {
        setIsDeleting(true);
        try {
            const response = await _delete(`/expenditures/${id}`);
            if (response.status === 200) {
                fetchExpenses();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsDeleting(false);
            setDeleteId(null);
        }
    }

    // add near other hooks
    const handleSearch = async (value) => {
        setSearchQuery(value);
        if (!value.trim()) {
            fetchExpenses({ start: startDate, end: endDate });
            return;
        }

        setLoading(true);
        try {
            const res = await _get(`/expenditures/search?q=${value}`, {
                params: { search: value, start_date: startDate || undefined, end_date: endDate || undefined },
            });
            setExpenses(res.data.expenditures || res.data);
        } catch (err) {
            console.error("Search failed:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleApplyDateFilter = () => {
        fetchExpenses({ start: startDate, end: endDate });
    };

    const handleClearDateFilter = () => {
        setStartDate("");
        setEndDate("");
        fetchExpenses({ start: "", end: "" });
    };

    const handlePrint = async () => {
        setPrintLoading(true);
        try {
            const params = {};
            if (startDate) params.start_date = startDate;
            if (endDate) params.end_date = endDate;
            const fileResponse = await _get("/expenditures/print", { params, responseType: "blob" });
            const blobUrl = URL.createObjectURL(fileResponse.data);
            if (printUrl) {
                URL.revokeObjectURL(printUrl);
            }
            setPrintUrl(blobUrl);
            setPrintFilename("expenses.pdf");
            setIsPrintOpen(true);
        } catch (error) {
            console.error("Error generating expense report:", error);
            toast.error("Unable to generate the report.");
        } finally {
            setPrintLoading(false);
        }
    };

    const handleExpensePrint = async (expenseId) => {
        if (!expenseId) return;
        setPrintLoading(true);
        try {
            const fileResponse = await _get(`/expenditures/${expenseId}/print`, { responseType: "blob" });
            const blobUrl = URL.createObjectURL(fileResponse.data);
            if (printUrl) {
                URL.revokeObjectURL(printUrl);
            }
            setPrintUrl(blobUrl);
            setPrintFilename(`expense-${expenseId}.pdf`);
            setIsPrintOpen(true);
        } catch (error) {
            console.error("Error generating expense report:", error);
            toast.error("Unable to generate the report.");
        } finally {
            setPrintLoading(false);
        }
    };

    const handleAddExpense = async (e) => {
        e.preventDefault();
        setValidationErrors({});
        setIsSaving(true);

        try {
            const data = new FormData();
            data.append("name", form.name);
            data.append("description", form.description);
            data.append("amount", form.amount);
            data.append("date_incurred", form.date_incurred);
            data.append("payment_method", form.payment_method);
            data.append("notes", form.notes);
            if (form.attachment) data.append("attachment", form.attachment);

            const res = await _post("/expenditures", data);

            if (res.status === 201 || res.status === 200) {
            fetchExpenses(); // refresh list
            setOpenAddModal(false);
            setForm({
                name: "",
                description: "",
                amount: "",
                date_incurred: "",
                payment_method: "",
                notes: "",
                attachment: null,
            });
            }
        } catch (error) {
            if (error.response?.data?.errors) {
            setValidationErrors(error.response.data.errors);
            } else {
            console.error("Error saving expense:", error);
            }
        } finally {
            setIsSaving(false);
        }
    };

    const openEdit = (expense) => {
        setEditId(expense.id);
        setEditValidationErrors({});
        setEditAttachmentPreview(expense.attachment ? `${baseURL}${expense.attachment}` : null);

        setEditForm({
            name: expense.name || "",
            description: expense.description || "",
            amount: expense.amount ?? "",
            date_incurred: expense.date_incurred || "",
            payment_method: expense.payment_method || "",
            notes: expense.notes || "",
            attachment: null,
        });

        setEditItems(
            (expense.items || []).map((it) => ({
            // keep existing items; no new file unless user picks one
                id: it.id || "",
                name: it.name || "",
                description: it.description || "",
                quantity: it.quantity ?? 1,
                unit_price: it.unit_price ?? "",
                image: null, // no file object yet
                existingImage: it.image ? `${baseURL}${it.image}` : null, // for preview only
            }))
        );

        setOpenEditModal(true);
    };

    const handleUpdateExpense = async (e) => {
        e.preventDefault();
        setEditValidationErrors({});
        setIsUpdating(true);

        try {
            const data = new FormData();
            data.append("_method", "PUT");
            data.append("name", editForm.name);
            data.append("description", editForm.description);
            data.append("amount", editForm.amount);
            data.append("date_incurred", editForm.date_incurred);
            data.append("payment_method", editForm.payment_method);
            data.append("notes", editForm.notes);
            if (editForm.attachment) data.append("attachment", editForm.attachment);

            editItems.forEach((item, idx) => {
                if (item.id) data.append(`items[${idx}][id]`, item.id); // keep existing
                data.append(`items[${idx}][name]`, item.name);
                data.append(`items[${idx}][description]`, item.description || "");
                data.append(`items[${idx}][quantity]`, item.quantity);
                data.append(`items[${idx}][unit_price]`, item.unit_price);
                if (item.image) {
                    data.append(`items[${idx}][image]`, item.image); // only when changed
                }
            });

            const res = await _post(`/expenditures/${editId}`, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.status === 200) {
                fetchExpenses();
                setOpenEditModal(false);
                setEditId(null);
                setEditForm({ 
                    name: "", 
                    description: "", 
                    amount: "", 
                    date_incurred: "", 
                    payment_method: "", 
                    notes: "", 
                    attachment: null 
                });
                setEditAttachmentPreview(null);
                setEditItems([]);
                setEditItemPreview(null);
            }
        } catch (error) {
            if (error.response?.data?.errors) setEditValidationErrors(error.response.data.errors);
            else console.error("Error updating expense:", error);
        } finally {
            setIsUpdating(false);
        }
    };


    const [editItemError, setEditItemError] = useState("");

    const addEditItem = () => {
        if (!editItemForm.name.trim() || !editItemForm.unit_price || !editItemForm.image) {
            setEditItemError("Item name, unit price, and attachment are required.");
            return;
        }
        setEditItemError("");

        setEditItems([...editItems, editItemForm]);
        setEditItemForm({ name: "", description: "", quantity: 1, unit_price: "", image: null });
        setEditItemPreview(null);
    };


    const removeEditItem = (idx, item_id) => {
        setEditItems(editItems.filter((_, i) => i !== idx));
        if (item_id) {
            deleteItem(item_id);
        }
    };

    const deleteItem = async (item_id) => {
        setDeletingItemId(item_id);
        try {
            await _delete(`/expenditure-items/${item_id}`);
        } catch (error) {
            console.log(error);
        } finally {
            setDeletingItemId(null);
        }
    }

    const canAddItem =
    editItemForm.name.trim() &&
    editItemForm.unit_price &&
    editItemForm.image;

    const [viewItemsOpen, setViewItemsOpen] = useState(false);
    const [viewItems, setViewItems] = useState([]);

    const formatCurrency = (value) => {
        const num = Number(value) || 0;
                        return `PHP ${num.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };


    const header = {
        title: "Expenses Management",
        subTitle: "Track, add, and update expenses to keep spending organized and transparent."
    };

    const breadcrumbs = [
        { name: "Expenses", link: "/expenses" }
    ]

    return (
        <Admin header={header} breadcrumbs={breadcrumbs}>
            <div className="w-full mx-auto flex flex-col gap-4 mt-4 md:mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                    <SummaryCard
                        label="Monetary donations"
                        value={formatCurrency(totals.totalMonetaryDonations)}
                        sub="All approved donations"
                        accent="green"
                    />
                    <SummaryCard
                        label="Total expenses"
                        value={formatCurrency(totals.totalExpenses)}
                        sub="On record"
                        accent="blue"
                    />
                    <SummaryCard
                        label="Net balance"
                        value={formatCurrency((totals.totalMonetaryDonations || 0) - (totals.totalExpenses || 0))}
                        sub="Donations - expenses"
                        accent="amber"
                    />
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                        <div className="text-sm text-gray-700 font-semibold flex items-center gap-2">
                            <Filter size={16} className="text-orange-500" /> Quick filters
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full lg:w-auto">
                            <div className="relative w-full sm:w-72">
                                <Search size={16} className="text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input 
                                    onChange={(e) => handleSearch(e.target.value)} 
                                    value={searchQuery}
                                    type="text" 
                                    className="bg-white placeholder:text-xs px-9 py-2 rounded border border-gray-200 text-sm w-full" 
                                    placeholder="Search for expenses.." 
                                />
                            </div>
                            <button
                                onClick={handlePrint}
                                disabled={printLoading}
                                className={`text-xs px-3 py-2 rounded-md border border-gray-200 ${printLoading ? "opacity-60 cursor-not-allowed" : "text-gray-600 hover:bg-gray-50"}`}
                            >
                                {printLoading ? "Generating..." : "Print"}
                            </button>
                            <button
                                onClick={() => setOpenAddModal(true)}
                                className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-4 py-2 rounded w-full sm:w-auto flex items-center gap-2 justify-center"
                            >
                                <span>+</span>
                                <span>New</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <label className="text-xs text-gray-600 whitespace-nowrap">From</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="bg-white placeholder:text-xs px-3 py-2 rounded border border-gray-200 text-xs w-full sm:w-auto"
                            />
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <label className="text-xs text-gray-600 whitespace-nowrap">To</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="bg-white placeholder:text-xs px-3 py-2 rounded border border-gray-200 text-xs w-full sm:w-auto"
                            />
                        </div>
                        <button
                            onClick={handleApplyDateFilter}
                            className="text-xs px-3 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600"
                        >
                            Apply
                        </button>
                        <button
                            onClick={handleClearDateFilter}
                            className="text-xs px-3 py-2 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
                        >
                            Clear
                        </button>
                    </div>
                </div>
               
               {loading ? (
                    <div className="w-full h-40 flex items-center justify-center">
                        <CircularLoading customClass="text-blue-500 w-6 h-6" />
                    </div>
                ) : expenses.length === 0 ? (
                    <div className="bg-white border border-dashed border-gray-200 rounded-lg p-8 text-center text-sm text-gray-500">
                        No expenses found. Adjust filters or clear search to see more results.
                        <div className="mt-3">
                            <button
                                onClick={() => { setSearchQuery(""); fetchExpenses(); }}
                                className="text-xs px-3 py-2 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
                            >
                                Clear filters
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="w-full max-w-screen-sm md:max-w-none rounded-lg overflow-x-auto">
                        <table className="w-full border rounded-lg overflow-hidden shadow bg-white text-sm border-collapse">
                            <thead className="bg-orange-500 text-white text-xs sticky top-0">
                            <tr className="text-xs">
                                <th className="p-3 text-start">Reference Number</th>
                                <th className="p-3 text-start">Name</th>
                                <th className="p-3 text-start">Description</th>
                                <th className="p-3 text-start">Amount</th>
                                <th className="p-3 text-start">Date Incurred</th>
                                <th className="p-3 text-start">Payment Method</th>
                                <th className="p-3 text-start">Actions</th>
                            </tr>
                            </thead>
                            
                                <tbody>
                                    {expenses.map((row, index) => (
                                    <tr key={row.id}
                                    className={`border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? "bg-orange-50/40" : ""}`}>
                                        <td className="p-3 text-xs font-semibold text-gray-800">{row.reference_number}</td>
                                        <td className="p-3 text-xs">{row.name}</td>
                                        <td className="p-3 text-xs">{row.description}</td>
                                        <td className="p-3 text-xs font-mono">{formatCurrency(row.amount)}</td>
                                        <td className="p-3 text-xs ">{row.date_incurred}</td>
                                        <td className="p-3 text-xs ">{row.payment_method}</td>
                                        <td className="p-3 text-xs flex justify-start gap-2">
                                            <button
                                                onClick={() => {
                                                    setViewItems(row.items || []);
                                                    setViewItemsOpen(true);
                                                }}
                                                className="bg-gray-100 text-gray-700 text-[10px] px-2 py-1 rounded hover:bg-gray-200"
                                                >
                                                See Items
                                            </button>
                                            <button
                                                className="bg-blue-50 text-blue-600 px-1 py-1 rounded"
                                                onClick={() => openEdit(row)}
                                                >
                                                <Edit size={16} />
                                            </button>
                                            <button 
                                                onClick={() => setDeleteId(row.id)} 
                                                className="bg-red-50 text-red-600 px-1 py-1 rounded">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                    ))}
                                </tbody>
                        </table>
                   </div>
                )}

                {/* delete modal */}
                {deleteId && (
                    <ConfirmationAlert
                        title="Delete Expense"
                        message="Are you sure you want to delete this expense? This action cannot be undone."
                        onConfirm={() => deleteExpense(deleteId)}
                        onClose={() => setDeleteId(null)}
                        isDelete={true}
                        isDeleting={isDeleting}
                    />
                )}

                {/* add modal */}
                {openAddModal && (
                    <ModalContainer 
                        isFull={true} 
                        close={() => setOpenAddModal(false)}
                    >
                        <div className='p-5 w-full max-w-3xl h-auto'>
                            <form 
                                className="flex flex-col gap-4" 
                                onSubmit={handleAddExpense} 
                                encType="multipart/form-data"
                            >
                                <div className="text-left mb-2">
                                    <p className="text-xl font-semibold text-orange-600">Add a New Expense</p>
                                    <p className="text-sm text-gray-600">
                                    Add a new expenses record to keep spending organized and transparent.
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1 md:col-span-2">
                                        <label className="text-xs">Name *</label>
                                        <input
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            className="border rounded px-3 py-2 text-sm"
                                            placeholder="Name"
                                        />
                                        {validationErrors.name && (
                                            <p className="text-xs text-red-500">{validationErrors.name[0]}</p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-1 md:col-span-2">
                                        <label className="text-xs">Description *</label>
                                        <textarea
                                            value={form.description}
                                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                                            className="border rounded px-3 py-2 text-sm min-h-20"
                                            placeholder="Description"
                                        />
                                        {validationErrors.description && (
                                            <p className="text-xs text-red-500">{validationErrors.description[0]}</p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs">Amount *</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={form.amount}
                                            onChange={(e) => setForm({ ...form, amount: e.target.value })}
                                            className="border rounded px-3 py-2 text-sm"
                                            placeholder="0.00"
                                        />
                                        {validationErrors.amount && (
                                            <p className="text-xs text-red-500">{validationErrors.amount[0]}</p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs">Date Incurred *</label>
                                        <input
                                            type="date"
                                            value={form.date_incurred}
                                            onChange={(e) => setForm({ ...form, date_incurred: e.target.value })}
                                            className="border rounded px-3 py-2 text-sm"
                                        />
                                        {validationErrors.date_incurred && (
                                            <p className="text-xs text-red-500">{validationErrors.date_incurred[0]}</p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs">Payment Method *</label>
                                        <input
                                            value={form.payment_method}
                                            onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
                                            className="border rounded px-3 py-2 text-sm max-h-10"
                                            placeholder="e.g. Cash, Bank Transfer, GCash"
                                        />
                                        {validationErrors.payment_method && (
                                            <p className="text-xs text-red-500">{validationErrors.payment_method[0]}</p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs">Notes (optional)</label>
                                        <textarea
                                            value={form.notes}
                                            onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                            className="border rounded px-3 py-2 text-sm min-h-20"
                                            placeholder="Additional details"
                                        />
                                        {validationErrors.notes && (
                                            <p className="text-xs text-red-500">{validationErrors.notes[0]}</p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-1 md:col-span-2">
                                        <label className="text-xs">Attachment *</label>
                                        <input
                                            type="file"
                                            accept=".jpg,.jpeg,.png,.pdf"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                setForm({ ...form, attachment: file });

                                                if (file && file.type.startsWith("image/")) {
                                                setAttachmentPreview(URL.createObjectURL(file));
                                                } else {
                                                setAttachmentPreview(null);
                                                }
                                            }}
                                            className="text-sm"
                                        />
                                        {attachmentPreview ? (
                                            <div className="mt-2">
                                                <img
                                                src={attachmentPreview}
                                                alt="Attachment preview"
                                                className="w-full max-w-xs rounded border"
                                                />
                                            </div>
                                        ) : form.attachment ? (
                                            <p className="mt-2 text-xs text-gray-600">{form.attachment.name}</p>
                                        ) : null}
                                        {validationErrors.attachment && (
                                            <p className="text-xs text-red-500">{validationErrors.attachment[0]}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 mt-2">
                                    <button
                                        type="button"
                                        onClick={() => setOpenAddModal(false)}
                                        className="px-4 py-2 text-xs rounded bg-gray-200 hover:bg-gray-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="px-4 py-2 text-xs rounded bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-60"
                                    >
                                        {isSaving ? "Saving..." : "Save"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </ModalContainer>
                )}

                {openEditModal && (
                    <ModalContainer isFull={true} close={() => setOpenEditModal(false)}>
                        <div className="p-5 w-full max-w-3xl h-auto">
                        <form className="flex flex-col gap-4" onSubmit={handleUpdateExpense} encType="multipart/form-data">
                            <div className="text-left mb-2">
                            <p className="text-xl font-semibold text-orange-600">Edit Expense</p>
                            <p className="text-sm text-gray-600">
                                Update this expenses record to keep spending organized and transparent.
                            </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1 md:col-span-2">
                            <label className="text-xs">Name <span className='text-red-600'>*</span></label>
                            <input
                                value={editForm.name}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                className="border rounded px-3 py-2 text-sm"
                                placeholder="Name"
                            />
                            {editValidationErrors.name && (
                                <p className="text-xs text-red-500">{editValidationErrors.name[0]}</p>
                            )}
                            </div>

                            <div className="flex flex-col gap-1 md:col-span-2">
                            <label className="text-xs">Description <span className='text-red-600'>*</span></label>
                            <textarea
                                value={editForm.description}
                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                className="border rounded px-3 py-2 text-sm min-h-20"
                                placeholder="Description"
                            />
                            {editValidationErrors.description && (
                                <p className="text-xs text-red-500">{editValidationErrors.description[0]}</p>
                            )}
                            </div>

                            <div className="flex flex-col gap-1">
                            <label className="text-xs">Amount <span className='text-red-600'>*</span></label>
                            <input
                                type="number"
                                step="0.01"
                                value={editForm.amount}
                                onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                                className="border rounded px-3 py-2 text-sm"
                                placeholder="0.00"
                            />
                            {editValidationErrors.amount && (
                                <p className="text-xs text-red-500">{editValidationErrors.amount[0]}</p>
                            )}
                            </div>

                            <div className="flex flex-col gap-1">
                            <label className="text-xs">Date Incurred <span className='text-red-600'>*</span></label>
                            <input
                                type="date"
                                value={editForm.date_incurred}
                                onChange={(e) => setEditForm({ ...editForm, date_incurred: e.target.value })}
                                className="border rounded px-3 py-2 text-sm"
                            />
                            {editValidationErrors.date_incurred && (
                                <p className="text-xs text-red-500">{editValidationErrors.date_incurred[0]}</p>
                            )}
                            </div>

                            <div className="flex flex-col gap-1">
                            <label className="text-xs">Payment Method <span className='text-red-600'>*</span></label>
                            <input
                                value={editForm.payment_method}
                                onChange={(e) => setEditForm({ ...editForm, payment_method: e.target.value })}
                                className="border rounded px-3 py-2 text-sm max-h-10"
                                placeholder="e.g. Cash, Bank Transfer, GCash"
                            />
                            {editValidationErrors.payment_method && (
                                <p className="text-xs text-red-500">{editValidationErrors.payment_method[0]}</p>
                            )}
                            </div>

                            <div className="flex flex-col gap-1">
                            <label className="text-xs">Notes (optional)</label>
                            <textarea
                                value={editForm.notes}
                                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                                className="border rounded px-3 py-2 text-sm min-h-20"
                                placeholder="Additional details"
                            />
                            {editValidationErrors.notes && (
                                <p className="text-xs text-red-500">{editValidationErrors.notes[0]}</p>
                            )}
                            </div>

                            <div className="flex flex-col gap-1 md:col-span-2">
                                <label className="text-xs">Attachment <span className='text-red-600'>*</span></label>
                                <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.pdf"
                                    onChange={(e) => {
                                    const file = e.target.files[0];
                                    setEditForm({ ...editForm, attachment: file });
                                    if (file && file.type.startsWith("image/")) {
                                        setEditAttachmentPreview(URL.createObjectURL(file));
                                    } else {
                                        setEditAttachmentPreview(null);
                                    }
                                    }}
                                    className="text-sm"
                                />
                                {editAttachmentPreview ? (
                                    <div className="mt-2">
                                    <img
                                        src={editAttachmentPreview}
                                        alt="Attachment preview"
                                        className="w-full max-w-xs rounded border"
                                    />
                                    </div>
                                ) : editForm.attachment ? (
                                    <p className="mt-2 text-xs text-gray-600">{editForm.attachment.name}</p>
                                ) : null}
                                {editValidationErrors.attachment && (
                                    <p className="text-xs text-red-500">{editValidationErrors.attachment[0]}</p>
                                )}
                            </div>
                            </div>

                            {/* items */}
                            <div className="mt-4 border-t border-gray-300 pt-3">
                                <p className="text-lg font-semibold text-orange-600">Items</p>
                                <p className="text-xs text-gray-600 mb-2">Add line items for this expense.</p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="flex flex-col gap-1">
                                    <label className="text-xs">Item Name <span className='text-red-600'>*</span></label>
                                    <input
                                        value={editItemForm.name}
                                        onChange={(e) => setEditItemForm({ ...editItemForm, name: e.target.value })}
                                        className="border rounded px-3 py-2 text-sm"
                                        placeholder="Item name"
                                    />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                    <label className="text-xs">Quantity <span className='text-red-600'>*</span></label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={editItemForm.quantity}
                                        onChange={(e) => setEditItemForm({ ...editItemForm, quantity: e.target.value })}
                                        className="border rounded px-3 py-2 text-sm"
                                    />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                    <label className="text-xs">Unit Price <span className='text-red-600'>*</span></label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={editItemForm.unit_price}
                                        onChange={(e) => setEditItemForm({ ...editItemForm, unit_price: e.target.value })}
                                        className="border rounded px-3 py-2 text-sm"
                                        placeholder="0.00"
                                    />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                    <label className="text-xs">Description</label>
                                    <input
                                        value={editItemForm.description}
                                        onChange={(e) => setEditItemForm({ ...editItemForm, description: e.target.value })}
                                        className="border rounded px-3 py-2 text-sm"
                                        placeholder="Optional"
                                    />
                                    </div>

                                    <div className="flex flex-col gap-1 sm:col-span-2">
                                    <label className="text-xs">Item Image <span className='text-red-600'>*</span></label>
                                    <input
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            setEditItemForm({ ...editItemForm, image: file });
                                            if (file && file.type.startsWith("image/")) {
                                                setEditItemPreview(URL.createObjectURL(file));
                                            } else {
                                                setEditItemPreview(null);
                                            }
                                        }}
                                        className="text-xs"
                                    />
                                    {editItemPreview ? (
                                        <div className="mt-2">
                                        <img src={editItemPreview} alt="Item preview" className="w-full max-w-xs rounded border" />
                                        </div>
                                    ) : editItemForm.image ? (
                                        <p className="mt-2 text-xs text-gray-600">{editItemForm.image.name}</p>
                                    ) : null}
                                    </div>
                                </div>

                                <div className="mt-2 flex justify-between items-center">
                                    {editItemError && <p className="text-xs text-red-500">{editItemError}</p>}
                                    <button
                                        type="button"
                                        onClick={addEditItem}
                                        disabled={!canAddItem}
                                        className={`px-3 py-1.5 text-xs rounded text-white ${
                                            canAddItem
                                            ? "bg-blue-500 hover:bg-blue-600"
                                            : "bg-gray-300 cursor-not-allowed"
                                        }`}
                                        >
                                        Add Item
                                    </button>
                                </div>

                                {editItems.length > 0 && (
                                    <div className="mt-3 space-y-2">
                                        <p className="text-sm text-orange-600 font-semibold">Current Items</p>
                                        {editItems.map((it, idx) => (
                                            <div key={idx} className="border rounded p-2 flex justify-between gap-2 text-xs">
                                                <div className="flex items-start gap-2 space-y-1">
                                                    {it.existingImage && !it.image && (
                                                        <img src={it.existingImage} alt="Item" className="w-20 h-20 object-cover rounded border" />
                                                    )}
                                                    <div>
                                                        <p className="font-semibold">{it.name}</p>
                                                        <p>Qty: {it.quantity} | Unit: {it.unit_price}</p>
                                                        {it.description && <p className="text-gray-600">{it.description}</p>}
                                                        {/* preview existing or newly picked image */}
                                                        
                                                        {it.image && (
                                                            <p className="text-gray-600">New file: {it.image.name}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeEditItem(idx, it.id)}
                                                    disabled={deletingItemId === it.id}
                                                    className={`text-red-500 h-fit border-0 hover:outline-none ${deletingItemId === it.id ? "opacity-60 cursor-not-allowed" : "hover:underline"}`}
                                                    >
                                                    {deletingItemId === it.id ? "Removing.." : "Remove"}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 mt-2">
                                <button
                                    type="button"
                                    onClick={() => handleExpensePrint(editId)}
                                    disabled={printLoading}
                                    className={`px-4 py-2 text-xs rounded border border-gray-200 ${printLoading ? "opacity-60 cursor-not-allowed" : "text-gray-600 hover:bg-gray-50"}`}
                                >
                                    {printLoading ? "Generating..." : "Print"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setOpenEditModal(false)}
                                    className="px-4 py-2 text-xs rounded bg-gray-200 hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="px-4 py-2 text-xs rounded bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-60"
                                >
                                    {isUpdating ? "Updating..." : "Update"}
                                </button>
                            </div>
                        </form>
                        </div>
                    </ModalContainer>
                )}

                {viewItemsOpen && (
                    <ModalContainer isFull={false} close={() => setViewItemsOpen(false)}>
                        <div className="bg-white p-6 rounded-xl w-full max-w-xl">
                        <div className="flex justify-between items-center mb-3">
                            <p className="text-sm text-orange-500 font-semibold">Items</p>
                            <X 
                                onClick={() => setViewItemsOpen(false)}
                                className="text-xs text-gray-600 cursor-pointer"
                            />
                        </div>

                        {viewItems.length === 0 ? (
                            <p className="text-xs text-gray-600">No items for this expense.</p>
                        ) : (
                            <div className="space-y-3 max-h-[60vh] overflow-auto">
                            {viewItems.map((it, idx) => (
                                <div key={idx} className="border rounded p-2 text-xs flex gap-3">
                                {it.image && (
                                    <img
                                    src={`${baseURL}${it.image}`} // use your existing baseURL
                                    alt="item"
                                    className="w-16 h-16 object-cover rounded"
                                    />
                                )}
                                <div className="space-y-1">
                                    <p className="font-semibold">{it.name}</p>
                                    <p>Qty: {it.quantity} | Unit: {it.unit_price}</p>
                                    {it.description && <p className="text-gray-600">{it.description}</p>}
                                </div>
                                </div>
                            ))}
                            </div>
                        )}
                        </div>
                    </ModalContainer>
                )}

                {isPrintOpen && (
                    <ModalContainer
                        isFull={false}
                        close={() => {
                            setIsPrintOpen(false);
                            if (printUrl) {
                                URL.revokeObjectURL(printUrl);
                            }
                            setPrintUrl("");
                            setPrintFilename("");
                        }}
                    >
                        <div className="w-full md:w-[900px] h-[70vh] rounded-xl bg-white p-4 flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-orange-600 font-semibold">Expense Report</p>
                                    <p className="text-xs text-gray-500">{printFilename}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setIsPrintOpen(false);
                                        if (printUrl) {
                                            URL.revokeObjectURL(printUrl);
                                        }
                                        setPrintUrl("");
                                        setPrintFilename("");
                                    }}
                                    className="text-xs px-3 py-2 rounded border border-gray-200 text-gray-600 hover:bg-gray-50"
                                >
                                    Close
                                </button>
                            </div>
                            <div className="flex-1 border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                                {printUrl ? (
                                    <iframe
                                        title="Expenses Report"
                                        src={printUrl}
                                        className="w-full h-full"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                                        No preview available.
                                    </div>
                                )}
                            </div>
                        </div>
                    </ModalContainer>
                )}

            </div>
        </Admin>
    )
}

export default Expenses;

const accentClasses = {
    green: { text: "text-green-600", bg: "bg-green-50" },
    blue: { text: "text-blue-600", bg: "bg-blue-50" },
    amber: { text: "text-amber-600", bg: "bg-amber-50" },
    purple: { text: "text-purple-600", bg: "bg-purple-50" },
};

const SummaryCard = ({ label, value, sub, accent = "blue" }) => {
    const colors = accentClasses[accent] || accentClasses.blue;
    return (
        <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-4 flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg ${colors.bg} flex items-center justify-center`}>
                <Coins className={`${colors.text}`} size={20} />
            </div>
            <div className="flex flex-col">
                <p className="text-[11px] uppercase tracking-wide text-gray-500">{label}</p>
                <p className={`text-xl font-bold ${colors.text}`}>{value}</p>
                {sub && <p className="text-[11px] text-gray-500">{sub}</p>}
            </div>
        </div>
    );
};



