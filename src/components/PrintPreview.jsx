import Logo from "./Logo";
import { Printer, Download } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

const PrintPreview = ({onClose, data}) => {

  return (
    <AnimatePresence>
        <motion.div 
        role="alert"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose} className="fixed top-0 left-0 bg-black/40 w-screen h-screen">
            <div className="w-screen h-screen flex flex-col items-center justify-center z-50 overflow-scroll ">
                <div className="w-[800px] flex items-center justify-end gap-2 mb-2">
                    <button className="bg-white p-2 rounded">
                        <Printer className="w-4 h-4"/>
                    </button>
                    <button className="bg-white p-2 rounded">
                        <Download className="w-4 h-4"/>
                    </button>
                </div>
                <div className="bg-white w-[800px] h-[500px] shadow-md p-14 flex flex-col ">
                    <div className="flex items-start justify-between w-full h-auto">
                        <Logo/>
                        <div>
                            <h1 className="text-sm text-right font-semibold">{data.title}</h1>
                            <h2 className="text-xs text-right">{data.subtitle}</h2>
                        </div>
                    </div>
                    <div className="w-full h-80 flex items-center justify-center">
                        <p className="text-xs">Loading...</p>
                    </div>
                </div>
            </div>
        </motion.div>
    </AnimatePresence>
    
  );
}
export default PrintPreview;