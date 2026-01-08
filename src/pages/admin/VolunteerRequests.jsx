import Admin from "../../layouts/Admin";
import CircularLoading from "../../components/CircularLoading";
import { useEffect, useState } from "react";
import { _get } from "../../api";
import SuccesAlert from "../../components/alerts/SuccesAlert";

const VolunteerRequests = () => {
    
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [successModal, setSuccessModal] = useState({ open: false, message: "" });
    const [actionLoading, setActionLoading] = useState({ id: null, action: null });

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response =  _get('/volunteering-requests');
            if ((await response).status == 200) {
                setRequests((await response).data.requests);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const handleAction = async (id, action) => {
        if (!id) return;
        try {
            setActionLoading({ id, action });
            const response = await _get(`/volunteering-requests/${id}/${action}`);
            if (response?.status === 200) {
                const successMessage = action === 'reject'
                    ? "Volunteer request rejected successfully."
                    : "Volunteer request approved successfully.";
                setSuccessModal({ open: true, message: successMessage });
            }
            fetchRequests();
        } catch (error) {
            console.log(error);
        } finally {
            setActionLoading({ id: null, action: null });
        }
    }
    
    const header = { 
        title: "Volunteer Management",
        subTitle: "Review, approve, and manage volunteer requests efficiently."
    };

    const breadcrumbs = [
        { name: "Volunteers", link: "/volunteer-requests" }
    ]

    return (
        <Admin header={header} breadcrumbs={breadcrumbs}>
            <div className="w-full mx-auto flex flex-col gap-4 mt-4 md:mt-0">
                <div className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-white">
                    <div className="w-full md:in-w-80 md:max-w-[500px] flex items-center gap-4 ">
                        <p className="hidden md:block text-xs">Search</p>
                        <input 
                            // onChange={(e) => handleSearch(e.target.value)} 
                            type="text" 
                            className="bg-white placeholder:text-xs px-4 py-2 rounded border border-gray-200 text-sm" 
                            placeholder="Search for specific item.." 
                        />
                    </div>
                </div>
                {loading ? (
                    <div className="w-full h-40 flex items-center justify-center">
                        <CircularLoading customClass="text-blue-500 w-6 h-6" />
                    </div>
                ) : requests.length === 0 ? (
                    <div className="bg-white border border-dashed border-gray-200 rounded-lg p-8 text-center text-sm text-gray-500">
                        No volunteer requests found. Adjust search or clear filters to see more results.
                        <div className="mt-3">
                            <button
                                onClick={() => fetchRequests()}
                                className="text-xs px-3 py-2 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
                            >
                                Clear filters
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="w-full min-w-[700px] rounded-lg overflow-x-auto">
                        <table className="w-full border rounded-lg shadow bg-white text-sm">
                            <thead className="bg-orange-500 text-white ">
                            <tr className="text-xs">
                                <th className="p-3 text-start">Project Name</th>
                                <th className="p-3 text-start">Date</th>
                                <th className="p-3 text-start">Volunteer's Name</th>
                                <th className="p-3 text-start">Email</th>
                                <th className="p-3 text-start">Contact Number</th>
                                <th className="p-3 text-start">Date Requested</th>
                                <th className="p-3 text-start">Is_Member?</th>
                                <th className="p-3 text-start">Is_User?</th>
                                <th className="p-3 text-start">Status</th>
                                <th className="p-3 text-start">Action</th>
                            </tr>
                            </thead>
                            
                                <tbody>
                                    {requests.map((row, index) => (
                                    <tr key={row.id}
                                    className={`${index % 2 === 0 ? "bg-orange-50" : ""}`}>
                                        <td className="p-3 text-xs">{row.project.title}</td>
                                        <td className="p-3 text-xs">{row.project.date}</td>
                                        <td className="p-3 text-xs">{row.first_name} {row.middle_name} {row.last_name}</td>
                                        <td className={`p-3 text-xs `}>{row.email}</td>
                                        <td className="p-3 text-xs ">{row.contact_number}</td>
                                        <td className="p-3 text-xs ">{row.created_at}</td>
                                        <td className="p-3 text-xs ">
                                            {row.is_member ? (
                                                <p className="text-xs text-green-500 font-medium">Yes</p>
                                            ) : (
                                                <p className="text-xs text-red-500 font-medium">No</p>
                                            )}
                                        </td>
                                         <td className="p-3 text-xs ">
                                            {row.is_user ? (
                                                <p className="text-xs text-green-500 font-medium">Yes</p>
                                            ) : (
                                                <p className="text-xs text-red-500 font-medium">No</p>
                                            )}
                                        </td>
                                        <td>
                                            {row.status === 'pending' ? (
                                                <span className="px-2 py-1 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-600">
                                                    {row.status}
                                                </span>
                                            ) : row.status === 'rejected' || row.status === 'expired' ? (
                                                <span className="px-2 py-1 rounded-full text-[11px] font-semibold bg-red-50 text-red-600">
                                                    {row.status}
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-600">
                                                    {row.status}
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            {row.status === 'pending' && (
                                                <div className="flex flex-col gap-1 p-2">
                                                    <button
                                                        onClick={() => handleAction(row.id, 'approve')}
                                                        disabled={actionLoading.id === row.id}
                                                        className="text-[10px] px-3 py-0 text-white bg-green-500 rounded disabled:opacity-60"
                                                    >
                                                        {actionLoading.id === row.id && actionLoading.action === 'approve' ? "Processing.." : "Approve"}
                                                    </button>
                                                
                                                    <button
                                                        onClick={() => handleAction(row.id, 'reject')}
                                                        disabled={actionLoading.id === row.id}
                                                        className="text-[10px] px-3 py-0 text-white bg-red-500 rounded disabled:opacity-60"
                                                    >
                                                        {actionLoading.id === row.id && actionLoading.action === 'reject' ? "Processing.." : "Reject"}
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                    
                                    ))}
                                </tbody>
                        </table>
                    </div>
                )}
            </div>

            {successModal.open && (
                <SuccesAlert
                    message={successModal.message}
                    onClose={() => setSuccessModal({ open: false, message: "" })}
                />
            )}
        </Admin>
    )
}

export default VolunteerRequests;
