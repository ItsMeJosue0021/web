import { useCallback, useEffect, useState } from "react";
import {
    extractCollection,
    getApiErrorMessage,
    getSubcategoryInventoryHistory,
} from "../services/inventoryService";

export const useInventorySubcategoryHistory = (subcategoryId, filters = {}) => {
    const { type = "", start_date = "", end_date = "", unit = "" } = filters;

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchHistory = useCallback(async (overrideFilters = {}) => {
        if (!subcategoryId) {
            setTransactions([]);
            setLoading(false);
            setError("");
            return;
        }

        const nextFilters = {
            type,
            start_date,
            end_date,
            unit,
            ...overrideFilters,
        };

        setLoading(true);
        setError("");

        try {
            const payload = await getSubcategoryInventoryHistory(subcategoryId, nextFilters);
            setTransactions(extractCollection(payload, ["history", "transactions"]));
        } catch (requestError) {
            setTransactions([]);
            setError(getApiErrorMessage(requestError, "Unable to load history."));
        } finally {
            setLoading(false);
        }
    }, [subcategoryId, type, start_date, end_date, unit]);

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
