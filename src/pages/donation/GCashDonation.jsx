import { useState } from "react";
import Guest from "../../layouts/Guest";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { _post } from "../../api";
import CircularLoading from "../../components/CircularLoading";

const GCashDonation = () => {

    const [data, setData] = useState({
        name: "",
        email: "",
        amount: "",
    });

    const [errors, setErrors] = useState({});
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);
        try {
            const response = await _post('/donations/gcash/save', data);

            if (response.status === 200) {
                const source = response.data.data; 
                const checkoutUrl = source.attributes.redirect.checkout_url;

                if (checkoutUrl) {
                    window.location.href = checkoutUrl; 
                } 
            }
        } catch (error) {}
        setLoading(false);
    };

    return (
        <Guest>
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
                    <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-xl border border-gray-100 p-6 flex flex-col items-center text-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center overflow-hidden">
                            <img src="/gcashpng.png" alt="GCash" className="w-7 h-7 object-contain" />
                        </div>
                        <CircularLoading customClass="w-6 h-6 text-blue-600" />
                        <p className="text-lg font-semibold text-gray-800">Connecting to GCash</p>
                        <p className="text-xs text-gray-500">
                            Please keep this window open while we redirect you to payment.
                        </p>
                    </div>
                </div>
            )}
            <div className="bg-gray-50 min-h-screen w-full p-4 ">
                <div className="w-full max-w-[1100px] mx-auto h-full flex flex-col p-2 md:px-4 pt-24">
                    <Link to="/donate/monetary" className="md:px-4 py-2 mb-3 rounded w-fit text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                            <FaArrowLeft size={14} />
                            <span>Back</span>
                        </div>
                    </Link>
                    <div className="w-full max-w-[700px] mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                        <div className="w-full flex flex-col items-start justify-start gap-3 mb-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-orange-500 font-semibold">GCash Donation</p>
                            <p className="text-lg text-gray-800 font-semibold">We&apos;d love to say thank you</p>
                            <p className="text-sm text-gray-600">Share your details so we can properly record your donation and express our gratitude.</p>
                        </div>

                        <div className="w-full flex flex-col gap-4">
                            <div className="w-full flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-7">
                                <label className="w-full md:w-[40%] text-xs font-medium">Name <span className="text-[9px] text-gray-500">(Optional)</span></label>
                                <div className="w-full md:w-[60%] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                    <input
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        onChange={(e) => setData(prev => ({...prev, name: e.target.value}))}
                                        className={`w-full px-4 py-2 rounded-md border ${isAnonymous ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-50'} border-gray-300 text-xs`}
                                        disabled={isAnonymous} 
                                    />
                                    <label className="flex items-center gap-2">
                                        <input
                                        type="checkbox"
                                        value={isAnonymous}
                                        checked={isAnonymous}
                                        onChange={() => setIsAnonymous(!isAnonymous)}
                                        className="h-4 w-4 bg-white border border-gray-300 cursor-pointer accent-white"
                                        style={{ accentColor: '#fff' }}
                                        />
                                        <span className="text-xs capitalize">Anonymous</span>
                                    </label>
                                </div>
                            </div>

                            <div className="w-full flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4">
                                <label className="w-full md:w-[40%] text-xs font-medium">Email <span className="text-xs text-red-500">*</span></label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    className="w-full md:w-[60%] px-4 py-2 rounded-md border border-gray-300 text-xs bg-gray-50"
                                    value={data.email} onChange={(e) => setData(prev => ({...prev, email: e.target.value}))} 
                                />
                            </div>

                            <div className="w-full">
                                <div className="w-full flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4">
                                    <label className="w-full md:w-[40%] text-xs font-medium">Amount <span className="text-xs text-red-500">*</span></label>
                                    <input 
                                        type="number" 
                                        name="amount" 
                                        className="w-full md:w-[60%] px-4 py-2 rounded-md border border-gray-300 text-xs bg-gray-50"
                                        value={data.amount} 
                                        onChange={(e) => setData(prev => ({...prev, amount: e.target.value}))} 
                                    />
                                </div>
                                {errors.amount && <p className="text-[10px] text-red-500">{errors.amount[0]}</p>}
                            </div>

                            <div className="md:pt-4 flex justify-end w-full">
                                <button
                                    type="submit"
                                    onClick={handlePayment}
                                    className={`text-xs px-6 py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white transition-colors duration-300 border-0 ${data.amount.trim() === '' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={data.amount.trim() === ''}
                                >
                                    {loading ? "Connecting to GCash.." : "Proceed to GCash Payment"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Guest>
    )
}

export default GCashDonation
