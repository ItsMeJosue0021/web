import { motion, AnimatePresence } from 'framer-motion';
import { _post } from "../../api";
import { IoMdClose } from "react-icons/io";
import { useState } from 'react';
import { div } from 'framer-motion/client';

const UpdateProfileModal = ({data, setModal, onSave}) => {

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
    }

    const handleSave = async () => {
        setSaving(true);    
        try {
            const response = await _post(`/users/profile-update/${data.id}`, profileData);
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
    }

    return (
        <AnimatePresence>
            <motion.div 
            role="alert"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-screen h-screen flex items-center justify-center bg-black/40 fixed top-0 left-0 z-40 cursor-pointer px-5">
                <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-lg h-auto flex flex-col w-fit justify-start gap-4">
                    <div className='min-w-[600px] w-fit p-10 py-8'>
                        <div className='flex items-center justify-between mb-4'>
                            <p className="text-base font-semibold">Update your profile information</p>
                            <IoMdClose size={18} onClick={() => {
                                setModal(prev => ({...prev, updateProfileInfo: false}));
                            }}/>
                        </div>
                        <div className='flex flex-col gap-3'>
                            <div className='flex items-center justify-between gap-4'>
                                <label className='text-xs font-medium text-gray-600'>Username</label>
                                <div className='flex flex-col'>
                                    <input 
                                        type="text" 
                                        className='text-[11px] w-80 max-w-80 rounded-md px-4 py-2 border border-gray-200 focus:outline-none' 
                                        placeholder='@username'
                                        value={profileData.username}
                                        name='username'
                                        onChange={handleInputChange}
                                    />
                                    {errors.username && (
                                        <span className="text-red-500 text-[9px] px-2">{errors.username[0]}</span>
                                    )}
                                </div>
                            </div>
                            <div className='flex items-center justify-between gap-4'>
                                <label className='text-xs font-medium text-gray-600'>Email</label>
                                <div className='flex flex-col'>
                                    <input 
                                        type="text" 
                                        className='text-[11px] w-80 max-w-80 rounded-md px-4 py-2 border border-gray-200 focus:outline-none' 
                                        placeholder='youremail@sample.com'
                                        value={profileData.email}
                                        name='email'
                                        onChange={handleInputChange}
                                    />
                                    {errors.email && (
                                        <span className="text-red-500 text-[9px] px-2">{errors.email[0]}</span>
                                    )}
                                </div>
                            </div>
                            <div className='flex items-center justify-between gap-4'>
                                <label className='text-xs font-medium text-gray-600'>Contact No.</label>
                                <div className='flex flex-col'>
                                    <input 
                                        type="text" 
                                        className='text-[11px] w-80 max-w-80 rounded-md px-4 py-2 border border-gray-200 focus:outline-none' 
                                        placeholder='09-xxx-xxx-xxx'
                                        value={profileData.contactNo}
                                        name='contactNo'
                                        onChange={handleInputChange}
                                    />
                                    {errors.contactNo && (
                                        <span className="text-red-500 text-[9px] px-2">{errors.contactNo[0]}</span>
                                    )}
                                </div>
                            </div>
                            <div className='mt-4'>
                                <p className='text-xs font-medium text-gray-600 pb-1 border-b border-gray-100 mb-4'>Address</p>
                                <div className='flex items-center gap-4 mb-4'>
                                    <div className='flex flex-col'>
                                        <label className='text-[11px] text-gray-500'>Block</label>
                                        <input 
                                            type="text" 
                                            className='text-[10px] w-24  max-w-24 rounded-md px-4 py-2 border border-gray-200 focus:outline-none' 
                                            placeholder='Block'
                                            value={profileData.block}
                                            name='block'
                                            onChange={handleInputChange}
                                        />
                                        {errors.block && (
                                            <span className="text-red-500 text-[9px]">{errors.block[0]}</span>
                                        )}
                                    </div>
                                    <div className='flex flex-col'>
                                        <label className='text-[11px] text-gray-500'>Lot</label>
                                        <input 
                                            type="text" 
                                            className='text-[10px] w-24 max-w-24 rounded-md px-4 py-2 border border-gray-200 focus:outline-none' 
                                            placeholder='Lot'
                                            value={profileData.lot}
                                            name='lot'
                                            onChange={handleInputChange}
                                        />
                                        {errors.lot && (
                                            <span className="text-red-500 text-[9px]">{errors.lot[0]}</span>
                                        )}
                                    </div>
                                    <div className='flex flex-col'>
                                        <label className='text-[11px] text-gray-500'>Street</label>
                                        <input 
                                            type="text" 
                                            className='text-[10px] w-30 max-w-30 rounded-md px-4 py-2 border border-gray-200 focus:outline-none' 
                                            placeholder='Street'
                                            value={profileData.street}
                                            name='street'
                                            onChange={handleInputChange}
                                        />
                                        {errors.street && (
                                            <span className="text-red-500 text-[9px]">{errors.street[0]}</span>
                                        )}
                                    </div>
                                    <div className='flex flex-col'>
                                        <label className='text-[11px] text-gray-500'>Subdivision</label>
                                        <input 
                                            type="text" 
                                            className='text-[10px] w-30 max-w-30 rounded-md px-4 py-2 border border-gray-200 focus:outline-none' 
                                            placeholder='Subdivision'
                                            value={profileData.subdivision}
                                            name='subdivision'
                                            onChange={handleInputChange}
                                        />
                                        {errors.subdivision && (
                                            <span className="text-red-500 text-[9px]">{errors.subdivision[0]}</span>
                                        )}
                                    </div>
                                </div>
                                <div className='flex items-center gap-4'>
                                    <div className='flex flex-col'>
                                        <label className='text-[11px] text-gray-500'>Barangay</label>
                                        <input 
                                            type="text" 
                                            className='text-[10px] w-40 max-w-40 rounded-md px-4 py-2 border border-gray-200 focus:outline-none' 
                                            placeholder='Barangay'
                                            value={profileData.barangay}
                                            name='barangay'
                                            onChange={handleInputChange}
                                        />
                                        {errors.barangay && (
                                            <span className="text-red-500 text-[9px]">{errors.barangay[0]}</span>
                                        )}
                                    </div>
                                    <div className='flex flex-col'>
                                        <label className='text-[11px] text-gray-500'>City</label>
                                        <input 
                                            type="text" 
                                            className='text-[10px] w-40 max-w-40 rounded-md px-4 py-2 border border-gray-200 focus:outline-none' 
                                            placeholder='City'
                                            value={profileData.city}
                                            name='city'
                                            onChange={handleInputChange}
                                        />
                                        {errors.city && (
                                            <span className="text-red-500 text-[9px]">{errors.city[0]}</span>
                                        )}
                                    </div>
                                    <div className='flex flex-col'>
                                        <label className='text-[11px] text-gray-500'>Province</label>
                                        <input 
                                            type="text" 
                                            className='text-[10px] w-40 max-w-40 rounded-md px-4 py-2 border border-gray-200 focus:outline-none' 
                                            placeholder='Province'
                                            value={profileData.province}
                                            name='province'
                                            onChange={handleInputChange}
                                        />
                                        {errors.province && (
                                            <span className="text-red-500 text-[9px]">{errors.province[0]}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                       
                        
                        <div className="w-full flex items-center justify-end gap-2 mt-6">
                            <button
                                className="px-4 py-1.5 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded"
                                onClick={() => {
                                    handleSave();
                                }}
                            >
                                {saving ? (
                                    <div className='flex items-center gap-2'>
                                        <div className='animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full'></div>
                                        <p>Saving</p>
                                    </div>) 
                                    : 'Save'
                                }
                            </button>
                            <button
                                className="px-4 py-1.5 text-xs bg-gray-200 hover:bg-gray-300 rounded"
                                onClick={() => {
                                    setModal(prev => ({...prev, updateProfileInfo: false}))
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

export default UpdateProfileModal;