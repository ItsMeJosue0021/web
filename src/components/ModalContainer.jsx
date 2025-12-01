import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

const ModalContainer = ({children, isFull, close}) => {

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`fixed inset-0 z-50 p-5 ${isFull ? 'bg-white' : 'bg-black/50'}`}
            >
                <div className="w-full h-full flex flex-col overflow-auto">
                    <div className="w-full flex justify-end">
                        <X
                        onClick={close}
                        className={`w-6 h-6 ${isFull ? 'text-gray-500' : 'text-white'} hover:text-orange-500 cursor-pointer`}
                        />
                    </div>

                    <div className="w-full flex-1 flex justify-center py-4">
                        <div className="w-full max-w-5xl flex items-center justify-center">
                            {children}
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>

    )
}

export default ModalContainer;