// import { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { _get, _put } from "../../../api";
// import Admin from "../../../layouts/Admin"; 
// import Logo from "../../../components/Logo";
// import { AnimatePresence, motion } from "framer-motion";
// import CircularLoading from "../../../components/CircularLoading";
// import ConfirmationAlert from "../../../components/alerts/ConfirmationAlert";
// import SuccesAlert from "../../../components/alerts/SuccesAlert";
// import { X } from "lucide-react";
// import html2pdf from 'html2pdf.js';
// import { set } from "lodash";

// const CashDonationsAdmin = () => {
//     const [donations, setDonations] = useState([]);
//     const [search, setSearch] = useState("");
//     const [year, setYear] = useState("");
//     const [month, setMonth] = useState("");
//     const [loading, setLoading] = useState(true);
//     const [toBeApproved, setToBeApproved] = useState(null);
//     const [success, setSuccess] = useState(false);

//     // reports
//     const [isReportView, setIsReportView] = useState(false);
//     const [cashDonations, setCashDonations] = useState([]);
//     const [dateFrom, setDateFrom] = useState('');
//     const [dateTo, setDateTo] = useState('');
//     const [totalAmount, setTotalAmount] = useState(0);
//     const [totalCount, setTotalCount] = useState(0);

//     const months = [
//         "January","February","March","April","May","June",
//         "July","August","September","October","November","December",
//     ];

//     const containerRef = useRef();
//     const printBtnRef = useRef();

//     const fetchCashDonations = async (dateFrom = "", dateTo = "") => {
//         try {
//             const params = {};
//             if (dateFrom) params.dateFrom = dateFrom;
//             if (dateTo) params.dateTo = dateTo;

//             const response = await _get("/cash-donations/v2/print", { params });
            
//             setCashDonations(response.data.donations);

//             return response.data;
//         } catch (error) {
//             console.error("Error fetching cash donations:", error);
//         }
//     };

//     const handleFilterCashDonations = async () => {
//         fetchCashDonations(dateFrom, dateTo);
//     }


//     const handlePrint = () => {
//         const container = containerRef.current;
//         const printBtn = printBtnRef.current;

//         const opt = {
//             margin: 0,
//             filename: 'Cash_Donations_Report.pdf',
//             html2canvas: { scale: 2 },
//             jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
//         };

//         html2pdf()
//             .set(opt)
//             .from(container)
//             .outputPdf('blob') 
//             .then((pdfBlob) => {
//                 const blobUrl = URL.createObjectURL(pdfBlob);
//                 window.open(blobUrl);
//             });
//     };

//     const formatDate = (dateString) => {
//         const date = new Date(dateString);

//         const months = [
//             'January', 'February', 'March', 'April', 'May', 'June',
//             'July', 'August', 'September', 'October', 'November', 'December'
//         ];

//         const monthName = months[date.getMonth()];
//         const day = date.getDate();
//         const year = date.getFullYear();

//         return `${monthName} ${day}, ${year}`;
//     };

//     const fetchDonations = async () => {
//         setLoading(true);
//         try {
//         const params = {};
//         if (year) params.year = year;
//         if (month) params.month = month;

//         const response = await _get("/cash-donations/filter", { params });
//         setDonations(response.data);
//         setCashDonations(response.data); // for reports
//         } catch (error) {
//         console.error("Error fetching donations:", error);
//         } finally {
//         setLoading(false);
//         }
//     };

//     const handleSearch = async () => {
//         if (!search.trim()) return fetchDonations();
//         setLoading(true);
//         try {
//         const response = await _get(`/cash-donations/search?q=${search}`);
//         setDonations(response.data);
//         } catch (error) {
//         console.error("Search error:", error);
//         } finally {
//         setLoading(false);
//         }
//     };

//     const approveDonation = async (id) => {
//         try {
//             const response = await _put(`/cash-donations/v2/${id}/approve`);
//             fetchDonations();
//             if (toBeApproved) setToBeApproved(null);
//             if (response.status === 200) {
//                 setSuccess(true);
//             }
//         } catch (error) {
//             console.error("Error approving donation:", error);
//         }
//     };

//     const generateReport = async () => {
//         try {
//         const params = {};
//         if (year) params.year = year;
//         if (month) params.month = month;

