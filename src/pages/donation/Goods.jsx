import React, { useEffect, useState } from "react";
import Guest from '../../layouts/Guest'
import { Link } from "react-router-dom";
import { _post, _get } from "../../api";
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa";
import { Check } from "lucide-react";
import { FaMapMarkedAlt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

const Goods = () => {

    // Individual states
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [categories, setCategories] = useState([]);
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('Main Address');
    const [quantity, setQuantity] = useState(0);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const [activeStep, setActiveStep] = useState(1);
    const [isAnonymous, setIsAnonymous] = useState(false);

    const [donationCategories, setDonationCategories] = useState([]);

    const [map, setMap] = useState({
        main: false,    
        satellite: false
    });

    const selectedAddress = map.main
        ? "B4 Lot 6-6 Fantasy Road 3, Teresa Park Subd., Pilar, Las Pinas City"
        : map.satellite
        ? "Block 20 Lot 15-A Mines View, Teresa Park Subd., Pilar, Las Pinas City"
        : null;

    // Generate iframe src if address is chosen
    const mapSrc = selectedAddress
        ? `https://www.google.com/maps?q=${encodeURIComponent(selectedAddress)}&output=embed`
        : null;

    useEffect(() => {
        fetchCategories();
    }, []);
    
    const fetchCategories = async () => {
        try {
            const response = await _get(`/goods-donation-categories`);
            setDonationCategories(response.data.categories || []);
            if (!response.ok) {
                console.log(response);
            }
        } catch (error) {
            console.error(error);
        }
    }


    // Handle checkbox change for categories
    const handleCategoryChange = (e) => {
        const { value, checked } = e.target;
        setCategories((prev) =>
        checked ? [...prev, value] : prev.filter((cat) => cat !== value)
        );
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = {
            name,
            description,
            type: categories,
            email,
            quantity,
            address
        };

        try {
            await _post('/goods-donations', data);

            toast.success('Donation submitted successfully!');
            setName('');
            setDescription('');
            setQuantity(0);
            setAddress('Main Address');
            setCategories([]);
            setLoading(false);
            setActiveStep(4);
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

    const handleChooseAddress = (address) => {
        setAddress(address);
    }

    return (
        <Guest>   
            {loading && (
                <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-80 z-50 flex flex-col items-center justify-center">
                    <p className="text-black text-xl">Sending your donation...</p>
                </div>
            )}  
            <div className="bg-gray-50 min-h-screen w-full p-4">
                <div className="w-full max-w-[1100px] mx-auto h-full flex flex-col p-2 md:px-4 pt-24">
                    {activeStep < 4 && (
                        <Link to="/donate" className="md:px-4 py-2 mb-3 rounded w-fit text-xs text-gray-500">
                            <div className="flex items-center gap-2">
                                <FaArrowLeft size={14} />
                                <span>Back</span>
                            </div>
                        </Link>
                    )}

                    <div className="flex items-start gap-12 md:mt-4">
                        <div className="w-full max-w-[850px] mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                            {activeStep < 4 && (
                                <div className="w-full flex flex-col items-start justify-start mb-6 gap-1">
                                    <p className="text-xs uppercase tracking-[0.2em] text-orange-500 font-semibold">Goods Donation</p>
                                    <p className="text-xl font-semibold text-gray-800">We'd love to acknowledge your support <span className="text-[11px] text-gray-500">(Optional)</span></p>
                                    <p className="text-sm text-gray-600">Please complete this form so we can properly track your donation. Thank you!</p>
                                </div>
                            )}

                            {activeStep === 1 ? (
                                <div className="w-full flex items-center justify-center p-1">
                                    <div className="w-full flex flex-col items-start justify-start gap-4">
                                        {/* Name */}
                                        <div className="w-full flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-7">
                                            <label className="w-full md:w-[40%] text-xs font-medium">Name <span className="text-[9px] text-gray-500">(Optional)</span></label>
                                            <div className="w-full md:w-[60%] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                                <div className="w-full flex item-center justify-between">
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        className={`px-4 py-2 rounded-md border ${isAnonymous ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-50'} border-gray-300 text-xs`}
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
                                    
                                        <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-4">
                                            <label className="w-full md:w-[40%] text-xs font-medium">Email</label>
                                            <input
                                                type="text"
                                                name="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full md:w-[60%] px-4 py-2 rounded-md border border-gray-300 bg-gray-50 text-xs"
                                            />
                                        </div>

                                        {/* Categories */}
                                        <div className="w-full">
                                            <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-7">
                                                <label className="w-full md:w-[40%] text-xs font-medium">Type of Donation <span className="text-sm text-red-500">*</span></label>
                                                <div className="w-full md:w-[60%] flex flex-wrap items-start justify-start gap-2">
                                                    {donationCategories.length > 0 && donationCategories.map((item) => (
                                                        <label
                                                            key={item.name || item}
                                                            className={`cursor-pointer px-3 py-1.5 rounded-md border transition flex items-center gap-2 hover:bg-gray-100 `}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                value={item.name}
                                                                checked={categories.includes(item.name)}
                                                                onChange={handleCategoryChange}
                                                                className="h-4 w-4 accent-gray-500 cursor-pointer"
                                                            />
                                                            <span className={`text-xs capitalize`}>{item.name}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                            {errors.type && <p className="text-[10px] text-red-500">{errors.type[0]}</p>}
                                        </div>

                                        <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-4">
                                            <label className="w-full md:w-[40%] text-xs font-medium">Quantity</label>
                                            <input
                                                type="number"
                                                name="quantity"
                                                value={quantity}
                                                min={0}
                                                onChange={(e) => setQuantity(e.target.value)}
                                                className="w-full md:w-[60%] px-4 py-2 rounded-md border border-gray-300 bg-gray-50 text-xs"
                                            />
                                        </div>
                                        

                                        {/* Description */}
                                        <div className="w-full">
                                            <div className="w-full flex-col items-center justify-between gap-4">
                                                <label className="w-full text-xs font-medium">Description <span className="text-sm text-red-500">*</span><span className="text-[10px] text-gray-500"> (Add more info about your donation)</span></label>
                                                <textarea
                                                    value={description}
                                                    onChange={(e) => setDescription(e.target.value)}
                                                    className="w-full h-24 px-4 py-2 rounded-md border border-gray-300 text-xs bg-gray-50"
                                                ></textarea>
                                            </div>
                                            {errors.type && <p className="text-[10px] text-red-500">{errors.type[0]}</p>}
                                        </div>
                                        
                                        {/* Next Button */}

                                        <div className="w-full flex justify-end">
                                            <button
                                                type="submit"
                                                className={`text-xs px-6 py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white transition-colors duration-300 border-0 ${categories.length === 0 || description.trim() === '' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                onClick={() => setActiveStep(2)}
                                                disabled={categories.length === 0 || description.trim() === ''}
                                            >
                                                Next
                                            </button>
                                        </div>

                                        
                                    </div>
                                </div>
                            ) : activeStep === 2 ? (
                                <div className="w-full flex flex-col justify-center items-center gap-4 pb-4">
                                    <div className="w-full h-fit flex flex-col items-start justify-start">
                                        <p className="text-base font-medium">Select location to hand in you donations</p>
                                        <p className="text-xs">You may personally hand in your cash donations at the following addresses:</p>
                                    </div>
                                    <div className="flex flex-col md:flex-row items-center gap-4 w-full pt-4">
                                        <div onClick={() => setAddress("Main Address")} className={`cursor-pointer relative w-full flex flex-col items-center justify-center p-8 rounded-xl shadow-sm ${address === 'Main Address' ? "bg-gray-100 border-blue-200" : "bg-transparent"} hover:bg-gray-100 border border-transparent hover:border-blue-200`}>
                                            <p className="text-orange-500 text-base font-semibold mb-2">Main Address</p>
                                            <p className="text-sm text-center">B4 Lot 6-6 Fantasy Road 3, Teresa Park Subd., Pilar, Las Pinas City</p>
                                            {address === 'Main Address' && (
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

                                        <div onClick={() => setAddress("Satellite Address")} className={`cursor-pointer relative w-full flex flex-col items-center justify-center p-8 rounded-xl shadow-sm ${address === 'Satellite Address' ? "bg-gray-100 border-blue-200" : "bg-transparent"} hover:bg-gray-100 border border-transparent hover:border-blue-200`}>
                                            <p className="text-orange-500 text-base  font-semibold mb-2">Satellite Address</p>
                                            <p className="text-sm text-center">Block 20 Lot 15-A Mines View, Teresa Park Subd., Pilar, Las Pinas City</p>
                                            {address === 'Satellite Address' && (
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
                                    
                                    <div className="flex items-center gap-2 w-full mt-4">
                                        <button
                                            type="submit"
                                            className="w-fit text-xs px-6 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors duration-300 border-0"
                                            onClick={() => setActiveStep(1)}
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            className="w-fit text-xs px-6 py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white transition-colors duration-300 border-0"
                                            onClick={() => setActiveStep(3)}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            ) : activeStep === 3 ? (
                                <div className="w-full">
                                    <h2 className="w-full border-b text-sm font-semibold mb-2">Review Your Information</h2>

                                    {/* Display user input data */}
                                     <div className="space-y-1 text-xs">
                                    <p><strong>Name:</strong> {isAnonymous ? "Anonymous" : name || "N/A"}</p>
                                        <p><strong>Email:</strong> {email || "N/A"}</p>
                                        <p>
                                            <strong>Type of Donation:</strong>{" "}
                                            {categories.length > 0 ? categories.join(", ") : "None selected"}
                                        </p>
                                        <p><strong>Description:</strong> {description || "No description provided"}</p>
                                        <p><strong>Address:</strong> {address}</p>
                                    </div>

                                    {/* Display chosen address */}
                                  
                                    <div className="pt-4">
                                        <h3 className="w-full border-b text-sm font-semibold mb-2">Chosen Address</h3>
                                        <p className="mb-4 text-xs">{address}</p>
                                        <iframe
                                            src={address == "Main Address" ? "https://www.google.com/maps?q=B4%20Lot%206-6%20Fantasy%20Road%203%2C%20Teresa%20Park%20Subd.%2C%20Pilar%2C%20Las%20Pi%C3%B1as%20City&output=embed" : "https://www.google.com/maps?q=Block%2020%20Lot%2015-A%20Mines%20View%2C%20Teresa%20Park%20Subd.%2C%20Pilar%2C%20Las%20Pi%C3%B1as%20City&output=embed" }
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
                                            onClick={() => setActiveStep(2)}
                                        >
                                            Back
                                        </button>

                                        {/* Submit */}
                                        <button
                                        type="submit"
                                        className="w-fit text-xs px-4 py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white transition-colors duration-300 border-0"
                                        onClick={handleSubmit}
                                        >
                                            {loading ? 'Sending...' : 'Send Donation'}
                                        </button>
                                    </div>
                                </div>
                            ) : activeStep === 4 && (
                                <div className="w-full flex flex-col justify-center items-center gap-6 text-center py-12">
                                    <div className="flex flex-col items-center gap-3">
                                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-100">
                                        <Check size={32} className="text-green-600" />
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
                                                setName("");
                                                setDescription("");
                                                setEmail("");
                                                setCategories([]);
                                                setAddress("Main Address");
                                                setIsAnonymous(false);
                                                setActiveStep(1);
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
                            )}

                        </div>
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

export default Goods;
