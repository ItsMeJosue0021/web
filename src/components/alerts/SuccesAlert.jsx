import { motion, AnimatePresence } from 'framer-motion';
import { FaRegCircleCheck } from "react-icons/fa6";

const SuccesAlert = ({ message, onClose }) => {
  return (
    <AnimatePresence>
        <motion.div
          className="fixed top-0 left-0 z-[999] w-full h-screen flex items-center justify-center p-4 bg-black/10"
          role="alert"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
            <motion.div
              className="bg-white rounded-3xl p-10 flex flex-col justify-start gap-4"
              initial={{ y: 50, scale: 0.8, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 50, scale: 0.8, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 15
              }}
            >
              <div className="flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 20
                  }}
                >
                  <FaRegCircleCheck size={65} className="text-green-500" />
                </motion.div>
            </div>
              <h1 className="w-full text-center text-xl font-semibold text-green-600">Success</h1>
              <p className="text-sm">{message}</p>
              <div className='w-full flex items-center justify-center'>
                <button
                  onClick={onClose}
                  className="text-xs px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 border-0"
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
