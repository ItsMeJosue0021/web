import { useCallback, useEffect, useState } from "react";
import Admin from "../../layouts/Admin";
import { _get, _post } from "../../api";
import { toast } from "react-toastify";
import debounce from "lodash.debounce";
import "../../css/loading.css";
import CircularLoading from "../../components/CircularLoading";

const MembershipRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actionId, setActionId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchRequests = async (term = "") => {
        setLoading(true);
        try {
            const query = term ? `?search=${encodeURIComponent(term)}` : "";
            const response = await _get(`/membership-requests${query}`);
            const data = response.data?.requests ?? response.data ?? [];
            setRequests(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching membership requests:", error);
            toast.error("Unable to load membership requests.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const debouncedSearch = useCallback(
        debounce((value) => {
            fetchRequests(value);
        }, 400),
        []
    );

    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };

    const formatDate = (date) => {
        if (!date) return "—";
        const parsed = new Date(date);
        if (Number.isNaN(parsed.getTime())) return date;
        return parsed.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    const buildName = (request) => {
        if (request.name) return request.name;
        if (request.full_name) return request.full_name;
        const first = request.first_name || request.firstName || request.user?.first_name;
        const middle = request.middle_name || request.middleName || request.user?.middle_name;
        const last = request.last_name || request.lastName || request.user?.last_name;
        return [first, middle, last].filter(Boolean).join(" ") || "-";
    };

    const handleDecision = async (id, decision) => {
        if (!id) return;
        setActionId(id);
        try {
            await _post(`/membership-requests/${id}/${decision}`);
            toast.success(decision === "approve" ? "Request approved." : "Request rejected.");
            fetchRequests(searchTerm);
        } catch (error) {
            console.error(`Error trying to ${decision} request:`, error);
            toast.error(`Unable to ${decision} request.`);
        } finally {
            setActionId(null);
        }
    };

    const header = {
        title: "Membership Requests",
        subTitle: "Review and manage incoming membership applications.",
    };

    const breadcrumbs = [
        { name: "Membership", link: "/members" },
        { name: "Requests", link: "/membership-requests" },
    ];

    return (
        <Admin header={header} breadcrumbs={breadcrumbs}>
            <div className="w-full mx-auto flex flex-col gap-4 mt-4 md:mt-0">
                <div className="flex flex-col md:flex-row items-start gap-4 md:gap-0 md:items-center justify-between bg-white border-gray-100 p-3 rounded-lg">
                    <div className="w-full md:min-w-80 md:max-w-[500px] flex items-center gap-4">
                        <p className="hidden md:block text-xs">Search</p>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="bg-white placeholder:text-xs px-4 py-2 rounded border border-gray-200 text-sm w-full"
                            placeholder="Search by name or user ID.."
                        />
                    </div>
                </div>

                <div className="w-full max-w-screen-sm md:max-w-none rounded-lg overflow-x-auto">
                    <table className="w-full border rounded-lg overflow-hidden shadow bg-white text-xs">
                        <thead className="bg-orange-500 text-white">
                            <tr>
                                <th className="p-3 text-start">Name</th>
                                <th className="p-3 text-start">User ID</th>
                                <th className="p-3 text-start">Date Requested</th>
                                <th className="p-3 text-start">Status</th>
                                <th className="p-3 text-end">Action</th>
                            </tr>
                        </thead>
                        {!loading && (
                            <tbody>
                                {requests.length > 0 ? (
                                    requests.map((request, index) => (
                                        <tr key={request.id || `${request.user_id}-${index}`} className={`${index % 2 === 0 ? "bg-orange-50" : ""}`}>
                                            <td className="p-3">{buildName(request)}</td>
                                            <td className="p-3">{request.user_id || "-"}</td>
                                            <td className="p-3">{formatDate(request.created_at || request.date_requested || request.requested_at)}</td>
                                            <td className="p-3 capitalize">{request.status || "pending"}</td>
                                            <td className="p-3 flex justify-end gap-2">
                                                <button
                                                    className="bg-green-50 text-green-600 px-3 py-1 rounded"
                                                    onClick={() => handleDecision(request.id, "approve")}
                                                    disabled={actionId === request.id}
                                                >
                                                    {actionId === request.id ? "Processing..." : "Approve"}
                                                </button>
                                                <button
                                                    className="bg-red-50 text-red-600 px-3 py-1 rounded"
                                                    onClick={() => handleDecision(request.id, "reject")}
                                                    disabled={actionId === request.id}
                                                >
                                                    {actionId === request.id ? "Processing..." : "Reject"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td className="p-6 text-center text-gray-500" colSpan={5}>
                                            No membership requests found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        )}
                    </table>
                </div>

                {loading && (
                    <div className="w-full h-40 flex items-center justify-center">
                        <CircularLoading customClass="text-blue-500 w-6 h-6" />
                    </div>
                )}
            </div>
        </Admin>
    );
};

export default MembershipRequests;
