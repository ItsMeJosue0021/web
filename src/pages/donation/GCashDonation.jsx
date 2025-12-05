
import { useState } from "react"
import Guest from '../../layouts/Guest'
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { _post } from "../../api";


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
            // const response = await _post('/payments/gcash', data);
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

    const savePaymentDetails = async () => {
        try {
            await _post('/donations', data);
        } catch (error) {
            console.log("Unable to save payment details.");
        }
    }


    return (
        <Guest>
            {loading && (
                <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-80 z-50 flex flex-col items-center justify-center">
                    <img src="/gcashpng.png" alt="img" className="w-14 h-14" />
                    <p className="text-blue-700 text-xl">Connecting to GCash...</p>
                </div>
            )}
            <div className="bg-gray-50 h-screen w-full p-4 ">
                <div className="w-full max-w-[1200px] mx-auto h-full flex flex-col p-2 :px-4 pt-24">
                    <Link to="/donate/monetary" className="md:px-4 py-2 mb-3 rounded w-fit text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                            <FaArrowLeft size={14} />
                            <span>Back</span>
                        </div>
                    </Link>
                    <div className="w-full max-w-[800px] mx-auto">
                        <div className="w-full flex flex-col items-start justify-start gap-6">
                            <div>
                                <p className="text-lg text-orange-600 font-semibold">We’d Love to Say Thank You.</p>
                                <p className="text-sm font-light">Please share your details so we can properly record your donation and express our gratitude.</p>
                            </div>

                            <div className="w-full md:w-[95%] flex flex-col items-start justify-start gap-4">
                                <div className="w-full flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-7">
                                    <label className="w-full md:w-[40%] text-xs font-medium">Name <span className="text-[9px] text-gray-500">(Optional)</span></label>
                                    <div className="w-full md:w-[60%] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                        <div className="w-full flex items-center justify-between">
                                            <input
                                                type="text"
                                                name="name"
                                                value={data.name}
                                                onChange={(e) => setData(prev => ({...prev, name: e.target.value}))}
                                                className={`px-4 py-2 rounded-md border ${isAnonymous ? 'bg-gray-200 cursor-not-allowed' : 'bg-transparent'} border-gray-300 text-xs`}
                                                disabled={isAnonymous} 
                                            />
                                        </div>
                                        
                                        <label className="flex items-center gap-2">
                                            <input
                                            type="checkbox"
                                            value={isAnonymous}
                                            checked={isAnonymous}
                                            onChange={() => setIsAnonymous(!isAnonymous)}
                                            className="bg-white accent-gray-500 cursor-pointer"
                                            />
                                            <span className="text-xs capitalize">Anonymous</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="w-full flex flex-col md:flex-row items-center justify-between gap-1 md:gap-4">
                                    <label className="w-full md:w-[40%] text-xs font-medium">Email <span className="text-xs text-red-500">*</span></label>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        className="w-full md:w-[60%] px-4 py-2 rounded-md border border-gray-300 text-xs bg-transparent"
                                        value={data.email} onChange={(e) => setData(prev => ({...prev, email: e.target.value}))} 
                                    />
                                </div>

                                <div className="w-full">
                                    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-1 md:gap-4">
                                        <label className="w-full md:w-[40%] text-xs font-medium">Amount <span className="text-xs text-red-500">*</span></label>
                                        <input 
                                            type="number" 
                                            name="amount" 
                                            className="w-full md:w-[60%] px-4 py-2 rounded-md border border-gray-300 text-xs bg-transparent"
                                            value={data.amount} 
                                            onChange={(e) => setData(prev => ({...prev, amount: e.target.value}))} 
                                        />
                                    </div>
                                    {errors.amount && <p className="text-[10px] text-red-500">{errors.amount[0]}</p>}
                                </div>

                                <div className="md:pt-4">
                                    <button
                                        type="submit"
                                        onClick={handlePayment}
                                        className={`w-fit text-xs px-6 py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white transition-colors duration-300 border-0 ${data.amount.trim() === '' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        disabled={data.amount.trim() === ''}
                                    >
                                        {loading ? "Connecting to GCash.." : "Proceed to Gcash Payment"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Guest>
    )
}

export default GCashDonation