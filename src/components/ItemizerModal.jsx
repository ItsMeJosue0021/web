import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { _get, _post, _delete } from "../api";
import { Modal } from "flowbite-react";
import ModalContainer from "./ModalContainer";
import ConfirmationAlert from "./alerts/ConfirmationAlert";
import { set } from "lodash";

const ItemizerModal = ({ donation, fetchDonations }) => {

    // const baseURL = "http://localhost:5173/storage/";
    const baseURL = "https://api.kalingangkababaihan.com/storage/";

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [addItemModalOpen, setAddItemModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    // categories
    const [categories, setCategories] = useState([]);
    const [filteredSubcategories, setFilteredSubcategories] = useState([]);

    // Form
    const [form, setForm] = useState({
        name: "",
        category_id: "",
        subcategory_id: "",
        quantity: "",
        unit: "",
        notes: "",
        image: null,
    });

    // Errors
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchDonationItems();
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await _get(`/goods-donation-categories`);
            setCategories(response.data.categories || []);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchDonationItems = async () => {
        setLoading(true);
        try {
            const response = await _get(`/goods-donations/${donation.id}/items`);
            setItems(response.data.items || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (e) => {
        const selectedId = e.target.value;

        setForm({
            ...form,
            category_id: selectedId,
            subcategory_id: ""
        });

        const category = categories.find(cat => cat.id == selectedId);
        setFilteredSubcategories(category ? category.subcategories : []);
    };

    const validateForm = () => {
        let e = {};

        if (!form.name) e.name = "Item name is required.";
        if (!form.category_id) e.category_id = "Category is required.";
        if (!form.subcategory_id) e.subcategory_id = "Subcategory is required.";
        if (!form.quantity) e.quantity = "Quantity is required.";
        if (form.quantity && isNaN(form.quantity)) e.quantity = "Quantity must be a number.";

        setErrors(e);

        return Object.keys(e).length === 0;
    };

    const resetForm = () => {
        setForm({
            name: "",
            category_id: "",
            subcategory_id: "",
            quantity: "",
            unit: "",
            notes: "",
            image: null,
        });
        setFilteredSubcategories([]);
        setErrors({});
    };

    const addItem = async () => {
        if (!validateForm()) return;

        setSaving(true);

        const payload = new FormData();
        payload.append("name", form.name);
        payload.append("category", form.category_id);
        payload.append("sub_category", form.subcategory_id);
        payload.append("quantity", form.quantity);
        payload.append("unit", form.unit);
        payload.append("notes", form.notes);
        if (form.image) payload.append("image", form.image);

        try {
            await _post(`/goods-donations/${donation.id}/items`, payload);
            fetchDonationItems();
            resetForm();
            setAddItemModalOpen(false);
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
            fetchDonations();
            fetchDonationItems();
        }
    };

    const [deleteItemId, setDeleteItemId] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const deleteItem = async () => {
        setDeleting(true);
        try {
            await _delete(`/goods-donations/items/${deleteItemId}`);
            fetchDonationItems(); 
        } catch (error) {
            console.error(error);
        } finally {
            setDeleting(false);
            setDeleteItemId(null);
            fetchDonations();
            fetchDonationItems();
        }
    };

    const getCategoryName = (id) => {
        const category = categories.find(cat => cat.id == Number(id));
        return category ? category.name : "Unknown";
    };

    const getSubcategoryName = (id) => {
        for (let cat of categories) {
            const sub = cat.subcategories.find(sc => sc.id == Number(id));
            if (sub) return sub.name;
        }
        return "Unknown";
    };

    return (
        <div className="w-full h-full flex flex-col items-center gap-4 md:p-4 mx-auto bg-white">
            {deleteItemId && (
                <ConfirmationAlert 
                    title="Delete Item"
                    message="Are you sure you want to delete this item? This action cannot be undone."
                    isDelete={true}
                    isDeleting={deleting}
                    onConfirm={deleteItem}
                    onClose={() => setDeleteItemId(null)}
                />
            )}
            <div className="w-full max-w-[800px] pb-8 md:pb-0">
                <div className="flex flex-col gap-1 mb-5 md:p-4 rounded-lg border">
                    <p className="text-xl text-orange-600">Itemize your goods donations for easier monitoring.</p>
                    <p  className="text-sm">
                        <span className="font-medium">Donor</span>: {donation.name || 'Anonymous'}
                    </p>
                    <p className="text-sm">
                        <span className="font-medium">Email:</span> {donation.email || "N/A"}
                    </p>
                    <p className="text-sm">
                        <span className="font-medium">Description:</span> {donation.description || "N/A"}
                    </p>
                </div>

                <div className="">
                    <div className="w-full flex items-center justify-between">
                        <strong>Items</strong>
                        <button
                            onClick={() => setAddItemModalOpen(true)}
                            className="text-xs rounded px-4 py-2 cursor-pointer hover:bg-orange-700 text-white bg-orange-600 border-none">
                            Add Items
                        </button>
                    </div>

                    <div className="w-full h-auto min-h-80 flex flex-col gap-4 p-2 divide-y">
                        {loading ? (
                            <div className="min-h-48 w-full flex flex-col items-center justify-center gap-4">
                                <p className="text-xs text-center text-gray-500">Loading items...</p>
                            </div>
                        ) : (
                            items.length > 0 && items.map((item, index) => (
                                <div key={item.id} className="relative h-auto overfloe-y-auto flex items-center pt-4">
                                    <div className="w-full h-auto flex flex-col md:flex-row items-start md:items-center gap-4">
                                        <img 
                                            src={`${baseURL}${item.image}`} 
                                            alt="image" 
                                            className="rounded-xl w-full md:w-24 h-52 md:h-24 min-w-24 min-h-24 object-center object-cover" 
                                        />
                                        <div className="w-full flex flex-col gap-1 text-xs text-gray-500">
                                            <strong className="text-sm text-orange-600">{item.name}</strong>
                                            <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-6">
                                                <p className="flex gap-2 md:gap-0 md:flex-col font-semibold">Category: <span className="font-normal">{getCategoryName(item.category)}</span></p>
                                                <p className="flex gap-2 md:gap-0 md:flex-col font-semibold">Subcaregory: <span className="font-normal">{getSubcategoryName(item.sub_category)}</span></p>
                                                <p className="flex gap-2 md:gap-0 md:flex-col font-semibold">Quantity: <span className="font-normal bg-orange-100 text-orange-600 w-fit px-2 rounded text-center">{item.quantity}</span></p>
                                                <p className="flex gap-2 md:gap-0 md:flex-col font-semibold">Unit: <span className="font-normal">{item.unit || '...'}</span></p>
                                            </div>

                                            <p className="text-xs text-gray-500"><span className="font-semibold">Notes</span>: {item.notes || '...'}</p>
                                        </div>
                                    </div>
                                    <div className="absolute top-8 md:top-0 right-4 md:right-0 h-fit md:h-full w-fit md:w-20 md:min-w-20 md:flex items-center justify-center">
                                        <X 
                                            onClick={() => setDeleteItemId(item.id)}
                                            className="min-w-5 w-5 min-h-5 h-5 text-gray-400 cursor-pointer hover:text-red-500" />
                                    </div>
                                </div>
                            ))
                        )}
                        {items.length === 0 && !loading && (
                            <div className="min-h-48 w-full flex flex-col items-center justify-center gap-4">
                                <p className="text-xs text-center text-gray-500">No items found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {addItemModalOpen && (
                <ModalContainer isFull={false} close={() => setAddItemModalOpen(false)}>
                    <div className="w-full max-w-[600px] bg-white rounded-xl p-5 ">
                        <div>
                            <div>
                                <h2 className="text-lg font-semibold text-orange-600">Add New Item</h2>
                                <p className="text-xs">You are about to add an item to an existing donation.</p>
                            </div>

                            <div className="w-full flex flex-col space-y-4 py-4">

                                {/* NAME */}
                                <div className="w-full flex flex-col">
                                    <label className="text-xs font-medium">Name</label>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        placeholder="Name of the item.."
                                        className="bg-white text-sm px-4 py-2 rounded-md border border-gray-300 placeholder:text-xs"
                                    />
                                    {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                                </div>

                                {/* CATEGORY */}
                                <div className="w-full flex flex-col">
                                    <label className="text-xs font-medium">Category</label>
                                    <select
                                        value={form.category_id}
                                        onChange={handleCategoryChange}
                                        className="bg-white text-sm px-4 py-2 rounded-md border border-gray-300 placeholder:text-xs"
                                    >
                                        <option value="">Select category...</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    {errors.category_id && <p className="text-red-500 text-xs">{errors.category_id}</p>}
                                </div>

                                {/* SUBCATEGORY */}
                                <div className="w-full flex flex-col">
                                    <label className="text-xs font-medium">Subcategory</label>
                                    <select
                                        value={form.subcategory_id}
                                        onChange={(e) => setForm({ ...form, subcategory_id: e.target.value })}
                                        className="bg-white text-sm px-4 py-2 rounded-md border border-gray-300 placeholder:text-xs"
                                    >
                                        <option value="">Select subcategory...</option>
                                        {filteredSubcategories.map(sub => (
                                            <option key={sub.id} value={sub.id}>{sub.name}</option>
                                        ))}
                                    </select>
                                    {errors.subcategory_id && <p className="text-red-500 text-xs">{errors.subcategory_id}</p>}
                                </div>

                                {/* QUANTITY + UNIT */}
                                <div className="flex flex-col mf:flex-row items-start gap-4">
                                    <div className="w-full flex flex-col">
                                        <label className="text-xs font-medium">Quantity</label>
                                        <input
                                            type="text"
                                            value={form.quantity}
                                            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                                            className="bg-white text-sm px-4 py-2 rounded-md border border-gray-300 placeholder:text-xs"
                                        />
                                        {errors.quantity && <p className="text-red-500 text-xs">{errors.quantity}</p>}
                                    </div>

                                    <div className="w-full flex flex-col">
                                        <label className="text-xs font-medium">Unit</label>
                                        <input
                                            type="text"
                                            value={form.unit}
                                            onChange={(e) => setForm({ ...form, unit: e.target.value })}
                                            className="bg-white text-sm px-4 py-2 rounded-md border border-gray-300 placeholder:text-xs"
                                        />
                                    </div>
                                </div>

                                {/* NOTES */}
                                <div className="w-full flex flex-col">
                                    <label className="text-xs font-medium">Notes</label>
                                    <textarea
                                        value={form.notes}
                                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                        className="bg-white text-sm px-4 py-2 rounded-md border border-gray-300 placeholder:text-xs resize-none h-20"
                                    />
                                </div>

                                {/* IMAGE */}
                                <div className="w-full flex flex-col">
                                    <label className="text-xs font-medium">Item Image</label>
                                    <input
                                        type="file"
                                        onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
                                        className="bg-white text-xs px-4 py-2 rounded-md border border-gray-300 placeholder:text-xs"
                                    />
                                </div>
                            </div>

                            <div className="w-full flex justify-end items-center gap-2">
                                <button
                                    onClick={addItem}
                                    disabled={saving}
                                    className={`text-xs rounded px-6 py-2 cursor-pointer text-white bg-orange-600 border-none ${saving ? "opacity-50 cursor-not-allowed" : "hover:bg-orange-700"
                                        }`}
                                >
                                    {saving ? "Saving..." : "Save"}
                                </button>

                                <button
                                    onClick={() => setAddItemModalOpen(false)}
                                    className="text-xs rounded px-6 py-2 cursor-pointer hover:bg-gray-300 text-black bg-gray-200 border-none">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </ModalContainer>
            )}
        </div>
    );
};

export default ItemizerModal;
