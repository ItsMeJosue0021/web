import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

const ModalContainer = ({children, isFull, close}) => {

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`fixed w-screen h-screen flex flex-col items-start justify-center inset-0 z-50  p-5 overflow-auto ${isFull ? 'bg-white' : 'bg-black/50'}`}
            >
                 <div className="w-full flex items-center justify-end">
                    <X 
                        onClick={close}
                        className={`w-6 h-6 ${isFull ? 'text-gray-500' : 'text-white'} hover:text-orange-500 cursor-pointer`}
                    />
                </div>
                <div className="w-full h-full flex items-center justify-center">
                    {children}
                </div>
            </motion.div>
        </AnimatePresence>
    )
}

export default ModalContainer;