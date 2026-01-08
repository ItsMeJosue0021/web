import { motion, AnimatePresence } from 'framer-motion';
import { FaRegCircleCheck } from "react-icons/fa6";

const SuccesAlert = ({ message, onClose }) => {
  return (
    <AnimatePresence>
        <motion.div
          className="fixed inset-0 z-[999] w-full h-screen flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
          role="alert"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
            <motion.div
              className="w-full max-w-[420px] bg-white rounded-2xl p-8 shadow-2xl border border-gray-100 flex flex-col gap-4 text-center"
              initial={{ y: 30, scale: 0.9, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 30, scale: 0.9, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 15
              }}
            >
              <div className="flex items-center justify-center">
                <motion.div
                  className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center"
                  initial={{ scale: 0.6, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 20
                  }}
                >
                  <FaRegCircleCheck size={38} className="text-green-600" />
                </motion.div>
              </div>
              <div className="flex flex-col gap-1">
                <h1 className="text-lg font-semibold text-gray-900">Success</h1>
                <p className="text-sm text-gray-600">{message}</p>
              </div>
              <div className="w-full flex items-center justify-center pt-2">
                <button
                  onClick={onClose}
                  className="text-xs px-5 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 border-0 shadow-sm"
                >
                  Close
                </button>
              </div>
            </motion.div>
        </motion.div>
    </AnimatePresence>
  );
};

export default SuccesAlert;
