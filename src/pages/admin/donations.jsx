import Admin from "../../layouts/Admin";
import { useState, useEffect } from "react";
import { Edit, Trash2 } from "lucide-react";
import { _get, _delete, _post } from "../../api"; 
import { toast } from "react-toastify";
import ConfirmationAlert from "../../components/alerts/ConfirmationAlert";
import { set } from "lodash";

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

    const baseURL = "http://127.0.0.1:8000/storage/";

    useEffect(() => {
        fetchDonations();
    }, []);

    const fetchDonations = async () => {
        try {
            const response = await _get("/donations"); 
            const data = await response.data;
            setDonations(data);
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
            fetchDonations();
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
                    <div className="w-full min-w-80 max-w-[500px] flex items-center gap-4">
                        <p className="text-xs">Search</p>
                        <input type="text" className="placeholder:text-xs px-4 py-2 rounded border border-gray-200 text-sm" placeholder="Type something.." />
                    </div>
                    {/* <div className="flex items-center justify-end gap-2">
                        <button className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-4 py-2 rounded">+ New</button>
                    </div> */}
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
                        <th className="p-3 text-end">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {donations.map((donation, index) => (
                        <tr key={donation.id} className={`${index % 2 === 0 ? "bg-orange-50" : ""}`}>
                            <td className="p-3">
                            {donation.created_at
                                ? new Date(donation.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })
                                : ''}
                            </td>
                            <td className="p-3">{donation.name || ''}</td>
                            <td className="p-3">{donation.amount || ''}</td>
                            <td className="p-3">{donation.reference || ''}</td>
                            <td className="p-3">{donation.email || ''}</td>
                            <td className="p-3">
                                {donation.type === 'gcash' && (
                                    <button onClick={() => handleViewProof(donation.proof)} className="text-[10px] px-2 py-1 bg-gray-200 rounded">View</button>
                                )}
                            </td>
                            <td className="p-3 h-full flex items-center justify-end gap-2">
                                <button onClick={() => handleEdit(donation)} className="bg-blue-50 text-blue-600 px-1 py-1 rounded"><Edit size={16} /></button>
                                <button onClick={() => handleConfirmDelete(donation.id)} className="bg-red-50 text-red-600 px-1 py-1 rounded" ><Trash2 size={16} /></button>
                            </td>
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
            
        </Admin>
    )
}

export default Donations;