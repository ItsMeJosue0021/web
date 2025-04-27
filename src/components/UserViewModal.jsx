import React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import PrintButton from "./buttons/PrintButton";
import PrintPreview from "./PrintPreview";

const UserViewModal = ({ onClose, user }) => {
    if (!user) return null;

    return (
        <AnimatePresence>
            <motion.div 
            role="alert"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/10 z-50">
                <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
                    {/* User Header */}
                    <div className="flex justify-between items-center border-b pb-3">
                        <h2 className="text-md font-semibold text-gray-800">User Details</h2>
                        <button 
                            className="text-gray-600 hover:text-gray-800 text-xl px-3" 
                            onClick={onClose}
                        >
                            &times;
                        </button>
                    </div>

                    {/* User Information */}
                    <div className="mt-4 space-y-2 text-xs">
                        <p><span className="font-medium text-gray-700">Full Name:</span> {user.first_name} {user.middle_name} {user.last_name}</p>
                        <p><span className="font-medium text-gray-700">Address:</span> {user.email}</p>
                        <p><span className="font-medium text-gray-700">Date of Birth:</span> {user.contact_number}</p>
                        <p><span className="font-medium text-gray-700">Civil Status:</span> {user.username}</p>
                    </div>

                    <div className="mt-6 border-t pt-4 space-y-2 text-xs">
                        <h3 className="text-md font-semibold text-gray-800">User Address</h3>
                        <p>
                            <span className="font-medium text-gray-700">Address: </span>
                            <span>Block {user.block}{user.block ? ',' : ''} </span>
                            <span>Lot {user.lot}{user.lot ? ',' : ''} </span>
                            <span>{user.street}{user.street ? ',' : ''}</span>
                            <span>{user.subdivision}{user.subdivision ? ',' : ''} </span>
                            <span>{user.baranggy}{user.baranggy ? ',' : ''} </span>
                            <span>{user.city}{user.city ? ',' : ''} </span>
                            <span>{user.province}</span>
                        </p>
                    </div>

                    {/* Close Button */}
                    <div className="mt-5 flex justify-end gap-2">
                        <button 
                            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 text-xs rounded shadow-md"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
        
    );
};

export default UserViewModal;