//         const response = await axios.get("/reports/cash-donations", {
//             params,
//             responseType: "blob",
//         });

//         const url = window.URL.createObjectURL(new Blob([response.data]));
//         const link = document.createElement("a");
//         link.href = url;
//         link.setAttribute("download", "cash_donations_report.pdf");
//         document.body.appendChild(link);
//         link.click();
//         } catch (error) {
//         console.error("Error generating report:", error);
//         }
//     };

//     useEffect(() => {
//         fetchDonations();
//     }, [year, month]);

//     const header = { 
//         title: "Cash Donations Management",
//         subTitle: "Easily manage incoming Cash donations — view donor details, or print records with ease."
//     };

//     const breadcrumbs = [
//         { name: "Donations", link: "/donations" }
//         , { name: "Cash", link: "/donations/cash" }
//     ];

//     return (
//         <Admin header={header} breadcrumbs={breadcrumbs}>
//             <div className="p-1 bg-gray-50 min-h-screen ">
//                 <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 bg-white p-3 rounded-md">
//                     <div className="flex gap-2 items-center">
//                         <input
//                             type="text"
//                             placeholder="Search..."
//                             value={search}
//                             onChange={(e) => setSearch(e.target.value)}
//                             className="border border-gray-200 rounded-md px-4 py-2 text-xs w-64"
//                         />
//                         <button
//                             onClick={handleSearch}
//                             className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-xs"
//                         >
//                             Search
//                         </button>
//                     </div>

//                     <div className="flex gap-2 items-center">
//                         <select
//                             value={month}
//                             onChange={(e) => setMonth(e.target.value)}
//                             className="border rounded-md px-3 py-2 text-xs"
//                         >
//                             <option value="">All Months</option>
//                             {months.map((m) => (
//                             <option key={m} value={m}>{m}</option>
//                             ))}
//                         </select>

//                         <select
//                             value={year}
//                             onChange={(e) => setYear(e.target.value)}
//                             className="border rounded-md px-3 py-2 text-xs"
//                         >
//                             <option value="">All Years</option>
//                             {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((y) => (
//                             <option key={y} value={y}>{y}</option>
//                             ))}
//                         </select>

//                         <button
//                             onClick={() => setIsReportView(true)}
//                             className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-md text-xs"
//                         >
//                             Generate Report
//                         </button>
//                     </div>
//                 </div>

//             {loading ? (
//                     <div className="w-full h-40 flex items-center justify-center">
//                         <CircularLoading customClass='w-full text-blue-500 w-6 h-6' />
//                     </div>
//                 ) : donations.length === 0 ? (
//                     <p className="h-40 w-full flex items-center justify-center text-center text-sm text-gray-500">No donations found.</p>
//                 ) : (
//                     <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
//                         <table className="w-full text-sm text-left border-collapse">
//                             <thead className="bg-orange-500 text-white">
//                             <tr>
//                                 <th className="p-2 px-3">Tracking #</th>
//                                 <th className="p-2 px-3">Name</th>
//                                 <th className="p-2 px-3">Email</th>
//                                 <th className="p-2 px-3">Amount</th>
//                                 <th className="p-2 px-3">Date</th>
//                                 <th className="p-2 px-3">Address</th>
//                                 <th className="p-2 px-3">Status</th>
//                                 <th className="p-2 px-3 text-center">Action</th>
//                             </tr>
//                             </thead>
//                             <tbody>
//                             {donations.map((donation) => (
//                                 <tr key={donation.id} className="border-b border-gray-100 hover:bg-gray-50 text-xs">
//                                     <td className="p-3 px-3">{donation.donation_tracking_number}</td>
//                                     <td className="p-2 px-3">{donation.name || "N/A"}</td>
//                                     <td className="p-2 px-3">{donation.email || "N/A"}</td>
//                                     <td className="p-2 px-3">₱{donation.amount}</td>
//                                     <td className="p-2 px-3">
//                                         {donation.month} {donation.year}
//                                     </td>
//                                     <td className="p-2 px-3">{donation.drop_off_address}</td>
//                                     <td className="p-2 px-3 capitalize">
//                                         {donation.status === "approved" ? (
//                                         <span className="text-green-600 font-medium">Recieved</span>
//                                         ) : (
//                                         <span className="text-yellow-600 font-medium">Pending</span>
//                                         )}
//                                     </td>
//                                     <td className="p-2 px-3 text-center">
//                                         {donation.status !== "approved" && (
//                                         <button
//                                             onClick={() => setToBeApproved(donation.id)}
//                                             className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
//                                         >
//                                             Confirm
//                                         </button>
//                                         )}
//                                     </td>
//                                 </tr>
//                             ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 )}
//             </div>
//             {toBeApproved && (
//                 <ConfirmationAlert
//                     onClose={() => setToBeApproved(null)}
//                     onConfirm={() => approveDonation(toBeApproved)}
//                     title="Approve Donation"
//                     message="Are you sure you want to approve this donation?"
//                     isDelete={false}
//                     isDeleting={false}
//                 />
//             )}

