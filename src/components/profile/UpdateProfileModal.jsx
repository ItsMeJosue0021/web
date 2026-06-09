import { motion, AnimatePresence } from 'framer-motion';
import { _post } from "../../api";
import { X } from "lucide-react";
import { useEffect, useState } from 'react';

const PSGC_API_BASE = "https://psgc.cloud/api/v2";

const normalizePsgcCollection = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.items)) return payload.items;
    if (Array.isArray(payload?.results)) return payload.results;
    return [];
};

const getPsgcCode = (item) => item?.code || item?.psgc_code || item?.id || "";
const getPsgcName = (item) => item?.name || item?.official_name || "";

const UpdateProfileModal = ({ data, setModal, onSave }) => {
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [barangays, setBarangays] = useState([]);
    const [locationsLoading, setLocationsLoading] = useState({
        provinces: false,
        cities: false,
        barangays: false,
    });
    const [locationError, setLocationError] = useState("");
    const [profileData, setProfileData] = useState({
        username: data.username || '',
        email: data.email || '',
        contactNo: data.contactNumber || '',
        addressLine: [
            data.address?.block,
            data.address?.lot,
            data.address?.street,
            data.address?.subdivision,
        ].filter(Boolean).join(', '),
        provinceCode: '',
        cityCode: '',
        barangayCode: '',
        barangay: data.address?.barangay || '',
        city: data.address?.city || '',
        province: data.address?.province || ''
    });

    useEffect(() => {
        const fetchProvinces = async () => {
            setLocationsLoading((prev) => ({ ...prev, provinces: true }));
            setLocationError("");

            try {
                const response = await fetch(`${PSGC_API_BASE}/provinces?per_page=100`);
                const payload = await response.json();
                setProvinces(normalizePsgcCollection(payload));
            } catch (error) {
                console.error("Unable to load provinces:", error);
                setLocationError("Unable to load Philippine address options. You can still save your current profile details.");
            } finally {
                setLocationsLoading((prev) => ({ ...prev, provinces: false }));
            }
        };

        fetchProvinces();
    }, []);

    useEffect(() => {
        if (!profileData.province || profileData.provinceCode || provinces.length === 0) return;

        const matchedProvince = provinces.find((province) =>
            getPsgcName(province).toLowerCase() === profileData.province.toLowerCase()
        );

        if (matchedProvince) {
            setProfileData((prev) => ({ ...prev, provinceCode: getPsgcCode(matchedProvince) }));
        }
    }, [profileData.province, profileData.provinceCode, provinces]);

    useEffect(() => {
        if (!profileData.provinceCode) {
            setCities([]);
            return;
        }

        const fetchCities = async () => {
            setLocationsLoading((prev) => ({ ...prev, cities: true }));
            setLocationError("");

            try {
                const response = await fetch(`${PSGC_API_BASE}/provinces/${encodeURIComponent(profileData.provinceCode)}/cities-municipalities?per_page=500`);
                const payload = await response.json();
                setCities(normalizePsgcCollection(payload));
            } catch (error) {
                console.error("Unable to load cities/municipalities:", error);
                setLocationError("Unable to load cities or municipalities for the selected province.");
            } finally {
                setLocationsLoading((prev) => ({ ...prev, cities: false }));
            }
        };

        fetchCities();
    }, [profileData.provinceCode]);

    useEffect(() => {
        if (!profileData.city || profileData.cityCode || cities.length === 0) return;

        const matchedCity = cities.find((city) =>
            getPsgcName(city).toLowerCase() === profileData.city.toLowerCase()
        );

        if (matchedCity) {
            setProfileData((prev) => ({ ...prev, cityCode: getPsgcCode(matchedCity) }));
        }
    }, [cities, profileData.city, profileData.cityCode]);

    useEffect(() => {
        if (!profileData.cityCode) {
            setBarangays([]);
            return;
        }

        const fetchBarangays = async () => {
            setLocationsLoading((prev) => ({ ...prev, barangays: true }));
            setLocationError("");

            try {
                const response = await fetch(`${PSGC_API_BASE}/cities-municipalities/${encodeURIComponent(profileData.cityCode)}/barangays?per_page=1000`);
                const payload = await response.json();
                setBarangays(normalizePsgcCollection(payload));
            } catch (error) {
                console.error("Unable to load barangays:", error);
                setLocationError("Unable to load barangays for the selected city or municipality.");
            } finally {
                setLocationsLoading((prev) => ({ ...prev, barangays: false }));
            }
        };

        fetchBarangays();
    }, [profileData.cityCode]);

    useEffect(() => {
        if (!profileData.barangay || profileData.barangayCode || barangays.length === 0) return;

        const matchedBarangay = barangays.find((barangay) =>
            getPsgcName(barangay).toLowerCase() === profileData.barangay.toLowerCase()
        );

        if (matchedBarangay) {
            setProfileData((prev) => ({ ...prev, barangayCode: getPsgcCode(matchedBarangay) }));
        }
    }, [barangays, profileData.barangay, profileData.barangayCode]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleProvinceChange = (e) => {
        const selectedProvince = provinces.find((province) => getPsgcCode(province) === e.target.value);
        setProfileData((prev) => ({
            ...prev,
            provinceCode: e.target.value,
            province: selectedProvince ? getPsgcName(selectedProvince) : "",
            cityCode: "",
            barangayCode: "",
            city: "",
            barangay: "",
        }));
        setCities([]);
        setBarangays([]);
    };

    const handleCityChange = (e) => {
        const selectedCity = cities.find((city) => getPsgcCode(city) === e.target.value);
        setProfileData((prev) => ({
            ...prev,
            cityCode: e.target.value,
            city: selectedCity ? getPsgcName(selectedCity) : "",
            barangayCode: "",
            barangay: "",
        }));
        setBarangays([]);
    };

    const handleBarangayChange = (e) => {
        const selectedBarangay = barangays.find((barangay) => getPsgcCode(barangay) === e.target.value);
        setProfileData((prev) => ({
            ...prev,
            barangayCode: e.target.value,
            barangay: selectedBarangay ? getPsgcName(selectedBarangay) : "",
        }));
    };

    const handleSave = async () => {
        setSaving(true);    
        try {
            const payload = {
                ...profileData,
                block: "",
                lot: "",
                street: profileData.addressLine,
                subdivision: "",
            };
            delete payload.addressLine;
            delete payload.provinceCode;
            delete payload.cityCode;
            delete payload.barangayCode;

            await _post(`/users/profile-update/${data.id}`, payload);
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
                                <div className='flex flex-col gap-1 col-span-2 md:col-span-4'>
                                    <label className='text-[11px] text-gray-500'>Address line</label>
                                    <input
                                        type="text"
                                        className={inputClass}
                                        placeholder='Block, lot, street, subdivision'
                                        value={profileData.addressLine}
                                        name='addressLine'
                                        onChange={handleInputChange}
                                    />
                                    {(errors.block || errors.lot || errors.street || errors.subdivision) && (
                                        <span className={errorClass}>
                                            {errors.block?.[0] || errors.lot?.[0] || errors.street?.[0] || errors.subdivision?.[0]}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                                <div className='flex flex-col gap-1'>
                                    <label className='text-[11px] text-gray-500'>Province</label>
                                    <select
                                        className={inputClass}
                                        value={profileData.provinceCode}
                                        onChange={handleProvinceChange}
                                        disabled={locationsLoading.provinces}
                                    >
                                        <option value="">
                                            {locationsLoading.provinces ? "Loading provinces..." : profileData.province || "Select province"}
                                        </option>
                                        {provinces.map((province) => (
                                            <option key={getPsgcCode(province)} value={getPsgcCode(province)}>
                                                {getPsgcName(province)}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.province && (
                                        <span className={errorClass}>{errors.province[0]}</span>
                                    )}
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <label className='text-[11px] text-gray-500'>City / Municipality</label>
                                    <select
                                        className={inputClass}
                                        value={profileData.cityCode}
                                        onChange={handleCityChange}
                                        disabled={!profileData.provinceCode || locationsLoading.cities}
                                    >
                                        <option value="">
                                            {locationsLoading.cities ? "Loading cities..." : profileData.city || "Select city or municipality"}
                                        </option>
                                        {cities.map((city) => (
                                            <option key={getPsgcCode(city)} value={getPsgcCode(city)}>
                                                {getPsgcName(city)}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.city && (
                                        <span className={errorClass}>{errors.city[0]}</span>
                                    )}
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <label className='text-[11px] text-gray-500'>Barangay</label>
                                    <select
                                        className={inputClass}
                                        value={profileData.barangayCode}
                                        onChange={handleBarangayChange}
                                        disabled={!profileData.cityCode || locationsLoading.barangays}
                                    >
                                        <option value="">
                                            {locationsLoading.barangays ? "Loading barangays..." : profileData.barangay || "Select barangay"}
                                        </option>
                                        {barangays.map((barangay) => (
                                            <option key={getPsgcCode(barangay)} value={getPsgcCode(barangay)}>
                                                {getPsgcName(barangay)}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.barangay && (
                                        <span className={errorClass}>{errors.barangay[0]}</span>
                                    )}
                                </div>
                            </div>
                            {locationError && (
                                <p className="text-[11px] text-amber-600">{locationError}</p>
                            )}
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
