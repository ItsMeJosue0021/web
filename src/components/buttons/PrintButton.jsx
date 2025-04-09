import { Printer } from "lucide-react";


const PrintButton = ({onView}) => {
    const preview = () => {
        onView();
    };

    return (
        <button onClick={preview} className="px-2 py-2 rounded bg-gray-100 hover:bg-gray-200 flex items-center gap-2 group">
            <Printer className="w-4 h-4 text-gray-600 group-hover:text-black" />
            <p className="text-xs font-medium text-gray-600 group-hover:text-black">Print</p>
        </button>
    );
}

export default PrintButton;