//             {success && (
//                 <SuccesAlert
//                     message="Donation approved successfully."
//                     onClose={() => setSuccess(false)}
//                 />
//             )}

//             {isReportView && (
//                 <AnimatePresence>
//                     <motion.div 
//                         role="alert"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                         className="fixed top-0 left-0 w-full h-full min-h-screen z-50 bg-white flex items-center justify-center overflow-auto p-5">
//                         <div className="w-full h-full overflow-auto p-5">
//                             <div className="w-full flex justify-end">
//                                 <X onClick={() => setIsReportView(false)} size={18} className="text-gray-500 hover:text-gray-700 cursor-pointer"/>
//                             </div>

//                             <div className="w-full max-w-[800px] p-4 px-0 mx-auto mt-5 mb-3 flex items-start justify-between">
//                                 <div className="">
//                                     <span className="text-sm font-semibold ">Filter Donations</span>
//                                     <div className="flex items-center gap-4">
//                                         <div className="flex items-center gap-2">
//                                             <label className="text-xs">From</label>
//                                             <input onChange={(e) => setDateFrom(e.target.value)} type="date" className="w-fit text-xs px-3 py-1.5 border border-gray-200 rounded "/>
//                                         </div>
//                                         <div className="flex items-center gap-2">
//                                             <label className="text-xs">To</label>
//                                             <input onChange={(e) => setDateTo(e.target.value)} type="date" className="w-fit text-xs px-3 py-1.5 border border-gray-200 rounded"/>
//                                         </div>
//                                         <button onClick={handleFilterCashDonations} className="text-xs text-white bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded">Go</button>
//                                     </div>
//                                 </div>
//                                 <button onClick={handlePrint} ref={printBtnRef} className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded">Print</button>
//                             </div>

//                             <div ref={containerRef} className="w-full max-w-[800px] p-10 mx-auto shadow print:p-0">
//                                 {/* REPEATED HEADER FOR PRINT */}
//                                 <div className="print-header">
//                                     <Logo />
//                                     <div className="w-full flex flex-col items-center justify-center mt-5">
//                                     <p className="font-bold">Cash Donations Report</p>
//                                     <p className="text-xs text-gray-600">
//                                         From <span>{dateFrom ? formatDate(dateFrom) : '--date--'}</span> to <span>{dateTo ? formatDate(dateTo) : '--date--'}</span>
//                                     </p>
//                                     </div>
//                                 </div>

//                                 <div className="w-full flex items-center gap-5 mt-6">
//                                     <p className="text-xs font-medium">Total Amount: <span>₱{totalAmount || '0.00'}</span></p>
//                                     <p className="text-xs font-medium">Total Count: <span>{totalCount}</span></p>
//                                 </div>

