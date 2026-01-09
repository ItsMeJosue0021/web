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

    const unitOptions = [
        { unit: "kg", description: "Kilogram (weight)" },
        { unit: "g", description: "Gram (weight)" },
        { unit: "mg", description: "Milligram (weight)" },
        { unit: "lb", description: "Pound (weight)" },
        { unit: "oz", description: "Ounce (weight)" },

        { unit: "L", description: "Liter (liquid volume)" },
        { unit: "mL", description: "Milliliter (liquid volume)" },
        { unit: "gal", description: "Gallon (liquid volume)" },

        { unit: "pc", description: "Piece (single item)" },
        { unit: "pcs", description: "Pieces (multiple items)" },
        { unit: "pack", description: "Pack (group of items in one package)" },
        { unit: "box", description: "Box (items grouped inside a box)" },
        { unit: "bundle", description: "Bundle (multiple items tied or grouped together)" },
        { unit: "set", description: "Set (complete group of related items)" },
        { unit: "dozen", description: "Dozen (12 items)" },
        { unit: "pair", description: "Pair (2 related or wearable items)" },

        { unit: "sachet", description: "Sachet (small sealed packet)" },
        { unit: "can", description: "Can (canned item)" },
        { unit: "bottle", description: "Bottle (liquid in a bottle)" },
        { unit: "jar", description: "Jar (items stored in a glass or plastic jar)" },
        { unit: "tray", description: "Tray (tray-packed items, such as eggs)" },
        { unit: "cup", description: "Cup (small food or beverage cup)" },
        { unit: "bag", description: "Bag (bagged goods like rice or snacks)" },
        { unit: "pouch", description: "Pouch (soft packaging pouch)" },
        { unit: "bar", description: "Bar (soap bar, chocolate bar)" },
        { unit: "roll", description: "Roll (rolled items like tissue paper)" },

        { unit: "container", description: "Container (general storage container)" },
        { unit: "carton", description: "Carton (boxed liquid/food like milk)" },

        { unit: "kit", description: "Kit (grouped items for a purpose, e.g., hygiene kit)" },
        { unit: "family pack", description: "Family Pack (combined goods intended for one family)" },
        { unit: "relief pack", description: "Relief Pack (standardized pack for disaster response)" },
    ];

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
                <div className="mb-6 rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-amber-50 p-4 md:p-5 shadow-sm">
                    <div className="flex flex-col gap-1">
                        <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">Donation overview</p>
                        <p className="text-xl font-semibold text-orange-600">
                            Itemize your goods donations for easier monitoring.
                        </p>
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-gray-700 md:grid-cols-2">
                        <div className="rounded-xl border border-orange-100 bg-white/80 px-3 py-2">
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Donor</p>
                            <p className="font-medium text-gray-900">{donation.name || "Anonymous"}</p>
                        </div>
                        <div className="rounded-xl border border-orange-100 bg-white/80 px-3 py-2">
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Email</p>
                            <p className="font-medium text-gray-900">{donation.email || "N/A"}</p>
                        </div>
                    </div>
                </div>

                <div className="">
                    <div className="w-full flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-gray-900">Items</p>
                            <p className="text-xs text-gray-500">Track each donated item with details and notes.</p>
                        </div>
                        <button
                            onClick={() => setAddItemModalOpen(true)}
                            className="text-xs rounded-full px-4 py-2 cursor-pointer hover:bg-orange-700 text-white bg-orange-600 border-none shadow-sm">
                            Add Items
                        </button>
                    </div>

                    <div className="w-full h-auto min-h-80 mt-3 flex flex-col gap-4">
                        {loading ? (
                            <div className="min-h-48 w-full flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-200 bg-gray-50">
                                <p className="text-xs text-center text-gray-500">Loading items...</p>
                            </div>
                        ) : (
                            items.length > 0 && items.map((item, index) => (
                                <div key={item.id} className="relative h-auto overflow-y-auto rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
                                    <div className="w-full h-auto flex flex-col md:flex-row items-start md:items-center gap-4">
                                        <img 
                                            src={`${baseURL}${item.image}`} 
                                            alt="item" 
                                            className="rounded-xl w-full md:w-28 h-52 md:h-28 min-w-28 min-h-28 object-center object-cover bg-gray-100" 
                                        />
                                        <div className="w-full flex flex-col gap-2 text-xs text-gray-600">
                                            <div className="flex items-start justify-between gap-3 pr-10">
                                                <div>
                                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Item</p>
                                                    <strong className="text-base text-orange-600">{item.name}</strong>
                                                </div>
                                                <span className="rounded-full bg-orange-50 px-3 py-1 text-[11px] font-semibold text-orange-700">
                                                    Qty {item.quantity}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                                <div className="rounded-lg border border-gray-100 bg-gray-50 px-2 py-2">
                                                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Category</p>
                                                    <p className="text-xs font-medium text-gray-700">{getCategoryName(item.category)}</p>
                                                </div>
                                                <div className="rounded-lg border border-gray-100 bg-gray-50 px-2 py-2">
                                                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Subcategory</p>
                                                    <p className="text-xs font-medium text-gray-700">{getSubcategoryName(item.sub_category)}</p>
                                                </div>
                                                <div className="rounded-lg border border-gray-100 bg-gray-50 px-2 py-2">
                                                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Unit</p>
                                                    <p className="text-xs font-medium text-gray-700">{item.unit || "..."}</p>
                                                </div>
                                                <div className="rounded-lg border border-gray-100 bg-gray-50 px-2 py-2">
                                                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Notes</p>
                                                    <p className="text-xs font-medium text-gray-700">{item.notes || "..."}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setDeleteItemId(item.id)}
                                        className="absolute right-3 top-3 rounded-full border border-gray-200 bg-white p-1 text-gray-400 transition hover:border-red-200 hover:text-red-500"
                                        aria-label="Delete item"
                                    >
                                        <X className="min-w-4 w-4 min-h-4 h-4" />
                                    </button>
                                </div>
                            ))
                        )}
                        {items.length === 0 && !loading && (
                            <div className="min-h-48 w-full flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-200 bg-gray-50">
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
                                        <select
                                            value={form.unit}
                                            onChange={(e) => setForm({ ...form, unit: e.target.value })}
                                            className="bg-white text-sm px-4 py-2 rounded-md border border-gray-300 placeholder:text-xs"
                                        >
                                            <option value="">Select unit...</option>
                                            {unitOptions.map((option) => (
                                                <option key={option.unit} value={option.unit}>
                                                    {option.description}
                                                </option>
                                            ))}
                                        </select>
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
