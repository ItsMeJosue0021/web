import { useCallback, useEffect, useRef, useState } from "react";
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
import { getExpiryWarningMeta } from "../../utils/expiryWarning";

const normalizeSuggestion = (entry, index) => {
    if (typeof entry === "string") {
        const name = entry.trim();
        if (!name) return null;
        return { id: `${name}-${index}`, name };
    }

    if (entry && typeof entry === "object") {
        const name = `${entry.name ?? entry.label ?? entry.value ?? ""}`.trim();
        if (!name) return null;
        return { id: entry.id ?? `${name}-${index}`, name };
    }

    return null;
};

const Goods = () => {
    const today = new Date();
    const minExpiryDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(
        today.getDate()
    ).padStart(2, "0")}`;

    const renderExpiryBadge = (value) => {
        const expiryMeta = getExpiryWarningMeta(value, { emptyLabel: "No Expiry" });
        return (
            <span className={`inline-flex items-center rounded px-2 py-1 text-[11px] font-semibold ${expiryMeta.className}`}>
                {expiryMeta.label}
            </span>
        );
    };

    const sectionCardClass =
        "w-full rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200";
    const sectionTitleClass = "text-xs uppercase tracking-[0.2em] text-orange-500 font-semibold";
    const panelHeadingClass = "text-sm font-semibold text-gray-800";
    const panelSubheadingClass = "text-xs text-gray-500";
    const fieldBaseClass = "w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition";
    const labelClass = "text-xs font-medium text-gray-700";
    const fieldErrorClass = "text-red-500 text-xs";

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
    const [units, setUnits] = useState([]);
    const [itemErrors, setItemErrors] = useState({});
    const [unitsError, setUnitsError] = useState("");
    const [itemForm, setItemForm] = useState({
        name: "",
        category_id: "",
        subcategory_id: "",
        quantity: "",
        unit: "",
        expiry_date: "",
        notes: "",
        image: null
    });
    const [itemImagePreview, setItemImagePreview] = useState("");

    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [editingItemId, setEditingItemId] = useState(null);
    const [itemSuggestions, setItemSuggestions] = useState([]);
    const [suggestionsLoading, setSuggestionsLoading] = useState(false);
    const [suggestionsError, setSuggestionsError] = useState("");
    const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
    const suggestionContainerRef = useRef(null);
    const suggestionsRequestRef = useRef(0);
    const [unitsLoading, setUnitsLoading] = useState(false);

    const [map, setMap] = useState({
        main: false,    
        satellite: false
    });

    const fetchCategories = async () => {
        try {
            const response = await _get(`/goods-donation-categories`);
            setDonationCategories(response.data.categories || []);
        } catch (error) {
            console.error(error);
        }
    }

    const fetchUnits = async () => {
        setUnitsLoading(true);
        setUnitsError("");
        try {
            const response = await _get("/units");
            setUnits(response.data?.units || []);
        } catch (error) {
            console.error(error);
            setUnitsError("Unable to load unit options. Please try again later.");
            setUnits([]);
        } finally {
            setUnitsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchUnits();
    }, []);

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

    const fetchItemSuggestions = useCallback(async (query, limit = 10) => {
        const trimmedQuery = query.trim();
        if (!trimmedQuery) {
            setItemSuggestions([]);
            setSuggestionsError("");
            setSuggestionsLoading(false);
            setActiveSuggestionIndex(-1);
            return;
        }

        const requestId = suggestionsRequestRef.current + 1;
        suggestionsRequestRef.current = requestId;

        setSuggestionsLoading(true);
        setSuggestionsError("");
        try {
            const response = await _get("/item-names/suggestions", {
                params: { q: trimmedQuery, limit }
            });
            const rawSuggestions = response.data?.suggestions || response.data || [];
            const suggestions = (Array.isArray(rawSuggestions) ? rawSuggestions : [])
                .map(normalizeSuggestion)
                .filter(Boolean);

            if (suggestionsRequestRef.current !== requestId) return;

            setItemSuggestions(suggestions);
            setActiveSuggestionIndex(suggestions.length > 0 ? 0 : -1);
        } catch (error) {
            if (suggestionsRequestRef.current !== requestId) return;
            console.error("Error fetching suggestions:", error);
            setSuggestionsError("Unable to load suggestions.");
            setItemSuggestions([]);
            setActiveSuggestionIndex(-1);
        } finally {
            if (suggestionsRequestRef.current === requestId) {
                setSuggestionsLoading(false);
            }
        }
    }, []);

    const selectSuggestion = (suggestion) => {
        setItemForm((prev) => ({ ...prev, name: suggestion.name }));
        setIsSuggestionOpen(false);
        setActiveSuggestionIndex(-1);
    };

    const validateItemForm = () => {
        const nextErrors = {};

        if (!itemForm.name) nextErrors.name = "Item name is required.";
        if (!itemForm.category_id) nextErrors.category_id = "Category is required.";
        if (!itemForm.subcategory_id) nextErrors.subcategory_id = "Subcategory is required.";
        if (!itemForm.quantity) nextErrors.quantity = "Quantity is required.";
        if (itemForm.quantity && isNaN(itemForm.quantity)) nextErrors.quantity = "Quantity must be a number.";
        if (!itemForm.unit) nextErrors.unit = "Unit is required.";

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
            expiry_date: "",
            notes: "",
            image: null
        });
        if (itemImagePreview) {
            URL.revokeObjectURL(itemImagePreview);
        }
        setItemImagePreview("");
        setFilteredSubcategories([]);
        setItemErrors({});
        setItemSuggestions([]);
        setSuggestionsError("");
        setSuggestionsLoading(false);
        setActiveSuggestionIndex(-1);
        suggestionsRequestRef.current += 1;
        setIsSuggestionOpen(false);
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
            expiry_date: itemForm.expiry_date,
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
                        expiry_date: itemForm.expiry_date,
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
            expiry_date: item.expiry_date || "",
            notes: item.notes,
            image: item.image || null
        });
        if (itemImagePreview) {
            URL.revokeObjectURL(itemImagePreview);
        }
        if (item.image && item.image instanceof File) {
            setItemImagePreview(URL.createObjectURL(item.image));
        } else {
            setItemImagePreview("");
        }
        setItemErrors({});
        setEditingItemId(item.id);
        setIsItemModalOpen(true);
    };

    const closeItemModal = () => {
        setIsItemModalOpen(false);
        setEditingItemId(null);
        setIsSuggestionOpen(false);
        resetItemForm();
    };

    useEffect(() => {
        if (!isSuggestionOpen) return;
        const handleOutsideClick = (event) => {
            if (suggestionContainerRef.current && !suggestionContainerRef.current.contains(event.target)) {
                setIsSuggestionOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [isSuggestionOpen]);

    useEffect(() => {
        if (!isItemModalOpen || !isSuggestionOpen) return;
        const query = itemForm.name.trim();
        if (!query) {
            suggestionsRequestRef.current += 1;
            setItemSuggestions([]);
            setSuggestionsError("");
            setSuggestionsLoading(false);
            setActiveSuggestionIndex(-1);
            return;
        }

        const timer = setTimeout(() => {
            fetchItemSuggestions(query, 10);
        }, 100);
        return () => clearTimeout(timer);
    }, [isItemModalOpen, isSuggestionOpen, itemForm.name, fetchItemSuggestions]);

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
            payload.append(`items[${index}][expiry_date]`, item.expiry_date || "");
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-sm p-4">
                        <div className="w-full max-w-[420px] bg-white/95 rounded-lg shadow-xl border border-gray-200 p-6 flex flex-col items-center text-center gap-3">
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
            <div className="bg-gradient-to-br from-slate-50 to-gray-100 min-h-screen w-full p-4">
                <div className="w-full max-w-[1100px] mx-auto h-full flex flex-col p-2 md:px-4 pt-24">
                    {activeStep < 4 && (
                        <Link to="/donate" className="md:px-4 py-2 mb-3 rounded w-fit text-xs text-gray-500">
                            <div className="flex items-center gap-2">
                                <FaArrowLeft size={14} />
                                <span>Back</span>
                            </div>
                        </Link>
                    )}
                    {activeStep < 4 && (
                        <div className="mb-4 w-full max-w-[850px] mx-auto rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
                            This site is in development. Donations are not being accepted yet. Please do not submit any donation or payment at this time.
                        </div>
                    )}

                    <div className="flex items-start gap-12 md:mt-4">
                        <div className={`${sectionCardClass} max-w-[850px] mx-auto p-4 md:p-8`}>
                            {activeStep < 4 && (
                                    <div className="w-full flex flex-col items-start justify-start mb-6 gap-1">
                                    <p className={sectionTitleClass}>Goods Donation</p>
                                    <p className="text-2xl font-semibold text-gray-800">We&apos;d love to acknowledge your support <span className="text-[11px] text-gray-500">(Optional)</span></p>
                                    <p className="text-sm text-gray-600">Please complete this form so we can properly track your donation. Thank you!</p>
                                </div>
                            )}

                            {activeStep === 1 ? (
                                <div className="w-full flex items-center justify-center p-1">
                                    <div className="w-full flex flex-col items-start justify-start gap-5">
                                        <div className="w-full bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                                            <div className="mb-3">
                                                <p className={panelHeadingClass}>Donor Information</p>
                                                <p className="text-xs text-gray-600">
                                                    Add your name and email so we can acknowledge your goods donation.
                                                </p>
                                            </div>

                                            <div className="flex flex-col gap-4">
                                                <div className="w-full flex flex-col md:flex-row md:items-center gap-2 md:gap-2">
                                                    <div className="w-full md:w-32">
                                                        <label className={labelClass}>Name <span className="text-[9px] text-gray-500">(Optional)</span></label>
                                                    </div>
                                                    
                                                    <div className="w-full flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                                                        <input
                                                            type="text"
                                                            name="name"
                                                            value={name}
                                                            onChange={(e) => setName(e.target.value)}
                                                            className={`${fieldBaseClass} ${isAnonymous ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
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
                                                        <label className={labelClass}>
                                                            Email <span className="text-red-500">*</span>
                                                        </label>
                                                    </div>
                                                    <div className="w-full">
                                                        <input
                                                            type="text"
                                                            name="email"
                                                            value={email}
                                                            onChange={(e) => setEmail(e.target.value)}
                                                            className={`${fieldBaseClass}`}
                                                        />
                                                    </div>
                                                    
                                                </div>
                                            </div>
                                        </div>

                                        <div className="w-full bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                                            <div className="mb-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                                <div>
                                                <p className={panelHeadingClass}>Itemize Your Donation</p>
                                                    <p className="text-xs text-gray-600">
                                                        Please list each item you are donating. Add as many items as needed before proceeding.
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={openAddItemModal}
                                                    className="text-xs rounded-md px-4 py-2 cursor-pointer hover:bg-orange-700 text-white bg-orange-600 border-none w-fit shadow-sm"
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
                                                                <th className="p-2 text-left">Expiry Date</th>
                                                                <th className="p-2 text-left">Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {items.length === 0 ? (
                                                                <tr>
                                                                    <td colSpan={7} className="p-3 text-center text-gray-500">
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
                                                                        <td className="p-2">{renderExpiryBadge(item.expiry_date)}</td>
                                                                        <td className="p-2">
                                                                            <div className="flex items-center gap-3">
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => openEditItemModal(item)}
                                                                                    className="text-orange-600 hover:text-orange-700"
                                                                                >
                                                                                    View
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
                                                className={`text-xs px-6 py-2 rounded-md bg-orange-600 hover:bg-orange-700 text-white transition-colors duration-200 border-0 shadow-sm ${!canProceedToStep2 ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                                        <div onClick={() => setAddress("Main Address")} className={`cursor-pointer relative w-full flex flex-col items-center justify-center p-8 rounded-md shadow-sm ${address === 'Main Address' ? "bg-gray-100 border-blue-200" : "bg-transparent"} hover:bg-gray-100 border border-transparent hover:border-blue-200`}>
                                            <p className="text-orange-700 text-base font-semibold mb-2">Main Address</p>
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

                                        <div onClick={() => setAddress("Satellite Address")} className={`cursor-pointer relative w-full flex flex-col items-center justify-center p-8 rounded-md shadow-sm ${address === 'Satellite Address' ? "bg-gray-100 border-blue-200" : "bg-transparent"} hover:bg-gray-100 border border-transparent hover:border-blue-200`}>
                                            <p className="text-orange-700 text-base  font-semibold mb-2">Satellite Address</p>
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
                                            className="w-fit text-xs px-6 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors duration-200 border border-gray-200 text-gray-700"
                                            onClick={() => setActiveStep(1)}
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            className="w-fit text-xs px-6 py-2 rounded-md bg-orange-600 hover:bg-orange-700 text-white transition-colors duration-200 border-0 shadow-sm"
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
                                                            <th className="p-2 text-left">Expiry Date</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {items.length === 0 ? (
                                                            <tr>
                                                                <td colSpan={6} className="p-3 text-center text-gray-500">
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
                                                                    <td className="p-2">{renderExpiryBadge(item.expiry_date)}</td>
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
                                        className="w-fit text-xs px-6 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors duration-200 border border-gray-200 text-gray-700"
                                            onClick={() => setActiveStep(2)}
                                        >
                                            Back
                                        </button>

                                        {/* Submit */}
                                        <button
                                        type="submit"
                                        className="w-fit text-xs px-6 py-2 rounded-md bg-orange-600 hover:bg-orange-700 text-white transition-colors duration-200 border-0 shadow-sm"
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
                                            className="w-fit px-6 py-2 text-xs rounded-md bg-orange-600 hover:bg-orange-700 text-white shadow-sm"
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
                <div className="w-full max-w-[960px] bg-white rounded-lg p-6 hide-scrollbar border border-gray-200 shadow-lg">
                        <div>
                            <div>
                                <h2 className="text-lg font-semibold text-orange-700">
                                    {editingItemId ? "Edit Item" : "Add New Item"}
                                </h2>
                                <p className="text-xs">
                                    {editingItemId ? "Update the details for this item." : "Add an item to your goods donation."}
                                </p>
                            </div>

                            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                                <div className="w-full flex flex-col md:col-span-2">
                                    <label className={labelClass}>
                                        Item Name <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative mt-1" ref={suggestionContainerRef}>
                                        <input
                                            type="text"
                                            value={itemForm.name}
                                            onChange={(e) => {
                                                const nextName = e.target.value;
                                                setItemForm((prev) => ({ ...prev, name: nextName }));
                                                setIsSuggestionOpen(true);
                                            }}
                                            onFocus={() => setIsSuggestionOpen(true)}
                                            onKeyDown={(e) => {
                                                if (!isSuggestionOpen) return;

                                                if (e.key === "ArrowDown") {
                                                    if (itemSuggestions.length === 0) return;
                                                    e.preventDefault();
                                                    setActiveSuggestionIndex((prev) =>
                                                        prev < itemSuggestions.length - 1 ? prev + 1 : 0
                                                    );
                                                    return;
                                                }

                                                if (e.key === "ArrowUp") {
                                                    if (itemSuggestions.length === 0) return;
                                                    e.preventDefault();
                                                    setActiveSuggestionIndex((prev) =>
                                                        prev > 0 ? prev - 1 : itemSuggestions.length - 1
                                                    );
                                                    return;
                                                }

                                                if (e.key === "Enter") {
                                                    if (itemSuggestions.length === 0) return;
                                                    e.preventDefault();
                                                    const selectedSuggestion =
                                                        itemSuggestions[activeSuggestionIndex] || itemSuggestions[0];
                                                    if (selectedSuggestion) {
                                                        selectSuggestion(selectedSuggestion);
                                                    }
                                                    return;
                                                }

                                                if (e.key === "Escape") {
                                                    setIsSuggestionOpen(false);
                                                }
                                            }}
                                            placeholder="Name of the item.."
                                            className={`${fieldBaseClass} ${itemForm.name ? "" : "bg-white"}`}
                                        />
                                        {isSuggestionOpen && (
                                            <div className="absolute left-0 right-0 z-20 mt-1 rounded-md border border-gray-200 bg-white shadow-lg">
                                                <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
                                                    <p className="text-[11px] font-medium text-gray-500">Suggestions</p>
                                                    <button
                                                        type="button"
                                                        onMouseDown={(e) => e.preventDefault()}
                                                        onClick={() => fetchItemSuggestions(itemForm.name, 10)}
                                                        className="text-[11px] text-orange-600 hover:text-orange-700"
                                                    >
                                                        Refresh
                                                    </button>
                                                </div>
                                                {suggestionsLoading ? (
                                                    <p className="px-3 py-2 text-[11px] text-gray-400">Loading suggestions...</p>
                                                ) : suggestionsError ? (
                                                    <p className="px-3 py-2 text-[11px] text-red-500">{suggestionsError}</p>
                                                ) : itemSuggestions.length === 0 ? (
                                                    <p className="px-3 py-2 text-[11px] text-gray-400">No suggestions available.</p>
                                                ) : (
                                                    <div className="max-h-56 overflow-y-auto py-1">
                                                        {itemSuggestions.map((suggestion, index) => (
                                                            <button
                                                                key={`${suggestion.id}-${index}`}
                                                                type="button"
                                                                onMouseDown={(e) => e.preventDefault()}
                                                                onMouseEnter={() => setActiveSuggestionIndex(index)}
                                                                onClick={() => selectSuggestion(suggestion)}
                                                                className={`w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 ${activeSuggestionIndex === index ? "bg-gray-100" : ""}`}
                                                            >
                                                                {suggestion.name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {itemErrors.name && <p className="text-red-500 text-xs">{itemErrors.name}</p>}
                                </div>

                                <div className="w-full flex flex-col">
                                    <label className={labelClass}>
                                        Category <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={itemForm.category_id}
                                        onChange={handleItemCategoryChange}
                                        className={fieldBaseClass}
                                    >
                                        <option value="">Select category...</option>
                                        {donationCategories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    {itemErrors.category_id && <p className="text-red-500 text-xs">{itemErrors.category_id}</p>}
                                </div>

                                <div className="w-full flex flex-col">
                                    <label className={labelClass}>
                                        Subcategory <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={itemForm.subcategory_id}
                                        onChange={(e) => setItemForm({ ...itemForm, subcategory_id: e.target.value })}
                                        className={fieldBaseClass}
                                    >
                                        <option value="">Select subcategory...</option>
                                        {filteredSubcategories.map(sub => (
                                            <option key={sub.id} value={sub.id}>{sub.name}</option>
                                        ))}
                                    </select>
                                    {itemErrors.subcategory_id && <p className="text-red-500 text-xs">{itemErrors.subcategory_id}</p>}
                                </div>

                                <div className="w-full flex flex-col">
                                    <label className={labelClass}>
                                        Quantity <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={itemForm.quantity}
                                        onChange={(e) => setItemForm({ ...itemForm, quantity: e.target.value })}
                                        className={`${fieldBaseClass} max-h-10`}
                                    />
                                    {itemErrors.quantity && <p className="text-red-500 text-xs">{itemErrors.quantity}</p>}
                                </div>

                                <div className="w-full flex flex-col">
                                    <label className={labelClass}>Unit <span className="text-red-500">*</span></label>
                                    <select
                                        value={itemForm.unit}
                                        onChange={(e) => setItemForm({ ...itemForm, unit: e.target.value })}
                                        className={fieldBaseClass}
                                    >
                                        <option value="">Select unit...</option>
                                        {units.map((option) => (
                                            <option key={option.unit} value={option.unit}>
                                                {option.description}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-[11px] text-red-500">{unitsLoading ? "Loading units..." : unitsError || ""}</p>
                                    <p className="text-red-500 text-xs min-h-[16px]">{itemErrors.unit || ""}</p>
                                </div>

                                <div className="w-full flex flex-col">
                                    <label className={labelClass}>
                                        Expiry Date <span className="text-[9px] text-gray-500">(Optional)</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={itemForm.expiry_date}
                                        onChange={(e) => setItemForm({ ...itemForm, expiry_date: e.target.value })}
                                        min={minExpiryDate}
                                        className={fieldBaseClass}
                                    />
                                </div>

                                <div className="w-full flex flex-col">
                                    <label className={labelClass}>Item Image</label>
                                    <input
                                        type="file"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (itemImagePreview) {
                                                URL.revokeObjectURL(itemImagePreview);
                                            }
                                            setItemImagePreview(file ? URL.createObjectURL(file) : "");
                                            setItemForm({ ...itemForm, image: file || null });
                                        }}
                                        className={fieldBaseClass}
                                    />
                                    {itemImagePreview && (
                                        <div className="mt-2">
                                            <img
                                                src={itemImagePreview}
                                                alt="Item preview"
                                                className="w-full max-w-[220px] rounded-lg border border-gray-200 object-cover"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="w-full flex flex-col md:col-span-2">
                                    <label className={labelClass}>Notes</label>
                                    <textarea
                                        value={itemForm.notes}
                                        onChange={(e) => setItemForm({ ...itemForm, notes: e.target.value })}
                                        className={`${fieldBaseClass} h-20`}
                                    />
                                </div>
                            </div>

                            <div className="w-full flex justify-end items-center gap-2">
                                <button
                                    onClick={() => {
                                        if (saveItem()) setIsItemModalOpen(false);
                                    }}
                                    className="text-xs rounded-md px-6 py-2 cursor-pointer text-white bg-orange-600 hover:bg-orange-700 border-none shadow-sm transition-colors duration-200"
                                >
                                    {editingItemId ? "Update Item" : "Save Item"}
                                </button>

                                <button
                                    onClick={closeItemModal}
                                    className="text-xs rounded-md px-6 py-2 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200"
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
