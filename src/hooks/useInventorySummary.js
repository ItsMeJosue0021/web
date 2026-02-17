import { useCallback, useEffect, useState } from "react";
import {
    extractCollection,
    getApiErrorMessage,
    getInventorySummary,
} from "../services/inventoryService";

export const useInventorySummary = (filters = {}) => {
    const {
        search = "",
        category = "",
        sub_category = "",
        include_zero = false,
        near_expiration_days = "",
    } = filters;

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchInventory = useCallback(async (overrideFilters = {}) => {
        const nextFilters = {
            search,
            category,
            sub_category,
            include_zero,
            near_expiration_days,
            ...overrideFilters,
        };

        setLoading(true);
        setError("");

        try {
            const payload = await getInventorySummary(nextFilters);
            setItems(extractCollection(payload, ["inventory", "items"]));
        } catch (requestError) {
            setItems([]);
            setError(getApiErrorMessage(requestError, "Unable to load inventory."));
        } finally {
            setLoading(false);
        }
    }, [search, category, sub_category, include_zero, near_expiration_days]);

    useEffect(() => {
        fetchInventory();
    }, [fetchInventory]);

    return {
        items,
        loading,
        error,
        refresh: fetchInventory,
    };
};
