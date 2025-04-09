import { motion, AnimatePresence } from 'framer-motion';

const SuccesAlert = ({ message, onClose }) => {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-0 left-0 z-50 w-full h-screen flex items-center justify-center p-4 bg-black/10"
        role="alert"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-lg p-6 flex flex-col justify-start gap-4"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <h1 className="text-base font-semibold text-green-600">Success</h1>
          <p className="text-sm">{message}</p>
          <div>
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
