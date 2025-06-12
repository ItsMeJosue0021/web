import Admin from "../../layouts/Admin";
import { useState, useEffect, useRef } from "react";
import { Edit, Trash2, SlidersHorizontal, Search, X } from "lucide-react";
import { _get, _delete, _post } from "../../api"; 
import { toast } from "react-toastify";
import ConfirmationAlert from "../../components/alerts/ConfirmationAlert";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "../../components/Logo";
import html2pdf from 'html2pdf.js';

const Donations = () => {

    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [openProof, setOpenProof] = useState(false);
    const [proofImage, setProofImage] = useState("");
    const [selectedPayment, setSelectedPayment] = useState('');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [amount, setAmount] = useState('');
    const [reference, setReference] = useState('');
    const [proof, setProof] = useState(null);
    const [address, setAddress] = useState('Main Address');
    const [addressType, setAddressType] = useState('main');
    const [errors, setErrors] = useState({});
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const [toBeEdited, setToBeEdited] = useState(null);
    const [openEdtitModal, setOpenEditModal] = useState(false);

    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    const currentYear = currentDate.getFullYear().toString();

    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [searchTerm, setSearchTerm] = useState('');

    const [isReportView, setIsReportView] = useState(false);

    // reports
    const [cashDonations, setCashDonations] = useState([]);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);

    const baseURL = "https://api.kalingangkababaihan.com/storage/";

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchDonations({
                month: selectedMonth,
                year: selectedYear,
                name: searchTerm
            });
        }, 500); // 500ms delay

        return () => clearTimeout(delayDebounce);
    }, [selectedMonth, selectedYear, searchTerm]);

    useEffect(() => {
        fetchCashDonations();
    }, []);

    const handleFilterCashDonations = async () => {
        fetchCashDonations({
            dateFrom: dateFrom,
            dateTo: dateTo
        });
    }

    const fetchCashDonations = async (filters = {}) => {
        try {
            const query = new URLSearchParams(filters).toString();
            const url = query ? `/reports/cash-donations?${query}` : `/reports/cash-donations`;

            const response = await _get(url);
            setCashDonations(response.data.donations);
            setTotalAmount(response.data.totalAmount);
            setTotalCount(response.data.totalCount);
        } catch (error) {
            console.log(error);
        }
    }

    const fetchDonations = async (filters = {}) => {
        try {
            // Construct query string if filters exist
            const query = new URLSearchParams(filters).toString();
            const url = query ? `/donations?${query}` : `/donations`;

            const response = await _get(url);
            setDonations(response.data);
        } catch (error) {
            console.error('Error fetching donations:', error);
        } finally {
            setLoading(false);
        }
    };


    const handleConfirmDelete = (id) => {
        setIsDeleteOpen(true);
        setDeleteId(id);
    }

    const handleDelete = async (id) => {
        setIsDeleting(true);
        try {
            const response = await _delete(`/donations/${id}`);
            if (response.status === 200) {
                toast.success("Donation record deleted successfully.");
            }
        } catch (error) {
            toast.error("Error deleting donation record.");
            console.log(error);
        } finally
        {
            setIsDeleting(false);
            setIsDeleteOpen(false);
            fetchDonations({
                month: selectedMonth,
                year: selectedYear,
                name: searchTerm,
            });

        }
    }

    const handleViewProof = (imageUrl) => {
        setProofImage(imageUrl);    
        setOpenProof(true);
    }


    const clearForm = () => {
        setName('');
        setEmail('');
        setAmount('');
        setReference('');
        setProof(null);
    };

    const handleEdit = (donation) => {
        setErrors({});
        setLoadingSubmit(false);
        setToBeEdited(donation);
        setOpenEditModal(true);

        setSelectedPayment(donation.type || '');
        setName(donation.name || '');
        setEmail(donation.email || '');
        setAmount(donation.amount || '');
        setReference(donation.reference || '');
    }

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setLoadingSubmit(true);

        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('type', selectedPayment);
        formData.append('name', name);
        formData.append('email', email);
        formData.append('amount', amount);
        formData.append('address', address);

        if (selectedPayment === 'gcash') {
            formData.append('reference', reference);
            if (proof) formData.append('proof', proof);
        }

        console.log('Form Data:', 
            {
                type: formData.get('type'),
                name: formData.get('name'),
                email: formData.get('email'),
                amount: formData.get('amount'),
                address: formData.get('address'),
                reference: formData.get('reference'),
                proof: formData.get('proof'),
            }
        );

        try {
            const response = await _post(`/donations/${toBeEdited.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response.status === 200) {
                toast.success("Donation details has been updated!");
                fetchDonations();   
                clearForm();
                setOpenEditModal(false);
                setToBeEdited(null);
            } else {
                toast.error("Something went wrong while trying to update donation record.");
            }            
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
                toast.error(error.response.data.message || 'Validation failed.');
            } else {
                toast.error('Something went wrong. Please try again.');
                console.error('Error submitting donation:', error);
            }
        } finally {
            setLoadingSubmit(false);
        }
    }

    const containerRef = useRef();
    const printBtnRef = useRef();


    const handlePrint = () => {
        const container = containerRef.current;
        const printBtn = printBtnRef.current;

        const opt = {
            margin: 0,
            filename: 'Cash_Donations_Report.pdf',
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        };

        html2pdf()
            .set(opt)
            .from(container)
            .outputPdf('blob') 
            .then((pdfBlob) => {
                const blobUrl = URL.createObjectURL(pdfBlob);
                window.open(blobUrl);
            });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);

        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const monthName = months[date.getMonth()];
        const day = date.getDate();
        const year = date.getFullYear();

        return `${monthName} ${day}, ${year}`;
    };

    const formatDate2 = (dateString) => {
        if (!dateString) return '';

        // Get only the date part, ignore the time
        const [year, month, day] = dateString.split('T')[0].split('-');

        // Convert month number to full month name
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        return `${monthNames[parseInt(month, 10) - 1]} ${parseInt(day, 10)}, ${year}`;
    };

    const header = { 
        title: "Donations Management",
        subTitle: "Easily manage incoming donations — add new entries, view donor details, or update donation records with ease."
    };

    const breadcrumbs = [
        { name: "Donations", link: "/donations" }
    ];

    return (
        <Admin header={header} breadcrumbs={breadcrumbs}>
            <div className="w-full mx-auto flex flex-col gap-4">
                <div className="flex items-center justify-between bg-white border-gray-100 p-3 rounded-lg">
                    <div className="w-full min-w-80 max-w-[500px] flex items-center gap-2">
                        <label className="text-xs">
                            <Search size={30} className="text-white bg-orange-500 p-1.5 rounded"/>
                        </label>
                        <input
                            type="text"
                            className="placeholder:text-xs px-4 py-1.5 rounded border border-gray-200 text-xs"
                            placeholder="Type something.."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button onClick={() => setIsReportView(true)} className="text-xs text-white bg-blue-500 px-3 py-1.5 rounded">Generate Report</button>
                    </div>
                    <div className="flex gap-2 items-center">
                        <label className="text-xs">
                            <SlidersHorizontal size={30} className="text-white bg-orange-500 p-1.5 rounded"/>
                        </label>
                        <div>
                            <select
                            className="text-[10px] px-3 py-2 border border-gray-300 rounded"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            >
                            <option value="">All Months</option>
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i + 1} value={new Date(0, i).toLocaleString('default', { month: 'long' })}>
                                    {new Date(0, i).toLocaleString('default', { month: 'long' })}
                                </option>
                            ))}
                            </select>
                        </div>

                        <div>
                           <select
                                className="text-[10px] px-3 py-2 border border-gray-300 rounded"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                            >
                                <option value="">All Years</option>
                                {Array.from({ length: 26 }, (_, i) => 2000 + i).map(year => (
                                <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                

                <table className="w-full border rounded-lg overflow-hidden shadow bg-white text-xs">
                    <thead className="bg-orange-500 text-white">
                    <tr>
                        <th className="p-3 text-start">Date of Donation</th>
                        <th className="p-3 text-start">Donor</th>
                        <th className="p-3 text-start">Amount</th>
                        <th className="p-3 text-start">Reference No.</th>
                        <th className="p-3 text-start">Email</th>
                        <th className="p-3 text-start">Proof</th>
                        {/* <th className="p-3 text-end">Actions</th> */}
                    </tr>
                    </thead>
                    <tbody>
                        {donations.length <= 0 && (
                            <tr className="p-3">
                                <td colSpan={7} className="p-3 text-center">
                                    No Records Found
                                </td>
                            </tr>
                        )}
                        {donations.map((donation, index) => (
                            <tr key={donation.id} className={`${index % 2 === 0 ? "bg-orange-50" : ""}`}>
                                <td className="p-3">
                                    {donation.created_at
                                        ? new Date(donation.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            timeZone: 'UTC'
                                        })
                                        : ''}
                                </td>
                                <td className="p-3">
                                    {donation.name || <span className="p-1 px-2 rounded bg-blue-100 text-blue-600 text-[10px]">Anonymous</span>}
                                </td>
                                <td className="p-3">₱{donation.amount || '0.00'}</td>
                                <td className="p-3">{donation.reference || ''}</td>
                                <td className="p-3">{donation.email || ''}</td>
                                <td className="p-3">
                                    {donation.type === 'gcash' && (
                                        <button onClick={() => handleViewProof(donation.proof)} className="text-[10px] px-2 py-1 bg-blue-500 text-white rounded">View</button>
                                    )}
                                </td>
                                {/* <td className="p-3 h-full flex items-center justify-end gap-2">
                                    <button onClick={() => handleEdit(donation)} className="bg-blue-50 text-blue-600 px-1 py-1 rounded"><Edit size={16} /></button>
                                    <button onClick={() => handleConfirmDelete(donation.id)} className="bg-red-50 text-red-600 px-1 py-1 rounded" ><Trash2 size={16} /></button>
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {loading && (
                        <div className="w-full h-36 flex items-center text-xs justify-center">
                            <div className="self-start h-full px-3 py-2 text-sm">
                                <div className="h-full flex items-center space-x-1">
                                    <div className="dot dot-1 w-1 h-1 bg-orange-700 rounded-full"></div>
                                    <div className="dot dot-2 w-1 h-1 bg-orange-700 rounded-full"></div>
                                    <div className="dot dot-3 w-1 h-1 bg-orange-700 rounded-full"></div>
                                    <div className="dot dot-4 w-1 h-1 bg-orange-700 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    )}
            </div>

            {openProof && (
                <div onClick={() => setOpenProof(false)} className="fixed top-0 left-0 w-full h-screen bg-black/10 z-50 flex items-center justify-center">
                    <div className="bg-white rounded h-[500px] max-h-[500px] w-[400px] max-w-[400px]">
                        <img src={`${baseURL}${proofImage}`} alt="img" className="w-full h-full rounded object-cover object-center"/>
                    </div>
                </div>
            )}
            

            {isDeleteOpen && (
                <ConfirmationAlert 
                onClose={() => setIsDeleteOpen(false)} 
                onConfirm={() => handleDelete(deleteId)}
                title="Delete Donation Record"
                message="Are you sure you want to delete this donation record? This action cannot be undone."
                isDelete={true}
                isDeleting={isDeleting}
                />
            )}

            {openEdtitModal && toBeEdited && (
                <div className="fixed top-0 left-0 w-full h-full bg-black/10 z-50 flex items-center justify-center">
                    <form className="w-[500px] rounded-xl pb-5 p-8 bg-white ">
                        <div className="w-full flex flex-col items-start justify-start gap-3">
                            <div className="w-full flex items-center justify-between gap-4">
                                <label className="w-[40%] text-xs font-medium">Name <span className="text-[9px] text-gray-500">(Optional)</span></label>
                                <input type="text" name="name" className="w-[60%] px-4 py-2 rounded-md border border-gray-200 text-xs bg-transparent"
                                value={name} onChange={(e) => setName(e.target.value)} />
                            </div>

                            <div className="w-full flex items-center justify-between gap-4">
                                <label className="w-[40%] text-xs font-medium">Email <span className="text-[9px] text-gray-500">(Optional)</span></label>
                                <input type="email" name="email" className="w-[60%] px-4 py-2 rounded-md border border-gray-200 text-xs bg-transparent"
                                value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>

                            <div className="w-full">
                                <div className="w-full flex items-center justify-between gap-4">
                                    <label className="w-[40%] text-xs font-medium">Amount <span className="text-xs text-red-500">*</span></label>
                                    <input type="number" name="amount" className="w-[60%] px-4 py-2 rounded-md border border-gray-200 text-xs bg-transparent"
                                    value={amount} onChange={(e) => setAmount(e.target.value)} />
                                </div>
                                {errors.amount && <p className="text-[10px] text-red-500">{errors.amount[0]}</p>}
                            </div>

                            {selectedPayment === 'gcash' && (
                                <div className="w-full flex flex-col items-start justify-start gap-4">
                                    <div className="w-full">
                                        <div className="w-full flex items-center justify-between gap-4">
                                            <label className="w-[40%] text-xs font-medium">Reference/Transaction No. <span className="text-xs text-red-500">*</span></label>
                                            <input type="text" name="reference" className="w-[60%] px-4 py-2 rounded-md border border-gray-200 text-xs bg-transparent"
                                            value={reference} onChange={(e) => setReference(e.target.value)} />
                                        </div>
                                        {errors.reference && <p className="text-[10px] text-red-500">{errors.reference[0]}</p>}
                                    </div>
                                    <div className="w-full">
                                        <div className="w-full flex items-center justify-between gap-4">
                                            <label className="w-[40%] text-xs font-medium">Proof of Donation</label>
                                            <input type="file" name="proof" className="w-[60%] px-4 py-2 rounded-md border border-gray-200 text-xs bg-transparent"
                                            onChange={(e) => setProof(e.target.files[0])} />
                                        </div>
                                        {errors.proof && <p className="text-[10px] text-red-500">{errors.proof[0]}</p>}
                                    </div>
                                </div>
                            )}
                            
                            <div className="w-full flex items-center justify-end gap-2">
                                <p onClick={() => setOpenEditModal(false

                                )} className="cursor-pointer w-fit text-xs px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors duration-300 border-0">
                                    Cancel
                                </p>
                                <button onClick={handleEditSubmit} className="w-fit text-xs px-4 py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white transition-colors duration-300 border-0">
                                    {loadingSubmit ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {isReportView && (
                <AnimatePresence>
                    <motion.div 
                        role="alert"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed top-0 left-0 w-full h-full min-h-screen z-50 bg-white flex items-center justify-center overflow-auto p-5">
                        <div className="w-full h-full overflow-auto p-5">
                            <div className="w-full flex justify-end">
                                <X onClick={() => setIsReportView(false)} size={18} className="text-gray-500 hover:text-gray-700 cursor-pointer"/>
                            </div>

                            <div className="w-full max-w-[800px] p-4 px-0 mx-auto mt-5 mb-3 flex items-start justify-between">
                                <div className="">
                                    <span className="text-sm font-semibold ">Filter Donations</span>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <label className="text-xs">From</label>
                                            <input onChange={(e) => setDateFrom(e.target.value)} type="date" className="w-fit text-xs px-3 py-1.5 border border-gray-200 rounded "/>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <label className="text-xs">To</label>
                                            <input onChange={(e) => setDateTo(e.target.value)} type="date" className="w-fit text-xs px-3 py-1.5 border border-gray-200 rounded"/>
                                        </div>
                                        <button onClick={handleFilterCashDonations} className="text-xs text-white bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded">Go</button>
                                    </div>
                                </div>
                                <button onClick={handlePrint} ref={printBtnRef} className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded">Print</button>
                            </div>

                            {/* <div ref={containerRef} className="w-full max-w-[800px] p-10 mx-auto shadow">
                                <div>
                                    <Logo />
                                    <div className="w-full flex flex-col items-center justify-center mt-5">
                                        <p className="font-bold">Cash Donations Report</p>
                                        <p className="text-xs text-gray-600">From <span>June 1, 2025</span> to  <span>June 30, 2025</span></p>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <table className="w-full overflow-hidden bg-white text-xs">
                                        <thead className="bg-gray-200 ">
                                            <tr>
                                                <th className="p-3 text-start">Date</th>
                                                <th className="p-3 text-start">Donor</th>
                                                <th className="p-3 text-start">Amount</th>
                                                <th className="p-3 text-start">Reference No.</th>
                                                <th className="p-3 text-start">Email</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cashDonations.length <= 0 && (
                                                <tr className="p-3">
                                                    <td colSpan={7} className="p-3 text-center">
                                                        No Records Found
                                                    </td>
                                                </tr>
                                            )}
                                            {cashDonations.map((donation, index) => (
                                                <tr key={donation.id} className={`${index % 2 === 0 ? "bg-gray-50" : ""} text-[11px]`}>
                                                    <td className="p-3">
                                                    {donation.created_at
                                                        ? new Date(donation.created_at).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        })
                                                        : ''}
                                                    </td>
                                                    <td className="p-3">
                                                        {donation.name || 'Anonymous'}
                                                    </td>
                                                    <td className="p-3">{donation.amount || ''}</td>
                                                    <td className="p-3">{donation.reference || 'N/A'}</td>
                                                    <td className="p-3">{donation.email || ''}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div> */}

                            <div ref={containerRef} className="w-full max-w-[800px] p-10 mx-auto shadow print:p-0">
                                {/* REPEATED HEADER FOR PRINT */}
                                <div className="print-header">
                                    <Logo />
                                    <div className="w-full flex flex-col items-center justify-center mt-5">
                                    <p className="font-bold">Cash Donations Report</p>
                                    <p className="text-xs text-gray-600">
                                        From <span>{dateFrom ? formatDate(dateFrom) : '--date--'}</span> to <span>{dateTo ? formatDate(dateTo) : '--date--'}</span>
                                    </p>
                                    </div>
                                </div>

                                <div className="w-full flex items-center gap-5 mt-6">
                                    <p className="text-xs font-medium">Total Amount: <span>₱{totalAmount || '0.00'}</span></p>
                                    <p className="text-xs font-medium">Total Count: <span>{totalCount}</span></p>
                                </div>

                                {/* TABLE */}
                                <div className="mt-2">
                                    <table className="w-full overflow-hidden bg-white text-xs">
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
                                            <tr key={donation.id} className={`${index % 2 === 0 ? "bg-gray-50" : ""} text-[11px]`}>
                                                <td className="p-3">
                                                    {donation.created_at
                                                        ? new Date(donation.created_at).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                            timeZone: 'UTC'
                                                        })
                                                        : ''}
                                                </td>
                                                <td className="p-3">{donation.name || 'Anonymous'}</td>
                                                <td className="p-3">₱{donation.amount || '0.00'}</td>
                                                <td className="p-3">{donation.reference || 'N/A'}</td>
                                                <td className="p-3">{donation.email || ''}</td>
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
    )
}

export default Donations;