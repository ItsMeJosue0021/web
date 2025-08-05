import { motion, AnimatePresence } from 'framer-motion';
import { Image } from "lucide-react";

const UpdateProfilePicModal = ({ data, setSelectedFile, selectedFile, setModal, handleFileChange }) => {
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
                className="bg-white rounded-lg h-auto flex flex-col w-fit justify-start gap-4"
                >
                    <div className="flex flex-col w-fit items-center justify-center p-4">

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
                                onClick={() => {
                                // upload logic here
                                }}
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
