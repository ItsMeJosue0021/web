import { useEffect, useMemo, useState, useRef } from "react";
import { _get, _put } from "../../../api";
import Admin from "../../../layouts/Admin";
import Logo from "../../../components/Logo";
import { AnimatePresence, motion } from "framer-motion";
import CircularLoading from "../../../components/CircularLoading";
import ConfirmationAlert from "../../../components/alerts/ConfirmationAlert";
import SuccesAlert from "../../../components/alerts/SuccesAlert";
import WarningAlert from "../../../components/alerts/WarningAlert";
import ModalContainer from "../../../components/ModalContainer";
import ItemizerModal from "../../../components/ItemizerModal";
import { X, Search, Filter, Package } from "lucide-react";
import html2pdf from "html2pdf.js";

const GoodsDonationsAdmin = () => {
    const [donations, setDonations] = useState([]);
    const [search, setSearch] = useState("");
    const [year, setYear] = useState("");
    const [month, setMonth] = useState("");
    const [loading, setLoading] = useState(true);
    const [toBeApproved, setToBeApproved] = useState(null);
    const [success, setSuccess] = useState(false);
    const [editingCell, setEditingCell] = useState({ id: null, field: null });
    const [updatingCell, setUpdatingCell] = useState({ id: null, field: null });

    // reports
    const [isReportView, setIsReportView] = useState(false);
    const [cashDonations, setCashDonations] = useState([]);

    // Default dates for the report: Jan 1 of current year to today
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const defaultFrom = monthStart.toISOString().split("T")[0];
    const defaultTo = today.toISOString().split("T")[0];
    const [dateFrom, setDateFrom] = useState(defaultFrom);
    const [dateTo, setDateTo] = useState(defaultTo);
    const [totalCount, setTotalCount] = useState(0);

    // donation items
    const [isItemizerOpen, setIsItemizerOpen] = useState(false);
    const [selectedDonation, setSelectedDonation] = useState(null);

    const months = [
        "January","February","March","April","May","June",
        "July","August","September","October","November","December",
    ];

    const containerRef = useRef();
    const printBtnRef = useRef();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const m = [
            "January","February","March","April","May","June",
            "July","August","September","October","November","December"
        ];
        return `${m[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    };

    const formatTypeBadge = (type) => {
        if (type === "food") return "text-green-600 bg-green-50 border border-green-100";
        if (type === "clothes") return "text-blue-600 bg-blue-50 border border-blue-100";
        return "text-pink-600 bg-pink-50 border border-pink-100";
    };

    useEffect(() => {
        if (isReportView) {
            fetchGoodsDonations();
        }
    }, [isReportView]);

    const fetchGoodsDonations = async (
        dateFromParam = dateFrom,
        dateToParam = dateTo
    ) => {
        try {
            const params = {
                dateFrom: dateFromParam,
                dateTo: dateToParam
            };

            const response = await _get("/goods-donations/v2/print", { params });
            setCashDonations(response.data.donations);
            setTotalCount(response.data.totalCount || 0);

            return response.data;
        } catch (error) {
            console.error("Error fetching goods donations:", error);
        }
    };

    const handleFilterCashDonations = () => {
        fetchGoodsDonations(dateFrom, dateTo);
    };

    const handlePrint = () => {
        const opt = {
            margin: 0,
            filename: "Goods_Donations_Report.pdf",
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        };

        html2pdf().set(opt).from(containerRef.current).save();
    };

    const fetchDonations = async () => {
        setLoading(true);
        try {
            const params = {};
            if (year) params.year = year;
            if (month) params.month = month;

            const response = await _get("/goods-donations/v2/filter", { params });
            setDonations(response.data);
        } catch (error) {
            console.error("Error fetching donations:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!search.trim()) return fetchDonations();
        setLoading(true);

        try {
            const response = await _get(`/goods-donations/v2/search?q=${search}`);
            setDonations(response.data);
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setLoading(false);
        }
    };

    const approveDonation = async (id) => {
        try {
            const response = await _put(`/goods-donations/v2/${id}/approve`);
            fetchDonations();
            setToBeApproved(null);
            if (response.status === 200) setSuccess(true);
        } catch (error) {
            console.error("Error approving donation:", error);
        }
    };

    const updateDonation = async (id, payload) => {
        try {
            await _put(`/goods-donations/${id}/name-description`, payload);
        } catch (error) {
            console.error("Error updating donation:", error);
        }
    };

    const isEditing = (id, field) =>
        editingCell.id === id && editingCell.field === field;

    const isUpdating = (id, field) =>
        updatingCell.id === id && updatingCell.field === field;

    const handleEditStart = (id, field) => {
        setEditingCell({ id, field });
    };

    const handleEditChange = (id, field, value) => {
        setDonations((prev) =>
            prev.map((donation) =>
                donation.id === id ? { ...donation, [field]: value } : donation
            )
        );
    };

    const handleEditBlur = async (donation, field) => {
        setEditingCell({ id: null, field: null });
        setUpdatingCell({ id: donation.id, field });
        await updateDonation(donation.id, {
            name: donation.name ?? "",
            description: donation.description ?? ""
        });
        setUpdatingCell({ id: null, field: null });
    };

    const openItemizerModal = (donation) => {
        setSelectedDonation(donation);
        setIsItemizerOpen(true);
    };

    useEffect(() => {
        fetchDonations();
    }, [year, month]);

    const listSummary = useMemo(() => {
        const count = donations.length;
        const approved = donations.filter((d) => d.status === "approved").length;
        const pending = donations.filter((d) => d.status !== "approved").length;
        return { count, approved, pending };
    }, [donations]);

    const header = { 
        title: "Goods Donations Management",
        subTitle: "Easily manage incoming goods donations — view donor details, filter records, and print reports."
    };

    const breadcrumbs = [
        { name: "Donations", link: "/donations" },
        { name: "Goods", link: "/donations/goods" }
    ];

    return (
        <Admin header={header} breadcrumbs={breadcrumbs}>

            <div className="pt-4 bg-gray-50 min-h-screen">

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
                    <SummaryCard label="Total donations" value={listSummary.count} sub="Current view" accent="blue" />
                    <SummaryCard label="Approved donations" value={listSummary.approved} sub="Goods only" accent="green" />
                    <SummaryCard label="Pending donations" value={listSummary.pending} sub="Awaiting approval" accent="amber" />
                    <SummaryCard label="Report range" value={`${dateFrom} → ${dateTo}`} sub="Report filters" accent="purple" />
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-md mb-6 border border-gray-100 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
                        <div className="text-sm text-gray-700 font-semibold flex items-center gap-2">
                            <Filter size={16} className="text-orange-500" /> Quick filters
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full lg:w-auto">
                            <div className="relative w-full sm:w-64">
                                <Search size={16} className="text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={search}
                                    placeholder="Search donor, tracking #, email"
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="bg-white border border-gray-200 rounded-md pl-9 pr-3 py-2 text-xs w-full"
                                />
                            </div>
                            <button 
                                onClick={handleSearch}
                                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-xs whitespace-nowrap"
                            >
                                Search
                            </button>
                            <button
                                onClick={() => { setSearch(""); setYear(""); setMonth(""); fetchDonations(); }}
                                className="text-xs px-3 py-2 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
                            >
                                Clear
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">

                        <select
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="bg-white border border-gray-200 rounded-md px-3 py-2 text-xs w-full sm:w-auto"
                        >
                            <option value="">All Months</option>
                            {months.map((m) => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>

                        <select
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            className="bg-white border border-gray-200 rounded-md px-3 py-2 text-xs w-full sm:w-auto"
                        >
                            <option value="">All Years</option>
                            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>

                        <button 
                            onClick={() => setIsReportView(true)}
                            className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-md text-xs whitespace-nowrap"
                        >
                            Generate Report
                        </button>
                    </div>
                </div>

                {/* TABLE */}
                {loading ? (
                    <div className="w-full h-48 flex justify-center items-center">
                        <CircularLoading customClass="w-6 h-6 text-blue-500" />
                    </div>
                ) : donations.length === 0 ? (
                    <div className="bg-white border border-dashed border-gray-200 rounded-lg p-8 text-center text-sm text-gray-500">
                        No donations found. Adjust filters or clear search to see more results.
                        <div className="mt-3">
                            <button
                                onClick={() => { setSearch(""); setYear(""); setMonth(""); fetchDonations(); }}
                                className="text-xs px-3 py-2 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
                            >
                                Clear filters
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-100">
                        <table className="w-full min-w-[900px] text-sm border-collapse">
                            <thead className="bg-orange-500 text-white text-xs sticky top-0">
                                <tr>
                                    <th className="py-2 px-3 text-left">Date</th>
                                    <th className="py-2 px-3 text-left">Name</th>
                                    <th className="py-2 px-3 text-left">Description</th>
                                    <th className="py-2 px-3 text-left">Email</th>
                                    <th className="py-2 px-3 text-left">Type</th>
                                    <th className="py-2 px-3 text-left">Quantity</th>
                                    <th className="py-2 px-3 text-left">Address</th>
                                    <th className="py-2 px-3 text-left">Status</th>
                                    <th className="py-2 px-3 text-left">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {donations.map((donation, index) => (
                                    <tr key={donation.id} className={`border-b border-gray-100 hover:bg-gray-50 text-xs ${index % 2 === 0 ? "bg-orange-50/40" : ""}`}>

                                        <td className="p-2">
                                            {donation.created_at
                                                ? new Date(donation.created_at).toLocaleDateString("en-US", {
                                                    year: "numeric", month: "long", day: "numeric"
                                                })
                                                : ""}
                                        </td>

                                        <td className="p-2">
                                            {isEditing(donation.id, "name") ? (
                                                <input
                                                    type="text"
                                                    value={donation.name ?? ""}
                                                    onChange={(e) =>
                                                        handleEditChange(donation.id, "name", e.target.value)
                                                    }
                                                    onBlur={() => handleEditBlur(donation, "name")}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") e.currentTarget.blur();
                                                    }}
                                                    className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-xs"
                                                    autoFocus
                                                />
                                            ) : isUpdating(donation.id, "name") ? (
                                                <span className="text-[11px] text-gray-500">Updating...</span>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => handleEditStart(donation.id, "name")}
                                                    className="w-full text-left bg-white"
                                                    title="Click to edit"
                                                >
                                                    {donation.name || (
                                                        <span className="px-2 py-1 rounded bg-gray-100 text-gray-600">
                                                            Anonymous
                                                        </span>
                                                    )}
                                                </button>
                                            )}
                                        </td>

                                        <td className="p-2">
                                            {isEditing(donation.id, "description") ? (
                                                <input
                                                    type="text"
                                                    value={donation.description ?? ""}
                                                    onChange={(e) =>
                                                        handleEditChange(donation.id, "description", e.target.value)
                                                    }
                                                    onBlur={() => handleEditBlur(donation, "description")}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") e.currentTarget.blur();
                                                    }}
                                                    className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-xs"
                                                    autoFocus
                                                />
                                            ) : isUpdating(donation.id, "description") ? (
                                                <span className="text-[11px] text-gray-500">Updating...</span>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => handleEditStart(donation.id, "description")}
                                                    className="w-full text-left min-h-[18px] bg-white"
                                                    title="Click to edit"
                                                >
                                                    {donation.description || ""}
                                                </button>
                                            )}
                                        </td>
                                        <td className="p-2">{donation.email || ""}</td>

                                        <td className="p-2">
                                            {donation.type?.map((type, idx) => (
                                                <span
                                                    key={idx}
                                                    className={`inline-block px-2 py-1 rounded text-[11px] mr-1 ${formatTypeBadge(type)}`}
                                                >
                                                    {type}
                                                </span>
                                            ))}
                                        </td>

                                        <td className="p-2">{donation.quantity || ""}</td>
                                        <td className="p-2">{donation.address || ""}</td>

                                        <td className="p-2 capitalize">
                                            {donation.status === "approved" ? (
                                                <span className="px-2 py-1 rounded-full text-[11px] bg-green-50 text-green-700 border border-green-200">Received</span>
                                            ) : (
                                                <span className="px-2 py-1 rounded-full text-[11px] bg-amber-50 text-amber-700 border border-amber-200">Pending</span>
                                            )}
                                        </td>

                                        <td className="p-2 text-center">
                                            <div className="flex items-center gap-2 justify-end">
                                                {donation.status !== "approved" && (
                                                    <button
                                                        onClick={() => setToBeApproved(donation)}
                                                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
                                                    >
                                                        Confirm
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => openItemizerModal(donation)} 
                                                    className={`rounded text-xs px-3 py-1 cursor-pointer ${donation.items_count > 0 ? 'bg-gray-200 text-gray-700' : 'bg-blue-600 text-white'}`}>
                                                    {donation.items_count > 0 ? 'Items' : 'Itemize' }
                                                </button>
                                                
                                            </div>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {isItemizerOpen && (
                <ModalContainer isFull={true} close={() => setIsItemizerOpen(false)}>
                    <ItemizerModal 
                        donation={selectedDonation}
                        fetchDonations={() => fetchDonations()}
                    />
                </ModalContainer>
            )}

            {/* CONFIRMATION / WARNING MODALS */}
            {toBeApproved && (
                toBeApproved.items_count > 0 ? (
                    <ConfirmationAlert
                        onClose={() => setToBeApproved(null)}
                        onConfirm={() => approveDonation(toBeApproved.id)}
                        title="Approve Donation"
                        message="Are you sure you want to approve this donation?"
                    />
                ) : (
                    <WarningAlert
                        title="Action Required"
                        message="Please itemize the donation first before confirming it."
                        onClose={() => setToBeApproved(null)}
                    />
                )
            )}

            {/* SUCCESS MESSAGE */}
            {success && (
                <SuccesAlert
                    message="Donation approved successfully."
                    onClose={() => setSuccess(false)}
                />
            )}

            {/* REPORT MODAL */}
            {isReportView && (
                <AnimatePresence>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-white p-5 overflow-auto"
                    >
                        <div className="w-full max-w-[900px] mx-auto">

                            {/* Close Button */}
                            <div className="flex justify-end">
                                <X
                                    className="cursor-pointer text-gray-500 hover:text-gray-700"
                                    size={18}
                                    onClick={() => setIsReportView(false)}
                                />
                            </div>

                            {/* Filter Bar */}
                            <div className="w-full max-w-[800px] mx-auto mt-5 mb-3 flex flex-col md:flex-row justify-between gap-4">
                                
                                <div>
                                    <span className="text-sm font-semibold">Filter Donations</span>

                                    <div className="flex flex-col sm:flex-row gap-3 mt-2">
                                        
                                        <div className="flex items-center gap-2">
                                            <label className="text-xs">From</label>
                                            <input 
                                                type="date"
                                                value={dateFrom}
                                                onChange={(e) => setDateFrom(e.target.value)}
                                                className="bg-white text-xs px-3 py-1.5 border border-gray-200 rounded"
                                            />
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <label className="text-xs">To</label>
                                            <input 
                                                type="date"
                                                value={dateTo}
                                                onChange={(e) => setDateTo(e.target.value)}
                                                className="bg-white text-xs px-3 py-1.5 border border-gray-200 rounded"
                                            />
                                        </div>

                                        <button 
                                            onClick={handleFilterCashDonations}
                                            className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded"
                                        >
                                            Go
                                        </button>

                                    </div>
                                </div>

                                <button
                                    onClick={handlePrint}
                                    ref={printBtnRef}
                                    className="h-fit text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded whitespace-nowrap"
                                >
                                    Print
                                </button>

                            </div>

                            {/* REPORT CONTENT */}
                            <div ref={containerRef} className="w-full max-w-[800px] mx-auto p-5 shadow bg-white">

                                <Logo />

                                <div className="text-center mt-5">
                                    <p className="font-bold">Goods Donations Report</p>
                                    <p className="text-xs text-gray-600">
                                        From <span>{dateFrom ? formatDate(dateFrom) : "--date--"}</span> to <span>{dateTo ? formatDate(dateTo) : "--date--"}</span>
                                    </p>
                                </div>

                                <div className="mt-5 text-xs font-medium">
                                    <p>Total Count: {totalCount}</p>
                                </div>

                                {/* Report Table */}
                                <div className="mt-4 overflow-x-auto">
                                    <table className="w-full min-w-[700px] bg-white text-xs">
                                        <thead className="bg-gray-200">
                                            <tr>
                                                <th className="p-3 text-start">Date</th>
                                                <th className="p-3 text-start">Donor</th>
                                                <th className="p-3 text-start">Description</th>
                                                <th className="p-3 text-start">Email</th>
                                                <th className="p-3 text-start">Type of Donation</th>
                                                <th className="p-3 text-start">Address</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {cashDonations.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} className="p-3 text-center">No Records Found</td>
                                                </tr>
                                            ) : (
                                                cashDonations.map((donation, index) => (
                                                    <tr key={donation.id} className={`${index % 2 === 0 ? "bg-gray-50" : ""}`}>

                                                        <td className="p-3">
                                                            {donation.created_at 
                                                                ? new Date(donation.created_at).toLocaleDateString()
                                                                : ""}
                                                        </td>

                                                        <td className="p-3">
                                                            {donation.name || (
                                                                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[11px]">Anonymous</span>
                                                            )}
                                                        </td>

                                                        <td className="p-3">{donation.description}</td>
                                                        <td className="p-3">{donation.email}</td>

                                                        <td className="p-3">
                                                            {donation.type?.map((type, i) => (
                                                                <span
                                                                    key={i}
                                                                    className={`inline-block px-2 py-1 rounded text-[11px] mr-1 ${formatTypeBadge(type)}`}
                                                                >
                                                                    {type}
                                                                </span>
                                                            ))}
                                                        </td>

                                                        <td className="p-3">{donation.address}</td>

                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                            </div>

                        </div>
                    </motion.div>
                </AnimatePresence>
            )}

            

        </Admin>
    );
};

const accentClasses = {
    green: { text: "text-green-600", bg: "bg-green-50" },
    blue: { text: "text-blue-600", bg: "bg-blue-50" },
    amber: { text: "text-amber-600", bg: "bg-amber-50" },
    purple: { text: "text-purple-600", bg: "bg-purple-50" },
};

const SummaryCard = ({ label, value, sub, accent = "blue" }) => {
    const colors = accentClasses[accent] || accentClasses.blue;
    return (
        <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-4 flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg ${colors.bg} flex items-center justify-center`}>
                <Package className={`${colors.text}`} size={20} />
            </div>
            <div className="flex flex-col">
                <p className="text-[11px] uppercase tracking-wide text-gray-500">{label}</p>
                <p className={`text-xl font-bold ${colors.text}`}>{value}</p>
                {sub && <p className="text-[11px] text-gray-500">{sub}</p>}
            </div>
        </div>
    );
};

export default GoodsDonationsAdmin;
