import React from 'react';
import Guest from '../../layouts/Guest'
import { Link } from 'react-router-dom';

const Option = () => {
    return (
        <Guest>
            <div className="bg-gray-50 h-screen w-full p-4">
                <div className="w-full h-full flex flex-col items-center justify-center gap-12">
                    <div>
                        <h1 className="text-center text-2xl font-bold text-orange-500 ">Donation Option</h1>
                        <p className="text-center text-gray-600 text-base font-light mt-1">Select how you would like to contribute to our cause.</p>
                    </div>
                    <div className="w-full flex items-start justify-center gap-6">
                        <div className="w-80 max-w-80 flex flex-col items-center justify-center gap-4 cursor-pointer">
                            <Link to="/donate/goods" className="h-64 min-w-80 w-80 rounded-2xl shadow bg-white transform transition-transform duration-300 hover:scale-105">
                                <img src="goods.jpg" alt="img" className="w-full h-full object-cover object-center rounded-2xl"/>
                            </Link>
                            <div className='w-full flex flex-col items-center justify-center'>
                                <p className="font-semibold text-lg">Donate Goods</p>
                                <p className="text-center text-sm text-gray-600 mb-4">
                                    Contribute essential items such as food, clothing, or school supplies.
                                </p>
                            </div>
                        </div>
                        
                       <div className="w-80 max-w-80 flex flex-col items-center justify-center gap-4 cursor-pointer">
                            <Link to="/donate/cash" className="h-64 min-w-80 w-80 rounded-2xl shadow bg-white transform transition-transform duration-300 hover:scale-105">
                                <img src="cash.jpg" alt="img" className="w-full h-full object-cover object-center rounded-2xl" />
                            </Link>
                            <div className='w-full flex flex-col items-center justify-center'>
                                <p className="font-semibold text-lg">Donate Cash</p>
                                <p className="text-center text-sm text-gray-600">
                                    Make a monetary donation to help fund our programs.
                                </p>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </Guest>
        
    )
}

export default Option;