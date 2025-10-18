
import Guest from '../../layouts/Guest'
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';


const SuccessGCash = () => {
    return (
        <Guest>
            <div className="bg-gray-50 h-screen w-full p-4 ">
                <div className="w-full max-w-[1200px] mx-auto h-full flex flex-col p-4 pt-24">
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
                        <h2 className="text-xl font-semibold text-green-700">Donation Successful!</h2>
                        <p className="text-sm text-gray-600 max-w-md">
                            Your donation has been submitted successfully. We truly appreciate your support
                            and generosity!
                        </p>
                        </div>

                        <div className="flex flex-col items-center gap-3 mt-6">
                            <Link
                                to="/donate"
                                className="px-6 py-2 text-xs rounded-md bg-orange-500 hover:bg-orange-600 text-white hover:text-white"
                            >
                                Make Another Donation
                            </Link>

                            <Link
                                to="/"
                                className="text-xs text-gray-600 hover:underline"
                            >
                                Back to Home
                            </Link>
                        </div>
                    </div>
                  
                </div>
            </div>
        </Guest>
    )
}

export default SuccessGCash