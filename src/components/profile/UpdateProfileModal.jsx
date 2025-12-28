import { motion, AnimatePresence } from 'framer-motion';
import { _post } from "../../api";
import { X } from "lucide-react";
import { useState } from 'react';

const UpdateProfileModal = ({ data, setModal, onSave }) => {
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState([]);
    const [profileData, setProfileData] = useState({
        username: data.username || '',
        email: data.email || '',
        contactNo: data.contactNumber || '',
        block: data.address?.block || '',
        lot: data.address?.lot || '',
        street: data.address?.street || '',
        subdivision: data.address?.subdivision || '',
        barangay: data.address?.barangay || '',
        city: data.address?.city || '',
        province: data.address?.province || ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSave = async () => {
        setSaving(true);    
        try {
            await _post(`/users/profile-update/${data.id}`, profileData);
            onSave();
            setErrors([]);
            setModal(prev => ({...prev, updateProfileInfo: false}));
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            }
        } finally {
            setSaving(false);
        }
    };

    const closeModal = () => setModal(prev => ({ ...prev, updateProfileInfo: false }));

    const inputClass = "text-[11px] w-full rounded-md px-4 py-2 border border-gray-200 focus:outline-none focus:border-orange-400 placeholder:text-gray-300";
    const labelClass = "text-xs font-medium text-gray-600 md:min-w-32";
    const errorClass = "text-red-500 text-[10px]";

    return (
        <AnimatePresence>
            <motion.div 
                role="alert"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-screen h-screen flex items-center justify-center bg-black/40 fixed top-0 left-0 z-40 cursor-pointer px-3 md:px-5"
                onClick={closeModal}
            >
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-xl h-auto flex flex-col w-full max-w-3xl justify-start gap-4 shadow-lg max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className='w-full p-8 pb-6 border-b border-gray-100 flex items-start justify-between'>
                        <div className="flex flex-col gap-1">
                            <p className="text-base font-semibold text-gray-900">Update profile information</p>
                            <p className="text-[11px] text-gray-500">Keep your contact details current so we can reach you.</p>
                        </div>
                        <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                            <X size={18} />
                        </button>
                    </div>

                    <div className='w-full px-8 pb-2 flex flex-col gap-4'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className="flex flex-col gap-1">
                                <label className={labelClass}>Username</label>
                                <input 
                                    type="text" 
                                    className={inputClass}
                                    placeholder='@username'
                                    value={profileData.username}
                                    name='username'
                                    onChange={handleInputChange}
                                />
                                {errors.username && (
                                    <span className={errorClass}>{errors.username[0]}</span>
                                )}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className={labelClass}>Email</label>
                                <input 
                                    type="text" 
                                    className={inputClass}
                                    placeholder='youremail@sample.com'
                                    value={profileData.email}
                                    name='email'
                                    onChange={handleInputChange}
                                />
                                {errors.email && (
                                    <span className={errorClass}>{errors.email[0]}</span>
                                )}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className={labelClass}>Contact No.</label>
                                <input 
                                    type="text" 
                                    className={inputClass}
                                    placeholder='09-xxx-xxx-xxx'
                                    value={profileData.contactNo}
                                    name='contactNo'
                                    onChange={handleInputChange}
                                />
                                {errors.contactNo && (
                                    <span className={errorClass}>{errors.contactNo[0]}</span>
                                )}
                            </div>
                        </div>

                        <div className='mt-2 flex flex-col gap-3'>
                            <p className='text-xs font-semibold text-gray-700'>Address</p>
                            <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                                <div className='flex flex-col gap-1'>
                                    <label className='text-[11px] text-gray-500'>Block</label>
                                    <input 
                                        type="text" 
                                        className={inputClass}
                                        placeholder='Block'
                                        value={profileData.block}
                                        name='block'
                                        onChange={handleInputChange}
                                    />
                                    {errors.block && (
                                        <span className={errorClass}>{errors.block[0]}</span>
                                    )}
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <label className='text-[11px] text-gray-500'>Lot</label>
                                    <input 
                                        type="text" 
                                        className={inputClass}
                                        placeholder='Lot'
                                        value={profileData.lot}
                                        name='lot'
                                        onChange={handleInputChange}
                                    />
                                    {errors.lot && (
                                        <span className={errorClass}>{errors.lot[0]}</span>
                                    )}
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <label className='text-[11px] text-gray-500'>Street</label>
                                    <input 
                                        type="text" 
                                        className={inputClass}
                                        placeholder='Street'
                                        value={profileData.street}
                                        name='street'
                                        onChange={handleInputChange}
                                    />
                                    {errors.street && (
                                        <span className={errorClass}>{errors.street[0]}</span>
                                    )}
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <label className='text-[11px] text-gray-500'>Subdivision</label>
                                    <input 
                                        type="text" 
                                        className={inputClass}
                                        placeholder='Subdivision'
                                        value={profileData.subdivision}
                                        name='subdivision'
                                        onChange={handleInputChange}
                                    />
                                    {errors.subdivision && (
                                        <span className={errorClass}>{errors.subdivision[0]}</span>
                                    )}
                                </div>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                                <div className='flex flex-col gap-1'>
                                    <label className='text-[11px] text-gray-500'>Barangay</label>
                                    <input 
                                        type="text" 
                                        className={inputClass}
                                        placeholder='Barangay'
                                        value={profileData.barangay}
                                        name='barangay'
                                        onChange={handleInputChange}
                                    />
                                    {errors.barangay && (
                                        <span className={errorClass}>{errors.barangay[0]}</span>
                                    )}
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <label className='text-[11px] text-gray-500'>City</label>
                                    <input 
                                        type="text" 
                                        className={inputClass}
                                        placeholder='City'
                                        value={profileData.city}
                                        name='city'
                                        onChange={handleInputChange}
                                    />
                                    {errors.city && (
                                        <span className={errorClass}>{errors.city[0]}</span>
                                    )}
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <label className='text-[11px] text-gray-500'>Province</label>
                                    <input 
                                        type="text" 
                                        className={inputClass}
                                        placeholder='Province'
                                        value={profileData.province}
                                        name='province'
                                        onChange={handleInputChange}
                                    />
                                    {errors.province && (
                                        <span className={errorClass}>{errors.province[0]}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full flex items-center justify-end gap-2 px-8 pb-6">
                        <button
                            className="px-4 py-2 text-xs bg-orange-50 hover:bg-orange-100 text-orange-600 rounded"
                            onClick={closeModal}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 text-xs bg-orange-500 hover:bg-orange-600 text-white rounded shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving ? (
                                <div className='flex items-center gap-2'>
                                    <div className='animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full'></div>
                                    <p>Saving</p>
                                </div>
                            ) : 'Save'}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default UpdateProfileModal;
