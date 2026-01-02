import { useEffect, useMemo, useState, useRef } from "react";
import { _get, _put } from "../../../api";
import Admin from "../../../layouts/Admin";
import Logo from "../../../components/Logo";
import { AnimatePresence, motion } from "framer-motion";
import CircularLoading from "../../../components/CircularLoading";
import ConfirmationAlert from "../../../components/alerts/ConfirmationAlert";
import SuccesAlert from "../../../components/alerts/SuccesAlert";
import { X, Search, Filter, Coins } from "lucide-react";
import html2pdf from "html2pdf.js";

const GCashDonationsAdmin = () => {
    const [donations, setDonations] = useState([]);
    const [search, setSearch] = useState("");
    const [year, setYear] = useState("");
    const [month, setMonth] = useState("");
    const [loading, setLoading] = useState(true);
    const [toBeApproved, setToBeApproved] = useState(null);
    const [success, setSuccess] = useState(false);

    // Reports
    const [isReportView, setIsReportView] = useState(false);
    const [cashDonations, setCashDonations] = useState([]);

    // Default dates for the report: start of current month -> today
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const defaultFrom = monthStart.toISOString().split("T")[0];
    const defaultTo = today.toISOString().split("T")[0];
    const [dateFrom, setDateFrom] = useState(defaultFrom);
    const [dateTo, setDateTo] = useState(defaultTo);

    const [totalAmount, setTotalAmount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);

    const months = [
        "January","February","March","April","May","June",
        "July","August","September","October","November","December",
    ];

    const containerRef = useRef();
    const printBtnRef = useRef();

    const formatCurrency = (value) => {
        const num = Number(value) || 0;
        return `₱ ${num.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    useEffect(() => {
        if (isReportView) {
            fetchCashDonations();
        }
    }, [isReportView]);

    const fetchCashDonations = async (
        dateFromParam = dateFrom,
        dateToParam = dateTo
    ) => {
        try {
            const params = { dateFrom: dateFromParam, dateTo: dateToParam };
            const response = await _get("/gcash-donations/print", { params });
            setCashDonations(response.data.donations);
            setTotalAmount(response.data.totalAmount || 0);
            setTotalCount(response.data.totalCount || 0);
            return response.data;
        } catch (error) {
            console.error("Error fetching gcash donations:", error);
        }
    };

    const handleFilterCashDonations = () => {
        fetchCashDonations(dateFrom, dateTo);
    };

    const handlePrint = () => {
        const opt = {
            margin: 0,
            filename: "GCash_Donations_Report.pdf",
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        };
        html2pdf().set(opt).from(containerRef.current).save();
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const m = [
            "January","February","March","April","May","June",
            "July","August","September","October","November","December"
        ];
        return `${m[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    };

    const fetchDonations = async () => {
        setLoading(true);
        try {
            const params = {};
            if (year) params.year = year;
            if (month) params.month = month;

            const response = await _get("/gcash-donations/filter", { params });
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
            const response = await _get(`/gcash-donations/search?q=${search}`);
            setDonations(response.data);
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setLoading(false);
        }
    };

    const approveDonation = async (id) => {
        try {
            const response = await _put(`/gcash-donations/${id}/approve`);
            fetchDonations();
            setToBeApproved(null);
            if (response.status === 200) setSuccess(true);
        } catch (error) {
            console.error("Error approving donation:", error);
        }
    };

    useEffect(() => {
        fetchDonations();
    }, [year, month]);

    const listSummary = useMemo(() => {
        const total = donations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
        const paid = donations.filter((d) => d.status === "approved").length;
        const pending = donations.filter((d) => d.status !== "approved").length;
        return { total, paid, pending };
    }, [donations]);

    const header = { 
        title: "GCash Donations Management",
        subTitle: "Easily manage incoming GCash donations — view donor details, filter records, and print reports."
    };

    const breadcrumbs = [
        { name: "Donations", link: "/donations" },
        { name: "GCash", link: "/donations/gcash" }
    ];

    return (
        <Admin header={header} breadcrumbs={breadcrumbs}>

            <div className="pt-4 bg-gray-50 min-h-screen">

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
                    <SummaryCard label="Total amount" value={formatCurrency(listSummary.total)} sub="Current view" accent="blue" />
                    <SummaryCard label="Paid donations" value={listSummary.paid} sub="GCash only" accent="green" />
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
                                    placeholder="Search donor, tracking #, email"
                                    value={search}
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
                    <div className="flex justify-center items-center w-full h-40">
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
                        <table className="w-full min-w-[700px] text-sm text-left border-collapse">
                            <thead className="bg-orange-500 text-white text-xs sticky top-0">
                                <tr>
                                    <th className="p-3">Tracking #</th>
                                    <th className="p-3">Name</th>
                                    <th className="p-3">Email</th>
                                    <th className="p-3">Amount</th>
                                    <th className="p-3">Date</th>
                                </tr>
                            </thead>

                            <tbody>
                                {donations.map((donation, index) => (
                                    <tr key={donation.id} className={`border-b border-gray-100 hover:bg-gray-50 text-xs ${index % 2 === 0 ? "bg-orange-50/40" : ""}`}>
                                        <td className="p-3 font-medium text-gray-800">{donation.donation_tracking_number}</td>
                                        <td className="p-3">{donation.name || "N/A"}</td>
                                        <td className="p-3">{donation.email || "N/A"}</td>
                                        <td className="p-3 font-mono">{formatCurrency(donation.amount)}</td>
                                        <td className="p-3">{donation.month} {donation.year}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

            </div>

            {/* CONFIRM APPROVAL */}
            {toBeApproved && (
                <ConfirmationAlert
                    onClose={() => setToBeApproved(null)}
                    onConfirm={() => approveDonation(toBeApproved)}
                    title="Approve Donation"
                    message="Are you sure you want to approve this donation?"
                    isDelete={false}
                    isDeleting={false}
                />
            )}

            {/* SUCCESS ALERT */}
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
                                    className="text-gray-500 cursor-pointer hover:text-gray-700"
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
                                    <p className="font-bold">GCash Donations Report</p>
                                    <p className="text-xs text-gray-600">
                                        From <span>{dateFrom ? formatDate(dateFrom) : "--date--"}</span> 
                                        &nbsp;to <span>{dateTo ? formatDate(dateTo) : "--date--"}</span>
                                    </p>
                                </div>

                                <div className="flex items-center gap-5 mt-6 text-xs font-medium">
                                    <p>Total Amount: {formatCurrency(totalAmount || 0)}</p>
                                    <p>Total Count: {totalCount}</p>
                                </div>

                                <div className="mt-4 overflow-x-auto">
                                    <table className="w-full min-w-[700px] bg-white text-xs">
                                        <thead className="bg-gray-200">
                                            <tr>
                                                <th className="p-3 text-start">Date</th>
                                                <th className="p-3 text-start">Donor</th>
                                                <th className="p-3 text-start">Amount</th>
                                                <th className="p-3 text-start">Reference No.</th>
                                                <th className="p-3 text-start">Email</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {cashDonations.length === 0 && (
                                                <tr>
                                                    <td colSpan={5} className="p-3 text-center">
                                                        No Records Found
                                                    </td>
                                                </tr>
                                            )}

                                            {cashDonations.map((donation, index) => (
                                                <tr key={donation.id} className={`${index % 2 === 0 ? "bg-gray-50" : ""}`}>
                                                    <td className="p-3">{donation.created_at ? new Date(donation.created_at).toLocaleDateString() : ""}</td>
                                                    <td className="p-3">{donation.name || "Anonymous"}</td>
                                                    <td className="p-3">{formatCurrency(donation.amount)}</td>
                                                    <td className="p-3">{donation.reference || "N/A"}</td>
                                                    <td className="p-3">{donation.email}</td>
                                                </tr>
                                            ))}
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
                <Coins className={`${colors.text}`} size={20} />
            </div>
            <div className="flex flex-col">
                <p className="text-[11px] uppercase tracking-wide text-gray-500">{label}</p>
                <p className={`text-xl font-bold ${colors.text}`}>{value}</p>
                {sub && <p className="text-[11px] text-gray-500">{sub}</p>}
            </div>
        </div>
    );
};

export default GCashDonationsAdmin;
