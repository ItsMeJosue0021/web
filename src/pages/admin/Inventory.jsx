/* eslint-disable react/prop-types */
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Filter, Package, Printer, RefreshCcw, Search } from "lucide-react";
import { toast } from "react-toastify";
import Admin from "../../layouts/Admin";
import CircularLoading from "../../components/CircularLoading";
import ModalContainer from "../../components/ModalContainer";
import InventoryHistoryModal from "../../components/inventory/InventoryHistoryModal";
import { AuthContext } from "../../AuthProvider";
import { useInventorySummary } from "../../hooks/useInventorySummary";
import {
    getApiErrorMessage,
    getInventoryCategories,
    printInventorySummary,
    syncConfirmedInventory,
} from "../../services/inventoryService";

const formatDateTime = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
};

const hasIdValue = (value) => value !== undefined && value !== null && `${value}`.trim() !== "";

const Inventory = () => {
    const { user } = useContext(AuthContext);
    const isAdmin = user?.role === "admin" || user?.role?.name === "admin";

    const [categories, setCategories] = useState([]);
    const [categoriesError, setCategoriesError] = useState("");

    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubCategory, setSelectedSubCategory] = useState("");
    const [includeZero, setIncludeZero] = useState(false);
    const [nearExpiringOnly, setNearExpiringOnly] = useState(false);

    const [syncing, setSyncing] = useState(false);
    const [printingList, setPrintingList] = useState(false);
    const [isPrintOpen, setIsPrintOpen] = useState(false);
    const [printUrl, setPrintUrl] = useState("");
    const [printFilename, setPrintFilename] = useState("");
    const [historyItem, setHistoryItem] = useState(null);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setSearchQuery(searchInput.trim());
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchInput]);

    const {
        items,
        loading,
        error,
        refresh,
    } = useInventorySummary({
        search: searchQuery,
        category: selectedCategory,
        sub_category: selectedSubCategory,
        include_zero: includeZero,
        near_expiration_days: nearExpiringOnly ? 30 : "",
    });

    const fetchCategories = useCallback(async () => {
        setCategoriesError("");
        try {
            const payload = await getInventoryCategories();
            setCategories(payload?.categories || []);
        } catch (requestError) {
            setCategories([]);
            setCategoriesError(getApiErrorMessage(requestError, "Unable to load filter categories."));
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        return () => {
            if (printUrl) {
                window.URL.revokeObjectURL(printUrl);
            }
        };
    }, [printUrl]);

    const subCategoryOptions = useMemo(() => {
        if (selectedCategory) {
            return categories.find((cat) => `${cat.id}` === `${selectedCategory}`)?.subcategories || [];
        }
        return categories.flatMap((cat) => cat.subcategories || []);
    }, [categories, selectedCategory]);

    const listSummary = useMemo(() => {
        const totalRows = items.length;
        const totalQuantity = items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
        const zeroQuantity = items.filter((item) => Number(item.quantity) <= 0).length;
        const uniqueCategories = new Set(items.map((item) => item.category_name || "").filter(Boolean)).size;
        return {
            totalRows,
            totalQuantity,
            zeroQuantity,
            uniqueCategories,
        };
    }, [items]);

    const clearFilters = () => {
        setSearchInput("");
        setSearchQuery("");
        setSelectedCategory("");
        setSelectedSubCategory("");
        setIncludeZero(false);
        setNearExpiringOnly(false);
    };

    const handleSyncConfirmedItems = async () => {
        setSyncing(true);
        try {
            await syncConfirmedInventory();
            toast.success("Inventory sync completed.");
            refresh();
        } catch (requestError) {
            toast.error(getApiErrorMessage(requestError, "Unable to sync confirmed items."));
        } finally {
            setSyncing(false);
        }
    };

    const closePrintPreview = () => {
        setIsPrintOpen(false);
        if (printUrl) {
            window.URL.revokeObjectURL(printUrl);
        }
        setPrintUrl("");
        setPrintFilename("");
    };

    const handlePrintInventory = async () => {
        setPrintingList(true);
        try {
            const fileBlob = await printInventorySummary({
                search: searchQuery,
                category: selectedCategory,
                sub_category: selectedSubCategory,
                include_zero: includeZero,
                near_expiration_days: nearExpiringOnly ? 30 : "",
            });
            const nextUrl = window.URL.createObjectURL(
                fileBlob instanceof Blob ? fileBlob : new Blob([fileBlob], { type: "application/pdf" })
            );

            if (printUrl) {
                window.URL.revokeObjectURL(printUrl);
            }

            setPrintUrl(nextUrl);
            setPrintFilename("inventory-list.pdf");
            setIsPrintOpen(true);
        } catch (requestError) {
            toast.error(getApiErrorMessage(requestError, "Unable to generate inventory print report."));
        } finally {
            setPrintingList(false);
        }
    };

    const handleOpenHistory = (item) => {
        const inventoryItemId = item?.id;
        if (!hasIdValue(inventoryItemId)) {
            toast.warn("No inventory item ID found for this row.");
            return;
        }

        // Manual test case: if one subcategory has two units (e.g., box and packs),
        // opening each row should show separate histories because requests use inventory item id.
        setHistoryItem(item);
    };

    const header = {
        title: "Inventory Management",
        subTitle: "Monitor your Goods donation stocks to get an accurate and up-to-date inventory.",
    };

    const breadcrumbs = [{ name: "Inventory", link: "/inventory" }];

    return (
        <Admin header={header} breadcrumbs={breadcrumbs}>
            <div className="w-full mx-auto flex flex-col gap-4 mt-4 md:mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                    <SummaryCard label="Rows" value={listSummary.totalRows} sub="Current view" accent="blue" />
                    <SummaryCard label="Total quantity" value={listSummary.totalQuantity} sub="Across listed rows" accent="green" />
                    <SummaryCard label="Zero quantity" value={listSummary.zeroQuantity} sub="Needs attention" accent="amber" />
                    <SummaryCard label="Categories" value={listSummary.uniqueCategories} sub="Unique categories" accent="purple" />
                </div>

                <div className="w-full p-4 rounded-lg border border-gray-100 bg-white shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                        <div className="text-sm text-gray-700 font-semibold flex items-center gap-2">
                            <Filter size={16} className="text-orange-500" /> Quick filters
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full lg:w-auto">
                            <div className="relative w-full sm:w-80">
                                <Search size={16} className="text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={searchInput}
                                    onChange={(event) => setSearchInput(event.target.value)}
                                    className="bg-white placeholder:text-xs px-9 py-2 rounded border border-gray-200 text-sm w-full"
                                    placeholder="Search inventory..."
                                />
                            </div>

                            <button
                                type="button"
                                onClick={handlePrintInventory}
                                disabled={printingList}
                                className={`text-xs px-3 py-2 rounded-md border border-gray-200 flex items-center gap-2 ${printingList ? "opacity-60 cursor-not-allowed" : "text-gray-600 hover:bg-gray-50"}`}
                            >
                                <Printer size={14} />
                                {printingList ? "Generating..." : "Print"}
                            </button>

                            {isAdmin && (
                                <button
                                    type="button"
                                    onClick={handleSyncConfirmedItems}
                                    disabled={syncing}
                                    className={`text-xs px-3 py-2 rounded-md border border-gray-200 flex items-center gap-2 ${syncing ? "opacity-60 cursor-not-allowed" : "text-gray-600 hover:bg-gray-50"}`}
                                >
                                    <RefreshCcw size={14} />
                                    {syncing ? "Syncing..." : "Sync Confirmed Items"}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">
                        <select
                            value={selectedCategory}
                            onChange={(event) => {
                                setSelectedCategory(event.target.value);
                                setSelectedSubCategory("");
                            }}
                            className="bg-white text-xs px-4 py-2 rounded border border-gray-200"
                        >
                            <option value="">All categories</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={selectedSubCategory}
                            onChange={(event) => setSelectedSubCategory(event.target.value)}
                            className="bg-white text-xs px-4 py-2 rounded border border-gray-200"
                        >
                            <option value="">All subcategories</option>
                            {subCategoryOptions.map((subcategory) => (
                                <option key={subcategory.id} value={subcategory.id}>
                                    {subcategory.name}
                                </option>
                            ))}
                        </select>

                        <label className="flex items-center gap-2 text-xs text-gray-600 px-3 py-2 rounded border border-gray-200 bg-white">
                            <input
                                type="checkbox"
                                checked={includeZero}
                                onChange={(event) => setIncludeZero(event.target.checked)}
                                className="h-3.5 w-3.5"
                            />
                            Include zero quantity
                        </label>

                        <label className="flex items-center gap-2 text-xs text-gray-600 px-3 py-2 rounded border border-gray-200 bg-white">
                            <input
                                type="checkbox"
                                checked={nearExpiringOnly}
                                onChange={(event) => setNearExpiringOnly(event.target.checked)}
                                className="h-3.5 w-3.5"
                            />
                            Near expiring (30 days)
                        </label>

                        <button
                            type="button"
                            onClick={clearFilters}
                            className="text-xs px-3 py-2 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
                        >
                            Clear
                        </button>
                    </div>

                    {categoriesError && (
                        <div className="text-xs text-red-500 flex items-center gap-2">
                            <span>{categoriesError}</span>
                            <button
                                type="button"
                                onClick={fetchCategories}
                                className="px-2 py-1 rounded border border-gray-200 text-gray-600 hover:bg-gray-50"
                            >
                                Retry categories
                            </button>
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="w-full h-40 flex items-center justify-center">
                        <CircularLoading customClass="text-blue-500 w-6 h-6" />
                    </div>
                ) : error ? (
                    <div className="bg-white border border-dashed border-red-200 rounded-lg p-8 text-center text-sm text-red-500">
                        {error}
                        <div className="mt-3">
                            <button
                                type="button"
                                onClick={() => refresh()}
                                className="text-xs px-3 py-2 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                ) : items.length === 0 ? (
                    <div className="bg-white border border-dashed border-gray-200 rounded-lg p-8 text-center text-sm text-gray-500">
                        No inventory items found. Adjust filters or clear search to see more results.
                        <div className="mt-3">
                            <button
                                type="button"
                                onClick={clearFilters}
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
                                    <th className="p-3 text-start">Category</th>
                                    <th className="p-3 text-start">Subcategory</th>
                                    <th className="p-3 text-start">Quantity</th>
                                    <th className="p-3 text-start">Unit</th>
                                    <th className="p-3 text-start">Updated At</th>
                                    <th className="p-3 text-start">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((row, index) => {
                                    const inventoryItemId = row?.id;
                                    const canViewHistory = hasIdValue(inventoryItemId);
                                    const key = row.id || `row-${index}`;
                                    return (
                                        <tr
                                            key={key}
                                            className={`border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? "bg-orange-50/40" : ""} text-xs`}
                                        >
                                            <td className="p-3 text-xs">{row.category_name || "-"}</td>
                                            <td className="p-3 text-xs">{row.sub_category_name || "-"}</td>
                                            <td className={`p-3 text-xs ${Number(row.quantity) <= 0 ? "text-red-500" : ""}`}>
                                                {row.quantity ?? 0}
                                            </td>
                                            <td className="p-3 text-xs">{row.unit || "-"}</td>
                                            <td className="p-3 text-xs">{formatDateTime(row.updated_at)}</td>
                                            <td className="p-3 text-xs">
                                                <button
                                                    type="button"
                                                    onClick={() => handleOpenHistory(row)}
                                                    disabled={!canViewHistory}
                                                    className={`px-3 py-1 rounded border ${canViewHistory ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100" : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"}`}
                                                >
                                                    View History
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {historyItem && (
                <InventoryHistoryModal
                    inventoryItem={{
                        id: historyItem?.id,
                        sub_category_name: historyItem.sub_category_name,
                        unit: historyItem.unit,
                    }}
                    close={() => setHistoryItem(null)}
                />
            )}

            {isPrintOpen && (
                <ModalContainer isFull={false} close={closePrintPreview}>
                    <div className="w-full md:w-[900px] h-[70vh] rounded-xl bg-white p-4 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-600 font-semibold">Inventory Report</p>
                                <p className="text-xs text-gray-500">{printFilename}</p>
                            </div>
                            <button
                                type="button"
                                onClick={closePrintPreview}
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
    );
};

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
