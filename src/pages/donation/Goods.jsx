import React from "react";
import Guest from '../../layouts/Guest'
import { Link } from "react-router-dom";
import { useState } from "react";
import { _post } from "../../api";
import { toast } from "react-toastify";
import { add, set } from "lodash";
import { Check } from "lucide-react";

const Goods = () => {

    // Individual states
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [categories, setCategories] = useState([]);
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('Main Address');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const [isAnonymous, setIsAnonymous] = useState(false);


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
            address
        };

        try {
            const response = await _post('/goods-donations', data);

            toast.success('Donation submitted successfully!');
            setName('');
            setDescription('');
            setAddress('Main Address');
            setCategories([]);
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

    const handleChooseAddress = (address) => {
        setAddress(address);
    }

    return (
        <Guest>     
            <div className="bg-gray-50 h-screen w-full p-4">
                <div className="w-full max-w-[1200px] mx-auto h-full flex flex-col p-4 pt-24">
                    <Link to="/donate" className="px-4 py-1 mb-3 rounded border border-gray-200 w-fit text-xs text-gray-500">Back</Link>
                    <div className="w-full flex flex-col items-center justify-center rounded-xl p-6 bg-white shadow-sm">
                        <h1 className="text-start text-2xl font-bold text-orange-600">Donate Goods</h1>
                        <p className="text-start text-gray-600 text-base font-light">
                            Your donations of essential items help support our communities and bring relief to those in need.
                        </p>
                    </div>

                    <div className="flex items-start gap-12 mt-8">
                        <div className="w-full">
                            <div className="w-full flex flex-col items-start justify-start mb-8">
                                <p className="text-xl font-semibold text-orange-600">We’d love to acknowledge your support <span className="text-[11px] text-gray-500">(Optional)</span></p>
                                <p className="text-xs font-light">Please complete this form and send it to us so we can properly track your donation. Thank you!</p>
                            </div>

                            <div className="w-full flex items-center justify-center p-1">
                                <form onSubmit={handleSubmit} className="w-full flex flex-col items-start justify-start gap-3">
                                    {/* Name */}
                                    <div className="w-full flex items-center gap-3">
                                         <div className="w-full flex items-center justify-between gap-4">
                                            <label className="w-[40%] text-xs font-medium">Name <span className="text-[9px] text-gray-500">(Optional)</span></label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className={`px-4 py-2 rounded-md border ${isAnonymous ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-100'} border-gray-200 text-xs`}
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
                                        <label className="w-[40%] text-xs font-medium">email</label>
                                        <input
                                            type="text"
                                            name="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-[60%] px-4 py-2 rounded-md border border-gray-200 bg-gray-100 text-xs"
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
                                                className="w-full h-24 px-4 py-2 rounded-md border border-gray-200 text-xs bg-gray-100"
                                            ></textarea>
                                        </div>
                                        {errors.type && <p className="text-[10px] text-red-500">{errors.type[0]}</p>}
                                    </div>
                                    

                                    {/* Submit */}
                                    <button
                                    type="submit"
                                    className="w-full text-xs px-4 py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white transition-colors duration-300 border-0"
                                    >
                                        {loading ? 'Submitting...' : 'Submit Donation'}
                                    </button>
                                </form>
                            </div>
                        </div>
                        <div className="w-full flex flex-col justify-center items-center gap-4 ">
                           <div className="w-full h-fit flex flex-col items-start justify-start">
                                <p className="text-xl font-semibold text-orange-600">Select Location to Donate</p>
                                <p className="text-xs">You may personally hand in your cash donations at the following addresses:</p>
                            </div>
                            <div onClick={() => handleChooseAddress('Main Address')} className="cursor-pointer relative w-full flex flex-col items-center justify-center p-8 rounded-xl shadow-sm bg-transparent">
                                <p className="text-orange-500 text-base font-semibold">Main Address</p>
                                <p className="text-sm">B4 Lot 6-6 Fantasy Road 3, Teresa Park Subd., Pilar, Las Piñas City</p>
                                {address === 'Main Address' && (
                                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-1 py-1 rounded-full flex items-center">
                                        <Check size={14}/>
                                    </div>
                                )}
                            </div>

                            <div onClick={() => handleChooseAddress('Satellite Address')} className="cursor-pointer relative w-full flex flex-col items-center justify-center p-8 rounded-xl shadow-sm bg-transparent">
                                <p className="text-orange-500 text-base  font-semibold">Satellite Address</p>
                                <p className="text-sm">Block 20 Lot 15-A Mines View, Teresa Park Subd., Pilar, Las Piñas City</p>
                                {address === 'Satellite Address' && (
                                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-1 py-1 rounded-full flex items-center">
                                        <Check size={14}/>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                   

                    
                    

                </div>
            </div>
        </Guest>
        
    )
}

export default Goods;