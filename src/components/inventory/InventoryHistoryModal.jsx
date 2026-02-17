/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Printer } from "lucide-react";
import { toast } from "react-toastify";
import ModalContainer from "../ModalContainer";
import CircularLoading from "../CircularLoading";
import { useInventoryItemHistory } from "../../hooks/useInventoryItemHistory";
import SourceItemDetailModal from "./SourceItemDetailModal";
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

const STORAGE_BASE_URL = "https://api.kalingangkababaihan.com/storage/";

const resolveImageUrl = (image) => {
    if (!image) return "";
    if (/^https?:\/\//i.test(image)) return image;
    const normalized = `${image}`.replace(/^\/+/, "").replace(/^storage\//, "");
    return `${STORAGE_BASE_URL}${normalized}`;
};

const getNormalizedType = (value) => `${value || ""}`.toLowerCase();

const InventoryHistoryModal = ({ inventoryItem, close }) => {
    const [draftType, setDraftType] = useState("");
    const [draftStartDate, setDraftStartDate] = useState("");
    const [draftEndDate, setDraftEndDate] = useState("");

    const [appliedFilters, setAppliedFilters] = useState({
        type: "",
        start_date: "",
        end_date: "",
    });
    const [selectedSourceItemId, setSelectedSourceItemId] = useState(null);
    const [printingHistory, setPrintingHistory] = useState(false);
    const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);
    const [printPreviewUrl, setPrintPreviewUrl] = useState("");
    const [printFilename, setPrintFilename] = useState("");

    useEffect(() => {
        setDraftType("");
        setDraftStartDate("");
        setDraftEndDate("");
        setAppliedFilters({
            type: "",
            start_date: "",
            end_date: "",
        });
        setSelectedSourceItemId(null);
        setIsPrintPreviewOpen(false);
        setPrintPreviewUrl((previousUrl) => {
            if (previousUrl) {
                window.URL.revokeObjectURL(previousUrl);
            }
            return "";
        });
        setPrintFilename("");
    }, [inventoryItem?.id]);

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

    const inTransactions = transactions.filter((row) => getNormalizedType(row.type) === "in");

    const applyFilters = () => {
        setAppliedFilters({
            type: draftType,
            start_date: draftStartDate,
            end_date: draftEndDate,
        });
    };

    const clearFilters = () => {
        setDraftType("");
        setDraftStartDate("");
        setDraftEndDate("");
        setAppliedFilters({
            type: "",
            start_date: "",
            end_date: "",
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
            const fileBlob = await printInventoryItemHistory(inventoryItem.id, appliedFilters);
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
            <div className="w-full md:w-[1100px] max-h-[82vh] rounded-xl bg-white p-4 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                        <p className="text-orange-600 font-semibold">Inventory History</p>
                        <p className="text-xs text-gray-500">
                            Item ID: <span className="font-semibold text-gray-700">{inventoryItem?.id || "N/A"}</span>
                            {" | "}
                            Subcategory: <span className="font-semibold text-gray-700">{inventoryItem?.sub_category_name || "N/A"}</span>
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
                        <div className="w-full h-full overflow-y-auto p-3 space-y-4">
                            <HistoryTable
                                title="Incoming Items (IN)"
                                type="in"
                                rows={inTransactions}
                                emptyText="No incoming records found."
                                onOpenSourceItem={setSelectedSourceItemId}
                            />
                        </div>
                    )}
                </div>
            </div>

            {selectedSourceItemId && (
                <SourceItemDetailModal
                    sourceItemId={selectedSourceItemId}
                    close={() => setSelectedSourceItemId(null)}
                />
            )}

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

const getOriginalStock = (row) => {
    return (
        row.source_item_original_quantity ??
        row.source_item_quantity ??
        row.original_stock ??
        row.quantity ??
        "-"
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

const HistoryTable = ({ title, type, rows, emptyText, onOpenSourceItem }) => {
    const isIncoming = type === "in";

    return (
        <div className="rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
                <p className="text-xs font-semibold text-gray-700">{title}</p>
            </div>

            {rows.length === 0 ? (
                <div className="p-4 text-xs text-gray-500 text-center">{emptyText}</div>
            ) : (
                <div className="w-full overflow-x-auto">
                    <table className="w-full text-xs border-collapse">
                        <thead className="bg-orange-500 text-white">
                            <tr>
                                <th className="p-3 text-start">Occurred At</th>
                                <th className="p-3 text-start">{isIncoming ? "Original Stock" : "Quantity"}</th>
                                <th className="p-3 text-start">Remaining Stock</th>
                                <th className="p-3 text-start">Status</th>
                                <th className="p-3 text-start">Source Item</th>
                                <th className="p-3 text-start">Source Expiry</th>
                                {!isIncoming && <th className="p-3 text-start">Project</th>}
                                {!isIncoming && <th className="p-3 text-start">Notes</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, index) => (
                                (() => {
                                    const expiryState = getExpiryWarningMeta(row.source_item_expiry_date);
                                    const remainingStockValue = getRemainingStock(row);
                                    const remainingStockNumber = getNumericValue(remainingStockValue);
                                    const hasRemainingStock = remainingStockNumber !== null && remainingStockNumber > 0;
                                    const isUnavailable = expiryState.isExpired || !hasRemainingStock;
                                    return (
                                        <tr
                                            key={row.id || row.inventory_item_id || `${row.occurred_at || ""}-${index}`}
                                            className={`border-b border-gray-100 ${index % 2 === 0 ? "bg-orange-50/40" : ""}`}
                                        >
                                            <td className="p-3">{formatDateTime(row.occurred_at)}</td>
                                            <td className="p-3">{`${getOriginalStock(row)} ${row.unit || ""}`.trim()}</td>
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
                                                <button
                                                    type="button"
                                                    onClick={() => onOpenSourceItem(row.source_item_id)}
                                                    disabled={!row.source_item_id}
                                                    className={`flex items-center gap-2 text-left ${row.source_item_id ? "text-blue-600 hover:text-blue-700" : "text-gray-500 cursor-not-allowed"}`}
                                                >
                                                    {row.source_item_image ? (
                                                        <img
                                                            src={resolveImageUrl(row.source_item_image)}
                                                            alt={row.source_item_name || "Source item"}
                                                            className="w-8 h-8 rounded object-cover border border-gray-200"
                                                        />
                                                    ) : (
                                                        <span className="w-8 h-8 rounded bg-gray-100 border border-gray-200 flex items-center justify-center text-[10px] text-gray-400">
                                                            N/A
                                                        </span>
                                                    )}
                                                    <span className="underline underline-offset-2">{row.source_item_name || "-"}</span>
                                                </button>
                                            </td>
                                            <td className="p-3">
                                                <span className={`inline-flex rounded px-2 py-1 text-[11px] ${expiryState.className}`}>
                                                    {expiryState.label}
                                                </span>
                                            </td>
                                            {!isIncoming && <td className="p-3">{row.project_title || "-"}</td>}
                                            {!isIncoming && <td className="p-3">{row.notes || "-"}</td>}
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
