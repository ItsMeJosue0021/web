import React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import PrintButton from "./buttons/PrintButton";
import PrintPreview from "./PrintPreview";

const MemberViewModal = ({ onClose, member }) => {
    if (!member) return null;

    const [showPrintPreview, setShowPrintPreview] = useState(false);
        
    const handlePrintPreview = () => {
        setShowPrintPreview(true);
    }

    const emergency = member?.emergency_contact || {};

    const printData = {
        title: "Member Details",
        subtitle: "Membership Information",
    }

    return (
        <AnimatePresence>
            <motion.div 
            role="alert"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/10 z-50">
                {showPrintPreview && <PrintPreview onClose={() => setShowPrintPreview(false)} data={printData} />}
                <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
                    {/* Modal Header */}
                    <div className="flex justify-between items-center border-b pb-3">
                        <h2 className="text-lg font-semibold text-gray-800">Member Details</h2>
                        <button 
                            className="text-gray-600 hover:text-gray-800 text-xl px-3" 
                            onClick={onClose}
                        >
                            &times;
                        </button>
                    </div>

                    {/* Member Information */}
                    <div className="mt-4 space-y-2 text-xs">
                        <p><span className="font-medium text-gray-700">Full Name:</span> {member.first_name} {member.middle_name} {member.last_name}</p>
                        <p><span className="font-medium text-gray-700">Nickname:</span> {member.nick_name || "N/A"}</p>
                        <p><span className="font-medium text-gray-700">Address:</span> {member.address}</p>
                        <p><span className="font-medium text-gray-700">Date of Birth:</span> {member.dob}</p>
                        <p><span className="font-medium text-gray-700">Civil Status:</span> {member.civil_status}</p>
                        <p><span className="font-medium text-gray-700">Contact:</span> {member.contact_number}</p>
                        <p><span className="font-medium text-gray-700">Messenger:</span> 
                            <a 
                                href={`https://m.me/${member.fb_messenger_account}`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-orange-500 hover:underline ml-1"
                            >
                                {member.fb_messenger_account || "N/A"}
                            </a>
                        </p>
                    </div>

                    <div className="mt-6 border-t pt-4 space-y-2 text-xs">
                        <h3 className="text-md font-semibold text-gray-800">Emergency Contact</h3>
                        <p><span className="font-medium text-gray-700">Name:</span> {emergency.contact_person || "N/A"}</p>
                        <p><span className="font-medium text-gray-700">Address:</span> {emergency.address || "N/A"}</p>
                        <p><span className="font-medium text-gray-700">Contact:</span> {emergency.contact_number || "N/A"}</p>
                        <p><span className="font-medium text-gray-700">Relationship:</span> {emergency.relationship || "N/A"}</p>
                        <p><span className="font-medium text-gray-700">Messenger:</span> 
                            <a 
                                href={emergency.fb_messenger_account ? `https://m.me/${emergency.fb_messenger_account}` : "#"} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-orange-500 hover:underline ml-1"
                            >
                                {emergency.fb_messenger_account || "N/A"}
                            </a>
                        </p>
                    </div>

                    {/* Close Button */}
                    <div className="mt-5 flex justify-end gap-2">
                        <PrintButton onView={handlePrintPreview}/>
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

export default MemberViewModal;
