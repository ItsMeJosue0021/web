import { X } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

const EventDetailsModal = ({ event, onClose }) => {
    return (
        <AnimatePresence>
            <motion.div 
             role="alert"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="w-screen h-screen fixed top-0 left-0 z-50 bg-black/20 cursor-pointer px-5 flex items-center justify-center">
                <div className="w-[700px] h-[400px] bg-white rounded-lg flex items-end flex-col">
                    <div className="p-3 ">
                        <button onClick={onClose} className="p-1 hover:bg-gray-200"> 
                            <X className="w-4 h-4 text-gray-500 cursor-pointer "/>
                        </button>
                    </div>
                    <div className="flex items-center justify-center flex-col h-full w-full">
                        <p className="text-xs"> Loading details..</p>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
        
    )
}

export default EventDetailsModal;