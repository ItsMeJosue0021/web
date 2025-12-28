import { motion, AnimatePresence } from 'framer-motion';
import { Image, X } from "lucide-react";
import { useState, useContext } from 'react';
import { _post } from '../../api';  
import { AuthContext } from "../../AuthProvider";

const UpdateProfilePicModal = ({ id, setModal, onSuccess }) => {
    const { refreshUser } = useContext(AuthContext);

    const [selectedFile, setSelectedFile] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setError(null);
        }
    };

    const handleSave = async () => {
        if (!selectedFile) {
            setError("Please select an image to upload.");
            return;
        }
        setSaving(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('image', selectedFile);
            const response = await _post(`/users/profile-picture/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.status === 200) {
                setModal(prev => ({ ...prev, updateProfilePic: false }));
                setSelectedFile(null);
                refreshUser();
                onSuccess();
            }
        } catch (err) {
            console.error("Error uploading file:", err);
            setError("Upload failed. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const closeModal = () => {
        setSelectedFile(null);
        setModal(prev => ({ ...prev, updateProfilePic: false }));
    };

    return (
        <AnimatePresence>
            <motion.div
                role="alert"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-screen h-screen flex items-center justify-center bg-black/40 fixed top-0 left-0 z-40 cursor-pointer px-5"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-xl h-auto flex flex-col w-full md:max-w-md justify-start gap-4 p-6 shadow-lg"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col">
                            <p className="text-sm font-semibold text-gray-800">Update Profile Picture</p>
                            <p className="text-[11px] text-gray-500">Upload a clear headshot. JPG or PNG up to 5MB.</p>
                        </div>
                        <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                            <X size={16} />
                        </button>
                    </div>

                    <div className="w-full flex flex-col items-center justify-center gap-3">
                        <input
                            type="file"
                            id="fileUpload"
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"
                        />

                        <label
                            htmlFor="fileUpload"
                            className="w-full max-w-xs sm:max-w-sm h-72 rounded-lg border-dashed border-2 border-gray-300 hover:border-orange-400 group flex items-center justify-center cursor-pointer overflow-hidden relative bg-orange-50/40"
                        >
                            {selectedFile ? (
                                <img
                                    src={URL.createObjectURL(selectedFile)}
                                    alt="Preview"
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <Image size={42} strokeWidth={1} className="text-orange-300 group-hover:text-orange-500" />
                                    <span className="text-[11px] text-gray-500">Click to upload</span>
                                </div>
                            )}
                        </label>
                        {error && <p className="text-[11px] text-red-500">{error}</p>}

                        <div className="w-full flex items-center justify-end gap-2 mt-1">
                            <button
                                className="px-4 py-2 text-xs bg-orange-500 hover:bg-orange-600 text-white rounded shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                                onClick={handleSave}
                                disabled={saving}
                            >
                                {saving ? "Saving..." : "Save"}
                            </button>
                            <button
                                className="px-4 py-2 text-xs bg-gray-200 hover:bg-gray-300 rounded"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default UpdateProfilePicModal;
