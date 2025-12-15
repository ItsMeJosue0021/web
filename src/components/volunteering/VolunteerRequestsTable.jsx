import React from "react";

const VolunteerRequestsTable = ({ requests = [], loading = false }) => {

    const formatDate = (value) => {
        if (!value) return "-";
        const parsed = new Date(value);
        if (Number.isNaN(parsed.getTime())) return value;
        return parsed.toLocaleString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-orange-600">Your Volunteer Requests</h3>
                <span className="text-[11px] text-gray-500">{requests.length} total</span>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-left text-xs">
                    <thead>
                        <tr className="text-gray-500 border-b">
                            <th className="px-3 py-2 font-medium">Project Name</th>
                            <th className="px-3 py-2 font-medium">Location</th>
                            <th className="px-3 py-2 font-medium">Date</th>
                            <th className="px-3 py-2 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && (
                            <tr>
                                <td className="px-3 py-3 text-gray-600" colSpan={4}>
                                    Loading requests...
                                </td>
                            </tr>
                        )}

                        {!loading && requests.length === 0 && (
                            <tr>
                                <td className="px-3 py-3 text-gray-600" colSpan={4}>
                                    No volunteer requests found.
                                </td>
                            </tr>
                        )}

                        {!loading &&
                            requests.map((request) => (
                                <tr key={request.id} className="border-b last:border-b-0">
                                    <td className="px-3 py-2 text-gray-800">
                                        {request.project?.title || " "}
                                    </td>
                                    <td className="px-3 py-2 text-gray-700">
                                        {request.project?.location|| " "}
                                    </td>
                                    <td className="px-3 py-2 text-gray-700">{formatDate(request.project.date)}</td>
                                    <td className="px-3 py-2">
                                        {request.status === 'pending' ? (
                                            <span className="px-2 py-1 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-600">
                                                {request.status}
                                            </span>
                                        ) : request.status === 'rejected' || request.status === 'expired' ? (
                                            <span className="px-2 py-1 rounded-full text-[10px] font-semibold bg-red-50 text-red-600">
                                                {request.status}
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-600">
                                                {request.status}
                                            </span>
                                        )}
                                        
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VolunteerRequestsTable;
