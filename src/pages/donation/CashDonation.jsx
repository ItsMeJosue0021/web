import { useState } from "react"
import Guest from '../../layouts/Guest'
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { _post } from "../../api";
import { Check } from "lucide-react";
import { FaMapMarkedAlt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { motion } from 'framer-motion';

const CashDonation = () => {

    const [data, setData] = useState({
        name: "",
        email: "",
        amount: "",
        address: "Main Address",
        date: "",
        time: "",
    });
    const [errors, setErrors] = useState({});
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [map, setMap] = useState({
        main: false,    
        satellite: false
    });

    const handlePayment = async () => {
        setLoading(true);

        const payload = {
            name: isAnonymous ? "Anonymous" : data.name,
            email: data.email,
            amount: data.amount,
            drop_off_address: data.address,
            drop_off_date: data.date,
            drop_off_time: data.time,
        }
        try {
            const response = await _post('/donations/cash/save', payload);
            if (response.status === 201) {
                setStep(4);
            }
        } catch (error) {}
        setLoading(false);
    };


    return (
        <Guest>
            {loading && (
                <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-80 z-50 flex flex-col items-center justify-center">
                    <p className="text-black text-xl">Sending your donation...</p>
                </div>
            )}
            <div className="bg-gray-50 h-screen w-full p-4 ">
                <div className="w-full max-w-[1200px] mx-auto h-full flex flex-col p-2 :px-4 pt-24">
                    {step !== 4 && (
                        <Link to="/donate/monetary" className="md:px-4 py-2 mb-3 rounded w-fit text-xs text-gray-500">
                            <div className="flex items-center gap-2">
                                <FaArrowLeft size={14} />
                                <span>Back</span>
                            </div>
                        </Link>
                    )}
                    <div className="w-full max-w-[800px] mx-auto">
                        {step === 1 ? (
                            <div className="w-full flex flex-col items-start justify-start gap-6">
                                <div>
                                    <p className="text-lg text-orange-600 font-semibold">We’d Love to Say Thank You.</p>
                                    <p className="text-sm font-light">Please share your details so we can properly record your donation and express our gratitude.</p>
                                </div>

                                <div className="w-[95%] flex flex-col items-start justify-start gap-3">
                                    <div className="w-full flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-4">
                                        <label className="md:hidden w-[40%] text-xs font-medium">Name <span className="text-[9px] text-gray-500">(Optional)</span></label>
                                        <div className="w-full flex items-center justify-between gap-4">
                                            <label className="hidden md:block w-[40%] text-xs font-medium">Name <span className="text-[9px] text-gray-500">(Optional)</span></label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={data.name}
                                                onChange={(e) => setData(prev => ({...prev, name: e.target.value}))}
                                                className={`px-4 py-2 rounded-md border ${isAnonymous ? 'bg-gray-200 cursor-not-allowed' : 'bg-transparent'} border-gray-300 text-xs`}
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

                                    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-1 md:gap-4">
                                        <label className="w-full md:w-[40%] text-xs font-medium">Email <span className="text-[9px] text-gray-500">(Optional)</span></label>
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
                                            onClick={() => setStep(2)}
                                            className={`w-fit text-xs px-6 py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white transition-colors duration-300 border-0 ${data.amount.trim() === '' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            disabled={data.amount.trim() === ''}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : step === 2 ? (
                            <div className="w-full flex flex-col justify-center items-center gap-4 ">
                                <div className="w-full h-fit flex flex-col items-start justify-start">
                                    <p className="text-base font-medium">Donation Handoff Details</p>
                                    <p className="text-xs">Pick the location, date, and time that works best for you to hand in your donation.</p>
                                </div>

                                <div className="w-full flex items-center justify-between gap-4 pt-4">
                                    <label className="w-[40%] text-xs font-medium">Drop-Off Date <span className="text-xs text-red-500">*</span></label>
                                    <input 
                                        type="date" 
                                        name="date" 
                                        min={new Date().toISOString().split("T")[0]}
                                        className="w-[60%] px-4 py-2 rounded-md border border-gray-300 text-xs bg-transparent"
                                        value={data.date} onChange={(e) => setData(prev => ({...prev, date: e.target.value}))} 
                                    />
                                </div>

                                <div className="w-full flex items-center justify-between gap-4">
                                    <label className="w-[40%] text-xs font-medium">Drop-Off Time <span className="text-xs text-red-500">*</span></label>
                                    <input 
                                        type="time" 
                                        name="time" 
                                        className="w-[60%] px-4 py-2 rounded-md border border-gray-300 text-xs bg-transparent"
                                        value={data.time} onChange={(e) => setData(prev => ({...prev, time: e.target.value}))} 
                                    />
                                </div>

                                <div className="flex flex-col md:flex-row items-center gap-4 w-full pt-4">
                                    <div onClick={() => setData(prev => ({...prev, address: "Main Address"}))} className={`cursor-pointer relative w-full flex flex-col items-center justify-center p-8 rounded-xl shadow-sm ${data.address === 'Main Address' ? "bg-gray-100 border-blue-200" : "bg-transparent"} hover:bg-gray-100 border border-transparent hover:border-blue-200`}>
                                        <p className="text-orange-500 text-base font-semibold mb-2">Main Address</p>
                                        <p className="text-sm text-center">B4 Lot 6-6 Fantasy Road 3, Teresa Park Subd., Pilar, Las Piñas City</p>
                                        {data.address === 'Main Address' && (
                                            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-1 py-1 rounded-full flex items-center">
                                                <Check size={23}/>
                                            </div>
                                        )}
                                        <div className="pt-2 z-20">
                                            <FaMapMarkedAlt 
                                            size={25} 
                                            className="text-blue-500 cursor-pointer"
                                            onClick={() => setMap(prev => ({...prev, main: true}))} />
                                        </div>
                                    </div>

                                    <div onClick={() => setData(prev => ({...prev, address: "Satellite Address" }))} className={`cursor-pointer relative w-full flex flex-col items-center justify-center p-8 rounded-xl shadow-sm ${data.address === 'Satellite Address' ? "bg-gray-100 border-blue-200" : "bg-transparent"} hover:bg-gray-100 border border-transparent hover:border-blue-200`}>
                                        <p className="text-orange-500 text-base  font-semibold mb-2">Satellite Address</p>
                                        <p className="text-sm text-center">Block 20 Lot 15-A Mines View, Teresa Park Subd., Pilar, Las Piñas City</p>
                                        {data.address === 'Satellite Address' && (
                                            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-1 py-1 rounded-full flex items-center">
                                                <Check size={23}/>
                                            </div>
                                        )}
                                        <div className="pt-2">
                                            <FaMapMarkedAlt 
                                            size={25} 
                                            className="text-blue-500 cursor-pointer"
                                            onClick={() => setMap(prev => ({...prev, satellite: true}))} />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2 w-full ">
                                    <button
                                        type="submit"
                                        className="w-fit text-xs px-6 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors duration-300 border-0"
                                        onClick={() => setStep(1)}
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        className={`w-fit text-xs px-6 py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white transition-colors duration-300 border-0 ${!data.date || !data.time ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        onClick={() => setStep(3)}
                                        disabled={!data.date || !data.time}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        ) : step === 3 ? (
                            <div className="w-full">
                                <h2 className="w-full border-b text-base font-medium mb-2">Review your Donation Details</h2>

                                {/* Display user input data */}
                                <div className="space-y-2 text-xs">
                                    <p className="flex items-center justify-between"><span>Name:</span> {isAnonymous ? "Anonymous" : data.name || "N/A"}</p>
                                    <p className="flex items-center justify-between"><span>Email:</span> {data.email || "N/A"}</p>
                                    <p className="flex items-center justify-between"><span>Amount:</span> ₱{data.amount}</p>
                                    <p className="flex items-center justify-between"><span>Drop-Off Date:</span> {data.date}</p>
                                    <p className="flex items-center justify-between"><span>Drop-Off Time:</span> {data.time}</p>
                                    <p className="flex items-center justify-between"><span>Address:</span> {data.address}</p>
                                </div>

                                {/* Display chosen address */}
                                
                                <div className="mt-5 rounded-lg shadow">
                                    <iframe
                                        src={data.address == "Main Address" ? "https://www.google.com/maps?q=B4%20Lot%206-6%20Fantasy%20Road%203%2C%20Teresa%20Park%20Subd.%2C%20Pilar%2C%20Las%20Pi%C3%B1as%20City&output=embed" : "https://www.google.com/maps?q=Block%2020%20Lot%2015-A%20Mines%20View%2C%20Teresa%20Park%20Subd.%2C%20Pilar%2C%20Las%20Pi%C3%B1as%20City&output=embed" }
                                        className="w-full h-[95%] mt-2 rounded"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="Google Maps Location"
                                    />
                                </div>
                                

                                {/* Action buttons */}
                                <div className="flex items-center gap-2 w-full mt-4">
                                    <button
                                        type="submit"
                                        className="w-fit text-xs px-6 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors duration-300 border-0"
                                        onClick={() => setStep(2)}
                                    >
                                        Back
                                    </button>

                                    {/* Submit */}
                                    <button
                                    onClick={handlePayment}
                                    className="w-fit text-xs px-4 py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white transition-colors duration-300 border-0"
                                    
                                    >
                                        {loading ? 'Sending...' : 'Send Donation'}
                                    </button>
                                </div>
                            </div>
                        ) : step === 4 ? (
                            <div className="w-full flex flex-col justify-center items-center gap-6 text-center py-12">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-28 h-28 flex items-center justify-center rounded-full bg-green-100">
                                        <motion.div
                                            initial={{ scale: 0, rotate: -90 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 500,
                                                damping: 20
                                            }}
                                        >
                                            <Check size={55} className="text-green-600" />
                                        </motion.div>
                                    </div>
                                    <h2 className="text-xl font-semibold text-green-700">Thank You!</h2>
                                    <p className="text-sm text-gray-600 max-w-md">
                                        Your donation has been submitted successfully. We truly appreciate your support
                                        and generosity!
                                    </p>
                                </div>

                                <div className="flex flex-col items-center gap-3 mt-6">
                                    <button
                                        className="px-6 py-2 text-xs rounded-md bg-orange-500 hover:bg-orange-600 text-white"
                                        onClick={() => {
                                            setData({
                                                name: "",
                                                email: "",
                                                amount: "",
                                                address: "Main Address",
                                                date: "",
                                                time: "",
                                            });
                                            setIsAnonymous(false);
                                            setErrors({});
                                            setStep(1);
                                        }}
                                    >
                                        Make Another Donation
                                    </button>

                                    <Link
                                        to="/"
                                        className="text-xs text-gray-600 hover:underline"
                                    >
                                        Back to Home
                                    </Link>
                                </div>
                            </div>
                        ) : setStep(1)}
                        
                    </div>
                </div>
            </div>
            {(map.main || map.satellite) && (
                <div className="fixed bottom-0 left-0 w-screen h-screen bg-white p-4 border-t z-50">
                    <div className="w-full flex items-center justify-end">
                        <IoMdClose 
                        size={25} 
                        className="text-gray-500 cursor-pointer hover:text-blue-600" 
                        onClick={() => setMap(prev => ({satellite: false, main: false}))}/>
                    </div>
                    <iframe
                        src={map.main ? "https://www.google.com/maps?q=B4%20Lot%206-6%20Fantasy%20Road%203%2C%20Teresa%20Park%20Subd.%2C%20Pilar%2C%20Las%20Pi%C3%B1as%20City&output=embed" : map.satellite ? "https://www.google.com/maps?q=Block%2020%20Lot%2015-A%20Mines%20View%2C%20Teresa%20Park%20Subd.%2C%20Pilar%2C%20Las%20Pi%C3%B1as%20City&output=embed" : ""}
                        className="w-full h-[95%] mt-2 rounded"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Google Maps Location"
                    />
                </div>
            )}
        </Guest>
    )
}

export default CashDonation