//                                 {/* TABLE */}
//                                 <div className="mt-2">
//                                     <table className="w-full overflow-hidden bg-white text-xs">
//                                     <thead className="bg-gray-200">
//                                         <tr>
//                                         <th className="p-3 text-start">Date</th>
//                                         <th className="p-3 text-start">Donor</th>
//                                         <th className="p-3 text-start">Amount</th>
//                                         <th className="p-3 text-start">Tracking No.</th>
//                                         <th className="p-3 text-start">Email</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {cashDonations.length === 0 && (
//                                         <tr>
//                                             <td colSpan={5} className="p-3 text-center">
//                                             No Records Found
//                                             </td>
//                                         </tr>
//                                         )}
//                                         {cashDonations.map((donation, index) => (
//                                             <tr key={donation.id} className={`${index % 2 === 0 ? "bg-gray-50" : ""} text-[11px]`}>
//                                                 <td className="p-3">
//                                                     {donation.created_at
//                                                         ? new Date(donation.created_at).toLocaleDateString('en-US', {
//                                                             year: 'numeric',
//                                                             month: 'long',
//                                                             day: 'numeric',
//                                                             timeZone: 'UTC'
//                                                         })
//                                                         : ''}
//                                                 </td>
//                                                 <td className="p-3">{donation.name || 'Anonymous'}</td>
//                                                 <td className="p-3">₱{donation.amount || '0.00'}</td>
//                                                 <td className="p-3">{donation.donation_tracking_number || 'N/A'}</td>
//                                                 <td className="p-3">{donation.email || ''}</td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                     </table>
//                                 </div>
//                             </div>
//                         </div>
//                     </motion.div>
//                 </AnimatePresence>
//             )}
//         </Admin>
//     );
//     };

// export default CashDonationsAdmin;

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

