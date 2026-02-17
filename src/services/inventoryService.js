import { _get, _post } from "../api";

const buildInventoryParams = (filters = {}) => {
    const params = {};

    if (filters.search) params.search = filters.search;
    if (filters.category) params.category = filters.category;
    if (filters.sub_category) params.sub_category = filters.sub_category;
    if (filters.near_expiration_days) params.near_expiration_days = filters.near_expiration_days;
    if (typeof filters.include_zero === "boolean") {
        // Query params are strings; send 1/0 so Laravel boolean validation accepts them.
        params.include_zero = filters.include_zero ? 1 : 0;
    }

    return params;
};

const buildHistoryParams = (filters = {}) => {
    const params = {};

    if (filters.type) params.type = filters.type;
    if (filters.start_date) params.start_date = filters.start_date;
    if (filters.end_date) params.end_date = filters.end_date;
    if (filters.unit) params.unit = filters.unit;
    if (filters.near_expiration_days) params.near_expiration_days = filters.near_expiration_days;

    return params;
};

export const extractCollection = (payload, keys = []) => {
    if (Array.isArray(payload)) return payload;

    for (const key of keys) {
        if (Array.isArray(payload?.[key])) {
            return payload[key];
        }
    }

    if (Array.isArray(payload?.data)) return payload.data;

    return [];
};

export const getApiErrorMessage = (error, fallback = "Something went wrong.") => {
    return (
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        fallback
    );
};

export const getInventorySummary = async (filters = {}) => {
    const { data } = await _get("/inventory", { params: buildInventoryParams(filters) });
    return data;
};

export const printInventorySummary = async (filters = {}) => {
    const response = await _get("/inventory/print", {
        params: buildInventoryParams(filters),
        responseType: "blob",
    });
    return response.data;
};

export const getInventoryHistory = async (filters = {}) => {
    const { data } = await _get("/inventory/history", { params: buildHistoryParams(filters) });
    return data;
};

export const getInventoryHistoryIn = async (filters = {}) => {
    const { data } = await _get("/inventory/history/in", { params: buildHistoryParams(filters) });
    return data;
};

export const getInventoryHistoryOut = async (filters = {}) => {
    const { data } = await _get("/inventory/history/out", { params: buildHistoryParams(filters) });
    return data;
};

export const getInventoryItemHistory = async (inventoryItemId, filters = {}) => {
    const { data } = await _get(`/inventory/items/${inventoryItemId}/history`, {
        params: buildHistoryParams(filters),
    });
    return data;
};

export const printInventoryItemHistory = async (inventoryItemId, filters = {}) => {
    const response = await _get("/inventory/history/print", {
        params: {
            inventory_item_id: inventoryItemId,
            ...buildHistoryParams(filters),
        },
        responseType: "blob",
    });
    return response.data;
};

export const getSubcategoryInventoryHistory = async (subcategoryId, filters = {}) => {
    const { data } = await _get(`/inventory/subcategories/${subcategoryId}/history`, {
        params: buildHistoryParams(filters),
    });
    return data;
};

export const syncConfirmedInventory = async () => {
    const { data } = await _post("/inventory/sync-confirmed");
    return data;
};

export const getGoodsDonationItemDetail = async (sourceItemId) => {
    const { data } = await _get(`/goods-donations/items/${sourceItemId}`);
    return data;
};

export const getInventoryCategories = async () => {
    const { data } = await _get("/goods-donation-categories");
    return data;
};
