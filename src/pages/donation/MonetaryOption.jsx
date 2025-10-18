import { useState } from "react"
import Guest from '../../layouts/Guest'
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { PhilippinePeso } from "lucide-react";


const MonetaryOption = () => {

    return (
        <Guest>
            <div className="bg-gray-50 h-screen w-full p-4 ">
                <div className="w-full max-w-[1200px] mx-auto h-full flex flex-col p-4 pt-24">
                    <Link to="/donate" className="md:px-4 py-2 mb-3 rounded w-fit text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                            <FaArrowLeft size={14} />
                            <span>Back</span>
                        </div>
                    </Link>
                    <div className="w-full max-w-[800px] mx-auto">
                        <div className="w-full flex flex-col items-start justify-start mb-8">
                            <p className="text-xl font-semibold text-orange-600">Ways to Donate Monetarily</p>
                            <p className="text-sm font-light">Please select a donation option that’s most convenient for you. Thank you!</p>
                        </div>
                        <div className="w-full flex gap-4">
                            <Link to="/donate/monetary/gcash" className="w-44 h-20 rounded-xl shadow-sm bg-white transform transition-transform duration-300 hover:scale-105 cursor-pointer relative">
                                <img src="/gecash.jpg" alt="img" className="w-full h-full object-cover object-center rounded-xl" />
                            </Link>
                            <Link to="/donate/monetary/cash" className="w-44 h-20 rounded-xl bg-white shadow-sm  p-2 transform transition-transform duration-300 hover:scale-105 cursor-pointer relative">
                                <div className="w-full h-full flex items-center justify-center gap-1">
                                    <PhilippinePeso size={22} strokeWidth={3} className="text-green-700"/>
                                    <p className="text-lg font-semibold text-green-700">Cash</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Guest>
    )
}

export default MonetaryOption