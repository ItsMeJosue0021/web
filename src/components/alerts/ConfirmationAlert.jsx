const ConfirmationAlert = ({ onClose, onConfirm, title, message, isDelete, isDeleting }) => {
  return (
    <div className="fixed top-0 left-0 z-50 w-full h-screen flex items-center justify-center p-4 bg-black/10" role="alert">
        <div className="bg-white rounded-lg p-6 flex flex-col justify-start gap-4">
            <h1 className={`text-base font-semibold ${isDelete ? 'text-red-600' : 'text-green-600'}`}>{title}</h1>
            <p className="text-sm">{message}</p>
            <div className="flex items-center justify-end gap-2">
                {isDelete ? 
                    (
                        <button onClick={onConfirm} className="text-xs px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 border-0">{isDeleting ? 'Deleting..' : 'Delete'}</button>
                    ) : (
                        <button onClick={onConfirm} className="text-xs px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 border-0">Confirm</button>
                    )}
                <button onClick={onClose} className="text-xs px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 border-0">Close</button>
            </div>
        </div>
    </div>
  );
}

export default ConfirmationAlert;