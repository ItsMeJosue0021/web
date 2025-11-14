import Logo from "./Logo";
import { Printer, Download } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

const PrintPreview = ({onClose, data, pdfUrl}) => {

  return (
    <AnimatePresence>
        <motion.div 
        role="alert"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose} className="fixed top-0 left-0 bg-black/40 w-screen h-screen">
            <div className="w-full h-full flex flex-col items-center justify-center z-50 overflow-scroll p-4 ">
                <div className="bg-white w-full md:w-[1000px] h-[600px] shadow-md flex flex-col ">
                    <div className="w-full h-full flex items-center justify-center">
                        <iframe src={pdfUrl} className="w-full h-full"></iframe>
                    </div>
                </div>
            </div>
        </motion.div>
    </AnimatePresence>
    
  );
}
export default PrintPreview;