const CashDonationsAdmin = () => {

    const [donations, setDonations] = useState([]);
    const [search, setSearch] = useState("");
    const [year, setYear] = useState("");
    const [month, setMonth] = useState("");
    const [loading, setLoading] = useState(true);
    const [toBeApproved, setToBeApproved] = useState(null);
    const [success, setSuccess] = useState(false);

    // report
    const [isReportView, setIsReportView] = useState(false);
    const [cashDonations, setCashDonations] = useState([]);
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);

    const months = [
        "January","February","March","April","May","June",
        "July","August","September","October","November","December"
    ];

    const containerRef = useRef();
    const printBtnRef = useRef();

    const fetchCashDonations = async (dateFrom = "", dateTo = "") => {
        try {
            const params = {};
            if (dateFrom) params.dateFrom = dateFrom;
            if (dateTo) params.dateTo = dateTo;

            const response = await _get("/cash-donations/v2/print", { params });

            setCashDonations(response.data.donations);

            return response.data;
        } catch (error) {
            console.error("Error fetching cash donations:", error);
        }
    };

    const handleFilterCashDonations = async () => {
        fetchCashDonations(dateFrom, dateTo);
    };

    const handlePrint = () => {
        const container = containerRef.current;

        const opt = {
            margin: 0,
            filename: 'Cash_Donations_Report.pdf',
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        };

        html2pdf().set(opt).from(container).save();
    };

    const fetchDonations = async () => {
        setLoading(true);
        try {
            const params = {};
            if (year) params.year = year;
            if (month) params.month = month;

            const response = await _get("/cash-donations/filter", { params });

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
            const response = await _get(`/cash-donations/search?q=${search}`);
            setDonations(response.data);
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setLoading(false);
        }
    };

    const approveDonation = async (id) => {
        try {
            const response = await _put(`/cash-donations/v2/${id}/approve`);
            fetchDonations();
            setToBeApproved(null);
            if (response.status === 200) {
                setSuccess(true);
            }
        } catch (error) {
            console.error("Error approving donation:", error);
        }
    };

    useEffect(() => {
        fetchDonations();
    }, [year, month]);

    const header = {
        title: "Cash Donations Management",
        subTitle: "Easily manage incoming Cash donations — view donor details, or print records with ease."
    };

    const breadcrumbs = [
        { name: "Donations", link: "/donations" },
        { name: "Cash", link: "/donations/cash" }
    ];

    return (
        <Admin header={header} breadcrumbs={breadcrumbs}>
            
            <div className="pt-4 bg-gray-50 min-h-screen">

                {/* SEARCH & FILTERS (FULLY RESPONSIVE) */}
                <div className="bg-white p-3 rounded-md mb-6 flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-4">

                    {/* SEARCH */}
                    <div className="flex w-full sm:w-auto gap-2">
                        <input 
                            type="text"
                            placeholder="Search..."
                            value={search}
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

                    {/* FILTERS */}
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

                {/* MAIN TABLE */}
                {loading ? (
                    <div className="w-full h-40 flex justify-center items-center">
                        <CircularLoading customClass="text-blue-500 w-6 h-6" />
                    </div>
                ) : donations.length === 0 ? (
                    <p className="text-center text-sm text-gray-500 mt-10">No donations found.</p>
                ) : (
                    <div className="overflow-x-auto rounded-lg shadow-sm bg-white">
                        <table className="w-full min-w-[900px] text-sm text-left border-collapse">
                            <thead className="bg-orange-500 text-white text-xs">
                                <tr>
                                    <th className="p-2 px-3">Tracking #</th>
                                    <th className="p-2 px-3">Name</th>
                                    <th className="p-2 px-3">Email</th>
                                    <th className="p-2 px-3">Amount</th>
                                    <th className="p-2 px-3">Date</th>
                                    <th className="p-2 px-3">Address</th>
                                    <th className="p-2 px-3">Status</th>
                                    <th className="p-2 px-3 text-center">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {donations.map(donation => (
                                    <tr key={donation.id} className="border-b border-gray-100 hover:bg-gray-50 text-xs">
                                        <td className="p-2 px-3">{donation.donation_tracking_number}</td>
                                        <td className="p-2 px-3">{donation.name || "N/A"}</td>
                                        <td className="p-2 px-3">{donation.email || "N/A"}</td>
                                        <td className="p-2 px-3">₱{donation.amount}</td>
                                        <td className="p-2 px-3">{donation.month} {donation.year}</td>
                                        <td className="p-2 px-3">{donation.drop_off_address}</td>
                                        <td className="p-2 px-3 capitalize">
                                            {donation.status === "approved"
                                                ? <span className="text-green-600 font-medium">Received</span>
                                                : <span className="text-yellow-600 font-medium">Pending</span>
                                            }
                                        </td>
                                        <td className="p-2 px-3 text-center">
                                            {donation.status !== "approved" && (
                                                <button 
                                                    onClick={() => setToBeApproved(donation.id)}
                                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
                                                >
                                                    Confirm
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

            </div>

            {/* APPROVAL MODAL */}
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

            {/* SUCCESS MODAL */}
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

                            {/* CLOSE */}
                            <div className="flex justify-end">
                                <X size={18} onClick={() => setIsReportView(false)} className="cursor-pointer text-gray-500" />
                            </div>

                            {/* FILTER BAR */}
                            <div className="w-full max-w-[800px] mx-auto mt-5 mb-3 flex flex-col md:flex-row justify-between gap-4">

                                <div>
                                    <span className="text-sm font-semibold">Filter Donations</span>

                                    <div className="flex flex-col sm:flex-row gap-3 mt-2">

                                        <div className="flex items-center gap-2">
                                            <label className="text-xs">From</label>
                                            <input 
                                                onChange={(e) => setDateFrom(e.target.value)}
                                                type="date"
                                                className="bg-white text-xs px-3 py-1.5 border border-gray-200 rounded"
                                            />
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <label className="text-xs">To</label>
                                            <input 
                                                onChange={(e) => setDateTo(e.target.value)}
                                                type="date"
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

                            {/* REPORT CONTAINER */}
                            <div ref={containerRef} className="w-full max-w-[800px] mx-auto p-5 shadow bg-white">

                                <Logo />

                                <div className="text-center mt-5">
                                    <p className="font-bold">Cash Donations Report</p>
                                    <p className="text-xs text-gray-600">
                                        From <span>{dateFrom || "--date--"}</span> to <span>{dateTo || "--date--"}</span>
                                    </p>
                                </div>

                                <div className="flex items-center gap-5 mt-6 text-xs font-medium">
                                    <p>Total Amount: ₱{totalAmount || "0.00"}</p>
                                    <p>Total Count: {totalCount}</p>
                                </div>

                                {/* REPORT TABLE – RESPONSIVE */}
                                <div className="mt-4 overflow-x-auto">
                                    <table className="w-full min-w-[700px] text-xs bg-white">
                                        <thead className="bg-gray-200">
                                            <tr>
                                                <th className="p-3 text-start">Date</th>
                                                <th className="p-3 text-start">Donor</th>
                                                <th className="p-3 text-start">Amount</th>
                                                <th className="p-3 text-start">Tracking No.</th>
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
                                                    <td className="p-3">₱{donation.amount}</td>
                                                    <td className="p-3">{donation.donation_tracking_number}</td>
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

export default CashDonationsAdmin;

