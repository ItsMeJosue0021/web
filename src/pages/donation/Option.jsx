import React from 'react';
import Guest from '../../layouts/Guest'
import { Link } from 'react-router-dom';

const Option = () => {
    return (
        <Guest>
            <div className="bg-gray-50 h-screen w-full p-4">
                <div className="w-full h-full flex flex-col items-center justify-center gap-12">
                    {/* <div>
                        <h1 className="text-center text-xl font-bold text-orange-500 ">Make a Difference Your Way</h1>
                        <p className="text-center text-gray-600 text-sm font-light">Select how you would like to contribute to our cause.</p>
                    </div> */}
                    <div className="w-full pt-10 md:pt-0 flex flex-col md:flex-row items-center md:items-start justify-center gap-6">
                        <Link to="/donate/goods" className="w-80 max-w-80 group rounded-2xl p-5 border md:border-transparent hover:border-gray-300 flex flex-col items-center justify-center gap-4 cursor-pointer">
                            <div className="h-40 min-w-40 w-40 rounded-full shadow bg-white transform transition-transform duration-300 group-hover:scale-105">
                                <img src="goods.jpg" alt="img" className="w-full h-full object-cover object-center rounded-full"/>
                            </div>
                            <div className='w-full flex flex-col items-center justify-center'>
                                <p className="font-semibold text-lg text-black">Donate Goods</p>
                                <p className="text-center font-light text-sm text-gray-600 mb-4">
                                    Contribute essential items such as food, clothing, or school supplies.
                                </p>
                            </div>
                        </Link>
                        
                        <Link to="/donate/monetary" className="w-80 max-w-80 group rounded-2xl p-5 border md:border-transparent hover:border-gray-300 flex flex-col items-center justify-center gap-4 cursor-pointer">
                            <div className="h-40 min-w-40 w-40 rounded-full shadow bg-white transform transition-transform duration-300 group-hover:scale-105">
                                <img src="cash.jpg" alt="img" className="w-full h-full object-cover object-center rounded-full" />
                            </div>
                            <div className='w-full flex flex-col items-center justify-center'>
                                <p className="font-semibold text-lg text-black">Donate Cash</p>
                                <p className="text-center font-light text-sm text-gray-600">
                                    Make a monetary donation to help fund our programs.
                                </p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </Guest>
        
    )
}

export default Option;