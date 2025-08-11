import { motion, AnimatePresence } from 'framer-motion';
import { Image } from "lucide-react";
import { useState } from 'react';
import { _post } from '../../api';  

const UpdateProfilePicModal = ({ id, setModal }) => {

    const [selectedFile, setSelectedFile] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append('image', selectedFile);
            const response = await _post(`/users/profile-picture/${id}`, formData, {
               headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.status === 200) {
                setModal(prev => ({...prev, updateProfilePic: false}));
                setIsSuccess(true);
                setSelectedFile(null);
            }
        } catch (error) {
            console.error("Error uploading file:", error);
        } finally {
            setSaving(false);
        }
    }

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
                className="bg-white rounded-xl h-auto flex flex-col w-fit justify-start gap-4 p-6"
                >
                    <div className="flex flex-col w-fit items-center justify-center">

                        {/* Hidden input + clickable label */}
                        <input
                            type="file"
                            id="fileUpload"
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"
                        />

                        <label
                        htmlFor="fileUpload"
                        className="w-80 h-72 rounded-lg border-dashed border-2 border-gray-300 hover:border-gray-400 group flex items-center justify-center cursor-pointer overflow-hidden relative"
                        >
                        {selectedFile ? (
                            <img
                            src={URL.createObjectURL(selectedFile)}
                            alt="Preview"
                            className="object-cover w-full h-full"
                            />
                        ) : (
                            <Image size={42} strokeWidth={1} className="text-gray-300 group-hover:text-gray-700" />
                        )}
                        </label>

                        {/* Buttons */}
                        <div className="w-full flex items-center justify-end gap-2 mt-4">
                            <button
                                className="px-4 py-2 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded"
                                onClick={() => handleSave()}
                            >
                                Save
                            </button>
                            <button
                                className="px-4 py-2 text-xs bg-gray-200 hover:bg-gray-300 rounded"
                                onClick={() => {
                                    setSelectedFile(null);
                                    setModal(prev => ({...prev, updateProfilePic: false}))
                                }}
                                
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

export default UpdateProfilePicModal;
