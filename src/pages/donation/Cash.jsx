import React from "react";
import Guest from '../../layouts/Guest'
import { Check, PhilippinePeso } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { _post } from "../../api";
import { toast } from "react-toastify";
import { form } from "framer-motion/client";

const Cash = () => {

    const [selectedPayment, setSelectedPayment] = useState('gcash');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [amount, setAmount] = useState('');
    const [reference, setReference] = useState('');
    const [proof, setProof] = useState(null);
    const [address, setAddress] = useState('Main Address');
    const [addressType, setAddressType] = useState('main');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const [isAnonymous, setIsAnonymous] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('type', selectedPayment);
        formData.append('name', name);
        formData.append('email', email);
        formData.append('amount', amount);
        formData.append('address', address);

        if (selectedPayment === 'gcash') {
            formData.append('reference', reference);
            if (proof) formData.append('proof', proof);
        }

        try {
            const response = await _post('/donations', formData, {
                headers: {
                'Content-Type': 'multipart/form-data'
                }
            });

            toast.success('Donation submitted successfully!');
            clearForm();
            setErrors({})
            setLoading(false);
        } catch (error) {
            setLoading(false);
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
                toast.error(error.response.data.message || 'Validation failed.');
            } else {
                toast.error('Something went wrong. Please try again.');
                console.error('Error submitting donation:', error);
            }
        }
    };

    const clearForm = () => {
        setName('');
        setEmail('');
        setAmount('');
        setReference('');
        setProof(null);
    };


    const handlePaymentSelect = (paymentMethod) => {
        clearForm();
        setErrors({})
        setSelectedPayment(paymentMethod);
        setIsAnonymous(false);
    }

    const handleChooseAddress = (address, type) => {
        setAddress(address);
        setAddressType(type === 'main' ? 'main' : 'satellite');
    }

    return (
        <Guest>
            <div className="bg-gray-50 h-screen w-full p-4">
                <div className="w-full max-w-[1200px] mx-auto h-full flex flex-col p-4 pt-24">
                    <Link to="/donate" className="px-4 py-1 mb-3 rounded border border-gray-200 w-fit text-xs text-gray-500">Back</Link>
                    <div className="w-full flex flex-col items-start justify-start">
                        <h1 className="text-start text-xl font-bold text-orange-600 ">Donate Cash</h1>
                        <p className="text-start text-gray-600 text-xs font-light ">
                            Your generous cash donations help us fund our programs and initiatives.
                        </p>
                    </div>
                    <div className="w-full flex gap-8 items-start justify-center">
                        <div className="w-full flex flex-col gap-8">
                            <div className="w-full flex -items-start gap-4 mt-6">
                                <div onClick={() => handlePaymentSelect('gcash')} className="w-40 h-16 rounded-xl shadow-sm bg-white transform transition-transform duration-300 hover:scale-105 cursor-pointer relative">
                                    <img src="/gecash.jpg" alt="img" className="w-full h-full object-cover object-center rounded-xl" />
                                    {selectedPayment === 'gcash' && (
                                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-1 py-1 rounded-full flex items-center">
                                            <Check size={14}/>
                                        </div>
                                    )}
                                </div>
                                <div onClick={() => handlePaymentSelect('cash')} className="w-40 h-16 rounded-xl bg-white shadow-sm  p-2 transform transition-transform duration-300 hover:scale-105 cursor-pointer relative">
                                    <div className="w-full h-full flex items-center justify-center gap-1">
                                        <PhilippinePeso size={22} strokeWidth={3} className="text-green-700"/>
                                        <p className="font-semibold ">Cash</p>
                                    </div>
                                    {selectedPayment === 'cash' && (
                                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-1 py-1 rounded-full flex items-center">
                                            <Check size={14}/>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="w-full flex flex-col items-start justify-start gap-6">
                                <div>
                                    <p className="text-sm text-orange-600 font-bold">We’d love to acknowledge your support. <span className="text-[9px] text-gray-500">(Optional)</span></p>
                                    <p className="text-xs font-light">Please complete this form and send it to us so we can properly track your donation. Thank you!</p>
                                </div>

                                <form onSubmit={handleSubmit} className="w-[95%] flex flex-col items-start justify-start gap-3">
                                    <div className="w-full flex items-center gap-3">
                                         <div className="w-full flex items-center justify-between gap-4">
                                            <label className="w-[40%] text-xs font-medium">Name <span className="text-[9px] text-gray-500">(Optional)</span></label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className={`px-4 py-2 rounded-md border ${isAnonymous ? 'bg-gray-200 cursor-not-allowed' : 'bg-transparent'} border-gray-200 text-xs`}
                                                disabled={isAnonymous} 
                                            />
                                            <label className="flex items-center gap-2">
                                                <input
                                                type="checkbox"
                                                value={isAnonymous}
                                                checked={isAnonymous}
                                                onChange={() => setIsAnonymous(!isAnonymous)}
                                                />
                                                <span className="text-[13px] capitalize">Anonymous</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="w-full flex items-center justify-between gap-4">
                                        <label className="w-[40%] text-xs font-medium">Email </label>
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
                                                    <label className="w-[40%] text-xs font-medium">Proof of Donation <span className="text-xs text-red-500">*</span></label>
                                                    <input type="file" name="proof" className="w-[60%] px-4 py-2 rounded-md border border-gray-200 text-xs bg-transparent"
                                                    onChange={(e) => setProof(e.target.files[0])} />
                                                </div>
                                                {errors.proof && <p className="text-[10px] text-red-500">{errors.proof[0]}</p>}
                                            </div>
                                        </div>
                                    )}
                                    
                                    <button type="submit" className="w-full text-xs px-4 py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white transition-colors duration-300 border-0">
                                        {loading ? 'Submitting...' : 'Submit Donation'}
                                    </button>

                                </form>
                            </div>
                        </div>
                        <div className="w-full p-6 pt-0 flex items-center justify-center">
                            {selectedPayment === 'gcash' && (
                                <div className="w-[80%] h-[400px] rounded-xl bg-white">
                                    <img src="/gcashqrcode.jpg" alt="img" className="w-full h-full object-contain rounded-xl" />
                                </div>
                            )}
                            {selectedPayment === 'cash' && (
                                <div className="w-full h-[450px]">
                                    <div className="w-full h-fit flex flex-col items-start justify-start">
                                        <p className="text-xl font-semibold text-orange-600">Select Location to Donate</p>
                                        <p className="text-xs">You may personally hand in your cash donations at the following addresses:</p>
                                    </div>
                                    <div className="flex flex-col justify-center items-center gap-6 mt-8">  
                                        <div onClick={() => handleChooseAddress('Main Address', 'main')} className="cursor-pointer relative w-full flex flex-col items-center justify-center gap-4 p-8 rounded-xl shadow bg-transparent">
                                            <p className="text-orange-500 text-lg font-semibold">Main Address</p>
                                            <p className="text-sm">B4 Lot 6-6 Fantasy Road 3, Teresa Park Subd., Pilar, Las Piñas</p>
                                            {addressType === 'main' && (
                                                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-1 py-1 rounded-full flex items-center">
                                                    <Check size={14}/>
                                                </div>
                                            )}
                                        </div>

                                        <div onClick={() => handleChooseAddress('Satellite Address', 'satellite')} className="cursor-pointer relative w-full flex flex-col items-center justify-center gap-4 p-8 rounded-xl shadow bg-transparent">
                                            <p className="text-orange-500 text-lg  font-semibold">Satellite Address</p>
                                            <p className="text-sm">Block 20 Lot 15-A Mines View, Teresa Park Subd., Pilar, Las Piñas</p>
                                            {addressType === 'satellite' && (
                                                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-1 py-1 rounded-full flex items-center">
                                                    <Check size={14}/>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                        </div>
                    </div>
                    

                </div>
            </div>
        </Guest>
        
    )
}

export default Cash;