import React from "react";
import Guest from '../../layouts/Guest'
import { Check } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Cash = () => {

    const [selectedPayment, setSelectedPayment] = useState('gcash');

    const handlePaymentSelect = (paymentMethod) => {
        setSelectedPayment(paymentMethod);
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
                        <div className="w-full flex flex-col gap-16">
                            <div className="w-full flex -items-start gap-4 mt-6">
                                <div onClick={() => handlePaymentSelect('gcash')} className="w-40 h-16 rounded-xl shadow-sm bg-white transform transition-transform duration-300 hover:scale-105 cursor-pointer relative">
                                    <img src="/gecash.jpg" alt="img" className="w-full h-full object-cover object-center rounded-xl" />
                                    {selectedPayment === 'gcash' && (
                                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-1 py-1 rounded-full flex items-center">
                                            <Check size={14}/>
                                        </div>
                                    )}
                                </div>
                                <div onClick={() => handlePaymentSelect('bpi')} className="w-40 h-16 rounded-xl shadow-sm bg-white p-2 transform transition-transform duration-300 hover:scale-105 cursor-pointer relative">
                                    <img src="/bpi.jpg" alt="img" className="w-full h-full object-contain object-center rounded-xl" />
                                    {selectedPayment === 'bpi' && (
                                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-1 py-1 rounded-full flex items-center">
                                            <Check size={14}/>
                                        </div>
                                    )}
                                </div>
                                <div onClick={() => handlePaymentSelect('bdo')} className="w-40 h-16 rounded-xl shadow-sm bg-white p-1 transform transition-transform duration-300 hover:scale-105 cursor-pointer relative">
                                    <img src="/bdo.jpg" alt="img" className="w-full h-full object-contain object-center rounded-xl" />
                                    {selectedPayment === 'bdo' && (
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

                                <div className="w-[95%] flex flex-col items-start justify-start gap-4">
                                    <div className="w-full flex items-center justify-between gap-4">
                                        <label className="w-[40%] text-xs font-medium">Name <span className="text-[9px] text-gray-500">(Optional)</span></label>
                                        <input type="text" name="amount" id="amount" className="w-[60%] px-4 py-2 rounded-md border border-gray-200 text-xs bg-transparent"/>
                                    </div>
                                    <div className="w-full flex items-center justify-between gap-4">
                                        <label className="w-[40%] text-xs font-medium">Amount</label>
                                        <input type="number" name="amount" id="amount" className="w-[60%] px-4 py-2 rounded-md border border-gray-200 text-xs bg-transparent"/>
                                    </div>
                                    <div className="w-full flex items-center justify-between gap-4">
                                        <label className="w-[40%] text-xs font-medium">Reference/Transaction No.</label>
                                        <input type="text" name="amount" id="amount" className="w-[60%] px-4 py-2 rounded-md border border-gray-200 text-xs bg-transparent"/>
                                    </div>
                                    <button className="w-full text-xs px-4 py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white transition-colors duration-300 border-0">
                                        Submit
                                    </button>

                                </div>
                            </div>
                        </div>
                        <div className="w-full p-6 pt-0 flex items-center justify-center">
                            {selectedPayment === 'gcash' && (
                                <div className="w-[85%] h-[450px] rounded-xl bg-white">
                                    <img src="/gcashqrcode.jpg" alt="img" className="w-full h-full object-contain rounded-xl" />
                                </div>
                            )}
                            {selectedPayment === 'bpi' && (
                                <div className="w-[85%] h-[450px]">
                                    <div className="w-full h-full flex flex-col items-center justify-center">
                                        <p className="text-base font-semibold text-orange-600">Service is currently unavailable.</p>
                                        <p className="text-xs">You may send your donations through our Gcash Account. Thank you!</p>
                                    </div>
                                </div>
                            )}
                            {selectedPayment === 'bdo' && (
                                <div className="w-[85%] h-[450px]">
                                    <div className="w-full h-full flex flex-col items-center justify-center">
                                        <p className="text-base font-semibold text-orange-600">Service is currently unavailable.</p>
                                        <p className="text-xs">You may send your donations through our Gcash Account. Thank you!</p>
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