import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { _get, _put } from "../../../api";
import Admin from "../../../layouts/Admin"; 
import Logo from "../../../components/Logo";
import { AnimatePresence, motion } from "framer-motion";
import CircularLoading from "../../../components/CircularLoading";
import ConfirmationAlert from "../../../components/alerts/ConfirmationAlert";
import SuccesAlert from "../../../components/alerts/SuccesAlert";
import { X } from "lucide-react";
import html2pdf from 'html2pdf.js';
import ModalContainer from "../../../components/ModalContainer";
import ItemizerModal from "../../../components/ItemizerModal";

const GoodsDonationsAdmin = () => {
    const [donations, setDonations] = useState([]);
    const [search, setSearch] = useState("");
    const [year, setYear] = useState("");
    const [month, setMonth] = useState("");
    const [loading, setLoading] = useState(true);
    const [toBeApproved, setToBeApproved] = useState(null);
    const [success, setSuccess] = useState(false);

    // reports
    const [isReportView, setIsReportView] = useState(false);
    const [cashDonations, setCashDonations] = useState([]);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
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

    const fetchGoodsDonations = async (dateFrom = "", dateTo = "") => {
        try {
            const params = {};
            if (dateFrom) params.dateFrom = dateFrom;
            if (dateTo) params.dateTo = dateTo;

            const response = await _get("/goods-donations/v2/print", { params });
            setCashDonations(response.data.donations);
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
            filename: 'Goods_Donations_Report.pdf',
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
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

            const response = await _get("/goods-donations/v2/filter", { params });
            setDonations(response.data);
            setCashDonations(response.data);

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

    const openItemizerModal = (donation) => {
        setSelectedDonation(donation);
        setIsItemizerOpen(true);
    }

    useEffect(() => {
        fetchDonations();
    }, [year, month]);

    const header = { 
        title: "Goods Donations Management",
        subTitle: "Easily manage incoming Goods donations — view donor details, or print records with ease."
    };

    const breadcrumbs = [
        { name: "Donations", link: "/donations" },
        { name: "Goods", link: "/donations/goods" }
    ];

    return (
        <Admin header={header} breadcrumbs={breadcrumbs}>

            <div className="pt-4 bg-gray-50 min-h-screen">

                {/* 🔍 SEARCH + FILTERS — Fully Responsive */}
                <div className="bg-white p-3 rounded-md mb-6 flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-4">

                    <div className="flex w-full sm:w-auto gap-2">
                        <input
                            type="text"
                            value={search}
                            placeholder="Search..."
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-white border border-gray-200 rounded-md px-4 py-2 text-xs w-full sm:w-64"
                        />
                        <button 
                            onClick={handleSearch}
                            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-xs whitespace-nowrap"
                        >
                            Search
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">

                        <select
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="bg-white border rounded-md px-3 py-2 text-xs w-full sm:w-auto"
                        >
                            <option value="">All Months</option>
                            {months.map((m) => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>

                        <select
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            className="bg-white border rounded-md px-3 py-2 text-xs w-full sm:w-auto"
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

                {/* 🧾 TABLE */}
                {loading ? (
                    <div className="w-full h-40 flex justify-center items-center">
                        <CircularLoading customClass="w-6 h-6 text-blue-500" />
                    </div>
                ) : donations.length === 0 ? (
                    <p className="text-center text-sm text-gray-500">No donations found.</p>
                ) : (
                    <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
                        <table className="w-full min-w-[900px] text-sm border-collapse">
                            <thead className="bg-orange-500 text-white text-xs">
                                <tr>
                                    <th className="py-2 px-3 text-left">Date</th>
                                    <th className="py-2 px-3 text-left">Name</th>
                                    <th className="py-2 px-3 text-left">Description</th>
                                    <th className="py-2 px-3 text-left">Email</th>
                                    <th className="py-2 px-3 text-left">Type</th>
                                    <th className="py-2 px-3 text-left">Address</th>
                                    <th className="py-2 px-3 text-left">Status</th>
                                    <th className="py-2 px-3 text-left">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {donations.map((donation, index) => (
                                    <tr key={donation.id} className="border-b border-gray-100 hover:bg-gray-50 text-xs">

                                        <td className="p-2">
                                            {donation.created_at
                                                ? new Date(donation.created_at).toLocaleDateString("en-US", {
                                                    year: "numeric", month: "long", day: "numeric"
                                                })
                                                : ""}
                                        </td>

                                        <td className="p-2">
                                            {donation.name || (
                                                <span className="px-2 py-1 rounded bg-gray-100 text-gray-600">Anonymous</span>
                                            )}
                                        </td>

                                        <td className="p-2">{donation.description || ""}</td>
                                        <td className="p-2">{donation.email || ""}</td>

                                        <td className="p-2">
                                            {donation.type?.map((type, idx) => (
                                                <span
                                                    key={idx}
                                                    className={`inline-block px-2 py-1 rounded text-[11px] mr-1 text-blue-600 bg-blue-50`}
                                                >
                                                    {type}
                                                </span>
                                            ))}
                                        </td>

                                        <td className="p-2">{donation.address || ""}</td>

                                        <td className="p-2 capitalize">
                                            {donation.status === "approved" ? (
                                                <span className="text-green-600 font-medium">Received</span>
                                            ) : (
                                                <span className="text-yellow-600 font-medium">Pending</span>
                                            )}
                                        </td>

                                        <td className="p-2 text-center">
                                            <div className="flex items-center gap-2">
                                                {donation.status !== "approved" && (
                                                    <button
                                                        onClick={() => setToBeApproved(donation.id)}
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

            {/* CONFIRMATION MODAL */}
            {toBeApproved && (
                <ConfirmationAlert
                    onClose={() => setToBeApproved(null)}
                    onConfirm={() => approveDonation(toBeApproved)}
                    title="Approve Donation"
                    message="Are you sure you want to approve this donation?"
                />
            )}

            {/* SUCCESS MESSAGE */}
            {success && (
                <SuccesAlert
                    message="Donation approved successfully."
                    onClose={() => setSuccess(false)}
                />
            )}

            {/* 📊 REPORT MODAL */}
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
                                                onChange={(e) => setDateFrom(e.target.value)}
                                                className="bg-white text-xs px-3 py-1.5 border border-gray-200 rounded"
                                            />
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <label className="text-xs">To</label>
                                            <input 
                                                type="date"
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
                                    className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded whitespace-nowrap"
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
                                                                    className={`inline-block px-2 py-1 rounded text-[11px] mr-1 ${
                                                                        type === "food"
                                                                            ? "text-green-600 bg-green-50"
                                                                            : type === "clothes"
                                                                            ? "text-blue-600 bg-blue-50"
                                                                            : "text-pink-600 bg-pink-50"
                                                                    }`}
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

export default GoodsDonationsAdmin;

