import { useEffect, useMemo, useState } from "react";
import { _get } from "../../api";
import Admin from "../../layouts/Admin";
import CircularLoading from "../../components/CircularLoading";
import { Search, Filter, Package } from "lucide-react";
import ModalContainer from "../../components/ModalContainer";
import { toast } from "react-toastify";

const Inventory = () => {

    const baseURL = "https://api.kalingangkababaihan.com/storage/";

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubCategory, setSelectedSubCategory] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [viewItem, setViewItem] = useState(null);
    const [isPrintOpen, setIsPrintOpen] = useState(false);
    const [printUrl, setPrintUrl] = useState("");
    const [printFilename, setPrintFilename] = useState("");
    const [printLoading, setPrintLoading] = useState(false);

    useEffect(() => {
        fetchItems();
        fetchCategories();
        fetchSubCategories();
    }, []);

    const fetchItems = async({ search = "", categoryId = "", subCategoryId = "", startDate: start = "", endDate: end = "" } = {}) => {
        setLoading(true);
        try {
            const params = {};
            if (search) params.search = search;
            if (categoryId) params.category = categoryId;
            if (subCategoryId) params.sub_category = subCategoryId;
            if (start) params.start_date = start;
            if (end) params.end_date = end;

            const response = await _get('/items/confirmed', { params });
            if (response.data && response.status == 200) {
                setItems(response.data.items || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const fetchCategories = async () => {
        try {
            const response = await _get(`/goods-donation-categories`);
            setCategories(response.data.categories || []);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchSubCategories = async () => {
        try {
            const response = await _get(`/goods-donation-categories`);
            setSubCategories(response.data.categories || []);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSearch = (value) => {
        setSearchQuery(value);
        fetchItems({
            search: value,
            categoryId: selectedCategory,
            subCategoryId: selectedSubCategory,
            startDate,
            endDate
        });
    };

    const handleCategoryFilter = (categoryId) => {
        setSelectedCategory(categoryId);
        // Reset subcategory when category changes to avoid mismatched filter
        const newSubCategory = "";
        setSelectedSubCategory(newSubCategory);
        fetchItems({
            search: searchQuery,
            categoryId,
            subCategoryId: newSubCategory,
            startDate,
            endDate
        });
    };

    const handleSubCategoryFilter = (subCategoryId) => {
        setSelectedSubCategory(subCategoryId);
        fetchItems({
            search: searchQuery,
            categoryId: selectedCategory,
            subCategoryId,
            startDate,
            endDate
        });
    };

    const handleDateFilter = (nextStartDate, nextEndDate) => {
        fetchItems({
            search: searchQuery,
            categoryId: selectedCategory,
            subCategoryId: selectedSubCategory,
            startDate: nextStartDate,
            endDate: nextEndDate
        });
    };

    const handlePrint = async () => {
        setPrintLoading(true);
        try {
            const params = {};
            if (startDate) params.start_date = startDate;
            if (endDate) params.end_date = endDate;
            const fileResponse = await _get("/items/confirmed/print", { params, responseType: "blob" });
            const blobUrl = URL.createObjectURL(fileResponse.data);
            if (printUrl) {
                URL.revokeObjectURL(printUrl);
            }
            setPrintUrl(blobUrl);
            setPrintFilename("inventory.pdf");
            setIsPrintOpen(true);
        } catch (error) {
            console.error("Error generating inventory report:", error);
            toast.error("Unable to generate the report.");
        } finally {
            setPrintLoading(false);
        }
    };

    const normalizeDatePart = (dateString) => {
        if (!dateString) return "";
        return `${dateString}`.split("T")[0];
    };

    const toLocalDate = (dateString) => {
        const datePart = normalizeDatePart(dateString);
        if (!datePart) return null;
        const [year, month, day] = datePart.split("-").map(Number);
        if (!year || !month || !day) return null;
        return new Date(year, month - 1, day);
    };

    const formatShortDate = (dateString) => {
        const date = toLocalDate(dateString);
        if (!date) return "";
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    };

    const getDaysUntil = (dateString) => {
        const date = toLocalDate(dateString);
        if (!date) return null;
        const today = new Date();
        const startToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const diffMs = startDate - startToday;
        return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    };

    const getExpiryMeta = (dateString) => {
        const datePart = normalizeDatePart(dateString);
        if (!datePart) {
            return {
                label: "No Expiry",
                className: "bg-gray-100 text-gray-600 border border-gray-200"
            };
        }
        const daysRemaining = getDaysUntil(datePart);
        const formattedDate = formatShortDate(datePart);
        const isExpired = daysRemaining !== null && daysRemaining < 0;
        const isExpiringSoon = daysRemaining !== null && daysRemaining <= 30;
        if (isExpired) {
            return {
                label: "Expired",
                className: "bg-red-700 text-white border border-red-800 ring-2 ring-red-300 shadow-sm"
            };
        }
        return {
            label: formattedDate,
            className: isExpiringSoon
                ? "bg-red-600 text-white border border-red-700 ring-2 ring-red-300 shadow-sm"
                : "bg-gray-100 text-gray-700 border border-gray-200"
        };
    };

    const viewExpiryMeta = viewItem
        ? getExpiryMeta(viewItem.expiry_date || viewItem.expiryDate)
        : null;

    const listSummary = useMemo(() => {
        const total = items.length;
        const available = items.filter((i) => i.status === "available").length;
        const consumed = items.filter((i) => i.status === "consumed").length;
        const uniqueCategories = new Set(items.map((i) => i.category_name || "")).size;
        return { total, available, consumed, uniqueCategories };
    }, [items]);

    const header = { 
        title: "Inventory Management",
        subTitle: "Monitor your Goods donation stocks to get an accurate and up-to-date inventory."
    };

    const breadcrumbs = [
        { name: "Inventory", link: "/inventory" }
    ]

    return (
        <Admin header={header} breadcrumbs={breadcrumbs}>
            <div className="w-full mx-auto flex flex-col gap-4 mt-4 md:mt-0">

                {/* Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                    <SummaryCard label="Total items" value={listSummary.total} sub="Current view" accent="blue" />
                    <SummaryCard label="Available" value={listSummary.available} sub="In stock" accent="green" />
                    <SummaryCard label="Consumed" value={listSummary.consumed} sub="Marked as used" accent="amber" />
                    <SummaryCard label="Categories" value={listSummary.uniqueCategories} sub="Unique categories" accent="purple" />
                </div>

                {/* Filters */}
                <div className="w-full p-4 rounded-lg border border-gray-100 bg-white shadow-sm flex flex-col gap-4">
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
                                    placeholder="Search for specific item.." 
                                />
                            </div>
                            <button
                                onClick={handlePrint}
                                disabled={printLoading}
                                className={`text-xs px-3 py-2 rounded-md border border-gray-200 ${printLoading ? "opacity-60 cursor-not-allowed" : "text-gray-600 hover:bg-gray-50"}`}
                            >
                                {printLoading ? "Generating..." : "Print"}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">
                        <div className="flex flex-wrap items-center gap-2">
                            <label className="text-xs text-gray-600">From</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => {
                                    const next = e.target.value;
                                    setStartDate(next);
                                    handleDateFilter(next, endDate);
                                }}
                                className="bg-white text-xs px-3 py-2 rounded border border-gray-200"
                            />
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <label className="text-xs text-gray-600">To</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => {
                                    const next = e.target.value;
                                    setEndDate(next);
                                    handleDateFilter(startDate, next);
                                }}
                                className="bg-white text-xs px-3 py-2 rounded border border-gray-200"
                            />
                        </div>
                        <select
                            value={selectedCategory}
                            onChange={(e) => handleCategoryFilter(e.target.value)}
                            className="bg-white text-xs px-4 py-2 rounded border border-gray-200"
                        >
                            <option value="">All categories</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>

                        <select
                            value={selectedSubCategory}
                            onChange={(e) => handleSubCategoryFilter(e.target.value)}
                            className="bg-white text-xs px-4 py-2 rounded border border-gray-200 "
                        >
                            <option value="">All subcategories</option>
                            {(
                                selectedCategory
                                    ? subCategories.find((cat) => `${cat.id}` === `${selectedCategory}`)?.subcategories || []
                                    : subCategories.flatMap((cat) => cat.subcategories || [])
                            ).map((sub) => (
                                <option key={sub.id} value={sub.id}>{sub.name}</option>
                            ))}
                        </select>
                        <button
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedCategory("");
                                setSelectedSubCategory("");
                                setStartDate("");
                                setEndDate("");
                                fetchItems({});
                            }}
                            className="text-xs px-3 py-2 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
                        >
                            Clear
                        </button>
                    </div>
                </div>

                {/* Table */}
                {loading ? (
                    <div className="w-full h-40 flex items-center justify-center">
                        <CircularLoading customClass="text-blue-500 w-6 h-6" />
                    </div>
                ) : items.length === 0 ? (
                    <div className="bg-white border border-dashed border-gray-200 rounded-lg p-8 text-center text-sm text-gray-500">
                        No inventory items found. Adjust filters or clear search to see more results.
                        <div className="mt-3">
                            <button
                                onClick={() => { setSearchQuery(""); setSelectedCategory(""); setSelectedSubCategory(""); fetchItems({}); }}
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
                                <th className="p-3 text-start">Name</th>
                                <th className="p-3 text-start">Category</th>
                                <th className="p-3 text-start">Subcategory</th>
                                <th className="p-3 text-start">Quantity</th>
                                <th className="p-3 text-start">Unit</th>
                                <th className="p-3 text-start">Expiry Date</th>
                                <th className="p-3 text-start">Notes</th>
                                <th className="p-3 text-start">Status</th>
                                <th className="p-3 text-start">Action</th>
                            </tr>
                            </thead>
                            
                                <tbody>
                                    {items.map((row, index) => {
                                        const expiryMeta = getExpiryMeta(row.expiry_date || row.expiryDate);
                                        return (
                                        <tr key={row.id}
                                        className={`border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? "bg-orange-50/40" : ""} text-xs`}>
                                            <td className="p-3 text-xs font-semibold text-gray-800">{row.name}</td>
                                            <td className="p-3 text-xs">{row.category_name}</td>
                                            <td className="p-3 text-xs">{row.sub_category_name}</td>
                                            <td className={`p-3 text-xs ${row.quantity === 0 ? 'text-red-500' : ''} `}>{row.quantity}</td>
                                            <td className="p-3 text-xs ">{row.unit}</td>
                                            <td className="p-3 text-xs">
                                                <span className={`inline-flex items-center rounded px-2 py-1 text-[11px] font-semibold ${expiryMeta.className}`}>
                                                    {expiryMeta.label}
                                                </span>
                                            </td>
                                            <td className="p-3 text-xs ">{row.notes || "None"}</td>
                                            <td className="p-3 text-xs ">
                                                {row.status === "available" ? (
                                                    <span className="px-2 py-1 rounded-full text-[11px] bg-green-50 text-green-700 border border-green-200">Available</span>
                                                ) : row.status === "consumed" && (
                                                    <span className="px-2 py-1 rounded-full text-[11px] bg-amber-50 text-amber-700 border border-amber-200">Consumed</span>
                                                )}
                                            </td>
                                            <td className="p-3 text-xs">
                                                <button
                                                    type="button"
                                                    onClick={() => setViewItem(row)}
                                                    className="px-3 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    )})}
                                </tbody>
                        </table>
                    </div>
                )}
            </div>

            {viewItem && (
                <ModalContainer isFull={false} close={() => setViewItem(null)}>
                    <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="p-5 border-b border-gray-100">
                            <p className="text-xs uppercase tracking-[0.2em] text-orange-500 font-semibold">Inventory Item</p>
                            <h3 className="text-lg font-semibold text-gray-900">{viewItem.name}</h3>
                        </div>
                        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="w-full">
                                <div className="w-full h-64 md:h-full rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                                    {viewItem.image ? (
                                        <img
                                            src={`${baseURL}${viewItem.image}`}
                                            alt={viewItem.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                                            No image available
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="w-full flex flex-col gap-3 text-xs text-gray-700">
                                <div className="flex items-start gap-4 justify-between">
                                    <span className="text-gray-500">Category</span>
                                    <span className="font-semibold text-gray-800">{viewItem.category_name}</span>
                                </div>
                                <div className="flex items-start gap-4 justify-between">
                                    <span className="text-gray-500">Subcategory</span>
                                    <span className="font-semibold text-gray-800">{viewItem.sub_category_name}</span>
                                </div>
                                <div className="flex items-start gap-4 justify-between">
                                    <span className="text-gray-500">Quantity</span>
                                    <span className="font-semibold text-gray-800">{viewItem.quantity}</span>
                                </div>
                                <div className="flex items-start gap-4 justify-between">
                                    <span className="text-gray-500">Unit</span>
                                    <span className="font-semibold text-gray-800">{viewItem.unit || "N/A"}</span>
                                </div>
                                <div className="flex items-start gap-4 justify-between">
                                    <span className="text-gray-500">Expiry Date</span>
                                    <span className={`inline-flex items-center rounded px-2 py-1 text-[11px] font-semibold ${viewExpiryMeta.className}`}>
                                        {viewExpiryMeta.label}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">Status</span>
                                    {viewItem.status === "available" ? (
                                        <span className="px-2 py-1 rounded-full text-[11px] bg-green-50 text-green-700 border border-green-200">Available</span>
                                    ) : viewItem.status === "consumed" ? (
                                        <span className="px-2 py-1 rounded-full text-[11px] bg-amber-50 text-amber-700 border border-amber-200">Consumed</span>
                                    ) : (
                                        <span className="px-2 py-1 rounded-full text-[11px] bg-gray-100 text-gray-600 border border-gray-200">Unknown</span>
                                    )}
                                </div>
                                <div>
                                    <span className="text-gray-500">Notes</span>
                                    <p className="mt-1 text-gray-700">{viewItem.notes || "None"}</p>
                                </div>
                                <div className="pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setViewItem(null)}
                                        className="px-4 py-2 text-xs rounded bg-gray-200 hover:bg-gray-300"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
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
                                <p className="text-orange-600 font-semibold">Inventory Report</p>
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
                                    title="Inventory Report"
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
            
        </Admin>
    )
}

export default Inventory;

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
                <Package className={`${colors.text}`} size={20} />
            </div>
            <div className="flex flex-col">
                <p className="text-[11px] uppercase tracking-wide text-gray-500">{label}</p>
                <p className={`text-xl font-bold ${colors.text}`}>{value}</p>
                {sub && <p className="text-[11px] text-gray-500">{sub}</p>}
            </div>
        </div>
    );
};
