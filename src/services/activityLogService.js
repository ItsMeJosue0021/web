import { _get } from "../api";

export const getApiErrorMessage = (error, fallback = "Something went wrong.") => {
    return (
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        fallback
    );
};

export const printActivityLogs = async (filters = {}) => {
    const response = await _get("/admin-logs/print", {
        params: {
            search: filters.search,
            severity: filters.severity,
            action_type: filters.actionType,
            status_filter: filters.statusFilter,
            start_date: filters.startDate,
            end_date: filters.endDate,
        },
        responseType: "blob",
    });

    return response.data;
};
