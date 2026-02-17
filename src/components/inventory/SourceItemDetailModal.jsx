/* eslint-disable react/prop-types */
import { useCallback, useEffect, useState } from "react";
import ModalContainer from "../ModalContainer";
import CircularLoading from "../CircularLoading";
import {
    getApiErrorMessage,
    getGoodsDonationItemDetail,
} from "../../services/inventoryService";
import { getExpiryWarningMeta } from "../../utils/expiryWarning";

const STORAGE_BASE_URL = "https://api.kalingangkababaihan.com/storage/";

const resolveImageUrl = (image) => {
    if (!image) return "";
    if (/^https?:\/\//i.test(image)) return image;
    const normalized = `${image}`.replace(/^\/+/, "").replace(/^storage\//, "");
    return `${STORAGE_BASE_URL}${normalized}`;
};

const resolveItemPayload = (payload) => {
    if (!payload) return null;
    if (payload.item) return payload.item;
    if (payload.data?.item) return payload.data.item;
    if (payload.data) return payload.data;
    return payload;
};

const SourceItemDetailModal = ({ sourceItemId, close }) => {
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchItem = useCallback(async () => {
        if (!sourceItemId) {
            setItem(null);
            setLoading(false);
            setError("");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const payload = await getGoodsDonationItemDetail(sourceItemId);
            setItem(resolveItemPayload(payload));
        } catch (requestError) {
            setItem(null);
            setError(getApiErrorMessage(requestError, "Unable to load source item details."));
        } finally {
            setLoading(false);
        }
    }, [sourceItemId]);

    useEffect(() => {
        fetchItem();
    }, [fetchItem]);

    const imageUrl = resolveImageUrl(item?.image || item?.source_item_image || item?.item_image);
    const expiryMeta = getExpiryWarningMeta(item?.expiry_date || item?.source_item_expiry_date);

    return (
        <ModalContainer isFull={false} close={close}>
            <div className="w-full md:w-[900px] rounded-xl bg-white p-4 flex flex-col gap-4">
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <p className="text-orange-600 font-semibold">Source Item Details</p>
                        <p className="text-xs text-gray-500">Item ID: {sourceItemId || "N/A"}</p>
                    </div>
                    <button
                        type="button"
                        onClick={close}
                        className="text-xs px-3 py-2 rounded border border-gray-200 text-gray-600 hover:bg-gray-50"
                    >
                        Close
                    </button>
                </div>

                {loading ? (
                    <div className="w-full h-52 flex items-center justify-center">
                        <CircularLoading customClass="text-blue-500 w-6 h-6" />
                    </div>
                ) : error ? (
                    <div className="w-full h-52 flex flex-col items-center justify-center gap-2 text-center px-4">
                        <p className="text-sm text-red-500">{error}</p>
                        <button
                            type="button"
                            onClick={fetchItem}
                            className="text-xs px-3 py-2 rounded border border-gray-200 text-gray-600 hover:bg-gray-50"
                        >
                            Retry
                        </button>
                    </div>
                ) : !item ? (
                    <div className="w-full h-52 flex items-center justify-center text-sm text-gray-500">
                        No item details found.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="w-full h-64 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt={item?.name || item?.item_name || "Source item"}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                                    No image available
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-2 text-xs text-gray-700">
                            <DetailRow label="Name" value={item?.name || item?.item_name || "-"} />
                            <DetailRow label="Quantity" value={item?.quantity ?? "-"} />
                            <DetailRow label="Unit" value={item?.unit || "-"} />
                            <DetailRow
                                label="Expiry Date"
                                value={(
                                    <span className={`inline-flex items-center rounded px-2 py-1 text-[11px] ${expiryMeta.className}`}>
                                        {expiryMeta.label}
                                    </span>
                                )}
                            />
                        </div>
                    </div>
                )}
            </div>
        </ModalContainer>
    );
};

const DetailRow = ({ label, value }) => {
    return (
        <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-2">
            <span className="text-gray-500">{label}</span>
            <span className="font-semibold text-gray-800 text-right">{value}</span>
        </div>
    );
};

export default SourceItemDetailModal;
