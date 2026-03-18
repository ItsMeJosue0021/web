import { useEffect, useState } from "react";
import { Filter, Printer, Search } from "lucide-react";
import { toast } from "react-toastify";
import { _get } from "../../api";
import ModalContainer from "../../components/ModalContainer";
import Admin from "../../layouts/Admin";
import { getApiErrorMessage, printActivityLogs } from "../../services/activityLogService";

const ActivityLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [severityFilter, setSeverityFilter] = useState("");
    const [actionTypeFilter, setActionTypeFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isPrinting, setIsPrinting] = useState(false);
    const [isPrintOpen, setIsPrintOpen] = useState(false);
    const [printUrl, setPrintUrl] = useState("");
    const [printFilename, setPrintFilename] = useState("");

    const header = {
        title: "Admin Activity Logs",
        subTitle: "Review changes done by super-admin and admin users.",
    };

    const breadcrumbs = [
        { name: "Settings", link: "/settings/admin-logs" },
        { name: "Activity Logs", link: "/settings/admin-logs" },
    ];

    const buildParams = (overrides = {}) => {
        const params = {};
        const filters = {
            search: searchTerm,
            severity: severityFilter,
            action_type: actionTypeFilter,
            status_filter: statusFilter,
            start_date: startDate,
            end_date: endDate,
            ...overrides,
        };

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && `${value}`.trim() !== "") {
                params[key] = value;
            }
        });

        return params;
    };

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const response = await _get("/admin-logs", {
                params: buildParams(),
            });
            setLogs(response.data.logs || []);
        } catch (error) {
            console.error("Error loading admin logs:", error);
            setLogs([]);
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = async () => {
        setIsPrinting(true);
        try {
            const fileBlob = await printActivityLogs({
                search: searchTerm,
                severity: severityFilter,
                actionType: actionTypeFilter,
                statusFilter,
                startDate,
                endDate,
            });

            const nextUrl = window.URL.createObjectURL(
                fileBlob instanceof Blob ? fileBlob : new Blob([fileBlob], { type: "application/pdf" })
            );

            if (printUrl) {
                window.URL.revokeObjectURL(printUrl);
            }

            setPrintUrl(nextUrl);
            setPrintFilename("admin-activity-logs-report.pdf");
            setIsPrintOpen(true);
        } catch (error) {
            toast.error(getApiErrorMessage(error, "Unable to generate activity logs report."));
        } finally {
            setIsPrinting(false);
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

    useEffect(() => {
        fetchLogs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm, severityFilter, actionTypeFilter, statusFilter, startDate, endDate]);

    useEffect(() => {
        return () => {
            if (printUrl) {
                window.URL.revokeObjectURL(printUrl);
            }
        };
    }, [printUrl]);

    const formatActor = (actor = {}) => {
        const fullName = [actor.first_name, actor.middle_name, actor.last_name]
            .filter(Boolean)
            .join(" ")
            .trim();

        return fullName || actor.email || "Unknown";
    };

    const formatTimestamp = (value) => {
        if (!value) {
            return "-";
        }

        return new Date(value).toLocaleString();
    };

    const formatStatus = (statusCode) => {
        if (statusCode === null || statusCode === undefined) {
            return "-";
        }

        return Number(statusCode) >= 400 ? `${statusCode} Failed` : `${statusCode} Success`;
    };

    const handleClearFilters = () => {
        setSearchTerm("");
        setSeverityFilter("");
        setActionTypeFilter("");
        setStatusFilter("");
        setStartDate("");
        setEndDate("");
    };

    return (
        <Admin header={header} breadcrumbs={breadcrumbs}>
            <div className="w-full mx-auto flex flex-col gap-4 mt-4">
                <div className="w-full rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <Filter size={16} className="text-orange-500" />
                                Quick filters
                            </div>
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                <button
                                    type="button"
                                    onClick={handleClearFilters}
                                    className="rounded-md border border-gray-200 px-3 py-2 text-xs text-gray-600 hover:bg-gray-50"
                                >
                                    Clear
                                </button>
                                <button
                                    type="button"
                                    onClick={handlePrint}
                                    disabled={isPrinting}
                                    className={`flex items-center justify-center gap-2 rounded-md bg-orange-600 px-4 py-2 text-xs text-white ${isPrinting ? "opacity-60 cursor-not-allowed" : "hover:bg-orange-700"}`}
                                >
                                    <Printer size={14} />
                                    {isPrinting ? "Generating..." : "Print"}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-6">
                            <div className="xl:col-span-2 flex flex-col gap-2">
                                <p className="text-xs">Search</p>
                                <div className="relative">
                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(event) => setSearchTerm(event.target.value)}
                                        className="w-full rounded border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm placeholder:text-xs"
                                        placeholder="Search action, actor name/email, IP..."
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <p className="text-xs">Start Date</p>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(event) => setStartDate(event.target.value)}
                                    className="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <p className="text-xs">End Date</p>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(event) => setEndDate(event.target.value)}
                                    className="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <p className="text-xs">Severity</p>
                                <select
                                    value={severityFilter}
                                    onChange={(event) => setSeverityFilter(event.target.value)}
                                    className="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm"
                                >
                                    <option value="">All</option>
                                    <option value="high">High</option>
                                    <option value="medium">Medium</option>
                                    <option value="low">Low</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <p className="text-xs">Action Type</p>
                                <select
                                    value={actionTypeFilter}
                                    onChange={(event) => setActionTypeFilter(event.target.value)}
                                    className="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm"
                                >
                                    <option value="">All</option>
                                    <option value="add">Add</option>
                                    <option value="edit">Edit</option>
                                    <option value="delete">Delete</option>
                                    <option value="approve">Approve</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <p className="text-xs">Status</p>
                                <select
                                    value={statusFilter}
                                    onChange={(event) => setStatusFilter(event.target.value)}
                                    className="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm"
                                >
                                    <option value="">All</option>
                                    <option value="success">Success</option>
                                    <option value="failed">Failed</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full overflow-x-auto rounded-lg border border-gray-200 bg-white">
                    <table className="w-full min-w-[920px] text-sm">
                        <thead className="bg-orange-500 text-white">
                            <tr>
                                <th className="p-3 text-left">Timestamp</th>
                                <th className="p-3 text-left">Actor</th>
                                <th className="p-3 text-left">Action</th>
                                <th className="p-3 text-left">IP</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-left">Severity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!loading && logs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-xs text-gray-500">
                                        No logs found.
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log.id} className="text-xs odd:bg-orange-50">
                                        <td className="p-3 whitespace-nowrap">{formatTimestamp(log.created_at)}</td>
                                        <td className="p-3">{formatActor(log.actor)}</td>
                                        <td className="p-3">{log.action}</td>
                                        <td className="p-3">{log.ip_address || "-"}</td>
                                        <td className="p-3">{formatStatus(log.status_code)}</td>
                                        <td className="p-3 uppercase">{log.severity || "low"}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {loading && (
                    <div className="w-full rounded-lg border border-gray-100 bg-white px-4 py-6 text-sm text-gray-500">
                        Loading activity logs...
                    </div>
                )}
            </div>

            {isPrintOpen && (
                <ModalContainer isFull={false} close={closePrintPreview}>
                    <div className="w-full md:w-[900px] h-[70vh] rounded-xl bg-white p-4 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-600 font-semibold">Admin Activity Logs Report</p>
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
                                    title="Admin Activity Logs Report"
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

export default ActivityLogs;
