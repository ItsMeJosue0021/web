/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import { Printer } from "lucide-react";
import { toast } from "react-toastify";
import ModalContainer from "../ModalContainer";
import CircularLoading from "../CircularLoading";
import { useInventoryItemHistory } from "../../hooks/useInventoryItemHistory";
import { getExpiryWarningMeta } from "../../utils/expiryWarning";
import { getApiErrorMessage, printInventoryItemHistory } from "../../services/inventoryService";

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

const getNormalizedType = (value) => `${value || ""}`.toLowerCase();
const sanitizeNearExpirationDays = (value) => {
    const parsed = Number.parseInt(`${value ?? ""}`.trim(), 10);

    if (Number.isNaN(parsed) || parsed <= 0) {
        return "";
    }

    return `${Math.min(parsed, 365)}`;
};

const InventoryHistoryModal = ({ inventoryItem, close }) => {
    const [draftType, setDraftType] = useState("");
    const [draftStartDate, setDraftStartDate] = useState("");
    const [draftEndDate, setDraftEndDate] = useState("");
    const [draftNearExpirationDays, setDraftNearExpirationDays] = useState("");
    const initialForceItem = (value) => {
        if (`${value}` === "1" || `${value}` === "true") return 1;
        if (value === true || value === 1) return 1;
        return 0;
    };

    const [appliedFilters, setAppliedFilters] = useState({
        type: "",
        start_date: "",
        end_date: "",
        near_expiration_days: "",
        force_item: initialForceItem(inventoryItem?.force_item),
        item_name: inventoryItem?.item_name || "",
        unit: inventoryItem?.unit || "",
        category: inventoryItem?.category || inventoryItem?.category_id || "",
        sub_category: inventoryItem?.sub_category || inventoryItem?.sub_category_id || "",
    });
    const [printingHistory, setPrintingHistory] = useState(false);
    const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);
    const [printPreviewUrl, setPrintPreviewUrl] = useState("");
    const [printFilename, setPrintFilename] = useState("");

    useEffect(() => {
        setDraftType("");
        setDraftStartDate("");
        setDraftEndDate("");
        setDraftNearExpirationDays("");
        setAppliedFilters({
            type: "",
            start_date: "",
            end_date: "",
            near_expiration_days: "",
            force_item: initialForceItem(inventoryItem?.force_item),
            item_name: inventoryItem?.item_name || "",
            unit: inventoryItem?.unit || "",
            category: inventoryItem?.category || inventoryItem?.category_id || "",
            sub_category: inventoryItem?.sub_category || inventoryItem?.sub_category_id || "",
        });
        setIsPrintPreviewOpen(false);
        setPrintPreviewUrl((previousUrl) => {
            if (previousUrl) {
                window.URL.revokeObjectURL(previousUrl);
            }
            return "";
        });
        setPrintFilename("");
    }, [inventoryItem?.id, inventoryItem?.force_item, inventoryItem?.item_name, inventoryItem?.unit, inventoryItem?.category, inventoryItem?.category_id, inventoryItem?.sub_category, inventoryItem?.sub_category_id]);

    useEffect(() => {
        return () => {
            if (printPreviewUrl) {
                window.URL.revokeObjectURL(printPreviewUrl);
            }
        };
    }, [printPreviewUrl]);

    const {
        transactions,
        loading,
        error,
        refetch,
    } = useInventoryItemHistory(inventoryItem?.id, appliedFilters);

    const summaryFilters = useMemo(() => ({
        type: "",
        start_date: "",
        end_date: "",
        near_expiration_days: "",
        force_item: initialForceItem(inventoryItem?.force_item),
        item_name: inventoryItem?.item_name || "",
        unit: inventoryItem?.unit || "",
        category: inventoryItem?.category || inventoryItem?.category_id || "",
        sub_category: inventoryItem?.sub_category || inventoryItem?.sub_category_id || "",
    }), [inventoryItem?.force_item, inventoryItem?.item_name, inventoryItem?.unit, inventoryItem?.category, inventoryItem?.category_id, inventoryItem?.sub_category, inventoryItem?.sub_category_id]);

    const {
        transactions: summaryTransactions,
    } = useInventoryItemHistory(inventoryItem?.id, summaryFilters);

    const itemSummary = useMemo(() => {
        const rows = Array.isArray(summaryTransactions) ? summaryTransactions : [];
        const inventoryItemName = inventoryItem?.inventory_item_name || inventoryItem?.item_name || inventoryItem?.name || "N/A";
        const unit = inventoryItem?.unit || "-";
        const remainingFromInventoryItem = getNumericValue(inventoryItem?.quantity);

        const inRows = rows.filter((row) => getNormalizedType(row?.type) === "in");
        let trackedRemainingCount = 0;

        const totalIncomingQuantity = inRows.reduce((sum, row) => {
            const parsedQuantity = getNumericValue(row?.quantity);
            if (parsedQuantity === null) return sum;
            return sum + parsedQuantity;
        }, 0);

        const totalTrackedRemainingQuantity = inRows.reduce((sum, row) => {
            const parsedRemaining = getNumericValue(row?.source_item_remaining_quantity);
            if (parsedRemaining !== null) {
                trackedRemainingCount += 1;
            }
            if (parsedRemaining === null) return sum;
            return sum + parsedRemaining;
        }, 0);

        const hasTrackedRemaining = inRows.length > 0 && trackedRemainingCount === inRows.length;

        const totalUsedFromOutTransactions = rows.reduce((sum, row) => {
            const type = getNormalizedType(row?.type);
            if (type !== "out") return sum;
            const parsedQuantity = getNumericValue(row?.quantity);
            if (parsedQuantity === null) return sum;
            return sum + parsedQuantity;
        }, 0);

        const remainingStock = hasTrackedRemaining
            ? totalTrackedRemainingQuantity
            : remainingFromInventoryItem ?? 0;

        const totalUsed = hasTrackedRemaining
            ? Math.max(totalIncomingQuantity - totalTrackedRemainingQuantity, 0)
            : totalUsedFromOutTransactions;

        return {
            itemName: inventoryItemName,
            unit,
            remainingStock,
            totalUsed,
        };
    }, [summaryTransactions, inventoryItem?.id, inventoryItem?.inventory_item_name, inventoryItem?.item_name, inventoryItem?.name, inventoryItem?.unit, inventoryItem?.quantity]);

    const applyFilters = () => {
        setAppliedFilters({
            type: draftType,
            start_date: draftStartDate,
            end_date: draftEndDate,
            near_expiration_days: sanitizeNearExpirationDays(draftNearExpirationDays),
            force_item: initialForceItem(inventoryItem?.force_item),
            item_name: inventoryItem?.item_name || "",
            unit: inventoryItem?.unit || "",
            category: inventoryItem?.category || inventoryItem?.category_id || "",
            sub_category: inventoryItem?.sub_category || inventoryItem?.sub_category_id || "",
        });
    };

    const clearFilters = () => {
        setDraftType("");
        setDraftStartDate("");
        setDraftEndDate("");
        setDraftNearExpirationDays("");
        setAppliedFilters({
            type: "",
            start_date: "",
            end_date: "",
            near_expiration_days: "",
            force_item: initialForceItem(inventoryItem?.force_item),
            item_name: inventoryItem?.item_name || "",
            unit: inventoryItem?.unit || "",
            category: inventoryItem?.category || inventoryItem?.category_id || "",
            sub_category: inventoryItem?.sub_category || inventoryItem?.sub_category_id || "",
        });
    };

    const closePrintPreview = () => {
        setIsPrintPreviewOpen(false);
        if (printPreviewUrl) {
            window.URL.revokeObjectURL(printPreviewUrl);
        }
        setPrintPreviewUrl("");
        setPrintFilename("");
    };

    const handlePrintHistory = async () => {
        if (!inventoryItem?.id) {
            toast.warn("No inventory item ID found for this history.");
            return;
        }

        setPrintingHistory(true);
        try {
            const printPayload = {
                ...appliedFilters,
                item_name: appliedFilters.item_name || inventoryItem?.inventory_item_name || inventoryItem?.item_name || inventoryItem?.name || "N/A",
            };
            const fileBlob = await printInventoryItemHistory(inventoryItem.id, printPayload);
            const nextUrl = window.URL.createObjectURL(
                fileBlob instanceof Blob ? fileBlob : new Blob([fileBlob], { type: "application/pdf" })
            );

            if (printPreviewUrl) {
                window.URL.revokeObjectURL(printPreviewUrl);
            }

            setPrintPreviewUrl(nextUrl);
            setPrintFilename(`inventory-history-${inventoryItem.id}.pdf`);
            setIsPrintPreviewOpen(true);
        } catch (requestError) {
            toast.error(getApiErrorMessage(requestError, "Unable to generate inventory history print report."));
        } finally {
            setPrintingHistory(false);
        }
    };

    return (
        <ModalContainer isFull={false} close={close}>
            <div className="w-full md:w-[1100px] h-[82vh] max-h-[82vh] rounded-xl bg-white p-4 flex flex-col gap-4 overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                        <p className="text-orange-600 font-semibold">Inventory History</p>
                        <p className="text-xs text-gray-500">
                            Item: <span className="font-semibold text-gray-700">{inventoryItem?.inventory_item_name || inventoryItem?.name || "N/A"}</span>
                            {" | "}
                            Item ID: <span className="font-semibold text-gray-700">{inventoryItem?.id || "N/A"}</span>
                            {" | "}
                            Subcategory: <span className="font-semibold text-gray-700">{inventoryItem?.sub_category_name || "N/A"}</span>
                            {" | "}
                            Category: <span className="font-semibold text-gray-700">{inventoryItem?.category_name || "N/A"}</span>
                            {" | "}
                            Unit: <span className="font-semibold text-gray-700">{inventoryItem?.unit || "N/A"}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handlePrintHistory}
                            disabled={printingHistory}
                            className={`text-xs px-3 py-2 rounded border border-gray-200 flex items-center gap-2 ${printingHistory ? "opacity-60 cursor-not-allowed" : "text-gray-600 hover:bg-gray-50"}`}
                        >
                            <Printer size={14} />
                            {printingHistory ? "Generating..." : "Print History"}
                        </button>
                        <button
                            type="button"
                            onClick={close}
                            className="text-xs px-3 py-2 rounded border border-gray-200 text-gray-600 hover:bg-gray-50"
                        >
                            Close
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap items-end gap-2 bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <div className="flex flex-col gap-1">
                        <label className="text-[11px] text-gray-600">Type</label>
                        <select
                            value={draftType}
                            onChange={(event) => setDraftType(event.target.value)}
                            className="bg-white text-xs px-3 py-2 rounded border border-gray-200"
                        >
                            <option value="">All types</option>
                            <option value="in">In</option>
                            <option value="out">Out</option>
                            <option value="adjustment">Adjustment</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[11px] text-gray-600">Start date</label>
                        <input
                            type="date"
                            value={draftStartDate}
                            onChange={(event) => setDraftStartDate(event.target.value)}
                            className="bg-white text-xs px-3 py-2 rounded border border-gray-200"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[11px] text-gray-600">End date</label>
                        <input
                            type="date"
                            value={draftEndDate}
                            onChange={(event) => setDraftEndDate(event.target.value)}
                            className="bg-white text-xs px-3 py-2 rounded border border-gray-200"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[11px] text-gray-600">Near expiration (days)</label>
                        <input
                            type="number"
                            min={1}
                            max={365}
                            value={draftNearExpirationDays}
                            onChange={(event) => setDraftNearExpirationDays(event.target.value)}
                            placeholder="e.g. 30"
                            className="bg-white text-xs px-3 py-2 rounded border border-gray-200"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={applyFilters}
                        className="text-xs px-3 py-2 rounded border border-gray-200 text-gray-700 hover:bg-gray-100"
                    >
                        Apply
                    </button>

                    <button
                        type="button"
                        onClick={clearFilters}
                        className="text-xs px-3 py-2 rounded border border-gray-200 text-gray-700 hover:bg-gray-100"
                    >
                        Clear
                    </button>
                </div>

                <div className="flex flex-wrap items-stretch gap-2 bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="flex-1 min-w-[200px] bg-white border border-orange-200 rounded-lg px-3 py-2 shadow-sm">
                        <label className="text-[11px] uppercase tracking-[0.04em] text-orange-700 font-semibold">Item Name</label>
                        <p className="mt-1 text-sm sm:text-base font-black text-gray-900 break-words">{itemSummary.itemName}</p>
                    </div>

                    <div className="flex-1 min-w-[170px] bg-white border border-emerald-200 rounded-lg px-3 py-2 shadow-sm">
                        <label className="text-[11px] uppercase tracking-[0.04em] text-emerald-700 font-semibold">Total Remaining Stock</label>
                        <p className="mt-1 text-sm sm:text-base font-black text-emerald-700">
                            {itemSummary.remainingStock === null ? "-" : `${itemSummary.remainingStock} ${itemSummary.unit}`}
                        </p>
                    </div>

                    <div className="flex-1 min-w-[170px] bg-white border border-rose-200 rounded-lg px-3 py-2 shadow-sm">
                        <label className="text-[11px] uppercase tracking-[0.04em] text-rose-700 font-semibold">Total Stock Used</label>
                        <p className="mt-1 text-sm sm:text-base font-black text-rose-700">
                            {itemSummary.totalUsed} {itemSummary.unit}
                        </p>
                    </div>
                </div>

                <div className="flex-1 min-h-0 rounded-lg border border-gray-200 overflow-hidden">
                    {loading ? (
                        <div className="w-full h-48 flex items-center justify-center">
                            <CircularLoading customClass="text-blue-500 w-6 h-6" />
                        </div>
                    ) : error ? (
                        <div className="w-full h-48 flex flex-col items-center justify-center gap-2 text-center px-4">
                            <p className="text-sm text-red-500">{error}</p>
                            <button
                                type="button"
                                onClick={() => refetch()}
                                className="text-xs px-3 py-2 rounded border border-gray-200 text-gray-600 hover:bg-gray-50"
                            >
                                Retry
                            </button>
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="w-full h-48 flex items-center justify-center text-sm text-gray-500 text-center px-4">
                            No history records found for this inventory row and filter set.
                        </div>
                    ) : (
                            <div className="h-full overflow-y-auto p-3 space-y-4">
                            <HistoryTable
                                rows={transactions}
                                emptyText="No matching records found."
                            />
                        </div>
                    )}
                </div>
            </div>

            {isPrintPreviewOpen && (
                <ModalContainer isFull={false} close={closePrintPreview}>
                    <div className="w-full md:w-[900px] h-[70vh] rounded-xl bg-white p-4 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-600 font-semibold">Inventory History Report</p>
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
                            {printPreviewUrl ? (
                                <iframe
                                    title="Inventory History Report"
                                    src={printPreviewUrl}
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
        </ModalContainer>
    );
};

const getRemainingStock = (row) => {
    return (
        row.source_item_remaining_quantity ??
        row.inventory_remaining_quantity ??
        row.remaining_stock ??
        "-"
    );
};

const getNumericValue = (value) => {
    if (typeof value === "number") {
        return Number.isFinite(value) ? value : null;
    }

    if (typeof value === "string") {
        const normalized = value.replace(/,/g, "").trim();
        if (!normalized) return null;
        const parsed = Number(normalized);
        return Number.isFinite(parsed) ? parsed : null;
    }

    return null;
};

const HistoryTable = ({ rows, emptyText }) => {
    return (
        <div className="rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
                <p className="text-xs font-semibold text-gray-700">Movement History</p>
            </div>

            {rows.length === 0 ? (
                <div className="p-4 text-xs text-gray-500 text-center">{emptyText}</div>
            ) : (
                <div className="w-full overflow-x-auto">
                        <table className="w-full text-xs border-collapse">
                            <thead className="bg-orange-500 text-white">
                                <tr>
                                    <th className="p-3 text-start">Occurred At</th>
                                    <th className="p-3 text-start">Type</th>
                                    <th className="p-3 text-start">Quantity</th>
                                    <th className="p-3 text-start">Stock</th>
                                    <th className="p-3 text-start">Status</th>
                                <th className="p-3 text-start">Source Expiry</th>
                                <th className="p-3 text-start">Project</th>
                                <th className="p-3 text-start">Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, index) => (
                                (() => {
                                    const normalizedType = getNormalizedType(row.type);
                                    const expiryState = getExpiryWarningMeta(row.source_item_expiry_date);
                                    const remainingStockValue = getRemainingStock(row);
                                    const remainingStockNumber = getNumericValue(remainingStockValue);
                                    const hasRemainingStock = remainingStockNumber !== null && remainingStockNumber > 0;
                                    const isUnavailable = expiryState.isExpired || !hasRemainingStock;
                                    const quantityNumber = getNumericValue(row.quantity);
                                    const normalizedQuantity = quantityNumber === null ? row.quantity : Math.abs(quantityNumber);
                                    const quantitySign = normalizedType === "out" ? "-" : normalizedType === "in" ? "+" : "";
                                    const quantityText = `${quantitySign}${normalizedQuantity || 0}`;
                                    const isIn = normalizedType === "in";
                                    const isOut = normalizedType === "out";
                                    const typeBadgeClass = isIn
                                        ? "inline-flex items-center rounded px-2 py-1 text-[11px] font-bold bg-green-100 text-green-700 border border-green-200"
                                        : isOut
                                            ? "inline-flex items-center rounded px-2 py-1 text-[11px] font-bold bg-red-100 text-red-700 border border-red-200"
                                            : "inline-flex items-center rounded px-2 py-1 text-[11px] font-bold bg-gray-100 text-gray-700 border border-gray-200";
                                    const typeDotClass = isIn
                                        ? "bg-green-500"
                                        : isOut
                                            ? "bg-red-500"
                                            : "bg-gray-400";
                                    const quantityClass = isIn
                                        ? "text-green-700"
                                        : isOut
                                            ? "text-red-700"
                                            : "text-gray-700";
                                    return (
                                        <tr
                                            key={row.id || row.inventory_item_id || `${row.occurred_at || ""}-${index}`}
                                            className={`border-b border-gray-100 ${index % 2 === 0 ? "bg-orange-50/40" : ""}`}
                                        >
                                            <td className="p-3">{formatDateTime(row.occurred_at)}</td>
                                            <td className="p-3">
                                                <span className={typeBadgeClass}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${typeDotClass} mr-1.5`} />
                                                    <span className="capitalize">{normalizedType || "-"}</span>
                                                </span>
                                            </td>
                                            <td className={`p-3 ${quantityClass}`}>{`${quantityText} ${row.unit || ""}`.trim()}</td>
                                            <td className="p-3">{`${remainingStockValue} ${row.unit || ""}`.trim()}</td>
                                            <td className="p-3">
                                                {isUnavailable ? (
                                                    <span className="inline-flex rounded px-2 py-1 text-[11px] font-bold bg-red-700 text-white border border-red-800">
                                                        Unavailable
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex rounded px-2 py-1 text-[11px] font-bold bg-green-100 text-green-700 border border-green-200">
                                                        Available
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-3">
                                                <span className={`inline-flex rounded px-2 py-1 text-[11px] ${expiryState.className}`}>
                                                    {expiryState.label}
                                                </span>
                                            </td>
                                            <td className="p-3">{row.project_title || "-"}</td>
                                            <td className="p-3">{row.notes || "-"}</td>
                                        </tr>
                                    );
                                })()
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default InventoryHistoryModal;
