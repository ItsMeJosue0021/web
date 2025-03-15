const SuccesAlert = ({ message, onClose }) => {
  return (
    <div className="fixed top-0 left-0 z-50 w-full h-screen flex items-center justify-center p-4 bg-black/10" role="alert">
        <div className="bg-white rounded-lg p-6 flex flex-col justify-start gap-4">
            <h1 className="text-base font-semibold text-green-600">Success</h1>
            <p className="text-sm">{message}</p>
            <div>
                <button onClick={onClose} className="text-xs px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 border-0">Close</button>
            </div>
        </div>
    </div>
  );
}

export default SuccesAlert;