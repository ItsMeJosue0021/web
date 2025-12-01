import '../../css/loading.css'; 
import Admin from "../../layouts/Admin";
import { useEffect, useState } from "react";
import { _delete, _get, _post, _put } from "../../api";
import CircularLoading from "../../components/CircularLoading";
import { Edit, HandCoins, Mail, Trash2 } from "lucide-react";
import ConfirmationAlert from '../../components/alerts/ConfirmationAlert';
import ModalContainer from '../../components/ModalContainer';

const Expenses = () => {

    const baseURL = "https://api.kalingangkababaihan.com/storage/";

    const [loading, setLoading] = useState(false);
    const [expenses, setExpenses] = useState([]);
    const [totals, setTotals] = useState({
        totalMonetaryDonations: 0,
        totalExpenses: 0
    });
    const [deleteId, setDeleteId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);

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


    useEffect(() => {
        fetchExpenses();
        fetchTotals();
    }, []);

    // fetch expenses
    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const response = await _get('/expenditures');
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
        if (!value.trim()) {
            fetchExpenses(); 
            return;
        }

        setLoading(true);
        try {
            const res = await _get(`/expenditures/search?q=${value}`, {
            params: { search: value },
            });
            setExpenses(res.data.expenditures || res.data);
        } catch (err) {
            console.error("Search failed:", err);
        } finally {
            setLoading(false);
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
                data.append(`items[${idx}][name]`, item.name);
                data.append(`items[${idx}][description]`, item.description || "");
                data.append(`items[${idx}][quantity]`, item.quantity);
                data.append(`items[${idx}][unit_price]`, item.unit_price);
                if (item.image) data.append(`items[${idx}][image]`, item.image);
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


    const removeEditItem = (idx) => {
        setEditItems(editItems.filter((_, i) => i !== idx));
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
                <div className="w-full flex items-center gap-4">
                    <div className="relative w-full h-24 rounded-xl bg-white p-4 shadow-sm flex flex-col gap-1 items-start justify-center overflow-hidden">
                        <p className="text-2xl text-green-500 font-bold">&#8369; {totals.totalMonetaryDonations}</p>
                        <p className="text-xs text-gray-600">Total <span className="text-green-600 font-bold">Monetary</span> Donations</p>
                        <HandCoins size={60}  className="bg-green-50 rounded-2xl p-3 absolute -bottom-3 -right-3 text-green-300"/>
                    </div>
                    <div className="relative w-full h-24 rounded-xl bg-white p-4 shadow-sm flex flex-col gap-1 items-start justify-center overflow-hidden">
                        <p className="text-2xl text-blue-600 font-bold">&#8369; {totals.totalExpenses} </p>
                        <p className="text-xs text-gray-600">Total <span className="text-blue-600 font-bold">Expenses</span> on record</p>
                        <HandCoins size={60}  className="bg-blue-50 rounded-2xl p-3 absolute -bottom-3 -right-3 text-blue-300"/>
                    </div>
                </div>
                <div className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-white">
                    <div className="w-full md:in-w-80 md:max-w-[500px] flex items-center gap-4 ">
                        <p className="hidden md:block text-xs">Search</p>
                        <input 
                            onChange={(e) => handleSearch(e.target.value)} 
                            type="text" 
                            className="bg-white placeholder:text-xs px-4 py-2 rounded border border-gray-200 text-sm" 
                            placeholder="Search for expenses.." 
                        />
                    </div>
                    <div>
                        <button
                            onClick={() => setOpenAddModal(true)}
                            className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-4 py-2 rounded w-full sm:w-auto flex items-center gap-2 justify-center"
                        >
                            <span>+</span>
                            <span>New</span>
                        </button>
                    </div>
                </div>
               
               <div className="w-full max-w-screen-sm md:max-w-none rounded-lg overflow-x-auto">
                    <table className="w-full border rounded-lg overflow-hidden shadow bg-white text-sm">
                        <thead className="bg-orange-500 text-white ">
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
                                {!loading ? (
                                    expenses.length > 0 && expenses.map((row, index) => (
                                        <tr key={row.id}
                                        className={`${index % 2 === 0 ? "bg-orange-50" : ""}`}>
                                            <td className="p-3 text-xs">{row.reference_number}</td>
                                            <td className="p-3 text-xs">{row.name}</td>
                                            <td className="p-3 text-xs">{row.description}</td>
                                            <td className="p-3 text-xs ">{row.amount}</td>
                                            <td className="p-3 text-xs ">{row.date_incurred}</td>
                                            <td className="p-3 text-xs ">{row.payment_method}</td>
                                            <td className="p-3 text-xs flex justify-start gap-2">
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
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="py-10 text-center">
                                            <div className="flex items-center justify-center">
                                            <CircularLoading customClass="text-blue-500 w-6 h-6" />
                                            </div>
                                        </td>
                                    </tr>

                                )}
                            </tbody>
                    </table>
               </div>

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
                        <div className='p-5 w-full max-w-xl h-auto'>
                            <form 
                                className="flex flex-col gap-3" 
                                onSubmit={handleAddExpense} 
                                encType="multipart/form-data"
                            >
                                <div className="text-left mb-2">
                                    <p className="text-xl font-semibold text-orange-600">Add a New Expense</p>
                                    <p className="text-sm text-gray-600">
                                    Add a new expenses record to keep spending organized and transparent.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-1">
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

                                <div className="flex flex-col gap-1">
                                    <label className="text-xs">Description *</label>
                                    <textarea
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        className="border rounded px-3 py-2 text-sm"
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
                                        className="border rounded px-3 py-2 text-sm"
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
                                        className="border rounded px-3 py-2 text-sm"
                                        placeholder="Additional details"
                                    />
                                    {validationErrors.notes && (
                                        <p className="text-xs text-red-500">{validationErrors.notes[0]}</p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1">
                                <label className="text-xs">Attachment *</label>
                                {/* <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.pdf"
                                    onChange={(e) => setForm({ ...form, attachment: e.target.files[0] })}
                                    className="text-sm"
                                />
                                {validationErrors.attachment && (
                                    <p className="text-xs text-red-500">{validationErrors.attachment[0]}</p>
                                )} */}
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
                        <div className="p-5 w-full max-w-xl h-auto">
                        <form className="flex flex-col gap-3" onSubmit={handleUpdateExpense} encType="multipart/form-data">
                            <div className="text-left mb-2">
                            <p className="text-xl font-semibold text-orange-600">Edit Expense</p>
                            <p className="text-sm text-gray-600">
                                Update this expenses record to keep spending organized and transparent.
                            </p>
                            </div>

                            {/* Name */}
                            <div className="flex flex-col gap-1">
                            <label className="text-xs">Name *</label>
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

                            {/* Description */}
                            <div className="flex flex-col gap-1">
                            <label className="text-xs">Description *</label>
                            <textarea
                                value={editForm.description}
                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                className="border rounded px-3 py-2 text-sm"
                                placeholder="Description"
                            />
                            {editValidationErrors.description && (
                                <p className="text-xs text-red-500">{editValidationErrors.description[0]}</p>
                            )}
                            </div>

                            {/* Amount */}
                            <div className="flex flex-col gap-1">
                            <label className="text-xs">Amount *</label>
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

                            {/* Date Incurred */}
                            <div className="flex flex-col gap-1">
                            <label className="text-xs">Date Incurred *</label>
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

                            {/* Payment Method */}
                            <div className="flex flex-col gap-1">
                            <label className="text-xs">Payment Method *</label>
                            <input
                                value={editForm.payment_method}
                                onChange={(e) => setEditForm({ ...editForm, payment_method: e.target.value })}
                                className="border rounded px-3 py-2 text-sm"
                                placeholder="e.g. Cash, Bank Transfer, GCash"
                            />
                            {editValidationErrors.payment_method && (
                                <p className="text-xs text-red-500">{editValidationErrors.payment_method[0]}</p>
                            )}
                            </div>

                            {/* Notes */}
                            <div className="flex flex-col gap-1">
                            <label className="text-xs">Notes (optional)</label>
                            <textarea
                                value={editForm.notes}
                                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                                className="border rounded px-3 py-2 text-sm"
                                placeholder="Additional details"
                            />
                            {editValidationErrors.notes && (
                                <p className="text-xs text-red-500">{editValidationErrors.notes[0]}</p>
                            )}
                            </div>

                            {/* Attachment */}
                            <div className="flex flex-col gap-1">
                                <label className="text-xs">Attachment *</label>
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

                            {/* items */}
                            <div className="mt-4 border-t border-gray-300 pt-3">
                                <p className="text-lg font-semibold text-orange-600">Items</p>
                                <p className="text-xs text-gray-600 mb-2">Add line items for this expense.</p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="flex flex-col gap-1">
                                    <label className="text-xs">Item Name *</label>
                                    <input
                                        value={editItemForm.name}
                                        onChange={(e) => setEditItemForm({ ...editItemForm, name: e.target.value })}
                                        className="border rounded px-3 py-2 text-sm"
                                        placeholder="Item name"
                                    />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                    <label className="text-xs">Quantity *</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={editItemForm.quantity}
                                        onChange={(e) => setEditItemForm({ ...editItemForm, quantity: e.target.value })}
                                        className="border rounded px-3 py-2 text-sm"
                                    />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                    <label className="text-xs">Unit Price *</label>
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
                                    <label className="text-xs">Item Image (optional)</label>
                                    <input
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        required
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            setEditItemForm({ ...editItemForm, image: file });
                                            if (file && file.type.startsWith("image/")) {
                                                setEditItemPreview(URL.createObjectURL(file));
                                            } else {
                                                setEditItemPreview(null);
                                            }
                                        }}
                                        className="text-sm"
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
                                        className="px-3 py-2 text-xs rounded bg-blue-500 hover:bg-blue-600 text-white"
                                    >
                                        Add Item
                                    </button>
                                </div>

                                {editItems.length > 0 && (
                                    <div className="mt-3 space-y-2">
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
                                                    onClick={() => removeEditItem(idx)}
                                                    className="text-red-500 h-fit border-0 hover:outline-none hover:underline"
                                                    >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 mt-2">
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
            </div>
        </Admin>
    )
}

export default Expenses;