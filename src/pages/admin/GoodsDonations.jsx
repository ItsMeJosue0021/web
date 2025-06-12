import Admin from "../../layouts/Admin";
import { useState, useEffect, useRef } from "react";
import { Edit, Trash2, SlidersHorizontal, Search, X } from "lucide-react";
import { _get, _delete, _post, _put } from "../../api"; 
import ConfirmationAlert from "../../components/alerts/ConfirmationAlert";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "../../components/Logo";
import html2pdf from 'html2pdf.js';

const GoodsDonations = () => {

    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const [toBeEdited, setToBeEdited] = useState(null);
    const [openEdtitModal, setOpenEditModal] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [description, setDescription] = useState("");
    const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState({});
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    const currentYear = currentDate.getFullYear().toString();

    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [searchTerm, setSearchTerm] = useState('');

    // reports
    const [isReportView, setIsReportView] = useState(false);
    const [cashDonations, setCashDonations] = useState([]);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [totalCount, setTotalCount] = useState(0);

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
            const url = query ? `/reports/goods-donations?${query}` : `/reports/goods-donations`;

            const response = await _get(url);
            setCashDonations(response.data.donations);
            setTotalCount(response.data.totalCount);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchDonations({
                month: selectedMonth,
                year: selectedYear,
                name: searchTerm
            });
        }, 500); 

        return () => clearTimeout(delayDebounce);
    }, [selectedMonth, selectedYear, searchTerm]);


    const fetchDonations = async (filters = {}) => {
        try {

            const query = new URLSearchParams(filters).toString();
            const url = query ? `/goods-donations?${query}` : `/goods-donations`;

            const response = await _get(url);
            setDonations(response.data);
        } catch (error) {
            console.error('Error fetching donations:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleConfirmDelete = (id) => {
        setIsDeleteOpen(true);
        setDeleteId(id);
    }

    const handleDelete = async (id) => {
        setIsDeleting(true);
        try {
            const response = await _delete(`/goods-donations/${id}`);
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

    const handleCategoryChange = (e) => {
        const { value, checked } = e.target;
        setCategories((prev) =>
        checked ? [...prev, value] : prev.filter((cat) => cat !== value)
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoadingSubmit(true);

        const data = {
            name,
            description,
            type: categories,
            email,
        };

        try {
            const response = await _post(`/goods-donations/update/${toBeEdited.id}`, data);

            toast.success('Donation submitted successfully!');
            setName('');
            setDescription('');
            setCategories([]);
            fetchDonations();
        } catch (error) {
            setLoadingSubmit(false);
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
                toast.error(error.response.data.message || 'Validation failed.');
            } else {
                toast.error('Something went wrong. Please try again.');
                console.error('Error submitting donation:', error);
            }
        } finally {
            setLoadingSubmit(false);
            setOpenEditModal(false);
        }
    };

    const handleEdit = (donation) => {
        setOpenEditModal(true);
        setToBeEdited(donation);

        setName(donation.name || '');
        setEmail(donation.email || '');
        setDescription(donation.description || '');
        setCategories(donation.type || []);
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


    const header = { 
        title: "Goods Donations Management",
        subTitle: "Easily manage incoming goodonations — add new entries, view donor details, or update donation records with ease."
    };

    const breadcrumbs = [
        { name: "Goods Donations", link: "/goods-donations" }
    ];

    return (
        <Admin header={header} breadcrumbs={breadcrumbs}>
            <div className="w-full mx-auto flex flex-col gap-4">
                <div className="flex items-center justify-between bg-white border-gray-100 p-3 rounded-lg">
                    <div className="w-full min-w-80 max-w-[500px] flex items-center gap-2">
                        <label className="text-xs">
                            <Search size={30} className="text-white bg-blue-600 p-1.5 rounded"/>
                        </label>
                        <input
                            type="text"
                            className="placeholder:text-xs px-4 py-1.5 rounded border border-gray-200 text-sm"
                            placeholder="Type something.."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button onClick={() => setIsReportView(true)} className="text-xs text-white bg-blue-500 px-3 py-1.5 rounded">Generate Report</button>
                    </div>
                    <div className="flex gap-2 items-center">
                        <label className="text-xs">
                            <SlidersHorizontal size={30} className="text-white bg-blue-600 p-1.5 rounded"/>
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
                        <th className="p-3 text-start">Desciption</th>
                        <th className="p-3 text-start">Email</th>
                        <th className="p-3 text-start">Type of Donation</th>
                         <th className="p-3 text-start">Address</th>
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
                                {donation.name || <span className="p-1 px-2 rounded bg-gray-100 text-gray-600 text-[10px]">Anonymous</span>}
                            </td>
                            <td className="p-3">{donation.description || ''}</td>
                            <td className="p-3">{donation.email || ''}</td>
                            <td className="p-3">
                                {
                                    donation.type && donation.type.length > 0 && (
                                        donation.type.map((type, idx) => (
                                        <span key={idx} className={`inline-block ${type === 'food' ? 'text-green-500 bg-green-50' : type === 'clothes' ? 'text-blue-500 bg-blue-50': 'text-pink-500 bg-pink-50'} p-1.5 py-1 rounded text-[11px] mr-1 my-1`}>
                                            {type}
                                        </span>
                                        ))
                                    )
                                }
                            </td>
                            <td className="p-3">{donation.address || ''}</td>
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
            {isDeleteOpen && (
                <ConfirmationAlert 
                onClose={() => setIsDeleteOpen(false)} 
                onConfirm={() => handleDelete(deleteId)}
                title="Delete Goods Donation Record"
                message="Are you sure you want to delete this donation record? This action cannot be undone."
                isDelete={true}
                isDeleting={isDeleting}
                />
            )}

            {openEdtitModal && toBeEdited && (
                <div className="fixed w-screen h-screen top-0 left-0 bg-black/10 z-50 flex items-center justify-center">
                    <div className="bg-white w-[600px] rounded-xl p-8 pb-5 flex items-center justify-center ">
                        <form onSubmit={handleSubmit} className="w-full flex flex-col items-start justify-start gap-3">
                            {/* Name */}
                            <div className="w-full flex items-center justify-between gap-4">
                                <label className="w-[40%] text-xs font-medium">Name <span className="text-[9px] text-gray-500">(Optional)</span></label>
                                <input
                                    type="text"
                                    name="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-[60%] px-4 py-2 rounded-md border border-gray-200 text-xs"
                                    disabled
                                />
                            </div>
                            <div className="w-full flex items-center justify-between gap-4">
                                <label className="w-[40%] text-xs font-medium">email <span className="text-[9px] text-gray-500">(Optional)</span></label>
                                <input
                                    type="text"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-[60%] px-4 py-2 rounded-md border border-gray-200 text-xs"
                                    disabled
                                />
                            </div>

                            {/* Categories */}
                            <div className="w-full">
                                <div className="w-full flex items-center justify-between gap-4">
                                    <label className="w-[40%] text-xs font-medium">Type of Donation</label>
                                    <div className="w-[60%] flex items-start justify-end gap-2">
                                        {['food', 'clothes', 'supplies'].map((item) => (
                                        <label key={item} className="flex items-center gap-2">
                                            <input
                                            type="checkbox"
                                            value={item}
                                            checked={categories.includes(item)}
                                            onChange={handleCategoryChange}
                                            />
                                            <span className="text-[13px] capitalize">{item}</span>
                                        </label>
                                        ))}
                                    </div>
                                </div>
                                {errors.type && <p className="text-[10px] text-red-500">{errors.type[0]}</p>}
                            </div>
                            

                            {/* Description */}
                            <div className="w-full">
                                <div className="w-full flex-col items-center justify-between gap-4">
                                    <label className="w-full text-xs font-medium">Description <span className="text-[10px] text-gray-500">(Add more info about your donation)</span></label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full h-24 px-4 py-2 rounded-md border border-gray-200 text-xs"
                                    ></textarea>
                                </div>
                                {errors.type && <p className="text-[10px] text-red-500">{errors.type[0]}</p>}
                            </div>
                            

                            {/* Submit */}
                            <div className="flex items-center justify-end gap-2 w-full">
                                <p onClick={() => setOpenEditModal(false)}
                            className="text-xs px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-6300 transition-colors duration-300 border-0 cursor-pointer"
                            >
                                Cancel
                            </p>
                                <button
                            type="submit"
                            className="text-xs px-4 py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white transition-colors duration-300 border-0"
                            >
                                {loadingSubmit ? 'Saving...' : 'Save'}
                            </button>
                            </div>
                        </form>
                    </div>
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
                                    <p className="text-xs font-medium">Total Count: <span>{totalCount}</span></p>
                                </div>

                                {/* TABLE */}
                                <div className="mt-2">
                                    <table className="w-full overflow-hidden bg-white text-xs">
                                    <thead className="bg-gray-200">
                                        <tr>
                                            <th className="p-3 text-start">Date</th>
                                            <th className="p-3 text-start">Donor</th>
                                            <th className="p-3 text-start">Desciption</th>
                                            <th className="p-3 text-start">Email</th>
                                            <th className="p-3 text-start">Type of Donation</th>
                                            <th className="p-3 text-start">Address</th>
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
                                                <td className="p-3">
                                                    {donation.name || <span className="p-1 px-2 rounded bg-gray-100 text-gray-600 text-[10px]">Anonymous</span>}
                                                </td>
                                                <td className="p-3">{donation.description || ''}</td>
                                                <td className="p-3">{donation.email || ''}</td>
                                                <td className="p-3">
                                                    {
                                                        donation.type && donation.type.length > 0 && (
                                                            donation.type.map((type, idx) => (
                                                            <span key={idx} className={`inline-block ${type === 'food' ? 'text-green-500 bg-green-50' : type === 'clothes' ? 'text-blue-500 bg-blue-50': 'text-pink-500 bg-pink-50'} p-1.5 py-1 rounded text-[11px] mr-1 my-1`}>
                                                                {type}
                                                            </span>
                                                            ))
                                                        )
                                                    }
                                                </td>
                                                <td className="p-3">{donation.address || ''}</td>
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

export default GoodsDonations;