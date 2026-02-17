import { useCallback, useEffect, useState } from "react";
import {
    extractCollection,
    getApiErrorMessage,
    getInventoryItemHistory,
} from "../services/inventoryService";

export const useInventoryItemHistory = (inventoryItemId, filters = {}) => {
    const { type = "", start_date = "", end_date = "" } = filters;

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchHistory = useCallback(async (overrideFilters = {}) => {
        if (!inventoryItemId) {
            setTransactions([]);
            setLoading(false);
            setError("");
            return;
        }

        const nextFilters = {
            type,
            start_date,
            end_date,
            ...overrideFilters,
        };

        setLoading(true);
        setError("");

        try {
            const payload = await getInventoryItemHistory(inventoryItemId, nextFilters);
            setTransactions(extractCollection(payload, ["history", "transactions"]));
        } catch (requestError) {
            setTransactions([]);
            setError(getApiErrorMessage(requestError, "Unable to load history."));
        } finally {
            setLoading(false);
        }
    }, [inventoryItemId, type, start_date, end_date]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    return {
        transactions,
        loading,
        error,
        refetch: fetchHistory,
    };
};
