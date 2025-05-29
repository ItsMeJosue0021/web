import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import Guest from "../../layouts/Guest";
import { _post } from "../../api";
import { toast } from 'react-toastify';
import { Link } from "react-router-dom";
import Logo from "../../components/Logo";
import TextInput from "../../components/inputs/TextInput";
import ConfirmationAlert from "../../components/alerts/ConfirmationAlert";

import banner from "../../assets/img/banner.png";
import activity1 from "../../assets/img/activity1.png";
import activity2 from "../../assets/img/activity2.png";

const images = [
    { src: banner, text: "Think of giving not as a duty, but as a privilege." },
    { src: activity1, text: "Lose yourself in the service of others." },
    { src: activity2, text: "No act of kindness, no matter how small, is ever wasted." },
];

const Registration = () => {
    const navigate = useNavigate();
    const { register } = useContext(AuthContext);
    const [step, setStep] = useState(1);
    const [credentials, setCredentials] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        contactNumber: "",
        block: "",
        lot: "",
        street: "",
        subdivision: "",
        barangay: "",
        city: "",
        province: "",
        code: "",
        username: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [successAlert, setSuccessAlert] = useState(false);


    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (credentials.password !== credentials.confirmPassword) {
            setErrors({
                ...errors,
                confirmPassword: "Passwords do not match",
            });
            return;
        }
        setSubmitting(true);
        try {
            await _post('/register', credentials);
            setSuccessAlert(true);
            setStep(1);
            setCredentials({});
            setErrors({});
        } catch (err) {
            setErrors(err.response?.data?.errors || {});
            toast.error("Registration failed. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const redirectToTlogin = () => {
        navigate("/login");
    };    

    const [currentIndex, setCurrentIndex] = useState(0);
    
    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(interval);
    }, [currentIndex]);

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };

    return (
        <Guest>

            {successAlert && (
                <ConfirmationAlert 
                title="Successful Registration" 
                message="Your have successfully registered, now you can have access to your account, would you like to proceed and login?" 
                isDelete={false} 
                onClose={() => setSuccessAlert(false)} 
                onConfirm={redirectToTlogin}/>
            )}

            <div className="w-full min-h-screen h-auto flex items-center justify-center md:p-5">
                <div className="w-fit md:w-4/6 min-h-[400px] h-auto shadow-sm rounded-xl flex items-start bg-transparent md:bg-white">
                    <div className="hidden lg:block w-[50%] h-full rounded-l-xl">
                        <div className="w-full h-full rounded-l-xl">
                            <div className="relative w-full h-[565px] md:h-auto overflow-hidden rounded-l-xl ">
                                {/* Image and Text */}
                                <div className="relative">
                                    <img
                                        src={images[currentIndex].src}
                                        alt={`Slide ${currentIndex + 1}`}
                                        className="w-[1200px] h-[565px] rounded-l-xl object-cover transition-transform duration-500 ease-in-out"
                                    />
                                    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 rounded-l-xl"></div>
                                    <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center text-white text-xl font-bold text-center px-5">
                                        <p className="poppins-regular">{images[currentIndex].text}</p>
                                    </div>
                                </div>

                                {/* Navigation Buttons */}
                                <button
                                    onClick={prevSlide}
                                    className="absolute left-5 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75"
                                >
                                    ❮
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="absolute right-5 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75"
                                >
                                    ❯
                                </button>

                                {/* Dots Navigation */}
                                <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-2">
                                    {images.map((_, index) => (
                                        <div
                                            key={index}
                                            onClick={() => setCurrentIndex(index)}
                                            className={`w-3 h-2 rounded-full transition-all ${index === currentIndex ? "bg-white" : "bg-gray-400"}`}
                                        ></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full lg:w-[50%] md:bg-white p-5 md:p-10 rounded-xl">
                        <div className="mb-4">
                            <Logo />
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {step === 1 && (
                                <div className="flex flex-col gap-5">
                                    <div className="border-l-4 border-orange-500 pl-2">
                                        <h2 className="text-base font-semibold">Personal Information</h2>
                                        <p className="text-xs">Welcome! Please fill in the details below to create your account.</p>
                                    </div>
                                    <div>
                                        <TextInput 
                                        value={credentials.firstName}
                                        label="First Name" type="text" 
                                        placeholder="First Name" 
                                        name="firstName" 
                                        hasError={Boolean(errors.firstName)} 
                                        onChange={handleChange} required/>
                                        {errors.firstName && <p className="text-red-500 text-[10px]">{errors.firstName}</p>}
                                    </div>

                                    <TextInput 
                                    value={credentials.middleName}
                                    label="Middle Name" 
                                    type="text" 
                                    placeholder="Middle Name" 
                                    name="middleName" 
                                    onChange={handleChange} />

                                    <div>
                                        <TextInput 
                                        value={credentials.lastName}
                                        label="Last Name" 
                                        type="text" 
                                        placeholder="Last Name" 
                                        name="lastName" 
                                        hasError={Boolean(errors.lastName)} 
                                        onChange={handleChange} required/>
                                        {errors.lastName && <p className="text-red-500 text-[11px]">{errors.lastName}</p>}
                                    </div>
                                    <div>
                                        <TextInput 
                                        value={credentials.email}
                                        label="Email Address" 
                                        type="email" 
                                        placeholder="sample@email.com" 
                                        name="email" 
                                        hasError={Boolean(errors.email)} 
                                        onChange={handleChange} required/>
                                        {errors.email && <p className="text-red-500 text-[11px]">{errors.email}</p>}
                                    </div>
                                    <div>
                                        <TextInput 
                                        value={credentials.contactNumber}
                                        label="Contact Number" 
                                        type="number" 
                                        placeholder="0000-000-0000" 
                                        name="contactNumber" 
                                        hasError={Boolean(errors.contactNumber)} 
                                        onChange={handleChange} required/>
                                        {errors.contactNumber && <p className="text-red-500 text-[11px]">{errors.contactNumber}</p>}
                                    </div>
                                    <div>
                                        <button 
                                        type="button" 
                                        onClick={() => setStep(2)} 
                                        className="text-xs py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded w-fit">Next</button>
                                    </div>
                                </div>
                            )}
                            {step === 2 && (
                                <div className="flex flex-col gap-5">
                                    <div className="border-l-4 border-orange-500 pl-2">
                                        <h2 className="text-base font-semibold">Address</h2>
                                        <p className="text-xs">Welcome! Please fill in the details below to create your account.</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <TextInput 
                                        value={credentials.block}
                                        label="Block" 
                                        type="text" 
                                        placeholder="Block" 
                                        name="block" 
                                        onChange={handleChange} />

                                        <TextInput 
                                        value={credentials.lot}
                                        label="Lot" 
                                        type="text" 
                                        placeholder="Lot" 
                                        name="lot" 
                                        onChange={handleChange} />
                                    </div>

                                    <TextInput 
                                    value={credentials.street}
                                    label="Street" 
                                    type="text" 
                                    placeholder="Street" 
                                    name="street" 
                                    onChange={handleChange} />
                                    
                                    <div className="flex items-start gap-3">
                                        <TextInput 
                                        value={credentials.subdivision}
                                        label="Subdivision" 
                                        type="text" 
                                        placeholder="Subdivision" 
                                        name="subdivision" 
                                        onChange={handleChange} />

                                        <TextInput 
                                        value={credentials.barangay}
                                        label="Barangay" 
                                        type="text" 
                                        placeholder="Barangay" 
                                        name="barangay" 
                                        onChange={handleChange} required/>
                                    </div>

                                    <TextInput 
                                    value={credentials.city}
                                    label="City/Municipality" 
                                    type="text" 
                                    placeholder="City/Municipality" 
                                    name="city" 
                                    onChange={handleChange} required/>

                                    <div className="flex items-start gap-3">
                                        <TextInput 
                                        value={credentials.province}
                                        label="Province" 
                                        type="text" 
                                        placeholder="Province" 
                                        name="province" 
                                        onChange={handleChange} required/>

                                        <TextInput 
                                        value={credentials.code}
                                        label="Postal Code" 
                                        type="number" 
                                        placeholder="Postal Code" 
                                        name="code" 
                                        onChange={handleChange} required/>
                                    </div>

                                    <div className="flex gap-2">
                                        <button 
                                        type="button" 
                                        onClick={() => setStep(1)} 
                                        className="text-xs py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded w-fit">Back</button>

                                        <button 
                                        type="button" 
                                        onClick={() => setStep(3)} 
                                        className="text-xs py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded w-fit">Next</button>
                                    </div>
                                </div>
                            )}
                            {step === 3 && (
                                <div className="flex flex-col gap-5">
                                    <div className="border-l-4 border-orange-500 pl-2">
                                        <h2 className="text-base font-semibold">Login Credentials</h2>
                                        <p className="text-xs">Welcome! Please fill in the details below to create your account.</p>
                                    </div>
                                    <div>
                                        <TextInput 
                                        value={credentials.username}
                                        label="Username" 
                                        type="text" 
                                        placeholder="Username" 
                                        name="username" 
                                        hasError={Boolean(errors.username)} 
                                        onChange={handleChange} required/>
                                        {errors.username && <p className="text-red-500 text-[11px]">{errors.username}</p>}
                                    </div>
                                    <div>
                                        <TextInput 
                                        value={credentials.password}
                                        label="Password" 
                                        type="password" 
                                        placeholder="Password" 
                                        name="password" 
                                        hasError={Boolean(errors.username)} 
                                        onChange={handleChange} required/>
                                        {errors.password && <p className="text-red-500 text-[11px]">{errors.password}</p>}
                                    </div>
                                    <div>
                                        <TextInput 
                                        value={credentials.confirmPassword}
                                        label="Confirm Password" 
                                        type="password" 
                                        placeholder="Confirm Password" 
                                        name="confirmPassword" 
                                        hasError={Boolean(errors.confirmPassword)} 
                                        onChange={handleChange} required/>
                                        {errors.confirmPassword && <p className="text-red-500 text-[11px]">{errors.confirmPassword}</p>}
                                    </div>
                                    <div className="flex gap-2">
                                        <button type="button" onClick={() => setStep(2)} className="text-xs py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded w-fit">Back</button>
                                        <button type="submit" className="text-xs py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded w-fit" disabled={submitting}>{submitting ? "Registering..." : "Register"}</button>
                                    </div>
                                </div>
                                
                            )}
                        </form>
                        <p className="mt-4 text-xs font-light text-gray-500 dark:text-gray-400">
                            Already have an account? <Link to="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </Guest>
    );
};

export default Registration;

