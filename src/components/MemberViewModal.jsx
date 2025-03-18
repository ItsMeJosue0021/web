import React from "react";

const MemberViewModal = ({ onClose, member }) => {
    if (!member) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/10 z-50">
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
                <div className="mt-4 space-y-2">
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

                <div className="mt-6 border-t pt-4 space-y-2">
                    <h3 className="text-md font-semibold text-gray-800">Emergency Contact</h3>
                    <p><span className="font-medium text-gray-700">Name:</span> {member.emergency_contact.contact_person}</p>
                    <p><span className="font-medium text-gray-700">Address:</span> {member.emergency_contact.address}</p>
                    <p><span className="font-medium text-gray-700">Contact:</span> {member.emergency_contact.contact_number}</p>
                    <p><span className="font-medium text-gray-700">Relationship:</span> {member.emergency_contact.relationship}</p>
                    <p><span className="font-medium text-gray-700">Messenger:</span> 
                        <a 
                            href={`https://m.me/${member.emergency_contact.fb_messenger_account}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-orange-500 hover:underline ml-1"
                        >
                            {member.emergency_contact.fb_messenger_account || "N/A"}
                        </a>
                    </p>
                </div>

                {/* Close Button */}
                <div className="mt-5 flex justify-end">
                    <button 
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md shadow-md"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MemberViewModal;
