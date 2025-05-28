import React from "react";
import Guest from '../../layouts/Guest'
import { Link } from "react-router-dom";

const Goods = () => {
    return (
        <Guest>     
            <div className="bg-gray-50 h-screen w-full p-4">
                <div className="w-full max-w-[1200px] mx-auto h-full flex flex-col p-4 pt-24">
                    <Link to="/donate" className="px-4 py-1 mb-3 rounded border border-gray-200 w-fit text-xs text-gray-500">Back</Link>
                    <div className="w-full flex flex-col items-center justify-center">
                        <h1 className="text-start text-3xl font-bold text-orange-600">Donate Goods</h1>
                        <p className="text-start text-gray-600 text-xs font-light">
                            Your donations of essential items help support our communities and bring relief to those in need.
                        </p>
                        <p className="mt-8 text-lg text-center font-medium">You may drop off your donations at any of the following locations:</p>
                    </div>

                    


                    <div className="flex justify-center items-center gap-6 mt-8 ">  
                        <div className="w-fit flex flex-col items-center justify-center gap-4 p-8 rounded-xl shadow bg-white">
                            <p className="text-orange-500 text-2xl font-semibold">Main Address</p>
                            <p className="text-sm">B4 LOT6-6 FANTACY ROAD 3 TERESA PARK SUBD. PILAR LAS PINAS</p>
                        </div>

                        <div className="w-fit flex flex-col items-center justify-center gap-4 p-8 rounded-xl shadow bg-white">
                            <p className="text-orange-500 text-2xl  font-semibold">Satellite Address</p>
                            <p className="text-sm">BLOCK 20 LOT 15-A MINES VIEW TERESA PARK SUBD. PILAR LAS PINAS</p>
                        </div>
                    </div>
                    

                </div>
            </div>
        </Guest>
        
    )
}

export default Goods;