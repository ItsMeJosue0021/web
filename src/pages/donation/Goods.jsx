import { useEffect, useState } from "react";
import Guest from '../../layouts/Guest'
import { Link } from "react-router-dom";
import { _post, _get } from "../../api";
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa";
import { Check } from "lucide-react";
import { FaMapMarkedAlt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import ModalContainer from "../../components/ModalContainer";
import CircularLoading from "../../components/CircularLoading";

const Goods = () => {

    // Individual states
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('Main Address');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const [activeStep, setActiveStep] = useState(1);
    const [isAnonymous, setIsAnonymous] = useState(false);

    const [donationCategories, setDonationCategories] = useState([]);
    const [filteredSubcategories, setFilteredSubcategories] = useState([]);
    const [items, setItems] = useState([]);
    const [itemErrors, setItemErrors] = useState({});
    const [itemForm, setItemForm] = useState({
        name: "",
        category_id: "",
        subcategory_id: "",
        quantity: "",
        unit: "",
        notes: "",
        image: null
    });

    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [editingItemId, setEditingItemId] = useState(null);

    const [map, setMap] = useState({
        main: false,    
        satellite: false
    });

    useEffect(() => {
        fetchCategories();
    }, []);
    
    const fetchCategories = async () => {
        try {
            const response = await _get(`/goods-donation-categories`);
            setDonationCategories(response.data.categories || []);
            if (!response.ok) {
                console.log(response);
            }
        } catch (error) {
            console.error(error);
        }
    }


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

    const handleItemCategoryChange = (e) => {
        const selectedId = e.target.value;
        setItemForm((prev) => ({
            ...prev,
            category_id: selectedId,
            subcategory_id: ""
        }));

        const category = donationCategories.find(cat => cat.id == selectedId);
        setFilteredSubcategories(category ? category.subcategories : []);
    };

    const validateItemForm = () => {
        const nextErrors = {};

        if (!itemForm.name) nextErrors.name = "Item name is required.";
        if (!itemForm.category_id) nextErrors.category_id = "Category is required.";
        if (!itemForm.subcategory_id) nextErrors.subcategory_id = "Subcategory is required.";
        if (!itemForm.quantity) nextErrors.quantity = "Quantity is required.";
        if (itemForm.quantity && isNaN(itemForm.quantity)) nextErrors.quantity = "Quantity must be a number.";

        setItemErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const resetItemForm = () => {
        setItemForm({
            name: "",
            category_id: "",
            subcategory_id: "",
            quantity: "",
            unit: "",
            notes: "",
            image: null
        });
        setFilteredSubcategories([]);
        setItemErrors({});
    };

    const addItem = () => {
        if (!validateItemForm()) return false;

        const newItem = {
            id: `${Date.now()}-${Math.round(Math.random() * 100000)}`,
            name: itemForm.name,
            category_id: itemForm.category_id,
            subcategory_id: itemForm.subcategory_id,
            quantity: itemForm.quantity,
            unit: itemForm.unit,
            notes: itemForm.notes,
            image: itemForm.image
        };

        setItems((prev) => [...prev, newItem]);
        resetItemForm();
        return true;
    };

    const removeItem = (id) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const updateItem = () => {
        if (!validateItemForm()) return false;

        setItems((prev) =>
            prev.map((item) =>
                item.id === editingItemId
                    ? {
                        ...item,
                        name: itemForm.name,
                        category_id: itemForm.category_id,
                        subcategory_id: itemForm.subcategory_id,
                        quantity: itemForm.quantity,
                        unit: itemForm.unit,
                        notes: itemForm.notes,
                        image: itemForm.image
                    }
                    : item
            )
        );

        resetItemForm();
        setEditingItemId(null);
        return true;
    };

    const openAddItemModal = () => {
        resetItemForm();
        setEditingItemId(null);
        setIsItemModalOpen(true);
    };

    const openEditItemModal = (item) => {
        const category = donationCategories.find(cat => cat.id == item.category_id);
        setFilteredSubcategories(category ? category.subcategories : []);
        setItemForm({
            name: item.name,
            category_id: item.category_id,
            subcategory_id: item.subcategory_id,
            quantity: item.quantity,
            unit: item.unit,
            notes: item.notes,
            image: item.image || null
        });
        setItemErrors({});
        setEditingItemId(item.id);
        setIsItemModalOpen(true);
    };

    const closeItemModal = () => {
        setIsItemModalOpen(false);
        setEditingItemId(null);
        resetItemForm();
    };

    const saveItem = () => {
        if (editingItemId) {
            return updateItem();
        }
        return addItem();
    };

    const getCategoryName = (id) => {
        const category = donationCategories.find(cat => cat.id == Number(id));
        return category ? category.name : "Unknown";
    };

    const getSubcategoryName = (id) => {
        for (let cat of donationCategories) {
            const sub = cat.subcategories.find(sc => sc.id == Number(id));
            if (sub) return sub.name;
        }
        return "Unknown";
    };

    const canProceedToStep2 =
        (isAnonymous || name.trim() !== "") &&
        email.trim() !== "" &&
        items.length > 0;

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = new FormData();
        payload.append("name", isAnonymous ? "" : name);
        payload.append("email", email);
        payload.append("address", address);
        payload.append("is_anonymous", isAnonymous ? "1" : "0");

        items.forEach((item, index) => {
            payload.append(`items[${index}][name]`, item.name);
            payload.append(`items[${index}][category]`, item.category_id);
            payload.append(`items[${index}][sub_category]`, item.subcategory_id);
            payload.append(`items[${index}][quantity]`, item.quantity);
            payload.append(`items[${index}][unit]`, item.unit || "");
            payload.append(`items[${index}][notes]`, item.notes || "");
            if (item.image) payload.append(`items[${index}][image]`, item.image);
        });

        try {
            await _post('/goods-donations', payload);

            toast.success('Donation submitted successfully!');
            setName('');
            setAddress('Main Address');
            setItems([]);
            resetItemForm();
            setLoading(false);
            setActiveStep(4);
        } catch (error) {
            setLoading(false);
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
                toast.error(error.response.data.message || 'Validation failed.');
            } else {
                toast.error('Something went wrong. Please try again.');
                console.error('Error submitting donation:', error);
            }
        }
    };

    return (
        <Guest>   
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
                    <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-xl border border-gray-100 p-6 flex flex-col items-center text-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
                            <CircularLoading customClass="w-7 h-7 text-orange-600" />
                        </div>
                        <p className="text-lg font-semibold text-gray-800">Sending your donation</p>
                        <p className="text-xs text-gray-500">
                            Please keep this window open while we submit your items.
                        </p>
                    </div>
                </div>
            )}  
            <div className="bg-gray-50 min-h-screen w-full p-4">
                <div className="w-full max-w-[1100px] mx-auto h-full flex flex-col p-2 md:px-4 pt-24">
                    {activeStep < 4 && (
                        <Link to="/donate" className="md:px-4 py-2 mb-3 rounded w-fit text-xs text-gray-500">
                            <div className="flex items-center gap-2">
                                <FaArrowLeft size={14} />
                                <span>Back</span>
                            </div>
                        </Link>
                    )}

                    <div className="flex items-start gap-12 md:mt-4">
                        <div className="w-full max-w-[850px] mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-8">
                            {activeStep < 4 && (
                                <div className="w-full flex flex-col items-start justify-start mb-6 gap-1">
                                    <p className="text-xs uppercase tracking-[0.2em] text-orange-500 font-semibold">Goods Donation</p>
                                    <p className="text-xl font-semibold text-gray-800">We&apos;d love to acknowledge your support <span className="text-[11px] text-gray-500">(Optional)</span></p>
                                    <p className="text-sm text-gray-600">Please complete this form so we can properly track your donation. Thank you!</p>
                                </div>
                            )}

                            {activeStep === 1 ? (
                                <div className="w-full flex items-center justify-center p-1">
                                    <div className="w-full flex flex-col items-start justify-start gap-5">
                                        <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4">
                                            <div className="mb-3">
                                                <p className="text-sm font-semibold text-gray-800">Donor Information</p>
                                                <p className="text-xs text-gray-600">
                                                    Add your name and email so we can acknowledge your goods donation.
                                                </p>
                                            </div>

                                            <div className="flex flex-col gap-4">
                                                <div className="w-full flex flex-col md:flex-row md:items-center gap-2 md:gap-2">
                                                    <div className="w-full md:w-32">
                                                        <label className="text-xs font-medium">Name <span className="text-[9px] text-gray-500">(Optional)</span></label>
                                                    </div>
                                                    
                                                    <div className="w-full flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                                                        <input
                                                            type="text"
                                                            name="name"
                                                            value={name}
                                                            onChange={(e) => setName(e.target.value)}
                                                            className={`w-full md:w-auto px-4 py-2 rounded-md border ${isAnonymous ? 'bg-gray-200 cursor-not-allowed' : 'bg-white'} border-gray-300 text-xs`}
                                                            disabled={isAnonymous}
                                                        />
                                                        <label className="w-fit flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                value={isAnonymous}
                                                                checked={isAnonymous}
                                                                onChange={() => setIsAnonymous(!isAnonymous)}
                                                                className="h-4 w-4 bg-white border border-gray-300 cursor-pointer accent-white"
                                                                style={{ accentColor: '#fff' }}
                                                            />
                                                            <span className="text-xs capitalize">Anonymous</span>
                                                        </label>
                                                    </div>
                                                    
                                                </div>

                                                <div className="w-full flex flex-col md:flex-row md:items-center gap-2 md:gap-2">
                                                    <div className="w-full md:w-32">
                                                        <label className="text-xs font-medium">Email</label>
                                                    </div>
                                                    <div className="w-full">
                                                        <input
                                                            type="text"
                                                            name="email"
                                                            value={email}
                                                            onChange={(e) => setEmail(e.target.value)}
                                                            className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-xs"
                                                        />
                                                    </div>
                                                    
                                                </div>
                                            </div>
                                        </div>

                                        <div className="w-full bg-white border border-gray-200 rounded-xl p-4">
                                            <div className="mb-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800">Itemize Your Donation</p>
                                                    <p className="text-xs text-gray-600">
                                                        Please list each item you are donating. Add as many items as needed before proceeding.
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={openAddItemModal}
                                                    className="text-xs rounded px-4 py-2 cursor-pointer hover:bg-orange-700 text-white bg-orange-600 border-none w-fit"
                                                >
                                                    Add Item
                                                </button>
                                            </div>

                                            <div className="w-full mt-3">
                                                <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
                                                    <table className="w-full min-w-[700px] text-xs">
                                                        <thead className="bg-gray-100 text-gray-700">
                                                            <tr>
                                                                <th className="p-2 text-left">Item Name</th>
                                                                <th className="p-2 text-left">Category</th>
                                                                <th className="p-2 text-left">Subcategory</th>
                                                                <th className="p-2 text-left">Quantity</th>
                                                                <th className="p-2 text-left">Unit</th>
                                                                <th className="p-2 text-left">Notes</th>
                                                                <th className="p-2 text-left">Image</th>
                                                                <th className="p-2 text-left">Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {items.length === 0 ? (
                                                                <tr>
                                                                    <td colSpan={8} className="p-3 text-center text-gray-500">
                                                                        No items added yet.
                                                                    </td>
                                                                </tr>
                                                            ) : (
                                                                items.map((item) => (
                                                                    <tr key={item.id} className="border-t border-gray-100">
                                                                        <td className="p-2">{item.name}</td>
                                                                        <td className="p-2">{getCategoryName(item.category_id)}</td>
                                                                        <td className="p-2">{getSubcategoryName(item.subcategory_id)}</td>
                                                                        <td className="p-2">{item.quantity}</td>
                                                                        <td className="p-2">{item.unit || "-"}</td>
                                                                        <td className="p-2">{item.notes || "-"}</td>
                                                                        <td className="p-2">{item.image ? item.image.name : "-"}</td>
                                                                        <td className="p-2">
                                                                            <div className="flex items-center gap-3">
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => openEditItemModal(item)}
                                                                                    className="text-orange-600 hover:text-orange-700"
                                                                                >
                                                                                    Edit
                                                                                </button>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => removeItem(item.id)}
                                                                                    className="text-red-600 hover:text-red-700"
                                                                                >
                                                                                    Delete
                                                                                </button>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Next Button */}

                                        <div className="w-full flex justify-end">
                                            <button
                                                type="submit"
                                                className={`text-xs px-6 py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white transition-colors duration-300 border-0 ${!canProceedToStep2 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                onClick={() => setActiveStep(2)}
                                                disabled={!canProceedToStep2}
                                            >
                                                Next
                                            </button>
                                        </div>

                                    </div>
                                </div>
                                ) : activeStep === 2 ? (
                                <div className="w-full flex flex-col justify-center items-center gap-4 pb-4">
                                    <div className="w-full h-fit flex flex-col items-start justify-start">
                                        <p className="text-base font-medium">Select location to hand in you donations</p>
                                        <p className="text-xs">You may personally hand in your cash donations at the following addresses:</p>
                                    </div>
                                    <div className="flex flex-col md:flex-row items-center gap-4 w-full pt-4">
                                        <div onClick={() => setAddress("Main Address")} className={`cursor-pointer relative w-full flex flex-col items-center justify-center p-8 rounded-xl shadow-sm ${address === 'Main Address' ? "bg-gray-100 border-blue-200" : "bg-transparent"} hover:bg-gray-100 border border-transparent hover:border-blue-200`}>
                                            <p className="text-orange-500 text-base font-semibold mb-2">Main Address</p>
                                            <p className="text-sm text-center">B4 Lot 6-6 Fantasy Road 3, Teresa Park Subd., Pilar, Las Pinas City</p>
                                            {address === 'Main Address' && (
                                                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-1 py-1 rounded-full flex items-center">
                                                    <Check size={23}/>
                                                </div>
                                            )}
                                            <div className="pt-2 z-20">
                                                <FaMapMarkedAlt 
                                                size={25} 
                                                className="text-blue-500 cursor-pointer"
                                                onClick={() => setMap(prev => ({...prev, main: true}))} />
                                            </div>
                                        </div>

                                        <div onClick={() => setAddress("Satellite Address")} className={`cursor-pointer relative w-full flex flex-col items-center justify-center p-8 rounded-xl shadow-sm ${address === 'Satellite Address' ? "bg-gray-100 border-blue-200" : "bg-transparent"} hover:bg-gray-100 border border-transparent hover:border-blue-200`}>
                                            <p className="text-orange-500 text-base  font-semibold mb-2">Satellite Address</p>
                                            <p className="text-sm text-center">Block 20 Lot 15-A Mines View, Teresa Park Subd., Pilar, Las Pinas City</p>
                                            {address === 'Satellite Address' && (
                                                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-1 py-1 rounded-full flex items-center">
                                                    <Check size={23}/>
                                                </div>
                                            )}
                                            <div className="pt-2">
                                                <FaMapMarkedAlt 
                                                size={25} 
                                                className="text-blue-500 cursor-pointer"
                                                onClick={() => setMap(prev => ({...prev, satellite: true}))} />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 w-full mt-4">
                                        <button
                                            type="submit"
                                            className="w-fit text-xs px-6 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors duration-300 border-0"
                                            onClick={() => setActiveStep(1)}
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            className="w-fit text-xs px-6 py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white transition-colors duration-300 border-0"
                                            onClick={() => setActiveStep(3)}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            ) : activeStep === 3 ? (
                                <div className="w-full">
                                    <h2 className="w-full border-b text-sm font-semibold mb-2">Review Your Information</h2>

                                    {/* Display user input data */}
                                     <div className="space-y-1 text-xs">
                                        <p><strong>Name:</strong> {isAnonymous ? "Anonymous" : name || "N/A"}</p>
                                        <p><strong>Email:</strong> {email || "N/A"}</p>
                                        <p><strong>Address:</strong> {address}</p>
                                        <div className="pt-2">
                                            <p className="font-semibold">Items</p>
                                            <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 mt-2">
                                                <table className="w-full min-w-[700px] text-xs">
                                                    <thead className="bg-gray-100 text-gray-700">
                                                        <tr>
                                                            <th className="p-2 text-left">Item Name</th>
                                                            <th className="p-2 text-left">Category</th>
                                                            <th className="p-2 text-left">Subcategory</th>
                                                            <th className="p-2 text-left">Quantity</th>
                                                            <th className="p-2 text-left">Unit</th>
                                                            <th className="p-2 text-left">Notes</th>
                                                            <th className="p-2 text-left">Image</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {items.length === 0 ? (
                                                            <tr>
                                                                <td colSpan={7} className="p-3 text-center text-gray-500">
                                                                    No items added.
                                                                </td>
                                                            </tr>
                                                        ) : (
                                                            items.map((item) => (
                                                                <tr key={item.id} className="border-t border-gray-100">
                                                                    <td className="p-2">{item.name}</td>
                                                                    <td className="p-2">{getCategoryName(item.category_id)}</td>
                                                                    <td className="p-2">{getSubcategoryName(item.subcategory_id)}</td>
                                                                    <td className="p-2">{item.quantity}</td>
                                                                    <td className="p-2">{item.unit || "-"}</td>
                                                                    <td className="p-2">{item.notes || "-"}</td>
                                                                    <td className="p-2">{item.image ? item.image.name : "-"}</td>
                                                                </tr>
                                                            ))
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Display chosen address */}
                                  
                                    <div className="pt-4">
                                        <h3 className="w-full border-b text-sm font-semibold mb-2">Chosen Address</h3>
                                        <p className="mb-4 text-xs">{address}</p>
                                        <iframe
                                            src={address == "Main Address" ? "https://www.google.com/maps?q=B4%20Lot%206-6%20Fantasy%20Road%203%2C%20Teresa%20Park%20Subd.%2C%20Pilar%2C%20Las%20Pi%C3%B1as%20City&output=embed" : "https://www.google.com/maps?q=Block%2020%20Lot%2015-A%20Mines%20View%2C%20Teresa%20Park%20Subd.%2C%20Pilar%2C%20Las%20Pi%C3%B1as%20City&output=embed" }
                                            className="w-full h-[95%] mt-2 rounded"
                                            style={{ border: 0 }}
                                            allowFullScreen
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                            title="Google Maps Location"
                                        />
                                    </div>
                                   

                                    {/* Action buttons */}
                                    <div className="flex items-center gap-2 w-full mt-4">
                                        <button
                                            type="submit"
                                            className="w-fit text-xs px-6 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors duration-300 border-0"
                                            onClick={() => setActiveStep(2)}
                                        >
                                            Back
                                        </button>

                                        {/* Submit */}
                                        <button
                                        type="submit"
                                        className="w-fit text-xs px-4 py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white transition-colors duration-300 border-0"
                                        onClick={handleSubmit}
                                        >
                                            {loading ? 'Sending...' : 'Send Donation'}
                                        </button>
                                    </div>
                                </div>
                            ) : activeStep === 4 && (
                                <div className="w-full flex flex-col justify-center items-center gap-6 text-center py-12">
                                    <div className="flex flex-col items-center gap-3">
                                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-100">
                                        <Check size={32} className="text-green-600" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-green-700">Thank You!</h2>
                                    <p className="text-sm text-gray-600 max-w-md">
                                        Your donation has been submitted successfully. We truly appreciate your support
                                        and generosity!
                                    </p>
                                    </div>

                                    <div className="flex flex-col items-center gap-3 mt-6">
                                        <button
                                            className="px-6 py-2 text-xs rounded-md bg-orange-500 hover:bg-orange-600 text-white"
                                            onClick={() => {
                                                setName("");
                                                setEmail("");
                                                setAddress("Main Address");
                                                setItems([]);
                                                resetItemForm();
                                                setIsAnonymous(false);
                                                setActiveStep(1);
                                            }}
                                        >
                                            Make Another Donation
                                        </button>

                                        <Link
                                            to="/"
                                            className="text-xs text-gray-600 hover:underline"
                                        >
                                            Back to Home
                                        </Link>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
                
            </div>
            {isItemModalOpen && (
                <ModalContainer isFull={false} close={closeItemModal}>
                    <div className="w-full max-w-[760px] bg-white rounded-xl p-5">
                        <div>
                            <div>
                                <h2 className="text-lg font-semibold text-orange-600">
                                    {editingItemId ? "Edit Item" : "Add New Item"}
                                </h2>
                                <p className="text-xs">
                                    {editingItemId ? "Update the details for this item." : "Add an item to your goods donation."}
                                </p>
                            </div>

                            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                                <div className="w-full flex flex-col">
                                    <label className="text-xs font-medium">Item Name</label>
                                    <input
                                        type="text"
                                        value={itemForm.name}
                                        onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                                        placeholder="Name of the item.."
                                        className="bg-white text-sm px-4 py-2 rounded-md border border-gray-300 placeholder:text-xs"
                                    />
                                    {itemErrors.name && <p className="text-red-500 text-xs">{itemErrors.name}</p>}
                                </div>

                                <div className="w-full flex flex-col">
                                    <label className="text-xs font-medium">Category</label>
                                    <select
                                        value={itemForm.category_id}
                                        onChange={handleItemCategoryChange}
                                        className="bg-white text-sm px-4 py-2 rounded-md border border-gray-300 placeholder:text-xs"
                                    >
                                        <option value="">Select category...</option>
                                        {donationCategories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    {itemErrors.category_id && <p className="text-red-500 text-xs">{itemErrors.category_id}</p>}
                                </div>

                                <div className="w-full flex flex-col">
                                    <label className="text-xs font-medium">Subcategory</label>
                                    <select
                                        value={itemForm.subcategory_id}
                                        onChange={(e) => setItemForm({ ...itemForm, subcategory_id: e.target.value })}
                                        className="bg-white text-sm px-4 py-2 rounded-md border border-gray-300 placeholder:text-xs"
                                    >
                                        <option value="">Select subcategory...</option>
                                        {filteredSubcategories.map(sub => (
                                            <option key={sub.id} value={sub.id}>{sub.name}</option>
                                        ))}
                                    </select>
                                    {itemErrors.subcategory_id && <p className="text-red-500 text-xs">{itemErrors.subcategory_id}</p>}
                                </div>

                                <div className="w-full flex flex-col">
                                    <label className="text-xs font-medium">Quantity</label>
                                    <input
                                        type="text"
                                        value={itemForm.quantity}
                                        onChange={(e) => setItemForm({ ...itemForm, quantity: e.target.value })}
                                        className="bg-white text-sm px-4 py-2 rounded-md border border-gray-300 placeholder:text-xs"
                                    />
                                    {itemErrors.quantity && <p className="text-red-500 text-xs">{itemErrors.quantity}</p>}
                                </div>

                                <div className="w-full flex flex-col">
                                    <label className="text-xs font-medium">Unit</label>
                                    <select
                                        value={itemForm.unit}
                                        onChange={(e) => setItemForm({ ...itemForm, unit: e.target.value })}
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

                                <div className="w-full flex flex-col md:col-span-2">
                                    <label className="text-xs font-medium">Notes</label>
                                    <textarea
                                        value={itemForm.notes}
                                        onChange={(e) => setItemForm({ ...itemForm, notes: e.target.value })}
                                        className="bg-white text-sm px-4 py-2 rounded-md border border-gray-300 placeholder:text-xs resize-none h-20"
                                    />
                                </div>

                                <div className="w-full flex flex-col md:col-span-2">
                                    <label className="text-xs font-medium">Item Image</label>
                                    <input
                                        type="file"
                                        onChange={(e) => setItemForm({ ...itemForm, image: e.target.files[0] })}
                                        className="bg-white text-xs px-4 py-2 rounded-md border border-gray-300 placeholder:text-xs"
                                    />
                                </div>
                            </div>

                            <div className="w-full flex justify-end items-center gap-2">
                                <button
                                    onClick={() => {
                                        if (saveItem()) setIsItemModalOpen(false);
                                    }}
                                    className="text-xs rounded px-6 py-2 cursor-pointer text-white bg-orange-600 border-none hover:bg-orange-700"
                                >
                                    {editingItemId ? "Update Item" : "Save Item"}
                                </button>

                                <button
                                    onClick={closeItemModal}
                                    className="text-xs rounded px-6 py-2 cursor-pointer hover:bg-gray-300 text-black bg-gray-200 border-none"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </ModalContainer>
            )}

            {(map.main || map.satellite) && (
                <div className="fixed bottom-0 left-0 w-screen h-screen bg-white p-4 border-t z-50">
                    <div className="w-full flex items-center justify-end">
                        <IoMdClose 
                        size={25} 
                        className="text-gray-500 cursor-pointer hover:text-blue-600" 
                        onClick={() => setMap(prev => ({satellite: false, main: false}))}/>
                    </div>
                    <iframe
                        src={map.main ? "https://www.google.com/maps?q=B4%20Lot%206-6%20Fantasy%20Road%203%2C%20Teresa%20Park%20Subd.%2C%20Pilar%2C%20Las%20Pi%C3%B1as%20City&output=embed" : map.satellite ? "https://www.google.com/maps?q=Block%2020%20Lot%2015-A%20Mines%20View%2C%20Teresa%20Park%20Subd.%2C%20Pilar%2C%20Las%20Pi%C3%B1as%20City&output=embed" : ""}
                        className="w-full h-[95%] mt-2 rounded"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Google Maps Location"
                    />
                </div>
            )}
        </Guest>
    )
}

export default Goods;
